import * as React from "react";

import { Fade, InputBase, TextField } from "@material-ui/core";
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

const initialValues = {
  name: "",
  symbol: "",
  royaltyPercent: "",
  royaltyWallet: "",
  share: "",
  external: "",
  description: "",
};
export const ModalComponent = (props) => {
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

  const { dispatch3 } = React.useContext(NumberOfCopies);

  const { dispatch1 } = React.useContext(ObjectContext);

  const [coord, setCoor] = React.useState({ x: 0, y: 0 });

  const [totalCopies, setTotalCopies] = React.useState({ value: 0 });

  const { values, errors, handleBlur, handleChange, handleSubmit, touched } =
    useFormik({
      initialValues: initialValues,
      validationSchema: signUpSchema,
      onSubmit: (values) => {
        console.log(values);
        handleClick();
        console.log(values.name, "nameeee");
      },
    });

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
  // const [canvasHeight, setCanvasHeight] = React.useState({
  //   value: 600,
  // });
  // const [canvasWidth, setCanvasWidth] = React.useState({
  //   value: 600,
  // });

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
        window.location.href = "/loading";
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

  const addFields = () => {
    let newfield = { creator: "", share: "" };

    setInputFields([...inputFields, newfield]);
  };

  const handleFormChange = (index, event) => {
    let data = [...inputFields];
    data[index][event.target.name] = event.target.value;
    setInputFields(data);
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

  return (
    <div>
      <Box>
        <>
          <div
            style={{
              fontWeight: "bold",
              fontSize: "24px",
              // fontFamily: "Muller-ExtraBold",
              marginBottom: "2%",
              color: "white",
            }}
          >
            PARAMETERS
          </div>
          <div
            style={{
              backgroundColor: "#fff",
              padding: "10px",
              borderRadius: "7px",
              width: "80%",
            }}
          >
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
                      color: "#808080",
                      marginBottom: "4%",
                      fontSize: "12px",
                    }}
                  >
                    Supply
                  </Typography>
                  <EditorInput setValues={editValues} />
                </Grid>
                <Grid item xl={4} lg={4} md={4} sm={4} xs={4}>
                  <Typography
                    sx={{
                      color: "#808080",
                      marginBottom: "4%",
                      fontSize: "12px",
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
                      color: "#808080",
                      marginBottom: "4%",
                      fontSize: "12px",
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
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "poppins-light",
                        color: "#808080",
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
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "poppins-light",
                        color: "#808080",
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
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "poppins-light",
                        color: "#808080",
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
                      <p style={{ color: "red" }}>{errors.royaltyPercent}</p>
                    ) : null}
                  </div>
                  <div
                    style={{
                      display: "flex",
                      marginBottom: "10px",
                      alignItems: "center",
                    }}
                  >
                    <div>
                      <div
                        style={{
                          fontSize: "12px",
                          fontWeight: 500,
                          fontFamily: "poppins-light",
                          color: "#808080",
                        }}
                      >
                        Royalty Wallets
                      </div>
                      {/* {inputFields.map((input, index) => (
                        <> */}
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='eg. WhatsForLaunch'
                        name='royaltyWallet'
                        value={values.royaltyWallet}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                          // justifyContent: "flex-start",
                          // display: "flex",
                          // marginLeft: "5px",
                          borderRadius: "10px",
                          padding: "10px 0 15px 0",
                        }}
                      />
                      {errors.royaltyWallet && touched.royaltyWallet ? (
                        <p style={{ color: "red" }}>{errors.royaltyWallet}</p>
                      ) : null}
                      <TextField
                        fullWidth
                        variant='outlined'
                        placeholder='share'
                        name='share'
                        value={values.share}
                        onChange={handleChange}
                        onBlur={handleBlur}
                        style={{
                          borderRadius: "10px",
                          padding: "0 0 15px 0",
                        }}
                      />
                      {errors.share && touched.share ? (
                        <p style={{ color: "red" }}>{errors.share}</p>
                      ) : null}
                      {/* </>
                      ))} */}
                    </div>
                    {/* <button
                      style={{
                        width: "60px",
                        background:
                          "linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)",
                        borderRadius: "8px",
                        color: "#CECECE",
                        borderColor: "rgba(39, 36, 52, 0.5)",
                        height: "40px",
                      }}
                      onClick={addFields}
                    >
                      <AddIcon />
                    </button> */}
                  </div>
                  <div>
                    <div
                      style={{
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "poppins-light",
                        color: "#808080",
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
                        fontSize: "12px",
                        fontWeight: 500,
                        fontFamily: "poppins-light",
                        color: "#808080",
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
              </div>
              <div
                style={{
                  marginTop: "30px",
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
          </div>
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
