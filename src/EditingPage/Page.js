import React, { useCallback, useEffect, useState } from "react";
import Slider from "@material-ui/core/Slider";
import { Editor } from "./Editor";
import { Items } from "./Items";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import Hidden from "@material-ui/core/Hidden";
import { EditorInput } from "./EditorInput";
import TreesTemp from "./FolderStructure";
import InputBase from "@material-ui/core/InputBase";
import "./Page.css";
import { ModalComponent } from "./Modal";
import { LoadingModalComponent } from "./loadingModal";
import axios from "axios";
import { RarityModalComponent } from "./RarityModal";
import TotalCopies from "./totalCopies";
import { useDropzone } from "react-dropzone";
import { IconButton, Tooltip } from "@material-ui/core";
import { ToastContainer, toast } from "react-toastify";
import {
  Button,
  Card,
  CardActions,
  CardContent,
  Container,
  Grid,
  TextField,
  Typography,
} from "@mui/material";
import Edit from "../NewEditingPage/Edit";
import { NavHomePage } from "../ThreeDIntro.js/navigationBar";
import { MyDropzone } from "../SelectionPage/Dropzone";
import { Uploading } from "../SelectionPage/Uploading";
import { Icon } from "@iconify/react";

export const Page = (props) => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const { dispatch1 } = React.useContext(ObjectContext);
  const {
    selection,
    dispatch2,
    triggerMethod,
    downloadBtn,
    downloadHandle,
    shareState,
  } = React.useContext(ObjectSelection);
  const { dispatch3 } = React.useContext(NumberOfCopies);
  const [totalCopies, setTotalCopies] = React.useState({ value: 0 });
  const [open, setOpen] = React.useState(false);
  const [rarityOpen, setRarityOpen] = React.useState(false);
  const [loadingModal, setLoadingModal] = React.useState(false);
  const [coord, setCoor] = React.useState({ x: 0, y: 0 });
  const [canvasHeight, setCanvasHeight] = React.useState({
    value: 300,
  });
  const [canvasWidth, setCanvasWidth] = React.useState({
    value: 300,
  });
  const [loaded, setLoaded] = React.useState(0);
  const [Toast, setToast] = useState();
  const [error, setError] = useState("");
  const [show, setShow] = useState(true);
  const [download, setDownload] = useState(false);
  const [generate, setGenerate] = useState(false);
  const [showGenerate, setShowGenerate] = useState(true);
  const [number, setNumber] = useState({ index: 0, array: [[]] });
  const setCurrentElement = (val) => {
    dispatch2({
      type: "update",
      name: val,
    });
  };

  var parentRef = React.useRef(null);

  const handleMouseOver = (e) => {
    const parent = parentRef.current.getBoundingClientRect();
    const rect = e.target.getBoundingClientRect();

    const width = rect.width;
    const positionX = rect.left - parent.left;
    const positionY = rect.top - parent.top;

    const values = { x: positionX, y: positionY };

    return values;
  };

  const setCoord = (event, file) => {
    const curr_Coor = handleMouseOver(event);

    dispatch2({
      type: "update",
      name: `${file.name}`,
    });
    dispatch1({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "x",
      currentSlide: curr_Coor.x,
    });
    dispatch1({
      type: "update",
      nameToFind: selection.name,
      valueToChange: "y",
      currentSlide: curr_Coor.y,
    });

    setCoor({ x: curr_Coor.x, y: curr_Coor.y });
  };

  const editValues = (input1, input2, input4) => {
    if (input1.value) {
      dispatch1({
        type: "update",
        nameToFind: selection.name,
        valueToChange: input1.name,
        currentSlide: input1.value,
      });
    }

    if (input2.value) {
      dispatch1({
        type: "update",
        nameToFind: selection.name,
        valueToChange: input2.name,
        currentSlide: input2.value,
      });
    }

    if (input4.value) {
      dispatch3({
        type: "update",
        value: input4.value,
      });

      setTotalCopies({ value: input4.value });
    }
  };

  const handleOpen = () => {
    setOpen(true);
  };

  const handleRarityOpen = () => {
    setRarityOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  const handleRarityClose = () => {
    setRarityOpen(false);
  };

  const openLoadingModal = () => {
    setLoadingModal(true);
  };

  const closeLoadingModal = () => {
    setLoadingModal(false);
  };
  const generateBTN = () => {
    setGenerate(true);
  };

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
          window.location.href = "/editing";
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
    // accept: "image/jpeg, image/png, image/jpg,",
  });

  const handleHide = () => {
    setShow(false);
  };

  const handleShow = () => {
    setShow(true);
  };
  const handleClickGenerate = async () => {
    const baseURL = `${process.env.REACT_APP_SERVERURL}/compress`;

    const response = await axios
      .get(baseURL, {
        params: { uuid: JSON.parse(sessionStorage.uuid) },
      })
      .then(function (response) {
        toast.success("Download success");
        setDownload(true);
      })
      .catch(function (error) {
        toast.info(error);
        toast.error("Download fail");
      });
    setGenerate(false);
    downloadHandle(true);
  };

  const handleGenerate = () => {
    if (shareState === false) {
      alert("Share value should be 100");
    } else {
      triggerMethod(true);
    }
  };

  useEffect(() => {}, []);

  return (
    <div>
      <NavHomePage />
      <Typography sx={{ paddingLeft: "7%", paddingRight: "7%" }}>
        <Edit />
        <Grid container spacing={2}>
          <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
            <div style={{ marginRight: "2%" }}>
              <ModalComponent
                isOpen={open}
                // handleClose={handleClose}
                rarityData={number}
                setCanvasHeight={setCanvasHeight}
                setCanvasWidth={setCanvasWidth}
                openLoadingModal={openLoadingModal}
                closeLoadingModal={closeLoadingModal}
                generateBTN={generateBTN}
              />
            </div>
          </Grid>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12} className='uploadBG'>
            <Grid container spacing={6}>
              <Grid
                item
                xl={6}
                lg={6}
                md={6}
                sm={12}
                xs={12}
                // sx={{ marginLeft: "2%" }}
              >
                <Typography
                  sx={{
                    color: "#fff",
                    fontSize: "26px",
                    marginBottom: "1%",
                    paddingTop: "40px",
                  }}
                >
                  Traits
                </Typography>
                {show && (
                  <Card sx={{ width: "470px" }}>
                    <CardContent>
                      {number?.array?.map((outer, i) => {
                        if (number.index === i) {
                          var num = 0;
                          outer?.map((inner) => {
                            num += inner;
                          });
                          if (num > 100) {
                            return (
                              <Typography>
                                Rarity %:{" "}
                                <span style={{ color: "red" }}>{num}</span>
                                /100
                              </Typography>
                            );
                          } else {
                            return (
                              <Typography sx={{ color: "#fff" }}>
                                Rarity %: {num}/100
                              </Typography>
                            );
                          }
                        }
                      })}
                      {/* <Typography>Name</Typography> */}
                      {/* <TextField
                    fullWidth
                    variant='outlined'
                    placeholder='name'
                    name='name'
                  /> */}
                    </CardContent>
                    <CardActions>
                      {/* <button
                    variant='contained'
                    style={{
                      backgroundColor: "red",
                      width: "10%",
                      borderRadius: "8px",
                      color: "#fff",
                      border: "none",
                    }}
                    onClick={handleHide}
                  >
                    <Typography sx={{ fontSize: "20px" }}>-</Typography>
                  </button> */}
                      {!props.folderStructure && (
                        <div
                          style={{ zIndex: 2, width: "100%" }}
                          {...getRootProps()}
                        >
                          <input
                            type='file'
                            webkitdirectory=''
                            directory=''
                            mozdirectory=''
                            msdirectory=''
                            odirectory=''
                            multiple=''
                            {...getInputProps()}
                          />

                          {isDragActive ? (
                            <p style={{ zIndex: 2 }}>Drop the files here ...</p>
                          ) : (
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
                              <Button
                                variant='contained'
                                sx={{
                                  fontSize: "12px",
                                  width: { lg: "60%", md: "50%", sm: "60%" },
                                  padding: "10px 20px",
                                  marginRight: "20%",
                                }}
                                className='createBtn'
                              >
                                Select Folder
                              </Button>
                            </IconButton>
                          )}
                        </div>
                      )}
                    </CardActions>
                  </Card>
                )}
                <TreesTemp
                  flag={props.flag}
                  setFlag={props.setFlag}
                  folderData={props.folderStructure}
                  setNumber={setNumber}
                  number={number}
                />
                {/* <Button
              variant='contained'
              sx={{ marginTop: "2%", borderRadius: "18px", marginLeft: "2%" }}
              onClick={handleShow}
            >
              +
            </Button> */}
              </Grid>

              {props.folderStructure && (
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <Typography
                    variant='h1'
                    sx={{
                      marginBottom: {
                        lg: "-40%",
                        md: "-45%",
                        sm: "0%",
                        xs: "0%",
                      },
                      color: "#fff",
                      fontSize: "26px",
                      // marginLeft: "40%",
                      marginTop: { lg: "45%", md: "45%", sm: "0%", xs: "0%" },
                    }}
                    className='art-preview'
                  >
                    Art Previews
                  </Typography>
                  <div id='content'>
                    <div style={{ display: "flex", flexDirection: "column" }}>
                      <Items
                        onClick={setCurrentElement}
                        files={props.folderStructure}
                        hashedFolder={props.hashedElements}
                        imageHeight={canvasHeight.value}
                        imageWidth={canvasWidth.value}
                        setCoord={setCoord}
                        parent={parentRef}
                      />
                      {/* {generate && ( */}
                      <a
                        style={{
                          // display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          fontSize: "30px",
                          fontWeight: "bold",
                          width: "100%",
                          // marginLeft: "27%",
                        }}
                        href={`${process.env.REACT_APP_SERVERURL}/${JSON.parse(
                          sessionStorage.uuid
                        )}.zip`}
                        target='_blank'
                        download
                      >
                        <Button
                          variant='contained'
                          sx={{
                            marginTop: "2%",

                            backgroundColor: "#111",
                            fontWeight: "600",
                            marginBottom: "4px",
                            padding: "10px",
                            width: "100%",
                            "&:hover": {
                              //you want this to be the same as the backgroundColor above
                              backgroundColor: "#111",
                            },
                          }}
                          onClick={handleClickGenerate}
                          className='createBtn'
                        >
                          Download
                        </Button>
                      </a>
                      {/* )} */}
                      <Button
                        variant='contained'
                        sx={{
                          marginTop: "2%",
                          backgroundColor: "#111",
                          fontWeight: "600",
                          marginBottom: "4px",
                          padding: "10px",
                          width: "100%",
                          "&:hover": {
                            //you want this to be the same as the backgroundColor above
                            backgroundColor: "#111",
                          },
                        }}
                        onClick={handleGenerate}
                        className='createBtn'
                      >
                        Generate
                      </Button>

                      {/* {download && (
                        <a
                          style={{
                            display: "flex",
                            justifyContent: "center",
                            alignItems: "center",
                            fontSize: "30px",
                            fontWeight: "bold",
                          }}
                          href={`${
                            process.env.REACT_APP_SERVERURL
                          }/${JSON.parse(sessionStorage.uuid)}.zip`}
                          target='_blank'
                          download
                        >
                          <Button
                            style={{
                              background:
                                "linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)",
                              padding: "15px 60px",
                              fontFamily: "poppins-light",
                              width: "100%",
                            }}
                            onClick={null}
                            variant='contained'
                            color='primary'
                            size='large'
                            // className={classes.button}
                            // startIcon={<SaveIcon />}
                          >
                            DOWNLOAD
                          </Button>
                        </a>
                      )} */}
                    </div>
                  </div>
                </Grid>
              )}
              {!props.folderStructure && (
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <div className='preview-before'>
                    <div style={{ display: "flex" }}>
                      <Typography
                        variant='h1'
                        sx={{
                          // marginBottom: {
                          //   lg: "-20%",
                          //   md: "-10%",
                          //   sm: "0%",
                          //   xs: "0%",
                          // },
                          color: "#fff",
                          fontSize: "32px",
                          // marginLeft: "-10%",
                          marginTop: {
                            lg: "45%",
                            md: "45%",
                            sm: "0%",
                            xs: "0%",
                          },
                        }}
                      >
                        Preview
                      </Typography>
                      {/* <Icon icon='carbon:information' className='clock-icon' /> */}
                    </div>
                    <div
                      style={{
                        height: "200px",
                        width: "300px",
                        background:
                          "linear-gradient(45deg, #4E39D7 14.47%, #C615A9 123.62%)",
                        borderRadius: "5px 5px 0px 0px",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "600",
                          color: "#fff",
                          display: "flex",
                          justifyContent: "center",
                          alignItems: "center",
                          height: "100%",
                        }}
                      >
                        Rooster ART
                      </Typography>
                    </div>
                    <div
                      style={{
                        height: "200px",
                        width: "300px",
                        background: "#44327E",
                        borderRadius: "0px 0px 5px 5px",
                        padding: "20px",
                      }}
                    >
                      <Typography
                        style={{
                          fontWeight: "600",
                          color: "#fff",
                        }}
                      >
                        NFT #
                      </Typography>
                      <Typography
                        style={{
                          color: "#B8B8B8",
                          marginTop: "5%",
                          fontSize: "15px",
                        }}
                      >
                        Generated and deployed on What's For Launch
                      </Typography>
                    </div>

                    {/* <div id='content' style={{ width: "500px" }}>
                      <Typography
                        sx={{
                          height: "300px",
                          width: "300px",
                          backgroundColor: "#C5C5C5",
                          borderRadius: "10px",
                          marginLeft: "-20%",
                        }}
                      >
                        <Typography
                          sx={{
                            display: "flex",
                            marginTop: "50%",
                            justifyContent: "center",
                          }}
                        >
                          Generation Will appear here
                        </Typography>
                      </Typography>
                    </div> */}
                  </div>
                </Grid>
              )}
            </Grid>
          </Grid>
        </Grid>
      </Typography>
      <div>
        <LoadingModalComponent isOpen={loadingModal} />
      </div>

      {/*</div>
        </div>
      </div> */}
    </div>
  );
};
