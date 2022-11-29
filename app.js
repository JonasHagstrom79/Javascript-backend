// Include all needed modules
const express = require('express');
const cors = require('cors');
var jsonfile = require('jsonfile');
//const testar = require('./routes/mycourses.js'); //TODO:remove!!
//var my = require('./routes/mycourses.js') //TODO:remove!!



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


// Read from route
var miundb = require('./miun-db.json');

// Read from file
var file = "miun-db.json";
var miundb = [];

jsonfile.readFile(file, function(err, obj) {
    if (err) {
        console.log(err);
    } else {        
        miundb = obj;
    }
});

// Get MyCourses
app.get('/api/courses/my', function(req, res) { 
  
    //var test = req.params.my //TODO:remove!
    //var test2 = req.path; //TODO:remove!
    //console.log(test2); //TODO:remove!
    //console.log(test);
    //var send = [{}]; // new
    
    // Get myCourses from db
    for (course of miundb.myCourses) {

        // Get all courses
        for (miuncourse of miundb.courses) {
            
            // Compares with coursecode
            if (course.courseCode == miuncourse.courseCode) {
                
                setCourseData(course);

                setSubject(course);
                
                //send.push(course); // new
            };
            
        };
    };

    //res.send(send); // new
    res.send(miundb.myCourses);
    
}); 

 
 //DONT TOUCH!!!!
app.get('/api/courses', function(req, res) {
    
    // For every course in db
    for(course of miundb.courses) {
        
        // For every subject in db
        //for (subject of miundb.subjects) { //TODO: Remove!
            
            // If subjectcode matches, add the subject to course //TODO: Remove!
        //    if (subject.subjectCode == course.subjectCode) { //TODO: Remove!
        //        course["subject"] = subject.subject; //TODO: Remove!
        //    }; //TODO: Remove!            
        //}; //TODO: Remove!
        setSubject(course);       
        
    };
    
    res.send(miundb.courses);
    
}); 

//DONT TOUCH!!!!!
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
                //if (subject.subjectCode == course.subjectCode) { //TODO: Remove!

                //    course["subject"] = subject.subject; //TODO: Remove!
                //    send = course //TODO: Remove!
                //};
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

// Define a route handler for GET requests to the web root //TODO:remove!
// TODO: In lab 1, remove before submission //TODO:remove!
app.get('/', function(req, res) { //TODO:remove!
    res.send({ "message": "Hello, World!" }); //TODO:remove!
}); //TODO:remove!

app.get("/api/", function(req, res) { //TODO:remove!
    res.send("hejejej"); //TODO:remove!
}) //TODO:remove!



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

    //courseCode = req.body.coursecode;
    var data = req.body;
    console.log(data);   
    //Create new myCourse
    var newMyCourse = {
        //courseCode: "AK001A", //2. not in myCourses and in miunDB(new cours for me)
        //courseCode: "IK006G", //3. already in MyCourses
        //courseCode: "DT000G", //1. not in miundb
        //grade: "a",
        courseCode : req.body.courseCode, //HÄRRR!!!! får ej in värdet
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
            // Add the coure to myCourses           
            setCourseData(newMyCourse);
            setSubject(newMyCourse);
            saveFile(); //TODO: FUNGERAR men använd bara när du lämnar in!
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
        /** 
        } else { // Fungerar ej då den avbryter
            // If not in miundb send error message
            res.status(404).json(
                {error: "Course doesnt exist" }
            );
            return res.json();
        }   */     
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
            //saveFile(); //TODO: Saves the file
            setCourseData(course);
            setSubject(course);
            saveFile(); //TODO: Saves the file
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

    //console.log(miundb); //TODO:remove!
    var code = req.params.courseCode;

    // If in myCourses
    for (course of miundb.myCourses) {

        // If in MyCourses
        if (course.courseCode == code) {
           // Delete the course
           miundb.myCourses.splice(course, 1);
           setCourseData(course);
           setSubject(course);
           saveFile(); //TODO: FUNGERAR men använd bara när du lämnar in!
           // Return the course with all its data
           res.status(200).json(course);
           return res.json();

        // If not in myCourses
        } else {
            // Return error msg && HTTP 404
            res.status(404).json(
                {error : "Course doesnt exist in MyCourses"} 
               );
           return res.json();
        }      
       
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

// /**
//  * Checks if course exist in myCourses
//  */
// function courseExistMyCourses(course, code, res) {

//     for (course of miundb.myCourses) {
        
//         if (course.courseCode != code) {
//             res.status(402).json(
//                 {error : "Course doesnt exist in MyCourses"} 
//             );
//             return res.json();            
//         }
//     }
           
// };


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

/**
 * Func to print properties of the req object to console
 * @param {*} req 
 */
function accessingPropofReqObj(req) {

    console.log("URL:\t     " + req.originalUrl);
    console.log("Protocol:   " + req.protocol);
    console.log("IP:\t     " + req.ip);
    console.log("Path:\t   " + req.path);
    console.log("Host:\t   " + req.hostname);
    console.log("Method:\t     " + req.method);
    console.log("Query:\t      "+ JSON.stringify(req.query));
    console.log("Fresh:\t      "+ req.fresh);
    console.log("Stale:\t   " + req.stale);
    console.log("Secure:\t  " + req.secure);
    console.log("UTF8:\t    " + req.acceptsCharsets('utf8'));
    console.log("Connection: " + req.get('connection'));
    console.log("Headers: " + JSON.stringify(req.headers,null,2));

};

