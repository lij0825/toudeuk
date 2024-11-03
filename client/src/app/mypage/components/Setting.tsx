"use client";

import { patchUserInfo } from "@/apis/userInfoApi";
import { UserInfo } from "@/types";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import Image from "next/image";
import { useState } from "react";
import { toast } from "react-toastify";
import SvgSettingIcon from "./SettingIcon";

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

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50"
      onClick={handleModalOpen}
    >
      <div
        className="fixed max-w-md w-full md:w-1/2 lg:w-1/3 bg-white bg-opacity-10 backdrop-blur-lg border border-white border-opacity-30 shadow-lg rounded-xl p-6"
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

        {/* 수정영역 */}
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
                  width={50}
                  height={50}
                  src={previewImage}
                  alt="Profile preview"
                  className="w-24 h-24 object-cover rounded-full mt-4"
                  quality={100}
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
