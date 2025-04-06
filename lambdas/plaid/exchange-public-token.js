// Lambda function for exchanging public token for access token

const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

// Import getPlaidClient from link-token.js if in same deployment package
// or reimplement here for independent deployment
const getPlaidClient = async () => {
  // Same implementation as in link-token.js
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const client = await getPlaidClient();
    
    const exchangeResponse = await client.itemPublicTokenExchange({
      public_token: body.publicToken
    });
    
    // Store the access token in your database or pass it to another service
    const accessToken = exchangeResponse.data.access_token;
    
    // Get account information
    const accountsResponse = await client.accountsGet({
      access_token: accessToken
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({
        accessToken: accessToken, // Note: In production, don't return this to the frontend
        accounts: accountsResponse.data.accounts
      })
    };
  } catch (error) {
    console.error('Error exchanging public token:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ error: 'Failed to exchange public token' })
    };
  }
};