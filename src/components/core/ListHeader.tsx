import React from "react";
import styled from "styled-components";
import { ListType } from "./ListItem";
import iconSelected from "../../assets/images/project/icon/icon-selected.svg";

export interface IListHeader {
  type: ListType;
  projectType?: number;
  selectAllDataset?: () => void;
  isSelectedAllDatasets?: () => boolean;
  removeAllDataset?: () => void;
  isSelectedAllTasks?: () => boolean;
  selectAllTask?: () => void;
  removeAllTask?: () => void;
}

const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 120px;
`;
const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 15px 25px;
  border-top: 1px solid #afccf4;
  border-bottom: 1px solid #afccf4;
`;
const ColName = styled(Label)`
  width: 100%;
  font-size: 15px;
  font-weight: 800;
  margin-right: 0;
  :last-child {
    text-align: center;
  }
  :nth-last-child(2) {
    text-align: center;
  }
`;
const CheckBox = styled.div`
  width: 80px;
  height: 13px;
  border: 1px solid #6b78a1;
  margin-right: 100px;
`;
const Icon = styled.img`
  cursor: pointer;
  margin-right: 100px;
`;
/** 전체 프로젝트 화면 등 화면에서 리스트로 사용되는 리스트 헤더 */
const ListHeader: React.FC<IListHeader> = ({
  type,
  projectType,
  selectAllDataset,
  isSelectedAllDatasets,
  removeAllDataset,
  isSelectedAllTasks,
  selectAllTask,
  removeAllTask,
}) => {
  return (
    <>
      {type === "ALL_PRJECT" && (
        <Row>
          <ColName>No</ColName>
          <ColName>프로젝트 유형</ColName>
          <ColName>프로젝트 명</ColName>
          <ColName>
            전체진행률{" "}
            <Label style={{ fontSize: 12, textAlign: "end", marginRight: 0 }}>
              (검수완료 / 전체)
            </Label>
          </ColName>
          <ColName>작업자 수</ColName>
          <ColName>프로젝트 생성일</ColName>
        </Row>
      )}
      {type === "USER_WORK_STATICS" && (
        <Row>
          <ColName>작업자명</ColName>
          <ColName>작업자 메일</ColName>
          <ColName style={{ textAlign: "center" }}>
            {projectType === 1 ? "수집" : projectType === 2 ? "전처리" : "가공"}
          </ColName>
          <ColName>검수</ColName>
          <ColName>마지막 업데이트</ColName>
        </Row>
      )}
      {type === "DATASET TYPE" &&
        selectAllDataset &&
        isSelectedAllDatasets &&
        removeAllDataset && (
          <Row>
            {isSelectedAllDatasets() ? (
              <Icon src={iconSelected} onClick={removeAllDataset} />
            ) : (
              <CheckBox onClick={selectAllDataset} />
            )}
            <ColName>데이터셋 번호</ColName>
            <ColName>데이터셋 명</ColName>
            <ColName>데이터셋 건수</ColName>
            <ColName>데이터셋 대분류</ColName>
            <ColName>데이터셋 세부분류</ColName>
            <ColName>데이터셋 총 용량</ColName>
          </Row>
        )}
      {type === "DATALIST" &&
        projectType &&
        isSelectedAllTasks &&
        selectAllTask &&
        removeAllTask && (
          <Row style={{ justifyContent: "none" }}>
            {isSelectedAllTasks() ? (
              <Icon
                src={iconSelected}
                onClick={removeAllTask}
                style={{ marginRight: 30, cursor: "pointer", width: "1%" }}
              />
            ) : (
              <CheckBox
                onClick={selectAllTask}
                style={{ marginRight: 30, cursor: "pointer", width: "1%" }}
              />
            )}
            <ColName style={{ width: "30%" }}>파일명</ColName>
            <ColName style={{ width: "10%" }}>작업단계</ColName>
            <ColName style={{ width: "10%" }}>작업상태</ColName>
            <ColName style={{ width: "10%" }}>마지막 업데이트</ColName>
            <ColName style={{ width: "15%" }}>
              {projectType === 1
                ? "수집담당자"
                : projectType === 2
                ? "전처리 담당자"
                : "가공담당자"}
            </ColName>
            <ColName style={{ width: "15%" }}>검수담당자</ColName>
          </Row>
        )}
    </>
  );
};

export default ListHeader;
