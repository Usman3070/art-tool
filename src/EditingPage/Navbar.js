import React from "react";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import logo from '../assets/images/logo.png'
// Using Inline Styling
const useStyles = makeStyles((theme) => ({
  root: {
   
    // flexGrow: 1,
    // primary: {
    //   main: "000",
    // },
  },
}));

// Exporting Default Navbar to the App.js File
export const NavComponent = (props) => {
  const classes = useStyles();
  const [open, setOpen] = React.useState(false);

  const handleOpen = () => {
    setOpen(true);
  };

  const handleClose = () => {
    setOpen(false);
  };

  return (
    <div className={classes.root} style={{ color: "#212529" }}>
      <AppBar position="sticky" style={{ background: "transparent", boxShadow:"unset", }}>
        <Toolbar variant="dense" style={{ display:"flex", justifyContent:"space-between", }}>
        <a  href="https://linktr.ee/nft_paradise">
          <img
            // style={{ maxWidth: "185px",  }}
            // src={require("./AlienLogo.png")}
            src={logo}
            alt="alien"
          />
 </a>
          {/* <Typography
            variant="h6"
            color="#fff"
            style={{
              fontFamily: "monospace",
              animation: "glow 2s ease-in-out infinite alternate",
              marginLeft: "0.5vw",
            }}
          >
            <a className="landingNavMenu" href="https://linktr.ee/nft_paradise">
              Sick Alien
            </a>
          </Typography> */}

          <Typography
            variant="h6"
            color="inherit"
            style={{
              fontFamily: "monospace",
              animation: "glow 2s ease-in-out infinite alternate",
              // marginLeft: "70vw",
              
            }}
            className="landingNavMenu"
            onClick={(event) => (window.location.href = "/")}
          >
            COLLECTION GENERATOR
          </Typography>
        </Toolbar>
      </AppBar>
    </div>
  );
};
