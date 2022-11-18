// Include all needed modules
const express = require('express');
const cors = require('cors');
var jsonfile = require('jsonfile');


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
//var miundb = require('./miun-db.json');

// Read from file
var file = "miun-db.json";
var miundb = [];

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        console.log(err);
    } else {
        //console.log(obj); // TODO: Remove
        miundb = obj;
    }
});


app.get('/api/courses', function(req, res) {
    
    // For every course in db
    for(course of miundb.courses) {
        
        // For every subject in db
        for (subject of miundb.subjects) {
            
            // If subjectcode matches, add the subject to course
            if (subject.subjectCode == course.subjectCode) {
                course["subject"] = subject.subject;
            };            
        };        
        
    };
    
    res.send(miundb.courses);
}); 


app.get('/api/courses/:courseCode', function(req, res) {
    // Gets the coursecode
    var code = req.params.courseCode;
    // Init JSON object
    var send = {};
    
    // Search miundb for the coursecode
    for(course of miundb.courses) {

        if (course.courseCode == code.toUpperCase()) {
            // Getting the subject for the course
            for(subject of miundb.subjects) {
                // If subjectcode matches, add the subject to course
                if (subject.subjectCode == course.subjectCode) {

                    course["subject"] = subject.subject;
                    send = course
                };
            };
        // If coursecode doesn´t exist, return empty object
        } else {

            send;
        };
                    
    };
    
    res.send(send);
    
});

/*
app.get('api/courses/my', function(req, res) {
    res.send({ "message": "Hello, World!" });
    //res.send(miundb.myCourses);
}); */

app.get('/api/courses/my', function(req, res) { //Funkar inte? HMM?????
    res.send({ "message": "Hello, World!" });
    //res.status(200).json(miundb);
    res.send(miundb.courses);
    // en fuling, ta alla miundb och jämför med mina osv :P
}); 

app.get('/api/courses/my/:courseCode', function(req, res) {
    var code = req.params.courseCode;

    var send = {};
})

// Get all subjects
app.get('/api/subjects', function(req, res) {
    res.send(miundb.subjects);
})

// Get a specific subject
app.get('/api/subjects/:subjectCode', function(req, res) {
    // Gets the subjectcode
    var subcode = req.params.subjectCode;
    // Init JSON object
    var sending = {};

    // Search miundb for the subjecctcode
    for(subject of miundb.subjects) {

        if (subject.subjectCode == subcode.toUpperCase()) {
            // Getting the subject            
                    sending = subject;                
           
        // If subjectcode doesn´t exist, return empty object
        } else {

            sending;
        };
                    
    };
    
    res.send(sending);
    
})

// Add a new MyCourse
app.post('/api/courses/my', function(req, res) {

    // If courseCode not in miundb

        // Return error msg && htpp404

    // Else

        // If course in MyCourses

            // Return error msg && http 409

        // Else

            // Save the course, return all data && http 201
});

// Update a My-course
app.put('/api/courses/my/:courseCode', function(req, res) {

    var code = req.params.courseCode;

    // If in MyCourses

        // Update grade

        // Return MyCourse

});

// Delete a My-course
app.delete('/api/courses/my/:courseCode', function(req, res) {

    var code = req.params.courseCode;

    // If in myCourses

        // Delete the course && return the course with all its data

    // If not in myCourses

        // Return error msg && HTTP 404

});

// Get all grades
app.get('/api/grades', function(req, res) {

});

// Save JSON file
function saveFile() {
    jsonfile.writeFile(file, miundb, function(err) {
        console.log(err);
    });
};


