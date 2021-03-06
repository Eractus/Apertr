import React from 'react';
import { Route, Redirect, Switch } from 'react-router-dom';
import { AuthRoute, ProtectedRoute } from '../util/route.util';
import NavbarContainer from './navbar/navbar_container';
import SplashPageContainer from './splash/splash_container';
import UserCreateNav from './user/user_create_nav';
import UserCreateContainer from './user/user_create_container';
import SessionFormContainer from './session/session_form_container';
import PhotoIndexFeedContainer from './photo/photo_index_feed_container';
import UserShowContainer from './user/user_show_container';
import PhotoCreateNavContainer from './photo/photo_create_nav_container';
import PhotoCreateContainer from './photo/photo_create_container';
import PhotoShowContainer from './photo/photo_show_container';
import AlbumCreateNavContainer from './album/album_create_nav_container';
import AlbumCreateContainer from './album/album_create_container';
import AlbumShowContainer from './album/album_show_container';
import AlbumUpdateNavContainer from './album/album_update_nav_container'
import AlbumUpdateContainer from './album/album_update_container';
import SearchContainer from './search/search_container';
import Footer from './footer/footer';

const App = () => (
  <div>
    <Switch>
      <AuthRoute exact path="/signup" component={UserCreateNav} />
      <AuthRoute exact path="/login" component={UserCreateNav} />
      <ProtectedRoute exact path="/photos/upload" component={PhotoCreateNavContainer} />
      <ProtectedRoute exact path="/albums/new" component={AlbumCreateNavContainer} />
      <ProtectedRoute path="/albums/:albumId/edit" component={AlbumUpdateNavContainer} />
      <Route path="/" component={NavbarContainer} />
    </Switch>

    <Switch>
      <AuthRoute exact path="/signup" component={UserCreateContainer} />
      <AuthRoute exact path="/login" component={SessionFormContainer} />
      <AuthRoute exact path="/" component={SplashPageContainer} />
      <ProtectedRoute exact path="/feed" component={PhotoIndexFeedContainer} />
      <ProtectedRoute exact path="/users/:userId" component={UserShowContainer} />
      <ProtectedRoute exact path="/photos/upload" component={PhotoCreateContainer} />
      <ProtectedRoute path="/photos/:photoId" component={PhotoShowContainer} />
      <ProtectedRoute exact path="/albums/new" component={AlbumCreateContainer} />
      <ProtectedRoute path="/albums/:albumId/edit" component={AlbumUpdateContainer} />
      <ProtectedRoute path="/albums/:albumId" component={AlbumShowContainer} />
      <ProtectedRoute exact path="/search/photos/:searchParams" component={SearchContainer} />
      <Redirect to="/"/>
    </Switch>
    <Footer />
  </div>
);

export default App;
