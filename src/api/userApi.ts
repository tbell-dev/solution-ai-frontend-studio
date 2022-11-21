import callApi from "./module";

export interface IUserWorkStatics {
  stepOneCount: number;
  stepTwoCount: number;
  lastUpdated: number;
}

export interface IUser {
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

export interface ILoginResponsePayload {
  token: string;
  id: number;
}

// eslint-disable-next-line
export default {
  login: (form: ILoginRequestPayload) => callApi("post", "/auth/login", form),
  getAllUsers: (param: any) =>
    callApi("get", "/auth/user/search", null, undefined, param),
};
