import io from 'socket.io-client';
import { SOCKET_SERVER_URL, SOCKET_CLIENT_OPTIONS } from './index.ts';

let socket: ReturnType<typeof io> | null = null;

/**
 *
 * @description
 * This function is used to create a socket connection to the server.
 * It works like a Singleton pattern, so it will create a socket
 * connection only once.
 */
function useSocket(): ReturnType<typeof io> {
	if (!socket) {
		socket = io(SOCKET_SERVER_URL || 'http://localhost:8080', SOCKET_CLIENT_OPTIONS);
	}
	return socket;
}

export default useSocket;
