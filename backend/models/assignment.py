from datetime import datetime, timedelta
from sqlalchemy import Column, Integer, String, Text, Boolean, DateTime, ForeignKey, Float
from sqlalchemy.orm import relationship
from . import db

class Assignment(db.Model):
    """Assignment model for storing assignment related data"""
    __tablename__ = 'assignments'

    id = Column(Integer, primary_key=True)
    user_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    title = Column(String(200), nullable=False)
    description = Column(Text, nullable=True)
    course = Column(String(100), nullable=True)
    
    start_date = Column(DateTime, nullable=False, default=datetime.utcnow)
    deadline = Column(DateTime, nullable=False)
    
    estimated_hours = Column(Float, default=1.0)
    coins_reward = Column(Integer, default=10)
    
    completed = Column(Boolean, default=False)
    completed_date = Column(DateTime, nullable=True)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationship
    user = relationship('User', back_populates='assignments')
    
    def __repr__(self):
        return f'<Assignment {self.title}>'
    
    def to_dict(self):
        """Convert assignment object to dictionary for API responses"""
        return {
            'id': self.id,
            'title': self.title,
            'description': self.description,
            'course': self.course,
            'startDate': self.start_date.isoformat() if self.start_date else None,
            'deadline': self.deadline.isoformat() if self.deadline else None,
            'estimatedHours': self.estimated_hours,
            'coinsReward': self.coins_reward,
            'completed': self.completed,
            'completedDate': self.completed_date.isoformat() if self.completed_date else None,
            'createdAt': self.created_at.isoformat() if self.created_at else None
        }
    
    def complete(self):
        """Mark assignment as completed and return earned coins"""
        from services.coins_service import calculate_quack_coins
        
        if not self.completed:
            self.completed = True
            self.completed_date = datetime.utcnow()
            
            # Calculate earned coins
            earned_coins = calculate_quack_coins(self, self.completed_date)
            
            # Update user statistics
            user = self.user
            user.quack_coins += earned_coins
            user.completed_assignments += 1
            
            # Check if completed early
            if self.completed_date < self.deadline:
                user.early_completion_count += 1
                
                # Calculate time saved (in hours)
                time_saved = (self.deadline - self.completed_date).total_seconds() / 3600  # Convert to hours
                user.total_time_saved += round(time_saved)
            
            return earned_coins
        
        return 0