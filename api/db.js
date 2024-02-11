import mysql from "mysql";

export const db = mysql.createConnection({
  host: "boeebl6hmohkrw1kppr0-mysql.services.clever-cloud.com",
  user: "u22vludggvcqmbpx",
  password: "BDlgumlL1rqj3fH9K43Y",
  database: "boeebl6hmohkrw1kppr0",
});

//db.query("CREATE USER 'u22vludggvcqmbpx'@'34.213.214.55' IDENTIFIED BY 'BDlgumlL1rqj3fH9K43Y'");
//db.query("GRANT ALL PRIVILEGES ON boeebl6hmohkrw1kppr0.* TO 'u22vludggvcqmbpx'@'34.213.214.55'");
//34.213.214.55
//user: "u22vludggvcqmbpx"
