import React from 'react';

export default function CmsPageLoading() {
  return (
    <main className="creative-public-page" aria-busy="true" aria-label="Loading page">
      <div className="page-hero">
        <div className="page-hero-inner">
          <span className="page-hero-label cms-page-skeleton cms-page-skeleton--label" />
          <div className="cms-page-skeleton cms-page-skeleton--title" />
          <div className="cms-page-skeleton cms-page-skeleton--line" />
          <div className="cms-page-skeleton cms-page-skeleton--line cms-page-skeleton--line-short" />
        </div>
      </div>
      <div className="section" style={{ paddingTop: 'var(--space-2xl)', paddingBottom: 'var(--space-2xl)' }}>
        <div className="section-inner">
          <div className="cms-page-skeleton cms-page-skeleton--block-title" />
          <div className="cms-page-skeleton cms-page-skeleton--line" />
          <div className="cms-page-skeleton cms-page-skeleton--line" />
          <div className="cms-page-skeleton cms-page-skeleton--line cms-page-skeleton--line-short" />
        </div>
      </div>
    </main>
  );
}
