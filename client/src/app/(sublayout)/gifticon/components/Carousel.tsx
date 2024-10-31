// import React from 'react'
// import { useState } from "react";
// import { useSwipeable } from "react-swipeable";
// import { gifticons } from './Gifticon';
// import Link from 'next/link';
// import Image from 'next/image';
// const Carousel = () => {
//     const [currentIndex, setCurrentIndex] = useState(0);

//     // 캐러셀에서 이전 슬라이드로 이동
//     const handlePrev = () => {
//       setCurrentIndex((prevIndex) => (prevIndex === 0 ? gifticons.length - 1 : prevIndex - 1));
//     };
  
//     // 캐러셀에서 다음 슬라이드로 이동
//     const handleNext = () => {
//       setCurrentIndex((prevIndex) => (prevIndex === gifticons.length - 1 ? 0 : prevIndex + 1));
//     };
  
//     // react-swipeable을 사용한 스와이프 핸들러
//     const swipeHandlers = useSwipeable({
//       onSwipedLeft: handleNext,
//       onSwipedRight: handlePrev,
//     });
//   return (
//     <div>
//         {/* 인기 있는 기프티콘 캐러셀 */}
//       <div className="relative w-full h-36" {...swipeHandlers}>
//         <div className="flex justify-between items-center mb-4">
//           <h2 className="text-2xl font-bold">인기 기프티콘</h2>
//         </div>
//         <div className="relative w-full h-full overflow-hidden">
//           <div
//             className="absolute inset-0 flex transition-transform duration-500"
//             style={{ transform: `translateX(-${currentIndex * 100}%)` }}
//           >
//             {gifticons.map((gifticon) => (
//               <Link
//                 key={gifticon.id}
//                 href={`/gifticon/${gifticon.id}`}
//                 className="w-2/4 h-3/4 p-4 flex-shrink-0 flex flex-col justify-center items-center border rounded-lg mx-2" // flex-col 추가
//               >
//                 <Image
//                   src={gifticon.image}
//                   alt={gifticon.name}
//                   width={180}
//                   height={40}
//                   className='h-20'
//                 />
//                 <p className="text-center mt-2">{gifticon.name}</p> {/* mt-2로 이미지와 텍스트 간격 추가 */}
//               </Link>
//             ))}
//           </div>
//         </div>
//         <button
//           className="absolute left-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
//           onClick={handlePrev}
//         >
//           {"<"}
//         </button>
//         <button
//           className="absolute right-2 top-1/2 transform -translate-y-1/2 p-2 rounded-full"
//           onClick={handleNext}
//         >
//           {">"}
//         </button>
//       </div>
//     </div>
//   )
// }

// export default Carousel