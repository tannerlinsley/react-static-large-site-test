import React from "react";
import { Router, Link } from "react-static";
//
import Routes from "react-static-routes";

if (!process.env.STYLE_SYSTEM) {
  require("./app.css");
}

const App = () => (
  <Router>
    <div>
      <nav>
        <Link exact to="/">
          Home
        </Link>
        <Link to="/about">About</Link>
        <Link to="/blog">Blog</Link>
      </nav>
      <div className="content">
        <Routes />
      </div>
    </div>
  </Router>
);

export default App;
