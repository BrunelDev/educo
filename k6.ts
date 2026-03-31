import http from 'k6/http';
import { sleep } from 'k6';

export let options = {
  stages: [
    { duration: '30s', target: 10 },  // montée à 10 users
    { duration: '30s', target: 50 },  // montée à 50 users
    { duration: '30s', target: 100 }, // montée à 100 users
    { duration: '30s', target: 0 },   // descente
  ],
};

// Remplacez par un compte de test réel
const BASE_URL = 'https://votre-backend.onrender.com';
const EMAIL = 'test@educo.com';
const PASSWORD = 'votremotdepasse';

export function setup() {
  const res = http.post(`${BASE_URL}/api/auth/login/`, 
    JSON.stringify({ email: EMAIL, password: PASSWORD }),
    { headers: { 'Content-Type': 'application/json' } }
  );
  return { token: res.json('access') };
}

export default function (data) {
  const headers = {
    'Content-Type': 'application/json',
    'Authorization': `Bearer ${data.token}`,
  };

  // Testez vos endpoints les plus sollicités
  http.get(`${BASE_URL}/api/meetings/`, { headers });
  sleep(1);
  http.get(`${BASE_URL}/api/messages/`, { headers });
  sleep(1);
}