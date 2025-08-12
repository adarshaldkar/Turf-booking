import { useState, useEffect, useRef } from 'react';
import { useLocation, useNavigate } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import { useAuth } from '../context/AuthContext';
import './OTPVerification.css';

const OTPVerification = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const { email, phone, verificationType, userToken } = location.state || {};
  const { verifyOTP, resendOTP } = useAuth();
  
  const [otp, setOtp] = useState(['', '', '', '', '', '']);
  const [isLoading, setIsLoading] = useState(false);
  const [resendLoading, setResendLoading] = useState(false);
  const [timeLeft, setTimeLeft] = useState(300); // 5 minutes
  const [canResend, setCanResend] = useState(false);
  
  const inputRefs = useRef([]);

  // Redirect if no required data
  useEffect(() => {
    if (!email && !phone) {
      toast.error('Invalid verification request');
      navigate('/login');
    }
  }, [email, phone, navigate]);

  // Timer countdown
  useEffect(() => {
    if (timeLeft > 0) {
      const timer = setTimeout(() => setTimeLeft(timeLeft - 1), 1000);
      return () => clearTimeout(timer);
    } else {
      setCanResend(true);
    }
  }, [timeLeft]);

  // Format time display
  const formatTime = (seconds) => {
    const minutes = Math.floor(seconds / 60);
    const remainingSeconds = seconds % 60;
    return `${minutes}:${remainingSeconds.toString().padStart(2, '0')}`;
  };

  const handleOtpChange = (index, value) => {
    // Only allow numeric input
    if (!/^\d*$/.test(value)) return;

    const newOtp = [...otp];
    newOtp[index] = value;
    setOtp(newOtp);

    // Auto focus next input
    if (value && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index, e) => {
    if (e.key === 'Backspace' && !otp[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowLeft' && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    
    if (e.key === 'ArrowRight' && index < 5) {
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handlePaste = (e) => {
    e.preventDefault();
    const pastedData = e.clipboardData.getData('text');
    
    if (!/^\d{6}$/.test(pastedData)) {
      toast.error('Please paste a valid 6-digit OTP');
      return;
    }

    const newOtp = pastedData.split('');
    setOtp(newOtp);
    inputRefs.current[5]?.focus();
  };

  const handleVerifyOtp = async () => {
    const otpString = otp.join('');
    
    if (otpString.length !== 6) {
      toast.error('Please enter all 6 digits');
      return;
    }

    setIsLoading(true);
    try {
      const payload = {
        otp: otpString,
        verificationType: verificationType || 'signup'
      };

      if (email) payload.email = email;
      if (phone) payload.phone = phone;
      if (userToken) payload.userToken = userToken;

      const result = await verifyOTP(payload);

      if (result.success) {
        toast.success('Verification successful!');
        
        // If it's a signup verification, navigate to login
        if (verificationType === 'signup') {
          setTimeout(() => {
            navigate('/login');
          }, 2000);
        } else {
          // For other verifications, navigate to home or dashboard
          navigate('/turfs');
        }
      } else {
        toast.error(result.message || 'Verification failed');
      }
    } catch (error) {
      console.error('OTP verification error:', error);
      if (error.response?.status === 400) {
        toast.error('Invalid or expired OTP');
      } else if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Verification failed. Please try again.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  const handleResendOTP = async () => {
    setResendLoading(true);
    try {
      const payload = {
        verificationType: verificationType || 'signup'
      };

      if (email) payload.email = email;
      if (phone) payload.phone = phone;

      const result = await resendOTP(payload);

      if (result.success) {
        setTimeLeft(300);
        setCanResend(false);
        toast.success('OTP resent successfully!');
      } else {
        toast.error(result.message || 'Failed to resend OTP');
      }
    } catch (error) {
      console.error('Resend OTP error:', error);
      if (error.response?.data?.message) {
        toast.error(error.response.data.message);
      } else {
        toast.error('Failed to resend OTP. Please try again.');
      }
    } finally {
      setResendLoading(false);
    }
  };

  return (
    <div className="otp-verification-container">
      <ToastContainer />
      <h2>OTP Verification</h2>
      <p>
        Enter the 6-digit OTP sent to {email ? email : phone}
      </p>
      <div className="otp-inputs" onPaste={handlePaste}>
        {otp.map((digit, idx) => (
          <input
            key={idx}
            type="text"
            maxLength="1"
            value={digit}
            ref={el => inputRefs.current[idx] = el}
            onChange={e => handleOtpChange(idx, e.target.value)}
            onKeyDown={e => handleKeyDown(idx, e)}
            className="otp-input"
            autoFocus={idx === 0}
          />
        ))}
      </div>
      <button
        onClick={handleVerifyOtp}
        disabled={isLoading}
        className="verify-btn"
      >
        {isLoading ? 'Verifying...' : 'Verify OTP'}
      </button>
      <div className="timer-resend">
        {canResend ? (
          <button
            onClick={handleResendOTP}
            disabled={resendLoading}
            className="resend-btn"
          >
            {resendLoading ? 'Resending...' : 'Resend OTP'}
          </button>
        ) : (
          <span>Resend OTP in {formatTime(timeLeft)}</span>
        )}
      </div>
    </div>
  );
};

export default OTPVerification;