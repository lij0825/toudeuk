export interface SignupInfo {
  email: string;
  password: string;
  confirmPassword: string;
  phoneNumber: string;
  nickName: string;
  recommender: string | "";
}

export interface LoginInfo {
  email: string;
  password: string;
}
