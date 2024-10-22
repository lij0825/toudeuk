"use client";
import { UserInfo } from '@/types/userInfo';
import { useState } from 'react'
import { useMutation } from 'react-query'
import { signupUser } from '@/apis/userApi';


export default function Signup() {
    const [formData, setFormData] = useState<UserInfo>({
        email: '',
        password: '',
        confirmPassword: '',
        phoneNumber: '',
        nickName: '',
        recommender: ''
    });

    const mutation = useMutation(signupUser, {
      onSuccess: (data) => {
        console.log('Signup successful', data);
        // 성공 시 리다이렉트 또는 메시지 출력
        alert('회원가입이 완료되었습니다.');
      },
      onError: (error) => {
        console.error('Signup failed', error);
        alert('회원가입에 실패했습니다.');
      },
    });

    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
        const { name, value } = e.target;
        setFormData((prev) => ({ ...prev, [name]: value }));
    };

    const handleSubmit = (e: React.FormEvent) => {
        e.preventDefault();
        if (formData.password !== formData.confirmPassword) {
            alert('비밀번호가 일치하지 않습니다.');
            return;
        }
        // 회원가입 요청 실행
          mutation.mutate(formData);
    };

    return (
        <div className="min-h-screen bg-gray-100 flex items-center justify-center">
            <div className="bg-white p-8 rounded shadow-md w-full max-w-md">
                <h2 className="text-2xl font-bold mb-6">Create <br /> Account</h2>
                <form onSubmit={handleSubmit} className="space-y-4">
                    <div>
                        <div>
                            <label htmlFor="email" className="block text-sm font-medium text-gray-700">
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
                            <label htmlFor="password" className="block text-sm font-medium text-gray-700">
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
                        <div>
                            <label htmlFor="confirmPassword" className="block text-sm font-medium text-gray-700">
                                confirm password
                            </label>
                            <input
                                type="password"
                                name="confirmPassword"
                                value={formData.confirmPassword}
                                onChange={handleChange}
                                className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                                required
                            />
                        </div>
                        <label htmlFor="phoneNumber" className="block text-sm font-medium text-gray-700">
                            phoneNumber
                        </label>
                        <input
                            type="text"
                            name="phoneNumber"
                            value={formData.phoneNumber}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                            required
                        />
                        <label htmlFor="nickName" className="block text-sm font-medium text-gray-700">
                            닉네임
                        </label>
                        <input
                            type="text"
                            name="recommender"
                            value={formData.nickName}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                        <hr className="my-6 border-gray-300" />
                        <label htmlFor="recommender" className="block text-sm font-medium text-gray-700">
                            추천인ID
                        </label>
                        <input
                            type="text"
                            name="recommender"
                            value={formData.recommender}
                            onChange={handleChange}
                            className="mt-1 p-2 w-full border border-gray-300 rounded-md"
                        />
                    </div>
            {/* </div> */}
            <div className="flex justify-center items-center">
                <button
                    type="submit"
                    className="w-2/4 bg-blue-500 text-white p-2 rounded-full hover:bg-blue-600 transition"
                //   className="w-full bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition"
                //   disabled={mutation.isLoading}
                >
                    {/* {mutation.isLoading ? '회원가입 중...' : '회원가입'} */}
                    SignUp
                </button>

            </div>
        </form>
            </div >
        </div >
    );
};
