import React, { useState } from "react";
import AddIcon from "@material-ui/icons/Add";
import { Tooltip } from "@material-ui/core";
import {
  Button,
  Card,
  CardContent,
  Grid,
  Paper,
  Typography,
  TextField,
} from "@mui/material";
import None from "../assets/images/None.png";
import { ObjectSelection } from "./EditingPage";

const NoneTrait = (props) => {
  const { handleFolderName } = React.useContext(ObjectSelection);
  const [noneTrait, setNoneTrait] = useState(false);
  const [data, setData] = useState(props.folderName);
  const addFields = () => {
    setNoneTrait(!noneTrait);
    props.handleFolderName();
  };
  function handleChange(event) {
    // Here, we invoke the callback with the new value
    props.onChange(event.target.value);
  }
  handleFolderName(data);
  return (
    <div>
      {noneTrait && (
        // <p></p>
        <Grid
          container
          style={{
            backgroundColor: "#4B4262",
            padding: "20px",
            borderRadius: "10px",
          }}
        >
          <Grid item xl={2.8} lg={2.8} md={2.8} sm={2.8} xs={2.8}>
            <div style={{ marginTop: "-15px" }}>
              <img src={None} />
            </div>
          </Grid>
          <Grid item xl={6.2} lg={6.2} md={6.2} sm={6.2} xs={6.2}>
            <TextField
              fullWidth
              variant='outlined'
              type='text'
              placeholder='None Trait'
            />
          </Grid>
          <Grid item xl={3} lg={3} md={3} sm={3} xs={3}>
            <div
              style={{
                color: "#fff",
              }}
            >
              <p>{data}</p>
              {/* {props?.number?.array[index1] !== undefined ? ( */}
              <TextField
                className='rarityText'
                size='small'
                variant='outlined'
                value={props.value}
                onChange={handleChange}
                inputProps={{
                  style: {
                    textAlign: "center",
                  },
                }}
                placeholder='0'
              />
              {/* ) : ( */}
              {/* <TextField
                className='rarityText'
                size='small'
                variant='outlined'
                inputProps={{
                  style: {
                    textAlign: "center",
                  },
                }}
                placeholder='out of 100'
                value={0}
              /> */}
              {/* ) */}
              {/* } */}
            </div>
          </Grid>
        </Grid>
      )}
      <div style={{ marginTop: "3%" }}>
        <Tooltip title='Add None trait optional' placement='top'>
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
            onClick={(e) => addFields(e)}
          >
            <AddIcon />
          </button>
        </Tooltip>
      </div>
    </div>
  );
};

export default NoneTrait;
