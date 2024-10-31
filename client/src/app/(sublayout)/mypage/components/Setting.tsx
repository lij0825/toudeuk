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
      className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleModalOpen} // 모달 바깥 클릭 시 닫기
    >
      <div
        className="bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 shadow-lg rounded-xl p-6 w-80% h-[200px]"
        onClick={(e) => e.stopPropagation()} // 모달 내부 클릭 시 닫히지 않도록 이벤트 중지
      >
        <section className="typo-title mb-5 flex items-end justify-between">
          <div className="flex items-end">
            <div>
              <p className="text-white">My</p>
              <p className="text-white">Profile</p>
            </div>
          </div>
        </section>
        <div className="text-center text-white">
          <p>Settings and Options</p>
          {/* 추가적인 설정 항목들이 이곳에 들어갈 수 있음 */}
        </div>
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
    <>
      <SettingIcon
        style={{ width: "32px", height: "32px" }}
        isOpen={isOpen}
        onClick={handleModalOpen}
      />
      {isOpen && (
        <SettingModal isOpen={isOpen} handleModalOpen={handleModalOpen} />
      )}
    </>
  );
}
