import PostModel from '../../../03-back-end/src/components/post/model';
import api from '../api/api';
import EventRegister from '../api/EventRegister';

export default class PostService {
    public static getPostById(postId: number): Promise<PostModel|null> {
        return new Promise<PostModel|null>(resolve => {
            api("get", "/post/" + postId, "user")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve(null);
                }
                resolve(res.data as PostModel);
            });
        });
    }

    public static getPostsByUserId(userId: number):Promise<PostModel[]>{
        return new Promise<PostModel[]>(resolve => {
            api("get", "/user/" + userId + "/post", "user")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }
                resolve(res.data as PostModel[]);
            });
        });
    }

    public static getPostsByCategoryId(categoryId: number): Promise<PostModel[]> {
        return new Promise<PostModel[]>(resolve => {
            api("get", "/category/" + categoryId + "/post", "user")
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") {
                        EventRegister.emit("AUTH_EVENT", "force_login");
                    }
                    return resolve([]);
                }
                resolve(res.data as PostModel[]);
            });
        });
    }
}
