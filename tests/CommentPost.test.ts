import { PostBusiness } from "../src/business/PostBusiness"
import { CommentPostSchema } from "../src/dtos/commentPost.dto"
import { BadRequestError } from "../src/errors/BadRequestError"
import { NotFoundError } from "../src/errors/NotFoundError"
import { LikesDatabaseMock } from "./mocks/LikeDatabaseMock"
import { PostsDatabaseMock } from "./mocks/PostDatabaseMock"
import { TokenManagerMock } from "./mocks/TokenManagerMock"
import { UserDatabaseMock } from "./mocks/UserDatabaseMock"
import { IdGeneratorMock } from "./mocks/idGeneratorMock"

describe('Testing Post Business', () => {

    const postBusiness = new PostBusiness(
        new PostsDatabaseMock,
        new IdGeneratorMock,
        new TokenManagerMock,
        new UserDatabaseMock,
        new LikesDatabaseMock
    )

    test('Test comment', async () => {
        const input = CommentPostSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            comment: "Test comment 01"
        })
        const output = await postBusiness.commentPost(input)

        expect(output).toEqual({ message: "comentou neste post" })
    })


    test('Test NotFoundError USER.', async () => {
        expect.assertions(2)
        try {
            const input = CommentPostSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post02",
                comment: "Test comment 01"
            })

            await postBusiness.commentPost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
    })

    test('Test NotFoundError POST.', async () => {
        expect.assertions(2)
        try {
            const input = CommentPostSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post04",
                comment: "Test comment 01"
            })

            await postBusiness.commentPost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post não encontrado.")
            }
        }
    })

    test('Test BadRequest TOKEN.', async () => {
        expect.assertions(2)
        try {
            const input = CommentPostSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post01",
                comment: "Test comment 01"
            })

            await postBusiness.commentPost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })
})