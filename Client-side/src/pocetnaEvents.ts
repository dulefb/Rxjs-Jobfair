import { getUserKonkurs, postKonkurs, postPrijaviSeNaKonkurs } from "./dbServices";
import { Konkurs } from "../classes/konkurs";
import { User } from "../classes/user";
import { drawViewKonkurse } from "./drawFunctions";


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

export function addUserKonkursEvent(button:HTMLButtonElement,user:User,konkurs:Konkurs){
    button.onclick=()=>{
        postPrijaviSeNaKonkurs(user,konkurs)
            .subscribe(next=>{
                if(next.valid){
                    alert(next.msg);
                    document.location.reload();
                }
                else{
                    alert(next.msg);
                }
            })
    }
}

export function viewUserKonkurs(){
    let parent = <HTMLElement>document.querySelector(".middle");
    console.log(JSON.parse(sessionStorage.getItem("current-user")).skills);
    getUserKonkurs((JSON.parse(sessionStorage.getItem("current-user")).skills))
        .subscribe(next=>{
            drawViewKonkurse(parent,next);
        });
}