import { ItemType } from "@/types/gifticon";

export default function getFilterClass(
  filter: ItemType,
  itemType: ItemType
): string {
  return filter === itemType ? "font-black" : "text-[#F5F4F7]";
}
