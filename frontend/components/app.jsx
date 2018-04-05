import React from 'react';
import { Provider } from 'react-redux';
import { Route, Switch, Link, HashRouter} from 'react-router-dom';
import NavbarContainer from './navbar/navbar_container';
import UserFormContainer from './user/user_form_container';
import SessionFormContainer from './session/session_form_container';

const App = () => (
  <div>
    <header>
      <Link to="/" className="logo-link">
        <h1>Apertr</h1>
      </Link>
      <NavbarContainer />
    </header>
    <Switch>
      <Route path="/signup" component={UserFormContainer} />
      <Route path="/login" component={SessionFormContainer} />
    </Switch>
  </div>
);

export default App;
