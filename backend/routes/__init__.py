from flask import Blueprint

# Create blueprints for different route groups
auth_bp = Blueprint('auth', __name__, url_prefix='/api/auth')
assignments_bp = Blueprint('assignments', __name__, url_prefix='/api/assignments')
users_bp = Blueprint('users', __name__, url_prefix='/api/users')
friends_bp = Blueprint('friends', __name__, url_prefix='/api/friends')

# Import routes to register them with blueprints
from .auth import *
from .assignments import *
from .users import *
from .friendships import *

def register_routes(app):
    """Register all route blueprints with the Flask app"""
    app.register_blueprint(auth_bp)
    app.register_blueprint(assignments_bp)
    app.register_blueprint(users_bp)
    app.register_blueprint(friends_bp)