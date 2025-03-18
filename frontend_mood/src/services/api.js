import axios from "axios";

const API_URL = "http://127.0.0.1:8000/api";

export const signup = (data) => axios.post(`${API_URL}/signup/`, data);
export const signin = (data) => axios.post(`${API_URL}/signin/`, data);
export const submitMood = (data) => axios.post(`${API_URL}/submit-mood/`, data);
export const getMoodRatings = (user_id) => axios.get(`${API_URL}/get-mood-ratings/${user_id}/`);
export const getMoodStreak = (user_id) => axios.get(`${API_URL}/get-mood-streak/${user_id}/`);
