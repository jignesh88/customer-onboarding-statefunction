// Lambda function for creating Onfido applicants

const axios = require('axios');
const AWS = require('aws-sdk');
const secretsManager = new AWS.SecretsManager();

exports.handler = async (event) => {
  try {
    const body = JSON.parse(event.body);
    
    // Get Onfido API key from Secrets Manager
    const secretData = await secretsManager.getSecretValue({
      SecretId: process.env.ONFIDO_SECRETS_ID
    }).promise();
    
    const secrets = JSON.parse(secretData.SecretString);
    
    const response = await axios.post(
      'https://api.onfido.com/v3/applicants',
      {
        first_name: body.firstName,
        last_name: body.lastName,
        email: body.email,
        address: {
          building_number: body.addressNumber,
          street: body.addressStreet,
          town: body.addressCity,
          postcode: body.addressZip,
          country: body.addressCountry || 'USA'
        },
        dob: body.dateOfBirth
      },
      {
        headers: {
          Authorization: `Token token=${secrets.ONFIDO_API_TOKEN}`,
          'Content-Type': 'application/json',
        },
      }
    );
    
    return {
      statusCode: 200,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN,
        'Access-Control-Allow-Methods': 'POST, OPTIONS',
        'Access-Control-Allow-Headers': 'Content-Type'
      },
      body: JSON.stringify({ 
        applicantId: response.data.id 
      })
    };
  } catch (error) {
    console.error('Error creating Onfido applicant:', error);
    return {
      statusCode: 500,
      headers: {
        'Content-Type': 'application/json',
        'Access-Control-Allow-Origin': process.env.ALLOWED_ORIGIN
      },
      body: JSON.stringify({ 
        error: 'Failed to create applicant',
        details: error.response ? error.response.data : error.message
      })
    };
  }
};