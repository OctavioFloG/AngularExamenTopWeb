export interface LoginResponse {
  responseCodeTxt: string;
  message: {
    login: {
      token: string; // JWT token
    };
  };
  status: number;
  flag: string;
  data: number;
  type: string;
}