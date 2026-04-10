export interface IUser {
  _id: string;
  email: string;
  password: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface IAuthPayload {
  userId: string;
  email: string;
}

export interface IRegisterRequest {
  email: string;
  password: string;
}

export interface ILoginRequest {
  email: string;
  password: string;
}

export interface IAuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
  };
}
