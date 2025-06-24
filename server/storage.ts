import { anken, type Anken, type InsertAnken } from "@shared/schema";
import { v4 as uuidv4 } from "uuid";

export interface IStorage {
  getAnken(id: string): Promise<Anken | undefined>;
  getAllAnken(): Promise<Anken[]>;
  createAnken(anken: InsertAnken): Promise<Anken>;
  updateAnken(id: string, anken: Partial<InsertAnken>): Promise<Anken | undefined>;
  deleteAnken(id: string): Promise<boolean>;
  searchAnken(searchTerm: string, statusFilter?: number): Promise<Anken[]>;
  getAnkenStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    urgentProjects: number;
    monthlyRevenue: string;
  }>;
}

export class MemStorage implements IStorage {
  private anken: Map<string, Anken>;

  constructor() {
    this.anken = new Map();
  }

  async getAnken(id: string): Promise<Anken | undefined> {
    return this.anken.get(id);
  }

  async getAllAnken(): Promise<Anken[]> {
    return Array.from(this.anken.values()).sort((a, b) => 
      new Date(b.created_at || '').getTime() - new Date(a.created_at || '').getTime()
    );
  }

  async createAnken(insertAnken: InsertAnken): Promise<Anken> {
    const id = uuidv4();
    const now = new Date().toISOString();
    const newAnken: Anken = {
      ...insertAnken,
      anken_id: id,
      created_at: now,
      updated_at: now,
    };
    this.anken.set(id, newAnken);
    return newAnken;
  }

  async updateAnken(id: string, updateData: Partial<InsertAnken>): Promise<Anken | undefined> {
    const existing = this.anken.get(id);
    if (!existing) return undefined;
    
    const updated: Anken = {
      ...existing,
      ...updateData,
      updated_at: new Date().toISOString(),
    };
    this.anken.set(id, updated);
    return updated;
  }

  async deleteAnken(id: string): Promise<boolean> {
    return this.anken.delete(id);
  }

  async searchAnken(searchTerm: string, statusFilter?: number): Promise<Anken[]> {
    const allAnken = await this.getAllAnken();
    return allAnken.filter(item => {
      const matchesSearch = !searchTerm || 
        (item.anken_name && item.anken_name.toLowerCase().includes(searchTerm.toLowerCase())) ||
        (item.detail && item.detail.toLowerCase().includes(searchTerm.toLowerCase()));
      
      const matchesStatus = statusFilter === undefined || item.status_code === statusFilter;
      
      return matchesSearch && matchesStatus;
    });
  }

  async getAnkenStats(): Promise<{
    totalProjects: number;
    activeProjects: number;
    urgentProjects: number;
    monthlyRevenue: string;
  }> {
    const allAnken = await this.getAllAnken();
    const totalProjects = allAnken.length;
    const activeProjects = allAnken.filter(item => item.status_code === 2).length;
    
    // Calculate urgent projects (ending within 30 days)
    const now = new Date();
    const thirtyDaysFromNow = new Date(now.getTime() + 30 * 24 * 60 * 60 * 1000);
    const urgentProjects = allAnken.filter(item => {
      if (!item.end_date) return false;
      const endDate = new Date(item.end_date);
      return endDate <= thirtyDaysFromNow && endDate >= now;
    }).length;

    // Calculate monthly revenue (sum of prices for active projects)
    const monthlyRevenue = allAnken
      .filter(item => item.status_code === 2 && item.price)
      .reduce((sum, item) => {
        const price = parseFloat(item.price?.replace(/[¥,]/g, '') || '0');
        return sum + price;
      }, 0);

    return {
      totalProjects,
      activeProjects,
      urgentProjects,
      monthlyRevenue: `¥${(monthlyRevenue / 1000000).toFixed(1)}M`,
    };
  }
}

export const storage = new MemStorage();
