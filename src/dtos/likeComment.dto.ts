import z from "zod"

export interface LikeCommentInputDTO {
    token: string,
    postId: string,
    commentId: string,
    like: boolean
}

export type LikeCommentOutputDTO = string | undefined

export const LikeCommentInputSchema = z.object({
    token: z.string({ required_error: "Token necessário.", invalid_type_error: "Formato de token inválido." }),
    postId: z.string({ required_error: "Post ID necessário.", invalid_type_error: "Formato de post id inválido." }),
    commentId: z.string({ required_error: "Comment ID necessário.", invalid_type_error: "Formato de comment id inválido." }),
    like: z.boolean({ required_error: "Um valor boleano é necessário.", invalid_type_error: "Formato inválido, deve ser um valor boleano." })
}).transform(data => data as LikeCommentInputDTO)