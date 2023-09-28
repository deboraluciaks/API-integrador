import z from "zod"

export interface LoginInputDTO {
    email: string,
    password: string
}

export interface LoginOutputDTO {
    message: string,
    token: string
}

export const LoginSchema = z.object({
    email: z.string({ required_error: "Digite um e-mail.", invalid_type_error: "Digite um e-mail válido."}).email(),
    password: z.string({ required_error: "Digite sua senha." }).min(4, "Digite no mínimo 4 caracteres")
}).transform(data => data as LoginInputDTO)