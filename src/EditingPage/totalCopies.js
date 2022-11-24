import React from "react";
import { Typography, TextField } from "@material-ui/core";
const TotalCopies = () => {
  return (
    <div>
      <p>Supply</p>
      <div
      // style={{
      //   display: "flex",
      //   justifyContent: "center",
      //   border: "1px solid #32306A !important",
      // }}
      >
        <TextField
          // className='editor_textfield'
          id='contact phone number'
          variant='outlined'
          //   label="Contact phone number"
          type='number'
          //   value={this.state.contactPhoneNumber}
          //   onChange={this.handleChange('contactPhoneNumber')}
          placeholder='0'
          margin='normal'
        />
      </div>
    </div>
  );
};

export default TotalCopies;
