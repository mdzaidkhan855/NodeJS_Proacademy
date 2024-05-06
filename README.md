############# SYNC / ASYNC , Bloacking/Non-bloacking ###########
1. NodeJs is javascript so it is Single Threaded.
2. All synchronous process is part of main thread.
3. All Asyncronous process is part of background thread.
4. Single Threaded + Synchronous(part of MAIN Thread) => Blocking
5. Single Threaded + ASynchronous(running in the BACKGROUND) => Non-Blocking 
6. The callback function in Async method is part of Main Thread.
7. So once Async is done, tha call callback is executed on Main Thread.
8. NdeJS provides many APIs which runs Asynchronously running in Background so NodejS is Non-Blocking
9. That's why NodeJS is best suited for web application
10. Keep in mind that just passing callback function does not make a function Asynchronous.

###################### Callback Hell ##########################
1. Nested level of callback makes programme unmanagable
2. The solution is Promise or Async/Await.

################## Difference between Json Object and Javascript Object ###############
1. Suppose we have Json object in a file products.js
2. When we read this file using fs, it returns Json object
3. This same object is returned as response : res.send(<json object>)
4. To convert Json object to Javascript object: JSON.parse(<json object>);
5. The property name in Json file is in quotes, whereas name property in Javascript
    object has no quotes.
6. JSON.stringfy: Javascript object => Json Object
   JSON.parse  : Json Object => Javascript object

################ Parsing Query String ############################
1. url.parse(req.url,true); // parses query string. passing boolean as false does not parse query string
2. the above gives various details about the url object
3. Some of them are query and pathname
4. query is query paramater and pathname is resource like below
5. If url is : http://localhost:5000/product?id=10&name="mobile" 
      query: {id:10, name:mobile}, pathname:product

#################### Event Drive Architecture ########################
0. run: node eventDrivenApp.js
1. When a new request hits the server, server is going to emit an Event called request
2. So here request is an Event and server is an Event Emitter to emit request event
3.  on method is Event listener. 
4. Call back method is Event handler
5. Event(request), Event Emitter(server), Event listener(on), Event Handler(call back)
6.  const server = http.createServer();
    server.listen(5000,'127.0.0.1',()=>{
        console.log("Sever runnin on 5000");
    });
    server.on('request',(req,res)=>{
        console.log("Server is Event emitter");
        console.log("{on} method is Event listener ");
        console.log("this callback method is Event handler");
        res.end("Even driven architecture defined")
    })
################### Streaming #######################
1. fs.readFile and fs.writeFile creates buffer in memory and then at once reads/writes
2. Using Stream, we do it in pieces. Not required to keep in memory.
3. when use Stream, Read/Write Buffer is created along with Read/Write Stream.
4. From Read/Write Stream, data is used in chunk by Read/Write Buffer
5. Source File => Read Stream => Read buffer => Destination
6. In NodeJS, 4 types of streams
     a. Readable b. Writable c.Duplex d.Transform
7. BACK PRESSURE: when data is being read say 4mb/sec and response stream is 3mb/sec.
8. The back pressure will overwhelm the memory after some time
9. The solution is using pipe method.
10. The pipe method can ONLY be used on readable stream.

