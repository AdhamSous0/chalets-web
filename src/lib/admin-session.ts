/** تخزين توكن جلسة الأدمن — منفصل عن جلسة الزبون بـ AppContext لأنه صلاحية مختلفة تمامًا */

const KEY = "chalets:adminToken";

export function getAdminToken(): string | null {
  if (typeof window === "undefined") return null;
  return localStorage.getItem(KEY);
}

export function setAdminToken(token: string) {
  localStorage.setItem(KEY, token);
}

export function clearAdminToken() {
  localStorage.removeItem(KEY);
}
