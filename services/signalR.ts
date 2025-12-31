
import * as signalR from "@microsoft/signalr";

type SignalRCallback = (data: any) => void;

class SignalRService {
  private static instance: SignalRService;
  private connection: signalR.HubConnection | null = null;
  private callbacks: Map<string, SignalRCallback[]> = new Map();
  private started: Promise<void> | null = null;

  private constructor() {
    this.initConnection();
  }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  private initConnection() {
    const hubUrl = `${import.meta.env.VITE_API_BASE_URL || 'https://swanidhi-backend-g5f7c2gjfkh8drbt.centralindia-01.azurewebsites.net'}/hubs/swanidhi`;

    this.connection = new signalR.HubConnectionBuilder()
      .withUrl(hubUrl, {
        accessTokenFactory: () => localStorage.getItem('ls_token') || ""
      })
      .withAutomaticReconnect()
      .configureLogging(signalR.LogLevel.None) // Production safe: no logging
      .build();

    this.connection.onclose((error) => {
      if (error) {
        // Silently handle or use a specialized error reporter in real prod
      }
    });
  }

  public async start(): Promise<void> {
    if (this.started) return this.started;
    if (!this.connection) return;

    this.started = this.connection.start().catch(err => {
      this.started = null;
      throw err;
    });

    return this.started;
  }

  public on(event: string, callback: SignalRCallback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
      this.connection?.on(event, (data) => {
        this.callbacks.get(event)?.forEach(cb => cb(data));
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
    return this.invoke("JoinSosGroup", sosId);
  }

  public async leaveSosGroup(sosId: string) {
    return this.invoke("LeaveSosGroup", sosId);
  }

  public async joinRoleGroup(role: string, id: string) {
    return this.invoke("JoinRoleGroup", role, id);
  }
}

export const signalRService = SignalRService.getInstance();
