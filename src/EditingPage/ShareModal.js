import * as React from 'react';
import Box from '@mui/material/Box';
import Button from '@mui/material/Button';
import Typography from '@mui/material/Typography';
import Modal from '@mui/material/Modal';
import CloseIcon from '@mui/icons-material/Close';
import {ObjectSelection } from "./EditingPage";
const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  bgcolor: '#4E39D7',
  border: '2px solid #000',
  borderRadius:"15px",
  boxShadow: 24,
  p: 10,
};

export default function BasicModal(props) {
  const [open, setOpen] = React.useState(true);
  const handleOpen = () => setOpen(true);
  
  const {
    shareModalMethod,rarityModalMethod
  } = React.useContext(ObjectSelection);
  const handleClose = () => {setOpen(false); shareModalMethod(false); rarityModalMethod(false)};
  return (
    <div>
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box sx={style}>
        <CloseIcon sx={{position:"absolute", top:"1%", right:"1%", color:"#fff", cursor:"pointer"}} onClick={handleClose}/>
          <Typography id="modal-modal-description" textAlign='center'>
            {props.title}
          </Typography>
        </Box>
      </Modal>
    </div>
  );
}