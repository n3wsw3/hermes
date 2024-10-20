import { z } from 'zod';

const welcomeMessage = z.object({
	type: z.literal('welcome')
});

const userJoinedMessage = z.object({
	type: z.literal('user_joined'),
	peer_id: z.string(),
	seed: z.string()
});

const userLeftMessage = z.object({
	type: z.literal('user_left'),
	peer_id: z.string()
});

const authenticatedMessage = z.object({
	type: z.literal('authenticated')
});

export const roulette_numbers = z.union([
	z.literal('0'),
	z.literal('1'),
	z.literal('2'),
	z.literal('3'),
	z.literal('4'),
	z.literal('5'),
	z.literal('6'),
	z.literal('7'),
	z.literal('8'),
	z.literal('9'),
	z.literal('10'),
	z.literal('11'),
	z.literal('12'),
	z.literal('13'),
	z.literal('14'),
	z.literal('15'),
	z.literal('16'),
	z.literal('17'),
	z.literal('18'),
	z.literal('19'),
	z.literal('20'),
	z.literal('21'),
	z.literal('22'),
	z.literal('23'),
	z.literal('24'),
	z.literal('25'),
	z.literal('26'),
	z.literal('27'),
	z.literal('28'),
	z.literal('29'),
	z.literal('30'),
	z.literal('31'),
	z.literal('32'),
	z.literal('33'),
	z.literal('34'),
	z.literal('35'),
	z.literal('36')
]);

export const roulette_values = z.union([
	roulette_numbers,
	z.literal('1st_12'),
	z.literal('2nd_12'),
	z.literal('3rd_12'),
	z.literal('1_34'),
	z.literal('2_35'),
	z.literal('3_36'),
	z.literal('odd'),
	z.literal('even'),
	z.literal('1_18'),
	z.literal('19_36'),
	z.literal('red'),
	z.literal('black')
]);

const placeBetMessage = z.object({
	type: z.literal('place_bet'),
	peer_id: z.string(),
	amount: z.number().nonnegative(),
	bet: roulette_values
});

export const dealerReceiveTypes = z.union([
	welcomeMessage,
	userJoinedMessage,
	userLeftMessage,
	authenticatedMessage,
	placeBetMessage
]);

const authenticateMessage = z.object({
	type: z.literal('authenticate'),
	token: z.string(),
	seed: z.string()
});

const serverSeedMessage = z.object({
	type: z.literal('server_seed'),
	server_seed: z.string(),
	peer_id: z.string().optional()
});

const betPlacedMessage = z.object({
	type: z.literal('bet_placed'),
	peer_id: z.string(),
	amount: z.number().nonnegative(),
	bet: roulette_values
});

const betsCloseInMessage = z.object({
	type: z.literal('bets_close_in'),
	seconds: z.number().nonnegative(),
	peer_id: z.string().optional()
});

const noMoreBetsMessage = z.object({
	type: z.literal('no_more_bets')
});

const player_result = z.object({
	peer_id: z.string(),
	amount: z.number().nonnegative(),
});

const resultMessage = z.object({
	type: z.literal("result"),
	winning_number: roulette_numbers,
	winning_bets: z.array(roulette_values),
	winning_amounts: z.array(
		player_result,
	),
	losing_amounts: z.array(
		player_result,
	),
	server_seed: z.string(),
	client_seeds: z.array(z.string()),
});

const refundPeer = z.object({
	peer_id: z.string(),
	amount: z.number().nonnegative()
});

const refundMessage = z.object({
	type: z.literal('refund'),
	refunds: z.array(refundPeer)
});

export const dealerSendTypes = z.union([
	authenticateMessage,
	serverSeedMessage,
	betPlacedMessage,
	betsCloseInMessage,
	noMoreBetsMessage,
	resultMessage,
	refundMessage
]);

export const win_map: Record<z.infer<typeof roulette_numbers>, Array<z.infer<typeof roulette_values>>> = {
	'0': ['0'],
	'1': ['1', '1st_12', '1_18', 'odd', 'red', '1_34'],
	'2': ['2', '1st_12', '1_18', 'even', 'black', '2_35'],
	'3': ['3', '1st_12', '1_18', 'odd', 'red', '3_36'],
	'4': ['4', '1st_12', '1_18', 'even', 'black', '1_34'],
	'5': ['5', '1st_12', '1_18', 'odd', 'red', '2_35'],
	'6': ['6', '1st_12', '1_18', 'even', 'black', '3_36'],
	'7': ['7', '1st_12', '1_18', 'odd', 'red', '1_34'],
	'8': ['8', '1st_12', '1_18', 'even', 'black', '2_35'],
	'9': ['9', '1st_12', '1_18', 'odd', 'red', '3_36'],
	'10': ['10', '1st_12', '1_18', 'even', 'black', '1_34'],
	'11': ['11', '1st_12', '1_18', 'odd', 'black', '2_35'],
	'12': ['12', '1st_12', '1_18', 'even', 'red', '3_36'],
	'13': ['13', '2nd_12', '1_18', 'odd', 'black', '1_34'],
	'14': ['14', '2nd_12', '1_18', 'even', 'red', '2_35'],
	'15': ['15', '2nd_12', '1_18', 'odd', 'black', '3_36'],
	'16': ['16', '2nd_12', '1_18', 'even', 'red', '1_34'],
	'17': ['17', '2nd_12', '1_18', 'odd', 'black', '2_35'],
	'18': ['18', '2nd_12', '1_18', 'even', 'red', '3_36'],
	'19': ['19', '2nd_12', '19_36', 'odd', 'red', '1_34'],
	'20': ['20', '2nd_12', '19_36', 'even', 'black', '2_35'],
	'21': ['21', '2nd_12', '19_36', 'odd', 'red', '3_36'],
	'22': ['22', '2nd_12', '19_36', 'even', 'black', '1_34'],
	'23': ['23', '2nd_12', '19_36', 'odd', 'red', '2_35'],
	'24': ['24', '2nd_12', '19_36', 'even', 'black', '3_36'],
	'25': ['25', '3rd_12', '19_36', 'odd', 'red', '1_34'],
	'26': ['26', '3rd_12', '19_36', 'even', 'black', '2_35'],
	'27': ['27', '3rd_12', '19_36', 'odd', 'red', '3_36'],
	'28': ['28', '3rd_12', '19_36', 'even', 'black', '1_34'],
	'29': ['29', '3rd_12', '19_36', 'odd', 'black', '2_35'],
	'30': ['30', '3rd_12', '19_36', 'even', 'red', '3_36'],
	'31': ['31', '3rd_12', '19_36', 'odd', 'black', '1_34'],
	'32': ['32', '3rd_12', '19_36', 'even', 'red', '2_35'],
	'33': ['33', '3rd_12', '19_36', 'odd', 'black', '3_36'],
	'34': ['34', '3rd_12', '19_36', 'even', 'red', '1_34'],
	'35': ['35', '3rd_12', '19_36', 'odd', 'black', '2_35'],
	'36': ['36', '3rd_12', '19_36', 'even', 'red', '3_36']
};

export const roulette_win_multipliers: Record<z.infer<typeof roulette_values>, number> = {
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

const placeBetClientMessage = z.object({
	type: z.literal('place_bet'),
	amount: z.number().nonnegative(),
	bet: roulette_values
});

export const clientSendTypes = z.union([authenticateMessage, placeBetClientMessage]);

const notEnoughBalanceMessage = z.object({
	type: z.literal('not_enough_balance'),
	new_balance: z.number().nonnegative()
});

const betWonMessage = z.object({
	type: z.literal('bet_won'),
	new_balance: z.number().nonnegative(),
	server_seed: z.string(),
	client_seeds: z.array(z.string()),
	winning_number: roulette_numbers,
	amount: z.number().nonnegative()
});

const betLostMessage = z.object({
	type: z.literal('bet_lost'),
	new_balance: z.number().nonnegative(),
	server_seed: z.string(),
	client_seeds: z.array(z.string()),
	winning_number: roulette_numbers,
	amount: z.number().nonnegative()
});

const betPlacedSuccessMessage = z.object({
	type: z.literal('bet_placed_success'),
	bet: roulette_values,
	amount: z.number().nonnegative(),
	new_balance: z.number().nonnegative()
});

const serverSeedClientMessage = z.object({
	type: z.literal('server_seed'),
	server_seed: z.string()
});

const refundClientMessage = z.object({
	type: z.literal('refund'),
	amount: z.number().nonnegative()
});

const betsCloseInClientMessage = z.object({
	type: z.literal('bets_close_in'),
	seconds: z.number().nonnegative()
});

export const clientReceiveTypes = z.union([
	welcomeMessage,
	userJoinedMessage,
	userLeftMessage,
	authenticatedMessage,
	noMoreBetsMessage,
	betsCloseInClientMessage,
	notEnoughBalanceMessage,
	betPlacedSuccessMessage,
	betWonMessage,
	betLostMessage,
	placeBetMessage,
	refundClientMessage,
	serverSeedClientMessage
]);

export type Exact<T extends Base, Base> = Base extends Base
  ? {} extends Omit<T, keyof Base>
    ? T
    : `Following key is redundant: ${keyof Omit<T, keyof Base> & string}`
  : never;


  
export const serverReceiveTypes = z.union([clientSendTypes, dealerSendTypes]);

export const serverSendTypes = z.union([clientReceiveTypes, dealerReceiveTypes]);

type TypeAsKey<T extends { type: string }> = {
	[V in T['type']]: Omit<Extract<T, { type: V }>, 'type'>;
};

export type ServerReceive = TypeAsKey<z.infer<typeof serverReceiveTypes>>;
export type ServerSend = TypeAsKey<z.infer<typeof serverSendTypes>>;

export type ClientReceive = TypeAsKey<z.infer<typeof clientReceiveTypes>>;
export type ClientSend = TypeAsKey<z.infer<typeof clientSendTypes>>;

export type DealerReceive = TypeAsKey<z.infer<typeof dealerReceiveTypes>>;
export type DealerSend = TypeAsKey<z.infer<typeof dealerSendTypes>>;
