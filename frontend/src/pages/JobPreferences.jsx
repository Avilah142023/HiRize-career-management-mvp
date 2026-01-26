import React, { useState } from "react";

function JobPreferences() {
  const [jobTypes, setJobTypes] = useState([]);
  const [workModes, setWorkModes] = useState([]);
  const [availability, setAvailability] = useState("");
  const [location, setLocation] = useState("");

  const toggleSelect = (value, state, setState) => {
    setState(
      state.includes(value)
        ? state.filter((v) => v !== value)
        : [...state, value]
    );
  };
  

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-600 to-sky-900 p-6 flex items-center justify-center">
      <div className="flex-col max-w-full max-h-screen rounded-xl bg-gradient-to-br from-sky-200 to-sky-600 shadow-2xl relative z-10">

        {/* HEADER */}
        <div className="mb-2 mt-8 px-8 text-center">
        <h1 className="text-4xl font-bold text-gray-900 mb-3">
          What kind of job are you looking for?
        </h1><br></br>
        <p className="text-gray-700 text-xl font-medium text-italic">
          Select your preferences to help us find the right matches.
        </p>
        </div>
        {/* FORM */}
        <div className="space-y-6 px-8 pb-8">

        {/* JOB TYPE */}
        <div className="space-y-6 px-9 pb-9"></div>
        <section className="mb-8">
          <h3 className="font-semibold text-xl mb-4">Job Type</h3>
          <div className="flex flex-wrap text-lg  font-medium gap-3">
            {["Full-time", "Part-time", "Internship", "Contract"].map((type) => (
              <button
                key={type}
                onClick={() => toggleSelect(type, jobTypes, setJobTypes)}
                className={`px-5 py-2 rounded-3xl border transition
                  ${
                    jobTypes.includes(type)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-white"
                  }`}
              >
                {type}
              </button>
            ))}
          </div>
        </section>

        {/* WORK MODE */}
        <section className="mb-8">
          <h3 className="font-semibold text-xl mb-4">Work Mode</h3>
          <div className="flex flex-wrap text-lg font-medium gap-3">
            {["Remote", "Hybrid", "On-site"].map((mode) => (
              <button
                key={mode}
                onClick={() => toggleSelect(mode, workModes, setWorkModes)}
               className={`px-5 py-2 rounded-3xl border transition
                  ${
                    workModes.includes(mode)
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-white"
                  }`}
              >
                {mode}
              </button>
            ))}
          </div>
        </section>

        {/* LOCATION */}
        <section className="mb-8">
          <h3 className="font-semibold text-xl mb-4">Preferred Location</h3>
          <div className="flex items-center border rounded-3xl px-4 py-3">
            <span className="mr-1 text-2xl text-black">📍</span>
            <input
              type="text"
              placeholder="City, Country, or Remote"
              value={location}
              onChange={(e) => setLocation(e.target.value)}
              className="w-full outline-none text-xl font-medium  bg-white"
            />
          </div>
        </section>

        {/* AVAILABILITY */}
        <section className="mb-8">
          <h3 className="font-semibold text-xl mb-4">Availability</h3>
         <div className="flex flex-wrap text-lg font-medium gap-3">
            {["Immediate", "1 month", "3 months"].map((time) => (
              <button
                key={time}
                onClick={() => setAvailability(time)}
                className={`px-5 py-2 rounded-full border transition
                  ${
                    availability === time
                      ? "bg-black text-white border-black"
                      : "bg-white text-black border-white"
                  }`}
              >
                {time}
              </button>
            ))}
          </div>
        </section>

        {/* SUBMIT */}
        <button
          className="w-full bg-sky-900 text-white py-4 text-lg font-semibold rounded-2xl hover:bg-sky-950 transition-colors mt-8"
          onClick={() => {
            const data = {
              jobTypes,
              workModes,
              location,
              availability,
            };
            console.log("Job Preferences:", data);
            window.location.href = '/Dashboard';
          }}
        >
          Finish Setup
        </button>

      </div>
    </div>
    </div>
  );
}

export default JobPreferences;
