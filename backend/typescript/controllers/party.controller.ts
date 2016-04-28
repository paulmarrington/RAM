import {Router} from 'express';
import {PartyModel} from '../models/party.model';
import {sendDocument, sendError} from './helpers';

export const PartyAPI = () => {
  const router: Router = Router();

  /* given identity type and value, retrieve identity and party documents */
  router.get('/identity/:value/:type', (req, res) => {
    PartyModel.getPartyByIdentity(req.params.type, req.params.value)
      .then(sendDocument(res), sendError(res));
  });

  /*
   * Add a Party. It must have one identity to be valid.
   */
  router.post('/', (req, res) => {
    PartyModel.create(req.body)
      .then(sendDocument(res), sendError(res));
  });

  /* We can change roles and other party attributes here */
  router.put('/identity/:value/:type', (req, res) => {
    PartyModel.findOneAndUpdate({
      'identities.type': req.params.type,
      'identities.value': req.params.value,
      deleted: false
    }, req.body, { new: true }).exec()
      .then(sendDocument(res), sendError(res));
  });

  return router;
};
