import z from "zod"

export interface DeletePostInputDTO {
    token: string,
    postId: string
}

export interface DeletePostOutputDTO {
    message: string
}

export const DeletePostSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Formato de autorização inválido." }).min(5),
    postId: z.string({ required_error: "O post id é esperado nos params.", invalid_type_error: "Post id deve ser uma string." }).min(1)

}).transform(data => data as DeletePostInputDTO)