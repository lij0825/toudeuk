"use client";

import { chargeKapay } from "@/apis/kapayApi";
import { useMutation, useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";
import { UserInfo } from "@/types";
import { fetchUserInfo } from "@/apis/userInfoApi";
import Image from "next/image";
import BackButton from "../components/Backbutton";

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
    const detectedDeviceType = mobileDevices.some((device) =>
      userAgent.match(device)
    )
      ? "mobile"
      : "pc";

    setDeviceType(detectedDeviceType);
    setOpenType(detectedDeviceType === "mobile" ? "redirect" : "popup");
  }, []);

  const mutation = useMutation({
    mutationKey: ["kapay", "charge"],
    mutationFn: () =>
      chargeKapay(
        deviceType as string,
        openType as string,
        "POINT",
        totalAmount
      ),
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

  return (
    <div className="bg-white h-full flex flex-col p-8">
      <div className="absolute top-10 right-10">
        <BackButton />
      </div>
      <p className="text-3xl font-bold font-noto pb-1">포인트 충전</p>
      <span className="text-primary mb-6 text-xl font-noto break-words whitespace-normal">
        현재 {userInfo?.cash} 포인트
      </span>
      <h2 className="text-xl font-noto font-semibold text-gray-700 mb-2">
        충전 금액 선택
      </h2>
      <div className="w-full max-w-md bg-white rounded-lg space-y-4 overflow-y-auto scrollbar-hidden">
        <div className="divide-y divide-gray-300">
          {[
            1000, 2000, 3000, 5000, 10000, 20000, 30000, 50000, 100000, 200000,
          ].map((amount) => (
            <div
              key={amount}
              className="flex justify-between items-center py-3"
            >
              <label className="flex items-center space-x-4">
                <Image
                  src={"/icons/coin.png"}
                  alt="coin Image"
                  width={23}
                  height={23}
                />
                <span className="text-gray-700 font-semibold font-noto">
                  {amount.toLocaleString()} 포인트
                </span>
              </label>
              <button
                onClick={() => handleChargeClick(amount)}
                className="bg-blue-500 text-white rounded-md px-4 py-2 w-[100px] hover:bg-blue-600"
              >
                ₩{amount}
              </button>
            </div>
          ))}
        </div>

        {mutation.isError && (
          <p className="text-red-500 text-center mt-4">
            결제 준비 중 오류가 발생했습니다.
          </p>
        )}

        <section className="p-1 flex-shrink-0 h-[62px]"></section>
      </div>
    </div>
  );
};

export default KapayPage;
