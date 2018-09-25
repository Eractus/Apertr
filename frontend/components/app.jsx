import React from 'react';
import { Provider } from 'react-redux';
import { Route, Redirect, Switch, Link, HashRouter} from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import { AuthRoute, ProtectedRoute } from '../util/route.util';
import UserCreateNav from './user/user_create_nav';
import UserCreateContainer from './user/user_create_container';
import SessionFormContainer from './session/session_form_container';
import SplashPageContainer from './main/splash_container';
import UserShowContainer from './user/user_show_container';
import PhotoCreateNavContainer from './photo/photo_create_nav_container';
import PhotoCreateContainer from './photo/photo_create_container';
import PhotoShowContainer from './photo/photo_show_container';
import PhotoIndexUserContainer from './photo/photo_index_user_container';
import AlbumCreateContainer from './album/album_create_container';
import AlbumIndexContainer from './album/album_index_container';
import AlbumShowContainer from './album/album_show_container';
import AlbumUpdateContainer from './album/album_update_container';
import SearchContainer from './search/search_container';
import Footer from './footer/footer';

const App = () => (
  <div>
    <Switch>
      <AuthRoute exact path="/signup" component={UserCreateNav} />
      <AuthRoute exact path="/login" component={UserCreateNav} />
      <ProtectedRoute exact path="/photos/new" component={PhotoCreateNavContainer} />
      <Route path="/" component={NavbarContainer} />
    </Switch>

    <Switch>
      <AuthRoute exact path="/signup" component={UserCreateContainer} />
      <AuthRoute exact path="/login" component={SessionFormContainer} />
      <ProtectedRoute exact path="/users/:userId" component={UserShowContainer} />
      <ProtectedRoute exact path="/photos/new" component={PhotoCreateContainer} />
      <ProtectedRoute path="/photos/:photoId" component={PhotoShowContainer} />
      <ProtectedRoute exact path="/albums/new" component={AlbumCreateContainer} />
      <ProtectedRoute path="/albums/:albumId/edit" component={AlbumUpdateContainer} />
      <ProtectedRoute path="/albums/:albumId" component={AlbumShowContainer} />
      <ProtectedRoute exact path="/search/photos/:searchParams" component={SearchContainer} />
      <Route exact path="/" component={SplashPageContainer} />
      <Redirect from='/' to="/"/>
    </Switch>
    <Footer />
  </div>
);

export default App;
