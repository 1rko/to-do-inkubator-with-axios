import axios from "axios"

/*const token = "74e4a20e-3cc8-4101-a96c-824861a52b7c"
const apiKey = "0a4e82f0-3a0f-4f07-bd13-4f0796adfac4"*/

export const instance = axios.create({
  baseURL: import.meta.env.VITE_BASE_URL,
  headers: {
    Authorization: `Bearer ${import.meta.env.VITE_AUTH_TOKEN}`,
    "API-KEY": import.meta.env.VITE_API_KEY,
  },
})
