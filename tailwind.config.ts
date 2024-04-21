import type { Config } from 'tailwindcss';
import type { OptionalConfig } from 'tailwindcss/types/config';

export default {
	theme: {
		extend: {
			colors: {
				data: {
					DEFAULT: '#F97316',
					50: '#FEF0E7',
					100: '#FEDFC9',
					200: '#FCBB8D',
					300: '#FB9752',
					400: '#F97316',
					500: '#E05F06',
					600: '#B94E05',
					700: '#913E04',
					800: '#692D03',
					900: '#411C02',
					950: '#2D1301'
				}
			}
		}
	}
} satisfies Partial<OptionalConfig>;
