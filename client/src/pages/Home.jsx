import React, { useEffect } from "react";
import { Link } from "react-router-dom";
// kati allo 2
const Home = () => {
  useEffect(() => {
    localStorage.setItem("PollarUser", JSON.stringify(""));
    localStorage.setItem("PollarUserId", JSON.stringify(""));
    localStorage.setItem("PollarSugPerUser", JSON.stringify(""));
    localStorage.setItem("PollarPassword", JSON.stringify(""));
  }, []);
  return (
    <div className="home">
      <Link to="/participant">
        <button>Join a poll</button>
      </Link>
      <Link to="/admin/create">
        <button>Create a poll</button>
      </Link>
      <Link to="/admin/check/login">
        <button>Check your poll</button>
      </Link>
    </div>
  );
};

export default Home;
