import { CommentsDB } from "../models/Comment";
import { PostsDB } from "../models/Post";
import { BaseDatabase } from "./BaseDatabase";

export class PostsDatabase extends BaseDatabase {
    public static POSTS_TABLE = "posts"
    public static COMMENTS_TABLE = "comments_posts"
    public static COMMENTS_LIKES = "comments_likes"

    public async getPosts(q?: string): Promise<PostsDB[]> {
        let result: PostsDB[] = []

        if (q) {
            result = await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).where({ id: q })
        } else {
            result = await BaseDatabase.connection(PostsDatabase.POSTS_TABLE)
        }

        return result
    }

    public async getPostsById(q: string) {
        return await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).where({ id: q })
    }

    public async createNewPost(input: PostsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).insert(input)
    }

    public async editPost(input: PostsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update(input).where({ id: input.id })
    }

    public async editLikePost(postId: string, newLikes: number, newDislikes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ likes: newLikes, dislikes: newDislikes }).where({ id: postId })
    }

    public async editDislLikePost(input: any, newValue: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ dislikes: newValue }).where({ id: input.id })
    }

    public async setLike(id: string, likes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ likes }).where({ id })
    }

    public async setDislike(id: string, dislikes: number) {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).update({ dislikes }).where({ id })
    }

    public async deletePost(input: string): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.POSTS_TABLE).del().where({ id: input })
    }

    public async commentPost(input: CommentsDB): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).insert(input)
    }

    public async getCommentsByPostId(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ post_id: input })
    }

    public async getCommentsById(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ id: input })
    }


    public async likeComment(input: any): Promise<void> {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).insert(input)
    }

    public async getCommentLikesByCommentId(input: any) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ user_id: input.user_id, comment_id: input.comment_id })
    }

    public async getCommentLikes(input: string) {
        const result = await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 1 }).count()
        return result[0]['count(*)']
    }

    public async getCommentDislikes(input: string) {
        const result = await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).where({ comment_id: input, like: 0 }).count()
        return result[0]['count(*)']
    }

    public async getPost(input: string) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).where({ post_id: input })
    }

    public async deleteLike(input: any) {
        return await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).del().where({ user_id: input.user_id, comment_id: input.comment_id })
    }

    public async editCommentPost(commentId: string, newLikes: number, newDislikes: number) {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_TABLE).update({ likes: newLikes, dislikes: newDislikes }).where({ id: commentId })
    }

    public async editCommentLike(input: any) {
        await BaseDatabase.connection(PostsDatabase.COMMENTS_LIKES).update(input).where({ comment_id: input.comment_id })
    }
}