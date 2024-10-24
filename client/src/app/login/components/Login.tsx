"use client";

import { LoginInfo } from "@/types/auth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { loginUser } from "@/apis/userApi";

export default function Login() {
  const [formData, setFormData] = useState<LoginInfo>({
    email: "",
    password: "",
  });

  const mutation = useMutation({
    mutationFn: loginUser,
  });

  //   const mutation = useMutation(loginUser, {
  //     onSuccess: (data) => {
  //       // 로그인 성공 시 처리할 로직
  //       console.log("로그인 성공:", data);
  //       // 예: 리다이렉션 또는 사용자 데이터 저장
  //     },
  //     onError: (error) => {
  //       // 로그인 실패 시 처리할 로직
  //       alert(error);
  //     },
  //   });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    mutation.mutate(formData);
  };

  const handleKakaoLogin = () => {
    // 카카오 로그인 처리 함수 (구현 필요)
    window.location.href = "http://localhost:8080/oauth2/authorization/kakao";
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-100">
      <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-2xl font-bold mb-6">Login</h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div>
              <label
                htmlFor="email"
                className="block text-sm font-medium text-gray-700"
              >
                ID
              </label>
              <input
                type="email"
                name="email"
                value={formData.email}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
            <div>
              <label
                htmlFor="password"
                className="block text-sm font-medium text-gray-700"
              >
                password
              </label>
              <input
                type="password"
                name="password"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                required
              />
            </div>
          </div>
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="w-2/4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
              //   className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              //   disabled={mutation.isLoading}
            >
              {/* {mutation.isLoading ? '회원가입 중...' : '회원가입'} */}
              Login
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">또는</span>
          <hr className="flex-grow border-gray-300" />
        </div>
        <div className="flex justify-center">
          <button
            onClick={handleKakaoLogin}
            className="flex items-center justify-center w-2/4 h-10 rounded-[20.997px] bg-[#FEE500] border border-[#FEE500] text-black hover:bg-[#FEE500] transition duration-200"
          >
            Login with Kakao
          </button>
        </div>
      </div>
    </div>
  );
}
