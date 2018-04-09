import { combineReducers } from "redux";
import errorsReducer from "./errors_reducer";
import sessionReducer from "./session_reducer";
import photosReducer from "./photos_reducer";

const rootReducer = combineReducers({
  errors: errorsReducer,
  session: sessionReducer,
  photos: photosReducer
});

export default rootReducer;
