import React, { useEffect, useState } from 'react';
import { CheckCircle, Clock, AlertCircle, Loader } from 'lucide-react';
import { useWorkflow } from '../../hooks/useWorkflow';
import { useOnboarding } from '../../contexts/OnboardingContext';

const WorkflowStatus = () => {
  const { formData } = useOnboarding();
  const { workflowStatus, pollWorkflowStatus } = useWorkflow();
  const [pollingInterval, setPollingInterval] = useState(null);
  
  // Map of workflow steps to user-friendly names
  const stepNames = {
    'ProcessCustomerInfo': 'Processing Customer Information',
    'VerifyIdentity': 'Verifying Identity',
    'LinkBankAccount': 'Linking Bank Account',
    'ProcessBankAccountLink': 'Processing Bank Account',
    'ParallelVerifications': 'Running Verification Checks',
    'CreditScoreCheck': 'Checking Credit Score',
    'FraudRiskCheck': 'Evaluating Fraud Risk',
    'CreditHistoryCheck': 'Analyzing Credit History',
    'ProcessApplicationDecision': 'Making Application Decision',
    'ApplicationApproved': 'Application Approved',
    'ApplicationDenied': 'Application Denied'
  };
  
  // Start polling when the component mounts and a workflow execution exists
  useEffect(() => {
    if (formData.executionArn && !pollingInterval) {
      // Poll immediately
      pollWorkflowStatus(formData.executionArn);
      
      // Then set up interval polling
      const interval = setInterval(() => {
        pollWorkflowStatus(formData.executionArn);
      }, 3000); // Poll every 3 seconds
      
      setPollingInterval(interval);
    }
    
    // Clean up the interval when the component unmounts
    return () => {
      if (pollingInterval) {
        clearInterval(pollingInterval);
      }
    };
  }, [formData.executionArn, pollingInterval]);
  
  // Stop polling when the workflow completes
  useEffect(() => {
    if (
      pollingInterval && 
      (workflowStatus.status === 'SUCCEEDED' || 
       workflowStatus.status === 'FAILED' || 
       workflowStatus.status === 'TIMED_OUT' || 
       workflowStatus.status === 'ABORTED')
    ) {
      clearInterval(pollingInterval);
      setPollingInterval(null);
    }
  }, [workflowStatus.status, pollingInterval]);
  
  // Check if workflow is running or not
  const isRunning = workflowStatus.status === 'RUNNING';
  
  return (
    <div className="bg-white p-4 rounded-lg shadow-sm border border-gray-200 mb-4">
      <h3 className="text-lg font-medium mb-3">Onboarding Status</h3>
      
      {workflowStatus.error && (
        <div className="mb-4 p-3 bg-red-50 border border-red-200 rounded-md text-red-700 text-sm">
          <div className="flex items-center">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span>Error: {workflowStatus.error}</span>
          </div>
        </div>
      )}
      
      <div className="mb-3 flex items-center">
        <div className={`w-3 h-3 rounded-full mr-2 ${
          isRunning ? 'bg-blue-500' : 
          workflowStatus.status === 'SUCCEEDED' ? 'bg-green-500' :
          workflowStatus.status === 'FAILED' ? 'bg-red-500' :
          'bg-gray-300'
        }`}></div>
        <span className="font-medium">
          Status: {workflowStatus.status || 'Not Started'}
          {isRunning && <span className="ml-2 text-blue-500">Running...</span>}
        </span>
      </div>
      
      {workflowStatus.currentStep && (
        <div className="mb-4">
          <p className="text-sm text-gray-600 mb-2">Current Step:</p>
          <div className="flex items-center bg-blue-50 p-2 rounded-md">
            {isRunning ? (
              <Loader size={16} className="mr-2 text-blue-500 animate-spin" />
            ) : (
              <CheckCircle size={16} className="mr-2 text-green-500" />
            )}
            <span className="font-medium">
              {stepNames[workflowStatus.currentStep] || workflowStatus.currentStep}
            </span>
          </div>
        </div>
      )}
      
      {workflowStatus.completedSteps && workflowStatus.completedSteps.length > 0 && (
        <div>
          <p className="text-sm text-gray-600 mb-2">Completed Steps:</p>
          <ul className="space-y-1">
            {workflowStatus.completedSteps.map((step, index) => (
              <li key={index} className="flex items-center text-sm">
                <CheckCircle size={14} className="mr-2 text-green-500" />
                <span>{stepNames[step] || step}</span>
              </li>
            ))}
          </ul>
        </div>
      )}
      
      {workflowStatus.status === 'SUCCEEDED' && (
        <div className="mt-4 p-3 bg-green-50 border border-green-200 rounded-md">
          <div className="flex items-center text-green-700">
            <CheckCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="font-medium">Onboarding workflow completed successfully!</span>
          </div>
        </div>
      )}
      
      {workflowStatus.status === 'FAILED' && (
        <div className="mt-4 p-3 bg-red-50 border border-red-200 rounded-md">
          <div className="flex items-center text-red-700">
            <AlertCircle size={16} className="mr-2 flex-shrink-0" />
            <span className="font-medium">Onboarding workflow failed. Please try again or contact support.</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default WorkflowStatus;