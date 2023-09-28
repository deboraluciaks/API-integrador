import { PostBusiness } from "../src/business/PostBusiness"
import { LikeCommentInputSchema } from "../src/dtos/likeComment.dto"
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

    test('Must like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: true
        })

        const output = await postBusiness.likeComment(input)

        expect(output).toBe("Você deu like no comentário.")
    })

    test('Must like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: false
        })

        const output = await postBusiness.likeComment(input)

        expect(output).toBe("Você deu dislike no comentário.")
    })

    test('Testing BadRequest Invalid Token.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01",
                like: true
            })

            await postBusiness.likeComment(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })


    test('Testing NotFoundError User not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01",
                like: true
            })


            await postBusiness.likeComment(input)


        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
    })


    test('Testing NotFoundError Post not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-error",
                commentId: "id-mock-comment01",
                like: true
            })


            await postBusiness.likeComment(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post não encontrado.")
            }
        }

    })

    test('Testing NotFoundError Comment not found.', async () => {
        expect.assertions(2)
        try {
            const input = LikeCommentInputSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post02",
                commentId: "id-mock-comment03",
                like: true
            })


            await postBusiness.likeComment(input)


        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Comment não encontrado.")
            }
        }

    })

    test('Testing Like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: true
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("Você deu like no comentário.")

    })


    test('Testing Like a comment.', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01",
            like: false
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("Você retirou seu dislike.")

    })

    test('Testing Remove Dislike..', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment02",
            like: true
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("Você retirou seu like.")

    })
    test('Testing Remove Dislike..', async () => {

        const input = LikeCommentInputSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment02",
            like: false
        })


        const output = await postBusiness.likeComment(input)
        expect(output).toBe("Você deu dislike no comentário.")

    })


})