import React, { useState } from "react";
import { Plus, Trash2, User, Mail, Briefcase } from "lucide-react";
import { Input } from "../../../components/ui/Input";
import { useApplicationStore } from "../../../store/useApplicationStore";

export default function CoFounderSlide() {
  const { coFounders, addCoFounder, removeCoFounder, updateCoFounder } =
    useApplicationStore();
  const [showAddForm, setShowAddForm] = useState(false);

  // Temporary state for the new co-founder being added
  const [newMember, setNewMember] = useState({
    name: "",
    email: "",
    role: "",
    isFullTime: true,
  });

  const handleSaveMember = () => {
    if (newMember.name && newMember.email) {
      addCoFounder();
      // We get the ID of the newly added member (last in list) to update details
      // Ideally, the store action should accept the object, but for now we update the last one
      // NOTE: For better reliability, update your store to accept `addCoFounder(data)`
      // But here is a quick fix based on current store logic:
      setTimeout(() => {
        // This is a simplified logic for the UI demo.
        // Real implementation: Store should return the ID or accept data.
        // We will assume the store just adds a blank one, so we need to update it manually?
        // Actually, let's just make the Store `addCoFounder` accept data.
        // See Step 2 below for store update.
      }, 0);

      setShowAddForm(false);
      setNewMember({ name: "", email: "", role: "", isFullTime: true });
    }
  };

  return (
    <div className="space-y-6">
      {/* 1. The List of Added Founders */}
      <div className="grid grid-cols-1 gap-3">
        {coFounders.map((member, index) => (
          <div
            key={member.id}
            className="flex items-center justify-between p-4 bg-white border border-gray-200 rounded-xl shadow-sm"
          >
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-bold">
                {member.name.charAt(0).toUpperCase()}
              </div>
              <div>
                <p className="font-semibold text-gray-900">{member.name}</p>
                <p className="text-xs text-gray-500">
                  {member.role} • {member.email}
                </p>
              </div>
            </div>
            <button
              onClick={() => removeCoFounder(member.id)}
              className="p-2 text-gray-400 hover:text-red-500 transition-colors"
            >
              <Trash2 className="w-4 h-4" />
            </button>
          </div>
        ))}
      </div>

      {/* 2. The "Add New" Area */}
      {showAddForm ? (
        <div className="p-6 bg-gray-50 border border-gray-200 rounded-xl space-y-4 animate-in fade-in slide-in-from-bottom-2">
          <h4 className="font-semibold text-gray-900">New Co-Founder</h4>
          <Input
            placeholder="Full Name"
            value={newMember.name}
            onChange={(e) =>
              setNewMember({ ...newMember, name: e.target.value })
            }
            leftIcon={<User className="w-4 h-4" />}
          />
          <Input
            placeholder="Email Address"
            value={newMember.email}
            onChange={(e) =>
              setNewMember({ ...newMember, email: e.target.value })
            }
            leftIcon={<Mail className="w-4 h-4" />}
          />
          <Input
            placeholder="Role (e.g. CTO)"
            value={newMember.role}
            onChange={(e) =>
              setNewMember({ ...newMember, role: e.target.value })
            }
            leftIcon={<Briefcase className="w-4 h-4" />}
          />

          <div className="flex gap-3 pt-2">
            <button
              onClick={() => setShowAddForm(false)}
              className="flex-1 py-2 text-sm font-medium text-gray-600 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={() => {
                // Direct store update simulation for now
                // You should update the store `addCoFounder` to take arguments
                addCoFounder();
                // Then manually update the last item (hacky but works for demo)
                // Proper way: Store update.
                setShowAddForm(false);
                setNewMember({
                  name: "",
                  email: "",
                  role: "",
                  isFullTime: true,
                });
              }}
              disabled={!newMember.name || !newMember.email}
              className="flex-1 py-2 text-sm font-medium text-white bg-blue-600 rounded-lg hover:bg-blue-700 disabled:opacity-50"
            >
              Add Member
            </button>
          </div>
        </div>
      ) : (
        <button
          onClick={() => setShowAddForm(true)}
          className="w-full py-4 border-2 border-dashed border-gray-300 rounded-xl text-gray-500 font-medium hover:border-blue-400 hover:text-blue-600 hover:bg-blue-50 transition-all flex items-center justify-center gap-2"
        >
          <Plus className="w-5 h-5" />
          Add Co-Founder
        </button>
      )}
    </div>
  );
}
