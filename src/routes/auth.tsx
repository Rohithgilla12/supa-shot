import { Auth } from "@supabase/auth-ui-react";
import { Button } from "@/components/ui/button";
import { ThemeSupa } from "@supabase/auth-ui-shared";
import { supabase } from "@/data/db";
import { useNavigate } from "react-router-dom";

export const SupaAuth = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Auth</h1>

      <Auth supabaseClient={supabase} appearance={{ theme: ThemeSupa }} />

      <Button type="button" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};
