"use client";

import { chargeKapay } from "@/apis/kapayApi";
import { useMutation } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { IoChevronBack } from "react-icons/io5";
import { useRouter } from "next/navigation";

const KapayPage = () => {
  const router = useRouter();

  const [deviceType, setDeviceType] = useState<string | undefined>();
  const [openType, setOpenType] = useState<string | undefined>();
  const [totalAmount, setTotalAmount] = useState<number>(0);

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

  const handleChargeClick = () => {
    if (totalAmount === 0) {
      console.error("충전할 금액이 선택되지 않았습니다.");
      return;
    }

    mutation.mutate(); // 결제 준비 API 호출
  };

  return (
    <div className="mx-[25px]">
      <div
        onClick={() => router.push("/point")}
        className="cursor-pointer py-4 flex flex-row items-center"
      >
        <IoChevronBack size={25} color="#545454" />
      </div>
      <p className="font-bold text-xl my-4">
        <span className="text-[22px] text-sub8">포인트</span> 충전
      </p>
      <div className="flex flex-col">
        <div className="flex flex-row items-center mt-10">
          <p className="font-bold text-xl text-end">
            <span className="text-sub7 text-2xl">포인트</span> 충전하기
          </p>
        </div>
        <p className="mx-2 my-6 pl-4 bg-white/50 font-bold h-10 flex items-center rounded-xl">
          {totalAmount.toLocaleString()} 원
        </p>
        <div className="flex flex-row justify-evenly">
          {[5000, 10000, 15000].map((amount) => (
            <button
              key={amount}
              className="bg-sub6 hover:bg-sub7"
              onClick={() => setAmount(amount)}
            >
              {amount.toLocaleString()}원
            </button>
          ))}
        </div>
        <button
          className="bg-sub7 hover:bg-sub7 rounded-xl text-white h-10 flex items-center justify-center mt-16"
          onClick={handleChargeClick}
        >
          충전하기
        </button>
        {mutation.isError && <p className="text-red-500 mt-2">결제 준비 중 오류가 발생했습니다.</p>}
      </div>
    </div>
  );
};

export default KapayPage;
