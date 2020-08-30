import React from 'react';
import { BrowserRouter as Router, Switch, Route } from 'react-router-dom';
import { GlobalStyle } from 'components/common';

// Routes
import Home from 'components/pages/Home';
import Earn from 'components/pages/Earn';
import Borrow from 'components/pages/Borrow';
import Trade from 'components/pages/Trade';
import NotFound from 'components/pages/NotFound';

// Redux
import { Provider } from 'react-redux';
import store from '../redux/store';

const App = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Route exact path='/' component={Home} />
          <Route exact path='/earn' component={Earn} />
          <Route exact path='/borrow' component={Borrow} />
          <Route exact path='/trade' component={Trade} />
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default App;
