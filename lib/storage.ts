const KEY = "aiuf:checklist:v1";

export type ChecklistState = Record<string, boolean>;

export function loadChecklist(): ChecklistState {
  if (typeof window === "undefined") return {};
  try {
    const raw = window.localStorage.getItem(KEY);
    return raw ? (JSON.parse(raw) as ChecklistState) : {};
  } catch {
    return {};
  }
}

export function saveChecklist(state: ChecklistState): void {
  if (typeof window === "undefined") return;
  try {
    window.localStorage.setItem(KEY, JSON.stringify(state));
  } catch {
    // localStorage unavailable (private mode / quota) — fail silently
  }
}
