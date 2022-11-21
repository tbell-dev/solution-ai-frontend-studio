import React, { ChangeEvent, useState } from "react";
import styled from "styled-components";
import { IDataset } from "../../api/datasetApi";
import { getFormattedDate } from "../../utils";
import iconSelected from "../../assets/images/project/icon/icon-selected.svg";
import { Link } from "react-router-dom";
import { IProject } from "../../api/projectApi";
import taskApi, { ITask } from "../../api/taskApi";
import { IUser } from "../../api/userApi";

export type ListType =
  | "ALL_PRJECT"
  | "DATASET TYPE"
  | "DATALIST"
  | "USER_WORK_STATICS";
export interface IListItem {
  type: ListType;
  project?: IProject;
  dataset?: IDataset;
  task?: ITask;
  projectUsers?: IUser[];
  member?: IUser;
  selectDataset?: (datasetId: number) => void;
  removeDataset?: (datasetId: number) => void;
  isSelectedDataset?: (datasetId: number) => boolean;
  selectTask?: (taskId: number) => void;
  removeTask?: (taskId: number) => void;
  isSelectedTask?: (taskId: number) => boolean;
}

const Row = styled.div`
  width: 100%;
  display: flex;
  justify-content: space-between;
  box-sizing: border-box;
  align-items: center;
  padding: 15px 25px;
  :nth-child(even) {
    background-color: #f7fafe;
  }
`;
const Data = styled.span`
  width: 100%;
  font-size: 13px;
  font-weight: 700;
  color: #243654;
  margin-right: 0;
  :last-child {
    text-align: center;
  }
  :nth-last-child(2) {
    text-align: center;
  }
`;
const ProgressWrapper = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const ProgressDiv = styled.div`
  border: 0.5px solid #c0c3c7;
  border-radius: 20px;
  margin-right: 10px;
  width: 100px;
  height: 5px;
`;
const Progress = styled.div`
  width: 50px;
  height: 100%;
  border-radius: 20px;
  border: 0.5px solid #3db79f;
  background-color: #3db79f;
`;
const ProgressPercentage = styled.span`
  color: #243654;
  font-size: 12px;
  font-weight: 700;
  margin-right: 3px;
`;
const ProgressCounts = styled(ProgressPercentage)``;
const CheckBox = styled.div<{ isSelected: boolean }>`
  width: 80px;
  height: 13px;
  border: 1px solid ${(props) => (props.isSelected ? "#2EA08F" : "#6b78a1")};
  background-color: ${(props) => (props.isSelected ? "#2EA08F" : "none")};
  margin-right: 100px;
  cursor: pointer;
`;
const ThumbNail = styled.img`
  width: 60px;
  height: 44px;
`;
const Icon = styled.img`
  cursor: pointer;
  margin-right: 100px;
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
  background-color: #5f6164;
  color: #fff;
`;
const Select = styled.select`
  width: 150px;
  padding: 7px 10px;
  background-color: #f7fafe;
  font-size: 11px;
  border: 1px solid #aeccf4;
  font-weight: 500;
  :focus {
    outline: none;
  }
`;
/** 전체 프로젝트 화면 등 화면에서 리스트로 사용되는 리스트 아이템
 * 타입에 따라 받는 props가 달라진다.
 */
const ListItem: React.FC<IListItem> = ({
  type,
  task,
  project,
  dataset,
  member,
  projectUsers,
  selectDataset,
  removeDataset,
  isSelectedDataset,
  selectTask,
  removeTask,
  isSelectedTask,
}) => {
  // ! type이 DATALIST일 때만 유효한 state
  const [worker, setWorker] = useState<string>(
    task && task.taskWorker ? task.taskWorker.id : ""
  );
  // ! type이 DATALIST일 때만 유효한 state
  const [validator, setValidator] = useState<string>(
    task && task.taskValidator ? task.taskValidator.id : ""
  );
  // ! type이 DATALIST일 때만 유효한 function
  const handleChangeWorker = async (e: ChangeEvent<HTMLSelectElement>) => {
    setWorker(e.target.value);
    if (!project || !task) {
      return;
    }
    const updateTaskParams = {
      project_id: project.pNo,
    };
    const updateTaskPayload = {
      task_id: task.taskId,
      task_worker: {
        user_id: e.target.value,
      },
    };
    await taskApi.updateTask(updateTaskParams, updateTaskPayload);
  };
  // ! type이 DATALIST일 때만 유효한 function
  const handleChangeValidator = async (e: ChangeEvent<HTMLSelectElement>) => {
    setValidator(e.target.value);
    if (!project || !task) {
      return;
    }
    const updateTaskParams = {
      project_id: project.pNo,
    };
    const updateTaskPayload = {
      task_id: task.taskId,
      task_validator: {
        user_id: e.target.value,
      },
    };
    await taskApi.updateTask(updateTaskParams, updateTaskPayload);
  };
  return (
    <>
      {type === "ALL_PRJECT" && project && (
        <Row>
          <Data>{project.pNo}</Data>
          <Data>
            {project.pType.project_type_id === 1
              ? "데이터 수집"
              : project.pType.project_type_id === 2
              ? "데이터 정제/전처리"
              : "데이터 가공"}
          </Data>
          <Data>
            <Link to={`${project.pNo}`} style={{ color: "#357FE3" }}>
              {project.pName}
            </Link>
          </Data>
          <Data>
            <ProgressWrapper>
              <ProgressDiv>
                <Progress />
              </ProgressDiv>
              <ProgressPercentage>{`50%`}</ProgressPercentage>
              <ProgressCounts>{`(1,000 / 1,000)`}</ProgressCounts>
            </ProgressWrapper>
          </Data>
          <Data>{project.pWorkerCount ? project.pWorkerCount : "3"}명</Data>
          <Data>{getFormattedDate(project.pCreated)}</Data>
        </Row>
      )}
      {type === "USER_WORK_STATICS" && member && (
        <Row>
          <Data>{member.userDisplayName}</Data>
          <Data>{member.userEmail}</Data>
          <Data style={{ textAlign: "center" }}>전처리 개수</Data>
          <Data>검수 개수</Data>
          <Data>마지막 업데이트 날짜</Data>
        </Row>
      )}
      {type === "DATASET TYPE" &&
        dataset &&
        selectDataset &&
        removeDataset &&
        isSelectedDataset && (
          <Row>
            {isSelectedDataset(dataset.datasetId) ? (
              <Icon
                src={iconSelected}
                onClick={() => removeDataset(dataset.datasetId)}
              />
            ) : (
              <CheckBox
                onClick={() => selectDataset(dataset.datasetId)}
                isSelected={isSelectedDataset(dataset.datasetId)}
              />
            )}
            <Data>{dataset.datasetId}</Data>
            <Data>{dataset.datasetName}</Data>
            <Data>{dataset.datasetItemsCount}</Data>
            <Data>
              {dataset.datasetCategory ? dataset.datasetCategory : "미지정"}
            </Data>
            <Data>
              {dataset.datasetSubCategory
                ? dataset.datasetSubCategory
                : "미지정"}
            </Data>
            <Data>{dataset.datasetItemsSize}</Data>
          </Row>
        )}
      {type === "DATALIST" &&
        task &&
        project &&
        projectUsers &&
        selectTask &&
        removeTask &&
        isSelectedTask && (
          <Row
            style={{
              paddingTop: 10,
              paddingBottom: 10,
              justifyContent: "none",
            }}
          >
            {isSelectedTask(task.taskId) ? (
              <Icon
                src={iconSelected}
                onClick={() => removeTask(task.taskId)}
                style={{ width: "1%" }}
              />
            ) : (
              <CheckBox
                onClick={() => selectTask(task.taskId)}
                isSelected={isSelectedTask(task.taskId)}
                style={{ width: "1%" }}
              />
            )}
            <Data
              style={{
                marginLeft: -70,
                display: "flex",
                alignItems: "center",
                width: "30%",
                justifyContent: "space-between",
              }}
            >
              <ThumbNail src={`data:image/png;base64,${task.imageThumbnail}`} />
              <span>{task.imageName}</span>
              <Link
                to={`/studio/${
                  project.pType.project_type_id === 1
                    ? "collect"
                    : project.pType.project_type_id === 2
                    ? "preprocessing"
                    : "labeling"
                }/${project.pNo}?selectedTask=${task.taskId}`}
              >
                <Button>STUDIO</Button>
              </Link>
            </Data>
            {project.pType.project_type_id === 1 && task.taskStep === 1 && (
              <Data style={{ width: "10%" }}>수집</Data>
            )}
            {project.pType.project_type_id === 2 && task.taskStep === 1 && (
              <Data style={{ width: "10%" }}>전처리</Data>
            )}
            {project.pType.project_type_id === 3 && task.taskStep === 1 && (
              <Data style={{ width: "10%" }}>가공</Data>
            )}
            {task.taskStep === 2 && <Data style={{ width: "10%" }}>검수</Data>}
            <Data style={{ width: "10%" }}>{task.taskStatusName}</Data>
            <Data style={{ width: "10%" }}>
              {task.updated
                ? getFormattedDate(task.updated)
                : getFormattedDate(task.created!)}
            </Data>
            <Data style={{ width: "15%" }}>
              <Select onChange={handleChangeWorker} value={worker}>
                <option value="" disabled>
                  담당자명
                </option>
                {projectUsers.map((u, index) => (
                  <option key={index} value={u.userId}>
                    {u.userDisplayName}
                  </option>
                ))}
              </Select>
            </Data>
            <Data style={{ width: "15%" }}>
              <Select onChange={handleChangeValidator} value={validator}>
                <option value="" disabled>
                  담당자명
                </option>
                {projectUsers.map((u, index) => (
                  <option key={index} value={u.userId}>
                    {u.userDisplayName}
                  </option>
                ))}
              </Select>
            </Data>
          </Row>
        )}
    </>
  );
};

export default ListItem;
