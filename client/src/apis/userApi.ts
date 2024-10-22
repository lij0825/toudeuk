import { LoginInfo, UserInfo } from "@/types/userInfo";

export const signupUser = async (data: UserInfo) => {
    const response = await fetch('/api/signup', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    });
    if (!response.ok) {
        throw new Error('회원가입에 실패했습니다.');
    }
    return response.json();
};

export const loginUser = async (data: LoginInfo) => {
    const response = await fetch('/api/login', {
        method: 'GET',
        headers: {
            'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
    })
    if (!response.ok) {
        throw new Error('로그인에 실패했습니다.');
    }
    return response.json();
}