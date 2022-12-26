import React from "react";
import {
  objectReducer,
  selectionReducer,
  totalElementsReducer,
  TreeReducer,
} from "./ObjectReducer";
import { Page } from "./Page";
import CssBaseline from "@material-ui/core/CssBaseline";
import { NavComponent } from "./Navbar";
import axios from "axios";
import "./Editor.css";

export const ObjectContext = React.createContext();
export const ObjectSelection = React.createContext();
export const NumberOfCopies = React.createContext();
export const TreeContext = React.createContext();

export const EditingPage = () => {
  const baseURL = `${process.env.REACT_APP_SERVERURL}/getFolderTree`;

  const [fileData, setFileData] = React.useState(null);
  const [flag, setFlag] = React.useState(false);

  let selection = null;
  let objects = [];
  let total = { value: 100 };

  const getTree = async () => {
    const data = await axios.get(baseURL, {
      params: { uuid: JSON.parse(sessionStorage.uuid) },
    });
    //const data = await response.json();
    setFileData(data.data);
  };

  React.useEffect(() => {
    getTree();
  }, [flag]);

  const subfoldersLength =
    fileData && fileData.children && fileData.children.length;
  const hashCodeElement = [];
  const pathList = [];

  for (let i = 0; i < subfoldersLength; i++) {
    fileData &&
      fileData.children &&
      pathList.push(fileData.children[i].children[0].path.slice(3));
  }

  for (let i = 0; i < subfoldersLength; i++) {
    hashCodeElement.push({
      name: fileData.children.length ? fileData.children[i].name : null,
      path: pathList[i],
    });
  }

  const getObjects = (files) => {
    const objects = [];

    subfoldersLength &&
      files &&
      files.map((obj) => {
        objects.push({
          name: obj.name,
          path: obj.path,
          height: 300,
          width: 300,
          depth: 0,
          x: 0,
          y: 0,
        });
      });
    return objects;
  };

  objects = getObjects(hashCodeElement);

  React.useEffect(() => {
    dispatchMain({ type: "add", payload: fileData });
    dispatch1({ type: "add", payload: objects });
    dispatch2({
      type: "update",
      name: hashCodeElement.length ? hashCodeElement[0].name : null,
    });
  }, [fileData]);

  selection = { name: hashCodeElement[0] };
  total = { value: 100 };

  const [TreeState, dispatchMain] = React.useReducer(
    TreeReducer,
    fileData?.children
  );

  const [ObjectState, dispatch1] = React.useReducer(objectReducer, objects);
  const [SelectionState, dispatch2] = React.useReducer(
    selectionReducer,
    selection
  );
  const [NumberOfCopiesState, dispatch3] = React.useReducer(
    totalElementsReducer,
    total
  );

  const [trigger, setTrigger] = React.useState(false);

  const triggerMethod = (val) => {
    setTrigger(val);
  };

  const [downloadBtn, setDownloadBtn] = React.useState(true);
  const downloadHandle = (val) => {
    setDownloadBtn(val);
  };
  const [folderName, setFolderName] = React.useState();
  const handleFolderName = (val) => {
    setFolderName(val);
  };
  const [shareState, setShareState] = React.useState(false);
  const shareStateMethod = (val) => {
    setShareState(val);
  };
  // const [rarityCheck, setRarityCheck] = React.useState(true);
  // const rarityCheckMethod = (val) => {
  //   setShareState(val);
  // };
  return (
    <TreeContext.Provider value={{ fileData: TreeState, dispatchMain }}>
      <ObjectContext.Provider value={{ objects: ObjectState, dispatch1 }}>
        <ObjectSelection.Provider
          value={{
            selection: SelectionState,
            dispatch2,
            trigger,
            triggerMethod,
            downloadBtn,
            downloadHandle,
            handleFolderName,
            folderName,
            shareState,
            setShareState,
            shareStateMethod,
            // setRarityCheck,
            // rarityCheckMethod,
          }}
        >
          <NumberOfCopies.Provider
            value={{ total: NumberOfCopiesState, dispatch3 }}
          >
            <CssBaseline>
              {/* <div style={{ maxHeight: "20px", zIndex: 21 }}>
                <NavComponent folderStructure={fileData} />
              </div> */}
              <div className='editClass'>
                <Page
                  flag={flag}
                  setFlag={setFlag}
                  folderStructure={fileData}
                  selection={selection}
                  hashedElements={objects}
                />
              </div>
            </CssBaseline>
          </NumberOfCopies.Provider>
        </ObjectSelection.Provider>
      </ObjectContext.Provider>
    </TreeContext.Provider>
  );
};
