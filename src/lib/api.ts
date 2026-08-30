const API_URL = import.meta.env.VITE_API_URL ?? "http://localhost:8080/api/v1"

type Envelope<T> = { code: string; message: string; data: T }

export async function apiFetch<T>(
  path: string,
  init: RequestInit = {}
): Promise<T> {
  const request = async () =>
    fetch(`${API_URL}${path}`, {
      ...init,
      credentials: "include",
      headers: {
        "Content-Type": "application/json",
        ...(init.headers ?? {}),
        ...authHeader(),
      },
    })
  let response = await request()
  if (response.status === 401 && path !== "/auth/refresh") {
    const refresh = await fetch(`${API_URL}/auth/refresh`, {
      method: "POST",
      credentials: "include",
    })
    if (refresh.ok) response = await request()
    else {
      localStorage.removeItem("access_token")
      window.location.reload()
      throw new Error("登录已过期")
    }
  }
  const payload = (await response.json().catch(() => ({}))) as Envelope<T> & {
    message?: string
  }
  if (!response.ok) throw new Error(payload.message ?? "请求失败")
  return payload.data
}

function authHeader(): Record<string, string> {
  const token = localStorage.getItem("access_token")
  return token ? { Authorization: `Bearer ${token}` } : {}
}

export { API_URL }
