import * as jwt from "jsonwebtoken"

export const generateAccessToken = (id: string, type: string) => {
    return jwt.sign({id, type}, process.env.ACCESS_SECRET_KEY as string, {
        expiresIn: process.env.ACCESS_EXPIRING_TIME
    } as any)
}

export const generateRefreshToken = (id: string, type: string) => {
    return jwt.sign({id, type}, process.env.REFRESH_SECRET_KEY as string, {
        expiresIn: process.env.REFRESH_EXPIRING_TIME
    } as any)
}

export const decodeAccessToken = (token: string) => {
    return jwt.verify(token, process.env.ACCESS_SECRET_KEY as string)
}

export const decodeRefreshToken = (token: string) => {
    return jwt.verify(token, process.env.REFRESH_SECRET_KEY as string)
}