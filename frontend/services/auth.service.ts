import api from "@/lib/api";

type LoginPayload = {
  email: string;
  password: string;
};

type AuthResponse = {
  access_token: string;
};

export async function login(payload: LoginPayload): Promise<AuthResponse> {
  const res = await api.post("/auth/token", payload);

  const data = res.data;
  
  localStorage.setItem("token", data.access_token);

  return data;
}

export function logout() {
  localStorage.removeItem("token");
}

export function getToken() {
  return localStorage.getItem("token");
}