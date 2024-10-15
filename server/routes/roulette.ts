import consola from 'consola';
import { Message, Response } from '../types/roulette';
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

export default create_game<Message, Response>(ROOM_NAME, is_valid_dealer_key, {
	authenticate({ closeConnection, sendToCurrentPeer, setUserIdForConnection }, { token }) {
		let user_id = null;
		if (!token || !validateTicket(token) || (user_id = getUserFromTicket(token)) === null) {
			closeConnection(4001, 'Unauthorized');
			return;
		}
		setUserIdForConnection(user_id);
		sendToCurrentPeer('authenticated', {});
	},
	place_bet({ isDealerRequest, sendToCurrentPeer }, { amount, bet }) {
		if (isDealerRequest()) {
			consola.warn('Dealer cannot place bets');
			sendToCurrentPeer('no_more_bets', {});
			return;
		} else {
			consola.info(`User placed bet of ${amount} on ${bet}`);
			sendToCurrentPeer('bet_placed', { amount, new_balance: 100 });
		}
	}
});
