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
			screens: {
				'4xs': '320px', // iPhone 4
				'3xs': '375px', // iPhone X
				'2xs': '430px', // iPhone 14 Pro Max
				xs: '540px' // Surface Duo
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
				}
			},
			backgroundImage: {
				'llm-gradient':
					'linear-gradient(to bottom, rgba(255, 255, 255, 0), rgba(255, 255, 255, 1) 60%)'
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
						transform: 'translateY(20%) scaleX(0.75)'
					},
					'100%': {
						transform: 'translateY(0) scaleX(1)'
					}
				},
				flyIn: {
					'0%': {
						transform: 'translateY(20%)'
					},
					'100%': {
						transform: 'translateY(0)'
					}
				},
				bounce: {
					'0%, 100%': {
						transform: 'translateY(-5%)',
						animationTimingFunction: 'cubic-bezier(0.8,0,1,1)'
					},
					'50%': {
						transform: 'translateY(0)',
						animationTimingFunction: 'cubic-bezier(0,0,0.2,1)'
					}
				},
				wobble: {
					'0%, 100%': {
						transform: 'translateX(0%)'
					},
					'15%': {
						transform: 'translateX(-10%)'
					},
					'30%': {
						transform: 'translateX(10%)'
					},
					'45%': {
						transform: 'translateX(-5%)'
					},
					'60%': {
						transform: 'translateX(2%)'
					},
					'75%': {
						transform: 'translateX(0%)'
					}
				},
				pulse: {
					'0%, 100%': {
						transform: 'scale3d(1, 1, 1)'
					},
					'50%': {
						transform: 'scale3d(1.05, 1.05, 1.05)'
					}
				},
				heartBeat: {
					'0%': {
						transform: 'scale(1)'
					},
					'14%': {
						transform: 'scale(1.3)'
					},
					'28%': {
						transform: 'scale(1)'
					},
					'42%': {
						transform: 'scale(1.3)'
					},
					'70%': {
						transform: 'scale(1)'
					}
				},
				marquee: {
					from: { transform: 'translateX(0)' },
					to: { transform: 'translateX(calc(-100% - var(--gap)))' }
				},
				'marquee-vertical': {
					from: { transform: 'translateY(0)' },
					to: { transform: 'translateY(calc(-100% - var(--gap)))' }
				}
			},
			animation: {
				bounceIn: 'bounceIn 1s both',
				bounce: 'bounce 1s infinite',
				slideIn: 'slideIn 0.5s both',
				flyIn: 'flyIn .25s both',
				wobble: 'wobble 1s both',
				pulse: 'pulse 1s both',
				heartBeat: 'heartBeat 1s both',
				marquee: 'marquee var(--duration) linear infinite',
				'marquee-vertical': 'marquee-vertical var(--duration) linear infinite'
			}
		}
	},
	plugins: [
		plugin(function ({ matchUtilities, theme, addUtilities }) {
			addUtilities({
				'.debug': {
					outline: '1px solid red'
				}
			});
			// https://www.hyperui.dev/blog/animation-duration-delay-with-tailwindcss
			matchUtilities(
				{
					'animate-delay': (value) => ({
						animationDelay: value
					})
				},
				{ values: theme('transitionDelay') }
			);
		})
	]
};

export default config;
