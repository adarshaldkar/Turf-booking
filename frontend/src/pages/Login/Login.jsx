
import './Login.css';
import Input from '../../components/Input/Input';
import Button from '../../components/Button/button';
import { useState } from 'react';

import { ToastContainer, toast } from 'react-toastify';

import axios from '../../utils/axios';

import { useNavigate } from 'react-router-dom';
import { Link } from 'react-router-dom';

const Login = () => {
  const [login, setLogin] = useState();
  const [visible, setVisible] = useState(false);

  const navigate = useNavigate();

  const onChange = (e, key) => {
    setLogin({ ...login, [key]: e.target.value });
  };

  const onLoginClick = async () => {
    try {
      const response = await axios.post('user/login', login); // customized api url

      console.log(response);
      localStorage.setItem('token', response.data.token);

      toast.success('Logined Sucessfully');

      // Delay navigation for 2 seconds (2000ms)
      setTimeout(() => {
        navigate('/turfs');
      }, 2000);

      //
    } catch (e) {
      console.log(e.message);
      toast.error('Email or Password is incurrect! ');
    }
  };

  return (
    <div className="loginPage">
      <ToastContainer />
      {/* Left Side Of Login Page */}

      <div className="left">
        <h2>User Login</h2>
        <img src="/images/logo.png" alt="logo" />
        <h1>TurfTime</h1>
      </div>

      {/* Right Side Of LoginPage */}

      <div className="right">
        <div className="login">
          <div className="top">
            <Input
              type="text"
              placeholder="example@gmail.com"
              label="Email or Username "
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

            <Button
              text="Login"
              width="100%"
              height="40px"
              fontsize="20px"
              fontwaight="bold"
              backgroundcolor="#1ED760"
              borderradius="10px"
              className="LoginButton"
              onclick={onLoginClick}
            />

            <p>
              <u>Forgot your password</u>
            </p>
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
              Don't have an account?
              <Link to="/signup">Sign up for TurfTime</Link>
              <br />
              <br />
              <Link to="/">Navigate to Home Page</Link>
              <br />
              <br />
              <Link to="/admin/login">Login As Admin</Link>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Login;
