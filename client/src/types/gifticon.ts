export interface GifticonInfo {
  id: number;
  name: string;
  imageUrl: string;
}

export interface UserGifticonInfo {
  userItemId: number | 0;
  itemName: string;
  itemImage: string;
  itemPrice: number | 0;
  createdAt: string;
  used: boolean;
}
