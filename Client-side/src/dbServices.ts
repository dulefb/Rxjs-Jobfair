import { Observable, from, take, takeLast, map, toArray, mergeMap, filter, of } from "rxjs";
import { User } from "../classes/user";
import { removeChildren } from "./pocetnaEvents";
import { konkursURL, prijaviNaKonkursURL, userKonkursURL, userURL } from "./constants";
import { Kompanija } from "../classes/kompanija";
import { Konkurs } from "../classes/konkurs";

export function postUser(user:any,label:string) : Observable<boolean | void>{
    // console.log(user);
    let formBody = new URLSearchParams();
    if(label==="KORISNIK"){
        formBody.append('name',user.name);
        formBody.append('lastname',user.lastname);
        formBody.append('email',user.email);
        formBody.append('password',user.password);
        formBody.append('skills',user.skills);
        formBody.append('userCV',user.userCV);
    }
    else{
        formBody.append('name',user.name);
        formBody.append('city',user.city);
        formBody.append('email',user.email);
        formBody.append('password',user.password);
        formBody.append('description',user.description);
    }
    const resp=fetch(userURL+"?label="+label,
                {
                    method:"POST",
                    headers: {
                        'Content-Type': 'application/x-www-form-urlencoded'
                      },
                    body: formBody
                }).then(response=>{
                    if(!response.ok){
                        return false;
                    }
                    else{
                       return true;
                    }
                }).catch(err=>console.log(err));

    return from(resp);
}

export function getUser(email:string,label:string) : Observable<User>{
    const user = fetch(userURL+"?email="+email+"&label="+label,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user).pipe(take(1));
}

export function getUserWithEmail(email:string,label:string) : Observable<void | boolean>{
    const user = fetch(userURL+"?email="+email+"&label="+label,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return false;
                        }
                        else{
                            return true;
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user);
}

export function getUserWithEmailAndPassword(email:string,password:string) : Observable<any>{
    const user = fetch(userURL+"?email="+email+"&password="+password,{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user);
}


export function deleteUser(email:string,label:string) : Observable<string>{
    const userResp = fetch(userURL+"?email="+email+"&label="+label,{method:"DELETE"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    }).catch(err=>console.log(err));
    
    return from(userResp);
}

export function postKonkurs(newKonkurs:Konkurs) : Observable<DbResponse>{
    let formBody = new URLSearchParams();
    formBody.append('job',newKonkurs.job);
    formBody.append('company',newKonkurs.company);
    formBody.append('money',newKonkurs.money);

    const resp = fetch(konkursURL,{
        method:"POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: formBody
        })
        .then(response=>{
                return response.json();
        }).catch(err=>console.log(err));

    return from(resp);
}

export function getUserKonkurs(skills:string) : Observable<Konkurs[]>{
    const user = fetch(userKonkursURL+"?skills="+skills.toLowerCase(),{method:"GET"})
                    .then(response=>{
                        if(!response.ok){
                            return null;
                        }
                        else{
                            return response.json();
                        }
                    })
                    .catch(err=>console.log(err));
    
    return from(user);
}

export function postPrijaviSeNaKonkurs(user:User,konkurs:Konkurs) : Observable<DbResponse>{
    let formBody = new URLSearchParams();
    formBody.append('job',konkurs.job);
    formBody.append('company',konkurs.company);
    formBody.append('money',konkurs.money);
    formBody.append('userCV',user.userCV);

    const resp = fetch(prijaviNaKonkursURL+"?email="+user.email,{
        method:"POST",
        headers: {
            'Content-Type': 'application/x-www-form-urlencoded'
          },
        body: formBody
        })
        .then(response=>{
            return response.json();
        }).catch(err=>console.log(err));

    return from(resp);
}

function showError(error:any){
    let parent = document.querySelector(".middle");
    removeChildren(parent,document.querySelectorAll(".middle > div"));
    let divError = document.createElement("div");
    divError.classList.add("divError");
    let labelError = document.createElement("label");
    labelError.style.fontSize="larger";
    labelError.innerHTML=error.toString();
    labelError.innerHTML = labelError.innerHTML.concat(". Error 404.");
    divError.appendChild(labelError);
    parent.appendChild(divError);
}