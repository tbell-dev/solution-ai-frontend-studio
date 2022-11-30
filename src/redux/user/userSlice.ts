import { IUserState } from "./users";
import { Action, createSlice, Dispatch, PayloadAction } from "@reduxjs/toolkit";
import userApi, {
  ILoginRequestPayload,
  ILoginResponsePayload,
} from "../../api/userApi";

const userSlice = createSlice({
  name: "user",
  initialState: {
    isLoggedIn: false,
    accessToken: null,
    refreshToken: null,
    id: null,
    isAdmin: false,
  } as IUserState,
  reducers: {
    logIn(state, action: PayloadAction<ILoginResponsePayload>) {
      state.isLoggedIn = true;
      state.accessToken = action.payload.accessToken;
      state.refreshToken = action.payload.refreshToken;
      state.id = action.payload.id;
      state.isAdmin = action.payload.isAdmin;
    },
    logOut(state) {
      state.isLoggedIn = false;
      state.accessToken = null;
      state.refreshToken = null;
      state.id = null;
    },
  },
});

export const { logIn, logOut } = userSlice.actions;

// ! dispatch methods
export const userLogin = (form: ILoginRequestPayload) => async (
  dispatch: Dispatch<Action>
) => {
  try {
    const res = await userApi.login(form);
    if (res && res.status === 200) {
      const accessToken = res.data.access_token;
      const refreshToken = res.data.refresh_token;
      const id = res.data.user_id;
      const roleResponse = await userApi.getUserRole(
        { user_id: id },
        accessToken
      );
      if (roleResponse && roleResponse.status === 200) {
        const isAdmin = roleResponse.data.is_admin;
        dispatch(logIn({ accessToken, refreshToken, id, isAdmin }));
      }
    }
  } catch (e) {
    console.log(e);
  }
};

export const userLogout = (jwt: string) => async (
  dispatch: Dispatch<Action>
) => {
  try {
    const res = await userApi.logout(jwt);
    if (res && res.status === 200) {
      dispatch(logOut());
    }
  } catch (e) {
    console.log(e);
  }
};

export default userSlice.reducer;