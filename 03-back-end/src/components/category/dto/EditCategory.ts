import Ajv from "ajv";

interface IEditCategory {
    name: string;
    imagePath: string;
}

const ajv = new Ajv();

const IEditCategoryValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        parentCategoryId: {
            type: [ "integer", "null" ],
            minimum: 1,
        },
        imagePath: {
            type: "string",
            maxLength: 255,
            pattern: "\.(png|jpg)$",
        },
    },
    required: [
        "name",
    ],
    additionalProperties: false,
});

export { IEditCategory };
export { IEditCategoryValidator };
