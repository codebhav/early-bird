import time
from datetime import datetime, timedelta
import jwt
from flask import current_app
from itsdangerous import URLSafeTimedSerializer
from models import User, db

def generate_magic_link(email):
    """Generate a magic link for the given email"""
    # Create a serializer with the app's secret key
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    
    # Create the token
    token = serializer.dumps(email, salt=current_app.config['SECURITY_PASSWORD_SALT'])
    
    # Construct the magic link URL
    magic_link = f"{current_app.config['FRONTEND_URL']}/auth/verify?token={token}"
    
    return token, magic_link

def verify_magic_link(token, expiration=86400):  # Default to 24 hours
    """Verify the magic link token"""
    serializer = URLSafeTimedSerializer(current_app.config['SECRET_KEY'])
    
    try:
        # Get the email from the token
        email = serializer.loads(
            token,
            salt=current_app.config['SECURITY_PASSWORD_SALT'],
            max_age=expiration
        )
        
        # Find or create the user
        user = User.query.filter_by(email=email).first()
        
        if not user:
            # Create new user if they don't exist
            user = User(email=email, name=email.split('@')[0])
            db.session.add(user)
        
        # Update last login time
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate JWT token for authentication
        access_token = generate_auth_token(user.id)
        
        return True, user, access_token
    
    except Exception as e:
        print(f"Error verifying magic link: {e}")
        return False, None, None

def generate_auth_token(user_id):
    """Generate a JWT token for authentication"""
    payload = {
        'exp': datetime.utcnow() + current_app.config['JWT_ACCESS_TOKEN_EXPIRES'],
        'iat': datetime.utcnow(),
        'sub': user_id
    }
    
    return jwt.encode(
        payload,
        current_app.config['JWT_SECRET_KEY'],
        algorithm='HS256'
    )

def get_token_identity(token):
    """Extract the user ID from the JWT token"""
    try:
        payload = jwt.decode(token, current_app.config['JWT_SECRET_KEY'], algorithms=['HS256'])
        return payload['sub']
    except jwt.ExpiredSignatureError:
        return None  # Token has expired
    except jwt.InvalidTokenError:
        return None  # Invalid token