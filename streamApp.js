const http = require('http');
const fs = require('fs');
const { error } = require('console');

const server = http.createServer();
// Starting the server
server.listen(5000,'127.0.0.1',()=>{
    console.log("Sever runnin on 5000");
});

// Conventional way of processing: Solution-1
// server.on('request',(req,res)=>{
//     fs.readFile('./Files/largeFile.txt',(error,data)=>{
//         res.end(data)
//     })
    
// })

// Using Streaming: Solution-2
// server.on('request',(req,res)=>{
//     let rs = fs.createReadStream('./Files/largeFile.txt');

//     // data event
//     rs.on('data', (chunk)=>{
//         res.write(chunk);
        
//     });

//     // end event
//     rs.on('end', ()=>{
//         res.end("THE FILE HAS BEEN READ SUCCESSFULLY");
//     });

//     // error event
//     res.on('error',(error)=>{
//         res.end(error.message);
//     })
    
// })

// Using Pipe to avoid backpressure: Solution-3
server.on('request',(req,res)=>{
    let rs = fs.createReadStream('./Files/largeFile.txt');

    rs.pipe(res);
})