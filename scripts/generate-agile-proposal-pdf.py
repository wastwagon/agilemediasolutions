#!/usr/bin/env python3
"""Generate OceanCyber proposal PDF for Agile Media Solutions (premium layout, all-inclusive fee)."""

import os
import urllib.request
from pathlib import Path

from fpdf import FPDF

OUT_PATH = "OceanCyber-Agile-Media-Solutions-Development-Proposal.pdf"
TOTAL_GHS = 18_000.00
M1 = TOTAL_GHS * 0.40
M2 = TOTAL_GHS * 0.40
M3 = TOTAL_GHS * 0.20

# Brand (Agile-adjacent institutional green + neutrals)
BRAND = (44, 80, 74)
BRAND_LIGHT = (232, 238, 235)
INK = (28, 32, 35)
INK_MUTED = (88, 92, 96)
RULE = (210, 214, 211)

# Inner-page header geometry (mm). Body must start below this; fpdf2 does NOT reset y after header().
HEADER_TEXT_Y = 9
HEADER_RULE_Y = 16
# Top margin = where body content begins (must clear header + ascenders on large headings)
BODY_TOP_MARGIN = 32

FONT_SOURCES = {
    "CrimsonText-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/crimsontext/CrimsonText-Regular.ttf",
    "CrimsonText-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/crimsontext/CrimsonText-Bold.ttf",
    "Lato-Regular.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Regular.ttf",
    "Lato-Bold.ttf": "https://raw.githubusercontent.com/google/fonts/main/ofl/lato/Lato-Bold.ttf",
}


def font_dir() -> Path:
    return Path(__file__).resolve().parent / "proposal_assets" / "fonts"


def ensure_fonts() -> Path:
    d = font_dir()
    d.mkdir(parents=True, exist_ok=True)
    for name, url in FONT_SOURCES.items():
        path = d / name
        if not path.exists() or path.stat().st_size < 1000:
            path.parent.mkdir(parents=True, exist_ok=True)
            try:
                urllib.request.urlretrieve(url, path)
            except OSError:
                pass
    return d


def register_fonts(pdf: FPDF, d: Path) -> bool:
    required = ["CrimsonText-Regular.ttf", "Lato-Regular.ttf"]
    if not all((d / f).exists() for f in required):
        return False
    try:
        pdf.add_font("CrimsonText", "", str(d / "CrimsonText-Regular.ttf"))
        pdf.add_font("CrimsonText", "B", str(d / "CrimsonText-Bold.ttf"))
        pdf.add_font("Lato", "", str(d / "Lato-Regular.ttf"))
        pdf.add_font("Lato", "B", str(d / "Lato-Bold.ttf"))
        return True
    except Exception:
        return False


class ProposalPDF(FPDF):
    def __init__(self, use_custom_fonts: bool):
        super().__init__()
        self.use_custom_fonts = use_custom_fonts

    def _font(self, family: str, style: str = "", size: int = 10):
        if self.use_custom_fonts:
            self.set_font(family, style, size)
        else:
            self.set_font("Helvetica", "B" if style == "B" else "", size)

    def header(self):
        if self.page_no() <= 1:
            return
        self.set_draw_color(*RULE)
        self.set_line_width(0.25)
        self.line(self.l_margin, HEADER_RULE_Y, self.w - self.r_margin, HEADER_RULE_Y)
        self.set_xy(self.l_margin, HEADER_TEXT_Y)
        self._font("Lato", "", 7)
        self.set_text_color(*INK_MUTED)
        self.cell(80, 4, "OCEANCYBER")
        self.set_x(self.w / 2 - 40)
        self.cell(80, 4, "PROPOSAL", align="C")
        self.set_text_color(*INK)
        # fpdf2 leaves y at end of header cells; force body to start below reserved band
        self.set_xy(self.l_margin, self.t_margin)

    def footer(self):
        self.set_y(-16)
        self.set_draw_color(*RULE)
        self.set_line_width(0.2)
        self.line(self.l_margin, self.get_y(), self.w - self.r_margin, self.get_y())
        self.ln(1)
        self._font("Lato", "", 7)
        self.set_text_color(*INK_MUTED)
        self.cell(90, 8, "Agile Media Solutions", align="L")
        self.cell(0, 8, f"Page {self.page_no()}/{{nb}}", align="R")
        self.set_text_color(*INK)


def mc(pdf: ProposalPDF, text: str, h: float = 5.5, size: int = 10, bold: bool = False):
    pdf._font("Lato", "B" if bold else "", size)
    pdf.set_text_color(*INK)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, h, text)
    pdf.ln(2.2)


def heading(pdf: ProposalPDF, text: str, size: int = 13):
    pdf.ln(2.5)
    pdf._font("CrimsonText", "B", size)
    pdf.set_text_color(*BRAND)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 8, text)
    pdf.set_draw_color(*BRAND)
    pdf.set_line_width(0.35)
    y = pdf.get_y()
    pdf.line(pdf.l_margin, y + 2, pdf.l_margin + 48, y + 2)
    pdf.ln(5.5)
    pdf.set_text_color(*INK)


def subheading(pdf: ProposalPDF, text: str):
    pdf.ln(1.8)
    pdf._font("Lato", "B", 10)
    pdf.set_text_color(*INK)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 6, text)
    pdf.ln(2.2)


def bullet_list(pdf: ProposalPDF, items):
    """Bullets with comfortable line height and space between items."""
    pdf._font("Lato", "", 10)
    pdf.set_text_color(*INK)
    for b in items:
        pdf.set_x(pdf.l_margin + 2)
        pdf.multi_cell(0, 6, f"- {b}")
        pdf.ln(1.6)
    pdf.ln(2)


def draw_cover_band(pdf: ProposalPDF):
    pdf.set_fill_color(*BRAND)
    pdf.rect(0, 0, pdf.w, 46, "F")
    pdf.set_xy(22, 14)
    pdf._font("CrimsonText", "B", 22)
    pdf.set_text_color(255, 255, 255)
    pdf.cell(0, 10, "OceanCyber")
    pdf.set_xy(22, 26)
    pdf._font("Lato", "", 8)
    pdf.set_text_color(210, 220, 217)
    pdf.cell(0, 5, "SOFTWARE DEVELOPMENT   ACCRA, GHANA")
    pdf.set_text_color(*INK)


def investment_callout(pdf: ProposalPDF):
    x, w = pdf.l_margin, pdf.w - pdf.l_margin - pdf.r_margin
    y = pdf.get_y()
    h_box = 28
    pdf.set_fill_color(*BRAND_LIGHT)
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.2)
    pdf.rect(x, y, w, h_box, "DF")
    pdf.set_xy(x + 5, y + 5)
    pdf._font("Lato", "B", 9)
    pdf.set_text_color(*BRAND)
    pdf.cell(0, 4, "TOTAL INVESTMENT")
    pdf.ln(6)
    pdf.set_x(x + 5)
    pdf._font("CrimsonText", "B", 20)
    pdf.set_text_color(*BRAND)
    pdf.cell(0, 10, f"GHS {TOTAL_GHS:,.2f}")
    pdf.set_text_color(*INK)
    pdf.set_y(y + h_box + 4)


def payment_row(pdf: ProposalPDF, label: str, row_h: float = 16):
    x, w = pdf.l_margin, pdf.w - pdf.l_margin - pdf.r_margin
    y = pdf.get_y()
    pdf.set_fill_color(248, 249, 248)
    pdf.set_draw_color(*RULE)
    pdf.set_line_width(0.2)
    pdf.rect(x, y, w, row_h, "DF")
    pdf.set_xy(x + 4, y + 4)
    pdf._font("Lato", "", 9)
    pdf.set_text_color(*INK)
    pdf.multi_cell(w - 8, 4.2, label)
    pdf.set_y(y + row_h + 4)


def main():
    fd = ensure_fonts()
    pdf = ProposalPDF(use_custom_fonts=False)
    if register_fonts(pdf, fd):
        pdf.use_custom_fonts = True

    pdf.alias_nb_pages()
    pdf.set_margins(22, BODY_TOP_MARGIN, 22)
    pdf.set_auto_page_break(auto=True, margin=22)
    pdf.add_page()

    draw_cover_band(pdf)
    pdf.set_xy(pdf.l_margin, 52)

    pdf._font("CrimsonText", "B", 17)
    pdf.set_text_color(*INK)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 9, "Website development proposal")
    pdf.ln(2)
    pdf._font("Lato", "", 9)
    pdf.set_text_color(*INK_MUTED)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 4.5, "Prepared for")
    pdf._font("Lato", "B", 11)
    pdf.set_text_color(*INK)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, "Agile Media Solutions")
    pdf.ln(1)
    pdf._font("Lato", "", 9)
    pdf.set_text_color(*INK_MUTED)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        4.5,
        "Public website, admin CMS, and hosting setup (Docker)",
    )
    pdf.ln(5)
    pdf.set_text_color(*INK)
    pdf._font("Lato", "", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 4.5, "30 March 2026")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 4.5, "Reference OCY-AMS-FS-2026-03")
    pdf.ln(14)

    pdf._font("Lato", "", 8)
    pdf.set_text_color(*INK_MUTED)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(
        0,
        4,
        "Fixed professional fee covering the scope in this document. VAT and other taxes apply as "
        "set out in our agreement or on invoice.",
    )
    pdf.set_text_color(*INK)
    pdf.ln(10)

    heading(pdf, "1. Executive summary")
    mc(
        pdf,
        "This proposal is from OceanCyber to Agile Media Solutions. We will design, build, test, "
        "and hand over a full-stack website: a responsive public site and a password-protected admin "
        "area for your team to manage content without relying on a generic page builder. The work "
        "uses a Next.js website, a PostgreSQL database, APIs for the site and admin, contact and "
        "newsletter forms, a media library, and documentation for deployment on hosting you control.",
    )
    mc(
        pdf,
        f"The professional fee for this work is GHS {TOTAL_GHS:,.2f}, as a single all-inclusive "
        "price for the scope in this document. Amounts are in Ghana cedis (GHS) and exclude VAT, "
        "withholding tax, and other statutory charges unless we agree otherwise in writing. The "
        "sections below describe deliverables, payment schedule, and working assumptions.",
    )

    heading(pdf, "2. Scope of work")
    mc(pdf, "OceanCyber will provide the following:")

    subheading(pdf, "2.1 Public website")
    bullets_21 = [
        "Public pages as agreed (including home, about, services, sectors, brands, studio, insights, "
        "events, case studies, partnerships, digital engagement, careers, contact, Agile Press "
        "Group, and legal pages).",
        "Responsive layout and mobile navigation, built to the agreed design.",
        "CMS-managed pages with readable URLs, plus page titles, descriptions, and basic social preview tags.",
    ]
    bullet_list(pdf, bullets_21)

    subheading(pdf, "2.2 Administration and content management")
    bullets_22 = [
        "Secure login for staff who manage the site.",
        "Admin tools for brands, sectors, services, events, and case studies, plus page content "
        "edited with blocks (text, images, calls to action), reordering, and homepage hero slides as needed.",
        "Draft and published states for pages, with preview aligned with what the public site shows.",
        "A media library (upload, organise, alt text) for use across the relevant admin sections.",
        "Contact form messages in admin with simple status handling.",
    ]
    bullet_list(pdf, bullets_22)

    subheading(pdf, "2.3 Backend, data, and integrations")
    bullets_23 = [
        "PostgreSQL database with migrations and seed data for reliable deployments.",
        "REST APIs for the public website and admin (content, pages, file uploads, forms, newsletter, health checks).",
        "Redis where useful for caching or similar needs in your setup.",
        "API and CORS settings suitable for running the app in Docker.",
    ]
    bullet_list(pdf, bullets_23)

    subheading(pdf, "2.4 Deployment and reliability")
    bullets_24 = [
        "Docker Compose setup for the website, API, database, and cache.",
        "Documentation for local use and for production on your server (including typical VPS setups).",
        "Startup checks to reduce issues when the database already exists from a previous deploy.",
    ]
    bullet_list(pdf, bullets_24)

    pdf.add_page()
    heading(pdf, "3. Deliverables")
    dels = [
        "Source code and README-style documentation to build and run the project.",
        "Guidance for staging and production on your hosting (domain, HTTPS, environment variables).",
        "Database migrations and seed scripts as implemented for this project.",
        "A handover walkthrough covering the admin, settings, and deployment steps.",
    ]
    bullet_list(pdf, dels)

    pdf.ln(2)
    heading(pdf, "4. Professional fee")
    mc(
        pdf,
        "All figures below are in Ghana cedis (GHS). Unless we agree otherwise in writing, they do "
        "not include VAT, withholding tax, or other statutory charges. We will add them where the "
        "law requires, as shown on each invoice.",
    )
    investment_callout(pdf)
    mc(
        pdf,
        "This fee covers everything in Section 2 (scope) and Section 3 (deliverables). The list "
        "below summarises what is included.",
    )

    pdf.ln(1)
    pdf._font("Lato", "B", 10)
    pdf.set_text_color(*BRAND)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 7, "What this fee covers")
    pdf.ln(2)
    pdf.set_text_color(*INK)
    included = [
        "Public site: pages, components, responsive layout, and live content from your CMS",
        "Admin: dashboard, content modules, media library, page editor, and contact messages",
        "Backend: database, login, APIs, file uploads, forms, newsletter signup, and health checks",
        "CMS pages: draft/publish, content blocks, and basic SEO fields (title, description, social tags)",
        "Docker Compose stack for app, database, and cache on servers you run",
        "Testing and bug fixes within the agreed scope, plus docs and handover",
        "Regular contact during the build and at handover",
    ]
    bullet_list(pdf, included)

    pdf.add_page()
    heading(pdf, "5. Payment schedule")
    mc(pdf, f"The total of GHS {TOTAL_GHS:,.2f} is payable in three instalments:")
    pdf.ln(2.5)
    payment_row(
        pdf,
        f"40% on signed agreement and project start  -  GHS {M1:,.2f}",
    )
    payment_row(
        pdf,
        f"40% when the build is accepted on staging (public site, admin, and APIs)  -  GHS {M2:,.2f}",
        row_h=20,
    )
    payment_row(
        pdf,
        f"20% at production go-live once agreed final tasks are complete  -  GHS {M3:,.2f}",
    )
    pdf.ln(2)
    mc(
        pdf,
        "We can adjust this schedule if your procurement rules need a different split, agreed before signing.",
    )

    heading(pdf, "6. Timeline")
    mc(
        pdf,
        "We plan for about four to six weeks from project start to handover on production, depending "
        "on feedback, your content and assets, and your hosting being ready (domain, HTTPS, database). "
        "A milestone list can be attached to the statement of work if you want it in writing.",
    )

    heading(pdf, "7. Assumptions")
    ax = [
        "You provide copy, brand assets, and decisions on time so the schedule can be met.",
        "You provide hosting, domain, HTTPS, and any paid third-party services unless we agree otherwise.",
        "New features, a redesign outside the agreed UI, or extra integrations are quoted separately.",
        "Ongoing content entry, maintenance, and SEO work are not included but can be agreed separately.",
    ]
    bullet_list(pdf, ax)

    pdf.ln(2)
    heading(pdf, "8. Validity and next steps")
    mc(
        pdf,
        "This proposal is valid for 30 days from the date on the cover. You can accept it with a "
        "purchase order, a signed statement of work, or an email from someone authorised to commit your organisation.",
    )
    pdf.ln(10)
    pdf._font("CrimsonText", "B", 14)
    pdf.set_text_color(*BRAND)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 7, "OceanCyber")
    pdf.set_text_color(*INK)
    pdf._font("Lato", "", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 4.5, "Accra, Ghana")
    pdf.ln(4)
    mc(
        pdf,
        "Thank you for the opportunity. We look forward to working with you.",
    )
    pdf.ln(4)
    pdf._font("Lato", "", 10)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, "Yours sincerely,")
    pdf.ln(6)
    pdf._font("CrimsonText", "B", 12)
    pdf.set_text_color(*BRAND)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 6, "OceanCyber")
    pdf.set_text_color(*INK)
    pdf.ln(8)
    pdf._font("Lato", "", 9)
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, "Authorised representative _________________________________")
    pdf.set_x(pdf.l_margin)
    pdf.multi_cell(0, 5, "Date _________________________________")

    root = os.path.dirname(os.path.dirname(os.path.abspath(__file__)))
    pdf.output(os.path.join(root, OUT_PATH))
    print(os.path.join(root, OUT_PATH))


if __name__ == "__main__":
    main()
