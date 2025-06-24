import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Eye, Edit, Trash2 } from "lucide-react";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import type { Anken } from "@shared/schema";
import { statusMap } from "@shared/schema";

interface ProjectTableProps {
  searchTerm: string;
  statusFilter: string;
  onEdit: (project: Anken) => void;
  onView: (project: Anken) => void;
}

export default function ProjectTable({ searchTerm, statusFilter, onEdit, onView }: ProjectTableProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const { data: projects = [], isLoading } = useQuery({
    queryKey: ["/api/anken", { search: searchTerm, status: statusFilter }],
    queryFn: async () => {
      const params = new URLSearchParams();
      if (searchTerm) params.set("search", searchTerm);
      if (statusFilter) params.set("status", statusFilter);
      
      const response = await fetch(`/api/anken?${params}`);
      if (!response.ok) throw new Error("Failed to fetch projects");
      return response.json();
    },
  });

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
    },
    onError: () => {
      toast({
        title: "エラー",
        description: "案件の削除に失敗しました。",
        variant: "destructive",
      });
    },
  });

  const handleDelete = (project: Anken) => {
    if (window.confirm(`「${project.anken_name}」を削除しますか？`)) {
      deleteProject.mutate(project.anken_id);
    }
  };

  if (isLoading) {
    return (
      <div className="overflow-x-auto">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>案件名</TableHead>
              <TableHead>ステータス</TableHead>
              <TableHead>開始日</TableHead>
              <TableHead>終了日</TableHead>
              <TableHead>価格</TableHead>
              <TableHead>場所</TableHead>
              <TableHead className="w-[100px]">操作</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {[...Array(5)].map((_, i) => (
              <TableRow key={i}>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                  <div className="h-3 bg-gray-200 rounded w-1/2"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-6 bg-gray-200 rounded w-16"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-24"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="h-4 bg-gray-200 rounded w-20"></div>
                </TableCell>
                <TableCell className="animate-pulse">
                  <div className="flex space-x-2">
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                    <div className="h-8 w-8 bg-gray-200 rounded"></div>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>
    );
  }

  if (projects.length === 0) {
    return (
      <div className="text-center py-12">
        <p className="text-gray-500">案件が見つかりませんでした。</p>
      </div>
    );
  }

  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>案件名</TableHead>
            <TableHead>ステータス</TableHead>
            <TableHead>開始日</TableHead>
            <TableHead>終了日</TableHead>
            <TableHead>価格</TableHead>
            <TableHead>場所</TableHead>
            <TableHead className="w-[100px]">操作</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {projects.map((project: Anken) => (
            <TableRow key={project.anken_id} className="hover:bg-gray-50">
              <TableCell>
                <div>
                  <div className="text-sm font-medium text-gray-900">
                    {project.anken_name || "無題"}
                  </div>
                  <div className="text-sm text-gray-500">
                    {project.detail || "詳細なし"}
                  </div>
                </div>
              </TableCell>
              <TableCell>
                {project.status_code && statusMap[project.status_code as keyof typeof statusMap] ? (
                  <Badge className={statusMap[project.status_code as keyof typeof statusMap].color}>
                    {statusMap[project.status_code as keyof typeof statusMap].label}
                  </Badge>
                ) : (
                  <Badge variant="outline">不明</Badge>
                )}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {project.start_date || "-"}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {project.end_date || "-"}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {project.price || "-"}
              </TableCell>
              <TableCell className="text-sm text-gray-900">
                {project.location || "-"}
              </TableCell>
              <TableCell>
                <div className="flex items-center space-x-2">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onView(project)}
                    title="詳細"
                  >
                    <Eye className="h-4 w-4 text-blue-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => onEdit(project)}
                    title="編集"
                  >
                    <Edit className="h-4 w-4 text-gray-600" />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleDelete(project)}
                    title="削除"
                    disabled={deleteProject.isPending}
                  >
                    <Trash2 className="h-4 w-4 text-red-600" />
                  </Button>
                </div>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
}
