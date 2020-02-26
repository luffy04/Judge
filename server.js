const express = require('express');
const bodyParser = require('body-parser');
const fs=require('fs');
const { exec } = require('child_process');
const {c, cpp, node, python, java} = require('compile-run');

const app = express();

app.use(bodyParser.json({ limit: '10mb', extended: true }))
app.use(bodyParser.urlencoded({ limit: '10mb', extended: true }))

app.get('/api/customers', (req, res) => {
  const customers = [
    {id: 1, firstName: 'John', lastName: 'Doe'},
    {id: 2, firstName: 'Brad', lastName: 'Traversy'},
    {id: 3, firstName: 'Mary', lastName: 'Swanson'},
  ];

  res.json(customers);
});

app.post("/run", (req, res) => {
  var code=req.body.code;
  // fs.writeFile("Main.java",code,(err)=>{
  //   console.log("file created");
  // })

  // fs.readFile("input.txt",(err,data)=>{
  //   java.runFile("Main.java",{stdin:'5'},(err,result)=>{
  //       if(err){
  //           return res.send(err);
  //       }else{
  //           fs.writeFile("output.txt",result.stdout,(err)=>{
  //             console.log("output created");
  //           })
  //           res.json(result);
  //       }
  //     })    
  //   })
  fs.writeFile('data.cpp', req.body.code, (err) => {
    if (err) throw err;
    console.log("Saved!!");
  })
  exec('make data', (err, stdout, stderr) => {
      if (err) {
          console.log(stderr);
          return;
      }
      exec('./data', (err, stdout, stderr) => {
          fs.writeFile('output.txt', stdout, (err) => {
              if (err) throw err;
      else{
        console.log(stdout);
        res.send(stdout);
        }
      })
    })
  })

});

const port = 5000;

app.listen(port, () => `Server running on port ${port}`);