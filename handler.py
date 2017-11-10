#!/usr/bin/env python
from time import mktime
from itertools import product
from datetime import datetime, timedelta
from collections import OrderedDict
import json

import numpy as np
import boto3


MIN_CORRELATION = 0.01


def get_values(data, key, cast_to=int):
    return [
        cast_to(item[key].get('N', item[key].get('S'))) for item in data if key in item
    ]


def get_table_permutations(evernt, content):
    s3 = boto3.resource('s3')
    bucket = s3.Bucket('iotchallenge')
    bucket.objects.all().delete()
    client = boto3.client('dynamodb')
    data_table_names = [
        (item['table_name']['S'], item['description']['S']) for item in
        client.scan(TableName='open_data_tables')['Items']
    ]
    sensor_table_names = [
        (item['table_name']['S'], item['description']['S']) for item in
        client.scan(TableName='sensor_data_tables')['Items']
    ]
    lambda_client = boto3.client('lambda')
    for pair in product(data_table_names, sensor_table_names):
        lambda_client.invoke(
            FunctionName='correlation-dev-find_correlations',
            InvocationType='Event',
            LogType='Tail',
            Payload=json.dumps(pair),
        )


def find_correlations(event, content):
    data_table, data_table_desc = event[0]
    sensor_table, sensor_table_desc = event[1]
    client = boto3.client('dynamodb')
    start_timestamp = int(
        mktime((datetime.utcnow() - timedelta(hours=24)).timetuple())
    )
    item_counts = []
    response_data = OrderedDict({})
    for table in [data_table, sensor_table]:
        response = client.query(
            TableName='corr_data',
            KeyConditionExpression='type_of_data = :ToD AND time_added >= :start',
            ScanIndexForward=True,
            Limit=1000,
            ExpressionAttributeValues={
                ':ToD': {'S': table},
                ':start': {'N': str(start_timestamp)}
            }
        )
        count = response['Count']
        items = response['Items']
        if 'LastEvaluatedKey' in response:
            count -= 1
            items = items[1:]

        if not count:
            # No reason to compare if one table is empty
            return response_data

        item_counts.append(count)
        response_data[table] = items

    # slice data to have same amount of items
    timestamps = set()
    min_item_count = min(item_counts)
    for table, data in response_data.iteritems():
        response_data[table] = data[:min_item_count]
        timestamps.update(get_values(response_data[table], 'time_added'))

    # compute interpolation and correlation
    interpolations = {}
    linspaced_timestamps = np.linspace(
        min(timestamps), max(timestamps), num=24 # hours in day
    )
    for table, data in response_data.iteritems():
        interpolations[table] = np.interp(
            linspaced_timestamps,
            get_values(data, 'time_added'),
            get_values(data, 'value', cast_to=float)
        )

    correlation = np.corrcoef(
        interpolations[data_table], interpolations[sensor_table]
    )[0, 1]

    if np.isnan(correlation) or correlation < MIN_CORRELATION:
        return False

    response_data['correlation'] = correlation
    response_data[data_table]['description'] = data_table_desc
    response_data[sensor_table]['description'] = sensor_table_desc

    s3 = boto3.resource('s3')
    object = s3.Object('iotchallenge', '{}_{}.json'.format(data_table, sensor_table))
    object.put(Body=json.dumps(response_data), ACL='public-read')

    return True
