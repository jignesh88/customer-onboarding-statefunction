import { useEffect } from 'react';
import { useRouter } from 'next/router';
import Layout from '../../components/layout/Layout';
import StepIndicator from '../../components/common/StepIndicator';
import WorkflowStatus from '../../components/workflow/WorkflowStatus';
import { useOnboarding } from '../../contexts/OnboardingContext';
import { useWorkflow } from '../../hooks/useWorkflow';

export default function Onboarding() {
  const router = useRouter();
  const { currentStep, steps } = useOnboarding();
  const { workflowStatus } = useWorkflow();
  
  // Redirect to the appropriate step based on the workflow status
  useEffect(() => {
    if (!router.isReady) return;
    
    // If no specific step in URL, redirect to first step
    if (router.pathname === '/onboarding') {
      router.push(steps[0].path);
    }
  }, [router.pathname, router.isReady, steps]);
  
  return (
    <Layout title="Open Your Account - Secure Bank">
      <div className="max-w-4xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Open Your Account</h1>
        
        <StepIndicator />
        
        {workflowStatus.executionArn && (
          <WorkflowStatus />
        )}
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          {/* Child pages render here based on the route */}
        </div>
      </div>
    </Layout>
  );
}