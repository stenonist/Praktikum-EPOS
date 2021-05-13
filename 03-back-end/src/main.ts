import * as express from "express";
import * as cors from "cors";

import Config from "./config/dev";
import CategoryService from './components/category/service';
import CategoryController from './components/category/controller';

const app: express.Application = express();

app.use(cors());
app.use(express.json());

app.use(
    Config.server.static.route,
    express.static(Config.server.static.path,{
        index: Config.server.static.index, //nema kreiranje liste
        cacheControl: Config.server.static.cacheControl, //dozvoljeno kesiranje
        maxAge: Config.server.static.maxAge,
        etag: Config.server.static.etag, //dodatne info o response (timestamp)
        dotfiles: Config.server.static.dotfiles, //ne moze da radi sa skrivenim fajlovima  
    }),
);

const categoryService: CategoryService = new CategoryService();
const categoryController: CategoryController = new CategoryController(categoryService);

app.get("/category", categoryController.getAll.bind(categoryController))

app.use((req,res)=> {
    res.sendStatus(404);
})

app.listen(Config.server.port);