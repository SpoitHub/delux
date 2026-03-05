const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export interface ApiUser {
  id: number;
  email: string;
  first_name: string;
  last_name: string;
  phone: string;
  is_organizer: boolean;
}

async function request<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail = body.detail ?? body.email?.[0] ?? body.non_field_errors?.[0] ?? JSON.stringify(body);
    } catch {/* ignore */}
    throw new Error(detail);
  }

  // 204 No Content
  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

// ─── Auth endpoints ────────────────────────────────────────────────────────────

export function apiRegister(data: {
  email: string;
  password: string;
  first_name?: string;
  last_name?: string;
  phone?: string;
}): Promise<ApiUser> {
  return request<ApiUser>('/auth/register/', { method: 'POST', body: JSON.stringify(data) });
}

export function apiLogin(email: string, password: string): Promise<{
  access: string;
  refresh: string;
  user: ApiUser;
}> {
  return request('/auth/login/', { method: 'POST', body: JSON.stringify({ email, password }) });
}

export function apiLogout(refresh: string, token: string): Promise<void> {
  return request('/auth/logout/', {
    method: 'POST',
    body: JSON.stringify({ refresh }),
  }, token);
}

export function apiGetMe(token: string): Promise<ApiUser> {
  return request<ApiUser>('/auth/me/', {}, token);
}

export function apiUpdateProfile(
  data: { first_name?: string; last_name?: string; phone?: string },
  token: string,
): Promise<ApiUser> {
  return request<ApiUser>('/auth/me/', { method: 'PATCH', body: JSON.stringify(data) }, token);
}

export function apiRefreshToken(refresh: string): Promise<{ access: string }> {
  return request('/auth/token/refresh/', { method: 'POST', body: JSON.stringify({ refresh }) });
}
