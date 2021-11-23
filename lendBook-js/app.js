var express = require('express');
var app = express()

app.use(express.urlencoded({ extended: true }))
app.use(express.json());
var path = require("path")

const multer = require('multer')

const cors = require("cors")
app.use(cors())

const { MongoClient, ObjectId } = require('mongodb');
const url = "mongodb://127.0.0.1:27017"

const dbName = 'book_db'

app.get("/", function (req, res) {
    res.send("Hello!! THERE")
})
app.get("/view", function (req, res) {
    MongoClient.connect(url, (err, con) => {
        var db = con.db("book_db")
        db.collection("user_tbl").find()
            .toArray((err, data) => {
                //console.log(data);
                res.send(data)
            })
    })
})

app.post('/newlend',(req,res)=>{

    console.log(req.body);
    req.body.requestNo = "BK-"+new Date().getFullYear()+"-"+(new Date().getMonth()+1)+"-"+ Math.floor(Math.random() * (999) + 100)
  
    MongoClient.connect(url, (err, conn) => {
        var db = conn.db('book_db');
        db.collection('user_tbl').find({ Email: req.body.Email }).toArray((err, data) => {
            //console.log(data.status==0);
            if (err) {
                res.send(err);
            }
            else {
                if (data.length>0) {
                    console.log("u:",data);
                    data.map((e)=>{
                        var rdate = new Date(e.rcal)
                        var cdate = new Date()
                        if (rdate.getTime()>=cdate.getTime()) {
                            res.send('you already lended a book.');
                        }
                        else{
                            db.collection('user_tbl').updateOne(
                                { Email: req.body.Email },
                                { $set: req.body },
                                (err, data) => {
                                    res.send(data)
                                }
                            )                           
                        }
                    })
                    // res.send('you already lended a book.');
                }
                else {
                    db.collection('user_tbl').insertOne(req.body, (err, data) => {
                        if (err) {
                            //console.log(err);
                            res.send(err)
                        } else {
                            res.send(data);
                        }
                    });
                }
            }
        });
    });
})

app.patch('/updateStatus/:id', (req, res) => {
    MongoClient.connect(url, (err, conn) => {
        var db = conn.db('book_db');
        db.collection('user_tbl').updateOne(
            { _id: ObjectId(req.params.id) },
            { $set: req.body },
            (err, data) => {
                res.send(data)
            }
        )
    })
})

app.delete('/Delete/:id', (req, res) => {
    MongoClient.connect(url, (err, conn) => {
        var db = conn.db('book_db');
        db.collection('user_tbl').findOneAndDelete(
            { _id: ObjectId(req.params.id) },
            { $set: req.body },
            (err, data) => {
                res.send(data)
            }
        )
    })
})



app.listen(2525, function () {
    console.log(" running 2525")
})