from datetime import datetime
from enum import Enum
from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Enum as SQLEnum
from sqlalchemy.orm import relationship
from . import db

class FriendshipStatus(str, Enum):
    """Enum for friendship status"""
    PENDING = 'pending'
    ACCEPTED = 'accepted'
    REJECTED = 'rejected'

class Friendship(db.Model):
    """Friendship model for storing user friendships"""
    __tablename__ = 'friendships'

    id = Column(Integer, primary_key=True)
    sender_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    receiver_id = Column(Integer, ForeignKey('users.id'), nullable=False)
    
    status = Column(SQLEnum(FriendshipStatus), default=FriendshipStatus.PENDING)
    
    created_at = Column(DateTime, default=datetime.utcnow)
    updated_at = Column(DateTime, default=datetime.utcnow, onupdate=datetime.utcnow)
    
    # Relationships
    sender = relationship('User', foreign_keys=[sender_id], back_populates='sent_friendships')
    receiver = relationship('User', foreign_keys=[receiver_id], back_populates='received_friendships')
    
    def __repr__(self):
        return f'<Friendship {self.sender_id}-{self.receiver_id} ({self.status})>'
    
    def to_dict(self):
        """Convert friendship object to dictionary for API responses"""
        return {
            'id': self.id,
            'senderId': self.sender_id,
            'receiverId': self.receiver_id,
            'status': self.status.value,
            'createdAt': self.created_at.isoformat() if self.created_at else None,
            'updatedAt': self.updated_at.isoformat() if self.updated_at else None
        }