import math
from datetime import datetime

def calculate_quack_coins(assignment, completion_date):
    """
    Calculate the QuackCoins earned for completing an assignment
    This matches the algorithm in the frontend mockData.js but is implemented server-side
    """
    if not assignment:
        return 0

    # Base reward for completing the assignment
    coins = assignment.coins_reward

    # Calculate total available time (in days)
    total_days = (assignment.deadline - assignment.start_date).days
    if total_days <= 0:
        total_days = 1  # Avoid division by zero

    # Calculate how many days before the deadline it was completed
    days_before_deadline = (assignment.deadline - completion_date).days
    if days_before_deadline < 0:
        days_before_deadline = 0  # Late completion gets no bonus

    # Calculate time used as a percentage of total time
    time_used_percentage = 1 - (days_before_deadline / total_days)

    # Early completion bonus: more coins the earlier it's completed
    early_bonus = 0

    if time_used_percentage <= 0.25:
        # Maximum bonus (50% of base reward) if completed in first quarter of time
        early_bonus = assignment.coins_reward * 0.5
    elif time_used_percentage <= 0.5:
        # 30% bonus if completed in first half
        early_bonus = assignment.coins_reward * 0.3
    elif time_used_percentage <= 0.75:
        # 15% bonus if completed in third quarter
        early_bonus = assignment.coins_reward * 0.15
    else:
        # 5% bonus if completed in last quarter but before deadline
        early_bonus = assignment.coins_reward * 0.05

    # Round the earlyBonus to nearest integer
    early_bonus = round(early_bonus)

    # Total coins = base reward + early completion bonus
    return coins + early_bonus

def calculate_user_ranking(users):
    """
    Calculate ranking for users based on QuackCoins
    This matches the algorithm in the frontend but is implemented server-side
    """
    if not users or len(users) == 0:
        return []

    # First, sort by QuackCoins (highest first)
    sorted_users = sorted(users, key=lambda user: user.quack_coins, reverse=True)

    # Add ranking information
    return [{"user": user, "rank": index + 1} for index, user in enumerate(sorted_users)]