from flask import request, jsonify, g, current_app
from flask_cors import cross_origin
from functools import wraps
import jwt
from email_validator import validate_email, EmailNotValidError

from models import User, db
from services.auth_service import generate_magic_link, verify_magic_link, get_token_identity
from services.email_service import send_magic_link_email
from . import auth_bp

def token_required(f):
    """Decorator to require JWT token for authentication"""
    @wraps(f)
    def decorated(*args, **kwargs):
        token = None
        auth_header = request.headers.get('Authorization')
        
        if auth_header and auth_header.startswith('Bearer '):
            token = auth_header.split(' ')[1]
        
        if not token:
            return jsonify({'error': 'Authentication token is missing!'}), 401
        
        try:
            user_id = get_token_identity(token)
            
            if not user_id:
                return jsonify({'error': 'Invalid authentication token!'}), 401
                
            current_user = User.query.get(user_id)
            
            if not current_user:
                return jsonify({'error': 'User not found!'}), 401
                
            g.current_user = current_user
        except Exception as e:
            return jsonify({'error': f'Error authenticating token: {str(e)}'}), 401
            
        return f(*args, **kwargs)
    
    return decorated

@auth_bp.route('/login', methods=['POST'])
def login():
    """Send magic link for authentication"""
    data = request.get_json()
    
    if not data or not data.get('email'):
        return jsonify({'error': 'Email is required!'}), 400
        
    email = data.get('email')
    
    # Validate email
    try:
        validate_email(email)
    except EmailNotValidError as e:
        return jsonify({'error': f'Invalid email: {str(e)}'}), 400
    
    # Generate magic link
    token, magic_link = generate_magic_link(email)
    
    # Send magic link via email
    success = send_magic_link_email(email, magic_link)
    
    if success:
        return jsonify({
            'message': 'Magic link sent successfully!',
            'email': email,
            # Only in development mode, return the token for testing
            'token': token if current_app.config['DEBUG'] else None
        }), 200
    else:
        return jsonify({'error': 'Failed to send magic link. Please try again later.'}), 500

@auth_bp.route('/verify', methods=['GET'])
def verify():
    """Verify magic link token"""
    token = request.args.get('token')
    
    if not token:
        return jsonify({'error': 'Token is required!'}), 400
        
    # Verify token
    success, user, access_token = verify_magic_link(token)
    
    if success and user:
        return jsonify({
            'message': 'Authentication successful!',
            'token': access_token,
            'user': user.to_dict()
        }), 200
    else:
        return jsonify({'error': 'Invalid or expired token!'}), 401

@auth_bp.route('/me', methods=['GET'])
@token_required
def get_current_user():
    """Get current authenticated user"""
    current_user = g.current_user
    
    return jsonify({
        'user': current_user.to_dict()
    }), 200

@auth_bp.route('/logout', methods=['POST'])
@token_required
def logout():
    """Logout current user (client-side only, no server-side session)"""
    # Since we're using JWT tokens, logout is handled client-side
    # by removing the token from storage
    return jsonify({
        'message': 'Successfully logged out!'
    }), 200