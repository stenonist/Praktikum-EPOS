class CategoryModel {
    categoryId: number;
    name: string;
    parentCategoryId: number|null = null;
    parentCategory: CategoryModel | null = null;
    subcategories: CategoryModel[] = [];
    isVisible?:boolean;
}

export default CategoryModel;