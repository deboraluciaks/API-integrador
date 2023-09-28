import { USER_ROLES, UserDB } from "../../src/models/User"
import { BaseDatabase } from "../../src/database/BaseDatabase";


const usersMock: UserDB[] = [{
    id: "id-mock-admin",
    name: "Test Admin",
    email: "testadmin@email.com",
    password: "hash-mock-admin",
    role: USER_ROLES.ADMIN,
    created_at: new Date().toISOString()
}, {
    id: "id-mock-user",
    name: "Test User",
    email: "testuser@email.com",
    password: "hash-mock-user",
    role: USER_ROLES.NORMAL,
    created_at: new Date().toISOString()
}]

export class UserDatabaseMock extends BaseDatabase {
    public static USERS_TABLE = "users"

    public async getUsers(id?: string): Promise<UserDB[]> {
        let result: UserDB[]
        if (id) {
            result = usersMock.filter((user) => user.id === id)
        } else {
            result = usersMock
        }
        return result
    }

    public async getUsersById(id: string): Promise<UserDB[]> {
        const result = usersMock.filter((user) => user.id === id)
        return result

    }

    public async getUserByEmail(email: string): Promise<UserDB> {
        const [result] = usersMock.filter((user) => user.email === email)
        return result
    }

    public async createUser(userDB: UserDB): Promise<void> {

    }

    public async editUser(idToEdit: string, userDB: UserDB): Promise<void> {
    }

    public async deleteUser(email: string): Promise<void> {
    }
}