import type { RefObject } from 'react';

export type TokenRef = RefObject<string | null> | null;

export type ApiFetchOptions = RequestInit & {
  tokenRef?: TokenRef;
  headers?: HeadersInit;
};

export async function apiFetch(url: string, options: ApiFetchOptions = {}) {
  const { tokenRef, headers, ...init } = options;

  const token = tokenRef?.current;
  const mergedHeaders: HeadersInit = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...(headers ?? {}),
  };

  return fetch(url, { ...init, headers: mergedHeaders });
}
