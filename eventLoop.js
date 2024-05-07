const http = require('http');
const fs = require('fs');
const { error } = require('console');

//   #####################   Example - 1 ########################
// executed synchronously in MainThread
// console.log("Example-1: Programme has started");

// This is Stored in the callback queue of FIRST phase of event loop
// setTimeout(()=>{
//     console.log("Example-1: timer callback executed");
// },0)

// This is Stored in the callback queue of SECOND phase of event loop
// Since this takes time to read file, so callback is moved to the 
// event loop second phase in second round of nexttick, so exceuted after
// Third pase which is setImmediate timer 
// fs.readFile('./Files/input.txt',()=>{
//     console.log("Example-1: IO File read complete");
// })

// This is Stored in the callback queue of THIRD phase of event loop
// setImmediate(()=>{
//     console.log("Example-1: Immediate callback executed");
// })
// executed synchronously in MainThread
// console.log("Example-1: Programme has ended");

//   #####################   Example - 2 ########################
// executed synchronously in MainThread
console.log("Example-2: Programme has started");

fs.readFile('./Files/input.txt',()=>{
    console.log("Example-2: IO File read complete");
    setTimeout(()=>{
        console.log("Example-2: timer callback executed inside File IO");
    },0)
    setImmediate(()=>{
        console.log("Example-2: Immediate callback executed inside File IO");
    })
    process.nextTick(()=>{
        console.log("process.nextTick callback executed");
    })
})

// executed synchronously in MainThread
console.log("Example-2: Programme has ended");