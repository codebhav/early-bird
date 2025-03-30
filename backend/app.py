from flask import Flask
from flask_cors import CORS
import os
import sys
# Add the parent directory to sys.path
sys.path.insert(0, os.path.abspath(os.path.dirname(__file__)))

from config import get_config
from models import db
from routes import register_routes

def create_app(config=None):
    """Initialize the Flask application"""
    app = Flask(__name__)
    
    # Load configuration
    if config is None:
        app.config.from_object(get_config())
    else:
        app.config.from_object(config)
    
    # Set up CORS
    CORS(app, resources={r"/api/*": {"origins": app.config['CORS_ORIGINS'], "supports_credentials": True}})
    
    # Initialize extensions
    db.init_app(app)
    
    # Register API routes
    register_routes(app)
    
    # Create database tables
    with app.app_context():
        db.create_all()
    
    return app

if __name__ == '__main__':
    app = create_app()
    port = int(os.environ.get('PORT', 5000))
    app.run(host='0.0.0.0', port=port)