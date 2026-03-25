'use client';

import React, { useEffect, useState } from 'react';

export default function AdminPages() {
  const [pages, setPages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [editingPage, setEditingPage] = useState<any>(null);
  const [isAdding, setIsAdding] = useState(false);

  // Form states
  const [slug, setSlug] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [contentJson, setContentJson] = useState('{}');

  const fetchData = async () => {
    setLoading(true);
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch('/api/pages', {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setPages(data);
      } else {
        setError('Could not load pages.');
      }
    } catch (err) {
      setError('Could not connect to the server.');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const handleDelete = async (id: number) => {
    if (!confirm('Are you sure you want to delete this page?')) return;
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/pages/${id}`, {
        method: 'DELETE',
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        fetchData();
      } else {
        alert('Could not delete this page.');
      }
    } catch (err) {
      alert('Something went wrong while deleting.');
    }
  };

  const handleEdit = async (pageSlug: string) => {
    const token = localStorage.getItem('admin_token');
    try {
      const res = await fetch(`/api/pages/${pageSlug}`, {
        headers: { 'Authorization': `Bearer ${token}` }
      });
      if (res.ok) {
        const data = await res.json();
        setEditingPage(data);
        setIsAdding(true);
        setSlug(data.slug);
        setTitle(data.title);
        setDescription(data.description || '');
        setContentJson(JSON.stringify(data.content_json || {}, null, 2));
      }
    } catch (err) {
      alert('Could not load this page.');
    }
  };

  const handleCreateClick = () => {
    setEditingPage(null);
    setIsAdding(true);
    setSlug('');
    setTitle('');
    setDescription('');
    setContentJson('{\n  "blocks": []\n}');
  };

  const handleCancel = () => {
    setIsAdding(false);
    setEditingPage(null);
  };

  const handleSubmit = async (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    
    let parsedContent = {};
    try {
      parsedContent = JSON.parse(contentJson || '{}');
    } catch (err) {
      alert('The page data field must be valid JSON.');
      return;
    }

    const data = {
      slug,
      title,
      description,
      content_json: parsedContent
    };

    const token = localStorage.getItem('admin_token');
    const url = editingPage ? `/api/pages/${editingPage.slug}` : '/api/pages';
    const method = editingPage ? 'PUT' : 'POST';

    try {
      const res = await fetch(url, {
        method,
        headers: { 
          'Authorization': `Bearer ${token}`,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify(data)
      });
      if (res.ok) {
        handleCancel();
        fetchData();
      } else {
        const errData = await res.json();
        alert('Could not save: ' + (errData.error || 'Unknown error'));
      }
    } catch (err) {
      alert('Something went wrong while saving.');
    }
  };

  if (loading && pages.length === 0) return <div className="admin-loading" style={{ padding: '3rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>Loading…</div>;

  return (
    <div className="admin-page animate-on-scroll is-visible">
      <div className="admin-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', flexWrap: 'wrap', gap: '1rem', marginBottom: '2rem' }}>
        <div>
          <h1 style={{ fontFamily: 'var(--font-display)', fontSize: '2.5rem', marginBottom: '0.5rem', color: 'var(--color-dark-blue)' }}>Pages</h1>
          <p style={{ color: 'var(--color-text-muted)', fontSize: '1.1rem' }}>Page titles, meta description, and JSON content for the site.</p>
        </div>
        {!isAdding && (
          <button onClick={handleCreateClick} className="btn btn-primary">
            Add page
          </button>
        )}
      </div>

      {isAdding && (
        <div style={{ background: '#fff', padding: '2.5rem', borderRadius: '16px', border: '1px solid var(--color-border)', marginBottom: '2.5rem', boxShadow: 'var(--shadow-sm)' }}>
          <h3 style={{ marginBottom: '2rem', fontFamily: 'var(--font-display)', fontSize: '1.5rem', color: 'var(--color-dark-blue)' }}>
            {editingPage ? 'Edit page' : 'New page'}
          </h3>
          <form onSubmit={handleSubmit}>
            <div className="form-row-split" style={{ marginBottom: '1.5rem' }}>
              <div className={`form-group ${title ? 'has-value' : ''}`}>
                <input type="text" id="title" required value={title} onChange={(e) => setTitle(e.target.value)} />
                <label htmlFor="title">Page title</label>
                <div className="form-border"></div>
              </div>
              <div className={`form-group ${slug ? 'has-value' : ''}`}>
                <input type="text" id="slug" required value={slug} onChange={(e) => setSlug(e.target.value)} readOnly={!!editingPage} />
                <label htmlFor="slug">URL slug (e.g. about)</label>
                <div className="form-border"></div>
              </div>
            </div>

            <div className={`form-group form-group-textarea ${description ? 'has-value' : ''}`} style={{ marginBottom: '1.5rem' }}>
              <textarea id="description" rows={2} value={description} onChange={(e) => setDescription(e.target.value)}></textarea>
              <label htmlFor="description">Meta description</label>
              <div className="form-border"></div>
            </div>

            <div className={`form-group form-group-textarea ${contentJson ? 'has-value' : ''}`} style={{ marginBottom: '2.5rem' }}>
              <textarea 
                id="contentJson" 
                rows={10} 
                value={contentJson} 
                onChange={(e) => setContentJson(e.target.value)}
                style={{ fontFamily: 'monospace', fontSize: '13px', letterSpacing: '0px' }}
              ></textarea>
              <label htmlFor="contentJson">Page data (JSON)</label>
              <div className="form-border"></div>
            </div>

            <div style={{ display: 'flex', gap: '1rem', justifyContent: 'flex-end' }}>
              <button type="button" onClick={handleCancel} className="btn btn-outline" style={{ border: 'none' }}>Cancel</button>
              <button type="submit" className="btn btn-primary">{editingPage ? 'Save changes' : 'Add page'}</button>
            </div>
          </form>
        </div>
      )}

      {error && <div style={{ padding: '1rem', background: '#FEF2F2', color: '#B91C1C', borderRadius: '8px', marginBottom: '2rem' }}>{error}</div>}

      {!isAdding && (
        <div style={{ background: '#fff', borderRadius: '16px', border: '1px solid var(--color-border)', overflow: 'scroll', boxShadow: 'var(--shadow-sm)' }}>
          <table style={{ width: '100%', minWidth: '800px', borderCollapse: 'collapse', textAlign: 'left' }}>
            <thead style={{ background: 'var(--color-bg-alt)', borderBottom: '1px solid var(--color-border)' }}>
              <tr>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Page</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>URL</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em' }}>Last updated</th>
                <th style={{ padding: '1.2rem', fontSize: '0.85rem', fontWeight: 600, color: 'var(--color-text-muted)', textTransform: 'uppercase', letterSpacing: '0.05em', textAlign: 'right' }}>Actions</th>
              </tr>
            </thead>
            <tbody>
              {pages.length === 0 ? (
                <tr><td colSpan={4} style={{ padding: '4rem', textAlign: 'center', color: 'var(--color-text-muted)' }}>No pages yet. Add one to get started.</td></tr>
              ) : (
                pages.map((p) => (
                  <tr key={p.id} style={{ borderBottom: '1px solid var(--color-border)', background: '#fff' }}>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <div style={{ fontWeight: 600, color: 'var(--color-dark-blue)', marginBottom: '4px', fontSize: '1.1rem' }}>{p.title}</div>
                      {p.description && <div style={{ fontSize: '0.9rem', color: 'var(--color-text-muted)', maxWidth: '300px', whiteSpace: 'nowrap', overflow: 'hidden', textOverflow: 'ellipsis' }}>{p.description}</div>}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle' }}>
                      <span style={{ display: 'inline-block', padding: '0.25rem 0.6rem', background: 'var(--color-bg-alt)', color: 'var(--color-text)', borderRadius: '6px', fontSize: '0.85rem', fontWeight: 500, fontFamily: 'monospace' }}>
                        /{p.slug}
                      </span>
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', fontSize: '0.9rem', color: 'var(--color-text-muted)' }}>
                      {new Date(p.updated_at || p.created_at).toLocaleDateString(undefined, { year: 'numeric', month: 'short', day: 'numeric' })}
                    </td>
                    <td style={{ padding: '1.5rem 1.2rem', verticalAlign: 'middle', textAlign: 'right' }}>
                      <button 
                        onClick={() => handleEdit(p.slug)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: 'var(--color-primary)', fontSize: '0.9rem', fontWeight: 600, marginRight: '1rem', transition: 'opacity 0.2s' }}
                      >
                        Edit
                      </button>
                      <button 
                        onClick={() => handleDelete(p.id)}
                        style={{ background: 'transparent', border: 'none', cursor: 'pointer', color: '#E63946', fontSize: '0.9rem', fontWeight: 600, transition: 'opacity 0.2s' }}
                      >
                        Delete
                      </button>
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}
