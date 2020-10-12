/* eslint-disable semi */
const express = require('express');
const bodyParser  = require('body-parser');
const request = require('request');
const https = require('https');
require('dotenv').config();
const app = express()
const port = 3000





app.use(express.static("public"));

app.use(bodyParser.urlencoded({extended:true}))

app.get('/', (req, res) => {
    res.sendFile(__dirname+"/signup.html")
})


 
app.post('/', function (req, res) {
  const firstName = req.body.firstName;
  const lastName = req.body.lastName;
  const email = req.body.email;

  const data = {
      members: [
          {
              email_address: email,
              status: "subscribed",
              merge_fields:{
                  FNAME: firstName,
                  LNAME: lastName
              }
          }
      ]
  };

  const jsonData = JSON.stringify(data);
    // the us2 part of the url depends on Your API key  it can anywhere between (us1-us20) which is the server your API key belongs to  
  const url = `https://us2.api.mailchimp.com/3.0/lists/${process.env.LIST_ID}`

  const options = {
      method:"POST",
      auth: `admin:${process.env.API_KEY}`
  }


  const request = https.request(url,options,(response)=>{

    if (response.statusCode===200) {
        res.sendFile(__dirname+"/success.html")
    } else{
        res.sendFile(__dirname+"/failure.html")
    }    
      
    response.on("data", function (data) { 
        console.log(JSON.parse(data));
     })
  })

  request.write(jsonData);
  request.end();


  
  
})

app.post('/failure', function (req, res) {
  res.redirect("/")
})

app.listen(process.env.PORT || port, () => console.log(`Server is running on port ${port}`))
