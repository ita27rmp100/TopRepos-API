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
      if(error){console.log("Error :",error)}
      console.log(`${country} : done`)
      setTimeout(()=>{
        RecursivePushCountryData((index+1)%countries.length)
      },360000)
    })
  }
}
RecursivePushCountryData(0)
// post data
  // top repos
app.get('/api/repos',(req,res)=>{
  if(Object.keys(req.query).length===0)return res.json({msg:"empty query"}) 
  try{
    const data = require(`${__dirname}/CountryJSON/${req.query.country}.json`)
    const last = require('./countryList.json')
    res.json(data,last)
  }catch(err){
    res.json({'error':err.code})
  }
})
  // last update and countries list
app.get('/api/metadata',(req,res)=>{
  try{
    const data = require('./countryList.json')
    res.json(data)
  }catch(err){
    res.json({'error':err.code})
  }
})
// add ping
app.get('/ping',(req,res)=>{
  res.json({msg:'pong'})
})



module.exports = app;