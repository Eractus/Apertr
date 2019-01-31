import { combineReducers } from "redux";
import errorsReducer from "./errors_reducer";
import sessionReducer from "./session_reducer";
import usersReducer from "./users_reducer";
import photosReducer from "./photos_reducer";
import albumsReducer from "./albums_reducer";
import commentsReducer from "./comments_reducer";
import tagsReducer from "./tags_reducer";
import favesReducer from "./faves_reducer";
import searchReducer from "./search_reducer";

const rootReducer = combineReducers({
  errors: errorsReducer,
  session: sessionReducer,
  users: usersReducer,
  photos: photosReducer,
  albums: albumsReducer,
  comments: commentsReducer,
  tags: tagsReducer,
  faves: favesReducer,
  search: searchReducer
});

export default rootReducer;
