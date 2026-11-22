import { useEffect, useRef, useState, useCallback } from 'react';
import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client';

const rawWsUrl = import.meta.env.VITE_WS_URL || '';
const rawApiUrl = import.meta.env.VITE_API_URL || import.meta.env.VITE_BACKEND_URL || '';

let WS_BASE_URL = 'http://localhost:8080/ws-synccart';
if (rawWsUrl) {
  const cleaned = rawWsUrl.replace(/\/+$/, '');
  WS_BASE_URL = cleaned.endsWith('/ws-synccart') ? cleaned : `${cleaned}/ws-synccart`;
} else if (rawApiUrl) {
  const cleaned = rawApiUrl.replace(/\/+$/, '').replace(/\/api$/, '');
  WS_BASE_URL = `${cleaned}/ws-synccart`;
}

export const useWebSocket = (roomCode, onMessageReceived) => {
  const [isConnected, setIsConnected] = useState(false);
  const clientRef = useRef(null);
  const subscriptionRef = useRef(null);

  const handleMessage = useCallback((message) => {
    try {
      const parsed = JSON.parse(message.body);
      if (onMessageReceived) {
        onMessageReceived(parsed);
      }
    } catch (err) {
      console.error('Failed to parse WebSocket message body:', err);
    }
  }, [onMessageReceived]);

  useEffect(() => {
    if (!roomCode) {
      setIsConnected(false);
      return;
    }

    const token = localStorage.getItem('synccart_token');

    const client = new Client({
      webSocketFactory: () => new SockJS(WS_BASE_URL),
      connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
      debug: (str) => {
        // Helpful during dev
        // console.log('[STOMP]', str);
      },
      reconnectDelay: 3000,
      heartbeatIncoming: 4000,
      heartbeatOutgoing: 4000,
      onConnect: () => {
        setIsConnected(true);
        console.log(`[STOMP] Connected to room /topic/room/${roomCode}`);

        // Subscribe to room topic
        subscriptionRef.current = client.subscribe(
          `/topic/room/${roomCode}`,
          handleMessage
        );
      },
      onDisconnect: () => {
        setIsConnected(false);
        console.log(`[STOMP] Disconnected from room ${roomCode}`);
      },
      onStompError: (frame) => {
        console.error('[STOMP] Broker reported error:', frame.headers['message']);
        console.error('[STOMP] Additional details:', frame.body);
      },
      onWebSocketError: (event) => {
        console.warn('[STOMP] WebSocket transport error:', event);
      }
    });

    client.activate();
    clientRef.current = client;

    return () => {
      if (subscriptionRef.current) {
        subscriptionRef.current.unsubscribe();
      }
      if (client.active) {
        client.deactivate();
      }
      setIsConnected(false);
    };
  }, [roomCode, handleMessage]);

  return { isConnected };
};
