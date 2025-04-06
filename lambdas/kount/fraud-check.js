// Lambda function for simulated Kount fraud risk evaluation

const { DynamoDB } = require('aws-sdk');
const dynamoDB = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // In a real implementation, you would call the Kount API
    // Here we'll simulate a fraud risk evaluation
    
    // Generate a random score between 1-100 
    // (higher score means lower risk in this simulation)
    const score = Math.floor(Math.random() * 30) + 70; // Random score between 70-99
    
    const result = {
      provider: 'Kount',
      score: score,
      riskLevel: score > 90 ? 'Low' : score > 70 ? 'Medium' : 'High',
      flags: [],
      deviceTrust: 'Trusted',
      ipRiskScore: Math.floor(Math.random() * 10) + 90, // 90-99
      timestamp: new Date().toISOString()
    };
    
    // Save the result to DynamoDB for record keeping
    await dynamoDB.put({
      TableName: process.env.FRAUD_CHECKS_TABLE,
      Item: {
        userId: body.userId,
        checkType: 'Kount',
        timestamp: result.timestamp,
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
    console.error('Error performing fraud check:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ error: 'Failed to perform fraud check' })
    };
  }
};