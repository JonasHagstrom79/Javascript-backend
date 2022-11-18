// Include all needed modules
const express = require('express');
const cors = require('cors');
//var jsonfile2 = require('jsonfile');


// Create an Express application
const app = express();
app.use(cors());  // CORS-enabled for all origins!

// Define the port the server will accept connections on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});


// Read from route
var miundb = require('./miun-db.json');

// Read from file
//var file = "miun-db.json";
//var miundb = [];

//jsonfile2.readFile(file, function(err, obj) {
//    if (err) {
//        console.log(err);
//    } else {
//        console.log(obj);
//        miundb = obj;
//    }
//});



 
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


app.get('/api/courses/:courseCode', function(req, res) {
    // Gets the coursecode
    var code = req.params.courseCode;
    // Init JSON object
    var send = {};

    // Search miundb for the coursecode
    for(course of miundb.courses) {

        if (course.courseCode == code) {
            
            send = course;

        } else {
            // If no coursecode return empy object
            send 
        }       
        
    }
    
    res.send(send);
    
});

function saveFile() {
    jsonfile2.writeFile(file, miundb, function(err) {
        console.log(err);
    });
}

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
