import { BaseDatabase } from "../../src/database/BaseDatabase";
const likesMock = [{
    user_id: "id-mock-user",
    post_id: "id-mock-post02",
    like: 0
}
    ,
{
    user_id: "id-mock-admin",
    post_id: "id-mock-post01",
    like: 1
}
]
export class LikesDatabaseMock extends BaseDatabase {
    public static LIKES_TABLE = "likes_dislikes"

    public async getLikes(input: any): Promise<any> {
        return likesMock.filter((like) => like.post_id === input.post_id && like.user_id === input.user_id)
    }

    public async postLikes(input: string): Promise<any> {
        return likesMock.map((like) => like.like === 1 && like.post_id === input).length
    }
    public async postDislikes(input: string): Promise<any> {
        return likesMock.map((like) => like.like === 0 && like.post_id === input).length
    }

    public async likeDislike(input: any): Promise<any> {
    }

    public async editLike(input: any): Promise<any> {
    }

    public async deleteLike(input: any): Promise<any> {
    }


}