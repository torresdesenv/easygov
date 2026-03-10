// src/data/biblioteca_riscos.ts
export const BIBLIOTECA_RISCOS = {
  "ISO 31000": [
    { ativo: "Rede Corporativa", ameaca: "Acesso não autorizado por falta de MFA", probabilidade: 4, impacto: 5, plano_mitigacao: "Implementar Autenticação de Dois Fatores em todos os pontos." },
    { ativo: "Dados de Clientes (LGPD)", ameaca: "Vazamento de dados por falta de criptografia", probabilidade: 3, impacto: 5, plano_mitigacao: "Implementar criptografia em repouso e em trânsito." },
    { ativo: "Colaboradores", ameaca: "Engenharia Social / Phishing", probabilidade: 5, impacto: 4, plano_mitigacao: "Treinamentos trimestrais de conscientização em segurança." },
    { ativo: "Servidores Cloud", ameaca: "Configurações incorretas de segurança", probabilidade: 3, impacto: 4, plano_mitigacao: "Auditorias mensais de conformidade na nuvem." }
  ],
  "COSO": [
    { ativo: "Processo de Compras", ameaca: "Fraude por falta de segregação de funções", probabilidade: 2, impacto: 4, plano_mitigacao: "Revisar permissões no ERP para segregação de acessos." },
    { ativo: "Continuidade de Negócio", ameaca: "Indisponibilidade de sistemas críticos", probabilidade: 3, impacto: 5, plano_mitigacao: "Desenvolver e testar anualmente o PCN (Plano de Continuidade)." },
    { ativo: "Cultura Organizacional", ameaca: "Descumprimento do Código de Ética", probabilidade: 2, impacto: 3, plano_mitigacao: "Implementar Canal de Denúncias anônimo." },
    { ativo: "Governança TI", ameaca: "Falta de supervisão da diretoria em riscos cibernéticos", probabilidade: 4, impacto: 4, plano_mitigacao: "Criar comitê mensal de riscos e segurança." }
  ]
};