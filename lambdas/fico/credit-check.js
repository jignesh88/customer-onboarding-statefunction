// Lambda function for simulated FICO credit score check

const { DynamoDB } = require('aws-sdk');
const dynamoDB = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // In a real implementation, you would call the FICO API
    // Here we'll simulate a credit score check
    
    // For demo purposes, we might want to simulate different scores
    // based on the last 4 digits of the SSN
    const last4SSN = body.last4SSN || '1234';
    
    // Simple algorithm to generate a score between 300 and 850
    // based on the last 4 digits of SSN
    const scoreBase = ((parseInt(last4SSN) % 600) + 300); // between 300-899
    const score = Math.min(scoreBase, 850); // cap at 850
    
    const result = {
      provider: 'FICO',
      score: score,
      rating: score > 750 ? 'Excellent' : 
              score > 700 ? 'Good' : 
              score > 650 ? 'Fair' : 
              score > 600 ? 'Poor' : 'Very Poor',
      factors: [
        'Length of credit history',
        'Payment history',
        'Credit utilization',
        'Recent inquiries'
      ],
      timestamp: new Date().toISOString()
    };
    
    // Save the result to DynamoDB for record keeping
    await dynamoDB.put({
      TableName: process.env.CREDIT_CHECKS_TABLE,
      Item: {
        userId: body.userId,
        checkType: 'FICO',
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
    console.error('Error performing credit check:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ error: 'Failed to perform credit check' })
    };
  }
};