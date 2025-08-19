// scheduler/autoCompleteAppointments.js
import cron from "node-cron";
import Appointment from "../models/Appointment.js";

// Har 1 minute me check karega
cron.schedule("* * * * *", async () => {
    console.log("cron runing")
  try {
    const now = new Date();
    
    // Today date in "YYYY-MM-DD" format (same as stored in DB)
    const todayDate = now.toISOString().split("T")[0];

    // Get current timestamp (for comparison)
    const nowTime = now.getTime();

    // Find all confirmed appointments of today
    const appointments = await Appointment.find({
      date: todayDate,
      status: "Confirmed",
    });

    // Collect IDs that should be marked as Completed
    const toCompleteIds = appointments
      .filter((appt) => {
        const apptTime = new Date(appt.time).getTime();
        const fiveMinutesAfter = apptTime + 5 * 60000;
        return nowTime >= fiveMinutesAfter;
      })
      .map((appt) => appt._id);

    if (toCompleteIds.length > 0) {
      await Appointment.updateMany(
        { _id: { $in: toCompleteIds } },
        { $set: { status: "Completed" } }
      );
      console.log(`✅ ${toCompleteIds.length} appointments auto-completed`);
    }
  } catch (error) {
    console.error("❌ Auto-complete error:", error.message);
  }
});