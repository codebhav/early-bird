from datetime import datetime
from sqlalchemy import Column, Integer, String, Boolean, Text, JSON, DateTime
from sqlalchemy.orm import relationship
from . import db

class User(db.Model):
    """User model for storing user related data"""
    __tablename__ = 'users'

    id = Column(Integer, primary_key=True)
    email = Column(String(120), unique=True, nullable=False)
    name = Column(String(120), nullable=True)
    avatar = Column(String(500), nullable=True, default='/avatar-placeholder.png')
    quack_coins = Column(Integer, default=0)
    major = Column(String(100), nullable=True)
    year = Column(String(50), nullable=True)
    bio = Column(Text, nullable=True)
    
    # User preferences stored as JSON
    preferences = Column(JSON, default={
        "emailNotifications": True,
        "reminderTime": 3,
        "darkMode": False
    })
    
    # User stats
    completed_assignments = Column(Integer, default=0)
    early_completion_count = Column(Integer, default=0)
    total_time_saved = Column(Integer, default=0)  # In hours
    
    # Timestamps
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    last_login = Column(DateTime, nullable=True)
    
    # Relationships
    assignments = relationship('Assignment', back_populates='user', cascade='all, delete-orphan')
    
    # For friendships, we need to handle both directions
    sent_friendships = relationship(
        'Friendship',
        foreign_keys='Friendship.sender_id',
        back_populates='sender',
        cascade='all, delete-orphan'
    )
    
    received_friendships = relationship(
        'Friendship',
        foreign_keys='Friendship.receiver_id',
        back_populates='receiver',
        cascade='all, delete-orphan'
    )
    
    def __repr__(self):
        return f'<User {self.email}>'
    
    def to_dict(self):
        """Convert user object to dictionary for API responses"""
        return {
            'id': self.id,
            'email': self.email,
            'name': self.name,
            'avatar': self.avatar,
            'quackCoins': self.quack_coins,
            'major': self.major,
            'year': self.year,
            'bio': self.bio,
            'preferences': self.preferences,
            'stats': {
                'completed': self.completed_assignments,
                'earlyRate': self.calculate_early_rate(),
                'avgTime': self.calculate_avg_time(),
                'comparison': self.generate_comparison()
            },
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def calculate_early_rate(self):
        """Calculate percentage of assignments completed early"""
        if self.completed_assignments == 0:
            return 0
        return int((self.early_completion_count / self.completed_assignments) * 100)
    
    def calculate_avg_time(self):
        """Calculate average time to complete assignments (in days)"""
        completed_assignments = [a for a in self.assignments if a.completed]
        if not completed_assignments:
            return 0
            
        total_days = sum((a.completed_date - a.start_date).days for a in completed_assignments if a.completed_date)
        return round(total_days / len(completed_assignments), 1)
    
    def generate_comparison(self):
        """Generate a comparison string for the leaderboard"""
        if self.completed_assignments < 3:
            return "Just getting started"
        
        if self.calculate_early_rate() > 80:
            return f"Completes assignments {self.calculate_early_rate() - 50}% faster than average"
        elif self.early_completion_count > 5:
            return f"Earned {self.quack_coins} QuackCoins from early completions"
        else:
            return f"Completed {self.completed_assignments} assignments"
    
    @property
    def friends(self):
        """Get all confirmed friends"""
        from .friendship import FriendshipStatus, Friendship
        
        sent_friends = User.query.join(
            Friendship, User.id == Friendship.receiver_id
        ).filter(
            Friendship.sender_id == self.id,
            Friendship.status == FriendshipStatus.ACCEPTED
        ).all()
        
        received_friends = User.query.join(
            Friendship, User.id == Friendship.sender_id
        ).filter(
            Friendship.receiver_id == self.id,
            Friendship.status == FriendshipStatus.ACCEPTED
        ).all()
        
        return list(set(sent_friends + received_friends))
    
    @property
    def pending_sent_requests(self):
        """Get all pending friend requests sent by this user"""
        from .friendship import FriendshipStatus
        
        return User.query.join(
            Friendship, User.id == Friendship.receiver_id
        ).filter(
            Friendship.sender_id == self.id,
            Friendship.status == FriendshipStatus.PENDING
        ).all()
    
    @property
    def pending_received_requests(self):
        """Get all pending friend requests received by this user"""
        from .friendship import FriendshipStatus
        
        return User.query.join(
            Friendship, User.id == Friendship.sender_id
        ).filter(
            Friendship.receiver_id == self.id,
            Friendship.status == FriendshipStatus.PENDING
        ).all()