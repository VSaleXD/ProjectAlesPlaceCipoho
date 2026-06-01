import React from 'react';

/**
 * JapaneseCloudBg — Ornamen awan Akatsuki (Naruto-style kumo)
 * Solid cloud shape dengan swirl/spiral putih di dalamnya.
 * Warna mengikuti tema web (dark red / #8F1D1B).
 */

const CLOUDS = [
  { top: '5%',  left: '-1%',  scale: 0.6,  opacity: 0.08, delay: '0s',  duration: '28s', flip: false },
  { top: '2%',  right: '2%',  scale: 0.45, opacity: 0.06, delay: '4s',  duration: '32s', flip: true },
  { top: '20%', left: '4%',   scale: 0.35, opacity: 0.07, delay: '2s',  duration: '24s', flip: true },
  { top: '32%', right: '0%',  scale: 0.55, opacity: 0.06, delay: '7s',  duration: '30s', flip: false },
  { top: '48%', left: '0%',   scale: 0.5,  opacity: 0.07, delay: '5s',  duration: '26s', flip: false },
  { top: '55%', right: '3%',  scale: 0.4,  opacity: 0.06, delay: '3s',  duration: '29s', flip: true },
  { top: '70%', left: '5%',   scale: 0.38, opacity: 0.07, delay: '8s',  duration: '25s', flip: true },
  { top: '75%', right: '1%',  scale: 0.52, opacity: 0.05, delay: '1s',  duration: '31s', flip: false },
  { top: '90%', left: '2%',   scale: 0.3,  opacity: 0.06, delay: '6s',  duration: '27s', flip: false },
  { top: '93%', right: '4%',  scale: 0.42, opacity: 0.05, delay: '9s',  duration: '33s', flip: true },
];

/**
 * SVG Akatsuki Cloud — bentuk solid dengan swirl putih di dalam.
 * Traced dari bentuk ikonik awan Akatsuki (Naruto).
 */
function AkatsukiCloud({ flip = false }) {
  return (
    <svg
      viewBox="0 0 520 300"
      xmlns="http://www.w3.org/2000/svg"
      style={{
        width: '100%',
        height: '100%',
        transform: flip ? 'scaleX(-1)' : 'none',
      }}
    >
      {/* 
        Cloud body — iconic Akatsuki shape:
        - Pointy left tail
        - Puffy lobes on top-center and right
        - Rounded bottom
      */}
      <path
        d="
          M 45,195
          C 10,175 5,140 30,115
          C 45,95 65,88 85,92
          C 90,65 110,42 140,38
          C 165,35 185,48 195,65
          C 210,40 240,20 275,22
          C 310,24 335,50 340,78
          C 360,58 390,48 418,55
          C 455,65 478,95 475,130
          C 490,138 500,155 498,175
          C 495,200 475,218 450,222
          C 440,245 415,262 385,265
          C 360,267 338,258 322,242
          C 305,260 278,272 250,270
          C 220,268 198,252 185,232
          C 165,252 138,262 110,258
          C 78,252 55,232 48,208
          C 46,203 45,199 45,195
          Z
        "
        fill="#8F1D1B"
      />

      {/* Swirl 1 — large center-left spiral */}
      <path
        d="
          M 155,165
          C 140,145 145,120 165,110
          C 185,100 205,112 208,132
          C 210,145 200,155 188,155
        "
        fill="none"
        stroke="#F5EDD8"
        strokeWidth="8"
        strokeLinecap="round"
      />

      {/* Swirl 2 — top-right spiral */}
      <path
        d="
          M 345,135
          C 335,115 345,95 365,90
          C 385,86 400,100 398,118
          C 396,130 385,138 375,135
        "
        fill="none"
        stroke="#F5EDD8"
        strokeWidth="7"
        strokeLinecap="round"
      />

      {/* Swirl 3 — bottom-right curl */}
      <path
        d="
          M 370,225
          C 362,210 370,195 385,192
          C 400,190 410,200 408,213
          C 406,222 398,226 392,222
        "
        fill="none"
        stroke="#F5EDD8"
        strokeWidth="6"
        strokeLinecap="round"
      />

      {/* Swirl 4 — small left curl */}
      <path
        d="
          M 100,185
          C 95,172 100,160 112,157
          C 124,155 133,163 131,174
          C 130,181 123,185 118,182
        "
        fill="none"
        stroke="#F5EDD8"
        strokeWidth="5.5"
        strokeLinecap="round"
      />
    </svg>
  );
}

export default function JapaneseCloudBg() {
  return (
    <>
      <style>{`
        @keyframes kumoFloat {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(16px) translateY(-6px);
          }
          50% {
            transform: translateX(-10px) translateY(5px);
          }
          75% {
            transform: translateX(8px) translateY(-3px);
          }
        }

        @keyframes kumoFloatAlt {
          0%, 100% {
            transform: translateX(0) translateY(0);
          }
          25% {
            transform: translateX(-12px) translateY(5px);
          }
          50% {
            transform: translateX(8px) translateY(-7px);
          }
          75% {
            transform: translateX(-5px) translateY(3px);
          }
        }
      `}</style>
      <div
        style={{
          position: 'fixed',
          inset: 0,
          pointerEvents: 'none',
          zIndex: 0,
          overflow: 'hidden',
        }}
        aria-hidden="true"
      >
        {CLOUDS.map((cloud, i) => {
          const isAlt = i % 2 === 1;
          const size = (cloud.scale || 1) * 380;
          return (
            <div
              key={i}
              style={{
                position: 'absolute',
                top: cloud.top,
                left: cloud.left || 'auto',
                right: cloud.right || 'auto',
                width: `${size}px`,
                height: `${size * 0.58}px`,
                opacity: cloud.opacity,
                animation: `${isAlt ? 'kumoFloatAlt' : 'kumoFloat'} ${cloud.duration} ease-in-out ${cloud.delay} infinite`,
              }}
            >
              <AkatsukiCloud flip={cloud.flip} />
            </div>
          );
        })}
      </div>
    </>
  );
}
