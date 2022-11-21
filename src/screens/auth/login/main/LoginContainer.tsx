import React from 'react';
// eslint-disable-next-line
import { useAppDispatch, useAppSelector } from '../../../../hooks';
import LoginPresenter from './LoginPresenter';

const LoginContainer = () => {
  // ! state, dispatch에 접근하는 방식
  // const isLoggedIn = useAppSelector((state) => state.userReducer.isLoggedIn);
  // const dispatch = useAppDispatch();
  return <LoginPresenter />;
};

export default LoginContainer;
