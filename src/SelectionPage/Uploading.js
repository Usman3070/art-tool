import React from "react";
import { ToastContainer, toast } from "react-toastify";
import { NavComponent } from "../EditingPage/Navbar";
import { NavHomePage } from "../ThreeDIntro.js/navigationBar";
import { Button } from "@material-ui/core";
import { TextField } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import "./style.css";
import { ImageDimension } from "../Webpages";
import { MyDropzone } from "./Dropzone";
import Footer from "../EditingPage/footer";
import axios from "axios";

export const Uploading = (Toast) => {
  const handleClick = () => {
    window.location.href = "/editing";
  };
  return (
    <div>
      <div className='form-group'>
        <ToastContainer
          position='top-right'
          autoClose={5000}
          hideProgressBar={false}
          newestOnTop={true}
          closeOnClick
          rtl={false}
          pauseOnFocusLoss
          draggable
          pauseOnHover
          progressClassName='toastProgress'
          bodyClassName='toastBody'
        />
      </div>

      <div className='area'>
        <div style={{ position: "relative", zIndex: 5 }}>
          <NavHomePage />
        </div>
        <div></div>
        <h1
          style={{
            fontFamily: "Muller-ExtraBold",
            color: "#fff",
            fontWeight: 800,
            fontSize: "40px",
          }}
        >
          Upload Files
        </h1>
        {/* <div style={{display:"flex", justifyContent:"center", color:"white", gap:"10px", marginBottom:"20px"}}>
          <div style={{display:"flex", alignItems:"center", gap:"10px"}}>
            <div style={{background:"#C615A9", width: '20px', height: '20px', display:"flex", justifyContent:"center", alignItems:"center"}}>
              <div style={{borderRadius:"50%", background:"white", width: '10px', height: '10px'}}>

              </div>
            </div>
            <p style={{fontfamily:"Poppins", fontSize:"17px"}}>In-Order</p>
          </div>
          <div style={{display:"flex", alignItems:"center", gap:"10px" }}>
          <div style={{border:"1px solid white", width: '20px', height: '20px', display:"flex", justifyContent:"center", alignItems:"center"}}>
              <div style={{borderRadius:"50%", background:"white", width: '10px', height: '10px'}}>

              </div>
            </div>
            <p style={{fontfamily:"Poppins", fontSize:"17px"}}>Shuffled</p>
          </div>
        </div> */}

        <p
          style={{
            display: "flex",
            justifyContent: "center",
            color: "white",
            fontWeight: 800,
            fontSize: "18px",
            fontFamily: "Muller-Light",
            fontWeight: 800,
            textTransform: "uppercase",
          }}
        >
          click below to upload your art files
        </p>
        <a
          className='download_link'
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "12px",
            fontWeight: "bold",
            color: "white",
            marginTop: "30px",
          }}
          href={`${process.env.REACT_APP_SERVERURL}/layers.zip`}
          download
          target='_blank'
        >
          Download Example Input Folder{" "}
          <HelpOutlineIcon style={{ fontSize: "14px", marginLeft: "3px" }} />
        </a>
        <div
          className='upload-file-main-div'
          style={{
            position: "relative",
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            // width: "40vw",
            // marginLeft: "30vw",
            // height: "50vh",
            // backgroundColor: "#1313133b",
            // marginTop: "10px",
            zIndex: 2,
            borderRadius: "5px",
            // padding: "30px",
          }}
        >
          <div
            style={{
              position: "absolute",
              top: "50%",
              transform: "translateY(-40%)",
            }}
          >
            <div
              style={{
                fontFamily: "poppins-light",
                fontSize: "17px",
                // display: "flex",
                justifyContent: "center",
                color: "white",
              }}
            >
              Drag ‘n’ drop files here.
            </div>

            <MyDropzone Toast={Toast} />
          </div>
        </div>

        {/* <div
          style={{
            // position:'absolute',
            // left:"50%",
            // transform:"translateX(-50%)" 
            justifyContent: "center",
            display: "flex",
            // marginTop: "50px",
            // paddingBottom: "10px",
          }}
        >
          <Button
            variant="contained"
            color="secondary"
           
            size="large"
            onClick={handleClick}
            style={{ zIndex: 2,  background:"linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)", }}
          >
            Continue
          </Button>
        </div> */}
        <div style={{ position: "fixed", width: "100%", bottom: "0" }}>
          <Footer />
        </div>
      </div>

      <ul className='circles'>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
        <li></li>
      </ul>
    </div>
  );
};
