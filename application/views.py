from flask import current_app as app, jsonify, request, render_template,Response,send_file
from flask_security import auth_required, roles_required
from application.models import db,User,StudyResource
from application.sec import datastore
from werkzeug.security import check_password_hash, generate_password_hash
from flask_restful import marshal, fields
import flask_excel as excel
from celery.result import AsyncResult
from .task import sayHello,create_resource_csv


@app.get('/')
def home():
    return render_template("index.html")

@app.get('/admin')
@auth_required('token')
@roles_required('admin')
def admin():
    return "welcome admin"


@app.get('/activate/inst/<int:id>')
@auth_required("token")
@roles_required('admin')
def activate_inst(id):
    inst = User.query.get(id)
    if not inst or 'inst' not in inst.roles:
        return jsonify({"message":"Instructor not found"}), 404
    inst.active = True
    db.session.commit()
    return jsonify({"message":"Instructor is activated"})



@app.post('/user-login')
def user_login():
    data = request.get_json()
    email = data.get("email")
    if not email:
        return jsonify({"message":"email not provides"})
    
    user =  datastore.find_user(email=email)
    if not user:
        return jsonify({"message":"User not found"}),404
    if check_password_hash(user.password, data.get("password")):
        return jsonify({
            "id":user.id,
            "roles":[ role.name for role in user.roles],
            "email":user.email,
            "token": user.get_auth_token()
        })
    else:
        return jsonify({"message":"Wrong password"}), 404
    
@app.post('/user-register')
def user_register():
    data = request.get_json()

    username = data.get('username')
    if not username:
        return jsonify({"message":"Username Not Provided"}), 404
    user = datastore.find_user(username = username)
    if user:
        return jsonify({"message":"Username already Exist"}), 404

    email = data.get('email')
    if not email:
        return jsonify({"message":"Email Address Not Provided"}), 404
    
    user = datastore.find_user(email = email)
    if user:
        return jsonify({"message":"Email already Exist"}), 404
    
    
    password = data.get('password')
    if not password:
        return jsonify({"message":"Password Not Provided"}), 404
    
    roles = data.get('role')
    if not roles:
        return jsonify({"message":"Role Not Provided"}), 404
    if roles not in ('stud','inst'):
        return jsonify({"message":"Role does not exist"}), 404
    
    active = roles == 'stud'

    cred = {
        "username":username,
        "email":email,
        "password":generate_password_hash(password),
        "roles":[roles],
        "active":active
    }
    datastore.create_user(**cred)

    try:
        db.session.commit()
        return jsonify({"message":"User Created successfully"}), 201
    except:
        return jsonify({"message":"Something went wrong! Please try again."}), 404


user_fields= {
    'id':fields.Integer,
    'username':fields.String,
    'email':fields.String,
    'active':fields.Boolean,
    'roles':fields.String
}

@app.get('/users')
@auth_required('token')
@roles_required('admin')
def all_users():
    users = User.query.all()
    if len(users) == 0:
        return jsonify({"message":"No user found"})
    
    user_data = [
        {
            'id': user.id,
            'username': user.username,
            'email': user.email,
            'active': user.active,
            'roles': user.roles[0].name
            # 'roles': [role.name for role in user.roles]
        }
        for user in users
    ]
    return marshal( user_data,user_fields)


@app.get('/sayhello')
def sayhello():
    t = sayHello.delay()
    return jsonify({"message":t.id})


@app.get('/download-csv')
def download_csv():
    task = create_resource_csv.delay()
    return jsonify({"task_id":task.id})

@app.get('/get-csv/<task_id>')
def get_csv(task_id):
    task = AsyncResult(task_id)
    filename = task.result
    # if task.state == 'SUCCESS':
    #     return Response(task.get(),mimetype='text/csv')
    if task.ready():
        return send_file(filename,as_attachment=True)
    else:
        return jsonify({"message":"Task still in progress"}), 202