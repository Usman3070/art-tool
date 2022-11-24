import React from "react";
import "./index.css";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Link,
  Routes,
} from "react-router-dom";

import { EditingPage } from "./EditingPage/EditingPage";
import { Error } from "./ErrorPage/Error.js";
import { Fluidity } from "./LoadingPage/Fluidity";
import { ThreeData } from "./ThreeDIntro.js/page";
import "./EditingPage/styles.css";
import { Uploading } from "./SelectionPage/Uploading";
import Edit from "./NewEditingPage/Edit";

export const Webpages = () => {
  return (
    <>
      <Router>
        <Routes>
          <Route exact path='/' element={<ThreeData />} />
          {/* <Route path='/Uploading' element={<Uploading />} /> */}
          <Route path='/editing' element={<EditingPage />} />
          <Route path='/loading' element={<Fluidity />} />
          <Route path='/error' element={<Error />} />
          <Route path='/sample' element={<Edit />} />
        </Routes>
      </Router>
    </>
  );
};
export default Webpages;
