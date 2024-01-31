import { fromEvent, map, switchMap, scan, take, Observable,zip, from, Subject, combineLatest, takeUntil, forkJoin, delay, filter, debounceTime } from "rxjs";
import { numberOfTakes } from "./constants";


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
