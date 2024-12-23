import React, { useState } from 'react';
import CryptoJS from 'crypto-js';
import { useNavigate } from 'react-router-dom';
import { addNewUser } from './api';
import './RegisterForm.css';

function RegisterForm() {
  const [user, setUser] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [submitSuccess, setSubmitSuccess] = useState(false);
  const [submitError, setSubmitError] = useState('');

  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault(); // Prevents form submission reload

    if (password !== confirmPassword) {
      setSubmitError('Passwords do not match. Please try again.');
      return;
    }

    try {
      setSubmitError(null);
      const hashedPassword = CryptoJS.SHA256(password).toString();
      const res = await addNewUser({
        username: user,
        password: hashedPassword,
      });

      if (res.success) {
        setSubmitSuccess(true);
      } else {
        setSubmitError('Register failed. Please try again.');
      }
    } catch (err) {
      setSubmitError('Register failed. Please try again.');
    }
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="Container">
      <div className="RegisterBox">
        <h2>Create Account</h2>
        {submitSuccess ? (
          <p>Account created successfully!</p>
        ) : (
          <form onSubmit={handleSubmit}>
            <div>
              <label htmlFor="user">
                Username:
                <input
                  type="text"
                  id="user"
                  value={user}
                  onChange={(e) => setUser(e.target.value)}
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
                  onChange={(e) => setPassword(e.target.value)}
                />
              </label>
            </div>
            <div>
              <label htmlFor="confirmPassword">
                Confirm password:
                <input
                  type="password"
                  id="confirmPassword"
                  value={confirmPassword}
                  onChange={(e) => setConfirmPassword(e.target.value)}
                />
              </label>
            </div>
            <button type="submit">Sign Up</button>
          </form>
        )}
        <button
          type="button"
          onClick={handleBackClick}
          style={{ marginTop: '10px' }}
        >
          Back to Login
        </button>
        {submitError && <p style={{ color: 'red' }}>{submitError}</p>}
      </div>
    </div>
  );
}

export default RegisterForm;
