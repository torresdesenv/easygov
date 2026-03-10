// src/data/perguntas.ts

export const DOMINIOS = [
  {
    id: 'gov',
    titulo: '1. Governança e Liderança (NIST: Identify)',
    questoes: [
      { id: 1, texto: "Existe uma Política de Segurança da Informação (PSI) aprovada pela alta direção?", categoria: 'Identify' },
      { id: 2, texto: "As responsabilidades de segurança estão claramente definidas e atribuídas?", categoria: 'Identify' },
      { id: 3, texto: "A alta direção revisa o desempenho da segurança em intervalos planejados?", categoria: 'Identify' },
      { id: 4, texto: "Existe um comitê formal para tratar de riscos e segurança?", categoria: 'Identify' },
      { id: 5, texto: "A organização possui objetivos de segurança mensuráveis?", categoria: 'Identify' },
      { id: 6, texto: "Há orçamento específico alocado para iniciativas de cibersegurança?", categoria: 'Identify' },
      { id: 7, texto: "A empresa possui um canal de denúncias para violações de ética ou segurança?", categoria: 'Identify' },
      { id: 8, texto: "Existem processos para garantir o cumprimento de leis (LGPD, etc)?", categoria: 'Identify' },
      { id: 9, texto: "A segurança é integrada à gestão de projetos da empresa?", categoria: 'Identify' },
      { id: 10, texto: "Há um processo de melhoria contínua (PDCA) para segurança?", categoria: 'Identify' },
      { id: 11, texto: "A organização mantém contato com grupos de especialistas e autoridades?", categoria: 'Identify' },
      { id: 12, texto: "Existem políticas para o uso aceitável de recursos de TI?", categoria: 'Identify' },
      { id: 13, texto: "A empresa realiza auditorias internas de segurança anualmente?", categoria: 'Identify' },
      { id: 14, texto: "Há um programa formal de conscientização para todos os colaboradores?", categoria: 'Identify' },
      { id: 15, texto: "A liderança comunica a importância da conformidade aos requisitos?", categoria: 'Identify' }
    ]
  },
  {
    id: 'ativos',
    titulo: '2. Gestão de Ativos e Dados (NIST: Identify)',
    questoes: [
      { id: 16, texto: "Existe um inventário atualizado de todos os ativos de hardware?", categoria: 'Identify' },
      { id: 17, texto: "Existe um inventário atualizado de todos os ativos de software?", categoria: 'Identify' },
      { id: 18, texto: "Os ativos possuem proprietários (Owners) formalmente definidos?", categoria: 'Identify' },
      { id: 19, texto: "Os dados críticos da empresa foram identificados e localizados?", categoria: 'Identify' },
      { id: 20, texto: "Existe um esquema de classificação de dados (Público, Confidencial, etc)?", categoria: 'Identify' },
      { id: 21, texto: "Há um processo para rotular informações conforme sua classificação?", categoria: 'Identify' },
      { id: 22, texto: "Existe um inventário de ativos em nuvem (Cloud)?", categoria: 'Identify' },
      { id: 23, texto: "Há um processo para descarte seguro de mídias e documentos?", categoria: 'Identify' },
      { id: 24, texto: "Os dispositivos móveis (BYOD) são inventariados e monitorados?", categoria: 'Identify' },
      { id: 25, texto: "Há restrição de uso de mídias removíveis (Pendrives, etc)?", categoria: 'Identify' },
      { id: 26, texto: "Existe controle sobre a instalação de softwares não autorizados?", categoria: 'Identify' },
      { id: 27, texto: "A empresa utiliza ferramentas de descoberta de ativos na rede?", categoria: 'Identify' },
      { id: 28, texto: "O ciclo de vida dos ativos (compra até descarte) é gerenciado?", categoria: 'Identify' },
      { id: 29, texto: "Dados pessoais (LGPD) são inventariados separadamente?", categoria: 'Identify' },
      { id: 30, texto: "Ativos são devolvidos formalmente no desligamento do funcionário?", categoria: 'Identify' }
    ]
  },
  {
    id: 'risco',
    titulo: '3. Gestão de Riscos (NIST: Identify)',
    questoes: [
      { id: 31, texto: "A metodologia de risco (ISO 31000/COSO) está definida?", categoria: 'Identify' },
      { id: 32, texto: "Análises de riscos de segurança são feitas periodicamente?", categoria: 'Identify' },
      { id: 33, texto: "A empresa mantém um Registro de Riscos (Risk Register) atualizado?", categoria: 'Identify' },
      { id: 34, texto: "O apetite a risco da organização foi definido pela diretoria?", categoria: 'Identify' },
      { id: 35, texto: "Os riscos identificados possuem planos de tratamento aprovados?", categoria: 'Identify' },
      { id: 36, texto: "Ameaças externas (Hacker, Ransomware) são monitoradas?", categoria: 'Identify' },
      { id: 37, texto: "Vulnerabilidades técnicas são identificadas via Scans regulares?", categoria: 'Identify' },
      { id: 38, texto: "Impactos financeiros de falhas de segurança foram estimados?", categoria: 'Identify' },
      { id: 39, texto: "A gestão de mudanças inclui análise de risco de segurança?", categoria: 'Identify' },
      { id: 40, texto: "Riscos em fornecedores de TI são avaliados sistematicamente?", categoria: 'Identify' },
      { id: 41, texto: "Existe seguro contra riscos cibernéticos?", categoria: 'Identify' },
      { id: 42, texto: "Os proprietários dos riscos assinam a aceitação dos riscos residuais?", categoria: 'Identify' },
      { id: 43, texto: "Riscos de continuidade de negócio foram avaliados?", categoria: 'Identify' },
      { id: 44, texto: "A empresa realiza testes de invasão (Pentest) anualmente?", categoria: 'Identify' },
      { id: 45, texto: "Cenários de ameaças são usados para testar a resiliência?", categoria: 'Identify' }
    ]
  },
  {
    id: 'acesso',
    titulo: '4. Controle de Acesso e Identidade (NIST: Protect)',
    questoes: [
      { id: 46, texto: "Existe uma política formal de controle de acesso?", categoria: 'Protect' },
      { id: 47, texto: "O registro de usuários segue um processo de aprovação?", categoria: 'Protect' },
      { id: 48, texto: "Acessos privilegiados (Admin) são restritos ao mínimo necessário?", categoria: 'Protect' },
      { id: 49, texto: "O MFA (Autenticação de Dois Fatores) é obrigatório para acessos externos?", categoria: 'Protect' },
      { id: 50, texto: "Senhas possuem requisitos de complexidade e comprimento mínimo?", categoria: 'Protect' },
      { id: 51, texto: "Existe um sistema de Single Sign-On (SSO) centralizado?", categoria: 'Protect' },
      { id: 52, texto: "Contas de usuários inativos são bloqueadas em menos de 24h?", categoria: 'Protect' },
      { id: 53, texto: "Os direitos de acesso são revisados trimestralmente?", categoria: 'Protect' },
      { id: 54, texto: "Acesso físico a salas de servidores é controlado e registrado?", categoria: 'Protect' },
      { id: 55, texto: "É proibido o compartilhamento de contas e senhas?", categoria: 'Protect' },
      { id: 56, texto: "Uso de identidades genéricas (ex: admin, suporte) é evitado?", categoria: 'Protect' },
      { id: 57, texto: "Existe controle sobre o acesso de terceiros/visitantes?", categoria: 'Protect' },
      { id: 58, texto: "Acesso remoto via VPN utiliza criptografia forte e certificados?", categoria: 'Protect' },
      { id: 59, texto: "O provisionamento de acesso segue o Princípio do Menor Privilégio?", categoria: 'Protect' },
      { id: 60, texto: "Sistemas críticos possuem logs de quem acessou e o que fez?", categoria: 'Protect' }
    ]
  },
  {
    id: 'protecao',
    titulo: '5. Proteção de Dados e Sistemas (NIST: Protect)',
    questoes: [
      { id: 61, texto: "Dados em repouso nos servidores são criptografados?", categoria: 'Protect' },
      { id: 62, texto: "O tráfego de rede sensível utiliza protocolos TLS 1.2 ou superior?", categoria: 'Protect' },
      { id: 63, texto: "Existe proteção de antivírus/EDR em todos os computadores?", categoria: 'Protect' },
      { id: 64, texto: "Updates de segurança (Patches) são aplicados em até 30 dias?", categoria: 'Protect' },
      { id: 65, texto: "A rede é segmentada (VLANs) para isolar sistemas críticos?", categoria: 'Protect' },
      { id: 66, texto: "O Wi-Fi corporativo utiliza autenticação forte (WPA3/Enterprise)?", categoria: 'Protect' },
      { id: 67, texto: "Dispositivos móveis corporativos podem ser limpos remotamente?", categoria: 'Protect' },
      { id: 68, texto: "Existe controle de portas USB para evitar vazamento de dados?", categoria: 'Protect' },
      { id: 69, texto: "O desenvolvimento de software segue práticas de código seguro?", categoria: 'Protect' },
      { id: 70, texto: "Ambientes de Teste e Produção são estritamente separados?", categoria: 'Protect' },
      { id: 71, texto: "Utiliza-se ferramentas de DLP (Data Loss Prevention)?", categoria: 'Protect' },
      { id: 72, texto: "A configuração de Firewalls é revisada periodicamente?", categoria: 'Protect' },
      { id: 73, texto: "Sistemas legados sem suporte são isolados da rede principal?", categoria: 'Protect' },
      { id: 74, texto: "Há proteção contra ataques de DoS/DDoS?", categoria: 'Protect' },
      { id: 75, texto: "Documentos físicos sensíveis são triturados antes do descarte?", categoria: 'Protect' }
    ]
  },
  {
    id: 'detec',
    titulo: '6. Detecção e Monitoramento (NIST: Detect)',
    questoes: [
      { id: 76, texto: "Logs de segurança são coletados de forma centralizada (SIEM)?", categoria: 'Detect' },
      { id: 77, texto: "Existem alertas automáticos para tentativas de invasão (IDS/IPS)?", categoria: 'Detect' },
      { id: 78, texto: "A empresa monitora o uso indevido de contas administrativas?", categoria: 'Detect' },
      { id: 79, texto: "Falhas de login sucessivas geram alertas para a equipe de TI?", categoria: 'Detect' },
      { id: 80, texto: "A integridade dos arquivos críticos do sistema é monitorada?", categoria: 'Detect' },
      { id: 81, texto: "Há monitoramento de tráfego de rede para países não usuais?", categoria: 'Detect' },
      { id: 82, texto: "Existe monitoramento de logs de auditoria 24x7?", categoria: 'Detect' },
      { id: 83, texto: "A empresa realiza 'Threat Hunting' para buscar ameaças ocultas?", categoria: 'Detect' },
      { id: 84, texto: "Logs são protegidos contra alteração ou exclusão indevida?", categoria: 'Detect' },
      { id: 85, texto: "Há monitoramento de alterações em permissões de pastas de rede?", categoria: 'Detect' },
      { id: 86, texto: "O tempo de retenção dos logs atende aos requisitos legais?", categoria: 'Detect' },
      { id: 87, texto: "Há detecção de dispositivos não autorizados conectados na rede?", categoria: 'Detect' },
      { id: 88, texto: "O desempenho dos sistemas é monitorado para detectar anomalias?", categoria: 'Detect' },
      { id: 89, texto: "Logs de acesso físico (Câmeras/Portas) são monitorados?", categoria: 'Detect' },
      { id: 90, texto: "A equipe de segurança realiza revisões mensais de alertas falsos?", categoria: 'Detect' }
    ]
  },
  {
    id: 'resp',
    titulo: '7. Resposta a Incidentes (NIST: Respond)',
    questoes: [
      { id: 91, texto: "Existe um Plano de Resposta a Incidentes (PRI) documentado?", categoria: 'Respond' },
      { id: 92, texto: "Há uma equipe (CSIRT) definida para atuar em crises?", categoria: 'Respond' },
      { id: 93, texto: "Incidentes são classificados por severidade (Baixo a Crítico)?", categoria: 'Respond' },
      { id: 94, texto: "Existe um fluxo de comunicação para reportar incidentes?", categoria: 'Respond' },
      { id: 95, texto: "A empresa possui evidências de testes do plano de resposta?", categoria: 'Respond' },
      { id: 96, texto: "Há um processo formal para coleta e preservação de evidências?", categoria: 'Respond' },
      { id: 97, texto: "Autoridades externas (polícia/órgãos) são notificadas quando necessário?", categoria: 'Respond' },
      { id: 98, texto: "Há um processo de 'Lições Aprendidas' após cada incidente?", categoria: 'Respond' },
      { id: 99, texto: "A equipe sabe como isolar um servidor infectado por Ransomware?", categoria: 'Respond' },
      { id: 100, texto: "Existe um limite de tempo (SLA) para conter um incidente crítico?", categoria: 'Respond' },
      { id: 101, texto: "Há backups de contatos de emergência fora da rede corporativa?", categoria: 'Respond' },
      { id: 102, texto: "A empresa monitora redes sociais/deep web em busca de dados vazados?", categoria: 'Respond' },
      { id: 103, texto: "Incidentes com dados pessoais são tratados conforme a LGPD?", categoria: 'Respond' },
      { id: 104, texto: "A equipe de resposta possui as ferramentas necessárias (Forense/Labs)?", categoria: 'Respond' },
      { id: 105, texto: "Os funcionários sabem identificar e reportar um Phishing?", categoria: 'Respond' }
    ]
  },
  {
    id: 'recup',
    titulo: '8. Recuperação e Continuidade (NIST: Recover)',
    questoes: [
      { id: 106, texto: "Existe um Plano de Continuidade de Negócios (PCN) atualizado?", categoria: 'Recover' },
      { id: 107, texto: "A estratégia de Backup segue a regra 3-2-1 (3 cópias, 2 mídias, 1 externa)?", categoria: 'Recover' },
      { id: 108, texto: "Backups são testados mensalmente (Restaurar para validar)?", categoria: 'Recover' },
      { id: 109, texto: "O RTO (Tempo de Recuperação) de sistemas críticos foi definido?", categoria: 'Recover' },
      { id: 110, texto: "O RPO (Ponto de Recuperação/Perda de Dados) foi definido?", categoria: 'Recover' },
      { id: 111, texto: "Existe um site de desastre (DR Site) ou redundância em nuvem?", categoria: 'Recover' },
      { id: 112, texto: "Backups estão protegidos contra alteração (Imutabilidade)?", categoria: 'Recover' },
      { id: 113, texto: "A restauração de sistemas segue uma ordem de prioridade definida?", categoria: 'Recover' },
      { id: 114, texto: "Há geradores ou UPS (Nobreak) para manter o data center ativo?", categoria: 'Recover' },
      { id: 115, texto: "A empresa realiza exercícios de simulação de crise com a diretoria?", categoria: 'Recover' },
      { id: 116, texto: "Contratos com fornecedores garantem SLAs de disponibilidade?", categoria: 'Recover' },
      { id: 117, texto: "Existe cópia de segurança offline (Air-gapped)?", categoria: 'Recover' },
      { id: 118, texto: "O PCN é revisado após mudanças significativas na infraestrutura?", categoria: 'Recover' },
      { id: 119, texto: "A comunicação com clientes em caso de desastre está planejada?", categoria: 'Recover' },
      { id: 120, texto: "A infraestrutura de TI pode ser reconstruída do zero a partir dos backups?", categoria: 'Recover' }
    ]
  }
];