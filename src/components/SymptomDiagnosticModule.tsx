import React, { useState, useMemo } from 'react';
import { 
  Stethoscope, 
  Clock, 
  HelpCircle, 
  Activity, 
  FileText, 
  ChevronRight, 
  ChevronDown, 
  Info, 
  AlertTriangle, 
  ClipboardCheck, 
  RefreshCw,
  Search,
  CheckCircle2,
  Brain,
  ShieldAlert,
  Home,
  Copy,
  Check
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UBS_CATALOG_DISEASES, DiseaseInfo } from '../ubsCatalog';

interface Symptom {
  id: string;
  name: string;
  category: string;
}

const SYMPTOMS: Symptom[] = [
  // Geral/Sistêmico
  { id: 'febre', name: 'Febre (T > 37.8ºC)', category: 'Geral / Sistêmico' },
  { id: 'fadiga', name: 'Fadiga ou Fraqueza severa', category: 'Geral / Sistêmico' },
  { id: 'perda_peso', name: 'Perda de peso involuntária', category: 'Geral / Sistêmico' },
  { id: 'ganho_peso', name: 'Ganho de peso rápido', category: 'Geral / Sistêmico' },
  { id: 'sudorese_noturna', name: 'Sudorese noturna intensa', category: 'Geral / Sistêmico' },
  { id: 'sede_excessiva', name: 'Sede excessiva (Polidipsia)', category: 'Geral / Sistêmico' },
  { id: 'picada_animal', name: 'Contato / Picada de escorpião ou animal peçonhento', category: 'Geral / Sistêmico' },
  
  // Cardiorrespiratório
  { id: 'dor_peito', name: 'Dor no peito (Dor Torácica)', category: 'Cardiorrespiratório' },
  { id: 'dispneia', name: 'Falta de ar / Cansaço (Dispneia)', category: 'Cardiorrespiratório' },
  { id: 'tosse', name: 'Tosse seca ou produtiva', category: 'Cardiorrespiratório' },
  { id: 'chiado_peito', name: 'Chiado ou aperto no peito (Sibilos)', category: 'Cardiorrespiratório' },
  { id: 'palpitacao', name: 'Coração acelerado / batedeira', category: 'Cardiorrespiratório' },
  { id: 'ortopneia', name: 'Falta de ar ao deitar (Ortopneia)', category: 'Cardiorrespiratório' },
  
  // Otorrino / Cabeça
  { id: 'dor_garganta', name: 'Dor de garganta / Odinofagia', category: 'Otorrinolaringologia' },
  { id: 'sintomas_gripais', name: 'Obstrução nasal, coriza ou espirros', category: 'Otorrinolaringologia' },
  { id: 'cefaleia', name: 'Dor de cabeça (Cefaleia)', category: 'Neurológico / Mental' },
  { id: 'tontura', name: 'Tontura, Vertigem ou Desequilíbrio', category: 'Neurológico / Mental' },
  { id: 'confusao_mental', name: 'Confusão mental, desorientação ou sonolência', category: 'Neurológico / Mental' },
  { id: 'fraqueza_unilateral', name: 'Fraqueza em um lado do corpo / fala súbita alterada', category: 'Neurológico / Mental' },
  { id: 'insonia', name: 'Dificuldade para dormir (Insônia)', category: 'Neurológico / Mental' },
  { id: 'ansiedade_nervosismo', name: 'Ansiedade ou tensão persistente', category: 'Neurológico / Mental' },
  { id: 'tristeza', name: 'Tristeza profunda ou perda de interesse (Anedonia)', category: 'Neurológico / Mental' },
  
  // Gastrointestinal
  { id: 'dor_abdominal', name: 'Dor abdominal (Dor na barriga)', category: 'Gastrointestinal' },
  { id: 'dor_abdominal_fid', name: 'Dor localizada na Fossa Ilíaca Direita (FID)', category: 'Gastrointestinal' },
  { id: 'dor_abdominal_hd', name: 'Dor localizada no Hipocôndrio Direito (HD)', category: 'Gastrointestinal' },
  { id: 'sinal_blumberg', name: 'Dor forte ao descompressar o abdômen (Blumberg)', category: 'Gastrointestinal' },
  { id: 'sinal_murphy', name: 'Parada inspiratória à palpação do abdômen superior (Murphy)', category: 'Gastrointestinal' },
  { id: 'azia_queimacao', name: 'Azia, refluxo ou queimação retroesternal', category: 'Gastrointestinal' },
  { id: 'nausea_vomito', name: 'Náuseas ou Vômitos', category: 'Gastrointestinal' },
  { id: 'diarreia', name: 'Diarreia (fezes líquidas e frequentes)', category: 'Gastrointestinal' },
  { id: 'constipacao', name: 'Prisão de ventre (Constipação)', category: 'Gastrointestinal' },
  
  // Geniturinário
  { id: 'dor_urinar', name: 'Dor, ardência ou urgência ao urinar', category: 'Geniturinário / Ginecológico' },
  { id: 'dor_lombar_giordano', name: 'Dor nas costas forte + dor à percussão (Giordano+)', category: 'Geniturinário / Ginecológico' },
  { id: 'secura_vaginal', name: 'Secura vaginal, dispareunia ou fogachos', category: 'Geniturinário / Ginecológico' },
  { id: 'corrimento_vaginal', name: 'Corrimento vaginal com odor ou prurido', category: 'Geniturinário / Ginecológico' },
  { id: 'corrimento_uretral', name: 'Corrimento uretral masculino', category: 'Geniturinário / Ginecológico' },
  
  // Musculoesquelético
  { id: 'dor_articulacoes', name: 'Dor, inchaço ou rigidez nas articulações', category: 'Musculoesquelético' },
  { id: 'dor_lombar', name: 'Dor lombar comum', category: 'Musculoesquelético' },
  { id: 'dor_panturrilha', name: 'Dor ou inchaço unilateral na panturrilha', category: 'Musculoesquelético' },
  { id: 'edema_mmii', name: 'Inchaço bilateral nas pernas (Edema MMII)', category: 'Musculoesquelético' },
  
  // Pele
  { id: 'coceira', name: 'Coceira intensa na pele (Prurido)', category: 'Pele & Dermatologia' },
  { id: 'manchas_vermelhas', name: 'Manchas vermelhas, pápulas ou vesículas na pele', category: 'Pele & Dermatologia' }
];

type DurationType = 'hyperacute' | 'acute' | 'subacute' | 'chronic';

interface DiseaseSymptomProfile {
  diseaseId: string;
  symptoms: Record<string, number>; // weight 1 to 5
  durations: DurationType[];
  setting: 'ubs' | 'ps' | 'ambos';
  whyExplanation: string;
  nextStepsExams: string;
}

const DISEASE_SYMPTOM_PROFILES: Record<string, DiseaseSymptomProfile> = {
  has: {
    diseaseId: 'has',
    symptoms: { cefaleia: 2, tontura: 3, palpitacao: 2 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'A cefaleia persistente e tonturas em picos pressóricos sugerem hipertensão arterial.',
    nextStepsExams: 'Realizar MRPA por 5 dias ou MAPA de 24h. Solicitar Urina 1, Creatinina, Potássio, Glicemia, Perfil Lipídico e ECG.'
  },
  dm2: {
    diseaseId: 'dm2',
    symptoms: { sede_excessiva: 5, perda_peso: 3, fadiga: 2 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'A tríade clássica de polidipsia (sede excessiva), perda de peso inexplicada e fadiga indica descompensação glicêmica.',
    nextStepsExams: 'Solicitar Glicemia de Jejum, Hemoglobina Glicada (HbA1c) e Urina Tipo 1.'
  },
  drge: {
    diseaseId: 'drge',
    symptoms: { azia_queimacao: 5, dor_peito: 3, nausea_vomito: 2 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'Pirose e queimação retroesternal que pioram em decúbito confirmam refluxo gastroesofágico.',
    nextStepsExams: 'Diagnóstico é clínico. Solicitar Endoscopia Digestiva Alta (EDA) se houver sinais de alarme.'
  },
  hipo: {
    diseaseId: 'hipo',
    symptoms: { fadiga: 4, ganho_peso: 4, constipacao: 3 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Fadiga crônica, ganho de peso e obstipação apontam para lentificação metabólica do hipotireoidismo.',
    nextStepsExams: 'Solicitar dosagem de TSH e T4 Livre no sangue.'
  },
  asma: {
    diseaseId: 'asma',
    symptoms: { dispneia: 4, tosse: 3, chiado_peito: 5 },
    durations: ['acute', 'subacute', 'chronic'],
    setting: 'ambos',
    whyExplanation: 'Dispneia paroxística, chiado recorrente e aperto torácico são característicos da asma.',
    nextStepsExams: 'Solicitar Espirometria com prova broncodilatadora para confirmar variação do fluxo aéreo.'
  },
  dpoc: {
    diseaseId: 'dpoc',
    symptoms: { dispneia: 5, tosse: 4 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Dispneia progressiva e tosse crônica produtiva em paciente tabagista crônico.',
    nextStepsExams: 'Solicitar Espirometria pós-broncodilatadora e Radiografia de Tórax.'
  },
  itu: {
    diseaseId: 'itu',
    symptoms: { dor_urinar: 5, dor_abdominal: 2, febre: 1 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Disúria, polaciúria e dor suprapúbica em início agudo apontam para infecção urinária baixa.',
    nextStepsExams: 'Diagnóstico clínico em mulheres jovens. Solicitar EAS e Urocultura se gestantes, idosos ou refratariedade.'
  },
  sinusite: {
    diseaseId: 'sinusite',
    symptoms: { cefaleia: 4, febre: 2, tosse: 2 },
    durations: ['acute', 'subacute'],
    setting: 'ubs',
    whyExplanation: 'Dor pressórica em face, obstrução nasal e tosse indicam rinossinusite bacteriana ou viral.',
    nextStepsExams: 'Diagnóstico clínico. Solicitar Tomografia de seios da face apenas se houver complicações.'
  },
  amigdalite: {
    diseaseId: 'amigdalite',
    symptoms: { febre: 4, dor_garganta: 5, cefaleia: 2 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Odinofagia intensa e febre sugerem faringoamigdalite aguda.',
    nextStepsExams: 'Visualização direta de exsudato amigdaliano. Aplicar escore de Centor para uso de antibióticos.'
  },
  pac: {
    diseaseId: 'pac',
    symptoms: { febre: 4, tosse: 4, dispneia: 3, dor_peito: 3 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Febre alta, tosse produtiva e dor torácica ventilatório-dependente indicam infecção do parênquima pulmonar.',
    nextStepsExams: 'Solicitar Radiografia de Tórax (PA e Perfil) e Hemograma com PCR.'
  },
  anemia: {
    diseaseId: 'anemia',
    symptoms: { fadiga: 5, tontura: 3, palpitacao: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Astenia severa e tontura postural refletem a redução do transporte de oxigênio pela hemoglobina.',
    nextStepsExams: 'Solicitar Hemograma completo, Ferritina, Ferro sérico e Capacidade de Ligação (TIBC).'
  },
  depressao: {
    diseaseId: 'depressao',
    symptoms: { tristeza: 5, fadiga: 3, insonia: 4 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Humor deprimido diário e anedonia persistente por mais de 2 semanas indicam episódio depressivo.',
    nextStepsExams: 'Aplicar escore PHQ-9. Coletar TSH e Hemograma para excluir causas secundárias.'
  },
  ansiedade: {
    diseaseId: 'ansiedade',
    symptoms: { ansiedade_nervosismo: 5, insonia: 4, palpitacao: 3 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Preocupações incontroláveis, tensão muscular e palpitações físicas denotam quadro de ansiedade geral.',
    nextStepsExams: 'Aplicar rastreamento GAD-7. Solicitar ECG de repouso se houver queixas cardiovasculares intensas.'
  },
  dengue: {
    diseaseId: 'dengue',
    symptoms: { febre: 5, dor_articulacoes: 4, cefaleia: 4, manchas_vermelhas: 3 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Febre súbita, dor retroorbitária, mialgias e exantema indicam dengue clássica.',
    nextStepsExams: 'Realizar Prova do Laço. Solicitar Antígeno NS1 (até 5º dia) ou Sorologia IgM/IgG. Coletar Hemograma urgente.'
  },
  iam: {
    diseaseId: 'iam',
    symptoms: { dor_peito: 5, dispneia: 3, sudorese_noturna: 1 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Dor retroesternal opressiva súbita, irradiada para membro superior esquerdo e acompanhada de sudorese fria.',
    nextStepsExams: 'Emergência crítica! Obter ECG de 12 derivações em < 10 minutos. Coletar Troponina e preparar transferência imediata.'
  },
  avc: {
    diseaseId: 'avc',
    symptoms: { fraqueza_unilateral: 5, tontura: 3, cefaleia: 2 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Déficit neurológico focal agudo com hemiparesia súbita e desvio de rima facial.',
    nextStepsExams: 'Código Vermelho AVC! Encaminhar ao hospital para Tomografia de Crânio sem contraste de urgência.'
  },
  tep: {
    diseaseId: 'tep',
    symptoms: { dispneia: 5, dor_peito: 4, dor_panturrilha: 3 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Instalação hiperaguda de dispneia intensa e dor pleurítica em paciente com dor ou inchaço na panturrilha (TVP).',
    nextStepsExams: 'Avaliar escore de Wells. Solicitar D-Dímero se baixo risco, ou Angiotomografia de Tórax se alto risco.'
  },
  pancreatite: {
    diseaseId: 'pancreatite',
    symptoms: { dor_abdominal: 5, nausea_vomito: 4, febre: 2 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Dor epigástrica súbita em barra irradiada para o dorso, acompanhada de vômitos persistentes.',
    nextStepsExams: 'Dosar Lipase e Amilase séricas (critério diagnóstico de 3x o limite superior) e realizar USG de abdômen.'
  },
  pielonefrite_complicada: {
    diseaseId: 'pielonefrite_complicada',
    symptoms: { febre: 5, dor_lombar_giordano: 5, dor_urinar: 3, nausea_vomito: 3 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Febre alta com calafrios associada a dor na punho-percussão lombar (Sinal de Giordano) e vômitos.',
    nextStepsExams: 'Coletar Hemoculturas bilaterais, Urina 1 e Urocultura. Solicitar Ultrassonografia de vias urinárias.'
  },
  apendicite: {
    diseaseId: 'apendicite',
    symptoms: { dor_abdominal_fid: 5, sinal_blumberg: 5, febre: 3, nausea_vomito: 3 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Dor migratória para fossa ilíaca direita acompanhada de dor forte à descompressão (sinal de Blumberg).',
    nextStepsExams: 'Avaliar escala de Alvarado. Solicitar TC de Abdômen com contraste ou Ultrassonografia, Hemograma e PCR.'
  },
  colecistite: {
    diseaseId: 'colecistite',
    symptoms: { dor_abdominal_hd: 5, sinal_murphy: 5, nausea_vomito: 4, febre: 2 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Dor em hipocôndrio direito que cessa a inspiração ao palpar (sinal de Murphy) acompanhada de febre.',
    nextStepsExams: 'Solicitar Ultrassonografia de Abdômen Total (detecta espessamento de parede biliar) e exames de PCR e Leucograma.'
  },
  icc_descompensada: {
    diseaseId: 'icc_descompensada',
    symptoms: { dispneia: 5, edema_mmii: 5, fadiga: 4, ortopneia: 5 },
    durations: ['acute', 'subacute', 'chronic'],
    setting: 'ambos',
    whyExplanation: 'Ortopneia e edema bilateral com cansaço refletem congestão sistêmica e pulmonar severa.',
    nextStepsExams: 'Solicitar Radiografia de Tórax, ECG de 12 derivações e NT-proBNP ou BNP sérico.'
  },
  acidente_peconhento: {
    diseaseId: 'acidente_peconhento',
    symptoms: { picada_animal: 5, dor_local: 5, nausea_vomito: 3 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Dor intensa imediata após contato com escorpião ou outro animal peçonhento.',
    nextStepsExams: 'Monitorização cardíaca por ECG contínuo. Solicitar exames laboratoriais (CPK, Troponina, Eletrólitos) nos casos moderados/graves.'
  },
  ivas: {
    diseaseId: 'ivas',
    symptoms: { sintomas_gripais: 5, dor_garganta: 4, tosse: 3, febre: 2 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Combinação clássica de coriza, obstrução nasal, faringite leve e tosse em quadro viral autolimitado.',
    nextStepsExams: 'Diagnóstico estritamente clínico. Não há indicação de exames complementares de rotina.'
  },
  asma_crise: {
    diseaseId: 'asma_crise',
    symptoms: { dispneia: 5, chiado_peito: 5, tosse: 4 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Agudização súbita de sibilância difusa e falta de ar limitante em paciente asmático.',
    nextStepsExams: 'Oximetria de pulso contínua. Gasometria arterial apenas se refratariedade ou risco iminente de fadiga muscular.'
  },
  climaterio: {
    diseaseId: 'climaterio',
    symptoms: { secura_vaginal: 5, insonia: 3, fadiga: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Fogachos e secura vaginal na faixa etária do climatério refletem o hipoestrogenismo fisiológico.',
    nextStepsExams: 'Diagnóstico clínico. Solicitar exames preventivos (Mamografia, USG transvaginal e Citologia).'
  },
  ivc: {
    diseaseId: 'ivc',
    symptoms: { edema_mmii: 5, dor_panturrilha: 3 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Inchaço bilateral no fim do dia e sensação de peso nas pernas indicam insuficiência venosa crônica.',
    nextStepsExams: 'Diagnóstico clínico. Solicitar Doppler Venoso de MMII apenas se houver suspeita de trombose unilateral.'
  }
};

const LOCAL_CATALOG_DISEASES: DiseaseInfo[] = [
  {
    id: "apendicite",
    name: "Apendicite Aguda",
    category: "Gastrointestinal / Cirurgia",
    diagnostic: "Baseado na escala Alvarado (dor migratória para FID, anorexia, náusea, descompressão dolorosa, febre, leucocitose). Confirmar por TC de Abdômen/Pelve ou Ultrassonografia.",
    alarm: "Sinais de peritonite difusa (abdômen em tábua, descompressão dolorosa generalizada), sepse ou choque séptico (hipotensão, taquicardia) - sala vermelha cirúrgica de imediato.",
    treatment: [
      {
        title: "Suporte Inicial de Urgência (PS)",
        desc: "Jejum oral absoluto. Monitorização e acesso venoso calibroso. Iniciar expansão volêmica endovenosa com Ringer Lactato ou Soro Fisiológico (20 mL/kg). Controle rigoroso da dor com Dipirona 1g EV ou Tramadol 50-100mg EV."
      },
      {
        title: "Tratamento Definitivo & Antibioticoterapia",
        desc: "Encaminhar para Apendicectomia de urgência. Antibioticoterapia de largo espectro direcionada a coliformes e anaeróbios: Cefazolina 2g EV + Metronidazol 500mg EV (casos simples) ou Piperacilina/Tazobactam 4.5g EV de 6/6h (casos perfurados ou peritonite)."
      }
    ]
  },
  {
    id: "colecistite",
    name: "Colecistite Aguda",
    category: "Gastrointestinal / Cirurgia",
    diagnostic: "Sinais inflamatórios locais (Sinal de Murphy, dor/defesa em HD), sistêmicos (febre, PCR, leucocitose) e exames de imagem (Ultrassonografia abdominal).",
    alarm: "Instabilidade hemodinâmica, calafrios intensos (colangite), icterícia obstrutiva associada ou peritonite generalizada (perfuração).",
    treatment: [
      {
        title: "Suporte Clínico Imediato (PS)",
        desc: "Jejum oral. Hidratação parenteral e correção eletrolítica. Analgesia vigorosa com Tenoxicam 40mg EV e opioides se necessário (Morfina 2-4mg EV). Ondansetrona 8mg EV de 8/8h para vômitos."
      },
      {
        title: "Antibioticoterapia & Colecistectomia",
        desc: "Iniciar Ceftriaxona 2g EV de 24/24h ou Ciprofloxacino 400mg EV + Metronidazol 500mg EV de 8/8h. Providenciar internação para Colecistectomia videolaparoscópica idealmente nas primeiras 72 horas."
      }
    ]
  },
  {
    id: "icc_descompensada",
    name: "ICC Descompensada",
    category: "Cardiovascular / Emergência",
    diagnostic: "Critérios de Framingham e perfil clínico-hemodinâmico na admissão: Perfil B (Quente/Úmido) é o mais comum; Perfil C (Frio/Úmido) denota choque cardiogênico.",
    alarm: "SatO2 < 90% com esforço respiratório severo (edema agudo de pulmão hipertensivo), ou hipotensão com sinais de má perfusão periférica (choque cardiogênico).",
    treatment: [
      {
        title: "Terapia de Congestão Pulmonar / Perfil B (PS)",
        desc: "Oxigenoterapia se SatO2 < 92% (VNI é altamente benéfica). Furosemida 20 a 40mg EV imediata (ou até 2.5x a dose de uso habitual). Se PAS ≥ 110 mmHg, iniciar Nitroglicerina endovenosa (5-10 mcg/min)."
      },
      {
        title: "Planejamento e Otimização Crônica (UBS)",
        desc: "Após estabilização e compensação volêmica (balanço hídrico negativo, sem ortopneia), reintroduzir e otimizar terapia tripla de base: IECA/BRA ou Sacubitril/Valsartana, Betabloqueador (Carvedilol), Espironolactona e iSGLT-2."
      }
    ]
  },
  {
    id: "crise_hipertensiva_ps",
    name: "Crise Hipertensiva",
    category: "Cardiovascular / Emergência",
    diagnostic: "PA ≥ 180/120 mmHg. Diferenciar estritamente: Emergência Hipertensiva (com lesão de órgão-alvo aguda) de Urgência Hipertensiva (sem lesão aguda de órgão-alvo).",
    alarm: "Presença de dor torácica opressiva, déficit neurológico súbito, dispneia extrema ou cefaleia refratária com vômitos.",
    treatment: [
      {
        title: "Emergência Hipertensiva - Sala Vermelha (PS)",
        desc: "Iniciar Nitroprussiato de Sódio (0.25-10 mcg/kg/min) ou Nitroglicerina EV. Meta de redução: diminuir a PA média em no máximo 20-25% na primeira hora (exceções: dissecção de aorta e AVC)."
      },
      {
        title: "Urgência Hipertensiva - Controle Oral (PS)",
        desc: "Redução controlada em 24-48h utilizando medicamentos via oral: Captopril 25-50mg VO, Clonidina 0.075-0.150mg VO ou Anlodipino 5mg VO. Evitar Nifedipino sublingual de ação rápida."
      }
    ]
  },
  {
    id: "geca",
    name: "Gastroenterite Aguda (GECA)",
    category: "Gastrointestinal",
    diagnostic: "Diagnóstico baseado em diarreia líquida aguda recente. Avaliar grau de desidratação clínica utilizando as diretrizes da OMS.",
    alarm: "Desidratação grave com letargia, anúria, hipotensão, presença de sangue/muco abundante (disenteria grave) ou vômitos incoercíveis refratários.",
    treatment: [
      {
        title: "Plano A e B - Reidratação Oral (UBS/PS)",
        desc: "Plano A (Sem desidratação): Soro de Reidratação Oral (SRO) à vontade após evacuações líquidas. Plano B (Desidratação moderada): Oferecer SRO sob supervisão (50-100 mL/kg em 4 horas). Zinco para crianças."
      },
      {
        title: "Plano C - Hidratação Parenteral (PS)",
        desc: "Indicado em desidratação grave ou falha do plano B. Infundir Soro Fisiológico 0.9% ou Ringer Lactato EV (100 mL/kg dividido em fases). Ondansetrona 4-8mg VO/EV para vômitos. Antibióticos (Ciprofloxacino) apenas se disenteria febril invasiva grave."
      }
    ]
  },
  {
    id: "acidente_peconhento",
    name: "Acidente Escorpiônico / Peçonhento",
    category: "Toxicologia / Emergência",
    diagnostic: "Identificação pelo histórico e dor local desproporcional. Classificar em Leve (apenas dor local), Moderado (vômitos ocasionais, sudorese) ou Grave (vômitos profusos, choque, edema agudo de pulmão).",
    alarm: "Vômitos sucessivos, prostração, sudorese abundante ou taquipneia em crianças menores de 10 anos - indica iminente edema agudo de pulmão e choque cardiogênico por ação das catecolaminas.",
    treatment: [
      {
        title: "Tratamento da Dor e Suporte (PS)",
        desc: "Infiltração local com Lidocaína 2% sem vasoconstritor (1 a 2 ml) ou analgésicos sistêmicos. Lavar exaustivamente o local com água e sabão. Manter paciente sob observação clínica por no mínimo 6 horas."
      },
      {
        title: "Soroterapia Específica de Emergência",
        desc: "Casos Moderados: Administrar de 2 a 3 ampolas de Soro Antiescorpiônico (SAEsc) EV. Casos Graves: Administrar 4 a 6 ampolas de SAEsc EV o mais rápido possível. Preparar suporte ventilatório e suporte inotrópico."
      }
    ]
  },
  {
    id: "ivas",
    name: "Infecção de Vias Aéreas Superiores (IVAS)",
    category: "Respiratória / Otorrino",
    diagnostic: "Diagnóstico essencialmente clínico. Inspeção de orofaringe e fossas nasais normais ou congestas. Ausculta pulmonar livre de ruídos.",
    alarm: "Surgimento de dispneia limitante, esforço respiratório severo, taquipneia, estridor ou febre refratária persistente por mais de 72 horas.",
    treatment: [
      {
        title: "Medidas Gerais & Suporte (UBS)",
        desc: "Repouso, hidratação abundante. Higiene nasal exaustiva com Soro Fisiológico 0.9% morno (aplicar 5-10 ml em cada narina várias vezes ao dia). Inalação apenas se obstrução importante."
      },
      {
        title: "Sintomáticos (Sem antibióticos)",
        desc: "Dipirona 500mg-1g VO de 6/6h ou Paracetamol 500-750mg de 6/6h para febre e dor. Orientar retorno se houver sinais de alarme. Não utilizar antibióticos em quadros eminentemente virais."
      }
    ]
  },
  {
    id: "asma_crise",
    name: "Asma Agudizada (Crise de Asma)",
    category: "Respiratória / Emergência",
    diagnostic: "Avaliar severidade: fala frases completas (Leve); prefere sentar, FC > 110, SatO2 90-95% (Moderada/Grave); letárgico ou tórax silencioso (Muito Grave).",
    alarm: "Tórax silencioso à ausculta (broncoespasmo severo impedindo fluxo de ar), cianose central ou alteração do sensório.",
    treatment: [
      {
        title: "Terapia Inalatória de Resgate (PS)",
        desc: "Oxigenoterapia para manter SatO2 93-95%. Salbutamol ou Fenoterol 4-10 jatos com espaçador a cada 20 minutos na primeira hora (ou nebulização com 10-20 gotas de Fenoterol + Soro). Associar Ipratrópio 20-40 gotas."
      },
      {
        title: "Corticoterapia & Otimização",
        desc: "Administrar Prednisolona 40-50mg VO ou Metilprednisolona 40-80mg EV precoce. Se refratário após 1 hora, considerar Sulfato de Magnésio 2g EV em infusão de 20 minutos."
      }
    ]
  }
];

export default function SymptomDiagnosticModule() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState<string>('Todas');
  const [selectedSymptoms, setSelectedSymptoms] = useState<Record<string, DurationType>>({});
  const [expandedSuspect, setExpandedSuspect] = useState<string | null>(null);
  const [settingFilter, setSettingFilter] = useState<'todos' | 'ubs' | 'ps'>('todos');
  const [copiedReport, setCopiedReport] = useState(false);

  // Categories extraction
  const categories = useMemo(() => {
    const cats = new Set(SYMPTOMS.map(s => s.category));
    return ['Todas', ...Array.from(cats)];
  }, []);

  // Filter symptoms
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS.filter(s => {
      const matchesSearch = s.name.toLowerCase().includes(searchTerm.toLowerCase());
      const matchesCategory = selectedCategory === 'Todas' || s.category === selectedCategory;
      return matchesSearch && matchesCategory;
    });
  }, [searchTerm, selectedCategory]);

  const handleToggleSymptom = (id: string) => {
    setSelectedSymptoms(prev => {
      const next = { ...prev };
      if (next[id]) {
        delete next[id];
      } else {
        next[id] = 'acute'; // default
      }
      return next;
    });
  };

  const handleChangeDuration = (id: string, duration: DurationType) => {
    setSelectedSymptoms(prev => ({ ...prev, [id]: duration }));
  };

  const handleReset = () => {
    setSelectedSymptoms({});
    setExpandedSuspect(null);
  };

  // Advanced Algorithm with dynamic detailed calculation explanations
  const suspectedDiagnoses = useMemo(() => {
    const userSymptomIds = Object.keys(selectedSymptoms);
    if (userSymptomIds.length === 0) return [];

    const results = Object.values(DISEASE_SYMPTOM_PROFILES).map(profile => {
      let earnedScore = 0;
      let totalProfileWeight = 0;
      let matchedSymptomCount = 0;
      const matchingDetails: { symptomName: string; weight: number; factor: number; scoreContribution: number }[] = [];

      // Iterate symptoms in profile
      Object.entries(profile.symptoms).forEach(([symptomId, weight]) => {
        totalProfileWeight += weight;
        const sObj = SYMPTOMS.find(s => s.id === symptomId);
        const name = sObj ? sObj.name : symptomId;

        if (selectedSymptoms[symptomId]) {
          matchedSymptomCount++;
          const userDuration = selectedSymptoms[symptomId];
          const durationMatches = profile.durations.includes(userDuration);
          const factor = durationMatches ? 1.0 : 0.4;
          const scoreContribution = weight * factor;
          earnedScore += scoreContribution;

          matchingDetails.push({
            symptomName: name,
            weight,
            factor,
            scoreContribution
          });
        }
      });

      // Base percentage
      const rawBasePercentage = totalProfileWeight > 0 ? (earnedScore / totalProfileWeight) * 100 : 0;

      // Penalize for missing high-weight cardinal symptoms (weight >= 4)
      const missingKeySymptomDetails: { symptomName: string; penalty: number }[] = [];
      let totalPenalty = 0;
      Object.entries(profile.symptoms).forEach(([symptomId, weight]) => {
        if (weight >= 4 && !selectedSymptoms[symptomId]) {
          const sObj = SYMPTOMS.find(s => s.id === symptomId);
          const name = sObj ? sObj.name : symptomId;
          const penalty = 15; // -15%
          totalPenalty += penalty;
          missingKeySymptomDetails.push({
            symptomName: name,
            penalty
          });
        }
      });

      // Synergy bonus
      let synergyBonus = 0;
      if (matchedSymptomCount >= 2) {
        synergyBonus = (matchedSymptomCount - 1) * 8;
      }

      // Calculate final probability
      let finalProbability = rawBasePercentage - totalPenalty + synergyBonus;
      finalProbability = Math.max(0, finalProbability);
      finalProbability = Math.min(95, Math.round(finalProbability)); // Cap at 95% clinical ceiling

      // Find catalog data
      const catalogDisease = UBS_CATALOG_DISEASES.find(d => d.id === profile.diseaseId) || 
                             LOCAL_CATALOG_DISEASES.find(d => d.id === profile.diseaseId);

      return {
        diseaseId: profile.diseaseId,
        probability: finalProbability,
        matchedSymptomCount,
        whyExplanation: profile.whyExplanation,
        nextStepsExams: profile.nextStepsExams,
        setting: profile.setting,
        catalog: catalogDisease,
        calculationDetails: {
          rawBasePercentage: Math.round(rawBasePercentage),
          earnedScore: Number(earnedScore.toFixed(1)),
          totalProfileWeight,
          synergyBonus,
          totalPenalty,
          matchingDetails,
          missingKeySymptomDetails
        }
      };
    })
    .filter(res => res.matchedSymptomCount > 0 && res.probability >= 15) // threshold of relevance
    .filter(res => {
      if (settingFilter === 'todos') return true;
      if (settingFilter === 'ubs') return res.setting === 'ubs' || res.setting === 'ambos';
      if (settingFilter === 'ps') return res.setting === 'ps' || res.setting === 'ambos';
      return true;
    })
    .sort((a, b) => b.probability - a.probability);

    return results;
  }, [selectedSymptoms, settingFilter]);

  // Generate copyable clinical report
  const handleCopyReport = () => {
    const symptomTexts = Object.entries(selectedSymptoms).map(([id, dur]) => {
      const s = SYMPTOMS.find(x => x.id === id);
      const durText = dur === 'hyperacute' ? '< 24 horas' : dur === 'acute' ? '1 a 7 dias' : dur === 'subacute' ? '1 a 4 semanas' : 'mais de 4 semanas';
      return `- ${s ? s.name : id} (Duração: ${durText})`;
    }).join('\n');

    const hypothesesTexts = suspectedDiagnoses.slice(0, 3).map(d => {
      return `* ${d.catalog?.name || d.diseaseId} (${d.probability}% de correlação) - Perfil: ${d.setting.toUpperCase()}\n  Exames Recomendados: ${d.nextStepsExams}`;
    }).join('\n\n');

    const report = `================================================
RELATÓRIO AUXILIAR DE TRIAGEM CLÍNICA 🔍
================================================
SINTOMAS APRESENTADOS:
${symptomTexts}

HIPÓTESES DIAGNÓSTICAS (Escore de Probabilidade Cruzada):
${hypothesesTexts || 'Nenhuma hipótese com correlação significativa.'}

Observação: Este relatório é um instrumento de apoio à decisão clínica e não substitui o julgamento soberano do médico assistente.
================================================`;

    navigator.clipboard.writeText(report);
    setCopiedReport(true);
    setTimeout(() => setCopiedReport(false), 2000);
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
      {/* Symptom Selection Panel (Left 5 cols) */}
      <div className="lg:col-span-5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-6 rounded-[32px] shadow-sm space-y-6">
        <div className="space-y-1">
          <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">Apoio à Decisão Médica</span>
          <h2 className="font-serif font-black text-xl text-slate-800 dark:text-white leading-tight">Análise de Sintomas do Paciente</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400">Selecione sintomas e o tempo de evolução. O algoritmo calcula as correlações para Atenção Básica (UBS) e Pronto Socorro (PS/UPA).</p>
        </div>

        {/* Filter bar */}
        <div className="space-y-3">
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar sintomas (ex: febre, dor, peito)..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="w-full bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-800/80 rounded-xl py-2.5 pl-10 pr-4 text-xs font-medium focus:ring-2 focus:ring-rose-500 focus:outline-none dark:text-white"
            />
          </div>

          <div className="flex gap-1 overflow-x-auto pb-1.5 scrollbar-thin scrollbar-thumb-slate-200">
            {categories.map(cat => (
              <button
                key={cat}
                onClick={() => setSelectedCategory(cat)}
                className={`px-3 py-1.5 rounded-lg text-[10px] font-bold whitespace-nowrap transition-all ${
                  selectedCategory === cat 
                    ? 'bg-slate-900 dark:bg-slate-100 text-white dark:text-slate-950 shadow-sm'
                    : 'bg-slate-100 dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:bg-slate-200'
                }`}
              >
                {cat}
              </button>
            ))}
          </div>
        </div>

        {/* Symptoms List */}
        <div className="space-y-2.5 max-h-[380px] overflow-y-auto pr-1 scrollbar-thin">
          {filteredSymptoms.map(symptom => {
            const isSelected = !!selectedSymptoms[symptom.id];
            return (
              <div 
                key={symptom.id}
                className={`p-3 rounded-2xl border transition-all space-y-2.5 ${
                  isSelected 
                    ? 'bg-rose-50/30 dark:bg-rose-950/5 border-rose-500/40' 
                    : 'bg-slate-50/30 dark:bg-slate-900/10 border-slate-200/60 dark:border-slate-850 hover:border-slate-300'
                }`}
              >
                <div 
                  className="flex items-center justify-between cursor-pointer"
                  onClick={() => handleToggleSymptom(symptom.id)}
                >
                  <div className="flex items-center gap-3">
                    <div className={`w-5 h-5 rounded-md border flex items-center justify-center transition-all shrink-0 ${
                      isSelected 
                        ? 'bg-rose-600 border-rose-600 text-white' 
                        : 'border-slate-350 dark:border-slate-700'
                    }`}>
                      {isSelected && <CheckCircle2 size={13} strokeWidth={3} />}
                    </div>
                    <div className="space-y-0.5">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{symptom.name}</span>
                      <p className="text-[9px] text-slate-400 dark:text-slate-500 uppercase tracking-wider font-semibold">{symptom.category}</p>
                    </div>
                  </div>
                </div>

                {/* Duration Picker inside selected symptom */}
                {isSelected && (
                  <motion.div 
                    initial={{ opacity: 0, height: 0 }}
                    animate={{ opacity: 1, height: 'auto' }}
                    className="pt-2 border-t border-slate-200/50 dark:border-slate-850/85 space-y-1.5"
                  >
                    <span className="text-[10px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wide flex items-center gap-1.5">
                      <Clock size={11} /> Há quanto tempo iniciou?
                    </span>
                    <div className="grid grid-cols-4 gap-1.5">
                      {(
                        [
                          { id: 'hyperacute', label: '< 24h' },
                          { id: 'acute', label: '1-7 d' },
                          { id: 'subacute', label: '1-4 sem' },
                          { id: 'chronic', label: '> 4 sem' }
                        ] as { id: DurationType; label: string }[]
                      ).map(dur => (
                        <button
                          key={dur.id}
                          onClick={() => handleChangeDuration(symptom.id, dur.id)}
                          className={`py-1 rounded-lg text-[9px] font-black uppercase text-center transition-all ${
                            selectedSymptoms[symptom.id] === dur.id
                              ? 'bg-rose-600 text-white shadow-sm'
                              : 'bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 text-slate-600 dark:text-slate-400 hover:bg-slate-100'
                          }`}
                        >
                          {dur.label}
                        </button>
                      ))}
                    </div>
                  </motion.div>
                )}
              </div>
            );
          })}
        </div>

        {Object.keys(selectedSymptoms).length > 0 && (
          <button 
            onClick={handleReset}
            className="w-full bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 text-slate-700 dark:text-slate-300 py-2.5 rounded-xl text-xs font-bold transition-all flex items-center justify-center gap-2 border border-slate-200 dark:border-slate-800"
          >
            <RefreshCw size={13} /> Limpar Seleção
          </button>
        )}
      </div>

      {/* Diagnostic suspected outcomes (Right 7 cols) */}
      <div className="lg:col-span-7 space-y-6">
        {/* Clinician Filters */}
        <div className="flex items-center justify-between gap-4 flex-wrap bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 px-5 py-3 rounded-2xl shadow-sm">
          <div className="flex items-center gap-2">
            <span className="text-[10px] font-black uppercase text-slate-400">Escopo Clínico:</span>
          </div>
          <div className="flex gap-1">
            {(
              [
                { id: 'todos', label: 'Todos', icon: HelpCircle },
                { id: 'ubs', label: 'Atenção Básica (UBS)', icon: Home },
                { id: 'ps', label: 'Pronto Socorro (PS)', icon: ShieldAlert }
              ] as { id: 'todos' | 'ubs' | 'ps'; label: string; icon: any }[]
            ).map(opt => {
              const Icon = opt.icon;
              return (
                <button
                  key={opt.id}
                  onClick={() => setSettingFilter(opt.id)}
                  className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-[10px] font-black uppercase transition-all ${
                    settingFilter === opt.id
                      ? 'bg-rose-600 text-white shadow-sm'
                      : 'bg-slate-50 dark:bg-slate-850 text-slate-500 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon size={12} />
                  <span>{opt.label}</span>
                </button>
              );
            })}
          </div>
        </div>

        {Object.keys(selectedSymptoms).length === 0 ? (
          <div className="bg-slate-50 dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 rounded-[32px] p-12 text-center flex flex-col items-center justify-center space-y-4">
            <div className="w-16 h-16 rounded-3xl bg-slate-100 dark:bg-slate-800/80 flex items-center justify-center text-slate-400">
              <Brain size={32} />
            </div>
            <div className="space-y-1.5 max-w-sm">
              <h3 className="font-serif font-black text-slate-800 dark:text-white">Selecione Sintomas</h3>
              <p className="text-xs text-slate-500 leading-relaxed">
                Adicione as queixas e sinais observados no painel lateral esquerdo para gerar hipóteses probabilísticas imediatas.
              </p>
            </div>
          </div>
        ) : (
          <div className="space-y-5">
            {/* Header / Summary */}
            <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-800 pb-3 flex-wrap gap-2">
              <span className="text-xs font-black text-slate-400 uppercase tracking-widest flex items-center gap-2">
                <Activity size={14} className="text-rose-500" /> {suspectedDiagnoses.length} Diagnósticos Compatíveis
              </span>
              
              <button 
                onClick={handleCopyReport}
                className="flex items-center gap-1.5 text-[10px] font-black uppercase bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-350 hover:bg-slate-200 px-3 py-1.5 rounded-xl border border-slate-200 dark:border-slate-700 transition-all"
              >
                {copiedReport ? <Check size={12} className="text-emerald-500" /> : <Copy size={12} />}
                <span>{copiedReport ? 'Copiado!' : 'Copiar Prontuário'}</span>
              </button>
            </div>

            {suspectedDiagnoses.length === 0 ? (
              <div className="bg-amber-500/5 border border-amber-500/10 rounded-[32px] p-8 text-center space-y-2">
                <AlertTriangle size={24} className="mx-auto text-amber-500" />
                <h4 className="font-bold text-slate-800 dark:text-slate-200">Sem correspondências no escopo selecionado</h4>
                <p className="text-xs text-slate-500 max-w-md mx-auto">
                  Tente alterar o filtro de escopo clínico ou selecione sintomas adicionais para identificar as hipóteses clínicas correspondentes.
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                <AnimatePresence mode="popLayout">
                  {suspectedDiagnoses.map((suspect, idx) => {
                    const isExpanded = expandedSuspect === suspect.diseaseId;
                    const prob = suspect.probability;
                    const details = suspect.calculationDetails;
                    
                    const borderStyle = prob >= 75 
                      ? 'border-emerald-500/20' 
                      : prob >= 45 
                        ? 'border-amber-500/20' 
                        : 'border-slate-250 dark:border-slate-800';
                    
                    const bgStyle = prob >= 75 
                      ? 'bg-emerald-500/[0.02] dark:bg-emerald-950/[0.02]' 
                      : prob >= 45 
                        ? 'bg-amber-500/[0.02] dark:bg-amber-950/[0.02]' 
                        : 'bg-white dark:bg-slate-900';

                    return (
                      <motion.div
                        key={suspect.diseaseId}
                        initial={{ opacity: 0, y: 12 }}
                        animate={{ opacity: 1, y: 0 }}
                        exit={{ opacity: 0, scale: 0.95 }}
                        transition={{ duration: 0.2, delay: idx * 0.03 }}
                        className={`border rounded-3xl overflow-hidden shadow-sm transition-all ${borderStyle} ${bgStyle}`}
                      >
                        {/* Summary Block */}
                        <div 
                          className="p-5 flex items-center justify-between gap-4 cursor-pointer select-none"
                          onClick={() => setExpandedSuspect(isExpanded ? null : suspect.diseaseId)}
                        >
                          <div className="flex items-center gap-4">
                            {/* Circle Percentage */}
                            <div className="relative w-12 h-12 flex items-center justify-center shrink-0">
                              <svg className="absolute w-full h-full transform -rotate-90">
                                <circle 
                                  cx="24" cy="24" r="20" 
                                  className="text-slate-100 dark:text-slate-800" 
                                  strokeWidth="3.5" stroke="currentColor" fill="transparent" 
                                />
                                <circle 
                                  cx="24" cy="24" r="20" 
                                  className={prob >= 75 ? 'text-emerald-500' : prob >= 45 ? 'text-amber-500' : 'text-slate-400'} 
                                  strokeWidth="3.5" strokeDasharray={`${2 * Math.PI * 20}`}
                                  strokeDashoffset={`${2 * Math.PI * 20 * (1 - prob / 100)}`}
                                  strokeLinecap="round" stroke="currentColor" fill="transparent" 
                                />
                              </svg>
                              <span className="text-xs font-black tracking-tighter text-slate-800 dark:text-white">{prob}%</span>
                            </div>

                            <div className="space-y-1">
                              <div className="flex items-center gap-1.5 flex-wrap">
                                <span className={`text-[9px] font-black uppercase px-2 py-0.5 rounded-full ${
                                  suspect.setting === 'ps' 
                                    ? 'bg-rose-500/10 text-rose-600 dark:text-rose-400' 
                                    : suspect.setting === 'ubs' 
                                      ? 'bg-teal-500/10 text-teal-600 dark:text-teal-400'
                                      : 'bg-indigo-500/10 text-indigo-600 dark:text-indigo-400'
                                }`}>
                                  {suspect.setting === 'ps' ? 'Pronto Socorro 🏥' : suspect.setting === 'ubs' ? 'Atenção Básica (UBS) 🏠' : 'Multinível (UBS/PS) 🌐'}
                                </span>
                                {prob >= 75 && (
                                  <span className="text-[9px] font-black uppercase bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 px-2 py-0.5 rounded-full">
                                    Alta Correlação
                                  </span>
                                )}
                              </div>
                              <h3 className="font-serif font-bold text-slate-800 dark:text-white leading-snug">
                                {suspect.catalog?.name || suspect.diseaseId}
                              </h3>
                            </div>
                          </div>

                          <div className="shrink-0 text-slate-400 bg-slate-50 dark:bg-slate-800/50 hover:bg-slate-100 dark:hover:bg-slate-800 p-2 rounded-xl transition-all">
                            {isExpanded ? <ChevronDown size={16} /> : <ChevronRight size={16} />}
                          </div>
                        </div>

                        {/* Expandable Clinical Protocol */}
                        {isExpanded && (
                          <div className="px-5 pb-6 border-t border-slate-100 dark:border-slate-800/80 pt-5 bg-slate-50/30 dark:bg-slate-900/40 space-y-5">
                            
                            {/* Mathematical Breakdown of Percentage */}
                            <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-3">
                              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center justify-between">
                                <span className="flex items-center gap-1.5">
                                  <Activity size={12} className="text-rose-600" /> Como o cálculo foi efetuado? (Auditável)
                                </span>
                                <span className="text-[10px] font-black text-rose-500">Escore Clínico</span>
                              </h4>
                              
                              <div className="text-xs text-slate-600 dark:text-slate-350 space-y-2">
                                <div className="flex justify-between border-b border-slate-100 dark:border-slate-800/80 pb-1.5">
                                  <span>1. Correspondência de Sintomas Base:</span>
                                  <strong className="text-slate-800 dark:text-white">{details.earnedScore} de {details.totalProfileWeight} pontos ({details.rawBasePercentage}%)</strong>
                                </div>
                                
                                {details.matchingDetails.length > 0 && (
                                  <div className="pl-3 space-y-1 text-[11px] text-slate-500 border-l border-slate-200 dark:border-slate-800">
                                    {details.matchingDetails.map((match, mIdx) => (
                                      <div key={mIdx} className="flex justify-between">
                                        <span>• {match.symptomName} (peso {match.weight})</span>
                                        <span>+{(match.weight * match.factor).toFixed(1)} pts {match.factor < 1 && <span className="text-orange-500">(tempo atípico -60%)</span>}</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {details.missingKeySymptomDetails.length > 0 && (
                                  <div className="flex justify-between text-red-500 dark:text-red-400 font-medium">
                                    <span>2. Penalidade por Sintomas Cardinais Ausentes:</span>
                                    <span>-{details.totalPenalty}%</span>
                                  </div>
                                )}
                                {details.missingKeySymptomDetails.length > 0 && (
                                  <div className="pl-3 space-y-1 text-[11px] text-red-400 border-l border-red-200 dark:border-red-950">
                                    {details.missingKeySymptomDetails.map((miss, mIdx) => (
                                      <div key={mIdx} className="flex justify-between">
                                        <span>• Ausência de: {miss.symptomName}</span>
                                        <span>-{miss.penalty}%</span>
                                      </div>
                                    ))}
                                  </div>
                                )}

                                {details.synergyBonus > 0 && (
                                  <div className="flex justify-between text-emerald-500 dark:text-emerald-400 font-medium">
                                    <span>3. Bônus por Sinergia Sindrômica ({suspect.matchedSymptomCount} sintomas):</span>
                                    <span>+{details.synergyBonus}%</span>
                                  </div>
                                )}

                                <div className="flex justify-between border-t border-slate-250 dark:border-slate-800 pt-2 text-slate-800 dark:text-white font-bold">
                                  <span>Probabilidade Clínica Final:</span>
                                  <span className="text-rose-600 dark:text-rose-400">
                                    {details.rawBasePercentage}% {details.totalPenalty > 0 && ` - ${details.totalPenalty}%`} {details.synergyBonus > 0 && ` + ${details.synergyBonus}%`} = {prob}%
                                    {prob === 95 && <span className="text-[10px] font-normal text-slate-400 block leading-none">(Teto clínico máximo para anamnese)</span>}
                                  </span>
                                </div>
                              </div>
                            </div>

                            {/* Why this suspicion */}
                            <div className="space-y-1.5">
                              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <Info size={12} className="text-rose-600" /> Raciocínio Clínico Integrado
                              </h4>
                              <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                {suspect.whyExplanation}
                              </p>
                            </div>

                            {/* Alarms / Red Flags */}
                            {suspect.catalog?.alarm && (
                              <div className="p-3.5 bg-red-500/5 border border-red-500/10 rounded-2xl flex gap-3">
                                <AlertTriangle className="text-red-500 shrink-0 mt-0.5 animate-pulse" size={16} />
                                <div className="space-y-0.5">
                                  <strong className="text-[10px] font-black uppercase text-red-600 dark:text-red-400 tracking-wider">Sinais de Gravidade / Alerta (Red Flags)</strong>
                                  <p className="text-xs text-red-600 dark:text-red-400 font-semibold leading-relaxed">
                                    {suspect.catalog.alarm}
                                  </p>
                                </div>
                              </div>
                            )}

                            {/* Exams & Next steps */}
                            <div className="space-y-1.5">
                              <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                <FileText size={12} className="text-blue-500" /> Exames Complementares & Diagnóstico Definitivo
                              </h4>
                              <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl">
                                <p className="text-xs font-medium text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {suspect.nextStepsExams}
                                </p>
                              </div>
                            </div>

                            {/* Complete Treatment Protocol */}
                            {suspect.catalog?.treatment && suspect.catalog.treatment.length > 0 && (
                              <div className="space-y-2.5">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <ClipboardCheck size={12} className="text-rose-600" /> Conduta Terapêutica Completa (SUS)
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {suspect.catalog.treatment.map((step, sIdx) => (
                                    <div 
                                      key={sIdx}
                                      className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5 shadow-sm"
                                    >
                                      <span className="text-[10px] font-black uppercase text-rose-600 dark:text-rose-400 tracking-wider">
                                        Etapa {sIdx + 1}: {step.title}
                                      </span>
                                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                        {step.desc}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            )}
                          </div>
                        )}
                      </motion.div>
                    );
                  })}
                </AnimatePresence>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
