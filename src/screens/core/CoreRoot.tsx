import React from 'react';
import { Outlet, useLocation } from 'react-router-dom';
import styled from 'styled-components';
import Sidebar from '../../components/core/Sidebar';

const CoreWrapper = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;

const CoreRoot = () => {
  const { pathname } = useLocation();
  return (
    <CoreWrapper>
      <Sidebar pathname={pathname} />
      <Outlet />
    </CoreWrapper>
  );
};

export default CoreRoot;
