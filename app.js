// Include all needed modules
const express = require('express');
const cors = require('cors');
var jsonfile = require('jsonfile');

// Create an Express application
const app = express();
app.use(cors());  // CORS-enabled for all origins!

// Tell express to use a express.json, a built-in middleware in Express,
// that parses incoming requests with JSON payloads.
app.use(express.json());

// Tell express to use express.urlencoded, a built-in middleware in Express,
// that parses incoming requests with urlencoded payloads.
// The extended option is required. true is the default value and allows 
// for a JSON-like experience with URL-encoded.
app.use(express.urlencoded({ extended: true }));

// Define the port the server will accept connections on
const port = process.env.PORT || 3000;

// Start the server
app.listen(port, function() {
    console.log(`Server is running on port ${port}`);
});

// Read from file
var file = "miun-db.json";

// Declaring variables
var miundb = [];
var course;
var miuncourse;
var subject;
var courses;
var myCourse;



/**
 * Reads a json-file
 */
jsonfile.readFile(file, function(err, obj) {
    if (err) {
        console.log(err);
    } else {        
        miundb = obj;
    }
});

// Get MyCourses
app.get('/api/courses/my', function(req, res) { 
  
    
    // Get myCourses from db
    for (course of miundb.myCourses) {

        // Get all courses
        for (miuncourse of miundb.courses) {
            
            // Compares with coursecode
            if (course.courseCode == miuncourse.courseCode) {
                
                // Sets course-data
                setCourseData(course);

                // Sets subject
                setSubject(course);                
                
            };
            
        };
    };
    
    res.send(miundb.myCourses);
    
}); 

 
 // Get the courses from db
app.get('/api/courses', function(req, res) {
    
    // For every course in db
    for(course of miundb.courses) {
        
        // Sets the subject        
        setSubject(course);       
        
    };
    
    res.send(miundb.courses);
    
}); 

// Get a specific course
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
                setSubject(course);
                send = course;
            };
        // If coursecode doesn´t exist, return empty object
        } else {

            send;
        };
                    
    };
    
    res.send(send);
    
});


// Get specific MyCourses course
app.get('/api/courses/my/:courseCode', function(req, res) {
    
    var code = req.params.courseCode;
    var send = {};
    
    // Get myCourses from db
    for (course of miundb.myCourses) {

        // If correct coursecode
        if (course.courseCode == code.toUpperCase()) {            
        
            setCourseData(course);                 
                        
            setSubject(course);
            
            send = course;

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
              
    //Create new myCourse
    var newMyCourse = {        
        courseCode : req.body.courseCode, 
        grade : req.body.grade
    };    

    // Check if course already exist in myCourses
    for (myCourse of miundb.myCourses) {

        if(newMyCourse.courseCode == myCourse.courseCode) {
            // Send error message
            res.status(409).json(
                {error : "Course already exist in MyCourses"} 
            );
            return res.json();
        }
    };

    // If course not in myCourses
    for (courses of miundb.courses) {  
        // If the course exist in miundb
        if (newMyCourse.courseCode == courses.courseCode) {
            // Sets the data           
            setCourseData(newMyCourse);
            setSubject(newMyCourse);
            // Add to array
            miundb.myCourses.push(newMyCourse);
            // Save the file
            saveFile(); 
            res.status(201).json(newMyCourse);
            return res.json();
        } 
    };
 
    for (courses of miundb.courses) {  
        if (newMyCourse.courseCode != courses.courseCode) {
             // If not in miundb send error message
             res.status(404).json(
                {error: "Course doesnt exist" }
            );
            return res.json();
        };         
    };    
   
});

// Update a My-course
app.put('/api/courses/my/:courseCode', function(req, res) {

    var code = req.params.courseCode;   
   
    for (course of miundb.myCourses) {

         // If in MyCourses
        if (course.courseCode == code) {
            // Update grade
            course.grade = req.body.grade
            
            // Sets the data
            setCourseData(course);
            setSubject(course);

            //Saves the file
            saveFile(); 

            // Return MyCourse
            res.status(200).json(course);
            return res.json();
        }        
        
    }    

    // If not in myCourse return error msg 404
    for (course of miundb.myCourses) {
        
        if (course.courseCode != code) {
             res.status(404).json(
                 {error : "Course doesnt exist in MyCourses"} 
                );
            return res.json();
        };
    };         

});

// Delete a My-course
app.delete('/api/courses/my/:courseCode', function(req, res) {

    // Get the code for course to be deleted
    var code = req.params.courseCode;

    // Get myCourses
    const myCourses = miundb.myCourses;    

    // If in myCourses
    for(var i=0; i<myCourses.length; i++) {
        if(myCourses[i].courseCode == code) {
            course = myCourses[i];

            // Removes the course
            myCourses.splice(i, 1);

            // saves the file and return course
            saveFile();
            res.status(200).json(course);
            return res.json();
        }        
    }    

    // If not in myCourse return error msg 404
    for (course of miundb.myCourses) {
        
        if (course.courseCode != code) {
             res.status(404).json(
                 {error : "Course doesnt exist in MyCourses"} 
                );
            return res.json();
        };
    }; 

});

// Get all grades
app.get('/api/grades', function(req, res) {

    res.send(miundb.grades);

});


/**
 * Save JSON file
 */
function saveFile() {
    jsonfile.writeFile(file, miundb, function(err) {
        console.log(err);
    });
};

/**
 * Get the course subject from miundb
 * @param {*} course 
 * @returns course
 */
 function setSubject(course) {
    
    for(subject of miundb.subjects) {
        
        // Adds subject to myCourses if correct subjectcode
        if (subject.subjectCode == course.subjectCode) {
            course["subject"] = subject.subject;
        };      

    };
    return course;
};

/**
 * Get the course data from miundb
 * @param {*} course 
 * @returns course
 */
function setCourseData(course) {
    
    for (miuncourse of miundb.courses) {
                
        // Compares with coursecode
        if (course.courseCode == miuncourse.courseCode) {
            
            // Adds data from miudb.courses to myCourses            
            course["subjectCode"] = miuncourse.subjectCode;
            course["level"] = miuncourse.level;
            course["progression"] = miuncourse.progression;
            course["name"] = miuncourse.name;
            course["points"] = miuncourse.points;
            course["institutionCode"] = miuncourse.institutionCode;
        };
    
    };

    return course;

};



