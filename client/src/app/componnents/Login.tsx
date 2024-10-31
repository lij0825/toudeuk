"use client";

// import { LoginInfo } from "@/types/auth";
// import { useState } from "react";
// import { useMutation } from "@tanstack/react-query";
// import { loginUser } from "@/apis/userApi";
// import Link from "next/link";

export default function Login() {
  // const [formData, setFormData] = useState<LoginInfo>({
  //   email: "",
  //   password: "",
  // });

  // const mutation = useMutation({
  //   mutationFn: loginUser,
  // });

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

  // const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
  //   const { name, value } = e.target;
  //   setFormData((prev) => ({ ...prev, [name]: value }));
  // };

  // const handleSubmit = (e: React.FormEvent) => {
  //   e.preventDefault();
  //   mutation.mutate(formData);
  // };


    const handleKakaoLogin = () => {
    // 카카오 로그인 처리 함수 (구현 필요)
    console.log("카카오 로그인", process.env.NEXT_PUBLIC_API_URL);
    window.location.href = `${process.env.NEXT_PUBLIC_API_URL}/oauth2/authorization/kakao?redirect_uri=${process.env.NEXT_PUBLIC_BASE_URL}`;
  };

  return (
    <div className="flex items-center justify-center">
      <div className="p-8 rounded shadow-md w-full max-w-md">
        <h1 className="typo-title">터득</h1>
        <h1 className="typo-title">TouDeuk</h1>
        {/* <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div>
              <input
                type="email"
                name="email"
                value={formData.email}
                placeholder="ID"
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="password"
                placeholder="PASSWORD"
                value={formData.password}
                onChange={handleChange}
                className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-transparent"
                required
              />
            </div>
          </div>
          <div className="flex justify-center items-center typo-body">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
            >
              Login
            </button>
          </div>
        </form>
        <div className="flex items-center justify-center my-4">
          <hr className="flex-grow border-gray-300" />
          <span className="mx-2 text-gray-500">또는</span>
          <hr className="flex-grow border-gray-300" />
        </div> */}
        <div className="flex justify-center typo-body">
          <button
            onClick={handleKakaoLogin}
            className="flex items-center justify-center w-full h-10 rounded-md bg-[#FEE500] border border-[#FEE500] text-black hover:bg-[#FEE500] transition duration-200"
          >
            Login with Kakao
          </button>
        </div>
      </div>
    </div>
  );
}
