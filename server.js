const express = require('express');
const app = express();
const bodyParser = require('body-parser');
const fs=require('fs');
const bcrypt=require('bcryptjs');
const passport = require('passport');
const passportLocal = require('passport-local').Strategy;
const session = require('express-session');
const { exec } = require('child_process');
const http=require('http');
const server=http.Server(app);
const socket=require('socket.io');
const io=socket(server);
const {c, cpp, node, python, java} = require('compile-run');
const database=require('./database');
const saltRounds = 10;
var names=[];
var rooms=[];

app.use(session({secret: 'I have a dog',resave:true,saveUninitialized:true}));

app.use(passport.initialize());
app.use(passport.session());
app.use(bodyParser.json({ limit: '10mb'}))

app.use(bodyParser.json());


app.post('/registers',(req,res)=>{
    bcrypt.genSalt(saltRounds, function(err, salt) {
        bcrypt.hash(req.body.password, salt, function(err, hash) {
            database.signUp(req.body.username, req.body.email,hash, function(err,data) {
                if(err) res.send(err)
                else res.send(data);
            })
        });
    });
})

app.get('/get',(req,res)=>{
    res.send(names);
})

app.post("/run", (req, res) => {
  var mode = req.body.mode;
    if (mode === 'c_cpp') {
        fs.writeFile('data.cpp', req.body.code, (err) => {
            if (err) throw err;

            //console.log("Saved!!");
        })
        exec('make data', (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
                fs.writeFile('output.txt', stderr, (err) => {
                    if (err) throw err;
                    else {
                        res.send(stderr);
                    }
                })
                return;
            } else {
                exec('./data', (err, stdout, stderr) => {
                    fs.writeFile('output.txt', stdout, (err) => {
                        if (err) throw err;
                        else {
                            res.send(stdout);
                        }
                    })
                })
            }
        })
    }
    if (mode === 'java') {
        fs.writeFile('Main.java', req.body.code, (err) => {
            if (err) throw err;

            console.log("Saved!!");
        })
        exec('javac Main.java', (err, stdout, stderr) => {
            if (err) {
                console.log(stderr);
                fs.writeFile('output.txt', stderr, (err) => {
                    if (err) throw err;
                    else {
                        res.send(stderr);
                    }
                })
                return;
            } else {
                exec('java Main < input.txt', (err, stdout, stderr) => {
                    fs.writeFile('output.txt', stdout, (err) => {
                        if (err) throw err;
                        else {
                            res.send(stdout);
                        }
                    })
                })
            }
        })
    }
});


app.post('/loginsecure', passport.authenticate('local',{
    successRedirect:'/success',
    failureRedirect:'/failure'
  }));
  
  passport.use(new passportLocal(
      function(username, password, done) {
          database.getUser(username, function(data) {
            if(data==""){ 
                return done(null,false,{message:"username is incorrect"});
            }
            else{
                bcrypt.compare(password, data[0].password, function(err, res) {
                    if(res){
                        return done(null,data[0]);
                    }else{
                        return done(null, false, {message: 'password is incorrect'});
                }
              });
            }
          })
      })
  );
  
  passport.serializeUser(function(id, done) {
      return done(null, id);
  });
  
  passport.deserializeUser(function(id, done) {
      return done(null, id)
  });
  
  app.get('/success', function(req,res) {
      v=req.user;
      console.log(req.user);
      res.send("success");
  });
  
  app.get('/failure', function(req,res) {
      req.logout();
      res.send('failure')
  });

io.sockets.on('connection',(socket)=>{

    socket.on("getAll",()=>{
        io.emit("setAll",names);
    })

    socket.on("hello",(data)=>{
        socket.emit("data",data);
    })

    socket.on("push",(data)=>{
        if(names.indexOf(data)!=-1){
            socket.emit("alertUser",data,names);
        }else{
            names.push(data);
            console.log(names);
            socket.emit("confrm",data);
        }
    })

    socket.on("pushUser",(data)=>{
        if(names.indexOf(data)==-1){
            names.push(data);
        }
    })

    socket.on("getter",()=>{
        console.log(names);
        socket.emit("setter",names);
    })

    socket.on("create",(room)=>{
        socket.join(room);
    })

    socket.on("change",(data,user,room)=>{
        io.to(room).emit("back",data,user);``
    })

    socket.on("closing",(room)=>{
        var index=rooms.indexOf(room);
        if(index!=-1)rooms.splice(index,1);
        io.to(room).emit("closingConfirm",room);
    })

    socket.on("enter",(room)=>{
        socket.join(room);
    })

    socket.on("roomReq",(room,name)=>{
        console.log("esafdc")
        io.emit("roomJoin",room,name);
    })

    socket.on("roomPush",(room,id)=>{
        if(rooms.indexOf(room)!=-1){
            socket.emit("alertRoom",rooms,id);
        }else{
            rooms.push(room);
            socket.emit("confrmRoom",room,id);
        }
    })

    socket.on("createid",(room)=>{
        socket.join(room);
    })

    socket.on("requestSend",(from,to)=>{
        io.emit("sendBack",from,to);
    })

})

const port = 5000;

server.listen(port, () => `Server running on port ${port}`);