/**
 * Real-time event bus mimicking WebSocket communication with cross-tab BroadcastChannel
 */

class ResQLinkSocketBus {
  constructor() {
    this.listeners = new Map();
    this.channel = null;
    this.connected = true;

    if (typeof window !== 'undefined' && 'BroadcastChannel' in window) {
      try {
        this.channel = new BroadcastChannel('resqlink_socket_events');
        this.channel.onmessage = (event) => {
          const { eventName, payload } = event.data || {};
          if (eventName) {
            this.dispatchLocal(eventName, payload);
          }
        };
      } catch (err) {
        console.warn('BroadcastChannel initialization fallback:', err);
      }
    }
  }

  on(eventName, callback) {
    if (!this.listeners.has(eventName)) {
      this.listeners.set(eventName, new Set());
    }
    this.listeners.get(eventName).add(callback);

    // Return unsubscriber function
    return () => {
      this.off(eventName, callback);
    };
  }

  off(eventName, callback) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).delete(callback);
    }
  }

  emit(eventName, payload = {}) {
    // 1. Dispatch locally
    this.dispatchLocal(eventName, payload);

    // 2. Broadcast across tabs
    if (this.channel) {
      try {
        this.channel.postMessage({ eventName, payload });
      } catch (e) {
        // Safe fail
      }
    }
  }

  dispatchLocal(eventName, payload) {
    if (this.listeners.has(eventName)) {
      this.listeners.get(eventName).forEach((cb) => {
        try {
          cb(payload);
        } catch (err) {
          console.error(`Error in socket listener for ${eventName}:`, err);
        }
      });
    }

    // Wildcard listener
    if (this.listeners.has('*')) {
      this.listeners.get('*').forEach((cb) => {
        try {
          cb({ eventName, payload });
        } catch (err) {
          console.error('Error in wildcard socket listener:', err);
        }
      });
    }
  }

  isConnected() {
    return this.connected;
  }
}

export const socket = new ResQLinkSocketBus();
