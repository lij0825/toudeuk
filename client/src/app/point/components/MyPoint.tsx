"use client";

import React, { useState } from 'react'
import { HiInformationCircle } from 'react-icons/hi';

export default function MyPoint() {
    const [showInfo, setShowInfo] = useState(false); // 설명 표시 상태

    // 설명 토글 함수
    const handleInfoClick = () => {
        setShowInfo(true);
        // 3초 후 자동으로 알림을 닫기
        setTimeout(() => {
            setShowInfo(false);
        }, 3000);
    };

    return (
        <div className="flex flex-col items-center justify-center py-10" >
            <div className="p-8 rounded-3xl shadow-md w-full max-w-md" style={{ background: "linear-gradient(180deg, #353A40 17.2%, #16171B 117.2%)", borderColor: "#4A505B", borderWidth: "2px" }}>
                <h2 className="text-3xl font-bold mb-6">내 포인트</h2>
                <div className="flex items-center">
                    {/* <div className="bg-gray-200 rounded-lg p-6 w-full text-center">
                    </div> */}
                    <h3 className="text-4xl font-semibold">3000</h3>
                    <button onClick={handleInfoClick} className="ml-2">
                        <HiInformationCircle className="text-gray-500 w-6 h-6" />
                    </button>
                </div>
                <button className="mt-4 bg-blue-500 text-white font-semibold py-2 px-4 rounded hover:bg-blue-600 transition duration-200">
                    충전하기
                </button>
            </div>
            {/* 설명 부분 */}
            {showInfo && (
                <div className="fixed bottom-4 right-4 bg-blue-500 text-white p-4 rounded shadow-md">
                    <p>잔여 포인트입니다.</p>
                </div>
            )}
        </div>
    )
}
