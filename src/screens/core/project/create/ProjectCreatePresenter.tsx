import React, { ChangeEvent } from 'react';
import styled from 'styled-components';
import Header from '../../../../components/core/Header';
import ListHeader from '../../../../components/core/ListHeader';
import ListItem from '../../../../components/core/ListItem';
import Paginator from '../../../../components/core/Paginator';
import iconWarning from '../../../../assets/images/project/icon/icon-warning-purple.svg';
import iconNaver from '../../../../assets/images/project/img/naver.svg';
import iconDaum from '../../../../assets/images/project/img/daum.svg';
import iconGoogle from '../../../../assets/images/project/img/google.svg';
import iconInstagram from '../../../../assets/images/project/img/instagram.svg';
import iconCalendar from '../../../../assets/images/project/icon/icon-calendar.svg';
import Calendar from 'react-calendar';
import 'react-calendar/dist/Calendar.css';
import '../all/calendar.css';
import {
  CollectDataType,
  FormPCollectAmountType,
  FormPCollectDurationType,
  FormPCrawlChannelType,
  FormPType,
  IFormInput,
} from './ProjectCreateContainer';
import {
  FieldErrorsImpl,
  SubmitHandler,
  UseFormHandleSubmit,
  UseFormRegister,
} from 'react-hook-form';
import { IDataset } from '../../../../api/datasetApi';
import ClassGenerator, {
  ClassAttrType,
  IClass,
  IClassAttr,
} from '../../../../components/core/ClassGenerator';

interface IProjectCreatePresenter {
  formErrors: Partial<
    FieldErrorsImpl<{
      pName: string;
      pDescription: string;
      pType: FormPType;
      pCrawlChannel: NonNullable<FormPCrawlChannelType | undefined>;
      pCrawlKeyword: string;
      pCrawlCustomAmount: NonNullable<FormPCollectAmountType | undefined>;
    }>
  >;
  datasets: IDataset[];
  totalDatasets: number;
  calendar: boolean;
  dateRange: Date[] | null;
  selectedPType: FormPType;
  currentPage: number;
  collectDataType: CollectDataType;
  currentCollectChannel: FormPCrawlChannelType;
  currentCollectDuration: FormPCollectDurationType;
  currentCollectAmount: FormPCollectAmountType;
  showAttrDiv: boolean;
  currentSelectedClass: string | undefined;
  currentSelectedAttr: string | undefined;
  selectedAttrType: ClassAttrType;
  attrName: string;
  tempAttrInfo: string[];
  classesValue: IClass[];
  customMinNumber: number;
  customMaxNumber: number;
  customMinString: number;
  customMaxString: number;
  minValue: number;
  maxValue: number;
  handleSetChannel: (channel: FormPCrawlChannelType) => void;
  handleSetDuration: (duration: FormPCollectDurationType) => void;
  handleSetAmount: (amount: FormPCollectAmountType) => void;
  showCalendar: () => void;
  handleChangeCalendar: (
    value: Date[],
    event: ChangeEvent<HTMLInputElement>
  ) => void;
  handlePopupDown: (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => void;
  dateToString: () => string;
  onChangePage: (page: number) => void;
  register: UseFormRegister<IFormInput>;
  handleSubmit: UseFormHandleSubmit<IFormInput>;
  onSubmit: SubmitHandler<IFormInput>;
  handleChangePType: (event: ChangeEvent<HTMLSelectElement>) => void;
  handleCollectDataSet: () => void;
  handleCollectCrawling: () => void;
  selectDataset: (datasetId: number) => void;
  removeDataset: (datasetId: number) => void;
  isSelectedDataset: (datasetId: number) => boolean;
  selectAllDataset: () => void;
  isSelectedAllDatasets: () => boolean;
  removeAllDataset: () => void;
  preventEnter: React.KeyboardEventHandler<HTMLFormElement>;
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
  getCurrentSelectedClassAttr: () => undefined | IClassAttr[];
  handleSetAttrOfClass: (attr: IClassAttr) => void;
  handleCloseAttrsInputForm: () => void;
  handleChangeAttrName: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeSelect: (e: ChangeEvent<HTMLSelectElement>) => void;
  getCurrentSelectedAttrValues: () => null | IClassAttr;
  handleAttrValueEnter: React.KeyboardEventHandler<HTMLInputElement>;
  handleTempAttrDelete: (attrValue: string) => void;
  handleDeleteClass: (className: string) => void;
  handleSetAttr: (className: string) => void;
  handleChangeCustomMinNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxNumber: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMinString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeCustomMaxString: (e: ChangeEvent<HTMLInputElement>) => void;
  handleSave: () => void;
  handleChangeMinValue: (e: ChangeEvent<HTMLInputElement>) => void;
  handleChangeMaxValue: (e: ChangeEvent<HTMLInputElement>) => void;
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
const MainCenterWrapper = styled.div`
  width: 100%;
  height: 100%;
  overflow-y: scroll;
  background-color: #ecf3fb;
  box-sizing: border-box;
`;
const MainCenterForm = styled.form`
  display: flex;
  flex-direction: column;
  box-sizing: border-box;
  background-color: #ecf3fb;
  width: 100%;
  height: 100%;
  padding: 30px 30px;
`;
const MainProjectInfoContainer = styled.div`
  width: 100%;
  padding: 30px 30px;
  box-sizing: border-box;
  background-color: #fff;
  display: flex;
  flex-direction: column;
`;
const Section = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
  margin-bottom: 15px;
  :last-child {
    margin-bottom: 0;
  }
`;
const LabelWrapper = styled.div`
  display: flex;
  width: 150px;
`;
const Label = styled.span`
  font-size: 17px;
  font-weight: 800;
  color: #243754;
  margin-right: 20px;
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
  width: 400px;
  height: 32px;
  background-color: #f4f4f4;
  color: #707075;
  font-size: 14px;
  font-weight: 700;
  display: flex;
  align-items: center;
  padding: 0 15px;
`;
const PNameInput = styled.input`
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
const PTypeSelect = styled.select`
  padding: 8px 10px;
  width: 205px;
  border: 1px solid #afccf4;
  background-color: #f7fafe;
  font-size: 16px;
  font-weight: 700;
  margin-right: 25px;
  :focus {
    outline: none;
  }
`;
const Icon = styled.img``;
const MainBottomDiv = styled(MainProjectInfoContainer)`
  background-color: inherit;
  padding: 20px 0;
  display: flex;
  flex-direction: row;
  align-items: center;
`;
const CreateButton = styled.button`
  display: flex;
  width: 100px;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #3480e3;
  color: #fff;
  margin-right: 10px;
`;
const CancelButton = styled.div`
  display: flex;
  width: 100px;
  box-sizing: border-box;
  justify-content: center;
  align-items: center;
  padding: 8px 10px;
  border: 1px solid #afccf4;
  font-size: 16px;
  font-weight: 700;
  cursor: pointer;
  background-color: #fff;
  color: #243754;
`;
const PConfigureContainer = styled.div`
  margin-top: 30px;
  min-height: 400px;
  max-height: 480px;
  overflow-x: hidden;
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 30px 0;
  box-sizing: content-box;
  background-color: #fff;
`;
const SmallSection = styled.div`
  width: 100%;
  display: flex;
  align-items: center;
`;
const SmallLabel = styled(Label)`
  font-size: 15px;
`;
const PTypeBtn = styled.div<{ isSelected: boolean }>`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 150px;
  height: 36px;
  border-radius: 20px;
  border: 1px solid #afccf4;
  background-color: ${(props) => (props.isSelected ? '#3580E3' : '#ffffff')};
  color: ${(props) => (props.isSelected ? '#ffffff' : '#243654')};
  transition: background-color 0.5s linear;
  cursor: pointer;
  font-size: 14px;
  font-weight: 800;
  margin-right: 20px;
`;
const PConfigureUpper = styled.div`
  width: 100%;
  padding: 0 30px;
  display: flex;
  flex-direction: column;
  margin-bottom: 20px;
`;
const Warning = styled.span`
  font-size: 18px;
  font-weight: 700;
  color: #a248e9;
  margin-left: 10px;
`;
const RadioWrapper = styled.div`
  display: flex;
  flex-direction: column;
  margin-right: 18px;
  cursor: pointer;
`;
const RadioLabelWrapper = styled.div`
  display: flex;
  align-items: center;
  cursor: pointer;
`;
const RadioLabelContainer = styled.div`
  display: flex;
  align-items: center;
`;
const RadioBtnWrapper = styled.div<{ isSelected: boolean }>`
  width: 15px;
  height: 15px;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 30px;
  border: 1px solid ${(props) => (props.isSelected ? '#2ea090' : '#243654')};
  margin-right: 7px;
`;
const RadioBtn = styled.div<{ isSelected: boolean }>`
  width: 7px;
  height: 7px;
  border-radius: 20px;
  background-color: ${(props) => (props.isSelected ? '#2ea090' : '')};
  border: ${(props) => (props.isSelected ? '1px solid #2ea090' : '')};
`;
const RadioLabel = styled.span<{ isSelected: boolean }>`
  font-size: 12px;
  font-weight: 700;
  color: ${(props) => (props.isSelected ? '#2ea090' : '#243654')};
`;
const RadioWebLogoWrapper = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  width: 200px;
  height: 60px;
  border: 1px solid #aeccf4;
  margin-top: 10px;
`;
const DateDivContainer = styled.div`
  min-width: 300px;
  display: flex;
  position: relative;
`;
const DateDiv = styled.div<{ isEnabled: boolean }>`
  position: relative;
  min-width: 200px;
  max-width: 250px;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 4px 10px;
  background-color: ${(props) => (props.isEnabled ? '#f7fafe' : '#f4f4f4')};
  border: 1px solid #afccf4;
  cursor: ${(props) => (props.isEnabled ? 'pointer' : 'not-allowed')};
`;
const DateString = styled.span<{ dates: number | null }>`
  font-size: 14px;
  font-weight: 700;
  color: #243754;
  margin-right: ${(props) =>
    props.dates !== null && props.dates === 2 && '30px'};
`;
const ErrorMessage = styled.span`
  font-size: 14px;
  font-weight: 700;
  color: #ff4343;
`;

const ProjectCreatePresenter: React.FC<IProjectCreatePresenter> = ({
  formErrors,
  datasets,
  totalDatasets,
  calendar,
  dateRange,
  selectedPType,
  currentPage,
  collectDataType,
  currentCollectChannel,
  currentCollectDuration,
  currentCollectAmount,
  showAttrDiv,
  currentSelectedClass,
  currentSelectedAttr,
  selectedAttrType,
  attrName,
  tempAttrInfo,
  classesValue,
  customMinNumber,
  customMaxNumber,
  customMinString,
  customMaxString,
  minValue,
  maxValue,
  handleSetChannel,
  handleSetDuration,
  handleSetAmount,
  showCalendar,
  handleChangeCalendar,
  handlePopupDown,
  dateToString,
  onChangePage,
  register,
  handleSubmit,
  onSubmit,
  handleChangePType,
  handleCollectDataSet,
  handleCollectCrawling,
  selectDataset,
  removeDataset,
  isSelectedDataset,
  selectAllDataset,
  isSelectedAllDatasets,
  removeAllDataset,
  preventEnter,
  handleEnter,
  getCurrentSelectedClassAttr,
  handleSetAttrOfClass,
  handleCloseAttrsInputForm,
  handleChangeAttrName,
  handleChangeSelect,
  getCurrentSelectedAttrValues,
  handleAttrValueEnter,
  handleTempAttrDelete,
  handleDeleteClass,
  handleSetAttr,
  handleChangeCustomMinNumber,
  handleChangeCustomMaxNumber,
  handleChangeCustomMinString,
  handleChangeCustomMaxString,
  handleSave,
  handleChangeMinValue,
  handleChangeMaxValue,
}) => {
  return (
    <Container onClick={handlePopupDown}>
      <MainWrapper>
        <Header title="프로젝트 생성" />
        <MainCenterWrapper>
          <MainCenterForm
            onSubmit={handleSubmit(onSubmit)}
            onKeyDown={(e) => preventEnter(e)}
          >
            <MainProjectInfoContainer>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 이름*</Label>
                </LabelWrapper>
                <PNameInput
                  {...register('pName', {
                    required: '프로젝트 이름은 필수 필드입니다.',
                  })}
                  placeholder={'프로젝트 이름을 입력해주세요.'}
                />
                {formErrors.pName && (
                  <ErrorMessage>{formErrors.pName.message}</ErrorMessage>
                )}
              </Section>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 설명*</Label>
                </LabelWrapper>
                <PNameInput
                  {...register('pDescription', {
                    required: '프로젝트 설명은 필수 필드입니다.',
                  })}
                  placeholder={'프로젝트 설명을 입력해주세요.'}
                />
                {formErrors.pDescription && (
                  <ErrorMessage>{formErrors.pDescription.message}</ErrorMessage>
                )}
              </Section>
              <Section>
                <LabelWrapper>
                  <Label>프로젝트 유형*</Label>
                </LabelWrapper>
                <PTypeSelect
                  {...register('pType', {
                    required: '프로젝트 유형은 필수 필드입니다.',
                  })}
                  value={selectedPType}
                  onChange={handleChangePType}
                >
                  <option value={'데이터 수집'}>데이터 수집</option>
                  <option value={'데이터 가공'}>데이터 가공</option>
                  <option value={'데이터 정제/전처리'}>
                    데이터 정제/전처리
                  </option>
                </PTypeSelect>
                {formErrors.pType && (
                  <ErrorMessage>{formErrors.pType.message}</ErrorMessage>
                )}
              </Section>
            </MainProjectInfoContainer>
            {selectedPType === FormPType.collect && (
              <PConfigureContainer>
                <PConfigureUpper>
                  <Section style={{ marginBottom: 30 }}>
                    <Label>프로젝트 설정*</Label>
                  </Section>
                  <SmallSection>
                    <SmallLabel>데이터 유형*</SmallLabel>
                  </SmallSection>
                  <SmallSection style={{ marginTop: 10 }}>
                    <PTypeBtn
                      isSelected={collectDataType === CollectDataType.dataset}
                      onClick={handleCollectDataSet}
                    >
                      인간 데이터셋 제공
                    </PTypeBtn>
                    <PTypeBtn
                      isSelected={collectDataType === CollectDataType.crawling}
                      onClick={handleCollectCrawling}
                    >
                      웹 크롤링 데이터
                    </PTypeBtn>
                  </SmallSection>
                </PConfigureUpper>
                {collectDataType === CollectDataType.dataset && (
                  <>
                    <ListHeader
                      type="DATASET TYPE"
                      selectAllDataset={selectAllDataset}
                      isSelectedAllDatasets={isSelectedAllDatasets}
                      removeAllDataset={removeAllDataset}
                    />
                    {datasets.map((data, index) => (
                      <ListItem
                        key={index}
                        type={'DATASET TYPE'}
                        dataset={data}
                        selectDataset={selectDataset}
                        removeDataset={removeDataset}
                        isSelectedDataset={isSelectedDataset}
                      />
                    ))}
                    <Paginator
                      itemCount={datasets.length}
                      page={currentPage}
                      totalCount={totalDatasets}
                      stateChangeFn={onChangePage}
                    />
                  </>
                )}
                {collectDataType === CollectDataType.crawling && (
                  <PConfigureUpper>
                    <Section>
                      <Icon src={iconWarning} />
                      <Warning>
                        크롤링한 데이터는 상업적 용도로 사용 불가능합니다. 법적
                        문제 발생 시 책임지지 않습니다.
                      </Warning>
                    </Section>
                    <Section style={{ marginTop: 15 }}>
                      <SmallLabel>수집채널</SmallLabel>
                    </Section>
                    <Section>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.naver)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.naver
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.naver
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.naver
                            }
                          >
                            네이버(Naver)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconNaver} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.daum)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.daum
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.daum
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.daum
                            }
                          >
                            다음(Daum)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconDaum} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.google)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.google
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.google
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.google
                            }
                          >
                            구글(Google)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconGoogle} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                      <RadioWrapper
                        onClick={() =>
                          handleSetChannel(FormPCrawlChannelType.instagram)
                        }
                      >
                        <RadioLabelContainer>
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.instagram
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectChannel ===
                                FormPCrawlChannelType.instagram
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectChannel ===
                              FormPCrawlChannelType.instagram
                            }
                          >
                            인스타그램(Instagram)
                          </RadioLabel>
                        </RadioLabelContainer>
                        <RadioWebLogoWrapper>
                          <Icon src={iconInstagram} />
                        </RadioWebLogoWrapper>
                      </RadioWrapper>
                    </Section>
                    <Section>
                      <SmallLabel>키워드</SmallLabel>
                    </Section>
                    <Section>
                      <PNameInput
                        {...register('pCrawlKeyword')}
                        placeholder={'키워드를 입력하세요.'}
                      />
                    </Section>
                    <Section>
                      <SmallLabel>수집기간</SmallLabel>
                    </Section>
                    <Section>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.week)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.week
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.week
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.week
                            }
                          >
                            1주일
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.month3)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.month3
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.month3
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.month3
                            }
                          >
                            3개월
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.year)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.year
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.year
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.year
                            }
                          >
                            1년
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetDuration(FormPCollectDurationType.custom)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectDuration ===
                                FormPCollectDurationType.custom
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                          >
                            직접설정
                          </RadioLabel>
                        </RadioLabelWrapper>
                        <DateDivContainer style={{ marginLeft: 20 }}>
                          <DateDiv
                            isEnabled={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                            }
                            onClick={
                              currentCollectDuration ===
                              FormPCollectDurationType.custom
                                ? showCalendar
                                : undefined
                            }
                          >
                            <DateString dates={dateRange && dateRange.length}>
                              {dateRange ? dateToString() : '날짜 선택'}
                            </DateString>
                            <Icon src={iconCalendar} />
                          </DateDiv>
                          {calendar && (
                            <Calendar
                              value={dateRange as any}
                              onChange={(
                                value: Date[],
                                event: ChangeEvent<HTMLInputElement>
                              ) => handleChangeCalendar(value, event)}
                              prev2Label={null}
                              next2Label={null}
                              minDetail="month"
                              selectRange
                              minDate={
                                new Date(
                                  Date.now() - 60 * 60 * 24 * 7 * 4 * 6 * 10000
                                )
                              }
                              maxDate={
                                new Date(
                                  Date.now() + 60 * 60 * 24 * 7 * 4 * 6 * 1000
                                )
                              }
                            />
                          )}
                        </DateDivContainer>
                      </RadioLabelContainer>
                    </Section>
                    <Section>
                      <SmallLabel>수집건수</SmallLabel>
                    </Section>
                    <Section>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.h1)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h1
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.h1
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h1
                            }
                          >
                            100
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.h5)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h5
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.h5
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount === FormPCollectAmountType.h5
                            }
                          >
                            500
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th1)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th1
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th1
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th1
                            }
                          >
                            1000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th2)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th2
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th2
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th2
                            }
                          >
                            2000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.th3)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th3
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.th3
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.th3
                            }
                          >
                            3000
                          </RadioLabel>
                        </RadioLabelWrapper>
                      </RadioLabelContainer>
                      <RadioLabelContainer style={{ marginRight: 60 }}>
                        <RadioLabelWrapper
                          onClick={() =>
                            handleSetAmount(FormPCollectAmountType.custom)
                          }
                        >
                          <RadioBtnWrapper
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.custom
                            }
                          >
                            <RadioBtn
                              isSelected={
                                currentCollectAmount ===
                                FormPCollectAmountType.custom
                              }
                            />
                          </RadioBtnWrapper>
                          <RadioLabel
                            isSelected={
                              currentCollectAmount ===
                              FormPCollectAmountType.custom
                            }
                          >
                            직접입력
                          </RadioLabel>
                        </RadioLabelWrapper>
                        <PNameInput
                          {...register('pCrawlCustomAmount')}
                          type={'text'}
                          disabled={
                            currentCollectAmount !==
                            FormPCollectAmountType.custom
                          }
                          style={{
                            minWidth: 80,
                            maxWidth: 80,
                            marginLeft: 10,
                            paddingTop: 5,
                            paddingBottom: 5,
                            backgroundColor:
                              currentCollectAmount !==
                              FormPCollectAmountType.custom
                                ? '#F4F4F4'
                                : '#F7FAFE',
                          }}
                        />
                      </RadioLabelContainer>
                    </Section>
                  </PConfigureUpper>
                )}
              </PConfigureContainer>
            )}
            {selectedPType === FormPType.manufacturing && (
              <PConfigureContainer>
                <PConfigureUpper>
                  <Section style={{ marginBottom: 30 }}>
                    <Label>프로젝트 설정*</Label>
                  </Section>
                  <SmallSection>
                    <SmallLabel>클래스 설정*</SmallLabel>
                  </SmallSection>
                </PConfigureUpper>
                <ClassGenerator
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
              </PConfigureContainer>
            )}
            <MainProjectInfoContainer style={{ marginTop: 30 }}>
              <Section>
                <LabelWrapper>
                  <Label>작업단계</Label>
                </LabelWrapper>
              </Section>
              <Section style={{ marginBottom: 10 }}>
                <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                  <LabelDiv>1단계</LabelDiv>
                </LabelWrapper>
                <LabelValueDiv>
                  {selectedPType === FormPType.collect
                    ? '수집'
                    : selectedPType === FormPType.preprocessing
                    ? '정제/전처리'
                    : '가공'}
                </LabelValueDiv>
              </Section>
              <Section>
                <LabelWrapper style={{ marginRight: 10, width: 100 }}>
                  <LabelDiv>2단계</LabelDiv>
                </LabelWrapper>
                <LabelValueDiv>검수</LabelValueDiv>
              </Section>
            </MainProjectInfoContainer>
            <MainBottomDiv>
              <CreateButton>생성하기</CreateButton>
              <CancelButton>취소</CancelButton>
            </MainBottomDiv>
          </MainCenterForm>
        </MainCenterWrapper>
      </MainWrapper>
    </Container>
  );
};

export default ProjectCreatePresenter;
