import * as React from "react";

import {
  Card,
  CardContent,
  Fade,
  InputBase,
  List,
  Paper,
  TextField,
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

const initialValues = {
  name: "",
  symbol: "",
  royaltyPercent: "",
  userWithShare: [{ creator: "", share: "" }],
  external: "",
  description: "",
};
export const ModalComponent = (props) => {
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

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
    { creator: "", share: "" },
  ]);
  const [creators, setCreators] = React.useState("");
  const [description, setDescription] = React.useState("");
  const [URL, setURL] = React.useState("");
  const [next, setNext] = React.useState(false);
  const [code, setCode] = React.useState("");
  const [creatorError, setCreatorError] = React.useState(false);
  const [shareError, setShareError] = React.useState(false);

  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values) => {
        handleClick();
        // if (props.closeLoadingModal) {
        //   handleClickGenerate();
        // }
      },
    });
  const handleClick = async () => {
    const data = {
      objects: objects,
      total: total,
      sellerFee,
      symbol: values.symbol,
      creators: inputFields,
      uuid: JSON.parse(sessionStorage.uuid),
      canvasHeight: 300,
      canvasWidth: 300,
      folderTree: fileData,
      name: values.name,
      description: values.description,
      URL: values.external,
    };

    props.openLoadingModal();
    axios
      .post(`${process.env.REACT_APP_SERVERURL}/submitDetails`, data)
      .then(function (response) {
        // window.location.href = "/loading";
        props.closeLoadingModal();
        props.generateBTN();
        console.log(response);
      })
      .catch(function (error) {
        alert(error);
        window.location.href = "/error";
        console.log(error);
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
    let newfield = { creator: "", share: "" };

    setInputFields([...inputFields, newfield]);
  };

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

    if (event.target.name == "creator") {
      if (event.target.value.length == 44) {
        setCreatorError(false);
      } else {
        setCreatorError(true);
      }
    }
    if (event.target.name == "share") {
      if (event.target.value.length > 3) {
        setShareError(true);
      } else {
        setShareError(false);
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

  return (
    <div>
      <Box>
        <>
          <div
            style={{
              fontWeight: "500",
              fontSize: "22px",
              // fontFamily: "Muller-ExtraBold",
              marginBottom: "2%",
              color: "white",
            }}
          >
            PARAMETERS
          </div>

          <Paper style={{ maxHeight: 670, overflow: "auto" }}>
            <List>
              <Card>
                <CardContent>
                  <form onSubmit={handleSubmit}>
                    <Grid
                      container
                      xl={12}
                      lg={12}
                      md={12}
                      sm={12}
                      xs={12}
                      spacing={4}
                    >
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                        <Typography
                          sx={{
                            color: "#2E2E2E",
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
                            color: "#2E2E2E",
                            marginBottom: "4%",
                            fontSize: "14px",
                          }}
                        >
                          Height
                        </Typography>
                        <TextField
                          // className='editor_textfield mid_textFields'
                          id='outlined-number'
                          placeholder='0'
                          type='number'
                          color='#808080'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(event) => {
                            props.setCanvasHeight({
                              value: JSON.parse(event.target.value),
                            });
                          }}
                        />
                      </Grid>
                      <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                        <Typography
                          sx={{
                            color: "#2E2E2E",
                            marginBottom: "4%",
                            fontSize: "14px",
                          }}
                        >
                          Width
                        </Typography>
                        <TextField
                          // className='editor_textfield mid_textFields'
                          id='outlined-number'
                          placeholder='0'
                          type='number'
                          InputLabelProps={{
                            shrink: true,
                          }}
                          onChange={(event) => {
                            props.setCanvasWidth({
                              value: JSON.parse(event.target.value),
                            });
                          }}
                        />
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
                              color: "#2E2E2E",
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
                              color: "#2E2E2E",
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
                              color: "#2E2E2E",
                              marginTop: "1%",
                              marginBottom: "1%",
                            }}
                          >
                            Percent fee(%)
                          </div>
                          <TextField
                            fullWidth
                            variant='outlined'
                            placeholder='eg. WhatsForLaunch'
                            name='royaltyPercent'
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
                              color: "#2E2E2E",
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
                          {errors.external && touched.external ? (
                            <p style={{ color: "red" }}>{errors.external}</p>
                          ) : null}
                        </div>

                        <div>
                          <div
                            style={{
                              fontSize: "14px",
                              fontWeight: 500,
                              fontFamily: "poppins-light",
                              color: "#2E2E2E",
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
                            color: "#2E2E2E",
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
                              name='creator'
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
                        <button
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
                        </button>
                      </div>
                      <div style={{ marginTop: "3%", marginLeft: "2%" }}>
                        <button
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
                        </button>
                      </div>
                    </div>
                    <div
                      style={{
                        marginTop: "3%",
                      }}
                    >
                      <Button
                        variant='contained'
                        onClick={() => {
                          handleSubmit();
                        }}
                      >
                        Create
                      </Button>
                    </div>
                  </form>
                </CardContent>
              </Card>
            </List>
          </Paper>
        </>
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
