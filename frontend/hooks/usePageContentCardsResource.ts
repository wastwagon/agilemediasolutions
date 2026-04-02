'use client';

import { useCallback, useEffect, useState } from 'react';
import { adminAuthHeaders, adminFetch, parseApiError } from '@/lib/adminApi';
import type { PageContentCard, PageContentCardPayload } from '@/types/adminEntities';

type Messages = {
  loadError: string;
  connectError: string;
  deleteError: string;
  saveError: string;
};

export function usePageContentCardsResource(context: string, messages: Messages) {
  const [items, setItems] = useState<PageContentCard[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const listUrl = `/api/page-content-cards?context=${encodeURIComponent(context)}`;

  const refresh = useCallback(async () => {
    setLoading(true);
    setError('');
    try {
      const res = await adminFetch(listUrl, {
        headers: adminAuthHeaders(),
      });
      if (res.ok) {
        const data = await res.json();
        setItems(Array.isArray(data) ? (data as PageContentCard[]) : []);
      } else {
        setError(await parseApiError(res, messages.loadError));
      }
    } catch {
      setError(messages.connectError);
    } finally {
      setLoading(false);
    }
  }, [listUrl, messages.connectError, messages.loadError]);

  useEffect(() => {
    void refresh();
  }, [refresh]);

  const deleteItem = useCallback(
    async (id: number): Promise<string | null> => {
      try {
        const res = await adminFetch(`/api/page-content-cards/${id}`, {
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
    [messages.deleteError, refresh]
  );

  const saveItem = useCallback(
    async (payload: PageContentCardPayload, id?: number): Promise<string | null> => {
      const url = typeof id === 'undefined' ? '/api/page-content-cards' : `/api/page-content-cards/${id}`;
      const method = typeof id === 'undefined' ? 'POST' : 'PUT';
      const body =
        typeof id === 'undefined'
          ? JSON.stringify({ ...payload, context })
          : JSON.stringify(payload);
      try {
        const res = await adminFetch(url, {
          method,
          headers: adminAuthHeaders(true),
          body,
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
    [context, messages.saveError, refresh]
  );

  return { items, loading, error, refresh, deleteItem, saveItem };
}
