'use client';

import React, { useId, useState } from 'react';
import { nhTemplateFaqToggle } from './nhTemplateUrls';

export default function NhFaqItem({ q, a }: { q: string; a: string }) {
  const [open, setOpen] = useState(false);
  const panelId = useId();

  return (
    <div className="accordiondiv">
      <div data-delay="0" data-hover="false" className={`accordion w-dropdown${open ? ' w--open' : ''}`}>
        <button
          type="button"
          className="accordion-toggle w-dropdown-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={() => setOpen((o) => !o)}
        >
          <div className="faq-toggle-div">
            <img src={nhTemplateFaqToggle} alt="" className="togglecruz" width={30} height={30} loading="lazy" />
          </div>
          <div className="paragraph18px">{q}</div>
        </button>
        <nav id={panelId} className={`accordion-list w-dropdown-list${open ? ' w--open' : ''}`}>
          <p className="paragraph20px">{a}</p>
        </nav>
      </div>
    </div>
  );
}
