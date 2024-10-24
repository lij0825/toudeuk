import Image from "next/image";

import { UserGifticonInfo } from "@/types/gifticon";

export default function GifticonCard({
  gifticon,
}: {
  gifticon: UserGifticonInfo;
}) {
  const { itemName, itemImage, itemPrice, createdAt, used } = gifticon;

  return (
    <div className="max-w-xs p-4 bg-white border border-gray-200 rounded-lg shadow-md">
      <Image
        src={itemImage}
        alt={itemName}
        width={200}
        height={150}
        className="rounded-lg"
        objectFit="cover"
      />
      <div className="mt-4">
        <h2 className="text-lg font-bold text-gray-900">{itemName}</h2>
        <p className="text-sm text-gray-500">
          Price: {itemPrice.toLocaleString()}원
        </p>
        <p className="text-sm text-gray-500">Created At: {createdAt}</p>
        <p className={`text-sm ${used ? "text-red-500" : "text-green-500"}`}>
          {used ? "Used" : "Available"}
        </p>
      </div>
    </div>
  );
}
