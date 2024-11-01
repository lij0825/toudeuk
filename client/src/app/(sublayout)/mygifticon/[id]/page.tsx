"use client";

// import Image from "next/image";
// import { toast, ToastContainer } from "react-toastify";

export default function MygiticonDetail({
  params,
}: {
  params: { id: number };
}) {
  return <div>주석처리 되어있음</div>;
  //   const { id } = params;
  //   const data = mygifticons[id];
  //   return (
  //     <div className="p-8">
  //       <h1 className="text-2xl font-bold mb-4">{data.itemName}</h1>
  //       {data ? (
  //         <div className="flex flex-col items-center">
  //           {/* 기프티콘 이미지 */}
  //           <Image
  //             src={data.itemImage}
  //             alt={data.itemName}
  //             width={300}
  //             height={300}
  //             className="rounded-lg shadow-lg"
  //           />
  //           {/* 기프티콘 이름 */}
  //           <h2 className="text-xl font-semibold mt-4">{data.itemName} P</h2>
  //           {/* 사용완료 버튼 */}
  //           <button
  //             className="mt-8 bg-blue-500 text-white px-6 py-2 rounded-lg hover:bg-blue-600 transition-colors"
  //             onClick={() =>
  //               toast.success(`${data.itemName} 사용이 완료되었습니다.`)
  //             }
  //           >
  //             사용하기
  //           </button>
  //           <ToastContainer />
  //         </div>
  //       ) : (
  //         <div className="text-center">기프티콘 정보를 불러올 수 없습니다.</div>
  //       )}
  //     </div>
  //   );
}
