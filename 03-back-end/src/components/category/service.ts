import CategoryModel from "./model";

class CategoryService{
    public async getAll(): Promise<CategoryModel[]>{
        const lista: CategoryModel[] = [];

        lista.push({
            categoryId: 1,
            name: "A",
            imagePath: "Neki path",
            parentCategoryId:null,
            parentcategory: null,
            subcategories: [],
        });
        return lista;
    }
}

export default CategoryService