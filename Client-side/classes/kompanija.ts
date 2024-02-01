import { Entity } from "./entity";

export class Kompanija extends Entity{
    name:string;
    description:string;
    city:string;
    email:string;
    password:string;

    constructor(){
        super("KOMPANIJA");
        this.name=null;
        this.description=null;
        this.city=null;
        this.email=null;
        this.password=null;
    }
}