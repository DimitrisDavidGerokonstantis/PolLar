//Loading Spinner from : https://contactmentor.com/how-to-add-loading-spinner-react-js/

import axios from "axios";
import React, { useEffect, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import Reload from "../img/reload.png";
import LoadingSpinner from "../components/LoadingSpinner.js";

const HomeAdminInfo = () => {
  const password = useLocation().pathname.split("/")[4];
  const localPassword = localStorage.getItem("PollarPassword");

  const [suggesters, setSuggesters] = useState(0);
  const [totParticipants, setTotParticipants] = useState(0);
  const [phase, setPhase] = useState(0);
  const [IdToNameState, setIdToName] = useState(null);
  const [currentSuggestions, setCurrentSuggestions] = useState({});
  const [voters, setVoters] = useState(0);
  const navigate = useNavigate();
  const [key, setKey] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [isLoading2, setIsLoading2] = useState(false);
  const delay = (ms) => new Promise((resolve) => setTimeout(resolve, ms));
  const handleReload = async () => {
    setIsLoading2(true);
    await delay(500);
    setKey(key + 1);
  };

  useEffect(() => {
    setIsLoading2(true);
    var idToName = {};
    const fetchStatus = async () => {
      try {
        const res = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/common/pollStatus",
          {
            password,
          }
        );
        // console.log(
        //   "Number of Suggesters",
        //   res.data.suggestionsUserIds?.length,
        //   "Current Suggestions",
        //   res.data.suggestionsData,
        //   "Number of total participants",
        //   res.data.numofusers
        // );
        setSuggesters(res.data.suggestionsUserIds?.length);
        setTotParticipants(res.data.numofusers);
        console.log(res.data);

        var suggestions = {};
        if (res.data.phase == 1) {
          res.data.suggestionsData.map((row) => {
            suggestions[row.user_id] = [];
            idToName[row.user_id] = row.nickname;
          });
          res.data.suggestionsData.map((row) => {
            suggestions[row.user_id].push(row.suggestion);
          });
          setCurrentSuggestions(suggestions);
          setIdToName(idToName);
        }
        if (res.data.phase == 2) {
          console.log("Voting status", res.data.votingStatus);
          var myVoters = 0;
          res.data.votingStatus.map((element) => {
            if (element.numOfVotes == 3) myVoters = myVoters + 1;
          });
          setVoters(myVoters);
        }

        console.log(suggestions);
        setPhase(res.data.phase);
        //console.log("phase", res.data.phase);
      } catch (err) {
        console.log(err);
      }
    };
    fetchStatus();
    setIsLoading2(false);
  }, [key]);

  const upgradePhase = async () => {
    setIsLoading(true);
    try {
      const res = await axios.post(
        "https://pollar-api-rxlv.onrender.com/api/admin/upgradePhase",
        {
          password,
          phase,
        }
      );
      setPhase(phase + 1);
      console.log(res.data);
    } catch (error) {
      console.log(error);
    }
    setIsLoading(false);
  };

  console.log(localPassword, password);
  if (localPassword == `"` + password + `"`) {
    if (phase == 1) {
      console.log("Sug", currentSuggestions);
      return (
        <div className="adminInfo">
          <img onClick={handleReload} src={Reload}></img>

          <div className="column">
            <div className="spinner">
              {" "}
              {isLoading2 ? (
                <LoadingSpinner state={"Updating status ..."} />
              ) : (
                ""
              )}
            </div>
            <div className="phase">
              <h4>Phase of the poll : Suggestions</h4>
            </div>
            <div className="participantsState">
              <h4>
                Participants that have already made suggestions: {suggesters}/
                {totParticipants}
              </h4>

              {Object.keys(currentSuggestions).map((key) => (
                <React.Fragment key={key}>
                  <p>User {IdToNameState[key]}</p>
                  <table className="table">
                    <tr>
                      <th>Suggestions</th>
                    </tr>
                    {currentSuggestions[key].map((suggestion, index) => (
                      <tr key={index}>
                        <td>{suggestion}</td>
                      </tr>
                    ))}
                  </table>
                </React.Fragment>
              ))}
            </div>
          </div>
          <div className="column">
            <h4>
              {suggesters == totParticipants
                ? "Next Poll's Phase"
                : "The poll is not ready to pass into the next phase"}
            </h4>
            {suggesters == totParticipants ? (
              <button onClick={upgradePhase}>GO</button>
            ) : (
              ""
            )}
            {isLoading ? (
              <LoadingSpinner state={"Loading next phase ..."} />
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else if (phase == 2) {
      return (
        <div className="adminInfo">
          <img onClick={handleReload} src={Reload}></img>

          <div className="column">
            <div className="spinner">
              {" "}
              {isLoading2 ? (
                <LoadingSpinner state={"Updating status ..."} />
              ) : (
                ""
              )}
            </div>
            <div className="phase">
              <h4>Phase of the poll : Voting</h4>
            </div>
            <div className="participantsState">
              <h4>
                Participants that have already voted: {voters}/{totParticipants}
              </h4>
            </div>
          </div>
          <div className="column">
            <h4>
              {voters == totParticipants
                ? "Finish Poll"
                : "The poll is not ready to finish"}
            </h4>
            {voters == totParticipants ? (
              <button onClick={upgradePhase}>GO</button>
            ) : (
              ""
            )}
            {isLoading ? (
              <LoadingSpinner state={"Poll is finished! Loading results ..."} />
            ) : (
              ""
            )}
          </div>
        </div>
      );
    } else if (phase == 3) {
      navigate(`/admin/results/${password}`);
    }
  } else
    return (
      <div className="adminInfo">
        <div className="column">
          {" "}
          <p>You are not authorized to have access in this poll</p>
        </div>
      </div>
    );
};

export default HomeAdminInfo;
