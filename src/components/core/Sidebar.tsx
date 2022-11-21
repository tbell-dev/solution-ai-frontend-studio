import React from 'react';
import { Link } from 'react-router-dom';
import styled from 'styled-components';
import headerLogo from '../../assets/images/project/header+menu/header-logo.svg';
import dashboard from '../../assets/images/project/header+menu/icon-menu1.svg';
import dashboardSelected from '../../assets/images/project/header+menu/icon-menu1-1.svg';
import projects from '../../assets/images/project/header+menu/icon-menu2.svg';
import projectsSelected from '../../assets/images/project/header+menu/icon-menu2-1.svg';
import mywork from '../../assets/images/project/header+menu/icon-menu3.svg';
import guide from '../../assets/images/project/header+menu/icon-menu4.svg';

interface ISidebar {
  pathname: string;
}

const SidebarContainer = styled.div`
  display: flex;
  flex-direction: column;
  /* width: 170px; */
  min-width: 170px;
  max-width: 170px;
  height: 100%;
  box-sizing: border-box;
  border-right: 1px;
  border-right-color: #cddff8;
  border-right-style: solid;
  background-color: #ffffff;
`;
const SidebarWrapper = styled.div`
  display: flex;
  flex-direction: column;
  padding: 0 15px;
`;
const SidebarUpper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
`;
const Logo = styled.img``;
const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
`;
const SidebarItem = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  height: 40px;
  padding-left: 10px;
  box-sizing: border-box;
  border-radius: 5px;
  margin-bottom: 5px;
  cursor: pointer;
  :hover {
    background-color: #ecf3fb;
  }
  background-color: ${(props) => (props.isSelected ? '#ecf3fb' : '')};
`;
const Icon = styled.img`
  margin-right: 10px;
`;
const Label = styled.span<{ isSelected: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => (props.isSelected ? '#3580E3' : '#243754')};
`;

const Sidebar: React.FC<ISidebar> = ({ pathname }) => {
  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarUpper>
          <Link to={'/'}>
            <Logo src={headerLogo} />
          </Link>
        </SidebarUpper>
        <SidebarBottom>
          <Link to={'dashboard'}>
            <SidebarItem isSelected={pathname.includes('/core/dashboard')}>
              <Icon
                src={
                  pathname.includes('/core/dashboard')
                    ? dashboardSelected
                    : dashboard
                }
              />
              <Label isSelected={pathname.includes('/core/dashboard')}>
                대시보드
              </Label>
            </SidebarItem>
          </Link>
          <Link to={'projects'}>
            <SidebarItem isSelected={pathname.includes('/core/projects')}>
              <Icon
                src={
                  pathname.includes('/core/projects')
                    ? projectsSelected
                    : projects
                }
              />
              <Label isSelected={pathname.includes('/core/projects')}>
                전체 프로젝트
              </Label>
            </SidebarItem>
          </Link>
          <Link to={'myworks'}>
            <SidebarItem isSelected={pathname.includes('/core/myworks')}>
              <Icon src={mywork} />
              <Label isSelected={pathname.includes('/core/myworks')}>
                내 작업
              </Label>
            </SidebarItem>
          </Link>
          <Link to={'guide'}>
            <SidebarItem isSelected={pathname.includes('/core/guide')}>
              <Icon src={guide} />
              <Label isSelected={pathname.includes('/core/guide')}>
                이용 가이드
              </Label>
            </SidebarItem>
          </Link>
        </SidebarBottom>
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default Sidebar;
