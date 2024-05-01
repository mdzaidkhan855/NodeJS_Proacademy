console.log("node js ");

const fs = require('fs');

const text = fs.readFileSync('./README.md','utf-8');
console.log(text);

fs.readFile('./README.md','utf-8',(err,data)=>{
    console.log(data);
})
console.log("Main thread continues...");