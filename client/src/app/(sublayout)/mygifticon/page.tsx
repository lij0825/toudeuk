import Image from "next/image";
import Link from "next/link";
import { mygifticons } from "./constant/dummyUserGifticon";

// MyGifticon 컴포넌트
export default function MyGifticon() {
  return (
    <>
      <section className="typo-title mb-5 flex items-end justify-between">
        <div className="flex items-end">
          <div>
            <p>My</p>
            <p>Gifticon</p>
          </div>
        </div>
      </section>
      <div className="grid grid-cols-2 gap-4">
        {mygifticons.map((gifticon) => (
          <Link
            key={gifticon.userItemId}
            href={`/mygifticon/${gifticon.userItemId}`}
            className="p-4 border rounded-lg relative h-32 my-6 backdrop-blur-lg bg-white/30 shadow-lg"
            style={{
              backgroundImage:
                "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
            }}
          >
            <Image
              src={gifticon.itemImage}
              alt={gifticon.itemName}
              width={180}
              height={80}
              className="h-20 rounded-lg w-4/5 absolute top-[-20%] left-1/2 transform -translate-x-1/2"
            />
            <p className="text-center mt-12 relative z-10">
              {gifticon.itemName}
            </p>
          </Link>
        ))}
      </div>
    </>
  );
}
