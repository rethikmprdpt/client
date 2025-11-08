import React from "react";
import { ShieldCheck } from "lucide-react";

const AuditDashboard = () => {
  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 flex items-center gap-3">
        <ShieldCheck /> Audit
      </h1>
      <p className="mt-4">This is the audit page.</p>
    </div>
  );
};

export default AuditDashboard;
