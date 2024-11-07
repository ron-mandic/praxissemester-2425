import io from 'socket.io-client';
import { SOCKET_SERVER_URL, SOCKET_CLIENT_OPTIONS } from './index.ts';

let socketAdmin: ReturnType<typeof io> | null = null;
let socketProjector: ReturnType<typeof io> | null = null;

/**
 *
 * @description
 * This function is used to create a socket connection to the server.
 * It works like a Singleton pattern, so it will create a socket
 * connection only once.
 *
 * @param {string} client - The type of client the socket is being used for.
 */
function useSocket(client: 'ADMIN' | 'PROJECTOR'): ReturnType<typeof io> {
	switch (client) {
		case 'ADMIN':
			if (!socketAdmin) {
				socketAdmin = io(SOCKET_SERVER_URL || 'http://localhost:8080', SOCKET_CLIENT_OPTIONS);
			}
			return socketAdmin;
		case 'PROJECTOR':
			if (!socketProjector) {
				socketProjector = io(SOCKET_SERVER_URL || 'http://localhost:8080', SOCKET_CLIENT_OPTIONS);
			}
			return socketProjector;
		default:
			throw new Error('useSocket: Invalid socket type');
	}
}

export default useSocket;
