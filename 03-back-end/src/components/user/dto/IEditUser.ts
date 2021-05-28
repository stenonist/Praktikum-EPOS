import Ajv from "ajv";

interface IEditUser {
    email: string;
    password: string;
    forename: string;
    surname: string;
    phone: string;
    address: string;
    isActive: boolean;
}

const ajv = new Ajv();

const IEditUserValidator = ajv.compile({
    type: "object",
    properties: {
        email: {
            type: "string",
            minLength: 8,
            maxLength: 255,
        },
        password: {
            type: "string",
            minLength: 6,
            maxLength: 255,
        },
        forename: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        surname: {
            type: "string",
            minLength: 2,
            maxLength: 64,
        },
        phone: {
            type: "string",
            minLength: 5,
            maxLength: 24,
        },
        address: {
            type: "string",
            minLength: 10,
            maxLength: 64 * 1024,
        },
        isActive: {
            type: "boolean",
        }
    },
    required: [
        "email",
        "password",
        "forename",
        "surname",
        "phoneNumber",
        "postalAddress",
        "isActive",
    ],
    additionalProperties: false,
});

export { IEditUser };
export { IEditUserValidator };
