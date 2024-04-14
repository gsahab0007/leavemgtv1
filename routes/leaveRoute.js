import express from 'express';
import { allEmpGetCtr, addEmpPostCtr, deleteEmpCtr, singleEmpGetCtr, editEmpPatchCtr, addLeavesPatchCtr, deleteLeaveCtr, addRemarksPostCtr } from '../controllers/leaveCtr.js'
import authMiddleware from '../middleware/authMiddleware.js';

const router = express.Router();



router.route('/get/allemp').get(authMiddleware, allEmpGetCtr);

router.route('/add/emp').post(authMiddleware, addEmpPostCtr);

router.route('/delete/emp').delete(authMiddleware, deleteEmpCtr);

router.route('/get/emp/:id').get(authMiddleware, singleEmpGetCtr);

router.route('/edit/emp/:id').patch(authMiddleware, editEmpPatchCtr);

router.route('/add/leave').post(authMiddleware, addLeavesPatchCtr);

router.route('/delete/leave').delete(authMiddleware, deleteLeaveCtr);

router.route('/add/remarks').post(authMiddleware, addRemarksPostCtr);


export default router;