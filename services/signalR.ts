
import * as signalR from "@microsoft/signalr";
import api from "./api"; // Import our axios instance

type SignalRCallback = (data: any) => void;

class SignalRService {
  private static instance: SignalRService;
  private connection: signalR.HubConnection | null = null;
  private callbacks: Map<string, SignalRCallback[]> = new Map();
  private started: Promise<void> | null = null;

  private constructor() { }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  private async negotiate(hubName: string) {
    // Request connection info from our backend
    const { data: response } = await api.post('/api/realtime/negotiate', {
      hub: hubName
    });

    if (!response.success) {
      throw new Error(response.error?.message || 'SignalR negotiation failed');
    }

    return response.data; // { url, accessToken, hub }
  }

  public async start(): Promise<void> {
    if (this.started) return this.started;

    this.started = (async () => {
      try {
        // We use the adminHub by default for the dashboard
        // In a real app, this might depend on the current context
        const connectionInfo = await this.negotiate('adminHub');

        this.connection = new signalR.HubConnectionBuilder()
          .withUrl(connectionInfo.url, {
            accessTokenFactory: () => connectionInfo.accessToken
          })
          .withAutomaticReconnect()
          .configureLogging(signalR.LogLevel.None)
          .build();

        this.connection.onclose((error) => {
          this.started = null;
          if (error) {
            console.warn('SignalR connection closed:', error);
          }
        });

        await this.connection.start();
        console.log('SignalR connected to Azure via backend negotiation');
      } catch (err) {
        this.started = null;
        console.error('SignalR start failed:', err);
        throw err;
      }
    })();

    return this.started;
  }

  public on(event: string, callback: SignalRCallback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
      this.start().then(() => {
        this.connection?.on(event, (data) => {
          this.callbacks.get(event)?.forEach(cb => cb(data));
        });
      });
    }
    this.callbacks.get(event)?.push(callback);
  }

  public off(event: string, callback: SignalRCallback) {
    const list = this.callbacks.get(event);
    if (list) {
      const filtered = list.filter(cb => cb !== callback);
      this.callbacks.set(event, filtered);
      if (filtered.length === 0) {
        this.connection?.off(event);
        this.callbacks.delete(event);
      }
    }
  }

  public async invoke(methodName: string, ...args: any[]) {
    await this.start();
    return this.connection?.invoke(methodName, ...args);
  }

  public async joinSosGroup(sosId: string) {
    return api.post(`/api/realtime/groups/${sosId}/join`, { hub: 'sosHub' });
  }

  public async leaveSosGroup(sosId: string) {
    return api.post(`/api/realtime/groups/${sosId}/leave`, { hub: 'sosHub' });
  }

  public async joinRoleGroup(role: string, id: string) {
    // Backend handles role group joins during negotiation or via specialized endpoints
    return api.post(`/api/realtime/groups/${role}/join`, { hub: 'adminHub' });
  }
}

export const signalRService = SignalRService.getInstance();
