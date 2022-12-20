// Include all needed modules
/*global require, */
/*eslint no-unused-vars: 0*/
const express = require('express');
const cors = require('cors');
const mongoose = require("mongoose");
const dotenv = require('dotenv').config(); 

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

    // Creates a schema that defines a grade in the database
    const gradeSchema = new mongoose.Schema({
        
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

    // Creates a schema tha defines a myCourse in the database
    const mycourseSchema = new mongoose.Schema({
        
        courseCode: String,
        grade: String
        ,
        subjectCode: {
            type: String,            
            ref: 'Course'            
        }, 
        level: {
            type: String,            
            ref: 'Course'            
        }, 
        progression: {
            type: String,            
            ref: 'Course'            
        }, 
        name : {
            type: String,
            required: true,            
            ref: 'Course',
            default: -1
            
        }, 
        points: {
            type: String,            
            ref: 'Course'            
        }, 
        institutionCode: {
            type: String,            
            ref: 'Course'            
        }, 
        subject: {
            type: String,
            ref: 'Course'            
        }

        
    });
    
    // Creates a schema that defines a subject in the database
    const subjectSchema = new mongoose.Schema({
        
        subjectCode: String,
        subject: String,
        preamble: String,
        bodyText: String,
        language: String

    });
    
    // Compile to moongoose model
    const Course = mongoose.model('Course', courseSchema);
    const Grade = mongoose.model('Grade', gradeSchema);    
    const Mycourse = mongoose.model('Mycourse', mycourseSchema, 'myCourses'); //Speca 
    const Subject = mongoose.model('Subject', subjectSchema);

    // Set myCourses data from courses 
    Mycourse.subjectCode = Course.subjectCode;
    Mycourse.level = Course.level;
    Mycourse.progression = Course.progression;
    Mycourse.name = Course.name;
    Mycourse.points = Course.points;
    Mycourse.institutionCode = Course.institutionCode

    // Get MyCourses
    app.get('/api/courses/my', async function(req, res) {         
        
        // Gets data from mongoDB
        const mycourses = await Mycourse.find();
        const courses = await Course.find();

        // Declare variables
        var course;
        var mycourse;

        // Compare all miun corses
        for (course of courses) {
            
            // Compare all mycourses            
            for (mycourse of mycourses) {

                // If coursecode match
                if (mycourse.courseCode == course.courseCode) {                    
                    
                    // Gets the course-data to myCourse
                    getCourseData(mycourse, course)
                            
                };
            };
            
        };
        res.send(mycourses);             

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

        };
        
    });       
        
    // Get specific MyCourses course
    app.get('/api/courses/my/:courseCode', async function(req, res){

        // Define course
        var course;
        
        // Get the coursecode
        var code = req.params.courseCode;

        // Gets data from mongoDB
        const findMycourse = await Mycourse.findOne({"courseCode" : code});
        const courses = await Course.find();
        
        // If coursecode doesnt get an answer send empty json
        if (findMycourse == null) {

            res.send({});

        } else {

            for (course of courses) {
            
                // Gets the course-data to myCourse
                if (findMycourse.courseCode == course.courseCode) {
                    
                    // Get the data to be displayed in the result
                    getCourseData(findMycourse, course);

                };
                
            };
            
            res.send(findMycourse);

        };
        
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

        };
        
    });

    // Get the grades
    app.get('/api/grades', async function(req, res) {
        
        const fa = await Grade.findOne({"_id": "638c878dadb06a44d1763ae4"}, {"grades": 1})
        
        // Get the grades array from object
        const grades = fa.grades;

        // Send grades        
        res.send(grades);
        
    });    

    // Add a new MyCourse
    app.post('/api/courses/my', async function(req, res) {

        // Getting the params from body
        var newCoursecode = req.body.courseCode; 
        var newGrade = req.body.grade;

        // Define variables
        var mycourse;
        var course;

        const newMyCourse = new Mycourse({
            courseCode : newCoursecode,
            grade : newGrade
        });

        // Get myCourses && courses from mongoDB
        const mycourses = await Mycourse.find();
        const courses = await Course.find();       

        // Check if course exist in mongoDB
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
                  
                };
                // If course not in mycourses
                // Add the course to db
                await newMyCourse.save();

                // Get the data to be displayed in the result
                getCourseData(newMyCourse, course);        

                // Send status and return result
                res.status(201).json(newMyCourse);                
                return res.json();

            };          
            
        };
        // If course doesnt exist in mongoDB
        res.status(404).json(
            {error: "Course doesnt exist" }
        );
        return res.json();        

    });
    
    // Update a my-course
    app.put('/api/courses/my/:courseCode', async function(req, res) {

        // Getting the coursecode
        var code = req.params.courseCode;

        // Define variables
        var mycourse;
        var course;

        // Getting mycourses and courses from mongoDB
        const mycourses = await Mycourse.find();
        const courses = await Course.find();

        for (mycourse of mycourses) {

            if (mycourse.courseCode == code) {
                
                // Update the grade
                mycourse.grade = req.body.grade;                

                // Add the course to db
                await mycourse.save();

                // Get the data to be displayed on mycourse 
                for (course of courses) {

                    getCourseData(mycourse, course);

                };                

                // Send status and return result
                res.status(200).json(mycourse);                
                return res.json();
            }
        }
        // If not in mycourses
        res.status(404).json(
            {error : "Course doesnt exist in MyCourses"} 
        );
        return res.json();
    });

    // Delete a My-course
    app.delete('/api/courses/my/:courseCode', async function(req, res) {

        // Get the code for course to be deleted
        var code = req.params.courseCode;

        // Define variables
        var course;
        var delCourse;

        // Retrieve the "myCourses" and courses array from mogoDB
        const mycourses = await Mycourse.find();
        const courses = await Course.find();
        
        for (course of courses) {

            // If in myCourses
            for(var i=0; i<mycourses.length; i++) {

                if(mycourses[i].courseCode == code) {
                    delCourse = mycourses[i];

                    // Remove the course from the array
                    mycourses.splice(i, 1);

                    // Update the "myCourses" array in the collection by removing object          
                    await Mycourse.deleteOne({ courseCode: code });
            
                    // Get the data to be displayed in the result
                    getCourseData(delCourse, course);
                             
                    // Send status and return result
                    res.send(delCourse);
                    return res.json();
                };       
            };
           
        };
        // If not in mycourse
        res.status(404).json({ error: "Course does not exist in MyCourses" }); 

    });
        
};

/**
 * 
 * @param {*} mycourse a mycourse from mongoDB
 * @param {*} miuncourse a miuncourse from mongoDB
 * @returns mycourse with course data data from miuncourse
 */
function getCourseData(mycourse, miuncourse) {

    mycourse["subjectCode"] = miuncourse.subjectCode
    mycourse["level"] = miuncourse.level;
    mycourse["progression"] = miuncourse.progression;
    mycourse["name"] = miuncourse.name;
    mycourse["points"] = miuncourse.points;
    mycourse["institutionCode"] = miuncourse.institutionCode;
    mycourse["subject"] = miuncourse.subject;

    return mycourse;
}