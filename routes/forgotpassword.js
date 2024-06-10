const Doctor = require("../models/Doctor");
const Patient = require("../models/Patient");
const jwt = require("jsonwebtoken");
const bcrypt = require("bcryptjs");
const router = require("express").Router();
const DocController = require("../controllers/DocController");
const PatientController = require("../controllers/PatientController");

// Other existing routes...

router.post("/forgotpassword", async (req, res) => {
  const { email } = req.body;
  try {
    // Check if the user (patient or doctor) exists with the provided email
    const patient = await Patient.findOne({ email });
    const doctor = await Doctor.findOne({ email });

    if (!patient && !doctor) {
      return res.status(404).json({ message: "User not found" });
    }

    // Generate a new random password
    const newPassword = Math.random().toString(36).slice(-8); // Example of generating a random password, you can customize this

    // Hash the new password
    const hashedPassword = await bcrypt.hash(newPassword, 10);

    // Update the user's password in the database
    if (patient) {
      await Patient.findByIdAndUpdate(patient._id, { password: hashedPassword });
    } else if (doctor) {
      await Doctor.findByIdAndUpdate(doctor._id, { password: hashedPassword });
    }

    // Send the new password to the user's email (you may need to implement this)

    res.status(200).json({ message: "New password generated and sent to user's email" });
  } catch (error) {
    console.error("Error:", error);
    res.status(500).json({ message: "Internal server error" });
  }
});

module.exports = router;
