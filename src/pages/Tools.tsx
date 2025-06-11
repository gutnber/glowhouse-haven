// src/pages/Tools.tsx
import { LogoSettings } from "@/components/tools/LogoSettings";
import { FooterSettingsSection } from "@/components/tools/FooterSettingsSection";
import { WebhookSettings } from "@/components/tools/WebhookSettings";
import { NewsPostsSection } from "@/components/tools/NewsPostsSection";
import { Link } from "react-router-dom";

export default function Tools() {
  return (
    <div className="max-w-4xl mx-auto space-y-8 p-6">
      <h1 className="text-2xl font-bold mb-8">Tools</h1>
      
      <LogoSettings />
      <FooterSettingsSection />
      <WebhookSettings />
      <NewsPostsSection />

      <div className="bg-white shadow sm:rounded-lg">
        <div className="px-4 py-5 sm:p-6">
          {/* Changed title to be more encompassing */}
          <h2 className="text-xl font-semibold mb-4 text-gray-900">Workflow & User Management</h2>
          <div className="space-y-6">
            <div>
              <Link to="/admin/tasks" className="text-lg font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                Task Management
              </Link>
              <p className="mt-1 text-sm text-gray-600">Manage processes, task stages, tasks, and team assignments for efficient workflow.</p>
            </div>
            <hr className="border-gray-200" />
            <div>
              <Link to="/admin/leads" className="text-lg font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                Lead Management
              </Link>
              <p className="mt-1 text-sm text-gray-600">Track and manage property leads from various sources, assign statuses, and add notes.</p>
            </div>
            <hr className="border-gray-200" /> {/* Added separator */}
            <div>
              <Link to="/admin/teams" className="text-lg font-medium text-indigo-600 hover:text-indigo-800 hover:underline">
                Team Management
              </Link>
              <p className="mt-1 text-sm text-gray-600">Manage teams and team memberships, assign roles, and control access.</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
