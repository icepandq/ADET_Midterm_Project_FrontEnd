import axios from 'axios';

export const api = axios.create({
  baseURL: 'http://192.168.1.2:8000/api', //needs ipv4 address of the machine running the backend server UWU XD.
  headers: {
    'Content-Type': 'application/json',
    Accept: 'application/json',
  },
});