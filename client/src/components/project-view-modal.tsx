import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Edit, Trash2 } from "lucide-react";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Anken } from "@shared/schema";
import { statusMap } from "@shared/schema";

interface ProjectViewModalProps {
  isOpen: boolean;
  onClose: () => void;
  project: Anken | null;
  onEdit: (project: Anken) => void;
}

export default function ProjectViewModal({ isOpen, onClose, project, onEdit }: ProjectViewModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const deleteProject = useMutation({
    mutationFn: async (id: string) => {
      return apiRequest("DELETE", `/api/anken/${id}`);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anken"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: "削除完了",
        description: "案件が正常に削除されました。",
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "案件の削除に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const handleDelete = () => {
    if (project && window.confirm(`「${project.anken_name}」を削除しますか？`)) {
      deleteProject.mutate(project.anken_id);
    }
  };

  const handleEdit = () => {
    if (project) {
      onEdit(project);
      onClose();
    }
  };

  if (!project) return null;

  const getStatusInfo = () => {
    if (project.status_code && statusMap[project.status_code as keyof typeof statusMap]) {
      return statusMap[project.status_code as keyof typeof statusMap];
    }
    return { label: "不明", color: "bg-gray-100 text-gray-800" };
  };

  const statusInfo = getStatusInfo();

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>案件詳細</DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Header */}
          <div className="bg-gray-50 rounded-lg p-6">
            <div className="flex items-start justify-between">
              <div>
                <h4 className="text-xl font-semibold text-gray-900">
                  {project.anken_name || "無題"}
                </h4>
                <p className="text-gray-600 mt-2">
                  {project.detail || "詳細情報なし"}
                </p>
              </div>
              <Badge className={statusInfo.color}>
                {statusInfo.label}
              </Badge>
            </div>
          </div>

          {/* Project Details Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">開始日</label>
                <p className="text-gray-900">{project.start_date || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">終了日</label>
                <p className="text-gray-900">{project.end_date || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">価格</label>
                <p className="text-gray-900 text-lg font-semibold">{project.price || "-"}</p>
              </div>
            </div>
            <div className="space-y-4">
              <div>
                <label className="block text-sm font-medium text-gray-500">勤務地</label>
                <p className="text-gray-900">{project.location || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">テレワーク</label>
                <p className="text-gray-900">
                  {project.telework_yn === 1 ? "可能" : project.telework_yn === 0 ? "不可" : "-"}
                </p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">勤務時間</label>
                <p className="text-gray-900">
                  {project.time_from && project.time_to 
                    ? `${project.time_from} - ${project.time_to}`
                    : "-"
                  }
                </p>
              </div>
            </div>
          </div>

          {/* Technical Requirements */}
          <div className="space-y-4">
            <h5 className="text-md font-medium text-gray-900">技術要件</h5>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">必須スキル</label>
                <p className="text-gray-900 mt-2">{project.required_skills || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">歓迎スキル</label>
                <p className="text-gray-900 mt-2">{project.nice_skills || "-"}</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div>
                <label className="block text-sm font-medium text-gray-500">プラットフォーム</label>
                <p className="text-gray-900">{project.platform || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">フレームワーク</label>
                <p className="text-gray-900">{project.framework || "-"}</p>
              </div>
              <div>
                <label className="block text-sm font-medium text-gray-500">データベース</label>
                <p className="text-gray-900">{project.db || "-"}</p>
              </div>
            </div>
          </div>

          {/* Additional Information */}
          {project.notes && (
            <div>
              <label className="block text-sm font-medium text-gray-500">備考</label>
              <p className="text-gray-900 mt-2">{project.notes}</p>
            </div>
          )}

          {/* Action Buttons */}
          <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
            <Button variant="outline" onClick={handleEdit}>
              <Edit className="h-4 w-4 mr-2" />
              編集
            </Button>
            <Button 
              variant="destructive" 
              onClick={handleDelete}
              disabled={deleteProject.isPending}
            >
              <Trash2 className="h-4 w-4 mr-2" />
              削除
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
