import { combineReducers } from "redux";
import { HYDRATE } from "next-redux-wrapper";

// Reducers
//import geoReducer from "./geoReducer";
import countReducer from "../count/reducer";
import tickReducer from "../tick/reducer";

const reducersCombined = combineReducers({
  //geo: geoReducer,
  count: countReducer,
  tick: tickReducer,
});

export default (state, action) => {
  if (action.type === HYDRATE) {
    const nextState = {
      ...state, // use previous state
      ...action.payload, // apply delta from hydration
    };
    // To preserve state between pages
    if (state.count) nextState.count = state.count; // preserve count value on client side navigation
    return nextState;
  } else {
    return reducersCombined(state, action);
  }
};
