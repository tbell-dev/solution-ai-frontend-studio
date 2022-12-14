import React, { ChangeEvent } from "react";
import styled from "styled-components";
import iconDelete from "../../assets/images/project/icon/icon-class-delete.svg";
import iconArrow from "../../assets/images/project/icon/icon-arrow01.svg";
import iconClose from "../../assets/images/project/icon/icon-x.svg";
import iconCircleClose from "../../assets/images/project/icon/icon-circle-close.svg";

interface IClassGenerator {
  handleEnter: React.KeyboardEventHandler<HTMLInputElement>;
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

export interface IClassAttr {
  attrName: string;
  attrType: ClassAttrType;
  attrValue?: string[];
  attrMin?: number;
  attrMax?: number;
  customAttrMinNumber?: number;
  customAttrMaxNumber?: number;
  customAttrMinString?: number;
  customAttrMaxString?: number;
}

export interface IClass {
  classColor: string;
  className: string;
  classAttr?: IClassAttr[];
}
export enum ClassAttrType {
  mono = "?????? ?????????",
  multi = "?????? ?????????",
  custom = "?????????",
}
const ClassContainer = styled.div`
  display: flex;
  width: 100%;
  padding-left: 30px;
  padding-right: 30px;
`;
const ClassWrapper = styled.div`
  display: flex;
  flex-direction: column;
  width: 200px;
  max-width: 500px;
  margin-right: 30px;
`;
const ClassWrapperTitleBox = styled.div`
  width: 200px;
  height: 36px;
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #ccdff8;
`;
const ClassWrapperTitle = styled.span`
  color: #243654;
  font-size: 14px;
  font-weight: 800;
`;
const ClassWrapperBody = styled.div`
  box-sizing: border-box;
  width: 200px;
  min-height: 220px;
  max-height: 250px;
  padding: 10px;
  background-color: #f7fafe;
  overflow-y: auto;
`;
const ClassWrapperBodyInput = styled.input`
  border: 1px solid #aeccf4;
  box-sizing: border-box;
  background-color: #f7fafe;
  width: 100%;
  padding: 6px 10px;
  :focus {
    outline: none;
  }
  ::placeholder {
    color: #707075;
  }
  font-size: 11px;
  font-weight: 700;
`;
const ClassWrapperLists = styled.div`
  display: flex;
  flex-direction: column;
  width: 100%;
  padding: 10px 0;
`;
const ClassLayout = styled.div<{ classBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: ${(props) => (props.classBg ? "#ECF3FB" : "none")};
`;
const AttrLayout = styled.div<{ attrBg: boolean }>`
  display: flex;
  align-items: center;
  width: 100%;
  padding: 5px 0;
  background-color: ${(props) => (props.attrBg ? "#ECF3FB" : "none")};
`;
const ClassDeleteBtn = styled.img`
  margin-right: 10px;
  cursor: pointer;
`;
const Icon = styled.img`
  cursor: pointer;
`;
const ClassDiv = styled.div`
  display: flex;
  width: 80%;
  align-items: center;
`;
const ClassColor = styled.div<{ bgColor: string }>`
  background-color: ${(props) => props.bgColor};
  border: 1px solid ${(props) => props.bgColor};
  width: 12px;
  height: 12px;
  border-radius: 20px;
  margin-right: 7px;
`;
const ClassLabel = styled.span`
  color: #212122;
  font-size: 12px;
  font-weight: 700;
`;
const ClassAttrForm = styled.div<{ attrType: ClassAttrType }>`
  display: flex;
  flex-direction: column;
  width: 100%;
  box-sizing: border-box;
  height: ${(props) =>
    props.attrType === ClassAttrType.multi ? "230px" : "200px"};
  background-color: #ffffff;
  border: 1px solid #aeccf4;
  padding: 10px 10px;
`;
const FormSection = styled.div`
  display: flex;
  align-items: center;
  width: 100%;
  margin-top: 10px;
`;
const FormUpper = styled.div`
  width: 100%;
  display: flex;
  justify-content: flex-end;
`;
const FormColumn = styled.div`
  display: flex;
  flex-direction: column;
  width: 50%;
  :first-child {
    margin-right: 10px;
  }
`;
const Select = styled.select`
  width: 100%;
  padding: 6px 10px;
  background-color: #f7fafe;
  font-size: 11px;
  font-weight: 500;
  border: none;
  :focus {
    outline: none;
  }
`;
const SelectedContainer = styled.div`
  display: flex;
  align-items: center;
  box-sizing: border-box;
  width: 100%;
  height: 50px;
  margin-top: 10px;
  padding: 0 5px;
  background-color: #f7fafe;
`;
const SelectedItem = styled.div`
  display: flex;
  align-items: center;
  justify-content: space-evenly;
  border: 1px solid #aeccf4;
  background-color: #ffffff;
  border-radius: 20px;
  min-width: 45px;
  max-width: 70px;
  padding: 2px 3px;
  height: 28px;
  margin-right: 3px;
`;
const ItemLabel = styled.span`
  font-size: 11px;
  font-weight: 700;
  margin-right: 5px;
  color: #243654;
`;
const SaveContainer = styled.div`
  width: 430px;
  display: flex;
  justify-content: flex-end;
  margin-top: 15px;
`;
const SaveBtn = styled.div`
  display: flex;
  align-items: center;
  justify-content: center;
  background-color: #3580e3;
  color: #fff;
  font-weight: 800;
  font-size: 14px;
  cursor: pointer;
  width: 100px;
  height: 36px;
`;

const ClassGenerator: React.FC<IClassGenerator> = ({
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
    <ClassContainer>
      <ClassWrapper>
        <ClassWrapperTitleBox>
          <ClassWrapperTitle>?????????</ClassWrapperTitle>
        </ClassWrapperTitleBox>
        <ClassWrapperBody>
          <ClassWrapperBodyInput
            onKeyDown={handleEnter}
            type={"text"}
            placeholder={"????????? ?????? ??? Enter"}
          />
          <ClassWrapperLists>
            {classesValue &&
              classesValue.map((c, index) => (
                <ClassLayout
                  key={index}
                  classBg={currentSelectedClass === c.className}
                >
                  <ClassDeleteBtn
                    src={iconDelete}
                    onClick={() => handleDeleteClass(c.className)}
                  />
                  <ClassDiv>
                    <ClassColor bgColor={c.classColor} />
                    <ClassLabel>{c.className}</ClassLabel>
                  </ClassDiv>
                  <Icon
                    src={iconArrow}
                    onClick={() => handleSetAttr(c.className)}
                  />
                </ClassLayout>
              ))}
          </ClassWrapperLists>
        </ClassWrapperBody>
      </ClassWrapper>
      {showAttrDiv && (
        <>
          <ClassWrapper>
            <ClassWrapperTitleBox>
              <ClassWrapperTitle>????????? ??? ??????</ClassWrapperTitle>
            </ClassWrapperTitleBox>
            <ClassWrapperBody>
              <ClassWrapperLists style={{ padding: 0 }}>
                {currentSelectedClass &&
                  getCurrentSelectedClassAttr() &&
                  getCurrentSelectedClassAttr() !== undefined &&
                  getCurrentSelectedClassAttr()!.map((attr, index) => (
                    <AttrLayout
                      attrBg={currentSelectedAttr === attr.attrName}
                      onClick={() => handleSetAttrOfClass(attr)}
                      key={index}
                      style={{
                        width: "100%",
                        color: "#6B78A1",
                        cursor: "pointer",
                      }}
                    >
                      {attr.attrName}
                    </AttrLayout>
                  ))}
              </ClassWrapperLists>
            </ClassWrapperBody>
          </ClassWrapper>
          {currentSelectedClass && (
            <ClassWrapper>
              <ClassWrapperTitleBox>
                <ClassWrapperTitle>????????? ??? ?????? ???</ClassWrapperTitle>
              </ClassWrapperTitleBox>
              <ClassWrapperBody style={{ width: 430 }}>
                <ClassAttrForm attrType={selectedAttrType}>
                  <FormUpper>
                    <Icon src={iconClose} onClick={handleCloseAttrsInputForm} />
                  </FormUpper>
                  <FormSection>
                    <FormColumn>
                      <ClassLabel style={{ fontWeight: 800, marginBottom: 5 }}>
                        ?????????
                      </ClassLabel>
                      <ClassWrapperBodyInput
                        type={"text"}
                        onChange={handleChangeAttrName}
                        placeholder={"?????????"}
                        value={attrName}
                        style={{ width: "100%", border: 0 }}
                      />
                    </FormColumn>
                    <FormColumn>
                      <ClassLabel style={{ fontWeight: 800, marginBottom: 5 }}>
                        ????????????
                      </ClassLabel>
                      <Select
                        onChange={handleChangeSelect}
                        value={selectedAttrType}
                      >
                        <option value={"?????? ?????????"}>?????? ?????????</option>
                        <option value={"?????? ?????????"}>?????? ?????????</option>
                        <option value={"?????????"}>?????????</option>
                      </Select>
                    </FormColumn>
                  </FormSection>
                  {selectedAttrType !== ClassAttrType.custom && (
                    <FormSection>
                      <FormColumn style={{ width: "100%", marginRight: 0 }}>
                        <ClassLabel
                          style={{ fontWeight: 800, marginBottom: 5 }}
                        >
                          ?????????
                        </ClassLabel>
                        <ClassWrapperBodyInput
                          type={"text"}
                          onKeyDown={handleAttrValueEnter}
                          style={{ width: "100%", border: 0 }}
                          placeholder={"?????? ??? ?????? ??? Enter"}
                        />
                        <SelectedContainer>
                          {tempAttrInfo &&
                            tempAttrInfo.map((av, index) => (
                              <SelectedItem key={index}>
                                <ItemLabel>{av}</ItemLabel>
                                <Icon
                                  src={iconCircleClose}
                                  onClick={() => handleTempAttrDelete(av)}
                                />
                              </SelectedItem>
                            ))}
                          {currentSelectedAttr &&
                            getCurrentSelectedAttrValues() !== null &&
                            getCurrentSelectedAttrValues()!.attrValue &&
                            getCurrentSelectedAttrValues()!.attrValue!.length >
                              0 &&
                            getCurrentSelectedAttrValues()!.attrValue!.map(
                              (av, index) => (
                                <SelectedItem key={index}>
                                  <ItemLabel>{av}</ItemLabel>
                                  <Icon
                                    src={iconCircleClose}
                                    onClick={() => handleTempAttrDelete(av)}
                                  />
                                </SelectedItem>
                              )
                            )}
                        </SelectedContainer>
                      </FormColumn>
                    </FormSection>
                  )}
                  {selectedAttrType === ClassAttrType.multi && (
                    <FormSection>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>?????? ?????? ???</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"min"}
                          type={"number"}
                          onChange={handleChangeMinValue}
                          value={minValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"?????? ?????? ???"}
                        />
                      </FormColumn>
                      <FormColumn
                        style={{
                          flexDirection: "row",
                          alignItems: "center",
                          justifyContent: "space-between",
                        }}
                      >
                        <ClassLabel>?????? ?????? ???</ClassLabel>
                        <ClassWrapperBodyInput
                          name={"max"}
                          type={"number"}
                          onChange={handleChangeMaxValue}
                          value={maxValue}
                          style={{ border: 0, width: "50%" }}
                          placeholder={"?????? ?????? ???"}
                        />
                      </FormColumn>
                    </FormSection>
                  )}
                  {selectedAttrType === ClassAttrType.custom && (
                    <>
                      <FormSection>
                        <FormColumn
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <ClassLabel>?????? ???????????? ???</ClassLabel>
                          <ClassWrapperBodyInput
                            name={"min"}
                            type={"number"}
                            onChange={handleChangeCustomMinNumber}
                            value={customMinNumber}
                            style={{ border: 0, width: "50%" }}
                            placeholder={"?????? ????????????"}
                          />
                        </FormColumn>
                        <FormColumn
                          style={{
                            flexDirection: "row",
                            alignItems: "center",
                            justifyContent: "space-between",
                          }}
                        >
                          <ClassLabel>?????? ???????????? ???</ClassLabel>
                          <ClassWrapperBodyInput
                            name={"max"}
                            type={"number"}
                            onChange={handleChangeCustomMaxNumber}
                            value={customMaxNumber}
                            style={{ border: 0, width: "50%" }}
                            placeholder={"?????? ????????????"}
                          />
                        </FormColumn>
                      </FormSection>
                      {/* <FormSection>
                        <FormColumn
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <ClassLabel>?????? ???????????? ???</ClassLabel>
                          <ClassWrapperBodyInput
                            name={'min'}
                            type={'number'}
                            onChange={handleChangeCustomMinString}
                            value={customMinString}
                            style={{ border: 0, width: '50%' }}
                            placeholder={'?????? ????????????'}
                          />
                        </FormColumn>
                        <FormColumn
                          style={{
                            flexDirection: 'row',
                            alignItems: 'center',
                            justifyContent: 'space-between',
                          }}
                        >
                          <ClassLabel>?????? ???????????? ???</ClassLabel>
                          <ClassWrapperBodyInput
                            name={'max'}
                            type={'number'}
                            onChange={handleChangeCustomMaxString}
                            value={customMaxString}
                            style={{ border: 0, width: '50%' }}
                            placeholder={'?????? ????????????'}
                          />
                        </FormColumn>
                      </FormSection> */}
                    </>
                  )}
                </ClassAttrForm>
              </ClassWrapperBody>
              <SaveContainer>
                <SaveBtn onClick={handleSave}>??????</SaveBtn>
              </SaveContainer>
            </ClassWrapper>
          )}
        </>
      )}
    </ClassContainer>
  );
};

export default ClassGenerator;
