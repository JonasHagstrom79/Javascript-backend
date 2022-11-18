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

/**
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


*/
app.get('/api/courses/my', function(req, res) { //Funkar inte? HMM?????
        
    // Get myCourses from db
    for (course of miundb.myCourses) {

        // Get all courses
        for (miuncourse of miundb.courses) {
            
            // Compares with coursecode
            if (course.courseCode == miuncourse.courseCode) {
                
                // Adds data from miudb.courses to myCourses
                miuncourse["grade"] == course.grade;
                course["subjectCode"] = miuncourse.subjectCode;
                course["level"] = miuncourse.level;
                course["progression"] = miuncourse.progression;
                course["name"] = miuncourse.name;
                course["points"] = miuncourse.points;
                course["institutionCode"] = miuncourse.institutionCode;
                
                // Get the subjects
                for(subject of miundb.subjects) {
                    
                    // Adds subject to myCourses if correct subjectcode
                    if (subject.subjectCode == course.subjectCode) {
                        course["subject"] = subject.subject;
                    }
                }
                //course["grade"] = "empty" //TODO: remove!!
            };
            
        };
    };

    res.send(miundb.myCourses);
    
}); 

app.get('/api/courses/my/:courseCode', function(req, res) {
    
    var code = req.params.courseCode;
    var send = {};
    
    // Get myCourses from db
    for (course of miundb.myCourses) {

        // If correct coursecode
        if (course.courseCode == code.toUpperCase()) {            
        
            // Get all courses
            for (miuncourse of miundb.courses) {
                
                // Compares with coursecode
                if (course.courseCode == miuncourse.courseCode) {
                    
                    // Adds data from miudb.courses to myCourses
                    miuncourse["grade"] == course.grade;
                    course["subjectCode"] = miuncourse.subjectCode;
                    course["level"] = miuncourse.level;
                    course["progression"] = miuncourse.progression;
                    course["name"] = miuncourse.name;
                    course["points"] = miuncourse.points;
                    course["institutionCode"] = miuncourse.institutionCode;
                    
                    // Get the subjects
                    for(subject of miundb.subjects) {
                        
                        // Adds subject to myCourses if correct subjectcode
                        if (subject.subjectCode == course.subjectCode) {
                            course["subject"] = subject.subject;
                        }
                        // Sends the object
                        send = course;
                    }
                    
                };
                
            };

        } else {
            send
        };
    };

    res.send(send);


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


