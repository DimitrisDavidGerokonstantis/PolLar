import { db } from "../db.js";

export const login = (req, res) => {
  console.log("HELLO", req, res);
  var mydata = {};
  const q = "SELECT * FROM polls WHERE `password`=?";
  const q2 = "INSERT INTO nicknames(`nickname`,`user_id`) VALUES(?,?)";
  db.query(q, [req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("This poll doesn't exist");
    console.log(req.body);
    const q =
      "SELECT p.`numofusers`,p.`sugperus`, u.`username`, p.`password`, u.`id` as uid FROM polls as p INNER JOIN users as u ON p.`uid`=u.`id` WHERE p.`password`=? AND u.`username`=?";
    db.query(q, [req.body.password, req.body.name], (err, data) => {
      if (err) return res.status(500).json(err);
      console.log(data.length);
      mydata = { ...data };
      if (!data.length)
        return res.status(404).json("This is not a valid name for this poll!");
      console.log("HELLO", mydata);
      deleteNickname(data[0].uid, res);
      db.query(q2, [req.body.nickname, data[0].uid], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json(mydata);
      });
    });
  });
};

const deleteNickname = (uid, res) => {
  const q = "DELETE FROM nicknames WHERE user_id=?";
  db.query(q, [uid], (err, data) => {
    if (err) return res.status(500).json(err);
  });
};

export const pollStatus = (req, res) => {
  let phase = 0;

  const q1 = "SELECT phase FROM polls WHERE `password`=?";
  db.query(q1, [req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    phase = data[0].phase;
  });

  console.log(req.body);
  const q = "SELECT * FROM suggestions WHERE `userid`=? AND `ppwd`=?";

  db.query(q, [req.body.uid, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    console.log(req.body.uid, req.body.password, data.length);
    if (data.length !== req.body.sugperus)
      return res.status(200).json(`Suggestions not made`);
    else if (data.length === req.body.sugperus) {
      const q =
        "SELECT * FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` WHERE s.`ppwd`=? AND v.`usid`=?";
      db.query(q, [req.body.password, req.body.uid], (err, data) => {
        if (err) return res.status(500).json(err);
        console.log(
          "LENGTH",
          data.length,
          data,
          req.body.password,
          req.body.uid
        );
        if (data.length == 3)
          return res
            .status(200)
            .json(
              `Suggestions and voting has been made. Poll phase = ${phase}`
            );
        return res
          .status(200)
          .json(
            `Suggestions has been made but voting not. Poll phase = ${phase}`
          );
      });
    }
  });
};

export const postSuggestion = (req, res) => {
  const q =
    "INSERT INTO suggestions(`suggestion`, `userid`,`ppwd`) VALUES (?,?,?)";
  console.log(req.body);

  db.query(
    q,
    [req.body.suggestion, req.body.uid, req.body.password],
    (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json("Suggestion inserted");
    }
  );
};

export const getSuggestions = (req, res) => {
  console.log(req.params);
  var mydata = {};
  const q = "SELECT * FROM suggestions WHERE `userid`=? AND `ppwd`=?";
  const q2 = "SELECT phase FROM polls WHERE password=?";

  db.query(q, [req.params.uid, req.params.pwd], (err, data) => {
    if (err) return res.status(500).json(err);
    mydata = data;
    db.query(q2, [req.params.pwd], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ data: mydata, phase: data });
    });
  });
};

export const updateSuggestion = (req, res) => {
  console.log("HERE");
  const q = "UPDATE suggestions SET `suggestion`=? WHERE `id`=?";

  db.query(q, [req.body.suggestion, req.body.sugid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("Suggestion updated");
  });
};

export const getSuggestionsVote = (req, res) => {
  var IDs = [];
  var sugIDs = [];
  const takeVotes =
    "SELECT s.`userid`,s.`id` as sugId FROM votes as v INNER JOIN suggestions as s ON s.`id`=v.`sugid` WHERE v.`usid`=?";
  db.query(takeVotes, [req.params.uid], (err, data) => {
    if (err) return res.status(500).json(err);
    var ids = [];
    var sugIds = [];
    data.map((row) => {
      ids = [...ids, row.userid];
      sugIds = [...sugIds, row.sugId];
    });
    for (var i = 0; i < ids.length; i++) {
      console.log(ids[(0, i)]);
      IDs[i] = ids[(0, i)];
      sugIDs[i] = sugIds[(0, i)];
    }
  });

  console.log("SUGIDS", sugIDs);

  var phase = "";
  var checkboxAllow = 0;
  const phaseq = "SELECT checkboxAllow, phase FROM polls WHERE `password`=?";
  db.query(phaseq, [req.params.password], (err, data) => {
    if (err) return res.status(500).json(err);
    phase = data[0].phase;
    checkboxAllow = data[0].checkboxAllow;
    console.log(data);
    const rank = req.params.rank;
    var mydata = {};
    const q =
      "SELECT s.`id`, s.`suggestion`, s.`userid`,s.`ppwd`, u.`username`,u.`id` as userid,n.`nickname` as userNickname FROM suggestions AS s INNER JOIN users as u ON s.`userid`=u.`id` \
      INNER JOIN nicknames as n ON n.`user_id`=s.`userid` WHERE s.`ppwd`=? AND (s.`userid`>? OR s.`userid`<?)";
    db.query(
      q,
      [req.params.password, req.params.uid, req.params.uid],
      (err, data) => {
        if (err) return res.status(500).json(err);
        console.log("DATAAA", data);
        if (rank == 1) {
          mydata = data;
        } else {
          mydata = data.filter((obj) => !IDs.includes(obj.userid));
        }

        return res.status(200).json({ mydata, phase });
      }
    );

    // if (rank == 2) {
    //   const takeVotes =
    //     "SELECT s.`userid` FROM votes as v INNER JOIN suggestions as s ON s.`id`=v.`sugid` WHERE v.`usid`=?";
    //   db.query(takeVotes, [req.params.uid], (err, data) => {
    //     if (err) return res.status(500).json(err);
    //     var ids = [];
    //     data.map((row) => {
    //       ids = [...ids, row.userid];
    //     });
    //     for (var i = 0; i < ids.length; i++) {
    //       console.log(ids[(0, i)]);
    //     }
    //   });
    // }
  });
};

export const makeVote = (req, res) => {
  const q = "INSERT INTO votes(`usid`,`sugid`,`rank`) VALUES (?,?,?)";
  db.query(q, [req.body.uid, req.body.vote, req.body.rank], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(`rank ${req.body.rank} vote inserted`);
  });
};

export const getVotes = (req, res) => {
  console.log(req.params);
  //v.`usid` as user, v.`sugid` as sugid,v.`rank` as rank, s.`suggestion` as suggestion, p.`password` as password, p.`phase` as phase, s.`userid` as sugUser
  const q =
    "SELECT u.`username` as username, v.`usid` as `user`, v.`sugid` as `sugid`,v.`rank` as `rank`, s.`suggestion` as `suggestion`, p.`password` as `password`, p.`phase` as `phase`, s.`userid` as `sugUser` FROM votes as v INNER JOIN suggestions as s ON s.`id`=v.`sugid` INNER JOIN polls as p ON p.`password`=s.`ppwd` INNER JOIN users as u ON u.`id`=s.`userid` WHERE v.`usid`=? AND p.`password`=?";

  db.query(q, [req.params.uid, req.params.pwd], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};

export const deleteVotes = (req, res) => {
  const q = "DELETE FROM votes WHERE `usid`=?";
  db.query(q, [req.params.uid], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(`Votes deleted for userid ${req.params.uid}`);
  });
};

export const getResults = (req, res) => {
  var analytics = {};
  var totalRanks = {};
  var phase = 0;
  const q1 =
    "SELECT v.`id` as voteId, max(u.`username`) as voter,max(nn.`nickname`) as voterNickname,max(u.`id`) voterId, \
  max(p.`password`) as pollPassword, max(p.`phase`) as pollPhase, max(s.`suggestion`) as suggestionVoted,max(s.`id`) as suggestionVotedId, \
  max(v.`rank`) as ranking,max(uu.`username`) as userSuggested, max(n.`nickname`) as userSuggestedNickname ,max(uu.`id`) as userSuggestedId \
  FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` \
  INNER JOIN polls as p ON s.`ppwd`=p.`password` INNER JOIN users as u ON u.`id`=v.`usid`\
   INNER JOIN users as uu ON uu.`id`=s.`userid` INNER JOIN nicknames as n ON n.`user_id`=s.`userid` INNER JOIN nicknames as nn ON nn.`user_id`=v.`usid` \
   WHERE p.`password`=?  \
   GROUP BY voteId ORDER BY voter ASC";

  const q2 =
    "SELECT max(third.`suggestionVoted`) as suggestionVoted,third.`suggestionVotedId`, sum(third.`totalRank`) totalRank FROM (SELECT *,second.`counter`*r.`value` as totalRank FROM (SELECT max(first.`suggestionVoted`) as suggestionVoted ,first.`suggestionVotedId`,first.`ranking`,count(*) as counter FROM (SELECT v.`id` as voteId, max(u.`username`) as voter,max(u.`id`) voterId, max(p.`password`) as pollPassword, max(p.`phase`) as pollPhase, max(s.`suggestion`) as suggestionVoted,max(s.`id`) as suggestionVotedId, max(v.`rank`) as ranking,max(uu.`username`) as userSuggested, max(uu.`id`) as userSuggestedId FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` INNER JOIN polls as p ON s.`ppwd`=p.`password` INNER JOIN users as u\
 ON u.`id`=v.`usid` INNER JOIN users as uu ON uu.`id`=s.`userid` WHERE p.`password`=? GROUP BY voteId) as first GROUP BY first.`suggestionVotedId`,first.`ranking`) as second\
 INNER JOIN ranks as r ON r.`rank`=second.`ranking` WHERE r.`paswd`=? ORDER BY second.`suggestionVotedId`,second.`ranking`) as third\
 GROUP BY third.`suggestionVotedId` ORDER BY totalRank DESC;";

  const q3 = "SELECT phase FROM polls WHERE password=?";

  db.query(q1, [req.params.pwd], (err, data) => {
    if (err) return res.status(500).json(err);
    console.log("data", data);
    analytics = { ...data };

    db.query(q2, [req.params.pwd, req.params.pwd], (err, data) => {
      if (err) {
        console.log("error");
        return res.status(500).json(err);
      }
      // console.log("data", data);
      totalRanks = { ...data };
      db.query(q3, [req.params.pwd], (err, data) => {
        if (err) return res.status(500).json(err);
        phase = data[0].phase;
        return res.status(200).json({ analytics, totalRanks, phase });
      });
    });
  });

  //   const q2 =
  //     "SELECT * FROM(SELECT max(third.`suggestionVoted`) as suggestionVoted,third.`suggestionVotedId`, sum(third.`totalRank`) totalRank FROM (SELECT *,second.`counter`*r.`value` as totalRank FROM (SELECT max(first.`suggestionVoted`) as suggestionVoted ,first.`suggestionVotedId`,first.`ranking`,count(*) as counter FROM (SELECT v.`id` as voteId, max(u.`username`) as voter,max(u.`id`) voterId, max(p.`password`) as pollPassword, max(p.`phase`) as pollPhase, max(s.`suggestion`) as suggestionVoted,max(s.`id`) as suggestionVotedId, max(v.`rank`) as ranking,max(uu.`username`) as userSuggested, max(uu.`id`) as userSuggestedId FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` INNER JOIN polls as p ON s.`ppwd`=p.`password` INNER JOIN users as u\
  // ON u.`id`=v.`usid` INNER JOIN users as uu ON uu.`id`=s.`userid` GROUP BY voteId) as first GROUP BY first.`suggestionVotedId`,first.`ranking`) as second\
  // INNER JOIN ranks as r ON r.`rank`=second.`ranking` ORDER BY second.`suggestionVotedId`,second.`ranking`) as third\
  // GROUP BY third.`suggestionVotedId`) as fourth";

  //while (!totalRanks.length);
};

export const getPollPhase = (req, res) => {
  const q = "SELECT phase FROM polls WHERE password=?";
  db.query(q, [req.params.pwd], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json(data);
  });
};
