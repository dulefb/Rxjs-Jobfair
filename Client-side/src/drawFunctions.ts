import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";
import { User } from "../classes/user";
import { filter,Subject } from "rxjs";
import { setUpLogin } from "./loginEvents";
import { setUpSignin } from "./signupEvents";
import {  removeChildren } from "./pocetnaEvents";

function addLinkToClassElement(class_element:string,href:string,class_name:string,text:string,id_value:string=null) : void{
    const link=document.createElement("a");
    link.href=href;
    link.classList.add(class_name);
    link.innerHTML=text;

    const element = document.querySelector(class_element);
    if(link!==null && element!==null){
        element.appendChild(link);
    }
}

function removeLinkFromClassElement(class_element:string,link_href:string) : void{
    const link = document.querySelector("a[href='"+link_href+"']");
    const element = document.querySelector(class_element);
    if(link!==null && element!==null){
        element.removeChild(link);
    }
}



export function userFilter(){
    let currentUser = sessionStorage.getItem("current-user");
    let currentUserID = sessionStorage.getItem("current-user-id");

    if(currentUser!==null){
        addLinkToClassElement(".header","#novi-recept","header-item","NOVI RECEPT");
        addLinkToClassElement(".header","#profil","header-item","PROFIL");
        addLinkToClassElement(".header","#odjavi-se","header-item","ODJAVI SE");
        removeLinkFromClassElement(".header","#prijavi-se");
        removeLinkFromClassElement(".header","#kreiraj-nalog");
    }
    else{
        addLinkToClassElement(".header","#prijavi-se","header-item","PRIJAVI SE");
        addLinkToClassElement(".header","#kreiraj-nalog","header-item","KREIRAJ NALOG");
        removeLinkFromClassElement(".header","#profil");
        removeLinkFromClassElement(".header","#odjavi-se");
        removeLinkFromClassElement(".header","#novi-recept");
    }

    const kreiraj_nalog = document.querySelector("a[href='#kreiraj-nalog']");
    const control$ = new Subject<string>();
    if(kreiraj_nalog!==null){

        kreiraj_nalog.addEventListener("click",()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawSignup(document.querySelector(".middle"));
            setUpSignin(control$);
        });
    }

    const prijavi_se = document.querySelector("a[href='#prijavi-se']");
    const login$ = new Subject<string>();
    if(prijavi_se!==null){

        prijavi_se.addEventListener("click",()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawLogin(document.querySelector(".middle"));
            setUpLogin(login$);
        });
    }

    const odjavi_se = document.querySelector("a[href='#odjavi-se']");
    if(odjavi_se!==null){

        odjavi_se.addEventListener("click",()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            sessionStorage.removeItem("current-user");
            document.location.reload();
        });
    }
    const profil = <HTMLElement>document.querySelector("a[href='#profil']");
    if(profil!==null){
        //viewUserProfile(currentUser,profil);
    }
}

export function drawSignup(parent_node:HTMLElement){
    const divSignup = document.createElement("div");
    divSignup.classList.add("divSignup");

    //divSignup labele
    const divSignupLabels = document.createElement("div");
    divSignupLabels.classList.add("divSignupLabels");

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML="Ime:";
    divSignupLabels.appendChild(nameLabel);

    let lnameLabel = document.createElement("label");
    lnameLabel.innerHTML="Prezime:";
    divSignupLabels.appendChild(lnameLabel);

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML="E-mail:";
    divSignupLabels.appendChild(emailLabel);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML="Lozinka:";
    divSignupLabels.appendChild(passwordLabel);

    let cityLabel = document.createElement("label");
    cityLabel.innerHTML="Grad:";
    divSignupLabels.appendChild(cityLabel);

    let dateLabel = document.createElement("label");
    dateLabel.innerHTML="Datum rodjenja:";
    divSignupLabels.appendChild(dateLabel);

    let slikaLabel = document.createElement("label");
    slikaLabel.innerHTML="Datum rodjenja:";
    divSignupLabels.appendChild(slikaLabel);

    divSignup.appendChild(divSignupLabels);

    //divSignup inputs

    let divSignupInput = document.createElement("div");
    divSignupInput.classList.add("divSignupInput");

    let nameInput = document.createElement("input");
    nameInput.id="signup-name";
    nameInput.type = "name";
    divSignupInput.appendChild(nameInput);

    let lnameInput = document.createElement("input");
    lnameInput.id="signup-lastname";
    lnameInput.type = "name";
    divSignupInput.appendChild(lnameInput);

    let emailInput = document.createElement("input");
    emailInput.id="signup-email";
    emailInput.type = "email";
    divSignupInput.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.id="signup-password";
    passwordInput.type = "password";
    divSignupInput.appendChild(passwordInput);

    let skillsInput = document.createElement("input");
    skillsInput.id="signup-skills";
    skillsInput.type = "name";
    divSignupInput.appendChild(skillsInput);

    let cvInput = document.createElement("textarea");
    cvInput.id="signup-usercv";
    cvInput.rows=12;
    cvInput.cols=36;
    divSignupInput.appendChild(cvInput);

    divSignup.appendChild(divSignupInput);

    parent_node.appendChild(divSignup);

    let divSignupButton = document.createElement("div");
    divSignupButton.classList.add("divSignupButton");

    //odvojiti u loginEvents.ts i dodati event na button
    let button = document.createElement("button");
    button.classList.add("signupButton");
    button.innerHTML="Kreiraj";
    divSignupButton.appendChild(button);

    parent_node.appendChild(divSignupButton);
}

export function drawLogin(parent_node:HTMLElement){

    let divLogin = document.createElement("div");
    divLogin.classList.add("divLogin");
    
    //login labels
    let divLoginLabels = document.createElement("div");
    divLoginLabels.classList.add("divLoginLabels");

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML="E-mail:";
    divLoginLabels.appendChild(emailLabel);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML="Password:";
    divLoginLabels.appendChild(passwordLabel);

    divLogin.appendChild(divLoginLabels);

    //login inputs

    let divLoginInput = document.createElement("div");
    divLoginInput.classList.add("divLoginInput");

    let emailInput = document.createElement("input");
    emailInput.id="userEmail";
    emailInput.type = "email";
    divLoginInput.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.id="userPass";
    passwordInput.type = "password";
    divLoginInput.appendChild(passwordInput);

    divLogin.appendChild(divLoginInput);

    parent_node.appendChild(divLogin);

    let divLoginButton = document.createElement("div");
    divLoginButton.classList.add("divLoginButton");

    let button = document.createElement("button");
    button.id="btnLogin";
    button.innerHTML="Uloguj se";
    divLoginButton.appendChild(button);

    parent_node.appendChild(divLoginButton);
}


export function drawUserProfile(user:User) : HTMLDivElement{
    let parent = document.querySelector(".middle");
    let divUserProfile = document.createElement("div");
    divUserProfile.classList.add("divUserProfile");

    let userInfoNaslov = document.createElement("h2");
    userInfoNaslov.classList.add("userInfoNaslov");
    if(sessionStorage.getItem("current-user")===user.email){
        userInfoNaslov.innerHTML="Vas profil";
    }
    else{
        userInfoNaslov.innerHTML="Korisnik";
    }
    divUserProfile.appendChild(userInfoNaslov);

    let divUserProfileInfo = document.createElement("div");
    divUserProfileInfo.classList.add("divUserProfileInfo");

    let divUserProfileInfoData = document.createElement("div");
    divUserProfileInfoData.classList.add("divUserProfileInfoData");
    //podaci
    let divUserName = document.createElement("div");
    let labelName = document.createElement("label");
    labelName.classList.add("main-label");
    labelName.innerHTML="Ime: ";
    divUserName.appendChild(labelName);
    let labelNameValue = document.createElement("div");
    labelNameValue.innerHTML=user.name+" "+user.lastname;
    divUserName.appendChild(labelNameValue); 
    divUserProfileInfoData.appendChild(divUserName);

    let divUserEmail = document.createElement("div");
    let labelEmail = document.createElement("label");
    labelEmail.classList.add("main-label");
    labelEmail.innerHTML="Email: ";
    divUserEmail.appendChild(labelEmail);
    let labelEmailValue = document.createElement("div");
    labelEmailValue.innerHTML=user.email;
    divUserEmail.appendChild(labelEmailValue); 
    divUserProfileInfoData.appendChild(divUserEmail);

    let divUserCity = document.createElement("div");
    let labelCity = document.createElement("label");
    labelCity.classList.add("main-label");
    labelCity.innerHTML="Skills: ";
    divUserCity.appendChild(labelCity);
    let labelCityValue = document.createElement("div");
    labelCityValue.innerHTML=user.skills;
    divUserCity.appendChild(labelCityValue); 
    divUserProfileInfoData.appendChild(divUserCity);

    let divUserDate = document.createElement("div");
    let labelDate = document.createElement("label");
    labelDate.classList.add("main-label");
    labelDate.innerHTML="Datum rodjenja: ";
    divUserDate.appendChild(labelDate);
    let labelDateValue = document.createElement("div");
    labelDateValue.innerHTML=user.userCV;
    divUserDate.appendChild(labelDateValue); 
    divUserProfileInfoData.appendChild(divUserDate);

    divUserProfileInfo.appendChild(divUserProfileInfoData);
    divUserProfile.appendChild(divUserProfileInfo);

    let userReceptiNaslov = document.createElement("h2");
    userReceptiNaslov.classList.add("userReceptiNaslov");
    userReceptiNaslov.innerHTML="Recepti";
    divUserProfile.appendChild(userReceptiNaslov);

    let divUserProfileRecepti = document.createElement("div");
    divUserProfileRecepti.classList.add("divUserProfileRecepti");
    divUserProfile.appendChild(divUserProfileRecepti);

    parent.appendChild(divUserProfile);
    return divUserProfileRecepti;
}