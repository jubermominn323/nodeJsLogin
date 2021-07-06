const express = require('express')
const router = express.Router()
const mongoose = require('mongoose')
const user = mongoose.model('user')
const bcrypt = require('bcrypt')
const jwt = require('jsonwebtoken')
const JWT_KEY = "kjdbdbujdvsubfiufsdnfjsdf"

router.post("/signup", (req, res) =>{
    console.log(req.body)
    const {name, email, password} = req.body

    if(!email || !name || !password){
        res.send({message:"Add All fields"})
    }

    user.findOne({email: email}).then(newUser =>{
        if(newUser)
            return res.send({message:"User Already Exists!"})

        bcrypt.hash(password, 12)
        .then(hashedPassword =>{
            const newUserEntry = new user({
                name, email, password: hashedPassword
            })
            newUserEntry.save()
            .then((newUserEntry) =>{
                res.send({message: "User Added Successfully!"})
            })
            .catch(err =>{
                console.log(err)
            })
        })
        .catch(err =>{
            console.log(err)
        })
    })
})

router.post("/signin", (req, res) =>{
    const {email, password} = req.body
    if(!email || !password){
        return res.send({message:"User not found!"})
    }

    user.findOne({email: email}).then(savedUser =>{
        if(!savedUser)
            return res.send({message:"Invalid Email or Password"})

        console.log(savedUser)
        console.log(savedUser.password)
        bcrypt.compare(password, savedUser.password)
        .then(doMatch =>{
            console.log(doMatch)
            if(doMatch){
                const token = jwt.sign({_id: savedUser._id}, JWT_KEY, {
                    expiresIn: "7d"
                })

                const {_id, name, email} = savedUser
                return res.json({
                    token, 
                    savedUser:{
                        _id,
                        name,
                        email
                    },
                    message:"User sign in successfully!"
                })
            }
            else
                res.send({message:"Invalid User!"})
        })
        .catch(err => console.log(err))
    })
})

module.exports = router