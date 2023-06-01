import React from "react";
import lockImage from '../lock.png';

interface LockProps {
  message: string;
}

const Lock: React.FC<LockProps> = ({ message }) => {
  return (
    <div className="lock">
      <span>{message}</span>
      <img src={lockImage} alt="lock" className="lock-image" />
    </div>
  );
};

export default Lock;