import { Observable, from, take, takeLast, map, toArray, mergeMap, filter } from "rxjs";
import { User } from "../classes/user";
import { removeChildren } from "./pocetnaEvents";
import { userURL } from "./constants";

export function postUser(user:User,label:string) : Observable<boolean | void>{
    // console.log(user);
    let formBody = new URLSearchParams();
    formBody.append('name',user.name);
    formBody.append('last_name',user.lastname);
    formBody.append('email',user.email);
    formBody.append('password',user.password);
    formBody.append('skills',user.skills);
    formBody.append('userCV',user.userCV);
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

export function getUserWithEmail(email:string,label:string) : Observable<User>{
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
    
    return from(user);
}

export function getUserWithEmailAndPassword(email:string,password:string,label:string) : Observable<User>{
    const user = fetch(userURL+"?email="+email+"&password="+password+"&label="+label,{method:"GET"})
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


export function deleteUser(email:string,label:string) : Observable<boolean | void>{
    const userResp = fetch(userURL+"?email="+email+"&label="+label,{method:"DELETE"})
                    .then(response=>{
                        if(!response.ok){
                            return false;
                        }
                        else{
                            return true;
                        }
                    }).catch(err=>console.log(err));
    
    return from(userResp);
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