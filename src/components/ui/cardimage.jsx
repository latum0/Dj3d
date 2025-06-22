import React from "react";
import "./cardimage.css";
import loginImg from "../../assets/login.jpg"; 

export default function CardImage() {
  return (
    <div className="image-section animate-left">
      <img src={loginImg} alt="Login visual" />
    </div>
  );
}