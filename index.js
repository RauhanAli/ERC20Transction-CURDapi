const express = require("express");
const bodyParser = require('body-parser')
const mongoose = require("mongoose");
var cors = require('cors')
const url = 'mongodb://localhost/ERC20'
const app = express()
const port = 5000;
mongoose.connect(url, {useNewUrlParser:true})
const dbServer = mongoose.connection

dbServer.on('open',()=>{
    console.log('connected...')
})
app.use(cors())
app.use(express.json())

const router = require('./router/transaction')
app.use('/transaction',router)

app.listen(port,(e)=>{
    if(e){
        console.log("Sorry Server Not Working", e)
    }
    else{
        console.log("You are currenlty on the Port" + port)
    }
})