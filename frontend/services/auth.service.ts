import api from "@/lib/api";
import Cookies from 'js-cookie';

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  token: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post("/auth/token", payload);
  const token = res.data.token;

  Cookies.set('auth-token', token, { expires: 7, path: '/' });
  localStorage.setItem("token", token);
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}