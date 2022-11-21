import { IUserState } from './users';
import { Action, createSlice, Dispatch, PayloadAction } from '@reduxjs/toolkit';
import userApi, { ILoginRequestPayload, ILoginResponsePayload } from '../../api/userApi';

const userSlice = createSlice({
  name: 'user',
  initialState: {
    isLoggedIn: false,
    token: null,
    id: null,
  } as IUserState,
  reducers: {
    logIn(state, action: PayloadAction<ILoginResponsePayload>) {
      state.isLoggedIn = true;
      state.token = action.payload.token;
      state.id = action.payload.id;
    },
  },
});

export const { logIn } = userSlice.actions;

// ! dispatch methods
export const userLogin =
  (form: ILoginRequestPayload) => async (dispatch: Dispatch<Action>) => {
    try {
      const res = await userApi.login(form);
      if (res?.data.token && res.status === 200) {
        const token = res.data.token;
        const id = res.data.id;
        dispatch(logIn({ token, id }));
      }
    } catch (e) {
      // TODO: Handling error
    }
  };

export default userSlice.reducer;
