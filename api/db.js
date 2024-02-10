import mysql from "mysql";

export const db = mysql.createConnection({
  host: "boeebl6hmohkrw1kppr0-mysql.services.clever-cloud.com",
  user: "u22vludggvcqmbpx",
  password: "BDlgumlL1rqj3fH9K43Y",
  database: "boeebl6hmohkrw1kppr0",
});



function handleDisconnect() {
  db.connect((err) => {
    if (err) {
      console.error('Error connecting to MySQL:', err);
      setTimeout(handleDisconnect, 2000); // retry after 2 seconds
    }
  });

  db.on('error', (err) => {
    console.error('MySQL error:', err);
    if (err.code === 'PROTOCOL_CONNECTION_LOST') {
      handleDisconnect();
    } else {
      throw err;
    }
  });
}

handleDisconnect();
