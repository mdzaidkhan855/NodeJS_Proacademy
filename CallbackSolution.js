// Run this programme: node CallbackSolution.js

const fs = require('fs');

fs.readFile('./README.md','utf-8',(err,data)=>{
    console.log("Inside First loop");
    fs.readFile('./README.md','utf-8',(err,data)=>{
        console.log("Inside Second loop");
        fs.readFile('./README.md','utf-8',(err,data)=>{
            console.log("Inside Third loop");
        })
    })
})
console.log("Main thread continues...");

const avoidCallbacHell = async()=>{
    await fs.readFile('./README.md','utf-8',(err,data)=>{
        console.log("Inside First loop:avoidCallbacHell");
    })
    await fs.readFile('./README.md','utf-8',(err,data)=>{
        console.log("Inside Second loop:avoidCallbacHell");
    })
    await fs.readFile('./README.md','utf-8',(err,data)=>{
        console.log("Inside Third loop:avoidCallbacHell");
    })
}

avoidCallbacHell();