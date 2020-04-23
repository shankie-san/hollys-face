import React, { ReactNode } from "react";
import ErrorBoundary from "./ErrorBoundary";
import { BrowserRouter as Router } from "react-router-dom";

import Puzzle from "./components/Puzzle.js";
import Footer from "./components/Footer.js";

import UserProvider from "./UserProvider";

import "./scss/index.scss";
import Login from "./components/Login";

type Props = {
  children: ReactNode;
};

const App = () => (
  <Router>
    <UserProvider>
      <ErrorBoundary>
        <div className="site-wrapper">
          <div className="site-inner">
            <Login />
            <Puzzle />
          </div>
        </div>
        <Footer />
      </ErrorBoundary>
    </UserProvider>
  </Router>
);

export default App;
