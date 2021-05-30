import IModelAdapterOptions from "../../common/IModelAdapterOptions.interface";
import BaseService from '../../common/BaseService';
import PostModel, { PostPhoto } from "./model";
import CategoryModel from "../category/model";
import UserModel from '../user/model';
import IErrorResponse from "../../common/IErrorResponse.interface";
import { IAddPost, IUploadedPhoto } from './dto/IAddPost';
import { IEditPost } from "./dto/IEditPost";
import * as fs from "fs";
import Config from "../../config/dev";
import path = require("path");

class PostModelAdapterOptions implements IModelAdapterOptions{
    loadCategory: boolean = false;
    loadUser: boolean = false;
    loadPhotos: boolean = false;
}

class PostService extends BaseService<PostModel>{

    protected async adaptModel(
        row: any,
        options: Partial<PostModelAdapterOptions> ={}
    ): Promise<PostModel> {
        const item: PostModel = new PostModel();

        item.postId = +(row?.category_id);
        item.createdAt = new Date(row?.created_at);
        item.name = row?.name;
        item.description = row?.description;
        item.location = row?.location;
        item.categoryId = row?.category_id;
        item.userId = row?.user_id;

        if (options.loadCategory) {
            item.category = await this.services.categoryService.getById(item.categoryId) as CategoryModel;
        }

        if (options.loadPhotos) {
            item.photos = await this.getAllPhotosByPostId(item.postId);
        }

        if (options.loadUser) {
            item.user = await this.services.userService.getById(item.userId);
        }

        return item;
    }

    public async getAll(
        options: Partial<PostModelAdapterOptions> = { },
    ): Promise<PostModel[]|IErrorResponse> {
        return await this.getAllFromTable<PostModelAdapterOptions>(
            'post',
            options,
        );
    }

    private async getAllPhotosByPostId(postId: number): Promise<PostPhoto[]> {
        const sql = `SELECT photo_id, image_path FROM photo WHERE post_id = ?;`;
        const [ rows ] = await this.db.execute(sql, [ postId ]);

        if (!Array.isArray(rows) || rows.length === 0) {
            return [];
        }

        return rows.map(row => {
            return {
                photoId: +(row?.photo_id),
                imagePath: row?.image_path,
            }
        });
    }

    public async getById(
        postId: number,
        options: Partial<PostModelAdapterOptions> = {},
    ): Promise<PostModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "post",
            postId,
            options,
        );
    }

    /* public async getUserById(
        postId: number,
        options: Partial<PostModelAdapterOptions> = {},
    ): Promise<PostModel|IErrorResponse|null> {
        return this.getByIdFromTable(
            "post",
            postId,
            options,
        );
    } */

    //Add
    public async add(
        data: IAddPost,
        uploadedPhotos: IUploadedPhoto[],
    ): Promise<PostModel|IErrorResponse> {
        return new Promise<PostModel|IErrorResponse>(resolve => {
            this.db.beginTransaction()
            .then(() => {
                this.db.execute(
                    `
                    INSERT post
                    SET
                        name        = ?,
                        description = ?,
                        location    = ?,
                        is_active   = ?,
                        is_promoted = ?,
                        category_id = ?;
                    `,
                    [
                        data.name,
                        data.description,
                        data.location,
                        data.isActive ? 1 : 0,
                        data.isPromoted ? 1 : 0,
                        data.categoryId,
                    ]
                )
                .then(async (res: any) => {
                    const newPostId: number = +(res[0]?.insertId);

                    const promises = [];

                    for (const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET post_id = ?, image_path = ?;`,
                                [ newPostId, uploadedPhoto.imagePath, ]
                            ),
                        );
                    }

                    Promise.all(promises)
                    .then(async () => {
                        await this.db.commit();

                        resolve(await this.services.postService.getById(
                            newPostId,
                            {
                                loadCategory: true,
                                loadUser: true,
                                loadPhotos: true,
                                // loadPrices: true,
                            }
                        ));
                    })
                    .catch(async error => {
                        await this.db.rollback();
    
                        resolve({
                            errorCode: error?.errno,
                            errorMessage: error?.sqlMessage
                        });
                    });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
            });
        });
    }


    //Edit
    private editPost(postId: number, data: IEditPost) {
        return this.db.execute(
            `UPDATE
                post
            SET
                name        = ?,
                description = ?,
                location    = ?,
                is_active   = ?,
                is_promoted = ?,
                category_id = ?;
            WHERE
                post_id = ?;`,
            [
                data.name,
                data.description,
                data.location,
                data.isActive ? 1 : 0,
                data.isPromoted ? 1 : 0,
                postId,
            ]
        );
    }

    public async edit(postId: number, data: IEditPost): Promise<PostModel|null|IErrorResponse> {
        return new Promise<PostModel|null|IErrorResponse>(async resolve => {
            const currentPost = await this.getById(postId, {});

            if (currentPost === null) {
                return resolve(null);
            }

            const rollbackAndResolve = async (error) => {
                await this.db.rollback();
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            }

            this.db.beginTransaction()
                .then(() => {
                    this.editPost(postId, data)
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: "Part post: " + error?.sqlMessage,
                        });
                    });
                })
                .then(async () => {
                    this.db.commit()
                    .catch(error => {
                        rollbackAndResolve({
                            errno: error?.errno,
                            sqlMessage: `Part save changes: ${error?.sqlMessage}`,
                        });
                    });
                })
                .then(async () => {
                    resolve(await this.getById(postId, {
                        loadCategory: true,
                        loadPhotos: true,
                    }));
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(postId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse>(async resolve => {
            const currentPost = await this.getById(postId, {
                loadPhotos: true,
            });

            if (currentPost === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(async () => {
                    const filesToDelete = await this.deletePostPhotoRecords(postId);
                    if (filesToDelete.length !== 0) return filesToDelete;
                    throw { errno: -1005, sqlMessage: "Could not delete post photo records.", };
                })
                .then(async (filesToDelete) => {
                    if (await this.deletePostRecord(postId)) return filesToDelete;
                    throw { errno: -1006, sqlMessage: "Could not delete the post records.", };
                })
                .then(async (filesToDelete) => {
                    await this.db.commit();
                    return filesToDelete;
                })
                .then((filesToDelete) => {
                    this.deletePostPhotosAndResizedVersion(filesToDelete);
                })
                .then(() => {
                    resolve({
                        errorCode: 0,
                        errorMessage: "Post deleted!",
                    });
                })
                .catch(async error => {
                    await this.db.rollback();
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    private async deletePostPhotoRecords(postId: number): Promise<string[]> {
        return new Promise<string[]>(async resolve => {
            const [ rows ] = await this.db.execute(
                `SELECT image_path FROM photo WHERE post_id = ?;`,
                [ postId ]
            );

            if (!Array.isArray(rows) || rows.length === 0) return resolve([]);

            const filesToDelete = rows.map(row => row?.image_path);

            this.db.execute(
                `DELETE FROM photo WHERE post_id = ?;`,
                [ postId ]
            )
            .then(() => resolve(filesToDelete))
            .catch(() => resolve([]))

            resolve(filesToDelete);
        });
    }

    private async deletePostRecord(postId: number): Promise<boolean> {
        return new Promise<boolean>(async resolve => {
            this.db.execute(
                `DELETE FROM post WHERE post_id = ?;`,
                [ postId ]
            )
            .then(() => resolve(true))
            .catch(() => resolve(false));
        });
    }

    private deletePostPhotosAndResizedVersion(filesToDelete: string[]) {
        try {
            for (const fileToDelete of filesToDelete) {
                fs.unlinkSync(fileToDelete);

                const pathParts = path.parse(fileToDelete);

                const directory = pathParts.dir;
                const filename  = pathParts.name;
                const extension = pathParts.ext;

                for (const resizeSpecification of Config.fileUpload.photos.resizes) {
                    const resizedImagePath = directory + "/" +
                                             filename +
                                             resizeSpecification.sufix +
                                             extension;

                    fs.unlinkSync(resizedImagePath);
                }
            }
        } catch (e) { }
    }

    public async deletePostPhoto(postId: number, photoId: number): Promise<IErrorResponse|null> {
        return new Promise<IErrorResponse|null>(async resolve => {
            const post = await this.getById(postId, {
                loadPhotos: true,
            });

            if (post === null) {
                return resolve(null);
            }

            const filteredPhotos = (post as PostModel).photos.filter(p => p.photoId === photoId);

            if (filteredPhotos.length === 0) {
                return resolve(null);
            }

            const photo = filteredPhotos[0];

            this.db.execute(
                `DELETE FROM photo WHERE photo_id = ?;`,
                [ photo.photoId ]
            )
            .then(() => {
                this.deletePostPhotosAndResizedVersion([
                    photo.imagePath
                ]);

                resolve({
                    errorCode: 0,
                    errorMessage: "Photo deleted.",
                });
            })
            .catch(error => resolve({
                errorCode: error?.errno,
                errorMessage: error?.sqlMessage
            }))
        });
    }

    public async addPostPhotos(postId: number, uploadedPhotos: IUploadedPhoto[]): Promise<PostModel|IErrorResponse|null> {
        return new Promise<PostModel|IErrorResponse|null>(async resolve => {
            const post = await this.getById(postId, {
                loadPhotos: true,
            });

            if (post === null) {
                return resolve(null);
            }

            this.db.beginTransaction()
                .then(() => {
                    const promises = [];

                    for (const uploadedPhoto of uploadedPhotos) {
                        promises.push(
                            this.db.execute(
                                `INSERT photo SET post_id = ?, image_path = ?;`,
                                [ postId, uploadedPhoto.imagePath, ]
                            ),
                        );
                    }

                    Promise.all(promises)
                        .then(async () => {
                            await this.db.commit();

                            resolve(await this.services.postService.getById(
                                postId,
                                {
                                    loadCategory: true,
                                    loadPhotos: true,
                                    // loadPrices: true,
                                }
                            ));
                        })
                        .catch(async error => {
                            await this.db.rollback();

                            resolve({
                                errorCode: error?.errno,
                                errorMessage: error?.sqlMessage
                            });
                        });
                })
                .catch(async error => {
                    await this.db.rollback();

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        })
    }

}

export default PostService;