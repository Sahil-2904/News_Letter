const express = require("express");
const bodyParser = require("body-parser");
const request = require("request");
const https = require("https");

const app = express();

app.use(express.static("public"));

app.use(bodyParser.urlencoded({
  extended: true
}));

app.get("/", function(req, res) {
  res.sendFile(__dirname + "/signup.html");
})

app.post("/", function(req, res) {
  const f_name = req.body.FirstName;
  const l_name = req.body.LastName;
  const email = req.body.Email;
  console.log(f_name + " " + l_name + " " + email);

  const data = {
    members: [{
      email_address: email,
      status: "subscribed",
      merge_fields: {
        FNAME: f_name,
        LNAME: l_name
      }
    }]
  }

  const jsonData = JSON.stringify(data);

  const url = process.env.URL;

  const options = {
    method: "POST",
    auth: process.env.AUTH
  }

  const request = https.request(url, options, function(response) {
    if (response.statusCode === 200) {
      res.sendFile(__dirname + "/success.html");
    } else {
      res.sendFile(__dirname + "/failure.html");
    }
    response.on("data", function(data) {
      console.log(JSON.parse(data));
    })
  })

  request.write(jsonData);
  request.end();
})

app.post("/failure", function(req, res) {
  res.redirect("/")
})


app.listen(process.env.PORT || 3000, function() {
  console.log("Server started at port 3000.");
})
