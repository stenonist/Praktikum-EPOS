import { Application } from 'express';
import IApplicationResources from '../../common/IApplicationResources.interface';
import IRouter from '../../common/IRouter.interface';
import PostController from './controller';

export default class PostRouter implements IRouter {
    public setupRoutes(application: Application, resources: IApplicationResources) {
        // Controller:
        const postController = new PostController(resources);

        // Routing:
        application.get('/user/:id/post',    postController.getAllByUserId.bind(postController));
        application.get('/post/:id',    postController.getById.bind(postController));
        application.get('/posts',    postController.getAll.bind(postController));
        application.post('/post',       postController.add.bind(postController));
        application.put('/post/:id',    postController.edit.bind(postController));
        application.delete('/post/:id', postController.delete.bind(postController));
        application.delete('/post/:aid/photo/:pid', postController.deletePostPhoto.bind(postController));
        application.post('/post/:id/photo', postController.addPostPhotos.bind(postController));
    }
}
