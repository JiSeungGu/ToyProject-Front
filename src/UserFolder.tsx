import React, { useState, useEffect } from 'react';
import Typography from '@mui/material/Typography';
import filePng from "./file.png"
import "./UserFolder.css"; // 스타일을 적용하기 위해 UserFolder.css를 import 해주세요.
import FileUpload from "./component/FileUpload"; // 추가: FileUpload 컴포넌트를 가져옵니다.
import Button from '@mui/material/Button';
import SaveIcon from "@mui/icons-material/Save";
import FavoriteIcon from "@mui/icons-material/Favorite";
import IconButton  from "@mui/material/Button";
import axios from "axios";
async function fetchUserFiles() {
  const apiDataString = sessionStorage.getItem("apiData");
  const apiData = apiDataString ? JSON.parse(apiDataString) : null;

  if (apiData) {
    const loginData = sessionStorage.getItem("LoginData");
    const userFiles = apiData.data.Result[loginData ? loginData+"/" : ""];
    return userFiles.map((file: string) => "https://we.fufuanfox.com/" + file);
  } else {
    console.error("No apiData found in sessionStorage");
    return [];
  }
}

async function logTest(bucketFileName: string) {
  const backendApiUrl = process.env.REACT_APP_BACKEND_API_URL;
  const baseUrl = "https://we.fufuanfox.com/";
  const extractedString = bucketFileName.replace(baseUrl, "");
  // Split the string by '/'
  const parts = bucketFileName.split('/');
  const fileName = parts[1];  
  try {
    const response = await axios.get(`${backendApiUrl}/v1/toy/holder/Download`, {
      params: {
        fileName: extractedString,
      },
      responseType: 'blob',
    });
    
    // 파일 확장자 처리를 위한 변수를 설정합니다.
    const defaultExtension = "";
    const contentType = response.headers['content-type'];

    // content-type을 파일 확장자로 매핑하는 객체를 생성합니다.
    const contentTypeToFileExtensionMap: { [key: string]: string } = {
      'application/pdf': '.pdf',
      'application/vnd.ms-powerpoint': '.ppt',
      'application/vnd.openxmlformats-officedocument.presentationml.presentation': '.pptx',
      'application/vnd.ms-excel': '.xls',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet': '.xlsx',
      'image/jpeg': '.jpg',
      'image/png': '.png',
      'image/gif': '.gif',
      'image/svg+xml': '.svg',
      'image/webp': '.webp',
    };

    const knownExtension = contentTypeToFileExtensionMap[contentType] || "";

    // 파일 확장자를 처리합니다.
    let downloadFileName = fileName;
    if (!fileName.includes('.') && knownExtension) {
      downloadFileName += knownExtension;
    } else if (!fileName.includes('.')) {
      downloadFileName += defaultExtension;
    }
    const url = window.URL.createObjectURL(new Blob([response.data]));
    const link = document.createElement('a');
    link.href = url;
    link.setAttribute('download',extractedString);
    document.body.appendChild(link);
    link.click();
    link.remove();
  } catch (error) {
    console.error('File download error:', error);
  }
}
const UserFolder: React.FC = () => {
  const [images, setImages] = useState<string[]>([]);

  useEffect(() => {
    fetchUserFiles().then(setImages);
  }, []);

  return (
    <div className="authenticated-folder">
      <Typography component="h2" variant="h6" color="primary" gutterBottom>
        {sessionStorage.getItem("LoginData")}' 폴더.
      </Typography>
      <FileUpload /> {/* 추가: FileUpload 컴포넌트를 렌더링합니다. */}
      <div className="image-container">
        {images.map((src, index) => {
          const bucketFileName = src;
          // 이미지 확장자를 확인합니다.
          if (!/\.(png|jpg|jpeg)$/.test(src)) {
            src = filePng;
          } 
          return (
            <div key={index} className="image-cell">
              {/* <IconButton variant="contained" color="secondary" aria-label="favorite"> */}
            <IconButton  color="secondary" aria-label="favorite">
            <FavoriteIcon />
            </IconButton>
              <img src={src} alt={`User file ${index} ${bucketFileName}`} />
              <Button variant="outlined" color="secondary" size="small" startIcon={<SaveIcon />}
            onClick={() => logTest(bucketFileName)}
            // className="verifyButton"
>    
            다운로드
          </Button>
            </div>
          );
        })}
      </div>
    </div>
  );
}

export default UserFolder;