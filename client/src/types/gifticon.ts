export interface GifticonInfo {
  id: number;
  name: string;
  imageUrl: string;
}

export interface UserGifticonInfo {
  userItemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  createdAt: string;
  used: boolean;
}
