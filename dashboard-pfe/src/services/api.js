import axios from 'axios'

// Instance Axios
const API = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  timeout: 60000,
})

// =====================
// SENSOR SERVICE
// =====================
export const sensorService = {

  // 🔥 Get live sensors (optionnel par ligne)
  getLive: (ligne = null) => {
    return API.get('/sensors/live', {
      params: ligne ? { ligne } : {}
    }).then(res => res.data)
  },

  // 📊 Historique d'un capteur
  getHistory: (sensor_id, limit = 100) => {
    return API.get('/sensors/history', {
      params: { sensor_id, limit }
    }).then(res => res.data)
  },

  // 📍 Liste des lignes
  getLines: () => {
    return API.get('/sensors/lines')
      .then(res => res.data)
  }
}

// =====================
// ALERT SERVICE
// =====================
export const alertService = {
  getActive: () => {
    return API.get('/alerts/active')
      .then(res => res.data)
  }
}

// =====================
// INCIDENT SERVICE
// =====================
export const incidentService = {

  list: (status, ligne) => {
    return API.get('/incidents/', {
      params: { status, ligne }
    }).then(res => res.data)
  },

  update: (id, status, action_taken) => {
    return API.patch(`/incidents/${id}`, {
      status,
      action_taken
    }).then(res => res.data)
  }
}

// =====================
// AI SERVICE
// =====================
export const aiService = {
  query: (question) => {
    return API.post('/ai/query', { question })
      .then(res => res.data)
  }
}

// =====================
// THRESHOLD SERVICE
// =====================
export const thresholdService = {

  list: () => {
    return API.get('/thresholds/')
      .then(res => res.data)
  },

  create: (data) => {
    return API.post('/thresholds/', data)
      .then(res => res.data)
  }
}