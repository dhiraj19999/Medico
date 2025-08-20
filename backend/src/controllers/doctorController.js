import Doctor from "../models/Doctor.js";
import jwt from "jsonwebtoken";
import cloudinary from "../config/cloudinary.js";
import Appointment from "../models/Appointment.js";
import Feedback from "../models/Feedback.js";
import Sentiment from "sentiment";
import nlp from "compromise";
import OpenAI from "openai";
import axios from "axios";
import natural from "natural";

const sentiment = new Sentiment();
// JWT Generate
const generateToken = (id) =>
  jwt.sign({ id, role: "doctor" }, process.env.JWT_SECRET, { expiresIn: "7d" });

// 🔐 Admin-only Doctor Register


export const registerDoctor = async (req, res) => {
  try {
    const {
      name, specialization, qualifications, experience,
      email, phone, password, gender,
      city, state, country, pincode,
      availableDays, availableTimeStart, availableTimeEnd, location
    } = req.body;

    const existing = await Doctor.findOne({ email });
    if (existing) {
      return res.status(400).json({ message: "Doctor already exists" });
    }

    // Parse availableDays
    let parsedDays = Array.isArray(availableDays) ? availableDays : [];
    if (typeof availableDays === "string") {
      try { parsedDays = JSON.parse(availableDays); } catch {}
    }

    // Parse location
    let parsedLocation = { type: "Point", coordinates: [0, 0] };
    /*if (location) {
      if (typeof location === "string") {
        try { parsedLocation = JSON.parse(location); } catch {}
      } else if (typeof location === "object") {
        parsedLocation = location;
      }
    }

    if (!parsedLocation.coordinates || parsedLocation.coordinates.length !== 2) {
      return res.status(400).json({ message: "Invalid location coordinates" });
    }*/




if (location) {
  if (typeof location === "string") {
    try {
      const temp = JSON.parse(location);
      if (temp.coordinates && temp.coordinates.length === 2) {
        parsedLocation = temp;
      } else {
        return res.status(400).json({ message: "Invalid coordinates format" });
      }
    } catch (err) {
      return res.status(400).json({ message: "Invalid JSON for location" });
    }
  } else if (typeof location === "object") {
    if (location.coordinates && location.coordinates.length === 2) {
      parsedLocation = location;
    } else {
      return res.status(400).json({ message: "Invalid coordinates object" });
    }
  }
} else {
  return res.status(400).json({ message: "Location is required" });
}












    // Avatar Upload
    let avatarUrl = "";
    if (req.file) {
      const base64Str = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Str}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "user-profiles",
        width: 400, height: 400, crop: "limit",
        fetch_format: "auto", quality: "auto",
      });
      avatarUrl = result.secure_url;
    }

    // Create doctor
    const doctor = await Doctor.create({
      name,
      specialization,
      qualifications,
      experience,
      email,
      phone,
      password,
      gender,
      avatar: avatarUrl,
      address: { city, state, country, pincode },
      availableDays: parsedDays,
      availableTime: { start: availableTimeStart, end: availableTimeEnd },
      location: parsedLocation
    });

    res.status(201).json({
      _id: doctor._id,
      name: doctor.name,
      token: generateToken(doctor._id),
    });

  } catch (error) {
    console.error("Doctor Registration Error:", error);
    res.status(500).json({ message: error.message });
  }
};

// 🔐 Doctor Login
export const loginDoctor = async (req, res) => {
  try {
    const { email, password } = req.body;

    const doctor = await Doctor.findOne({ email });
    if (!doctor) return res.status(401).json({ message: "Invalid email or password" });

    const isMatch = await doctor.matchPassword(password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid email or password" });
res.cookie("token", generateToken(doctor._id), {
      httpOnly: true,
      secure: process.env.NODE_ENV === "production",
      sameSite: "strict",
      maxAge: 7 * 24 * 60 * 60 * 1000,
    });
    res.json({
      _id: doctor._id,
      name: doctor.name,
      token: generateToken(doctor._id),
    });
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};



export const getNearbyDoctors = async (req, res) => {
  try {
    const { latitude, longitude } = req.query; // frontend se bhejo
    console.log("Latitude:", latitude, "Longitude:", longitude);
    if (!latitude || !longitude) {
      return res.status(400).json({ message: "Latitude and Longitude required" });
    }

    const nearbyDoctors = await Doctor.find({
      location: {
        $near: {
          $geometry: {
            type: "Point",
            coordinates: [parseFloat(longitude), parseFloat(latitude)]
          },
          $maxDistance: 50000 // 50 km = 50,000 meters
        }
      }
    }).select("-password").populate("hospitals");

    res.json({ success: true, data: nearbyDoctors });
  } catch (error) {
    console.error("Error finding nearby doctors:", error);
    res.status(500).json({ message: "Server error" });
  }
};


// controllers/doctorController.js


export const searchDoctors = async (req, res) => {
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
      query["address.pincode"] = { $regex: searchValue, $options: "i" };
    } else {
      // String → search in multiple fields
      query = {
        $or: [
          { name: { $regex: searchValue, $options: "i" } },
          { "address.city": { $regex: searchValue, $options: "i" } },
          { "address.state": { $regex: searchValue, $options: "i" } },
        ],
      };
    }

    const doctors = await Doctor.find(query).populate("hospitals", "name city");

    if (!doctors.length) {
      return res.status(404).json({
        success: false,
        message: "No doctors found matching your search",
      });
    }

    res.status(200).json({
      success: true,
      count: doctors.length,
      data: doctors,
    });
  } catch (error) {
    console.error("Search error:", error);
    res.status(500).json({
      success: false,
      message: "Server error while searching doctors",
    });
  }
};



export const getAllDoctors=async(req,res)=>{
  try{
    const doctors = await Doctor.find({}).populate("hospitals").populate("appointments");
    if(!doctors.length){
      return res.status(404).json({
        success:false,
        message:"No doctors found"
      })
    }
    res.status(200).json({
      success:true,
      count:doctors.length,
      data:doctors
    })
  }catch(error){
    console.error("Error fetching doctors:", error);
    res.status(500).json({
      success:false,
      message:"Server error while fetching doctors"
    })  
     
  }
}



export const deleteDoc=async(req,res)=>{

  try{
    const user=await Doctor.findByIdAndDelete(req.params.id);
    res.json({message:"User deleted Succesfully"});
  }catch(err){
    res.status(500).json({message:err.message});
  }
}












// 🔁 Fallback Models
const models = [
  "openai/gpt-3.5-turbo",
  "mistralai/mistral-7b-instruct",
  "google/gemma-7b-it",
  "gryphe/mythomax-l2-13b"
];

// 🔁 AI Call with Fallback
const callAIWithFallback = async (messages) => {
  for (let model of models) {
    try {
      const response = await axios.post(
        "https://openrouter.ai/api/v1/chat/completions",
        {
          model,
          messages
        },
        {
          headers: {
            Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
            "Content-Type": "application/json",
          },
          timeout: 10000,
        }
      );

      const reply = response.data.choices[0].message.content.trim();
      return { reply, model };
    } catch (err) {
      console.warn(`⚠️ Model ${model} failed:`, err.response?.data?.error?.message || err.message);
    }
  }
  throw new Error("❌ All AI models failed.");
};

export const getDoctorInsights = async (req, res) => {
  try {
    const doctorId = req.user._id;

    const doctor = await Doctor.findById(doctorId).populate("appointments");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // ⭐ Avg Rating Function
    const avgRatings = () => {
      if (!doctor.rating || doctor.rating.length === 0) return 0;
      const ratings = doctor.rating; 
      return ratings.reduce((a, b) => Number(a) + Number(b), 0) / ratings.length;
    };

    const appointments = await Appointment.find({ doctor: doctorId }).populate("feedback");
    const feedbacks = await Feedback.find({ doctor: doctorId });

    // ---------- 1. Performance Metrics ----------
    const totalAppointments = appointments.length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    const cancelled = appointments.filter(a => a.status === "Cancelled").length;
    const completionRate = totalAppointments > 0 ? (completed / totalAppointments) * 100 : 0;
    const cancellationRate = totalAppointments > 0 ? (cancelled / totalAppointments) * 100 : 0;
    const avgRating = avgRatings();

    // ---------- 2. Sentiment Analysis ----------
    let sentimentResults = feedbacks.map(f => sentiment.analyze(f.comment));
    const positive = sentimentResults.filter(r => r.score > 0).length;
    const negative = sentimentResults.filter(r => r.score < 0).length;
    const neutral = sentimentResults.filter(r => r.score === 0).length;
const tokenizer = new natural.WordTokenizer();


    // ---------- 3. NLP Keyword Extraction ----------
    let allComments = feedbacks.map(f => f.comment).join(" ");
    let tokens = tokenizer.tokenize(allComments);
    const stopwords = ['is','am','are','the','a','an','in','on','at','to','for','with','this','that','and'];
let filtered = tokens.filter(word => !stopwords.includes(word.toLowerCase()));

 //Frequency count
let freqMap = {};
filtered.forEach(word => {
  freqMap[word.toLowerCase()] = (freqMap[word.toLowerCase()] || 0) + 1;
});

// Top 10
let keywords = Object.entries(freqMap)
  .sort((a, b) => b[1] - a[1])
  .map(item => item[0])
  .slice(0, 10);

console.log("keywords", keywords);
    // ---------- 4. Cancellation Analysis ----------
    let cancelReasons = appointments
      .filter(a => a.status === "Cancelled" && a.cancelReason)
      .map(a => a.cancelReason);
    let cancelNlp = nlp(cancelReasons.join(" "));
    let cancelKeywords = cancelNlp.nouns().out("frequency").slice(0, 5);
   // console.log("c",cancelKeywords);

    // ---------- 5. AI Suggestions with Fallback ----------
const aiPrompt = `
Doctor Performance Summary:

- Name: ${doctor.name}
- Specialization: ${doctor.specialization}
- Average Rating: ${avgRating.toFixed(2)}
- Total Appointments: ${totalAppointments}
- Completed: ${completed}
- Cancelled: ${cancelled}
- Completion Rate: ${completionRate.toFixed(2)}%
- Cancellation Rate: ${cancellationRate.toFixed(2)}%
- Sentiment Summary: Positive=${positive}, Negative=${negative}, Neutral=${neutral}
- Common Positive Feedback Keywords: ${JSON.stringify(keywords)}   // yaha sirf positive ke liye nikalna sahi hoga
- Common Cancellation Reasons: ${JSON.stringify(cancelKeywords)}

Task:
1. Highlight the doctor’s **positive strengths** based on feedback and performance (for motivation).
2. Then provide a **list of improvement suggestions**. 
3. Suggestions must be natural, human-like and actionable (not generic), directly linked to the data above.
4. Keep tone supportive and constructive, so doctor feels encouraged as well as guided.
`;

    const { reply: improvementSuggestions, model } = await callAIWithFallback([
      { role: "system", content: "You are an AI assistant that analyzes doctor performance and generates improvement suggestions." },
      { role: "user", content: aiPrompt }
    ]);

    // ---------- Final Response ----------
    res.json({
      doctor: doctor.name,
      specialization: doctor.specialization,
      performance: {
        totalAppointments,
        completed,
        cancelled,
        completionRate: completionRate.toFixed(2) + "%",
        cancellationRate: cancellationRate.toFixed(2) + "%",
        avgRating: avgRating.toFixed(2),
      },
      feedbackAnalysis: {
        totalFeedbacks: feedbacks.length,
        positive, negative, neutral,
        keywords,
      },
      cancellationInsights: {
        totalCancelled: cancelled,
        commonReasons: cancelKeywords,
      },
      aiSuggestions: improvementSuggestions,
      modelUsed: model
    });

  } catch (error) {
    console.error("❌ Doctor Insights Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};



export const getDoctorAdminsideInsights = async (req, res) => {
  try {
    const {doctorId} = req.params;

    const doctor = await Doctor.findById(doctorId).populate("appointments");
    if (!doctor) return res.status(404).json({ message: "Doctor not found" });

    // ⭐ Avg Rating Function
    const avgRatings = () => {
      if (!doctor.rating || doctor.rating.length === 0) return 0;
      return doctor.rating.reduce((a, b) => Number(a) + Number(b), 0) / doctor.rating.length;
    };

    const appointments = await Appointment.find({ doctor: doctorId }).populate("feedback");
    const feedbacks = await Feedback.find({ doctor: doctorId });

    // ---------- 1. Performance Metrics ----------
    const totalAppointments = appointments.length;
    const completed = appointments.filter(a => a.status === "Completed").length;
    const cancelled = appointments.filter(a => a.status === "Cancelled").length;
    const completionRate = totalAppointments > 0 ? (completed / totalAppointments) * 100 : 0;
    const cancellationRate = totalAppointments > 0 ? (cancelled / totalAppointments) * 100 : 0;
    const avgRating = avgRatings();

    // ---------- 2. Sentiment Analysis ----------
    const sentimentResults = feedbacks.map(f => sentiment.analyze(f.comment));
    const positive = sentimentResults.filter(r => r.score > 0).length;
    const negative = sentimentResults.filter(r => r.score < 0).length;
    const neutral = sentimentResults.filter(r => r.score === 0).length;

    const tokenizer = new natural.WordTokenizer();

    // ---------- 3. NLP Keyword Extraction ----------
    let allComments = feedbacks.map(f => f.comment).join(" ");
    let tokens = tokenizer.tokenize(allComments);
    const stopwords = ['is','am','are','the','a','an','in','on','at','to','for','with','this','that','and'];
    let filtered = tokens.filter(word => !stopwords.includes(word.toLowerCase()));

    let freqMap = {};
    filtered.forEach(word => {
      freqMap[word.toLowerCase()] = (freqMap[word.toLowerCase()] || 0) + 1;
    });

    let keywords = Object.entries(freqMap)
      .sort((a, b) => b[1] - a[1])
      .map(item => item[0])
      .slice(0, 10);

    // ---------- 4. Cancellation Analysis ----------
    let cancelReasons = appointments
      .filter(a => a.status === "Cancelled" && a.cancelReason)
      .map(a => a.cancelReason);
    let cancelNlp = nlp(cancelReasons.join(" "));
    let cancelKeywords = cancelNlp.nouns().out("frequency").slice(0, 5);

    // ---------- 5. Specialization Average (multi-specialization aware) ----------
    const doctorSpecs = doctor.specialization.split(",").map(s => s.trim());
    const regexPattern = doctorSpecs.map(s => new RegExp(`\\b${s}\\b`, 'i'));

    const specializationDoctors = await Doctor.find({
      $or: regexPattern.map(r => ({ specialization: r }))
    });

    const specializationRatings = specializationDoctors.map(d => {
      if (!d.rating || d.rating.length === 0) return 0;
      return d.rating.reduce((a, b) => Number(a) + Number(b), 0) / d.rating.length;
    });
    const specializationAvgRating = specializationRatings.length
      ? specializationRatings.reduce((a, b) => a + b, 0) / specializationRatings.length
      : 0;

    const specializationAppointments = await Appointment.find({ doctor: { $in: specializationDoctors.map(d => d._id) } });
    const specializationCompleted = specializationAppointments.filter(a => a.status === "Completed").length;
    const specializationCancelled = specializationAppointments.filter(a => a.status === "Cancelled").length;
    const specializationTotal = specializationAppointments.length;

    const specializationAvgCompletionRate = specializationTotal > 0 ? (specializationCompleted / specializationTotal) * 100 : 0;
    const specializationAvgCancellationRate = specializationTotal > 0 ? (specializationCancelled / specializationTotal) * 100 : 0;

    // ---------- 6. AI Prompt ----------
    const aiPrompt = `
Admin Doctor Performance Analysis & Insights

Doctor: ${doctor.name} (${doctor.specialization})

Performance Data:
- Average Rating: ${avgRating.toFixed(2)}
- Completion Rate: ${completionRate.toFixed(2)}%
- Cancellation Rate: ${cancellationRate.toFixed(2)}%
- Sentiment: Positive=${positive}, Negative=${negative}, Neutral=${neutral}
- Feedback Keywords: ${JSON.stringify(keywords)}
- Cancellation Reasons: ${JSON.stringify(cancelKeywords)}

Specialization Averages:
- Avg Rating: ${specializationAvgRating.toFixed(2)}
- Completion Rate: ${specializationAvgCompletionRate.toFixed(2)}%
- Cancellation Rate: ${specializationAvgCancellationRate.toFixed(2)}%

Tasks for AI:
1. Recognition Suggestion: Should this doctor be recognized? Provide a short appreciation note.
2. Risk Analysis: Is this doctor at risk of patient dissatisfaction? Suggest admin action if needed.
3. Performance Comparison: Compare with specialization averages, highlight above/below average.
4. Overall Ranking Score: Provide a score (0–100) representing overall performance.
5. Strategic Recommendation: How is the overall performance of the doctor? Should we continue with this doctor long-term, remove from the system, or give a chance for improvement over time?
Return JSON with fields: { recognitionNote, riskAnalysis, comparison, summary, rankingScore,strategicRecommendation  }.
`;

    const { reply: aiResponse, model } = await callAIWithFallback([
      { role: "system", content: "You are an AI assistant analyzing doctor performance for admin." },
      { role: "user", content: aiPrompt }
    ]);

    let parsedResponse;
    try {
      parsedResponse = JSON.parse(aiResponse);
    } catch (e) {
      parsedResponse = { summary: aiResponse, rankingScore: 0 };
    }

    // ---------- 7. Update Doctor Ranking Score ----------
    if (parsedResponse.rankingScore !== undefined) {
      doctor.rankingScore = parsedResponse.rankingScore;
      await doctor.save();
    }

    // ---------- Final Response ----------
    res.json({
      doctor: doctor.name,
      specialization: doctor.specialization,
      performance: {
        totalAppointments,
        completed,
        
        cancelled,
        completionRate: completionRate.toFixed(2) + "%",
        cancellationRate: cancellationRate.toFixed(2) + "%",
        avgRating: avgRating.toFixed(2),
      },
      feedbackAnalysis: {
        totalFeedbacks: feedbacks.length,
        positive, negative, neutral,
        keywords,
      },
      cancellationInsights: {
        totalCancelled: cancelled,
        commonReasons: cancelKeywords,
      },
      specializationComparison: {
        avgRating: specializationAvgRating.toFixed(2),
        avgCompletionRate: specializationAvgCompletionRate.toFixed(2),
        avgCancellationRate: specializationAvgCancellationRate.toFixed(2),
      },
      aiInsights: parsedResponse,
      modelUsed: model
    });

  } catch (error) {
    console.error("❌ Doctor Insights Error:", error.message);
    res.status(500).json({ message: "Server Error", error: error.message });
  }
};





// 🟢 Update Doctor Profile (including password)
export const updateDoctorProfile = async (req, res) => {
  try {
    const doctorId = req.params.id;

    const { 
      name, specialization, qualifications, experience, email, phone, 
      gender,  availableDays, availableTime, password,
      // address fields separately
      city, state, country, pincode 
    } = req.body;

    // doctor find karo
    const doctor = await Doctor.findById(doctorId);
    if (!doctor) {
      return res.status(404).json({ success: false, message: "Doctor not found" });
    }
  let avatarUrl = "";
    if (req.file) {
      const base64Str = req.file.buffer.toString("base64");
      const dataUri = `data:${req.file.mimetype};base64,${base64Str}`;
      const result = await cloudinary.uploader.upload(dataUri, {
        folder: "user-profiles",
        width: 400, height: 400, crop: "limit",
        fetch_format: "auto", quality: "auto",
      });
      avatarUrl = result.secure_url;
    }
    // ✅ Normal profile fields update
    if (name) doctor.name = name;
    if (specialization) doctor.specialization = specialization;
    if (qualifications) doctor.qualifications = qualifications;
    if (experience) doctor.experience = experience;
    if (email) doctor.email = email;
    if (phone) doctor.phone = phone;
    if (gender) doctor.gender = gender;
    if (avatarUrl) doctor.avatar = avatarUrl;
    if (availableDays) doctor.availableDays = availableDays;
    if (availableTime) doctor.availableTime = availableTime;

    // ✅ Address update (nested object)
    if (city) doctor.address.city = city;
    if (state) doctor.address.state = state;
    if (country) doctor.address.country = country;
    if (pincode) doctor.address.pincode = pincode;

    // ✅ Password update (secure)
    if (password) {
      const salt = await bcrypt.genSalt(10);
      doctor.password = await bcrypt.hash(password, salt);
    }

    await doctor.save();

    res.status(200).json({
      success: true,
      message: "Profile updated successfully",
      doctor,
    });
  } catch (error) {
    console.error("Update profile error:", error);
    res.status(500).json({ success: false, message: "Server error" });
  }
};

    