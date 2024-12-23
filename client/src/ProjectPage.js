import React, { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import {
  createNewProject,
  getAllAddedProjects,
  addNewUserToProject,
} from './api';
import './ProjectPage.css';

function ProjectPage() {
  const [tab, setTab] = useState('added');
  const [createMessage, setCreateMessage] = useState(null);
  const [userAddedProjects, setUserAddedProjects] = useState([]);
  const [addToProject, setAddToProject] = useState('');
  const [addToProjectMsg, setAddToProjectMsg] = useState(null);
  const [newProjectName, setNewProjectName] = useState('');
  const [newProjectDescription, setNewProjectDescription] = useState('');

  const handleGetAllAddedProjects = async () => {
    try {
      const res = await getAllAddedProjects({
        username: sessionStorage.getItem('username'),
      });
      if (res.success) {
        setUserAddedProjects(res.success);
      } else {
        setUserAddedProjects([]);
      }
    } catch (err) {
      setUserAddedProjects([]);
    }
  };

  const handleAddUserToProject = async () => {
    try {
      setAddToProjectMsg(null);
      const res = await addNewUserToProject({
        projectName: addToProject,
        username: sessionStorage.getItem('username'),
      });
      if (res.success) {
        setAddToProject(res.success);
        setAddToProjectMsg(
          `Added User to Project ${addToProject} successfully!`
        );
        setAddToProject(null);
      } else {
        setAddToProjectMsg(res.error);
      }
    } catch (err) {
      setAddToProjectMsg('Add failed. Please try again.');
    } finally {
      handleGetAllAddedProjects();
    }
  };

  useEffect(() => {
    if (sessionStorage.getItem('username') === null) {
      window.location.href = '/';
    }
  }, []);

  useEffect(() => {
    if (tab === 'added') {
      handleGetAllAddedProjects();
    }
  }, [tab]);

  const handleCreateProject = async () => {
    try {
      setCreateMessage(null);
      const res = await createNewProject({
        projectName: newProjectName,
        description: newProjectDescription,
      });

      if (res.success) {
        setCreateMessage(`Project - ${newProjectName} created successfully!`);
        setNewProjectName('');
        setNewProjectDescription('');
        setTab('all');
      } else {
        setCreateMessage(`Create failed. Please try again. ${res.error}`);
      }
    } catch (err) {
      setCreateMessage('Create failed. Please try again.');
    }
  };

  return (
    <div className="ProjectPage">
      <h1>Project Management Page</h1>
      <h2>User - &quot;{sessionStorage.getItem('username')}&quot;</h2>

      <div className="tabs">
        <button
          type="button"
          onClick={() => setTab('added')}
          className={tab === 'added' ? 'active' : ''}
        >
          My Projects
        </button>
        <button
          type="button"
          onClick={() => setTab('create')}
          className={tab === 'create' ? 'active' : ''}
        >
          Create
        </button>
      </div>

      {tab === 'added' && (
        <div className="added-project">
          <div className="add-user-to-project-bar">
            <label htmlFor="project-name">
              Project Name:
              <input
                id="project-name"
                type="text"
                value={addToProject}
                onChange={(e) => setAddToProject(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="submit-btn"
              onClick={handleAddUserToProject}
            >
              Add to Project
            </button>
            {addToProjectMsg && (
              <p style={{ color: 'red' }}>{addToProjectMsg}</p>
            )}
          </div>
          <br />
          <h3>Your added projects - {userAddedProjects.length}</h3>
          {userAddedProjects.map((projectName) => (
            <div key={projectName}>
              <Link to={`/projects/${projectName}`}>{projectName}</Link>
            </div>
          ))}
        </div>
      )}

      {tab === 'create' && (
        <div className="create-project">
          <h3>Create your new project</h3>
          <div className="create-form">
            <label htmlFor="project-name">
              Name:
              <input
                id="project-name"
                type="text"
                value={newProjectName}
                onChange={(e) => setNewProjectName(e.target.value)}
              />
            </label>
            <label htmlFor="project-desc">
              Description:
              <input
                id="project-desc"
                type="text"
                value={newProjectDescription}
                onChange={(e) => setNewProjectDescription(e.target.value)}
              />
            </label>
            <button
              type="button"
              className="submit-btn"
              onClick={handleCreateProject}
            >
              Create Project
            </button>
            {createMessage && <p>{createMessage}</p>}
          </div>
        </div>
      )}
    </div>
  );
}

export default ProjectPage;
