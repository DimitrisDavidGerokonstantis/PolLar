//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/
import LoadingSpinner from "../components/LoadingSpinner.js";

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Vote = () => {
  const password = useLocation().pathname.split("/")[3];
  var rank = useLocation().pathname.split("/")[4];
  const uid = localStorage.getItem("PollarUserId");
  const [suggestions, setSuggestions] = useState([]);
  const [phase, setPhase] = useState("");
  const root = localStorage.getItem("PollarUserRoot");
  const sugperus = JSON.parse(localStorage.getItem("PollarSugPerUser"));
  const [radio, setRadio] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  const [votes, setVotes] = useState({
    vote1: "",
    voteduser1: "",
    vote2: "",
    voteduser2: "",
    vote3: "",
    voteduser3: "",
  });
  var nextRank = parseInt(useLocation().pathname.split("/")[4]);
  const [currentRank, setCurrentRank] = useState(
    parseInt(useLocation().pathname.split("/")[4])
  );
  useEffect(() => {
    setIsLoading(true);
    console.log("rank", rank);
    const fetchData = async () => {
      try {
        //console.log(`/participant/getSuggestionsVote/${password}/${rank}`);
        const res = await axios.get(
          `https://pollar-api-rxlv.onrender.com/api/participant/getSuggestionsVote/${uid}/${password}/${currentRank}/`
        );
        console.log("DATA", res.data);
        setSuggestions(res.data.mydata);
        const mydata = res.data.mydata.filter((obj) => obj.userid === 7);
        console.log("mydata", mydata);
        console.log("phase", res.data.phase);

        setPhase(res.data.phase);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setIsLoading(false);
  }, [currentRank, password, uid]);
  const navigate = useNavigate();

  console.log(nextRank + 1);
  const ranking = {
    1: "best",
    2: "2nd best",
    3: "3rd best",
  };
  const id = localStorage.getItem("PollarUserId");

  const handleVote = (e) => {
    if (suggestions.length === 1) setRadio(!radio);
    if (rank == 1) {
      setVotes((prev) => {
        const newState = { ...prev };
        newState.vote1 = e.target.id;
        newState.voteduser1 = e.target.value;
        return newState;
      });
    }
    if (rank == 2) {
      setVotes((prev) => {
        const newState = { ...prev };
        newState.vote2 = e.target.id;
        newState.voteduser2 = e.target.value;
        return newState;
      });
    }
    if (rank == 3) {
      setVotes((prev) => {
        const newState = { ...prev };
        newState.vote3 = e.target.id;
        newState.voteduser3 = e.target.value;
        return newState;
      });
    }
  };

  const handleVoteSubmit = async (e) => {
    setIsLoading(true);
    e.preventDefault();
    try {
      var res = "";
      if (rank == 1) {
        res = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/participant/makeVote",
          {
            vote: votes.vote1,
            voteduser: votes.voteduser1,
            uid: uid,
            rank: rank,
          }
        );
      }
      if (rank == 2) {
        res = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/participant/makeVote",
          {
            vote: votes.vote2,
            voteduser: votes.voteduser2,
            uid: uid,
            rank: rank,
          }
        );
      }
      if (rank == 3) {
        res = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/participant/makeVote",
          {
            vote: votes.vote3,
            voteduser: votes.voteduser3,
            uid: uid,
            rank: rank,
          }
        );
      }
      console.log(res.data);
      setCurrentRank(currentRank + 1);
      if (rank == 3) navigate(`/participant/votes/${password}`);
      else navigate(`/participant/vote/${password}/${currentRank + 1}`);
      // window.location.reload(false);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  var output = [];
  var header = "";
  var usid = "";
  for (var i = 0; i < suggestions.length; i++) {
    console.log("EDW", suggestions[i].userid === usid);

    if (suggestions[i].userid !== usid) {
      usid = suggestions[i].userid;
      header = (
        <p>
          <br></br>
          <h3>{suggestions[i]?.userNickname}</h3>
        </p>
      );
    } else header = "";
    if (suggestions.length === 1) {
      output[i] = (
        <div className="movie">
          {header}
          <div className="radiob">
            <input
              type="radio"
              id={suggestions[i]?.id}
              checked={radio}
              name="mov"
              onChange={handleVote}
              value={suggestions[i]?.userid}
            />
            <label htmlFor={suggestions[i]?.id}>
              {suggestions[i]?.suggestion}
            </label>
          </div>
        </div>
      );
    } else {
      output[i] = (
        <div className="movie">
          {header}
          <div className="radiob">
            <input
              type="radio"
              id={suggestions[i]?.id}
              name="mov"
              onChange={handleVote}
              value={suggestions[i]?.userid}
            />
            <label htmlFor={suggestions[i]?.id}>
              {suggestions[i]?.suggestion}
            </label>
          </div>
        </div>
      );
    }
  }

  if (uid != `""`) {
    if (phase == "") {
      console.log("myphase", phase);
      return (
        <div className="parthome">
          <p>Vote in the proper ranking order</p>
        </div>
      );
    }
    if (phase !== 2) {
      console.log("myphase", phase);
      return (
        <div className="parthome">
          <p>Poll is not into voting phase</p>
          <Link to={root}>
            {" "}
            <button>Go to Main Page</button>
          </Link>
        </div>
      );
    }
    console.log(suggestions, votes);
    return (
      <div className="parthome">
        <p>Vote for your {ranking[nextRank]} suggestion</p>
        {output}
        <br></br>
        {nextRank < 3 ? (
          <React.Fragment>
            <Link>
              <button onClick={handleVoteSubmit}>OK</button>
            </Link>
          </React.Fragment>
        ) : (
          <React.Fragment>
            <Link>
              <button onClick={handleVoteSubmit}>Finish</button>
            </Link>
          </React.Fragment>
        )}
        {isLoading ? <LoadingSpinner state={"Please wait ..."} /> : ""}
      </div>
    );
  } else {
    return (
      <div className="parthome">
        <p>You are not authorized to be here</p>
      </div>
    );
  }
};

export default Vote;
