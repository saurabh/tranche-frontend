import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GlobalStyle } from 'components/common';

// Routes
import Home from 'components/pages/Home';
import Routes from 'components/Routes';

// Redux
import { Provider } from 'react-redux';
import store from '../store';

const App = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Routes component={Routes} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
