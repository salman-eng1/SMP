import { checkPorts, checkServices,diskID } from '@portal/controllers/troubleshoot';
import express, {Router} from 'express'

class TroubleshootRoutes{
    private router: Router;
    constructor(){
this.router=express.Router();
    }

    public routes(){
        this.router.get('/check-services',checkServices)
        this.router.get('/check-ports',checkPorts)
        this.router.get('/fix-disk-id',diskID)


        return this.router
    }


}

export const troubleshootRoutes: TroubleshootRoutes=new TroubleshootRoutes()