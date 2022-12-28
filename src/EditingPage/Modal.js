import * as React from "react";

import {
  Card,
  CardContent,
  Fade,
  InputBase,
  List,
  Paper,
  TextField,
  Tooltip,
} from "@material-ui/core";
import { NumberOfCopies, ObjectContext, TreeContext } from "./EditingPage";
import { ToastContainer, toast } from "react-toastify";
import AddIcon from "@material-ui/icons/Add";
import { Box } from "@material-ui/core";
import axios from "axios";
import { useFormik } from "formik";
import { signUpSchema } from "../schemas";
import TotalCopies from "./totalCopies";
import { EditorInput } from "./EditorInput";
import { ObjectSelection } from "./EditingPage";
import { Grid, Typography, Button } from "@mui/material";
import RemoveIcon from "@mui/icons-material/Remove";
import { Percent } from "@mui/icons-material";

const initialValues = {
  name: "",
  symbol: "",
  royaltyPercent: "",
  userWithShare: [{ address: "", share: 0 }],
  external: "",
  description: "",
  collection: "",
};
export const ModalComponent = (props) => {
  const {
    selection,
    dispatch2,
    trigger,
    downloadHandle,
    shareState,
    setShareState,
    shareStateMethod,
    rarityCheckMethod,
    triggerMethod
  } = React.useContext(ObjectSelection);
  const { dispatch3 } = React.useContext(NumberOfCopies);

  const { dispatch1 } = React.useContext(ObjectContext);

  const [coord, setCoor] = React.useState({ x: 0, y: 0 });

  const [totalCopies, setTotalCopies] = React.useState({ value: 0 });

  const { objects } = React.useContext(ObjectContext);
  const { total } = React.useContext(NumberOfCopies);
  const { fileData } = React.useContext(TreeContext);
  const [name, setName] = React.useState("");
  const [symbol, setSymbol] = React.useState("");
  const [sellerFee, setSellerFee] = React.useState("");
  const [inputFields, setInputFields] = React.useState([
    { address: "", share: 0 },
  ]);
  const [creators, setCreators] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [URL, setURL] = React.useState("");
  const [next, setNext] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [creatorError, setCreatorError] = React.useState(false);
  const [shareError, setShareError] = React.useState(false);
  const [rarityNumber, setRarityNumber] = React.useState(0);
  const [share, setShare] = React.useState(0);

  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values) => {
        handleClick();
        // if (props.closeLoadingModal) {
        //   handleClickGenerate();
        // }
        // if (share > 100) {
        //   alert("hello world");
        // } else if (share < 100) {
        //   alert("good bye world");
        // } else {

        // }
      },
    });
  React.useEffect(() => {
    if (trigger) {
      handleSubmit();
    }
  }, [trigger]);
  
  const handleClick = async () => {
    downloadHandle(false);

    //check is rarity set
    if (fileData?.children?.length !== props?.rarityData?.array?.length) {
      alert("You must set the rarity for all layers of all category"); triggerMethod(false)
      
      return;
    }
    props?.rarityData?.array?.map((outerData) => {
      var sum = 0;
      outerData?.map((innerData) => {
        sum += innerData;
        downloadHandle(false);
      });
      if (sum < 100) {
        alert("Rarity must be equal to 100 for each category");triggerMethod(false)
        return;
      }
    });

    //
    const data = {
      objects: objects,
      total: total,
      sellerFee,
      royaltyFee: values.royaltyPercent,
      symbol: values.symbol,
      creators: inputFields,
      uuid: JSON.parse(sessionStorage.uuid),
      canvasHeight: 300,
      canvasWidth: 300,
      folderTree: fileData,
      name: values.name,
      description: values.description,
      URL: values.external,
      collection: values.collection,
    };
    props.openLoadingModal();
    await axios
      .post(`${process.env.REACT_APP_SERVERURL}/submitDetails`, data)
      .then(function (response) {
        // window.location.href = "/loading";
        props.closeLoadingModal();
        props.generateBTN();
      })
      .then(async () => {
        const baseURL = `${process.env.REACT_APP_SERVERURL}/compress`;

        const response = await axios
          .get(baseURL, {
            params: { uuid: JSON.parse(sessionStorage.uuid) },
          })
          .then(function (response) {
            toast.success("Download success");
            // setDownload(true);
          })
          .catch(function (error) {
            toast.info(error);
            toast.error("Download fail");
          });
      })
      .catch(function (error) {
        alert(error);
        window.location.href = "/error";
      });
  };
  const handleFormSubmit = async () => {
    const data = {
      hash: code,
      totalCopies: total,
      name: name,
    };
    setNext(true);
  };

  const handleModalClose = () => {
    setNext(false);
    props.handleClose();
  };

  const addFields = (e) => {
    e.preventDefault();
    if (inputFields.length > 3) {
      alert("Max Royalties should be 4");
    } else {
      let newfield = { address: "", share: 0 };
      setInputFields([...inputFields, newfield]);
    }
  };

  // for share validation
  // const handleShare = () =>{
  //   let Percent = 0;
  //   inputFields.forEach((item) => {
  //     Percent = Percent + parseFloat(item.share);
  //   });
  //   if(parseFloat(Percent)>100){
  //     return alert("Share value should be 100")
  //   }
  // }
  // React.useEffect(() => {
  //   setShare(Percent);
  // }, [Percent]);

  const removeFields = (e) => {
    let tempData = [...inputFields];
    e.preventDefault();
    tempData.splice(tempData?.length - 1, 1);
    setInputFields(tempData);
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
    console.log(event.target.value, "value");
    if (event.target.name == "address") {
      if (event.target.value.length == 44) {
        setCreatorError(false);
      } else {
        setCreatorError(true);
      }
    }

    if (event.target.name == "share") {
      if (event.target.value > 100) {
        // setShareError(true);
        return alert("Share value should be 100");
      } else if (event.target.value < 100) {
        // setShareError(false);
        return alert("Share value should be 100");
      } else {
        shareStateMethod(true);
      }
    }
  };
  // Rarity Section
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

  // const handleClickGenerate = async () => {
  //   const baseURL = `${process.env.REACT_APP_SERVERURL}/compress`;

  //   const response = await axios
  //     .get(baseURL, {
  //       params: { uuid: JSON.parse(sessionStorage.uuid) },
  //     })
  //     .then(function (response) {
  //       toast.success("Compresssion success");
  //     })
  //     .catch(function (error) {
  //       toast.info(error);
  //       toast.error("Compression fail");
  //     });
  // };
  // const handleShare = () =>{
  //   let Percent = 0;
  //   inputFields.forEach((item) => {
  //     Percent = Percent + parseFloat(item.share);
  //   });
  //   console.log(parseFloat(Percent), "shares holh");
  // }
  return (
    <div className='modalForm'>
      <Box>
        <div style={{ paddingTop: "17%" }}>
          <Paper style={{ maxHeight: 770, overflow: "auto" }}>
            <List>
              <div
                style={{
                  fontWeight: "500",
                  fontSize: "22px",
                  // fontFamily: "Muller-ExtraBold",
                  marginBottom: "-8%",
                  color: "white",
                  padding: "10px",
                }}
              >
                <Typography variant='h5'>Parameters</Typography>
              </div>

              {/* <Card> */}
              {/* <CardContent> */}
              <div style={{ padding: "10px" }}>
                <form onSubmit={handleSubmit}>
                  <Grid
                    container
                    xl={12}
                    lg={12}
                    md={12}
                    sm={12}
                    xs={12}
                    spacing={1}
                  >
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <Typography
                        sx={{
                          color: "#fff",
                          marginBottom: "4%",
                          fontSize: "14px",
                        }}
                      >
                        Supply
                      </Typography>
                      <EditorInput setValues={editValues} />
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <Typography
                        sx={{
                          color: "#fff",
                          marginBottom: "4%",
                          fontSize: "14px",
                        }}
                      >
                        Height
                      </Typography>
                      <Tooltip
                        title="600 x 600 is the standard for most NFT's"
                        placement='top'
                      >
                        <TextField
                          // className='editor_textfield mid_textFields'
                          id='outlined-number'
                          placeholder='0'
                          type='number'
                          variant='outlined'
                          color='#808080'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(event) => {
                            if (JSON.parse(event.target.value) > 600) {
                              props.setCanvasHeight({
                                value: 300,
                              });
                              return alert("NFT's Height Should be 600px");
                            } else {
                              props.setCanvasHeight({
                                value: JSON.parse(event.target.value),
                              });
                            }
                          }}
                        />
                      </Tooltip>
                    </Grid>
                    <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                      <Typography
                        sx={{
                          color: "#fff",
                          marginBottom: "4%",
                          fontSize: "14px",
                        }}
                      >
                        Width
                      </Typography>
                      <Tooltip
                        title="600 x 600 is the standard for most NFT's"
                        placement='top'
                      >
                        <TextField
                          // className='editor_textfield mid_textFields'
                          id='outlined-number'
                          placeholder='0'
                          variant='outlined'
                          type='number'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(event) => {
                            if (JSON.parse(event.target.value) > 600) {
                              // props.setCanvasWidth({
                              //   value: 300,
                              // });
                              return alert("NFT's Width Should be 600px");
                            }
                            // else {
                            //   props.setCanvasWidth({
                            //     value: JSON.parse(event.target.value),
                            //   });
                            // }
                            // console.log(props.canvasWidth, "canvasWidth");
                          }}
                        />
                      </Tooltip>
                    </Grid>
                  </Grid>
                  <div>
                    <div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          Collection Name
                        </div>
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='WhatsForLaunch'
                          name='collection'
                          value={values.collection}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.collection && touched.collection ? (
                          <p style={{ color: "red" }}>{errors.collection}</p>
                        ) : null}
                      </div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          Name prefix(ie.__#69)
                        </div>
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='eg. WhatsForLaunch'
                          name='name'
                          value={values.name}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.name && touched.name ? (
                          <p style={{ color: "red" }}>{errors.name}</p>
                        ) : null}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          Symbol
                        </div>
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='eg. WFL'
                          name='symbol'
                          value={values.symbol}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.symbol && touched.symbol ? (
                          <p style={{ color: "red" }}>{errors.symbol}</p>
                        ) : null}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          Royalty Fee (%)
                        </div>
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='5%'
                          name='royaltyPercent'
                          type='number'
                          value={values.royaltyPercent}
                          onChange={handleChange}
                          onBlur={handleBlur}
                        />
                        {errors.royaltyPercent && touched.royaltyPercent ? (
                          <p style={{ color: "red" }}>
                            {errors.royaltyPercent}
                          </p>
                        ) : null}
                      </div>

                      <div
                        style={{
                          display: "flex",
                          marginBottom: "10px",
                          alignItems: "center",
                        }}
                      ></div>
                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          External Link (Website):
                        </div>
                        <TextField
                          fullWidth
                          variant='outlined'
                          placeholder='URL'
                          name='external'
                          value={values.external}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          style={{
                            borderRadius: "10px",
                          }}
                        />
                        {/* {errors.external && touched.external ? (
                          <p style={{ color: "red" }}>{errors.external}</p>
                        ) : null} */}
                      </div>

                      <div>
                        <div
                          style={{
                            fontSize: "14px",
                            fontWeight: 500,
                            fontFamily: "poppins-light",
                            color: "#fff",
                            marginTop: "1%",
                            marginBottom: "1%",
                          }}
                        >
                          Description :
                        </div>
                        <TextField
                          fullWidth
                          placeholder='eg. 777 of the WhatsForLaunch'
                          variant='outlined'
                          name='description'
                          value={values.description}
                          onChange={handleChange}
                          onBlur={handleBlur}
                          multiline={true}
                          rows={3}
                          maxRows={4}
                          style={{
                            borderRadius: "10px",
                          }}
                        />
                        {errors.description && touched.description ? (
                          <p style={{ color: "red" }}>{errors.description}</p>
                        ) : null}
                      </div>
                    </div>
                    <div style={{ width: "100%" }}>
                      <div
                        style={{
                          fontSize: "14px",
                          fontWeight: 500,
                          fontFamily: "poppins-light",
                          color: "#fff",
                          marginTop: "1%",
                          marginBottom: "1%",
                        }}
                      >
                        Royalty Wallets
                      </div>
                      {inputFields.map((input, index) => (
                        <>
                          <TextField
                            fullWidth
                            variant='outlined'
                            // inputProps={{ style: { textAlign: "center" } }}
                            placeholder='Royalty Wallets'
                            name='address'
                            value={values.royaltyWallet}
                            onChange={handleChange}
                            onBlur={(event) => {
                              handleFormChange(index, event);
                            }}
                            style={{
                              width: "100%",
                              borderRadius: "10px",
                              padding: "10px 0 15px 0",
                            }}
                          />
                          {creatorError && (
                            <span style={{ color: "red" }}>
                              You're wallet should be valid of 44 length
                            </span>
                          )}
                          <TextField
                            fullWidth
                            variant='outlined'
                            // inputProps={{ style: { textAlign: "center" } }}
                            placeholder='share'
                            name='share'
                            onBlur={(event) => {
                              handleFormChange(index, event);
                            }}
                            // onChange={handleShare}
                            style={{
                              justifyContent: "flex-start",
                              display: "flex",
                              // width: "500px",
                              // marginLeft: "5px",
                              borderRadius: "10px",
                              padding: "0 0 15px 0",
                            }}
                          />
                          {shareError && (
                            <span style={{ color: "red" }}>
                              Share value is not valid
                            </span>
                          )}
                        </>
                      ))}
                    </div>
                  </div>
                  <div style={{ display: "flex" }}>
                    <div style={{ marginTop: "3%" }}>
                      {inputFields.length>3?<button
                        style={{
                          width: "40px",
                          backgroundColor: "#1565C0",
                          borderRadius: "8px",
                          color: "#fff",
                          borderColor: "#1565C0",
                          height: "30px",
                          cursor:"not-allowed"
                        }}
                        onClick={(e) => addFields(e)}
                        disabled
                      >
                        <AddIcon />
                      </button>:<button
                        style={{
                          width: "40px",
                          backgroundColor: "#1565C0",
                          borderRadius: "8px",
                          color: "#fff",
                          borderColor: "#1565C0",
                          height: "30px",
                          cursor: "pointer",
                        }}
                        onClick={(e) => addFields(e)}
                      >
                        <AddIcon />
                      </button>}
                    </div>
                    <div style={{ marginTop: "3%", marginLeft: "2%" }}>
                      {inputFields.length<2?<button
                        style={{
                          width: "40px",
                          borderRadius: "8px",
                          color: "#fff",
                          borderColor: "red",
                          height: "30px",
                          background: "red",
                          cursor:"not-allowed"
                        }}
                        onClick={(e) => removeFields(e)}
                        disabled
                      >
                        <RemoveIcon />
                      </button>:<button
                        style={{
                          width: "40px",
                          borderRadius: "8px",
                          color: "#fff",
                          borderColor: "red",
                          height: "30px",
                          cursor: "pointer",
                          background: "red",
                        }}
                        onClick={(e) => removeFields(e)}
                        
                      >
                        <RemoveIcon />
                      </button>}
                    </div>
                  </div>
                  {/* <div
                    style={{
                      marginTop: "3%",
                    }}
                  >
                    <Button
                      variant='contained'
                      className='createBtn'
                      onClick={() => {
                        handleSubmit();
                      }}
                      sx={{ padding: "10px 30px", width: "30%" }}
                    >
                      Create
                    </Button>
                  </div> */}
                </form>
              </div>
              {/* </CardContent> */}
              {/* </Card> */}
            </List>
          </Paper>
        </div>
        {/* <button type='button' onClick={handleClick}>
          Onsubmit
        </button> */}
      </Box>
      <div className='form-group'>
        <ToastContainer
          position='bottom-right'
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
    </div>
  );
};
