import {logger} from '../logger';
import * as colors from 'colors';
import {Request, Response} from 'express';
import {Headers} from './headers';
import {conf} from '../bootstrap';
import {ErrorResponse} from '../../../commons/RamAPI';
import {IIdentity, IdentityModel} from '../models/identity.model';

class Security {

    public prepareRequest():(req:Request, res:Response, next:() => void) => void {
        return (req:Request, res:Response, next:() => void) => {
            if (conf.devMode) {
                this.prepareRequestForDevelopment(req, res, next);
            } else {
                this.prepareRequestForProduction(req, res, next);
            }
        };
    }

    private prepareRequestForProduction(req:Request, res:Response, next:() => void) {
        for (let key of Object.keys(req.headers)) {
            const keyUpper = key.toUpperCase();
            if (keyUpper.startsWith(Headers.Prefix)) {
                const value = req.headers[key];
                res.locals[keyUpper] = value;
                logger.debug(`${keyUpper}=${value}`);
            }
        }
        next();
    }

    private prepareRequestForDevelopment(req:Request, res:Response, next:() => void) {
        const idValue = res.locals[Headers.IdentityIdValue];
        if (!idValue) {
            next();
        } else {
            IdentityModel.findByIdValue(idValue)
                .then(this.resolveForDevelopment(res, next), this.rejectForDevelopment(res, next));
        }
    }

    private resolveForDevelopment(res:Response, next:() => void) {
        return (identity?:IIdentity) => {
            logger.info('Identity context:', (identity ? colors.magenta(identity.idValue) : colors.red('[not found]')));
            if (identity) {
                res.locals[Headers.Identity] = identity;
                res.locals[Headers.IdentityIdValue] = identity.idValue;
                res.locals[Headers.GivenName] = identity.profile.name.givenName;
                res.locals[Headers.FamilyName] = identity.profile.name.familyName;
                res.locals[Headers.UnstructuredName] = identity.profile.name.unstructuredName;
                for (let sharedSecret of identity.profile.sharedSecrets) {
                    res.locals[`${Headers.Prefix}-${sharedSecret.sharedSecretType.code}`] = sharedSecret.value;
                }
            }
            next();
            return identity;
        };
    }

    private rejectForDevelopment(res:Response, next:() => void) {
        return ():void => {
            logger.error('Unable to look up identity!'.red);
            res.status(401);
            res.send(new ErrorResponse('Unable to look up identity.'));
        };
    }

    public isAuthenticated(req:Request, res:Response, next:() => void) {
        const idValue = res.locals[Headers.IdentityIdValue];
        if (idValue) {
            next();
        } else {
            logger.error('Unable to invoke route requiring authentication'.red);
            res.status(401);
            res.send(new ErrorResponse('Not authenticated.'));
        }
    }
}

export const security = new Security();
