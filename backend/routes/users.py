from flask import request, jsonify, g
from models import User, db
from routes.auth import token_required
from . import users_bp

@users_bp.route('/me', methods=['GET'])
@token_required
def get_user_profile():
    """Get current user profile"""
    current_user = g.current_user
    
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@users_bp.route('/me', methods=['PUT'])
@token_required
def update_user_profile():
    """Update current user profile"""
    current_user = g.current_user
    data = request.get_json()
    
    try:
        # Update basic profile fields
        if 'name' in data:
            current_user.name = data['name']
        
        if 'avatar' in data:
            current_user.avatar = data['avatar']
        
        if 'major' in data:
            current_user.major = data['major']
        
        if 'year' in data:
            current_user.year = data['year']
        
        if 'bio' in data:
            current_user.bio = data['bio']
        
        # Update preferences
        if 'preferences' in data:
            preferences = data['preferences']
            
            if not current_user.preferences:
                current_user.preferences = {}
            
            for key, value in preferences.items():
                current_user.preferences[key] = value
        
        db.session.commit()
        
        return jsonify({
            'message': 'Profile updated successfully!',
            'user': current_user.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to update profile: {str(e)}'}), 500

@users_bp.route('/me/stats', methods=['GET'])
@token_required
def get_user_stats():
    """Get user statistics"""
    current_user = g.current_user
    
    # Calculate stats
    total_assignments = len(current_user.assignments)
    completed_assignments = sum(1 for a in current_user.assignments if a.completed)
    completion_rate = (completed_assignments / total_assignments * 100) if total_assignments > 0 else 0
    
    early_completions = sum(1 for a in current_user.assignments 
                            if a.completed and a.completed_date < a.deadline)
    early_rate = (early_completions / completed_assignments * 100) if completed_assignments > 0 else 0
    
    # Calculate average time saved (in days)
    time_saved = 0
    if completed_assignments > 0:
        for a in current_user.assignments:
            if a.completed and a.completed_date < a.deadline:
                time_saved += (a.deadline - a.completed_date).days
    
    avg_time_saved = time_saved / completed_assignments if completed_assignments > 0 else 0
    
    return jsonify({
        'stats': {
            'totalAssignments': total_assignments,
            'completedAssignments': completed_assignments,
            'completionRate': round(completion_rate, 1),
            'earlyCompletions': early_completions,
            'earlyRate': round(early_rate, 1),
            'totalQuackCoins': current_user.quack_coins,
            'avgTimeSaved': round(avg_time_saved, 1)
        }
    }), 200