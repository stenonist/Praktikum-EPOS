class UserModel {
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

export default UserModel;