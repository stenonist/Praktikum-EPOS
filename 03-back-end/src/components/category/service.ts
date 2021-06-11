import CategoryModel from "./model";
import IModelAdapterOptions from '../../common/IModelAdapterOptions.interface';
import BaseService from "../../common/BaseService";
import IErrorResponse from '../../common/IErrorResponse.interface';
import { IAddCategory } from './dto/AddCategory';
import { IEditCategory } from './dto/EditCategory';

class CategoryModelAdapterOptions implements IModelAdapterOptions{
    loadParentCategory: boolean = false;
    loadSubcategories: boolean = false;
    loadFeatures: boolean = false;
}
class CategoryService extends BaseService<CategoryModel> {
    protected async adaptModel(
        row: any,
        options: Partial<CategoryModelAdapterOptions> = {}
    ): Promise<CategoryModel> {
        const item: CategoryModel = new CategoryModel();

        item.categoryId = +(row?.category_id);
        item.name = row?.name;
        item.parentCategoryId = row?.parent_categoru_id;
        item.isVisible = (row?.isVisible === 1 ? true: false);

        if (options.loadParentCategory && item.parentCategoryId !== null) {
            const data = await this.getById(item.parentCategoryId);

            if (data instanceof CategoryModel) {
                item.parentCategory = data;
            }
        }

        if (options.loadSubcategories) {
            const data = await this.getAllByParentCategoryId(
                item.categoryId,
                {
                    loadSubcategories: true,
                }
            );

            if (Array.isArray(data)) {
                item.subcategories = data;
            }
        }

        return item;
    }

    public async getAll(
        options: Partial<CategoryModelAdapterOptions> = {},
    ): Promise<CategoryModel[]|IErrorResponse>{
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category',
            'parent_category_id',
            null,
            options,
        );
    }

    public async getAllByParentCategoryId(
        parentCategoryId: number,
        options: Partial<CategoryModelAdapterOptions> = {},
    ): Promise<CategoryModel[]|IErrorResponse>{
        return await this.getAllByFieldNameFromTable<CategoryModelAdapterOptions>(
            'category',
            'parent_categoru_id',
            parentCategoryId,
            options,
        );
    }

    public async getById(
        categoryId:number,
        options: Partial<CategoryModelAdapterOptions> = {},
    ): Promise<CategoryModel|null|IErrorResponse>{
        return await this.getByIdFromTable<CategoryModelAdapterOptions>(
            'category',
            categoryId,
            options,
        );
    }
    
    public async add(data: IAddCategory): Promise<CategoryModel|IErrorResponse>{
        return new Promise<CategoryModel|IErrorResponse>(async resolve =>{
            const sql = `
                INSERT
                    category
                SET
                    name = ?,
                    parent_category_id = ?;
            `;
            this.db.execute(sql, [data.name,data.parentCategoryId??null])
            .then(async result =>{
                const inserInfo:any = result[0];

                const newCategoryId: number = +(inserInfo?.inserId);
                resolve(await this.getById(newCategoryId));
            })
            .catch(error =>{
                resolve({
                    errorCode: error?.errno,
                    errorMessage: error?.sqlMessage
                });
            });
        });
    }

    public async edit(
        categoryId: number,
        data: IEditCategory,
        options: Partial<CategoryModelAdapterOptions> = { },
    ): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    category
                SET
                    name = ?
                WHERE
                    category_id = ?;`;

            this.db.execute(sql, [ data.name, categoryId ])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async disable(
        categoryId: number,
        options: Partial<CategoryModelAdapterOptions> = { },
    ): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    category
                SET
                    isVisible = 0
                WHERE
                    category_id = ?;`;

            this.db.execute(sql, [ categoryId ])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }
    public async enable(
        categoryId: number,
        options: Partial<CategoryModelAdapterOptions> = { },
    ): Promise<CategoryModel|IErrorResponse|null> {
        const result = await this.getById(categoryId);

        if (result === null) {
            return null;
        }

        if (!(result instanceof CategoryModel)) {
            return result;
        }

        return new Promise<CategoryModel|IErrorResponse>(async resolve => {
            const sql = `
                UPDATE
                    category
                SET
                    isVisible = 1
                WHERE
                    category_id = ?;`;

            this.db.execute(sql, [ categoryId ])
                .then(async result => {
                    resolve(await this.getById(categoryId, options));
                })
                .catch(error => {
                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                });
        });
    }

    public async delete(categoryId: number): Promise<IErrorResponse> {
        return new Promise<IErrorResponse>(resolve => {
            const sql = "DELETE FROM category WHERE category_id = ?;";
            this.db.execute(sql, [categoryId])
                .then(async result => {
                    const deleteInfo: any = result[0];
                    const deletedRowCount: number = +(deleteInfo?.affectedRows);

                    if (deletedRowCount === 1) {
                        resolve({
                            errorCode: 0,
                            errorMessage: "One record deleted."
                        });
                    } else {
                        resolve({
                            errorCode: -1,
                            errorMessage: "This record could not be deleted because it does not exist."
                        });
                    }
                })
                .catch(error => {
                    if (error?.errno === 1451) {
                        resolve({
                            errorCode: -2,
                            errorMessage: "This record could not be deleted beucase it has subcategories."
                        });
                        return;
                    }

                    resolve({
                        errorCode: error?.errno,
                        errorMessage: error?.sqlMessage
                    });
                })
        });
    }
}

export default CategoryService