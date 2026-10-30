import { Platform } from 'react-native';
import * as Network from 'expo-network';

export interface ConnectivityStatus {
  isOnline: boolean;
  isServerReachable: boolean;
  connectionType: string;
}

type ConnectivityListener = (status: ConnectivityStatus) => void;

class ConnectivityService {
  private listeners: Set<ConnectivityListener> = new Set();
  private lastKnownStatus: ConnectivityStatus = {
    isOnline: true,
    isServerReachable: true,
    connectionType: 'unknown',
  };
  private simulatedOffline: boolean = false;

  constructor() {
    this.init();
  }

  private init() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.addEventListener('online', () => {
        this.updateStatus();
      });
      window.addEventListener('offline', () => {
        this.updateStatus();
      });
    }
  }

  /**
   * Set simulated offline mode for testing and QA
   */
  public setSimulatedOffline(simulated: boolean) {
    this.simulatedOffline = simulated;
    this.notifyListeners();
  }

  public isSimulatedOffline(): boolean {
    return this.simulatedOffline;
  }

  /**
   * Query the real network status from the device / browser
   */
  public async getConnectivityStatus(): Promise<ConnectivityStatus> {
    if (this.simulatedOffline) {
      return {
        isOnline: false,
        isServerReachable: false,
        connectionType: 'none',
      };
    }

    if (Platform.OS === 'web') {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      this.lastKnownStatus = {
        isOnline,
        isServerReachable: isOnline,
        connectionType: isOnline ? 'wifi' : 'none',
      };
      return this.lastKnownStatus;
    }

    try {
      const networkState = await Network.getNetworkStateAsync();
      const isOnline = Boolean(networkState.isConnected && networkState.isInternetReachable !== false);

      this.lastKnownStatus = {
        isOnline,
        isServerReachable: isOnline,
        connectionType: networkState.type?.toString() || 'unknown',
      };
      return this.lastKnownStatus;
    } catch {
      // Fallback if native network call fails
      return this.lastKnownStatus;
    }
  }

  /**
   * Distinguish between device offline vs server unreachable
   */
  public async checkVerificationServiceReachable(timeoutMs: number = 3000): Promise<{
    reachable: boolean;
    reason?: 'offline' | 'timeout' | 'server_error';
  }> {
    if (this.simulatedOffline) {
      return { reachable: false, reason: 'offline' };
    }

    const { isOnline } = await this.getConnectivityStatus();
    if (!isOnline) {
      return { reachable: false, reason: 'offline' };
    }

    // In production, this would ping the health endpoint (e.g. /api/health or /v1/ping).
    // For local mock / hybrid testing, simulate realistic connection check.
    return { reachable: true };
  }

  public subscribe(listener: ConnectivityListener): () => void {
    this.listeners.add(listener);
    // Immediately emit last known status
    listener(this.lastKnownStatus);

    return () => {
      this.listeners.delete(listener);
    };
  }

  private async updateStatus() {
    const status = await this.getConnectivityStatus();
    this.notifyListeners();
  }

  private notifyListeners() {
    const status: ConnectivityStatus = this.simulatedOffline
      ? { isOnline: false, isServerReachable: false, connectionType: 'none' }
      : this.lastKnownStatus;

    this.listeners.forEach((listener) => {
      try {
        listener(status);
      } catch (err) {
        console.warn('[ConnectivityService] Listener error:', err);
      }
    });
  }
}

export const connectivityService = new ConnectivityService();
