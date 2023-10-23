// export class Fields {
//     constructor(public  tcase: string,  public lang: string, public query: string){}   
// }

export class Fields{
    public tcase: string;
    public lang: string;
    public query: string;
    
    constructor(tcase: string, lang: string, query: string){
        this.tcase = tcase;
        this.lang = lang;
        this.query = query;
    }
}