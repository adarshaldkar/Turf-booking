// src/pages/ForgotPassword/ForgotPassword.jsx - Working forgot password functionality
import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useAuth } from '../context/AuthContext';

const ForgotPassword = () => {
  const [email, setEmail] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  const [isSuccess, setIsSuccess] = useState(false);
  const [error, setError] = useState('');

  const { resetPassword } = useAuth();

  const handleSubmit = async (e) => {
    e.preventDefault();
    
    if (!email) {
      setError('Email is required');
      return;
    }
    
    if (!/\S+@\S+\.\S+/.test(email)) {
      setError('Please enter a valid email address');
      return;
    }

    setIsLoading(true);
    setError('');

    try {
      const response = await resetPassword(email);
      if (response.success) {
        setIsSuccess(true);
      }
    } catch (error) {
      setError(error.message || 'Failed to send reset email. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  if (isSuccess) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-6">
        <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10 text-center">
          <div className="mb-8">
            <div className="inline-flex items-center justify-center w-20 h-20 bg-green-100 rounded-full mb-6">
              <span className="text-4xl">📧</span>
            </div>
            <h2 className="text-3xl font-bold text-gray-900 mb-4">Check Your Email</h2>
            <p className="text-lg text-gray-600 leading-relaxed">
              We've sent a password reset link to <strong>{email}</strong>
            </p>
          </div>
          
          <div className="space-y-6">
            <div className="bg-green-50 border border-green-200 rounded-xl p-4">
              <p className="text-green-700 text-sm">
                <strong>📝 Next Steps:</strong><br/>
                1. Check your email inbox<br/>
                2. Click the reset link<br/>
                3. Create a new password
              </p>
            </div>
            
            <Link
              to="/login"
              className="w-full inline-flex justify-center items-center px-6 py-4 bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold rounded-xl transition-all duration-300 transform hover:scale-[1.02] hover:shadow-xl"
            >
              <span className="mr-2">←</span>
              Back to Login
            </Link>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-green-50 via-emerald-50 to-teal-50 flex items-center justify-center px-6">
      <div className="max-w-md w-full bg-white rounded-2xl shadow-2xl p-10">
        
        {/* Header */}
        <div className="text-center mb-10">
          <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-r from-green-100 to-emerald-100 rounded-full mb-6 shadow-lg">
            <span className="text-3xl">🔑</span>
          </div>
          <h2 className="text-3xl font-bold text-gray-900 mb-4">
            Forgot Password?
          </h2>
          <p className="text-lg text-gray-600 leading-relaxed">
            No worries! Enter your email and we'll send you a reset link.
          </p>
        </div>

        {/* Error Display */}
        {error && (
          <div className="bg-red-50 border border-red-200 rounded-xl p-4 mb-8">
            <div className="flex items-center">
              <span className="text-red-500 mr-3 text-xl">⚠️</span>
              <p className="text-red-700">{error}</p>
            </div>
          </div>
        )}

        {/* Reset Form */}
        <form onSubmit={handleSubmit} className="space-y-8">
          <div className="space-y-3">
            <label className="flex items-center text-base font-semibold text-gray-700">
              <span className="mr-3 text-xl">📧</span>
              Email Address
            </label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className={`w-full px-6 py-4 border-2 rounded-xl bg-white text-lg transition-all duration-300 focus:outline-none focus:ring-4 focus:ring-green-500/20 focus:border-green-500 ${
                error 
                  ? 'border-red-500 bg-red-50' 
                  : 'border-gray-300 hover:border-green-400'
              }`}
              placeholder="Enter your email address"
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={isLoading}
            className="w-full bg-gradient-to-r from-green-600 to-emerald-600 hover:from-green-700 hover:to-emerald-700 text-white font-bold py-5 px-8 rounded-xl text-lg transition-all duration-300 transform hover:scale-[1.02] hover:shadow-2xl disabled:opacity-50 disabled:cursor-not-allowed disabled:transform-none focus:outline-none focus:ring-4 focus:ring-green-500/50"
          >
            {isLoading ? (
              <div className="flex items-center justify-center">
                <svg className="animate-spin -ml-1 mr-3 h-6 w-6 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                </svg>
                Sending Reset Link...
              </div>
            ) : (
              <span className="flex items-center justify-center">
                <span className="mr-3 text-xl">📨</span>
                Send Reset Link
              </span>
            )}
          </button>
        </form>

        {/* Back to Login */}
        <div className="text-center mt-10">
          <Link
            to="/login"
            className="inline-flex items-center text-lg text-green-600 hover:text-green-700 font-semibold hover:underline transition-all"
          >
            <span className="mr-2">←</span>
            Back to Login
          </Link>
        </div>
      </div>
    </div>
  );
};

export default ForgotPassword;
