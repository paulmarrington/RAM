import * as jwt from "jsonwebtoken";
import {Request, Response, NextFunction} from "express";
import * as cApi from "../../commons/RamAPI";
import * as sApi from "./ram/ServerAPI";

export function continueOnlyIfJWTisValid(jwtSecretKey: string, createIfNotExist: boolean = false) {
    return (req: Request, res: Response, next: NextFunction) => {
        let tokenHeaderExists = req.headers["authorization"] && req.headers["authorization"].split(" ")[0] === "Bearer";
        let token = tokenHeaderExists && jwt.verify(req.headers["authorization"].split(" ")[1], jwtSecretKey);
        if (token) {
            req.user = token;
            next();
        } else {
            if (createIfNotExist) {
                req.user = signToken(jwtSecretKey, 5)({ partyId: "123", navPathIds: [] });
                next();
            } else
                res.status(401).send(new cApi.ErrorResponse(404, "Invalid security token."));
        }
    }
}

export function signToken(secret: string, jwtExpiryInMinutes: number) {
    return (secToken: sApi.SecurityToken) => jwt.sign(secToken, secret, {
        expiresInMinutes: jwtExpiryInMinutes
    });
}




