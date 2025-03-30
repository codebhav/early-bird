# Import services here
from .auth_service import generate_magic_link, verify_magic_link, get_token_identity
from .email_service import send_magic_link_email
from .coins_service import calculate_quack_coins