import Ajv from "ajv";

interface IEditPost{
    name: string;
    description: string;
    location: string;
    isActive: boolean;
    isPromoted: boolean;
}

const ajv = new Ajv();

const IEditPostValidator = ajv.compile({
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
            minLenght: 2,
            maxLenght: 64,
        },
        isActive: {
            type: "boolean",
        },
        isPromoted: {
            type: "boolean",
        },
    },
    required: [
        "name",
        "description",
        "location",
        "isActive",
        "isPromoted",
    ],
    additionalProperties: false,
});

export { IEditPost };
export { IEditPostValidator };
