# Step Functions Workflow Diagram

This diagram shows the flow of the customer onboarding state machine implemented with AWS Step Functions.

```mermaid
stateDiagram-v2
    [*] --> ProcessCustomerInfo
    ProcessCustomerInfo --> VerifyIdentity
    
    VerifyIdentity --> IdentityVerificationChoice
    VerifyIdentity --> IdentityVerificationFailed: error
    
    IdentityVerificationChoice --> LinkBankAccount: status == verified
    IdentityVerificationChoice --> IdentityVerificationFailed: default
    
    IdentityVerificationFailed --> [*]
    
    LinkBankAccount --> WaitForBankAccountLink
    LinkBankAccount --> BankLinkFailed: error
    
    WaitForBankAccountLink --> ProcessBankAccountLink
    
    ProcessBankAccountLink --> BankLinkChoice
    ProcessBankAccountLink --> BankLinkFailed: error
    
    BankLinkChoice --> ParallelVerifications: accessToken present
    BankLinkChoice --> BankLinkFailed: default
    
    BankLinkFailed --> [*]
    
    state ParallelVerifications {
        fork --> CreditScoreCheck
        fork --> FraudRiskCheck 
        fork --> CreditHistoryCheck
        
        CreditScoreCheck --> join
        FraudRiskCheck --> join
        CreditHistoryCheck --> join
    }
    
    ParallelVerifications --> ProcessApplicationDecision
    ParallelVerifications --> VerificationsFailed: error
    
    VerificationsFailed --> [*]
    
    ProcessApplicationDecision --> ApplicationDecisionChoice
    ProcessApplicationDecision --> ApplicationDecisionFailed: error
    
    ApplicationDecisionChoice --> ApplicationApproved: status == approved
    ApplicationDecisionChoice --> ApplicationDenied: default
    
    ApplicationDecisionFailed --> [*]
    
    ApplicationApproved --> [*]
    ApplicationDenied --> [*]
```

## Key Features

1. **Error Handling**: Each step has appropriate error handling with dedicated failure paths
2. **Parallel Processing**: Credit score, fraud risk, and credit history checks run in parallel
3. **Decision Points**: Clear decision points determine the flow based on verification results
4. **Wait States**: Accommodates asynchronous operations like bank account linking