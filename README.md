############# SYNC / ASYNC , Bloacking/Non-bloacking ###########
1. NodeJs is javascript so it is Single Threaded.
2. All synchronous process is part of main thread.
3. All Asyncronous process is part of background thread.
4. Single Threaded + Synchronous(part of MAIN Thread) => Blocking
5. Single Threaded + ASynchronous(running in the BACKGROUND) => Non-Blocking 
6. The callback function in Async method is part of Main Thread.
7. So once Async is done, tha call callback is executed on Main Thread.
6. NdeJS provides many APIs which runs Asynchronously running in Background so NodejS is Non-Blocking