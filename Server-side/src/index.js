const http = require("http");
const util = require("util");
const url = require("url");
const neo4j = require("neo4j-driver");
const neo4jDriver=neo4j.driver('bolt://localhost:7687',neo4j.auth.basic('neo4j','dulecar0'));
const { portNumber } = require("../config/config");

function processRequestBody(requset,callback){
    let chunks = [];
    requset.on("data", (chunk) => {
        chunks.push(chunk);
    });
    requset.on("end", () => {
        const data = Buffer.concat(chunks);
        const querystring = data.toString();
        const parsedData = new URLSearchParams(querystring);
        const dataObj = {};
        for (var pair of parsedData.entries()) {
          dataObj[pair[0]] = pair[1];
        }
        callback(dataObj);
    });
}

const server = http.createServer(async(req,res)=>{
    let path = url.parse(req.url,true);
    let queryData = path.query;
    let rootPath = path.pathname.split("/").filter((val,ind)=>ind>0);
    let neo4jSession = neo4jDriver.session();//neo4j sesija koja se otvara kad pristigne zahtev
    let headers = {
        'Access-Control-Allow-Origin': '*',
        'Accept':'*',
        'Access-Control-Allow-Methods': 'OPTIONS,GET,POST,DELETE,PUT',
        'Access-Control-Request-Method': 'OPTIONS,GET,POST,DELETE,PUT',
        'Access-Control-Max-Age': 2592000,
        'Access-Control-Allow-Headers':'*'
    };

    if(req.method.toLowerCase()==='options')
    {
        //options method
        //important,every rootpath must return OK and named headers so the request can be processed
        //example
        // if(rootPath[0]=='users'){
        //     res.writeHead(200,'OK',headers);
        //     res.end();
        // }
        //start here
        if(rootPath[0]=='user'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        
    }
    if(req.method.toLowerCase()==='get')
    {
        //get method
        if(rootPath[0]=='user'){
            if(queryData.email && queryData.password){
                if(queryData.label==='KORISNIK' || queryData.label==='KORISNIK'){
                    let dbResponse = await neo4jSession.run(`match(ent:${queryData.label}{\
                        email:$email,\
                        password:$password\
                    })\
                    return ent`,{
                        email:queryData.email,
                        password:queryData.password
                    });
                    if(dbResponse){
                        res.writeHead(200,'OK',headers);
                        res.write(JSON.stringify(dbResponse.records[0]._fields[0].properties));
                        res.end();
                    }
                    else{
                        res.writeHead(404,'Error',headers);
                        res.write("User not found...");
                        res.end();
                    }
                }
                else if(queryData.label!=='KORISNIK' || queryData!=='KOMPANIJA'){
                    res.writeHead(404,'Error',headers);
                    res.write("Invalid request...");
                    res.end();
                }
            }
        }
        else{
            res.writeHead(404,'Error',headers);
            res.write('Invalid request...');
            res.end();
        }
    }
    if(req.method.toLowerCase()==='post')
    {
        //post method
        if(rootPath[0]=='user'){
            if(queryData.label==='KORISNIK'){
                processRequestBody(req,async (dataObj)=>{

                    let emailTaken = await neo4jSession.run(`match (entity:KORISNIK {
                        email:$email\
                    })\
                    return entity`,{
                        email:dataObj.email
                    });
                    
                    if(emailTaken.records[0]!==undefined){
                        res.writeHead(404,'Error',headers);
                        res.write('Email is already taken,use another one...');
                        res.end();
                    }
                    else{
                        let dbResponse = await neo4jSession.run(`create (entity:KORISNIK {\
                            name:$name,\
                            lastname:$lastname,\
                            skills:$skills,\
                            email:$email,\
                            password:$password\
                        })`,{
                            name:dataObj.name,
                            lastname:dataObj.lastname,
                            skills:dataObj.skills,
                            email:dataObj.email,
                            password:dataObj.password
                        });
                        res.writeHead(200,'OK',headers);
                        res.write("Korisnik uspesno kreiran...");
                        res.end();
                    }
                });
            }
            else if(queryData.label==='KOMPANIJA'){
                processRequestBody(req,async (dataObj)=>{

                    let emailTaken = await neo4jSession.run(`match (entity:KOMPANIJA {
                        email:$email\
                    })\
                    return entity`,{
                        email:dataObj.email
                    });
                    if(emailTaken.records[0]!==undefined){
                        res.writeHead(404,'Error',headers);
                        res.write('Email is already taken,use another one...');
                        res.end();
                    }
                    else{
                        let dbResponse = await neo4jSession.run(`create (entity:KOMPANIJA {\
                            name:$name,\
                            description:$description,\
                            city:$city,\
                            email:$email,\
                            password:$password\
                        })`,{
                            name:dataObj.name,
                            description:dataObj.description,
                            city:dataObj.city,
                            email:dataObj.email,
                            password:dataObj.password
                        });
                        res.writeHead(200,'OK',headers);
                        res.write("Kompanija uspesno kreirana...");
                        res.end();
                    }
                });
            }
        }
        else{
            res.writeHead(404,'Error',headers);
            res.write('Invalid request...');
            res.end();
        }
    }
    if(req.method.toLowerCase()==='delete')
    {
        //delete method
    }
    if(req.method.toLowerCase()==='put')
    {
        //put method
    }
});

server.listen(portNumber,()=>{
    console.log("Listening on port "+portNumber+"...\n\n");
    //start here
    neo4jDriver.close();
});