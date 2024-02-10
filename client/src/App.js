import React, { Component } from "react";
import { createBrowserRouter, RouterProvider } from "react-router-dom";

import HomeAdmin from "./pages/adminHome";
import HomeParticipant from "./pages/participantHome";
import Vote from "./pages/Vote";
import Home from "./pages/Home";
import Suggest from "./pages/Suggest";
import Suggestions from "./pages/Suggestions";
import Navbar from "./components/Navbar";
import Footer from "./components/Footer";
import Votes from "./pages/Votes";
import ParticipantResults from "./pages/participantResults";
import AdminResults from "./pages/adminResults";
import HomeAdminCheck from "./pages/adminCheck";
import HomeAdminInfo from "./pages/adminInfo";
import "./style.scss";

const router = createBrowserRouter([
  {
    path: "/",
    element: (
      <React.Fragment>
        <Navbar />
        <Home />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant",
    element: (
      <React.Fragment>
        <Navbar />
        <HomeParticipant />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/suggest/:id",
    element: (
      <React.Fragment>
        <Navbar />
        <Suggest />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/suggest/:id?edit=1",
    element: (
      <React.Fragment>
        <Navbar />
        <Suggest />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/suggestions/:id",
    element: (
      <React.Fragment>
        <Navbar />
        <Suggestions />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/votes/:id",
    element: (
      <React.Fragment>
        <Navbar />
        <Votes />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/vote/:pwd/:rank",
    element: (
      <React.Fragment>
        <Navbar />
        <Vote />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/participant/results/:pwd",
    element: (
      <React.Fragment>
        <Navbar />
        <ParticipantResults />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/admin/results/:pwd",
    element: (
      <React.Fragment>
        <Navbar />
        <AdminResults />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/admin/create",
    element: (
      <React.Fragment>
        <Navbar />
        <HomeAdmin />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/admin/check/login",
    element: (
      <React.Fragment>
        <Navbar />
        <HomeAdminCheck />
        <Footer />
      </React.Fragment>
    ),
  },
  {
    path: "/admin/check/info/:password",
    element: (
      <React.Fragment>
        <Navbar />
        <HomeAdminInfo />
        <Footer />
      </React.Fragment>
    ),
  },
]);

class App extends Component {
  render() {
    // window.onbeforeunload = function () {
    //   localStorage.clear();
    // };
    return (
      <div className="app">
        <div className="container">
          {" "}
          <RouterProvider router={router} />
        </div>
      </div>
    );
  }
}

export default App;
