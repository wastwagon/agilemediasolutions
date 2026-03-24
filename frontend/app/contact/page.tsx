import React from 'react';
import ContactForm from '../../components/ContactForm';

export default function Page() {
  return (
    <main className="page-hero">
      
    <div className="page-hero">
      <div className="page-hero-inner">
        <span className="page-hero-label">Get in touch</span>
        <h1 className="page-hero-title">Let's Talk Strategy, Storytelling, and Solutions</h1>
        <p className="page-hero-tagline">We're available across time zones and channels to discuss ideas, opportunities, and collaborations.</p>
      </div>
    </div>
    <section className="section section-contact" id="contact">
      <div className="section-inner">
        <h1 className="section-title centered">Let's Talk Strategy, Storytelling, and Solutions</h1>
        <p className="section-subtitle centered">
          Whether you're ready to launch a campaign, partner on a project, or explore how Agile Media Solutions can support your brand or institution—we'd love to hear from you. We are available across time zones and channels to discuss ideas, opportunities, and collaborations.
        </p>
        <p className="section-subtitle centered" style={{marginTop: '0.5rem'}}>General Inquiries: Monday–Friday, 9:00 AM–6:00 PM (GMT). Head Office: Accra, Ghana. Additional locations in Nairobi | Johannesburg.</p>
        <p className="section-subtitle centered" style={{marginTop: '0.5rem'}}>Request a Consultation: Interested in our services? Fill out the form below and our team will reach out within 48 hours.</p>
        <ContactForm />
      </div>
    </section>

  
    </main>
  );
}