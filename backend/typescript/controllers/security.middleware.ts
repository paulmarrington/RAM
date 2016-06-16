import {logger} from '../logger';
import * as colors from 'colors';
import {Request, Response} from 'express';
import {Headers} from './headers';
import {conf} from '../bootstrap';
import {ErrorResponse} from '../../../commons/RamAPI';
import {CreateIdentityDTO} from '../../../commons/RamAPI';
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

    private prepareRequestForDevelopment(req:Request, res:Response, next:() => void) {
        const idValue = res.locals[Headers.IdentityIdValue];
        console.log('Processing id:', idValue);
        if (!idValue) {
            next();
        } else {
            IdentityModel.findByIdValue(idValue)
                .then(this.resolveWithIdentity(req, res, next), this.rejectWithNoIdentity(res, next));
        }
    }

    private prepareRequestForProduction(req:Request, res:Response, next:() => void) {
        const idValue = req.headers[Headers.IdentityIdValue];
        if (!idValue) {
            next();
        } else {
            IdentityModel.findByIdValue(idValue)
                .then(this.resolveWithIdentity(req, res, next), this.rejectWithNoIdentity(res, next));
        }
    }

    private createIdentityIfNotFound(req:Request, res:Response) {
        return (identity?:IIdentity) => {
            if (identity) {
                return Promise.resolve(identity);
            } else {
                const dto = new CreateIdentityDTO(
                    req.headers[Headers.PartyType],
                    req.headers[Headers.GivenName],
                    req.headers[Headers.FamilyName],
                    req.headers[Headers.UnstructuredName],
                    req.headers[Headers.DOB] /*wrong*/,
                    req.headers[Headers.DOB],
                    req.headers[Headers.IdentityType],
                    req.headers[Headers.AgencyScheme],
                    req.headers[Headers.AgencyToken],
                    req.headers[Headers.LinkIdScheme],
                    req.headers[Headers.LinkIdConsumer],
                    req.headers[Headers.PublicIdentifierScheme],
                    req.headers[Headers.ProfileProvider]
                );
                console.log('ABOUT TO CREATE=', dto);
                return IdentityModel.createFromDTO(dto);
            }
        };
    }

    private resolveWithIdentity(req:Request, res:Response, next:() => void) {
        return (identity?:IIdentity) => {
            logger.info('Identity context:', (identity ? colors.magenta(identity.idValue) : colors.red('[not found]')));
            console.log('IDENTITY=', identity);
            if (identity) {
                for (let key of Object.keys(req.headers)) {
                    const keyUpper = key.toUpperCase();
                    if (keyUpper.startsWith(Headers.Prefix)) {
                        const value = req.headers[key];
                        res.locals[keyUpper] = value;
                        logger.debug(`${keyUpper}=${value}`);
                    }
                }
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

    private rejectWithNoIdentity(res:Response, next:() => void) {
        return ():void => {
            logger.error('Unable to look up identity!'.red);
            res.status(401);
            res.send(new ErrorResponse('Unable to look up identity.'));
        };
    }

    public getAuthenticatedIdentityIdValue(res:Response):string {
        return res.locals[Headers.IdentityIdValue];
    }

    public getAuthenticatedIdentity(res:Response):IIdentity {
        return res.locals[Headers.Identity];
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
