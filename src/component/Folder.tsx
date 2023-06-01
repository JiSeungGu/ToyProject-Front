import React, { useState } from "react";
import axios from "axios";
import Photo from "./Photo";
import Lock from "./Lock";
import empty from "../empty2.png";
import filePng from "../file.png"
// import UserFolder from "../UserFolder";
import { useNavigate } from "react-router-dom";
interface FolderProps {
  folderName: string;
  photos: string[];
  vpData: string | null;
}

const Folder: React.FC<FolderProps> = ({ folderName, photos, vpData }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [folderLock, setFolderLock] = useState(false);
  const cleanFolderName = folderName.slice(0, -1);
  const navigate = useNavigate();
  const handleMouseEnter = () => {
    setIsHovered(true);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
  };

  const isFolderOwnedByUser = (folderName: string): boolean => {
    if (sessionStorage.getItem("LoginData")?.startsWith(folderName.slice(0, -1)) && folderLock) {
      return true;
    }
    return false;
  };

  async function Verify(vpData: string | null) {
    const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
    const holderid = sessionStorage.getItem("LoginData")
    console.log("Verify CALL()");
    console.log("vpData", vpData)
    try {
      const response = await axios.post(
        `${backendApiUrl}/v1/toy/relay/verify`,
        {
          holderid: holderid,
          vp: JSON.stringify(vpData)
        }
      );
      const data = await response.data;
      console.log("data :", data.data);
      setFolderLock(data.data);
      if (data.data) {
        alert("인증 성공\n" + sessionStorage.getItem("LoginData") + "의 폴더로 이동합니다.");
        navigate('../user-folder');
      }
    } catch (error) {
      console.error(error);
    }
  };

  return (
    <div className="folder" onMouseEnter={handleMouseEnter} onMouseLeave={handleMouseLeave}>
      <h3>{cleanFolderName}</h3>
      {isHovered && !isFolderOwnedByUser(cleanFolderName) && (
        <>
          <Lock message="이 폴더는 당신의 소유가 아닙니다." />
          <button
            onClick={() => Verify(vpData)}
            className="verifyButton">
            인증하기
          </button>
        </>
      )}
      <div className="photos">
        {photos.slice(0, 4).map((photo) => (
           <Photo key={photo} photoUrl={/.(png|jpg|jpeg)$/.test(photo) ? `https://we.fufuanfox.com/${photo}` : filePng} />
          // <Photo key={photo} photoUrl={`https://we.fufuanfox.com/${photo}`} />
        ))}        
        {photos.length < 4 &&
    Array(4 - photos.length)

          .fill(null)
          .map((_, index) => (
            <Photo key={`empty-${index}`} photoUrl={empty} />
          ))}
      </div>
    </div>
  );
};

export default Folder;