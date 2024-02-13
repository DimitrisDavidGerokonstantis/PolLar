import React, { useEffect, useState } from "react";
import Logo from "../img/logo3.png";

import Reload from "../img/reload.png";
import { Link, useNavigate } from "react-router-dom";

const Navbar = () => {
  const navigate = useNavigate();
  const eraseName = () => {
    localStorage.setItem("PollarUser", JSON.stringify(""));
    localStorage.setItem("PollarSugPerUser", JSON.stringify(""));
    localStorage.setItem("PollarUserId", JSON.stringify(""));
    localStorage.setItem("PollarUserRoot", JSON.stringify(""));
    localStorage.setItem("PollarPassword", JSON.stringify(""));
  };

  //useEffect(window.location.reload(false), [localStorage.setItem("PollarUser", JSON.stringify(""))]);
  useEffect(() => {}, [localStorage.getItem("PollarUser")]);

  const handleReload = () => {
    window.location.reload(true);
  };
  return (
    <div className="navbar">
      <div className="container">
        <div className="logo">
          <Link onClick={eraseName} className="link" to="/">
            <img src={Logo} alt=""></img>
          </Link>
        </div>
        <p>
          <img onClick={handleReload} src={Reload}></img>

          {JSON.parse(localStorage.getItem("PollarUser"))
            ? JSON.parse(localStorage.getItem("PollarUser"))
            : ""}
        </p>
      </div>
    </div>
  );
};

export default Navbar;
