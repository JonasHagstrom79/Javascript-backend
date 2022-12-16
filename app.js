// Include all needed modules
const express = require('express');
const cors = require('cors');
var jsonfile = require('jsonfile');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config(); //To mongoDb

// // Connect to moongoose
// const connectionString = process.env.DB_SERVER;
// await mongoose.connect(connectionString) //TODO:test if it works

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


// Declaring variables
// var miundb = [];
// var course;
// var miuncourse;
// var subject;
// var courses;
// var myCourse;

/**
 * Call our main function, catch and log errors if they orrur
 */
main().catch( err => {
    console.error(err);
    close();
})

/**
 * Closes the connection to database
 */
async function close() {
    console.log(`Disconnecting from database`);
    await mongoose.disconnect();
    console.log("Disconnected");
}

/**
 * Connects to the database
 */
async function main() {
    console.log("Connecting to db");
    // Connect to moongoose
    const connectionString = process.env.DB_SERVER;
    await mongoose.connect(connectionString);
    console.log("Connected");

    // Creates a schema that defines a course in the database
    const courseSchema = new mongoose.Schema({
        _id: String, //TODO:correct?
        courseCode: {
            type: String,
            required: true,
            uppercase: true,
            minLength: 6,
            maxLength: 6
        },
        subjectCode: {
            type: String,
            required: true
        },
        level: {
            type: String,
            required: true
        },
        progression: {
            type: String            
        },
        name: {
            type: String,
            required: true
        },
        points: {
            type: Number,
            required: true            
        },
        institutionCode: {
            type: String,
            required: true
        },
        subject: {
            type: String,
            required: true
        }

    });

    // Ceates a schema that defines a grade in the database
    const gradeSchema = new mongoose.Schema({
        //_id: _id, //TODO:correct?
        name: {
            type: String,
            required: true,
            minLength: 2,
            maxLength: 3
        },
        grades: {
            type: Array,
            required: true
        }
    });

    // Creates a schema that defines a institution in the database
    const institutionSchema = new mongoose.Schema({
        //_id: _id, //TODO:correct?
        institutionCode: String,
        institution: String,
        description: String,
        language: String
    });

    // Creates a schema tha defines a myCourse in the database
    const mycourseSchema = new mongoose.Schema({
        //_id: String, //TODO:necesarry?
        courseCode: String,
        grade: String,
        subjectCode: {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        level: {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        progression: {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        name : {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        points: {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        institutionCode: {
            type: String,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        subject: {
            type: String,
            required: true
        }

        
    });

    // const mycourseSchema = new mongoose.Schema({
    //     //_id: String,
    //     courseCode: String,
    //     // { 
    //     //     type: String,
    //     //     required: true,
    //     //     uppercase: true,
    //     //     minLength: 6,
    //     //     maxLength: 6
    //     // },
    //     grade: String
    // });

    // Creates a schema that defines a subject in the database
    const subjectSchema = new mongoose.Schema({
        //_id: _id, //TODO:correct?
        subjectCode: String,
        subject: String,
        preamble: String,
        bodyText: String,
        language: String
    });
    //var myCourses; //TODO:remove!

    // Compile to moongoose model
    const Course = mongoose.model('Course', courseSchema);
    const Grade = mongoose.model('Grade', gradeSchema);
    const Institution = mongoose.model('Institution', institutionSchema);
    const Mycourse = mongoose.model('Mycourse', mycourseSchema, 'myCourses'); //Speca 
    const Subject = mongoose.model('Subject', subjectSchema);

    // Set myCourses data from courses 32:00
    Mycourse.subjectCode = Course.subjectCode; //TODO:correct?
    Mycourse.level = Course.level;
    Mycourse.progression = Course.progression;
    Mycourse.name = Course.name;
    Mycourse.points = Course.points;
    Mycourse.institutionCode = Course.institutionCode

    // Get MyCourses
    //const mycourses = await Mycourse.find()//.populate('level');
    //console.log(mycourses);
   

    // console.log("Aggregate");
    // const agg = await Course.aggregate([
    //     // Filters by points
    //     {
    //         $match: {points: 60}
    //     },
    //     // Group remaining documents by institutioncode
    //     {
    //         $group: {_id: "$name"}
    //     }//,
    //     // {
    //     //     $unwind: '$_id'
    //     // }
    // ])
    // console.log(agg)


    

    // Get MyCourses
    app.get('/api/courses/my', async function(req, res) {         
        
        // Gets data from mongoDB
        const mycourses = await Mycourse.find();
        const courses = await Course.find();
        
        for (course of courses) {
            
            // Gets the course-data to myCourse
            getCourseData(mycourses, course)
            
        }
        res.send(mycourses)
       

    });

    // Get all miun courses
    app.get('/api/courses', async function(req, res) {        
        const courses = await Course.find();
        res.send(courses);
    });

    // Get a specific course
    app.get('/api/courses/:courseCode', async function(req, res) {

        // Get the coursecode
        var code = req.params.courseCode;       
       

        const findcourse = await Course.findOne({"courseCode" : code});
        // If coursecode doesnt get an answer send empty json
        if (findcourse == null) {

            res.send({});

        } else {

            res.send(findcourse);

        }
        
    });       
        
    // Get specific MyCourses course
    app.get('/api/courses/my/:courseCode', async function(req, res){

        // Get the coursecode
        var code = req.params.courseCode;

        const findMycourse = await Mycourse.findOne({"courseCode" : code});
        const courses = await Course.find();
        
        // If coursecode doesnt get an answer send empty json
        if (findMycourse == null) {

            res.send({});

        } else {

            for (course of courses) {
            
                // Gets the course-data to myCourse
                if (findMycourse.courseCode == course.courseCode) {
                    
                    findMycourse["subjectCode"] = course.subjectCode //TODO: Better code?
                    findMycourse["level"] = course.level;
                    findMycourse["progression"] = course.progression;
                    findMycourse["name"] = course.name;
                    findMycourse["points"] = course.points;
                    findMycourse["institutionCode"] = course.institutionCode;
                    findMycourse["subject"] = course.subject;
                }
                
            }
            
            res.send(findMycourse);

        }
        
    });

    // Get all the subjects
    app.get('/api/subjects', async function(req, res) {

        const subjects = await Subject.find();
        res.send(subjects);
    })

    // Get a specific subject
    app.get('/api/subjects/:subjectCode', async function(req, res) {

        // Get the subjectcode
        var code = req.params.subjectCode.toUpperCase();        

        const findSubject = await Subject.findOne({"subjectCode" : code})
        // If subjectcode doesnt get an answer send empty json
        if (findSubject == null) {

            res.send({})

        } else {

            res.send(findSubject);

        }
        
    });

    // Get all grades
    app.get('/api/grades', async function(req, res) {

        //const grades = await Grade.find();
        //const grades = await Grade.find({"grades": ["-","fx","f","e","d","c","b","a"] })
        const grades = await Grade.find({"grades" : ["-","fx","f","e","d","c","b","a"] })
        res.send(grades);
    });

    // Get grades ug //TODO:remove!
    app.get('/api/grades/ug', async function(req, res) {

        const ugGrades = await Grade.find({"name" : "ug"})
        res.send(ugGrades);
    })

    // Get grades uvg //TODO:remove!
    app.get('/api/grades/uvg', async function(req, res) {

        const ugvGrades = await Grade.find({"name" : "uvg"})
        res.send(ugvGrades);
    })

    // Get grades fa //TODO:remove!
    app.get('/api/grades/fa', async function(req, res) {

        const faGrades = await Grade.find({"name" : "fa"})
        res.send(faGrades);
    })

    // Add a new MyCourse
    app.post('/api/courses/my', async function(req, res) {

        newCoursecode = req.body.courseCode, 
        newGrade = req.body.grade;

        const newMyCourse = new Mycourse({
            courseCode : newCoursecode,
            grade : newGrade
        });

        // Get myCourses
        const mycourses = await Mycourse.find();
        const courses = await Course.find();  
        
        

        // Check if course exist in miun
        for (course of courses) {

            if (newCoursecode == course.courseCode) {
                // Continue to myCourses
                for (mycourse of mycourses) {
                    // If course already in mycourses
                    if(newCoursecode == mycourse.courseCode) {
                        // Send error message
                        res.status(409).json(
                            {error : "Course already exist in MyCourses"} 
                        );
                        // Return result
                        return res.json();
                    };
                    // If course not in myCourses
                    if(newCoursecode != mycourse.courseCode) {
                        // Add the course
                        
                            newMyCourse["subjectCode"] = course.subjectCode
                            newMyCourse["level"] = course.level;
                            newMyCourse["progression"] = course.progression;
                            newMyCourse["name"] = course.name;
                            newMyCourse["points"] = course.points;
                            newMyCourse["institutionCode"] = course.institutionCode;
                            newMyCourse["subject"] = course.subject;
                            //await db.newMyCourse.save();
                            //res.send(newMyCourse);
                            // res.status(201).json();

                            // return res.json(newMyCourse);

                       
                            
                       
                        res.status(201).json( 
                            {newMyCourse}              
                        );
                        // Resturn result
                        return res.json();
                    };
                };
            };          
            
        };
        // If course doesnt exist in miun
        res.status(404).json(
            {error: "Course doesnt exist" }
        );
        return res.json();        

    });
    
    
};
module.exports = main; //TODO:???



// Get MyCourses
/** 
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


//TODO:HÄR ÄR JAG!!!!!
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

*/
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
function getCourseData(mycourses, course) {
    
    // for (miuncourse of miundb.courses) {
                
    //     // Compares with coursecode
    //     if (course.courseCode == miuncourse.courseCode) {
            
    //         // Adds data from miudb.courses to myCourses            
    //         course["subjectCode"] = miuncourse.subjectCode;
    //         course["level"] = miuncourse.level;
    //         course["progression"] = miuncourse.progression;
    //         course["name"] = miuncourse.name;
    //         course["points"] = miuncourse.points;
    //         course["institutionCode"] = miuncourse.institutionCode;
    //     };
    
    // };
    
    for (mycourse of mycourses) {

        if (mycourse.courseCode == course.courseCode) {
            
            mycourse["subjectCode"] = course.subjectCode
            mycourse["level"] = course.level;
            mycourse["progression"] = course.progression;
            mycourse["name"] = course.name;
            mycourse["points"] = course.points;
            mycourse["institutionCode"] = course.institutionCode;
            mycourse["subject"] = course.subject;
        }
    } 

    return course;
    
};



