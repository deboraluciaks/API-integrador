import { UserBusiness } from "../src/business/UserBusiness"
import { GetUsersSchema } from "../src/dtos/getUser.dto"
import { BadRequestError } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { USER_ROLES } from "../src/models/User"
import { HashManagerMock } from "./mocks/HashManagerMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"

describe("Testing Get users", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )


    test("Should return an user array.", async () => {
        const input = GetUsersSchema.parse({
            token: "token-mock-admin"
        })

        const output = await userBusiness.getUsers(input)
        expect(output).toHaveLength(2)
        expect(output).toEqual([{
            id: "id-mock-admin",
            name: "Test Admin",
            email: "testadmin@email.com",
            role: USER_ROLES.ADMIN,
            createdAt: expect.any(String)
        }, {
            id: "id-mock-user",
            name: "Test User",
            email: "testuser@email.com",
            role: USER_ROLES.NORMAL,
            createdAt: expect.any(String)
        },
        ])
    })

    test("Should return an user array.", async () => {
        const input = GetUsersSchema.parse({
            q: "id-mock-user",
            token: "token-mock-admin"
        })

        const output = await userBusiness.getUsers(input)
        expect(output).toEqual({
            id: "id-mock-user",
            name: "Test User",
            email: "testuser@email.com",
            role: USER_ROLES.NORMAL,
            createdAt: expect.any(String)
        }
        )
    })

    test('Should return an BadRequest.', async () => {
        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                token: "token-mock-error"
            })
            await userBusiness.getUsers(input)
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })

    test('Should return a NotFoundError', async () => {
        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                q: "id-mock-error",
                token: "token-mock-admin"
            })

            await userBusiness.getUsers(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
    })

    test('Should return a BadRequest of Invalid Token.', async () => {

        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                token: "token-mock-error"
            })
            await userBusiness.getUsers(input)
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })

    test('Should return a BadRequest of Admin permissions.', async () => {

        expect.assertions(2)
        try {
            const input = GetUsersSchema.parse({
                token: "token-mock-user"
            })
            await userBusiness.getUsers(input)
        } catch (error: any) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Apenas adms podem utilizar esta função.")
            }
        }
    })

})