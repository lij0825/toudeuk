export interface GifticonInfo {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
}

export interface UserGifticonInfo {
  userItemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  createdAt: string;
  used: boolean;
}
