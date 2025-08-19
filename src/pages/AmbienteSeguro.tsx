import { useNavigate } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Shield } from "lucide-react";

const AmbienteSeguro = () => {
  const navigate = useNavigate();

  const handleContinue = () => {
    navigate("/match-secreto");
  };

  return (
    <div className="min-h-screen bg-black flex items-center justify-center px-4">
      <Card className="modern-card w-full max-w-lg">
        <CardContent className="p-8 text-center">
          <div className="mb-6">
            <Shield className="w-16 h-16 mx-auto text-green-400 mb-4" />
          </div>
          
          <h1 className="text-2xl sm:text-3xl font-bold text-heading mb-6 leading-tight">
            Você está entrando numa área segura e privada 🔒
          </h1>
          
          <p className="text-lg text-body text-muted-foreground mb-8">
            Clique abaixo para continuar. Suas preferências serão mantidas com sigilo total.
          </p>
          
          <Button 
            onClick={handleContinue}
            className="w-full professional-button text-lg py-6 bg-gradient-to-r from-green-600 to-green-500 hover:from-green-700 hover:to-green-600"
            size="lg"
          >
            Tudo Certo, Quero Continuar
          </Button>
        </CardContent>
      </Card>
    </div>
  );
};

export default AmbienteSeguro;