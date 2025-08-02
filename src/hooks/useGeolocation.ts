import { useState, useEffect } from 'react';

// Mapeamento simplificado de estados para cidades principais
const cityMapping: Record<string, string[]> = {
  'AC': ['Rio Branco'],
  'AL': ['Maceió'],
  'AP': ['Macapá'],
  'AM': ['Manaus'],
  'BA': ['Salvador', 'Feira de Santana'],
  'CE': ['Fortaleza'],
  'DF': ['Brasília'],
  'ES': ['Vitória', 'Vila Velha'],
  'GO': ['Goiânia'],
  'MA': ['São Luís'],
  'MT': ['Cuiabá'],
  'MS': ['Campo Grande'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem'],
  'PA': ['Belém'],
  'PB': ['João Pessoa'],
  'PR': ['Curitiba', 'Londrina', 'Maringá'],
  'PE': ['Recife', 'Jaboatão dos Guararapes'],
  'PI': ['Teresina'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu'],
  'RN': ['Natal'],
  'RS': ['Porto Alegre', 'Caxias do Sul'],
  'RO': ['Porto Velho'],
  'RR': ['Boa Vista'],
  'SC': ['Florianópolis', 'Joinville'],
  'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santos'],
  'SE': ['Aracaju'],
  'TO': ['Palmas']
};

// Solicita permissão para acessar localização exata do usuário
const getExactLocation = async (): Promise<string> => {
  return new Promise((resolve) => {
    if (navigator.geolocation) {
      navigator.geolocation.getCurrentPosition(
        async function(position) {
          try {
            const lat = position.coords.latitude;
            const lng = position.coords.longitude;
            
            // Usar reverse geocoding para obter endereço
            const response = await fetch(
              `https://api.bigdatacloud.net/data/reverse-geocode-client?latitude=${lat}&longitude=${lng}`
            );
            const data = await response.json();
            
            console.log('Localização exata:', data);
            
            // Extrair cidade da resposta
            const city = data.city || data.locality || 'São Paulo';
            resolve(city);
          } catch (error) {
            console.log('Erro no reverse geocoding:', error);
            resolve('São Paulo');
          }
        },
        function(error) {
          console.log('Usuário negou permissão de localização');
          // Fallback para IP geolocation
          resolve('fallback');
        },
        {
          enableHighAccuracy: true,
          timeout: 10000,
          maximumAge: 300000
        }
      );
    } else {
      console.log('Geolocalização não suportada');
      resolve('fallback');
    }
  });
};

// Fallback para geolocalização por IP
const getUserLocationByIP = async (): Promise<string> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    if (data.region_code && cityMapping[data.region_code]) {
      const cities = cityMapping[data.region_code];
      // Seleciona aleatoriamente uma cidade principal do estado
      const randomCity = cities[Math.floor(Math.random() * cities.length)];
      return randomCity;
    }
    
    return data.city || 'São Paulo';
  } catch (error) {
    console.log('Erro ao detectar localização por IP:', error);
    return 'São Paulo';
  }
};

export const useGeolocation = () => {
  const [city, setCity] = useState<string>('São Paulo');
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        // Primeiro tenta obter localização exata
        const exactLocation = await getExactLocation();
        
        if (exactLocation === 'fallback') {
          // Se falhou, usa geolocalização por IP
          const ipLocation = await getUserLocationByIP();
          setCity(ipLocation);
        } else {
          setCity(exactLocation);
        }
      } catch (error) {
        console.log('Erro geral na detecção de localização:', error);
        setCity('São Paulo');
      } finally {
        setLoading(false);
      }
    };

    // Simular delay de carregamento
    setTimeout(detectLocation, 1000);
  }, []);

  return { city, loading };
};