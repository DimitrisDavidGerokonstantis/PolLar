import React, { useEffect, useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import Edit from "../img/edit.png";
import axios from "axios";

const Votes = () => {
  const sugperus = localStorage.getItem("PollarSugPerUser");
  const edit = useLocation().search;
  const [phase, setPhase] = useState("");
  const root = localStorage.getItem("PollarUserRoot");

  console.log(edit);
  const id = localStorage.getItem("PollarUserId");
  const password = useLocation().pathname.split("/")[3];

  const [suggestions, setSuggestions] = useState(Array(sugperus).fill(""));

  const navigate = useNavigate();
  useEffect(() => {
    const fetchData = async () => {
      try {
        const res = await axios.get(
          `https://pollar-api-rxlv.onrender.com/api/participant/getVotes/${id}/${password}`
        );

        setSuggestions(res.data);
        console.log("suggestions", suggestions[0].phase);
        setPhase(res.data[0].phase);
      } catch (err) {
        console.log(err);
      }
    };
    fetchData();
  }, [edit]);

  const handleUpdate = (e) => {
    setSuggestions((prevState) => {
      const newState = [...prevState];
      newState[e.target.name].suggestion = e.target.value;
      return newState;
    });
  };

  const handleSubmitUpdate = async (e) => {
    e.preventDefault();
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
  };

  const deleteVotes = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.delete(
        `https://pollar-api-rxlv.onrender.com/api/participant/deleteVotes/${id}/`
      );
      console.log(res);
      navigate(`/participant/votes/${password}?edit=1`);
    } catch (error) {
      console.log(error);
    }
  };

  if (id != `""` && id) {
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
    console.log(suggestions);
    if (!edit) {
      var output = [];
      var help = 0;
      for (var i = 0; i < suggestions.length; i++) {
        if (suggestions[i]?.rank != help) {
          output[i] = (
            <div className="suggestion">
              <p>
                #{suggestions[i]?.rank}: {suggestions[i]?.suggestion} (
                {suggestions[i]?.nickname})
              </p>
            </div>
          );
          help = suggestions[i]?.rank;
        } else output[i] = "";
      }
      return (
        <div className="suggestions">
          <p>You have voted the suggestions below</p>
          {output}
          <div className="modifysug">
            <Link to={`/participant/votes/${password}?edit=1`}>
              <img onClick={deleteVotes} src={Edit} />
            </Link>
          </div>
        </div>
      );
    } else {
      navigate(`/participant/vote/${password}/1`);
      //   var output = [];
      //   var help = 0;
      //   for (var i = 0; i < suggestions.length; i++) {
      //     if (suggestions[i]?.rank != help) {
      //       output[i] = (
      //         <div className="suggestion">
      //           <input
      //             name={i}
      //             onChange={handleUpdate}
      //             required
      //             type="text"
      //             value={suggestions[i]?.suggestion}
      //           />
      //         </div>
      //       );
      //       help = suggestions[i]?.rank;
      //     }
      //   }
      //   return (
      //     <div className="suggestions">
      //       <p>Update your votes</p>
      //       {output}
      //       <Link to="/participant/suggestions/${password}">
      //         <button onClick={handleSubmitUpdate}>Finish</button>
      //       </Link>
      //     </div>
      //   );
    }
  } else {
    return (
      <div className="parthome">
        <p>You are not authorized to be here</p>
      </div>
    );
  }
};

export default Votes;
