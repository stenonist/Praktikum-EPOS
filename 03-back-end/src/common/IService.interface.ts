import CategoryService from "../components/category/service";
import PostService from "../components/post/service";
import UserService from '../components/user/service';
import AdministratorService from '../components/administrator/service';

export default interface IServices{
    categoryService: CategoryService;
    postService: PostService;
    userService: UserService;
    administratorService: AdministratorService;
}