import React, { useEffect, useState } from "react";

import { Image } from "react-bootstrap";

import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import Navbar from "react-bootstrap/Navbar";
import NavDropdown from "react-bootstrap/NavDropdown";
import { NavLink } from "react-router-dom";
import background from "../Navbar/images/background.png";
import WebsiteLogo from "../Navbar/images/WebsiteLogo.png";
import { HashLink as Link } from "react-router-hash-link";
import "./style.css";
// import { RotatingLines } from "react-loader-spinner";

const Navb = () => {
  // const [loader, setLoader] = useState(true);
  // useEffect(() => {
  //   setTimeout(() => {
  //     setLoader(!loader);
  //   }, 4000);
  // }, []);

  return (
    // <>
    //   <div className="loader-main">
    //     {loader && (
    //       <RotatingLines
    //         strokeColor="#F150D7"
    //         strokeWidth="2"
    //         animationDuration="0.75"
    //         width="300"
    //         visible={true}
    //       />
    //     )}
    //   </div>
    //   {!loader && (
    <Navbar collapseOnSelect expand='lg' bg='dark' variant='dark'>
      <Container className='navbar-container'>
        <NavLink to='/'>
          {/* <Image src="/images/backgroudimg.png" className="navbar-logo1" /> */}
          {/* <Image src="/images/WebsiteLogo.png" className="navbar-logo2" /> */}
          <img src={background} className='navbar-logo1'></img>
          <img src={WebsiteLogo} className='navbar-logo2'></img>
        </NavLink>
        <Navbar.Toggle aria-controls='responsive-navbar-nav' />
        <Navbar.Collapse id='responsive-navbar-nav'>
          <Nav className='me-auto'>
            {/* <NavLink href="#features">Features</NavLink>
          <NavLink href="#pricing">Pricing</NavLink>
          <NavDropdown title="Dropdown" id="collasible-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">Action</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">
              Another action
            </NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">Something</NavDropdown.Item>
            <NavDropdown.Divider />
            <NavDropdown.Item href="#action/3.4">
              Separated link
            </NavDropdown.Item>
          </NavDropdown> */}
          </Nav>
          <Nav>
            <NavLink to='/'>HOME</NavLink>
            {/* mintingnow */}
            <NavLink to='/mintingnow'>MINTING NOW</NavLink>
            <NavLink eventkey={2} to='/'>
              UPCOMING MINTS
            </NavLink>
            {/* Create */}
            <NavLink to='/Create'>CREATE</NavLink>
            <NavDropdown title='WEB3 SERVICES' id='collasible-nav-dropdown'>
              <Link to='/#explore1'>
                <NavDropdown.Item href='#action/3.1' className='nav-drop-down'>
                  Raffles
                </NavDropdown.Item>
              </Link>
              <Link to='/#explore1'>
                <NavDropdown.Item
                  href='#action/3.2'
                  className='nav-drop-down11'
                >
                  Staking
                </NavDropdown.Item>
              </Link>
              <Link to='/#explore1'>
                <NavDropdown.Item href='/' className='nav-drop-down11'>
                  Auction House
                </NavDropdown.Item>
              </Link>
              <Link to='/#explore1'>
                <NavDropdown.Item href='/' className='nav-drop-down11'>
                  Mutations
                </NavDropdown.Item>
              </Link>
              <Link to='/#explore1'>
                <NavDropdown.Item href='/' className='nav-drop-down11'>
                  Art Upgrades
                </NavDropdown.Item>
              </Link>
              <Link to='/#explore1'>
                <NavDropdown.Item href='/' className='nav-drop-down12'>
                  Chain Games
                </NavDropdown.Item>
              </Link>
            </NavDropdown>
            <NavLink to='/'>NFT TOOL SUITE</NavLink>

            <NavDropdown
              title=' '
              id='navbarScrollingDropdown'
              className='navdropdown-image'
            >
              <NavDropdown.Item
                href='#action3'
                style={{ borderBottom: "1px solid rgb(85, 18, 140)" }}
              >
                <NavLink to='/mycollection'>My Collections</NavLink>
              </NavDropdown.Item>
              <NavDropdown.Item href='#action3'>
                <NavLink to='/mintingnow'>All Collections</NavLink>
              </NavDropdown.Item>
            </NavDropdown>
            {/* <NavDropdown title="CHAIN GAMES" id="collasible-nav-dropdown"> */}
            {/* <NavDropdown.Item href="/">WEB3 SERVICES</NavDropdown.Item>
              <NavDropdown.Item href="/">Another action</NavDropdown.Item>
              <NavDropdown.Item href="/">Something</NavDropdown.Item> */}
            {/* </NavDropdown> */}
          </Nav>
        </Navbar.Collapse>
      </Container>
    </Navbar>
    //   )}
    // </>
  );
};

export default Navb;
