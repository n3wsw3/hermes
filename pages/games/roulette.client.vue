<template>
	<div class="flex flex-col">
		<h1 class="text-4xl leading-7 mb-7">Roulette</h1>
		<p v-if="isLoading">Loading...</p>
		<template v-else>
			<template v-if="isAuthenticated">
				<div class="m-auto w-[724px] h-[350px] grid-cols-14 grid-rows-roulette grid [&>*]:flex [&>*]:items-center [&>*]:justify-center [&>*]:text-2xl [&>*]:border-2 [&>*]:border-white [&>*]:select-none [&>*]:bg-green-700 [&>*]:uppercase">
					<div class="row-start-1 row-end-4 rounded-r-lg [writing-mode:vertical-rl] rotate-180" @click="bet('0')">0</div>
					<div class="col-start-2  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('3')"><span class="bg-red-600 rounded-full py-5">3</span></div>
					<div class="col-start-3  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('6')"><span class="bg-black rounded-full py-5">6</span></div>
					<div class="col-start-4  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('9')"><span class="bg-red-600 rounded-full py-5">9</span></div>
					<div class="col-start-5  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('12')"><span class="bg-red-600 rounded-full py-5">12</span></div>
					<div class="col-start-6  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('15')"><span class="bg-black rounded-full py-5">15</span></div>
					<div class="col-start-7  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('18')"><span class="bg-red-600 rounded-full py-5">18</span></div>
					<div class="col-start-8  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('21')"><span class="bg-red-600 rounded-full py-5">21</span></div>
					<div class="col-start-9  col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('24')"><span class="bg-black rounded-full py-5">24</span></div>
					<div class="col-start-10 col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('27')"><span class="bg-red-600 rounded-full py-5">27</span></div>
					<div class="col-start-11 col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('30')"><span class="bg-red-600 rounded-full py-5">30</span></div>
					<div class="col-start-12 col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('33')"><span class="bg-black rounded-full py-5">33</span></div>
					<div class="col-start-13 col-span-1 row-start-1 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('36')"><span class="bg-red-600 rounded-full py-5">36</span></div>

					<div class="col-start-2  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('2')"><span class="bg-black rounded-full py-5">2</span></div>
					<div class="col-start-3  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('5')"><span class="bg-red-600 rounded-full py-5">5</span></div>
					<div class="col-start-4  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('8')"><span class="bg-black rounded-full py-5">8</span></div>
					<div class="col-start-5  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('11')"><span class="bg-black rounded-full py-5">11</span></div>
					<div class="col-start-6  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('14')"><span class="bg-red-600 rounded-full py-5">14</span></div>
					<div class="col-start-7  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('17')"><span class="bg-black rounded-full py-5">17</span></div>
					<div class="col-start-8  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('20')"><span class="bg-black rounded-full py-5">20</span></div>
					<div class="col-start-9  col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('23')"><span class="bg-red-600 rounded-full py-5">23</span></div>
					<div class="col-start-10 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('26')"><span class="bg-black rounded-full py-5">26</span></div>
					<div class="col-start-11 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('29')"><span class="bg-black rounded-full py-5">29</span></div>
					<div class="col-start-12 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('32')"><span class="bg-red-600 rounded-full py-5">32</span></div>
					<div class="col-start-13 col-span-1 row-start-2 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('35')"><span class="bg-black rounded-full py-5">35</span></div>

					<div class="col-start-2  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('1')"><span class="bg-red-600 rounded-full py-5">1</span></div>
					<div class="col-start-3  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('4')"><span class="bg-black rounded-full py-5">4</span></div>
					<div class="col-start-4  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('7')"><span class="bg-red-600 rounded-full py-5">7</span></div>
					<div class="col-start-5  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('10')"><span class="bg-black rounded-full py-5">10</span></div>
					<div class="col-start-6  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('13')"><span class="bg-black rounded-full py-5">13</span></div>
					<div class="col-start-7  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('16')"><span class="bg-red-600 rounded-full py-5">16</span></div>
					<div class="col-start-8  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('19')"><span class="bg-red-600 rounded-full py-5">19</span></div>
					<div class="col-start-9  col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('22')"><span class="bg-black rounded-full py-5">22</span></div>
					<div class="col-start-10 col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('25')"><span class="bg-red-600 rounded-full py-5">25</span></div>
					<div class="col-start-11 col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('28')"><span class="bg-black rounded-full py-5">28</span></div>
					<div class="col-start-12 col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('31')"><span class="bg-black rounded-full py-5">31</span></div>
					<div class="col-start-13 col-span-1 row-start-3 row-span-1 [writing-mode:vertical-rl] rotate-180" @click="bet('34')"><span class="bg-red-600 rounded-full py-5">34</span></div>

					<div class="col-start-14 col-span-1 row-start-1 row-span-1 rounded-tr-lg" @click="bet('3_36')"><span class="[writing-mode:vertical-rl] rotate-180">2 to 1</span></div>
					<div class="col-start-14 col-span-1 row-start-2 row-span-1" @click="bet('2_35')"><span class="[writing-mode:vertical-rl] rotate-180">2 to 1</span></div>
					<div class="col-start-14 col-span-1 row-start-3 row-span-1 rounded-br-lg" @click="bet('1_34')"><span class="[writing-mode:vertical-rl] rotate-180">2 to 1</span></div>

					<div class="col-start-2  col-span-4 row-start-4 row-span-1" @click="bet('1st_12')"><span>1st 12</span></div>
					<div class="col-start-6  col-span-4 row-start-4 row-span-1" @click="bet('2nd_12')"><span>2nd 12</span></div>
					<div class="col-start-10 col-span-4 row-start-4 row-span-1" @click="bet('3rd_12')"><span>3rd 12</span></div>

					<div class="col-start-2  col-span-2 row-start-5 row-span-1 rounded-bl-lg" @click="bet('1_18')"><span>1 to 18</span></div>
					<div class="col-start-4  col-span-2 row-start-5 row-span-1" @click="bet('even')"><span>Even</span></div>
					<div class="col-start-6  col-span-2 row-start-5 row-span-1 !bg-red-600" @click="bet('red')"><span>Red</span></div>
					<div class="col-start-8  col-span-2 row-start-5 row-span-1 !bg-black" @click="bet('black')"><span>Black</span></div>
					<div class="col-start-10 col-span-2 row-start-5 row-span-1" @click="bet('odd')"><span>Odd</span></div>
					<div class="col-start-12 col-span-2 row-start-5 row-span-1 rounded-br-lg" @click="bet('19_36')"><span>19 to 36</span></div>
				</div>
			</template>
			<div v-else>
				<p>Failed to authenticate</p>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import type { z } from 'zod';
import { useToast } from '~/components/ui/toast';
import { clientReceiveTypes, clientSendTypes, roulette_values, type ClientReceive, type ClientSend } from '~/server/types/roulette';

const { toast } = useToast();

const isLoading = computed(() => {
	return !!ws.value && isAuthenticated.value === false;
});

const isAuthenticated = ref(false);

const ws = ref<WebSocket | null>(null);

const makeid = (length: number) => {
	let result = "";
	const characters =
		"ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789";
	const charactersLength = characters.length;
	let counter = 0;
	while (counter < length) {
		result += characters.charAt(Math.floor(Math.random() * charactersLength));
		counter += 1;
	}
	return result;
};

type MaybePromise<T> = T | Promise<T>;

type Handlers<T> = {
	[K in keyof T]: (message: T[K]) => MaybePromise<void>;
};

const handlers: Handlers<ClientReceive> = {
	authenticated: message => {
		isAuthenticated.value = true;
		toast({ title: 'Authenticated', variant: 'default' });
	},
	bet_lost: message => {
		toast({ title: `Bet Lost ${message.amount}`, variant: 'warning' });
	},
	bet_won: message => {
		toast({ title: `Bet Won ${message.amount} C$`, variant: 'default' });
	},
	bet_placed_success: message => {
		toast({ title: `Bet Placed on ${message.bet} for ${message.amount} C$`, variant: 'default' });
	},
	bets_close_in: message => {
		toast({ title: `Bets Close In ${message.seconds}s`, variant: 'default' });
	},
	no_more_bets: message => {
		toast({ title: 'No More Bets', variant: 'default' });
	},
	not_enough_balance: message => {
		toast({ title: 'Not Enough Balance', variant: 'warning' });
	},
	place_bet: message => {
		toast({ title: 'Place Bet', description: `${message.amount} C$ on ${message.bet}`, variant: 'default' });
	},
	refund: message => {
		toast({ title: 'Refund', description: message.amount.toString(), variant: 'default' });
	},
	server_seed: message => {
		// toast({ title: 'Server Seed', description: message.server_seed, variant: 'default' });
	},
	user_joined: message => {
		toast({ title: 'User Joined', description: message.peer_id, variant: 'default' });
	},
	user_left: message => {
		toast({ title: 'User Left', description: message.peer_id, variant: 'default' });
	},
	welcome: message => {
		toast({ title: 'Welcome', variant: 'default' });
	},
};

const bet = (val: z.infer<typeof roulette_values>) => {
	sendMessage({ type: 'place_bet', amount: 100, bet: val });
}

const sendMessage = (message: z.infer<typeof clientSendTypes>) => {
	if (!ws.value) {
		toast({ title: 'Not connected', description: 'Please wait for the connection to be established', variant: 'warning' });
		return;
	}

	const maybeParsedMessage = clientSendTypes.safeParse(message);

	if (!maybeParsedMessage.success) {
		console.error('Invalid message', maybeParsedMessage.error);
		// toast({ title: 'Invalid message', description: JSON.stringify(maybeParsedMessage.error), variant: 'destructive' });
		return;
	}

	ws.value?.send(JSON.stringify(maybeParsedMessage.data));
};

const connect = async () => {
	const isSecure = location.protocol === 'https:';
	const url = (isSecure ? 'wss://' : 'ws://') + location.host + `/roulette`;
	if (ws.value) {
		console.log('ws', 'Closing previous connection before reconnecting...');
		ws.value.close();
	}

	console.log('ws', 'Connecting to', url, '...');
	ws.value = new WebSocket(url);

	ws.value.addEventListener('message', async event => {
		let data = typeof event.data === 'string' ? event.data : await event.data.text();

		let messageJson;
		try {
			messageJson = JSON.parse(data);
		} catch (e) {
			console.error('Message is not JSON', e);
			return;
		}

		const maybeParsedMessage = clientReceiveTypes.safeParse(messageJson);

		if (!maybeParsedMessage.success) {
			console.error('Invalid message', JSON.stringify(messageJson), maybeParsedMessage.error);
			return;
		}

		const message = maybeParsedMessage.data;

		const handler = handlers[message.type];

		if (!handler) {
			toast({ title: 'No handler implemented for message type', variant: 'destructive' });
			return;
		}

		await handler(message as never);
	});

	ws.value.addEventListener('close', ev => {
		console.log('ws', 'Disconnected!');
		toast({ title: 'Disconnected from server', description: ev.reason, variant: 'destructive' });
		ws.value = null;
		isAuthenticated.value = false;
	});

	ws.value.addEventListener('error', error => {
		toast({ title: 'Unexpected Error', description: `${error}`, variant: 'destructive' });
		console.error('ws', 'Error:', error);
	});

	await new Promise(resolve => ws.value?.addEventListener('open', resolve));

	toast({ title: 'Connected', variant: 'default' });

	sendMessage({ type: 'authenticate', token: '123', seed: makeid(16) });

	console.log('ws', 'Connected!');
};

onMounted(() => {
	connect();
});

onUnmounted(() => {
	ws.value?.close();
});
</script>
