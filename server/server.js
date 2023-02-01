const express = require("express");
const app = express();
const port = 3000;

app.use(express.static("dist"));

app.get("/googleaccesstoken", (req,res) => {
  res.send("asdfasdf");
});

app.listen(port, () => {
  console.log(`server is listening at localhost:${port}`);
});
