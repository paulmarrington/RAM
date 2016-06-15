import {logger} from '../logger';
import * as colors from 'colors';
import {Request, Response} from 'express';
import {Headers} from './headers';
import {IIdentity, IdentityModel} from '../models/identity.model';

class ForgeRockSimulator {

    public prepareRequest():(req:Request, res:Response, next:() => void) => void {
        const self = this;
        return (req:Request, res:Response, next:() => void) => {
            const authTokenEncoded = req.cookies[Headers.AuthToken];
            if (authTokenEncoded) {
                const authToken = new Buffer(authTokenEncoded, 'base64').toString('ascii');
                const idValue = self.getIdentityIdValueFromAuthToken(authToken);
                IdentityModel.findByIdValue(idValue)
                    .then(self.resolve(res, next), self.reject(res, next));
            } else {
                next();
            }
        };
    }

    private resolve(res:Response, next:() => void) {
        return (identity?:IIdentity) => {
            if (identity) {
                logger.info(colors.red(`Setting ${Headers.IdentityIdValue}: ${identity.idValue}`));
                res.locals[Headers.IdentityIdValue] = identity.idValue;
            }
            next();
            return identity;
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
