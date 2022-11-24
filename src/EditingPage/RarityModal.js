import * as React from "react";
import { Backdrop } from "@material-ui/core";
import { Box } from "@material-ui/core";
import { Modal } from "@material-ui/core";
import { Fade, Button } from "@material-ui/core";
import TreesTempRarity from "./FolderStructureRarity";
import CloseIcon from '@material-ui/icons/Close';
const style = {
  position: "absolute",
  top: "50%",
  left: "50%",
  transform: "translate(-50%, -50%)",
  width: '70%',
  height: '90vh',
  // bgcolor: "background.paper",
  // border: "2px solid #272434",
  boxShadow: 24,
  borderRadius: "10px",
  
  backgroundColor: "rgb(52, 55, 126, 0.5)",
  backdropFilter: 'blur(25px)',
  padding:" 10px 10px 60px 10px"
};

export const RarityModalComponent = (props) => {
  return (
    <div>
      <Modal
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
          <Box sx={style}>
          
          <div style={{textAlign:"end"}}>
          <CloseIcon className="close_icon" style={{color:"white"}} onClick={()=>{props.handleClose()}}/>
          </div>
          <div
        style={{
          justifyContent: "center",
          display: "flex",
          fontWeight: "bold",
          fontSize: "20px",
          fontFamily: "poppins-light",
          color: "#fff",
        }}
      >
        Rarity Control
      </div>
            <div
              style={{
                overflowX: "hidden",
                overflowY: "auto",
                maxHeight: "550px",
                padding:"0 20px 0 20px"
              }}
            >
              <TreesTempRarity folderData={props.folderStructure} />
            </div>

            <div
              style={{
                justifyContent: "center",
                display: "flex",
              }}
            >
              <Button
                style={{background:"linear-gradient(100.86deg, #4E39D7 14.47%, #C615A9 123.62%)"}}
                variant="contained"
                color="secondary"
                size="large"
                onClick={props.handleClose}
              >
                Submit
              </Button>
            </div>
          </Box>
        </Fade>
      </Modal>
    </div>
  );
};
