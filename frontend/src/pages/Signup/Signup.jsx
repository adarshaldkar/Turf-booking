import './Signup.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/button';
import { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import axios from '../../utils/axios';

import { Link, useNavigate } from 'react-router-dom';

const Signup = () => {
  const [signup, setSignup] = useState();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const onChange = (e, key) => {
    setSignup({ ...signup, [key]: e.target.value });
  };
  console.log(signup);

  const onSignupClick = async () => {
    try {
      const response = await axios.post('user/signup', signup);

      console.log(response);

      toast.success('Signed up Sucessfully');

      navigate('/login');
    } catch (e) {
      console.log(e.message);
      toast.error('Could Not Signup ');
    }
  };
  return (
    <div className="signup-container">
      <ToastContainer />
      {/* Left Side Of Signup Page */}

      <div className="left">
        <h2>User Login</h2>
        <img src="/images/logo.png" alt="logo" />
        <h1>TurfTime</h1>
      </div>

      {/* Right Side Of Signup Page */}

      <div className="right">
        <div className="signup">
          <div className="top">
            <Input
              type="text"
              placeholder="Nitto"
              label="First Name"
              classname="inputField"
              onChange={e => {
                onChange(e, 'firstname');
              }}
            />
            <Input
              type="text"
              placeholder="Thomas"
              label="Last Name"
              classname="inputField"
              onChange={e => {
                onChange(e, 'lastname');
              }}
            />
            <Input
              type="text"
              placeholder="example@gmail.com"
              label="Email"
              classname="inputField"
              onChange={e => {
                onChange(e, 'email');
              }}
            />
            <div className="password">
              <Input
                type={visible ? 'text' : 'password'}
                placeholder="exaple123"
                label="Password"
                classname="inputField"
                onChange={e => {
                  onChange(e, 'password');
                }}
              />
              <div className="eye" onClick={() => setVisible(!visible)}>
                {visible ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </div>
            </div>
            <div className="password">
              <Input
                type={visible ? 'text' : 'password'}
                placeholder="exaple123"
                label="Conform Password"
                classname="inputField"
                onChange={e => {
                  onChange(e, 'conformpassword');
                }}
              />
              <div className="eye" onClick={() => setVisible(!visible)}>
                {visible ? (
                  <i className="fa-solid fa-eye"></i>
                ) : (
                  <i className="fa-solid fa-eye-slash"></i>
                )}
              </div>
            </div>
            <Button
              text="Signup"
              width="100%"
              height="40px"
              fontsize="20px"
              fontwaight="bold"
              backgroundcolor="#1ED760"
              borderradius="10px"
              className="LoginButton"
              onclick={onSignupClick}
            />
          </div>
          <p id="or">or</p>
          <div className="bottom">
            <div className="box">
              <img src="/images/mobileLogo.jpg" alt="" />
              <Button
                text="Continue With Phone Number "
                width="100%"
                height="30px"
                padding="10px"
                fontwaight="700"
              />
            </div>
            <div className="box">
              <img src="/images/googleLogo.jpg" alt="" />
              <Button
                text="Continue With Google"
                width="100%"
                height="30px"
                padding="10px"
                fontwaight="700"
              />
            </div>

            <p>
              Already have an account?
              <a href="/login">Log in here.</a>
              <br />
              <br />
              <Link to="/">Navigate to Home Page</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Signup;