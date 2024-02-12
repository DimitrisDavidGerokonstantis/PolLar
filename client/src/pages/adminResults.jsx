import axios from "axios";
import React, { Component, useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";

const ParticipantResults = () => {
  const localPassword = localStorage.getItem("PollarPassword");
  const password = useLocation().pathname.split("/")[3];
  const root = localStorage.getItem("PollarUserRoot");

  const [total, setTotal] = useState("");
  const [totPoints, setTotPoints] = useState("");
  const [hide, setHide] = useState(true);
  const [phase, setPhase] = useState("");

  //console.log(password);
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://pollar-api-rxlv.onrender.com/api/admin/getResults/${password}`
        );
        console.log(res.data);
        setTotal(res.data.analytics);
        setTotPoints(res.data.totalRanks);
        setPhase(res.data.phase);
      } catch (error) {
        console.log(error);
      }
    };
    fetchData();
  }, []);

  var output = [];
  var outputs = [];
  //console.log("TOTAL", total[0]?.ranking);
  for (var j = 0; j < Object.keys(total).length / 3; j++) {
    // console.log(`${j},0`);
    output[0] = (
      <tr>
        <th>Rank</th>
        <th>Vote</th>
      </tr>
    );
    for (var i = 1; i < 4; i++) {
      // console.log(
      //   `${j},${i}`,
      //   total[i - 1 + 3 * j]?.ranking,
      //   total[i - 1 + 3 * j]?.suggestionVoted
      // );
      output[i] = (
        <tr>
          <td>{total[i - 1 + 3 * j]?.ranking}</td>
          <td>{total[i - 1 + 3 * j]?.suggestionVoted}</td>
        </tr>
      );
    }
    outputs[j] = [...output];
  }

  var tables = [];

  for (var i = 0; i < Object.keys(total).length / 3; i++) {
    tables[i] = (
      <React.Fragment>
        <p>{total[3 * i]?.voterNickname} voted for:</p>
        <table className="table">{outputs[i]}</table>
        <br></br>
      </React.Fragment>
    );
  }

  var totalRes = [];
  totalRes[0] = (
    <tr>
      <th>Suggestion</th>
      <th>Total Points</th>
    </tr>
  );
  //console.log("TOTAL", total[0]?.ranking);
  for (var j = 1; j < Object.keys(totPoints).length; j++) {
    totalRes[j] = (
      <tr>
        <td>{totPoints[j - 1]?.suggestionVoted}</td>
        <td>{totPoints[j - 1]?.totalRank}</td>
      </tr>
    );
  }
  const hideFun = () => {
    setHide(!hide);
  };
  if (localPassword == `"` + password + `"`) {
    if (phase == 3) {
      return (
        <div className="totresults">
          <div className="results">
            <p>Total Results</p>
            <table className="table">{totalRes}</table>

            <button onClick={hideFun}>
              {hide ? "Show Details" : "Hide Details"}
            </button>
          </div>
          {!hide ? <div className="results">{tables}</div> : ""}
        </div>
      );
    } else
      return (
        <div className="parthome">
          <p>
            The poll has not ended yet. Wait for the suggestions and voting
            phases to end!
          </p>
          <Link to={root}>
            {" "}
            <button>Go to Main Page</button>
          </Link>
        </div>
      );
  } else
    return (
      <div className="parthome">
        <p>You are not authorized to be here</p>
      </div>
    );
};

export default ParticipantResults;
