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

    test('Return successfully', async () => { 
        const input = {
            token: "token-mock-user",
            postId: "id-mock-post02"
        }
        
        const output = await postBusiness.getLikes(input)
        
        expect(output).toEqual([{
            user_id: "id-mock-user",
            post_id: "id-mock-post02",
            like: 0
        }])
     })
     
     test('Return BadRequest due wrong token.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-error",
                postId: "id-mock-post02"
            }
            await postBusiness.getLikes(input)
        } catch (error) {
            if (error instanceof BadRequestError) {
                expect(error.statusCode).toBe(400)
                expect(error.message).toBe("Invalid token.")
            }
        }
     })
     
     test('Return NotFoundError due user not found.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-test-error",
                postId: "id-mock-post02"
            }
            await postBusiness.getLikes(input)
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("User não encontrado.")
            }
        }
     })
     
     test('Return NotFoundError due post not found.', async () => { 
        expect.assertions(2)
        try {
            const input= {
                token: "token-mock-user",
                postId: "id-mock-post-error"
            }
            await postBusiness.getLikes(input)
            
        } catch (error) {
            if (error instanceof NotFoundError) {
                expect(error.statusCode).toBe(404)
                expect(error.message).toBe("Post não encontrado.")
            }
        }
     })
    
})