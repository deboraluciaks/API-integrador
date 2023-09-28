import { UserBusiness } from "../src/business/UserBusiness"
import { SignupSchema } from "../src/dtos/signup.dto"
import { BadRequestError } from "../src/errors/BadRequestError"
import { USER_ROLES } from "../src/models/User"
import { HashManagerMock } from "../tests/mocks/HashManagerMock"
import { IdGeneratorMock } from "../tests/mocks/idGeneratorMock"
import { TokenManagerMock } from "../tests/mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"

describe("Testando signup", () => {
    const userBusiness = new UserBusiness(
        new UserDatabaseMock(),
        new IdGeneratorMock(),
        new TokenManagerMock(),
        new HashManagerMock()
    )

    test("Should return a token when register.", async () => {
        const input = SignupSchema.parse({
            name: "Novo teste usuário",
            email: "novousuario@email.com",
            password: "novouser123"
        })

        const output = await userBusiness.signUp(input)

        expect(output).toEqual({
            message: "User registrado com sucesso.",
            token: "token-mock"
        })
    })

    test('Should return a BadRequestError for duplicate email in database.', async () => {
        expect.assertions(2)
        try {
            const input = SignupSchema.parse({
                name: "Test Error",
                email: "testuser@email.com",
                password: "emailforerror",
                role: USER_ROLES.NORMAL
            })

            await userBusiness.signUp(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("E-mail já registrado.")
            }
        }

    })
})