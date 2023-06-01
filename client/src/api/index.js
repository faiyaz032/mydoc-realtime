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
