import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import { useTheme } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import TreeItem from "@material-ui/lab/TreeItem";
import axios from "axios";
import "./buildFolder.css";

// ===========
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";

import ExpandMoreIcon from "@material-ui/icons/ExpandMore";
import { DragDropContext, Droppable, Draggable } from "react-beautiful-dnd";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import { TreeContext } from "./EditingPage";

// const useStyles = makeStyles((theme) => ({
//   root: {
//     width: '100%',
//     backgroundColor: "red !important",
//   },
//   heading: {
//     fontSize: theme.typography.pxToRem(15),
//     fontWeight: theme.typography.fontWeightRegular,
//   },
// }));

// ==============

export const Folders = (props) => {
  const { dispatchMain } = React.useContext(TreeContext);
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const { selection, dispatch2 } = React.useContext(ObjectSelection);
  const children = props.children;
  let folderStructure = [];
  // const classes = useStyles();
  const [list, setList] = useState();
  const handleClick = (folder, subfolder) => {
    //console.log(objects, "folder: ", folder, subfolder, "index: ", index);
    dispatch1({
      type: "update",
      nameToFind: folder,
      valueToChange: "path",
      currentSlide: subfolder.path.slice(3),
    });
  };

  const handleDragEnd = (result) => {
    // if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
    items?.map((data, i) => {
      dispatch1({
        type: "update",
        nameToFind: data?.name,
        valueToChange: "depth",
        currentSlide: i,
      });
    });
  };

  React.useEffect(() => {
    setList(children);
  }, [children]);

  const handleRaritySet = (folderIndex, subfolderIndex, val) => {
    let num = 0;
    props?.number?.array[folderIndex].map((innerData) => {
      num += innerData;
    });
    if (num + parseFloat(val) > 100) {
      alert("value greater then 100 not allowed");
      return;
    }
    if (isNaN(parseFloat(val))) {
      val = 0;
    }
    props.setNumber((data) => {
      let tempData = [...data?.array];
      if (tempData[folderIndex] === undefined) {
        tempData[folderIndex] = [];
      }
      tempData[folderIndex][subfolderIndex] = parseFloat(val);
      return { index: folderIndex, array: tempData };
    });
    dispatchMain({
      type: "update",
      value: val,
      folderIndex: folderIndex,
      subfolderIndex: subfolderIndex,
    });
  };
  const handleRenameArray = (e, i, j) => {
    setList((tempArray) => {
      const data = [...tempArray];
      data[i].children[j].name = e.target.value;
      return data;
    });
  };

  const handleRename = async (e, path) => {
    let from = path.replaceAll("\\", "/");
    let indexForName = from.lastIndexOf("/");
    let to = from.slice(0, indexForName + 1) + e.target.value;
    let body = {
      from,
      to,
    };
    const baseURL = `${process.env.REACT_APP_SERVERURL}/renameFile`;
    await axios.post(baseURL, body);
    props.setFlag(!props.flag);
  };
  return (
    <div>
      <Paper style={{ maxHeight: 560, overflow: "auto" }}>
        <List>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId="characters">
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {list &&
                        list.map((folder, index1) => (
                          <div style={{}}>
                            <Accordion className="accordian_root">
                              <Draggable
                                key={
                                  folder.name.slice(0, 1).toUpperCase() +
                                  folder.name.slice(1)
                                }
                                draggableId={
                                  folder.name.slice(0, 1).toUpperCase() +
                                  folder.name.slice(1)
                                }
                                index={index1}
                              >
                                {(provided) => (
                                  <AccordionSummary
                                    expandIcon={
                                      <ExpandMoreIcon
                                        style={{ color: "#111" }}
                                      />
                                    }
                                    aria-controls="panel1a-content"
                                    id="panel1a-header"
                                  >
                                    {/* <Typography
                                  sx={{ fontSize: "10px", marginTop: "5%" }}
                                >
                                  Rarity %: 0/100
                                </Typography> */}

                                    <ListItem
                                      {...provided.draggableProps}
                                      {...provided.dragHandleProps}
                                      ref={provided.innerRef}
                                      button
                                      component="a"
                                      href="#"
                                      // style={{ width: "60%" }}
                                    >
                                      <Typography
                                        // style={{  }}
                                        className="element"
                                        // eslint-disable-next-line react/jsx-no-duplicate-props
                                        style={{
                                          fontWeight: "bold",
                                          // fontFamily: "monospace",
                                          backgroundColor: "rgba(0, 0, 0, 0.2)",
                                        }}
                                      >
                                        {folder.name.slice(0, 1).toUpperCase() +
                                          folder.name.slice(1)}
                                      </Typography>
                                    </ListItem>
                                  </AccordionSummary>
                                )}
                              </Draggable>
                              {provided.placeholder}
                              <div>
                                {folder.children.map((subfolder, index2) => (
                                  <div
                                    onClick={() =>
                                      handleClick(folder.name, subfolder)
                                    }
                                  >
                                    <AccordionDetails>
                                      <ListItem
                                        key={index2}
                                        button
                                        component="a"
                                        href="#"
                                        style={{
                                          borderBottom: "1px solid #2F2861",
                                        }}
                                      >
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
                                          >
                                            <img
                                              src={`${
                                                process.env.REACT_APP_SERVERURL
                                              }${subfolder.path
                                                .slice(15)
                                                .replaceAll("\\", "/")}`}
                                            />
                                          </Grid>
                                          <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
                                          >
                                            {/* <Typography
                                              className='elementSubfolder'
                                              style={{
                                                fontFamily: "Poppins",
                                              }}
                                            > */}
                                            <TextField
                                              fullWidth
                                              variant="filled"
                                              type="text"
                                              onChange={(e) => {
                                                handleRenameArray(
                                                  e,
                                                  index1,
                                                  index2
                                                );
                                              }}
                                              onBlur={(e) => {
                                                handleRename(
                                                  e,
                                                  subfolder?.path
                                                );
                                              }}
                                              value={subfolder.name.replace(
                                                ".png",
                                                ""
                                              )}
                                            />
                                            {/* {subfolder.name} */}
                                            {/* </Typography> */}
                                          </Grid>
                                          <Grid
                                            item
                                            xl={4}
                                            lg={4}
                                            md={4}
                                            sm={4}
                                            xs={4}
                                          >
                                            <div
                                              style={{
                                                color: "#fff",
                                              }}
                                            >
                                              {props?.number?.array[index1] !==
                                              undefined ? (
                                                <TextField
                                                  className="rarityText"
                                                  size="small"
                                                  variant="outlined"
                                                  type="number"
                                                  inputProps={{
                                                    style: {
                                                      textAlign: "center",
                                                    },
                                                  }}
                                                  placeholder="out of 100"
                                                  value={
                                                    props?.number?.array[
                                                      index1
                                                    ][index2]
                                                  }
                                                  onMouseEnter={(event) => {
                                                    handleRaritySet(
                                                      index1,
                                                      index2,
                                                      event.target.value
                                                    );
                                                  }}
                                                  onChange={(event) => {
                                                    handleRaritySet(
                                                      index1,
                                                      index2,
                                                      event.target.value
                                                    );
                                                  }}
                                                />
                                              ) : (
                                                <TextField
                                                  className="rarityText"
                                                  size="small"
                                                  variant="outlined"
                                                  type="number"
                                                  inputProps={{
                                                    style: {
                                                      textAlign: "center",
                                                    },
                                                  }}
                                                  placeholder="out of 100"
                                                  value={0}
                                                  onChange={(event) => {
                                                    handleRaritySet(
                                                      index1,
                                                      index2,
                                                      event.target.value
                                                    );
                                                  }}
                                                />
                                              )}
                                            </div>
                                          </Grid>
                                        </Grid>
                                      </ListItem>
                                    </AccordionDetails>
                                  </div>
                                ))}
                              </div>
                              <TreeItem
                                nodeId="1"
                                label={
                                  <ListItem root component="a" href="#">
                                    <Typography
                                      styles={{ backgroundColor: "#034b92" }}
                                    >
                                      {" "}
                                    </Typography>
                                  </ListItem>
                                }
                              />
                            </Accordion>
                          </div>
                        ))}
                    </div>
                  )}
                </Droppable>
              </DragDropContext>
            </CardContent>
          </Card>
        </List>
      </Paper>
    </div>
  );
};
