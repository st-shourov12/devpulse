export interface IUser {
    name :  string ,
    email : string ,
    password : string ,
    
    role? : "contributor" | "maintainer",
    updated_at : string
    
}