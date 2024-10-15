<template>
	<div>
		<h1>Roulette</h1>
		<p v-if="isLoading">Loading...</p>
		<template v-else>
			<Button v-if="isAuthenticated" @click="sendMessage({ type: 'place_bet', amount: 100, bet: 'red' })"
				>Place Bet</Button
			>
			<div v-else>
				<p>Failed to authenticate</p>
			</div>
		</template>
	</div>
</template>

<script setup lang="ts">
import { useToast } from '~/components/ui/toast';
import type { Message, Response } from '~/server/types/roulette';

const { toast } = useToast();

const isLoading = computed(() => {
	return !!ws.value && isAuthenticated.value === false;
});

const isAuthenticated = ref(false);

const ws = ref<WebSocket | null>(null);

const sendMessage = (message: Message) => {
	ws.value?.send(JSON.stringify(message));
};

const connect = async () => {
	const isSecure = location.protocol === 'https:';
	const url = (isSecure ? 'wss://' : 'ws://') + location.host + '/roulette?dealer_key=1234';
	if (ws.value) {
		console.log('ws', 'Closing previous connection before reconnecting...');
		ws.value.close();
	}

	console.log('ws', 'Connecting to', url, '...');
	ws.value = new WebSocket(url);

	ws.value.addEventListener('message', async event => {
		let data = typeof event.data === 'string' ? event.data : await event.data.text();

		const message: Response = data.startsWith('{') ? JSON.parse(data) : { type: data };

		toast({ title: 'Message', description: message.type, variant: 'default' });

		if (message.type === 'authenticated') {
			isAuthenticated.value = true;
		}
	});

	ws.value.addEventListener('close', ev => {
		console.log('ws', 'Disconnected!');
		toast({ title: 'Disconnected from server', description: ev.reason, variant: 'destructive' });
		ws.value = null;
	});

	ws.value.addEventListener('error', error => {
		toast({ title: 'Unexpected Error', description: `${error}`, variant: 'destructive' });
		console.error('ws', 'Error:', error);
	});

	await new Promise(resolve => ws.value?.addEventListener('open', resolve));

	toast({ title: 'Connected', variant: 'default' });

	sendMessage({ type: 'authenticate', token: '123' });

	console.log('ws', 'Connected!');
};

onMounted(() => {
	connect();
});

onUnmounted(() => {
	ws.value?.close();
});
</script>
