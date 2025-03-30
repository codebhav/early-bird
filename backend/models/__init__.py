from flask_sqlalchemy import SQLAlchemy
from datetime import datetime

db = SQLAlchemy()

# Import all models here to make them available when importing the db
from .user import User
from .assignment import Assignment
from .friendship import Friendship, FriendshipStatus