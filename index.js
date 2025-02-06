const http = require('http');

const server = http.createServer((req,res) => {
    // console.log(req.url)
    // res.end("<h1>hello world</h1>");
    if(req.url === '/about'){
        res.end("<h1>hello world</h1>");
    }else if(req.url === '/contact'){
        res.end("<h1>hello Contact</h1>");    
    }else {
        res.end("<h1>Page not found</h1>");    
    }
});

server.listen(5000, 'localhost', () => {
    console.log("server is running on http://localhost:5000");
});