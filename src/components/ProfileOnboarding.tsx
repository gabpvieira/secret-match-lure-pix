import React, { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Upload, MapPin, Heart, Sparkles, Camera, MessageCircle, Users, Flame, Star, Zap, CheckSquare, ChevronRight, Shield, TrendingUp } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface ProfileData {
  name: string;
  age: number | undefined;
  city: string;
  preference: string;
  idealType: string;
  photo: File | null;
  photoUrl?: string;
  photoDeleteUrl?: string;
}

interface ProfileOnboardingProps {
  onComplete: (data: ProfileData) => void;
}

const ProfileOnboarding: React.FC<ProfileOnboardingProps> = ({ onComplete }) => {
  const [currentStep, setCurrentStep] = useState(1);
  const [isLoading, setIsLoading] = useState(false);
  const { city } = useGeolocation();
  
  const [formData, setFormData] = useState<ProfileData>({
    name: '',
    age: undefined,
    city: city,
    preference: '',
    idealType: '',
    photo: null,
    photoUrl: '',
    photoDeleteUrl: ''
  });

  const [errors, setErrors] = useState<Record<string, string>>({});
  const [photoPreview, setPhotoPreview] = useState<string | null>(null);
  const [uploadingPhoto, setUploadingPhoto] = useState(false);
  const [buttonValidated, setButtonValidated] = useState(false);

  // Atualizar cidade quando detectada
  // Atualizar cidade e gerenciar cache de foto
  useEffect(() => {
    setFormData(prev => ({ ...prev, city: city }));
    
    // Limpar cache de foto ao sair da aplicação (privacidade)
    const handleBeforeUnload = () => {
      // O sessionStorage já se limpa automaticamente ao fechar a aba
    };
    
    const handleVisibilityChange = () => {
      // Limpar cache quando a aba fica inativa por muito tempo
      if (document.hidden) {
        setTimeout(() => {
          if (document.hidden) {
            sessionStorage.removeItem('userPhotoCache');
          }
        }, 300000); // 5 minutos de inatividade
      }
    };
    
    window.addEventListener('beforeunload', handleBeforeUnload);
    document.addEventListener('visibilitychange', handleVisibilityChange);
    
    return () => {
      window.removeEventListener('beforeunload', handleBeforeUnload);
      document.removeEventListener('visibilitychange', handleVisibilityChange);
    };
  }, [city]);

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (!formData.age || formData.age < 18) newErrors.age = 'Idade deve ser 18 ou mais';
        break;
      case 2:
        if (!formData.preference) newErrors.preference = 'Selecione uma opção';
        break;
      case 3:
        if (!formData.idealType) newErrors.idealType = 'Selecione um perfil';
        break;
      case 4:
        if (!formData.photo) newErrors.photo = 'Foto é obrigatória';
        break;
    }
    
    setErrors(newErrors);
    return Object.keys(newErrors).length === 0;
  };

  const handleNext = () => {
    if (validateStep(currentStep)) {
      if (currentStep < 4) {
        setCurrentStep(currentStep + 1);
        // Scroll para o topo ao avançar etapa
        window.scrollTo({ top: 0, behavior: 'smooth' });
      } else {
        handleComplete();
      }
    }
  };

  const handleComplete = async () => {
    setIsLoading(true);
    
    try {
        // Salvar dados do usuário no localStorage
        localStorage.setItem('userProfile', JSON.stringify({
          name: formData.name,
          age: formData.age,
          city: city || 'Localização não detectada',
          photoUrl: formData.photoUrl,
          photoDeleteUrl: formData.photoDeleteUrl
        }));
        
        // Manter cache de sessão da foto para acesso rápido
        if (formData.photoUrl) {
          sessionStorage.setItem('userPhotoCache', formData.photoUrl);
        }
        
        // Programar exclusão da foto após 1 hora
        if (formData.photoDeleteUrl) {
          setTimeout(async () => {
            try {
              await fetch(formData.photoDeleteUrl!);
              console.log('Foto excluída automaticamente do ImgBB');
            } catch (error) {
              console.error('Erro ao excluir foto:', error);
            }
          }, 3600000); // 1 hora em milissegundos
        }
        
        // Simular processamento - ajustado para 17 segundos
        await new Promise(resolve => setTimeout(resolve, 17000));
        
        // Criar dados finais com a cidade detectada automaticamente
        const finalProfileData = {
          ...formData,
          city: city || 'Localização não detectada'
        };
        
        onComplete(finalProfileData);
    } catch (error) {
      console.error('Erro ao processar perfil:', error);
    } finally {
      // Garantir que o loading seja finalizado mesmo em caso de erro
      setIsLoading(false);
    }
  };

  const uploadToImgBB = async (file: File): Promise<{ url: string; deleteUrl: string }> => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('expiration', '3600'); // 1 hora em segundos
    
    const response = await fetch('https://api.imgbb.com/1/upload?key=fbc73f028c409ff58a6c5f3577f6f6ad', {
      method: 'POST',
      body: formData
    });
    
    if (!response.ok) {
      throw new Error('Erro ao fazer upload da imagem');
    }
    
    const data = await response.json();
    
    if (!data.success) {
      throw new Error(data.error?.message || 'Erro ao fazer upload da imagem');
    }
    
    return {
      url: data.data.url,
      deleteUrl: data.data.delete_url
    };
  };

  const handlePhotoUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
      if (file.size > 5 * 1024 * 1024) {
        setErrors({ photo: 'Arquivo muito grande. Máximo 5MB.' });
        return;
      }
      
      setUploadingPhoto(true);
      setErrors({ ...errors, photo: '' });
      
      try {
        // Criar preview local primeiro
        const reader = new FileReader();
        reader.onload = (e) => {
          setPhotoPreview(e.target?.result as string);
        };
        reader.readAsDataURL(file);
        
        // Fazer upload para ImgBB
        const { url, deleteUrl } = await uploadToImgBB(file);
        
        // Salvar foto no cache de sessão para acesso rápido
        sessionStorage.setItem('userPhotoCache', url);
        
        setFormData({ 
          ...formData, 
          photo: file,
          photoUrl: url,
          photoDeleteUrl: deleteUrl
        });
        
        // Disparar evento do Facebook Pixel
        if (typeof window !== 'undefined' && (window as any).dispararIniciouFunil) {
          (window as any).dispararIniciouFunil();
        }
        
      } catch (error) {
        console.error('Erro no upload:', error);
        setErrors({ photo: 'Erro ao fazer upload da imagem. Tente novamente.' });
        setPhotoPreview(null);
      } finally {
        setUploadingPhoto(false);
      }
    }
  };

  const progressPercentage = (currentStep / 4) * 100;

  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gradient-to-br from-background via-background to-primary/10">
        <div className="text-center space-y-6">
          <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          <div className="space-y-2">
            <h2 className="text-xl sm:text-2xl text-heading gradient-text">Montando seu perfil personalizado…</h2>
            <p className="text-body text-muted-foreground">Buscando compatibilidades perto de você…</p>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-background via-background to-primary/10 py-4 sm:py-8 px-4 sm:px-6">
      <div className="max-w-md mx-auto">
        {/* Logo */}
        <div className="flex justify-center mb-6">
          <img 
            src="https://i.postimg.cc/85LBXJdp/LOGO-PNG-MATCH-SECRETO.png" 
            alt="Match Secreto" 
            className="h-10 sm:h-12 w-auto object-contain"
          />
        </div>
        {/* Progress Bar */}
        <div className="mb-6 sm:mb-8">
          <div className="flex justify-between text-xs sm:text-sm text-muted-foreground mb-2">
            <span>Etapa {currentStep} de 4</span>
            <span>{Math.round(progressPercentage)}%</span>
          </div>
          <Progress value={progressPercentage} className="h-2" />
        </div>

        <Card className="modern-card">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-xl sm:text-2xl text-heading gradient-text">
              {currentStep === 1 && 'Identidade Básica'}
              {currentStep === 2 && 'Preferências de Encontro'}
              {currentStep === 3 && 'Estilo de Pessoa Ideal'}
              {currentStep === 4 && 'Foto de Perfil'}
            </CardTitle>
          </CardHeader>
          
          <CardContent className="space-y-6">
            {/* Step 1: Basic Identity */}
            {currentStep === 1 && (
              <div className="space-y-4">
                <div>
                  <label className="block text-sm text-caption font-medium mb-2">Nome completo</label>
                  <Input
                    type="text"
                    value={formData.name}
                    onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                    placeholder="Digite seu nome"
                    className={errors.name ? 'border-red-500' : ''}
                  />
                  {errors.name && <p className="text-red-500 text-xs mt-1">{errors.name}</p>}
                </div>
                
                <div>
                  <label className="block text-sm text-caption font-medium mb-2">Idade</label>
                  <Input
                    type="number"
                    min="18"
                    value={formData.age || ''}
                    onChange={(e) => {
                      const value = e.target.value;
                      if (value === '') {
                        setFormData({ ...formData, age: undefined });
                      } else {
                        const numValue = parseInt(value);
                        if (!isNaN(numValue)) {
                          setFormData({ ...formData, age: numValue });
                        }
                      }
                    }}
                    placeholder="Digite sua idade"
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
                
                <div>
                  <label className="block text-sm text-caption font-medium mb-2">Cidade</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-green-400" />
                    <Input
                      type="text"
                      value={city || 'Detectando localização...'}
                      readOnly
                      className="pl-10 bg-green-50 border-green-200 text-green-700 cursor-not-allowed"
                      placeholder="Detectando sua localização..."
                    />
                  </div>
                  <p className="text-xs text-green-600 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    ✓ Local detectado automaticamente
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Meeting Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg text-subheading text-center mb-4 font-semibold">
                  O que você REALMENTE procura aqui?
                </h3>
                <p className="text-sm text-muted-foreground text-center mb-4">
                  Selecione uma opção para continuar
                </p>
                <div className="space-y-3">
                  {[
                    { text: 'Papo bom que rende coisa melhor...', icon: MessageCircle, color: 'from-blue-500/20 to-blue-600/20', borderColor: 'border-cyan-400 ring-2 ring-cyan-400/50 shadow-lg shadow-cyan-400/20', checkColor: 'bg-cyan-400', textColor: 'text-cyan-300' },
                    { text: 'Alguém pra mexer com a mente (e com o resto 👀)', icon: Heart, color: 'from-pink-500/20 to-pink-600/20', borderColor: 'border-pink-400 ring-2 ring-pink-400/50 shadow-lg shadow-pink-400/20', checkColor: 'bg-pink-400', textColor: 'text-pink-300' },
                    { text: 'Segredos íntimos sem muita enrolação', icon: Flame, color: 'from-red-500/20 to-red-600/20', borderColor: 'border-red-400 ring-2 ring-red-400/50 shadow-lg shadow-red-400/20', checkColor: 'bg-red-400', textColor: 'text-red-300' },
                    { text: 'Ver até onde essa loucura vai dar...', icon: Sparkles, color: 'from-purple-500/20 to-purple-600/20', borderColor: 'border-purple-400 ring-2 ring-purple-400/50 shadow-lg shadow-purple-400/20', checkColor: 'bg-purple-400', textColor: 'text-purple-300' }
                  ].map((option) => (
                    <div
                      key={option.text}
                      onClick={() => setFormData({ ...formData, preference: option.text })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all bg-gradient-to-br ${option.color} ${
                        formData.preference === option.text 
                          ? option.borderColor
                          : 'border-muted hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <option.icon className="w-6 h-6 text-primary" />
                        <span className="text-sm sm:text-base text-body font-medium flex-1">{option.text}</span>
                        {formData.preference === option.text ? (
                          <div className={`w-5 h-5 ${option.checkColor} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-60" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.preference && <p className="text-red-500 text-xs">{errors.preference}</p>}
              </div>
            )}

            {/* Step 3: Ideal Person Style */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <div className="text-center mb-6">
                  <h3 className="text-lg text-subheading font-semibold mb-2">
                    O tipo de mulher que mais bagunça tua cabeça é...
                  </h3>
                  <p className="text-sm text-muted-foreground mb-2">
                    Escolhe com calma...
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Selecione uma opção para continuar
                  </p>
                </div>
                <div className="space-y-3">
                  {[
                    { 
                      type: 'Discreta por fora… safada nas entrelinhas', 
                      icon: Heart, 
                      color: 'from-pink-500/20 to-pink-600/20',
                      borderColor: 'border-pink-400 ring-2 ring-pink-400/50 shadow-lg shadow-pink-400/20',
                      checkColor: 'bg-pink-400'
                    },
                    { 
                      type: 'Segura, direta e zero paciência pra joguinho', 
                      icon: Flame, 
                      color: 'from-red-500/20 to-red-600/20',
                      borderColor: 'border-red-400 ring-2 ring-red-400/50 shadow-lg shadow-red-400/20',
                      checkColor: 'bg-red-400'
                    },
                    { 
                      type: 'Cheia de mistérios e respostas que atiçam', 
                      icon: Star, 
                      color: 'from-gray-500/20 to-gray-600/20',
                      borderColor: 'border-gray-400 ring-2 ring-gray-400/50 shadow-lg shadow-gray-400/20',
                      checkColor: 'bg-gray-400'
                    },
                    { 
                      type: 'Engraçada, leve e perigosamente envolvente', 
                      icon: Sparkles, 
                      color: 'from-purple-500/20 to-purple-600/20',
                      borderColor: 'border-purple-400 ring-2 ring-purple-400/50 shadow-lg shadow-purple-400/20',
                      checkColor: 'bg-purple-400'
                    }
                  ].map((option) => (
                    <div
                      key={option.type}
                      onClick={() => {
                        setFormData({ ...formData, idealType: option.type });
                        setButtonValidated(true);
                        setTimeout(() => setButtonValidated(false), 1000);
                      }}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all bg-gradient-to-br ${option.color} ${
                        formData.idealType === option.type ? option.borderColor : 'border-muted hover:border-primary/50 hover:shadow-md'
                      }`}
                    >
                      <div className="flex items-center space-x-3">
                        <div className={`w-8 h-8 rounded-full ${option.color} flex items-center justify-center`}>
                          <option.icon className="w-4 h-4 text-primary" />
                        </div>
                        <span className="text-sm sm:text-base text-body font-medium flex-1">
                          {option.type}
                        </span>
                        {formData.idealType === option.type ? (
                          <div className={`w-5 h-5 ${option.checkColor} rounded-full flex items-center justify-center`}>
                            <span className="text-white text-xs">✓</span>
                          </div>
                        ) : (
                          <ChevronRight className="w-4 h-4 text-muted-foreground opacity-60" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
                {errors.idealType && <p className="text-red-500 text-xs">{errors.idealType}</p>}
              </div>
            )}

            {/* Step 4: Profile Photo */}
            {currentStep === 4 && (
              <div className="space-y-6">
                <div className="text-center space-y-2">
                  <h3 className="text-xl text-subheading font-bold mb-2">
                    Selecione sua foto
                  </h3>
                  <p className="text-sm text-muted-foreground">
                    Adicione uma foto sua para liberar o acesso completo.
                  </p>
                </div>
                
                {/* Upload Area */}
                <div className="bg-gradient-to-br from-background to-muted/30 border-2 border-dashed border-primary/30 rounded-xl p-8 text-center hover:border-primary/50 transition-colors">
                  {uploadingPhoto ? (
                    <div className="space-y-4">
                      <div className="w-16 h-16 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <div className="space-y-1">
                        <p className="text-base font-medium text-body">Processando sua foto...</p>
                        <p className="text-sm text-muted-foreground">Aguarde um momento</p>
                      </div>
                    </div>
                  ) : photoPreview ? (
                    <div className="space-y-6">
                      <div className="relative inline-block">
                        <img src={photoPreview} alt="Preview" className="w-40 h-40 mx-auto rounded-full object-cover border-4 border-primary/20 shadow-lg" />
                        <div className="absolute -bottom-2 -right-2 w-8 h-8 bg-green-500 rounded-full flex items-center justify-center border-2 border-background">
                          <CheckSquare className="w-4 h-4 text-white" />
                        </div>
                      </div>
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        disabled={uploadingPhoto}
                        className="bg-background/50 hover:bg-background border-primary/30 hover:border-primary/50"
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Trocar Foto
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-6">
                      <div className="w-20 h-20 mx-auto bg-primary/10 rounded-full flex items-center justify-center">
                        <Upload className="w-10 h-10 text-primary" />
                      </div>
                      <div className="space-y-3">
                        <Button 
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          disabled={uploadingPhoto}
                          className="bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70 text-white font-semibold px-8 py-3"
                          size="lg"
                        >
                          <Camera className="w-5 h-5 mr-2" />
                          Escolher Foto
                        </Button>
                        <p className="text-sm text-muted-foreground">JPG, PNG até 5MB</p>
                      </div>
                    </div>
                  )}
                  
                  <input
                    id="photo-upload"
                    type="file"
                    accept="image/jpeg,image/png"
                    onChange={handlePhotoUpload}
                    className="hidden"
                  />
                </div>
                
                {/* Professional Stats Box */}
                <div className="bg-gradient-to-r from-green-500/10 via-emerald-500/10 to-teal-500/10 border border-green-500/30 rounded-xl p-6 shadow-lg">
                  <div className="flex items-start space-x-4">
                    <div className="w-12 h-12 bg-green-500/20 rounded-full flex items-center justify-center flex-shrink-0">
                      <TrendingUp className="w-6 h-6 text-green-400" />
                    </div>
                    <div className="flex-1 space-y-2">
                      <h4 className="text-base font-bold text-green-400">
                        Perfis com foto têm até 7x mais chances de serem selecionados
                      </h4>
                      <div className="flex items-center space-x-4 text-sm text-green-300/80">
                        <div className="flex items-center space-x-1">
                          <Shield className="w-4 h-4" />
                          <span>100% Seguro</span>
                        </div>
                        <div className="flex items-center space-x-1">
                          <Zap className="w-4 h-4" />
                          <span>Verificação Automática</span>
                        </div>
                      </div>
                    </div>
                  </div>
                </div>
                
                {errors.photo && (
                  <div className="bg-red-500/10 border border-red-500/30 rounded-lg p-3">
                    <p className="text-red-400 text-sm text-center font-medium">{errors.photo}</p>
                  </div>
                )}
              </div>
            )}

            {/* Navigation Button */}
            <Button 
              onClick={handleNext}
              className={`w-full professional-button text-base sm:text-lg text-caption py-3 sm:py-4 min-h-[48px] touch-manipulation font-semibold transition-all duration-300 ${
                buttonValidated && currentStep === 3
                  ? 'bg-gradient-to-r from-green-500 to-green-600 hover:from-green-600 hover:to-green-700'
                  : 'bg-gradient-to-r from-primary to-primary/80 hover:from-primary/90 hover:to-primary/70'
              }`}
              size="lg"
            >
              {currentStep === 1 && 'Próximo'}
              {currentStep === 2 && '🔓 CONTINUAR AGORA'}
              {currentStep === 3 && '🔓 CONTINUAR'}
              {currentStep === 4 && (
                <>
                  <CheckSquare className="w-4 h-4 mr-2" />
                  Criar Meu Perfil
                </>
              )}
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ProfileOnboarding;