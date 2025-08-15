
import cloudinary from "../config/cloudinary.js";
import Hospital from "../models/Hospital.js";
import Doctor from "../models/Doctor.js";

export const createHospital = async (req, res) => {
  try {
    const {
      name,
      specialization,
        streetAdd,
      phone,
      gmail,
      city,
      state,
      pincode,
    doctors
     
    } = req.body;

    let avatarUrl = "";
    if (req.file) {
          // Convert buffer to base64 string
          const base64Str = req.file.buffer.toString("base64");
          const dataUri = `data:${req.file.mimetype};base64,${base64Str}`;
    const start = Date.now();
          // Direct upload to Cloudinary (faster than streaming)
          const result = await cloudinary.uploader.upload(dataUri, {
            folder: "user-profiles",
            resource_type: "image",
            fetch_format: "auto",
            quality: "auto",
            width: 400,
            height: 400,
            crop: "limit",
          });
    
          avatarUrl = result.secure_url;
          console.log("Upload time:", (Date.now() - start)/1000, "seconds");
    
        }

    const newHospital = new Hospital({
      name,
      specialization: specialization || [],
      doctors:  [],
      phone: phone || "",
      gmail: gmail || "",
      city: city || "",
      state: state || "",
      pincode: pincode || "",
      avatar: avatarUrl || "",
        streetAdd:  streetAdd||""
     
    });

    const savedHospital = await newHospital.save();
    res.status(201).json({ success: true, data: savedHospital });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to create hospital" });
  }
};

// ==================== GET ALL HOSPITALS ====================
export const getHospitals = async (req, res) => {
  try {
    const hospitals = await Hospital.find()
      .populate("doctors", "name specialization experience avatar") // Populate doctor info
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch hospitals" });
  }
};

// ==================== GET HOSPITALS BY DOCTOR ====================
export const getHospitalsByDoctor = async (req, res) => {
  try {
    const { doctorId } = req.params;

    if (!doctorId) {
      return res.status(400).json({ success: false, message: "Doctor ID is required" });
    }

    const hospitals = await Hospital.find({ doctors: doctorId })
      .populate("doctors", "name specialization experience avatar")
      .sort({ createdAt: -1 });

    res.status(200).json({ success: true, data: hospitals });
  } catch (error) {
    console.error(error);
    res.status(500).json({ success: false, message: "Failed to fetch hospitals for doctor" });
  }
};


 //   modify hospital to add docotr id 

// controllers/hospitalController.js



// Doctor ko multiple hospitals me assign karna


export const assignDoctorToHospitals = async (req, res) => {
  try {
    const { hospitalIds } = req.body;
    const doctorId = req.user._id; // protect middleware se milta hai

    // Validate
    if (!doctorId || !Array.isArray(hospitalIds) || hospitalIds.length === 0) {
      return res.status(400).json({ message: "Doctor ID and Hospital IDs are required" });
    }

    // Doctor exist check
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ message: "Doctor not found" });
    }

    for (const hospId of hospitalIds) {
      const hospital = await Hospital.findById(hospId);

      if (hospital) {
        // Hospital me doctor add karo (agar already nahi hai)
        if (!hospital.doctors.includes(doctorId)) {
          hospital.doctors.push(doctorId);
          await hospital.save();
        }

        // Doctor me hospital add karo (agar already nahi hai)
        if (!doctor.hospitals.includes(hospId)) {
          doctor.hospitals.push(hospId);
        }
      }
    }

    // Doctor save (hospital list updated)
    await doctor.save();

    res.status(200).json({ message: "Doctor assigned to hospitals successfully" });
  } catch (error) {
    console.error("Error assigning doctor to hospitals:", error);
    res.status(500).json({ message: "Internal Server Error" });
  }
};
