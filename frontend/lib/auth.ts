import { jwtDecode } from "jwt-decode";

export function getUser() {
  const token = localStorage.getItem("token");
  if (!token) return null;

  return jwtDecode(token);
}

export function isLogged() {
  return !!localStorage.getItem("token");
}

export function logout() {
  localStorage.removeItem("token");
}