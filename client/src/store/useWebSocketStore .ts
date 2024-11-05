import { WebSocketStore } from "@/types/game";
import { create } from "zustand";
import { Client, Frame, IFrame, Stomp } from "@stomp/stompjs";
import SockJS from "sockjs-client";

const BASE_URL = process.env.NEXT_PUBLIC_API_URL;

export const useWebSocketStore = create<WebSocketStore>((set) => ({
  stompClient: null,
  count: 0,
  connect: (accessToken) => {
    const socket = new SockJS(`${BASE_URL}/ws`);
    const stompClient = Stomp.over(socket);
    const headers = {
      Authorization: `Bearer ${accessToken}`,
    };

    stompClient.connect(
      headers,
      (frame: IFrame) => {
        console.log("Connected:", frame);
        stompClient.subscribe(
          "/topic/game",
          (message) => {
            const data = JSON.parse(message.body);
            console.log("Received message:", data);
            set({ count: parseInt(data["totalClick"]) });
          },
          headers
        );
      },
      (error: Frame | string) => {
        console.error("Connection error:", error);
      }
    );

    set({ stompClient });
  },
  disconnect: () => {
    set((state) => {
      state.stompClient?.deactivate();
      return { stompClient: null };
    });
  },
  setCount: (newCount) => set({ count: newCount }),
}));
