import React, { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { CircularProgress } from "@material-ui/core";
import { IconButton } from "@material-ui/core";
import { PhotoCamera } from "@material-ui/icons";
import "react-toastify/dist/ReactToastify.css";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import img from "../assets/images/Frame.png";

export function MyDropzone() {
  const [loaded, setLoaded] = React.useState(0);
  const [Toast, setToast] = useState();

  const [error, setError] = useState("");

  const onDrop = useCallback((acceptedFiles) => {
    const formData = new FormData();
    const folderPath = [];
    const uuid = JSON.parse(sessionStorage.uuid);

    acceptedFiles &&
      acceptedFiles.forEach((file) => {
        let path = file.path.split("/")[1];
        formData.append(`${uuid}/${path}`, file);

        const fileAdd = { path: file.path, uuid: uuid };
        folderPath.push(fileAdd);
      });

    axios
      .post(`${process.env.REACT_APP_SERVERURL}/uploadPath`, folderPath)
      .then(function (response) {})
      .catch(function (error) {
        window.location.href = "/error";
      });
    if (acceptedFiles.length != 0) {
      axios
        .post(`${process.env.REACT_APP_SERVERURL}/uploadFiles`, formData, {
          onUploadProgress: (ProgressEvent) => {
            setLoaded((ProgressEvent.loaded / ProgressEvent.total) * 100);
          },
        })

        .then(function (response) {
          alert(`you are uploading a folder of ${acceptedFiles.length} images`);
          setToast(toast.success("uploaded successfully !"));
          // window.location.href = "/editing";
        })
        .catch(function (error) {
          toast.info(error);
          toast.info("Each File should be within 10Mb limit");
          toast.info("Supported Files: jpg, jpeg, png");
          toast.error("upload fail");
        });
    } else {
      setError("No valid files were submitted!");
      // alert("you are uploading zip file or an empty folder");
    }
  }, []);

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
    accept: "image/jpeg, image/png, image/jpg,",
  });

  return (
    <>
      <div style={{ zIndex: 2 }}>
        <div style={{ zIndex: 2 }} {...getRootProps()}>
          <input
            style={{ zIndex: 2 }}
            {...getInputProps()}
            directory=''
            webkitdirectory=''
            type='file'
          />

          {/* { isDragActive ? (
          <p style={{ zIndex: 2 }}>Drop the files here ...</p>
        ) : ( */}
          <IconButton
            color='primary'
            aria-label='upload picture'
            component='span'
            style={{
              zIndex: 2,
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
            }}
            size='medium'
          >
            {/* <PhotoCamera /> */}
            <img src={img} alt='' />
          </IconButton>
          {/* )} */}
        </div>
        <div
          style={{
            zIndex: 2,
            display: "flex",
            justifyContent: "center",
          }}
        >
          <CircularProgress variant='determinate' value={loaded} />
        </div>
        <p style={{ color: "red" }}>{error}</p>
      </div>
    </>
  );
}
