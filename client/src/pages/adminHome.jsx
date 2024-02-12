import axios from "axios";
import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";

const HomeAdmin = () => {
  const [pollCreated, setPollCreated] = useState(false);

  const [Userror, setUsError] = useState("");
  const [Usernameserror, setUsernamesError] = useState("");
  const [Parterror, setParterror] = useState("");
  const [sugError, setSugError] = useState("");
  const [rank1Error, setRank1Error] = useState("");
  const [rank2Error, setRank2Error] = useState("");
  const [rank3Error, setRank3Error] = useState("");
  const [password, setPassword] = useState("");
  const [username, setUsername] = useState("");
  const [numOfSug, setNumOfSug] = useState(0);
  const [numOfPart, setNumOfPart] = useState(0);
  const [rank1points, setRank1Points] = useState(0);
  const [rank2points, setRank2Points] = useState(0);
  const [rank3points, setRank3Points] = useState(0);
  const [checkboxAllow, setCheckboxAllow] = useState(0);
  const [checkboxError, setCheckboxError] = useState("");

  const [totalError, setTotalError] = useState("");
  const [users, setUsers] = useState("");
  //if(username=="" || numOfSug=="" || numOfPart=="" || rank1points=="" || rank2points=="" || rank3points=="" )
  console.log("gg", numOfSug + numOfPart == "");
  const [userNames, setUserNames] = useState(
    useState(Array(numOfPart).fill(""))
  );
  let findDuplicates = (arr) =>
    arr.filter((item, index) => arr.indexOf(item) !== index);

  const navigate = useNavigate();

  const handleName = (e) => {
    setUsername(e.target.value);
    if (e.target.value.length > 10) setUsError("Too long username!");
    else setUsError("");
  };

  // Userror || Usernameserror || Parterror || sugError || rank1Error || rank2Error || rank3Error
  const handleUsername = (e) => {
    setUserNames((prevState) => {
      const newState = [...prevState];
      newState[e.target.id] = e.target.value;
      if (findDuplicates(newState).length != 0)
        setUsernamesError("Error : Usernames must be different!");
      else setUsernamesError("");
      return newState;
    });
  };

  const handleCheckbox = (e) => {
    console.log("VALUE", e.target.checked);
    setCheckboxAllow(checkboxAllow == 0 ? 1 : 0);
    var regex = /^[0-9]+$/;
    if (
      !e.target.checked &&
      numOfPart != "" &&
      (numOfPart < 4 || !numOfPart.match(regex))
    )
      setParterror(
        "Add a NUMBER>4 if you don't allow for participants to vote again the same participant in different rank!"
      );
    else if (e.target.checked && numOfPart != "" && !numOfPart.match(regex))
      setParterror("Add a NUMBER");
    else {
      setParterror("");
      var users = [];
      for (var i = 0; i < numOfPart; i++) {
        users[i] = (
          <div className="field">
            {" "}
            <input
              required
              type="text"
              id={i}
              // value={name}
              placeholder={`username ${i + 1}`}
              onChange={handleUsername}
            />
          </div>
        );
      }
      setUsers(users);
    }
  };
  console.log("CHECK", checkboxAllow);

  console.log(userNames);
  const handleParticipants = (e) => {
    setNumOfPart(e.target.value);
    var regex = /^[0-9]+$/;
    if (
      checkboxAllow === 0 &&
      e.target.value != "" &&
      (e.target.value < 4 || !e.target.value.match(regex))
    )
      setParterror(
        "Add a NUMBER>4 if you don't allow for participants to vote again the same parti"
      );
    else if (
      checkboxAllow === 1 &&
      e.target.value != "" &&
      !e.target.value.match(regex)
    )
      setParterror("Add a NUMBER");
    else {
      setParterror("");
      var users = [];
      for (var i = 0; i < e.target.value; i++) {
        users[i] = (
          <div className="field">
            {" "}
            <input
              required
              type="text"
              id={i}
              // value={name}
              placeholder={`username ${i + 1}`}
              onChange={handleUsername}
            />
          </div>
        );
      }
      setUsers(users);
    }
    if (e.target.value == "") {
      setUsernamesError("");
      setUserNames("");
    }
  };

  const handleSuggestions = (e) => {
    setNumOfSug(e.target.value);
    var regex = /^[0-9]+$/;
    if (e.target.value != "" && !e.target.value.match(regex))
      setSugError("Must be a NUMBER");
    else setSugError("");
  };

  const handle1Rank = (e) => {
    setRank1Points(e.target.value);
    var regex = /^[0-9]+$/;
    if (e.target.value != "" && !e.target.value.match(regex))
      setRank1Error("Must be a NUMBER");
    else setRank1Error("");
  };
  const handle2Rank = (e) => {
    setRank2Points(e.target.value);
    var regex = /^[0-9]+$/;
    if (e.target.value != "" && !e.target.value.match(regex))
      setRank2Error("Must be a NUMBER");
    else setRank2Error("");
  };
  const handle3Rank = (e) => {
    setRank3Points(e.target.value);
    var regex = /^[0-9]+$/;
    if (e.target.value != "" && !e.target.value.match(regex))
      setRank3Error("Must be a NUMBER");
    else setRank3Error("");
  };
  console.log(
    (
      Userror ||
      Usernameserror ||
      Parterror ||
      sugError ||
      rank1Error ||
      rank2Error ||
      rank3Error
    ).length == 0
  );
  const handleSubmit = async (e) => {
    if (
      username == "" ||
      numOfSug == "" ||
      numOfPart == "" ||
      rank1points == "" ||
      rank2points == "" ||
      rank3points == "" ||
      userNames.length != numOfPart
    )
      setTotalError("Missing values!");
    if (checkboxAllow && (numOfPart - 1) * numOfSug < 3) {
      setCheckboxError("(# of participants -1) x # of suggestions >= 3");
    }
    if (checkboxAllow && (numOfPart - 1) * numOfSug >= 3) {
      setCheckboxError("");
    }
    e.preventDefault();
    if (
      (
        Userror ||
        Usernameserror ||
        Parterror ||
        sugError ||
        rank1Error ||
        rank2Error ||
        rank3Error
      ).length == 0 &&
      !(
        username == "" ||
        numOfSug == "" ||
        numOfPart == "" ||
        rank1points == "" ||
        rank2points == "" ||
        rank3points == "" ||
        userNames.length != numOfPart ||
        (checkboxAllow && (numOfPart - 1) * numOfSug < 3)
      )
    ) {
      console.log("NO ERROR");
      setTotalError("");
      const p = Math.random().toString(36).substring(2, 10);
      for (var i = 0; i < numOfPart; i++) {
        try {
          var res = await axios.post(
            "https://pollar-api-rxlv.onrender.com/api/admin/createPoll",
            {
              password: p,
              username,
              numOfSug,
              numOfPart,
              rank1points,
              rank2points,
              rank3points,
              userName: userNames[i],
              checkboxAllow,
            }
          );

          console.log(res.data);
          console.log(p);
        } catch (error) {
          console.log(error);
        }
      }
      setPassword(p);

      try {
        const res2 = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/admin/addRanks",
          {
            password: p,
            rank1points,
            rank2points,
            rank3points,
          }
        );
        console.log(res2.data);
        console.log(p);
        setPollCreated(true);
      } catch (error) {
        console.log(error);
      }
    } else setTotalError("Check for errors or missing values and try again!");
  };

  return (
    <div className="adminhome">
      <div className="password">
        <p>
          {password ? `The password of the created poll is : ${password}` : ""}
        </p>
      </div>
      <div className="fields">
        <div className="fieldsBlock">
          <div className="field">
            {" "}
            <p>Choose a username with which you will login : </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="username"
              onChange={handleName}
            />
          </div>
          <div className="error">
            {Userror ? `Username Error : ${Userror}` : ""}{" "}
          </div>
          <div className="field">
            {" "}
            <p>Define the number of the poll's participants : </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="# of participants"
              onChange={handleParticipants}
            />
          </div>
          <div className="error">
            {" "}
            {Parterror ? `Error : ${Parterror}` : ""}{" "}
          </div>
          <div className="field">
            {" "}
            <p>
              How many suggestions will each participant be allowed to add ?{" "}
            </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="# of suggestions"
              onChange={handleSuggestions}
            />
          </div>
          <div className="error">{sugError ? `Error : ${sugError}` : ""} </div>
        </div>
        <div className="fieldsBlock">
          <p> Points-ranking matching </p>{" "}
          <div className="field">
            {" "}
            <p> # 1 ranking </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="points"
              onChange={handle1Rank}
            />
          </div>
          <div className="field">
            {" "}
            <p> # 2 ranking </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="points"
              onChange={handle2Rank}
            />
          </div>
          <div className="field">
            {" "}
            <p> # 3 ranking </p>{" "}
            <input
              required
              type="text"
              // value={name}
              placeholder="points"
              onChange={handle3Rank}
            />
          </div>
          <br></br>
          <div className="field">
            {" "}
            <p>
              Allow participants to vote again for the same participant in
              different rank
            </p>{" "}
            <input
              required
              type="checkbox"
              checked={checkboxAllow}
              onChange={handleCheckbox}
              // value={name}
            />
          </div>
          <div className="error">
            {rank1Error || rank2Error || rank3Error
              ? `Error : Must be a NUMBER`
              : ""}{" "}
          </div>
        </div>
      </div>
      <div className="adminhome">
        <p>{users != "" && "Define the usernames of the participants"}</p>
        {users}
        <div className="error">
          {Usernameserror ? `${Usernameserror}` : ""}{" "}
        </div>
      </div>
      <div className="error">{checkboxError}</div>
      <div className="error">{totalError}</div>
      {!password ? <button onClick={handleSubmit}>Create Poll</button> : ""}
      <Link to="/">
        <button>Go to Main Page</button>
      </Link>
    </div>
  );
};

export default HomeAdmin;
