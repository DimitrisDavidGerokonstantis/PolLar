import React, { useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

const HomeParticipant = () => {
  const [name, setName] = useState("");
  const [password, setPassword] = useState("");
  const [nickname, setNickname] = useState("");
  const [error, setError] = useState("");

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

  const handleNickname = (e) => {
    setNickname(e.target.value);
    console.log(e.target.value.length);
    if (e.target.value.length > 15) setError("Too long nickname!");
    else if (e.target.value == "") setError("Nickname must not be null!");
    else setError("");
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.post("/participant/login", {
        name,
        password,
        nickname,
      });
      //console.log(res.data[0]); res.data
      const info = res.data[0];
      console.log(info);
      localStorage.setItem("PollarUser", JSON.stringify(name));
      localStorage.setItem("PollarUserId", JSON.stringify(info.uid));
      localStorage.setItem("PollarSugPerUser", JSON.stringify(info.sugperus));
      const pollStatus = await axios.post("/participant/pollStatus", {
        password,
        uid: info.uid,
        sugperus: info.sugperus,
        numofusers: info.numofusers,
      });

      console.log(pollStatus.data);
      if (
        error != "Too long nickname!" &&
        error !=
          "Nickname must be a not null value with up to 15 characters! Try Again!" &&
        error != "Nickname must not be null!" &&
        nickname != ""
      ) {
        if (pollStatus.data === "Suggestions not made") {
          localStorage.setItem(
            "PollarUserRoot",
            `/participant/suggest/${password}`
          );
          navigate(`/participant/suggest/${password}`, {
            state: { sugperus: info.sugperus, uid: info.uid, password },
          });
        }
        if (
          pollStatus.data ===
          "Suggestions has been made but voting not. Poll phase = 1"
        ) {
          localStorage.setItem(
            "PollarUserRoot",
            `/participant/suggestions/${password}`
          );
          navigate(`/participant/suggestions/${password}`, {
            state: { sugperus: info.sugperus, uid: info.uid, password },
          });
        }
        if (
          pollStatus.data ===
          "Suggestions has been made but voting not. Poll phase = 2"
        ) {
          localStorage.setItem(
            "PollarUserRoot",
            `/participant/vote/${password}/1`
          );
          navigate(`/participant/vote/${password}/1`);
        }
        if (
          pollStatus.data ===
          "Suggestions and voting has been made. Poll phase = 2"
        ) {
          localStorage.setItem(
            "PollarUserRoot",
            `/participant/votes/${password}`
          );
          navigate(`/participant/votes/${password}`);
        }
        if (
          pollStatus.data ===
          "Suggestions and voting has been made. Poll phase = 3"
        ) {
          localStorage.setItem(
            "PollarUserRoot",
            `/participant/results/${password}`
          );
          navigate(`/participant/results/${password}`);
        }
      } else
        setError(
          "Nickname must be a not null value with up to 15 characters! Try Again!"
        );
      // navigate("/participant/suggestions/1");
    } catch (error) {
      console.log(error.response.data);
      setError(error.response.data);
    }
  };

  //console.log(name, password.length === 2);

  return (
    <div className="parthome">
      <p>Enter your name and the poll's password</p>
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
      <input
        required
        type="text"
        value={nickname}
        placeholder="nickname"
        onChange={handleNickname}
      />
      <div className="error">{error}</div>
      <button onClick={handleSubmit}>OK</button>
    </div>
  );
};

export default HomeParticipant;
