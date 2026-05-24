const STRAPI_URL = process.env.NEXT_PUBLIC_STRAPI_URL || process.env.STRAPI_URL || "http://localhost:1337";

const TOKEN_KEY = "strapi_jwt";
const USER_KEY = "strapi_user";

export interface AuthUser {
  id: number;
  username: string;
  email: string;
}

interface AuthResponse {
  jwt: string;
  user: AuthUser;
}

export function getToken() {
  if (typeof window === "undefined") {
    return null;
  }

  return localStorage.getItem(TOKEN_KEY);
}

export function getStoredUser() {
  if (typeof window === "undefined") {
    return null;
  }

  const raw = localStorage.getItem(USER_KEY);
  if (!raw) {
    return null;
  }

  try {
    return JSON.parse(raw) as AuthUser;
  } catch {
    return null;
  }
}

function persistAuth(payload: AuthResponse) {
  localStorage.setItem(TOKEN_KEY, payload.jwt);
  localStorage.setItem(USER_KEY, JSON.stringify(payload.user));
}

export function clearAuth() {
  if (typeof window === "undefined") {
    return;
  }

  localStorage.removeItem(TOKEN_KEY);
  localStorage.removeItem(USER_KEY);
  window.dispatchEvent(new Event("authChanged"));
}

export async function login(identifier: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ identifier, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Autentificare esuata");
  }

  persistAuth(data as AuthResponse);
  window.dispatchEvent(new Event("authChanged"));
  return data as AuthResponse;
}

export async function register(username: string, email: string, password: string) {
  const res = await fetch(`${STRAPI_URL}/api/auth/local/register`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ username, email, password }),
  });

  const data = await res.json();
  if (!res.ok) {
    throw new Error(data?.error?.message || "Inregistrare esuata");
  }

  persistAuth(data as AuthResponse);
  window.dispatchEvent(new Event("authChanged"));
  return data as AuthResponse;
}

export async function fetchMe() {
  const token = getToken();
  if (!token) {
    return null;
  }

  const res = await fetch(`${STRAPI_URL}/api/users/me`, {
    headers: {
      Authorization: `Bearer ${token}`,
    },
  });

  if (!res.ok) {
    clearAuth();
    return null;
  }

  const user = (await res.json()) as AuthUser;
  localStorage.setItem(USER_KEY, JSON.stringify(user));
  return user;
}

export function getStrapiUrl() {
  return STRAPI_URL;
}
