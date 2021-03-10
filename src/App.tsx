import React from 'react';
import './App.scss';
import Header from './components/shared/header/header';
import Sidebar from './components/shared/sidebar/sidebar';
import {
  BrowserRouter as Router,
  Switch,
  Route
} from "react-router-dom";
import Homepage from './components/pages/homepage/homepage';
import NoMatch from './components/pages/no-match/no-match';
import Team from './components/pages/team/team';
import Game from './components/pages/game/game';

function App(): JSX.Element {
  return (
    <Router>
      <div className="App">
        <Header />
        <main>
          <Switch>
            <Route exact path="/">
              <Homepage />
            </Route>
            <Route path="/team/:id">
              <Team />
            </Route>
            <Route path="/game/:id">
              <Game />
            </Route>
            <Route path="*">
              <NoMatch />
            </Route>
          </Switch>
          <Sidebar />
        </main>
      </div>
    </Router>
  );
}

export default App;
