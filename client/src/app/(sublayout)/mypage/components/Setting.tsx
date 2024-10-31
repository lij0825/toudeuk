"use client";

import { UserInfo } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SettingIcon from "../../../../../public/icons/setting.svg";
// interface FormData {
//   nickname: string;
//   imageUrl: string | File; // 이미지 URL 또는 파일로 관리
// }

interface ModalProps {
  isOpen: boolean;
  handleModalOpen: () => void;
}

export default function SettingButton() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div className="absolute right-0 top-0 z-50">
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

function SettingModal({ isOpen, handleModalOpen }: ModalProps) {
  //불필요한 호출 방지를 위하여, 최초 렌더링 시 상위 컴포넌트에서 호출한 'user'를 가져옴
  const cache = useQueryClient();
  const user = cache.getQueryData<UserInfo>(["user"]);

  // 상태관리

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user?.nickName || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  // const [previewImage, setPreviewImage] = useState<string | null>(
  // user?.profileImg || "/default-profile.png")

  // const [formData, setFormData] = useState<FormData>({
  //   nickname: nickname,
  //   imageUrl: "/default-profile.png", // 기본 이미지 설정
  // });

  //편집모드 전환
  function toggleEditMode(): void {
    setIsEditing(!isEditing);
  }

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setProfileImage(file);
      // setPreviewImage(URL.createObjectURL(file)); // 파일 미리보기 설정
    }
  };

  function handleSave() {
    //mutation 로직
    setIsEditing(false);
    handleModalOpen();
  }

  if (!isOpen) return null; // 모달이 열리지 않은 경우 null 반환

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleModalOpen}
    >
      <div
        className="max-w-md z-50 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 shadow-lg rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="typo-body mb-4 flex items-end justify-between">
          <div className="flex items-end gap-2">
            <p>My</p>
            <p>Profile</p>
          </div>
          <button
            onClick={toggleEditMode}
            className="text-blue-500 hover:text-blue-700"
          >
            {isEditing ? "Cancel" : "Edit"}
          </button>
        </section>

        <section className="typo-body mb-4">
          {isEditing ? (
            <>
              <label className="block mb-2 text-">Nickname</label>
              <input
                type="text"
                className="w-full mb-4 p-2 border rounded text-black"
                value={nickname}
                onChange={handleNicknameChange}
                placeholder="Enter your nickname"
              />

              <label className="block mb-2">Profile Image</label>
              <input
                type="file"
                accept="image/*"
                className="w-full mb-2 p-2 border rounded"
                onChange={handleImageChange}
              />
            </>
          ) : (
            <>
              <ul className="list-none space-y-2">
                <li>
                  <strong>Nickname:</strong> {nickname}
                </li>
              </ul>
            </>
          )}

          {profileImage &&
            // <Image
            //   width={30}
            //   height={30}
            //   // src={profileImage}
            //   alt="Profile preview"
            //   className="w-24 h-24 object-cover rounded-full mt-4"
            // />
            ""}
        </section>

        {isEditing && (
          <section className="typo-body">
            <button
              onClick={handleSave}
              className="w-full bg-blue-500 text-white p-2 rounded mt-4"
            >
              Save Changes
            </button>
          </section>
        )}
      </div>
    </div>
  );
}
