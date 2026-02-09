import { api } from "./api"

export async function register(email: string, username: string, password: string) {
  const res = await api.post("users/register/", { email, username, password, password_confirm: password })
  return res.data
}

export async function login(email: string, password: string) {
  const res = await api.post("users/login/", { email, password })
  localStorage.setItem("access", res.data.access)
  localStorage.setItem("refresh", res.data.refresh)
  return res.data
}

export async function getMe() {
  const res = await api.get("users/me/")
  return res.data
}

