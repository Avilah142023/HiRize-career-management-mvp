import User from "../models/user.js";

export const updateJobPreferences = async (req, res) => {
  try {
    const { jobTypes, workModes, location, availability } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.jobPreferences = {
      jobTypes,
      workModes,
      location,
      availability,
    };

    await user.save();

    res.json({ message: "Preferences saved successfully" });

  } catch (error) {
    console.error(error);
    res.status(500).json({ message: "Server error" });
  }
};