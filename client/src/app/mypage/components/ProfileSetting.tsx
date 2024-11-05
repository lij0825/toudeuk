"use client";

import { patchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import SvgSettingIcon from "./SettingIcon";
import LottieAnimation from "../../components/LottieAnimation";
import { CUSTOM_ICON } from "@/constants/customIcons";

interface ModalProps {
  isOpen: boolean;
  handleModalOpen: () => void;
}

export default function ProfileSetting() {
  const [isOpen, setIsOpen] = useState<boolean>(false);

  const handleModalOpen = () => {
    setIsOpen(!isOpen);
  };

  return (
    <div>
      <SvgSettingIcon onClick={handleModalOpen} />
      {isOpen && (
        <SettingModal isOpen={isOpen} handleModalOpen={handleModalOpen} />
      )}
    </div>
  );
}

function SettingModal({ isOpen, handleModalOpen }: ModalProps) {
  const cache = useQueryClient();
  const user = cache.getQueryData<UserInfo>(["user"]);
  const maxSize = 5 * 1024 * 1024;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user?.nickName || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    user?.profileImg || "/default_profile.png"
  );

  const mutation = useMutation({
    mutationFn: (formData: FormData) => patchUserInfo(formData),
    onSuccess: () => {
      toast.success("유저 정보 변경이 완료되었습니다.");
      cache.invalidateQueries({ queryKey: ["user"] });
      cache.refetchQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("유저 정보 변경 중 에러가 발생했습니다.");
    },
  });

  function toggleEditMode(): void {
    setIsEditing(!isEditing);
  }

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    setNickname(e.target.value);
  }

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && file.size > maxSize) {
      alert("파일 크기가 너무 큽니다. 5MB 이하의 파일을 업로드해주세요.");
      e.target.value = "";
    } else if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file));
    }
  };

  function handleSave() {
    const formData = new FormData();
    formData.append("nickname", nickname);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    mutation.mutate(formData, {
      onSuccess: () => {
        cache.invalidateQueries({ queryKey: ["user"] });
        handleModalOpen();
      },
    });

    setIsEditing(false);
    handleModalOpen();
  }

  function logout() {
    sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={handleModalOpen}
    >
      <div
        className="relative w-80 bg-white border border-white border-opacity-30 shadow-lg rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="text-lg mb-4 flex justify-between items-center">
          내 프로필
          <div className="flex space-x-2 mt-4">
            {isEditing ? (
              <>
                <button
                  onClick={() => setIsEditing(false)}
                  className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition duration-150"
                >
                  취소
                </button>
                <button
                  onClick={handleSave}
                  className="px-4 py-2 bg-blue-500 text-white rounded-lg text-sm hover:bg-blue-600 transition duration-150"
                >
                  저장하기
                </button>
              </>
            ) : (
              <></>
            )}
          </div>
        </section>

        <section className="mb-4">
          <div className="flex items-center gap-4">
            <Image
              width={50}
              height={50}
              src={previewImage}
              alt="Profile preview"
              className="object-cover rounded-full"
            />
            <strong className="text-base">{nickname}님</strong>
          </div>

          <div className="relative mt-4">
            <input
              type="text"
              className="w-full p-2 h-12 border rounded text-black placeholder:text-gray-400 text-sm pr-10" // Add padding-right for icon space
              value={nickname}
              onChange={handleNicknameChange}
              disabled={!isEditing}
              placeholder="10글자 이내의 한글, 숫자, 영문소문자만 가능합니다."
            />
            {!isEditing && (
              <div className="absolute right-3 top-1/2 transform -translate-y-1/2">
                <LottieAnimation
                  animationData={CUSTOM_ICON.edit}
                  loop={true}
                  width={20}
                  height={20}
                  autoplay={true}
                />
              </div>
            )}
          </div>
          {isEditing && (
            <>
              <div className="relative w-full mt-4">
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleImageChange}
                  className="absolute inset-0 w-full h-12 opacity-0 cursor-pointer"
                />
                <div className="w-full p-2 border rounded bg-gray-100 text-gray-600 text-sm text-center cursor-pointer">
                  이미지 선택
                </div>
              </div>
              {previewImage && (
                <Image
                  width={80}
                  height={80}
                  src={previewImage}
                  alt="프로필 미리보기"
                  className="w-24 h-24 object-cover rounded-full mt-4"
                  quality={100}
                />
              )}
            </>
          )}
        </section>
        <button
          onClick={logout}
          className="bg-red-500 ml-auto px-3 py-1 rounded-lg text-sm bg-gray-500 hover:bg-red-600 text-white w-full"
        >
          로그아웃
        </button>
      </div>
    </div>
  );
}
