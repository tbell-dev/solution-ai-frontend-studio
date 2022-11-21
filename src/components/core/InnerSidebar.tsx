import React from "react";
import styled from "styled-components";
import arrowDown from "../../assets/images/studio/icon/icon-arrow_down.svg";
import arrowUp from "../../assets/images/studio/icon/icon-arrow_up.svg";
import pManage from "../../assets/images/project/icon/icon-project-manage.svg";
import { InnerSidebarItem } from "../../screens/core/project/detail/ProjectDetailContainer";

export interface IInerSidbar {
  openSidebarUpper: boolean;
  selectedInnerTab: InnerSidebarItem;
  handleSelectInnerTab: (tab: InnerSidebarItem) => void;
  handleClickSidebarUpper: () => void;
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
  justify-content: space-between;
  box-sizing: border-box;
  width: 100%;
  height: 60px;
  cursor: pointer;
`;
const UpperLabel = styled.span`
  font-size: 14px;
  font-weight: 800;
  color: #243654;
`;
const SidebarBottom = styled.div`
  display: flex;
  flex-direction: column;
`;
const BottomInnerWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  border-left: 5px solid #eaf2fc;
  width: 100%;
  div {
    margin-left: 15px;
  }
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
  background-color: ${(props) => (props.isSelected ? "#ecf3fb" : "")};
`;
const Icon = styled.img`
  margin-right: 10px;
`;
const Label = styled.span<{ isSelected: boolean }>`
  font-size: 15px;
  font-weight: 700;
  color: ${(props) => (props.isSelected ? "#3580E3" : "#243754")};
`;

const InnerSidebar: React.FC<IInerSidbar> = ({
  openSidebarUpper,
  selectedInnerTab,
  handleSelectInnerTab,
  handleClickSidebarUpper,
}) => {
  return (
    <SidebarContainer>
      <SidebarWrapper>
        <SidebarUpper onClick={handleClickSidebarUpper}>
          <UpperLabel>프로젝트 이름</UpperLabel>
          <Icon src={openSidebarUpper ? arrowDown : arrowUp} />
        </SidebarUpper>
        {openSidebarUpper && (
          <SidebarBottom>
            <SidebarItem isSelected={true}>
              <Icon src={pManage} />
              <Label isSelected={true}>프로젝트 관리</Label>
            </SidebarItem>
            <BottomInnerWrapper>
              <SidebarItem
                onClick={() => handleSelectInnerTab(InnerSidebarItem.dataList)}
                isSelected={selectedInnerTab === InnerSidebarItem.dataList}
              >
                <Label
                  isSelected={selectedInnerTab === InnerSidebarItem.dataList}
                >
                  데이터 목록
                </Label>
              </SidebarItem>
              <SidebarItem
                onClick={() => handleSelectInnerTab(InnerSidebarItem.member)}
                isSelected={selectedInnerTab === InnerSidebarItem.member}
              >
                <Label
                  isSelected={selectedInnerTab === InnerSidebarItem.member}
                >
                  멤버작업현황
                </Label>
              </SidebarItem>
              <SidebarItem
                onClick={() => handleSelectInnerTab(InnerSidebarItem.statics)}
                isSelected={selectedInnerTab === InnerSidebarItem.statics}
              >
                <Label
                  isSelected={selectedInnerTab === InnerSidebarItem.statics}
                >
                  프로젝트 통계
                </Label>
              </SidebarItem>
              <SidebarItem
                onClick={() => handleSelectInnerTab(InnerSidebarItem.settings)}
                isSelected={selectedInnerTab === InnerSidebarItem.settings}
              >
                <Label
                  isSelected={selectedInnerTab === InnerSidebarItem.settings}
                >
                  설정
                </Label>
              </SidebarItem>
            </BottomInnerWrapper>
          </SidebarBottom>
        )}
      </SidebarWrapper>
    </SidebarContainer>
  );
};

export default InnerSidebar;
