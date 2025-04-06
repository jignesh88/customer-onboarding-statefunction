// Custom hook for interacting with the Step Functions workflow

import { useState } from 'react';
import axios from 'axios';
import { useOnboarding } from '../contexts/OnboardingContext';

const API_BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useWorkflow = () => {
  const { formData, updateFormData } = useOnboarding();
  const [workflowStatus, setWorkflowStatus] = useState({
    isStarting: false,
    isPolling: false,
    executionArn: null,
    status: null,
    currentStep: null,
    completedSteps: [],
    error: null
  });
  
  // Start the onboarding workflow
  const startWorkflow = async () => {
    setWorkflowStatus(prev => ({ ...prev, isStarting: true, error: null }));
    
    try {
      const response = await axios.post(`${API_BASE_URL}/onboarding/start`, {
        customerId: formData.customerId,
        customerInfo: {
          firstName: formData.firstName,
          lastName: formData.lastName,
          email: formData.email,
          phone: formData.phone,
          dateOfBirth: formData.dateOfBirth,
          ssn: formData.ssn,
          address: formData.address
        }
      });
      
      const { applicationId, executionArn, status } = response.data;
      
      // Update the form data with the application ID and execution ARN
      updateFormData({
        applicationId,
        executionArn
      });
      
      setWorkflowStatus(prev => ({
        ...prev,
        isStarting: false,
        executionArn,
        status,
        currentStep: 'ProcessCustomerInfo'
      }));
      
      return { applicationId, executionArn, status };
    } catch (error) {
      console.error('Error starting workflow:', error);
      setWorkflowStatus(prev => ({ 
        ...prev, 
        isStarting: false, 
        error: error.response?.data?.error || 'Failed to start onboarding workflow' 
      }));
      throw error;
    }
  };
  
  // Poll for workflow status
  const pollWorkflowStatus = async (executionArn) => {
    if (!executionArn) {
      executionArn = formData.executionArn;
    }
    
    if (!executionArn) {
      throw new Error('Execution ARN is required to poll workflow status');
    }
    
    setWorkflowStatus(prev => ({ ...prev, isPolling: true }));
    
    try {
      const response = await axios.get(`${API_BASE_URL}/onboarding/status/${encodeURIComponent(executionArn)}`);
      
      const { status, currentStep, completedSteps, result, error } = response.data;
      
      // Update the workflow status
      setWorkflowStatus(prev => ({
        ...prev,
        isPolling: false,
        status,
        currentStep,
        completedSteps,
        error: error || null
      }));
      
      // If the workflow completed successfully, update the form data with the results
      if (status === 'SUCCEEDED' && result) {
        updateFormData({
          identityVerified: result.identityVerification,
          bankLinked: result.bankAccount,
          creditScore: result.verificationResults?.[0],
          fraudRisk: result.verificationResults?.[1],
          creditHistory: result.verificationResults?.[2],
          applicationStatus: result.applicationDecision?.status
        });
      }
      
      return { status, currentStep, completedSteps, result, error };
    } catch (error) {
      console.error('Error polling workflow status:', error);
      setWorkflowStatus(prev => ({ 
        ...prev, 
        isPolling: false, 
        error: error.response?.data?.error || 'Failed to get workflow status' 
      }));
      throw error;
    }
  };
  
  // Send a callback to the workflow (for manual steps or UI integration)
  const sendWorkflowCallback = async (taskToken, status, data) => {
    try {
      await axios.post(`${API_BASE_URL}/onboarding/callback`, {
        taskToken,
        status: status ? 'success' : 'failure',
        output: data,
        error: !status ? 'User rejected or action failed' : undefined
      });
      
      return true;
    } catch (error) {
      console.error('Error sending workflow callback:', error);
      throw error;
    }
  };
  
  return {
    workflowStatus,
    startWorkflow,
    pollWorkflowStatus,
    sendWorkflowCallback
  };
};