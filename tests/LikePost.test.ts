import { PostBusiness } from "../src/business/PostBusiness"
import { LikeDislikeSchema } from "../src/dtos/likedislikePost.dto"
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

    test('Test like.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post03",
            like: true
        })

        const output = await postBusiness.likePost(input)

        expect(output).toBe("Você curtiu este post.")
    })

    test('Test dislike.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post03",
            like: false
        })

        const output = await postBusiness.likePost(input)

        expect(output).toBe("Você deu deslike este post.")
    })

    test('Testing Invalid token', async () => {

        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-admin",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }


    })

    test('Testing if changes dislike to like.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post01",
            like: true
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("Você tirou o seu like.")
    })

    test('Testing if changes like to dislike.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-admin",
            postId: "id-mock-post01",
            like: false
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("Voce mudou seu like para dislike.")
    })

    test('Testing if it likes a post.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            like: true
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("Voce mudou seu dislike para like.")
    })
    test('Testing if it dislikes a post.', async () => {
        const input = LikeDislikeSchema.parse({
            token: "token-mock-user",
            postId: "id-mock-post02",
            like: false
        })


        const output = await postBusiness.likePost(input)

        expect(output).toBe("Você tirou o seu dislike.")
    })

    test('Test BadRequest with invalid token.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-error",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
    })
    test('Test NotFoundError for user..', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-test-error",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
    })

    test('Test NotFoundError for post.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post04",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post não encontrado.")
            }
        }
    })

    test('Test if creator is trying to like them own post.', async () => {
        expect.assertions(2)
        try {
            const input = LikeDislikeSchema.parse({
                token: "token-mock-user",
                postId: "id-mock-post01",
                like: true
            })

            await postBusiness.likePost(input)

        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Criadores não podem curtir ou dar deslike em seu próprio post.")
            }
        }
    })


})