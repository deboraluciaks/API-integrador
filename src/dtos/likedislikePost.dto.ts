import z from "zod"

export interface LikeDislikeInputDTO {
    token: string,
    postId: string,
    like: boolean
}

export type LikeDislikeOutputDTO = string | undefined


export const LikeDislikeSchema = z.object({
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Formato de autorização inválido." }).min(1),
    postId: z.string({ required_error: "O post id é esperado nos params", invalid_type_error: "Post id deve ser uma string." }).min(1),
    like: z.boolean({ required_error: "Um valor boleano é esperado onde: TRUE é like e FALE é deslike no body.", invalid_type_error: "AUm valor boleano é esperado." })
}).transform(data => data as LikeDislikeInputDTO)