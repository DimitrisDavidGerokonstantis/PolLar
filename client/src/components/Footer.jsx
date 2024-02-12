import React from "react";
import Logo from "../img/logo3.png";

const Footer = () => {
  return (
    <footer>
      <img src={Logo}></img>
      <span>
        <b>Deployed using render.com</b>
      </span>
    </footer>
  );
};

export default Footer;
