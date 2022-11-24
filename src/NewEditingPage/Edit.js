import {
  Accordion,
  AccordionDetails,
  AccordionSummary,
  Button,
  Card,
  CardContent,
  Container,
  Grid,
  List,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import React, { useEffect } from "react";
import { useCallback, useState } from "react";
import { useDropzone } from "react-dropzone";
import axios from "axios";
import { ToastContainer, toast } from "react-toastify";
import { IconButton } from "@material-ui/core";
import HelpOutlineIcon from "@material-ui/icons/HelpOutline";
import "react-toastify/dist/ReactToastify.css";
import { PhotoCamera } from "@material-ui/icons";
import { CircularProgress } from "@material-ui/core";
import { Folders } from "../EditingPage/BuildFolder";
import TreesTemp from "../EditingPage/FolderStructure";
import ExpandMoreIcon from "@mui/icons-material/ExpandMore";
import logo from "../assets//images/logo2.png";
import { EditingPage } from "../EditingPage/EditingPage";
const Edit = (props) => {
  const [show, setShow] = useState(false);

  const handleShow = () => {
    setShow(true);
  };
  const handleHide = () => {
    setShow(false);
  };

  const [loaded, setLoaded] = React.useState(0);
  const [Toast, setToast] = useState();
  const [foldersData, setFoldersData] = useState();
  const [uploadedFolder, setUploadedFolder] = useState(true);

  const [error, setError] = useState("");

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

    let imgurl = URL.createObjectURL(acceptedFiles[0]);

    console.log(acceptedFiles, "accepted");
    console.log(imgurl, "accepted");
    let firstIndex = acceptedFiles[0]?.path.lastIndexOf("/");
    let secondIndex = acceptedFiles[0]?.path.lastIndexOf("/", firstIndex - 1);
    var tempFolder = acceptedFiles[0]?.path?.slice(secondIndex + 1, firstIndex);
    var mainArray = [];
    var innerArray = [];
    var pathWithoutFileAndFolder = acceptedFiles[0]?.path?.slice(
      0,
      secondIndex
    );
    acceptedFiles.map((data) => {
      let lastSlash = data.path.lastIndexOf("/");
      let secondLastSlash = data.path.lastIndexOf("/", lastSlash - 1);

      let folderName = data.path.slice(secondLastSlash + 1, lastSlash);
      if (folderName === tempFolder) {
        innerArray.push(data.path.slice(lastSlash + 1));
      } else {
        mainArray.push({
          folder: tempFolder,
          files: innerArray,
          path: pathWithoutFileAndFolder,
        });
        innerArray = [];
        tempFolder = folderName;
        innerArray.push(data.path.slice(lastSlash + 1));
      }
    });
    setFoldersData(mainArray);
    axios
      .post(`${process.env.REACT_APP_SERVERURL}/uploadPath`, folderPath)
      .then(function (response) {
        console.log(response.config.data, "resp");
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
  console.log(foldersData, "dfghdgfdjjhj");
  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop: (acceptedFiles) => onDrop(acceptedFiles),
    accept: "image/jpeg, image/png, image/jpg,",
  });

  const handleUpload = () => {
    setUploadedFolder(!uploadedFolder);
    setFoldersData(null);
  };
  return (
    <div>
      <Grid
        container
        xl={12}
        lg={12}
        md={12}
        sx={{
          marginBottom: "5%",
          marginTop: "3%",
          display: "flex",
          justifyContent: "center",
        }}
      >
        <Grid item xl={4} lg={4} md={4}>
          <Button
            sx={{
              backgroundColor: "#fff",
              color: "#000",
              "&:hover": {
                //you want this to be the same as the backgroundColor above
                backgroundColor: "#fff",
              },
            }}
            variant='contained'
          >
            Help, I need a guide
          </Button>
          <Button
            sx={{
              backgroundColor: "#111",
              marginLeft: "2%",
              "&:hover": {
                //you want this to be the same as the backgroundColor above
                backgroundColor: "#111",
              },
            }}
            variant='contained'
          >
            <a
              href={`${process.env.REACT_APP_SERVERURL}/Silly_Sausages_4.zip`}
              download
              target='_blank'
              style={{ textDecoration: "none" }}
            >
              <Typography sx={{ color: "#fff" }}>Load an example</Typography>
            </a>
          </Button>
        </Grid>
        {/* <Grid item xl={4} lg={4} md={4}>
          <Button sx={{ backgroundColor: "#111" }} variant='contained'>
            Load an example
          </Button>
        </Grid> */}
      </Grid>
      <Container>
        <Grid container xl={12} lg={12} md={12} sm={12} xs={12} spacing={4}>
          <Grid item xl={4} lg={4} md={4} sm={6} xs={12}>
            <Typography variant='h4' sx={{ color: "#fff" }}>
              Parameters
            </Typography>
            <Card sx={{ minWidth: 275 }}>
              <CardContent>
                <Grid
                  container
                  xl={12}
                  lg={12}
                  md={12}
                  sm={12}
                  xs={12}
                  spacing={2}
                  sx={{ marginBottom: "2%" }}
                >
                  <Grid item xl={4} lg={4} md={4}>
                    <Typography>Supply</Typography>
                    <TextField
                      id='outlined-number'
                      type='number'
                      placeholder='100'
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4}>
                    <Typography>width (px)</Typography>
                    <TextField
                      id='outlined-number'
                      placeholder='400'
                      type='number'
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                  <Grid item xl={4} lg={4} md={4}>
                    <Typography>Height (px)</Typography>
                    <TextField
                      id='outlined-number'
                      placeholder='400'
                      type='number'
                      InputLabelProps={{
                        shrink: true,
                      }}
                    />
                  </Grid>
                </Grid>
                <Typography>Name prefix</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='Name'
                  sx={{ marginBottom: "2%", width: "97%" }}
                />
                <Typography>Symbol</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='Symbol'
                  sx={{ marginBottom: "2%", width: "97%" }}
                />
                <Typography>Royalty Percent</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='Royalty Percent'
                  sx={{ marginBottom: "2%", width: "97%" }}
                />
                <Typography>Royalty Wallet</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='Royalty Wallet'
                  sx={{ marginBottom: "2%", width: "97%" }}
                />
                <Typography>External Link</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='Website Link'
                  sx={{ marginBottom: "2%", width: "97%" }}
                />
                <Typography>Description</Typography>
                <TextField
                  fullWidth
                  id='fullWidth'
                  placeholder='description'
                  sx={{ marginBottom: "4%", width: "97%" }}
                />
                <Typography sx={{ marginBottom: "3%" }}>Creators</Typography>
                <Button variant='contained' sx={{ borderRadius: "15px" }}>
                  +
                </Button>
              </CardContent>
            </Card>
          </Grid>

          <Grid item xl={4} lg={4} md={4}>
            <Grid container xl={12} lg={12} md={12}>
              <Grid item xl={6} lg={6} md={6}>
                <Typography variant='h4' sx={{ color: "#fff" }}>
                  Traits
                </Typography>
              </Grid>
              <Grid item xl={6} lg={6} md={6}>
                <Button
                  variant='contained'
                  sx={{ fontSize: "12px", marginTop: "4%" }}
                >
                  Configure groups
                </Button>
              </Grid>
            </Grid>
            {show && (
              <Card sx={{ minWidth: 275 }}>
                <CardContent>
                  <Typography>Rarity %: 0/100</Typography>
                  <Typography>Name</Typography>
                  <TextField
                    fullWidth
                    id='fullWidth'
                    placeholder='eg. Background'
                    sx={{ marginBottom: "4%", width: "97%" }}
                  />
                </CardContent>
                <Grid container xl={12} lg={12} md={12}>
                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sx={{
                      display: "flex",
                      flexDirection: "column",
                    }}
                  >
                    <Button
                      variant='contained'
                      sx={{
                        borderRadius: "15px",
                        marginBottom: "4%",
                        width: "50%",
                      }}
                    >
                      +
                    </Button>
                    <Button
                      variant='contained'
                      sx={{
                        borderRadius: "15px",
                        // marginTop: "4%",
                        backgroundColor: "red",
                        width: "50%",
                        marginBottom: "4%",
                      }}
                      onClick={handleHide}
                    >
                      -
                    </Button>
                  </Grid>

                  <Grid
                    item
                    xl={6}
                    lg={6}
                    md={6}
                    sx={{
                      position: "relative",
                    }}
                  >
                    <div style={{ zIndex: 2 }}>
                      <div style={{ zIndex: 2 }} {...getRootProps()}>
                        <input
                          style={{ zIndex: 2 }}
                          {...getInputProps()}
                          directory=''
                          webkitdirectory=''
                          type='file'
                        />
                        <Button
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
                          <Button>Upload</Button>
                        </Button>
                        {/* )} */}
                      </div>
                      <div
                        style={{
                          zIndex: 2,
                          display: "flex",
                          justifyContent: "center",
                        }}
                      ></div>
                      <p style={{ color: "red" }}>{error}</p>
                    </div>
                  </Grid>
                </Grid>
              </Card>
            )}
            {foldersData && (
              <Paper
                style={{ maxHeight: 200, overflow: "auto", marginTop: "2%" }}
              >
                <List>
                  <Card sx={{ minWidth: 275, overflowY: "auto" }}>
                    <CardContent sx={{ overflowY: "auto" }}>
                      {foldersData &&
                        foldersData.map((data) => (
                          <Accordion>
                            <AccordionSummary
                              expandIcon={<ExpandMoreIcon />}
                              aria-controls='panel1a-content'
                              id='panel1a-header'
                            >
                              <Typography>{data.folder}</Typography>
                            </AccordionSummary>
                            {data?.files?.map((innerData) => (
                              <AccordionDetails>
                                <Grid
                                  container
                                  xl={12}
                                  lg={12}
                                  md={12}
                                  sm={12}
                                  xs={12}
                                >
                                  <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                                    <img
                                      // src={`../EditingPage/layers/${JSON.parse(
                                      //   sessionStorage.uuid
                                      // )}/${data.folder}/${innerData}`}
                                      src={logo}
                                    />
                                  </Grid>
                                  <Grid item xl={6} lg={6} md={6} sm={6} xs={6}>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#808080",
                                      }}
                                    >
                                      Name
                                    </Typography>
                                    <Typography sx={{ fontSize: "14px" }}>
                                      {innerData}
                                    </Typography>
                                  </Grid>
                                  <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
                                    <Typography
                                      sx={{
                                        fontSize: "12px",
                                        color: "#808080",
                                      }}
                                    >
                                      Rarity (%)
                                    </Typography>
                                    <TextField
                                      id='outlined-number'
                                      placeholder='eg.'
                                      type='number'
                                      InputLabelProps={{
                                        shrink: true,
                                      }}
                                    />
                                  </Grid>
                                </Grid>
                              </AccordionDetails>
                            ))}
                          </Accordion>
                        ))}
                    </CardContent>
                  </Card>
                  <Button
                    variant='contained'
                    sx={{
                      borderRadius: "15px",
                      marginTop: "4%",
                      backgroundColor: "red",
                      width: "25%",
                      // marginBottom: "4%",
                    }}
                    onClick={handleUpload}
                  >
                    -
                  </Button>
                </List>
              </Paper>
            )}
            <Button
              variant='contained'
              sx={{ borderRadius: "15px", marginTop: "4%" }}
              onClick={handleShow}
            >
              +
            </Button>
          </Grid>
          <Grid item xl={4} lg={4} md={4}></Grid>
        </Grid>
      </Container>
    </div>
  );
};

export default Edit;
