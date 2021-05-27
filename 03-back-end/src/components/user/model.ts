class UserModel {
    email: string;
    forename: string;
    surname: string;
    phone: string;
    address: string;
    userType: ("regular"|"admin");
    userStatus: ("active"|"banned"|"deleted");
}

export default UserModel;