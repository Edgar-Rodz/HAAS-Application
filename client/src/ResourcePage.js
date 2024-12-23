import React, { useState, useEffect, useCallback } from 'react';
import { useParams } from 'react-router-dom';
import { getProjectInfo, getAllHwSets, createNewHardwareSet } from './api';
import ResourceRecord from './component/ResourceRecord';
import './ResourcePage.css';

function ResourcePage() {
  // get parametes from url and sessionStorage
  const username = sessionStorage.getItem('username');
  const { projectName } = useParams();

  const [projectInfo, setProjectInfo] = useState(null);
  const [hardwareSets, setHardwareSets] = useState([]);
  const [newTotalCount, setNewTotalCount] = useState('');
  const [actionResultMessage, setActionResultMessage] = useState('');

  const getHwSets = useCallback(async () => {
    try {
      const hwSets = await getAllHwSets();
      const updatedHwSets = hwSets.map((hwSet) => {
        if (hwSet.hwName in projectInfo.hwSets) {
          return {
            hwName: hwSet.hwName,
            capacity: hwSet.capacity,
            availability: hwSet.availability,
            requested: projectInfo.hwSets[hwSet.hwName],
          };
        }
        return {
          hwName: hwSet.hwName,
          capacity: hwSet.capacity,
          availability: hwSet.availability,
          requested: 0,
        };
      });
      setHardwareSets(updatedHwSets);
    } catch (err) {
      setHardwareSets([]);
    }
  }, [projectInfo]);

  const getProject = useCallback(async () => {
    try {
      const res = await getProjectInfo({ projectName });
      if (res.success) {
        setProjectInfo(res.success);
      } else {
        window.location.href = '/project';
      }
    } catch (err) {
      window.location.href = '/project';
    }
  }, [projectName]);

  const refreshData = useCallback(
    async (msg) => {
      await getProject();
      await getHwSets();
      setActionResultMessage(msg);
    },
    [getHwSets, getProject]
  );

  // checks if user is logged in
  useEffect(() => {
    if (sessionStorage.getItem('username') === null) {
      window.location.href = '/';
    }
  }, []);

  // checks if project exists
  useEffect(() => {
    getProject();
  }, [projectName, getProject]);

  // get hardware sets
  useEffect(() => {
    if (projectInfo) {
      getHwSets();
    }
  }, [projectInfo, getHwSets]);

  const addHardwareSet = async () => {
    if (newTotalCount === '') {
      setActionResultMessage('Please enter value for Total Count.');
      return;
    }

    const totalCount = parseInt(newTotalCount, 10);
    const availability = totalCount;

    // forming new set here, and appending to hardwareSets
    const newHardwareSet = {
      id: hardwareSets.length + 1,
      name: `HardwareSet-${hardwareSets.length + 1}`,
      capacity: totalCount,
      availability,
    };

    try {
      const res = await createNewHardwareSet(newHardwareSet);
      if (res.success) {
        getHwSets();
        setNewTotalCount('');
        setActionResultMessage(res.success);
      } else {
        setActionResultMessage(`Error. Please try again. ${res.error}`);
      }
    } catch (err) {
      setActionResultMessage(err);
    }
  };

  return (
    <div className="ResourcePage">
      <h1>Resource Page</h1>
      <h2>
        User - {username} | Project - {projectName}
      </h2>

      <div>{actionResultMessage && <p>{actionResultMessage}</p>}</div>
      <div className="table-header">
        <div>
          <input
            type="number"
            placeholder="Total Count"
            value={newTotalCount}
            onChange={(e) => setNewTotalCount(e.target.value)}
          />
          <button type="button" onClick={addHardwareSet}>
            Add New Hardware Set
          </button>
        </div>
      </div>

      <table>
        <thead>
          <tr>
            <th>Hardware Set Name</th>
            <th>Total Count</th>
            <th>Available</th>
            <th>Requested</th>
            <th>Adjust Quantity</th>
          </tr>
        </thead>
        <tbody>
          {hardwareSets.map((hwSet) => (
            <ResourceRecord
              key={hwSet.hwName}
              username={username}
              projectName={projectName}
              set={hwSet}
              refreshData={refreshData}
              actionResultMsg={setActionResultMessage}
            />
          ))}
        </tbody>
      </table>
    </div>
  );
}

export default ResourcePage;
