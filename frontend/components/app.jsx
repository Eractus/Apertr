import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Link, HashRouter} from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import UserFormContainer from './user/user_form_container';
import SessionFormContainer from './session/session_form_container';
import { AuthRoute } from '../util/route.util';
import SplashPageContainer from './main/splash_container';
import Footer from './footer/footer';

const App = () => (
  <div>
  <NavbarContainer />
  <Footer />
  <Switch>
    <AuthRoute exact path="/signup" component={UserFormContainer} />
    <AuthRoute exact path="/login" component={SessionFormContainer} />
    <Route exact path="/" component={SplashPageContainer} />
  </Switch>
  </div>
);

export default App;
