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
  };

  var output = [];
  var header = "";
  var usid = "";
  for (var i = 0; i < suggestions.length; i++) {
    console.log("EDW", suggestions[i].userid === usid);

    if (suggestions[i].userid !== usid) {
      usid = suggestions[i].userid;
      header = (
        <div>
          <br></br>
          <p>
            <u>{suggestions[i]?.userNickname}</u>
          </p>
        </div>
      );
    } else header = "";

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
        <p>Vote for your {ranking[nextRank]} movie</p>
        {output}
        <br></br>
        {nextRank < 3 ? (
          <Link>
            <button onClick={handleVoteSubmit}>OK</button>
          </Link>
        ) : (
          <Link>
            <button onClick={handleVoteSubmit}>Finish</button>
          </Link>
        )}
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
