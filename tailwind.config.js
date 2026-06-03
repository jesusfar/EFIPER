/** @type {import('tailwindcss').Config} */
// Paleta institucional Universidad Siglo 21 segun referencia:
// #005E50, #003F3A, #1D544F, #008400, #009F92, #626E7B, #324A4D.
export default {
  content: ['./index.html', './src/**/*.{ts,tsx}'],
  theme: {
    extend: {
      colors: {
        void: '#f4f8f7',
        panel: '#ffffff',
        'panel-2': '#eef4f2',
        line: '#d6e1df',
        stud: '#005E50',
        'stud-dim': '#003F3A',
        accent: '#009F92',
        'teal-card': '#324A4D',
        slate: '#626E7B',
        go: '#008400',
        danger: '#324A4D',
        muted: '#626E7B',
        ink: '#1D544F',
      },
      fontFamily: {
        display: ['Montserrat', 'system-ui', 'sans-serif'],
        body: ['"Hanken Grotesk"', 'system-ui', 'sans-serif'],
        mono: ['"JetBrains Mono"', 'ui-monospace', 'monospace'],
      },
      boxShadow: {
        stud: '0 1px 0 0 rgba(0,159,146,0.34), 0 16px 34px -16px rgba(0,63,58,0.72)',
        panel: '0 1px 2px rgba(29,84,79,0.07), 0 16px 34px -20px rgba(0,63,58,0.34)',
      },
      keyframes: {
        'pop-in': { '0%': { transform: 'scale(0.96)', opacity: '0' }, '100%': { transform: 'scale(1)', opacity: '1' } },
        'rise': { '0%': { transform: 'translateY(8px)', opacity: '0' }, '100%': { transform: 'translateY(0)', opacity: '1' } },
        'pulse-stud': {
          '0%,100%': { boxShadow: '0 0 0 0 rgba(0,94,80,0.45)' },
          '50%': { boxShadow: '0 0 0 6px rgba(0,94,80,0)' },
        },
      },
      animation: {
        'pop-in': 'pop-in 0.18s ease-out',
        'rise': 'rise 0.35s ease-out both',
        'pulse-stud': 'pulse-stud 1.6s ease-out infinite',
      },
    },
  },
  plugins: [],
};
