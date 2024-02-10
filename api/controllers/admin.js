import { db } from "../db.js";

export const addRanks = (req, res) => {
  const q = "INSERT INTO ranks(`rank`,`value`,`paswd`) VALUES (1, ?, ?)";
  db.query(q, [req.body.rank1points, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    const q = "INSERT INTO ranks(`rank`,`value`,`paswd`) VALUES (2, ?, ?)";
    db.query(q, [req.body.rank2points, req.body.password], (err, data) => {
      if (err) return res.status(500).json(err);
      const q = "INSERT INTO ranks(`rank`,`value`,`paswd`) VALUES (3, ?, ?)";
      db.query(q, [req.body.rank3points, req.body.password], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json("Ranks inserted");
      });
    });
  });
};

export const createPoll = (req, res) => {
  // var UsersIds = [];
  const q2 =
    "INSERT INTO polls(`password`,`uid`,`sugperus`,`numofusers`,`phase`,`adminName`) VALUES (?, ?, ?, ?, 1, ?)";
  const q1 = "INSERT INTO users(`username`) VALUES (?)";

  console.log("userName to insert", req.body.userName);
  db.query(q1, [req.body.userName], (err, data) => {
    if (err) return res.status(500).json(err);
    console.log(
      "ID",
      `INSERT INTO polls(password,uid,sugperus,numofusers,phase,adminName) VALUES (${req.body.password}, ${data.insertId}, ${req.body.numOfSug}, ${req.body.numOfPart}, 1)`
    );
    db.query(
      q2,
      [
        req.body.password,
        data.insertId,
        req.body.numOfSug,
        req.body.numOfPart,
        req.body.username,
      ],
      (err, data) => {
        console.log(req.body);
        if (err) {
          console.log(err);
          return res.status(500).json(err);
        }
        return res.status(200).json(`Insertion OK ${req.body.userName}`);
      }
    );
  });
};

export const login = (req, res) => {
  var mydata = {};
  const q = "SELECT * FROM polls WHERE `password`=?";

  db.query(q, [req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    if (!data.length) return res.status(404).json("This poll doesn't exist");
    console.log(req.body);
    const q =
      "SELECT p.`phase`, p.`adminName`,p.`numofusers`,p.`sugperus`, p.`password` FROM polls as p WHERE p.`password`=? AND p.`adminName`=?";
    db.query(q, [req.body.password, req.body.name], (err, data) => {
      if (err) return res.status(500).json(err);
      console.log(data.length);
      mydata = { ...data };
      if (!data.length)
        return res
          .status(404)
          .json("This is not the admin's name for this poll!");
      return res.status(200).json(mydata);
    });
  });
};

export const pollStatus = (req, res) => {
  var numofusers;
  var suggestionsData;
  var suggestionsUserIds;
  const q = "SELECT phase, numofusers FROM polls WHERE `password`=?";
  db.query(q, [req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    const phase = data[0].phase;
    console.log("phase===1?",phase==1);
    numofusers = data[0].numofusers;
    if (phase === 1) {
      const q2 =
        "SELECT u.`id` user_id ,u.`username` as username, s.`suggestion` as suggestion \
      FROM suggestions as s \
      INNER JOIN users as u ON s.`userid`=u.`id`\
      WHERE s.`ppwd`=?";

      db.query(q2, [req.body.password], (err, data) => {
        if (err) return res.status(500).json(err);
        suggestionsData = [...data];
        const q3 =
          "SELECT s.`userid` as user_id \
        FROM suggestions as s \
        WHERE s.`ppwd`=?\
        GROUP BY `user_id`";

        db.query(q3, [req.body.password], (err, data) => {
          if (err) return res.status(500).json(err);
          suggestionsUserIds = [...data];
          return res
            .status(200)
            .json({ suggestionsUserIds, suggestionsData, numofusers, phase });
        });
      });
    }
    const qq =
      "SELECT v.`usid` as userId, max(u.`username`) as userName, count(*) as numOfVotes FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` \
    INNER JOIN users as u ON u.`id`=v.`usid`\
    WHERE s.`ppwd`=? GROUP BY v.`usid`";

    db.query(qq, [req.body.password], (err, data) => {
      if (err) return res.status(500).json(err);
      return res.status(200).json({ numofusers, phase, votingStatus: data });
    });
  });
};

export const upgradePhase = (req, res) => {
  const q = "UPDATE polls SET `phase`=? WHERE `password`=?";

  db.query(q, [req.body.phase + 1, req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    return res.status(200).json("phase updated");
  });
};

export const getResults = (req, res) => {
  var analytics = {};
  var totalRanks = {};
  var phase = 0;
  const q1 =
    "SELECT * FROM (SELECT v.`id` as voteId, max(u.`username`) as voter,max(nn.`nickname`) as voterNickname,max(u.`id`) voterId, \
  max(p.`password`) as pollPassword, max(p.`phase`) as pollPhase, max(s.`suggestion`) as suggestionVoted,max(s.`id`) as suggestionVotedId, \
  max(v.`rank`) as ranking,max(uu.`username`) as userSuggested, max(n.`nickname`) as userSuggestedNickname ,max(uu.`id`) as userSuggestedId \
  FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` \
  INNER JOIN polls as p ON s.`ppwd`=p.`password` INNER JOIN users as u ON u.`id`=v.`usid`\
   INNER JOIN users as uu ON uu.`id`=s.`userid` INNER JOIN nicknames as n ON n.`user_id`=s.`userid` INNER JOIN nicknames as nn ON nn.`user_id`=v.`usid` \
   WHERE p.`password`=?  \
   GROUP BY voteId) as first ORDER BY voter ASC";

  const q2 =
    "SELECT * FROM(SELECT max(third.`suggestionVoted`) as suggestionVoted,third.`suggestionVotedId`, sum(third.`totalRank`) totalRank FROM (SELECT *,second.`counter`*r.`value` as totalRank FROM (SELECT max(first.`suggestionVoted`) as suggestionVoted ,first.`suggestionVotedId`,first.`ranking`,count(*) as counter FROM (SELECT v.`id` as voteId, max(u.`username`) as voter,max(u.`id`) voterId, max(p.`password`) as pollPassword, max(p.`phase`) as pollPhase, max(s.`suggestion`) as suggestionVoted,max(s.`id`) as suggestionVotedId, max(v.`rank`) as ranking,max(uu.`username`) as userSuggested, max(uu.`id`) as userSuggestedId FROM pollar.votes as v INNER JOIN pollar.suggestions as s ON v.`sugid`=s.`id` INNER JOIN pollar.polls as p ON s.`ppwd`=p.`password` INNER JOIN pollar.users as u\
 ON u.`id`=v.`usid` INNER JOIN pollar.users as uu ON uu.`id`=s.`userid` WHERE p.`password`=? GROUP BY voteId) as first GROUP BY first.`suggestionVotedId`,first.`ranking`) as second\
 INNER JOIN pollar.ranks as r ON r.`rank`=second.`ranking` WHERE r.`paswd`=? ORDER BY second.`suggestionVotedId`,second.`ranking`) as third\
 GROUP BY third.`suggestionVotedId`) as fourth ORDER BY fourth.totalRank DESC;";

  const q3 = "SELECT phase FROM polls WHERE password=?";

  db.query(q1, [req.params.pwd], (err, data) => {
    if (err) return res.status(500).json(err);
    //console.log("data", data);
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
};
