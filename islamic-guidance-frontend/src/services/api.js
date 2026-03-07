// ─── Base Config ─────────────────────────────────────────────────────────────
const BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000/api';

const getHeaders = () => {
  const token = localStorage.getItem('access_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
  };
};

// ─── Generic Request Helper ───────────────────────────────────────────────────
const request = async (method, endpoint, body = null) => {
  const config = {
    method,
    headers: getHeaders(),
    ...(body ? { body: JSON.stringify(body) } : {}),
  };

  const res = await fetch(`${BASE_URL}${endpoint}`, config);

  if (res.status === 401) {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
    window.location.href = '/login';
  }

  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || 'Request failed');
  }

  return res.status === 204 ? null : res.json();
};

// ─── Auth ─────────────────────────────────────────────────────────────────────
export const authAPI = {
  register: (data) => request('POST', '/auth/register/', data),
  login: async (data) => {
    const tokens = await request('POST', '/auth/token/', data);
    localStorage.setItem('access_token', tokens.access);
    localStorage.setItem('refresh_token', tokens.refresh);
    return tokens;
  },
  logout: () => {
    localStorage.removeItem('access_token');
    localStorage.removeItem('refresh_token');
  },
  refreshToken: () =>
    request('POST', '/auth/token/refresh/', {
      refresh: localStorage.getItem('refresh_token'),
    }),
  getProfile: () => request('GET', '/auth/profile/'),
};

// ─── Ayahs ───────────────────────────────────────────────────────────────────
export const ayahAPI = {
  getDailyAyah: () => request('GET', '/ayahs/daily/'),
  getByMood: (mood) => request('GET', `/ayahs/?mood=${mood}`),
  getAll: () => request('GET', '/ayahs/'),
  getRandom: () => request('GET', '/ayahs/random/'),
};

// ─── Habits ──────────────────────────────────────────────────────────────────
export const habitAPI = {
  getToday: () => request('GET', '/habits/today/'),
  getAll: () => request('GET', '/habits/'),
  complete: (habitId) => request('POST', `/habits/${habitId}/complete/`),
  uncomplete: (habitId) => request('DELETE', `/habits/${habitId}/complete/`),
  getStreak: () => request('GET', '/habits/streak/'),
};

// ─── Reflections (Journal) ────────────────────────────────────────────────────
export const reflectionAPI = {
  getAll: () => request('GET', '/reflections/'),
  create: (data) => request('POST', '/reflections/', data),
  update: (id, data) => request('PUT', `/reflections/${id}/`, data),
  delete: (id) => request('DELETE', `/reflections/${id}/`),
};

// ─── Guidance ─────────────────────────────────────────────────────────────────
export const guidanceAPI = {
  getTopics: () => request('GET', '/guidance/topics/'),
  getByTopic: (topic) => request('GET', `/guidance/?topic=${topic}`),
};

// ─── External: Al-Quran Cloud ─────────────────────────────────────────────────
export const quranAPI = {
  getAyah: async (surah, ayah) => {
    const res = await fetch(
      `https://api.alquran.cloud/v1/ayah/${surah}:${ayah}/editions/quran-uthmani,en.asad`
    );
    const data = await res.json();
    return data.data;
  },
  getRandomAyah: async () => {
    const surah = Math.floor(Math.random() * 114) + 1;
    const res = await fetch(`https://api.alquran.cloud/v1/surah/${surah}`);
    const data = await res.json();
    return data.data;
  },
  getAudio: (ayahNumber) =>
    `https://cdn.islamic.network/quran/audio/128/ar.alafasy/${ayahNumber}.mp3`,
};

// ─── External: Aladhan (Prayer Times) ─────────────────────────────────────────
export const prayerAPI = {
  getTimes: async (city = 'London', country = 'UK') => {
    const date = new Date();
    const dateStr = `${date.getDate()}-${date.getMonth() + 1}-${date.getFullYear()}`;
    const res = await fetch(
      `https://api.aladhan.com/v1/timingsByCity/${dateStr}?city=${city}&country=${country}&method=2`
    );
    const data = await res.json();
    return data.data.timings;
  },
};

export default { authAPI, ayahAPI, habitAPI, reflectionAPI, guidanceAPI, quranAPI, prayerAPI };