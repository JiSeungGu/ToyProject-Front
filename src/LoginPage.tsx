import { useState, useEffect, useRef } from 'react';
import { Routes, useNavigate } from "react-router-dom";
import Web3 from "web3";
import { AbiItem } from 'web3-utils';
import axios from "axios";
// import axios from "axios";
import './App.css';
// Replace this with the ABI of your deployed smart contract
import SmartContractABI from './SmartContractABI.json';
// import NewSmartContractABI from './NewSmartContractABI.json'
import Button from '@mui/material/Button';
const LoginPage: React.FC = () => {
  const COGNITO_LOGIN_URL =
  'https://pu-fox.auth.ap-northeast-2.amazoncognito.com/login?client_id=1trejf87hrnpijkv52ds2rg89h&response_type=code&scope=email+openid+phone&redirect_uri=http://localhost:9090/v1/toy/auth';

  const [provider, setProvider] = useState<any>(null);
  // const [signer, setSigner] = useState<any>(null);
  const [contract, setContract] = useState<any>(null);
  const [account, setAccount] = useState<any>(null);
  // 회원가입시 필요한 데이터 
  const userIdRef = useRef<HTMLInputElement>(null);
  const passwordRef = useRef<HTMLInputElement>(null);
  const [showModal, setShowModal] = useState(false);
  const userNameRef = useRef<HTMLInputElement>(null);
  const userPhoneNoRef = useRef<HTMLInputElement>(null);

  // 로그인시 필요한 데이터   // 로그인창 모델 
  const loginUserIdRef = useRef<HTMLInputElement>(null);
  const loginPasswordRef = useRef<HTMLInputElement>(null);
  const loginDidRef = useRef<HTMLInputElement>(null);
  const [showLoginModal, setShowLoginModal] = useState(false);

  // 로그인 성공시 화면 이동 
  const Navigate = useNavigate();

  const [data, setData] = useState(null);
  const [error, setError] = useState(null);

  const detectCurrentProvider = () => {
    let provider;
    if (window.ethereum) {
      provider = window.ethereum;
      console.log("window.ethereum에 연결되어있습니다.");
    } else if (window.web3) {
      provider = window.web3;
      console.log("window.web3 에 연결되어 있습니다.");
    } else {
      console.log("Non-Ethereum browser detected. You should consider trying MetaMask");
    }
    return provider;
  };

  // chinId check
  // function chainId () {
  //   const network=  window.ethereum.request({
  //   method: 'eth_chainId',
  // });
  // console.log('network',network.chainId);
  // }

  useEffect(() => {

    const init = async () => {

      const currentProvider = detectCurrentProvider();
      const web3 = new Web3(currentProvider)

      // 유저 정보
      const userAccount = await web3.eth.getAccounts();
      const userBlance = await web3.eth.getBalance(userAccount[0]);
      const account = userAccount[0];
      setAccount(account)
      const chainid = await web3.eth.getChainId();

      console.log("account :", account);
      console.log("balance :", userBlance);
      console.log("chainid :", chainid);
      // const NewcontractAddress = "0xC5888275e0a1ca13a26463318105957aa4d1feD7";
      const NewcontractAddress = "0x850EC3780CeDfdb116E38B009d0bf7a1ef1b8b38";

      // const contractABI = SmartContractABI as AbiItem[]; // Replace this with your contract ABI
      const Abi = SmartContractABI as AbiItem[];
      console.log("Abi", Abi)
      const contract = new web3.eth.Contract(Abi, NewcontractAddress);
      setContract(contract);
      console.log("contract :", contract);
      // setContract(contract);
    };
    init();
          
  }, [provider]);

  const interactWithContract = async (did: any, didDocument: any) => {
    if (!contract) {
      console.error("Contract is not loaded");
      return;
    }
    try {
      // Call the setDID method in the smart contract
      const setResult = await contract.methods.setDID(did, JSON.stringify(didDocument)).send({
        from: account,
        gas: 500000, // 가스 한도 설정 (예: 300,000 가스)
        gasPrice: 2 * 1e9, // 가스 가격 설정 (예: 2 Gwei)
      });
      console.log("Transaction result:", setResult);
      getSearchDidDocument(did)
    } catch (error) {
      console.error("Error interacting with the smart contract:", error);
    }
  };
  const getSearchDidDocument = async (did: any) => {
    console.log("DID 정보 ", did)
    if(!contract) {
      console.error("Contract is not loaded")
      return;
    }
    try{
      // Call the getDID method in the smart contract
      const getDidDocument = await contract.methods.getDID(did).call({
        from: account
      });
      console.log("DID Document:", getDidDocument);
    } catch (error) {
      console.error("Error interacting with the smart contract:", error);
    }
  }
  
  async function CallBackApiCreateDid(userid: string, password: string, username: string, userphoneno: string) {
    try {
      const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
      const response = await axios.post(
        `${backendApiUrl}/v1/toy/holder`,
        {
          userId: userid,
          userPasswd: password,
          userName: username,
          userPhoneNo: userphoneno,
        }
      );
      console.log(response);
      const data = await response.data;
      setData(data);

      // 조건문 실행
      if (response.data.data.Result !== "false해당 아이디는 이미 존재하는 아이디입니다.") {
        interactWithContract(response.data.data.Result.DID,response.data.data.Result.Document);
        console.log(response.data.data.Result.Document)
        console.log(response.data.data.Result.DID)
      }
    } catch (e) {
      console.log(e)
    }
  }
  // Backend API 호출 후 데데이이터 전전송 
  async function CallBackApiLogin(userid: string, password: string, did: string) {
    try {
      const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
      const response = await axios.get(
        `${backendApiUrl}/v1/toy/holder`,
        {
          params: {
            userDid: did,
            userId: userid,
            userPasswd: password
          }
        }
      );
      console.log(response);
      const data = await response.data;
      // 로그인 성공 시 /main 페이지로 이동
      if (data.data.Result === "SUCCESS") {
        sessionStorage.setItem("LoginData", userid);
        Navigate("/main");
      }
      setData(data);

    } catch (e) {
      //TODO Backend API 서버 동작안함 표시
      // sestData(data)
      console.log(e)
    }
  }

  //회원가입
  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (
      userIdRef.current && passwordRef.current && userNameRef.current && userPhoneNoRef.current
    ) {
      CallBackApiCreateDid(userIdRef.current.value, passwordRef.current.value, userNameRef.current.value, userPhoneNoRef.current.value)
    } else {
      console.log("One or more reference values are null");
    }
    setShowModal(false);
  };

  const openModal = () => {
    setShowModal(true);
  };

  const closeModal = () => {
    setShowModal(false);
  };
  const openLoginModal = () => {
    setShowLoginModal(true);
  };

  const closeLoginModal = () => {
    setShowLoginModal(false);
  };
  const handleLoginClick = () => {
    window.location.href = COGNITO_LOGIN_URL;
  };
  //로그인
  const handleLoginSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    if (loginUserIdRef.current && loginPasswordRef.current && loginDidRef.current) {
      console.log("loginUserIdRef.current", loginUserIdRef.current.value);
      console.log("loginPasswordRef.current", loginPasswordRef.current.value);
      console.log("loginDidRef.current", loginDidRef.current.value);

      // 여기서 백엔드 API를 호출하십시오.
      CallBackApiLogin(loginUserIdRef.current.value, loginPasswordRef.current.value, loginDidRef.current.value)

    } else {
      console.log("One or more login reference values are null");
    }
    setShowLoginModal(false);
  };
  
  return (
    <div className="app-container">
      <Button onClick={openModal}>회원가입</Button>
      {showModal && (
        <div onClick={closeModal} className="modal-background">
          <div onClick={(event) => event.stopPropagation()} className="modal-container">

            <form onSubmit={handleSubmit}>
              <div className="input-group">
                <label htmlFor="userid">ID:</label>
                <input id="userId" type="text" ref={userIdRef} />
              </div>
              <div className="input-group">
                <label htmlFor="password">Password:</label>
                <input id="password" type="password" ref={passwordRef} />
              </div>
              <div className="input-group">
                <label htmlFor="username">Name:</label>
                <input id="userName" type="text" ref={userNameRef} />
              </div>
              <div className="input-group">
                <label htmlFor="userphoneno">Phone No:</label>
                <input id="userPhoneNo" type="text" ref={userPhoneNoRef} />
              </div>
              <button type="submit">제출</button>
            </form>
          </div>
        </div>
      )}
      {error && <p>Error: {error}</p>}
      {!error && data && (
        <div className="center-content">
          {/* <h2>Data from API:</h2> */}
          <div className="api-data-container">
            <pre>{JSON.stringify(data, null, 2)}</pre>

          </div>
        </div>
      )}
      {/* <h1>Contract</h1>     <button onClick={testContract}>Contract Call</button>  */}
      <Button variant="contained" onClick={openLoginModal}>로그인</Button>
      {showLoginModal && (
        <div onClick={closeLoginModal} className="modal-background">
          <div onClick={(event) => event.stopPropagation()} className="modal-container">
            <form onSubmit={handleLoginSubmit}>
              <div className="input-group">
                <label htmlFor="loginUserId">ID:</label>
                <input id="loginUserId" type="text" ref={loginUserIdRef} />
              </div>
              <div className="input-group">
                <label htmlFor="loginPassword">Password:</label>
                <input id="loginPassword" type="password" ref={loginPasswordRef} />
              </div>
              <div style={{ textAlign: "center", color: "red" }}>
                Or
              </div>
              <div className="input-group">
                <label htmlFor="loginDid">DID:</label>
                <input id="loginDid" type="text" ref={loginDidRef} />
              </div>
              <button type="submit">로그인</button>
            </form>
          </div>
        </div>
      )}
      <Button variant="contained" onClick={handleLoginClick}>Cognito 로그인</Button>
      <br></br>
      <a id="kakao-login-btn" href="javascript:loginWithKakao()">
      <img src="https://k.kakaocdn.net/14/dn/btroDszwNrM/I6efHub1SN5KCJqLm1Ovx1/o.jpg" width="272" alt="Kakao Login Button!" />
      </a>
      <br></br>
      <button id="apple-sign" > Sign in with Apple</button>
      <br></br>
      <button id="apple-sign" >'G' Sign in with Google</button>


    </div>
    
  );
};

export default LoginPage;