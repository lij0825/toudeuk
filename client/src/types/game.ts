import { Client } from "@stomp/stompjs";

export interface GameInfo {
  coolTime: string;
  myClickCount: number;
  myRank: number;
  rewardType: "NONE" | "SECTION" | "WINNER" | "FIRST"
  status: string;
}

export interface WebSocketStore {
  stompClient: Client | null;
  count: number;
  connect: (accessToken: string) => void;
  disconnect: () => void;
  setCount: (newCount: number) => void;
}