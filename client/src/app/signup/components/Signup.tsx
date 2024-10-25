"use client";
import { SignupInfo } from "@/types/auth";
import { useState } from "react";
import { useMutation } from "@tanstack/react-query";
import { signupUser } from "@/apis/userApi";

export default function Signup() {
  const [formData, setFormData] = useState<SignupInfo>({
    email: "",
    password: "",
    confirmPassword: "",
    phoneNumber: "",
    nickName: "",
    recommender: "",
  });

  const mutation = useMutation({
    mutationFn: signupUser,
  });

  // const mutation = useMutation(signupUser, {
  //   onSuccess: (data) => {
  //     console.log('Signup successful', data);
  //     // 성공 시 리다이렉트 또는 메시지 출력
  //     alert('회원가입이 완료되었습니다.');
  //   },
  //   onError: (error) => {
  //     console.error('Signup failed', error);
  //     alert('회원가입에 실패했습니다.');
  //   },
  // });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.password !== formData.confirmPassword) {
      alert("비밀번호가 일치하지 않습니다.");
      return;
    }
    // 회원가입 요청 실행
    mutation.mutate(formData);
  };

  return (
    <div className="min-h-screen flex items-center justify-center">
      <div className="p-8 rounded shadow-md w-full max-w-md">
        <h2 className="text-4xl font-bold mb-6">
          Create <br /> Account
        </h2>
        <form onSubmit={handleSubmit} className="space-y-4">
          <div>
            <div>
              <input
                type="email"
                name="email"
                placeholder="이메일을 입력하세요"
                value={formData.email}
                onChange={handleChange}
                className="mt-5 p-2 w-full border border-gray-300 rounded-md bg-transparent shadow-lg"
                style={{
                  boxShadow: "0 4px 6px rgba(0, 0, 0, 0.1), inset 0 1px 0 rgba(255, 255, 255, 0.6)",
                }}
                required
              />
            </div>
            <div>

              <input
                type="password"
                name="password"
                placeholder="비밀번호를 입력하세요"
                value={formData.password}
                onChange={handleChange}
                className="mt-5 p-2 w-full border border-gray-300 rounded-md bg-transparent"
                required
              />
            </div>
            <div>
              <input
                type="password"
                name="confirmPassword"
                placeholder="비밀번호를 입력하세요"
                value={formData.confirmPassword}
                onChange={handleChange}
                className="mt-5 p-2 w-full border border-gray-300 rounded-md bg-transparent"
                required
              />
            </div>
            <input
              type="text"
              name="phoneNumber"
              placeholder="전화번호를 입력하세요"
              value={formData.phoneNumber}
              onChange={handleChange}
              className="mt-5 p-2 w-full border border-gray-300 rounded-md bg-transparent"
              required
            />
            <input
              type="text"
              name="nickname"
              placeholder="닉네임을 입력하세요"
              value={formData.nickName}
              onChange={handleChange}
              className="mt-5 p-2 w-full border border-gray-300 rounded-md bg-transparent"
            />
            <hr className="my-6 border-gray-300" />
            <input
              type="text"
              name="recommender"
              placeholder="추천인ID를 입력하세요"
              value={formData.recommender}
              onChange={handleChange}
              className="mt-1 p-2 w-full border border-gray-300 rounded-md bg-transparent"
            />
          </div>
          {/* </div> */}
          <div className="flex justify-center items-center">
            <button
              type="submit"
              className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              //   className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
              //   disabled={mutation.isLoading}
            >
              {/* {mutation.isLoading ? '회원가입 중...' : '회원가입'} */}
              SignUp
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}
