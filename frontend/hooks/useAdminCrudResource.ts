'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminAuthHeaders, parseApiError } from '@/lib/adminApi';

type AdminCrudMessages = {
  loadError: string;
  connectError: string;
  deleteError: string;
  saveError: string;
};

type AdminResourceId = number | string;

export function useAdminCrudResource<TItem, TPayload>(
  resourcePath: string,
  messages: AdminCrudMessages
) {
  const [items, setItems] = useState<TItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await fetch(resourcePath, {
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? (data as TItem[]) : []);
      } else {
        setError(await parseApiError(res, messages.loadError));
      }
    } catch {
      setError(messages.connectError);
    } finally {
      setLoading(false);
    }
  }, [messages.connectError, messages.loadError, resourcePath]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const deleteItem = useCallback(
    async (id: AdminResourceId): Promise<string | null> => {
      try {
        const res = await fetch(`${resourcePath}/${id}`, {
          method: 'DELETE',
          headers: adminAuthHeaders(),
        });
        if (!res.ok) {
          return await parseApiError(res, messages.deleteError);
        }
        await refresh();
        return null;
      } catch {
        return messages.deleteError;
      }
    },
    [messages.deleteError, refresh, resourcePath]
  );

  const saveItem = useCallback(
    async (payload: TPayload, id?: AdminResourceId): Promise<string | null> => {
      const url = typeof id === 'undefined' ? resourcePath : `${resourcePath}/${id}`;
      const method = typeof id === 'undefined' ? 'POST' : 'PUT';
      try {
        const res = await fetch(url, {
          method,
          headers: adminAuthHeaders(true),
          body: JSON.stringify(payload),
        });
        if (!res.ok) {
          return await parseApiError(res, messages.saveError);
        }
        await refresh();
        return null;
      } catch {
        return messages.saveError;
      }
    },
    [messages.saveError, refresh, resourcePath]
  );

  return {
    items,
    loading,
    error,
    refresh,
    deleteItem,
    saveItem,
  };
}
