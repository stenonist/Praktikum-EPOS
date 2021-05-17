export default interface IConfig{
    database: any;
    server:{
        port: number,
        static:{
            path: string,
            route: string,
            cacheControl: boolean,
            dotfiles: "deny" | "allow",
            etag: boolean,
            index: boolean,
            maxAge: number,
        }
    }
}
