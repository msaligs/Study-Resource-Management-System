class Config(object):
    DEBUG = False
    TESTING = False
    
class DevelopmentConfig(Config):
    DEBUG = True 
    SQLALCHEMY_DATABASE_URI='sqlite:///dev.db'
    
    SECURITY_KEY= "msaligs"
    SECURITY_PASSWORD_SALT = "saltingisgood"
    SQLALCHEMY_TRACK_MODIFICATION = False
    WTF_CSRF_ENABLED = False
    SECURITY_TOKEN_AUTHENTICATION_HEADER = "authentication-Token"

    
 