import { Entity } from "./entity";

export class User extends Entity{
    name:string;
    lastname:string;
    email:string;
    password:string;
    skills:string;
    userCV:string;

    constructor(){
        super("KORISNIK");
        this.name=null;
        this.lastname=null;
        this.email=null;
        this.password=null;
        this.skills=null;
        this.userCV=null;
    }
}