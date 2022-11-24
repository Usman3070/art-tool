import React from "react";
import Carousel from "react-multi-carousel";
import "react-multi-carousel/lib/styles.css";
import { NumberOfCopies, ObjectContext } from "./EditingPage";
import "./Carousel.css";

export const DemoCarousel = () => {
  const { objects, dispatch1 } = React.useContext(ObjectContext);

  const { total, dispatch3 } = React.useContext(NumberOfCopies);
  const responsive = {
    superLargeDesktop: {
      breakpoint: { max: 4000, min: 3000 },
      items: 5,
    },
    desktop: {
      breakpoint: { max: 3000, min: 1024 },
      items: 3,
    },
    tablet: {
      breakpoint: { max: 1024, min: 464 },
      items: 2,
    },
    mobile: {
      breakpoint: { max: 464, min: 0 },
      items: 1,
    },
  };

  return (
    <div style={{ color: "white", marginBottom: "50px" }}>
      {/* <div
        style={{
          justifyContent: "center",
          display: "flex",
          fontWeight: "bold",
          fontSize: "25px",
          fontFamily: "Muller-ExtraBold",
        }}
      >
        REVIEW
      </div>
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          fontSize: "20px",
          fontWeight: 500,
          fontFamily: "poppins-light",
        }}
      >
        Total Copies Generated Will Be :
      </div> */}
      <div
        style={{
          justifyContent: "center",
          display: "flex",
          fontSize: "25px",
          fontWeight: 500,

          animation: "glow 2s ease-in-out infinite alternate",
          color: "rgba(255, 255, 255, 0.904)",
        }}
      >
        <h1
          style={{ fontFamily: "Muller-ExtraBold", fontSize: "70px" }}
        >{`${total.value}`}</h1>
      </div>

      <Carousel responsive={responsive} focusOnSelect={true}>
        {objects &&
          objects.map((object) => {
            return (
              <div className='carouselElement'>
                <div>
                  <img
                    width='100%'
                    // src={require(`.${object.path
                    //   .slice(12)
                    //   .replaceAll("\\", "/")}`)}
                    // alt="img"
                    // style={{ maxHeight: "20vh" }}
                    src={`${process.env.REACT_APP_SERVERURL}${object.path.slice(
                      12
                    )}`}
                  />
                </div>
                <div
                  style={{
                    fontWeight: "bold",
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                  }}
                >{`${object.name.slice(0, 1).toUpperCase()}${object.name.slice(
                  1
                )} : `}</div>
                <div
                  style={{
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Height:</p>
                  <p>{object.height}</p>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Width:</p>
                  <p>{object.width}</p>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Depth:</p>
                  <p>{object.depth}</p>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>X:</p>
                  <p>{object.x}</p>
                </div>
                <div
                  style={{
                    borderBottom: "1px solid #3c4174",
                    padding: "10px",
                    display: "flex",
                    justifyContent: "space-between",
                  }}
                >
                  <p>Y:</p>
                  <p>{object.y}</p>
                </div>
              </div>
            );
          })}
      </Carousel>
    </div>
  );
};
