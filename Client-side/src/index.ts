import { setUpLogin } from "./loginEvents";
import { drawLogin, drawSignup, userFilter } from "./drawFunctions";
import { User } from "../classes/user";
import { Subject, interval, switchMap, takeLast, timer } from "rxjs";
import { hideSearchBar, toggleSearchBar, viewKompanijaKonkurs, viewUserKonkurs } from "./pocetnaEvents";

document.body.onload=()=>{
    userFilter();
    if(sessionStorage.getItem("current-user-label")==="KORISNIK"){
        viewUserKonkurs();
    }
    else{
        viewKompanijaKonkurs();
    }
    document.querySelector("a[href='#pocetna']").addEventListener("click",()=>{
        document.location.reload();
    });

    toggleSearchBar();
}