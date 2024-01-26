from celery import shared_task
from .models import StudyResource
import flask_excel as excel

@shared_task(ignore_result=False)
def sayHello():
    print("Hello World")

@shared_task(ignore_result=False)
def create_resource_csv():
    q = StudyResource.with_entities(StudyResource.topic, StudyResource.description, StudyResource.resource_link).all()
    stud_res = excel.make_response_from_query_sets(q, ["topic", "description", "resource_link"], "csv")
    filename = "test.csv"

    with open(filename, 'wb') as f:
        f.write(stud_res.data)

    return filename