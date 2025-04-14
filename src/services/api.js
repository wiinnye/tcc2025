import axios from 'axios';

export async function traduzirTexto(texto) {
  try {
    const response = await axios.get('http://localhost:5000/traducao', {
      params: { texto }
    });
    return response.data;
  } catch (error) {
    console.error('Erro ao traduzir:', error);
    return { sinais: [] };
  }
}
