// needed packages
const createError = require('http-errors');
const express = require('express');
const {exec} = require("child_process")
const fs = require("fs")

const app = express();
// working on data 
const countries = require("./countryList.json").countries.sort()
function RecursivePushCountryData(index){
  let lastUpdate = new Date(require("./countryList.json").LastUpdate) , path =''
  const current = new Date() ; ; countryNum = Object.keys(countries).length
  if (Math.floor((current-lastUpdate)/(3600*1000))>24){
    fs.writeFileSync(
        `${__dirname}/countryList.json`,
        JSON.stringify({
        ...require("./countryList.json"),
        LastUpdate: new Date().toISOString().replace("T"," ").replace("Z","")
        }, null, 2)
    )
  }
  if(index<=countries.length){
    const country = countries[index]
    exec(`node filter.js ${country}`,(error,stdout,stderr)=>{
      if(error){console.log("Error :",error) ; return}
      console.log(`${country} : done`)
      RecursivePushCountryData((index+1)%countries.length)
    })
  }
}
RecursivePushCountryData(0)
// post data
app.get('/get/countrey')

// add ping
app.get('/ping',(req,res)=>{
  res.json({msg:'pong'})
})



module.exports = app;