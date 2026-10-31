import { Linking, Platform } from 'react-native';
import * as Network from 'expo-network';

export interface ConnectivityStatus {
  isOnline: boolean;
  isServerReachable: boolean;
  connectionType: string;
  isLowBandwidth?: boolean;
}

type ConnectivityListener = (status: ConnectivityStatus) => void;

class ConnectivityService {
  private listeners: Set<ConnectivityListener> = new Set();
  private lastKnownStatus: ConnectivityStatus = {
    isOnline: true,
    isServerReachable: true,
    connectionType: 'unknown',
    isLowBandwidth: false,
  };
  private simulatedOffline: boolean = false;
  private simulatedLowBandwidth: boolean = false;

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

      const nav = navigator as any;
      if (nav && nav.connection) {
        nav.connection.addEventListener('change', () => {
          this.updateStatus();
        });
      }
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

  public setSimulatedLowBandwidth(simulated: boolean) {
    this.simulatedLowBandwidth = simulated;
    this.notifyListeners();
  }

  public isSimulatedLowBandwidth(): boolean {
    return this.simulatedLowBandwidth;
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
        isLowBandwidth: false,
      };
    }

    if (Platform.OS === 'web') {
      const isOnline = typeof navigator !== 'undefined' ? navigator.onLine : true;
      let isLow = this.simulatedLowBandwidth;

      const nav = typeof navigator !== 'undefined' ? (navigator as any) : null;
      if (nav && nav.connection) {
        const conn = nav.connection;
        if (
          conn.effectiveType === '2g' ||
          conn.effectiveType === 'slow-2g' ||
          (conn.rtt && conn.rtt > 1000) ||
          (conn.saveData === true)
        ) {
          isLow = true;
        }
      }

      this.lastKnownStatus = {
        isOnline,
        isServerReachable: isOnline,
        connectionType: isOnline ? (isLow ? 'cellular-2g' : 'wifi') : 'none',
        isLowBandwidth: isLow,
      };
      return this.lastKnownStatus;
    }

    try {
      const networkState = await Network.getNetworkStateAsync();
      const isOnline = Boolean(networkState.isConnected && networkState.isInternetReachable !== false);
      const isLow = this.simulatedLowBandwidth || networkState.type === Network.NetworkStateType.CELLULAR_2G;

      this.lastKnownStatus = {
        isOnline,
        isServerReachable: isOnline,
        connectionType: networkState.type?.toString() || 'unknown',
        isLowBandwidth: isLow,
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

    return { reachable: true };
  }

  /**
   * Helper to open Veryfy Lite PWA
   */
  public openVeryfyLite() {
    if (Platform.OS === 'web' && typeof window !== 'undefined') {
      window.location.href = '/lite/';
    } else {
      Linking.openURL('https://veryfyretailerapp.netlify.app/lite');
    }
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
      ? { isOnline: false, isServerReachable: false, connectionType: 'none', isLowBandwidth: false }
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
