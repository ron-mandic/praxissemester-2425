import type { Config } from 'tailwindcss';
import { fontFamily } from 'tailwindcss/defaultTheme';
import tailwindcssAnimate from 'tailwindcss-animate';
import tailwindcssContainerQueries from '@tailwindcss/container-queries';
import plugin from 'tailwindcss/plugin';

const config: Config = {
	darkMode: ['class'],
	content: ['./src/**/*.{html,js,svelte,ts}'],
	safelist: ['dark'],
	theme: {
		fontFamily: {
			sans: ['"Inter Variable", Inter, system-ui, Avenir, Helvetica, Arial, sans-serif', ...fontFamily.sans],
			mono: ['"JetBrains Mono Variable", "JetBrains Mono", Menlo, Monaco, Consolas, "Liberation Mono", "Courier New", monospace'],
			vintage: ['"MonteCarlo"', 'serif']
		},
		container: {
			center: true,
			padding: '2rem',
			screens: {
				'2xl': '1400px'
			}
		},
		extend: {
			cursor: {
				// Source: https://stackoverflow.com/a/19561018
				'e-resize': "url('/svg/cursor/e-resize.svg') 8 8, auto !important;",
				'w-resize': "url('/svg/cursor/w-resize.svg') 8 8, auto !important;",
				auto: "url('/svg/cursor/auto.svg') 8 8, auto !important;",
				pointer: "url('/svg/cursor/pointer.svg') 8 8, auto !important;",
				disabled: "url('/svg/cursor/disabled.svg') 8 8, auto !important;",
				text: "url('/svg/cursor/text.svg') 8 8, auto !important;"
			},
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
				},
				sidebar: {
					DEFAULT: 'hsl(var(--sidebar-background))',
					foreground: 'hsl(var(--sidebar-foreground))',
					primary: 'hsl(var(--sidebar-primary))',
					'primary-foreground': 'hsl(var(--sidebar-primary-foreground))',
					accent: 'hsl(var(--sidebar-accent))',
					'accent-foreground': 'hsl(var(--sidebar-accent-foreground))',
					border: 'hsl(var(--sidebar-border))',
					ring: 'hsl(var(--sidebar-ring))'
				},
				sticker: {
					DEFAULT: 'hsl(var(--sticker))',
					foreground: 'hsl(var(--sticker-foreground))',
					border: 'hsl(var(--sticker-border))'
				}
			},
			borderRadius: {
				xl: 'calc(var(--radius) + 4px)',
				lg: 'var(--radius)',
				md: 'calc(var(--radius) - 2px)',
				sm: 'calc(var(--radius) - 4px)'
			},
			transitionTimingFunction: {
				'out-cubic': 'cubic-bezier(0.22, 0.61, 0.36, 1)'
			},
			keyframes: {
				'accordion-down': {
					from: { height: '0' },
					to: { height: 'var(--bits-accordion-content-height)' }
				},
				'accordion-up': {
					from: { height: 'var(--bits-accordion-content-height)' },
					to: { height: '0' }
				},
				'caret-blink': {
					'0%,70%,100%': { opacity: '1' },
					'20%,50%': { opacity: '0' }
				},
				jello: {
					'0%, 11.1%, 100%': { transform: 'translate3d(0, 0, 0)' },
					'22.2%': { transform: 'skewX(-12.5deg) skewY(-12.5deg)' },
					'33.3%': { transform: 'skewX(6.25deg) skewY(6.25deg)' },
					'44.4%': { transform: 'skewX(-3.125deg) skewY(-3.125deg)' },
					'55.5%': { transform: 'skewX(1.5625deg) skewY(1.5625deg)' },
					'66.6%': { transform: 'skewX(-0.78125deg) skewY(-0.78125deg)' },
					'77.7%': { transform: 'skewX(0.390625deg) skewY(0.390625deg)' },
					'88.8%': { transform: 'skewX(-0.1953125deg) skewY(-0.1953125deg)' }
				},
				'background-slide': {
					'0%': { backgroundPosition: '0% 50%' },
					'25%': { backgroundPosition: '50% 50%' },
					'50%': { backgroundPosition: '100% 50%' },
					'75%': { backgroundPosition: '50% 50%' },
					'100%': { backgroundPosition: '0% 50%' }
				}
			},
			animation: {
				'accordion-down': 'accordion-down 0.2s ease-out',
				'accordion-up': 'accordion-up 0.2s ease-out',
				'caret-blink': 'caret-blink 1.25s ease-out infinite',
				jello: 'jello 1s ease-in-out infinite',
				'scale-in-out': 'scale-in-out 0.5s ease-in-out infinite',
				'background-slide': 'background-slide 3s ease-in-out infinite'
			}
		}
	},
	plugins: [
		plugin(function ({ addUtilities }) {
			addUtilities({
				'.debug': {
					outline: '1px solid red !important'
				},
				'.no-highlight': {
					'@apply focus-visible:border-none focus-visible:outline-none focus-visible:ring-0 focus-visible:ring-[none]':
						{}
				},
				'.no-interaction': {
					'@apply pointer-events-none touch-none select-none': {}
				}
			});
		}),
		tailwindcssAnimate,
		// Source: https://github.com/tailwindlabs/tailwindcss-container-queries?tab=readme-ov-file#installation
		tailwindcssContainerQueries
	]
};

export default config;
