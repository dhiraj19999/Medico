import HealthReport from "../models/HealthReport.js";
import Appointment from "../models/Appointment.js";
import UploadReport from "../models/UploadReport.js";
import axios from "axios"

export const getAIHealthJourney = async (req, res) => {
  try {
     const userId = req.user._id;

    // 1️⃣ Fetch last 6 health reports
    const reports = await HealthReport.find({ user: userId })
      .sort({ createdAt: -1 })
      .limit(6);

    if (!reports || reports.length === 0) {
      return res.status(404).json({ message: "No health reports found." });
    }

    // 2️⃣ Fetch all appointments
    const appointments = await Appointment.find({ user: userId }).sort({ date: -1 }).limit(6);

    const uploads = await UploadReport.find({ userId: userId }).sort({ createdAt: -1 }).limit(6);

const sanitizedUploadedReports = uploads.map(u => {
  // Remove lines that contain patient identifiers
  const lines = u.summary.split("\n").filter(line => {
    const lower = line.toLowerCase();
    return !(
      lower.includes("name:") ||
      lower.includes("age:") ||
      lower.includes("sex:") ||
      lower.includes("blood group:") ||
      lower.includes("hospital") ||
      lower.includes("referring doctor")
    );
  });
  return {
    date: u.createdAt,
    summary: lines.join("\n"),
  };
});


    // 3️⃣ Prepare data for AI
    const userData = {
      appointments: appointments.map(a => ({
     
        reason: a.reason
    
      })),
      reports: reports.map(r => ({
        date: r.createdAt,
        bp: r.bp,
        sugar: r.sugar,
        cholesterol: r.cholesterol,
        heartRate: r.heartRate,
        weight: r.weight,
        height: r.height,
        symptoms: r.symptoms,
        riskResult: r.riskResult,
        BMI: (r.weight / ((r.height / 100) ** 2)).toFixed(1)
      })),
      uploadedReports: sanitizedUploadedReports.map(u => ({
       
        summary: u.summary
      })),
    };

      console.log(userData.uploadedReports)
console.log(userData.appointments)
   const prompt = `
You are a professional medical AI assistant.

Analyze the following user's health data, Ignore any patient-identifying info :

Appointments: ${JSON.stringify(userData.appointments)}
Health Reports: ${JSON.stringify(userData.reports)}
Uploaded Reports: ${JSON.stringify(userData.uploadedReports)}

Tasks:
1. Identify recurring symptoms with frequency across Appointments , Health Reports, and Uploaded Reports.
2. Analyze historical trends for each health metric (Blood Pressure, Sugar, Cholesterol, Heart Rate, Weight, Height, BMI) and also Analyze historical trends for Health Reports, Appointments, and Uploaded Reports to improve accuracy.
3. Highlight any missed follow-ups, concerning patterns, unusual values, or alerts from any data source.
4. Predict the next 3 months trend for each health metric.
5. Provide simple, practical preventive advice for each metric and recurring symptoms.
6. Flag any patterns that may require urgent medical attention.
7. Ensure Uploaded Reports, Appointments, and Health Reports are fully included in your analysis; do not ignore any information relevant to symptoms or health metrics.
8. Integrate insights from Appointments, Health Reports, and Uploaded Reports to produce a comprehensive and accurate assessment.

Instructions:
- Separate your output into 4 clear sections: Historical Observations, Trends, Predictions, Preventive Advice.
- Use concise, bullet-point format for easy reading.
- Use simple, encouraging, and non-medical language understandable by anyone.
- Avoid unnecessary medical jargon; explain in plain terms.
- Clearly indicate positive, neutral, or concerning trends.
- Focus on actionable insights that a user can easily understand and follow.
`;



    // 4️⃣ Call free AI model (Mistral via OpenRouter)
    const response = await axios.post(
      "https://openrouter.ai/api/v1/chat/completions",
      {
        model: "mistralai/mistral-7b-instruct",
        messages: [{ role: "user", content: prompt }],
      },
      {
        headers: {
          Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
        },
      }
    );

    const aiSummary = response.data.choices[0].message.content;

    // 5️⃣ Send response
    res.json({
      reports,
      appointments,
      aiSummary,
    });
  } catch (error) {
    console.error("AI Health Journey Error:", error);
    res.status(500).json({ error: "Failed to generate AI health summary." });
  }
};