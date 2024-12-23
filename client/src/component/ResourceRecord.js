import React, { useState } from 'react';
import PropTypes from 'prop-types';
import { checkOutHardware, checkInHardware } from '../api';

function ResourceRecord({
  username,
  projectName,
  set,
  refreshData,
  actionResultMsg,
}) {
  const { hwName, capacity, availability, requested } = set;
  const [inputValue, setInputValue] = useState(0);

  const checkOut = async () => {
    actionResultMsg('Processing...');
    const value = parseInt(inputValue, 10) || 0;
    try {
      const res = await checkOutHardware({
        username,
        projectName,
        hwName,
        quantity: value,
      });
      if (res.success) {
        refreshData('Checked Out Successfully');
        setInputValue(0);
      } else {
        actionResultMsg(`Error. Please try again. ${res.error}`);
      }
    } catch (err) {
      actionResultMsg(err);
    }
  };

  const checkIn = async () => {
    actionResultMsg('Processing...');
    const value = parseInt(inputValue, 10) || 0;
    try {
      const res = await checkInHardware({
        username,
        projectName,
        hwName,
        quantity: value,
      });
      if (res.success) {
        refreshData('Checked In Successfully');
        setInputValue(0);
      } else {
        actionResultMsg(`Error. Please try again. ${res.error}`);
      }
    } catch (err) {
      actionResultMsg(err);
    }
  };

  return (
    <tr key={hwName}>
      <td>{hwName}</td>
      <td>{capacity}</td>
      <td>{availability}</td>
      <td>{requested}</td>
      <td>
        <input
          type="number"
          min="0"
          value={inputValue}
          onChange={(e) => setInputValue(e.target.value)}
        />
        <button type="button" onClick={() => checkIn()}>
          Check In
        </button>
        <button type="button" onClick={() => checkOut()}>
          Check Out
        </button>
      </td>
    </tr>
  );
}

ResourceRecord.propTypes = {
  username: PropTypes.string.isRequired,
  projectName: PropTypes.string.isRequired,
  // eslint-disable-next-line react/forbid-prop-types
  set: PropTypes.object.isRequired,
  refreshData: PropTypes.func.isRequired,
  actionResultMsg: PropTypes.func.isRequired,
};

export default ResourceRecord;
