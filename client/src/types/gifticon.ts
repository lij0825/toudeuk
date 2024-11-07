export interface GifticonInfo {
  itemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  itemType: ItemType;
}

export enum ItemType {
  ALL = "ALL",
  CHICKEN = "CHICKEN",
  COFFEE = "COFFEE",
  VOUCHER = "VOUCHER",
  ETC = "ETC",
}
export interface UserGifticonDetailInfo {
  userItemId: number;
  itemName: string;
  itemImage: string;
  itemBarcode: string;
  itemType: ItemType;
  createdAt: string;
  used: boolean;
}

export interface UserGifticonInfo {
  userItemId: number;
  itemName: string;
  itemImage: string;
  itemPrice: number;
  createdAt: string;
  used: boolean;
  itemType: ItemType;
}
