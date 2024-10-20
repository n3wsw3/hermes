import consola from "consola";
// @deno-types="@types/ws"
import { type MessageEvent, WebSocket } from "ws";
import { z } from "zod";
// @deno-types="@types/seedrandom"
import seedrandom from "seedrandom";
import { makeid, sleep, hashText } from "./utils.ts";
import {
	messageTypes,
	roulette_numbers,
	type roulette_values,
	sendTypes,
} from "./message_types.ts";

const DEALER_KEY = Deno.env.get("DEALER_KEY");

const timeout = <T>(prom: Promise<T>, time: number) =>
	Promise.race([prom, new Promise((_, rej) => setTimeout(() => rej("timeout"), time))]) as Promise<T>;

const create_new_ws_client = async (dealer_key: string | undefined) => {
	const url = `ws://localhost:3000/roulette${
		dealer_key ? `?dealer_key=${dealer_key}` : ""
	}`;
	const websocket = new WebSocket(url);

	consola.info(`Connecting to server at ${websocket.url}`);

	websocket.addEventListener("error", (event) => {
		consola.error(`Error connecting to server at ${websocket.url}: ${event}`);
		return new Error(`Error connecting to server at ${websocket.url}: ${event}`);
	});

	await timeout(new Promise((resolve) => websocket.addEventListener("open", resolve)), 1000);

	consola.success(`Connected to server at ${websocket.url}`);

	websocket.addEventListener("message", (event) => {
		const message = parse_message(event);

		if (!message) {
			return;
		}

		const { type, ...data } = message;

		const handler = handlers[type];

		if (!handler) {
			consola.error(`No handler for message type ${type} and data`, data);
			return;
		}

		handler(data as never);
	});

	websocket.addEventListener("close", (event) => {
		consola.info(`Connection closed: ${JSON.stringify(event)}`);
		ws = null;
		is_successfully_connected = false;
	});

	return websocket;
};

let ws: WebSocket | null = null;
let is_successfully_connected = false;

const handlers = {
	welcome() {
		consola.info("Welcome message received");

		send("authenticate", { token: "123" });
	},
	async user_joined({ peer_id, seed }: { peer_id: string; seed: string }) {
		consola.info(`User ${peer_id} joined`);
		current_players[peer_id] = seed;

		const server_seed_hash = await hashText(server_seed);
		send("server_seed", { server_seed: server_seed_hash, peer_id });

		if (waiting_for_bets_until) {
			const seconds_left = Math.floor(
				(waiting_for_bets_until.getTime() - Date.now()) / 1000,
			);
			send("bets_close_in", { seconds: seconds_left, peer_id });
		}
	},
	user_left({ peer_id }: { peer_id: string }) {
		consola.info(`User ${peer_id} left`);
		delete current_players[peer_id];
	},
	authenticated() {
		is_successfully_connected = true;
		consola.info("Authenticated");
	},
	place_bet(
		{ peer_id, amount, bet }: {
			peer_id: string;
			amount: number;
			bet: z.infer<typeof roulette_values>;
		},
	) {
		if (!allows_bets) {
			consola.warn(`Bets are closed`);
			return;
		}
		consola.info(`User ${peer_id} placed bet of ${amount} on ${bet}`);
		bets[peer_id] = bets[peer_id] || [];
		bets[peer_id].push({ amount, bet });

		send("bet_placed", { amount, peer_id, bet });
	},
};

const parse_message = (event: MessageEvent) => {
	let message = null;
	try {
		message = JSON.parse(event.data.toString());
	} catch (_) {
		consola.warn(`Message is not Json: ${event.data.toString()}`);
		return null;
	}
	const parsed = messageTypes.safeParse(message);

	if (!parsed.success) {
		consola.warn(`Message is not correct: ${event.data.toString()}`);
		return null;
	}

	return parsed.data;
};

const send = (
	type: z.infer<typeof sendTypes>["type"],
	data: Omit<z.infer<typeof sendTypes>, "type"> = {},
) => {
	const { success, data: validatedMessage } = sendTypes.safeParse({
		type,
		...data,
	});

	if (!success) {
		consola.error(`Trying to send invalid ${type} message: ${JSON.stringify(data)}`);
		return;
	}

	if (!ws) {
		consola.warn("No websocket connection");
		return;
	}

	ws.send(JSON.stringify(validatedMessage));
};

type Bet = {
	amount: number;
	bet: z.infer<typeof roulette_values>;
};

const waiting_for_bets_timeout = 5;
const current_players: Record<string, string> = {};
let bets: Record<string, Array<Bet>> = {};
let allows_bets = true;
let server_seed = "1234";
let winning_number: z.infer<typeof roulette_numbers> | null = null;
let waiting_for_bets_until: Date | null = null;

const handle_waiting_for_bets = async () => {
	consola.info("Waiting for bets");

	let all_player_bets = Object.keys(current_players)
		.filter((player) => bets[player] !== undefined)
		.flatMap((player) => bets[player]);

	while (all_player_bets.length === 0) {
		await sleep(1000);
		all_player_bets = Object.keys(current_players)
			.filter((player) => bets[player] !== undefined)
			.flatMap((player) => bets[player]);
	}

	// There is at least one bet. Wait 10 seconds for more bets
	send("bets_close_in", { seconds: waiting_for_bets_timeout });

	waiting_for_bets_until = new Date(Date.now() + waiting_for_bets_timeout * 1000);

	await sleep((waiting_for_bets_timeout + 5) * 1000);

	all_player_bets = Object.keys(current_players)
			.filter((player) => bets[player] !== undefined)
			.flatMap((player) => bets[player]);

	consola.info("No more bets", all_player_bets);

	allows_bets = false;

	send("no_more_bets");

	consola.info("Spinning wheel");

	await sleep(3000);
};

/**
 * This is a map between a possible winning number and the possible winning bets
 */
const win_map: Record<
	z.infer<typeof roulette_numbers>,
	Array<z.infer<typeof roulette_values>>
> = {
	"0": ["0"],
	"1": ["1", "1st_12", "1_18", "odd", "red", "1_34"],
	"2": ["2", "1st_12", "1_18", "even", "black", "2_35"],
	"3": ["3", "1st_12", "1_18", "odd", "red", "3_36"],
	"4": ["4", "1st_12", "1_18", "even", "black", "1_34"],
	"5": ["5", "1st_12", "1_18", "odd", "red", "2_35"],
	"6": ["6", "1st_12", "1_18", "even", "black", "3_36"],
	"7": ["7", "1st_12", "1_18", "odd", "red", "1_34"],
	"8": ["8", "1st_12", "1_18", "even", "black", "2_35"],
	"9": ["9", "1st_12", "1_18", "odd", "red", "3_36"],
	"10": ["10", "1st_12", "1_18", "even", "black", "1_34"],
	"11": ["11", "1st_12", "1_18", "odd", "black", "2_35"],
	"12": ["12", "1st_12", "1_18", "even", "red", "3_36"],
	"13": ["13", "2nd_12", "1_18", "odd", "black", "1_34"],
	"14": ["14", "2nd_12", "1_18", "even", "red", "2_35"],
	"15": ["15", "2nd_12", "1_18", "odd", "black", "3_36"],
	"16": ["16", "2nd_12", "1_18", "even", "red", "1_34"],
	"17": ["17", "2nd_12", "1_18", "odd", "black", "2_35"],
	"18": ["18", "2nd_12", "1_18", "even", "red", "3_36"],
	"19": ["19", "2nd_12", "19_36", "odd", "red", "1_34"],
	"20": ["20", "2nd_12", "19_36", "even", "black", "2_35"],
	"21": ["21", "2nd_12", "19_36", "odd", "red", "3_36"],
	"22": ["22", "2nd_12", "19_36", "even", "black", "1_34"],
	"23": ["23", "2nd_12", "19_36", "odd", "red", "2_35"],
	"24": ["24", "2nd_12", "19_36", "even", "black", "3_36"],
	"25": ["25", "3rd_12", "19_36", "odd", "red", "1_34"],
	"26": ["26", "3rd_12", "19_36", "even", "black", "2_35"],
	"27": ["27", "3rd_12", "19_36", "odd", "red", "3_36"],
	"28": ["28", "3rd_12", "19_36", "even", "black", "1_34"],
	"29": ["29", "3rd_12", "19_36", "odd", "black", "2_35"],
	"30": ["30", "3rd_12", "19_36", "even", "red", "3_36"],
	"31": ["31", "3rd_12", "19_36", "odd", "black", "1_34"],
	"32": ["32", "3rd_12", "19_36", "even", "red", "2_35"],
	"33": ["33", "3rd_12", "19_36", "odd", "black", "3_36"],
	"34": ["34", "3rd_12", "19_36", "even", "red", "1_34"],
	"35": ["35", "3rd_12", "19_36", "odd", "black", "2_35"],
	"36": ["36", "3rd_12", "19_36", "even", "red", "3_36"],
};

/**
 * This is a map between a possible winning bet and the amount of money the player will win
 * in terms of multiples of the amount they bet
 */
const win_multiplier: Record<z.infer<typeof roulette_values>, number> = {
	"0": 36,
	"1": 36,
	"2": 36,
	"3": 36,
	"4": 36,
	"5": 36,
	"6": 36,
	"7": 36,
	"8": 36,
	"9": 36,
	"10": 36,
	"11": 36,
	"12": 36,
	"13": 36,
	"14": 36,
	"15": 36,
	"16": 36,
	"17": 36,
	"18": 36,
	"19": 36,
	"20": 36,
	"21": 36,
	"22": 36,
	"23": 36,
	"24": 36,
	"25": 36,
	"26": 36,
	"27": 36,
	"28": 36,
	"29": 36,
	"30": 36,
	"31": 36,
	"32": 36,
	"33": 36,
	"34": 36,
	"35": 36,
	"36": 36,
	"1st_12": 3,
	"2nd_12": 3,
	"3rd_12": 3,
	"1_34": 3,
	"2_35": 3,
	"3_36": 3,
	odd: 2,
	even: 2,
	"1_18": 2,
	"19_36": 2,
	red: 2,
	black: 2,
};

const handle_spinning_wheel = async () => {
	const combined_seed = `${server_seed}${
		Object.values(current_players).join("")
	}`;

	consola.info(`Combined seed: ${combined_seed}`);

	const random = seedrandom(await hashText(combined_seed));

	const win_map_size = Object.keys(win_map).length;

	winning_number = roulette_numbers.parse(
		Math.floor(random() * win_map_size).toString(),
	);

	consola.info(`Winning number: ${winning_number}`);

	return winning_number;
};

const handle_paying_out = async (
	winning_number: z.infer<typeof roulette_numbers>,
) => {
	if (!winning_number) {
		consola.fatal("No winning number");
		return;
	}

	const winning_bets = win_map[winning_number];

	consola.info("Winning bets", winning_bets);

	const res = Object.entries(bets).map(([peer_id, player_bets]) => {
		const win_amount = player_bets
			.filter(bet => winning_bets.includes(bet.bet))
			.map(bet => win_multiplier[bet.bet] * bet.amount)
			.reduce((a, b) => a + b, 0);

		const loss_amount = player_bets
			.filter(bet => !winning_bets.includes(bet.bet))
			.reduce((a, b) => a + b.amount, 0);

		return { peer_id, amount: win_amount - loss_amount };
	});

	const winning_amounts = res.filter((win) => win.amount > 0);
	const losing_amounts = res.filter((loss) => loss.amount <= 0).map((loss) => ({ ...loss, amount: -loss.amount }));

	consola.info("Winning amounts", winning_amounts);
	consola.info("Losing amounts", losing_amounts);

	send("result", {
		winning_number,
		winning_bets,
		winning_amounts,
		losing_amounts,
		server_seed,
		client_seeds: Object.values(current_players),
	});
};

const reset = () => {
	bets = {};
	allows_bets = true;
	server_seed = makeid(10);
	winning_number = null;
	waiting_for_bets_until = null;
};

// Learn more at https://docs.deno.com/runtime/manual/examples/module_metadata#concepts
if (import.meta.main) {
	console.info("Starting roulette worker");

	while (true) {
		reset();

		// Create a new websocket client if it doesn't exist
		if (!ws && (ws =  await create_new_ws_client(DEALER_KEY).catch(_ => null)) == null) {
			consola.error(`Error creating websocket client`);
			await sleep(5000);
			continue;
		}

		if (!is_successfully_connected) {
			await sleep(500);
			continue;
		}

		send("server_seed", { server_seed: await hashText(server_seed) });

		try {
			await handle_waiting_for_bets();
			const winning_number = await handle_spinning_wheel();
			await handle_paying_out(winning_number);
		} catch (error) {
			consola.error(`Error handling game state: ${error}`);

			const player_refunds = Object.entries(bets).map(([peer_id, bets]) => ({
				peer_id,
				amount: bets.reduce((a, b) => a + b.amount, 0),
			}));

			send("refund", {
				refunds: player_refunds,
			});
		}

		await sleep(500);
	}
}
