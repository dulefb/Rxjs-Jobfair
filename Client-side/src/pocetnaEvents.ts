import { fromEvent, map, switchMap, scan, take, Observable,zip, from, Subject, combineLatest, takeUntil, forkJoin, delay, filter, debounceTime } from "rxjs";
import { numberOfTakes } from "./constants";
import { postKonkurs } from "./dbServices";
import { Konkurs } from "../classes/konkurs";


export function removeChildren(parent:Node,child:NodeListOf<Element>){
    if(child!==null){
        child.forEach(x=>{
            parent.removeChild(x);
        });
    }
}


export function toggleSearchBar(){
    let link = <HTMLLinkElement> document.querySelector("a[href='#search-input']");
    link.onclick=()=>{
        let div = <HTMLDivElement> document.querySelector("#search-bar-dropdown-show");
        div.classList.toggle("hideDisplay");
        removeSearchBarRecepts();
    }
}

export function hideSearchBar(){
    let div = <HTMLDivElement> document.querySelector("#search-bar-dropdown-show");
    div.classList.toggle("hideDisplay",true);
    removeSearchBarRecepts();
}


export function removeSearchBarRecepts(){
    let parent = document.querySelector("#search-bar-dropdown-show");
    let children = document.querySelectorAll(".divSearchSingleRecept");
    if(children.length>0){
        children.forEach(child=>parent.removeChild(child));
    } 
}

export function addNewKonkursEvent(){

    let button = (<HTMLButtonElement>document.querySelector("#newKonkursButton"));

    button.onclick=()=>{
        let jobInput = (<HTMLInputElement>document.querySelector("#jobInput")).value;
        let moneyInput = (<HTMLInputElement>document.querySelector("#moneyInput")).value;
        console.log(jobInput,moneyInput);
        if(jobInput==="" || moneyInput===""){
            alert("Unesite sva polja.");
        }
        else{
            let konkurs = new Konkurs();
            konkurs.job=jobInput;
            konkurs.money=moneyInput;
            konkurs.company=JSON.parse(sessionStorage.getItem("current-user")).name;
            postKonkurs(konkurs)
                .subscribe(next=>{
                    if(!next.valid){
                        alert(next.msg);
                    }
                    else{
                        alert(next.msg);
                        document.location.reload();
                    }
                })
        }
    }
}
