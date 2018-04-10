import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Link, HashRouter} from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import UserCreateContainer from './user/user_create_container';
import SessionFormContainer from './session/session_form_container';
import { AuthRoute, ProtectedRoute } from '../util/route.util';
import SplashPageContainer from './main/splash_container';
import PhotoShowContainer from './photo/photo_show_container';
import PhotoCreateContainer from './photo/photo_create_container';

const App = () => (
  <div>
  <NavbarContainer />
  <Switch>
    <AuthRoute exact path="/signup" component={UserCreateContainer} />
    <AuthRoute exact path="/login" component={SessionFormContainer} />
    <Route exact path="/" component={SplashPageContainer} />
    <ProtectedRoute exact path="/photos/new" component={PhotoCreateContainer} />
    <Route exact path="/photos/:photoId" component={PhotoShowContainer} />
  </Switch>
  </div>
);

export default App;
