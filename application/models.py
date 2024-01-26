from flask_sqlalchemy import SQLAlchemy
from flask_security import UserMixin, RoleMixin
db = SQLAlchemy()


class RolesUsers(db.Model):
    __tablename__ = 'roles_users'
    id = db.Column(db.Integer(), autoincrement=True, primary_key=True)
    user_id = db.Column(db.Integer(), db.ForeignKey('user.id'))
    role_id = db.Column(db.Integer(), db.ForeignKey('role.id'))

class User(db.Model, UserMixin):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    username = db.Column(db.String, unique=True)
    email = db.Column(db.String, unique=True)
    password = db.Column(db.String(255))
    active = db.Column(db.Boolean(), default=True)
    fs_uniquifier = db.Column(db.String(255), unique=True, nullable=False)
    
    roles = db.relationship('Role', secondary='roles_users', backref='users')

class Role(db.Model, RoleMixin):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    name = db.Column(db.String(80), unique=True)
    description = db.Column(db.String(255))


class StudyResource(db.Model):
    id = db.Column(db.Integer, autoincrement=True, primary_key=True)
    topic = db.Column(db.String, nullable = False)
    description = db.Column(db.String, nullable = False)
    creator_id = db.Column(db.Integer,db.ForeignKey('user.id'))
    resource_link = db.Column(db.String, nullable = False)
    is_approved = db.Column(db.Boolean(),default=False)

    creater = db.relationship('User',backref="resources")
