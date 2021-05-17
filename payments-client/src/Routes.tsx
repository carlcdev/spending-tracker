import { Route, Switch, Redirect } from 'react-router-dom';
import { Account } from './pages/Account';

export function Routes() {
  return (
    <Switch>
      <Route exact path="/account/12345678" component={Account} /> { /* Hardcoded account id */ }
      <Redirect exact from="/" to="/account/12345678" />
    </Switch>
  );
}
