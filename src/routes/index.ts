import {Router, Request, Response} from 'express';
let router:Router = Router();

/* Check if server is running */
router.get('/', function(req:Request, res:Response) {
    res.send({'result': 'Server OK'});
});

router.get('/face-detection-demo', function(req:Request, res:Response) {
    res.render('face-detection-demo', {title:"Poor Man's Rekognition", navtitle: "DetectFace API Demo"});
});

router.get('/face-compare-demo', function(req:Request, res:Response) {
    res.render('face-compare-demo', {title:"Poor Man's Rekognition", navtitle: "CompareFace API Demo"});
});


export const indexRouter:Router = router;
