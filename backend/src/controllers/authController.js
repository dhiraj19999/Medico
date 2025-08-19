import User from "../models/User.js";
import jwt from "jsonwebtoken";
import streamifier from "streamifier";
import cloudinary from "../config/cloudinary.js";

// 🔐 Token Generator
const generateToken = (userId) => {
  return jwt.sign({ id: userId }, process.env.JWT_SECRET, { expiresIn: "7d" });
};

// ✅ Register User
export const registerUser = async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      password,
     gender,
      dateOfBirth,
      address,
     
    } = req.body;

    const userExists = await User.findOne({
  $or: [{ email }, { phone }],
});


//console.log("Avatar URL:", avatarUrl);
    if (userExists)
      return res.status(400).json({ message: "User already exists" });

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


    // 2️⃣ Cloudinary upload only if file exists
   /* if (req.file) {
      const uploadFromBuffer = (fileBuffer) => {
        return new Promise((resolve, reject) => {
          const stream = cloudinary.uploader.upload_stream(
            {
              folder: "user-profiles",
              resource_type: "image",
              fetch_format: "auto",
              quality:"auto"
            },
            (error, result) => {
              if (error) reject(error);
              else resolve(result);
            }
          );
          streamifier.createReadStream(fileBuffer).pipe(stream);
        });
      };

      const result = await uploadFromBuffer(req.file.buffer);
      avatarUrl = result.secure_url;
    }*/



    const user = await User.create({
      name,
      email,
      phone,
      password,
      role: "patient",
      gender,
      avatar: avatarUrl,
      dateOfBirth,
      address,
      subscription: "free"
    });

    // 🔐 Set token in cookie
  

    res.status(201).json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
    });
  } catch (err) {
    console.error("Register Error:", err);
    res.status(500).json({ message: err.message });
  }
};

// ✅ Login User
export const loginUser = async (req, res) => {
  try {
    const { email, password } = req.body;

    const user = await User.findOne({ email });
    if (!user)
      return res.status(400).json({ message: "Invalid email or password" });

    const isMatch = await user.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });

    // 🔐 Set token in cookie
    const token= generateToken(user._id);
    res.cookie("token", token, {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      avatar: user.avatar,
      token:token
    
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};


//  get user profile
/*
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id).select("-password");
    if (!user) return res.status(404).json({ message: "User not found" });  
    res.json(user);
  }
  catch (err) {
    console.error("Get User Profile Error:", err);
    res.status(500).json({ message: err.message });
  }
};  */

export const getUserProfile = async (req, res) => {
  try {
    if (!req.user) {
      return res.status(404).json({ message: "Account not found" });
    }

    res.json(req.user); // user ya doctor dono kaam karega
  } catch (err) {
    console.error("Get User Profile Error:", err);
    res.status(500).json({ message: err.message });
  }
};


// ✅ Logout User

export const logoutUser = (req, res) => {
  try {
    res.clearCookie("token");
    res.json({ message: "Logged out successfully" });
  } catch (err) {
    console.error("Logout Error:", err);
    res.status(500).json({ message: err.message });
  }
};


export const getAlluser=async(req,res)=>{
  try{
    const users=await User.find();
    res.json(users);
  }catch(err){
    res.status(500).json({message:err.message});
  }
}


export const deleteUser=async(req,res)=>{
  try{
    const user=await User.findByIdAndDelete(req.params.id);
    res.json({message:"User deleted Succesfully"});
  }catch(err){
    res.status(500).json({message:err.message});
  }
}


export const searchUser = async (req, res) => {
  try {
    const { search } = req.body;

    if (!search || search.trim() === "") {
      return res.status(400).json({
        success: false,
        message: "❌ Please enter something to search",
      });
    }

    // Trim and lowercase
    const searchValue = search.trim();

    let query = {};

    if (/^\d+$/.test(searchValue)) {
      // Only digits → treat as pincode
      query["pincode"] = { $regex: searchValue, $options: "i" };
    } else {
      // String → search in multiple fields
      query = {
        $or: [
          { 
            "name": { $regex: searchValue, $options: "i" } },
          { "city": { $regex: searchValue, $options: "i" } },
          { "state": { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    const users = await User.find(query);

    if (!users.length) {
      return res.status(404).json({
        success: false,
        message: "No users found matching your search",
      });
    }

    res.status(200).json({
      success: true,
      count: users.length,
      data: users,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching doctors",
    });
  }
};
