import { createStore, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";
import thunk from "redux-thunk";

import reducer from "./reducers";

const bindMiddleware = (middleware) => {
  if (process.env.NODE_ENV !== "production") {
    return composeWithDevTools(applyMiddleware(...middleware));
  }
  return applyMiddleware(...middleware);
};

const initialState = {};

const middleware = [thunk];

// create a makeStore function
const makeStore = (context) =>
  createStore(reducer, initialState, bindMiddleware(middleware));
//createStore(reducer, applyMiddleware(thunk));

// export an assembled wrapper
export const wrapper = createWrapper(makeStore);
