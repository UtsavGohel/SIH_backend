const express = require('express')
const router = express.Router()

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
    res.writeHead(200,{'Content-Type':'text/html'})
    const email = req.body.email;
    const password = req.body.password;
    let sql = "SELECT * from `user` where email = ? and password = ?" 
    if(email&&password){
        mysqlCon.query(sql,[email,password],function(error,result){
            if(error) throw error;
            
            if(result.length>0){
                res.write('Login Succesfull')
                res.end()
            }else{
                res.write('Invalid credentials')
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
    res.writeHead(200,{'Content-Type':'text/html'})
    const {email,password} = req.body;
    let sql = "SELECT email,password from `recruiter` where email = ? and password = ?" 
     mysqlCon.query(sql,[email,password], 
        function(err, result){
            if(email&&password){
                mysqlCon.query(sql,[email,password],function(error,result){
                    if(error) throw error;
                    
                    if(result.length>0){
                        res.write('Login Succesfull')
                        res.end()
                    }else{
                        res.write('Invalid credentials')
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
     mysqlCon.query("SELECT name,email,user.address,experience,subjects,resume,notice_period,collegeName,streamName,collegeName,DOB from user inner join college on (user.collegeId = college.id) inner join stream on (user.streamId = stream.id) WHERE user.id=?",
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
    res.writeHead(200,{'Content-Type':'text/html'})
    const {collegeName,Address} = req.body;
    let sql = "INSERT INTO `college` (collegeName,Address) VALUES (?,?)" 
     mysqlCon.query(sql,[collegeName,Address], 
        function(err, result){
            if(err) throw err;
            res.write('College Record inserted')
            res.end();
        });
});


//Add job data
router.post('/jobDetails', function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'})
    const {collegeId,job_description,noOfOpening} = req.body;
    let sql = "INSERT INTO `jobs` (collegeId,job_description,noOfOpening) VALUES (?,?,?)" 
     mysqlCon.query(sql,[collegeId,job_description,noOfOpening], 
        function(err, result){
            if(err) throw err;
            res.write('Job Record inserted')
            res.end();
        });
});

//Edit job data
router.put('/jobDetails', function(req, res){
    res.writeHead(200,{'Content-Type':'text/html'})
    const {id,collegeId,job_description,noOfOpening} = req.body;
    let sql = "UPDATE jobs SET collegeId=?,job_description=?,noOfOpening=? WHERE jobs.id = ?" 
     mysqlCon.query(sql,[collegeId,job_description,noOfOpening,id], 
        function(err, result){
            if(err) throw err;
            res.write('Updated Record')
            res.end();
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




module.exports = router;