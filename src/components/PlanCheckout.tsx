import { useState, useEffect } from "react";
import { useParams, useNavigate } from "react-router-dom";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { CheckCircle, ArrowLeft, CreditCard, QrCode, Copy, Check } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface PlanConfig {
  id: string;
  name: string;
  price: string;
  description: string;
  features: string[];
  backendId: string;
  color: string;
}

interface PlanCheckoutProps {
  planId?: string;
}

const PlanCheckout = ({ planId: propPlanId }: PlanCheckoutProps) => {
  const { planId: urlPlanId } = useParams();
  const navigate = useNavigate();
  const { toast } = useToast();
  const [email, setEmail] = useState('');

  const actualPlanId = propPlanId || urlPlanId;
  const [isLoading, setIsLoading] = useState(false);
  const [pixData, setPixData] = useState<any>(null);
  const [copied, setCopied] = useState(false);

  // Configuração dos planos
  const planConfig: { [key: string]: PlanConfig } = {
    'espiadinha': {
      id: 'espiadinha',
      name: 'Espiadinha Básica',
      price: 'R$ 9,90',
      description: 'Acesso básico aos matches',
      features: [
        'Ver quem te curtiu',
        'Fotos sem censura',
        'Chat liberado por 24h'
      ],
      backendId: 'basic_monthly',
      color: 'from-gray-600 to-gray-700'
    },
    'conversaquente': {
      id: 'conversaquente',
      name: 'Conversa Quente + Galeria',
      price: 'R$ 29,90',
      description: 'Acesso completo + galeria',
      features: [
        'Tudo do plano anterior',
        'Galeria completa desbloqueada',
        'Chat ilimitado',
        'Fotos íntimas exclusivas'
      ],
      backendId: 'pro_monthly',
      color: 'from-red-600 to-red-700'
    },
    'vipzao': {
      id: 'vipzao',
      name: 'Acesso Total VIP',
      price: 'R$ 49,90',
      description: 'Experiência premium completa',
      features: [
        'Tudo dos planos anteriores',
        'Vídeos íntimos exclusivos',
        'Chamada de vídeo liberada',
        'Conteúdo VIP atualizado diariamente'
      ],
      backendId: 'lifetime',
      color: 'from-yellow-600 to-yellow-700'
    }
  };

  // Função para obter a imagem do plano
  const getPlanImage = (planId: string): string => {
    const imageMap: { [key: string]: string } = {
      'espiadinha': 'https://i.postimg.cc/NMcgDPbQ/ESPIADINHA-B-SICA.png',
      'conversaquente': 'https://i.postimg.cc/ydy7bXrc/CONVERSA-QUENTE.png',
      'vipzao': 'https://i.postimg.cc/QM58prQ6/ACESSO-VIP-TOTAL.png'
    };
    return imageMap[planId] || '';
  };

  const currentPlan = actualPlanId ? planConfig[actualPlanId] : null;

  const handleGoBack = () => {
    navigate('/checkout');
  };

  const handleCopyPixCode = async () => {
    if (pixData?.pix?.qr_code) {
      try {
        await navigator.clipboard.writeText(pixData.pix.qr_code);
        setCopied(true);
        toast({
          title: "Código PIX copiado!",
          description: "O código foi copiado para a área de transferência.",
        });
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        toast({
          title: "Erro ao copiar",
          description: "Não foi possível copiar o código PIX.",
          variant: "destructive",
        });
      }
    }
  };

  const handleCreatePix = async () => {
    if (!email) {
      toast({
        title: "Email obrigatório",
        description: "Por favor, digite seu email para continuar.",
        variant: "destructive"
      });
      return;
    }

    if (!currentPlan) {
      toast({
        title: "Erro",
        description: "Plano não encontrado.",
        variant: "destructive"
      });
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch(`${import.meta.env.VITE_API_URL}/api/pix/create`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: email,
          plan_id: currentPlan.backendId
        })
      });

      const data = await response.json();

      if (data.success) {
        setPixData(data.data);
        toast({
          title: "PIX gerado com sucesso!",
          description: "Use o QR Code ou código PIX para realizar o pagamento."
        });
      } else {
        throw new Error(data.error || 'Erro ao criar PIX');
      }
    } catch (error) {
      console.error('Erro na requisição:', error);
      toast({
        title: "Erro ao processar pagamento",
        description: "Tente novamente em alguns instantes.",
        variant: "destructive"
      });
    } finally {
      setIsLoading(false);
    }
  };

  if (!currentPlan) {
    return (
      <div className="min-h-screen bg-black flex items-center justify-center p-4">
        <Card className="w-full max-w-md bg-gray-900 border-gray-700">
          <CardContent className="p-6 text-center">
            <h2 className="text-xl font-bold text-red-500 mb-4">Plano não encontrado</h2>
            <Button onClick={handleGoBack} variant="outline" className="border-gray-600 text-gray-300">
              Voltar aos Planos
            </Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-black flex items-center justify-center p-4">
      <div className="w-full max-w-md">
        {/* Header com botão voltar */}
        <div className="mb-6">
          <Button 
            onClick={handleGoBack}
            variant="ghost" 
            className="text-gray-400 hover:text-white p-0 h-auto"
          >
            <ArrowLeft className="w-4 h-4 mr-2" />
            Voltar aos planos
          </Button>
        </div>

        <Card className={`bg-gradient-to-br ${currentPlan.color} border-0 shadow-2xl`}>
          <CardHeader className="text-center pb-4">
            {/* Imagem do plano */}
            <div className="mb-6">
              <img 
                src={getPlanImage(currentPlan.id)} 
                alt={currentPlan.name}
                className="w-full h-auto object-cover rounded-xl shadow-lg"
              />
            </div>
            <CardTitle className="text-white text-2xl font-bold">
              {currentPlan.name}
            </CardTitle>
            <div className="text-white text-3xl font-bold">
              {currentPlan.price}
            </div>
            <p className="text-white/80 text-sm">
              {currentPlan.description}
            </p>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features */}
            <div className="space-y-2">
              {currentPlan.features.map((feature, index) => (
                <div key={index} className="flex items-center gap-2 text-white/90">
                  <CheckCircle className="w-4 h-4 text-green-400 flex-shrink-0" />
                  <span className="text-sm">{feature}</span>
                </div>
              ))}
            </div>

            {/* Email Input */}
            {!pixData && (
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="email" className="text-white font-medium">
                    Seu email para acesso
                  </Label>
                  <Input
                    id="email"
                    type="email"
                    placeholder="seu@email.com"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="bg-white/10 border-white/20 text-white placeholder:text-white/50 focus:border-white/40"
                  />
                </div>

                <Button 
                  onClick={handleCreatePix}
                  disabled={isLoading}
                  className="w-full bg-white text-black hover:bg-gray-100 font-bold py-3 text-lg"
                >
                  {isLoading ? (
                    <div className="flex items-center gap-2">
                      <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-black"></div>
                      Gerando PIX...
                    </div>
                  ) : (
                    <div className="flex items-center gap-2">
                      <CreditCard className="w-5 h-5" />
                      Gerar PIX
                    </div>
                  )}
                </Button>
              </div>
            )}

            {/* PIX Data */}
            {pixData && (
              <div className="space-y-4">
                <div className="text-center">
                  <div className="flex items-center justify-center gap-2 text-green-400 mb-2">
                    <QrCode className="w-5 h-5" />
                    <span className="font-bold">PIX Gerado com Sucesso!</span>
                  </div>
                </div>

                {/* QR Code */}
                <div className="bg-white p-4 rounded-lg">
                  {pixData.pix?.qr_code_base64 ? (
                    <img 
                      src={`data:image/png;base64,${pixData.pix.qr_code_base64}`}
                      alt="QR Code PIX"
                      className="w-full max-w-xs mx-auto"
                      onError={(e) => {
                        console.error('Erro ao carregar QR Code:', e);
                      }}
                    />
                  ) : (
                    <div className="w-full max-w-xs mx-auto aspect-square bg-gray-100 rounded-lg flex items-center justify-center">
                      <div className="text-center text-gray-500">
                        <QrCode className="w-16 h-16 mx-auto mb-2" />
                        <p className="text-sm">QR Code será gerado em breve</p>
                        <p className="text-xs mt-1">Use o código PIX abaixo</p>
                      </div>
                    </div>
                  )}
                </div>

                {/* PIX Code */}
                {pixData.pix?.qr_code && (
                  <div className="space-y-4">
                    <Label className="text-white font-medium">
                      Código PIX (Copiar e Colar)
                    </Label>
                    <div className="bg-white/10 p-4 rounded-lg border border-white/20">
                      <div className="flex items-center justify-between mb-2">
                        <span className="text-white text-xs font-mono">Código PIX:</span>
                        <span className={`text-xs px-2 py-1 rounded ${copied ? 'bg-green-500/20 text-green-400' : 'bg-gray-500/20 text-gray-300'}`}>
                          {copied ? 'Copiado!' : 'Clique para copiar'}
                        </span>
                      </div>
                      <code className="text-white text-xs break-all block bg-black/30 p-3 rounded border border-white/10">
                        {pixData.pix.qr_code}
                      </code>
                    </div>
                    <div className="grid grid-cols-2 gap-2">
                      <Button
                        onClick={handleCopyPixCode}
                        variant={copied ? "default" : "outline"}
                        className={`${copied ? 'bg-green-600 hover:bg-green-700 text-white' : 'border-white/30 text-white hover:bg-white/10'}`}
                      >
                        {copied ? (
                          <>
                            <Check className="w-4 h-4 mr-2" />
                            Copiado!
                          </>
                        ) : (
                          <>
                            <Copy className="w-4 h-4 mr-2" />
                            Copiar Código
                          </>
                        )}
                      </Button>
                      <Button
                        onClick={handleCopyPixCode}
                        variant="ghost"
                        className="bg-white/5 border border-white/10 text-white hover:bg-white/10"
                      >
                        <Copy className="w-4 h-4 mr-2" />
                        Copiar PIX
                      </Button>
                    </div>
                  </div>
                )}

                <div className="text-center text-white/80 text-sm">
                  <p>Após o pagamento, seu acesso será liberado automaticamente.</p>
                  <p className="text-green-400 font-medium mt-1">
                    ID da Transação: {pixData.transaction_id}
                  </p>
                </div>
              </div>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default PlanCheckout;