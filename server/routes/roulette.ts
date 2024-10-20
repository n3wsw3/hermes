import consola from 'consola';
import { ServerReceive, ServerSend } from '../types/roulette';
import { create_game } from '../utils/game';

const ROOM_NAME = 'roulette';

const validateTicket = (ticket: string | null) => {
	if (!ticket) return false;
	return true;
};

const getUserFromTicket = (ticket: string) => {
	return 'user_id';
};

const is_valid_dealer_key = (key: string) => {
	const config = useRuntimeConfig();

	return key === config.dealerKey;
};

export default create_game<ServerReceive, ServerSend>(ROOM_NAME, is_valid_dealer_key, {
	authenticate({ closeConnection, sendToCurrentPeer, setUserIdForConnection, sendToAll, getPeerConnectionInfo }, { token, seed }) {
		let user_id = null;
		if (!token || !validateTicket(token) || (user_id = getUserFromTicket(token)) === null) {
			closeConnection(4001, 'Unauthorized');
			return;
		}
		setUserIdForConnection(user_id);
		
		const ci = getPeerConnectionInfo();

		if (ci === undefined) {
			closeConnection(4001, 'Unauthorized');
			return;
		}

		const peer = ci.peer;

		sendToAll('user_joined', { peer_id: peer.id, seed });
		sendToCurrentPeer('authenticated', {});
	},
	place_bet({ isDealerRequest, sendToCurrentPeer, sendToDealer, getPeerConnectionInfo }, { amount, bet }) {
		const ci = getPeerConnectionInfo();
		if (isDealerRequest()) {
			consola.warn('Dealer cannot place bets');
			sendToCurrentPeer('no_more_bets', {});
			return;
		} else if (ci !== undefined) {
			// TODO: validate and reserve the money from the user
			sendToDealer('place_bet', { amount, peer_id: ci.peer.id, bet });
		}
	},
	bets_close_in({ sendToAll, isDealerRequest, sendToPeer }, { seconds, peer_id }) {
		if (!isDealerRequest()) {
			consola.warn('User cannot close bets');
			return;
		}
		if (peer_id) {
			sendToPeer(peer_id, 'bets_close_in', { seconds });
		} else {
			sendToAll('bets_close_in', { seconds });
		}
	},
	no_more_bets({ sendToAll, isDealerRequest }) {
		if (!isDealerRequest()) {
			consola.warn('User cannot close bets');
			return;
		}
		sendToAll('no_more_bets', {});
	},
	server_seed({ sendToPeer, sendToAll, isDealerRequest }, { server_seed, peer_id }) {
		if (!isDealerRequest()) {
			consola.warn('User cannot set server seed');
			return;
		}
		if (peer_id) {
			sendToPeer(peer_id, 'server_seed', { server_seed });
		} else {
			sendToAll('server_seed', { server_seed });
		}
	},
	bet_placed({ sendToPeer, isDealerRequest }, { amount, peer_id, bet }) {
		if (!isDealerRequest()) {
			consola.warn('User cannot notify bet placed');
			return;
		}
		sendToPeer(peer_id, 'bet_placed_success', { amount, new_balance: 100, bet });
	},
	refund({ sendToPeer, isDealerRequest }, { refunds }) {
		if (!isDealerRequest()) {
			consola.warn('User cannot refund');
			return;
		}
		// TODO: Refund the user
		refunds.forEach(({ peer_id, amount }) => {
			sendToPeer(peer_id, 'refund', { amount });
		});
	},
	result(
		{ isDealerRequest, sendToPeer },
		{ server_seed, client_seeds, winning_number, winning_amounts, losing_amounts }
	) {
		if (!isDealerRequest()) {
			consola.warn('User cannot set result');
			return;
		}

		winning_amounts.forEach(({ peer_id, amount }) => {
			// TODO: Add the winning amount to the user's balance and get the new balance
			sendToPeer(peer_id, 'bet_won', { winning_number, server_seed, client_seeds, new_balance: 100, amount });
		});
		losing_amounts.forEach(({ peer_id, amount }) => {
			// TODO: Get the players current balance
			sendToPeer(peer_id, 'bet_lost', { winning_number, server_seed, client_seeds, new_balance: 100, amount });
		});
	}
});
