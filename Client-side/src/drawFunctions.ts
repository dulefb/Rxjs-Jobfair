import { getComment, getUserWithEmail, getUserWithEmailAndPassword, getVrsteJela, postComment, postUser } from "./dbServices";
import { User } from "../classes/user";
import { filter,Subject } from "rxjs";
import { setUpLogin } from "./loginEvents";
import { setUpSignin } from "./signupEvents";
import { addObservableToSearchClick, addObservableToVrsteRecepta, removeChildren } from "./pocetnaEvents";
import { Recept } from "../classes/recept";
import { VrsteJela } from "../classes/vrsteJela";
import { Comment } from "../classes/comment";
import { viewUserProfile } from "./profilEvents";
import { CommentResponse } from "../classes/commentResponse";

function addLinkToClassElement(class_element:string,href:string,class_name:string,text:string,id_value:string=null) : void{
    const link=document.createElement("a");
    link.href=href;
    link.classList.add(class_name);
    link.innerHTML=text;

    if(class_name==="dropdown-content-links"){
        addObservableToVrsteRecepta(link,"click",id_value);
    }

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
        viewUserProfile(currentUser,profil);
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

    let cityInput = document.createElement("input");
    cityInput.id="signup-city";
    cityInput.type = "name";
    divSignupInput.appendChild(cityInput);

    let dateInput = document.createElement("input");
    dateInput.id="signup-date";
    dateInput.type = "date";
    divSignupInput.appendChild(dateInput);

    let slikaFile = document.createElement("input");
    slikaFile.id="signup-image";
    slikaFile.type="file";
    divSignupInput.appendChild(slikaFile);

    divSignup.appendChild(divSignupInput);

    parent_node.appendChild(divSignup);

    let divSlikaPreviw = document.createElement("div");
    divSlikaPreviw.classList.add("divSlikaPreviw");

    let slikaPreview = document.createElement("img");
    slikaPreview.alt="Image preview";
    slikaPreview.width=150;
    slikaPreview.height=150;
    divSlikaPreviw.appendChild(slikaPreview);
    parent_node.appendChild(divSlikaPreviw);

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

export function drawDropdownList() : void{
    getVrsteJela().subscribe(next=>{
        next.forEach(value=>{
            addLinkToClassElement(".dropdown-content","#"+value.name.toLowerCase().split(" ").reduce((acc,curr)=>acc+curr),"dropdown-content-links",value.name,value.id);
        })
    })
}

export function drawNoviRecept(parent_node:HTMLElement) : void{
    let divReceptParent = document.createElement("div");
    divReceptParent.classList.add("divReceptParent");

    let divNazivRecepta = document.createElement("div");
    divNazivRecepta.classList.add("divNazivRecepta");

    let labelNaziv = document.createElement("label");
    labelNaziv.innerHTML="Naziv:";
    divNazivRecepta.appendChild(labelNaziv);

    let inputNaziv = document.createElement("input");
    inputNaziv.type="name";
    inputNaziv.id="noviReceptName";
    divNazivRecepta.appendChild(inputNaziv);

    divReceptParent.appendChild(divNazivRecepta);

    let divVrstaJela = document.createElement("div");
    divVrstaJela.classList.add("divVrstaJela");

    let labelVrstaJela = document.createElement("label");
    labelVrstaJela.innerHTML="Vrsta jela:";
    divVrstaJela.appendChild(labelVrstaJela);

    let selectVrstaJela = document.createElement("select");
    selectVrstaJela.classList.add("divVrstaJelaSelect");
    let selectOption = document.createElement("option");
    selectOption.innerHTML="";
    selectOption.value="0";
    selectVrstaJela.appendChild(selectOption);
    getVrsteJela().subscribe(next=>{
        next.forEach(x=>{
            let selectOption = document.createElement("option");
            selectOption.innerHTML=x.name;
            selectOption.value=x.id;
            selectVrstaJela.appendChild(selectOption);
        })
    });
    divVrstaJela.appendChild(selectVrstaJela);
    divReceptParent.appendChild(divVrstaJela);

    let divSastojci = document.createElement("div");
    divSastojci.classList.add("divSastojci");

    let labelSastojci = document.createElement("label");
    labelSastojci.innerHTML="Sastojci:";
    divSastojci.appendChild(labelSastojci);

    let inputSastojci = document.createElement("input");
    inputSastojci.type="text";
    inputSastojci.id="noviReceptSastojci";
    divSastojci.appendChild(inputSastojci);
    divReceptParent.appendChild(divSastojci);

    let divPriprema = document.createElement("div");
    divPriprema.classList.add("divPriprema");

    let labelPriprema = document.createElement("label");
    labelPriprema.innerHTML="Priprema:";
    divPriprema.appendChild(labelPriprema);

    let inputPriprema = document.createElement("textarea");
    inputPriprema.id="noviReceptPriprema";
    inputPriprema.cols=30;
    inputPriprema.rows=15;
    divPriprema.appendChild(inputPriprema);
    divReceptParent.appendChild(divPriprema);

    let divSlika = document.createElement("div");
    divSlika.classList.add("divSlika");

    let labelSlika = document.createElement("label");
    labelSlika.innerHTML="Dodaj sliku";
    divSlika.appendChild(labelSlika);
    
    let slikaFile = document.createElement("input");
    slikaFile.id="slikaRecept";
    slikaFile.type="file";
    divSlika.appendChild(slikaFile);

    let slikaPreview = document.createElement("img");
    slikaPreview.alt="Image preview";
    slikaPreview.width=150;
    slikaPreview.height=150;
    divSlika.appendChild(slikaPreview);
    divReceptParent.appendChild(divSlika);

    let divButtonDodajRecept = document.createElement("div");
    divButtonDodajRecept.classList.add("divButtonDodajRecept");

    let btnDodajRecept = document.createElement("button");
    btnDodajRecept.innerHTML="Dodaj";
    btnDodajRecept.classList.add("buttonDodajRecept");
    btnDodajRecept.disabled=true;
    divButtonDodajRecept.appendChild(btnDodajRecept);
    divReceptParent.appendChild(divButtonDodajRecept);

    parent_node.appendChild(divReceptParent);
}

export function drawReceptPage(recept:Recept,autor:User,vrsta_jela:VrsteJela,comments:CommentResponse=null) : void{
    removeChildren(document.querySelector(".middle"),document.querySelectorAll(".middle > div"));
    let divReceptPage = document.createElement("div");
    divReceptPage.classList.add("divReceptPage");

    let divReceptPageSlika = document.createElement("div");
    divReceptPageSlika.classList.add("divReceptPageSlika");

    let receptSlika = document.createElement("img");
    receptSlika.alt = "Recept image.";
    receptSlika.src = recept.slika;

    divReceptPageSlika.appendChild(receptSlika);
    divReceptPage.appendChild(divReceptPageSlika);

    let divReceptPageInfo = document.createElement("div");
    divReceptPageInfo.classList.add("divReceptPageInfo");

    //naziv recepta
    let divRecepPageName = document.createElement("div");
    divRecepPageName.classList.add("divReceptPageName");
    let labelname = document.createElement("label");
    labelname.classList.add("main-label");
    labelname.innerHTML="Naziv recepta: ";
    divRecepPageName.appendChild(labelname);

    let labelnameValue = document.createElement("label");
    labelnameValue.innerHTML=recept.naziv;
    divRecepPageName.appendChild(labelnameValue);
    divReceptPageInfo.appendChild(divRecepPageName);

    //ime autora
    let divRecepPageAutor = document.createElement("div");
    divRecepPageAutor.classList.add("divReceptPageAutor");
    let labelautor = document.createElement("label");
    labelautor.innerHTML="Ime autora: ";
    labelautor.classList.add("main-label");
    divRecepPageAutor.appendChild(labelautor);

    let linkautorValue = document.createElement("a");
    linkautorValue.href="#autro-link";
    viewUserProfile(autor.email,linkautorValue);
    linkautorValue.innerHTML=autor.name+" "+autor.last_name;
    divRecepPageAutor.appendChild(linkautorValue);
    divReceptPageInfo.appendChild(divRecepPageAutor);

    let divRecepPageVrstaJela = document.createElement("div");
    divRecepPageVrstaJela.classList.add("divRecepPageVrstaJela");
    let labelvrstaJela = document.createElement("label");
    labelvrstaJela.classList.add("main-label");
    labelvrstaJela.innerHTML="Vrsta jela: ";
    divRecepPageVrstaJela.appendChild(labelvrstaJela);

    let labelvrstaJelaValue = document.createElement("label");
    labelvrstaJelaValue.innerHTML=vrsta_jela.name;
    divRecepPageVrstaJela.appendChild(labelvrstaJelaValue);
    divReceptPageInfo.appendChild(divRecepPageVrstaJela);

    let divRecepPageSastojci = document.createElement("div");
    divRecepPageSastojci.classList.add("divRecepPageSastojci");
    let labelSastojci = document.createElement("label");
    labelSastojci.classList.add("main-label");
    labelSastojci.innerHTML="Sastojci: ";
    divRecepPageSastojci.appendChild(labelSastojci);

    let labelSastojciValue = document.createElement("label");
    labelSastojciValue.innerHTML=recept.sastojci;
    divRecepPageSastojci.appendChild(labelSastojciValue);
    divReceptPageInfo.appendChild(divRecepPageSastojci);

    let divRecepPagePriprema = document.createElement("div");
    divRecepPagePriprema.classList.add("divRecepPagePriprema");
    let labelPriprema = document.createElement("label");
    labelPriprema.classList.add("main-label");
    labelPriprema.innerHTML="Priprema: ";
    divRecepPagePriprema.appendChild(labelPriprema);

    let divPripremaLabels = document.createElement("div");
    divPripremaLabels.classList.add("divPripremaLabels");
    recept.priprema.split("\n").forEach(value=>{
        let pripremaLabel=document.createElement("label");
        pripremaLabel.innerHTML=value;
        divPripremaLabels.appendChild(pripremaLabel);
    })
    divRecepPagePriprema.appendChild(divPripremaLabels);
    divReceptPageInfo.appendChild(divRecepPagePriprema);
    

    divReceptPage.appendChild(divReceptPageInfo);
    document.querySelector(".middle").appendChild(divReceptPage);

    
    //Comments
    let divReceptComments = document.createElement("div");
    divReceptComments.classList.add("divReceptComment");
    //Show comments
    let divReceptCommentShow = document.createElement("div");
    divReceptCommentShow.classList.add("divReceptCommentShow");

    getComment(recept.id).subscribe(next=>{
        for(let i=0;i<next.texts.length;i++){
            let divComment=document.createElement("div");
            divComment.classList.add("divComment");
            let labelUser=document.createElement("label");
            labelUser.classList.add("divCommentFont");
            labelUser.innerHTML=next.users[i]+":";
            divComment.appendChild(labelUser);
            let labelText = document.createElement("label");
            labelText.innerHTML=next.texts[i];
            divComment.appendChild(labelText);
            divReceptCommentShow.appendChild(divComment);
        }
    });
    divReceptComments.appendChild(divReceptCommentShow);
    //Submit comments
    if(sessionStorage.getItem("current-user")!==null){
        let divReceptCommentEnter = document.createElement("div");
        divReceptCommentEnter.classList.add("divReceptCommentEnter");

        let commentText=document.createElement("textarea"); 
        commentText.id="commmentText";
        commentText.innerHTML="Unesite komentar";
        commentText.cols=30;
        commentText.rows=7;
        divReceptCommentEnter.appendChild(commentText);

        let submitComment=document.createElement("button");
        submitComment.classList.add("submitComment");
        submitComment.innerHTML="Submit comment";
        submitComment.onclick=()=>{
            postComment({
                id_recept:recept.id,
                user:sessionStorage.getItem("current-user"),
                text:commentText.value
            }).subscribe(next=>{
                if(next===true){
                    alert("Komentar je postavljen uspesno");
                    commentText.value="Unesite komentar";
                    document.location.reload();
                }
                else{
                    alert("Komentar nije postavljen, pokusajte ponovo");
                }
            })
        }
        divReceptCommentEnter.appendChild(submitComment);
        divReceptComments.appendChild(divReceptCommentEnter);
    }

    document.querySelector(".middle").appendChild(divReceptComments);
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

    let divUserProfileInfoSlika = document.createElement("div");
    divUserProfileInfoSlika.classList.add("divUserProfileInfoSlika");
    //slika
    let img = document.createElement("img");
    img.alt = "User image...";
    img.src = user.picture;
    divUserProfileInfoSlika.appendChild(img);
    divUserProfileInfo.appendChild(divUserProfileInfoSlika);

    let divUserProfileInfoData = document.createElement("div");
    divUserProfileInfoData.classList.add("divUserProfileInfoData");
    //podaci
    let divUserName = document.createElement("div");
    let labelName = document.createElement("label");
    labelName.classList.add("main-label");
    labelName.innerHTML="Ime: ";
    divUserName.appendChild(labelName);
    let labelNameValue = document.createElement("div");
    labelNameValue.innerHTML=user.name+" "+user.last_name;
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

    let divUserDate = document.createElement("div");
    let labelDate = document.createElement("label");
    labelDate.classList.add("main-label");
    labelDate.innerHTML="Datum rodjenja: ";
    divUserDate.appendChild(labelDate);
    let labelDateValue = document.createElement("div");
    labelDateValue.innerHTML=user.birth_date;
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

export function drawSearchRecept(parent:Node,recept:Recept) : void{
    let divSearchSingleRecept = document.createElement("div");
    divSearchSingleRecept.classList.add("divSearchSingleRecept");

    let img = document.createElement("img");
    img.src=recept.slika;
    divSearchSingleRecept.appendChild(img);

    let labelName = document.createElement("label");
    labelName.innerHTML = recept.naziv;
    divSearchSingleRecept.appendChild(labelName);

    addObservableToSearchClick(divSearchSingleRecept,recept);

    parent.appendChild(divSearchSingleRecept);
}