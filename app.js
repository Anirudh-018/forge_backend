// Importing necessary modules
const express = require('express');
const bodyParser = require('body-parser');

// Creating an Express application
const app = express();

// Using bodyParser middleware to parse JSON data
app.use(bodyParser.json());
const axios = require('axios')
const FormData = require('form-data')
const fs = require('fs')
require('dotenv').config()

const pinFileToIPFS = async (username,name) => {
  try {
    let data = new FormData()
    data.append('file', fs.createReadStream(`${username}/${name}`))
    data.append('pinataOptions', '{"cidVersion": 0}')
    data.append('pinataMetadata', '{"name": "pinnie"}')

    const res = await axios.post('https://api.pinata.cloud/pinning/pinFileToIPFS', data, {
      headers: {
        'Authorization': `Bearer ${'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiJkMWIxZmZiZC1mZDcxLTRkNzUtOTZmOC01OTdmZjUxZmNhNTgiLCJlbWFpbCI6Im1lbm9uYW5pN0BnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJpZCI6IkZSQTEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX0seyJpZCI6Ik5ZQzEiLCJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MX1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiZDQyMDIyN2QxY2QzZDhhZGM5MzUiLCJzY29wZWRLZXlTZWNyZXQiOiIxZGIyYzdlNDk4MTFlY2U1YmNkMjY0ODYyYjc0NGFhODNiY2RjYWZlNWQ0Nzg3ZTRhMjQzNTIwYTM1NmUwMDNiIiwiaWF0IjoxNzAwODQ2NzczfQ.iz5T-ZoQkcg54ALalzBhlosXAy6-pGQi3ShiJSdLTfQ'}`
      }
    })
    console.log(res.data)
    return (`View the file here: https://gateway.pinata.cloud/ipfs/${res.data.IpfsHash}`)
  } catch (error) {
    return(error)
  } 
}
// Define a route that accepts POST requests
app.post('/user', async (req, res) => {
  // Retrieve the username and name from the request body
  const username = req.query.username;
  const name=req.query.name;

  // Check if both username and name are provided

  // Process the data (in this example, just sending a response)
  const data=await pinFileToIPFS(username,name);
  console.log(data);
  res.json({ data });
});

// Set the port for the server to listen on
const port = 4000;

// Start the server
app.listen(port, () => {
  console.log(`Server is running on http://localhost:${port}`);
});
