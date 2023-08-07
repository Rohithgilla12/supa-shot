import { Button } from "@/components/ui/button";
import { useNavigate } from "react-router-dom";
export const Auth = () => {
  const navigate = useNavigate();

  return (
    <div className="container">
      <h1>Auth</h1>

      <Button type="button" onClick={() => navigate("/")}>
        Go to Home
      </Button>
    </div>
  );
};
