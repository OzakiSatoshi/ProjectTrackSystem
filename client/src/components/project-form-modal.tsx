import { useEffect } from "react";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { useMutation, useQueryClient } from "@tanstack/react-query";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from "@/components/ui/form";
import { apiRequest } from "@/lib/queryClient";
import { useToast } from "@/hooks/use-toast";
import { insertAnkenSchema, type Anken, type InsertAnken } from "@shared/schema";

interface ProjectFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  mode: "create" | "edit";
  project?: Anken | null;
}

export default function ProjectFormModal({ isOpen, onClose, mode, project }: ProjectFormModalProps) {
  const { toast } = useToast();
  const queryClient = useQueryClient();

  const form = useForm<InsertAnken>({
    resolver: zodResolver(insertAnkenSchema),
    defaultValues: {
      anken_name: "",
      detail: "",
      notes: "",
      start_date: "",
      end_date: "",
      status_code: 1,
      price: "",
      limit_date: "",
      contract: "",
      meeting: "",
      foreigner: "",
      telework: "",
      telework_yn: 0,
      required_skills: "",
      nice_skills: "",
      process: "",
      platform: "",
      framework: "",
      program: "",
      db: "",
      location: "",
      ken: "",
      time_from: "",
      time_to: "",
      duplicate_check: "",
      persons: "",
      contact_id: "",
    },
  });

  useEffect(() => {
    if (mode === "edit" && project) {
      // Reset form with project data
      form.reset({
        anken_name: project.anken_name || "",
        detail: project.detail || "",
        notes: project.notes || "",
        start_date: project.start_date || "",
        end_date: project.end_date || "",
        status_code: project.status_code || 1,
        price: project.price || "",
        limit_date: project.limit_date || "",
        contract: project.contract || "",
        meeting: project.meeting || "",
        foreigner: project.foreigner || "",
        telework: project.telework || "",
        telework_yn: project.telework_yn || 0,
        required_skills: project.required_skills || "",
        nice_skills: project.nice_skills || "",
        process: project.process || "",
        platform: project.platform || "",
        framework: project.framework || "",
        program: project.program || "",
        db: project.db || "",
        location: project.location || "",
        ken: project.ken || "",
        time_from: project.time_from || "",
        time_to: project.time_to || "",
        duplicate_check: project.duplicate_check || "",
        persons: project.persons || "",
        contact_id: project.contact_id || "",
      });
    } else if (mode === "create") {
      form.reset({
        anken_name: "",
        detail: "",
        notes: "",
        start_date: "",
        end_date: "",
        status_code: 1,
        price: "",
        limit_date: "",
        contract: "",
        meeting: "",
        foreigner: "",
        telework: "",
        telework_yn: 0,
        required_skills: "",
        nice_skills: "",
        process: "",
        platform: "",
        framework: "",
        program: "",
        db: "",
        location: "",
        ken: "",
        time_from: "",
        time_to: "",
        duplicate_check: "",
        persons: "",
        contact_id: "",
      });
    }
  }, [mode, project, form]);

  const mutation = useMutation({
    mutationFn: async (data: InsertAnken) => {
      if (mode === "create") {
        return apiRequest("POST", "/api/anken", data);
      } else {
        return apiRequest("PUT", `/api/anken/${project?.anken_id}`, data);
      }
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/anken"] });
      queryClient.invalidateQueries({ queryKey: ["/api/stats"] });
      toast({
        title: mode === "create" ? "作成完了" : "更新完了",
        description: `案件が正常に${mode === "create" ? "作成" : "更新"}されました。`,
      });
      onClose();
    },
    onError: () => {
      toast({
        title: "エラー",
        description: `案件の${mode === "create" ? "作成" : "更新"}に失敗しました。`,
        variant: "destructive",
      });
    },
  });

  const onSubmit = (data: InsertAnken) => {
    mutation.mutate(data);
  };

  return (
    <Dialog open={isOpen} onOpenChange={onClose}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {mode === "create" ? "新規案件作成" : "案件編集"}
          </DialogTitle>
        </DialogHeader>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-6">
            {/* Basic Information */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField
                control={form.control}
                name="anken_name"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>案件名 *</FormLabel>
                    <FormControl>
                      <Input placeholder="案件名を入力してください" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="status_code"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>ステータス</FormLabel>
                    <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                      <FormControl>
                        <SelectTrigger>
                          <SelectValue placeholder="ステータスを選択" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        <SelectItem value="1">新規</SelectItem>
                        <SelectItem value="2">進行中</SelectItem>
                        <SelectItem value="3">完了</SelectItem>
                        <SelectItem value="4">保留</SelectItem>
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="detail"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>詳細</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="案件の詳細情報を入力してください" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Dates and Pricing */}
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              <FormField
                control={form.control}
                name="start_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>開始日</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="end_date"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>終了日</FormLabel>
                    <FormControl>
                      <Input type="date" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              <FormField
                control={form.control}
                name="price"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>価格</FormLabel>
                    <FormControl>
                      <Input placeholder="¥1,000,000" {...field} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            {/* Technical Requirements */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">技術要件</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="required_skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>必須スキル</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="JavaScript, React, Node.js" 
                          className="resize-none" 
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="nice_skills"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>歓迎スキル</FormLabel>
                      <FormControl>
                        <Textarea 
                          placeholder="TypeScript, AWS, Docker" 
                          className="resize-none" 
                          rows={2}
                          {...field} 
                        />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="platform"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>プラットフォーム</FormLabel>
                      <FormControl>
                        <Input placeholder="Web, Mobile, Desktop" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="framework"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>フレームワーク</FormLabel>
                      <FormControl>
                        <Input placeholder="React, Vue.js, Angular" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="db"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>データベース</FormLabel>
                      <FormControl>
                        <Input placeholder="PostgreSQL, MySQL, MongoDB" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Work Arrangement */}
            <div className="space-y-4">
              <h4 className="text-md font-medium text-gray-900">勤務形態</h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <FormField
                  control={form.control}
                  name="location"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>勤務地</FormLabel>
                      <FormControl>
                        <Input placeholder="東京都渋谷区" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="ken"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>都道府県</FormLabel>
                      <Select onValueChange={field.onChange} value={field.value || ""}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="none">選択してください</SelectItem>
                          <SelectItem value="東京都">東京都</SelectItem>
                          <SelectItem value="大阪府">大阪府</SelectItem>
                          <SelectItem value="愛知県">愛知県</SelectItem>
                          <SelectItem value="福岡県">福岡県</SelectItem>
                          <SelectItem value="リモート">リモート</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <FormField
                  control={form.control}
                  name="telework_yn"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>テレワーク</FormLabel>
                      <Select onValueChange={(value) => field.onChange(parseInt(value))} value={field.value?.toString()}>
                        <FormControl>
                          <SelectTrigger>
                            <SelectValue placeholder="選択してください" />
                          </SelectTrigger>
                        </FormControl>
                        <SelectContent>
                          <SelectItem value="0">不可</SelectItem>
                          <SelectItem value="1">可能</SelectItem>
                        </SelectContent>
                      </Select>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time_from"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>開始時間</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                <FormField
                  control={form.control}
                  name="time_to"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>終了時間</FormLabel>
                      <FormControl>
                        <Input type="time" {...field} />
                      </FormControl>
                      <FormMessage />
                    </FormItem>
                  )}
                />
              </div>
            </div>

            {/* Additional Information */}
            <FormField
              control={form.control}
              name="notes"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>備考</FormLabel>
                  <FormControl>
                    <Textarea 
                      placeholder="その他の重要な情報があれば記載してください" 
                      className="resize-none" 
                      rows={3}
                      {...field} 
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            {/* Form Actions */}
            <div className="flex justify-end space-x-3 pt-6 border-t border-gray-200">
              <Button type="button" variant="outline" onClick={onClose}>
                キャンセル
              </Button>
              <Button type="submit" disabled={mutation.isPending}>
                {mutation.isPending ? "保存中..." : "保存"}
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  );
}
