from flask import request, jsonify, g
from datetime import datetime
from models import Assignment, db
from routes.auth import token_required
from . import assignments_bp

@assignments_bp.route('', methods=['GET'])
@token_required
def get_assignments():
    """Get all assignments for the current user"""
    current_user = g.current_user
    
    # Query assignments for the current user
    assignments = Assignment.query.filter_by(user_id=current_user.id).all()
    
    # Convert to dictionaries for JSON response
    assignments_data = [assignment.to_dict() for assignment in assignments]
    
    return jsonify({
        'assignments': assignments_data
    }), 200

@assignments_bp.route('', methods=['POST'])
@token_required
def create_assignment():
    """Create a new assignment"""
    current_user = g.current_user
    data = request.get_json()
    
    # Validate required fields
    required_fields = ['title', 'deadline']
    for field in required_fields:
        if field not in data:
            return jsonify({'error': f'{field} is required!'}), 400
    
    try:
        # Parse dates from ISO format
        start_date = datetime.fromisoformat(data.get('startDate')) if data.get('startDate') else datetime.utcnow()
        deadline = datetime.fromisoformat(data.get('deadline'))
        
        # Create new assignment
        new_assignment = Assignment(
            user_id=current_user.id,
            title=data.get('title'),
            description=data.get('description', ''),
            course=data.get('course', ''),
            start_date=start_date,
            deadline=deadline,
            estimated_hours=float(data.get('estimatedHours', 1.0)),
            coins_reward=int(data.get('coinsReward', 10))
        )
        
        db.session.add(new_assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment created successfully!',
            'assignment': new_assignment.to_dict()
        }), 201
        
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to create assignment: {str(e)}'}), 500

@assignments_bp.route('/<int:assignment_id>', methods=['GET'])
@token_required
def get_assignment(assignment_id):
    """Get a specific assignment"""
    current_user = g.current_user
    
    # Query assignment by ID and user ID for security
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({'error': 'Assignment not found!'}), 404
    
    return jsonify({
        'assignment': assignment.to_dict()
    }), 200

@assignments_bp.route('/<int:assignment_id>', methods=['PUT'])
@token_required
def update_assignment(assignment_id):
    """Update an assignment"""
    current_user = g.current_user
    data = request.get_json()
    
    # Query assignment by ID and user ID for security
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({'error': 'Assignment not found!'}), 404
    
    try:
        # Update fields if provided
        if 'title' in data:
            assignment.title = data['title']
        
        if 'description' in data:
            assignment.description = data['description']
        
        if 'course' in data:
            assignment.course = data['course']
        
        if 'startDate' in data:
            assignment.start_date = datetime.fromisoformat(data['startDate'])
        
        if 'deadline' in data:
            assignment.deadline = datetime.fromisoformat(data['deadline'])
        
        if 'estimatedHours' in data:
            assignment.estimated_hours = float(data['estimatedHours'])
        
        if 'coinsReward' in data:
            assignment.coins_reward = int(data['coinsReward'])
        
        if 'completed' in data:
            was_completed = assignment.completed
            assignment.completed = data['completed']
            
            # If marking as completed for the first time
            if data['completed'] and not was_completed:
                earned_coins = assignment.complete()
                
                return jsonify({
                    'message': f'Assignment completed! Earned {earned_coins} QuackCoins!',
                    'assignment': assignment.to_dict(),
                    'earnedCoins': earned_coins
                }), 200
        
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment updated successfully!',
            'assignment': assignment.to_dict()
        }), 200
        
    except ValueError as e:
        return jsonify({'error': f'Invalid date format: {str(e)}'}), 400
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update assignment: {str(e)}'}), 500

@assignments_bp.route('/<int:assignment_id>', methods=['DELETE'])
@token_required
def delete_assignment(assignment_id):
    """Delete an assignment"""
    current_user = g.current_user
    
    # Query assignment by ID and user ID for security
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({'error': 'Assignment not found!'}), 404
    
    try:
        db.session.delete(assignment)
        db.session.commit()
        
        return jsonify({
            'message': 'Assignment deleted successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to delete assignment: {str(e)}'}), 500

@assignments_bp.route('/<int:assignment_id>/complete', methods=['POST'])
@token_required
def complete_assignment(assignment_id):
    """Mark an assignment as complete"""
    current_user = g.current_user
    
    # Query assignment by ID and user ID for security
    assignment = Assignment.query.filter_by(id=assignment_id, user_id=current_user.id).first()
    
    if not assignment:
        return jsonify({'error': 'Assignment not found!'}), 404
    
    if assignment.completed:
        return jsonify({'error': 'Assignment is already completed!'}), 400
    
    try:
        earned_coins = assignment.complete()
        db.session.commit()
        
        return jsonify({
            'message': f'Assignment completed! Earned {earned_coins} QuackCoins!',
            'assignment': assignment.to_dict(),
            'earnedCoins': earned_coins
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to complete assignment: {str(e)}'}), 500