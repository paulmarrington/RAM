import {Router, Request, Response} from 'express';
import {sendDocument, sendError} from './helpers';
import {IPartyModel} from '../models/party.model';

export class PartyController {

  constructor(private partyModel: IPartyModel) {

  }
  /* given identity type and value, retrieve identity and party documents */
  private getParty = (req: Request, res: Response) => {
    this.partyModel.getPartyByIdentity(req.params.type, req.params.value)
      .then(sendDocument(res), sendError(res));
  };

  /*
   * Add a Party. It must have one identity to be valid.
   */
  private addParty = (req: Request, res: Response) => {
    this.partyModel.create(req.body)
      .then(sendDocument(res), sendError(res));
  };

  /* We can change roles and other party attributes here */
  private updateParty = (req: Request, res: Response) => {
    this.partyModel.findOneAndUpdate({
      'identities.type': req.params.type,
      'identities.value': req.params.value,
      deleted: false
    }, req.body, { new: true }).exec()
      .then(sendDocument(res), sendError(res));
  };

  public assignRoutes = (router: Router) => {
    router.get('/identity/:value/:type', this.getParty);
    router.post('/', this.addParty);
    router.put('/identity/:value/:type', this.updateParty);
    return router;
  };
}