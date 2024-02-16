import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// kati allo 232
const Home = () => {
  useEffect(() => {
    localStorage.setItem("PollarUser", JSON.stringify(""));
    localStorage.setItem("PollarUserId", JSON.stringify(""));
    localStorage.setItem("PollarSugPerUser", JSON.stringify(""));
    localStorage.setItem("PollarPassword", JSON.stringify(""));
  }, []);
  return (
    <div className="homeAll">
      <div className="home">
        <Link to="/participant">
          <button>Join a poll</button>
        </Link>
        <Link to="/admin/create">
          <button>Create a poll</button>
        </Link>
        <Link to="/admin/check/login">
          <button>Check your poll's status</button>
        </Link>
      </div>
      <b>
        Note : Your first request (for example, an attempt to join a poll) may
        lead to a delay up to 1 minute due to technical reasons associated with
        the deployement made via render.com. After this first delay, the web app
        will have reasonal response times!
      </b>
    </div>
  );
};

export default Home;
