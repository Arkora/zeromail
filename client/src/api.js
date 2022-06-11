import axios from "axios";

const API = axios.create({ baseURL: 'http://localhost:8000' })

export const sendMail = (mail) => API.post('/send',mail)