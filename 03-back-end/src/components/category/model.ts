class CategoryModel {
    categoryId: number;
    name: string;
    imagePath: string;
    parentCategoryId: number|null = null;
    parentcategory: CategoryModel | null = null;
    subcategories: CategoryModel[] = [];
}

export default CategoryModel;