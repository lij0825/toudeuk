'use client'

import Image from "next/image";
import dynamic from "next/dynamic";
import { useState } from "react";
import { toast } from "react-toastify";
import { UserInfo } from "@/types";
import { patchUserInfo } from "@/apis/userInfoApi";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { CUSTOM_ICON } from "@/constants/customIcons";
import { useNicknameCheck } from "@/apis/user/useNicknameCheck";

const LottieAnimation = dynamic(
  () => import("@/app/components/LottieAnimation"),
  { ssr: false }
);

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
      <div onClick={handleModalOpen}>
      <Image src="/icons/setting.svg" alt="Icon" width="25" height="25" />
      </div>
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
  const maxNicknameLength = 8;

  const [isEditing, setIsEditing] = useState<boolean>(false);
  const [nickname, setNickname] = useState<string>(user?.nickName || "");
  const [profileImage, setProfileImage] = useState<File | null>(null);
  const [previewImage, setPreviewImage] = useState<string>(
    user?.profileImg
      ? `${user.profileImg}?${Date.now()}`
      : "/default_profile.png"
  );

  const { isValid, isChecked, checkNickname, isLoading } =
    useNicknameCheck(nickname);

  const mutation = useMutation({
    mutationFn: (formData: FormData) => patchUserInfo(formData),
    onSuccess: () => {
      toast.success("유저 정보 변경이 완료되었습니다.");
      cache.invalidateQueries({ queryKey: ["user"] });
    },
    onError: () => {
      toast.error("유저 정보 변경 중 에러가 발생했습니다.");
    },
  });

  const [isNicknameValid, setIsNicknameValid] = useState<boolean>(true);

  function toggleEditMode(): void {
    setIsEditing(!isEditing);
  }

  function handleNicknameChange(e: React.ChangeEvent<HTMLInputElement>) {
    const newNickname = e.target.value;

    // 글자 길이와 공백 검사
    if (newNickname.length > maxNicknameLength || /\s/.test(newNickname)) {
      setIsNicknameValid(false);
    } else {
      setIsNicknameValid(true);
    }

    setNickname(newNickname);
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
    if (!isChecked || !isValid || !isNicknameValid) {
      toast.error("닉네임을 확인해주세요.");
      return;
    }

    const formData = new FormData();
    formData.append("nickname", nickname);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    mutation.mutate(formData);
    setIsEditing(false);
    handleModalOpen();
  }

  function logout() {
    sessionStorage.removeItem("accessToken");
    window.location.href = "/";
  }

  if (!isOpen) return null;

  const nicknameExceedsLimit = nickname.length > maxNicknameLength;
  const hasWhitespace = /\s/.test(nickname);

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-40 backdrop-blur-sm"
      onClick={handleModalOpen}
    >
      <div
        className="relative w-80 bg-white border border-white border-opacity-30 shadow-lg rounded-xl p-6"
        onClick={(e) => e.stopPropagation()}
      >
        <section className="text-lg mb-2">
          <div className="mb-4">내 프로필</div>
          <div className="flex space-x-2 items-center justify-between">
            {isEditing ? (
              <></>
            ) : (
              <div className="flex items-center w-full justify-between">
                <div className="flex items-center">
                  <div className="w-[50px] h-[50px] rounded-full overflow-hidden mr-2">
                    <Image
                      width={50}
                      height={50}
                      src={
                        user?.profileImg
                          ? `${user.profileImg}?${Date.now()}`
                          : "/default_profile.png"
                      }
                      alt="프로필 미리보기"
                      className="object-cover w-full h-full"
                    />
                  </div>
                  <strong className="text-base">{user?.nickName}님</strong>
                </div>
                <div className="cursor-pointer" onClick={toggleEditMode}>
                  <LottieAnimation
                    animationData={CUSTOM_ICON.edit}
                    loop={true}
                    width={20}
                    height={20}
                    autoplay={true}
                  />
                </div>
              </div>
            )}
          </div>
        </section>

        {isEditing && (
          <section className="mb-4 space-y-4">
            <div className="flex justify-center">
              {previewImage && (
                <div className="w-[60px] h-[60px] rounded-full overflow-hidden">
                  <Image
                    width={60}
                    height={60}
                    src={previewImage}
                    alt="프로필 미리보기"
                    className="object-cover w-full h-full"
                    quality={100}
                  />
                </div>
              )}
            </div>
            {/* 닉네임 작성 */}
            <div className="relative">
              <p className="text-left mb-1">닉네임을 작성하세요</p>
              <div className="flex items-center gap-2">
                <input
                  type="text"
                  value={nickname}
                  onChange={handleNicknameChange}
                  placeholder="닉네임은 최대 8글자까지 가능합니다."
                  maxLength={maxNicknameLength + 1}
                  className={`w-2/3 px-3 py-2 rounded text-gray-600 text-sm border ${
                    nicknameExceedsLimit || hasWhitespace || !isNicknameValid
                      ? "border-red-500 focus:border-red-500 focus:ring-red-500"
                      : "border-gray-300 focus:border-blue-500 focus:ring-blue-500"
                  } focus:outline-none focus:ring-1`}
                />
                <button
                  onClick={checkNickname}
                  className="w-1/3 p-2 bg-blue-500 text-white rounded-lg text-xs hover:bg-blue-600 transition duration-150"
                >
                  중복 체크
                </button>
              </div>
              {nicknameExceedsLimit && (
                <p className="text-xs text-red-500 mt-1">
                  닉네임은 최대 8글자까지 가능합니다.
                </p>
              )}
              {hasWhitespace && (
                <p className="text-xs text-red-500 mt-1">
                  닉네임에 공백은 사용할 수 없습니다.
                </p>
              )}
              {isChecked && !isValid && (
                <p className="text-xs text-red-500 mt-1">
                  닉네임이 중복됩니다.
                </p>
              )}
              {isChecked && isValid && (
                <p className="text-xs text-green-500 mt-1">
                  닉네임이 중복되지 않습니다.
                </p>
              )}
              {!isChecked && (
                <p className="text-xs text-red-500 mt-1">
                  닉네임 중복 여부를 확인해주세요.
                </p>
              )}
            </div>

            <div className="relative w-full text-center">
              <input
                type="file"
                accept="image/*"
                onChange={handleImageChange}
                className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
              />
              <div className="w-full p-2 border rounded bg-gray-100 text-gray-600 text-sm text-center cursor-pointer">
                프로필 이미지 선택
              </div>
              <p className="text-xs text-gray-400 mt-1 text-center">
                최대 파일 크기: 5MB
              </p>
            </div>

            <div className="flex justify-center gap-4 mt-4">
              <button
                onClick={() => setIsEditing(false)}
                className="px-4 py-2 bg-gray-300 text-gray-700 rounded-lg text-sm hover:bg-gray-400 transition duration-150"
              >
                취소
              </button>
              <button
                onClick={handleSave}
                disabled={
                  !isChecked || !isValid || isLoading || !isNicknameValid
                }
                className={`px-4 py-2 rounded-lg text-sm text-white transition duration-150 ${
                  !isChecked || !isValid || isLoading || !isNicknameValid
                    ? "bg-gray-400 cursor-not-allowed"
                    : "bg-blue-500 hover:bg-blue-600"
                }`}
              >
                저장하기
              </button>
            </div>
          </section>
        )}

        {!isEditing && (
          <button
            onClick={logout}
            className="bg-red-500 mt-6 px-3 py-1 rounded-md text-sm text-white w-full hover:bg-red-600 transition duration-150"
          >
            로그아웃
          </button>
        )}
      </div>
    </div>
  );
}
