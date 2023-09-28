import z from "zod"

export interface GetPostInfoInputDTO {
    token: string,
    id: string
}

export interface GetPostInfoOuputDTO {
    postId: string,
    postCreatorId: string,
    postCreatorName: string,
    postContent: string,
    postLikes: number,
    postCreatedAt: string,
    postUpdatedAt: string,
    postComments: CommentDTO[]
}
export interface CommentDTO {
    commentId: string,
    commentUserId: string,
    commentUserName: string,
    commentContent: string,
    commentLikes: number,
    commentCreatedAt: string,
    commentUpdatedAt: string,
}

export const GetPostInfoSchema = z.object({
    token: z.string({ required_error: "Faltando o token.", invalid_type_error: "Formato de token inválido." }),
    id: z.string({ required_error: "Faltando o post id.", invalid_type_error: "Formato de post id invalido." })
}).transform(data => data as GetPostInfoInputDTO)