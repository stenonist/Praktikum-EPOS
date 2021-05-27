import CategoryService from "../components/category/service";
import PostService from "../components/post/service";

export default interface IServices{
    categoryService: CategoryService;
    postService: PostService;
}