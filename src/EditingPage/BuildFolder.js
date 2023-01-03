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
import None from "../assets/images/None.png";
// ===========
import Accordion from "@material-ui/core/Accordion";
import AccordionSummary from "@material-ui/core/AccordionSummary";
import AccordionDetails from "@material-ui/core/AccordionDetails";
import AddIcon from "@material-ui/icons/Add";
import RemoveIcon from "@mui/icons-material/Remove";
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
import NoneTrait from "./NoneTrait";
import BasicModal from './ShareModal';

export const Folders = (props) => {
  const { dispatchMain } = React.useContext(TreeContext);
  const { objects, dispatch1 } = React.useContext(ObjectContext);
  const {rarityModal,rarityModalMethod} =
    React.useContext(ObjectSelection);
  const children = props.children;
  let folderStructure = [];
  // const classes = useStyles();
  const [list, setList] = useState();
  const [value, setValue] = React.useState("");

  const handleClick = (folder, subfolder) => {
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
  }, [setList.children]);

  const handleRaritySet = (folderIndex, subfolderIndex, val) => {
    // alert(`Value: ${val}`);
    let num = 0;
    if (isNaN(parseFloat(val))) {
      val = 0;
    }
    if (props?.number?.array[folderIndex] !== undefined) {
      props?.number?.array[folderIndex].map((innerData, i) => {
        if (subfolderIndex !== i) {
          num += innerData;
        }
      });
    }
    if (num + parseFloat(val) > 100) {
      rarityModalMethod(true)
      return;
    }

    props.setNumber((data) => {
      let tempData = [...data?.array];
      console.log(tempData, "tempData");
      if (tempData[folderIndex] === undefined) {
        tempData[folderIndex] = [];
      }
      tempData[folderIndex][subfolderIndex] = parseFloat(val);
      return { index: folderIndex, array: tempData };
    });
    // console.log("val: ", val);
    // console.log("folderIndex: ", folderIndex);
    // console.log("subfolderIndex: ", subfolderIndex);
    // dispatchMain({
    //   type: "update",
    //   value: val,
    //   folderIndex: folderIndex,
    //   subfolderIndex: subfolderIndex,
    // });
  };
  const handleRenameArray = (e, i, j) => {
    setList((tempArray) => {
      const data = [...tempArray];
      console.log(data, "daaatttaaa");
      data[i].children[j].name = e.target.value;
      return data;
    });
  };

  const handleRename = async (e, path) => {
    console.log("functin exec");
    let from = path.replaceAll("\\", "/");
    let indexForName = from.lastIndexOf("/");
    let to = from.slice(0, indexForName + 1) + e.target.value;
    let body = {
      from,
      to,
    };
    const baseURL = `${process.env.REACT_APP_SERVERURL}/renameFile`;
    await axios.post(baseURL, body);
    // props.setFlag(!props.flag);
  };

  const handleChange = (newValue) => {
    setValue(newValue);
  };

  const addFields = (e, folder) => {
    console.log(folder.name, "folderKaNaam");
    let none = {
      name: "None.png",
      path: "src\\assets\\images\\None.png",
    };
    let tempList = [];
    list.map((listFolder) => {
      if (listFolder.name === folder.name) {
        listFolder.children.push(none);
        listFolder.children.map((item) => {});
      }
      tempList.push(listFolder);
    });
    setList(tempList);
    // handleDragEnd();
    // folder.children.push(none);
  };
  const removeFields = (e, folder) => {
    console.log(folder, "folder");
    let templist = [];
    list.map((listFolder) => {
      if (listFolder.name === folder.name) {
        listFolder.children.pop();
      }
      templist.push(listFolder);
    });
    setList(templist);
  };
  const [expand, setExpand] = React.useState("false");

  return (
    <div>
      {rarityModal && <BasicModal title='Rarity must be 100 for each trait'/>}
      <Paper style={{ maxHeight: 460, overflow: "auto", width: "470px" }}>
        <List sx={{ width: "400px" }}>
          <Card sx={{ minWidth: 275 }}>
            <CardContent>
              <DragDropContext onDragEnd={handleDragEnd}>
                <Droppable droppableId='characters'>
                  {(provided) => (
                    <div {...provided.droppableProps} ref={provided.innerRef}>
                      {list &&
                        list.map((folder, index1) => (
                          <div style={{}}>
                            <Accordion
                              className='accordian_root'
                              // defaultExpanded={expand}
                              // expanded={expand}
                            >
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
                                        style={{
                                          color: "#fff",
                                        }}
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
                                      // href='#'
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
                                          folder.name
                                            .slice(1)
                                            .replace(".png", "")}
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
                                        // href='#'
                                        style={{
                                          borderBottom: "1px solid #2F2861",
                                        }}
                                      >
                                        <Grid container spacing={2}>
                                          <Grid
                                            item
                                            xl={2.8}
                                            lg={2.8}
                                            md={2.8}
                                            sm={2.8}
                                            xs={2.8}
                                          >
                                            <div style={{ marginTop: "-15px" }}>
                                              <img
                                                src={
                                                  subfolder?.name !== "None.png"
                                                    ? `${
                                                        process.env
                                                          .REACT_APP_SERVERURL
                                                      }${subfolder?.path
                                                        ?.slice(15)
                                                        ?.replaceAll(
                                                          "\\",
                                                          "/"
                                                        )}`
                                                    : None
                                                }
                                              />
                                            </div>
                                          </Grid>
                                          <Grid
                                            item
                                            xl={6.2}
                                            lg={6.2}
                                            md={6.2}
                                            sm={6.2}
                                            xs={6.2}
                                          >
                                            {/* <Typography
                                              className='elementSubfolder'
                                              style={{
                                                fontFamily: "Poppins",
                                              }}
                                            > */}
                                            <TextField
                                              fullWidth
                                              variant='outlined'
                                              type='text'
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
                                              value={subfolder?.name?.replace(
                                                ".png",
                                                ""
                                              )}
                                            />
                                            {/* {console.log(
                                              subfolder.name,
                                              "subfolderr"
                                            )} */}
                                            {/* {subfolder.name} */}
                                            {/* </Typography> */}
                                          </Grid>
                                          <Grid
                                            item
                                            xl={3}
                                            lg={3}
                                            md={3}
                                            sm={3}
                                            xs={3}
                                          >
                                            <div
                                              style={{
                                                color: "#fff",
                                              }}
                                            >
                                              {props?.number?.array[index1] !==
                                              undefined ? (
                                                <TextField
                                                  className='rarityText'
                                                  size='small'
                                                  variant='outlined'
                                                  // value={0}
                                                  // type='number'
                                                  inputProps={{
                                                    style: {
                                                      textAlign: "center",
                                                    },
                                                  }}
                                                  placeholder='eg.'
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
                                                  className='rarityText'
                                                  size='small'
                                                  variant='outlined'
                                                  // type='number'
                                                  inputProps={{
                                                    style: {
                                                      textAlign: "center",
                                                    },
                                                  }}
                                                  placeholder='out of 100'
                                                  value={0}
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
                                              )}
                                            </div>
                                          </Grid>
                                        </Grid>
                                      </ListItem>
                                    </AccordionDetails>
                                  </div>
                                ))}
                                <button
                                  style={{
                                    width: "40px",
                                    backgroundColor: "#1565C0",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    borderColor: "#1565C0",
                                    height: "30px",
                                    cursor: "pointer",
                                  }}
                                  onClick={(e) => addFields(e, folder)}
                                >
                                  <AddIcon />
                                </button>
                                <button
                                  style={{
                                    width: "40px",
                                    backgroundColor: "red",
                                    borderRadius: "8px",
                                    color: "#fff",
                                    borderColor: "red",
                                    height: "30px",
                                    cursor: "pointer",
                                    marginLeft: "2%",
                                  }}
                                  onClick={(e) => removeFields(e, folder)}
                                >
                                  <RemoveIcon />
                                </button>

                                {/* <NoneTrait
                                  folderName={folder.name}
                                  value={value}
                                  onChange={handleChange}
                                  handleFolderName={handleFolderName}
                                /> */}
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
