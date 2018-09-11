import { combineReducers } from "redux";
import sessionErrorsReducer from "./session_errors_reducer";
import photoErrorsReducer from "./photo_errors_reducer";
import albumErrorsReducer from "./album_errors_reducer";
import commentErrorsReducer from "./comment_errors_reducer";
import tagErrorsReducer from "./tag_errors_reducer";

const errorsReducer = combineReducers({
  session: sessionErrorsReducer,
  photo: photoErrorsReducer,
  album: albumErrorsReducer,
  comment: commentErrorsReducer,
  tag: tagErrorsReducer
});

export default errorsReducer;
