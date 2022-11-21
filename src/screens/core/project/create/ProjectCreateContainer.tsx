import React, { ChangeEvent, useEffect, useState } from "react";
import ProjectCreatePresenter from "./ProjectCreatePresenter";
import { SubmitHandler, useForm } from "react-hook-form";
import projectApi, {
  IAnnotationAttribute,
  ICreatePcrawlPayload,
  IProjectAnnotation,
} from "../../../../api/projectApi";
import datasetApi, { IDataset } from "../../../../api/datasetApi";
import { toast } from "react-toastify";
import {
  ClassAttrType,
  IClass,
  IClassAttr,
} from "../../../../components/core/ClassGenerator";
import randomColor from "randomcolor";
import { setOffset } from "../../../../utils";
export enum FormPType {
  collect = "데이터 수집",
  manufacturing = "데이터 가공",
  preprocessing = "데이터 정제/전처리",
}

export enum FormPCrawlChannelType {
  naver = "naver",
  daum = "daum",
  google = "google",
  instagram = "instagram",
}

export enum FormPCollectDurationType {
  week = "1주일",
  month3 = "3개월",
  year = "1년",
  custom = "직접설정",
}

export enum FormPCollectAmountType {
  h1 = "100",
  h5 = "500",
  th1 = "1000",
  th2 = "2000",
  th3 = "3000",
  custom = "직접입력",
}

export enum CollectDataType {
  dataset = "인간 데이터셋 제공",
  crawling = "웹 크롤링 데이터",
}

export interface IFormInput {
  pName: string;
  pDescription: string;
  pType: FormPType;
  pCrawlChannel?: FormPCrawlChannelType;
  pCrawlKeyword?: string;
  pCrawlCustomAmount?: FormPCollectAmountType;
}

const ProjectCreateContainer = () => {
  // ! datasets state
  const [datasets, setDatasets] = useState<IDataset[]>([]);
  // ! selected datasets state
  const [selectedDatasets, setSelectedDatasets] = useState<number[]>([]);
  const [totalDatasets, setTotalDatasets] = useState<number>(0);
  // ! 프로젝트 유형 select tag의 selected value state
  const [selectedPType, setSelectedPType] = useState<FormPType>(
    FormPType.collect
  );
  // ! 데이터 수집 > 데이터 유형 state
  const [collectDataType, setCollectDataType] = useState<CollectDataType>(
    CollectDataType.dataset
  );
  // ! 데이터 수집 > 인간 데이터셋 제공 > pagination의 현재 page state
  const [currentPage, setCurrentPage] = useState<number>(1);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집채널 state
  const [currentCollectChannel, setCurrentCollectChannel] = useState<
    FormPCrawlChannelType
  >(FormPCrawlChannelType.naver);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집채널 state change
  const handleSetChannel = (channel: FormPCrawlChannelType) => {
    setCurrentCollectChannel(channel);
  };
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집기간 state
  const [currentCollectDuration, setCurrentCollectDuration] = useState<
    FormPCollectDurationType
  >(FormPCollectDurationType.week);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집기간 state change
  const handleSetDuration = (duration: FormPCollectDurationType) => {
    setCurrentCollectDuration(duration);
  };
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집건수 state
  const [currentCollectAmount, setCurrentCollectAmount] = useState<
    FormPCollectAmountType
  >(FormPCollectAmountType.h1);
  // ! 데이터 수집 > 웹 크롤링 데이터 > 수집건수 state change
  const handleSetAmount = (amount: FormPCollectAmountType) => {
    setCurrentCollectAmount(amount);
  };

  //*********** collect duration custom date *************/
  // ! 날짜 선택 시 시작날짜 - 종료날짜
  const [dateRange, setDateRange] = useState<Date[] | null>(null);
  // ! is calendar open ?
  const [calendar, setCalendar] = useState<boolean>(false);
  // ! show calendar
  const showCalendar = () => {
    setCalendar(true);
  };
  // ! calendar에서 날짜 선택을 다 하고 나면 해당 값을 state에 저장후 calendar를 닫는다.
  const handleChangeCalendar = (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => {
    setDateRange(value);
    setCalendar(false);
  };
  // ! calendar component 외 부분을 클릭 시 calendar를 닫는다.
  const handlePopupDown = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    const element = e.target as HTMLElement;
    if (
      element.hasAttribute("aria-label") ||
      element.classList.contains("react-calendar__tile")
    ) {
      return;
    }
    if (calendar) {
      setCalendar(false);
    }
  };
  // ! 날짜 인풋 값에 인풋값을 cleaned하여 입력시킨다.
  const dateToString = (): string => {
    if (!dateRange) return "날짜 선택";
    let startDate;
    let endDate;
    for (let i = 0; i < dateRange.length; i++) {
      if (i === 0) startDate = dateRange[i].toLocaleDateString("en-US");
      if (i === 1) endDate = dateRange[i].toLocaleDateString("en-US");
    }
    if (startDate && endDate) return `${startDate} - ${endDate}`;
    return "날짜 선택";
  };

  // ! 인간 데이터셋 제공 유형에서 특정 페이지넘버 클릭 시 호출되는 메소드
  const onChangePage = async (page: number) => {
    // TODO: currentPage state change
    // TODO: refetch data set list depending on currentPage state
    const res = await datasetApi.getDatasets({
      ...setOffset(page),
    });
    if (res && res.status === 200 && res.data) {
      console.log(res.data);
      cleanDatasets(res.data);
    }
    setCurrentPage(page);
  };
  // ! useForm
  const {
    register,
    handleSubmit,
    setValue,
    getValues,
    formState: { errors },
  } = useForm<IFormInput>();

  // ! 데이터 가공 유형에서 클래스 입력할 때 Enter를 사용하는데, Enter 클릭 시 form의 기본 특성상 submit이 일어나기 때문에 프로젝트 생성에 대한 submit을 prevent
  const preventEnter: React.KeyboardEventHandler<HTMLFormElement> = (e) => {
    if (e.key === "Enter") e.preventDefault();
  };
  // ! useForm onSubmit
  const onSubmit: SubmitHandler<IFormInput> = (data) => {
    let createPcrawlPayload: ICreatePcrawlPayload;
    // TODO: userId는 나중에 로그인한 유저이면서 manager 권한이어야 한다.
    const userId = "admin02";
    const selectedPName = data.pName;
    const selectedPDescription = data.pDescription;
    const selectedCurrentPType =
      data.pType === FormPType.collect ? 1 : FormPType.manufacturing ? 3 : 2;
    let selectedDataType;
    switch (selectedCurrentPType) {
      case 1:
        // ! 데이터 유형이 인간 데이터셋 제공 / 웹 크롤링 데이터 두 가지로 분류되는데 각 타입별 받아야하는 데이터가 다르므로 구분
        switch (collectDataType) {
          case CollectDataType.dataset:
            selectedDataType = 1;
            createPcrawlPayload = {
              project_name: selectedPName,
              project_desc: selectedPDescription,
              project_manager: {
                user_id: userId,
              },
              project_type: {
                project_type_id: selectedCurrentPType,
              },
              project_detail: {
                data_type: selectedDataType,
                ...(selectedDataType === 1 && {
                  dataset_ids: selectedDatasets,
                }),
              },
            };
            console.log(createPcrawlPayload);
            doCreateProject(createPcrawlPayload);
            break;
          case CollectDataType.crawling:
            selectedDataType = 2;
            const selectedChannel = currentCollectChannel;
            if (data.pCrawlKeyword === undefined) {
              // TODO: error handling
              return;
            }
            const selectedKeyword = [data.pCrawlKeyword];
            let selectedAmount;
            let crawlPeriod;
            let crawlStartDate;
            let crawlEndDate;
            // ! 직접설정인 경우 날짜 데이터 받기 / 아닌 경우 선택된 라디오 버튼에서 range
            switch (currentCollectDuration) {
              case FormPCollectDurationType.week:
                crawlPeriod = 2;
                break;
              case FormPCollectDurationType.month3:
                crawlPeriod = 3;
                break;
              case FormPCollectDurationType.year:
                crawlPeriod = 4;
                break;
              case FormPCollectDurationType.custom:
                if (!dateRange) {
                  // TODO: error handling
                  return;
                }
                crawlPeriod = 1;
                for (let i = 0; i < dateRange.length; i++) {
                  if (i === 0) crawlStartDate = dateRange[i].getTime();
                  if (i === 1) crawlEndDate = dateRange[i].getTime();
                }
                break;
            }

            switch (currentCollectAmount) {
              case FormPCollectAmountType.custom:
                if (data.pCrawlCustomAmount === undefined) {
                  // TODO: error handling
                  return;
                }
                selectedAmount = parseInt(data.pCrawlCustomAmount);
                break;
              default:
                selectedAmount = parseInt(currentCollectAmount);
                break;
            }
            createPcrawlPayload = {
              project_name: selectedPName,
              project_desc: selectedPDescription,
              project_manager: {
                user_id: userId,
              },
              project_type: {
                project_type_id: selectedCurrentPType,
              },
              project_detail: {
                data_type: selectedDataType,
                ...(selectedDataType === 2 && {
                  crawling_channel_type: selectedChannel,
                }),
                ...(selectedDataType === 2 && {
                  crawling_keywords: selectedKeyword,
                }),
                crawling_period_type: crawlPeriod,
                crawling_limit: selectedAmount,
                ...(crawlPeriod === 1 && {
                  crawling_period_start: crawlStartDate,
                  crawling_period_end: crawlEndDate,
                }),
              },
            };
            doCreateProject(createPcrawlPayload);
            break;
        }
        break;
      case 2:
        createPcrawlPayload = {
          project_name: selectedPName,
          project_desc: selectedPDescription,
          project_manager: {
            user_id: userId,
          },
          project_type: {
            project_type_id: selectedCurrentPType,
          },
        };
        doCreateProject(createPcrawlPayload);
        break;
      case 3:
        let pc: IProjectAnnotation[] = [];
        for (let i = 0; i < classesValue.length; i++) {
          let pa: IProjectAnnotation;
          pa = {
            annotation_category_name: classesValue[i].className,
            annotation_category_color: classesValue[i].classColor,
          };
          let aca: IAnnotationAttribute[] = [];
          if (
            classesValue[i].classAttr &&
            classesValue[i].classAttr!.length > 0
          ) {
            let attrs = classesValue[i].classAttr!;
            for (let k = 0; k < attrs.length; k++) {
              const annotation_category_attr_name = attrs[k].attrName;
              const annotation_category_attr_type =
                attrs[k].attrType === ClassAttrType.mono
                  ? 1
                  : ClassAttrType.multi
                  ? 2
                  : 3;
              let attrVals;
              let attrLimitMin;
              let attrLimitMax;
              if (attrs[k].attrValue) {
                attrVals = attrs[k].attrValue;
              }
              if (attrs[k].attrMin) {
                attrLimitMin = attrs[k].attrMin;
              }
              if (attrs[k].attrMax) {
                attrLimitMax = attrs[k].attrMax;
              }
              let ab = {
                annotation_category_attr_name,
                annotation_category_attr_type,
                annotation_category_attr_val: attrVals ? attrVals : undefined,
                annotation_category_attr_limit_min: attrLimitMin
                  ? attrLimitMin
                  : undefined,
                annotation_category_attr_limit_max: attrLimitMax
                  ? attrLimitMax
                  : undefined,
              };
              aca.push(ab);
            }
            pa.annotation_category_attributes = aca;
          }
          pc.push(pa);
        }
        createPcrawlPayload = {
          project_name: selectedPName,
          project_desc: selectedPDescription,
          project_manager: {
            user_id: userId,
          },
          project_type: {
            project_type_id: selectedCurrentPType,
          },
          project_detail: {
            project_categories: pc,
          },
        };
        doCreateProject(createPcrawlPayload);
        break;
    }
  };
  // ! handle select value changed
  const handleChangePType = (event: ChangeEvent<HTMLSelectElement>) => {
    const value = event.target.value;
    if (value === "데이터 수집") {
      setValue("pType", FormPType.collect);
    }
    if (value === "데이터 가공") {
      setValue("pType", FormPType.manufacturing);
    }
    if (value === "데이터 정제/전처리") {
      setValue("pType", FormPType.preprocessing);
    }
    setSelectedPType(getValues("pType"));
  };
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 인간 데이터셋 제공으로 state change
  const handleCollectDataSet = () => {
    setCollectDataType(CollectDataType.dataset);
  };
  // ! 프로젝트 유형의 데이터 수집 > 데이터 유형의 웹 크롤링 데이터로 state change
  const handleCollectCrawling = () => {
    setCollectDataType(CollectDataType.crawling);
  };
  // ! request api (create project)
  const doCreateProject = async (payload: ICreatePcrawlPayload) => {
    const res = await projectApi.createProject(payload);
    if (res && res.status === 200 && res.data) {
      toast.success("프로젝트 생성 완료");
    }
  };

  // ! 받은 dataset을 정제 후 state에 저장
  const cleanDatasets = (data: any) => {
    let cleanedDatasets: IDataset[] = [];
    data.datas.forEach((s: any) => {
      const datasetId = s.dataset_id;
      const datasetName = s.dataset_name;
      const datasetItemsCount = s.dataset_items_count;
      const datasetItemsSize = s.dataset_items_size;
      const datasetCategory = s.dataset_category;
      const datasetSubCategory = s.dataset_sub_category;

      const sForm = {
        datasetId,
        datasetName,
        datasetItemsCount,
        datasetItemsSize,
        datasetCategory,
        datasetSubCategory,
      };
      cleanedDatasets.push(sForm);
    });
    setDatasets(cleanedDatasets);
    setTotalDatasets(data.pageinfo.totalResults);
  };
  // ! request search dataset api
  const searchDatasets = async () => {
    const res = await datasetApi.getDatasets({
      ...setOffset(currentPage),
    });
    if (res && res.status === 200 && res.data) {
      cleanDatasets(res.data);
    }
  };
  // ! add datasets to selected datasets
  const selectDataset = (datasetId: number) => {
    setSelectedDatasets((prev) => [...prev, datasetId]);
  };
  // ! remove datasets on selected datasets
  const removeDataset = (datasetId: number) => {
    const removedDatasets = selectedDatasets.filter((s) => s !== datasetId);
    setSelectedDatasets(removedDatasets);
  };
  // ! remove all dataset state
  const removeAllDataset = () => {
    setSelectedDatasets([]);
  };
  // ! select all dataset state
  const selectAllDataset = () => {
    let all: number[] = [];
    datasets.forEach((d) => {
      all.push(d.datasetId);
    });
    setSelectedDatasets(all);
  };
  // ! check dataset is all selected
  const isSelectedAllDatasets = (): boolean => {
    return datasets.length === selectedDatasets.length;
  };
  // ! check dataset is selected
  const isSelectedDataset = (datasetId: number): boolean => {
    let isSelected = false;
    for (let i = 0; i < selectedDatasets.length; i++) {
      if (selectedDatasets[i] === datasetId) {
        isSelected = true;
        break;
      }
    }
    return isSelected;
  };
  // ! 화면 rendering 시, 데이터셋 search api request
  useEffect(() => {
    searchDatasets();
    // eslint-disable-next-line
  }, []);
  //**************** ClassGenerator part ****************/
  // ! 저장된 클래스 state
  const [classesValue, setClassesValue] = useState<IClass[]>([
    { classColor: "#F379B4", className: "인간" },
  ]);
  // ! 클래스의 우측 ">" 버튼 클릭할 때 선택되는 클래스 state
  const [currentSelectedClass, setCurrentSelectedClass] = useState<string>();
  // ! 클래스의 속성을 클릭할 때 해당 속성 state
  const [currentSelectedAttr, setCurrentSelectedAttr] = useState<string>();
  // ! class attr, class attr value 창 노출 여부
  const [showAttrDiv, setShowAttrDiv] = useState<boolean>(false);
  // ! 클래스 별 속성 값 작성 시 속성명에 대한 state
  const [attrName, setAttrName] = useState<string>("");
  // ! 클래스 별 속성 값 작성 시 속성값에 대한 array state
  const [tempAttrInfo, setTempAttrInfo] = useState<string[]>([]);
  // ! 최소 선택 수 (다중 선택형)
  const [minValue, setMinValue] = useState<number>(0);
  // ! 최대 선택 수 (다중 선택형)
  const [maxValue, setMaxValue] = useState<number>(0);
  // ! 최소 숫자 입력 값 (입력형)
  const [customMinNumber, setCustomMinNumber] = useState<number>(0);
  // ! 최대 숫자 입력 값 (입력형)
  const [customMaxNumber, setCustomMaxNumber] = useState<number>(0);
  // ! 최소 글자 입력 값 (입력형)
  const [customMinString, setCustomMinString] = useState<number>(0);
  // ! 최대 글자 입력 값 (입력형)
  const [customMaxString, setCustomMaxString] = useState<number>(0);
  // ! 속성유형 선택 select box의 선택된 값 state
  const [selectedAttrType, setSelectedAttrType] = useState<ClassAttrType>(
    ClassAttrType.mono
  );
  // ! 클래스의 우측 ">" 버튼 클릭할 때 해당 클래스를 state에 저장하고, attr창 노출
  const handleSetAttr = (className: string) => {
    setCurrentSelectedClass(className);
    setCurrentSelectedAttr(undefined);
    setAttrName("");
    setShowAttrDiv(true);
  };
  // ! 클래스의 속성을 선택할 때 해당 속성을 state에 저장
  const handleSetAttrOfClass = (attr: IClassAttr) => {
    setCurrentSelectedAttr(attr.attrName);
    setAttrName(attr.attrName);
    setSelectedAttrType(attr.attrType);
    setMinValue(attr.attrMin ? attr.attrMin : 0);
    setMaxValue(attr.attrMax ? attr.attrMax : 0);
    setCustomMinNumber(attr.customAttrMinNumber ? attr.customAttrMinNumber : 0);
    setCustomMaxNumber(attr.customAttrMaxNumber ? attr.customAttrMaxNumber : 0);
    setCustomMinString(attr.customAttrMinString ? attr.customAttrMinString : 0);
    setCustomMaxString(attr.customAttrMaxString ? attr.customAttrMaxString : 0);
  };
  // ! 클래스의 속성과 클래스가 선택됐을 때 해당 속성의 values를 반환
  const getCurrentSelectedAttrValues = (): null | IClassAttr => {
    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === currentSelectedClass) {
        const attrs = classesValue[i].classAttr!;
        if (!attrs) return null;
        for (let k = 0; k < attrs.length; k++) {
          if (attrs[k].attrName === currentSelectedAttr) {
            let classAttrs: IClassAttr = {
              attrName: attrs[k].attrName,
              attrType: attrs[k].attrType,
              attrValue: attrs[k].attrValue,
              attrMin: attrs[k].attrMin,
              attrMax: attrs[k].attrMax,
            };
            return classAttrs;
          }
        }
      }
      return null;
    }
    return null;
  };
  // ! 클래스를 선택했을경우, 해당 클래스의 속성이 있으면 그 리스트를 반환
  const getCurrentSelectedClassAttr = (): undefined | IClassAttr[] => {
    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === currentSelectedClass) {
        if (
          !classesValue[i].classAttr ||
          classesValue[i].classAttr === undefined
        ) {
          return undefined;
        }
        return classesValue[i].classAttr;
      }
    }
    return undefined;
  };
  // ! 클래스 좌측 X 버튼 클릭 시 호출
  const handleDeleteClass = (className: string) => {
    const deletedClasses = classesValue.filter(
      (c) => c.className !== className
    );
    setClassesValue(deletedClasses);
  };
  // ! 속성유형 선택 select box의 값 change
  const handleChangeSelect = (e: ChangeEvent<HTMLSelectElement>) => {
    const value = e.target.value;
    if (value === ClassAttrType.mono) {
      setSelectedAttrType(ClassAttrType.mono);
    }
    if (value === ClassAttrType.multi) {
      setSelectedAttrType(ClassAttrType.multi);
    }
    if (value === ClassAttrType.custom) {
      setSelectedAttrType(ClassAttrType.custom);
    }
  };
  // ! 클래스명 입력 후 Enter키 입력 시 해당 클래스명으로 클래스 저장
  const handleEnter: React.KeyboardEventHandler<HTMLInputElement> = (event) => {
    if (event.key !== "Enter") {
      return;
    }
    if (
      event.currentTarget.value === "" ||
      event.currentTarget.value === undefined
    ) {
      toast.error("클래스명은 필수 입력값입니다.");
      return;
    }
    let color = randomColor();
    const className = event.currentTarget.value;
    const classColor = color;
    const newClass = {
      className,
      classColor,
    };

    for (let i = 0; i < classesValue.length; i++) {
      if (classesValue[i].className === className) {
        event.currentTarget.value = "";
        return;
      }
    }
    setClassesValue((prev) => [...prev, newClass]);
  };
  // ! 클래스 별 속성 값 작성 시 속성명을 입력할 때 onChange event
  const handleChangeAttrName = (e: ChangeEvent<HTMLInputElement>) => {
    setAttrName(e.target.value);
  };
  // ! 다중선택형에서 최소 선택 수 state change
  const handleChangeMinValue = (e: ChangeEvent<HTMLInputElement>) => {
    setMinValue(parseInt(e.target.value));
  };
  // ! 다중선택형에서 최대 선택 수 state change
  const handleChangeMaxValue = (e: ChangeEvent<HTMLInputElement>) => {
    setMaxValue(parseInt(e.target.value));
  };
  // ! 입력형에서 최소 숫자입력 값 state change
  const handleChangeCustomMinNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMinNumber(parseInt(e.target.value));
  };
  // ! 입력형에서 최대 숫자입력 값 state change
  const handleChangeCustomMaxNumber = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMaxNumber(parseInt(e.target.value));
  };
  const handleChangeCustomMinString = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMinString(parseInt(e.target.value));
  };
  const handleChangeCustomMaxString = (e: ChangeEvent<HTMLInputElement>) => {
    setCustomMaxString(parseInt(e.target.value));
  };
  // ! 클래스 별 속성 값 작성 시 속성값 입력 후 Enter key 입력 시 해당 속성값 저장
  const handleAttrValueEnter: React.KeyboardEventHandler<HTMLInputElement> = (
    event
  ) => {
    if (event.key !== "Enter") {
      return;
    }
    if (attrName === "" || !attrName) {
      toast.error("속성명을 입력하여야 합니다.");
      return;
    }
    if (
      event.currentTarget.value === "" ||
      event.currentTarget.value === undefined
    ) {
      toast.error("속성값은 필수 입력값입니다.");
      return;
    }

    for (let i = 0; i < tempAttrInfo.length; i++) {
      if (tempAttrInfo[i] === event.currentTarget.value) {
        event.currentTarget.value = "";
        return;
      }
    }
    const attrVal = event.currentTarget.value;
    setTempAttrInfo((prev) => [...prev, attrVal]);
  };
  // ! 클래스 별 속성 값 작성 시 속성값 우측 X 버튼 클릭 시 해당 속성 삭제
  const handleTempAttrDelete = (attrValue: string) => {
    const newTempAttr = tempAttrInfo.filter((tav) => tav !== attrValue);
    setTempAttrInfo(newTempAttr);
  };
  // ! 클래스 별 속성 값 작성 시 우측 하단 저장 버튼
  const handleSave = () => {
    if (!currentSelectedClass || currentSelectedClass === "") {
      toast.error("클래스가 선택되지 않았습니다.");
      return;
    }
    if (!attrName || attrName === "") {
      toast.error("클래스의 속성명은 필수값입니다.");
      return;
    }
    let updated: IClassAttr;
    let updatedClass: IClass = {
      className: "",
      classColor: "",
    };
    switch (selectedAttrType) {
      // ! 입력형
      case ClassAttrType.custom:
        if (
          !customMinNumber &&
          !customMaxNumber &&
          !customMinString &&
          !customMaxString
        ) {
          toast.error(
            "입력형의 경우, 숫자 또는 문자의 최소최대 입력 수를 입력하여야 합니다."
          );
          return;
        }
        if (
          customMinNumber &&
          customMaxNumber &&
          customMinString &&
          customMaxString
        ) {
          toast.error(
            "입력형의 경우 숫자 또는 문자 중 한가지 타입만 최소 최대 입력수를 설정해야 합니다."
          );
          return;
        }

        if (customMinNumber && customMaxNumber) {
          updated = {
            attrName,
            attrType: selectedAttrType,
            customAttrMinNumber: customMinNumber,
            customAttrMaxNumber: customMaxNumber,
          };
        }
        if (customMinString && customMaxString) {
          updated = {
            attrName,
            attrType: selectedAttrType,
            customAttrMinString: customMinString,
            customAttrMaxString: customMaxString,
          };
        }
        break;
      // ! 단일 선택형 또는 다중 선택형
      default:
        if (tempAttrInfo.length === 0 || !tempAttrInfo) {
          if (
            getCurrentSelectedAttrValues() !== null &&
            !getCurrentSelectedAttrValues()!.attrValue
          ) {
            toast.error("해당 속성값이 비었습니다.");
            return;
          }
        }
        if (
          selectedAttrType === ClassAttrType.multi &&
          (!minValue || !maxValue)
        ) {
          if (
            getCurrentSelectedAttrValues() !== null &&
            (!getCurrentSelectedAttrValues()!.attrMin ||
              !getCurrentSelectedAttrValues()!.attrMax)
          ) {
            toast.error("최소/최대 선택수를 선택해야 합니다.");
            return;
          }
        }
        // ! 현재 선택된 클래스의 선택된 속성이 있다면 그 속성의 values return 없다면 null
        const existAttr = getCurrentSelectedAttrValues();
        let mergedAttrs: string[] = [];
        // ! 위에서 선택된 클래스의 선택된 속성이 있어서 그 값들을 가져왔다면 그 값과 현재 추가한 값을 merge
        if (
          existAttr &&
          existAttr.attrValue &&
          existAttr.attrValue.length > 0
        ) {
          mergedAttrs = existAttr.attrValue;
          mergedAttrs = [...mergedAttrs, ...tempAttrInfo];
        } else {
          mergedAttrs = tempAttrInfo;
        }

        if (selectedAttrType === ClassAttrType.mono) {
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrValue: mergedAttrs,
          };
        }
        if (selectedAttrType === ClassAttrType.multi) {
          let min = existAttr && existAttr.attrMin ? existAttr.attrMin : 0;
          let max = existAttr && existAttr.attrMax ? existAttr.attrMax : 0;
          if (minValue && minValue !== 0) {
            min = minValue;
          }
          if (maxValue && maxValue !== 0) {
            max = maxValue;
          }
          updated = {
            attrName,
            attrType: selectedAttrType,
            attrValue: mergedAttrs,
            attrMin: min,
            attrMax: max,
          };
        }
        break;
    }

    classesValue.forEach((c) => {
      if (c.className === currentSelectedClass) {
        updatedClass.className = c.className;
        updatedClass.classColor = c.classColor;
        let attrs: IClassAttr[] = [];
        let isExistAttr = false;
        // ! 기존 클래스의 속성이 하나라도 있다면 아래 if문 실행
        if (c.classAttr) {
          for (let i = 0; i < c.classAttr.length; i++) {
            if (c.classAttr[i].attrName === attrName) {
              isExistAttr = true;
              break;
            }
          }
          // ! 기존 속성이 있고 그걸 업데이트 하려고 한다면 if문 실행 / 새로 추가하는 속성이면 else문 실행
          if (isExistAttr) {
            attrs = c.classAttr.map((ca) => {
              if (ca.attrName === attrName) {
                return updated;
              }
              return ca;
            });
          } else {
            attrs = c.classAttr;
            attrs.push(updated);
          }
        } else {
          attrs.push(updated);
        }
        updatedClass.classAttr = attrs;
      }
    });

    const newClasses = classesValue.map((c) => {
      if (c.className === updatedClass.className) {
        return (c = updatedClass);
      }
      return c;
    });

    setClassesValue(newClasses);
    setCurrentSelectedAttr(undefined);
    setTempAttrInfo([]);
    setAttrName("");
    setMinValue(0);
    setMaxValue(0);
    setCustomMinNumber(0);
    setCustomMaxNumber(0);
    setCustomMinString(0);
    setCustomMaxString(0);
  };
  // ! 클래스 별 속성 값의 우측 상단 X 버튼 클릭
  const handleCloseAttrsInputForm = () => {
    setAttrName("");
    setCurrentSelectedAttr(undefined);
    setMinValue(0);
    setMaxValue(0);
    setCustomMinNumber(0);
    setCustomMaxNumber(0);
    setCustomMinString(0);
    setCustomMaxString(0);
  };
  return (
    <ProjectCreatePresenter
      formErrors={errors}
      datasets={datasets}
      totalDatasets={totalDatasets}
      calendar={calendar}
      dateRange={dateRange}
      selectedPType={selectedPType}
      currentPage={currentPage}
      collectDataType={collectDataType}
      currentCollectChannel={currentCollectChannel}
      currentCollectDuration={currentCollectDuration}
      currentCollectAmount={currentCollectAmount}
      showAttrDiv={showAttrDiv}
      currentSelectedClass={currentSelectedClass}
      currentSelectedAttr={currentSelectedAttr}
      selectedAttrType={selectedAttrType}
      attrName={attrName}
      tempAttrInfo={tempAttrInfo}
      classesValue={classesValue}
      customMinNumber={customMinNumber}
      customMaxNumber={customMaxNumber}
      customMinString={customMinString}
      customMaxString={customMaxString}
      minValue={minValue}
      maxValue={maxValue}
      handleSetChannel={handleSetChannel}
      handleSetDuration={handleSetDuration}
      handleSetAmount={handleSetAmount}
      showCalendar={showCalendar}
      handleChangeCalendar={handleChangeCalendar}
      handlePopupDown={handlePopupDown}
      dateToString={dateToString}
      onChangePage={onChangePage}
      register={register}
      handleSubmit={handleSubmit}
      onSubmit={onSubmit}
      handleChangePType={handleChangePType}
      handleCollectDataSet={handleCollectDataSet}
      handleCollectCrawling={handleCollectCrawling}
      selectDataset={selectDataset}
      removeDataset={removeDataset}
      isSelectedDataset={isSelectedDataset}
      selectAllDataset={selectAllDataset}
      isSelectedAllDatasets={isSelectedAllDatasets}
      removeAllDataset={removeAllDataset}
      preventEnter={preventEnter}
      handleEnter={handleEnter}
      getCurrentSelectedClassAttr={getCurrentSelectedClassAttr}
      handleSetAttrOfClass={handleSetAttrOfClass}
      handleCloseAttrsInputForm={handleCloseAttrsInputForm}
      handleChangeAttrName={handleChangeAttrName}
      handleChangeSelect={handleChangeSelect}
      getCurrentSelectedAttrValues={getCurrentSelectedAttrValues}
      handleAttrValueEnter={handleAttrValueEnter}
      handleTempAttrDelete={handleTempAttrDelete}
      handleDeleteClass={handleDeleteClass}
      handleSetAttr={handleSetAttr}
      handleChangeCustomMinNumber={handleChangeCustomMinNumber}
      handleChangeCustomMaxNumber={handleChangeCustomMaxNumber}
      handleChangeCustomMinString={handleChangeCustomMinString}
      handleChangeCustomMaxString={handleChangeCustomMaxString}
      handleSave={handleSave}
      handleChangeMinValue={handleChangeMinValue}
      handleChangeMaxValue={handleChangeMaxValue}
    />
  );
};

export default ProjectCreateContainer;
