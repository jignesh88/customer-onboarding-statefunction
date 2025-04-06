// Lambda function for simulated Experian credit history check

const { DynamoDB } = require('aws-sdk');
const dynamoDB = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // In a real implementation, you would call the Experian API
    // Here we'll simulate a credit history check
    
    const result = {
      provider: 'Experian',
      status: 'complete',
      reportDate: new Date().toISOString(),
      creditHistory: {
        bankruptcies: 0,
        collections: 0,
        delinquencies: 0,
        latePayments: Math.floor(Math.random() * 3),
        accountsOpened: Math.floor(Math.random() * 5) + 2,
        inquiries: Math.floor(Math.random() * 3),
        averageAccountAge: Math.floor(Math.random() * 60) + 24 + ' months'
      },
      summary: 'No negative items found in credit history'
    };
    
    // Save the result to DynamoDB for record keeping
    await dynamoDB.put({
      TableName: process.env.CREDIT_HISTORY_TABLE,
      Item: {
        userId: body.userId,
        checkType: 'Experian',
        timestamp: new Date().toISOString(),
        result: result
      }
    }).promise();
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify(result)
    };
  } catch (error) {
    console.error('Error performing credit history check:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ error: 'Failed to perform credit history check' })
    };
  }
};