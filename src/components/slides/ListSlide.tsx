import React, { useState } from "react";
import { Plus, Trash2, User, Mail, Briefcase, Check } from "lucide-react";
import { Input } from "../ui/Input";
import { useApplicationStore } from "../../store/useApplicationStore";

export default function ListSlide() {
  const { coFounders, addCoFounder, removeCoFounder, updateCoFounder } =
    useApplicationStore();
  const [showAddForm, setShowAddForm] = useState(false);
  const [temp, setTemp] = useState({ name: "", email: "", role: "" });

  const handleSave = () => {
    if (temp.name && temp.email) {
      addCoFounder();
      // Update the newly added item (last one)
      setTimeout(() => {
        const id = useApplicationStore.getState().coFounders.slice(-1)[0]?.id;
        if (id) updateCoFounder(id, temp);
      }, 0);
      setTemp({ name: "", email: "", role: "" });
      setShowAddForm(false);
    }
  };

  return (
    <div className="space-y-4">
      {/* Existing List */}
      <div className="grid gap-3">
        {coFounders.map((member) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-4">
              <div className="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-bold text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">
                  {member.role} • {member.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeCoFounder(member.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-5 h-5" />
            </button>
          </div>
        ))}
      </div>

      {/* Add Form */}
      {showAddForm ? (
        <div className="p-5 bg-gray-50 border border-gray-200 rounded-xl space-y-3 animate-in fade-in zoom-in-95">
          <h4 className="font-semibold text-gray-900">New Co-Founder</h4>
          <Input
            placeholder="Name"
            value={temp.name}
            onChange={(e) => setTemp({ ...temp, name: e.target.value })}
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            placeholder="Email"
            value={temp.email}
            onChange={(e) => setTemp({ ...temp, email: e.target.value })}
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            placeholder="Role"
            value={temp.role}
            onChange={(e) => setTemp({ ...temp, role: e.target.value })}
            leftIcon={<Briefcase className="w-4 h-4" />}
          />
          <div className="flex gap-2 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 text-gray-600 bg-white border border-gray-300 rounded-lg"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              className="flex-1 py-2 text-white bg-blue-600 rounded-lg hover:bg-blue-700 flex items-center justify-center gap-2"
            >
              <Check className="w-4 h-4" /> Add
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-500 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" /> Add Co-Founder
        </button>
      )}
    </div>
  );
}
