const express = require('express')
const csvtojsonV1=require('csvtojson');
var path = require('path');
var fs = require('fs'),
path = require('path')  
const csv = require('fast-csv')

    
const router = express.Router()
var multer = require('multer')


const mysqlCon = require('./conn')

// User Register 
router.post('/user_register', function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'})
    const {name,email,password,address,contact,experience,collegeId,streamId,subjects,resume,notice_period,DOB} = req.body;
    let sql = "INSERT INTO `user` (name,email,password,address,contact,experience,collegeId,streamId,subjects,resume,notice_period,DOB) VALUES (?,?,?,?,?,?,?,?,?,?,?,?)" 
     mysqlCon.query(sql,[name,email,password,address,contact,experience,collegeId,streamId,subjects,resume,notice_period,DOB], 
        function(err, result){
            if(err) throw err;
            res.write('Users Record inserted')
            res.end();
        });
});

//User login
router.post('/user_login', function(req, res){
    const email = req.body.email;
    const password = req.body.password;
    let sql = "SELECT * from `user` where email = ? and password = ?" 
    if(email&&password){
        mysqlCon.query(sql,[email,password],function(error,result){
            if(error) throw error;
            
            if(result.length>0){
                
                res.status(200).json({msg:'Login Succesfull',data:result[0]})
                
                res.end()
            }else{
                res.status(401).json('Invalid credentials')
                res.end()
            }
        })
    }
});


// Recruiter Register
router.post('/recruiter_register', function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'})
    const {name,email, password,address, contact, collegeId} = req.body;
    let sql = "INSERT INTO `recruiter` (name,email, password,address, contact, collegeId) VALUES (?,?,?,?,?,?)" 
     mysqlCon.query(sql,[name,email, password,address, contact, collegeId], 
        function(err, result){
            if(err) throw err;
            res.write('Recruiter Record inserted')
            res.end();
        });
});

//Recruiter login
router.post('/recruiter_login', function(req, res){
    const {email,password} = req.body;
    let sql = "SELECT * from `recruiter` where email = ? and password = ?" 
     mysqlCon.query(sql,[email,password], 
        function(err, result){
            if(email&&password){
                mysqlCon.query(sql,[email,password],function(error,result){
                    if(error) throw error;
                    
                    if(result.length>0){
                        res.status(200).json({msg:'Login Succesfull',data:result[0]})
                        res.end()
                    }else{
                        res.status(401).json('Invalid credentials')
                        res.end()
                    }
                })
            }
        });
});

//All Details of user
router.get('/user_details', function(req, res){
    let sql = "SELECT name,email,user.address,experience,subjects,resume,notice_period,collegeName,streamName,collegeName,DOB from user inner join college on user.collegeId = college.id inner join stream on user.streamId = stream.id" 
     mysqlCon.query(sql,
        function(err, result){
            if(result) {
                res.json(result)
                res.end();
            }else{                
                res.write('error')
                throw err;

            }
        });
});


//All Details of user by id
router.get('/user_details/:id', function(req, res){
     mysqlCon.query("SELECT name,email,user.address,experience,subjects,resume,notice_period,collegeName,streamName,collegeName,DOB from user inner join college on (user.collegeId = college.id) inner join stream on (user.streamId = stream.id) WHERE user.id=? " ,
     [req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{                
                res.write('error')
                throw err;
            }
        });
});

//All Details of job by recruiter id
router.get('/get_jobs/:id', function(req, res){
    mysqlCon.query("SELECT jobs.id, recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId from jobs inner join recruiter on (jobs.recruiterId = recruiter.id) WHERE recruiter.id=? " ,
    [req.params.id],
       function(err, result){
           if(result) {
               res.json(result)
               res.end();
           }else{                
               res.write('error')
               throw err;
           }
       });
});

// Edit Details of user
// provide all the details..
router.put('/editUser_register',function(req,res){
   const {id,name,email,password,address,contact,experience,collegeId,streamId,subjects,resume,notice_period}= req.body
   
    let sql = `UPDATE user SET name=?,email=?,password=?,address=?,contact=?,experience=?,collegeId=?,streamId=?,subjects=?,resume=?,notice_period=? WHERE user.id = ?`;    

    mysqlCon.query(sql,[name,email,password,address,contact,
        experience,collegeId,streamId,subjects,
        resume,notice_period,id],
        function(error,response){
            if(res) {
                res.write('Updated')
                res.end();
            }else{                
                res.write('error')
                throw error;
            }
    })       
})


//Add college data
router.post('/clgData', function(req, res){
    
    const {collegeName,Address,contact,estSince,description,fbPage,twitterPage,linkdinPage,instagramPage,youtubePage} = req.body;
    let sql = "INSERT INTO `college` (collegeName,Address,contact,estSince,description,fbPage,twitterPage,linkdinPage,instagramPage,youtubePage) VALUES (?,?,?,?,?,?,?,?,?,?)" 
     mysqlCon.query(sql,[collegeName,Address,contact,estSince,description,fbPage,twitterPage,linkdinPage,instagramPage,youtubePage], 
        function(err, result){
            if(err) throw err;
            else{
                res.status(200).json('College Record  inserted')
                // res.write(err)
                res.end();
            }
        });
});
//Edit college data
router.put('/clgData', function(req, res){
    
    const {collegeName,Address,contact,estSince,description,fbPage,twitterPage,linkdinPage,instagramPage,youtubePage} = req.body;
    let sql = "UPDATE college SET collegeName=?,Address=?,contact=?,estSince=?,description=?,fbPage=?,twitterPage=?,linkdinPage=?,instagramPage=?,youtubePage=? WHERE college.id = ?" 
     mysqlCon.query(sql,[collegeName,Address,contact,estSince,description,fbPage,twitterPage,linkdinPage,instagramPage,youtubePage], 
        function(err, result){
            if(err) throw err;
            else{
                res.status(200).json('College Record  inserted')
                // res.write(err)
                res.end();
            }
        });
});


//Add job data
router.post('/jobDetails', function(req, res){    
    const {recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId} = req.body;
    let sql = "INSERT INTO `jobs` (recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId) VALUES (?,?,?,?,?,?,?,?,?,?)" 
     mysqlCon.query(sql,[recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId], 
        function(err, result){
            if(err) throw err;
            res.status(200).json({msg:'Record Inserted Successfully'})
            res.end();
        });
});

//Edit job data
router.put('/jobDetails', function(req, res){
    const {id,recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId} = req.body;
    let sql = "UPDATE jobs SET recruiterId=?, jobTitle=?, jobDescription=?, noOfOpening=?, jobTypeId=?, streamId=?, experience=?, qualification=?, city=?, stateId=? WHERE jobs.id = ?" 
     mysqlCon.query(sql,[recruiterId, jobTitle, jobDescription, noOfOpening, jobTypeId, streamId, experience, qualification, city, stateId,id], 
        function(err, result){
            if(err) throw err;
            res.status(200).json({msg:'Record Updated Successfully'})
            res.end();
        });
});

// Delete job data
router.delete('/deleteJob/:id', function(req, res){  
    let sql = "DELETE from jobs WHERE jobs.id=?"; 
    mysqlCon.query(sql,[req.params.id], 
        function(err, result){
            if(err) throw err;
            res.status(200).json({msg:'Record Deleted Successfully'})
            res.end();
        });
});

// get applicants for a job
router.get('/getApplications/:id', function(req, res){
    mysqlCon.query("SELECT * from applications inner join jobs on (applications.jobId = jobs.id) inner join user on applications.userId = user.id WHERE jobs.id=? " ,
    [req.params.id],
       function(err, result){
           if(result) {
               res.json(result)
               res.end();
           }else{                
               res.write('error')
               throw err;
           }
       });
});

//Add stream data
router.post('/streamDetails', function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'})
    const {streamName} = req.body;
    let sql = "INSERT INTO `stream` (streamName) VALUES (?)" 
     mysqlCon.query(sql,[streamName], 
        function(err, result){
            if(err) throw err;
            res.write('Stream Record inserted')
            res.end();
        });
});

// display a whole job details..
router.get('/job_details', function(req, res){
    let sql = "select jobs.id,collegeName,Address,job_description,noOfOpening from college join jobs on college.id = jobs.collegeId" 
     mysqlCon.query(sql,
        function(err, result){
            if(result) {
                res.json(result)
                res.end();
            }else{                
                res.write('error')
                throw err;

            }
        });
});

// display single job details by Id..
router.get('/job_details/:id', function(req, res){
    let sql = "select * from jobs where id=?" 
     mysqlCon.query(sql,[req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{                
                res.write('error')
                throw err;

            }
        });
}); 



//storage for csv file
var storage = multer.diskStorage({
    destination: function (req, file, cb) {
       cb(null, 'uploads');
    },
    filename: function (req, file, cb) {
       cb(null, `${file.fieldname}-${Date.now()}${path.extname(file.originalname)}`);
    }
 });
 var upload = multer({ storage: storage });

// Insert proffersor data into portal by csv
 router.post('/addcsv', upload.single('data'), (req, res, next) => {
    const file = req.file;
    var filename = req.file.filename;
    console.log(filename);
    if (!file) {
       return res.status(400).send({ message: 'Please upload a file.' });
    }
    var sql = "INSERT INTO data (`data`) VALUES (?)";
    var query = mysqlCon.query(sql, function(err, result) {
        return res.send({ message: 'File is successfully.', file });
     });
    //  filePath=path.join(__dirname,'/uploads',filename);
    //  console.log(filename,"get");
    //  fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
    //      if (!err) {
    //          console.log('received data: ' + data);
    //          response.writeHead(200, {'Content-Type': 'text/html'});
    //          response.write(data);
    //          response.end();
    //      } else {
    //          console.log(err);
    //      }
    //  }); 
 });

//  get proffersor data from csv
router.get('/readcsv',function(req,response){
        filePath=path.join(__dirname,'/uploads','abc.csv');
        // console.log(filename,"get");
        fs.readFile(filePath, {encoding: 'utf-8'}, function(err,data){
            if (!err) {
                console.log('received data: ' + data);
                response.writeHead(200, {'Content-Type': 'text/html'});
                response.write(data);
                response.end();
            } else {
                console.log(err);
            }
        });        
    })

    filePath=path.join(__dirname,'/uploads','Sample.csv');

    // function UploadCsvDataToMySQL(filePath){
    //     let stream = fs.createReadStream(filePath);
    //     let csvData = [];
    //     let csvStream = csv
    //         .parse()
    //         .on("data", function (data) {
    //             csvData.push(data);
    //         })
    //         .on("end", function () {
    //             // Remove Header ROW
    //             csvData.shift();
      
    //             // Open the MySQL connection
    //             mysqlCon.connect((error) => {
    //                 if (error) {
    //                     console.error(error);
    //                 } else {
    //                     let query = 'INSERT INTO employee (name,contact,address,experience,collegeId,stream,subject,DOB) VALUES (?,?,?,?,?,?,?,?)';
    //                     mysqlCon.query(query, [csvData], (error, response) => {
    //                         console.log(error || response);
    //                     });
    //                 }
    //             });
                 
    //             // delete file after saving to MySQL database
    //             // -> you can comment the statement to see the uploaded CSV file.
    //             fs.unlinkSync(filePath)
    //         });
      
    //     stream.pipe(csvStream);
    // }
         
// router.get('/adddataToDB',(req,res)=>{
//     UploadCsvDataToMySQL(filePath)
// })

// //Apply for job -- not done yet
// router.post('/jobApply', function(req, res){
//     res.writeHead(200,{'Content-Type':'text/html'})
//     const {collegeId,job_description,noOfOpening} = req.body;
//     let sql = "" 
//      mysqlCon.query(sql,[], 
//         function(err, result){
//             if(err) throw err;
//             res.write('Job Record inserted')    
//             res.end();
//         });
// });


//Get college name
router.get('/getCollege',(req,res)=>{
    let sql = 'select id,collegeName from college';
    mysqlCon.query(sql,function(err, result){
                    if(err) throw err;
                    res.send(result)    
                    res.end();
                });
})
//Get stream name
router.get('/getStream',(req,res)=>{
    let sql = 'select id,streamName from stream';
    mysqlCon.query(sql, function(err, result){
                    if(err) throw err;
                    res.send(result)    
                    res.end();
                });
})
//Get jobType name
router.get('/getJobType',(req,res)=>{
    let sql = 'select id,name from job_types';
    mysqlCon.query(sql, function(err, result){
                    if(err) throw err;
                    res.send(result)    
                    res.end();
                });
})

//Get state name
router.get('/getState',(req,res)=>{
    let sql = 'select id,name from states';
    mysqlCon.query(sql, function(err, result){
                    if(err) throw err;
                    res.send(result)    
                    res.end();
                });
})

// Get number of  applicants of job
router.get('/getNumberOfApplicant/:id',(req,res)=>{
    mysqlCon.query("SELECT COUNT(applications.id) as count from applications inner join jobs on (applications.jobId = jobs.id) WHERE jobs.id=? " ,
     [req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{
                res.write('error')
                throw err;
            }
        });
})

// Get stream name by id
router.get('/getStreamName/:id',(req,res)=>{
    mysqlCon.query("SELECT streamName from stream WHERE id=? " ,
     [req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{                
                res.write('error')
                throw err;
            }
        });
})

// Get jobType name by id
router.get('/getJobType/:id',(req,res)=>{
    mysqlCon.query("SELECT name from job_types WHERE id=? " ,
     [req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{                
                res.write('error')
                throw err;
            }
        });
})

// Get status by id
router.get('/getStatusName/:id',(req,res)=>{
    mysqlCon.query("SELECT name from statuses WHERE id=? " ,
     [req.params.id],
        function(err, result){
            if(result) {
                res.json(result[0])
                res.end();
            }else{                
                res.write('error')
                throw err;
            }
        });
})

//All candidate list
router.get('/getCandidateList/:id', function(req, res){
    mysqlCon.query("SELECT * from applications inner join jobs on applications.jobId = jobs.id inner join recruiter on jobs.recruiterId = recruiter.id join user on applications.userId = user.id WHERE recruiter.id=? " ,
    [req.params.id],
       function(err, result){
           if(result) {
               res.json(result)
               res.end();
           }else{                
               res.write('error')
               throw err;
           }
       });
});

//change recruiter password
router.patch('/change_password/:id',function(req,res){
    const {password}= req.body
    const {id}= req.params
    
     let sql = `UPDATE recruiter SET password=? WHERE recruiter.id = ?`;    
 
     mysqlCon.query(sql,[password,id],
         function(error,response){
             if(response) {
                 res.status(200).json('Password Updated')
                 
                 res.end();
             }else{                
                 res.status(400).json('error')
                 throw error;
             }
     })       
 })

 //professor details
router.get('/AllProfessor/:id',function(req,res){
    // const id=req.params.collegeId
    let sql = "SELECT employee.id,employee.name,employee.contact,employee.address,employee.experience,collegeName,streamName,subject,employee.DOB FROM employee inner join college on employee.collegeId=college.id inner join stream on employee.streamId = stream.id where collegeId = ?";
    // SELECT * from `user` where email = ? and password = ?
    mysqlCon.query(sql,[req.params.id],
        function(err, result){
            if(result) {
                res.json(result)
                res.end();
            }else{                
                res.write('error')
                throw err;

            }
        });
}) 

//All JOb list
router.get('/AllJobsList',function(req,res){
    let sql = "SELECT jobTitle,jobDescription,noOfOpening,job_types.name,stream.streamName,experience,qualification from jobs inner join job_types on jobs.jobTypeId = job_types.id inner join stream on jobs.streamId=stream.id inner join states on jobs.stateId = states.id";
    mysqlCon.query(sql,[req.params.id],
        function(err, result){
            if(result) {
                res.json(result)
                res.end();
            }else{                
                res.write('error')
                throw err;

            }
        });
})
module.exports = router;