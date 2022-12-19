import React, { useState } from "react";
import { withStyles } from "@material-ui/core/styles";
import Button from "@material-ui/core/Button";
import ArrowDropDownIcon from "@material-ui/icons/ArrowDropDown";
import ListItemText from "@material-ui/core/ListItemText";
import { makeStyles } from "@material-ui/core/styles";
import AppBar from "@material-ui/core/AppBar";
import Menu from "@material-ui/core/Menu";
import MenuItem from "@material-ui/core/MenuItem";
import Toolbar from "@material-ui/core/Toolbar";
import Typography from "@material-ui/core/Typography";
import { NavLink } from "react-router-dom";
import logo from "../assets/images/logo2.png";
import Divider from "@mui/material/Divider";
import IconButton from "@material-ui/core/IconButton";
import MenuIcon from "@material-ui/icons/Menu";

import Hidden from "@material-ui/core/Hidden";
// Using Inline Styling
const useStyles = makeStyles((theme) => ({
  root: {
    flexGrow: 1,
  },
  menuButton: {
    marginRight: theme.spacing(2),
    marginLeft: "10px",
  },
}));

// -------------
const StyledMenu = withStyles({
  paper: {
    border: "1px solid #d3d4d5",
    background: "#393864 !important",
    color: "white",
  },
})((props) => (
  <Menu
    elevation={0}
    getContentAnchorEl={null}
    anchorOrigin={{
      vertical: "bottom",
      horizontal: "center",
    }}
    transformOrigin={{
      vertical: "top",
      horizontal: "center",
    }}
    {...props}
  />
));

const StyledMenuItem = withStyles((theme) => ({
  root: {
    "&:focus": {
      backgroundColor: "#C615A9",
      "& .MuiListItemIcon-root, & .MuiListItemText-primary": {
        color: theme.palette.common.white,
      },
    },
  },
}))(MenuItem);

// --------------
// Exporting Default Navbar to the App.js File
export const NavHomePage = (props) => {
  const [anchorEl, setAnchorEl] = React.useState(null);
  const [anchorE2, setAnchorE2] = React.useState(null);
  const [anchorE3, setAnchorE3] = React.useState(null);
  const open = Boolean(anchorEl);

  const classes = useStyles();
  // ----------------
  const handleClick = (event) => {
    setAnchorE2(event.currentTarget);
  };

  const handleClick2 = (event) => {
    setAnchorE3(event.currentTarget);
  };

  // -------------
  const handleMenu = (event) => {
    setAnchorEl(event.currentTarget);
  };

  const handleClose = () => {
    setAnchorEl(null);
    setAnchorE2(null);
  };

  const handleClose2 = () => {
    setAnchorEl(null);
    setAnchorE3(null);
  };
  return (
    <AppBar
      position='static'
      style={{
        background: "transparent",
        boxShadow: "none",
        marginBottom: "20px",
      }}
    >
      <Toolbar
        variant='dense'
        style={{
          borderRadius: "10px",
          display: "flex",
          justifyContent: "space-between",
        }}
      >
        <Hidden mdUp>
          <IconButton
            edge='start'
            className={classes.menuButton}
            color='inherit'
            aria-label='open drawer'
            onClick={handleMenu}
          >
            <MenuIcon />
          </IconButton>
        </Hidden>

        <Menu
          id='menu-appbar'
          anchorEl={anchorEl}
          anchorOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          keepMounted
          transformOrigin={{
            vertical: "top",
            horizontal: "right",
          }}
          open={open}
          onClose={handleClose}
        >
          <MenuItem onClick={handleClose}>Minting Now</MenuItem>
          <MenuItem onClick={handleClose}>Upcoming Mints</MenuItem>
          <MenuItem onClick={handleClose}>Create</MenuItem>
          <MenuItem onClick={handleClose}>Web3 Services</MenuItem>
          <MenuItem onClick={handleClose}>NFT Tool Suit</MenuItem>
          <MenuItem onClick={handleClose}>Chain Games</MenuItem>
        </Menu>

        <Hidden smDown>
          <NavLink to='/'>
            <div className='logo-parent'>
              <div className='logo_div'>
                <img src={logo} alt='' className='nav-logo' />
              </div>
            </div>
          </NavLink>

          <div
            style={{ display: "flex", paddingTop: "20px", paddingRight: "5%" }}
          >
            {/* <NavLink to='/'> */}
            <a href='https://whatsforlaunch.io/'>
              <div className='eachOne'>
                <Typography
                  variant='h6'
                  color='inherit'
                  className='landingNavMenu'
                  style={{
                    fontFamily: "poppins-light",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#fff",
                  }}
                >
                  HOME
                </Typography>
              </div>
            </a>
            {/* </NavLink> */}
            <a href='https://whatsforlaunch.io/mintingnow'>
              <div className='eachOne'>
                <Typography
                  variant='h6'
                  color='inherit'
                  className='landingNavMenu'
                  style={{
                    fontFamily: "poppins-light",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#fff",
                  }}
                  onClick={() => {
                    props.setInstructionsOpen(true);
                  }}
                >
                  MINTING NOW
                </Typography>
              </div>
            </a>

            <div className='eachOne'>
              <Typography
                variant='h6'
                color='inherit'
                className='landingNavMenu'
                style={{
                  fontFamily: "poppins-light",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#fff",
                }}
                onClick={() => {
                  props.setContactOpen(true);
                }}
              >
                UPCOMING MINTS
              </Typography>
            </div>
            <a href='https://whatsforlaunch.io/Create'>
              <div className='eachOne'>
                <Typography
                  variant='h6'
                  color='inherit'
                  className='landingNavMenu'
                  style={{
                    fontFamily: "poppins-light",
                    fontWeight: 600,
                    fontSize: "16px",
                    color: "#fff",
                  }}
                  onClick={() => {
                    props.setAboutOpen(true);
                  }}
                >
                  CREATE
                </Typography>
              </div>
            </a>
            <div className='eachOne'>
              <Button
                aria-controls='customized-menu'
                aria-haspopup='true'
                // variant="contained"
                color='primary'
                className='landingNavMenu'
                style={{
                  fontFamily: "poppins-light",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#fff",
                  padding: "14px 8px",
                }}
                onClick={handleClick2}
              >
                WEB3 SERVICES <ArrowDropDownIcon />
              </Button>
              <StyledMenu
                id='customized-menu'
                anchorEl={anchorE3}
                keepMounted
                open={Boolean(anchorE3)}
                onClose={handleClose2}
              >
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText primary='Raffle' className='nav-drop-down' />
                  </a>
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText
                      primary='Staking'
                      className='nav-drop-down11'
                    />
                  </a>
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText
                      primary='ANOTHER ACTION'
                      className='nav-drop-down11'
                    />
                  </a>
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText
                      primary='Mutation'
                      className='nav-drop-down11'
                    />
                  </a>
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText
                      primary='Art Upgrades'
                      className='nav-drop-down11'
                    />
                  </a>
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <a href='https://whatsforlaunch.io/#explore1'>
                    <ListItemText
                      primary='Chain Games'
                      className='nav-drop-down12'
                    />
                  </a>
                </StyledMenuItem>
              </StyledMenu>
            </div>
            <div className='eachOne'>
              <Typography
                variant='h6'
                color='inherit'
                className='landingNavMenu'
                style={{
                  fontFamily: "poppins-light",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#fff",
                }}
                onClick={() => {
                  props.setAboutOpen(true);
                }}
              >
                NFT TOOL SUIT
              </Typography>
            </div>
            {/* <div className='eachOne'>
              <Button
                aria-controls='customized-menu'
                aria-haspopup='true'
                // variant="contained"
                color='primary'
                className='landingNavMenu'
                style={{
                  fontFamily: "poppins-light",
                  fontWeight: 600,
                  fontSize: "16px",
                  color: "#fff",
                  padding: "14px 8px",
                }}
                onClick={handleClick}
              >
                CHAIN GAMES <ArrowDropDownIcon />
              </Button>
              <StyledMenu
                id='customized-menu'
                anchorEl={anchorE2}
                keepMounted
                open={Boolean(anchorE2)}
                onClose={handleClose}
              >
                <StyledMenuItem>
                  <ListItemText primary='WEB3 SERVICES' />
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <ListItemText primary='ANOTHER ACTION' />
                </StyledMenuItem>
                <Divider />
                <StyledMenuItem>
                  <ListItemText primary='SOMETHING' />
                </StyledMenuItem>
              </StyledMenu>
            </div> */}
          </div>
        </Hidden>
      </Toolbar>
    </AppBar>
    //   <AppBar component="nav">
    //   <Toolbar>
    //     <IconButton
    //       color="inherit"
    //       aria-label="open drawer"
    //       edge="start"
    //       onClick={handleDrawerToggle}
    //       sx={{ mr: 2, display: { sm: 'none' } }}
    //     >
    //       <MenuIcon />
    //     </IconButton>
    //     <Typography
    //       variant="h6"
    //       component="div"
    //       sx={{ flexGrow: 1, display: { xs: 'none', sm: 'block' } }}
    //     >
    //       MUI
    //     </Typography>
    //     <Box sx={{ display: { xs: 'none', sm: 'block' } }}>
    //       {navItems.map((item) => (
    //         <Button key={item} sx={{ color: '#fff' }}>
    //           {item}
    //         </Button>
    //       ))}
    //     </Box>
    //   </Toolbar>
    // </AppBar>
  );
};
