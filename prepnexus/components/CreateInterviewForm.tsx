"use client";

import React, { useState } from 'react';
import Alert from "@/components/Alert";
import { useRouter } from 'next/navigation';

const CreateInterview = ({ userId }: { userId: string }) => {
  const [loading, setLoading] = useState(false);
  const [alert, setAlert] = useState<{ message: string; type: "success" | "error" } | null>(null);
  
  const [formData, setFormData] = useState({
    company: '',
    role: '',
    level: '',
    type: '',
    amount: '',
    techstack: '',
  });

  const router = useRouter();

  const handleChange = (e) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);

    const payload = {
      ...formData,
      amount: Number(formData.amount),
      techstack: formData.techstack,
      userid: userId,
    };

    console.log("Sending payload:", payload);

    try {
      const response = await fetch("http://localhost:3000/api/vapi/generate", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!response.ok) {
        throw new Error("Failed to create interview");
      }

      const result = await response.json();
      if (result.success) {
        setAlert({ message: "Interview created successfully!", type: "success" });

        setTimeout(() => {
          router.push('/');
        }, 900);
      } else {
        setAlert({ message: "Failed to create interview.", type: "error" });
      }
    } catch (error) {
      console.error("Error creating interview:", error);
      setAlert({ message: "Error creating interview. Please try again.", type: "error" });
    } finally {
      setLoading(false); 
      setTimeout(() => setAlert(null), 3000);
    }
  };

  return (
    <div className="bg-white h-140 rounded-lg flex items-center shadow-md justify-center p-4">
      <div className="bg-white w-full max-w-3xl p-4">
        {alert && <Alert message={alert.message} type={alert.type} />}
        <h2 className="text-2xl font-bold mb-8 text-center text-black">
          Create Interview
        </h2>

        <form onSubmit={handleSubmit} className="grid grid-cols-1 md:grid-cols-2 gap-x-6 gap-y-6">
          {/* Company */}
          <div>
            <label className="block text-black mb-1 font-medium">Company</label>
            <select
              name="company"
              value={formData.company}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Select</option>
              <option value="Adobe">Adobe</option>
              <option value="Amazon">Amazon</option>
              <option value="Facebook">Facebook</option>
              <option value="Google">Google</option>
              <option value="Hostinger">Hostinger</option>
              <option value="LinkedIn">LinkedIn</option>
              <option value="Microsoft">Microsoft</option>
            </select>
          </div>

          {/* Role */}
          <div>
            <label className="block text-black mb-1 font-medium">Role</label>
            <select
              name="role"
              value={formData.role}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Select</option>
              <option value="Frontend">Frontend</option>
              <option value="Backend">Backend</option>
              <option value="Fullstack">Fullstack</option>
            </select>
          </div>

          {/* Level */}
          <div>
            <label className="block text-black mb-1 font-medium">Level</label>
            <select
              name="level"
              value={formData.level}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Select</option>
              <option value="Intern">Intern</option>
              <option value="Junior">Junior</option>
              <option value="Senior">Senior</option>
            </select>
          </div>

          {/* Type */}
          <div>
            <label className="block text-black mb-1 font-medium">Type</label>
            <select
              name="type"
              value={formData.type}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
            >
              <option value="">Select</option>
              <option value="DSA">DSA</option>
              <option value="System Design">System Design</option>
              <option value="Behavioral">Behavioral</option>
            </select>
          </div>

          {/* Amount of Questions */}
          <div>
            <label className="block text-black mb-1 font-medium">Amount of Questions</label>
            <input
              type="number"
              name="amount"
              value={formData.amount}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Enter"
            />
          </div>

          {/* Tech Stack */}
          <div>
            <label className="block text-black mb-1 font-medium">Tech Stack</label>
            <input
              type="text"
              name="techstack"
              value={formData.techstack}
              onChange={handleChange}
              className="w-full border border-gray-300 rounded-md px-4 py-2 text-black bg-white focus:outline-none focus:ring-2 focus:ring-primary-200"
              placeholder="Enter"
            />
          </div>

          {/* Submit Button */}
          <div className="col-span-1 md:col-span-2 flex justify-center mt-4">
            <button
              type="submit"
              className="bg-blue-600 hover:bg-blue-700 text-white font-semibold py-2 px-6 rounded-md"
              disabled={loading}
            >
              {loading ? 'Generating...' : 'Create'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
};

export default CreateInterview;
