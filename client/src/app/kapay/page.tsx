"use client";

import { chargeKapay } from "@/apis/kapayApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/types";
import { fetchUserInfo } from "@/apis/userInfoApi";
import Image from "next/image";

const KapayPage = () => {
  const router = useRouter();
  const [currentPoints, setCurrentPoints] = useState<number | null>(null);

  const [deviceType, setDeviceType] = useState<string | undefined>();
  const [openType, setOpenType] = useState<string | undefined>();
  const [totalAmount, setTotalAmount] = useState<number>(0);
  const [customAmount, setCustomAmount] = useState<number | "">(0);
  const [selectedOption, setSelectedOption] = useState<string>("");

  const { data: userInfo, isError } = useQuery<UserInfo>({
    queryKey: ["user"],
    queryFn: fetchUserInfo,
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();

    const mobileDevices = [
      /android/i,
      /webos/i,
      /iphone/i,
      /ipad/i,
      /ipod/i,
      /blackberry/i,
      /windows phone/i,
    ];

    const detectedDeviceType = mobileDevices.some((device) => userAgent.match(device))
      ? "mobile"
      : "pc";

    setDeviceType(detectedDeviceType);
    setOpenType(detectedDeviceType === "mobile" ? "redirect" : "popup");

  }, []);

  const setAmount = (amount: number) => {
    setTotalAmount(amount);
  };

  const mutation = useMutation({
    mutationKey: ["kapay", "charge"],
    mutationFn: () => chargeKapay(deviceType as string, openType as string, "POINT", totalAmount),
    onSuccess: (redirectUrl) => {
      if (deviceType === "pc") {
        const width = 426;
        const height = 510;
        const left = (window.innerWidth - width) / 3;
        const top = (window.innerHeight - height) / 2;

        const popup = window.open(
          "",
          "paypopup",
          `width=${width},height=${height},left=${left},top=${top},toolbar=no`
        );

        if (!popup) {
          console.error("Popup을 열 수 없습니다!");
          return;
        }
        popup.location.href = redirectUrl;
      } else {
        window.location.replace(redirectUrl);
      }
    },
    onError: (error) => {
      console.error("결제 준비 중 오류가 발생했습니다:", error);
    },
  });

  const handleChargeClick = (amount: number) => {
    setTotalAmount(amount); // 버튼 클릭 시 해당 금액 설정
    mutation.mutate(); // 결제 준비 API 호출
  };

  // const handleChargeClick = () => {
  //   if (totalAmount === 0) {
  //     console.error("충전할 금액이 선택되지 않았습니다.");
  //     return;
  //   }

  //   mutation.mutate(); // 결제 준비 API 호출
  // };

  const handleOptionChange = (amount: number | "custom") => {
    if (amount === "custom") {
      setSelectedOption("custom");
      setTotalAmount(customAmount ? customAmount : 0);
    } else {
      setSelectedOption(amount.toString());
      setTotalAmount(amount);
      setCustomAmount("");
    }
  };

  const handleCustomAmountChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const value = Number(e.target.value);
    setTotalAmount(value);
    setCustomAmount(value);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex flex-col p-6">
      <p className="text-3xl font-bold text-gray-800 my-6">포인트 충전</p>
      <p className="mb-4">내 포인트 <span className="text-primary">{userInfo?.cash} 포인트</span></p>
      <div className="w-full max-w-md bg-white rounded-lg shadow-md p-3">
        <h2 className="text-lg font-semibold text-gray-700 mb-6">충전 금액 선택</h2>

        <div className="space-y-4 mb-6">
          {[1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 200000].map((amount) => (
            <div key={amount} className="flex justify-between items-center">
              <label className="flex items-center space-x-2">
                <Image
                  src={"/icons/coin.png"} // 동전 이미지
                  alt="coin Image"
                  width={23}
                  height={23}
                />
                {/* <input
                  type="radio"
                  name="amount"
                  value={amount}
                  checked={selectedOption === amount.toString()}
                  onChange={() => handleOptionChange(amount)}
                  className="text-blue-600 focus:ring-blue-500 h-4 w-4"
                /> */}
                <span className="text-gray-700 font-semibold">{amount.toLocaleString()} 포인트</span>
              </label>
              <button
                onClick={() => handleChargeClick(amount)}
                className="bg-blue-500 text-white rounded-md px-4 py-2 w-[100px] hover:bg-blue-600"
              >
                ₩{amount}
              </button>
            </div>
          ))}

          <div className="flex items-center justify-between">
            <label className="flex items-center space-x-2">
              <Image
                src={"/icons/coin.png"} // 동전 이미지
                alt="coin Image"
                width={23}
                height={23}
              />
              <input
                type="number"
                placeholder="직접 입력"
                value={customAmount || ""}
                onChange={handleCustomAmountChange}
                className="w-2/4 px-4 py-2 rounded-md border border-gray-300 focus:outline-none focus:border-blue-500 transition"
                disabled={selectedOption !== "custom"}
              />
            </label>
          <button
            onClick={() => handleChargeClick(customAmount ? Number(customAmount) : 0)}
            className="bg-blue-500 text-white rounded-md px-4 py-2 w-[100px] hover:bg-blue-600"
          >
            충전하기
          </button>
          </div>
        </div>


        {mutation.isError && (
          <p className="text-red-500 text-center mt-4">결제 준비 중 오류가 발생했습니다.</p>
        )}
      </div>
    </div>
  );
};

export default KapayPage;
