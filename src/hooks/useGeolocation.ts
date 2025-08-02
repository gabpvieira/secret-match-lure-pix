import { useState, useEffect } from 'react';

// Mapeamento de estados para cidades principais (para perfis femininos)
const cidadesGrandesPorEstado: Record<string, string[]> = {
  'AC': ['Rio Branco'],
  'AL': ['Maceió', 'Arapiraca', 'Rio Largo'],
  'AP': ['Macapá'],
  'AM': ['Manaus'],
  'BA': ['Salvador', 'Feira de Santana', 'Vitória da Conquista', 'Camaçari'],
  'CE': ['Fortaleza', 'Caucaia', 'Juazeiro do Norte'],
  'DF': ['Brasília'],
  'ES': ['Vitória', 'Vila Velha', 'Cariacica', 'Serra'],
  'GO': ['Goiânia', 'Aparecida de Goiânia', 'Anápolis'],
  'MA': ['São Luís', 'Imperatriz', 'São José de Ribamar'],
  'MT': ['Cuiabá', 'Várzea Grande', 'Rondonópolis'],
  'MS': ['Campo Grande', 'Dourados', 'Três Lagoas'],
  'MG': ['Belo Horizonte', 'Uberlândia', 'Contagem', 'Juiz de Fora', 'Betim'],
  'PA': ['Belém', 'Ananindeua', 'Santarém'],
  'PB': ['João Pessoa', 'Campina Grande', 'Santa Rita'],
  'PR': ['Curitiba', 'Londrina', 'Maringá', 'Ponta Grossa'],
  'PE': ['Recife', 'Jaboatão dos Guararapes', 'Olinda', 'Caruaru'],
  'PI': ['Teresina', 'Parnaíba'],
  'RJ': ['Rio de Janeiro', 'Niterói', 'Nova Iguaçu', 'Duque de Caxias'],
  'RN': ['Natal', 'Mossoró', 'Parnamirim'],
  'RS': ['Porto Alegre', 'Caxias do Sul', 'Pelotas', 'Canoas'],
  'RO': ['Porto Velho', 'Ji-Paraná'],
  'RR': ['Boa Vista'],
  'SC': ['Florianópolis', 'Joinville', 'Blumenau', 'São José'],
  'SP': ['São Paulo', 'Guarulhos', 'Campinas', 'São Bernardo do Campo', 'Santos', 'Osasco', 'Santo André'],
  'SE': ['Aracaju', 'Nossa Senhora do Socorro'],
  'TO': ['Palmas', 'Araguaína']
};

// Interface para dados de localização
interface LocationData {
  realCity: string;
  state: string;
  country: string;
}

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

// Detecção real da cidade do usuário por IP
const getUserLocationByIP = async (): Promise<LocationData> => {
  try {
    const response = await fetch('https://ipapi.co/json/');
    const data = await response.json();
    
    console.log('Dados de localização detectados:', data);
    
    return {
      realCity: data.city || 'São Paulo',
      state: data.region_code || 'SP',
      country: data.country_name || 'Brazil'
    };
  } catch (error) {
    console.log('Erro ao detectar localização por IP:', error);
    return {
      realCity: 'São Paulo',
      state: 'SP',
      country: 'Brazil'
    };
  }
};

// Função para gerar cidade falsa para perfis femininos
export const getFakeCityForProfile = (userState: string): string => {
  const cities = cidadesGrandesPorEstado[userState];
  if (cities && cities.length > 0) {
    // Seleciona aleatoriamente uma cidade grande do mesmo estado
    return cities[Math.floor(Math.random() * cities.length)];
  }
  // Fallback para capitais conhecidas
  const fallbackCities = ['São Paulo', 'Rio de Janeiro', 'Belo Horizonte', 'Salvador', 'Fortaleza', 'Brasília', 'Curitiba', 'Recife', 'Porto Alegre'];
  return fallbackCities[Math.floor(Math.random() * fallbackCities.length)];
};

// Função para obter dados de localização do usuário (para uso global)
export const getUserLocationData = async (): Promise<LocationData> => {
  try {
    // Primeiro tenta obter localização exata
    const exactLocation = await getExactLocation();
    
    if (exactLocation === 'fallback') {
      // Se falhou, usa geolocalização por IP
      return await getUserLocationByIP();
    } else {
      // Se conseguiu localização exata, ainda precisa do estado para as cidades falsas
      const ipData = await getUserLocationByIP();
      return {
        realCity: exactLocation,
        state: ipData.state,
        country: ipData.country
      };
    }
  } catch (error) {
    console.log('Erro geral na detecção de localização:', error);
    return {
      realCity: 'São Paulo',
      state: 'SP',
      country: 'Brazil'
    };
  }
};

export const useGeolocation = () => {
  const [city, setCity] = useState<string>('São Paulo');
  const [loading, setLoading] = useState(true);
  const [locationData, setLocationData] = useState<LocationData | null>(null);

  useEffect(() => {
    const detectLocation = async () => {
      try {
        const data = await getUserLocationData();
        setLocationData(data);
        setCity(data.realCity); // Sempre usar a cidade REAL do usuário
      } catch (error) {
        console.log('Erro geral na detecção de localização:', error);
        setCity('São Paulo');
        setLocationData({
          realCity: 'São Paulo',
          state: 'SP',
          country: 'Brazil'
        });
      } finally {
        setLoading(false);
      }
    };

    // Simular delay de carregamento
    setTimeout(detectLocation, 1000);
  }, []);

  return { city, loading, locationData };
};