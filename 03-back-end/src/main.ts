import * as express from "express";
import * as cors from "cors";
import Config from "./config/dev";
import CategoryRouter from './components/category/router';
import * as mysql2 from "mysql2/promise";
import IApplicationResources from './common/IApplicationResources.interface';
import Router from './router';
import CategoryService from './components/category/service';
import PostService from './components/post/service';
import UserService from "./components/user/service";
import PostRouter from './components/post/router';
import UserRouter from './components/user/router';
import AdministratorRouter from './components/administrator/router';
import AdministratorService from './components/administrator/service';
import * as fileUpload from "express-fileupload";
import AuthRouter from "./components/auth/router";

async function main() {
    const application: express.Application = express();

    var corsOptions = {
        origin: 'http://localhost:3000',
        credentials : true
    }
      
    application.use(cors(corsOptions));
    
    application.use(express.json());
    application.use(fileUpload({
        limits: {
            fileSize: Config.fileUpload.maxSize,
            files: Config.fileUpload.maxFiles,
        },
        useTempFiles: true,
        tempFileDir: Config.fileUpload.temporaryDirectory,
        uploadTimeout: Config.fileUpload.timeout,
        safeFileNames: true,
        preserveExtension: true,
        createParentPath: true,
        abortOnLimit: true,
    }));

    const resources: IApplicationResources = {
        databaseConnection: await mysql2.createConnection({
            host: Config.database.host,
            port: Config.database.port,
            user: Config.database.user,
            password: Config.database.password,
            database: Config.database.database,
            charset: Config.database.charset,
            timezone: Config.database.timezone,
            supportBigNumbers: true,
        }),
    }

    resources.databaseConnection.connect();

    resources.services = {
        categoryService: new CategoryService(resources),
        postService: new PostService(resources),
        userService: new UserService(resources),
        administratorService: new AdministratorService(resources),
    };

    application.use(
        Config.server.static.route,
        express.static(Config.server.static.path, {
            index: Config.server.static.index,
            cacheControl: Config.server.static.cacheControl,
            maxAge: Config.server.static.maxAge,
            etag: Config.server.static.etag,
            dotfiles: Config.server.static.dotfiles,
        }),
    );

    Router.setupRoutes(application, resources, [
        new CategoryRouter(),
        new PostRouter(),
        new UserRouter(),
        new AdministratorRouter(),
        new AuthRouter(),
    ]);

    application.use((req, res) => {
        res.sendStatus(404);
    });

    application.use((err, req, res, next) => {
        res.status(err.status).send(err.type);
    });

    application.listen(Config.server.port);
}

main();