let isAuthenticated = false;
let authExpiresAt = 0;
let authCheckPromise: Promise<boolean> | null = null;

// 5 minutes is a good default
const AUTH_TTL_MS = 5 * 60 * 1000;

export async function ensureAuthStatus(): Promise<boolean> {
  const now = Date.now();

  // Cache still valid
  if (now < authExpiresAt) {
    return isAuthenticated;
  }

  // Prevent parallel calls
  if (!authCheckPromise) {
    authCheckPromise = (async () => {
      try {
        const res = await fetch("/api/auth/me", {
          credentials: "include",
        });

        isAuthenticated = res.ok;
      } catch {
        isAuthenticated = false;
      } finally {
        authExpiresAt = Date.now() + AUTH_TTL_MS;
        authCheckPromise = null;
      }

      return isAuthenticated;
    })();
  }

  return authCheckPromise;
}

export function getAuthStatus(): boolean {
  return Date.now() < authExpiresAt && isAuthenticated;
}

export function resetAuthStatus() {
  isAuthenticated = false;
  authExpiresAt = 0;
}
