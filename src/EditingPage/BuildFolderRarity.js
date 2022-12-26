import React from "react";
import ListItem from "@material-ui/core/ListItem";
import { TreeContext } from "./EditingPage";
import TreeItem from "@material-ui/lab/TreeItem";
import { Typography, TextField } from "@material-ui/core";
import "./buildFolder.css";
import AlienLogo from "./AlienLogo.png";

import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";

export const FoldersRarity = (props) => {
  const { dispatchMain } = React.useContext(TreeContext);
  const children = props.children;

  const handleRaritySet = (folderIndex, subfolderIndex, val) => {
    // dispatchMain({
    //   type: "update",
    //   value: val,
    //   folderIndex: folderIndex,
    //   subfolderIndex: subfolderIndex,
    // });
  };
  return (
    <div>
      {children &&
        children.map((folder, index1) => (
          <div>
            <Accordion className='accordian_root'>
              <AccordionSummary
                expandIcon={<ExpandMoreIcon style={{ color: "#CECECE" }} />}
                aria-controls='panel1a-content'
                id='panel1a-header'
              >
                <ListItem key={index1} button component='a' href='#'>
                  <Typography
                    className='rarityFolder'
                    style={{ fontFamily: "poppins-light", fontWeight: "bold" }}
                  >
                    {folder.name.slice(0, 1).toUpperCase() +
                      folder.name.slice(1)}
                  </Typography>
                </ListItem>
              </AccordionSummary>
              {folder.children.map((subfolder, index2) => (
                <div>
                  <AccordionDetails>
                    <ListItem key={index2} button component='a' href='#'>
                      <img
                        // src={require(`.${subfolder.path
                        //   .slice(15)
                        //   .replaceAll("\\", "/")}`)}
                        // alt="item"
                        // style={{ width: "120px", height:"100px", }}
                        src={`${process.env.REACT_APP_SERVERURL}${subfolder.path
                          .slice(15)
                          .replaceAll("\\", "/")}`}
                        height='60px'
                        width='60px'
                      />
                      <Typography
                        className='elementSubfolder'
                        style={{
                          fontFamily: "poppins-light",
                          // maxWidth: "30%",
                          marginLeft: "20px",
                        }}
                      >
                        {subfolder.name}
                      </Typography>
                      <Typography
                        style={{
                          fontFamily: "poppins-light",
                          maxWidth: "10%",
                          marginLeft: "3%",
                          color: "rgb(172, 172, 172)",
                        }}
                      >
                        Rarity:
                      </Typography>
                      <div
                        style={{
                          width: "25%",
                          paddingLeft: "2%",
                          color: "#fff",
                        }}
                      >
                        <TextField
                          className='rarityText'
                          size='small'
                          variant='outlined'
                          inputProps={{ style: { textAlign: "center" } }}
                          placeholder='out of 100'
                          onBlur={(event) => {
                            handleRaritySet(
                              index1,
                              index2,
                              parseInt(event.target.value)
                            );
                          }}
                        />
                      </div>
                    </ListItem>
                  </AccordionDetails>
                </div>
              ))}
              <TreeItem
                nodeId='1'
                label={
                  <ListItem root component='a' href='#'>
                    <Typography
                      styles={{ backgroundColor: "#034b92" }}
                    ></Typography>
                  </ListItem>
                }
              />
            </Accordion>
          </div>
        ))}
    </div>
  );
};
