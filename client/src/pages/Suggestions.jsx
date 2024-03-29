//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/

import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Edit from "../img/edit.png";
import Delete from "../img/delete.png";
import axios from "axios";
import LoadingSpinner from "../components/LoadingSpinner.js";
import CurrentSuggestions from "../components/CurrentSuggestions.jsx";

const Suggestions = () => {
  const root = localStorage.getItem("PollarUserRoot");
  const [isLoading, setIsLoading] = useState(false);

  const sugperus = localStorage.getItem("PollarSugPerUser");
  const edit = useLocation().search;
  console.log(edit);
  const id = localStorage.getItem("PollarUserId");
  const password = useLocation().pathname.split("/")[3];

  const [phase, setPhase] = useState("");
  const [nullEr, setError] = useState("");
  const [suggestions, setSuggestions] = useState(Array(sugperus).fill(null));

  const navigate = useNavigate();
  useEffect(() => {
    setIsLoading(true);
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://pollar-api-rxlv.onrender.com/api/participant/getSuggestions/${id}/${password}`
        );

        setSuggestions(res.data.data);
        console.log(suggestions);
        setPhase(res.data.phase[0].phase);
        console.log("PHASE", res.data.phase[0].phase);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
    setIsLoading(false);
  }, [edit]);

  const handleUpdate = (e) => {
    setSuggestions((prevState) => {
      const newState = [...prevState];
      newState[e.target.name].suggestion = e.target.value;
      return newState;
    });
  };

  const handleSubmitUpdate = async (e) => {
    setIsLoading(true);
    var nullValue = false;
    console.log(suggestions);
    var overflowErr = false;
    for (var i = 0; i < suggestions.length; i++) {
      if (suggestions[i].suggestion == "") nullValue = true;
      if (suggestions[i].suggestion.length > 40) overflowErr = true;
    }
    console.log("null", nullValue);
    e.preventDefault();
    if (overflowErr)
      setError(
        "Check for long suggestions (must contain up to 40 characters)!"
      );
    else if (!nullValue && !overflowErr) {
      setError("");
      try {
        for (var k = 0; k < suggestions.length; k++) {
          const res = await axios.put(
            "https://pollar-api-rxlv.onrender.com/api/participant/updateSuggestion",
            {
              suggestion: suggestions[k].suggestion,
              sugid: suggestions[k].id,
              uid: id,
              password: password,
            }
          );
          console.log(res.data);
        }
        navigate(`/participant/suggestions/${password}`);
      } catch (error) {
        console.log(error);
      }
    } else setError("Null values!");
    setIsLoading(false);
  };
  console.log("ID", id != `""` && id);
  if (id != `""` && id) {
    if (phase != 1) {
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
    console.log(suggestions);
    if (!edit) {
      var output = [];
      for (var i = 0; i < sugperus; i++) {
        output[i] = (
          <div className="suggestion">
            <p>{suggestions[i]?.suggestion}</p>
          </div>
        );
      }
      return (
        <div className="suggestions">
          <br></br>

          <p>You have made the suggestions below</p>
          {output}

          <div className="modifysug">
            <Link to={`/participant/suggestions/${password}?edit=1`}>
              <img src={Edit} />
            </Link>
            {isLoading ? <LoadingSpinner state={"Please wait ..."} /> : ""}
          </div>
          <h6>
            Note : You can modify your suggestions only during the suggestions'
            phase. If you have already made your final suggestions, you have to
            wait for the poll's admin to pass the poll into the next (voting)
            phase
          </h6>
          <CurrentSuggestions password={password} uid={id} />
        </div>
      );
    } else {
      var output = [];
      for (var i = 0; i < sugperus; i++) {
        output[i] = (
          <div className="suggestion">
            <input
              name={i}
              onChange={handleUpdate}
              required
              type="text"
              value={suggestions[i]?.suggestion}
            />
          </div>
        );
      }
      return (
        <div className="suggestions">
          <p>Update your suggestions</p>
          {output}
          <div className="error">{nullEr}</div>
          <Link to="/participant/suggestions/${password}">
            <button onClick={handleSubmitUpdate}>Finish</button>
          </Link>
          {isLoading ? (
            <LoadingSpinner state={"Updating suggestions ..."} />
          ) : (
            ""
          )}
          <CurrentSuggestions password={password} uid={id} />
        </div>
      );
    }
  } else {
    return (
      <div className="parthome">
        <p>You are not authorized to be here</p>
      </div>
    );
  }
};

export default Suggestions;
