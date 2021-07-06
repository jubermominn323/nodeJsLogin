var express = require('express')
var app = express()
const bodyParser = require('body-parser')
var mongoose = require('mongoose')
var cors = require('cors')
require("./models/user")
const userRoutes = require("./routes/auth")

app.use(bodyParser.json())

mongoose.connect('mongodb://localhost:27017/DemoDB', {
    useNewUrlParser: true, useUnifiedTopology: true
}).then(console.log("DB connected!"))

app.use(cors())

app.get('/', (req, res) =>{
    res.send("Hello World")
})

app.use("/auth", userRoutes)

// app.get('/middle', (req, res, next) =>{
//     console.log("In middleware")
//     next(), function(req, res){
//         res.send("after middleware")
//     }
// })

app.listen(5000, () =>{
    console.log("Server started at port 5000!")
})

