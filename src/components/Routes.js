import React from 'react';
import { Route, Switch } from 'react-router-dom';
import Earn from 'components/pages/Earn';
import Borrow from 'components/pages/Borrow';
import Trade from 'components/pages/Trade';
import NotFound from 'components/pages/NotFound';

export default function Routes() {
  return (
    <section>
      <Switch>
        <Route exact path='/earn' component={Earn} />
        <Route exact path='/borrow' component={Borrow} />
        <Route exact path='/trade' component={Trade} />
        <Route component={NotFound} />
      </Switch>
    </section>
  );
}
