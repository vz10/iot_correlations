#!/usr/bin/env python

import boto3
import datetime
import decimal
import json
import time
import requests


BASE_CURRENCY = 'USD'
CURRENCIES = ['CNY', 'EUR', 'GBP', 'JPY', 'RUB']
OPEN_DATA_TABLES = 'open_data_tables'
RATE_TABLE_NAME = 'rate_{}'
SENSOR_DATA_TABLES = 'sensor_data_tables'


def create_row(dynamodb, table_name):
    open_data_tables = dynamodb.Table(OPEN_DATA_TABLES)
    open_data_tables.put_item(Item={'table_name': table_name})


def get_open_data():
    # with urllib.request.urlopen("http://maps.googleapis.com/maps/api/geocode/json?address=google") as url:
    fixer_url = "http://api.fixer.io/latest?base={}&symbols={}".format(BASE_CURRENCY, ','.join(CURRENCIES))
    print('Loading rates from http://api.fixer.io')
    response = requests.get(fixer_url)
    return json.loads(response.content)


def get_open_data_tables(dynamodb):
    print('Loading open data tables list')
    table = dynamodb.Table(OPEN_DATA_TABLES)
    response = table.scan()
    print('HTTPStatusCode={}'.format(response['ResponseMetadata']['HTTPStatusCode']))
    items = list()
    for item in response['Items']:
        items.append(item['table_name'])
    return items


def main(handler, conent):
    """
    Get currencies exchage rate from the open data sources
    Invokes as lambda every 15 minutes
    """
    data = get_open_data()
    if data.get('date'):
        dynamodb = boto3.resource("dynamodb")
        open_data_tables = get_open_data_tables(dynamodb)
        timestamp = int(time.time())*1000
        for currency, rate in data['rates'].items():
            if currency not in CURRENCIES:
                continue
            currency_table = RATE_TABLE_NAME.format(currency)
            if currency_table not in open_data_tables:
                print('Creating row {}'.format(currency_table))
                create_row(dynamodb, currency_table)
            table = dynamodb.Table('corr_data')
            item = {'type_of_data': currency_table, 'time_added': timestamp, 'value': decimal.Decimal(str(rate))}
            print('Inserting {} into table {}, timestamp={}'.
                  format(item, currency_table, datetime.datetime.fromtimestamp(int(timestamp))))
            response = table.put_item(Item=item)
            print('HTTPStatusCode={}'.format(response['ResponseMetadata']['HTTPStatusCode']))


if __name__ == '__main__':
    main()
