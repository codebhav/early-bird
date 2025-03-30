from flask import request, jsonify, g
from email_validator import validate_email, EmailNotValidError
from models import User, Friendship, FriendshipStatus, db
from routes.auth import token_required
from services.coins_service import calculate_user_ranking
from . import friends_bp

@friends_bp.route('', methods=['GET'])
@token_required
def get_friends():
    """Get user's friends"""
    current_user = g.current_user
    
    # Get confirmed friends
    friends = current_user.friends
    friends_data = [user.to_dict() for user in friends]
    
    # Apply ranking
    ranked_friends = calculate_user_ranking(friends)
    
    # Format response with ranking
    ranked_data = []
    for entry in ranked_friends:
        user_dict = entry["user"].to_dict()
        user_dict["rank"] = entry["rank"]
        ranked_data.append(user_dict)
    
    # Get pending friend requests (sent and received)
    pending_sent = current_user.pending_sent_requests
    pending_sent_data = [user.to_dict() for user in pending_sent]
    
    pending_received = current_user.pending_received_requests
    pending_received_data = [user.to_dict() for user in pending_received]
    
    return jsonify({
        'friends': ranked_data,
        'pendingSent': pending_sent_data,
        'pendingReceived': pending_received_data
    }), 200

@friends_bp.route('/invite', methods=['POST'])
@token_required
def invite_friend():
    """Send a friend invitation"""
    current_user = g.current_user
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required!'}), 400
        
    friend_email = data.get('email')
    
    # Validate email
    try:
        validate_email(friend_email)
    except EmailNotValidError as e:
        return jsonify({'error': f'Invalid email: {str(e)}'}), 400
    
    # Check if trying to add self
    if friend_email == current_user.email:
        return jsonify({'error': 'You cannot add yourself as a friend!'}), 400
        
    # Find the friend user
    friend = User.query.filter_by(email=friend_email).first()
    
    if not friend:
        # Create a placeholder user account
        friend = User(
            email=friend_email,
            name=friend_email.split('@')[0]  # Use email username as display name
        )
        db.session.add(friend)
        db.session.flush()  # Get ID without committing
    
    # Check if friendship already exists
    existing_friendship = Friendship.query.filter(
        ((Friendship.sender_id == current_user.id) & (Friendship.receiver_id == friend.id)) |
        ((Friendship.sender_id == friend.id) & (Friendship.receiver_id == current_user.id))
    ).first()
    
    if existing_friendship:
        if existing_friendship.status == FriendshipStatus.ACCEPTED:
            return jsonify({'error': 'You are already friends with this user!'}), 400
        elif existing_friendship.status == FriendshipStatus.PENDING:
            if existing_friendship.sender_id == current_user.id:
                return jsonify({'error': 'You have already sent a friend request to this user!'}), 400
            else:
                # This user already sent us a request, so accept it
                existing_friendship.status = FriendshipStatus.ACCEPTED
                db.session.commit()
                
                return jsonify({
                    'message': 'Friend request accepted!',
                    'friendship': existing_friendship.to_dict()
                }), 200
    
    # Create new friendship request
    new_friendship = Friendship(
        sender_id=current_user.id,
        receiver_id=friend.id,
        status=FriendshipStatus.PENDING
    )
    
    try:
        db.session.add(new_friendship)
        db.session.commit()
        
        return jsonify({
            'message': 'Friend request sent successfully!',
            'friendship': new_friendship.to_dict()
        }), 201
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to send friend request: {str(e)}'}), 500

@friends_bp.route('/accept/<int:user_id>', methods=['POST'])
@token_required
def accept_friend_request(user_id):
    """Accept a friend request"""
    current_user = g.current_user
    
    # Query pending friendship
    friendship = Friendship.query.filter_by(
        sender_id=user_id,
        receiver_id=current_user.id,
        status=FriendshipStatus.PENDING
    ).first()
    
    if not friendship:
        return jsonify({'error': 'Friend request not found!'}), 404
    
    try:
        # Accept the friendship
        friendship.status = FriendshipStatus.ACCEPTED
        db.session.commit()
        
        return jsonify({
            'message': 'Friend request accepted!',
            'friendship': friendship.to_dict()
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to accept friend request: {str(e)}'}), 500

@friends_bp.route('/reject/<int:user_id>', methods=['POST'])
@token_required
def reject_friend_request(user_id):
    """Reject a friend request"""
    current_user = g.current_user
    
    # Query pending friendship
    friendship = Friendship.query.filter_by(
        sender_id=user_id,
        receiver_id=current_user.id,
        status=FriendshipStatus.PENDING
    ).first()
    
    if not friendship:
        return jsonify({'error': 'Friend request not found!'}), 404
    
    try:
        # Reject the friendship
        friendship.status = FriendshipStatus.REJECTED
        db.session.commit()
        
        return jsonify({
            'message': 'Friend request rejected!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to reject friend request: {str(e)}'}), 500

@friends_bp.route('/<int:friend_id>', methods=['DELETE'])
@token_required
def remove_friend(friend_id):
    """Remove a friend"""
    current_user = g.current_user
    
    # Query friendship (in either direction)
    friendship = Friendship.query.filter(
        (
            (Friendship.sender_id == current_user.id) & 
            (Friendship.receiver_id == friend_id)
        ) | (
            (Friendship.sender_id == friend_id) & 
            (Friendship.receiver_id == current_user.id)
        ),
        Friendship.status == FriendshipStatus.ACCEPTED
    ).first()
    
    if not friendship:
        return jsonify({'error': 'Friendship not found!'}), 404
    
    try:
        db.session.delete(friendship)
        db.session.commit()
        
        return jsonify({
            'message': 'Friend removed successfully!'
        }), 200
        
    except Exception as e:
        db.session.rollback()
        return jsonify({'error': f'Failed to remove friend: {str(e)}'}), 500

@friends_bp.route('/leaderboard', methods=['GET'])
@token_required
def get_leaderboard():
    """Get leaderboard of friends by QuackCoins"""
    current_user = g.current_user
    
    # Get friends and add the current user
    all_users = current_user.friends + [current_user]
    
    # Calculate ranking
    ranked_users = calculate_user_ranking(all_users)
    
    # Format response with ranking
    ranked_data = []
    for entry in ranked_users:
        user_dict = entry["user"].to_dict()
        user_dict["rank"] = entry["rank"]
        user_dict["isCurrentUser"] = (entry["user"].id == current_user.id)
        ranked_data.append(user_dict)
    
    return jsonify({
        'leaderboard': ranked_data
    }), 200