import { PostBusiness } from "../src/business/PostBusiness"
import { BadRequestError } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { LikesDatabaseMock } from "./mocks/LikeDatabaseMock"
import { PostsDatabaseMock } from "./mocks/PostDatabaseMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"
import { CreatePostSchema } from "../src/dtos/createPost.dto"

describe('Testing Post Business', () => {

    const postBusiness = new PostBusiness(
        new PostsDatabaseMock,
        new IdGeneratorMock,
        new TokenManagerMock,
        new UserDatabaseMock,
        new LikesDatabaseMock
    )

    test('Shoud return the post created.', async () => {
        const input = CreatePostSchema.parse({
            content: "Content mock first post.",
            token: "token-mock-user"
        })

        const output = await postBusiness.createPost(input)

        expect(output).toEqual({
            id: "id-mock",
            content: "Content mock first post.",
            comments: Number(0),
            likes: Number(0),
            dislikes: Number(0),
            createdAt: expect.any(String),
            updatedAt: expect.any(String),
            creator: {
                id: "id-mock-user",
                name: "Test User"
            }
        })
    })


    test('Testing Token BadRequestError', async () => {
        expect.assertions(2)
        try {
            const input = CreatePostSchema.parse({
                content: "Content mock first post.",
                token: "token-mock-error"
            })

            await postBusiness.createPost(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token não encontrado.")
            }
        }
    })

    test('Testing Token NotFound', async () => {
        expect.assertions(2)
        try {
            const input = CreatePostSchema.parse({
                content: "Content mock first post.",
                token: "token-mock-test-error"
            })

            await postBusiness.createPost(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado, tente novamente.")
            }
        }
    })
})