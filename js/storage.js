const STORAGE_KEY = "tvdeRegistos";

export function loadRegistos() {
  return JSON.parse(localStorage.getItem(STORAGE_KEY)) || [];
}

export function saveRegistos(registros) {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(registros));
}
