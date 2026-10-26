export const bi = (en, pt) => ({ en, pt });
export const projects = [
  {
    id: "customer-service-automation",
    group: "ai",
    title: bi(
      "Customer Service Workflow Automation",
      "Automação de Atendimento ao Cliente",
    ),
    category: bi("AI & Business Automation", "IA e Automação de Negócios"),
    status: bi(
      "Implemented in real business operations",
      "Implementado em operações reais",
    ),
    date: "2026",
    org: "Koube Química do Brasil / SuperSAC",
    tools: [
      "Flow Builder",
      "n8n",
      "Supabase",
      "ChatGPT / OpenAI API",
      "WhatsApp Business API",
    ],
    overview: bi(
      "Designed and implemented customer service automation workflows to help businesses streamline communication, reduce manual tasks, and improve response management.",
      "Desenvolvimento e implementação de workflows automatizados para ajudar empresas a organizar o atendimento ao cliente, reduzir tarefas manuais e melhorar a gestão das respostas.",
    ),
    challenge: bi(
      "Customer conversations, information collection and team handoffs required coordinated processes.",
      "Conversas com clientes, coleta de informações e transferências entre equipes exigiam processos coordenados.",
    ),
    approach: bi(
      "Built workflows from scratch, connecting official WhatsApp Business API integrations, external databases and AI-assisted responses.",
      "Criei workflows do zero, conectando a API oficial do WhatsApp Business, bancos de dados externos e respostas assistidas por IA.",
    ),
    features: bi(
      [
        "Automated triage and customer information collection",
        "Conversation routing and handoff to human agents",
        "External database integration and agent notifications",
        "AI-assisted responses and follow-up processes",
        "Client training and workflow support",
      ],
      [
        "Triagem automatizada e coleta de informações dos clientes",
        "Direcionamento de conversas e transferência para atendentes",
        "Integração com bancos externos e notificações à equipe",
        "Respostas assistidas por IA e processos de acompanhamento",
        "Treinamento de clientes e suporte aos workflows",
      ],
    ),
    result: bi(
      "More organized customer service, substantially reduced manual work, better customer information organization and more efficient response management. No quantitative results are claimed.",
      "Atendimento mais organizado, redução substancial de tarefas manuais, melhor organização de informações e gestão de respostas mais eficiente. Não são apresentados resultados quantitativos.",
    ),
    role: bi(
      "Workflow design, integration setup, implementation and client training.",
      "Design de workflows, configuração de integrações, implementação e treinamento de clientes.",
    ),
  },
  {
    id: "social-media-content",
    group: "content",
    title: bi(
      "AI-Assisted Social Media Content Production",
      "Produção de Conteúdo para Redes Sociais com IA",
    ),
    category: bi(
      "Generative AI & Digital Content",
      "IA Generativa e Conteúdo Digital",
    ),
    status: bi(
      "Ongoing professional work",
      "Trabalho profissional em andamento",
    ),
    date: bi("2024–Present", "2024–Atual"),
    org: "Freelance — Eliane Xavier",
    tools: ["ChatGPT", "Canva", "CapCut"],
    overview: bi(
      "Ongoing freelance content production combining AI-assisted visual creation, graphic design, and short-form video editing for educational social media content.",
      "Produção contínua de conteúdo digital combinando criação visual assistida por IA, design gráfico e edição de vídeos curtos para materiais educativos e promocionais.",
    ),
    challenge: bi(
      "Translate educational themes related to quantum physics and spirituality into consistent social content across formats.",
      "Transformar temas educativos relacionados à física quântica e espiritualidade em conteúdo consistente para diferentes formatos.",
    ),
    approach: bi(
      "Interpret themes, develop visual concepts and supporting copy, generate AI-assisted assets, assemble designs in Canva and edit videos in CapCut.",
      "Interpreto temas, desenvolvo conceitos e textos, gero recursos visuais com IA, monto designs no Canva e edito vídeos no CapCut.",
    ),
    features: bi(
      [
        "Approximately six short videos and six promotional flyers weekly",
        "Educational Instagram carousels and YouTube thumbnails",
        "AI-assisted backgrounds and visual assets",
        "Visual adaptation for multiple publishing formats",
      ],
      [
        "Aproximadamente seis vídeos curtos e seis flyers por semana",
        "Carrosséis educativos para Instagram e miniaturas para YouTube",
        "Fundos e recursos visuais assistidos por IA",
        "Adaptação visual para diferentes formatos",
      ],
    ),
    result: bi(
      "A recurring content production workflow. Real work samples will be added when authorized assets are supplied.",
      "Um processo contínuo de produção de conteúdo. Exemplos reais serão adicionados quando os arquivos autorizados forem fornecidos.",
    ),
    role: bi(
      "Visual concepts, graphic design, supporting copy and video editing.",
      "Conceitos visuais, design gráfico, textos de apoio e edição de vídeo.",
    ),
  },
  {
    id: "daily-planner",
    group: "productivity",
    title: bi("Daily Planner App", "Aplicativo de Planejamento Diário"),
    category: bi(
      "Productivity & AI-Assisted Development",
      "Produtividade e Desenvolvimento Assistido por IA",
    ),
    status: bi("Functional web application", "Aplicativo web funcional"),
    date: bi("Personal application", "Aplicativo pessoal"),
    tools: [bi("AI-assisted development", "Desenvolvimento assistido por IA")],
    overview: bi(
      "A productivity web application developed with AI-assisted tools to organize daily tasks, manage schedules, and encourage consistent planning through gamification.",
      "Aplicativo web de produtividade desenvolvido com auxílio de IA para organizar tarefas, gerenciar compromissos e incentivar o planejamento por meio de gamificação.",
    ),
    challenge: bi(
      "Bring daily tasks, schedules and planning habits together.",
      "Reunir tarefas diárias, compromissos e hábitos de planejamento.",
    ),
    approach: bi(
      "Used AI-assisted development tools to combine task management, calendars and gamification. The original application is deployed separately.",
      "Usei ferramentas de desenvolvimento assistido por IA para combinar tarefas, calendários e gamificação. O aplicativo original será disponibilizado separadamente.",
    ),
    features: bi(
      [
        "Task creation and organization",
        "Calendar views and Google Calendar integration",
        "Points and levels",
        "Reasons for unfinished tasks",
        "Reminders and productivity reports",
        "Responsive design",
      ],
      [
        "Criação e organização de tarefas",
        "Visualizações de calendário e integração com Google Calendar",
        "Sistema de pontos e níveis",
        "Registro dos motivos de tarefas não concluídas",
        "Lembretes e relatórios de produtividade",
        "Design responsivo",
      ],
    ),
    result: bi(
      "Intended to support consistent daily planning. The live URL and real screenshots are pending; this portfolio does not recreate the original app.",
      "Voltado a apoiar o planejamento diário consistente. O endereço público e capturas reais estão pendentes; este portfólio não recria o aplicativo original.",
    ),
    role: bi(
      "Product concept and application development with AI-assisted tools.",
      "Concepção do produto e desenvolvimento com ferramentas assistidas por IA.",
    ),
  },
  {
    id: "assignment-hub",
    group: "productivity",
    title: bi("Assignment Hub", "Central de Atividades Acadêmicas"),
    category: bi("Academic Productivity", "Produtividade Acadêmica"),
    status: bi(
      "Functional application · Improvements ongoing",
      "Aplicativo funcional · Em aprimoramento",
    ),
    date: bi("Personal application", "Aplicativo pessoal"),
    tools: ["ICS", "Google Calendar", "Moodle"],
    overview: bi(
      "An academic productivity web application designed to organize coursework, track assignment deadlines, and connect Moodle calendar information with Google Calendar.",
      "Aplicativo web desenvolvido para organizar atividades acadêmicas, acompanhar prazos de entrega e integrar informações do calendário Moodle ao Google Calendar.",
    ),
    challenge: bi(
      "Keep course assignments and deadlines organized across academic and personal calendars.",
      "Organizar atividades e prazos entre calendários acadêmicos e pessoais.",
    ),
    approach: bi(
      "Organize coursework by course and import Moodle calendar information through ICS files or links, with Google Calendar synchronization.",
      "Organizar atividades por disciplina e importar informações do calendário Moodle por arquivos ou links ICS, com sincronização com Google Calendar.",
    ),
    features: bi(
      [
        "Assignment and deadline tracking by course",
        "Moodle ICS file or link import",
        "Google Calendar synchronization and automatic updates",
        "Manual refresh and deadline notifications",
        "Responsive interface",
      ],
      [
        "Acompanhamento de atividades e prazos por disciplina",
        "Importação de arquivos ou links ICS do Moodle",
        "Sincronização com Google Calendar e atualizações automáticas",
        "Atualização manual e notificações de prazo",
        "Interface responsiva",
      ],
    ),
    result: bi(
      "Intended to improve visibility of academic deadlines. The simplified public demo uses fictional data and makes no external connections.",
      "Voltado a melhorar a visibilidade dos prazos acadêmicos. A demonstração simplificada usa dados fictícios e não faz conexões externas.",
    ),
    role: bi(
      "Application concept and AI-assisted development of academic planning workflows.",
      "Concepção e desenvolvimento assistido por IA de processos de planejamento acadêmico.",
    ),
  },
  {
    id: "ai-video-clipping",
    group: "ai",
    title: bi(
      "AI Video Analysis & Clipping",
      "Análise de Vídeos e Cortes com IA",
    ),
    category: bi(
      "Artificial Intelligence & Media Tools",
      "Inteligência Artificial e Ferramentas de Mídia",
    ),
    status: bi(
      "Details Pending Verification",
      "Detalhes Pendentes de Verificação",
    ),
    date: bi("Exploratory project", "Projeto exploratório"),
    tools: [
      bi(
        "Technologies pending verification",
        "Tecnologias pendentes de verificação",
      ),
    ],
    overview: bi(
      "An AI-assisted video analysis and clipping project exploring ways to identify meaningful segments in long-form content and organize them into coherent short videos.",
      "Projeto de análise de vídeos e criação de cortes assistidos por IA, voltado à identificação de trechos relevantes e à organização de vídeos curtos com começo, desenvolvimento e conclusão.",
    ),
    challenge: bi(
      "Identify useful moments in long content while preserving context.",
      "Identificar momentos relevantes em conteúdos longos preservando o contexto.",
    ),
    approach: bi(
      "Conceptual exploration: review source content, identify relevant passages, organize a narrative and review potential clips. Implementation details remain unverified.",
      "Exploração conceitual: revisar o conteúdo, identificar trechos relevantes, organizar uma narrativa e revisar possíveis cortes. Os detalhes da implementação ainda não foram verificados.",
    ),
    features: bi(
      [
        "Concept: identify meaningful passages",
        "Concept: organize a beginning, development and conclusion",
        "No video-processing features are claimed as functional",
      ],
      [
        "Conceito: identificar trechos relevantes",
        "Conceito: organizar começo, desenvolvimento e conclusão",
        "Nenhum recurso de processamento é apresentado como funcional",
      ],
    ),
    result: bi(
      "Intended benefit: more coherent short-form content. Source files are needed to verify implementation, tools and results.",
      "Benefício pretendido: conteúdo curto mais coerente. Os arquivos do projeto são necessários para verificar implementação, ferramentas e resultados.",
    ),
    role: bi(
      "Project exploration; implementation scope pending verification.",
      "Exploração do projeto; escopo da implementação pendente de verificação.",
    ),
  },
];
export const education = [
  {
    name: "Louisiana State University of Alexandria",
    date: bi("2026 – Expected July 2027", "2026 – Previsão: julho de 2027"),
    title: bi(
      "Bachelor’s Degree in Organizational Studies — In Progress",
      "Bacharelado em Organizational Studies — Em andamento",
    ),
    details: bi(
      "Reported current GPA: 3.93 / 4.00. Academic focus: business, organizational studies and practical applications of AI.",
      "GPA atual informado: 3,93 / 4,00. Foco acadêmico: negócios, estudos organizacionais e aplicações práticas de IA.",
    ),
  },
  {
    name: "Monroe Community College",
    date: bi("Graduated May 2025", "Concluído em maio de 2025"),
    title: bi(
      "Associate of Arts in Liberal Arts",
      "Associate of Arts em Liberal Arts",
    ),
    details: bi(
      "Dean’s List. Student-athlete, men’s soccer.",
      "Dean’s List. Estudante-atleta de futebol masculino.",
    ),
  },
  {
    name: "Southwestern Christian University",
    date: bi("2024–2025 · One year of studies", "2024–2025 · Um ano de estudos"),
    title: bi(
      "Undergraduate Studies in Business Administration",
      "Estudos de graduação em Business Administration",
    ),
    details: bi(
      "Student-athlete, men’s soccer. Member of a junior varsity soccer tournament championship team.",
      "Estudante-atleta de futebol masculino. Integrante de equipe campeã de torneio de futebol junior varsity.",
    ),
  },
];
export const experience = [
  {
    name: "Koube Química do Brasil / SuperSAC",
    date: bi("June–October 2026", "Junho–Outubro de 2026"),
    title: bi(
      "AI & Customer Service Automation Consultant",
      "Consultor de IA e Automação de Atendimento",
    ),
    details: bi(
      "Direct work with Koube began in June 2026; subsequent work with SuperSAC took place September–October 2026.",
      "O trabalho direto com a Koube começou em junho de 2026; o trabalho posterior com a SuperSAC ocorreu de setembro a outubro de 2026.",
    ),
    items: projects[0].features,
  },
  {
    name: "Freelance — Eliane Xavier",
    date: bi("2024–Present", "2024–Atual"),
    title: bi(
      "AI-Assisted Social Media Content Designer",
      "Designer de Conteúdo para Redes Sociais com IA",
    ),
    details: projects[1].approach,
    items: projects[1].features,
  },
  {
    name: "Oklahoma City, Oklahoma",
    date: bi("August 2025–May 2026", "Agosto de 2025–Maio de 2026"),
    title: bi("Soccer Referee", "Árbitro de Futebol"),
    details: bi(
      "Officiated indoor soccer, youth tournaments and high school leagues. Applied rules, made decisions under pressure and communicated with participants. U.S. Soccer Grassroots Referee License.",
      "Arbitragem de futebol indoor, torneios de base e ligas escolares. Aplicação de regras, decisões sob pressão e comunicação com participantes. Licença U.S. Soccer Grassroots Referee.",
    ),
  },
  {
    name: "Monroe Community College",
    date: bi("April 2024–May 2025", "Abril de 2024–Maio de 2025"),
    title: bi(
      "Residence Hall Front Desk Attendant",
      "Atendente da Recepção da Residência Estudantil",
    ),
    details: bi(
      "Monitored access and visitors, maintained visitor records according to procedures and assisted campus Public Safety with residence hall security operations.",
      "Monitorei acessos e visitantes, mantive registros conforme os procedimentos e auxiliei a segurança pública do campus nas operações da residência estudantil.",
    ),
  },
];
export const skills = [
  {
    title: bi(
      "Artificial Intelligence & Automation",
      "Inteligência Artificial e Automação",
    ),
    items: bi(
      [
        "ChatGPT — Advanced",
        "Google AI Studio — Intermediate",
        "Prompt Engineering",
        "AI-Assisted Application Development",
        "Customer Service Workflow Automation",
        "AI Image Generation",
        "n8n",
        "Flow Builder",
        "OpenAI API Integration Experience",
      ],
      [
        "ChatGPT — Avançado",
        "Google AI Studio — Intermediário",
        "Engenharia de Prompts",
        "Desenvolvimento de Aplicativos Assistido por IA",
        "Automação de Atendimento ao Cliente",
        "Geração de Imagens com IA",
        "n8n",
        "Flow Builder",
        "Experiência em Integração com API OpenAI",
      ],
    ),
  },
  {
    title: bi(
      "Digital Tools & Content Creation",
      "Ferramentas Digitais e Criação de Conteúdo",
    ),
    items: bi(
      [
        "Canva — Advanced",
        "CapCut",
        "AI-Assisted Website Development",
        "GitHub — Basic",
        "Social Media Graphic Design",
        "Short-Form Video Editing",
      ],
      [
        "Canva — Avançado",
        "CapCut",
        "Desenvolvimento de Sites Assistido por IA",
        "GitHub — Básico",
        "Design Gráfico para Redes Sociais",
        "Edição de Vídeos Curtos",
      ],
    ),
  },
  {
    title: bi(
      "Business & Professional Skills",
      "Negócios e Competências Profissionais",
    ),
    items: bi(
      [
        "Customer Service",
        "Client Training",
        "Business Process Optimization",
        "Problem Solving",
        "Communication",
        "Teamwork",
        "Adaptability",
        "Creativity",
        "Time Management",
        "Critical Thinking",
        "Decision Making",
      ],
      [
        "Atendimento ao Cliente",
        "Treinamento de Clientes",
        "Otimização de Processos",
        "Resolução de Problemas",
        "Comunicação",
        "Trabalho em Equipe",
        "Adaptabilidade",
        "Criatividade",
        "Gestão do Tempo",
        "Pensamento Crítico",
        "Tomada de Decisão",
      ],
    ),
  },
];
