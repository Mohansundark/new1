var express = require("express");
var app = express();
const bcrypt = require('bcrypt');
var jwt = require('jsonwebtoken');
var cors = require('cors');
var bodyParser = require('body-parser'); 
var mongoose = require("mongoose");

//connection 
mongoose.connect("mongodb://127.0.0.1:27017/TICKET-CRUD")
  .then(() => {
    console.log("Connected to MongoDB");
  })
  .catch((error) => {
    console.log("Failed to connect to MongoDB:", error.message);
  });

  mongoose.connection.on("error", (error) => {
    console.log("MongoDB Connection Error:", error);
  });
  
var user = require("./model/user.js");
var admin = require("./model/admin.js");
var ticket = require("./model/ticket.js");

app.use(cors());
app.use(express.static('uploads'));
app.use(bodyParser.json());      
app.use(bodyParser.urlencoded({    
  extended: false
}));

//admin authentication

app.use("/admin", (req, res, next) => {
  try {
    if (req.path == "/adminlogin" || req.path == "/adminregister" || req.path == "/admin") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.admin = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Ticket Support System'
  });
});

/* login api */
app.post("/adminlogin", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      admin.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/adminregister", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      admin.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let Admin = new admin({
            username: req.body.username,
            password: req.body.password
          });
          Admin.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ admin: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}




//user authentication
app.use("/user", (req, res, next) => {
  try {
    if (req.path == "/userlogin" || req.path == "/userregister" || req.path == "/user") {
      next();
    } else {
      /* decode jwt token if authorized*/
      jwt.verify(req.headers.token, 'shhhhh11111', function (err, decoded) {
        if (decoded && decoded.user) {
          req.user = decoded;
          next();
        } else {
          return res.status(401).json({
            errorMessage: 'User unauthorized!',
            status: false
          });
        }
      })
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
})

app.get("/", (req, res) => {
  res.status(200).json({
    status: true,
    title: 'Ticket Support System'
  });
});

/* login api */
app.post("/userlogin", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {
      user.find({ username: req.body.username }, (err, data) => {
        if (data.length > 0) {

          if (bcrypt.compareSync(data[0].password, req.body.password)) {
            checkUserAndGenerateToken(data[0], req, res);
          } else {

            res.status(400).json({
              errorMessage: 'Username or password is incorrect!',
              status: false
            });
          }

        } else {
          res.status(400).json({
            errorMessage: 'Username or password is incorrect!',
            status: false
          });
        }
      })
    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }

});

/* register api */
app.post("/userregister", (req, res) => {
  try {
    if (req.body && req.body.username && req.body.password) {

      user.find({ username: req.body.username }, (err, data) => {

        if (data.length == 0) {

          let User = new user({
            username: req.body.username,
            password: req.body.password
          });
          User.save((err, data) => {
            if (err) {
              res.status(400).json({
                errorMessage: err,
                status: false
              });
            } else {
              res.status(200).json({
                status: true,
                title: 'Registered Successfully.'
              });
            }
          });

        } else {
          res.status(400).json({
            errorMessage: `UserName ${req.body.username} Already Exist!`,
            status: false
          });
        }

      });

    } else {
      res.status(400).json({
        errorMessage: 'Add proper parameter first!',
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: 'Something went wrong!',
      status: false
    });
  }
});

function checkUserAndGenerateToken(data, req, res) {
  jwt.sign({ user: data.username, id: data._id }, 'shhhhh11111', { expiresIn: '1d' }, (err, token) => {
    if (err) {
      res.status(400).json({
        status: false,
        errorMessage: err,
      });
    } else {
      res.json({
        message: 'Login Successfully.',
        token: token,
        status: true
      });
    }
  });
}


//create 
app.post('/create', (req, res) => {
  // console.log('Received create ticket request');
  // console.log('Request body:', req.body);
  try {
    if (req.body.category && req.body.subCategory && req.body.description) {
      let new_ticket = new ticket();
      new_ticket.category = req.body.category;
      new_ticket.subCategory = req.body.subCategory;
      new_ticket.description = req.body.description;
      new_ticket.user_id = req.user.id;
      new_ticket.save((err, data) => {
        if (err) {
          res.status(400).json({
            errorMessage: err,
            status: false,
          });
        } else {
          res.status(200).json({
            status: true,
            title: "Ticket Created Successfully."
          });
        }
      });
    } else {
      res.status(400).json({
        errorMessage: "Add Proper Parameters first!",
        status: false
      });
    }
  } catch (e) {
    res.status(400).json({
      errorMessage: "Something went wrong!",
      status: false,
    });
  }
});


//update
app.post("/update" , (req, res)=>{
  try{
    if (req.body.category && req.body.subCategory && req.body.description) {
      
      ticket.findById(req.body.id , (err , new_ticket)=>{
        if(req.body.category){
          new_ticket.category = req.body.category;
        }
        if(req.body.subCategory){
          new_ticket.subCategory = req.body.subCategory;
        }
        if(req.body.description){
          new_ticket.description = req.body.description;
        }

        new_ticket.save((err, data)=>{
          if(err){
            res.status(400).json({
              errorMessage:err , 
              status:false,
            });

          }
          else{
            res.status(200).json({
              status:true, 
              title:"Ticket Updated Successfully."
            });
          }
        });
      });
    }
    else{
      res.status(400).json({
        errorMessage:"Add proper parameters.",
        status:false
      });
    }
  } catch(e){
    res.status(400).json({
      errorMessage:"Something went wrong.",
      status:false
    });
  }
});


//delete 
app.delete("/delete" , (req , res)=>{
  try{
    if(req.body && req.body.id){
      ticket.findByIdAndUpdate(req.body.id, { is_delete: true }, { new: true }, (err, data) => {
        if (data.is_delete) {
            res.status(200).json({
              status:true,
              title:"Ticket Deleted Successfully."
            });
        }
        else{
          res.status(400).json({
            errorMessage:err,
            status:false
          });
        }
      });
    }else{
      res.status(400).json({
        errorMessage:"Add proper parameters.",
        status:false
      });
    }
  } catch(e){
    res.status(400).json({
      errorMessage:"Something went wrong.",
      status:false 
    });
  }
});


app.listen(2000, () => {
  console.log("Server is Runing On port 2000");
});


process.on("uncaughtException", (error) => {
  console.log("Uncaught Exception:", error.message);
  process.exit(1);
});

process.on("unhandledRejection", (reason, promise) => {
  console.log("Unhandled Rejection:", reason);
  process.exit(1);
});
