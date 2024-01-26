from flask_restful import Resource, Api, reqparse, marshal_with, fields,marshal
from .models import StudyResource, db
from flask_security import auth_required, roles_required, current_user
from flask_login import current_user
from sqlalchemy.orm import joinedload

api = Api(prefix='/api')

def str_to_bool(value):
    return value.lower() in ['true', '1', 'yes']


parser = reqparse.RequestParser()
parser.add_argument('topic', type=str, location='json', help='topic is required and must be of type string')  # Not required for filtering
parser.add_argument('description', type=str, location='json', help='description is required and must be of type string')  # Not required for filtering
parser.add_argument('resource_link', type=str, location='json', help='resource_link is required and must be valid')  # Not required for filtering


parser_get = reqparse.RequestParser()
parser_get.add_argument('is_approved', type=str_to_bool, location='args' ,help='Filter by approved status')  # Added for filtering
# parser.add_argument('description', type=str, location='args' ,help='Filter by approved status')  # Added for filtering
parser_get.add_argument('resource_link', type=str, location='args' ,help='Filter by resource link')  # Added for filtering
parser_get.add_argument('topic', type=str, location='args' ,help='Filter by topic')  # Added for filtering

admin_fields = {
    'id': fields.Integer,
    'topic': fields.String,
    'description': fields.String,
    'resource_link': fields.String,
    'creater_name': fields.String(attribute=lambda x: x.creater.username),
}
inst_fields = {
    'topic': fields.String,
    'description': fields.String,
    'resource_link': fields.String,
    'creater_name': fields.String(attribute=lambda x: x.creater.username),
    'is_approved': fields.Boolean
}
stud_fields = {
    'topic': fields.String,
    'description': fields.String,
    'resource_link': fields.String,
    'creater_name': fields.String(attribute=lambda x: x.creater.username),
}

class StudyMaterial(Resource):
    # @marshal_with(study_material_fields)
    @auth_required('token')
    def get(self):
        args = parser_get.parse_args()

        if current_user.has_role('admin'):
            fields = admin_fields
        elif current_user.has_role('inst'):
            fields = inst_fields
        elif current_user.has_role('stud'):
            fields = stud_fields
        

        filters = {}
        for field in fields.keys():
            if field in args and args[field] is not None:
                filters[field] = args[field]
        
        study_materials = StudyResource.query.filter_by(**filters).options(joinedload(StudyResource.creater)).all()
        return marshal(study_materials, fields), 200

    
    @auth_required('token')
    @roles_required('stud')
    def post(self):
        args = parser.parse_args()
        print(args)
        study_resource = StudyResource(
            creator_id=current_user.id,
            topic=args.topic,
            description=args.description,
            resource_link=args.resource_link
        )
        db.session.add(study_resource)
        try:
            db.session.commit()
            return {"message":"Resource created. Waiting for approval"}, 200
        except Exception as e:
            db.session.rollback()
            return {"error": str(e)}, 500
    

api.add_resource(StudyMaterial, '/study_material')
