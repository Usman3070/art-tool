import React, { useCallback, useState } from "react";
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
import { IconButton } from "@material-ui/core";
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

export const Page = (props) => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);

  const [value, setValue] = React.useState(0);

  const handleChange = (event, newValue) => {
    setValue(newValue);
  };
  // const { dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);
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

    //console.log(`width: ${width}, position: ${positionX} , ${positionY}`);
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
    console.log(sessionStorage.uuid, "sessionStorage.uuid");
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
      .then(function (response) {
        console.log(response);
      })
      .catch(function (error) {
        window.location.href = "/error";
        console.log(error);
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
    accept: "image/jpeg, image/png, image/jpg,",
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
        toast.success("Compression success");
        setDownload(true);
      })
      .catch(function (error) {
        toast.info(error);
        toast.error("Compression fail");
      });
  };
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
                setCanvasHeight={setCanvasHeight}
                setCanvasWidth={setCanvasWidth}
                openLoadingModal={openLoadingModal}
                closeLoadingModal={closeLoadingModal}
                generateBTN={generateBTN}
              />
            </div>
          </Grid>
          <Grid item xl={8} lg={8} md={8} sm={12} xs={12} className='uploadBG'>
            <Grid container spacing={2} sx={{ padding: "40px" }}>
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
                  sx={{ color: "#fff", fontSize: "26px", marginBottom: "1%" }}
                >
                  Traits
                </Typography>
                {show && (
                  <Card sx={{ minWidth: 275 }}>
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
                            <Button
                              variant='contained'
                              sx={{
                                fontSize: "12px",
                                width: "40%",
                                padding: "10px 20px",
                              }}
                              className='createBtn'
                            >
                              Select Folder
                            </Button>
                          </IconButton>
                          {/* )} */}
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
                        md: "-40%",
                        sm: "0%",
                        xs: "0%",
                      },
                      color: "#fff",
                      fontSize: "32px",
                      marginTop: { lg: "45%", md: "45%", sm: "0%", xs: "0%" },
                    }}
                  >
                    Art Preview
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
                      {generate && (
                        <Button
                          variant='contained'
                          sx={{
                            marginTop: "2%",
                            backgroundColor: "#111",
                            fontWeight: "600",
                            "&:hover": {
                              //you want this to be the same as the backgroundColor above
                              backgroundColor: "#111",
                            },
                          }}
                          onClick={handleClickGenerate}
                        >
                          Generate
                        </Button>
                      )}
                      {download && (
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
                      )}
                    </div>
                  </div>
                </Grid>
              )}
              {!props.folderStructure && (
                <Grid item xl={4} lg={4} md={4} sm={12} xs={12}>
                  <Typography
                    variant='h1'
                    sx={{
                      marginBottom: {
                        lg: "-45%",
                        md: "-45%",
                        sm: "0%",
                        xs: "0%",
                      },
                      color: "#fff",
                      fontSize: "32px",
                      marginTop: { lg: "45%", md: "45%", sm: "0%", xs: "0%" },
                    }}
                  >
                    Art Preview
                  </Typography>
                  <div id='content'>
                    <Typography
                      sx={{
                        height: "300px",
                        width: "300px",
                        backgroundColor: "#C5C5C5",
                        borderRadius: "10px",
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
