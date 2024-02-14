//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/

import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.js";

const HomeAdminCheck = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  useEffect(() => {
    localStorage.setItem("PollarUser", JSON.stringify(""));
    localStorage.setItem("PollarUserId", JSON.stringify(""));
    localStorage.setItem("PollarUserRoot", JSON.stringify(""));
    localStorage.setItem("PollarPassword", JSON.stringify(""));
  }, []);

  const navigate = useNavigate();

  const handleName = (e) => {
    setName(e.target.value);
  };

  const handlePassword = (e) => {
    setPassword(e.target.value);
    if (e.target.value.length > 8) setError("Password contains 8 characters!");
    else setError("");
  };

  const handleSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      const res = await axios.post(
        "https://pollar-api-rxlv.onrender.com/api/admin/login",
        {
          name,
          password,
        }
      );
      //console.log(res.data[0]); res.data
      const info = res.data[0];
      console.log(info);
      localStorage.setItem("PollarUser", JSON.stringify(info.adminName));
      localStorage.setItem("PollarPassword", JSON.stringify(password));
      localStorage.setItem("PollarSugPerUser", JSON.stringify(info.sugperus));
      navigate(`/admin/check/info/${password}`);
      //   const pollStatus = await axios.post("/participant/pollStatus", {
      //     password,
      //     uid: info.uid,
      //     sugperus: info.sugperus,
      //     numofusers: info.numofusers,
      //   });

      //   console.log(pollStatus.data);
      //   if (
      //     error != "Too long nickname!" &&
      //     error !=
      //       "Nickname must be a not null value with up to 15 characters! Try Again!" &&
      //     error != "Nickname must not be null!"
      //   ) {
      //     if (pollStatus.data === "Suggestions not made") {
      //       localStorage.setItem(
      //         "PollarUserRoot",
      //         `/participant/suggest/${password}`
      //       );
      //       navigate(`/participant/suggest/${password}`, {
      //         state: { sugperus: info.sugperus, uid: info.uid, password },
      //       });
      //     }
      //     if (
      //       pollStatus.data ===
      //       "Suggestions has been made but voting not. Poll phase = 1"
      //     ) {
      //       localStorage.setItem(
      //         "PollarUserRoot",
      //         `/participant/suggestions/${password}`
      //       );
      //       navigate(`/participant/suggestions/${password}`, {
      //         state: { sugperus: info.sugperus, uid: info.uid, password },
      //       });
      //     }
      //     if (
      //       pollStatus.data ===
      //       "Suggestions has been made but voting not. Poll phase = 2"
      //     ) {
      //       localStorage.setItem(
      //         "PollarUserRoot",
      //         `/participant/vote/${password}/1`
      //       );
      //       navigate(`/participant/vote/${password}/1`);
      //     }
      //     if (
      //       pollStatus.data ===
      //       "Suggestions and voting has been made. Poll phase = 2"
      //     ) {
      //       localStorage.setItem(
      //         "PollarUserRoot",
      //         `/participant/votes/${password}`
      //       );
      //       navigate(`/participant/votes/${password}`);
      //     }
      //     if (
      //       pollStatus.data ===
      //       "Suggestions and voting has been made. Poll phase = 3"
      //     ) {
      //       localStorage.setItem(
      //         "PollarUserRoot",
      //         `/participant/results/${password}`
      //       );
      //       navigate(`/participant/results/${password}`);
      //     }
      //   } else
      //     setError(
      //       "Nickname must be a not null value with up to 15 characters! Try Again!"
      //     );
      // navigate("/participant/suggestions/1");
      setError("");
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
    setIsLoading(false);
  };

  //console.log(name, password.length === 2);

  return (
    <div className="parthome">
      <p>Enter the admin's username and the poll's password</p>
      <input
        required
        type="text"
        value={name}
        placeholder="name"
        onChange={handleName}
      />
      <input
        required
        type="text"
        value={password}
        placeholder="password"
        onChange={handlePassword}
      />
      <br></br>

      <div className="error">{error}</div>
      <button onClick={handleSubmit}>OK</button>
      {isLoading ? <LoadingSpinner state={"Please wait ..."} /> : ""}
    </div>
  );
};

export default HomeAdminCheck;
