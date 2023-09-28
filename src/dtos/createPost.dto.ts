import z from "zod"

export interface CreatePostInputDTO {
    content: string,
    token: string
}

export interface CreatePostOutputDTO {
    id: string,
    content: string,
    comments: number,
    likes: number,
    dislikes: number,
    createdAt: string,
    updatedAt: string,
    creator: {
        id: string,
        name: string
    }
}

export interface CreatorInputDTO {
    id: string,
    name: string
}
export interface CreatorOutputDTO {
    message: string
}

export const CreatorSchema = z.object({
    id: z.string(),
    name: z.string()
}).transform(data => data as CreatorInputDTO)

export const CreatePostSchema = z.object({
    content: z.string({ required_error: "O conteúdo não pode ser vazio", invalid_type_error: "Espera uma string." }).min(1),
    token: z.string({ required_error: "A JWT Token is expected on authorization headers.", invalid_type_error: "Formato de autorização inválido." })
}).transform(data => data as CreatePostInputDTO)