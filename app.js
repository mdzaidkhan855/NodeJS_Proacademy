const http = require('http');
const fs = require('fs');
const { error } = require('console');
const url = require('url');
const replaceHtml = require('./Modules/replaceHtml')

let html = fs.readFileSync('./Files/home.html','utf-8');

let products = JSON.parse(fs.readFileSync('./Data/products.json','utf-8'));
let productListHtml = fs.readFileSync('./Template/product-list.html','utf-8')
let productDetailsHtml = fs.readFileSync('./Template/product-details.html','utf-8')
// let productHtmlArray =  products.map((prod)=>{
//     let output = productListHtml.replace('{{%IMAGE%}}',prod.productImage);
//     output = output.replace('{{%NAME%}}',prod.name);
//     output = output.replace('{{%MODELNAME%}}',prod.modeName);
//     output = output.replace('{{%MODELNO%}}',prod.modelNumber);
//     output = output.replace('{{%SIZE%}}',prod.size);
//     output = output.replace('{{%CAMERA%}}',prod.camera);
//     output = output.replace('{{%PRICE%}}',prod.price);
//     output = output.replace('{{%COLOR%}}',prod.color);
//     output = output.replace('{{%ID%}}',prod.id);

//     return output;
// })

// Creating Server
const server = http.createServer((req,res)=>{
    console.log("The request received");
    let {query, pathname:path} = url.parse(req.url,true);
    //let path = req.url;
    console.log("The path is : " + path);
    if(path === '/' || path.toLowerCase() === '/home')
    {
        res.writeHead(200,{
            'my-head':'Hello word'
        })
        let htmlHome = html.replace('{{%CONTENT%}}','This is home page')
        res.end(htmlHome)
        
    }
    if(path.toLowerCase() === '/about')
    {
        res.writeHead(200,{
            'my-head':'Hello word'
        })
        let htmlAbout = html.replace('{{%CONTENT%}}','This is about page')
        res.end(htmlAbout)
    }
    if(path.toLowerCase() === '/products')
    {
        // res.writeHead(200,{
        //     'Content-Type':'application/json'
        // })
        res.writeHead(200,{
            'Content-Type':'text/html'
        })
        if(!query.id){
            let productHtmlArray = products.map((prod)=>{
                return replaceHtml(productListHtml,prod);
                
            })
            let htmlTemp = html.replace('{{%CONTENT%}}',productHtmlArray.join(','))
            res.end(htmlTemp);
        }
        else{
            let prod = products[query.id]
            let productDetailsResponseHTMl = replaceHtml(productDetailsHtml,prod)
            let htmlTemp = html.replace('{{%CONTENT%}}',productDetailsResponseHTMl)
            res.end(htmlTemp);
        }
        
        
    }
    
})

// Starting the server
server.listen(5000,'127.0.0.1',()=>{
    console.log("Sever runnin on 5000");
});
