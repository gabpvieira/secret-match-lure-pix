import React, { useState } from 'react';
import { Button } from './ui/button';
import { Input } from './ui/input';
import { Card, CardContent, CardHeader, CardTitle } from './ui/card';
import { Progress } from './ui/progress';
import { Upload, MapPin, Heart, Sparkles, Camera, MessageCircle, Users, Flame, Star, Zap, CheckSquare } from 'lucide-react';
import { useGeolocation } from '../hooks/useGeolocation';

interface ProfileData {
  name: string;
  age: number;
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
    age: 18,
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

  const validateStep = (step: number): boolean => {
    const newErrors: Record<string, string> = {};
    
    switch (step) {
      case 1:
        if (!formData.name.trim()) newErrors.name = 'Nome é obrigatório';
        if (formData.age < 18) newErrors.age = 'Idade mínima é 18 anos';
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
          city: formData.city,
          photoUrl: formData.photoUrl,
          photoDeleteUrl: formData.photoDeleteUrl
        }));
        
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
        
        onComplete(formData);
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
                    value={formData.age}
                    onChange={(e) => setFormData({ ...formData, age: parseInt(e.target.value) || 18 })}
                    className={errors.age ? 'border-red-500' : ''}
                  />
                  {errors.age && <p className="text-red-500 text-xs mt-1">{errors.age}</p>}
                </div>
                
                <div>
                  <label className="block text-sm text-caption font-medium mb-2">Cidade</label>
                  <div className="relative">
                    <MapPin className="absolute left-3 top-1/2 transform -translate-y-1/2 w-4 h-4 text-muted-foreground" />
                    <Input
                      type="text"
                      value={formData.city}
                      onChange={(e) => setFormData({ ...formData, city: e.target.value })}
                      className="pl-10"
                      placeholder="Sua cidade"
                    />
                  </div>
                  <p className="text-xs text-green-400 mt-1 flex items-center gap-1">
                    <MapPin className="w-3 h-3" />
                    Local detectado: {city}
                  </p>
                </div>
              </div>
            )}

            {/* Step 2: Meeting Preferences */}
            {currentStep === 2 && (
              <div className="space-y-4">
                <h3 className="text-lg text-subheading text-center mb-4">O que você procura aqui?</h3>
                <div className="space-y-3">
                  {[
                    'Conversas interessantes',
                    'Conexão emocional',
                    'Momentos íntimos',
                    'Ver até onde vai...'
                  ].map((option) => (
                    <label key={option} className="flex items-center space-x-3 p-3 rounded-lg border cursor-pointer hover:bg-muted/50 transition-colors">
                      <input
                        type="radio"
                        name="preference"
                        value={option}
                        checked={formData.preference === option}
                        onChange={(e) => setFormData({ ...formData, preference: e.target.value })}
                        className="text-primary"
                      />
                      <span className="text-sm sm:text-base text-body">{option}</span>
                    </label>
                  ))}
                </div>
                {errors.preference && <p className="text-red-500 text-xs">{errors.preference}</p>}
              </div>
            )}

            {/* Step 3: Ideal Person Style */}
            {currentStep === 3 && (
              <div className="space-y-4">
                <h3 className="text-lg text-subheading text-center mb-4">Com qual perfil você mais se conecta?</h3>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  {[
                    { type: 'Tímida e carinhosa', icon: Heart, color: 'from-pink-500/20 to-pink-600/20' },
                    { type: 'Misteriosa e provocante', icon: Star, color: 'from-gray-500/20 to-gray-600/20' },
                    { type: 'Direta e segura', icon: Flame, color: 'from-red-500/20 to-red-600/20' },
                    { type: 'Fofa e divertida', icon: Sparkles, color: 'from-purple-500/20 to-purple-600/20' }
                  ].map((option) => (
                    <div
                      key={option.type}
                      onClick={() => setFormData({ ...formData, idealType: option.type })}
                      className={`p-4 rounded-lg border-2 cursor-pointer transition-all bg-gradient-to-br ${option.color} ${
                        formData.idealType === option.type ? 'border-primary ring-2 ring-primary/50' : 'border-muted hover:border-primary/50'
                      }`}
                    >
                      <div className="text-center">
                        <option.icon className="w-8 h-8 mx-auto mb-2 text-primary" />
                        <p className="text-sm text-caption font-medium">{option.type}</p>
                      </div>
                    </div>
                  ))}
                </div>
                {errors.idealType && <p className="text-red-500 text-xs">{errors.idealType}</p>}
              </div>
            )}

            {/* Step 4: Profile Photo */}
            {currentStep === 4 && (
              <div className="space-y-4">
                <h3 className="text-lg text-subheading text-center mb-4">Adicione uma foto sua para liberar o acesso completo.</h3>
                
                <div className="border-2 border-dashed border-muted rounded-lg p-6 text-center">
                  {uploadingPhoto ? (
                    <div className="space-y-4">
                      <div className="w-12 h-12 mx-auto border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
                      <p className="text-sm text-muted-foreground">Fazendo upload da foto...</p>
                    </div>
                  ) : photoPreview ? (
                    <div className="space-y-4">
                      <img src={photoPreview} alt="Preview" className="w-32 h-32 mx-auto rounded-full object-cover" />
                      <Button 
                        variant="outline" 
                        onClick={() => document.getElementById('photo-upload')?.click()}
                        disabled={uploadingPhoto}
                      >
                        <Camera className="w-4 h-4 mr-2" />
                        Trocar Foto
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      <Upload className="w-12 h-12 mx-auto text-muted-foreground" />
                      <div>
                        <Button 
                          onClick={() => document.getElementById('photo-upload')?.click()}
                          disabled={uploadingPhoto}
                        >
                          <Camera className="w-4 h-4 mr-2" />
                          Escolher Foto
                        </Button>
                        <p className="text-xs text-body text-muted-foreground mt-2">JPG, PNG até 5MB</p>
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
                
                <div className="bg-green-500/10 border border-green-500/20 rounded-lg p-4">
                  <p className="text-sm sm:text-base text-green-400 text-center flex items-center justify-center gap-2 font-semibold">
                    <Zap className="w-5 h-5" />
                    Perfis com foto têm até 7x mais chances de serem selecionados
                  </p>
                </div>
                
                {errors.photo && <p className="text-red-500 text-xs text-center">{errors.photo}</p>}
              </div>
            )}

            {/* Navigation Button */}
            <Button 
              onClick={handleNext}
              className="w-full professional-button text-base sm:text-lg text-caption py-3 sm:py-4 min-h-[48px] touch-manipulation font-semibold"
              size="lg"
            >
              {currentStep === 1 && 'Próximo'}
              {currentStep === 2 && 'Avançar'}
              {currentStep === 3 && 'Quase lá'}
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