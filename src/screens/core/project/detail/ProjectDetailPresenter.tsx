import {
  ChakraProvider,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalFooter,
  ModalHeader,
  ModalOverlay,
} from "@chakra-ui/react";
import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { IProject } from "../../../../api/projectApi";
import { ITask } from "../../../../api/taskApi";
import { IUser } from "../../../../api/userApi";
import Header from "../../../../components/core/Header";
import InnerSidebar from "../../../../components/core/InnerSidebar";
import ListHeader from "../../../../components/core/ListHeader";
import ListItem from "../../../../components/core/ListItem";
import Paginator from "../../../../components/core/Paginator";
import Loader from "../../../../components/Loader";
import iconSearch from "../../../../assets/images/project/icon/icon-search-white.svg";
import iconPrev from "../../../../assets/images/project/icon/icon-prev.svg";
import iconNext from "../../../../assets/images/project/icon/icon-next.svg";
import { InnerSidebarItem } from "./ProjectDetailContainer";
import {
  LineChart,
  PieArcSeries,
  PieChart,
  Gridline,
  GridlineSeries,
  LineSeries,
  Line,
} from "reaviz";

export interface IProjectDetailPresenter {
  page: string;
  totalTasksCount: number | undefined;
  project: IProject | undefined;
  projectTasks: ITask[] | undefined;
  projectUsers: IUser[] | undefined;
  openSidebarUpper: boolean;
  selectedInnerTab: InnerSidebarItem;
  fileInput: React.MutableRefObject<HTMLInputElement | null>;
  openWorkerAssign: boolean;
  assignProgress: "전처리" | "수집" | "가공" | "검수" | undefined;
  assignees: IUser[] | undefined;
  assigneePage: number;
  searchText: string | undefined;
  assignee: IUser | undefined;
  totalMembersCount: number | undefined;
  members: IUser[] | undefined;
  membersPage: number;
  handleSelectInnerTab: (tab: InnerSidebarItem) => void;
  handleClickSidebarUpper: () => void;
  handleGoStudio: () => void;
  selectTask: (taskId: number) => void;
  removeTask: (taskId: number) => void;
  isSelectedTask: (taskId: number) => boolean;
  isSelectedAllTasks: () => boolean;
  selectAllTask: () => void;
  removeAllTask: () => void;
  handleDoSearch: () => Promise<void>;
  handleChangeSearch: (e: ChangeEvent<HTMLInputElement>) => void;
  selectFile: () => void;
  handleChangeFileUpload: (e: ChangeEvent<HTMLInputElement>) => Promise<void>;
  onOpenWorkerAssign: () => void;
  onCancelWorkerAssign: () => void;
  onSubmitWorkerAssign: () => Promise<void>;
  onChangeAssignProgress: (e: ChangeEvent<HTMLSelectElement>) => void;
  getPages: () => number | undefined;
  nextPage: () => void;
  prevPage: () => void;
  doSearchUserByUsername: () => Promise<void>;
  resetSearchResults: () => void;
  selectAssignee: (user: IUser) => void;
  handleChangeMemberPage: (page: number) => void;
}

const Container = styled.div`
  display: flex;
  font-family: NanumSquare;
  overflow-x: hidden;
  width: 100%;
  box-sizing: border-box;
  height: 100%;
`;
const MainWrapper = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  width: 100%;
  height: 100%;
`;
const MainCenter = styled.div`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 60px;
`;
const MainSearchContainer = styled.div`
  width: 100%;
  padding: 15px 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 120px;
`;
const SearchInput = styled.input`
  padding: 8px 10px;
  min-width: 720px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #6b78a1;
  }
`;
const SearchBtn = styled.div<{ isValid: boolean }>`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid ${(props) => (props.isValid ? "#afccf4" : "gray")};
  font-size: 16px;
  font-weight: 700;
  color: #6b78a1;
  margin-right: 20px;
  background-color: ${(props) => (props.isValid ? "#3480E3" : "gray")};
  color: #ffffff;
  cursor: ${(props) => (props.isValid ? "pointer" : "not-allowed")};
`;
const MainActionBtnDiv = styled(MainSearchContainer)`
  padding: 15px 30px;
  margin-top: 20px;
  flex-direction: row;
`;
const VerticalDivider = styled.div`
  border-right: 2px solid #aeccf4;
  width: 2px;
  height: 100%;
`;
const Horizontal = styled.div`
  display: flex;
  width: 100%;
  height: 100%;
`;
const Vertical = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  height: 100%;
`;
const Button = styled.div`
  display: flex;
  min-width: 80px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  cursor: pointer;
  font-size: 16px;
  font-weight: 500;
  margin-right: 20px;
`;
const MainListContainer = styled(MainSearchContainer)`
  margin-top: 20px;
  min-height: 400px;
  max-height: 640px;
  display: flex;
  flex-direction: column;
  padding: 0;
`;
const MainListTop = styled.div`
  padding: 20px 40px;
  width: 100%;
  box-sizing: border-box;
  display: flex;
  align-items: center;
  justify-content: space-between;
`;
const ListTopLeftLabel = styled(Label)`
  margin-right: 0;
`;
const MainListCenter = styled.div`
  width: 100%;
  display: flex;
  flex-direction: column;
  overflow-y: auto;
  overflow-x: hidden;
`;
const Icon = styled.img``;
const Select = styled.select`
  width: 150px;
  padding: 8px 10px;
  background-color: #f7fafe;
  font-size: 13px;
  font-weight: 800;
  border: 1px solid #aeccf4;
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
const AssigneeHeader = styled.div`
  width: 100%;
  height: 40px;
  background-color: #f7fafe;
  display: flex;
  align-items: center;
`;
const AssigneeRow = styled.div<{ isSelected: boolean }>`
  width: 100%;
  height: 40px;
  border-top: 1px solid #aeccf4;
  :last-child {
    border-bottom: 1px solid #aeccf4;
  }
  cursor: pointer;
  background-color: ${(props) => (props.isSelected ? "#aeccf4" : "#FFF")};
  display: flex;
  align-items: center;
`;
const Box = styled.div`
  display: flex;
  align-items: center;
`;
const LabelWrapper = styled.div`
  display: flex;
  width: 150px;
`;
const LabelDiv = styled.div`
  width: 100px;
  height: 32px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #d2e2f8;
  font-size: 14px;
  font-weight: 800;
  color: #243654;
`;
const LabelValueDiv = styled.div`
  width: 160px;
  height: 32px;
  background-color: #f4f4f4;
  color: #707075;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0 15px;
`;
const StaticsContainer = styled.div`
  width: 100%;
  display: flex;
`;
const MainWorkProgressContainer = styled(MainSearchContainer)`
  width: 40%;
  min-height: 550px;
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 20px;
`;
const MainWorkProgressCard = styled.div`
  width: 100%;
  display: flex;
  padding: 20px 20px;
  flex-direction: column;
  background-color: #f7fafe;
  border: 1px solid #ccdff8;
`;

const WorkProgressBox = styled.div`
  width: 500px;
  height: 300px;
  position: relative;
  display: flex;
  align-items: center;
  justify-content: center;
`;
const PieChartContainer = styled.div`
  position: absolute;
  top: 0;
  left: 0;
`;
const Text = styled.span`
  color: #243654;
  font-size: 13px;
  font-weight: 700;
`;
const MainDaysWorkProgressContainer = styled(MainSearchContainer)`
  width: 60%;
  min-height: 750px;
  margin-left: 10px;
  padding: 20px;
`;
const LineIdentifier = styled.div`
  border-top-width: 2px;
  border-bottom-width: 1px;
  width: 20px;
  border-radius: 10px;
  border-style: solid;
`;
const StaticButton = styled(Button)<{ isSelected: boolean }>`
  background-color: ${(props) => (props.isSelected ? "#3580E3" : "#FFF")};
  border: 1px solid #aeccf4;
  font-size: 12px;
  border-radius: 20px;
  color: ${(props) => (props.isSelected ? "#FFF" : "#243654")};
`;
const ProjectDetailPresenter: React.FC<IProjectDetailPresenter> = ({
  page,
  totalTasksCount,
  project,
  projectTasks,
  projectUsers,
  openSidebarUpper,
  selectedInnerTab,
  fileInput,
  openWorkerAssign,
  assignProgress,
  assignees,
  searchText,
  assigneePage,
  assignee,
  totalMembersCount,
  members,
  membersPage,
  handleSelectInnerTab,
  handleClickSidebarUpper,
  handleGoStudio,
  selectTask,
  removeTask,
  isSelectedTask,
  isSelectedAllTasks,
  selectAllTask,
  removeAllTask,
  handleChangeSearch,
  handleDoSearch,
  selectFile,
  handleChangeFileUpload,
  onOpenWorkerAssign,
  onCancelWorkerAssign,
  onSubmitWorkerAssign,
  selectAssignee,
  doSearchUserByUsername,
  onChangeAssignProgress,
  getPages,
  nextPage,
  prevPage,
  resetSearchResults,
  handleChangeMemberPage,
}) => {
  const [staticType, setStaticType] = useState<"공통" | "작업자">("공통");
  const handleWorkerStatic = () => {
    setStaticType("작업자");
  };
  const handleCommonStatic = () => {
    setStaticType("공통");
  };
  if (project && projectTasks && totalTasksCount && projectUsers && assignees) {
    return (
      <ChakraProvider>
        <Container>
          <InnerSidebar
            openSidebarUpper={openSidebarUpper}
            handleClickSidebarUpper={handleClickSidebarUpper}
            selectedInnerTab={selectedInnerTab}
            handleSelectInnerTab={handleSelectInnerTab}
          />
          <MainWrapper>
            <Header
              title={project.pName}
              projectType={project.pType.project_type_id}
            />
            <MainCenter>
              {selectedInnerTab === InnerSidebarItem.dataList && (
                <>
                  <MainSearchContainer>
                    <Section>
                      <Label>검색어</Label>
                      <SearchInput
                        placeholder={"파일명을 입력해주세요."}
                        onChange={handleChangeSearch}
                      />
                      <SearchBtn isValid={true} onClick={handleDoSearch}>
                        검색
                      </SearchBtn>
                    </Section>
                  </MainSearchContainer>
                  <MainActionBtnDiv>
                    <Section style={{ width: "15%" }}>
                      <Label
                        style={{ marginRight: 20 }}
                      >{`무료이미지(${totalTasksCount}개)`}</Label>
                      <VerticalDivider />
                    </Section>
                    <Horizontal
                      style={{
                        width: "100%",
                        justifyContent: "space-between",
                      }}
                    >
                      <Section>
                        <Button
                          onClick={handleGoStudio}
                          style={{
                            backgroundColor: "#5F6164",
                            color: "#FFF",
                          }}
                        >
                          {project.pType.project_type_id === 1
                            ? "수집 STUDIO"
                            : project.pType.project_type_id === 2
                            ? "전처리 STUDIO"
                            : "가공 STUDIO"}
                        </Button>
                        <Button
                          style={{
                            backgroundColor:
                              project.pType.project_type_id === 1
                                ? "#5F6164"
                                : "#3580E3",
                            color: "#FFF",
                          }}
                        >
                          {project.pType.project_type_id === 1
                            ? "중복 제거 STUDIO"
                            : project.pType.project_type_id === 2
                            ? "전처리 일괄처리"
                            : "Auto_Label"}
                        </Button>
                      </Section>
                      <Section style={{ justifyContent: "flex-end" }}>
                        {project.pType.project_type_id !== 1 && (
                          <>
                            <Button
                              style={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#AECCF4",
                                color: "#243654",
                              }}
                            >
                              데이터 불러오기
                            </Button>
                            <input
                              type={"file"}
                              style={{ display: "none" }}
                              ref={fileInput}
                              onChange={handleChangeFileUpload}
                            />
                            <Button
                              onClick={selectFile}
                              style={{
                                borderWidth: 1,
                                borderStyle: "solid",
                                borderColor: "#AECCF4",
                                color: "#243654",
                              }}
                            >
                              데이터 업로드
                            </Button>
                          </>
                        )}
                        <Button
                          style={{
                            backgroundColor: "#3580E3",
                            color: "#FFF",
                          }}
                        >
                          산출물 내보내기
                        </Button>
                        <Button
                          onClick={onOpenWorkerAssign}
                          style={{
                            backgroundColor: "#3580E3",
                            color: "#FFF",
                          }}
                        >
                          할당하기
                          <Modal
                            isOpen={openWorkerAssign}
                            onClose={onCancelWorkerAssign}
                            size={"2xl"}
                            isCentered
                          >
                            <ModalOverlay />
                            <ModalContent>
                              <ModalHeader
                                style={{
                                  display: "flex",
                                  alignItems: "center",
                                  height: 50,
                                  paddingTop: 10,
                                  paddingBottom: 10,
                                  backgroundColor: "#D2E2F8",
                                  justifyContent: "center",
                                  color: "#243654",
                                  fontSize: "14px",
                                  fontWeight: 700,
                                }}
                              >
                                할당하기
                              </ModalHeader>
                              <ModalCloseButton style={{ marginTop: -3 }} />
                              <ModalBody>
                                <Horizontal>
                                  <Label style={{ fontSize: "14px" }}>
                                    작업단계
                                  </Label>
                                </Horizontal>
                                <Horizontal style={{ marginBottom: 20 }}>
                                  <Select
                                    onChange={onChangeAssignProgress}
                                    value={assignProgress}
                                  >
                                    {project.pType.project_type_id === 1 && (
                                      <option value="수집">수집</option>
                                    )}
                                    {project.pType.project_type_id === 2 && (
                                      <option value="전처리">전처리</option>
                                    )}
                                    {project.pType.project_type_id === 3 && (
                                      <option value="가공">가공</option>
                                    )}
                                    <option value="검수">검수</option>
                                  </Select>
                                </Horizontal>
                                <Horizontal>
                                  <Label style={{ fontSize: "14px" }}>
                                    담당자
                                  </Label>
                                </Horizontal>
                                <Horizontal>
                                  <SearchInput
                                    placeholder={"멤버명으로 검색해주세요."}
                                    onChange={handleChangeSearch}
                                    value={searchText}
                                    style={{
                                      minWidth: "80%",
                                      width: "80%",
                                      marginRight: 0,
                                    }}
                                  />
                                  <Icon
                                    src={iconSearch}
                                    onClick={
                                      searchText || searchText !== ""
                                        ? doSearchUserByUsername
                                        : undefined
                                    }
                                    style={{
                                      padding: 10,
                                      cursor: searchText
                                        ? "pointer"
                                        : "not-allowed",
                                      backgroundColor: "#3580E3",
                                      fill: "white",
                                    }}
                                  />
                                  <Button
                                    style={{
                                      marginLeft: 7,
                                      width: "10%",
                                      backgroundColor: "#3580E3",
                                      fontSize: 12,
                                      color: "#FFF",
                                    }}
                                    onClick={resetSearchResults}
                                  >
                                    검색 초기화
                                  </Button>
                                </Horizontal>
                                <Vertical style={{ marginTop: 20 }}>
                                  <AssigneeHeader>
                                    <Label
                                      style={{
                                        fontSize: 14,
                                        width: "50%",
                                        textAlign: "center",
                                      }}
                                    >
                                      멤버 이메일
                                    </Label>
                                    <Label
                                      style={{
                                        fontSize: 14,
                                        width: "50%",
                                        textAlign: "center",
                                      }}
                                    >
                                      멤버명
                                    </Label>
                                  </AssigneeHeader>
                                  {assignees.map((u, index) => (
                                    <AssigneeRow
                                      key={index}
                                      isSelected={
                                        assignee
                                          ? assignee.userId === u.userId
                                          : false
                                      }
                                      onClick={() => selectAssignee(u)}
                                    >
                                      <Label
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          width: "50%",
                                          textAlign: "center",
                                        }}
                                      >
                                        {u.userEmail}
                                      </Label>
                                      <Label
                                        style={{
                                          fontSize: 14,
                                          fontWeight: 600,
                                          width: "50%",
                                          textAlign: "center",
                                        }}
                                      >
                                        {u.userDisplayName}
                                      </Label>
                                    </AssigneeRow>
                                  ))}
                                </Vertical>
                                <Horizontal
                                  style={{
                                    marginTop: 20,
                                    display: "flex",
                                    alignItems: "center",
                                    justifyContent: "space-between",
                                  }}
                                >
                                  <Box>
                                    {assigneePage !== 1 && (
                                      <Icon
                                        src={iconPrev}
                                        onClick={prevPage}
                                        style={{
                                          width: 10,
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                    <Label
                                      style={{
                                        marginRight: 0,
                                        marginLeft: 5,
                                      }}
                                    >
                                      {assigneePage}
                                    </Label>
                                    <Label
                                      style={{
                                        marginRight: 5,
                                        marginLeft: 5,
                                        fontWeight: 500,
                                      }}
                                    >{`of ${getPages()}`}</Label>
                                    {assigneePage < getPages()! && (
                                      <Icon
                                        src={iconNext}
                                        onClick={nextPage}
                                        style={{
                                          width: 10,
                                          cursor: "pointer",
                                        }}
                                      />
                                    )}
                                  </Box>
                                  <Box>
                                    <LabelWrapper style={{ width: 100 }}>
                                      <LabelDiv>담당자</LabelDiv>
                                    </LabelWrapper>
                                    <LabelValueDiv>
                                      {assignee ? assignee.userDisplayName : ""}
                                    </LabelValueDiv>
                                  </Box>
                                </Horizontal>
                              </ModalBody>
                              <ModalFooter>
                                <Button
                                  style={{
                                    width: "10%",
                                    backgroundColor: "#3580E3",
                                    fontSize: 12,
                                    color: "#FFF",
                                    marginRight: 0,
                                  }}
                                  onClick={onSubmitWorkerAssign}
                                >
                                  작업할당
                                </Button>
                              </ModalFooter>
                            </ModalContent>
                          </Modal>
                        </Button>
                      </Section>
                    </Horizontal>
                  </MainActionBtnDiv>
                  <MainListContainer>
                    <MainListTop>
                      <ListTopLeftLabel>{`전체 이미지 ${totalTasksCount} 건`}</ListTopLeftLabel>
                    </MainListTop>
                    <ListHeader
                      type={"DATALIST"}
                      projectType={project.pType.project_type_id}
                      isSelectedAllTasks={isSelectedAllTasks}
                      selectAllTask={selectAllTask}
                      removeAllTask={removeAllTask}
                    />
                    <MainListCenter>
                      {projectTasks.map((t, index) => {
                        return (
                          <ListItem
                            key={index}
                            task={t}
                            type={"DATALIST"}
                            project={project}
                            projectUsers={projectUsers}
                            selectTask={selectTask}
                            removeTask={removeTask}
                            isSelectedTask={isSelectedTask}
                          />
                        );
                      })}
                      <Paginator
                        itemCount={totalTasksCount}
                        page={page}
                        totalCount={totalTasksCount}
                      />
                    </MainListCenter>
                  </MainListContainer>
                </>
              )}
              {selectedInnerTab === InnerSidebarItem.member &&
              totalMembersCount === undefined ? (
                <Loader />
              ) : (
                selectedInnerTab === InnerSidebarItem.member &&
                members && (
                  <MainListContainer>
                    <ListHeader
                      type={"USER_WORK_STATICS"}
                      projectType={project.pType.project_type_id}
                    />
                    {members.map((m, index) => (
                      <ListItem
                        key={index}
                        type={"USER_WORK_STATICS"}
                        member={m}
                      />
                    ))}
                    <Paginator
                      itemCount={5}
                      page={membersPage}
                      totalCount={totalMembersCount!}
                      stateChangeFn={handleChangeMemberPage}
                    />
                  </MainListContainer>
                )
              )}
              {selectedInnerTab === InnerSidebarItem.statics && (
                <>
                  <MainActionBtnDiv
                    style={{ marginBottom: 20, marginTop: -15 }}
                  >
                    <StaticButton
                      isSelected={staticType === "공통"}
                      onClick={handleCommonStatic}
                    >
                      공통 통계
                    </StaticButton>
                    <StaticButton
                      isSelected={staticType === "작업자"}
                      onClick={handleWorkerStatic}
                    >
                      작업자 통계
                    </StaticButton>
                  </MainActionBtnDiv>
                  {staticType === "공통" && (
                    <StaticsContainer>
                      <MainWorkProgressContainer style={{ maxHeight: "600px" }}>
                        <Section style={{ marginBottom: 20 }}>
                          <Label style={{ marginRight: 0, fontSize: 15 }}>
                            전체 작업직행률
                          </Label>
                        </Section>
                        <MainWorkProgressCard>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                              marginTop: 20,
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              프로젝트 진행현황
                            </Label>
                          </Section>
                          <WorkProgressBox>
                            <PieChartContainer>
                              <PieChart
                                width={500}
                                height={300}
                                data={[
                                  { key: "검수완료", data: 20 },
                                  { key: "전처리완료", data: 80 },
                                ]}
                                series={
                                  <PieArcSeries
                                    doughnut={true}
                                    cornerRadius={4}
                                    padAngle={0.02}
                                    padRadius={200}
                                  />
                                }
                              />
                            </PieChartContainer>
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              20% 완료
                            </Label>
                          </WorkProgressBox>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Label style={{ marginRight: 50, fontSize: 15 }}>
                              작업단계
                            </Label>
                            <Label style={{ marginRight: 50, fontSize: 15 }}>
                              완료 파일개수
                            </Label>
                            <Label style={{ marginRight: 50, fontSize: 15 }}>
                              전체 개수 대비 비율
                            </Label>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ marginRight: 50 }}>전처리완료</Text>
                            <Text style={{ marginRight: 100 }}>1,000</Text>
                            <Text style={{ marginRight: 100 }}>100%</Text>
                          </Section>
                          <Section
                            style={{
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "space-between",
                              borderWidth: 1,
                              borderLeft: 0,
                              borderRight: 0,
                              borderTop: 0,
                              paddingTop: 10,
                              paddingBottom: 10,
                              paddingLeft: 5,
                              paddingRight: 5,
                              borderStyle: "solid",
                              backgroundColor: "#FFF",
                              borderColor: "#ccdff8",
                            }}
                          >
                            <Text style={{ marginRight: 50 }}>검수완료</Text>
                            <Text style={{ marginRight: 100 }}>200</Text>
                            <Text style={{ marginRight: 100 }}>20%</Text>
                          </Section>
                        </MainWorkProgressCard>
                      </MainWorkProgressContainer>
                      <MainDaysWorkProgressContainer>
                        <Section
                          style={{
                            marginBottom: 10,
                            display: "flex",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <Label style={{ marginRight: 0, fontSize: 15 }}>
                            일별 작업 진행 추이
                          </Label>
                          <Select>
                            <option>최근 7일</option>
                            <option>최근 7일</option>
                            <option>최근 7일</option>
                          </Select>
                        </Section>
                        <MainWorkProgressCard>
                          <Section
                            style={{
                              marginBottom: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              데이터 전처리량
                            </Label>
                          </Section>
                          <LineChart
                            height={200}
                            data={[
                              { key: new Date("2022-10-27"), data: 18 },
                              { key: new Date("2022-11-04"), data: 5 },
                            ]}
                            series={
                              <LineSeries line={<Line strokeWidth={1} />} />
                            }
                            gridlines={
                              <GridlineSeries
                                line={
                                  <Gridline direction={"y"} strokeWidth={1} />
                                }
                              />
                            }
                          />
                          <Section
                            style={{
                              marginTop: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <LineIdentifier
                              style={{ borderColor: "#1C63CF", marginRight: 5 }}
                            />
                            <Text style={{ marginRight: 0 }}>전처리 건수</Text>
                          </Section>
                        </MainWorkProgressCard>
                        <MainWorkProgressCard style={{ marginTop: 20 }}>
                          <Section
                            style={{
                              marginBottom: 30,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <Label style={{ marginRight: 0, fontSize: 15 }}>
                              단계별 완료 파일량
                            </Label>
                          </Section>
                          <LineChart
                            height={200}
                            data={[
                              {
                                key: "전처리",
                                data: [
                                  { key: new Date("2022-10-27"), data: 18 },
                                  { key: new Date("2022-11-04"), data: 5 },
                                ],
                              },
                              {
                                key: "검수",
                                data: [
                                  { key: new Date("2022-10-28"), data: 11 },
                                  { key: new Date("2022-11-02"), data: 10 },
                                ],
                              },
                            ]}
                            series={
                              <LineSeries
                                line={<Line strokeWidth={1} />}
                                type={"grouped"}
                                colorScheme={["#1C63CF", "#F24C74"]}
                              />
                            }
                            gridlines={
                              <GridlineSeries
                                line={<Gridline direction={"y"} />}
                              />
                            }
                          />
                          <Section
                            style={{
                              marginTop: 10,
                              display: "flex",
                              alignItems: "center",
                              justifyContent: "center",
                            }}
                          >
                            <>
                              <LineIdentifier
                                style={{
                                  borderColor: "#1C63CF",
                                  marginRight: 5,
                                }}
                              />
                              <Text style={{ marginRight: 15 }}>전처리</Text>
                            </>
                            <>
                              <LineIdentifier
                                style={{
                                  borderColor: "#F24C74",
                                  marginRight: 5,
                                }}
                              />
                              <Text style={{ marginRight: 0 }}>검수</Text>
                            </>
                          </Section>
                        </MainWorkProgressCard>
                      </MainDaysWorkProgressContainer>
                    </StaticsContainer>
                  )}
                </>
              )}
            </MainCenter>
          </MainWrapper>
        </Container>
      </ChakraProvider>
    );
  }
  return <Loader />;
};

export default ProjectDetailPresenter;
