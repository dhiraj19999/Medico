import Report from "../models/UploadReport.js";
import Tesseract from "tesseract.js";














import pdfExtract from "pdf-extraction";

export const uploadReport = async (req, res) => {
  try {
    if (!req.file) return res.status(400).json({ error: "No file uploaded" });

    let extractedText = "";

    if (req.file.mimetype === "application/pdf") {
  const data = await pdfExtract(req.file.buffer);
  extractedText = data.text || "";
} else if (req.file.mimetype.startsWith("image/")) {
      // OCR for images using Tesseract
      const { data: { text } } = await Tesseract.recognize(req.file.buffer, "eng");
      extractedText = text || "";
    } else {
      return res.status(400).json({ error: "Only PDF or image files allowed" });
    }

    if (!extractedText || extractedText.trim().length < 20) {
      return res.status(400).json({ error: "Extracted text too short for summary" });
    }
const maxLength = 1000; // ya 1500 characters, experiment kar
const trimmedText = extractedText.length > maxLength ? extractedText.slice(0, maxLength) : extractedText;
    // Call HF API for summary
    //const prompt = `Summarize this medical report in clear, well-formatted English without newline characters:\n\n${extractedText}`;
const prompt = `${trimmedText}\n\nSummarize this medical report in clear English without newline characters:`;



   /* const hfResponse = await fetch(
      "https://api-inference.huggingface.co/models/facebook/bart-large-cnn",
      {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.HUGGINGFACE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          inputs: prompt,
          parameters: {
            max_new_tokens: 150,
            do_sample: false,
          },
        }),
      }
    );
*/



const response = await fetch("https://openrouter.ai/api/v1/chat/completions", {
  method: "POST",
  headers: {
    "Content-Type": "application/json",
    Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
  },
  body: JSON.stringify({
    model: "gpt-4o-mini", // ya koi aur supported model
    messages: [
      {
        role: "system",
        content: "You are a helpful medical report summarizer.",
      },
      {
        role: "user",
        content: `You are a medical report summarizer. Summarize the following medical report clearly and concisely in well-formatted English without newline characters. Include the following details if available: patient’s name, age, sex, blood group, known diseases, hospital name, doctor’s name, purpose of the report, and other key medical information.

Additionally, highlight the patient’s medical history and any relevant past conditions or treatments. Include important lab values, test results, and diagnostic findings. Extract and emphasize the final clinical context such as diagnosis, current condition, prognosis, and any urgent medical recommendations or alerts.

Begin the summary with a clear header stating the report’s name or purpose. Ensure the summary is easy to understand and provides a complete overview, so that the user can grasp the essence of the report without reading the full document, Provide the summary in a structured, pointwise format with clear headers for each section. 

Medical report text:
${trimmedText}`,
      },
    ],
    max_tokens: 300,
  }),
});

const data = await response.json();
const summary = data.choices[0].message.content;
console.log(summary);


   if(data.error) {
     console.error("OpenRouter API Error:", data.error);
     return res.status(500).json({ error: "Failed to generate summary" });
   }  

    // Save to DB
    const report = new Report({
      userId: req.user.id,
      filename: req.file.originalname,
      contentType: req.file.mimetype,
      summary,
      file: req.file.buffer,
    });

    await report.save();

    res.json({ message: "Report uploaded successfully", reportId: report._id });
  } catch (err) {
    console.error("Upload Error:", err);
    res.status(500).json({ error: "Failed to upload report" });
  }
};




export const getUserReports = async (req, res) => {
  try {
    const reports = await Report.find({ userId: req.user.id })
      .select("_id filename summary  createdAt");
    res.json(reports);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Failed to fetch reports" });
  }
};

/*export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    res.set({
      "Content-Type": report.contentType,
      "Content-Disposition": `attachment; filename="${report.filename}"`
    });

    res.send(report.file);
  } catch (err) {
    console.error(err);
    res.status(500).json({ error: "Download failed" });
  }
};*/

export const downloadReport = async (req, res) => {
  try {
    const report = await Report.findById(req.params.id);
    if (!report) return res.status(404).json({ error: "Report not found" });

    res.set({
      "Content-Type": report.contentType,
      "Content-Disposition": `attachment; filename="${report.filename}"`,
      "Content-Length": report.file.length,
    });

    // Correct way: directly send Buffer
    res.send(report.file);
  } catch (err) {
    console.error("Download error:", err);
    res.status(500).json({ error: "Download failed" });
  }
};


export const downloadReportSummary = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report by id and user to ensure authorization
    const report = await Report.findOne({ _id: reportId, userId: req.user.id }).select("summary filename");
console.log(report)
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

    // Prepare summary text as a downloadable file
    const fileName = report.filename.replace(/\.[^/.]+$/, "") + "_summary.txt";

    res.setHeader("Content-Disposition", `attachment; filename="${fileName}"`);
    res.setHeader("Content-Type", "text/plain");

    res.send(report.summary);

  } catch (err) {
    console.error("Download summary error:", err);
    res.status(500).json({ error: "Failed to download summary" });
  }
};


export const deleteReport = async (req, res) => {
  try {
    const reportId = req.params.id;

    // Find the report by id and user to ensure authorization
    const report = await Report.findByIdAndDelete(reportId);
    if (!report) {
      return res.status(404).json({ error: "Report not found" });
    }

   
    res.json({ message: "Report deleted successfully" });
  } catch (err) {
    console.error("Delete report error:", err);
    res.status(500).json({ error: "Failed to delete report" });
  }
};