'use client';

import React, { useId } from 'react';
import Link from 'next/link';
import { useLocale } from '@/components/LocaleProvider';
import { cssBackgroundImageUrl } from '@/lib/homePageServicesDisplay';
import { withLocalePrefix } from '@/lib/locale';
import { nhTemplateFaqToggle, nhTemplateGreenCheck } from './nhTemplateUrls';

export type NhCapabilityItem = {
  readonly serviceId?: number;
  readonly index: string;
  readonly iconIndex: number;
  readonly title: string;
  readonly line: string;
  readonly bullets: readonly string[];
  readonly learnMoreHref?: string;
  readonly learnMoreLabel?: string;
  readonly imageUrl?: string;
  readonly imageClass?: string;
};

export default function NhCapabilityAccordionItem({
  cap,
  icon,
  open,
  onToggle,
}: {
  cap: NhCapabilityItem;
  icon: React.ReactNode;
  open: boolean;
  onToggle: () => void;
}) {
  const locale = useLocale();
  const panelId = useId();

  return (
    <div className="accordiondiv nh-cap-accordion-div">
      <div data-delay="0" data-hover="false" className={`accordion w-dropdown${open ? ' w--open' : ''}`}>
        <button
          type="button"
          className="accordion-toggle w-dropdown-toggle nh-cap-accordion-toggle"
          aria-expanded={open}
          aria-controls={panelId}
          onClick={onToggle}
        >
          <div className="service-icon-box nh-cap-accordion-icon" aria-hidden>
            {icon}
          </div>
          <div className="nh-cap-accordion-head">
            <h3 className="nh-cap-accordion-title paragraph18px">
              <span className="nh-cap-index">{cap.index}</span>
              <span className="nh-cap-title-phrase">{cap.title}</span>
            </h3>
          </div>
          <div className="faq-toggle-div">
            <img src={nhTemplateFaqToggle} alt="" className="togglecruz" width={30} height={30} loading="lazy" />
          </div>
        </button>
        {cap.learnMoreHref ? (
          <div className="nh-cap-learn-more-row nh-cap-learn-more-row--under-title">
            <Link
              href={withLocalePrefix(cap.learnMoreHref, locale)}
              className="nh-cap-learn-more w-inline-block"
              onClick={(e) => e.stopPropagation()}
            >
              {cap.learnMoreLabel ?? 'Learn more →'}
            </Link>
          </div>
        ) : null}
        <nav id={panelId} className={`accordion-list w-dropdown-list nh-cap-accordion-panel${open ? ' w--open' : ''}`}>
          <div className="nh-cap-accordion-panel-inner">
            <div className="nh-cap-accordion-copy">
              {cap.line ? <p className="paragraph20px nh-cap-accordion-intro">{cap.line}</p> : null}
              {cap.bullets.length > 0 ? (
                <div className="service-list-detail-div nh-cap-accordion-bullets">
                  {cap.bullets.map((b) => (
                    <div key={b} className="service-list-div">
                      <img className="service-check-icon" src={nhTemplateGreenCheck} alt="" width={24} height={24} />
                      <div className="paragraph">{b}</div>
                    </div>
                  ))}
                </div>
              ) : null}
            </div>
            {cap.imageUrl || cap.imageClass ? (
              <div
                className={[
                  'nh-cap-accordion-visual',
                  'card-image-placeholder',
                  cap.imageUrl ? 'has-image' : cap.imageClass || 'service-img-strategic',
                ].join(' ')}
                style={
                  cap.imageUrl
                    ? {
                        backgroundImage: cssBackgroundImageUrl(cap.imageUrl),
                        backgroundSize: 'cover',
                        backgroundPosition: 'top center',
                        backgroundRepeat: 'no-repeat',
                      }
                    : undefined
                }
                aria-hidden
              />
            ) : null}
          </div>
        </nav>
      </div>
    </div>
  );
}
