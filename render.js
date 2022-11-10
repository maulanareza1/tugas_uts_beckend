var http = require("http")
var url = require("url")
var fs = require("fs")
var qs = require("querystring")

var renderAbout = fs.readFileSync("./pages/about.html");
var renderProfil = fs.readFileSync("./pages/profil.html");

function css(request, response) {
    if (request.url === "/style.css") {
        response.writeHead(200, { "Content-type": "text/css" });
        var fileContents = fs.readFileSync("./style.css", { encoding: "utf8" });
        response.write(fileContents);
        response.end();
    }
}

var server = http.createServer(function(request,response){
    css(request, response);
    response.writeHead(200, { "Content-Type": "text/html" });
    var q = url.parse(request.url,true)
    if (q.pathname == "/" && request.method == "GET"){
        var keyword = q.query.keyword;
        if (keyword){
            response.writeHead(200, {"Content-Type": "text/html"});
            response.write("<h2 style='text-align: center;'>Pencarian</h2>");
            response.write("<p style='text-align: center;'>Anda Mencari : <b>" + keyword + "</b> </p>");
            response.write("<h3 style='text-align: center;'><b></b>Tidak ada Hasil ! Maaf Website ini masih dalam tahap pengembangan</b></h3>");
            response.end("<button><a href='/' align: 'center';>Kembali</a></button>");
            
            }
        else{
            fs.readFile("./pages/home.html",function(error,data){
                if (error){
                    response.writeHead(404,{"Conten-Type": "text/html"});
                    response.end("404 Not Found");
                }
            response.writeHead(200,{"Content-Type":"text/html"});
            response.write(data)
            response.end();    
            });
        }
    }
    else if (request.url == '/about'){
        response.writeHead(200, { "Content-Type": "text/html" });
        response.write(renderAbout);
        response.end();
    }
    else if (request.url==="/login" && request.method === "GET"){
        fs.readFile("./pages/login.html",(error,data)=>{
            if (error){
                response.writeHead(404,{"Content-Type":"text/html"});
                return response.end("404 Server Not Found");                
            }
            else{
                response.writeHead(200, {"Content-Type":"text/html"});
                response.write(data)
                return response.end()
            }
        });
    }
    else if (request.url==="/login" && request.method === "POST"){
        var requestBody = "";
        request.on("data",function(data){
            requestBody += data;
        });
        request.on("end",function(){
            var formData = qs.parse(requestBody);
            if (formData.username === "reza" && formData.password === "1121101993"){
                response.writeHead(200,{"Content-Type":"text/html"});
                response.end(renderProfil);
                }
            else{
                response.writeHead(200,{"Content-Type":"text/html"});
                response.write("<h2>Login Gagal</h2>");
                response.write("<a href='/login'>Coba Kembali</a>");
                response.end();
            }
        });

    }
});

server.listen(process.env.PORT||5000);
console.log("server Berjalan")
