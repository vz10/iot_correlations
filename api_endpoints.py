import boto3
import json

BASIC_URL = 'https://s3-us-west-2.amazonaws.com/iotchallenge/'

def get_s3_objects(evernt, content):
    """
    API for the frontend part which return list of all the json files
    with the correlation data
    """
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('iotchallenge')
    bucket_objects = bucket.objects.all()
    return {
       'statusCode': 200,
       'body': json.dumps([BASIC_URL+corr_file.key for corr_file in bucket_objects]),
       'headers': {
           'Content-Type': 'application/json',
           'Access-Control-Allow-Origin': '*'
       },
    }
