import z from "zod"

export interface CommentPostInputDTO {
    token: string,
    postId: string,
    comment: string
}

export interface CommentPostOutputDTO {
    message: string
}

export const CommentPostSchema = z.object({
    token: z.string({required_error: "Token é necessário.", invalid_type_error: "Formato de token inválido."}),
    postId: z.string({required_error:"Post id é necessário", invalid_type_error: "Formato de post inválido."}),
    comment: z.string({required_error: "Comment id é necessário", invalid_type_error:"Formato de comentário inválido."})
}).transform(data => data as CommentPostInputDTO)