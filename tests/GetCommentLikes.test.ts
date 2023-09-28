import { PostBusiness } from "../src/business/PostBusiness"
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
  
    test('Should return successfully ', async () => { 
        const input = {
            token: "token-mock-admin",
            postId: "id-mock-post02",
            commentId: "id-mock-comment01"
        }
        
        const output = await postBusiness.getCommentsLikes(input)
        
        expect(output).toEqual([{
            user_id: "id-mock-admin",
            comment_id: "id-mock-comment01",
            like: 0
        }])
     })
     
     test('Return BadRequest due wrong token.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01"
            }
            await postBusiness.getCommentsLikes(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Token inválido.")
            }
        }
     })
     
     test('Return NotFoundError due user not found.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-test-error",
                postId: "id-mock-post02",
                commentId: "id-mock-comment01"
            }
            await postBusiness.getCommentsLikes(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
     })
     
     test('Return NotFoundError due comment not found.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-user",
                postId: "id-mock-post-error",
                commentId: "id-mock-commentError"
            }
            await postBusiness.getCommentsLikes(input)
            
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Comentário não encontrado.")
            }
        }
     })
})