import { getUserWithEmail, getUserWithEmailAndPassword, postUser } from "./dbServices";
import { User } from "../classes/user";
import { filter,Subject } from "rxjs";
import { setUpLogin } from "./loginEvents";
import { setUpSignin } from "./signupEvents";
import {  addCompanyKonkursEvent, addNewKonkursEvent, addUserKonkursEvent, removeChildren } from "./pocetnaEvents";
import { Kompanija } from "../classes/kompanija";
import { Konkurs } from "../classes/konkurs";
import { CompanyKonkurs } from "../classes/CompanyKonkurs";

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
    let currentUser = JSON.parse(sessionStorage.getItem("current-user"));
    let currentUserLabel = sessionStorage.getItem("current-user-label");

    if(currentUser!==null){
        if(currentUserLabel==="KOMPANIJA"){
            addLinkToClassElement(".header","#novi-konkurs","header-item","NOVI KONKURS");
        }
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
        if(document.querySelector("a[href='#novi-konkurs']")!==undefined){
            removeLinkFromClassElement(".header","#novi-recept");
        }
    }

    const kreiraj_nalog = document.querySelector("a[href='#kreiraj-nalog']");
    const control$ = new Subject<string>();
    if(kreiraj_nalog!==null){
        kreiraj_nalog.addEventListener("click",()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawSignup(document.querySelector(".middle"));
            setUpSignin();
        });
    }

    const prijavi_se = document.querySelector("a[href='#prijavi-se']");
    const login$ = new Subject<string>();
    if(prijavi_se!==null){

        prijavi_se.addEventListener("click",()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawLogin(document.querySelector(".middle"));
            setUpLogin();
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
        profil.onclick=()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawUserProfile(currentUser);
        }
    }

    const noviKonkurs = <HTMLElement>document.querySelector("a[href='#novi-konkurs']");
    if(noviKonkurs!==null){
        noviKonkurs.onclick=()=>{
            removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
            drawNewKonkurs(document.querySelector(".middle"));
            addNewKonkursEvent();
        }
    }
}

export function drawSignup(parent_node:HTMLElement){

    const selectDiv = document.createElement("div");
    selectDiv.classList.add("selectDiv");

    let chooseLabel = document.createElement("label");
    chooseLabel.classList.add("chooseLabel");
    chooseLabel.innerHTML="Izaberite ulogu:";
    selectDiv.appendChild(chooseLabel);

    let chooseSelect = document.createElement("select");
    chooseSelect.classList.add("chooseSelect");
    chooseSelect.id="chooseSelect";
    
    let selOption = document.createElement("option");
    selOption.innerHTML="";
    selOption.value="";
    selOption.selected=true;
    chooseSelect.appendChild(selOption);

    selOption = document.createElement("option");
    selOption.innerHTML="KORISNIK";
    selOption.value="KORISNIK";
    chooseSelect.appendChild(selOption);
    
    selOption = document.createElement("option");
    selOption.innerHTML = "KOMPANIJA";
    selOption.value="KOMPANIJA";
    chooseSelect.appendChild(selOption);
    selectDiv.appendChild(chooseSelect);
    parent_node.appendChild(selectDiv);

    //rest of signup
    const divSignup = document.createElement("div");
    divSignup.classList.add("divSignup");

    //divSignup za korisnika ili kompaniju
    selectDiv.onchange=()=>{
        let selectValue = (<HTMLSelectElement>document.querySelector("#chooseSelect")).value;
        removeChildren(document.querySelector(".divSignup"),document.querySelectorAll(".divSignup > div"));
        if(selectValue==="KORISNIK"){
            drawSignupKorisnik(divSignup);
        }
        if(selectValue==="KOMPANIJA"){
            drawSignupKompanija(divSignup);
        }
    }
    
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

export function drawSignupKorisnik(parent_node:HTMLElement){
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

    let skillsLabel = document.createElement("label");
    skillsLabel.innerHTML="Oblast rada:";
    divSignupLabels.appendChild(skillsLabel);

    let usercvLabel = document.createElement("label");
    usercvLabel.innerHTML="Napisite vas CV:";
    divSignupLabels.appendChild(usercvLabel);

    parent_node.appendChild(divSignupLabels);

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

    parent_node.appendChild(divSignupInput);
}

export function drawSignupKompanija(parent_node:HTMLElement){
    const divSignupLabels = document.createElement("div");
    divSignupLabels.classList.add("divSignupLabels");

    let nameLabel = document.createElement("label");
    nameLabel.innerHTML="Naziv:";
    divSignupLabels.appendChild(nameLabel);

    let cityLabel = document.createElement("label");
    cityLabel.innerHTML="Grad:";
    divSignupLabels.appendChild(cityLabel);

    let emailLabel = document.createElement("label");
    emailLabel.innerHTML="E-mail:";
    divSignupLabels.appendChild(emailLabel);

    let passwordLabel = document.createElement("label");
    passwordLabel.innerHTML="Lozinka:";
    divSignupLabels.appendChild(passwordLabel);

    let descriptionLabel = document.createElement("label");
    descriptionLabel.innerHTML="Opisite kompaniju:";
    divSignupLabels.appendChild(descriptionLabel);

    parent_node.appendChild(divSignupLabels);

    //divSignup inputs

    let divSignupInput = document.createElement("div");
    divSignupInput.classList.add("divSignupInput");

    let nameInput = document.createElement("input");
    nameInput.id="signup-name";
    nameInput.type = "name";
    divSignupInput.appendChild(nameInput);

    let cityInput = document.createElement("input");
    cityInput.id="signup-city";
    cityInput.type = "name";
    divSignupInput.appendChild(cityInput);

    let emailInput = document.createElement("input");
    emailInput.id="signup-email";
    emailInput.type = "email";
    divSignupInput.appendChild(emailInput);

    let passwordInput = document.createElement("input");
    passwordInput.id="signup-password";
    passwordInput.type = "password";
    divSignupInput.appendChild(passwordInput);

    let descriptionInput = document.createElement("textarea");
    descriptionInput.id="signup-description";
    descriptionInput.rows=12;
    descriptionInput.cols=36;
    divSignupInput.appendChild(descriptionInput);

    parent_node.appendChild(divSignupInput);
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


export function drawUserProfile(user:any) : void{
    let parent = document.querySelector(".middle");
    let divUserProfile = document.createElement("div");
    divUserProfile.classList.add("divUserProfile");

    let userInfoNaslov = document.createElement("h2");
    userInfoNaslov.classList.add("userInfoNaslov");
    if(JSON.parse(sessionStorage.getItem("current-user")).email===user.email){
        userInfoNaslov.innerHTML="Vas profil";
    }
    else{
        userInfoNaslov.innerHTML="Korisnik";
    }
    divUserProfile.appendChild(userInfoNaslov);

    let divUserProfileInfo = document.createElement("div");
    divUserProfileInfo.classList.add("divUserProfileInfo");

    if(sessionStorage.getItem("current-user-label")==="KORISNIK"){
        drawKorisnikProfile(divUserProfileInfo,user);
    }
    else{
        drawKompanijaProfile(divUserProfileInfo,user);
    }
    
    divUserProfile.appendChild(divUserProfileInfo);

    parent.appendChild(divUserProfile);
}

function drawKorisnikProfile(parent:HTMLElement,user:User){

    let divUserProfileInfoData = document.createElement("div");
    divUserProfileInfoData.classList.add("divUserProfileInfoData");
    //podaci
    let divUserName = document.createElement("div");
    let labelName = document.createElement("label");
    labelName.classList.add("main-label");
    labelName.innerHTML="Ime: ";
    divUserName.appendChild(labelName);
    let labelNameValue = document.createElement("div");
    labelNameValue.innerHTML=user.name + " "+user.lastname;
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

    let divUserSkills = document.createElement("div");
    let labelSkills = document.createElement("label");
    labelSkills.classList.add("main-label");
    labelSkills.innerHTML="Skills: ";
    divUserSkills.appendChild(labelSkills);
    let labelSkillsValue = document.createElement("div");
    labelSkillsValue.innerHTML=user.skills;
    divUserSkills.appendChild(labelSkillsValue); 
    divUserProfileInfoData.appendChild(divUserSkills);

    let divUserCV = document.createElement("div");
    let labelCV = document.createElement("label");
    labelCV.classList.add("main-label");
    labelCV.innerHTML="CV korisnika: ";
    divUserCV.appendChild(labelCV);
    let labelCVValue = document.createElement("div");
    labelCVValue.innerHTML=user.userCV;
    divUserCV.appendChild(labelCVValue); 
    divUserProfileInfoData.appendChild(divUserCV);

    parent.appendChild(divUserProfileInfoData);
}

function drawKompanijaProfile(parent:HTMLElement,user:Kompanija){
    let divUserProfileInfoData = document.createElement("div");
    divUserProfileInfoData.classList.add("divUserProfileInfoData");
    //podaci
    let divUserName = document.createElement("div");
    let labelName = document.createElement("label");
    labelName.classList.add("main-label");
    labelName.innerHTML="Naziv: ";
    divUserName.appendChild(labelName);
    let labelNameValue = document.createElement("div");
    labelNameValue.innerHTML=user.name;
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
    labelCity.innerHTML="Grad: ";
    divUserCity.appendChild(labelCity);
    let labelCityValue = document.createElement("div");
    labelCityValue.innerHTML=user.city;
    divUserCity.appendChild(labelCityValue); 
    divUserProfileInfoData.appendChild(divUserCity);

    let divUserDescription = document.createElement("div");
    let labelDescription = document.createElement("label");
    labelDescription.classList.add("main-label");
    labelDescription.innerHTML="Opis kompanije: ";
    divUserDescription.appendChild(labelDescription);
    let labelDescriptionValue = document.createElement("div");
    labelDescriptionValue.innerHTML=user.description;
    divUserDescription.appendChild(labelDescriptionValue); 
    divUserProfileInfoData.appendChild(divUserDescription);

    parent.appendChild(divUserProfileInfoData);
}

export function drawNewKonkurs(parent:HTMLElement) : void{
    let divNewKonkurs = document.createElement("div");
    divNewKonkurs.classList.add("divNewKonkurs");

    let divJobInput = document.createElement("div");
    divJobInput.classList.add("divJobInput");

    let jobLabel = document.createElement("label");
    jobLabel.innerHTML = "Posao: ";
    divJobInput.appendChild(jobLabel);

    let jobInput = document.createElement("input");
    jobInput.type="name";
    jobInput.id="jobInput";
    divJobInput.appendChild(jobInput);
    divNewKonkurs.appendChild(divJobInput);

    let divMoneyInput = document.createElement("div");
    divMoneyInput.classList.add("divMoneyInput");

    let moneyLabel = document.createElement("label");
    moneyLabel.innerHTML = "Plata: ";
    divMoneyInput.appendChild(moneyLabel);

    let moneyInput = document.createElement("input");
    moneyInput.type="name";
    moneyInput.id="moneyInput";
    divMoneyInput.appendChild(moneyInput);
    divNewKonkurs.appendChild(divMoneyInput);

    let divKonkursButton = document.createElement("div");
    divKonkursButton.classList.add("divKonkursButton");

    let konkursButton = document.createElement("button");
    konkursButton.innerHTML = "Dodaj konkurs";
    konkursButton.id = "newKonkursButton";
    divKonkursButton.appendChild(konkursButton);
    divNewKonkurs.appendChild(divKonkursButton);

    parent.appendChild(divNewKonkurs);
}

export function drawViewKonkurse(parent:HTMLElement,array:Konkurs[]){
    let divUserViewKonkurs = document.createElement("div");
    divUserViewKonkurs.classList.add("divUserViewKonkurs");

    array.forEach(kon=>{
        let divKonkurs = document.createElement("div");
        divKonkurs.classList.add("divKonkurs");

        let jobLabel = document.createElement("label");
        jobLabel.innerHTML="Posao: "+kon.job;
        divKonkurs.appendChild(jobLabel);

        let companyLabel = document.createElement("label");
        companyLabel.innerHTML = "Kompanija: "+kon.company;
        divKonkurs.appendChild(companyLabel);

        let moneyLabel = document.createElement("label");
        moneyLabel.innerHTML="Plata: "+kon.money;
        divKonkurs.appendChild(moneyLabel);

        let buttonKonkurs = document.createElement("button");
        addUserKonkursEvent(buttonKonkurs,<User>JSON.parse(sessionStorage.getItem("current-user")),kon);
        buttonKonkurs.innerHTML="Prijavi se";
        divKonkurs.appendChild(buttonKonkurs);
        divUserViewKonkurs.appendChild(divKonkurs);
    });

    parent.appendChild(divUserViewKonkurs);
}

export function drawViewCompanyKonkurse(parent:HTMLElement,array:CompanyKonkurs[]){
    let divKompanijaViewKonkurs = document.createElement("div");
    divKompanijaViewKonkurs.classList.add("divKompanijaViewKonkurs");

    array.forEach(kon=>{
        let divKonkurs = document.createElement("div");
        divKonkurs.classList.add("divKonkurs");

        let userNameLabel = document.createElement("label");
        userNameLabel.innerHTML=kon.korisnik.name+" "+kon.korisnik.lastname;
        divKonkurs.appendChild(userNameLabel);

        let userCVdiv = document.createElement("div");
        userCVdiv.innerHTML=kon.korisnik.userCV;
        divKonkurs.appendChild(userCVdiv);

        let jobLabel = document.createElement("label");
        jobLabel.innerHTML="Posao: "+kon.konkurs.job;
        divKonkurs.appendChild(jobLabel);

        let companyLabel = document.createElement("label");
        companyLabel.innerHTML = "Kompanija: "+kon.konkurs.company;
        divKonkurs.appendChild(companyLabel);

        let moneyLabel = document.createElement("label");
        moneyLabel.innerHTML="Plata: "+kon.konkurs.money;
        divKonkurs.appendChild(moneyLabel);

        let buttonKonkurs = document.createElement("button");
        addCompanyKonkursEvent(buttonKonkurs,<Kompanija>JSON.parse(sessionStorage.getItem("current-user")),kon);
        buttonKonkurs.innerHTML="Prihvati";
        divKonkurs.appendChild(buttonKonkurs);
        divKompanijaViewKonkurs.appendChild(divKonkurs);
    });

    parent.appendChild(divKompanijaViewKonkurs);
}