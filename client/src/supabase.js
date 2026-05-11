import { createClient } from "@supabase/supabase-js";

export const supabase = createClient(
  "https://rotrznndxcbyhrqsnptf.supabase.co",
  "eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6InJvdHJ6bm5keGNieWhycXNucHRmIiwicm9sZSI6ImFub24iLCJpYXQiOjE3Nzc2MjExMzAsImV4cCI6MjA5MzE5NzEzMH0.pVG8xdQX8wVnuL0QnOXOJDmex4qA-qdVvBf3tBPHJKs"
);