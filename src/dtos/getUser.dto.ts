import z from "zod"
import { UserModel } from "../models/User"

export interface GetUsersInputDTO {
    q: string,
    token: string
}


export type GetUsersOutputDTO = UserModel[] | UserModel

export const GetUsersSchema = z.object({
    q: z.string({ invalid_type_error: "id deve ser string" }).min(1).optional(),
    token: z.string({ required_error: "Token deve ser passado.", invalid_type_error: "Formato de token inválido." }),
}).transform(data => data as GetUsersInputDTO)