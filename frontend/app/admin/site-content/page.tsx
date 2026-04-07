'use client';

import React, { useEffect, useMemo, useState } from 'react';
import { adminAuthHeaders, adminFetch, parseApiError } from '@/lib/adminApi';
import { AdminErrorBanner, AdminLoadingState, AdminPageHeader } from '@/components/admin/AdminPageUi';
import { AdminEditorCard } from '@/components/admin/AdminFormUi';
import AdminImageUpload from '@/components/AdminImageUpload';
import AdminVideoUpload from '@/components/AdminVideoUpload';
import MediaLibraryPicker from '@/components/MediaLibraryPicker';
import { SITE_SECTION_DEFINITIONS, type SiteSectionField } from '@/lib/siteSectionCms';

type SectionContentMap = Record<string, Record<string, string>>;
type PairRow = { left: string; right: string };

function parseLineList(value: string): string[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean);
}

function toLineList(items: string[]): string {
  return items
    .map((item) => item.trim())
    .filter(Boolean)
    .join('\n');
}

function parsePairList(value: string): PairRow[] {
  return value
    .split('\n')
    .map((line) => line.trim())
    .filter(Boolean)
    .map((line) => {
      const [left, ...rest] = line.split('::');
      return {
        left: (left || '').trim(),
        right: rest.join('::').trim(),
      };
    });
}

function toPairList(rows: PairRow[]): string {
  return rows
    .map((row) => ({ left: row.left.trim(), right: row.right.trim() }))
    .filter((row) => row.left || row.right)
    .map((row) => `${row.left} :: ${row.right}`)
    .join('\n');
}

function getFieldEditorKind(
  field: SiteSectionField
): 'text' | 'textarea' | 'list' | 'pairs' | 'url' | 'image' | 'video' | 'select' {
  if (field.kind) return field.kind;
  const id = field.id.toLowerCase();
  const l = field.label.toLowerCase();
  if (id.includes('cards')) return 'pairs';
  if (id.includes('list') || id.includes('bullets')) return 'list';
  if (l.includes('title :: description')) return 'pairs';
  if (l.includes('one item per line')) return 'list';
  if (field.multiline) return 'textarea';
  return 'text';
}

function getFriendlyFieldLabel(label: string): string {
  const trimmed = label.replace(/\s*\([^)]*\)\s*$/g, '').trim();
  const normalized = trimmed.toLowerCase();

  const explicitMap: Record<string, string> = {
    'hero label': 'Hero eyebrow text',
    'section label': 'Section eyebrow text',
    'section link label': 'Section link text',
    'top-right link label': 'Top-right link text',
    'connections label': 'Connections eyebrow text',
    'connections link label': 'Connections link text',
    'quick brief label': 'Quick brief eyebrow text',
    'showcase section label': 'Showcase eyebrow text',
    'highlights section label': 'Highlights eyebrow text',
    'identity label': 'Identity eyebrow text',
    'presence label': 'Presence eyebrow text',
    'press card cta label': 'Press card button text',
    'social cta label': 'Social button text',
    'final cta label': 'Final button text',
    'cta primary label': 'Primary button text',
    'cta secondary label': 'Secondary button text',
    'cta tertiary label': 'Tertiary button text',
    'cta quaternary label': 'Quaternary button text',
    'final cta primary label': 'Final primary button text',
    'final cta secondary label': 'Final secondary button text',
  };

  if (explicitMap[normalized]) return explicitMap[normalized];

  let next = trimmed;

  if (/\bcta\b/i.test(trimmed)) {
    next = next
      .replace(/\bCTA\b/gi, '')
      .replace(/\blabel\b/gi, 'button text');
  }

  next = next
    .replace(/\bsub-?intro\b/gi, 'supporting paragraph')
    .replace(/\bintro\b/gi, 'intro paragraph')
    .replace(/\bsub-?title\b/gi, 'supporting paragraph')
    .replace(/\btagline\b/gi, 'tagline text')
    .replace(/\bbody text\b/gi, 'body paragraph')
    .replace(/\bbody\b/gi, 'body paragraph')
    .replace(/\btitle\b/gi, 'headline')
    .replace(/\blabel\b/gi, 'text')
    .replace(/\s{2,}/g, ' ')
    .trim();

  return next.charAt(0).toUpperCase() + next.slice(1);
}

function getFriendlyHint(
  kind: 'text' | 'textarea' | 'list' | 'pairs' | 'url' | 'image' | 'video' | 'select',
  fieldMultiline: boolean
): string {
  if (kind === 'pairs') return 'Add cards with a title and supporting description.';
  if (kind === 'list') return 'Add and reorder talking points as separate items.';
  if (kind === 'url') return 'Paste a URL, or pick an uploaded file from the library if applicable.';
  if (kind === 'video') return 'Upload MP4/WebM, pick from the media library, or paste a path (/videos/…) or full URL.';
  if (kind === 'image') return 'Upload, pick from the media library, or paste an image URL.';
  if (kind === 'select') return 'Choose a preset.';
  if (fieldMultiline) return 'Write a longer paragraph for this section.';
  return '';
}

function getFieldPlaceholder(
  kind: 'text' | 'textarea' | 'list' | 'pairs' | 'url' | 'image' | 'video' | 'select',
  friendlyLabel: string
): string {
  const label = friendlyLabel.toLowerCase();

  if (kind === 'list') return 'Add one key point';
  if (kind === 'pairs') return '';
  if (kind === 'url') return 'https://…';
  if (kind === 'video') return '/videos/… or https://…';
  if (kind === 'image') return '/uploads/… or https://…';
  if (kind === 'select') return '';
  if (label.includes('button text')) return 'e.g. Learn more';
  if (label.includes('email')) return 'e.g. hello@agilemedia.africa';
  if (label.includes('headline')) return 'e.g. Empowering bold African storytelling';
  if (label.includes('supporting paragraph') || label.includes('intro paragraph') || label.includes('body paragraph')) {
    return 'Write a clear, reader-friendly paragraph';
  }
  if (label.includes('eyebrow text')) return 'e.g. Signature Events';
  if (label.includes('link text')) return 'e.g. View all';
  return 'Enter text';
}

export default function AdminSiteContentPage() {
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [savingKey, setSavingKey] = useState('');
  const [notice, setNotice] = useState('');
  const [formByKey, setFormByKey] = useState<SectionContentMap>({});
  const [initialFormByKey, setInitialFormByKey] = useState<SectionContentMap>({});
  const [search, setSearch] = useState('');
  const [expandedKeys, setExpandedKeys] = useState<string[]>([]);
  const [showDirtyOnly, setShowDirtyOnly] = useState(false);

  const sectionDefaults = useMemo(() => {
    const map: SectionContentMap = {};
    SITE_SECTION_DEFINITIONS.forEach((section) => {
      map[section.key] = section.fields.reduce<Record<string, string>>((acc, f) => {
        acc[f.id] = '';
        return acc;
      }, {});
    });
    return map;
  }, []);

  const sectionTitleByKey = useMemo(() => {
    return Object.fromEntries(SITE_SECTION_DEFINITIONS.map((s) => [s.key, s.title]));
  }, []);

  useEffect(() => {
    const load = async () => {
      setLoading(true);
      setError('');
      try {
        const res = await adminFetch('/api/site-sections', {
          headers: adminAuthHeaders(),
        });
        if (!res.ok) {
          throw new Error(await parseApiError(res, 'Could not load site content sections.'));
        }
        const rows = await res.json();
        const next: SectionContentMap = { ...sectionDefaults };
        if (Array.isArray(rows)) {
          rows.forEach((r: any) => {
            if (!r?.section_key || !next[r.section_key]) return;
            const content = r.content_json && typeof r.content_json === 'object' ? r.content_json : {};
            next[r.section_key] = {
              ...next[r.section_key],
              ...Object.fromEntries(Object.entries(content).map(([k, v]) => [k, typeof v === 'string' ? v : ''])),
            };
          });
        }
        setFormByKey(next);
        setInitialFormByKey(next);
        setExpandedKeys(SITE_SECTION_DEFINITIONS.map((s) => s.key));
      } catch (e: any) {
        setError(e?.message || 'Could not load site content sections.');
      } finally {
        setLoading(false);
      }
    };
    load();
  }, [sectionDefaults]);

  const setField = (key: string, fieldId: string, value: string) => {
    setNotice('');
    setFormByKey((prev) => ({
      ...prev,
      [key]: {
        ...(prev[key] || {}),
        [fieldId]: value,
      },
    }));
  };

  const setListItem = (key: string, fieldId: string, idx: number, value: string) => {
    const current = parseLineList(formByKey[key]?.[fieldId] || '');
    const next = [...current];
    next[idx] = value;
    setField(key, fieldId, toLineList(next));
  };

  const addListItem = (key: string, fieldId: string) => {
    const current = parseLineList(formByKey[key]?.[fieldId] || '');
    setField(key, fieldId, toLineList([...current, '']));
  };

  const removeListItem = (key: string, fieldId: string, idx: number) => {
    const current = parseLineList(formByKey[key]?.[fieldId] || '');
    setField(
      key,
      fieldId,
      toLineList(current.filter((_, i) => i !== idx))
    );
  };

  const setPairField = (key: string, fieldId: string, idx: number, side: 'left' | 'right', value: string) => {
    const current = parsePairList(formByKey[key]?.[fieldId] || '');
    const next = [...current];
    const row = next[idx] || { left: '', right: '' };
    next[idx] = { ...row, [side]: value };
    setField(key, fieldId, toPairList(next));
  };

  const addPairRow = (key: string, fieldId: string) => {
    const current = parsePairList(formByKey[key]?.[fieldId] || '');
    setField(key, fieldId, toPairList([...current, { left: '', right: '' }]));
  };

  const removePairRow = (key: string, fieldId: string, idx: number) => {
    const current = parsePairList(formByKey[key]?.[fieldId] || '');
    setField(
      key,
      fieldId,
      toPairList(current.filter((_, i) => i !== idx))
    );
  };

  const filteredSections = useMemo(() => {
    const q = search.trim().toLowerCase();
    if (!q) return SITE_SECTION_DEFINITIONS;
    return SITE_SECTION_DEFINITIONS.filter((section) => {
      if (section.key.toLowerCase().includes(q)) return true;
      if (section.title.toLowerCase().includes(q)) return true;
      if (section.description.toLowerCase().includes(q)) return true;
      return section.fields.some((f) => f.label.toLowerCase().includes(q) || f.id.toLowerCase().includes(q));
    });
  }, [search]);

  const dirtyKeys = useMemo(() => {
    return SITE_SECTION_DEFINITIONS
      .map((s) => s.key)
      .filter((key) => JSON.stringify(formByKey[key] || {}) !== JSON.stringify(initialFormByKey[key] || {}));
  }, [formByKey, initialFormByKey]);
  const hasUnsavedChanges = dirtyKeys.length > 0;

  const isFieldDirty = (sectionKey: string, fieldId: string): boolean => {
    const current = formByKey[sectionKey]?.[fieldId] || '';
    const initial = initialFormByKey[sectionKey]?.[fieldId] || '';
    return current !== initial;
  };

  useEffect(() => {
    if (!hasUnsavedChanges) return;

    const confirmMessage = 'You have unsaved changes. Leave this page anyway?';

    const handleBeforeUnload = (event: BeforeUnloadEvent) => {
      event.preventDefault();
      event.returnValue = '';
    };

    const handleDocumentClick = (event: MouseEvent) => {
      const target = event.target as HTMLElement | null;
      const anchor = target?.closest?.('a[href]') as HTMLAnchorElement | null;
      if (!anchor) return;

      const href = anchor.getAttribute('href') || '';
      const targetAttr = (anchor.getAttribute('target') || '').toLowerCase();
      if (!href || href.startsWith('#') || href.startsWith('javascript:') || targetAttr === '_blank') return;

      const shouldContinue = window.confirm(confirmMessage);
      if (!shouldContinue) {
        event.preventDefault();
        event.stopPropagation();
      }
    };

    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('click', handleDocumentClick, true);

    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('click', handleDocumentClick, true);
    };
  }, [hasUnsavedChanges]);

  const visibleSectionCount = useMemo(() => {
    if (!showDirtyOnly) return filteredSections.length;
    return filteredSections.filter((section) => dirtyKeys.includes(section.key)).length;
  }, [filteredSections, dirtyKeys, showDirtyOnly]);

  const dirtyFieldCount = useMemo(() => {
    return SITE_SECTION_DEFINITIONS.reduce((count, section) => {
      return (
        count +
        section.fields.reduce((fieldCount, field) => {
          return fieldCount + (isFieldDirty(section.key, field.id) ? 1 : 0);
        }, 0)
      );
    }, 0);
  }, [formByKey, initialFormByKey]);

  const saveSection = async (key: string) => {
    setSavingKey(key);
    setNotice('');
    try {
      const payload = formByKey[key] || {};
      const res = await adminFetch(`/api/site-sections/${encodeURIComponent(key)}`, {
        method: 'PUT',
        headers: adminAuthHeaders(true),
        body: JSON.stringify({ content_json: payload }),
      });
      if (!res.ok) {
        throw new Error(await parseApiError(res, 'Could not save section.'));
      }
      setInitialFormByKey((prev) => ({
        ...prev,
        [key]: { ...(formByKey[key] || {}) },
      }));
      setNotice(`Saved: ${sectionTitleByKey[key] || key}`);
    } catch (e: any) {
      setError(e?.message || 'Could not save section.');
    } finally {
      setSavingKey('');
    }
  };

  const saveAllDirty = async () => {
    if (dirtyKeys.length === 0) {
      setNotice('No unsaved changes.');
      return;
    }
    setSavingKey('__all__');
    setNotice('');
    setError('');
    for (const key of dirtyKeys) {
      try {
        const payload = formByKey[key] || {};
        const res = await adminFetch(`/api/site-sections/${encodeURIComponent(key)}`, {
          method: 'PUT',
          headers: adminAuthHeaders(true),
          body: JSON.stringify({ content_json: payload }),
        });
        if (!res.ok) {
          throw new Error(await parseApiError(res, `Could not save section: ${key}`));
        }
        setInitialFormByKey((prev) => ({
          ...prev,
          [key]: { ...(formByKey[key] || {}) },
        }));
      } catch (e: any) {
        setError(e?.message || `Could not save section: ${key}`);
        setSavingKey('');
        return;
      }
    }
    setSavingKey('');
    setNotice(`Saved ${dirtyKeys.length} section${dirtyKeys.length === 1 ? '' : 's'}.`);
  };

  const resetSection = (key: string) => {
    setFormByKey((prev) => ({
      ...prev,
      [key]: { ...(initialFormByKey[key] || {}) },
    }));
    setNotice(`Reverted: ${sectionTitleByKey[key] || key}`);
  };

  const resetAllDirty = () => {
    if (dirtyKeys.length === 0) {
      setNotice('No unsaved changes.');
      return;
    }
    setFormByKey((prev) => {
      const next = { ...prev };
      dirtyKeys.forEach((key) => {
        next[key] = { ...(initialFormByKey[key] || {}) };
      });
      return next;
    });
    setNotice(`Reverted ${dirtyKeys.length} section${dirtyKeys.length === 1 ? '' : 's'}.`);
  };

  const expandDirtySections = () => {
    if (dirtyKeys.length === 0) {
      setNotice('No unsaved changes.');
      return;
    }
    setExpandedKeys(dirtyKeys);
  };

  if (loading) return <AdminLoadingState />;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <AdminPageHeader
        title="Site Content"
        subtitle="Manage public section copy for core pages from one place."
        addLabel="Refresh"
        isAdding={false}
        onAdd={() => window.location.reload()}
      />

      <AdminErrorBanner message={error} />
      {notice ? (
        <div style={{ padding: '0.9rem 1rem', background: '#ECFDF5', color: '#065F46', borderRadius: 10, marginBottom: '1rem', fontWeight: 600 }}>
          {notice}
        </div>
      ) : null}

      <div style={{ display: 'grid', gap: '0.6rem', marginBottom: '1rem' }}>
        <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center', padding: '0.6rem 0.75rem', borderRadius: 10, background: '#F8FAFC', border: '1px solid var(--color-border)' }}>
          <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)', fontWeight: 600 }}>
            {dirtyFieldCount} changed field{dirtyFieldCount === 1 ? '' : 's'} across {dirtyKeys.length} section{dirtyKeys.length === 1 ? '' : 's'}
          </div>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
            onClick={expandDirtySections}
            disabled={dirtyKeys.length === 0}
          >
            Expand changed sections
          </button>
        </div>
        <div style={{ display: 'flex', gap: '0.6rem', flexWrap: 'wrap', alignItems: 'center' }}>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Filter sections or fields..."
            style={{ minWidth: 280, flex: 1, borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.62rem 0.74rem' }}
          />
          <button type="button" className="btn btn-outline" style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }} onClick={() => setExpandedKeys(SITE_SECTION_DEFINITIONS.map((s) => s.key))}>
            Expand all
          </button>
          <button type="button" className="btn btn-outline" style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }} onClick={() => setExpandedKeys([])}>
            Collapse all
          </button>
          <button
            type="button"
            className="btn btn-primary"
            style={{ fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 }}
            onClick={saveAllDirty}
            disabled={savingKey === '__all__'}
          >
            {savingKey === '__all__' ? 'Saving all…' : `Save all (${dirtyKeys.length})`}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
            onClick={() => setShowDirtyOnly((prev) => !prev)}
          >
            {showDirtyOnly ? 'Show all sections' : 'Show changed only'}
          </button>
          <button
            type="button"
            className="btn btn-outline"
            style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
            onClick={resetAllDirty}
            disabled={savingKey === '__all__' || dirtyKeys.length === 0}
          >
            Reset all unsaved
          </button>
        </div>
        <div style={{ fontSize: '0.8rem', color: 'var(--color-text-muted)' }}>
          {visibleSectionCount} section{visibleSectionCount === 1 ? '' : 's'} shown · {dirtyKeys.length} unsaved
        </div>
      </div>

      <div style={{ display: 'grid', gap: '1rem' }}>
        {filteredSections.map((section) => {
          const data = formByKey[section.key] || {};
          const dirty = dirtyKeys.includes(section.key);
          if (showDirtyOnly && !dirty) return null;
          const expanded = expandedKeys.includes(section.key);
          const visibleFields = showDirtyOnly
            ? section.fields.filter((field) => isFieldDirty(section.key, field.id))
            : section.fields;
          return (
            <AdminEditorCard key={section.key} title={`${section.title}${dirty ? ' *' : ''}`}>
              <div style={{ display: 'flex', justifyContent: 'space-between', gap: '0.6rem', alignItems: 'center', marginTop: '-0.4rem', marginBottom: '0.9rem', flexWrap: 'wrap' }}>
                <p style={{ margin: 0, color: 'var(--color-text-muted)', fontSize: '0.92rem' }}>
                  {section.description}
                </p>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
                  onClick={() =>
                    setExpandedKeys((prev) =>
                      prev.includes(section.key) ? prev.filter((k) => k !== section.key) : [...prev, section.key]
                    )
                  }
                >
                  {expanded ? 'Collapse' : 'Expand'}
                </button>
              </div>

              {!expanded ? null : (
                <>
              <div style={{ display: 'grid', gap: '0.85rem' }}>
                {visibleFields.map((field) => {
                  const kind = getFieldEditorKind(field);
                  const friendlyLabel = getFriendlyFieldLabel(field.label);
                  const hint = getFriendlyHint(kind, Boolean(field.multiline));
                  const placeholder = getFieldPlaceholder(kind, friendlyLabel);
                  const fieldDirty = isFieldDirty(section.key, field.id);
                  return (
                  <label
                    key={field.id}
                    style={{
                      display: 'grid',
                      gap: '0.35rem',
                      border: fieldDirty ? '1px solid #99F6E4' : '1px solid transparent',
                      background: fieldDirty ? '#F0FDFA' : 'transparent',
                      borderRadius: 10,
                      padding: fieldDirty ? '0.5rem' : 0,
                    }}
                  >
                    <span style={{ fontSize: '0.78rem', fontWeight: 700, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.04em', display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                      {friendlyLabel}
                      {fieldDirty ? (
                        <span
                          title="Unsaved change"
                          style={{ width: 8, height: 8, borderRadius: '50%', background: '#0F766E', display: 'inline-block' }}
                        />
                      ) : null}
                    </span>
                    {hint ? (
                      <span style={{ marginTop: '-0.1rem', fontSize: '0.74rem', color: 'var(--color-text-muted)' }}>
                        {hint}
                      </span>
                    ) : null}
                    {(() => {
                      if (kind === 'select' && field.options?.length) {
                        return (
                          <select
                            value={data[field.id] ?? ''}
                            onChange={(e) => setField(section.key, field.id, e.target.value)}
                            style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.64rem 0.78rem' }}
                          >
                            <option value="">Default (inherit)</option>
                            {field.options.map((opt) => (
                              <option key={opt.value} value={opt.value}>
                                {opt.label}
                              </option>
                            ))}
                          </select>
                        );
                      }

                      if (kind === 'url') {
                        return (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={data[field.id] || ''}
                              onChange={(e) => setField(section.key, field.id, e.target.value)}
                              placeholder={placeholder}
                              style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.64rem 0.78rem' }}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                              <MediaLibraryPicker
                                buttonLabel="Choose file URL from library"
                                onSelect={(url) => setField(section.key, field.id, url)}
                              />
                            </div>
                          </div>
                        );
                      }

                      if (kind === 'video') {
                        return (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={data[field.id] || ''}
                              onChange={(e) => setField(section.key, field.id, e.target.value)}
                              placeholder={placeholder}
                              style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.64rem 0.78rem' }}
                            />
                            <AdminVideoUpload
                              currentUrl={data[field.id] || ''}
                              onUploadSuccess={(url) => setField(section.key, field.id, url)}
                              label="Upload background video"
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                              <MediaLibraryPicker
                                buttonLabel="Choose video URL from library"
                                onSelect={(url) => setField(section.key, field.id, url)}
                                preferVideo
                              />
                            </div>
                          </div>
                        );
                      }

                      if (kind === 'image') {
                        return (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            <input
                              type="text"
                              value={data[field.id] || ''}
                              onChange={(e) => setField(section.key, field.id, e.target.value)}
                              placeholder={placeholder}
                              style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.64rem 0.78rem' }}
                            />
                            <div style={{ display: 'flex', flexWrap: 'wrap', gap: '0.5rem', alignItems: 'center' }}>
                              <AdminImageUpload
                                currentUrl={data[field.id] || ''}
                                onUploadSuccess={(url) => setField(section.key, field.id, url)}
                                label="Upload image"
                              />
                              <MediaLibraryPicker
                                buttonLabel="Choose from library"
                                onSelect={(url) => setField(section.key, field.id, url)}
                              />
                            </div>
                          </div>
                        );
                      }

                      if (kind === 'pairs') {
                        const rows = parsePairList(data[field.id] || '');
                        const renderedRows = rows.length > 0 ? rows : [{ left: '', right: '' }];
                        const leftPh = field.pairLeftPlaceholder || 'Card headline';
                        const rightPh = field.pairRightPlaceholder || 'Supporting paragraph';
                        const rightIsUrl = Boolean(field.pairRightPlaceholder?.includes('http') || field.id.toLowerCase().includes('link'));
                        return (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {renderedRows.map((row, idx) => (
                              <div key={`${field.id}-${idx}`} style={{ display: 'grid', gap: '0.45rem', border: '1px solid var(--color-border)', borderRadius: 10, padding: '0.55rem' }}>
                                <input
                                  type="text"
                                  value={row.left}
                                  onChange={(e) => setPairField(section.key, field.id, idx, 'left', e.target.value)}
                                  placeholder={leftPh}
                                  style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '0.5rem 0.6rem' }}
                                />
                                {rightIsUrl ? (
                                  <div style={{ display: 'grid', gap: '0.35rem' }}>
                                    <input
                                      type="text"
                                      value={row.right}
                                      onChange={(e) => setPairField(section.key, field.id, idx, 'right', e.target.value)}
                                      placeholder={rightPh}
                                      style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '0.5rem 0.6rem' }}
                                    />
                                    <MediaLibraryPicker
                                      buttonLabel="Pick URL from library"
                                      onSelect={(url) => setPairField(section.key, field.id, idx, 'right', url)}
                                    />
                                  </div>
                                ) : (
                                  <textarea
                                    rows={2}
                                    value={row.right}
                                    onChange={(e) => setPairField(section.key, field.id, idx, 'right', e.target.value)}
                                    placeholder={rightPh}
                                    style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '0.55rem 0.6rem', resize: 'vertical' }}
                                  />
                                )}
                                <div style={{ display: 'flex', justifyContent: 'flex-end' }}>
                                  <button
                                    type="button"
                                    className="btn btn-outline"
                                    style={{ fontSize: '0.72rem', padding: '0.26rem 0.44rem', borderRadius: 7, lineHeight: 1.2 }}
                                    onClick={() => removePairRow(section.key, field.id, idx)}
                                  >
                                    Remove row
                                  </button>
                                </div>
                              </div>
                            ))}
                            <div>
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
                                onClick={() => addPairRow(section.key, field.id)}
                              >
                                Add row
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (kind === 'list') {
                        const items = parseLineList(data[field.id] || '');
                        const renderedItems = items.length > 0 ? items : [''];
                        return (
                          <div style={{ display: 'grid', gap: '0.5rem' }}>
                            {renderedItems.map((item, idx) => (
                              <div key={`${field.id}-${idx}`} style={{ display: 'flex', gap: '0.45rem', alignItems: 'center' }}>
                                <input
                                  type="text"
                                  value={item}
                                  onChange={(e) => setListItem(section.key, field.id, idx, e.target.value)}
                                  placeholder={placeholder}
                                  style={{ width: '100%', borderRadius: 8, border: '1px solid var(--color-border)', padding: '0.5rem 0.6rem' }}
                                />
                                <button
                                  type="button"
                                  className="btn btn-outline"
                                  style={{ fontSize: '0.72rem', padding: '0.26rem 0.44rem', borderRadius: 7, lineHeight: 1.2 }}
                                  onClick={() => removeListItem(section.key, field.id, idx)}
                                >
                                  Remove
                                </button>
                              </div>
                            ))}
                            <div>
                              <button
                                type="button"
                                className="btn btn-outline"
                                style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
                                onClick={() => addListItem(section.key, field.id)}
                              >
                                Add item
                              </button>
                            </div>
                          </div>
                        );
                      }

                      if (field.multiline) {
                        return (
                          <textarea
                            rows={3}
                            value={data[field.id] || ''}
                            onChange={(e) => setField(section.key, field.id, e.target.value)}
                            placeholder={placeholder}
                            style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.7rem 0.8rem', resize: 'vertical' }}
                          />
                        );
                      }

                      return (
                        <input
                          type="text"
                          value={data[field.id] || ''}
                          onChange={(e) => setField(section.key, field.id, e.target.value)}
                          placeholder={placeholder}
                          style={{ width: '100%', borderRadius: 10, border: '1px solid var(--color-border)', padding: '0.64rem 0.78rem' }}
                        />
                      );
                    })()}
                  </label>
                )})}
              </div>

              <div style={{ display: 'flex', justifyContent: 'flex-end', gap: '0.5rem', marginTop: '1rem' }}>
                <button
                  type="button"
                  className="btn btn-outline"
                  style={{ fontSize: '0.74rem', padding: '0.3rem 0.48rem', borderRadius: 8, lineHeight: 1.2 }}
                  onClick={() => resetSection(section.key)}
                  disabled={savingKey === section.key || savingKey === '__all__' || !dirty}
                >
                  Reset changes
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  style={{ fontSize: '0.78rem', padding: '0.36rem 0.62rem', borderRadius: 9, lineHeight: 1.2 }}
                  onClick={() => saveSection(section.key)}
                  disabled={savingKey === section.key || savingKey === '__all__'}
                >
                  {savingKey === section.key ? 'Saving…' : 'Save section'}
                </button>
              </div>
                </>
              )}
            </AdminEditorCard>
          );
        })}
      </div>
    </div>
  );
}
