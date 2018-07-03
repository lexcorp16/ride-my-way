import client from './db';

client.query("CREATE TYPE request_status AS ENUM('accepted', 'rejected', 'pending')", (err, res) => {
  console.log(err, res);
  client.end();
  process.exit();
});
