import smtplib
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from flask import current_app

def send_email(to_email, subject, html_content, text_content=None):
    """Send an email using the configured mail server"""
    # Create message container
    msg = MIMEMultipart('alternative')
    msg['Subject'] = subject
    msg['From'] = current_app.config['MAIL_DEFAULT_SENDER']
    msg['To'] = to_email
    
    # Add plain text version if provided
    if text_content:
        msg.attach(MIMEText(text_content, 'plain'))
    
    # Add HTML version
    msg.attach(MIMEText(html_content, 'html'))
    
    try:
        # Connect to mail server
        server = smtplib.SMTP(
            current_app.config['MAIL_SERVER'], 
            current_app.config['MAIL_PORT']
        )
        
        if current_app.config['MAIL_USE_TLS']:
            server.starttls()
        
        # Login if credentials provided
        if current_app.config['MAIL_USERNAME'] and current_app.config['MAIL_PASSWORD']:
            server.login(
                current_app.config['MAIL_USERNAME'], 
                current_app.config['MAIL_PASSWORD']
            )
        
        # Send email
        server.sendmail(
            current_app.config['MAIL_DEFAULT_SENDER'],
            to_email,
            msg.as_string()
        )
        server.quit()
        
        return True
    except Exception as e:
        print(f"Error sending email: {e}")
        return False

def send_magic_link_email(email, magic_link):
    """Send a magic link email for authentication"""
    subject = "Your Early Bird Login Link"
    
    html_content = f"""
    <html>
    <head>
        <style>
            body {{
                font-family: Arial, sans-serif;
                line-height: 1.6;
                color: #333;
            }}
            .container {{
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                border: 1px solid #eee;
                border-radius: 5px;
            }}
            .header {{
                text-align: center;
                margin-bottom: 20px;
            }}
            .button {{
                display: inline-block;
                background-color: #4F46E5;
                color: white;
                text-decoration: none;
                padding: 10px 20px;
                border-radius: 5px;
                margin: 20px 0;
            }}
            .footer {{
                margin-top: 30px;
                font-size: 12px;
                color: #666;
            }}
        </style>
    </head>
    <body>
        <div class="container">
            <div class="header">
                <h1>Welcome to Early Bird</h1>
            </div>
            <p>Hello,</p>
            <p>You requested a magic link to sign in to your Early Bird account. Click the button below to sign in:</p>
            <p style="text-align: center;">
                <a href="{magic_link}" class="button">Sign In to Early Bird</a>
            </p>
            <p>If you didn't request this link, you can safely ignore this email.</p>
            <p>This link will expire in 15 minutes and can only be used once.</p>
            <div class="footer">
                <p>Early Bird - Start assignments early, earn rewards!</p>
            </div>
        </div>
    </body>
    </html>
    """
    
    text_content = f"""
    Welcome to Early Bird!
    
    You requested a magic link to sign in to your Early Bird account.
    Click the link below to sign in:
    
    {magic_link}
    
    If you didn't request this link, you can safely ignore this email.
    This link will expire in 15 minutes and can only be used once.
    
    Early Bird - Start assignments early, earn rewards!
    """
    
    return send_email(email, subject, html_content, text_content)