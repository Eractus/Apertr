import { combineReducers } from "redux";
import errorsReducer from "./errors_reducer";
import sessionReducer from "./session_reducer";
import photosReducer from "./photos_reducer";
import albumsReducer from "./albums_reducer";

const rootReducer = combineReducers({
  errors: errorsReducer,
  session: sessionReducer,
  photos: photosReducer,
  albums: albumsReducer
});

export default rootReducer;
