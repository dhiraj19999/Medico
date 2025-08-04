import axios from "axios";
import HealthReport from "../models/HealthReport.js";
import Appointment from "../models/Appointment.js";
import path from "path";
import fs from "fs";
import User from "../models/User.js";
import PDFDocument from "pdfkit";
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import dayjs from "dayjs";
import { config } from "dotenv";
config();

/*export const analyzeHealthRisk = async (req, res) => {
  try {
    const {
      age,
      gender,
      bp,
      sugar,
      cholesterol,
      heartRate,
      weight,
      height,
      symptoms,
    } = req.body;
    const user = req.user._id;

    const prompt = `
User's Health Details:
- Age: ${age}
- Gender: ${gender}
- BP: ${bp}
- Sugar: ${sugar}
- Cholesterol: ${cholesterol}
- Heart Rate: ${heartRate}
- Weight: ${weight}
- Height: ${height}
- Symptoms: ${symptoms}

Give a friendly and clear health risk analysis with lifestyle tips. Reply in the same language (including Roman Hindi) as symptoms: "${symptoms}".
`;

    const models = [
      "openai/gpt-3.5-turbo",
      "mistralai/mistral-7b-instruct",
      "google/gemma-7b-it",
      "mistralai/mixtral-8x7b-instruct",
    ];

    let aiResponse = "Sorry, we couldn't analyze your data.";
    for (let model of models) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        aiResponse = response.data.choices?.[0]?.message?.content?.trim();
        if (aiResponse) break;
      } catch (e) {
        continue;
      }
    }

    // Clean up response text
   aiResponse = aiResponse
  .replace(/\\n/g, "\n")
  .replace(/\n/g, " ")
  .replace(/\s+/g, " ")          // collapse extra spaces
  .replace(/\\'/g, "'")
  .replace(/\\"/g, '"')
  .replace(/\\\\/g, "\\")
  .trim();

    // Save to MongoDB
    const newReport = new HealthReport({
      user,
      age,
      gender,
      bp,
      sugar,
      cholesterol,
      heartRate,
      weight,
      height,
      symptoms,
      riskResult: aiResponse,
    });

    await newReport.save();

    res.json({ success: true, result: aiResponse });
  } catch (err) {
    console.error("Health Risk Error:", err.message);
    res.status(500).json({ error: "Failed to analyze health risk." });
  }
};
*/

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);







export const analyzeHealthRisk = async (req, res) => {
  try {
    const {
      age,
      gender,
      bp,
      sugar,
      cholesterol,
      heartRate,
      weight,
      height,
      symptoms,
    } = req.body;
    const user = req.user._id;

    // Fetch appointment history
    const appointments = await Appointment.find({ user }).sort({ date: 1 });

    // Extract reasons and calculate gaps
    const reasons = [];
    const dateGaps = [];

    for (let i = 0; i < appointments.length; i++) {
      const reason = appointments[i].reason;
      if (reason) reasons.push(reason);

      if (i > 0) {
        const prevDate = dayjs(appointments[i - 1].date);
        const currentDate = dayjs(appointments[i].date);
        const gap = currentDate.diff(prevDate, "day");
        dateGaps.push(gap);
      }
    }

    const avgGap = dateGaps.length
      ? Math.round(dateGaps.reduce((a, b) => a + b, 0) / dateGaps.length)
      : "N/A";

    const reasonSummary = reasons.length
      ? reasons.join(", ")
      : "No previous reasons recorded";

    const appointmentHistorySummary = `
User's Past Appointment Summary:
- Number of Appointments: ${appointments.length}
- Common Reasons: ${reasonSummary}
- Avg Gap Between Visits: ${avgGap} days
`;

    // Final Prompt
    const prompt = `
User's Health Details:
- Age: ${age}
- Gender: ${gender}
- BP: ${bp}
- Sugar: ${sugar}
- Cholesterol: ${cholesterol}
- Heart Rate: ${heartRate}
- Weight: ${weight}
- Height: ${height}
- Symptoms: ${symptoms}

${appointmentHistorySummary}

Based on all the above, provide a clear health risk analysis. Mention if user has recurring symptoms or shows any improvement based on appointment history. Use a friendly tone and give lifestyle tips.

Respond in the same language as: "${symptoms}"
`;

    const models = [
      "openai/gpt-3.5-turbo",
      "mistralai/mistral-7b-instruct",
      "google/gemma-7b-it",
      "mistralai/mixtral-8x7b-instruct",
    ];

    let aiResponse = "Sorry, we couldn't analyze your data.";
    for (let model of models) {
      try {
        const response = await axios.post(
          "https://openrouter.ai/api/v1/chat/completions",
          {
            model,
            messages: [{ role: "user", content: prompt }],
          },
          {
            headers: {
              Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
              "Content-Type": "application/json",
            },
          }
        );

        aiResponse = response.data.choices?.[0]?.message?.content?.trim();
        if (aiResponse) break;
      } catch (e) {
        continue;
      }
    }

    // Clean response
    aiResponse = aiResponse
      .replace(/\\n/g, " ")
      .replace(/\n/g, " ")
      .replace(/\s+/g, " ")
      .replace(/\\'/g, "'")
      .replace(/\\"/g, '"')
      .replace(/\\\\/g, "\\")
      .trim();

    // Save Report
    const newReport = new HealthReport({
      user,
      age,
      gender,
      bp,
      sugar,
      cholesterol,
      heartRate,
      weight,
      height,
      symptoms,
      riskResult: aiResponse,
    });

    await newReport.save();

    res.json({ success: true, result: aiResponse });
  } catch (err) {
    console.error("Health Risk Error:", err.message);
    res.status(500).json({ error: "Failed to analyze health risk." });
  }
};















export const getHealthReports = async (req, res) => {
  try {
    const reports = await HealthReport.find({ user: req.user._id })
      
      .sort({ date: -1 });

    res.json(reports);
  } catch (err) {
    res.status(500).json({ message: err.message });
  }
};

export const getHealthTrends = async (req, res) => {
  try {
    const userId = req.user._id;

    const reports = await HealthReport.find({ user: userId });

    if (reports.length === 0) {
      return res.status(404).json({ message: "No health reports found." });
    }

    // Helper to extract numeric BP
    const parseBP = (bpStr) => {
      const match = bpStr?.match(/(\d{2,3})\/(\d{2,3})/);
      return match ? [parseInt(match[1]), parseInt(match[2])] : [0, 0];
    };

    let totalSys = 0,
      totalDia = 0,
      totalSugar = 0,
      totalCholesterol = 0,
      totalHeartRate = 0,
      totalWeight = 0,
      totalHeight = 0;

    reports.forEach((r) => {
      const [sys, dia] = parseBP(r.bp);
      totalSys += sys;
      totalDia += dia;
      totalSugar += parseFloat(r.sugar) || 0;
      totalCholesterol += parseFloat(r.cholesterol) || 0;
      totalHeartRate += parseFloat(r.heartRate) || 0;
      totalWeight += parseFloat(r.weight) || 0;
      totalHeight += parseFloat(r.height) || 0;
    });

    const count = reports.length;

    const avgSys = Math.round(totalSys / count);
    const avgDia = Math.round(totalDia / count);
    const avgSugar = Math.round(totalSugar / count);
    const avgCholesterol = Math.round(totalCholesterol / count);
    const avgHeartRate = Math.round(totalHeartRate / count);
    const avgWeight = Math.round(totalWeight / count);
    const avgHeight = Math.round(totalHeight / count);

    const bmi = avgWeight / ((avgHeight / 100) ** 2);
    const bmiRounded = +bmi.toFixed(1);

    // 🔴🟢 Flags
    const flags = {
      bp: avgSys > 130 || avgDia > 85 ? "red" : "green",
      sugar: avgSugar > 125 ? "red" : "green",
      cholesterol: avgCholesterol > 200 ? "red" : "green",
      heartRate: avgHeartRate < 60 || avgHeartRate > 100 ? "red" : "green",
      bmi: bmiRounded < 18.5 || bmiRounded > 25 ? "red" : "green",
    };

    const summary = generateSummary(flags);

    res.json({
      avgBP: `${avgSys}/${avgDia}`,
      avgSugar,
      avgCholesterol,
      avgHeartRate,
      avgWeight,
      avgHeight,
      bmi: bmiRounded,
      healthFlags: flags,
      summary,
    });

  } catch (err) {
    console.error("Health Trends Error:", err.message);
    res.status(500).json({ error: "Failed to get health trends." });
  }
};

// Optional: simple rule-based summary
function generateSummary(flags) {
  const risks = Object.entries(flags)
    .filter(([key, value]) => value === "red")
    .map(([key]) => key);

  if (risks.length === 0) {
    return "All your health parameters are within normal range. Great job!";
  }

  return `Some parameters need attention: ${risks.join(", ")}. Please consult a doctor and follow a healthy lifestyle.`;
}



/*export const getHealthReportPdfById = async (req, res) => {

  try {
    const { reportId } = req.params;
    const userId = req.user._id;

    const report = await HealthReport.findOne({ _id: reportId, user: userId }).lean();

    if (!report) {
      return res.status(404).json({ error: "Health report not found." });
    }

    // Set headers for PDF response
    res.setHeader("Content-Type", "application/pdf");
    res.setHeader(
      "Content-Disposition",
      `attachment; filename=health_report_${reportId}.pdf`
    );

    const doc = new PDFDocument();
    doc.pipe(res);

    doc.fontSize(18).text("🩺 Personal Health Report", { align: "center" });
    doc.moveDown();

    const entries = {
      Age: report.age,
      Gender: report.gender,
      BP: report.bp,
      Sugar: report.sugar,
      Cholesterol: report.cholesterol,
      "Heart Rate": report.heartRate,
      Weight: report.weight,
      Height: report.height,
      Symptoms: report.symptoms,
      "Risk Analysis": report.riskResult,
      "Generated On": new Date(report.createdAt).toLocaleString(),
    };

    for (const [key, value] of Object.entries(entries)) {
      doc.fontSize(12).text(`${key}: ${value}`);
      doc.moveDown(0.5);
    }

    doc.end();
  } catch (err) {
    console.error("PDF by ID error:", err.message);
    res.status(500).json({ error: "Failed to generate PDF." });
  }
};
*/



