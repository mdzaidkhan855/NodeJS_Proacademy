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
0. 0. run: node streamApp.js
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


##################  NPM and packages ########################
1. Node has core library like http, fs etc. It does not require NPM.
2. For third parties library, we need to do as below
                   a. npm init => package.json
                   b. install third parties libraries like express: npm install express(regular dependency)
                   c. Or npm install nodemon --save-dev(dev dependency)
                   c. results in node_modules
                   d. now run : nodemon app.js

####################  Event Loop in Practice #########################
1. Plz follow NodeJS-Architecture.pptx for details
2. The practice is eventLoop.js : nodemon eventLoop.js

####################  Express framework #########################
 1. Express is open source web application framework for NodeJS
 2. Web application can be written in very few lines of code and faster
 3. Using express, MVC architecture is maintained
 4. Go to the folder NodeJS-Express : npm init
 5. For uniformity, I have made entry point in package.json as app.js
 6. Create an app.js file manually
 7. when use res.send("hi"), content by default text/html
 8. When want to send json response, it sould be res.json({message:"hi"})

 ######################### API #################################
 1. fs and http etc. are Node API used by NodeJS
 2. Similarly fetch and getElementById are Browsers DOM API provided by Browser
    These API are not provided by Javascript
 3. End point should have ONLY resources(nonus NOT verbs). Verb should be Http method
    /getMovies  => GET /Movies, /addMovies => POST /Movies 
 4. JSend JSON DATA is one of the standard format used to send Json response.
     It has status and data. Inside data , we send Json response as it is.
     So JSend JSON does some kind of enveloping.
 5. To attach a body to request while doing POST, we need to use middleware
     To use middleware in express, the middleware here is express.json()
     now we use that middleware in express : app.use(express.json())
     This middleware add request body to req object,which is used for post method

####################### Route Parameters #######################
1. req.params stores request parameter as an object
2. Requesting /api/vi/movies/4/john/12 for end points '/api/vi/movies/:id/:name/:x' 
3. req.params : { id: '4', name: 'john', x: '12' }
4. All the param values are string.
5. For some of the params to be optional, we need to decalre like: /api/vi/movies/:id/:name/:x?
6. 

######################  Express As a Middleware ####################
1. We used express.json() as middleware.
2. This middleware adds body to request. Similarly routes are part of middleware.
3. Order of middleware are same as defined in the code.
4. So order of middleware in express matters a lot.
5. The processing of request/response happens in all the middleware one after another.

#################### Custom Middleware(2-app.js) #########################
1. Go to NodeJS-Express : nodemon 2-app.js
2. Define logger as middleware. 
3. use(app.use(logger)) this middleware before route defined.
4. The console inside logger middleware called
5. If logger middle is used after router, then logger middleware will not be called.
6. In the code used a middleware to add a property requestedAt to request object.

#################### Third part middleware called Morgan ####################
1. Go to NodeJS-Express : nodemon 2-app.js
2. Morgan is a popular logging middleware

#####################  Refactoring of code ###########################
1. A separate module for routes created inside Routes folder
2. A separate module for controllers created inside Controllers folder
3. Creating and running server code put inside server.js
4. The code from app.js moved into above 3 files.
5. Now Entry point is server.js, Not app.js :: nodemon server.js