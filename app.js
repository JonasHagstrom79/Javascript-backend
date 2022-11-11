// Include all needed modules
const express = require('express');
const cors = require('cors');


// Create an Express application
const app = express();
app.use(cors());  // CORS-enabled for all origins!

// Define the port the server will accept connections on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});




// För att testa
/** 
const usersDb = [{
    id: 3,
    make: "Audi",
    model: "R8",
    color: "Black"
},
{
    id: 4,
    make: "Volvo",
    model: "V40",
    color: "Orange"
}];



const car = []; */
//const obj = JSON.parse()
var miundb = require('./miun-db.json');

// För att testa

 
// Define a route handler for GET requests to the web root
// TODO: In lab 1, remove before submission
app.get('/api/courses', function(req, res) {
    //res.send({ "message": "Hello, World!" });
    //res.status(200).json(miundb);
    //res.send(miundb.courses);
    res.status(200).json(miundb.courses);
}); 

/* GET users listing. */
//app.get('/api/courses', function(req, res) {
//    res.send('respond with a resource');
//});

app.get('/api/courses/DT190G', function(req, res) {
    //res.send({ "message": "Hello, World!" });
    
    for(course of miundb.courses) {
        if (course.keys(course) == "DT190G") {
            res.status(200).json(course);
        }
    }
    
});


/** 
app.get('/api/courses', function(req, res) {
    //res.send({ "message": "Hello, World!" });
    // Hur fan sänder man hela json när man inte får läsi in dom från savefile?
    res.status(200).json(miundb);
}); */

/** 
app.get('/api/courses', function(req, res) {
    res.send(usersDb);
    
    //res.status(200).json(usersDb)//.json(usersDb); // Blir ett flmeddelande om den är med
}); */

/** 
// Define a route handler for GET requests to the web root
// TODO: In lab 1, remove before submission
app.get('/api/courses', function(req, res) {
    //res.send({ "message": "Hello, World!" });
    res.send(usersDb)
    res.status(200).json(usersDb)//.json(usersDb);
});
*/

//Fungerar typ ;P
/** 
app.get('/api/courses/DT190G', function(req, res) {
    res.send({ "message": "Hello, World!" });
    //res.status(200).json(usersDb)//.json(usersDb); // Blir ett flmeddelande om den är med
});
*/
