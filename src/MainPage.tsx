import React, { useState, useEffect, useCallback } from "react";
import "./MainPage.css"; // 스타일을 적용하기 위해 MainPage.css를 import 해주세요.
import axios from "axios";
import Modal from "react-modal";

import Lock from "./component/Lock";
import Folder from "./component/Folder";
import Photo from "./component/Photo";

const MainPage: React.FC = () => {

  const [data, setData] = useState<any>(null);
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;

  //VC VP 발급여부 
  const [vcIssued, setVcIssued] = useState(false);
  const [vpIssued, setVpIssued] = useState(false);
  // 모달 상태와 VC 데이터 상태를 추가합니다.
  const [isModalOpen, setIsModalOpen] = useState(false);
  // 모달 상태와 VP 데이터 상태를 추가합니다.
  const [isVPModalOpen, setIsVPModalOpen] = useState(false);

  const [vcData, setVcData] = useState<string | null>(null);
  const [vpData, setVpData] = useState<string | null>(null);
  // VP 체크박스 추가.
  const [selectedValues, setSelectedValues] = useState<string[]>([]);

  const checkboxes = [
    { value: 'userId', label: 'User ID' },
    { value: 'userName', label: 'User Name' },
    { value: 'userRegdate', label: 'User Registration Date' },
    { value: 'userPhoneno', label: 'User Phone Number' },
    { value: 'userStatus', label: 'User Status' },
  ];

  // 모달을 열고 닫는 함수를 정의합니다.
  const openModal = () => {
    setIsModalOpen(true);
  };

  const closeModal = () => {
    setIsModalOpen(false);
  };

  const openVPModal = () => {
    setSelectedValues([]); // 초기화
    setIsVPModalOpen(true);
  };

  const closeVPModal = () => {
    console.log("selectedValues :", selectedValues)
    setIsVPModalOpen(false);
  };


  const fetchData = async (forceUpdate = false) => {
    const storedData = sessionStorage.getItem("apiData");

    if (!storedData || forceUpdate) {
      try {
        const response = await fetch(`${backendApiUrl}/v1/toy/holder/folder`);
        const data = await response.json();
        setData(data);
        sessionStorage.setItem("apiData", JSON.stringify(data));
      } catch (error) {
        console.error(error);
      }
    } else {
      setData(JSON.parse(storedData));
    }
  };

  const handleCheckboxChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const { value, checked } = event.target;
    if (checked) {
      setSelectedValues([...selectedValues, value]);
    } else {
      setSelectedValues(selectedValues.filter((item) => item !== value));
    }
  };

  async function VPSign(userid: string) {
    try {
      const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
      if (vcData !== null) {
        console.log("userid :", userid)
        console.log("vcData :", vcData)
        console.log("JSON.stringify(vcData) :", JSON.stringify(vcData))
        const response = await axios.post(
          `${backendApiUrl}/v1/toy/holder/sign`,
          {
            userId: userid,
            // vcData를 그대로 보내고 backend에서 JsonElement로 받아서 처리 완료
            vc: vcData,
            claim: selectedValues
          }
        );

        const data = await response.data;
        console.log("VP 발급 성공");
        console.log(JSON.stringify(data.data));
        // 받은 VP 데이터를 상태에 저장하고 모달을 연다.
        setVpData(JSON.parse(data.data));
        closeVPModal();
        setVpIssued(true);
      }
      else {
        alert("VC를 발급받아주세요.")
      }
    } catch (e) {
    }
  }

  async function CreateVC(id: string) {
    try {
      const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
      const response = await axios.get(
        `${backendApiUrl}/v1/toy/issuer`,
        {
          params: {
            holderId: id
          }
        }
      );

      const data = await response.data;
      console.log("VC 발급 성공");
      console.log(JSON.stringify(data.data));
      // 받은 VC 데이터를 상태에 저장하고 모달을 연다.
      setVcData(data.data);

      openModal();
      setVcIssued(true);
    } catch (e) {
      //TODO Backend API 서버 동작안함 표시
      console.log(e)
    }
  }
  const handleClick = () => {
    fetchData(true);
  };

  useEffect(() => {
    fetchData();
  }, []);

  return (
    <div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
        <h1 className="main-title" onClick={handleClick}>
          Welcome to the Main Page!
        </h1>
        <h3> Login : {sessionStorage.getItem("LoginData")}</h3>
      </div>
      <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center', marginBottom: '1rem' }}>
        <div>
          <button
            onClick={() => {
              if (vcIssued) {
                openModal();
              } else {
                CreateVC("tmdrn457");
              }
            }}
            style={{
              color: vcIssued ? "blue" : "red",
            }}
          >
            {vcIssued ? "VC 발급 확인" : "VC 발급"}
          </button>
          <button onClick={() => { openVPModal() }} style={{ marginLeft: '1rem', color: vpIssued ? "blue" : "red", }}>{vpIssued ? "VP 발급 확인" : "VP 서명"}</button>
        </div>
        <div>
          VC :<span style={{ color: vcIssued ? 'blue' : 'red' }}> {vcIssued ? '발급, ' : '미발급, '}</span>
          VP : <span style={{ marginRight: '0.5rem', color: vpIssued ? 'blue' : 'red' }}>{vpIssued ? '발급' : '미발급'}</span>
        </div>
      </div>
      {data && (
        <div>
          {Object.entries<string[]>(data.data.Result).map(([folderName, photos]) => (
            <Folder key={folderName} folderName={folderName} photos={photos} vpData={vpData} />
          ))}
        </div>
      )}
      <Modal isOpen={isModalOpen} onRequestClose={closeModal} contentLabel="VC 데이터">
        <h2>VC 데이터</h2>
        <pre>{JSON.stringify(vcData, null, 2)}</pre>
        <button onClick={closeModal}>닫기</button>
      </Modal>
      <Modal isOpen={isVPModalOpen} onRequestClose={closeVPModal} contentLabel={vpIssued ? "VP 데이터" : "Checkbox Modal"}>
        <h2>{vpIssued ? "VP 데이터" : "항목 선택"}</h2>
        {vpIssued ? (
          <div>
            <pre>{JSON.stringify(vpData, null, 2)}</pre>
            <button onClick={closeVPModal}>닫기</button>
          </div>
        ) : (
          <div>
            {checkboxes.map((checkbox) => (
              <label key={checkbox.value}>
                <input
                  type="checkbox"
                  value={checkbox.value}
                  onChange={handleCheckboxChange}
                />
                {checkbox.label}
              </label>
            ))}
            <div className="center-content">
              <button onClick={async () => await VPSign("tmdrn457")}>VC 발급</button>
              <button onClick={closeVPModal}>닫기</button>
            </div>
          </div>
        )}
      </Modal>

    </div>

  );
}

export default MainPage;