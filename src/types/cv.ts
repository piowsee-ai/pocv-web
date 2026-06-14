export interface CVListPreview {
  name: string;
  email: string;
  phone: string;
  education: string;
  work: string;
}

export interface CVList {
  id: string;
  title: string;
  createdAt: Date;
  updatedAt: Date;
  preview?: CVListPreview;
}