import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import './ForgotPasswordForm.css';

function ForgotPasswordForm() {
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const navigate = useNavigate();

  const handleSubmit = (e) => {
    e.preventDefault();
    // TODO: Add your password change logic here
  };

  const handleBackClick = () => {
    navigate('/');
  };

  return (
    <div className="Container">
      <div className="ModifyBox">
        <h2>Change Password</h2>
        <form onSubmit={handleSubmit}>
          <div>
            <label htmlFor="oldPassword">
              Old Password:
              <input
                type="password"
                id="oldPassword"
                value={oldPassword}
                onChange={(e) => setOldPassword(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label htmlFor="newPassword">
              New Password:
              <input
                type="password"
                id="newPassword"
                value={newPassword}
                onChange={(e) => setNewPassword(e.target.value)}
              />
            </label>
          </div>
          <div>
            <label htmlFor="confirmPassword">
              Confirm Password:
              <input
                type="password"
                id="confirmPassword"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
              />
            </label>
          </div>
          <button type="submit">Submit</button>
        </form>
        <button
          type="button"
          onClick={handleBackClick}
          style={{ marginTop: '10px' }}
        >
          Back to Login
        </button>
      </div>
    </div>
  );
}

export default ForgotPasswordForm;
