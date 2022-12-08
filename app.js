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
        _id: String, //TODO:necesarry?
        courseCode: String,
        grade: String,
        subjectCode: {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        level: {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        progression: {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        name : {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        points: {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        }, //TODO:correct?
        institutionCode: {
            type: Number,
            required: true,
            ref: 'Course',
            default: -1
        } //TODO:correct?
        
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
    // Mycourse.subjectCode = Course._id; //TODO:correct?
    // Mycourse.level = Course._id;
    // Mycourse.progression = Course._id;
    // Mycourse.name = Course._id;
    // Mycourse.points = Course._id;
    // Mycourse.institutionCode = Course._id

    // Get MyCourses
    //const mycourses = await Mycourse.find()//.populate('level');
    //console.log(mycourses);


    // Returnera allt från databasen
    // console.log("find all courses");
    //const courses = await Course.find();
    // console.log(courses);

    // // Returnera AK00
    //  console.log("Find all with:AK001U");
    //  const coursesAK00 = await Course.find({
    //      courseCode: 'AK001U'
    //   });
    //  console.log(coursesAK00);

    // //console.log("Add myCourse in mongoDB")

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


    // console.log("Find all courses ending with U");
    // const endingWithU = await Course.find({
    //     courseCode: {$regex : 'U$'}
    // }, ['name','courseCode'] //Only return name and courscode
    // );
    // console.log(endingWithU);

    // Returnera all myCourses //TODO:not working!
    // console.log("Find all myCourses");   

    // console.log("Test mycourses");
    // const test = await Mycourse.find({
    //    grade: {$regex: 'A$'} 
    // }, ['grade']
    // );
    // console.log(test);
    // console.log(mycourses);

    // // Return all subject
    // console.log("return subjects");
    // const subject = await Subject.find();
    // console.log(subject);

    // Return all institutions
    // console.log("find all institutions");
    // const institutions = await Institution.find();
    // console.log(institutions);

    // Return all grades
    // console.log("Getting the grades");
    // const grades = await Grade.find();
    // console.log(grades);

    // Get MyCourses
    app.get('/api/courses/my', async function(req, res) { 
        const mycourses = await Mycourse.find()
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
        
        const findcourse = await Course.find({"courseCode" : code});
        res.send(findcourse);
    });       
        
    // Get specific MyCourses course
    app.get('/api/courses/my/:courseCode', async function(req, res){

        // Get the coursecode
        var code = req.params.courseCode;

        const findMycourse = await Mycourse.find({"courseCode" : code});
        res.send(findMycourse);
    })

    // Get all the subjects
    app.get('/api/subjects', async function(req, res) {

        const subjects = await Subject.find();
        res.send(subjects);
    })

    // Get a specific subject
    app.get('/api/subjects/:subjectCode', async function(req, res) {

        // Get the subjectcode
        var code = req.params.subjectCode;

        const findSubject = await Subject.find({"subjectCode" : code})
        res.send(findSubject);
    });

    // Get all grades
    app.get('/api/grades', async function(req, res) {

        const grades = await Grade.find();
        res.send(grades);
    });

    // Get grades ug
    app.get('/api/grades/ug', async function(req, res) {

        const ugGrades = await Grade.find({"name" : "ug"})
        res.send(ugGrades);
    })

    // Get grades uvg
    app.get('/api/grades/uvg', async function(req, res) {

        const ugvGrades = await Grade.find({"name" : "uvg"})
        res.send(ugvGrades);
    })

    // Get grades fa
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
        const mycourses = await Mycourse.find().to
        const courses = await Course.find()

        // Check if course already exist in myCourses
        for (courseCode of mycourses.courseCode) {
            
            if(newCourseCode == courseCode) {
                // Send error message
                res.status(409).json(
                    {error : "Course already exist in MyCourses"} 
                );
                return res.json();
            }
        }
        // If course not in myCourses
        for (courseCode of courses.courseCode) {  
            // If the course exist in miundb
            if (newMyCourse.courseCode == courses.courseCode) {
                
                try {

                    await newMyCourse.save();
                    res.status(201);

                } catch (error) {
                    console.error(error.message);
                }
                                
            } 
        };

        for (courses of courses.courses) {  
            if (newMyCourse.courseCode != courses.courseCode) {
                 // If not in miundb send error message
                 res.status(404).json(
                    {error: "Course doesnt exist" }
                );
                return res.json();
            };         
        };


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

*/
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



