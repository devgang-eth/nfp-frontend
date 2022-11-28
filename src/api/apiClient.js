import axios from "axios";

const apiHost = process.env.NEXT_PUBLIC_CHAIN === 'testnet' ? "http://localhost:3001" : "https://api.despread.studio"

export const api = axios.create({
  baseURL: apiHost,
  withCredentials: false,
  timeout: 15000,
  headers: {
    Accept: "application/json",
    "Content-Type": "application/json",
  },
});
