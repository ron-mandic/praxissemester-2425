import { fontFamily } from 'tailwindcss/defaultTheme';
import type { Config } from 'tailwindcss';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			colors: {
				border: 'hsl(var(--border) / <alpha-value>)',
				input: 'hsl(var(--input) / <alpha-value>)',
				ring: 'hsl(var(--ring) / <alpha-value>)',
				background: 'hsl(var(--background) / <alpha-value>)',
				foreground: 'hsl(var(--foreground) / <alpha-value>)',
				primary: {
					DEFAULT: 'hsl(var(--primary) / <alpha-value>)',
					foreground: 'hsl(var(--primary-foreground) / <alpha-value>)'
				},
				secondary: {
					DEFAULT: 'hsl(var(--secondary) / <alpha-value>)',
					foreground: 'hsl(var(--secondary-foreground) / <alpha-value>)'
				},
				destructive: {
					DEFAULT: 'hsl(var(--destructive) / <alpha-value>)',
					foreground: 'hsl(var(--destructive-foreground) / <alpha-value>)'
				},
				muted: {
					DEFAULT: 'hsl(var(--muted) / <alpha-value>)',
					foreground: 'hsl(var(--muted-foreground) / <alpha-value>)'
				},
				accent: {
					DEFAULT: 'hsl(var(--accent) / <alpha-value>)',
					foreground: 'hsl(var(--accent-foreground) / <alpha-value>)'
				},
				popover: {
					DEFAULT: 'hsl(var(--popover) / <alpha-value>)',
					foreground: 'hsl(var(--popover-foreground) / <alpha-value>)'
				},
				card: {
					DEFAULT: 'hsl(var(--card) / <alpha-value>)',
					foreground: 'hsl(var(--card-foreground) / <alpha-value>)'
				}
			},
			borderRadius: {
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			fontFamily: {
				sans: ['Geist Sans', ...fontFamily.sans],
				mono: ['JetBrains Mono', ...fontFamily.mono]
			},
			keyframes: {
				bounceIn: {
					'0%, 20%, 40%, 60%, 80%, 100%': {
						'animation-timing-function': 'cubic-bezier(0.215, 0.61, 0.355, 1)'
					},
					'0%': {
						opacity: '0',
						transform: 'scale3d(0.3, 0.3, 0.3)'
					},
					'20%': {
						transform: 'scale3d(1.1, 1.1, 1.1)'
					},
					'40%': {
						transform: 'scale3d(0.9, 0.9, 0.9)'
					},
					'60%': {
						opacity: '1',
						transform: 'scale3d(1.03, 1.03, 1.03)'
					},
					'80%': {
						transform: 'scale3d(0.97, 0.97, 0.97)'
					},
					'100%': {
						opacity: '1',
						transform: 'scale3d(1, 1, 1)'
					}
				},
				slideIn: {
					'0%': {
						transform: 'translateY(20%) scaleX(0.75)',
					},
					'100%': {
						transform: 'translateY(0) scaleX(1)',
					}
				}
			},
			animation: {
				bounceIn: 'bounceIn 1s both',
				slideIn: 'slideIn 0.5s both'
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.debug': {
					outline: '1px solid red'
				}
			});
		})
	]
};

export default config;
