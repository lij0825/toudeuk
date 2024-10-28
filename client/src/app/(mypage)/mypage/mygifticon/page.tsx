import Link from "next/link";
import Image from "next/image";

export const gifticons = [
  {
    id: 1,
    name: "스타벅스 아메리카노",
    image:
      "https://bizimg.giftishow.com/Resource/goods/2023/G00002401431/G00002401431.jpg",
    price: "4500",
  },
  {
    id: 2,
    name: "N페이 상품권",
    image:
      "https://bizimg.giftishow.com/Resource/goods/2023/G00001981040/G00001981040.jpg",
    price: "5000",
  },
  {
    id: 3,
    name: "GS25 상품권",
    image:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    price: "5000",
  },
  {
    id: 4,
    name: "Burger",
    image:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    price: "5000",
  },
  {
    id: 5,
    name: "Cake",
    image:
      "https://bizimg.giftishow.com/Resource/goods/G00000750717/G00000750717.jpg",
    price: "5000",
  },
];

export default function mygifticon() {
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
        {gifticons.map((gifticon) => (
          <Link
            key={gifticon.id}
            href={`/gifticon/${gifticon.id}`}
            className="p-4 border rounded-lg relative h-32 my-6 backdrop-blur-lg bg-white/30 shadow-lg" // relative 속성 추가
            style={{
              backgroundImage:
                "linear-gradient(to top left, rgba(255, 255, 255, 0.5), rgba(255, 255, 255, 0) 70%), linear-gradient(to bottom right, rgba(255, 255, 255, 0.2), rgba(255, 255, 255, 0) 70%)",
            }}
          >
            <Image
              src={gifticon.image}
              alt={gifticon.name}
              width={180}
              height={80}
              className="h-20 rounded-lg w-4/5 absolute top-[-20%] left-1/2 transform -translate-x-1/2" // 80% 너비 및 위로 이동
            />
            <p className="text-center mt-12 relative z-10">{gifticon.name}</p>{" "}
            {/* p 태그의 상단 마진 조정 */}
          </Link>
        ))}
      </div>
    </>
  );
}
