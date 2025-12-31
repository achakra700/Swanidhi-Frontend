
// Mock SignalR Client Service
// In production, you would use: import * as signalR from "@microsoft/signalr";

type SignalRCallback = (data: any) => void;

class SignalRService {
  private static instance: SignalRService;
  private callbacks: Map<string, SignalRCallback[]> = new Map();
  private isConnected: boolean = false;

  private constructor() {
    // Simulated connection setup
    this.mockConnect();
  }

  public static getInstance(): SignalRService {
    if (!SignalRService.instance) {
      SignalRService.instance = new SignalRService();
    }
    return SignalRService.instance;
  }

  private mockConnect() {
    console.debug("[SignalR] Connecting to Azure Hub...");
    setTimeout(() => {
      this.isConnected = true;
      console.debug("[SignalR] Connection established.");
    }, 1000);
  }

  public on(event: string, callback: SignalRCallback) {
    if (!this.callbacks.has(event)) {
      this.callbacks.set(event, []);
    }
    this.callbacks.get(event)?.push(callback);
  }

  public off(event: string, callback: SignalRCallback) {
    const list = this.callbacks.get(event);
    if (list) {
      this.callbacks.set(event, list.filter(cb => cb !== callback));
    }
  }

  public async joinSosGroup(sosId: string) {
    console.debug(`[SignalR] Joined monitoring group for SOS: ${sosId}`);
  }

  public async leaveSosGroup(sosId: string) {
    console.debug(`[SignalR] Left monitoring group for SOS: ${sosId}`);
  }

  // Simulated event emitter for demo purposes
  public triggerMockUpdate(event: string, data: any) {
    this.callbacks.get(event)?.forEach(cb => cb(data));
  }
}

export const signalRService = SignalRService.getInstance();
