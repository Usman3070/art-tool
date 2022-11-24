import React from "react";
import { Rnd } from "react-rnd";
import { ObjectSelection, ObjectContext } from "./EditingPage";
import "./Items.css";

export const Items = (props) => {
  const { selection, dispatch2 } = React.useContext(ObjectSelection);
  const { objects, dispatch1 } = React.useContext(ObjectContext);

  let elements = props.hashedFolder;
  if (objects && objects.length) {
    elements = objects;
  }

  return (
    <div>
      <div
        style={{
          height: `${props.imageHeight}px`,
          width: `${props.imageWidth}px`,
          // width: `${file.width}`,
          //           height: `${file.height }`,
          position: "relative",
        }}
        className="imageDimensions"
        ref={props.parent}
      >
        {elements &&
          elements.map((file, index) => (
            <div onClick={() => props.onClick(`${file.name}`)}>
              <Rnd
                key={index}
                style={{
                  zIndex: file.depth,
                }}
                onDragStop={(event) => {
                  // props.setCoord(event, file);
                }}
              >
                <img
                  // src={require(`.${file.path.slice(12).replaceAll("\\", "/")}`)}
                  src={`${process.env.REACT_APP_SERVERURL}${file.path.slice(
                    12
                  )}`}
                  alt="x"
                  style={{
                    width: file.width,
                    height: file.height,
                  }}
                  className="items"
                />
              </Rnd>
            </div>
          ))}
      </div>
    </div>
  );
};
