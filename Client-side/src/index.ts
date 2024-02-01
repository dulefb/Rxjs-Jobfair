import { setUpLogin } from "./loginEvents";
import { drawLogin, drawSignup, userFilter } from "./drawFunctions";
import { User } from "../classes/user";
import { Subject, interval, switchMap, takeLast, timer } from "rxjs";
import { hideSearchBar, toggleSearchBar } from "./pocetnaEvents";

document.body.onload=()=>{
    userFilter();

    document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
        document.location.reload();
    });

    toggleSearchBar();
    
    window.onclick = function(event) {
        if (!(event.target as Element).matches("a[href='recepti']")) {
            const dropdown_container = document.querySelector(".dropdown-content");
            const dropdowns = document.querySelectorAll(".dropdown-content-links");
            if(dropdowns.length > 0)
            {
                dropdowns.forEach(value=>{
                    dropdown_container.removeChild(value);
                });
            }
        }
        if(!(event.target as Element).matches("a[href='#search-input']") && !(event.target as Element).matches("#header-search-input")/* && !(event.target as Element).matches("#search-bar-button")*/){
            hideSearchBar();
        }
    }

    const novi_recept = document.querySelector("a[href='#novi-recept']");
    const receptControl$ = new Subject<string>();
    if(novi_recept!==null){

        novi_recept.addEventListener("click",()=>{
            let child = document.querySelectorAll(".middle > div");
            //console.log(child);
            if(child!==null){
                child.forEach(x=>{
                    document.querySelector(".middle").removeChild(x);
                });
            }
            //crtanje za objavu konkursa
        });
    }
}