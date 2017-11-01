import time
import os

import twitter
import boto3


OPEN_DATA_TABLES = 'open_data_tables'


def get_twitter_trends(handler, content):
    table_name = 'twitter_trends'
    client = boto3.client('dynamodb')
    open_data_tables = [
        item['table_name']['S'] for item in
        client.scan(TableName=OPEN_DATA_TABLES)['Items']
    ]
    if table_name not in open_data_tables:
        client.put_item(
            TableName=OPEN_DATA_TABLES, Item={'table_name': {'S': table_name}}
        )

    api = twitter.Api(
        consumer_key=os.environ.get('consumer_key'),
        consumer_secret=os.environ.get('consumer_secret'),
        access_token_key=os.environ.get('access_token_key'),
        access_token_secret=os.environ.get('access_token_secret')
    )

    twitter_trends = sum(
        [len(api.GetSearch(term=trend.name.encode('utf-8'), count=100, result_type='popular'))
         for trend in api.GetTrendsCurrent()]
    )
    client.put_item(
        TableName='corr_data',
        Item={
            'type_of_data': {'S': table_name},
            'time_added': {'N': str(int(time.time()))},
            'value': {'N': str(twitter_trends)}
        }
    )
