import { z } from "zod";

const welcomeMessage = z.object({
	type: z.literal("welcome"),
});

const userJoinedMessage = z.object({
	type: z.literal("user_joined"),
	peer_id: z.string(),
	seed: z.string(),
});

const userLeftMessage = z.object({
	type: z.literal("user_left"),
	peer_id: z.string(),
});

const authenticatedMessage = z.object({
	type: z.literal("authenticated"),
});

export const roulette_numbers = z.union([
	z.literal("0"),
	z.literal("1"),
	z.literal("2"),
	z.literal("3"),
	z.literal("4"),
	z.literal("5"),
	z.literal("6"),
	z.literal("7"),
	z.literal("8"),
	z.literal("9"),
	z.literal("10"),
	z.literal("11"),
	z.literal("12"),
	z.literal("13"),
	z.literal("14"),
	z.literal("15"),
	z.literal("16"),
	z.literal("17"),
	z.literal("18"),
	z.literal("19"),
	z.literal("20"),
	z.literal("21"),
	z.literal("22"),
	z.literal("23"),
	z.literal("24"),
	z.literal("25"),
	z.literal("26"),
	z.literal("27"),
	z.literal("28"),
	z.literal("29"),
	z.literal("30"),
	z.literal("31"),
	z.literal("32"),
	z.literal("33"),
	z.literal("34"),
	z.literal("35"),
	z.literal("36"),
]);

export const roulette_values = z.union([
	roulette_numbers,
	z.literal("1st_12"),
	z.literal("2nd_12"),
	z.literal("3rd_12"),
	z.literal("1_34"),
	z.literal("2_35"),
	z.literal("3_36"),
	z.literal("odd"),
	z.literal("even"),
	z.literal("1_18"),
	z.literal("19_36"),
	z.literal("red"),
	z.literal("black"),
]);

const placeBetMessage = z.object({
	type: z.literal("place_bet"),
	peer_id: z.string(),
	amount: z.number().nonnegative(),
	bet: roulette_values,
});

export const messageTypes = z.union([
	welcomeMessage,
	userJoinedMessage,
	userLeftMessage,
	authenticatedMessage,
	placeBetMessage,
]);

const authenticateMessage = z.object({
	type: z.literal("authenticate"),
	token: z.string(),
});

const serverSeedMessage = z.object({
	type: z.literal("server_seed"),
	server_seed: z.string(),
	peer_id: z.string().optional(),
});

const betPlacedMessage = z.object({
	type: z.literal("bet_placed"),
	peer_id: z.string(),
	amount: z.number().nonnegative(),
	bet: roulette_values,
});

const betsCloseInMessage = z.object({
	type: z.literal("bets_close_in"),
	seconds: z.number().nonnegative(),
	peer_id: z.string().optional(),
});

const noMoreBetsMessage = z.object({
	type: z.literal("no_more_bets"),
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
	amount: z.number().nonnegative(),
});

const refundMessage = z.object({
	type: z.literal("refund"),
	refunds: z.array(refundPeer),
});

export const sendTypes = z.union([
	authenticateMessage,
	serverSeedMessage,
	betPlacedMessage,
	betsCloseInMessage,
	noMoreBetsMessage,
	resultMessage,
	refundMessage,
]);
