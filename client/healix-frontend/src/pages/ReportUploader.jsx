import React, { useState, useEffect, useRef } from "react";
import axiosInstance from "../api/Api.js";
import { jsPDF } from "jspdf";
import { HashLoader } from "react-spinners";
import { toast } from "react-toastify";

// Skeleton loader block
const Skeleton = ({ className }) => (
  <div className={`bg-gray-300 animate-pulse rounded ${className}`} />
);

// CSS animation for cards
const styles = `
.card-hidden {
  opacity: 0;
  transform: translateY(40px);
}
.card-visible {
  opacity: 1;
  transform: translateY(0);
  transition: opacity 0.8s ease, transform 0.8s ease;
}
`;

const override = {
  display: "block",
  borderColor: "teal",
  margin: "0 auto",
};

export default function ReportUploader() {
  const [file, setFile] = useState(null);
  const [reports, setReports] = useState([]);
  const [loading, setLoading] = useState(false);
  const [loadingInitial, setLoadingInitial] = useState(true); // For initial fetch loading
  const [message, setMessage] = useState("");
  const cardsRef = useRef([]);
  const [buttonload,setButtonload]=useState({type:"",id:""})

  useEffect(() => {
    fetchReports();
  }, []);


const deleteReport = async (id) => {
  setButtonload({type:"delete",id:id})
  try {
    await axiosInstance.delete(`/reports/${id}`);
    toast.success("✅ Report deleted successfully!", {
      icon: "🚀",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
    fetchReports();
    setButtonload("")
  } catch (error) {
    console.error("Delete failed:", error);
    toast.error("❌ Failed to delete the report. Please try again.", {
      icon: "⚠️",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
     setButtonload("")
  }
};

  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach((entry, i) => {
          if (entry.isIntersecting) {
            setTimeout(() => {
              entry.target.classList.add("card-visible");
            }, i * 150);
            observer.unobserve(entry.target);
          }
        });
      },
      { threshold: 0.2 }
    );

    cardsRef.current.forEach((card) => {
      if (card) {
        card.classList.add("card-hidden");
        observer.observe(card);
      }
    });

    return () => observer.disconnect();
  }, [reports]);

  const fetchReports = async () => {
    try {
      const res = await axiosInstance.get("/reports");
      setReports(res.data);
      setMessage("");
    } catch (err) {
      console.error(err);
      toast.error("Failed to fetch reports", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    }
    setLoadingInitial(false);
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    setButtonload("upload");
    if (!file) return alert("Please select a file!");

    const formData = new FormData();
    formData.append("file", file);

    setLoading(true);
    setMessage("");

    try {
      await axiosInstance.post("/reports/upload", formData, {
        headers: { "Content-Type": "multipart/form-data" },
      });
      toast.success("✅ Report uploaded successfully!", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      setFile(null);
      fetchReports();
       setButtonload("")
    } catch (err) {
      console.error(err);
      toast.error(err.response?.data?.message || "❌ Upload failed!", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
    }
    setLoading(false);
     setButtonload("")
  };

  const downloadReport = async (id) => {
    setButtonload({type:"original",id:id});
    try {
      const res = await axiosInstance.get(`/reports/download/${id}`, {
        responseType: "blob",
      });

      const url = window.URL.createObjectURL(new Blob([res.data]));
      const link = document.createElement("a");
      link.href = url;
      link.setAttribute("download", `report_${id}.pdf`);
      document.body.appendChild(link);
      link.click();
      link.remove();
      window.URL.revokeObjectURL(url);

      toast.success("✅ Report downloaded successfully!", {
        icon: "🚀",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
       setButtonload("")
    } catch (error) {
      console.error("Download failed:", error);
      toast.error("❌ Failed to download the report. Please try again.", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
       setButtonload("")
    }
  };

  const downloadSummaryAsPDF = (summaryText, filename) => {
    const doc = new jsPDF();
    doc.setFontSize(12);
    const splitText = doc.splitTextToSize(summaryText, 180);
    doc.text(splitText, 10, 10);
    doc.save(filename || "summary.pdf");
    toast.success("✅ Summary downloaded successfully!", {
      icon: "🚀",
      style: { fontSize: "1rem", fontWeight: "bold" },
    });
  };

  const downloadSummary = async (id, filename) => {
    setButtonload({type:"summary",id:id});
    try {
      const res = await axiosInstance.get(`/reports/summary/${id}`, {
        responseType: "text",
      });
      downloadSummaryAsPDF(res.data, filename.replace(/\.[^/.]+$/, "") + "_summary.pdf");
      setButtonload("")
    } catch (error) {
      console.error("Failed to download summary PDF", error);
      toast.error("❌ Failed to download summary", {
        icon: "⚠️",
        style: { fontSize: "1rem", fontWeight: "bold" },
      });
      setButtonload("")
    }
  };

  // Skeleton card component with spacing so cards don't collapse
  const SkeletonCard = () => (
    <div
      className="bg-white rounded-xl border border-gray-300 shadow-md p-6 mb-6 flex flex-col justify-between"
      style={{ maxHeight: "220px" }}
    >
      <Skeleton className="h-6 w-3/4 rounded mb-3" />
      <Skeleton className="h-4 w-full rounded mb-1" />
      <Skeleton className="h-4 w-full rounded mb-1" />
      <Skeleton className="h-4 w-5/6 rounded mb-4" />
      <div className="flex space-x-4">
        <Skeleton className="h-10 flex-1 rounded" />
        <Skeleton className="h-10 flex-1 rounded" />
      </div>
    </div>
  );

  // Skeleton form component
  const SkeletonForm = () => (
    <form className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-teal-500">
      <Skeleton className="h-12 w-full rounded-lg mb-4" />
      <Skeleton className="h-10 w-full rounded-lg" />
    </form>
  );

  return (
    <div className="min-h-screen bg-gradient-to-br  flex flex-col items-center p-6">
      <style>{styles}</style>

      <h1 className="text-3xl font-bold mb-6 text-gray-800">📄 Upload Your Digital  Medical Report</h1>

      {(loadingInitial ) ? (
        <SkeletonForm />
      ) : (
        <form
          onSubmit={handleUpload}
          className="bg-white shadow-lg rounded-2xl p-6 w-full max-w-lg border border-teal-500"
        >
          <input
            type="file"
            accept=".pdf,image/*"
            onChange={(e) => setFile(e.target.files[0])}
            className="block w-full text-gray-700 border border-gray-300 rounded-lg p-2 mb-4"
            disabled={loading}
          />

          <button
            type="submit"
            disabled={loading}
            className={
              loading
                ? "w-full from-green-100 to-teal-100 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300"
                : "w-full bg-teal-600 hover:bg-teal-700 text-white font-semibold py-2 px-4 rounded-lg shadow transition-colors duration-300"
            }
          >
            {loading ? <HashLoader color="teal" size={30} cssOverride={override} /> : "Upload Report"}
          </button>

          {message && <p className="mt-3 text-center text-gray-800">{message}</p>}
        </form>
      )}

      <div className="mt-10 w-full max-w-4xl">
        <h2 className="text-2xl font-semibold mb-6 text-gray-800">📚 Your Reports</h2>

        {loadingInitial ? (
           
         <div className="grid md:grid-cols-2 gap-6">
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
      <SkeletonCard />
    </div>
        ) : reports.length === 0 ? (
          <p className="text-center text-gray-700">No reports found.</p>
        ) : (
          <div className="grid md:grid-cols-2 gap-6">
            {reports.map((report, idx) => (
              <div
                key={report._id}
                ref={(el) => (cardsRef.current[idx] = el)}
                className="bg-white rounded-xl border border-gray-300 shadow-md p-6 flex flex-col justify-between
                           transition-all duration-500 cursor-pointer hover:-translate-y-2 hover:scale-[1.02] hover:shadow-xl card-hidden"
                style={{ maxHeight: "220px" }}
              >
                <div className="mb-3">
                  <h3 className="font-semibold text-lg truncate">{report.filename}</h3>
                  <p
                    className="text-sm text-gray-600 mt-2 overflow-y-auto max-h-24"
                    style={{ whiteSpace: "pre-wrap" }}
                  >
                    {report.summary}
                  </p>
                </div>

   <div className="grid grid-cols-3 gap-2 mt-1">
  <button
    onClick={() => downloadReport(report._id)}
    className={`${buttonload.type=="original"&&buttonload.id==report._id?"from-green-100 to-teal-100":"bg-teal-500 hover:bg-teal-600"} text-white px-2 py-2 rounded shadow transition-colors duration-300 text-sm`}
    title="Download Original Report"
  >
      {buttonload.type=="original"&&buttonload.id==report._id?<HashLoader color="teal" size={30} cssOverride={override} />:"⬇ Original"}
  </button>

  <button
    onClick={() => downloadSummary(report._id, report.filename)}
    className={`${buttonload.type=="summary"&&buttonload.id==report._id?"from-green-100 to-teal-100":"bg-teal-500 hover:bg-teal-600"} text-white px-2 py-2 rounded shadow transition-colors duration-300 text-sm`}
    title="Download Summary"
  >
   
   
  { buttonload.type=="summary"&&buttonload.id==report._id?<HashLoader color="teal" size={30} cssOverride={override} />:  "📝 Summary" }
  </button>

  <button
    onClick={() => deleteReport(report._id)}
    className={`${buttonload.type=="delete"&&buttonload.id==report._id?"from-green-100 to-teal-100":"bg-red-500 hover:bg-red-600"} text-white px-2 py-2 rounded shadow transition-colors duration-300 text-sm`}
    title="Delete Report"
  >
    {buttonload.type=="delete"&&buttonload.id==report._id?<HashLoader color="teal" size={30} cssOverride={override} />:" 🗑 Delete"}
  </button>
</div>


               
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}
