// Gerenciador simples de estado da empresa selecionada
export const getEmpresaAtiva = () => {
  if (typeof window !== 'undefined') {
    return localStorage.getItem('easygov_empresa_id');
  }
  return null;
};

export const setEmpresaAtiva = (id: string) => {
  localStorage.setItem('easygov_empresa_id', id);
};