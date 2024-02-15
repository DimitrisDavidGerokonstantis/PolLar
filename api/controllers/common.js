import { db } from "../db.js";

export const pollStatusGeneral = (req, res) => {
  var numofusers;
  var suggestionsData;
  var suggestionsUserIds;

  const q =
    "SELECT phase, numofusers,checkboxAllow2 FROM polls WHERE `password`=?";
  db.query(q, [req.body.password], (err, data) => {
    if (err) return res.status(500).json(err);
    const phase = data[0].phase;
    const checkbox = data[0].checkboxAllow2;
    console.log("phase===1?", phase == 1);
    numofusers = data[0].numofusers;
    if (phase === 1) {
      const q2 =
        "SELECT n.`nickname` as nickname ,u.`id` user_id ,u.`username` as username, s.`suggestion` as suggestion \
        FROM suggestions as s \
        INNER JOIN users as u ON s.`userid`=u.`id`\
        INNER JOIN nicknames as n ON u.`id`=n.`user_id`\
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
            .json({
              suggestionsUserIds,
              suggestionsData,
              numofusers,
              phase,
              checkbox,
            });
        });
      });
    } else {
      const qq =
        "SELECT v.`usid` as userId, max(u.`username`) as userName, count(*) as numOfVotes FROM votes as v INNER JOIN suggestions as s ON v.`sugid`=s.`id` \
        INNER JOIN users as u ON u.`id`=v.`usid`\
        WHERE s.`ppwd`=? GROUP BY v.`usid`";

      db.query(qq, [req.body.password], (err, data) => {
        if (err) return res.status(500).json(err);
        return res.status(200).json({ numofusers, phase, votingStatus: data });
      });
    }
  });
};
