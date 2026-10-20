export interface ProjectItem {
  id: number;
  durationFrom: string;
  durationTo: string;
  projectType: string;
  projectManager: string;
  customer: string;
  code: string;
  name: string;
  budget: string;
  storeys: string;
  description: string;
  location: string;
  status: string;
  area: string;
  assignUsers: string[];
  startDate: string;
  endDate: string;
  contactPerson: string;
  contactPhone: string;
}

export * from "./project-type";
