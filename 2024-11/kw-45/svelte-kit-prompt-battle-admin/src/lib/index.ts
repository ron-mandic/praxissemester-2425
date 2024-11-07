// place files you want to import through the `$lib` alias in this folder.

export const SOCKET_SERVER_URL = 'http://localhost:8080';
export const SOCKET_CLIENT_OPTIONS = {
	transports: ['websocket'],
	reconnection: false,
	reconnectionAttempts: 3,
	reconnectionDelay: 1000,
	pingInterval: 10000,
	pingTimeout: 5000,
	query: {
		'player-1': '1',
		'player-2': '2'
	}
};
