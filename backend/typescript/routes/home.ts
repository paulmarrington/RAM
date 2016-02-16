/// <reference path="../all_types" />

import * as express from "express";
import * as ram from "../ram/API";

var router:express.Router = express.Router();

router.get('/', function(req:express.Request, res:express.Response, next:express.NextFunction) {
  res.send(new ram.DataResponse({page:'home'}));
});

export default router;
