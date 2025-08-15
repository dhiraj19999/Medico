import express from  "express"
import { createHospital,getHospitals,getHospitalsByDoctor,assignDoctorToHospitals} from "../controllers/HospitalController.js"
import upload from '../middleware/upload.js';
const router=express.Router()
import {protect} from "../middleware/authMiddleware.js"

router.post("/createhospital",upload.single("avatar"), createHospital) // frontend done admin only only admin middleware 
router.get("/", getHospitals)  //  admin and docotr only   role middelware frontend done
router.get("/hospitals/:doctorId", getHospitalsByDoctor) // doctor only 
router.post("/assigndoctor",protect, assignDoctorToHospitals)// doctor only fronedn done

export default router