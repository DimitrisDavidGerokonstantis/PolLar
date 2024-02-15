import axios from "axios";
import React, { useEffect, useState } from "react";

const CurrentSuggestions = ({ password, uid }) => {
  const [suggesters, setSuggesters] = useState(0);
  const [totParticipants, setTotParticipants] = useState(0);
  const [currentSuggestions, setCurrentSuggestions] = useState({});
  const [IdToNameState, setIdToName] = useState(null);
  const [voters, setVoters] = useState(0);
  const [phase, setPhase] = useState(0);

  useEffect(() => {
    var idToName = {};
    const fetchStatus = async () => {
      try {
        const res = await axios.post(
          "https://pollar-api-rxlv.onrender.com/api/common/pollStatus",
          {
            password,
          }
        );

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
  }, []);

  {
    Object.keys(currentSuggestions).map((key) => {
      console.log(key != uid);
    });
  }
  console.log("Sug", currentSuggestions, uid);
  return (
    <div className="adminInfo">
      <div className="column">
        <div className="participantsState">
          <h4>
            Participants that have already made suggestions: {suggesters}/
            {totParticipants}
          </h4>

          {Object.keys(currentSuggestions).map(
            (key) =>
              key !== uid && (
                <React.Fragment key={key}>
                  <p>User {IdToNameState[key]}</p>
                  <table className="table" id={key}>
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
              )
          )}
        </div>
      </div>
    </div>
  );
};

export default CurrentSuggestions;
