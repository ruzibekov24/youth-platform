// Bazadagi jadvallarga mos tiplar (PLAN.md, 6-bo'lim).
export type AgeRange = "13-15" | "16-17" | "18-25";

export type Club = {
  id: string;
  slug: string;
  name: string;
  description: string;
  organizer: string;
  schedule_text: string;
  is_active: boolean;
  is_sample: boolean;
};

export type ClubSession = {
  id: string;
  club_id: string;
  starts_at: string;
  place_or_link: string;
  topic: string;
};

export type OpportunityType =
  | "scholarship"
  | "program"
  | "competition"
  | "internship"
  | "event";

export type Opportunity = {
  id: string;
  title: string;
  type: OpportunityType;
  organizer: string;
  closes_at: string | null;
  age_min: number | null;
  age_max: number | null;
  eligibility: string;
  region: string;
  official_url: string;
  verified_at: string;
  status: "active" | "hidden";
  is_sample: boolean;
};

export type Idea = {
  id: string;
  title: string;
  problem: string;
  needed_roles: string[];
  status: "pending" | "open" | "closed";
  age_group: "under18" | "adult";
  created_at: string;
};
