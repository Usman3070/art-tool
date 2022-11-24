import * as React from "react";
import { Backdrop } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import { Fade, CircularProgress } from "@material-ui/core";
import Button from "@material-ui/core/Button";
import SaveIcon from "@material-ui/icons/Save";
import { useNavigate } from "react-router-dom";
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: "60%",
  height: 650,
  // bgcolor: "background.paper",
  // border: "2px solid #000",
  // boxShadow: 24,
  // borderRadius: "10px",
  p: 4,

  backgroundColor: "#4E39D7",
  boxshadow: "inset -24px -24px 30px rgba(0, 0, 0, 0.25) !important",
  borderRadius: "40px",
};

export const FinalModalComponent = (props) => {
  const navigate = useNavigate();
  return (
    <div
      style={{
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
      }}
    >
      {/* <Modal
        aria-labelledby="transition-modal-title"
        aria-describedby="transition-modal-description"
        open={props.isOpen}
        onClose={props.handleClose}
        closeAfterTransition
        BackdropComponent={Backdrop}
        BackdropProps={{
          timeout: 500,
        }}
      >
        <Fade in={props.isOpen}>
          <Box sx={style} className="final_modal"> */}
      {/* <div
              className="typewriter"
              style={{
                maxHeight: "30px",
                maxWidth: "70%",
                color: "#fff",
              }}
            >
              <h3 style={{ fontFamily: "poppins-light" }}>
                {" "}
                🎉🎉 Woohoooo !! Check Generated Folder...
              </h3>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "#fff",
                fontFamily: "poppins-light",
                marginTop: "20px",
              }}
            >
              Hey Guys,
            </div> */}
      <div>
        <h3
          style={{
            color: "white",
            textAlign: "center",
            marginBottom: "20px",
            fontFamily: "poppins-light",
          }}
        >
          Dowload the generated nfts are here,
        </h3>
        <a
          style={{
            display: "flex",
            justifyContent: "center",
            alignItems: "center",
            fontSize: "30px",
            fontWeight: "bold",
          }}
          href={`${process.env.REACT_APP_SERVERURL}/${JSON.parse(
            sessionStorage.uuid
          )}.zip`}
          target="_blank"
          download
        >
          <Button
            style={{
              background:
                "linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)",
              padding: "15px 60px",
              fontFamily: "poppins-light",
            }}
            onClick={() => navigate("/Uploading")}
            variant="contained"
            color="primary"
            size="large"
            // className={classes.button}
            startIcon={<SaveIcon />}
          >
            DOWNLOAD
          </Button>
        </a>
      </div>
      {/* <div
              style={{
                display: "flex",
                justifyContent: "center",
                color: "#fff",
                fontFamily: "poppins-light",
                marginTop: "30px",
              }}
            >
              Thanks a lot for using this tool , its been my pleasure serving
              your needs. I do hope this tool was useful for you. Please do take
              a time in supporting me so I can bring more such tools for you
              free of cost. It did take a lot of time to develop this , do
              support this project in any way possible !
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "#fff",
                fontFamily: "poppins-light",
                marginTop: "30px",
              }}
            >
              Regards, Bitrix
            </div>

            <div
              className="links-div"
              style={{
                display: "flex",
                justifyContent: "center",
                fontFamily: "poppins-light",
                marginTop: "30px",
                backgroundColor: "rgba(39, 36, 52, 0.5)",
                padding: "10px",
                borderRadius: "10px",
              }}
            >
              <ol style={{ width: "100%" }}>
                <p
                  style={{
                    display: "flex",
                    justifyContent: "center",
                    color: "#fff",
                    fontWeight: "bold",
                  }}
                >
                  Links
                </p>
                <div>
                  <a
                    style={{
                      marginTop: "30px",
                      color: "rgb(91 171 255)",
                    }}
                    href="https://patreon.com/bitrix"
                  >
                    👽 Patreon
                  </a>
                </div>

                <div>
                  <a
                    style={{ marginTop: "10px", color: "rgb(91 171 255)" }}
                    href="https://www.buymeacoffee.com/bitrix"
                  >
                    ☕ Buy me a coffee :)
                  </a>
                </div>

                <div>
                  <p style={{ marginTop: "10px", color: "#fff" }}>
                    💸 ETH Address [ERC20] -
                    0x2b2d491559c47406c3d79e0e805f8bfbba699432
                  </p>
                </div>

                <div>
                  <p style={{ marginTop: "10px", color: "#fff" }}>
                    🦍 Metamask Wallet Address -
                    0xB1Ea4256Af8a6B299e80D0168426545B2A4B2696
                  </p>
                </div>
              </ol>
            </div>
            <div
              style={{
                display: "flex",
                justifyContent: "flex-start",
                color: "#fff",
                fontFamily: "poppins-light",
                marginTop: "30px",
              }}
            >
              <ol>
                <p style={{ marginTop: "5px", color: "#fff" }}>
                  Drop forget to drop me a piece of your collection 😉
                </p>
                <p style={{ marginTop: "10px", color: "#fff" }}>
                  Do tag me as #sickalien in your posts as well , cheers !
                </p>
              </ol>
            </div> */}
      {/* </Box>
        </Fade>
      </Modal> */}
    </div>
  );
};
