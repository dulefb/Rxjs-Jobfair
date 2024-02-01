import { Subject, fromEvent, debounceTime, map, takeUntil, combineLatest, from, switchMap, delay, Observable } from "rxjs";
import { User } from "../classes/user";
import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";


export function setUpSignin(control$:Subject<string>){

    const user = new User();
    disableSignup();
    const name$ = fromEvent(document.querySelector("#signup-name"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const lastname$ = fromEvent(document.querySelector("#signup-lastname"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const email$ = fromEvent(document.querySelector("#signup-email"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const password$ = fromEvent(document.querySelector("#signup-password"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const skill$ = fromEvent(document.querySelector("#signup-skills"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const userCV$ = fromEvent(document.querySelector("#signup-usercv"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const city$ = fromEvent(document.querySelector("#signup-city"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    const description$ = fromEvent(document.querySelector("#signup-description"),"input").pipe(
        debounceTime(200),
        map((event: InputEvent) => (<HTMLInputElement>event.target).value),
        takeUntil(control$)
    );

    let selectedLabel = (<HTMLSelectElement>document.querySelector("#chooseSelect")).value;

    const combineValue$ = combineLatest([name$,lastname$,email$,password$,skill$,userCV$])
                            .pipe(
                                takeUntil(control$)
                            )
                            .subscribe(next=>{
                                user.name=next[0];
                                user.lastname=next[1];
                                user.email=next[2];
                                user.password=next[3];
                                user.skills=next[4];
                                user.userCV=next[5];
                                enableSignup();
                            });
    
    fromEvent(document.querySelector(".signupButton"),"click")
        .pipe(
            switchMap(()=>getUserWithEmail(user.email,selectedLabel)),
            delay(500)
        )
        .subscribe(next=>{
            if(next===null){
                alert("Korisnik sa ovom email adresom vec postoji.Pokusajte drugu.");
            }
            else{
                if(user.name===null || user.email===null || user.password===null){
                    alert("Morate da unesete sve podatke");
                }
                else{
                    postUser(user,selectedLabel)
                        .subscribe(newUser=>{
                            if(newUser===true){
                                alert("Uspesno registrovnje.");
                                control$.next("Login complete...");
                                control$.complete();
                                getUserWithEmailAndPassword(user.email,user.password,selectedLabel)
                                    .subscribe(value=>{
                                        console.log(value);
                                        sessionStorage.setItem("current-user",value.email);
                                        document.location.reload();
                                    });
                            }
                            else{
                                alert("Ovaj email je vec zauzet,pokusajte drugi mail.");
                            }
                        });
                }
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