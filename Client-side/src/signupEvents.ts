import { Subject, fromEvent, debounceTime, map, takeUntil, combineLatest, from, switchMap, delay, Observable } from "rxjs";
import { User } from "../classes/user";
import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";
import { Kompanija } from "../classes/kompanija";


export function setUpSignin(){

    const user = new User();
    const kompanija = new Kompanija();

    document.querySelector(".signupButton").addEventListener("click",()=>{
        let selectedLabel = (<HTMLSelectElement>document.querySelector("#chooseSelect")).value;
        if(selectedLabel==="KORISNIK"){
            user.name=(<HTMLInputElement>document.querySelector("#signup-name")).value;
            user.lastname=(<HTMLInputElement>document.querySelector("#signup-lastname")).value;
            user.email=(<HTMLInputElement>document.querySelector("#signup-email")).value;
            user.password=(<HTMLInputElement>document.querySelector("#signup-password")).value;
            user.skills=(<HTMLInputElement>document.querySelector("#signup-skills")).value;
            user.userCV=(<HTMLInputElement>document.querySelector("#signup-usercv")).value;
        }
        else if(selectedLabel==="KOMPANIJA"){
            kompanija.name=(<HTMLInputElement>document.querySelector("#signup-name")).value;
            kompanija.city=(<HTMLInputElement>document.querySelector("#signup-city")).value;
            kompanija.email=(<HTMLInputElement>document.querySelector("#signup-email")).value;
            kompanija.password=(<HTMLInputElement>document.querySelector("#signup-password")).value;
            kompanija.description=(<HTMLInputElement>document.querySelector("#signup-description")).value;
        }
        if(selectedLabel==="KORISNIK" && (user.name==="" || user.email==="" || user.password===""
            || user.skills==="" || user.userCV==="")){
                alert("Morate da unesete sva polja...");
            }
            else if(selectedLabel==="KOMPANIJA" && (kompanija.name==="" || kompanija.city==="" ||
                kompanija.description==="" || kompanija.email==="" || kompanija.password==="")){
                    alert("Morate da unesete sva polja...");
                }
            else{
                getUserWithEmail(selectedLabel==="KORISNIK" ? user.email : kompanija.email,selectedLabel)
                    .subscribe(next=>{
                        if(next){
                            alert("Korisnik sa ovo email adresom vec postoji...");
                        }
                        else{
                            postUser(selectedLabel==="KORISNIK" ? user : kompanija,selectedLabel)
                                .subscribe(postNext=>{
                                    if(postNext===false){
                                        alert('Doslo je do greske pokusajte ponovo.');
                                    }
                                    else{
                                        sessionStorage.setItem("current-user-label",selectedLabel);
                                        sessionStorage.setItem("current-user",selectedLabel==="KORISNIK" ? user.email : kompanija.email);
                                        alert('Uspesno ste registrovani.');
                                        document.location.reload();
                                    }
                                });
                        }
                    });   
            }
    });
}

function disableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=true;
}

function enableSignup(){
    let btn = <HTMLButtonElement>document.querySelector(".signupButton");
    btn.disabled=false;
}