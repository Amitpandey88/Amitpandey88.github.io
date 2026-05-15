import axios from 'axios'

const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000'
})

export const getSummary = async () => (await API.get('/dashboard-summary')).data
export const getAlerts = async () => (await API.get('/alerts')).data
export const getRiskZones = async () => (await API.get('/high-risk-zones')).data
export const getHeatmap = async () => (await API.get('/heatmap-data')).data
export const predictCongestion = async (payload) => (await API.post('/predict', payload)).data
export const getRoutes = async (payload) => (await API.post('/route-recommendation', payload)).data
export const chat = async (message) => (await API.post('/chat', { message })).data
