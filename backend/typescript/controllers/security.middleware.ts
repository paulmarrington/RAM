import {logger} from '../logger';
import * as colors from 'colors';
import {Request, Response} from 'express';
import {Headers} from './headers';
import {ErrorResponse} from '../../../commons/RamAPI';
import {CreateIdentityDTO} from '../../../commons/RamAPI';
import {IIdentity, IdentityModel} from '../models/identity.model';
import {DOB_SHARED_SECRET_TYPE_CODE} from '../models/sharedSecretType.model';

class Security {

    public prepareRequest():(req:Request, res:Response, next:() => void) => void {
        return (req:Request, res:Response, next:() => void) => {
            const idValue = req.get(Headers.IdentityIdValue);
            const rawIdValue = req.get(Headers.IdentityRawIdValue);
            if (!idValue || !rawIdValue) {
                // id not supplied, carry on
                Promise.resolve(null)
                    .then(this.resolve(req, res, next), this.reject(res, next));
            } else {
                // id supplied, try to lookup and if not found create a new identity before carrying on
                IdentityModel.findByIdValue(idValue)
                    .then(this.createIdentityIfNotFound(req, res))
                    .then(this.resolve(req, res, next), this.reject(res, next));
            }
        };
    }

    private createIdentityIfNotFound(req:Request, res:Response) {
        return (identity?:IIdentity) => {
            if (identity) {
                return Promise.resolve(identity);
            } else {
                const dto = new CreateIdentityDTO(
                    req.get(Headers.IdentityRawIdValue),
                    req.get(Headers.PartyType),
                    req.get(Headers.GivenName),
                    req.get(Headers.FamilyName),
                    req.get(Headers.UnstructuredName),
                    DOB_SHARED_SECRET_TYPE_CODE,
                    req.get(Headers.DOB),
                    req.get(Headers.IdentityType),
                    req.get(Headers.AgencyScheme),
                    req.get(Headers.AgencyToken),
                    req.get(Headers.LinkIdScheme),
                    req.get(Headers.LinkIdConsumer),
                    req.get(Headers.PublicIdentifierScheme),
                    req.get(Headers.ProfileProvider)
                );
                logger.info('Creating identity: '.red);
                console.log(dto);
                return IdentityModel.createFromDTO(dto);
            }
        };
    }

    private resolve(req:Request, res:Response, next:() => void) {
        return (identity?:IIdentity) => {
            logger.info('Identity context:', (identity ? colors.magenta(identity.idValue) : colors.red('[not found]')));
            console.log('IDENTITY=', identity);
            if (identity) {
                for (let key of Object.keys(req.headers)) {
                    const keyUpper = key.toUpperCase();
                    if (keyUpper.startsWith(Headers.Prefix)) {
                        const value = req.get(key);
                        res.locals[keyUpper] = value;
                        logger.debug(`${keyUpper}=${value}`);
                    }
                }
                res.locals[Headers.Identity] = identity;
                res.locals[Headers.IdentityIdValue] = identity.idValue;
                res.locals[Headers.IdentityRawIdValue] = identity.rawIdValue;
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

    private reject(res:Response, next:() => void) {
        return (err:Error):void => {
            logger.error(('Unable to look up identity: ' + err).red);
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
