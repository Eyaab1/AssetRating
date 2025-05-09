// src/app/shared/utils/storage.util.ts
export function getSafeLocalStorage(): Storage | null {
    return typeof window !== 'undefined' ? localStorage : null;
  }
  