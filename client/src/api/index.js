import axiosInstance from '../utils/axios';

export const loginApi = async data => {
  try {
    const response = await axiosInstance.post('/user/login', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const registerApi = async data => {
  try {
    const response = await axiosInstance.post('/user', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};

export const fetchUsers = async () => {
  try {
    const response = await axiosInstance.get('/user');
    return response.data.users;
  } catch (error) {
    return error.response.data;
  }
};

export const addCollaboratorApi = async data => {
  try {
    const response = await axiosInstance.post('/docs/collaborator', data, {
      headers: {
        'Content-Type': 'application/json',
      },
    });

    return response.data;
  } catch (error) {
    return error.response.data;
  }
};
