// Lambda function for application decision making

const { DynamoDB } = require('aws-sdk');
const dynamoDB = new DynamoDB.DocumentClient();

exports.handler = async (event) => {
  try {
    // For Step Functions integration, we'll use the event directly
    // If called through API Gateway, we'd parse event.body
    const input = typeof event.body === 'string' ? JSON.parse(event.body) : event;
    
    // Extract data from input
    const applicationId = input.applicationId;
    const customerId = input.customerId;
    
    // Extract verification results
    // In a Step Functions context, these will be in the state machine context
    const verificationResults = input.verificationResults || [];
    
    // FICO credit score check result (from the parallel state branch 0)
    const ficoResult = verificationResults[0] || {};
    const ficoScore = ficoResult.score || 0;
    
    // Kount fraud risk evaluation result (from the parallel state branch 1)
    const kountResult = verificationResults[1] || {};
    const kountScore = kountResult.score || 0;
    
    // Experian credit history check result (from the parallel state branch 2)
    const experianResult = verificationResults[2] || {};
    
    // Make decision based on verification results
    const isApproved = ficoScore >= 650 && kountScore >= 70;
    
    // Additional factors for rejection
    let rejectionReasons = [];
    if (ficoScore < 650) {
      rejectionReasons.push('Credit score below threshold');
    }
    if (kountScore < 70) {
      rejectionReasons.push('Fraud risk assessment indicated potential concerns');
    }
    
    // Check for bankruptcy or delinquencies in credit history
    if (experianResult.creditHistory && 
        (experianResult.creditHistory.bankruptcies > 0 || 
         experianResult.creditHistory.delinquencies > 0)) {
      isApproved = false;
      rejectionReasons.push('Negative items found in credit history');
    }
    
    const result = {
      applicationId: applicationId,
      status: isApproved ? 'approved' : 'declined',
      decisionTimestamp: new Date().toISOString(),
      reasons: isApproved ? ['All verification checks passed'] : rejectionReasons,
      nextSteps: isApproved ? 
        ['Account setup will be completed within 24 hours', 'Check your email for login details'] : 
        ['You can apply again in 30 days', 'Contact customer support for more information']
    };
    
    // Save the decision to DynamoDB
    await dynamoDB.put({
      TableName: process.env.APPLICATION_DECISIONS_TABLE,
      Item: {
        applicationId: result.applicationId,
        userId: customerId,
        timestamp: result.decisionTimestamp,
        decision: result
      }
    }).promise();
    
    // For API Gateway, we would return a structured HTTP response
    if (event.httpMethod) {
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
    }
    
    // For Step Functions, return the result directly
    return result;
  } catch (error) {
    console.error('Error processing application decision:', error);
    
    // For API Gateway
    if (event.httpMethod) {
      return {
        statusCode: 500,
        headers: {
          'Content-Type': 'application/json',
          'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
        },
        body: JSON.stringify({ error: 'Failed to process application decision' })
      };
    }
    
    // For Step Functions
    throw error;
  }
};