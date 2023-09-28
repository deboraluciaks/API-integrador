import { CommentsDB } from "../../src/models/Comment";
import { PostsDB } from "../../src/models/Post";
import { BaseDatabase } from "../../src/database/BaseDatabase";

const postDBMock = [
    {
        id: "id-mock-post01",
        creator_id: "id-mock-user",
        content: "Content mock first post.",
        comments: 0,
        likes: 0,
        dislikes: 0,
        created_at: String(new Date().toISOString()),
        updated_at: String(new Date().toISOString())
    }
    , {
        id: "id-mock-post02",
        creator_id: "id-mock-admin",
        content: "Content mock second post.",
        comments: 2,
        likes: 1,
        dislikes: 0,
        created_at: String(new Date().toISOString()),
        updated_at: String(new Date().toISOString())
    },
    {
        id: "id-mock-post03",
        creator_id: "id-mock-admin",
        content: "Content mock third post.",
        comments: 0,
        likes: 0,
        dislikes: 0,
        created_at: String(new Date().toISOString()),
        updated_at: String(new Date().toISOString())
    }
]

const createPostsMock = [{
    id: "id-mock-post01",
    content: "Content mock first post.",
    comments: Number(0),
    likes: Number(0),
    createdAt: String(new Date().toISOString()),
    uploadedAt: String(new Date().toISOString()),
    creator: {
        id: "id-mock-user",
        name: "Test User."
    }
}, {
    id: "id-mock-post02",
    content: "Content mock second post.",
    comments: Number(1),
    likes: Number(1),
    createdAt: String(new Date().toISOString()),
    uploadedAt: String(new Date().toISOString()),
    creator: {
        id: "id-mock-admin",
        name: "Test Admin"
    }
}]

const commentMock = [{
    id: "id-mock-comment01",
    user_id: "id-mock-user",
    post_id: "id-mock-post02",
    content: "Content mock first comment second post.",
    likes: 0,
    dislikes: 1,
    created_at: String(new Date().toISOString()),
    updated_at: String(new Date().toISOString())
}, {
    id: "id-mock-comment02",
    user_id: "id-mock-user",
    post_id: "id-mock-post02",
    content: "Content mock second comment second post.",
    likes: 0,
    dislikes: 0,
    created_at: String(new Date().toISOString()),
    updated_at: String(new Date().toISOString())
}]

const commentLikeMock = [{
    user_id: "id-mock-admin",
    comment_id: "id-mock-comment01",
    like: 0
},
{
    user_id: "id-mock-admin",
    comment_id: "id-mock-comment02",
    like: 1
}]





export class PostsDatabaseMock extends BaseDatabase {
    public static POSTS_TABLE = "posts"

    public static COMMENTS_TABLE = "comments_posts"

    public static COMMENTS_LIKES = "comments_likes"

    public async getPosts(q?: string): Promise<PostsDB[]> {
        let result: PostsDB[] = []
        if (q) {
            result = postDBMock.filter((post) => { return post.id === q })
        } else {
            for (const post of postDBMock) {
                result.push(post)
            }

        }
        return result

    }

    public async getPostsById(id: string) {
        return postDBMock.filter((post) => post.id === id)
    }

    public async createNewPost(input: PostsDB): Promise<any> {
        return createPostsMock.filter((post) => post.id === input.id)
    }

    public async editPost(input: PostsDB): Promise<void> {

    }

    public async editLikePost(postId: string, newLikes: number, newDislikes: number) {

    }

    public async editDislLikePost(input: any, newValue: number) {

    }

    public async setLike(id: string, likes: number) {

    }

    public async setDislike(id: string, dislikes: number) {

    }

    public async deletePost(input: string): Promise<void> {

    }

    public async commentPost(input: CommentsDB): Promise<void> {

    }

    public async getCommentsByPostId(input: string): Promise<any> {
        return commentMock.filter((comment) => comment.post_id === input)
    }

    public async getCommentsById(input: string): Promise<any> {
        return commentMock.filter((comment) => comment.id === input)
    }

    public async likeComment(input: any): Promise<void> {

    }

    public async getCommentLikesByCommentId(input: any): Promise<any> {
        return commentLikeMock.filter((like) => like.user_id === input.user_id && like.comment_id === input.comment_id)
    }

    public async getCommentLikes(input: string): Promise<any> {

    }

    public async getCommentDislikes(input: string): Promise<any> {

    }

    public async getPost(input: string): Promise<any> {

    }

    public async deleteLike(input: any): Promise<any> {

    }

    public async editCommentPost(commentId: string, newLikes: number, newDislikes: number) {

    }
    public async editCommentLike(input: any): Promise<any> {

    }
}