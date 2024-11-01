"use client";

import { UserInfo } from "@/types";
import { useQueryClient } from "@tanstack/react-query";
import { useState } from "react";
import SettingIcon from "../../../../../public/icons/setting.svg";
import { patchUserInfo } from "@/apis/userInfoApi";
import { useMutation } from "@tanstack/react-query";
import { toast } from "react-toastify";
import Image from "next/image";

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
  const cache = useQueryClient();
  const user = cache.getQueryData<UserInfo>(["user"]);

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
    if (file) {
      setProfileImage(file);
      setPreviewImage(URL.createObjectURL(file)); // 미리보기 설정
    }
  };

  function handleSave() {
    const formData = new FormData();
    formData.append("nickname", nickname);
    if (profileImage) {
      formData.append("profileImage", profileImage);
    }

    mutation.mutate(formData);

    setIsEditing(false);
    handleModalOpen();
  }

  if (!isOpen) return null;

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
              <label className="block mb-2">Nickname</label>
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

              {previewImage && (
                <Image
                  width={30}
                  height={30}
                  src={previewImage}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full mt-4"
                />
              )}
            </>
          ) : (
            <ul className="list-none space-y-2">
              <li>
                <strong>Nickname:</strong> {nickname}
              </li>
              <li>
                <Image
                  width={30}
                  height={30}
                  src={previewImage}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full mt-4"
                />
              </li>
            </ul>
          )}
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
