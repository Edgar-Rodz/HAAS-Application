import React, { useEffect, useState } from 'react';
import CryptoJS from 'crypto-js';
import { Link } from 'react-router-dom';
import { login } from './api';
import './LoginForm.css';

function LoginForm() {
  const [username, setUsername] = useState();
  const [password, setPassword] = useState('');
  const [loginError, setLoginError] = useState('');
  const [logonUser, setLogonUser] = useState(null);

  useEffect(() => {
    const storedUsername = sessionStorage.getItem('username');
    if (storedUsername) {
      setLogonUser(storedUsername);
    }
  }, []);

  const handleLogout = () => {
    sessionStorage.clear();
    setLogonUser(null);
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLogonUser(null);
      setLoginError(null);
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const userData = await login({ username, password: hashedPassword });

      if (userData.success) {
        setLogonUser(username);
        sessionStorage.setItem('username', username);
      } else {
        setLoginError('Login failed. Please check your credentials.');
      }
    } catch (err) {
      setLoginError('Login failed. Please check your credentials.');
    }
  };

  return (
    <div className="Container">
      <div className="LoginBox">
        <h2>Login</h2>
        <b>Login to access the system</b>
        <br />
        {!logonUser && (
          <div>
            <form onSubmit={handleSubmit}>
              <div>
                <label htmlFor="username">
                  Username:
                  <input
                    type="text"
                    id="username"
                    value={username}
                    onChange={(event) => setUsername(event.target.value)}
                  />
                </label>
              </div>

              <div>
                <label htmlFor="password">
                  Password:
                  <input
                    type="password"
                    id="password"
                    value={password}
                    onChange={(event) => setPassword(event.target.value)}
                  />
                </label>
              </div>
              <button type="submit">Sign In</button>
            </form>
            <div className="login-footer">
              <Link to="/Modify">Forgot Password?</Link> |{' '}
              <Link to="/register">New user?</Link>
            </div>
            {loginError && <p style={{ color: 'red' }}>{loginError}</p>}
          </div>
        )}
        {logonUser && (
          <div>
            <p>Welcome, {logonUser}!</p>
            <button type="button" onClick={handleLogout}>
              Logout
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

export default LoginForm;
