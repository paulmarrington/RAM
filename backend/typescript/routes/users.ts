/// <reference path="../all_types" />

import * as express from "express";
import * as ram from "../ram/API";

var router = express.Router();

/* GET users listing. */
router.get('/', function(req:express.Request, res:express.Response, next:express.NextFunction) {
    res.send(new ram.DataResponse({list:[1,2,3,4]}));
});

export default router;
