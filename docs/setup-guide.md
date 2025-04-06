# Setup Guide

This guide will help you set up the Bank Customer Onboarding application on your local machine and deploy it to AWS.

## Prerequisites

- Node.js (v18 or later)
- npm (v9 or later)
- AWS CLI configured with appropriate credentials
- Terraform (v1.3.0 or later)
- Git

## Local Development

### 1. Clone the Repository

```bash
git clone https://github.com/jignesh88/customer-onboarding-statefunction.git
cd customer-onboarding-statefunction
```

### 2. Install Dependencies

```bash
# Install frontend dependencies
npm install

# Install Lambda function dependencies
cd lambdas
npm install
cd ..
```

### 3. Configure Environment Variables

Create a `.env.local` file in the root directory with the following content:

```
NEXT_PUBLIC_API_URL=https://your-api-gateway-url.execute-api.us-east-1.amazonaws.com/prod
```

### 4. Run the Development Server

```bash
npm run dev
```

The application will be available at http://localhost:3000.

## AWS Deployment

### 1. Initialize Terraform

```bash
cd terraform
terraform init \
  -backend-config="bucket=your-terraform-state-bucket" \
  -backend-config="key=customer-onboarding-statefunction/terraform.tfstate" \
  -backend-config="region=us-east-1"
```

### 2. Update Terraform Variables

Create a `terraform.tfvars` file in the terraform directory:

```hcl
app_name           = "bank-onboarding"
environment        = "dev"
domain_name        = "onboarding.yourdomain.com"
root_domain_name   = "yourdomain.com"
aws_region         = "us-east-1"
```

### 3. Apply Terraform Configuration

```bash
terraform apply
```

### 4. Create AWS Secrets Manager Secrets

#### Plaid Credentials

```bash
aws secretsmanager create-secret \
  --name bank-onboarding/plaid-credentials-dev \
  --secret-string '{"PLAID_CLIENT_ID":"your-plaid-client-id","PLAID_SECRET":"your-plaid-secret"}'
```

#### Onfido Credentials

```bash
aws secretsmanager create-secret \
  --name bank-onboarding/onfido-credentials-dev \
  --secret-string '{"ONFIDO_API_TOKEN":"your-onfido-api-token"}'
```

### 5. Deploy Lambda Functions

Package and deploy each Lambda function:

```bash
# Example for Plaid Link Token Lambda
cd lambdas/plaid
zip -r ../../lambda-packages/plaid-link-token.zip link-token.js node_modules
cd ../..

aws lambda update-function-code \
  --function-name bank-onboarding-plaid-link-token-dev \
  --zip-file fileb://lambda-packages/plaid-link-token.zip

# Repeat for other Lambda functions
```

### 6. Build and Deploy the Frontend

```bash
# Build the Next.js app
npm run build
npm run export

# Deploy to S3
aws s3 sync out/ s3://bank-onboarding-dev/ --delete

# Invalidate CloudFront cache
aws cloudfront create-invalidation \
  --distribution-id YOUR_CLOUDFRONT_DISTRIBUTION_ID \
  --paths "/*"
```

## CI/CD Setup

To enable GitHub Actions CI/CD pipeline, set up the following repository secrets:

- `AWS_ACCESS_KEY_ID`: AWS access key with appropriate permissions
- `AWS_SECRET_ACCESS_KEY`: AWS secret access key
- `S3_BUCKET_NAME`: The S3 bucket name for frontend deployment (e.g., `bank-onboarding-dev`)
- `CLOUDFRONT_DISTRIBUTION_ID`: The CloudFront distribution ID
- `APP_NAME`: Application name (e.g., `bank-onboarding`)
- `ENVIRONMENT`: Deployment environment (e.g., `dev`)

## API Integrations

### Plaid

1. Sign up for a Plaid developer account at https://dashboard.plaid.com/signup
2. Obtain your client ID and secret from the Plaid dashboard
3. Update the Plaid secrets in AWS Secrets Manager

### Onfido

1. Sign up for an Onfido account at https://onfido.com/signup/
2. Obtain your API token from the Onfido dashboard
3. Update the Onfido secrets in AWS Secrets Manager

## Monitoring and Debugging

### Step Functions Workflows

Monitor Step Functions executions in the AWS Management Console:

1. Go to the AWS Step Functions console
2. Select the `bank-onboarding-onboarding-workflow-dev` state machine
3. View the executions and their details
4. Use the visual workflow display to track progress and troubleshoot issues