import express from  "express"
import { createHospital,getHospitals,getHospitalsByDoctor,assignDoctorToHospitals} from "../controllers/HospitalController.js"
import upload from '../middleware/upload.js';
const router=express.Router()
import {protect,isAdmin,isDoctor} from "../middleware/authMiddleware.js"

router.post("/createhospital",protect,isAdmin,upload.single("avatar"), createHospital) // frontend done admin only only admin middleware 
router.get("/",protect, getHospitals)  //  admin and docotr only   role middelware frontend done
router.get("/hospitals/:doctorId",protect,isDoctor, getHospitalsByDoctor) // doctor only 
router.post("/assigndoctor",protect,isAdmin, assignDoctorToHospitals)// admin only fronedn done

export default router