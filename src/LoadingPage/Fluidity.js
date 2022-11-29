import React, { Component } from "react";
import axios from "axios";
import { NavHomePage } from "../ThreeDIntro.js/navigationBar";
import { ToastContainer, toast } from "react-toastify";
import { Button, CircularProgress } from "@material-ui/core";

import "./style.css";
import { FinalModalComponent } from "./finalModal";
import Footer from "../EditingPage/footer";
export const Fluidity = () => {
  const [isLoading, setButtonLoading] = React.useState(true);
  const [loading, setLoading] = React.useState(false);
  const [isUploaded, setIsUploaded] = React.useState(false);
  const [finalModal, setFinalModal] = React.useState(false);

  const handleClickGenerate = async () => {
    const baseURL = `${process.env.REACT_APP_SERVERURL}/compress`;
    setLoading(true);
    const response = await axios
      .get(baseURL, {
        params: { uuid: JSON.parse(sessionStorage.uuid) },
      })
      .then(function (response) {
        setLoading(false);
        setButtonLoading(false);
        setIsUploaded(true);
        toast.success("Compresssion success");
      })
      .catch(function (error) {
        toast.info(error);
        toast.error("Compression fail");
      });
  };

  const handleClickDownload = () => {
    setLoading(true);
    axios.post(`${process.env.REACT_APP_SERVERURL}/deleteLocalFiles`, {
      uuid: JSON.parse(sessionStorage.uuid),
    });
    axios
      .get(`${process.env.REACT_APP_SERVERURL}/upload`, {
        params: { uuid: JSON.parse(sessionStorage.uuid) },
      })
      .then(function (response) {})
      .catch(function (error) {
        toast.info(error);
        toast.error("Download failed!! :(");
      });
  };

  React.useEffect(() => {
    if (isUploaded) {
      // axios({
      //   url: `randomS3URL${JSON.parse(
      //     sessionStorage.uuid
      //   )}.zip`, //your url
      //   method: "GET",
      //   responseType: "blob", // important
      // }).then((response) => {
      //   toast.success("Download Success!! :D");
      //   const url = window.URL.createObjectURL(new Blob([response.data]));
      //   const link = document.createElement("a");
      //   link.href = url;
      //   link.setAttribute("download", "YourAwesomeFile.zip"); //or any other extension
      //   document.body.appendChild(link);
      //   link.click();
      // });
      axios
        .get(`${process.env.REACT_APP_SERVERURL}/resolveFiles`, {
          params: { uuid: JSON.parse(sessionStorage.uuid) },
        })
        .then(function (response) {
          setFinalModal(true);
        })
        .catch(function (error) {
          window.location.href = "/final";
          toast.info(error);
          toast.error("Something went wrong!");
        });
    }
  }, [isUploaded]);

  const handleClose = () => {
    const data = {
      uuid: JSON.parse(sessionStorage.uuid),
    };
    axios.post(`${process.env.REACT_APP_SERVERURL}/deleteLocalFiles`, data);
    setFinalModal(false);
  };

  return (
    <div className='trans'>
      <div>
        <NavHomePage />
      </div>

      <div
        style={{
          // background: "#00000000",
          // paddingTop: "20vh",
          display: "flex",
          justifyContent: "center",
          marginBottom: "200px",
        }}
      >
        <div
          className='typewriter'
          style={{
            maxWidth: "71vw",
            maxHeight: "8vh",
            color: "white",
          }}
        >
          {/* <h2>Patience ... Awesome things on the way !&nbsp; </h2> */}
        </div>
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          // marginTop: "50px",
        }}
      >
        {!isUploaded ? (
          <Button
            style={{
              background:
                "linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)",
            }}
            variant='contained'
            color='secondary'
            size='large'
            onClick={handleClickGenerate}
            disabled={loading}
          >
            Generate
          </Button>
        ) : (
          <FinalModalComponent isOpen={finalModal} handleClose={handleClose} />
        )}
      </div>
      <div
        style={{ display: "flex", justifyContent: "center", marginTop: "2vh" }}
      >
        {loading && (
          <div className='spinner-box'>
            <div className='configure-border-1'>
              <div className='configure-core'></div>
            </div>
            <div className='configure-border-2'>
              <div className='configure-core'></div>
            </div>
          </div>
        )}
      </div>
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
        />
      </div>
      {/* <div>
        <FinalModalComponent isOpen={finalModal} handleClose={handleClose} />
      </div> */}
      <div style={{ position: "fixed", width: "100%", bottom: "0" }}>
        <Footer />
      </div>
    </div>
  );
};
