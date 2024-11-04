import { Client } from "@stomp/stompjs";

export interface GameInfo {
  myRank: number;
  myClickCount: number;
  prevUserId: number;
  prevClickCount: number;
  totalClick: number;
}

export interface WebSocketStore {
  stompClient: Client | null;
  count: number;
  connect: (accessToken: string) => void;
  disconnect: () => void;
  setCount: (newCount: number) => void;
}