const { log } = require('console');
const http = require('http');

// Create Server
const server = http.createServer();

// Starting the server
server.listen(5000,'127.0.0.1',()=>{
    console.log("Sever runnin on 5000");
});

server.on('request',(req,res)=>{
    console.log("Server is Event emitter");
    console.log("{on} method is Event listener ");
    console.log("this callback method is Event handler");
    res.end("Even driven architecture defined")
})

//  ######### Custom event starts  ##############
const event = require('events')

let myEmitter = new event.EventEmitter();

myEmitter.on('userCreated', (id,name)=>{
    console.log(`First EventListerner : New User is created for ${id} and ${name}`);
})
myEmitter.on('userCreated', (id,name)=>{
    console.log(`Second EventListerner: New User is created for ${id} and ${name}`);
})
myEmitter.on('userCreated', ()=>{
    console.log(`Third EventListerner: New User is created `);
})

myEmitter.emit('userCreated',101,'john');
//  ######### Custom event ends  ##############

//  ######### Custom event starts using module user.js ##############
const user = require('./Modules/user')

let myUserEmitter = new user();

myUserEmitter.on('userCreated', (id,name)=>{
    console.log(`First EventListerner : New User is created using custom module for ${id} and ${name}`);
})
myUserEmitter.on('userCreated', (id,name)=>{
    console.log(`Second EventListerner: New User is created using custom module for ${id} and ${name}`);
})
myUserEmitter.on('userCreated', ()=>{
    console.log(`Third EventListerner: New User is created using custom module`);
})

myUserEmitter.emit('userCreated',101,'john');