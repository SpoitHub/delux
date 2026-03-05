const BASE = (import.meta.env.VITE_API_URL as string | undefined) ?? 'http://localhost:8000/api/v1';

export async function apiRequest<T>(
  path: string,
  options: RequestInit = {},
  token?: string | null,
): Promise<T> {
  const isFormData = options.body instanceof FormData;
  const headers: Record<string, string> = {
    // Don't set Content-Type for FormData — browser sets it with boundary
    ...(isFormData ? {} : { 'Content-Type': 'application/json' }),
    ...(options.headers as Record<string, string> | undefined),
  };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`${BASE}${path}`, { ...options, headers });

  if (!res.ok) {
    let detail = `HTTP ${res.status}`;
    try {
      const body = await res.json();
      detail =
        body.detail ??
        Object.values(body as Record<string, unknown>)?.[0]?.[0] ??
        JSON.stringify(body);
    } catch { /* ignore */ }
    throw new Error(detail);
  }

  if (res.status === 204) return undefined as unknown as T;
  return res.json() as Promise<T>;
}

export function getAuthToken(): string | null {
  return localStorage.getItem('access_token');
}
