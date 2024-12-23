// src/api.js
import axios from 'axios';

// Set the base URL for your API (replace with your actual API endpoint)
const API_BASE_URL = 'https://limitless-brook-04405-7bbd0e5f4357.herokuapp.com';

// Create an axios instance with base settings
const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

export const login = async (data) => {
  const response = await api.post('/login', data);
  return response.data;
};

export const addNewUser = async (data) => {
  const response = await api.post('/add_user', data);
  return response.data;
};

export const createNewProject = async (data) => {
  const response = await api.post('/create_project', data);
  return response.data;
};

export const getProjectInfo = async (data) => {
  const response = await api.post('/get_project_info', data);
  return response.data;
};

export const getAllAddedProjects = async (data) => {
  const response = await api.post('/get_user_projects_list', data);
  return response.data;
};

export const addNewUserToProject = async (data) => {
  const response = await api.post('/join_project', data);
  return response.data;
};

export const getAllHwSets = async () => {
  const response = await api.get('/get_all_hw_names');
  if (response.data.success) {
    const allHWNames = response.data.success;

    if (allHWNames.length > 0) {
      const responseInfo = await Promise.all(
        allHWNames.map(async (hwName) => {
          const eachResponse = await api.post('/get_hw_info', { hwName });
          return eachResponse.data.success;
        })
      );
      return responseInfo;
    }
  }
  return [];
};

export const createNewHardwareSet = async (data) => {
  const response = await api.post('/create_hardware_set', {
    hwName: data.name,
    capacity: data.capacity,
  });
  return response.data;
};

export const checkOutHardware = async (data) => {
  const response = await api.post('/check_out', data);
  return response.data;
};

export const checkInHardware = async (data) => {
  const response = await api.post('/check_in', data);
  return response.data;
};

export default api;
