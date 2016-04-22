/// <reference path='../_BackendTypes.ts' />

import {Router, Response} from 'express';
import {model,Party} from '../models/party';
import {IResponse, ErrorResponse} from '../../../commons/RamAPI';

const getPartyByIdentity =
(identityType:string, identityValue:string,
actor: (doc? : Party) => void) : void => {
  model.find({
    'identities.type':  identityType,
    'identities.value': identityValue,
    deleted:            false
  }).limit(1).lean().exec((err:string, pds: Party[]) => {
    actor(err ? null : pds[0]);
  });
};

const getPartyById = (id:string,
actor: (doc? : Party) => void) : void => {
  model.find({ _id: id }).limit(1).lean().
  exec((err: string, pds: Party[]) => {
    actor(err ? null : pds[0]);
  });
};

export const PartyAPI = () => {
  const router: Router = Router();

  /* given identity type and value, retrieve identity and party documents */
  router.get('/identity/:value/:type', (req, res) => {
    getPartyByIdentity(req.params.type, req.params.value,
    (partyDoc:Party) => {
      if (partyDoc) {
        const response:IResponse<Party> = {
          data:     partyDoc,
          status:   200
        };
        res.json(response);
      } else {
        sendError('Can\'t find party', res);
      }
    });
  });

  /*
   * Add a Party. It must have one identity to be valid.
   */
  router.post('/', (req, res) => {
    model.create(req.body, (err: string, pd: Party) => {
      if (err) {
        sendError(err.toString(), res);
      } else {
        // we have to ask for it again because typescript can't
        // work well with mongoose doc.toJSON() so we have to use
        // lean() instead.
        getPartyById(pd._id, (partyDoc) => {
          const response:IResponse<Party> = {
            data:     partyDoc,
            status:   200
          };
          res.json(response);
        });
      }
    });
  });

  /* We can change roles and other party attributes here */
  router.put('/identity/:value/:type', (req, res) => {
    model.findOneAndUpdate({
      'identities.type': req.params.type,
      'identities.value': req.params.value,
      deleted: false
    }, req.body, { new: true },
    (err: string, pd:Party) => {
      if (err) {
        sendError(err.toString(), res);
      } else {
        // we have to ask for it again because typescript can't
        // work well with mongoose doc.toJSON() so we have to use
        // lean() instead.
        getPartyById(pd._id, (partyDoc) => {
          const response:IResponse<Party> = {
            data:     partyDoc,
            status:   200
          };
          res.json(response);
        });
      }
    });
  });

  function sendError(msg:string, res:Response) {
    res.json(new ErrorResponse(500, msg));
  }

  return router;
};
