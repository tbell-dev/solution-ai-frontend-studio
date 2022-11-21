import React from 'react';
import styled from 'styled-components';
import iconList from '../../assets/images/project/header+menu/icon-list.svg';
import iconAlarm from '../../assets/images/project/header+menu/icon-alarm.svg';
import iconProfile from '../../assets/images/project/header+menu/icon-profile.svg';

export interface IHeader {
  title: string;
  projectType?: number;
}

const Container = styled.div`
  width: 100%;
  min-height: 61px;
  max-height: 61px;
  border-bottom: 1px;
  border-bottom-color: #cddff8;
  border-bottom-style: solid;
  display: flex;
  justify-content: space-between;
  align-items: center;
  box-sizing: border-box;
  padding: 0 60px;
`;
const HeaderPart = styled.div`
  display: flex;
  align-items: center;
`;
const PartIcon = styled.img``;
const PartTitle = styled.span`
  margin-left: 12px;
  font-size: 17px;
  font-weight: 800;
  color: #243754;
`;
const PartType = styled.div`
  width: 130px;
  height: 30px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ecf3fb;
  border-radius: 20px;
  margin-left: 30px;
  padding: 3px 5px;
`;

const Header: React.FC<IHeader> = ({ title, projectType }) => {
  return (
    <Container>
      <HeaderPart>
        <PartIcon src={iconList} />
        <PartTitle>{title}</PartTitle>
        {projectType && (
          <PartType>
            {projectType === 1
              ? '데이터 수집'
              : projectType === 2
              ? '데이터 정제/전처리'
              : '데이터 가공'}
          </PartType>
        )}
      </HeaderPart>
      <HeaderPart>
        <PartIcon src={iconAlarm} style={{ marginRight: 30 }} />
        <PartIcon src={iconProfile} />
      </HeaderPart>
    </Container>
  );
};

export default Header;
