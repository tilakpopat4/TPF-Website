import { ImageResponse } from 'next/og';

// Image metadata
export const size = {
  width: 32,
  height: 32,
};
export const contentType = 'image/png';

// Icon generation
export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          background: 'transparent',
          margin: 0,
          padding: 0,
        }}
      >
        <img
          src="http://localhost:3000/tpf-logo.png"
          width="32"
          height="32"
          style={{
            objectFit: 'cover', // Cover ensures it fills the 32x32 completely
          }}
        />
      </div>
    ),
    {
      ...size,
    }
  );
}
