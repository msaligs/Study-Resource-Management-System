from application.models import db,Role
from main import app
from application.sec import datastore
from flask_security.utils import hash_password
# from passlib.hash import bcrypt
from werkzeug.security import generate_password_hash

with app.app_context():
    db.drop_all()
    db.create_all()

    datastore.find_or_create_role(name='admin', description="user is a new admin")
    datastore.find_or_create_role(name='inst', description="user is a instructor")
    datastore.find_or_create_role(name='stud', description="user is a normal user")
    db.session.commit()

    if not datastore.find_user(email="admin1@email.com"):
        datastore.create_user(username="Admin", email="admin1@email.com", password=generate_password_hash("admin1"), roles=["admin"])
        # datastore.create_user(username="Admin", email="admin1@email.com", password="admin1", roles=["admin"])
        
    if not datastore.find_user(email="inst1@email.com"):
        datastore.create_user(username="Inst1", email="inst1@email.com", password=generate_password_hash("inst1"), roles=["inst"],active=False)
        # datastore.create_user(username="Inst1", email="inst1@email.com", password="inst1", roles=["inst","stud"],active=False)

    if not datastore.find_user(email="stud1@email.com"):
        datastore.create_user(username="stud1", email="stud1@email.com", password=generate_password_hash("stud1"), roles=["stud"])
        # datastore.create_user(username="stud1", email="stud1@email.com", password="stud1", roles=["stud"])
    
    db.session.commit()

