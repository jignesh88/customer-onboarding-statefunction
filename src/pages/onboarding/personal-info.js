import { useState } from 'react';
import { useFormik } from 'formik';
import * as Yup from 'yup';
import Layout from '../../components/layout/Layout';
import StepIndicator from '../../components/common/StepIndicator';
import { useOnboarding } from '../../contexts/OnboardingContext';

export default function PersonalInfo() {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const { updateFormData, completeStep, goToNextStep } = useOnboarding();
  
  // Form validation schema
  const validationSchema = Yup.object({
    firstName: Yup.string().required('First name is required'),
    lastName: Yup.string().required('Last name is required'),
    email: Yup.string().email('Invalid email address').required('Email is required'),
    phone: Yup.string().required('Phone number is required'),
    dateOfBirth: Yup.date().required('Date of birth is required'),
    ssn: Yup.string()
      .matches(/^\d{4}$/, 'Last 4 digits of SSN required')
      .required('Last 4 digits of SSN required'),
    street: Yup.string().required('Street address is required'),
    city: Yup.string().required('City is required'),
    state: Yup.string().required('State is required'),
    zipCode: Yup.string()
      .matches(/^\d{5}(-\d{4})?$/, 'Invalid ZIP code')
      .required('ZIP code is required')
  });
  
  // Initialize form with Formik
  const formik = useFormik({
    initialValues: {
      firstName: '',
      lastName: '',
      email: '',
      phone: '',
      dateOfBirth: '',
      ssn: '',
      street: '',
      city: '',
      state: '',
      zipCode: ''
    },
    validationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true);
      
      try {
        // Update the context with form data
        updateFormData({
          firstName: values.firstName,
          lastName: values.lastName,
          email: values.email,
          phone: values.phone,
          dateOfBirth: values.dateOfBirth,
          ssn: values.ssn,
          address: {
            street: values.street,
            city: values.city,
            state: values.state,
            zipCode: values.zipCode
          }
        });
        
        // Mark this step as completed
        completeStep('personal-info');
        
        // Move to the next step
        goToNextStep();
      } catch (error) {
        console.error('Error submitting customer info:', error);
        // Handle error (show error message, etc.)
      } finally {
        setIsSubmitting(false);
      }
    }
  });
  
  return (
    <Layout title="Personal Information - Secure Bank">
      <div className="max-w-3xl mx-auto p-6">
        <h1 className="text-2xl font-bold text-center mb-8">Open Your Account</h1>
        
        <StepIndicator />
        
        <div className="mt-8 bg-white p-6 rounded-lg shadow-md">
          <h2 className="text-xl font-semibold mb-4">Personal Information</h2>
          
          <form onSubmit={formik.handleSubmit}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              {/* First Name */}
              <div>
                <label htmlFor="firstName" className="block text-sm font-medium text-gray-700 mb-1">
                  First Name
                </label>
                <input
                  id="firstName"
                  name="firstName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.firstName}
                  className={`w-full p-2 border ${
                    formik.touched.firstName && formik.errors.firstName 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.firstName && formik.errors.firstName && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.firstName}</p>
                )}
              </div>
              
              {/* Last Name */}
              <div>
                <label htmlFor="lastName" className="block text-sm font-medium text-gray-700 mb-1">
                  Last Name
                </label>
                <input
                  id="lastName"
                  name="lastName"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.lastName}
                  className={`w-full p-2 border ${
                    formik.touched.lastName && formik.errors.lastName 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.lastName && formik.errors.lastName && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.lastName}</p>
                )}
              </div>
              
              {/* Email */}
              <div>
                <label htmlFor="email" className="block text-sm font-medium text-gray-700 mb-1">
                  Email Address
                </label>
                <input
                  id="email"
                  name="email"
                  type="email"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.email}
                  className={`w-full p-2 border ${
                    formik.touched.email && formik.errors.email 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.email && formik.errors.email && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.email}</p>
                )}
              </div>
              
              {/* Phone */}
              <div>
                <label htmlFor="phone" className="block text-sm font-medium text-gray-700 mb-1">
                  Phone Number
                </label>
                <input
                  id="phone"
                  name="phone"
                  type="tel"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.phone}
                  className={`w-full p-2 border ${
                    formik.touched.phone && formik.errors.phone 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.phone && formik.errors.phone && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.phone}</p>
                )}
              </div>
              
              {/* Date of Birth */}
              <div>
                <label htmlFor="dateOfBirth" className="block text-sm font-medium text-gray-700 mb-1">
                  Date of Birth
                </label>
                <input
                  id="dateOfBirth"
                  name="dateOfBirth"
                  type="date"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.dateOfBirth}
                  className={`w-full p-2 border ${
                    formik.touched.dateOfBirth && formik.errors.dateOfBirth 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.dateOfBirth && formik.errors.dateOfBirth && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.dateOfBirth}</p>
                )}
              </div>
              
              {/* SSN (last 4) */}
              <div>
                <label htmlFor="ssn" className="block text-sm font-medium text-gray-700 mb-1">
                  SSN (last 4 digits)
                </label>
                <input
                  id="ssn"
                  name="ssn"
                  type="text"
                  maxLength="4"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.ssn}
                  className={`w-full p-2 border ${
                    formik.touched.ssn && formik.errors.ssn 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.ssn && formik.errors.ssn && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.ssn}</p>
                )}
              </div>
            </div>
            
            {/* Address Section */}
            <div className="mb-6">
              <h3 className="font-medium text-gray-800 mb-2">Address</h3>
              
              {/* Street */}
              <div className="mb-3">
                <label htmlFor="street" className="block text-sm font-medium text-gray-700 mb-1">
                  Street Address
                </label>
                <input
                  id="street"
                  name="street"
                  type="text"
                  onChange={formik.handleChange}
                  onBlur={formik.handleBlur}
                  value={formik.values.street}
                  className={`w-full p-2 border ${
                    formik.touched.street && formik.errors.street 
                      ? 'border-red-500' 
                      : 'border-gray-300'
                  } rounded-md`}
                />
                {formik.touched.street && formik.errors.street && (
                  <p className="mt-1 text-sm text-red-500">{formik.errors.street}</p>
                )}
              </div>
              
              <div className="grid grid-cols-3 gap-4">
                {/* City */}
                <div>
                  <label htmlFor="city" className="block text-sm font-medium text-gray-700 mb-1">
                    City
                  </label>
                  <input
                    id="city"
                    name="city"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.city}
                    className={`w-full p-2 border ${
                      formik.touched.city && formik.errors.city 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formik.touched.city && formik.errors.city && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.city}</p>
                  )}
                </div>
                
                {/* State */}
                <div>
                  <label htmlFor="state" className="block text-sm font-medium text-gray-700 mb-1">
                    State
                  </label>
                  <input
                    id="state"
                    name="state"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.state}
                    className={`w-full p-2 border ${
                      formik.touched.state && formik.errors.state 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formik.touched.state && formik.errors.state && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.state}</p>
                  )}
                </div>
                
                {/* ZIP Code */}
                <div>
                  <label htmlFor="zipCode" className="block text-sm font-medium text-gray-700 mb-1">
                    ZIP Code
                  </label>
                  <input
                    id="zipCode"
                    name="zipCode"
                    type="text"
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    value={formik.values.zipCode}
                    className={`w-full p-2 border ${
                      formik.touched.zipCode && formik.errors.zipCode 
                        ? 'border-red-500' 
                        : 'border-gray-300'
                    } rounded-md`}
                  />
                  {formik.touched.zipCode && formik.errors.zipCode && (
                    <p className="mt-1 text-sm text-red-500">{formik.errors.zipCode}</p>
                  )}
                </div>
              </div>
            </div>
            
            {/* Submit Button */}
            <button
              type="submit"
              disabled={isSubmitting || !formik.isValid}
              className={`w-full py-2 px-4 rounded-md ${
                isSubmitting || !formik.isValid
                  ? 'bg-gray-400 cursor-not-allowed'
                  : 'bg-blue-600 hover:bg-blue-700 text-white'
              } transition-colors duration-200`}
            >
              {isSubmitting ? 'Processing...' : 'Continue'}
            </button>
          </form>
        </div>
      </div>
    </Layout>
  );
}