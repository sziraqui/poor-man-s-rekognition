import {Router, Request, Response} from 'express';
let router:Router = Router();

/* Check if server is running */
router.get('/', function(req:Request, res:Response) {
  res.send({'result': 'Server OK'});
});

export const indexRouter:Router = router;
