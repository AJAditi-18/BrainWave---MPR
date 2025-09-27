import api from './api';

export const login = ({ email, password }) => {
  // Example only! Replace with actual API call
  return api.post('/login', { email, password });
};
