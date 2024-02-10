import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";

const Suggest = () => {
  const sugperus = localStorage.getItem("PollarSugPerUser");
  const uid = localStorage.getItem("PollarUserId");
  console.log(useLocation().pathname.split("/")[3]);
  const password = useLocation().pathname.split("/")[3];
  const root = localStorage.getItem("PollarUserRoot");
  const [phase, setPhase] = useState("");

  const [suggestions, setSuggestions] = useState(Array(sugperus).fill(null));
  const [nullEr, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(`/participant/getPollPhase/${password}`);
        //   console.log(res.data[0].phase);
        setPhase(res.data[0].phase);
      } catch (error) {
        console.log(error);
      }
    };
    fetchStatus();
  }, [password]);

  const handleSuggestion = (e) => {
    setSuggestions((prevState) => {
      const newState = [...prevState];
      newState[e.target.name] = e.target.value;
      return newState;
    });
  };

  const navigate = useNavigate();
  //console.log(uid, password);
  const handleSubmit = async (e) => {
    e.preventDefault();
    console.log(suggestions);
    if (suggestions.length == sugperus) {
      setError("");
      try {
        for (var k = 0; k < suggestions.length; k++) {
          const res = await axios.post("/participant/postSuggestion", {
            suggestion: suggestions[k],
            uid: uid,
            password: password,
          });
          console.log(res.data);
        }
        navigate(`/participant/suggestions/${password}`, {
          state: { sugperus },
        });
      } catch (error) {
        console.log(error);
      }
    } else setError("Null values!");
  };

  console.log(nullEr);
  var inputs = [];
  for (var i = 0; i < sugperus; i++) {
    inputs[i] = (
      <input
        name={i}
        onChange={handleSuggestion}
        required
        type="text"
        placeholder="movie name"
      />
    );
  }

  const id = localStorage.getItem("PollarUserId");
  if (id != `""` && id) {
    if (phase !== 1) {
      console.log("myphase", phase);
      return (
        <div className="parthome">
          <p>Poll is not into suggestions phase</p>
          <Link to={root}>
            {" "}
            <button>Go to Main Page</button>
          </Link>
        </div>
      );
    }
    return (
      <div className="parthome">
        <p>Suggest {sugperus} Movies</p>
        {inputs}
        <div className="error">{nullEr}</div>
        <button onClick={handleSubmit}>OK</button>
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

export default Suggest;
