import IModel from '../../common/IModel.interface';
import CategoryModel from '../category/model';
import UserModel from '../user/model';

class Photo implements IModel {
    photoId: number;
    imagePath: string;
}

class PostModel implements IModel {
    postId: number;
    createdAt: Date;
    name: string;
    description: string;
    location: string;
    photos: Photo[] = [];
    categoryId: number;
    category?: CategoryModel;
    userId: number;
    user?: UserModel;
    isActive: boolean;
    isPromoted: boolean;
}

export default PostModel;

export { Photo as PostPhoto };