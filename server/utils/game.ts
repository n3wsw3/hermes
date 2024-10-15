import consola from 'consola';
import { Peer } from 'crossws';

interface ConnectionInfo {
	user_id: string;
	peer: Peer;
}

type M = {
	authenticate: { token: string };
};

type R = {
	welcome: {};
	user_joined: { peer_id: string };
	user_left: { peer_id: string };
	authenticated: {};
};

type CTX<Resp> = {
	sendToCurrentPeer: <K extends keyof Resp>(type: K, response: Resp[K]) => void;
	sendToAll: <K extends keyof Resp>(type: K, response: Resp[K]) => void;
	closeConnection: (code: number, reason: string) => void;
	setUserIdForConnection: (user_id: string) => void;
	deletePeerConnectionInfo: () => void;
	getPeerConnectionInfo: () => ConnectionInfo | undefined;
	isDealerRequest: () => boolean;
};

type ConvertedType<T> = {
    [K in keyof T]: { type: K } & T[K];
}[keyof T];

export type MessageHandlers<Message extends M, Resp extends R> = {
	[M in keyof Message]: (ctx: CTX<Resp>, params: Message[M]) => void;
};

export function create_game<Message extends M, Response extends R>(
	room_name: string,
	is_valid_dealer_key: (key: string) => boolean,
	handlers: MessageHandlers<Message, Response>
) {
	const connections = {} as Record<string, ConnectionInfo | undefined>;
	let dealer_peer: Peer | null = null;

	type IncomingMessage = ConvertedType<Message>;

	const has_dealer = () => dealer_peer !== null;
	const is_dealer_request = (peer: Peer) => {
		if (dealer_peer !== null && dealer_peer === peer) {
			return true;
		}

		const url = peer.request?.url;
		if (!url) {
			consola.warn('Cannot determine if dealer request when url is not available');
			return false;
		}

		const query = new URLSearchParams(url.slice(url.indexOf('?')));

		const dealer_key = query.get('dealer_key');
		if (!dealer_key) {
			return false;
		}

		// Check if dealer_key is valid
		return is_valid_dealer_key(dealer_key);
	};

	const peer_join = (peer: Peer) => {
		peer.subscribe(room_name);
	};

	const send_to_peer = <Name extends keyof Response, Value extends Response[Name]>(
		peer: Peer,
		name: Name,
		response: Value
	) => {
		peer.send({ type: name, ...response });
	};

	const send_to_all = <Name extends keyof Response>(peer: Peer, name: Name, response: Response[Name]) => {
		peer.publish(room_name, { type: name, ...response });
	};

	const getCtx = (peer: Peer): CTX<Response> => {
		return {
			sendToCurrentPeer(type, response) {
				send_to_peer(peer, type, response);
			},
			sendToAll(type, response) {
				send_to_all(peer, type, response);
			},
			closeConnection(code, reason) {
				peer.close(code, reason);
			},
			setUserIdForConnection(user_id) {
				connections[peer.id] = { user_id, peer };
			},
			deletePeerConnectionInfo() {
				delete connections[peer.id];
			},
			getPeerConnectionInfo() {
				return connections[peer.id];
			},
			isDealerRequest() {
				return is_dealer_request(peer);
			}
		};
	};

	return defineWebSocketHandler({
		open(peer) {
			if (!has_dealer() && !is_dealer_request(peer)) {
				peer.close(4999, 'No dealer available');
				return;
			} else if (has_dealer() && is_dealer_request(peer)) {
				peer.close(4999, 'Dealer already connected');
				return;
			} else if (is_dealer_request(peer)) {
				dealer_peer = peer;
			}
			peer_join(peer);
			send_to_peer(peer, 'welcome', {});
			send_to_all(peer, 'user_joined', { peer_id: peer.id });
		},
		message(peer, message) {
			const m = message.json<IncomingMessage>();
			const connection = connections[peer.id];

			if (connection === undefined && m.type !== 'authenticate') {
				consola.warn('User not authenticated', peer);

				peer.close(4001, 'Unauthorized');
			} else if (connection !== undefined && m.type === 'authenticate') {
				consola.warn('User already authenticated', peer);

				peer.close(4000, 'Bad Request');
			} else {
				handlers[m.type](getCtx(peer), m);
			}
		},
		close(peer, details) {
			consola.info('Peer disconnected', peer.id, details);
			delete connections[peer.id];
			if (dealer_peer === peer) {
				dealer_peer = null;

				// TODO: Refund all bets
				consola.warn(`Dealer disconnected on ${room_name}`);
				Object.entries(connections).forEach(([id, connection]) => {
					if (connection === undefined) {
						return;
					}

					connection.peer.close(4999, 'Dealer disconnected');
				});
			}
			send_to_all(peer, 'user_left', { peer_id: peer.id });
		}
	});
}
