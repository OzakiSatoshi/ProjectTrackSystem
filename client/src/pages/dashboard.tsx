import { useState } from "react";
import { Bell, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import ProjectStats from "@/components/project-stats";
import ProjectTable from "@/components/project-table";
import ProjectFormModal from "@/components/project-form-modal";
import ProjectViewModal from "@/components/project-view-modal";
import type { Anken } from "@shared/schema";

export default function Dashboard() {
  const [searchTerm, setSearchTerm] = useState("");
  const [statusFilter, setStatusFilter] = useState<string>("all");
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const [isViewModalOpen, setIsViewModalOpen] = useState(false);
  const [selectedProject, setSelectedProject] = useState<Anken | null>(null);

  const handleEdit = (project: Anken) => {
    setSelectedProject(project);
    setIsEditModalOpen(true);
  };

  const handleView = (project: Anken) => {
    setSelectedProject(project);
    setIsViewModalOpen(true);
  };

  const handleCloseModals = () => {
    setIsCreateModalOpen(false);
    setIsEditModalOpen(false);
    setIsViewModalOpen(false);
    setSelectedProject(null);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="flex items-center">
              <h1 className="text-xl font-bold text-gray-900">案件管理システム</h1>
              <nav className="hidden md:ml-8 md:flex md:space-x-8">
                <span className="text-primary font-medium px-3 py-2 rounded-md">案件一覧</span>
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md cursor-pointer">統計</span>
                <span className="text-gray-500 hover:text-gray-700 px-3 py-2 rounded-md cursor-pointer">設定</span>
              </nav>
            </div>
            <div className="flex items-center space-x-4">
              <Button variant="ghost" size="icon">
                <Bell className="h-5 w-5 text-gray-400" />
              </Button>
              <div className="flex items-center space-x-2">
                <Avatar className="h-8 w-8">
                  <AvatarFallback>
                    <User className="h-4 w-4" />
                  </AvatarFallback>
                </Avatar>
                <span className="text-sm font-medium text-gray-700">田中 太郎</span>
              </div>
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Stats */}
        <ProjectStats />

        {/* Main Content */}
        <div className="bg-white shadow rounded-lg mt-8">
          {/* Header with actions */}
          <div className="px-6 py-4 border-b border-gray-200">
            <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between">
              <h2 className="text-lg font-medium text-gray-900 mb-4 sm:mb-0">案件一覧</h2>
              <div className="flex flex-col sm:flex-row space-y-2 sm:space-y-0 sm:space-x-3">
                <div className="flex space-x-2">
                  <Input
                    placeholder="案件名で検索..."
                    value={searchTerm}
                    onChange={(e) => setSearchTerm(e.target.value)}
                    className="w-64"
                  />
                  <Select value={statusFilter} onValueChange={setStatusFilter}>
                    <SelectTrigger className="w-[180px]">
                      <SelectValue placeholder="すべてのステータス" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">すべてのステータス</SelectItem>
                      <SelectItem value="1">新規</SelectItem>
                      <SelectItem value="2">進行中</SelectItem>
                      <SelectItem value="3">完了</SelectItem>
                      <SelectItem value="4">保留</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <Button onClick={() => setIsCreateModalOpen(true)}>
                  新規案件
                </Button>
              </div>
            </div>
          </div>

          {/* Project Table */}
          <ProjectTable 
            searchTerm={searchTerm}
            statusFilter={statusFilter}
            onEdit={handleEdit}
            onView={handleView}
          />
        </div>
      </div>

      {/* Modals */}
      <ProjectFormModal
        isOpen={isCreateModalOpen}
        onClose={handleCloseModals}
        mode="create"
      />

      <ProjectFormModal
        isOpen={isEditModalOpen}
        onClose={handleCloseModals}
        mode="edit"
        project={selectedProject}
      />

      <ProjectViewModal
        isOpen={isViewModalOpen}
        onClose={handleCloseModals}
        project={selectedProject}
        onEdit={handleEdit}
      />
    </div>
  );
}
