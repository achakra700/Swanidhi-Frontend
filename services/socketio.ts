import { io, Socket } from 'socket.io-client';

type SocketIOCallback = (data: any) => void;

class SocketIOService {
    private static instance: SocketIOService;
    private socket: Socket | null = null;
    private callbacks: Map<string, SocketIOCallback[]> = new Map();
    private connected: boolean = false;

    private constructor() { }

    public static getInstance(): SocketIOService {
        if (!SocketIOService.instance) {
            SocketIOService.instance = new SocketIOService();
        }
        return SocketIOService.instance;
    }

    /**
     * Start Socket.IO connection
     */
    public async start(): Promise<void> {
        if (this.connected && this.socket?.connected) {
            console.log('Socket.IO already connected');
            return;
        }

        try {
            const token = localStorage.getItem('ls_token');
            if (!token) {
                throw new Error('No authentication token found');
            }

            // Get backend URL from environment or use default
            const backendUrl = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

            console.log('Connecting to Socket.IO server:', backendUrl);

            this.socket = io(backendUrl, {
                auth: {
                    token,
                },
                transports: ['websocket', 'polling'],
                reconnection: true,
                reconnectionAttempts: 5,
                reconnectionDelay: 1000,
                timeout: 20000,
            });

            // Connection event handlers
            this.socket.on('connect', () => {
                this.connected = true;
                console.log('Socket.IO connected successfully', {
                    id: this.socket?.id,
                });
            });

            this.socket.on('connected', (data) => {
                console.log('Received welcome message:', data);
            });

            this.socket.on('disconnect', (reason) => {
                this.connected = false;
                console.log('Socket.IO disconnected:', reason);
            });

            this.socket.on('connect_error', (error) => {
                console.error('Socket.IO connection error:', error.message);
            });

            this.socket.on('error', (error) => {
                console.error('Socket.IO error:', error);
            });

            // Register all existing callbacks
            this.callbacks.forEach((callbacks, event) => {
                this.socket?.on(event, (data) => {
                    callbacks.forEach((cb) => cb(data));
                });
            });

            // Wait for connection
            await new Promise<void>((resolve, reject) => {
                const timeout = setTimeout(() => {
                    reject(new Error('Socket.IO connection timeout'));
                }, 20000);

                this.socket?.once('connect', () => {
                    clearTimeout(timeout);
                    resolve();
                });

                this.socket?.once('connect_error', (error) => {
                    clearTimeout(timeout);
                    reject(error);
                });
            });

            console.log('Socket.IO service started successfully');
        } catch (err) {
            this.connected = false;
            console.error('Socket.IO start failed:', err);
            throw err;
        }
    }

    /**
     * Subscribe to an event
     */
    public on(event: string, callback: SocketIOCallback): void {
        if (!this.callbacks.has(event)) {
            this.callbacks.set(event, []);

            // If already connected, register the event handler immediately
            if (this.socket?.connected) {
                this.socket.on(event, (data) => {
                    this.callbacks.get(event)?.forEach((cb) => cb(data));
                });
            }
        }

        this.callbacks.get(event)?.push(callback);

        // Auto-start connection if not started
        if (!this.connected) {
            this.start().catch((err) => {
                console.error('Failed to auto-start Socket.IO:', err);
            });
        }
    }

    /**
     * Unsubscribe from an event
     */
    public off(event: string, callback?: SocketIOCallback): void {
        if (!callback) {
            // Remove all callbacks for this event
            this.callbacks.delete(event);
            this.socket?.off(event);
        } else {
            // Remove specific callback
            const callbacks = this.callbacks.get(event);
            if (callbacks) {
                const index = callbacks.indexOf(callback);
                if (index > -1) {
                    callbacks.splice(index, 1);
                }
                if (callbacks.length === 0) {
                    this.callbacks.delete(event);
                    this.socket?.off(event);
                }
            }
        }
    }

    /**
     * Emit an event to the server
     */
    public emit(event: string, data: any): void {
        if (!this.socket?.connected) {
            console.warn('Cannot emit event, socket not connected:', event);
            return;
        }

        this.socket.emit(event, data);
    }

    /**
     * Join a room/group
     */
    public async joinRoleGroup(role: string, userId: string): Promise<void> {
        // Socket.IO automatically joins rooms on the server based on authentication
        // This is handled in the backend Socket.IO service
        console.log('User automatically joined role group:', role);
    }

    /**
     * Stop the connection
     */
    public async stop(): Promise<void> {
        if (this.socket) {
            this.socket.disconnect();
            this.socket = null;
            this.connected = false;
            this.callbacks.clear();
            console.log('Socket.IO service stopped');
        }
    }

    /**
     * Check if connected
     */
    public isConnected(): boolean {
        return this.connected && this.socket?.connected === true;
    }
}

// Export singleton instance
export const socketIOService = SocketIOService.getInstance();
