import React from "react";
import { X } from "lucide-react";

const EditProfileModal = ({ formData, setFormData, errors, setErrors, onClose, onSave, saving }) => {
  return (
    <div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-40 z-50">
      <div className="bg-white w-full max-w-md rounded-2xl shadow-lg p-6 relative">
        <button onClick={onClose} className="absolute top-3 right-3 text-slate-500 hover:text-slate-700">
          <X className="w-5 h-5" />
        </button>
        <h2 className="text-xl font-semibold mb-4">Edit Profile</h2>
        <div className="space-y-4">
          {["name", "username", "bio", "location"].map((field) => (
            <div key={field}>
              <label className="block text-sm font-medium text-slate-700">
                {field.charAt(0).toUpperCase() + field.slice(1)}
              </label>
              {field === "bio" ? (
                <textarea
                  value={formData[field] || ""}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  rows={3}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors[field] ? "border-red-500" : ""
                  }`}
                />
              ) : (
                <input
                  type="text"
                  value={formData[field] || ""}
                  onChange={(e) => setFormData({ ...formData, [field]: e.target.value })}
                  className={`w-full mt-1 px-3 py-2 border rounded-lg focus:ring-2 focus:ring-indigo-500 ${
                    errors[field] ? "border-red-500" : ""
                  }`}
                />
              )}
              {errors[field] && <p className="text-red-500 text-sm mt-1">{errors[field]}</p>}
            </div>
          ))}
        </div>
        <div className="flex justify-end gap-3 mt-6">
          <button onClick={onClose} className="px-4 py-2 rounded-lg border text-slate-600 hover:bg-slate-50">
            Cancel
          </button>
          <button
            onClick={onSave}
            disabled={saving}
            className="px-4 py-2 rounded-lg bg-indigo-600 text-white hover:bg-indigo-700 disabled:opacity-50"
          >
            {saving ? "Saving..." : "Save"}
          </button>
        </div>
      </div>
    </div>
  );
};

export default EditProfileModal;
