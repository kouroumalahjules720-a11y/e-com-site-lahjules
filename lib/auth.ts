const AUTH_KEY = 'ecom_admin_auth';
const AUTH_DURATION = 24 * 60 * 60 * 1000; // 24 hours

interface AuthSession {
  authenticated: boolean;
  expiresAt: number;
}

export function login(password: string, adminPassword: string): boolean {
  if (password !== adminPassword) return false;

  const session: AuthSession = {
    authenticated: true,
    expiresAt: Date.now() + AUTH_DURATION,
  };

  if (typeof window !== 'undefined') {
    sessionStorage.setItem(AUTH_KEY, JSON.stringify(session));
  }

  return true;
}

export function logout(): void {
  if (typeof window !== 'undefined') {
    sessionStorage.removeItem(AUTH_KEY);
  }
}

export function isAuthenticated(): boolean {
  if (typeof window === 'undefined') return false;

  const raw = sessionStorage.getItem(AUTH_KEY);
  if (!raw) return false;

  try {
    const session: AuthSession = JSON.parse(raw);
    if (!session.authenticated || Date.now() > session.expiresAt) {
      sessionStorage.removeItem(AUTH_KEY);
      return false;
    }
    return true;
  } catch {
    return false;
  }
}
