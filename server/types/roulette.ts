export type roulette_values = keyof typeof roulette_win_multipliers;

export const roulette_win_multipliers = {
	'0': 36,
	'1': 36,
	'2': 36,
	'3': 36,
	'4': 36,
	'5': 36,
	'6': 36,
	'7': 36,
	'8': 36,
	'9': 36,
	'10': 36,
	'11': 36,
	'12': 36,
	'13': 36,
	'14': 36,
	'15': 36,
	'16': 36,
	'17': 36,
	'18': 36,
	'19': 36,
	'20': 36,
	'21': 36,
	'22': 36,
	'23': 36,
	'24': 36,
	'25': 36,
	'26': 36,
	'27': 36,
	'28': 36,
	'29': 36,
	'30': 36,
	'31': 36,
	'32': 36,
	'33': 36,
	'34': 36,
	'35': 36,
	'36': 36,
	'1st_12': 3,
	'2nd_12': 3,
	'3rd_12': 3,
	'1_34': 3,
	'2_35': 3,
	'3_36': 3,
	odd: 2,
	even: 2,
	'1_18': 2,
	'19_36': 2,
	red: 2,
	black: 2
};

export type Message = {
	authenticate: { token: string };
	place_bet: { amount: number; bet: roulette_values };
};

export type Response = {
	welcome: {};
	user_joined: { peer_id: string };
	user_left: { peer_id: string };
	authenticated: {};
	no_more_bets: {};
	bets_close_in: { seconds: number };
	not_enough_balance: { new_balance: number };
	bet_placed: { amount: number; new_balance: number };
	bet_won: { new_balance: number };
	bet_lost: { new_balance: number };
};

export type ResponseKeys = keyof Response;
