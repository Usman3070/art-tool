export const objectReducer = (state, action) => {
  switch (action.type) {
    case "update":
      const newState = [...state];
      newState.find((obj) => action.nameToFind === obj.name)[
        action.valueToChange
      ] = action.currentSlide;
      return newState;

    case "add":
      const newState1 = action.payload;
      return newState1;
    default:
      return state;
  }
};

export const TreeReducer = (state, action) => {
  switch (action.type) {
    case "update":
      // console.log("update: ", state);
      // console.log("update: ", action);
      const children = state.children;
      const newState = [...children];
      const val = newState[action.folderIndex].children[action.subfolderIndex];
      newState[action.folderIndex].children[action.subfolderIndex] = {
        ...val,
        rarity: action.value,
      };
      const finalResult = state;
      finalResult.children = newState;
      return finalResult;

    case "add":
      const newState1 = action.payload;
      return newState1;

    case "addShuffle":
      // console.log("update: ", state);
      // console.log("update: ", action);
      // const children2 = state.children;
      // const newState2 = [...children2];
      // const val2 = newState[action.folderIndex].children[action.subfolderIndex];
      // newState[action.folderIndex].children[action.subfolderIndex] = {
      //   ...val2,
      //   rarity: action.value,
      // };
      const finalResult2 = state;
      finalResult2.children = action.payload;
      return finalResult2;
    default:
      return state;
  }
};

export const selectionReducer = (state, action) => {
  // console.log(action, action.payload, "action");
  // console.log(state, "state");
  switch (action.type) {
    case "update":
      const newState = state;
      const { name } = action;
      newState.name = name;
      return newState;
    default:
      return state;
  }
};

export const totalElementsReducer = (state, action) => {
  switch (action.type) {
    case "update":
      const newState = state;
      const { value } = action;
      newState.value = value;
      return newState;
    default:
      return state;
  }
};
