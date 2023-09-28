import z from 'zod'

export interface SignupInputDTO {
    name: string,
    email: string,
    password: string
}

export interface SignupOutputDTO {
    message: string,
    token: string
}

export const SignupSchema = z.object({
    name: z.string({ required_error: "Nome é obrigatório."}).min(2),
    email: z.string({ required_error: "Digite um e-mail.", invalid_type_error: "Digite um e-mail válido." }).email(),
    password: z.string({ required_error: "Digite uma senha." }).min(4, "Digite no mínimo 4 caracteres")
}).transform(data => data as SignupInputDTO)