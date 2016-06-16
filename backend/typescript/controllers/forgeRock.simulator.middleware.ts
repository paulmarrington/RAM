import {logger} from '../logger';
import * as colors from 'colors';
import {Request, Response} from 'express';
import {Headers} from './headers';
import {IIdentity, IdentityModel} from '../models/identity.model';

class ForgeRockSimulator {

    public prepareRequest():(req:Request, res:Response, next:() => void) => void {
        const self = this;
        return (req:Request, res:Response, next:() => void) => {
            const credentialsFromAuthenticationSimulator = req.body.credentials;
            const authTokenEncodedFromCookie = req.cookies[Headers.AuthToken];
            if (credentialsFromAuthenticationSimulator) {
                IdentityModel.findByIdValue(credentialsFromAuthenticationSimulator)
                    .then(self.resolve(req, res, next), self.reject(res, next));
            } else if (authTokenEncodedFromCookie) {
                const authToken = new Buffer(authTokenEncodedFromCookie, 'base64').toString('ascii');
                const idValue = self.getIdentityIdValueFromAuthToken(authToken);
                IdentityModel.findByIdValue(idValue)
                    .then(self.resolve(req, res, next), self.reject(res, next));
            } else {
                next();
            }
        };
    }

    private resolve(req:Request, res:Response, next:() => void) {
        return (identity?:IIdentity) => {
            if (identity) {
                logger.info(colors.red(`Setting ${Headers.IdentityIdValue}: ${identity.idValue}`));
                res.locals[Headers.IdentityIdValue] = identity.idValue;
                req.headers[Headers.IdentityIdValue] = identity.idValue;
                res.locals[Headers.IdentityRawIdValue] = identity.rawIdValue;
                req.headers[Headers.IdentityRawIdValue] = identity.rawIdValue;
            } else {
                const idValue = req.get(Headers.IdentityIdValue);
                const rawIdValue = req.get(Headers.IdentityRawIdValue);
                if (idValue && rawIdValue) {
                    logger.info(colors.red(`Setting ${Headers.IdentityIdValue}: ${idValue}`));
                    res.locals[Headers.IdentityIdValue] = idValue;
                    req.headers[Headers.IdentityIdValue] = idValue;
                    res.locals[Headers.IdentityRawIdValue] = rawIdValue;
                    req.headers[Headers.IdentityRawIdValue] = rawIdValue;
                }
            }
            next();
        };
    }

    private reject(res:Response, next:() => void) {
        return ():void => {
            logger.info('Unable to look up identity!');
            res.status(401);
            res.send({});
        };
    }

    private getIdentityIdValueFromAuthToken(authToken:string):string {
        return authToken;
    }

}

export const forgeRockSimulator = new ForgeRockSimulator();
