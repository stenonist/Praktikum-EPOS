import Ajv from "ajv";

interface IAddPost{
    name: string;
    description: string;
    location: string;
    categoryId: number;
    isActive: boolean;
    isPromoted: boolean;
    userId: number;
}

interface IUploadedPhoto{
    imagePath: string;
}

const ajv = new Ajv();

const IAddPostValidator = ajv.compile({
    type: "object",
    properties: {
        name: {
            type: "string",
            minLength: 2,
            maxLength: 128,
        },
        description: {
            type: "string",
            minLength: 2,
            maxLength: 64 * 1024,
        },
        location: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        isActive: {
            type: "boolean",
        },
        isPromoted: {
            type: "boolean",
        },
        categoryId: {
            type: "integer",
            minimum: 1,
        },
        userId: {
            type: "integer",
            minimum: 1,
        },
    },
    required: [
        "name",
        "description",
        "location",
        "isActive",
        "isPromoted",
        "categoryId",
        "userId",
    ],
    additionalProperties: false,
});

export { IAddPost };
export { IAddPostValidator };
export { IUploadedPhoto };
