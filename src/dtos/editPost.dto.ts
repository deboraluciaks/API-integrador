import z from "zod"

export interface editPostInputDTO {
    token: string,
    postId: string,
    content: string
}

export interface editPostOutputDTO {
    message: string
}

export const EditPostSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Formato de autorização inválido." }).min(1),
    postId: z.string({ required_error: "O post id é esperado nos params.", invalid_type_error: "Post id deve ser uma string." }).min(1),
    content: z.string({ required_error: "um novo conteúdo é esperado.", invalid_type_error: "O conteúdo deve ser uma string." }).min(1)
}).transform(data => data as editPostInputDTO)