import React from "react";
import Hidden from "@material-ui/core/Hidden";
import { SliderComponent } from "./Slider";
import { ObjectContext, ObjectSelection } from "./EditingPage";
import { Typography, TextField } from "@material-ui/core";
import InputBase from "@material-ui/core/InputBase";
export const Editor = (props) => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);

  const commonStyle = {
    margin: "10px 5px 10px 5px",
    background:
      "linear-gradient(180deg, rgba(67, 49, 118, 0.0728) 0%, rgba(24, 3, 67, 0) 100%)",
    border: "1px solid #32306A",
    padding: "0px 20px 0px 10px",
    borderRadius: "12px",
    fontSize: "14px",
    display: "flex",
    justifyContent: "space-between",
    alignItems: "center",
    // boxShadow: "1px 3px 1px #afafaf",
    // fontWeight: "bolder",
    // fontFamily: "monospace",
  };

  const currentValues = React.useRef(
    props.currentValues.find((obj) => obj.name === selection.name)
  );

  React.useEffect(() => {
    currentValues.current =
      objects && objects.find((obj) => obj.name === selection.name);
  }, [objects, selection.name]);

  return (
    <div
      style={{
        backgroundColor: "",
        padding: "10px",
        borderRadius: "10px",
        // boxShadow: "1px 3px 1px #acacaf",
        color: "#CECECE",
      }}
    >
      <div
        className='editor'
        style={{
          justifyContent: "center",
          display: "flex",
          fontWeight: "bold",
          fontSize: "25px",
          fontFamily: "Muller-Light",
        }}
      >
        Editor
      </div>

      <div style={commonStyle}>
        <div style={{ width: "75%", marginTop: "15px" }}>
          Heights:
          <SliderComponent
            name={"height"}
            value={
              props.currentValues.length ? props.currentValues[0].height : 0
            }
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "20%" }}>
          <div style={{ display: "flex", justifyContent: "center" }}>
            <Hidden smDown>
              <InputBase
                className='editor_textfield'
                type='number'
                placeholder='0'
                inputProps={{ "aria-label": "naked" }}
                // onChange={(event) => {
                //         setCanvasHeight({
                //           value: JSON.parse(event.target.value),
                //         });
                //       }}
              />
            </Hidden>
          </div>
        </div>
      </div>
      <div style={commonStyle}>
        <div style={{ width: "75%", marginTop: "15px" }}>
          Width:
          <SliderComponent
            name={"width"}
            value={props.currentValues.width ? props.currentValues[0].width : 0}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "20%" }}>
          <Hidden smDown>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <InputBase
                className='editor_textfield'
                type='number'
                placeholder='0'
                inputProps={{ "aria-label": "naked" }}
              />
            </div>
          </Hidden>
        </div>
      </div>

      <div style={commonStyle}>
        <div style={{ width: "75%", marginTop: "15px" }}>
          Depth:
          <SliderComponent
            marks={true}
            name={"depth"}
            value={props.currentValues.depth ? props.currentValues[0].depth : 0}
          />
        </div>
        <div style={{ display: "flex", alignItems: "center", width: "20%" }}>
          <Hidden smDown>
            <div style={{ display: "flex", justifyContent: "center" }}>
              <InputBase
                className='editor_textfield'
                type='number'
                placeholder='0'
                inputProps={{ "aria-label": "naked" }}
              />
            </div>
          </Hidden>
        </div>
      </div>
      {/* <div style={commonStyle}>
        Rarity:
        <SliderComponent
          marks={true}
          name={"rarity"}
          value={props.currentValues.rarity ? props.currentValues[0].rarity : 0}
        />
      </div> */}
    </div>
  );
};
