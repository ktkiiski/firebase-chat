export async function request<T = any>(method: 'GET' | 'POST' | 'PUT' | 'PATCH' | 'DELETE', url: string, payload?: any) {
  const headers: Record<string, string> = {};
  if (payload) {
    headers['Content-Type'] = 'application/json';
  }
  const body = payload ? JSON.stringify(payload) : undefined;
  const response = await fetch(url, {method, headers, body});
  if (!response.ok) {
    throw response;
  }
  return await response.json() as T;
}
