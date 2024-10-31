"use client";

import { useState } from "react";
import SettingIcon from "../../../../../public/icons/setting.svg";
interface ModalProps {
  isOpen: boolean;
  handleModalOpen: () => void;
}

function SettingModal({ isOpen, handleModalOpen }: ModalProps) {
  if (!isOpen) return null; // 모달이 열리지 않은 경우 null 반환

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 "
      onClick={handleModalOpen} // 모달 바깥 클릭 시 닫기
    >
      <div
        className="max-w-1/2 z-50 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 shadow-lg rounded-xl p-6"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 중지
      >
        <section className="typo-body mb-2 flex items-end justify-between">
          <div className="flex items-end">
            <p>My</p>
            <p>Profile</p>
          </div>
        </section>
        <section className="typo-body">
          <p>Settings and Options</p>
          <form action="" className="g-10">
            <input type="text" className="w-full" />
            <input type="text" className="w-full" />
            <input type="text" className="w-full" />
            <input type="text" className="w-full" />
          </form>
        </section>
      </div>
    </div>
  );
}

export default function SettingButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="relative z-9999 w-full">
      <SettingIcon
        style={{ width: "32px", height: "32px" }}
        isOpen={isOpen}
        onClick={handleModalOpen}
      />
      {isOpen && (
        <SettingModal isOpen={isOpen} handleModalOpen={handleModalOpen} />
      )}
    </div>
  );
}
