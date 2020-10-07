import React from "react";
import {
  BrowserRouter as Router,
  Switch,
  Route,
  Redirect,
} from "react-router-dom";
import { GlobalStyle } from "components/common";

// Routes
import Earn from "components/pages/Earn";
import Borrow from "components/pages/Borrow";
import Trade from "components/pages/Trade";
import NotFound from "components/pages/NotFound";
import NetworkDetector from "./common/NetworkDetector";
// Redux
import { Provider } from "react-redux";
import store from "../redux/store";
import "../App.css";

const App = () => {
  return (
    <Provider store={store}>
      <GlobalStyle />
      <Router>
        <Switch>
          <Redirect exact from="/" to="/borrow" />
          <Route exact path="/earn" component={Earn} />
          <Route exact path="/borrow" component={Borrow} />
          <Route exact path="/trade" component={Trade}>
            <Redirect to="/borrow" />
          </Route>
          <Route component={NotFound} />
        </Switch>
      </Router>
    </Provider>
  );
};

export default NetworkDetector(App);