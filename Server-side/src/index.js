const http = require("http");
const util = require("util");
const url = require("url");
const neo4j = require("neo4j-driver");
let neo4jDriver;
const { portNumber, neo4jDB, neo4jUsername, neo4jPassword } = require("../config/config");
const { ok } = require("assert");

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
        else if(rootPath[0]=='prijavi-na-konkurs'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        else if(rootPath[0]=='konkurs'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        else if(rootPath[0]=='user-konkurs'){
            res.writeHead(200,'OK',headers);
            res.end();
        }
        
    }
    if(req.method.toLowerCase()==='get')
    {
        //get method
        if(rootPath[0]==='user'){
            if(queryData.email && queryData.password){
                let dbResponse = await neo4jSession.run(`match(ent{\
                    email:$email,\
                    password:$password\
                })\
                return ent`,{
                    email:queryData.email,
                    password:queryData.password
                });
                if(dbResponse.records.length>0){
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
            else if(queryData.email){
                if(queryData.label==='KORISNIK' || queryData.label==='KOMPANIJA'){
                    let dbResponse = await neo4jSession.run(`match(ent{\
                        email:$email
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
        else if(rootPath[0]==='konkurs'){
            processRequestBody(req,async (dataObj)=>{
                let dbResponse = await neo4jSession.run(`match (kompanija:KOMPANIJA{\
                    email:$email\
                })-[:OBJAVLJUJE]->(konkurs:KONKURS)\
                return konkurs`,{
                    email:dataObj.email
                });
                if(dbResponse.records[0]!==undefined){
                    res.writeHead(200,'OK',headers);
                    res.write(JSON.stringify(dbResponse.records));
                    res.end();
                }
                else{
                    res.writeHead(404,'Error',headers);
                    res.write('Invalid request...');
                    res.end();
                }
            });
        }
        else if(rootPath[0]==='user-konkurs'){
            if(queryData.skills){
                let allData = await neo4jSession.run(`match(konkurs:KONKURS)\
                where toLower(konkurs.job) contains $skills
                return konkurs`,{
                    skills:queryData.skills
                });
                if(allData.records[0]!==undefined){
                    let konkursArray = [];
                    allData.records.forEach(value=>{
                        konkursArray.push(value._fields[0].properties);
                    });
                    res.writeHead(200,'OK',headers);
                    res.write(JSON.stringify(konkursArray));
                    res.end();
                }
                else{
                    res.writeHead(404,'Error',headers);
                    res.write('Invalid request...');
                    res.end();
                }
            }
            else{
                res.writeHead(404,'Error',headers);
                res.write('Invalid request...');
                res.end();
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
        if(rootPath[0]==='user'){
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
                            userCV:$userCV,\
                            email:$email,\
                            password:$password\
                        })`,{
                            name:dataObj.name,
                            lastname:dataObj.lastname,
                            skills:dataObj.skills,
                            userCV:dataObj.userCV,
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
        else if(rootPath[0]==='konkurs'){
            processRequestBody(req,async (dataObj)=>{
                let alreadyExists = await neo4jSession.run(`match (konkurs:KONKURS{\
                    job:$job,\
                    company:$company,\
                    money:$money\
                })\
                return konkurs`,{
                    job:dataObj.job,
                    company:dataObj.company,
                    money:dataObj.money
                });

                let companyExists = await neo4jSession.run(`match (kompanija:KOMPANIJA{\
                    name:$company\
                })\
                return kompanija`,{
                    company:dataObj.company
                });
                console.log(companyExists);
                if(alreadyExists.records[0]!==undefined){
                    res.writeHead(404,'Error',headers);
                    res.write(JSON.stringify({
                        msg:'Konkurs za ovaj posao je vec obavljen',
                        valid:false
                    }));
                    res.end();
                }
                else if(companyExists.records[0]===undefined){
                    res.writeHead(404,'Error',headers);
                    res.write(JSON.stringify({
                        msg:'Kompanija ne postoji...',
                        valid:false
                    }));
                    res.end();
                }
                else{
                    let dbResponse = await neo4jSession.run(`match (kompanija:KOMPANIJA{\
                    name:$company})\
                    create (konkurs:KONKURS{\
                        job:$job,\
                        company:$company,\
                        money:$money\
                    })<-[obj:OBJAVLJUJE]-(kompanija)`,{
                        job:dataObj.job,
                        company:dataObj.company,
                        money:dataObj.money
                    });
                    res.writeHead(200,"OK",headers);
                    res.write(JSON.stringify({
                        msg:'Konkurs za posao je objavljen',
                        valid:true
                    }));
                    res.end();
                }
            });
        }
        else if(rootPath[0]==='prijavi-na-konkurs'){
            if(queryData.email){
                processRequestBody(req,async (dataObj)=>{
                    let alreadyExists = await neo4jSession.run(`match (user:KORISNIK{\
                    email:$email\
                    })-[:PRIJAVI_SE]->\
                    (konkurs:KONKURS{\
                    job:$job,\
                    company:$company,\
                    money:$money\
                    })\
                    return user`,{
                        email:queryData.email,
                        job:dataObj.job,
                        company:dataObj.company,
                        money:dataObj.money
                    });
                    if(alreadyExists.records[0]!==undefined){
                        res.writeHead(404,'Error',headers);
                        res.write(JSON.stringify({
                            msg:'Vec ste prijavljeni na ovaj konkurs.',
                            valid:false
                        }));
                        res.end();
                    }
                    else{
                        let dbResponse = await neo4jSession.run(`match (user:KORISNIK{\
                        email:$email\
                        }),\
                        (konkurs:KONKURS{\
                        job:$job,\
                        company:$company,\
                        money:$money\
                        })\
                        create (user)-[:PRIJAVI_SE{userCV:$userCV}]->(konkurs)\
                        return user.email as email,konkurs.job as job`,{
                            email:queryData.email,
                            job:dataObj.job,
                            company:dataObj.company,
                            money:dataObj.money,
                            userCV:dataObj.userCV
                        });

                        if(dbResponse.records[0]!==undefined){
                            res.writeHead(200,"OK",headers);
                            res.write(JSON.stringify({
                                msg:"Prijava na konkurs je uspesna...",
                                valid:true
                            }));
                            res.end();
                        }
                        else{
                            res.writeHead(404,'Error',headers);
                            res.write(JSON.stringify({
                                msg:'Invalid request.',
                                valid:false
                            }));
                            res.end();
                        }
                    }
                });
            }
            else{
                res.writeHead(404,'Error',headers);
                res.write('Invalid request...');
                res.end();
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
        if(rootPath[0]==='user'){
            if(queryData.email && queryData.label){
                let userEmail = await neo4jSession.run(`match (entity:${queryData.label} {
                    email:$email\
                })\
                detach delete entity`,{
                    email:queryData.email
                });
                res.writeHead(200,"OK",headers);
                res.write('User deleted successfully');
                res.end();
            }
            else{
                res.writeHead(200,"OK",headers);
                res.write('User deleted successfully');
                res.end();
            }
        }
        else if(rootPath[0]==='konkurs'){
            processRequestBody(req,async (dataObj)=>{
                let dbResponse = await neo4jSession.run(`match (konkurs:KONKURS{\
                    job:$job,\
                    company:$company\
                })\
                detach delete konkurs`,{
                    job:dataObj.job,
                    company:dataObj.company
                });
                res.writeHead(200,"OK",headers);
                res.write('Konkurs deleted successfully');
                res.end();
            });
        }
        else{
            res.writeHead(404,'Error',headers);
            res.write('Invalid request...');
            res.end();
        }
    }
    if(req.method.toLowerCase()==='put')
    {
        //put method
    }
});

server.listen(portNumber,()=>{
    console.log("Listening on port "+portNumber+"...\n");
    //start here
    neo4jDriver=neo4j.driver(neo4jDB,neo4j.auth.basic(neo4jUsername,neo4jPassword));
});