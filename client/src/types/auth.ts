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

export enum TokenStatus {
  CHECKING = "CHECKING",
  VALID = "VALID",
  INVALID = "INVALID",
}

export enum UserStatus {
  IDLE = "IDLE",
  LOADING = "LOADING",
  SUCCESS = "SUCCESS",
  ERROR = "ERROR",
}

export interface AuthState {
  tokenStatus: TokenStatus;
  userStatus: UserStatus;
}
