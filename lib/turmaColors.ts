
export const turmaColorMap: { [key: string]: { bg: string; text: string } } = {

  edificacoes: { bg: '#043d2f', text: '#ffffff' },
  "edificações": { bg: '#043d2f', text: '#ffffff' },
  

  automacao: { bg: '#5f1212', text: '#ffffff' },
  "automação": { bg: '#5f1212', text: '#ffffff' },
  
 
  informatica: { bg: '#040404', text: '#ffffff' },
  "informática": { bg: '#040404', text: '#ffffff' },
  
  
  segurança: { bg: '#2d105d', text: '#ffffff' },
  seguranca: { bg: '#2d105d', text: '#ffffff' },
  "segurança no trabalho": { bg: '#2d105d', text: '#ffffff' },
  "seguranca no trabalho": { bg: '#2d105d', text: '#ffffff' },
  segurancanotrabalho: { bg: '#2d105d', text: '#ffffff' },
  "1seg": { bg: '#2d105d', text: '#ffffff' },
  "2seg": { bg: '#2d105d', text: '#ffffff' },
  "1 seg": { bg: '#2d105d', text: '#ffffff' },
  "2 seg": { bg: '#2d105d', text: '#ffffff' },


  eletrotecnica: { bg: '#051c3f', text: '#ffffff' },
  "eletrotécnica": { bg: '#051c3f', text: '#ffffff' },
};

const normalizeTurmaName = (nomeTurma: string) => {
  return nomeTurma
    .toLowerCase()
    .normalize('NFD')
    .replace(/\p{Diacritic}/gu, '')
    .replace(/[^a-z0-9]/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
};

export const getCorTurma = (nomeTurma?: string) => {
  if (!nomeTurma) return { bg: '#2d105d', text: '#ffffff' }; 

  const nomeNormalizado = normalizeTurmaName(nomeTurma);
  const chave = nomeNormalizado.replace(/\s+/g, '');

  return turmaColorMap[chave] || turmaColorMap[nomeNormalizado] || { bg: '#2d105d', text: '#ffffff' };
};

export const getCorTurmaHex = (nomeTurma?: string) => {
  return getCorTurma(nomeTurma).bg;
};
