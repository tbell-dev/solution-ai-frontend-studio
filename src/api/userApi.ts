import callApi from "./module";

export interface IUserWorkStatics {
  stepOneCount: number;
  stepTwoCount: number;
  lastUpdated: number;
}

export interface IUser {
  index?: number;
  userId: string;
  userDisplayName: string;
  userEmail: string;
  created: number;
  workStatics?: IUserWorkStatics;
}

export interface ILoginRequestPayload {
  user_id: string;
  user_password: string;
}

export interface IGetUserRoleParams {
  user_id: string;
}

export interface ILoginResponsePayload {
  accessToken: string;
  refreshToken: string;
  id: string;
  isAdmin: boolean;
}

// eslint-disable-next-line
export default {
  login: (form: ILoginRequestPayload) => callApi("post", "/auth/login", form),
  logout: (jwt?: string) => callApi("get", "/auth/logout", null, jwt),
  getUserRole: (param: IGetUserRoleParams, jwt?: string) =>
    callApi("get", "/auth/user/role", null, jwt, param),
  getAllUsers: (param: any, jwt?: string) =>
    callApi("get", "/auth/user/search", null, jwt, param),
};
