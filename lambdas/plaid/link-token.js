// Lambda function for creating Plaid link tokens

const { Configuration, PlaidApi, PlaidEnvironments } = require('plaid');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

// Initialize Plaid client with credentials from Secrets Manager
let plaidClient = null;

const getPlaidClient = async () => {
  if (plaidClient) return plaidClient;
  
  try {
    const secretData = await secretsManager.getSecretValue({
      SecretId: process.env.PLAID_SECRETS_ID
    }).promise();
    
    const secrets = JSON.parse(secretData.SecretString);
    
    const configuration = new Configuration({
      basePath: PlaidEnvironments[process.env.PLAID_ENV || 'sandbox'],
      baseOptions: {
        headers: {
          'PLAID-CLIENT-ID': secrets.PLAID_CLIENT_ID,
          'PLAID-SECRET': secrets.PLAID_SECRET,
        },
      },
    });
    
    plaidClient = new PlaidApi(configuration);
    return plaidClient;
  } catch (error) {
    console.error('Error fetching Plaid secrets:', error);
    throw error;
  }
};

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    const client = await getPlaidClient();
    
    const createTokenResponse = await client.linkTokenCreate({
      user: { client_user_id: body.userId || `user-${Date.now()}` },
      client_name: 'Bank Onboarding App',
      products: ['auth'],
      country_codes: ['US'],
      language: 'en',
    });
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ linkToken: createTokenResponse.data.link_token })
    };
  } catch (error) {
    console.error('Error creating link token:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ error: 'Failed to create link token' })
    };
  }
};