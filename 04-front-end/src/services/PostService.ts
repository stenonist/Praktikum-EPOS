import PostModel from '../../../03-back-end/src/components/post/model';
import api, { apiAsForm } from '../api/api';
import EventRegister from '../api/EventRegister';
import * as path from "path";

export interface IAddPost {
    name: string;
    description: string;
    location: string;
    categoryId: number;
    userId: number;
    images: File[];
}
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

    public static getAllPosts():Promise<PostModel[]> {
        return new Promise<PostModel[]>(resolve => {
            api("get", "/all-post")
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

    public static addPost(data: IAddPost): Promise<boolean> {
        return new Promise<boolean>(resolve => {
            const formData = new FormData();
            formData.append("data", JSON.stringify({
                name: data.name,
                description: data.description,
                location: data.location,
                categoryId: data.categoryId,
                userId: data.userId,
            }));

            for (let image of data.images) {
                formData.append("image", image);
            }

            apiAsForm("post", "/article", "administrator", formData)
            .then(res => {
                if (res?.status !== "ok") {
                    if (res.status === "login") EventRegister.emit("AUTH_EVENT", "force_login");

                    return resolve(false);
                }

                resolve(true);
            });
        });
    }

    public static getThumbPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-thumb" + extension;
    }

    public static getSmallPath(url: string): string {
        const directory = path.dirname(url);
        const extension = path.extname(url);
        const filename  = path.basename(url, extension);
        return directory + "/" + filename + "-small" + extension;
    }
}
