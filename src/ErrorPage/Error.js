import React from "react";
import error from "../assets/images/error.png";
import { NavHomePage } from "../ThreeDIntro.js/navigationBar";
import Button from "@material-ui/core/Button";
import ArrowBackIosIcon from "@material-ui/icons/ArrowBackIos";
import { useNavigate } from "react-router-dom";
export const Error = () => {
  const navigate = useNavigate();
  return (
    <div
      className='area'
      // style={{
      //   backgroundColor: "black",
      //   display: "flex",
      //   justifyContent: "center",
      //   padding:"150px"
      // }}
    >
      <NavHomePage />
      <Button
        onClick={() => navigate(-1)}
        style={{
          color: "white",
          fontSize: "20px",
          marginTop: "20px",
          marginLeft: "20px",
        }}
      >
        {" "}
        <ArrowBackIosIcon /> BACK
      </Button>
      <img
        width='500px'
        height='300px'
        style={{
          position: "absolute",
          top: "50%",
          left: "50%",
          transform: "translate(-50%, -50%)",
        }}
        src={error}
        alt='Error 404'
      />
    </div>
  );
};
