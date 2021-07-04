export interface CalculateTool {
  id?: number;
  toolName?: string;
  customerType?: string;
  priority?: string;
  status?: number;
  isActive?: boolean;
}

export interface SearchToolRequest {
  keysearch: string;
  status: number;
  customerType: string;
  priority: string;
}
