export interface Issue {
    
    title: string,
    description: string,
    type: "bug" | "feature_request",
    status? : "open" | "in_progress" | "resolved",
    reporter_id? : string,
    created_at? : string,
    updated_at? : string
  }


export interface IQUery  {
  sort?: "newest" | "oldest";
  type?: "bug" | "feature_request";
  status?: "open" | "in_progress" | "resolved";
}