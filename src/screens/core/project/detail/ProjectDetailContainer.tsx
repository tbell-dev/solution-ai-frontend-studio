import { useToast } from "@chakra-ui/react";
import React, { useEffect, useState, ChangeEvent, useRef } from "react";
import { useLocation, useNavigate, useParams } from "react-router-dom";
import projectApi, { IProject } from "../../../../api/projectApi";
import taskApi, { ITask } from "../../../../api/taskApi";
import userApi, { IUser } from "../../../../api/userApi";
import { setOffset } from "../../../../utils";
import ProjectDetailPresenter from "./ProjectDetailPresenter";

export enum InnerSidebarItem {
  dataList = "데이터 목록",
  member = "멤버작업현황",
  statics = "프로젝트 통계",
  settings = "설정",
}

const ProjectDetailContainer = () => {
  // ! project state
  const [project, setProject] = useState<IProject>();
  // ! project task list state
  const [pTasks, setPTasks] = useState<ITask[]>();
  // ! 전체 타스크 개수 state
  const [totalTasksCount, setTotalTasksCount] = useState<number>();
  const [projectUsers, setProjectUsers] = useState<IUser[]>();
  // ! Inner 사이드바의 메뉴 오픈 state
  const [openSidebarUpper, setOpenSidebarUpper] = useState<boolean>(true);
  // ! 노출되는 프로젝트의 task들 중 선택된 tasks
  const [selectedTasks, setSelectedTasks] = useState<number[]>([]);
  // ! Inner 사이드바에서 선택된 탭 state
  const [selectedInnerTab, setSelectedInnerTab] = useState<InnerSidebarItem>(
    InnerSidebarItem.dataList
  );
  // ! 검색어 state
  const [searchText, setSearchText] = useState<string>();

  // ! Project id
  const { pId } = useParams();
  // ! location (for get page queryParameter)
  const location = useLocation();
  // ! location key가 달라질 때 (location query parameter가 달라지는 경우와 같음) task refetch
  useEffect(() => {
    getTasksByProject();
    // eslint-disable-next-line
  }, [location.key]);
  // ! navigate hook
  const navigate = useNavigate();
  const toast = useToast();
  // ! pID가 없으면 홈으로 리다이렉트
  useEffect(() => {
    if (!pId) {
      navigate("/");
    }
  }, [navigate, pId]);

  // ! call api search all users
  const searchAllUsers = async (param: any) => {
    const res = await userApi.getAllUsers(param);
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setProjectUsers(users);
    } else {
      // TODO: error handling
    }
  };
  // ! 서버로부터 데이터를 받고 받은 데이터를 원하는 인터페이스에 맞게 정제한 후 state에 저장
  const cleanTasks = async (tasks: any[], pageinfo: any) => {
    let cleanedTasks: ITask[] = [];
    let form: ITask;
    for (let i = 0; i < tasks.length; i++) {
      const taskId = tasks[i].task_id;
      const imageName = tasks[i].task_detail.image_name;
      const imageThumbnail = tasks[i].task_detail.image_thumbnail;
      const taskStep = tasks[i].task_status.task_status_step;
      const taskStatus = tasks[i].task_status.task_status_progress;
      const taskStatusName =
        taskStatus === 1
          ? "미작업"
          : taskStatus === 2
          ? "진행중"
          : taskStatus === 3
          ? "완료"
          : taskStatus === 4
          ? "반려"
          : undefined;
      const imageFormat = tasks[i].task_detail.image_format;
      const imageWidth = tasks[i].task_detail.image_width;
      const imageHeight = tasks[i].task_detail.image_height;
      const imageSize = tasks[i].task_detail.image_size;
      const updated = tasks[i].updated;
      const created = tasks[i].created;
      // ! task worker info
      let taskWorker = null;
      if (tasks[i].task_worker) {
        const displayName = tasks[i].task_worker.user_display_name;
        const id = tasks[i].task_worker.user_id;
        const email = tasks[i].task_worker.user_email;
        taskWorker = { id, email, displayName };
      }

      // ! task validator info
      let taskValidator = null;
      if (tasks[i].task_validator) {
        const valDisplayName = tasks[i].task_validator.user_display_name;
        const valId = tasks[i].task_validator.user_id;
        const valEmail = tasks[i].task_validator.user_email;
        taskValidator = {
          id: valId,
          email: valEmail,
          displayName: valDisplayName,
        };
      }

      // ! cleanTask는 Task Type이고 Task 타입에 맞게 아래 form을 형성후 cleanTask에 form push
      form = {
        taskId,
        imageName,
        imageThumbnail,
        image: "",
        taskStatus,
        taskStep,
        taskStatusName,
        imageFormat,
        imageWidth,
        imageHeight,
        imageSize,
        taskWorker,
        taskValidator,
        updated,
        created,
      };
      cleanedTasks.push(form);
    }
    setPTasks(cleanedTasks);
    setTotalTasksCount(pageinfo.totalResults);
  };
  // ! 프로젝트 ID를 통해 프로젝트의 Task들을 가져온다.
  const getTasksByProject = async () => {
    if (pId) {
      const res = await taskApi.searchTaskByProject({
        project_id: parseInt(pId),
        ...setOffset(parseInt(location.search.split("=")[1]) || 1),
      });
      if (res && res.status === 200) {
        cleanTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };
  const handleDoSearch = async () => {
    if (pId) {
      const res = await taskApi.searchTaskByProject({
        project_id: parseInt(pId),
        ...setOffset(parseInt(location.search.split("=")[1]) || 1),
        task_name: searchText,
      });
      if (res && res.status === 200) {
        cleanTasks(res.data.datas, res.data.pageinfo);
      }
    }
  };
  // ! project data 정제 후 state 저장
  const cleanProject = (data: any) => {
    setProject({
      pNo: data.project_id,
      pName: data.project_name,
      pType: {
        project_type_id: data.project_type.project_type_id,
        project_type_name: data.project_type.project_type_name,
        created: data.project_type.created,
      },
      pCreated: data.created,
      pWorkerCount: data.project_worker_count || null,
    });
  };
  // ! pID가 있으면 해당 id로 project data fetch
  const getProject = async () => {
    if (pId) {
      const res = await projectApi.getProject({ project_id: parseInt(pId) });
      if (res && res.status === 200) {
        cleanProject(res.data);
      }
    }
  };
  // ! pId가 있다면, 렌더링 시 해당 데이터로 프로젝트와 그 프로젝트의 Task들을 fetch
  useEffect(() => {
    getProject();
    getTasksByProject();
    searchAllUsers({ maxResults: 10000 });
    // eslint-disable-next-line
  }, [pId]);
  // ! Inner 사이드바에서 탭 선택하면 해당 탭으로 state change
  const handleSelectInnerTab = (tab: InnerSidebarItem) => {
    setSelectedInnerTab(tab);
  };
  // ! Inner 사이드바의 메뉴 오픈 toggle
  const handleClickSidebarUpper = () => {
    setOpenSidebarUpper((prev) => !prev);
  };
  // ! 이미지마다 붙어있는 STUDIO 버튼 말고 상단 STUDIO 버튼 클릭 시 전처리 / 가공 / 정제에 따라 스튜디오로 navigate
  const handleGoStudio = () => {
    if (project) {
      switch (project.pType.project_type_id) {
        case 1:
          navigate(`/studio/collect/${project.pNo}`);
          break;
        case 2:
          navigate(`/studio/preprocessing/${project.pNo}`);
          break;
        case 3:
          navigate(`/studio/labeling/${project.pNo}`);
          break;
      }
    } else {
      return;
    }
  };
  // ! task의 좌측 체크박스 선택 시 해당 task 선택
  const selectTask = (taskId: number) => {
    setSelectedTasks((prev) => [...prev, taskId]);
  };
  // ! remove task on selected tasks
  const removeTask = (taskId: number) => {
    const removedTasks = selectedTasks.filter((s) => s !== taskId);
    setSelectedTasks(removedTasks);
  };
  // ! check task is selected
  const isSelectedTask = (taskId: number): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedTasks.length; i++) {
      if (selectedTasks[i] === taskId) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
  };
  // ! check task is all selected
  const isSelectedAllTasks = (): boolean => {
    if (pTasks) {
      return pTasks.length === selectedTasks.length;
    }
    return false;
  };
  // ! select all task state
  const selectAllTask = () => {
    if (pTasks) {
      let all: number[] = [];
      pTasks.forEach((t) => {
        all.push(t.taskId);
      });
      setSelectedTasks(all);
    }
    return;
  };
  // ! remove all task state
  const removeAllTask = () => {
    setSelectedTasks([]);
  };
  // ! 검색어 입력 시 해당 검색어를 state에 저장
  const handleChangeSearch = (e: ChangeEvent<HTMLInputElement>) => {
    setSearchText(e.target.value);
  };
  // ! 유저 검색 버튼 클릭 시 호출
  const doSearchUserByUsername = async () => {
    const res = await userApi.getAllUsers({
      maxResults: 10000,
      user_display_name: searchText,
    });
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setAssignees(users);
    } else {
      // TODO: error handling
    }
  };
  // ! 할당하기에서 유저 검색 초기화
  const resetSearchResults = () => {
    setSearchText("");
    getAssignees();
  };
  // ! 데이터 업로드 버튼 클릭 시 input ref
  const fileInput = useRef<HTMLInputElement | null>(null);
  // ! input ref가 호출될 때 실행하는 메소드
  const selectFile = () => {
    if (fileInput && fileInput.current) {
      fileInput.current.click();
    }
  };
  // ! 데이터 업로드 버튼 클릭 후 파일 선택 시 호출되는 메소드
  const handleChangeFileUpload = async (e: ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files.length > 0 && pId) {
      let formdata = new FormData();
      formdata.append("image", e.target.files[0]);
      const res = await taskApi.createTask(
        { project_id: parseInt(pId) },
        formdata
      );
      if (res && res.status === 200) {
        getTasksByProject();
      }
    }
  };
  // ! 할당하기 팝업의 노출 여부 state
  const [openWorkerAssign, setOpenWorkerAssign] = useState<boolean>(false);
  const [assignee, setAssignee] = useState<IUser>();
  // ! 할당하기 팝업의 page state
  const [assigneePage, setAssigneePage] = useState<number>(1);
  // ! 할당하기 팝업의 작업단계 선택 state
  const [assignProgress, setAssignProgress] = useState<
    "전처리" | "수집" | "가공" | "검수"
  >();
  useEffect(() => {
    setAssignProgress(
      project && project.pType.project_type_id === 1
        ? "수집"
        : project && project.pType.project_type_id === 2
        ? "전처리"
        : "가공"
    );
  }, [project]);
  // ! 할당하기 팝업의 assignee users state
  const [assignees, setAssignees] = useState<IUser[]>();
  const selectAssignee = (user: IUser) => {
    setAssignee(user);
  };
  // ! 할당하기 버튼 누를 때 호출
  const onOpenWorkerAssign = () => {
    if (selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    setOpenWorkerAssign(true);
  };
  // ! 할당하기 팝업을 닫을 때 호출
  const onCancelWorkerAssign = () => {
    setOpenWorkerAssign(false);
  };
  // ! 할당하기 팝업에서 할당하기 버튼 누를 때 호출
  const onSubmitWorkerAssign = async () => {
    if (!selectedTasks || selectedTasks.length === 0) {
      toast({
        title: "최소 한 개 이상의 Task를 선택해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!assignee) {
      toast({
        title: "담당자를 지정해야 합니다.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }
    if (!pId) {
      toast({
        title: "프로젝트 ID를 읽어오지 못했습니다. 다시 시도해 주세요.",
        status: "error",
        position: "top",
        duration: 3000,
        isClosable: true,
      });
      return;
    }

    const updateTaskParams = {
      project_id: parseInt(pId),
    };

    for (let i = 0; i < selectedTasks.length; i++) {
      let updateTaskPayload;
      if (assignProgress === "검수") {
        updateTaskPayload = {
          task_id: selectedTasks[i],
          task_validator: {
            user_id: assignee.userId,
          },
        };
      } else {
        updateTaskPayload = {
          task_id: selectedTasks[i],
          task_worker: {
            user_id: assignee.userId,
          },
        };
      }

      const res = await taskApi.updateTask(updateTaskParams, updateTaskPayload);
      if (res && res.status !== 200) {
        toast({
          title: `${selectedTasks[i]} -> ${res.status}`,
          status: "error",
          position: "top",
          duration: 3000,
          isClosable: true,
        });
        return;
      }
    }
    toast({
      title: "작업할당이 완료되었습니다.",
      status: "success",
      position: "top",
      duration: 1500,
      isClosable: true,
    });
    setTimeout(() => {
      window.location.reload();
    }, 2000);
    return;
  };
  // ! 할당하기 팝업에서 작업단계 변경할 때 해당 작업단계를 state에 저장
  const onChangeAssignProgress = (e: ChangeEvent<HTMLSelectElement>) => {
    if (
      e.target.value === "수집" ||
      e.target.value === "전처리" ||
      e.target.value === "가공" ||
      e.target.value === "검수"
    ) {
      setAssignProgress(e.target.value);
    }
  };
  // ! 할당하기 팝업에서 유저 개수를 기준으로 page count를 리턴
  const getPages = () => {
    if (projectUsers && !searchText) {
      return Math.ceil(projectUsers.length / 5);
    }
    if (searchText && assignees) {
      return Math.ceil(assignees.length / 5);
    }
  };
  // ! 할당하기 팝업에서 유저들을 리턴해야 하므로 해당 유저들을 가져오기 위한 api 호출 후 state에 유저들 저장
  const getAssignees = async () => {
    const res = await userApi.getAllUsers({ ...setOffset(assigneePage, 5) });
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setAssignees(users);
    } else {
      // TODO: error handling
    }
  };
  // ! 할당하기 팝업에서 다음 페이지 버튼 클릭 시 호출
  const nextPage = () => {
    setAssigneePage((prev) => prev + 1);
  };
  // ! 할당하기 팝업에서 이전 페이지 버튼 클릭 시 호출
  const prevPage = () => {
    setAssigneePage((prev) => prev - 1);
  };
  // ! page state가 변경될 때마다 리렌더링
  useEffect(() => {
    getAssignees();
    // eslint-disable-next-line
  }, [assigneePage]);
  const [totalMembersCount, setTotalMembersCount] = useState<number>();
  const [membersPage, setMembersPage] = useState<number>(1);
  const [members, setMembers] = useState<IUser[]>();
  const getMembers = async () => {
    const res = await userApi.getAllUsers({ ...setOffset(membersPage, 5) });
    if (res && res.status === 200) {
      let users: IUser[] = [];
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      setMembers(users);
      setTotalMembersCount(res.data.pageinfo.totalResults);
    } else {
      // TODO: error handling
    }
  };
  const handleChangeMemberPage = async (page: number) => {
    const res = await userApi.getAllUsers({ ...setOffset(page, 5) });
    let users: IUser[] = [];
    if (res && res.status === 200) {
      res.data.datas.forEach((user: any) => {
        const u = {
          userId: user.user_id,
          userDisplayName: user.user_display_name,
          userEmail: user.user_email,
          created: user.created,
        };
        users.push(u);
      });
      //setTotalMembersCount(res.data.pageinfo.totalResults);
    } else {
      // TODO: error handling
    }
    setMembers(users);
    setMembersPage(page);
  };
  useEffect(() => {
    if (selectedInnerTab === InnerSidebarItem.member) {
      getMembers();
    }
    return;
    // eslint-disable-next-line
  }, [selectedInnerTab]);
  return (
    <ProjectDetailPresenter
      project={project}
      projectTasks={pTasks}
      page={location.search.split("=")[1] || "1"}
      totalTasksCount={totalTasksCount}
      projectUsers={projectUsers}
      openSidebarUpper={openSidebarUpper}
      selectedInnerTab={selectedInnerTab}
      fileInput={fileInput}
      searchText={searchText}
      openWorkerAssign={openWorkerAssign}
      assignProgress={assignProgress}
      assignees={assignees}
      assignee={assignee}
      assigneePage={assigneePage}
      members={members}
      membersPage={membersPage}
      totalMembersCount={totalMembersCount}
      handleSelectInnerTab={handleSelectInnerTab}
      handleClickSidebarUpper={handleClickSidebarUpper}
      handleGoStudio={handleGoStudio}
      selectTask={selectTask}
      removeTask={removeTask}
      isSelectedTask={isSelectedTask}
      isSelectedAllTasks={isSelectedAllTasks}
      selectAllTask={selectAllTask}
      removeAllTask={removeAllTask}
      handleChangeSearch={handleChangeSearch}
      handleDoSearch={handleDoSearch}
      selectFile={selectFile}
      handleChangeFileUpload={handleChangeFileUpload}
      onOpenWorkerAssign={onOpenWorkerAssign}
      onCancelWorkerAssign={onCancelWorkerAssign}
      onSubmitWorkerAssign={onSubmitWorkerAssign}
      onChangeAssignProgress={onChangeAssignProgress}
      getPages={getPages}
      nextPage={nextPage}
      prevPage={prevPage}
      resetSearchResults={resetSearchResults}
      doSearchUserByUsername={doSearchUserByUsername}
      selectAssignee={selectAssignee}
      handleChangeMemberPage={handleChangeMemberPage}
    />
  );
};

export default ProjectDetailContainer;
