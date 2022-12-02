import React from "react";
import { SliderComponent } from "./Slider";
import { TextField } from "@material-ui/core";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import { Button, Input } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
export const EditorInput = (props) => {
  // eslint-disable-next-line no-undef
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

  const commonStyle = {
    // margin: "10px 5px 10px 5px",
    // background: "linear-gradient(180deg, rgba(67, 49, 118, 0.0728) 0%, rgba(24, 3, 67, 0) 100%)",
    // border:"1px solid #32306A",
    // padding: "10px 20px 0px 10px",
    // borderRadius: "12px",
    // display: "flex",
    // justifyContent: "center",
    fontSize: "14px",
  };

  const handleFinalClick = () => {
    return input4 > 10000 ? null : props.setValues(input1, input2, input4);
  };

  const [input1, setInput1] = React.useState({ name: "height", value: null });
  const [input2, setInput2] = React.useState({ name: "width", value: null });
  //const [input3, setInput3] = React.useState({ name: "depth", value: null });
  const [input4, setInput4] = React.useState({ value: null });

  return (
    <div
      style={{
        // marginTop: "10px",
        backgroundColor: "",
        // padding: "7px",
        borderRadius: "10px",
        // boxShadow: "1px 3px 1px #acacaf",
        // color: "#CECECE",
      }}
    >
      {/* <div
      className="manual-input"
        style={{
          justifyContent: "center",
          display: "flex",
          fontWeight: "bold",
          fontSize: "25px",
          fontFamily: "Muller-Light",
        }}
      >
        TOTAL COPIES
      </div> */}
      {/* <div style={commonStyle}>
        <div style={{ fontWeight: "bolder", fontFamily: "monospace" }}>
          Height:
        </div>
        <div>
          <TextField
            size="small"
            variant="standard"
            inputProps={{ style: { textAlign: "center", color:"#F5F5F5" } }}
            placeholder="(in px)"
            onChange={(event) => {
              setInput1({
                name: "height",
                value: JSON.parse(event.target.value),
              });
            }}
            onBlur={handleFinalClick}
          />
        </div>
      </div>
      <div style={commonStyle}>
        <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Width:
        </div>

        <TextField
          size="small"
          variant="standard"
          inputProps={{ style: { textAlign: "center", color:"#F5F5F5" } }}
          placeholder="(in px)"
          onChange={(event) => {
            setInput2({ name: "width", value: JSON.parse(event.target.value) });
          }}
          onBlur={handleFinalClick}
        />
      </div> */}

      <div style={commonStyle}>
        {/* <div style={{ fontWeight: "bold", fontFamily: "monospace" }}>
          Total Copies:
        </div> */}
        <TextField
          // className='editor_textfield'
          id='outlined-number'
          variant='outlined'
          // label='supply'
          placeholder='0'
          type='number'
          InputLabelProps={{
            shrink: true,
          }}
          onChange={(event) => {
            setInput4({ value: JSON.parse(event.target.value) });
          }}
          error={input4.value > 10000}
          helperText={input4 > 10000 ? "Should be less than 10000" : ""}
          onBlur={handleFinalClick}
        />
        {/* <TextField
          size="small"
          defaultValue={0}
          inputProps={{ min: 0, style: { color:"#F5F5F5", background:"rgba(0, 0, 0, 0.25)", } }}
          margin="dense"
          variant="outlined"
          onChange={(event) => {
          
            setInput4({ value: JSON.parse(event.target.value) });
          }}
          error={input4.value > 10000}
          helperText={input4 > 10000 ? "Should be less than 10000" : ""}
          onBlur={handleFinalClick}
        /> */}
      </div>
      {/* <div style={{ justifyContent: "center", display: "flex" }}>
        <Button style={{ backgroundColor: "transparent",
                  border:"1px solid #C615A9",
                  color: "#fff",
                  padding: "10px 20px",
                  fontSize: "13px",}} variant="contained" color="primary" onClick={handleFinalClick}>
          Submit
        </Button>
      </div> */}
    </div>
  );
};
