//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/

import axios from "axios";
import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import LoadingSpinner from "../components/LoadingSpinner.js";

const Suggest = () => {
  const sugperus = localStorage.getItem("PollarSugPerUser");
  const uid = localStorage.getItem("PollarUserId");
  console.log(useLocation().pathname.split("/")[3]);
  const password = useLocation().pathname.split("/")[3];
  const root = localStorage.getItem("PollarUserRoot");
  const [phase, setPhase] = useState("");
  const [isLoading, setIsLoading] = useState(false);

  const [suggestions, setSuggestions] = useState(Array(sugperus).fill(null));
  const [nullEr, setError] = useState("");

  useEffect(() => {
    const fetchStatus = async () => {
      try {
        const res = await axios.get(
          `https://pollar-api-rxlv.onrender.com/api/participant/getPollPhase/${password}`
        );
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
    setIsLoading(true);
    e.preventDefault();
    console.log("SUG", suggestions);
    var overflowEr = false;
    {
      suggestions.map((sug) => {
        if (sug.length > 40) overflowEr = true;
      });
    }
    if (overflowEr)
      setError(
        "Check for long suggestions (must contain up to 40 characters)!"
      );
    else if (suggestions.length == sugperus && overflowEr === false) {
      setError("");
      try {
        for (var k = 0; k < suggestions.length; k++) {
          const res = await axios.post(
            "https://pollar-api-rxlv.onrender.com/api/participant/postSuggestion",
            {
              suggestion: suggestions[k],
              uid: uid,
              password: password,
            }
          );
          console.log(res.data);
        }
        navigate(`/participant/suggestions/${password}`, {
          state: { sugperus },
        });
      } catch (error) {
        console.log(error);
      }
    } else setError("Check for null values!");
    setIsLoading(false);
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
        placeholder={`suggestion ${i + 1}`}
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
        <p>Make {sugperus} suggestions</p>
        {inputs}
        <div className="error">{nullEr}</div>
        <button onClick={handleSubmit}>OK</button>
        {isLoading ? <LoadingSpinner state={"Saving suggestions ..."} /> : ""}
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
