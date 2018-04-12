import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, Link, HashRouter} from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import UserCreateContainer from './user/user_create_container';
import SessionFormContainer from './session/session_form_container';
import { AuthRoute, ProtectedRoute } from '../util/route.util';
import SplashPageContainer from './main/splash_container';
import PhotoShowContainer from './photo/photo_show_container';
import PhotoCreateContainer from './photo/photo_create_container';
import PhotoIndexUserContainer from './photo/photo_index_user_container';
import AlbumCreateContainer from './album/album_create_container';
import AlbumIndexContainer from './album/album_index_container';
import AlbumShowContainer from './album/album_show_container';

const App = () => (
  <div>
  <NavbarContainer />
  <Switch>
    <AuthRoute exact path="/signup" component={UserCreateContainer} />
    <AuthRoute exact path="/login" component={SessionFormContainer} />
    <Route exact path="/" component={SplashPageContainer} />
    <ProtectedRoute exact path="/photos/new" component={PhotoCreateContainer} />
    <Route exact path="/photos/:photoId" component={PhotoShowContainer} />
    <Route exact path="/photos" component={PhotoIndexUserContainer} />
    <ProtectedRoute exact path="/albums/new" component={AlbumCreateContainer} />
    <Route exact path="/albums/:albumId" component={AlbumShowContainer} />
    <Route exact path="/albums" component={AlbumIndexContainer} />
    <Redirect from="/" to ="/" />
  </Switch>
  </div>
);

export default App;
