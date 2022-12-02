import React, { Component } from "react";
import { NavHomePage } from "./navigationBar";
import Footer from "../EditingPage/footer";
import "./style.css";
import data from "../traffic.json";
import { AboutModalComponent } from "./AboutModal";
import { ContactModalComponent } from "./ContactModal";
import { InstructionsModalComponent } from "./InstructionsModal";
import axios from "axios";
import { v4 as uuidv4 } from "uuid";

export const ThreeData = () => {
  const [openAbout, setAboutOpen] = React.useState(false);
  const [openContact, setContactOpen] = React.useState(false);
  const [openInstructions, setInstructionsOpen] = React.useState(false);

  const handleCloseAbout = () => {
    setAboutOpen(false);
  };
  const handleCloseContact = () => {
    setContactOpen(false);
  };
  const handleCloseInstructions = () => {
    setInstructionsOpen(false);
  };

  const handleClick = () => {
    const ID = { uuid: uuidv4() };
    sessionStorage.setItem("uuid", JSON.stringify(ID.uuid));

    axios.post(`${process.env.REACT_APP_SERVERURL}/saveID`, ID);

    window.location.href = "/editing";
  };
  return (
    <>
      <div className='landing-page-main-div'>
        {/* <div style={{background:"red"}}> */}
        <div>
          {/* <Navb/> */}
          <NavHomePage
          // setAboutOpen={setAboutOpen}
          // setContactOpen={setContactOpen}
          // setInstructionsOpen={setInstructionsOpen}
          />
        </div>

        {/* <div className="title" style={{ zIndex: 3, marginTop: "3vh" }}>
          <h3
            style={{
              zIndex: 3,
              fontFamily: "monospace",
              marginLeft: "80vw",
              backgroundColor: "#3d3d3d48",
              padding: "5px",
              borderRadius: "10px",
            }}
          >{`Total Users: ${data.TotalUsers}`}</h3>
          <h3
            style={{
              zIndex: 3,
              fontFamily: "monospace",
              marginLeft: "80vw",
              marginTop: "5px",
              backgroundColor: "#3d3d3d48",
              padding: "5px",
              borderRadius: "10px",
            }}
          >{`Total Items: ${data.TotalItems}`}</h3>
        </div> */}

        <div
          style={{
            zIndex: 3,
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
          }}
        >
          <p
            className='glitch'
            style={{
              zIndex: 3,
              marginTop: "18vh",
              color: "#000",
            }}
          >
            {/* <span aria-hidden="true">Sick Alien</span> */}
            whatsforlaunch
            {/* <span aria-hidden="true">Sick Alien</span> */}
          </p>
        </div>

        <div className='title' style={{ zIndex: 3 }}>
          <h3
            style={{
              zIndex: 3,
              fontFamily: "poppins-light",
              fontSize: "30px",
            }}
          >
            COLLECTION GENERATOR
          </h3>
        </div>

        <div
          style={{
            display: "flex",
            justifyContent: "center",
            marginBottom: "60px",
          }}
        >
          <button
            className='nice'
            style={{ zIndex: 3, fontFamily: "poppins-light", fontSize: "24px" }}
            onClick={handleClick}
          >
            Enter
          </button>
        </div>
        <div style={{ zIndex: 3, display: "flex", justifyContent: "center" }}>
          <p
            className='homepageContent'
            style={{
              // position:"absolute",
              // bottom:"5%",
              zIndex: 3,
              fontFamily: "poppins-light",
              fontWeight: "400",
              animation: "glow 2s ease-in-out infinite alternate",
            }}
          >
            Generating art just got a whole lot easier
          </p>
        </div>
        <div style={{ position: "fixed", width: "100%", bottom: "0" }}>
          <Footer />
        </div>

        {/* <img
          src={require("./Alien.png")}
          alt="AlienImage"
          className="imageBackground"
          style={{ zIndex: 2 }}
        /> */}
        {/* <div>
          <AboutModalComponent
            isOpen={openAbout}
            handleClose={handleCloseAbout}
          />
        </div>
        <div>
          <ContactModalComponent
            isOpen={openContact}
            handleClose={handleCloseContact}
          />
        </div>
        <div>
          <InstructionsModalComponent
            isOpen={openInstructions}
            handleClose={handleCloseInstructions}
          />
        </div> */}
        {/* </div> */}
      </div>
    </>
  );
};
