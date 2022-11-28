import React, { Component, useState } from "react";
import { makeStyles } from "@material-ui/core/styles";
import List from "@material-ui/core/List";
import ListItem from "@material-ui/core/ListItem";
import ListItemText from "@material-ui/core/ListItemText";
import { NumberOfCopies, ObjectContext, ObjectSelection } from "./EditingPage";
import { useTheme } from "@material-ui/core/styles";
import { TreeView } from "@material-ui/lab";
import TreeItem from "@material-ui/lab/TreeItem";
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

  // console.log(folderStructure, "structure");
  console.log(children, "childrens");

  const handleDragEnd = (result) => {
    // if (!result.destination) return;
    const items = Array.from(list);
    const [reorderedItem] = items.splice(result.source.index, 1);
    items.splice(result.destination.index, 0, reorderedItem);
    setList(items);
    dispatch1({
      type: "update",
      nameToFind: result?.draggableId,
      valueToChange: "depth",
      currentSlide: result?.destination?.index,
    });
  };

  React.useEffect(() => {
    setList(children);
  }, [children]);

  console.log(list, "list");

  const handleRaritySet = (folderIndex, subfolderIndex, val) => {
    dispatchMain({
      type: "update",
      value: val,
      folderIndex: folderIndex,
      subfolderIndex: subfolderIndex,
    });
  };

  return (
    <div>
      <Paper style={{ maxHeight: 465, overflow: "auto" }}>
        <List>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='characters'>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {list &&
                        list.map((folder, index1) => (
                          <div style={{}}>
                            <Accordion className='accordian_root'>
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
                                    aria-controls='panel1a-content'
                                    id='panel1a-header'
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
                                      component='a'
                                      href='#'
                                      // style={{ width: "60%" }}
                                    >
                                      <Typography
                                        // style={{  }}
                                        className='element'
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
                                        component='a'
                                        href='#'
                                        style={{
                                          borderBottom: "1px solid #2F2861",
                                        }}
                                      >
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={6}
                                          >
                                            {/* <Typography
                                              className='elementSubfolder'
                                              style={{
                                                fontFamily: "Poppins",
                                              }}
                                            > */}
                                            <TextField
                                              fullWidth
                                              variant='filled'
                                              type='text'
                                              value={subfolder.name}
                                            />
                                            {/* {subfolder.name} */}
                                            {/* </Typography> */}
                                          </Grid>
                                          <Grid
                                            item
                                            xl={6}
                                            lg={6}
                                            md={6}
                                            sm={6}
                                            xs={6}
                                          >
                                            <div
                                              style={{
                                                color: "#fff",
                                              }}
                                            >
                                              <TextField
                                                className='rarityText'
                                                size='small'
                                                variant='outlined'
                                                inputProps={{
                                                  style: {
                                                    textAlign: "center",
                                                  },
                                                }}
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
                                          </Grid>
                                        </Grid>
                                      </ListItem>
                                    </AccordionDetails>
                                  </div>
                                ))}
                              </div>
                              <TreeItem
                                nodeId='1'
                                label={
                                  <ListItem root component='a' href='#'>
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
