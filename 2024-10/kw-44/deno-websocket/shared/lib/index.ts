export const SERVER_PORT = 8080;
export const SOCKET_SERVER_OPTIONS = {
    cors: {
        origin: "*",
        methods: ["GET", "POST"],
    },
    allowEIO3: true,
    pingInterval: 10000,
    pingTimeout: 5000,
}
