import IModel from "../../common/IModel.interface";

export default class UserModel implements IModel {
    userId: number;
    createdAt: Date;
    email: string;
    passwordHash: string;
    forename: string;
    surname: string;
    phone: string;
    address: string;
    isActive: boolean;
}
