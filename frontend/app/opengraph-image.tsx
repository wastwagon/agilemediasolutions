import { ImageResponse } from 'next/og';

export const runtime = 'edge';

export const alt =
  'Agile Media Solutions — strategic communications, media, and public influence across Africa and beyond';

export const size = { width: 1200, height: 630 };

export const contentType = 'image/png';

export default function OpenGraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'flex-start',
          justifyContent: 'center',
          padding: '72px 80px',
          background: 'linear-gradient(145deg, #050d18 0%, #0d213b 42%, #1b4d4a 88%, #0d213b 100%)',
          color: '#f4ebe1',
          fontFamily:
            'ui-sans-serif, system-ui, -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, "Helvetica Neue", Arial, sans-serif',
        }}
      >
        <div
          style={{
            fontSize: 26,
            letterSpacing: '0.28em',
            textTransform: 'uppercase',
            opacity: 0.88,
            marginBottom: 28,
            fontWeight: 600,
          }}
        >
          Agile Media Solutions
        </div>
        <div
          style={{
            fontSize: 64,
            fontWeight: 700,
            lineHeight: 1.08,
            maxWidth: 980,
            marginBottom: 32,
          }}
        >
          Powering narratives that move institutions, markets, and culture
        </div>
        <div
          style={{
            fontSize: 28,
            lineHeight: 1.45,
            opacity: 0.92,
            maxWidth: 880,
          }}
        >
          International communications, PR, and media intelligence — trusted by governments, brands, and institutions.
        </div>
        <div
          style={{
            paddingTop: 48,
            fontSize: 22,
            letterSpacing: '0.12em',
            textTransform: 'uppercase',
            opacity: 0.65,
          }}
        >
          Communications · Media · Digital influence
        </div>
      </div>
    ),
    { ...size }
  );
}
