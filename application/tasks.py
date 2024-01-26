from celery import shared_task
from .models import StudyResource
import flask_excel as excel

# @shared_task(ignore_result=False)
# def create_resource_csv():
#     stud_res = StudyResource.query.with_entities(StudyResource.topic,StudyResource.description,StudyResource.resource_link).all()
#     csv_output = excel.make_response_from_query_sets(stud_res,['topic','description','resource_link'],'csv')
#     filename = "resources.csv"

#     with open(filename, 'wb') as f:
#         f.write(csv_output.data)
    

#     return filename