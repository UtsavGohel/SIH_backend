CREATE TABLE user (
    id int NOT NULL AUTO_INCREMENT,
    name varchar(255) NOT NULL,
    email varchar(255) NOT NULL,
    password varchar(255) NOT NULL,
    roleId int NOT NULL,
    address varchar(255) NOT NULL,
    contact int NOT NULL,
    experience int NOT NULL,
    collegeId int NOT NULL,
    streamId int NOT NULL,
    subjects varchar(255) NOT NULL,
    resume varchar(255) NOT NULL,
    notice_period int ,
    PRIMARY KEY (id),
    FOREIGN KEY (roleId) REFERENCES role(id),
    FOREIGN KEY (collegeId) REFERENCES college(id),
    FOREIGN KEY (streamId) REFERENCES stream(id)
);


//user registration
name,
email,
password,
address,
contact, 
experience,
collegeName,  //use select tag
streamName,   //use select tag
subjects,
resume,
notice_period

//user login
email,
password

//recruiter registration
id,
name,
email, 
password, 
address, 
contact, 
collegeName //use select tag

//recruiter login
email, 
password, 

