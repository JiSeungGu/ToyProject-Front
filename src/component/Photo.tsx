import React from "react";
import filePng from "../file.png"
// import empty from "../empty2.png";
interface PhotoProps {
  photoUrl: string;
}

const Photo: React.FC<PhotoProps> = ({ photoUrl }) => {
  // let imgSrc = photoUrl;
  // if (!/.(png|jpg|jpeg)$/.test(photoUrl)) {
  // imgSrc = filePng;
  // }
  // if (photoUrl === "" || photoUrl === null) {
    // imgSrc = empty;
  // }
  return (
    <div className="photo">
      <img src={photoUrl} alt="thumbnail" />
    </div>
  );
};

export default Photo;