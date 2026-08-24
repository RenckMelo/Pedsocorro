import { useState, useEffect, FormEvent, MouseEvent } from 'react';
import { 
  FileText, 
  User, 
  Activity, 
  Pill, 
  Plus, 
  Trash2, 
  Copy, 
  Check, 
  Search, 
  Brain, 
  ArrowRight, 
  Clock, 
  ChevronRight, 
  AlertTriangle,
  Stethoscope,
  Heart,
  Droplets,
  Bookmark,
  Calendar,
  Sparkles,
  Info,
  ArrowUp,
  ArrowDown,
  RotateCcw,
  Sliders,
  CheckSquare,
  Square,
  CheckCircle2,
  X,
  Layers,
  GripVertical,
  Edit2,
  Edit3,
  PlusCircle,
  Save
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { User as UserType } from '../types';
import { UBS_CATALOG_DISEASES } from '../ubsCatalog';

// Static Clinical reference enrichments for Medication Lookup
const MED_ENRICHMENTS: Record<string, { commercial: string[]; adult: string; pediatric: string }> = {
  'Amoxicilina + Clavulanato': {
    commercial: ['Clavulin', 'Sigma Clav', 'Novamox', 'Policlav'],
    adult: '500mg/125mg de 8h em 8h, ou 875mg/125mg de 12h em 12h, via oral.',
    pediatric: '45 a 90 mg/kg/dia (baseado na amoxicilina), divididos de 8h em 8h ou 12h em 12h, via oral.'
  },
  'Ceftriaxona': {
    commercial: ['Rocefin', 'Triaxin', 'Keftron'],
    adult: '1g a 2g, administrado por via Intramuscular (IM) ou Intravenosa (IV) a cada 12h ou 24h.',
    pediatric: '50 a 100 mg/kg/dia, via Intramuscular (IM) ou Intravenosa (IV) em dose única ou dividida em 2 tomadas.'
  },
  'Fluoxetina': {
    commercial: ['Prozac', 'Daforin', 'Verotina'],
    adult: '20mg a 60mg por via oral, tomado em dose única pela manhã.',
    pediatric: '≥ 8 anos: Iniciar com 10mg ao dia, podendo progredir para 20mg ao dia, sob acompanhamento especializado.'
  },
  'Sertralina': {
    commercial: ['Zoloft', 'Assert', 'Tolrest', 'Serenata'],
    adult: '25mg a 200mg por via oral, tomado pela manhã ou à noite.',
    pediatric: '≥ 6 anos: Iniciar com 25mg ao dia, regulando semanalmente até o máximo de 200mg/dia se necessário.'
  },
  'Ibuprofeno': {
    commercial: ['Advil', 'Alivium', 'Ibuflex'],
    adult: '400mg a 600mg por via oral a cada 6h ou 8h (limite de 2400mg/dia).',
    pediatric: '5 a 10 mg/kg por dose, via oral a cada 6h ou 8h (ou 1 gota por kg da suspensão a 50mg/mL).'
  },
  'Paracetamol': {
    commercial: ['Tylenol', 'Pacemol', 'Parador'],
    adult: '500mg a 1000mg por via oral a cada 6h ou 8h (limite de 4000mg/dia).',
    pediatric: '10 a 15 mg/kg por dose, via oral a cada 4h ou 6h (ou 1 gota por kg da suspensão a 200mg/mL, máx 40 gotas).'
  },
  'Dipirona': {
    commercial: ['Novalgina', 'Anador', 'Magnopyrol'],
    adult: '500mg a 1000mg por via oral ou venosa a cada 6h (limite de 4000mg/dia).',
    pediatric: '10 a 12.5 mg/kg por dose, via oral ou venosa a cada 6h (ou 1 gota por kg da suspensão a 500mg/mL, máx 40 gotas).'
  },
  'Prednisolona': {
    commercial: ['Prelone', 'Predsim'],
    adult: '5mg a 60mg por via oral em dose única matinal.',
    pediatric: '1 a 2 mg/kg/dia, via oral em dose única matinal por 3 a 5 dias (máximo de 40mg ao dia).'
  },
  'Azitromicina': {
    commercial: ['Astro', 'Azitromic', 'Zitromax'],
    adult: '500mg por via oral em dose única diária por 3 a 5 dias.',
    pediatric: '10 mg/kg por via oral em dose única diária por 3 dias (máximo de 500mg ao dia).'
  }
};

// Static Clinical reference enrichments for Disease Lookup
const DISEASE_ENRICHMENTS: Record<string, { tests: string[]; exams: string[] }> = {
  'has': {
    tests: ['Duas ou mais medições de PA ≥ 140/90 mmHg em consultas distintas', 'Monitorização Ambulatorial da Pressão Arterial (MAPA) de 24h', 'Monitorização Residencial da Pressão Arterial (MRPA)'],
    exams: ['Creatinina Sérica (com estimativa de Ritmo de Filtração Glomerular)', 'Potássio Sérico', 'Glicemia de Jejum e HbA1c', 'Perfil Lipídico Completo (CT, HDL, LDL, TG)', 'Urina tipo 1 (Pesquisa de proteinúria/microalbuminúria)', 'Eletrocardiograma de Repouso (ECG)']
  },
  'dm2': {
    tests: ['Glicemia de Jejum ≥ 126 mg/dL em duas ocasiões distintas', 'Hemoglobina Glicada (HbA1c) ≥ 6.5%', 'Teste Oral de Tolerância à Glicose (TOTG 75g) com glicemia ≥ 200 mg/dL após 2h'],
    exams: ['Dosagem de Hemoglobina Glicada (HbA1c)', 'Glicemia de Jejum', 'Creatinina Sérica', 'Relação Albumina/Creatinina Urinária (Microalbuminúria)', 'Perfil Lipídico Completo', 'Exame de Fundo de Olho (Fundoscopia anual)']
  },
  'dislip': {
    tests: ['Perfil lipídico em jejum ou pós-prandial', 'Estratificação do Risco Cardiovascular Global (Escore de Framingham)'],
    exams: ['Colesterol Total, HDL, LDL, Triglicerídeos', 'TSH Sérico (para exclusão de hipotireoidismo secundário)', 'TGO e TGP (enzimas hepáticas antes de iniciar estatina)', 'Glicemia de Jejum']
  },
  'asma': {
    tests: ['Espirometria com prova broncodilatadora (revelando distúrbio obstrutivo reversível com aumento de VEF1 > 12% e 200ml)', 'Pico de Fluxo Expiratório (Peak Flow) para monitoramento de crises'],
    exams: ['Espirometria completa', 'Radiografia de Tórax (PA e perfil - para excluir diagnósticos diferenciais)', 'Hemograma com contagem de eosinófilos']
  },
  'pac': {
    tests: ['Aplicação do Escore CURB-65 (Confusão, Ureia, FR, PA, Idade) para estratificação de internação ou tratamento ambulatorial'],
    exams: ['Radiografia de Tórax (Incidências PA e Perfil) - Consolidação alveolar', 'Hemograma Completo', 'Ureia Sérica', 'Proteína C Reativa (PCR)']
  },
  'itu': {
    tests: ['Exame Clínico (disúria, polaciúria)', 'Fita reativa urinária (presença de nitrito positivo e esterase leucocitária)'],
    exams: ['Urina tipo 1 / EAS', 'Urocultura com Antibiograma (obrigatório em gestantes, idosos e ITUs complicadas ou recorrentes)']
  },
  'dengue': {
    tests: ['Prova do Laço (obrigatória em todos os casos suspeitos)', 'Teste Rápido NS1 (solicitar do 1º ao 3º dia de febre)', 'Sorologia IgM/IgG para Dengue (solicitar a partir do 6º dia de sintomas)'],
    exams: ['Hemograma completo (monitorar plaquetas e hematócrito para detecção de hemoconcentração)', 'Dosagem de transaminases (TGO/TGP) se sinais de alarme']
  },
  'hipo': {
    tests: ['Dosagem sérica de Hormônio Tireoestimulante (TSH)'],
    exams: ['TSH Sérico', 'T4 Livre Sérico', 'Anticorpos Anti-Peroxidase Tireoidiana (Anti-TPO) para confirmar Tireoidite de Hashimoto']
  },
  'anemia': {
    tests: ['Hemograma Completo analisando contagem de eritrócitos, microcitose (VCM) e hipocromia (HCM)'],
    exams: ['Hemograma', 'Ferritina Sérica (marcador de escolha de reserva de ferro)', 'Ferro Sérico', 'Capacidade Total de Ligação do Ferro (TIBC)', 'Saturação de Transferrina']
  }
};

// Comprehensive Catalog of Anamnese Sections across all specialties
export interface AnamneseCatalogItem {
  id: string;
  title: string;
  category: 'Geral & Identificação' | 'História & Antecedentes' | 'Especialidades (Pediatria & GO)' | 'Revisão de Sistemas (ISDA)' | 'Exame Físico por Aparelhos' | 'Diagnóstico & Conduta';
  defaultText: string;
}

export const ANAMNESE_SECTIONS_CATALOG: AnamneseCatalogItem[] = [
  // Categoria 1: Geral & Identificação
  {
    id: 'identificacao',
    title: 'ID',
    category: 'Geral & Identificação',
    defaultText: 'Paciente [Nome], [Idade] anos, sexo [Masc/Fem], [Estado civil], [Profissão], natural e procedente de [Localidade].'
  },
  {
    id: 'qp',
    title: 'QP',
    category: 'Geral & Identificação',
    defaultText: 'Sem queixas ativas no momento / Avaliação clínica de rotina.'
  },
  {
    id: 'hda',
    title: 'HDA',
    category: 'Geral & Identificação',
    defaultText: 'Paciente assintomático(a), LOTE, BEG, nega febre, dores, inapetência ou alterações fisiológicas recentes. Nega medicação prévia para o quadro.'
  },

  // Categoria 2: História & Antecedentes
  {
    id: 'antecedentes_pessoais',
    title: 'AP',
    category: 'História & Antecedentes',
    defaultText: 'Nega comorbidades crônicas (HAS, DM, DLP, Asma/DPOC, IRC). Nega cirurgias ou internações prévias.'
  },
  {
    id: 'medicamentos',
    title: 'MEDS',
    category: 'História & Antecedentes',
    defaultText: 'Nega uso contínuo de medicações de prescrição (MUC) ou automedicação habitual.'
  },
  {
    id: 'alergias',
    title: 'ALERGIAS',
    category: 'História & Antecedentes',
    defaultText: 'NKDA (Nega alergias medicamentosas conhecidas). Nega alergias alimentares ou atopia grave.'
  },
  {
    id: 'antecedentes_familiares',
    title: 'AF',
    category: 'História & Antecedentes',
    defaultText: 'Nega histórico familiar de neoplasias precoces, DCV prematura ou doenças genético-hereditárias.'
  },
  {
    id: 'habitos',
    title: 'HÁBITOS',
    category: 'História & Antecedentes',
    defaultText: 'Nega tabagismo, etilismo ou substâncias ilícitas. Pratica atividade física regular. Sono reparador.'
  },

  // Categoria 3: Especialidades (Pediatria & GO)
  {
    id: 'antecedentes_pediatricos',
    title: 'PUERICULTURA',
    category: 'Especialidades (Pediatria & GO)',
    defaultText: 'Pré-natal sem intercorrências (10 consultas). Parto vaginal a termo (39 sem), PN: 3.200g, Apgar 9/10. Triagem neonatal (pezinho, orelhinha, olhinho) normal. AME até 6 meses. DNPM adequado para a idade. Vacinação em dia (PNI).'
  },
  {
    id: 'antecedentes_go',
    title: 'GO',
    category: 'Especialidades (Pediatria & GO)',
    defaultText: 'Menarca aos 12 anos. Ciclos regulares (28/28 dias, fluxo normal). DUM: [data]. G0 P0 A0. Preventivo e mamografia em dia.'
  },

  // Categoria 4: Revisão de Sistemas (ISDA)
  {
    id: 'isda_geral',
    title: 'ISDA - Geral',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega febre, astenia, perda ponderal não intencional, sudorese noturna ou calafrios.'
  },
  {
    id: 'isda_cardio',
    title: 'ISDA - Cardio',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega precordialgia, opressão torácica, palpitações, dispneia aos esforços, ortopneia ou edema de MMs.'
  },
  {
    id: 'isda_resp',
    title: 'ISDA - Resp',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega tosse seca ou produtiva, sibilância, dispneia, dor torácica ventilatório-dependente ou hemoptise.'
  },
  {
    id: 'isda_gastro',
    title: 'ISDA - GI',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega náuseas, vômitos, pirose, disfagia, odinofagia, dor abdominal, diarreia ou obstipação.'
  },
  {
    id: 'isda_genito',
    title: 'ISDA - GU',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega disúria, polaciúria, hematúria, nictúria, urgência miccional ou corrimentos urogenitais.'
  },
  {
    id: 'isda_neuro',
    title: 'ISDA - Neuro',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega cefaleia, tonturas, síncope, vertigem, déficits motores ou sensitivos, alteração de humor ou insônia.'
  },
  {
    id: 'isda_osteo',
    title: 'ISDA - Loco',
    category: 'Revisão de Sistemas (ISDA)',
    defaultText: 'Nega artralgias, mialgias, rigidez matinal, limitação de ADM articular ou deformidades.'
  },

  // Categoria 5: Exame Físico por Aparelhos
  {
    id: 'exame_fisico_geral',
    title: 'EF - Geral & SV',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'BEG, LOTE, acianótico, anictérico, corado, hidratado, eupnéico em AA. SV: PA: 120/80 mmHg | FC: 75 bpm | FR: 16 irpm | SpO2: 98% em AA | T: 36,5 °C | HGT: 92 mg/dL.'
  },
  {
    id: 'exame_cabeca_pescoco',
    title: 'EF - Cabeça/Pescoço',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'Crânio normocefálico, sem lesões. Pupilas isocóricas e fotorreativas (PIRFL). Otoscopia: MTs íntegras. Orofaringe sem hiperemia. Pescoço sem adenomegalias ou turgência jugular.'
  },
  {
    id: 'exame_cardio',
    title: 'EF - Cardio',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'AC: RCR 2T, BRNF, sem sopros. Pulsos periféricos radiais, pediosos e femorais presentes, amplos e simétricos. TEC < 2s.'
  },
  {
    id: 'exame_resp',
    title: 'EF - Resp',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'AP: MVUA sem ruídos adventícios (sem estertores, sibilos ou roncos). Expansibilidade torácica preservada bilateralmente.'
  },
  {
    id: 'exame_abdomen',
    title: 'EF - Abdômen',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'ABD: Plano, simétrico, flácido, indolor à palpação superficial e profunda. RHA normoativos. Ausência de visceromegalias ou massas. Blumberg, Murphy e Giordano negativos.'
  },
  {
    id: 'exame_locomotor',
    title: 'EF - Extremidades',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'EXT: Bem perfundidas, aquecidas, sem edema ou empastamento de panturrilhas (Homans negativo). ADM preservada. Força 5/5.'
  },
  {
    id: 'exame_neuro_psiq',
    title: 'EF - Neuro',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'Glasgow 15/15. Pares cranianos sem alterações. Motricidade e sensibilidade preservadas nos 4 membros. Sem sinais meningorradiculares (Lasegue, Brudzinski e Kernig negativos). Eutímico.'
  },
  {
    id: 'exame_dermato',
    title: 'EF - Pele',
    category: 'Exame Físico por Aparelhos',
    defaultText: 'Pele e anexos íntegros, normocorados, turgor e elasticidade preservados. Ausência de exantema, petéquias ou estigmas de sangramento.'
  },

  // Categoria 6: Diagnóstico & Conduta
  {
    id: 'hipoteses_diagnosticas',
    title: 'HD',
    category: 'Diagnóstico & Conduta',
    defaultText: '1. Avaliação clínica e preventiva de rotina.\n2. Hipótese secundária a esclarecer.'
  },
  {
    id: 'conduta_plano',
    title: 'CD',
    category: 'Diagnóstico & Conduta',
    defaultText: '1. Orientações gerais de estilo de vida, nutrição e prevenção de agravos.\n2. Solicitação de exames complementares de rotina se necessário.\n3. Prescrição entregue ao paciente.\n4. Retorno s/n / Orientados sinais de alarme.'
  }
];

export const ANAMNESE_PRESETS = [
  {
    id: 'adulto',
    name: 'Clínica Geral / Adulto',
    icon: '🩺',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'antecedentes_pessoais',
      'medicamentos',
      'alergias',
      'exame_fisico_geral',
      'exame_cardio',
      'exame_resp',
      'exame_abdomen',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'pediatria',
    name: 'Pediatria & Puericultura',
    icon: '👶',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'antecedentes_pediatricos',
      'alergias',
      'exame_fisico_geral',
      'exame_cabeca_pescoco',
      'exame_cardio',
      'exame_resp',
      'exame_abdomen',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'ginecologia',
    name: 'Ginecologia & Obstetrícia',
    icon: '🤰',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'antecedentes_go',
      'antecedentes_pessoais',
      'alergias',
      'exame_fisico_geral',
      'exame_abdomen',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'cardiologia',
    name: 'Cardiologia',
    icon: '🫀',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'isda_cardio',
      'antecedentes_pessoais',
      'medicamentos',
      'alergias',
      'habitos',
      'exame_fisico_geral',
      'exame_cardio',
      'exame_resp',
      'exame_locomotor',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'neurologia',
    name: 'Neurologia & Psiquiatria',
    icon: '🧠',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'isda_neuro',
      'antecedentes_pessoais',
      'medicamentos',
      'exame_fisico_geral',
      'exame_neuro_psiq',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'ortopedia',
    name: 'Ortopedia / Traumatologia',
    icon: '🦴',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'isda_osteo',
      'exame_fisico_geral',
      'exame_locomotor',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'cirurgia',
    name: 'Cirurgia Geral / Pré-Op',
    icon: '🔪',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'antecedentes_pessoais',
      'medicamentos',
      'alergias',
      'exame_fisico_geral',
      'exame_cardio',
      'exame_resp',
      'exame_abdomen',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  },
  {
    id: 'oftalmo_oto',
    name: 'Oftalmo / Otorrino',
    icon: '👁️',
    sectionIds: [
      'identificacao',
      'qp',
      'hda',
      'exame_fisico_geral',
      'exame_cabeca_pescoco',
      'hipoteses_diagnosticas',
      'conduta_plano'
    ]
  }
];

// Helper to sort active sections strictly according to Porto Semiology Book order
export const sortSectionsByPortoSequence = <T extends { id: string }>(sections: T[]): T[] => {
  const catalogOrderMap = new Map(ANAMNESE_SECTIONS_CATALOG.map((item, idx) => [item.id, idx]));
  return [...sections].sort((a, b) => {
    const orderA = catalogOrderMap.get(a.id) ?? 999;
    const orderB = catalogOrderMap.get(b.id) ?? 999;
    return orderA - orderB;
  });
};

// Define structures for saved forms
export interface SavedForm {
  id: string;
  userId?: string;
  type: 'modular' | 'pediatric' | 'adult' | 'prescription' | 'triage' | 'disease';
  patientName: string;
  patientAge: string;
  patientWeight: string;
  date: string;
  data: Record<string, any>;
  formattedText: string;
}

export interface CustomPreset {
  id: string;
  userId?: string;
  name: string;
  icon: string;
  sectionIds: string[];
}

interface FormsModuleProps {
  onRedirectToSymptoms: () => void;
  medications: any[];
  currentUser?: UserType | null;
}

export default function FormsModule({ onRedirectToSymptoms, medications, currentUser }: FormsModuleProps) {
  const [activeFormType, setActiveFormType] = useState<'modular' | 'prescription' | 'disease' | 'adult' | 'pediatric' | 'triage'>('modular');
  const [savedForms, setSavedForms] = useState<SavedForm[]>([]);
  const [searchQuery, setSearchQuery] = useState('');
  const [copiedId, setCopiedId] = useState<string | null>(null);
  const [viewingForm, setViewingForm] = useState<SavedForm | null>(null);
  
  // Custom Presets State (per user)
  const [customPresets, setCustomPresets] = useState<CustomPreset[]>(() => {
    try {
      const uId = currentUser?.id || 'global';
      const stored = localStorage.getItem(`medical_app_custom_presets_${uId}`);
      if (stored) return JSON.parse(stored);
    } catch (e) {}
    return [];
  });

  // Preset Edit / Create Modal state
  const [showPresetModal, setShowPresetModal] = useState(false);
  const [editingPresetId, setEditingPresetId] = useState<string | null>(null);
  const [presetNameInput, setPresetNameInput] = useState('');
  const [presetIconInput, setPresetIconInput] = useState('🩺');
  const [presetSelectedSectionIds, setPresetSelectedSectionIds] = useState<string[]>([]);

  // Active Form Fields
  const [patientName, setPatientName] = useState('');
  const [patientAge, setPatientAge] = useState('');
  const [patientWeight, setPatientWeight] = useState('');
  const [patientSex, setPatientSex] = useState('Masculino');

  // Modular Anamnese State
  const [activeSections, setActiveSections] = useState<Array<{ id: string; title: string; category: string; text: string }>>(() => {
    const defaultIds = ANAMNESE_PRESETS[0].sectionIds;
    const initial = ANAMNESE_SECTIONS_CATALOG.filter(item => defaultIds.includes(item.id)).map(item => ({
      id: item.id,
      title: item.title,
      category: item.category,
      text: item.defaultText
    }));
    return sortSectionsByPortoSequence(initial);
  });

  const [sectionCategoryFilter, setSectionCategoryFilter] = useState<string>('Todas');
  const [sectionSearchQuery, setSectionSearchQuery] = useState<string>('');

  // Porto Semiology Insertion: When adding a section that was not selected,
  // it is inserted into the correct position according to Porto's semiology sequence!
  const toggleSection = (id: string) => {
    const exists = activeSections.some(s => s.id === id);
    if (exists) {
      setActiveSections(prev => prev.filter(s => s.id !== id));
    } else {
      const item = ANAMNESE_SECTIONS_CATALOG.find(c => c.id === id);
      if (item) {
        const newSection = { id: item.id, title: item.title, category: item.category, text: item.defaultText };
        const updated = [...activeSections, newSection];
        setActiveSections(sortSectionsByPortoSequence(updated));
      }
    }
  };

  const moveSection = (index: number, direction: 'up' | 'down') => {
    if (direction === 'up' && index === 0) return;
    if (direction === 'down' && index === activeSections.length - 1) return;
    const targetIndex = direction === 'up' ? index - 1 : index + 1;
    const updated = [...activeSections];
    const temp = updated[index];
    updated[index] = updated[targetIndex];
    updated[targetIndex] = temp;
    setActiveSections(updated);
  };

  const updateSectionText = (id: string, text: string) => {
    setActiveSections(prev => prev.map(s => s.id === id ? { ...s, text } : s));
  };

  const resetSectionText = (id: string) => {
    const item = ANAMNESE_SECTIONS_CATALOG.find(c => c.id === id);
    if (item) {
      setActiveSections(prev => prev.map(s => s.id === id ? { ...s, text: item.defaultText } : s));
    }
  };

  const allPresets = [...ANAMNESE_PRESETS, ...customPresets];

  const loadPreset = (presetId: string) => {
    if (presetId === 'all') {
      setActiveSections(sortSectionsByPortoSequence(ANAMNESE_SECTIONS_CATALOG.map(item => ({
        id: item.id,
        title: item.title,
        category: item.category,
        text: item.defaultText
      }))));
      triggerNotification('Todas as 27 seções da anamnese selecionadas na ordem Porto!');
      return;
    }
    if (presetId === 'clear') {
      setActiveSections([]);
      triggerNotification('Seleção de seções limpa.');
      return;
    }
    const preset = allPresets.find(p => p.id === presetId);
    if (preset) {
      const sections = ANAMNESE_SECTIONS_CATALOG
        .filter(item => preset.sectionIds.includes(item.id))
        .map(item => ({
          id: item.id,
          title: item.title,
          category: item.category,
          text: item.defaultText
        }));
      setActiveSections(sortSectionsByPortoSequence(sections));
      triggerNotification(`Modelo de "${preset.name}" carregado com sucesso!`);
    }
  };

  const openCreatePresetModal = () => {
    setEditingPresetId(null);
    setPresetNameInput('Meu Modelo Personalizado');
    setPresetIconInput('🩺');
    setPresetSelectedSectionIds(activeSections.map(s => s.id));
    setShowPresetModal(true);
  };

  const openEditPresetModal = (preset: { id: string; name: string; icon: string; sectionIds: string[] }) => {
    setEditingPresetId(preset.id);
    setPresetNameInput(preset.name);
    setPresetIconInput(preset.icon);
    setPresetSelectedSectionIds(preset.sectionIds);
    setShowPresetModal(true);
  };

  const savePresetModel = () => {
    if (!presetNameInput.trim()) return;
    const uId = currentUser?.id || 'global';

    if (editingPresetId) {
      // Check if it's a custom preset or built-in override
      const existsInCustom = customPresets.some(p => p.id === editingPresetId);
      if (existsInCustom) {
        const updated = customPresets.map(p => p.id === editingPresetId ? {
          ...p,
          name: presetNameInput.trim(),
          icon: presetIconInput || '🩺',
          sectionIds: presetSelectedSectionIds
        } : p);
        setCustomPresets(updated);
        localStorage.setItem(`medical_app_custom_presets_${uId}`, JSON.stringify(updated));
      } else {
        // Create custom preset with same ID override
        const newP: CustomPreset = {
          id: editingPresetId,
          userId: uId,
          name: presetNameInput.trim(),
          icon: presetIconInput || '🩺',
          sectionIds: presetSelectedSectionIds
        };
        const updated = [...customPresets.filter(p => p.id !== editingPresetId), newP];
        setCustomPresets(updated);
        localStorage.setItem(`medical_app_custom_presets_${uId}`, JSON.stringify(updated));
      }
    } else {
      // Create brand new custom preset
      const newP: CustomPreset = {
        id: `preset_custom_${Date.now()}`,
        userId: uId,
        name: presetNameInput.trim(),
        icon: presetIconInput || '🩺',
        sectionIds: presetSelectedSectionIds
      };
      const updated = [...customPresets, newP];
      setCustomPresets(updated);
      localStorage.setItem(`medical_app_custom_presets_${uId}`, JSON.stringify(updated));
    }

    setShowPresetModal(false);
    triggerNotification('Modelo de Anamnese salvo com sucesso!');
  };

  const deleteCustomPreset = (presetId: string) => {
    if (confirm('Deseja excluir este modelo personalizado de anamnese?')) {
      const uId = currentUser?.id || 'global';
      const updated = customPresets.filter(p => p.id !== presetId);
      setCustomPresets(updated);
      localStorage.setItem(`medical_app_custom_presets_${uId}`, JSON.stringify(updated));
      setShowPresetModal(false);
      triggerNotification('Modelo personalizado excluído.');
    }
  };
  
  // General Clinical Antecedents
  const [allergies, setAllergies] = useState('');
  const [currentMedications, setCurrentMedications] = useState('');
  const [pastSurgeries, setPastSurgeries] = useState('');

  // Medication search autocomplete states
  const [medSearchInput, setMedSearchInput] = useState('');
  const [selectedDrugId, setSelectedDrugId] = useState('');
  const [showMedDropdown, setShowMedDropdown] = useState(false);

  // Disease search autocomplete states
  const [diseaseSearchInput, setDiseaseSearchInput] = useState('');
  const [selectedDiseaseId, setSelectedDiseaseId] = useState('');
  const [showDiseaseDropdown, setShowDiseaseDropdown] = useState(false);
  
  // Specific Form Fields
  const [pedData, setPedData] = useState({
    motherName: '',
    qp: '',
    hda: '',
    gestationalAge: 'A Termo (37-42s)',
    deliveryType: 'Parto Vaginal',
    feeding: 'Aleitamento Materno Exclusivo',
    milestones: {
      headControl: true,
      sits: false,
      walks: false,
      speaks: false
    },
    vaccination: 'Em dia',
    vaccineNotes: '',
    fc: '110',
    fr: '26',
    temp: '36.8',
    sat: '98',
    tec: '< 2 seg',
    generalState: 'BEG, ativo, reativo, corado, hidratado, acianótico, eupneico.',
    cardiorespiratory: 'MV presente simétrico, sem RA. RCR 2T, BRNF, sem sopros.',
    abdomen: 'Plano, flácido, indolor, RHA presentes, sem visceromegalias.',
    oropharynx: 'Orofaringe calma, sem exsudatos. Otoscopia timpânica íntegra.',
    diagnosticHypothesis: '',
    conduct: ''
  });

  const [adultData, setAdultData] = useState({
    qp: '',
    hda: '',
    pastHistory: '',
    habits: {
      smoker: false,
      alcohol: false,
      sedentary: true
    },
    pa: '120/80',
    fc: '80',
    fr: '16',
    temp: '36.5',
    sat: '98',
    glicemia: '',
    generalState: 'Bom estado geral (BEG), consciente, lúcido e orientado no tempo e espaço (LOTE), cooperativo com o exame. Corado, hidratado, acianótico, anictérico, eupneico em ar ambiente. Sinais de perfusão periférica preservados (TEC < 2s). Ausência de edemas.',
    cardiorespiratory: 'Ausculta cardíaca: ritmo cardíaco regular em 2 tempos (RCR 2T), bulhas normofonéticas (BRNF), sem sopros patológicos. Ausculta pulmonar: murmúrio vesicular universalmente audível e simétrico (MVUA e simétrico), sem ruídos adventícios.',
    abdomen: 'Abdômen plano, simétrico, flácido, indolor à palpação superficial e profunda, sem massas palpáveis ou visceromegalias (fígado e baço não palpáveis). Ruídos hidroaéreos (RHA) normoativos.',
    oropharynx: 'Orofaringe calma e sem hiperemia, amígdalas normotróficas. Extremidades aquecidas, perfundidas, sem edemas ou empastamento de panturrilhas. Pulsos periféricos simétricos e cheios. Ausência de sinais meningorradiculares.',
    diagnosis: '',
    conduct: ''
  });

  const [triageData, setTriageData] = useState({
    complaint: '',
    pa: '120/80',
    fc: '80',
    fr: '16',
    temp: '36.5',
    sat: '98',
    painScale: '0',
    riskLevel: 'green',
    recommendedArea: 'Consultório Padrão (Ambulatório)',
    triageNotes: ''
  });

  const [prescriptionItems, setPrescriptionItems] = useState<Array<{
    name: string;
    presentation: string;
    dose: string;
    frequency: string;
    duration: string;
    instructions: string;
  }>>([]);

  const [newPrescDrug, setNewPrescDrug] = useState({
    selectedDrugId: '',
    customName: '',
    presentation: '',
    dose: '',
    frequency: 'De 8h em 8h',
    duration: '5 dias',
    instructions: ''
  });

  const [showNotification, setShowNotification] = useState(false);
  const [notificationText, setNotificationText] = useState('');

  // Load forms on mount
  useEffect(() => {
    const saved = localStorage.getItem('pedsocorro_saved_forms');
    if (saved) {
      try {
        setSavedForms(JSON.parse(saved));
      } catch (e) {
        console.error('Error parsing saved forms', e);
      }
    }
  }, []);

  const triggerNotification = (text: string) => {
    setNotificationText(text);
    setShowNotification(true);
    setTimeout(() => setShowNotification(false), 3000);
  };

  // Helper to copy text to clipboard
  const copyToClipboard = (text: string, id: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    triggerNotification('Anamnese copiada com sucesso para a área de transferência!');
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Drug changes -> Prepopulate fields
  useEffect(() => {
    if (newPrescDrug.selectedDrugId) {
      const drug = medications.find(m => m.id === newPrescDrug.selectedDrugId);
      if (drug) {
        let calculatedDose = drug.dose;
        let pInstructions = drug.notes || '';
        
        // Dynamic pediatric dose if weight is set
        if (patientWeight && parseFloat(patientWeight) > 0) {
          const wt = parseFloat(patientWeight);
          
          // Popular calculators
          if (drug.name.toLowerCase().includes('amoxicilina') && !drug.name.toLowerCase().includes('clavulanato')) {
            // 50 mg/kg/day divided in 3 doses (Amoxicilina 250mg/5mL)
            const dailyMg = wt * 50;
            const singleMg = Math.round(dailyMg / 3);
            const singleMl = parseFloat(((singleMg * 5) / 250).toFixed(1));
            calculatedDose = `${singleMl} mL (${singleMg} mg)`;
            pInstructions = `Amoxicilina Suspensão Oral (250mg/5mL). Administrar ${singleMl} mL via oral de 8h em 8h por 7 a 10 dias. ` + drug.notes;
          } else if (drug.name.toLowerCase().includes('ibuprofeno')) {
            // 1 drop per kg, maximum 40 drops
            const drops = Math.min(Math.round(wt), 40);
            calculatedDose = `${drops} gotas`;
            pInstructions = `Ibuprofeno Gotas (50mg/mL). Administrar ${drops} gotas via oral de 6h em 6h ou 8h em 8h se febre ou dor. Não ultrapassar 40 gotas por dose.`;
          } else if (drug.name.toLowerCase().includes('paracetamol')) {
            // 1 drop per kg, maximum 35-40 drops
            const drops = Math.min(Math.round(wt), 35);
            calculatedDose = `${drops} gotas`;
            pInstructions = `Paracetamol Gotas (200mg/mL). Administrar ${drops} gotas via oral de 6h em 6h ou de 4h em 4h se febre ou dor persistentes.`;
          } else if (drug.name.toLowerCase().includes('dipirona') && drug.presentation.toLowerCase().includes('gotas')) {
            // 1 drop per kg, max 40 drops
            const drops = Math.min(Math.round(wt), 40);
            calculatedDose = `${drops} gotas`;
            pInstructions = `Dipirona Sódica Gotas (500mg/mL). Administrar ${drops} gotas via oral de 6h em 6h se dor ou febre alta.`;
          } else if (drug.name.toLowerCase().includes('prednisolona')) {
            // 1mg/kg/day once daily (Prednisolona 3mg/mL)
            const dailyMg = Math.min(wt, 40); // Max 40mg
            const ml = parseFloat(((dailyMg * 1) / 3).toFixed(1));
            calculatedDose = `${ml} mL (${Math.round(dailyMg)} mg)`;
            pInstructions = `Prednisolona Solução Oral (3mg/mL). Administrar ${ml} mL via oral 1 vez ao dia pela manhã, por 3 a 5 dias.`;
          } else if (drug.name.toLowerCase().includes('azitromicina') && drug.presentation.toLowerCase().includes('susp')) {
            // 10mg/kg/day once daily (Azitromicina 200mg/5mL)
            const dailyMg = Math.min(wt * 10, 500); // Max 500mg
            const ml = parseFloat(((dailyMg * 5) / 200).toFixed(1));
            calculatedDose = `${ml} mL (${Math.round(dailyMg)} mg)`;
            pInstructions = `Azitromicina Suspensão Oral (200mg/5mL). Administrar ${ml} mL via oral 1 vez ao dia por 3 a 5 dias consecutivos.`;
          }
        }

        setNewPrescDrug(prev => ({
          ...prev,
          customName: drug.name,
          presentation: drug.presentation,
          dose: calculatedDose,
          frequency: drug.frequency,
          instructions: pInstructions
        }));
      }
    }
  }, [newPrescDrug.selectedDrugId, patientWeight, medications]);

  const addPrescriptionItem = () => {
    if (!newPrescDrug.customName) return;
    setPrescriptionItems(prev => [
      ...prev,
      {
        name: newPrescDrug.customName,
        presentation: newPrescDrug.presentation,
        dose: newPrescDrug.dose,
        frequency: newPrescDrug.frequency,
        duration: newPrescDrug.duration,
        instructions: newPrescDrug.instructions
      }
    ]);
    // Reset drug picker
    setNewPrescDrug({
      selectedDrugId: '',
      customName: '',
      presentation: '',
      dose: '',
      frequency: 'De 8h em 8h',
      duration: '5 dias',
      instructions: ''
    });
    setMedSearchInput('');
    triggerNotification('Medicamento adicionado à prescrição!');
  };

  const removePrescriptionItem = (index: number) => {
    setPrescriptionItems(prev => prev.filter((_, i) => i !== index));
  };

  const generateClinicalText = (type: SavedForm['type']): string => {
    const formattedDate = new Date().toLocaleString('pt-BR', { dateStyle: 'short', timeStyle: 'short' });
    let text = `==================================================\n`;
    text += `                 ANAMNESE CLÍNICA                 \n`;
    text += `==================================================\n`;
    text += `PACIENTE: ${patientName || 'Não Identificado'}\n`;
    text += `IDADE: ${patientAge || 'N/I'} | SEXO: ${patientSex} | PESO: ${patientWeight ? patientWeight + ' kg' : 'N/I'}\n`;
    text += `DATA/HORA: ${formattedDate}\n`;
    text += `--------------------------------------------------\n\n`;

    if (type === 'modular' || type === 'pediatric' || type === 'adult') {
      if (activeSections.length === 0) {
        text += `(Nenhuma seção de anamnese selecionada)\n`;
      } else {
        activeSections.forEach((sec) => {
          text += `${sec.title.trim().toUpperCase()}:\n`;
          text += `${sec.text.trim()}\n\n`;
        });
      }
    } 
    else if (type === 'disease') {
      const d = UBS_CATALOG_DISEASES.find(disease => disease.id === selectedDiseaseId);
      if (d) {
        text += `DIRETRIZ CLÍNICA: ${d.name.toUpperCase()}\n`;
        text += `CATEGORIA: ${d.category}\n`;
        text += `--------------------------------------------------\n`;
        text += `CRITÉRIOS DIAGNÓSTICOS:\n${d.diagnostic}\n\n`;
        text += `SINAIS DE ALERTA:\n${d.alarm}\n\n`;
        text += `TRATAMENTO 1ª LINHA:\n${d.treatment[0]?.title || 'Padrão'}: ${d.treatment[0]?.desc || 'Apoio clínico'}\n\n`;
        if (d.treatment[1]) {
          text += `TRATAMENTO 2ª LINHA:\n${d.treatment[1]?.title || 'Alternativo'}: ${d.treatment[1]?.desc || 'Opção secundária'}\n\n`;
        }
      } else {
        text += `Nenhuma suspeita diagnóstica selecionada.`;
      }
    } 
    else if (type === 'prescription') {
      text += `RECEITUÁRIO CLÍNICO\n`;
      text += `--------------------------------------------------\n`;
      if (prescriptionItems.length === 0) {
        text += `(Nenhum medicamento na prescrição)\n`;
      } else {
        prescriptionItems.forEach((item, idx) => {
          text += `${idx + 1}. ${item.name.toUpperCase()} (${item.presentation})\n`;
          text += `   POSOLOGIA: ${item.dose} -- ${item.frequency}\n`;
          text += `   DURAÇÃO: ${item.duration}\n`;
          if (item.instructions) {
            text += `   ORIENTAÇÕES: ${item.instructions}\n`;
          }
          text += `\n`;
        });
      }
      text += `ORIENTAÇÕES GERAIS:\n- Repouso adequado, dieta leve e hidratação oral abundante.\n- Retornar ao P.A. imediatamente em caso de sinais de alarme.\n`;
    } 
    else if (type === 'triage') {
      text += `TRIAGEM & CLASSIFICAÇÃO DE RISCO (MANCHESTER)\n`;
      text += `--------------------------------------------------\n`;
      text += `QUEIXA PRINCIPAL: ${triageData.complaint || 'N/I'}\n`;
      text += `SINAIS VITAIS: PA: ${triageData.pa || 'N/I'} mmHg | FC: ${triageData.fc || 'N/I'} bpm | FR: ${triageData.fr || 'N/I'} irpm | SpO2: ${triageData.sat || 'N/I'}% | T: ${triageData.temp || 'N/I'}°C | Dor: ${triageData.painScale}/10\n`;
      text += `NÍVEL DE RISCO: ${triageData.riskLevel.toUpperCase()} -- ${triageData.recommendedArea}\n`;
      if (triageData.triageNotes) {
        text += `NOTAS DA TRIAGEM: ${triageData.triageNotes}\n`;
      }
    }

    text += `--------------------------------------------------\n`;
    text += `🔒 Sigilo Médico em conformidade com a LGPD (Lei nº 13.709/2018) & CFM\n`;
    text += `==================================================`;
    return text;
  };

  const saveForm = (e: FormEvent) => {
    e.preventDefault();
    if (!patientName.trim()) {
      triggerNotification('Atenção: Por favor, insira o nome do paciente antes de salvar!');
      return;
    }

    const newForm: SavedForm = {
      id: Date.now().toString(),
      userId: currentUser?.id || 'guest',
      type: activeFormType,
      patientName,
      patientAge,
      patientWeight,
      date: new Date().toLocaleDateString('pt-BR') + ' ' + new Date().toLocaleTimeString('pt-BR', { hour: '2-digit', minute: '2-digit' }),
      data: activeFormType === 'modular' ? { sections: activeSections }
          : activeFormType === 'prescription' ? { items: prescriptionItems }
          : activeFormType === 'disease' ? { selectedDiseaseId, diseaseSearchInput }
          : triageData,
      formattedText: generateClinicalText(activeFormType)
    };

    const updated = [newForm, ...savedForms];
    setSavedForms(updated);
    localStorage.setItem('pedsocorro_saved_forms', JSON.stringify(updated));
    triggerNotification('Anamnese salva no histórico local com sucesso!');
    
    // Reset inputs
    setPatientName('');
    setPatientAge('');
    setPatientWeight('');
    setPatientSex('Masculino');
    setAllergies('');
    setCurrentMedications('');
    setPastSurgeries('');
    setMedSearchInput('');
    if (activeFormType === 'prescription') {
      setPrescriptionItems([]);
    }
  };

  const deleteForm = (id: string, e?: MouseEvent) => {
    if (e) e.stopPropagation();
    const updated = savedForms.filter(f => f.id !== id);
    setSavedForms(updated);
    localStorage.setItem('pedsocorro_saved_forms', JSON.stringify(updated));
    if (viewingForm?.id === id) {
      setViewingForm(null);
    }
    triggerNotification('Registro clínico excluído do histórico!');
  };

  // Filter saved forms isolated by user
  const userForms = savedForms.filter(f => !f.userId || f.userId === (currentUser?.id || 'guest'));
  const filteredForms = userForms.filter(f => 
    f.patientName.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.type.toLowerCase().includes(searchQuery.toLowerCase()) ||
    f.date.includes(searchQuery)
  );

  return (
    <div id="forms-module" className="grid grid-cols-1 xl:grid-cols-12 gap-8 relative">
      
      {/* Dynamic Toast Notification */}
      <AnimatePresence>
        {showNotification && (
          <motion.div 
            initial={{ opacity: 0, y: 50, scale: 0.95 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            exit={{ opacity: 0, y: 20, scale: 0.95 }}
            className="fixed bottom-6 right-6 z-[100] bg-slate-900 text-white px-5 py-4 rounded-2xl shadow-2xl flex items-center gap-3 border border-slate-700/50 max-w-sm"
          >
            <div className="w-8 h-8 rounded-full bg-emerald-500/20 text-emerald-400 flex items-center justify-center flex-shrink-0">
              <Check size={16} strokeWidth={2.5} />
            </div>
            <p className="text-xs font-bold leading-normal">{notificationText}</p>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Main Form Area */}
      <div className="xl:col-span-8 space-y-6">
        
        {/* Shortcut banner to Symptom Analysis */}
        <div className="bg-gradient-to-r from-medical-primary/5 via-medical-primary/10 to-rose-500/5 border border-medical-primary/10 rounded-2xl p-6 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
          <div className="flex gap-4">
            <div className="w-12 h-12 rounded-2xl bg-medical-primary/15 text-medical-primary flex items-center justify-center flex-shrink-0">
              <Brain size={24} />
            </div>
            <div>
              <h4 className="font-serif font-black text-lg text-slate-800 dark:text-white tracking-tight">Precisa de suporte diagnóstico?</h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Inicie uma triagem de sintomas de alta precisão baseada em algoritmos cruzados.</p>
            </div>
          </div>
          <button 
            onClick={onRedirectToSymptoms}
            className="w-full md:w-auto px-5 py-3 rounded-xl bg-medical-primary text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-medical-primary/20 hover:bg-medical-primary/90 transition-all group cursor-pointer"
          >
            <span>Analisar Sintomas</span>
            <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
          </button>
        </div>

        {/* Form Selector Tabs */}
        <div className="bg-white dark:bg-slate-800 border border-slate-100 dark:border-slate-700 p-2 rounded-2xl grid grid-cols-1 sm:grid-cols-3 gap-2 w-full">
          <button 
            type="button"
            onClick={() => setActiveFormType('modular')}
            className={`py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${activeFormType === 'modular' ? 'bg-medical-primary text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/55'}`}
          >
            <Sliders size={16} />
            Anamnese Modular Aberta (Todas Especialidades)
          </button>
          <button 
            type="button"
            onClick={() => setActiveFormType('prescription')}
            className={`py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${activeFormType === 'prescription' ? 'bg-medical-primary text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/55'}`}
          >
            <Pill size={16} />
            Consulta Medicamentos
          </button>
          <button 
            type="button"
            onClick={() => setActiveFormType('disease')}
            className={`py-3.5 rounded-xl font-bold text-xs flex items-center justify-center gap-2.5 transition-all cursor-pointer ${activeFormType === 'disease' ? 'bg-medical-primary text-white shadow-md' : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700/55'}`}
          >
            <Search size={16} />
            Consulta Doenças
          </button>
        </div>

        {/* Dynamic Form Content */}
        <form onSubmit={saveForm} className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm">
          
          <div className="border-b border-slate-100 dark:border-slate-700 pb-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
            <div>
              <h3 className="font-serif font-black text-2xl text-slate-800 dark:text-white italic tracking-tight">
                {activeFormType === 'modular' && 'Anamnese Modular & Personalizável'}
                {activeFormType === 'prescription' && 'Guia de Consulta de Medicamentos & Doses'}
                {activeFormType === 'disease' && 'Guia de Consulta de Diretrizes de Doenças'}
              </h3>
              <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-1">
                {activeFormType === 'modular' && 'Selecione, reordene e edite as seções semiológicas para todas as especialidades'}
                {activeFormType === 'prescription' && 'Acesse doses recomendadas e crie receituários'}
                {activeFormType === 'disease' && 'Critérios diagnósticos e diretrizes terapêuticas da UBS/SUS'}
              </p>
            </div>
          </div>



          {/* Common Patient Header Fields */}
          <div className="bg-slate-50 dark:bg-slate-900/60 p-5 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
            <h4 className="text-xs font-bold text-slate-400 uppercase tracking-wider flex items-center gap-2">
              <User size={14} />
              Identificação do Paciente
            </h4>
            <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
              <div className="space-y-1.5 sm:col-span-2">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Nome Completo do Paciente</label>
                <input 
                  type="text" 
                  value={patientName}
                  onChange={(e) => setPatientName(e.target.value)}
                  placeholder="Ex: Gabriel Silva Santos"
                  className="w-full h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                />
              </div>

              <div className="space-y-1.5">
                <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Idade</label>
                <input 
                  type="text" 
                  value={patientAge}
                  onChange={(e) => setPatientAge(e.target.value)}
                  placeholder="Ex: 4 anos ou 32 anos"
                  className="w-full h-11 px-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-sm font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                />
              </div>

              <div className="grid grid-cols-2 gap-2">
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Sexo</label>
                  <select 
                    value={patientSex}
                    onChange={(e) => setPatientSex(e.target.value)}
                    className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                  >
                    <option value="Masculino">Masc.</option>
                    <option value="Feminino">Fem.</option>
                  </select>
                </div>
                <div className="space-y-1.5">
                  <label className="text-[11px] font-bold text-slate-500 dark:text-slate-400 uppercase tracking-tighter">Peso (kg)</label>
                  <input 
                    type="text" 
                    value={patientWeight}
                    onChange={(e) => setPatientWeight(e.target.value)}
                    placeholder="70"
                    className="w-full h-11 px-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>
          </div>

          {/* Modular Anamnese Interactive Builder */}
          {activeFormType === 'modular' && (() => {
            const filteredCatalogItems = ANAMNESE_SECTIONS_CATALOG.filter(item => {
              const matchesCategory = sectionCategoryFilter === 'Todas' || item.category === sectionCategoryFilter;
              const matchesSearch = item.title.toLowerCase().includes(sectionSearchQuery.toLowerCase()) || 
                                    item.category.toLowerCase().includes(sectionSearchQuery.toLowerCase()) ||
                                    item.defaultText.toLowerCase().includes(sectionSearchQuery.toLowerCase());
              return matchesCategory && matchesSearch;
            });

            return (
              <div className="space-y-8">

                {/* Presets Bar */}
                <div className="space-y-3">
                  <div className="flex flex-wrap items-center justify-between gap-2">
                    <span className="text-xs font-extrabold uppercase tracking-wider text-slate-500 dark:text-slate-400 flex items-center gap-1.5">
                      <Sparkles size={14} className="text-amber-500" />
                      Modelos Rápidos por Especialidade (1-Clique)
                    </span>
                    <div className="flex gap-2">
                      <button
                        type="button"
                        onClick={openCreatePresetModal}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold bg-medical-primary text-white hover:bg-medical-primary/90 transition-colors cursor-pointer flex items-center gap-1"
                      >
                        <Plus size={12} />
                        Criar Modelo
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPreset('all')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-medical-primary hover:bg-medical-primary/10 transition-colors cursor-pointer"
                      >
                        + Selecionar Todas ({ANAMNESE_SECTIONS_CATALOG.length})
                      </button>
                      <button
                        type="button"
                        onClick={() => loadPreset('clear')}
                        className="px-2.5 py-1 rounded-lg text-[11px] font-bold text-rose-500 hover:bg-rose-500/10 transition-colors cursor-pointer"
                      >
                        Limpar
                      </button>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 sm:grid-cols-4 lg:grid-cols-4 gap-2.5">
                    {allPresets.map((preset) => (
                      <div
                        key={preset.id}
                        className="p-3 bg-slate-50 dark:bg-slate-900 hover:bg-medical-primary/5 dark:hover:bg-slate-800 border border-slate-200/80 dark:border-slate-700/80 hover:border-medical-primary/40 rounded-xl transition-all text-left flex items-center justify-between gap-2 group relative cursor-pointer"
                        onClick={() => loadPreset(preset.id)}
                      >
                        <div className="flex items-center gap-2.5 overflow-hidden">
                          <span className="text-xl group-hover:scale-110 transition-transform shrink-0">{preset.icon}</span>
                          <div className="overflow-hidden">
                            <p className="text-xs font-bold text-slate-700 dark:text-slate-200 truncate group-hover:text-medical-primary transition-colors">{preset.name}</p>
                            <p className="text-[10px] text-slate-400 font-medium">{preset.sectionIds.length} seções</p>
                          </div>
                        </div>

                        <button
                          type="button"
                          onClick={(e) => { e.stopPropagation(); openEditPresetModal(preset); }}
                          className="p-1 text-slate-400 hover:text-medical-primary hover:bg-white dark:hover:bg-slate-800 rounded-lg transition-colors shrink-0"
                          title="Editar este modelo"
                        >
                          <Edit2 size={13} />
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                {/* Section Catalog Checkboxes with Filter Tabs */}
                <div className="space-y-4 bg-slate-50/70 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/80 dark:border-slate-800">
                  <div className="flex flex-col md:flex-row md:items-center justify-between gap-3">
                    <div>
                      <h4 className="text-sm font-extrabold text-slate-800 dark:text-slate-100 flex items-center gap-2">
                        <CheckSquare size={16} className="text-medical-primary" />
                        Marque as Seções que Deseja Incluir na Anamnese
                      </h4>
                      <p className="text-[11px] text-slate-500 dark:text-slate-400 font-medium mt-0.5">
                        {activeSections.length} de {ANAMNESE_SECTIONS_CATALOG.length} seções ativas
                      </p>
                    </div>

                    {/* Search inside catalog */}
                    <div className="relative w-full md:w-64">
                      <Search size={14} className="absolute left-3 top-1/2 -translate-y-1/2 text-slate-400" />
                      <input 
                        type="text" 
                        value={sectionSearchQuery}
                        onChange={(e) => setSectionSearchQuery(e.target.value)}
                        placeholder="Buscar seções (ex: Puericultura, ISDA...)"
                        className="w-full h-9 pl-9 pr-3 text-xs bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl font-medium outline-none focus:ring-2 focus:ring-medical-primary/20"
                      />
                    </div>
                  </div>

                  {/* Category Pills */}
                  <div className="flex flex-wrap gap-1.5 pt-1">
                    {['Todas', 'Geral & Identificação', 'História & Antecedentes', 'Especialidades (Pediatria & GO)', 'Revisão de Sistemas (ISDA)', 'Exame Físico por Aparelhos', 'Diagnóstico & Conduta'].map((cat) => (
                      <button
                        key={cat}
                        type="button"
                        onClick={() => setSectionCategoryFilter(cat)}
                        className={`px-3 py-1.5 rounded-lg text-xs font-bold transition-all cursor-pointer ${
                          sectionCategoryFilter === cat 
                            ? 'bg-slate-800 text-white dark:bg-white dark:text-slate-900 shadow-sm' 
                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border border-slate-200 dark:border-slate-700 hover:bg-slate-100 dark:hover:bg-slate-700'
                        }`}
                      >
                        {cat}
                      </button>
                    ))}
                  </div>

                  {/* Checkbox Grid */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-2.5 pt-2 max-h-[380px] overflow-y-auto pr-1">
                    {filteredCatalogItems.map((item) => {
                      const isSelected = activeSections.some(s => s.id === item.id);

                      return (
                        <div
                          key={item.id}
                          onClick={() => toggleSection(item.id)}
                          className={`p-3 rounded-xl border transition-all cursor-pointer flex items-start gap-3 select-none ${
                            isSelected 
                              ? 'bg-medical-primary/10 border-medical-primary dark:bg-medical-primary/20 text-slate-900 dark:text-white shadow-sm' 
                              : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700/80 text-slate-600 dark:text-slate-300 hover:border-slate-300 dark:hover:border-slate-600'
                          }`}
                        >
                          <div className={`mt-0.5 w-5 h-5 rounded-md flex items-center justify-center flex-shrink-0 transition-colors ${
                            isSelected ? 'bg-medical-primary text-white' : 'border border-slate-300 dark:border-slate-600'
                          }`}>
                            {isSelected && <Check size={14} strokeWidth={3} />}
                          </div>
                          <div className="overflow-hidden">
                            <p className={`text-xs font-bold ${isSelected ? 'text-medical-primary dark:text-medical-primary' : ''}`}>
                              {item.title}
                            </p>
                            <span className="text-[10px] text-slate-400 font-semibold block mt-0.5">
                              {item.category}
                            </span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>

                {/* Active Selected Sections (Reorderable & Editable) */}
                <div className="space-y-4">
                  <div className="flex items-center justify-between border-b border-slate-200 dark:border-slate-700 pb-3">
                    <div>
                      <h4 className="text-base font-serif font-bold text-slate-800 dark:text-white flex items-center gap-2">
                        <Layers size={18} className="text-medical-primary" />
                        Seções da Anamnese em Exibição ({activeSections.length})
                      </h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-0.5">
                        Definidas com valores normais padrão. Edite o texto se necessário ou altere a ordem usando as setas ↑ ↓.
                      </p>
                    </div>
                  </div>

                  {activeSections.length === 0 ? (
                    <div className="p-8 text-center bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-dashed border-slate-300 dark:border-slate-700">
                      <Info size={32} className="mx-auto text-slate-400 mb-2" />
                      <p className="text-sm font-bold text-slate-600 dark:text-slate-300">Nenhuma seção selecionada para a anamnese.</p>
                      <p className="text-xs text-slate-400 mt-1">Marque as caixas no painel acima ou escolha um Modelo Rápido por Especialidade.</p>
                    </div>
                  ) : (
                    <div className="space-y-4">
                      {activeSections.map((sec, idx) => (
                        <div 
                          key={sec.id}
                          className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl p-4 sm:p-5 space-y-3 shadow-xs hover:border-medical-primary/30 transition-all"
                        >
                          {/* Section Header Controls */}
                          <div className="flex flex-wrap items-center justify-between gap-2 border-b border-slate-100 dark:border-slate-700/60 pb-2.5">
                            <div className="flex items-center gap-2.5">
                              <span className="w-6 h-6 rounded-lg bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-200 text-xs font-black flex items-center justify-center">
                                #{idx + 1}
                              </span>
                              <h5 className="text-sm font-bold text-slate-800 dark:text-slate-100">
                                {sec.title}
                              </h5>
                              <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-slate-100 dark:bg-slate-700 text-slate-500 dark:text-slate-400">
                                {sec.category}
                              </span>
                            </div>

                            {/* Order & Action Buttons */}
                            <div className="flex items-center gap-1.5">
                              <button
                                type="button"
                                onClick={() => moveSection(idx, 'up')}
                                disabled={idx === 0}
                                title="Subir ordem na anamnese"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              >
                                <ArrowUp size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => moveSection(idx, 'down')}
                                disabled={idx === activeSections.length - 1}
                                title="Descer ordem na anamnese"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 disabled:opacity-30 disabled:cursor-not-allowed hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              >
                                <ArrowDown size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => resetSectionText(sec.id)}
                                title="Restaurar descrição semiológica padrão"
                                className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-700 transition-colors cursor-pointer"
                              >
                                <RotateCcw size={14} />
                              </button>
                              <button
                                type="button"
                                onClick={() => toggleSection(sec.id)}
                                title="Remover seção da anamnese"
                                className="p-1.5 rounded-lg border border-rose-200 dark:border-rose-900/50 text-rose-500 hover:bg-rose-50 dark:hover:bg-rose-950/30 transition-colors cursor-pointer"
                              >
                                <X size={14} />
                              </button>
                            </div>
                          </div>

                          {/* Editable Text Area */}
                          <textarea
                            rows={3}
                            value={sec.text}
                            onChange={(e) => updateSectionText(sec.id, e.target.value)}
                            placeholder="Digite ou edite a descrição semiológica..."
                            className="w-full p-3.5 bg-slate-50 dark:bg-slate-900/80 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-semibold text-slate-800 dark:text-slate-200 leading-relaxed focus:ring-2 focus:ring-medical-primary/20 outline-none resize-y"
                          />
                        </div>
                      ))}
                    </div>
                  )}
                </div>

              </div>
            );
          })()}

          {/* Adult Specific Fields */}
          {activeFormType === 'adult' && (
            <div className="space-y-6">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Queixa Principal (QP)</label>
                  <input 
                    type="text" 
                    value={adultData.qp}
                    onChange={(e) => setAdultData({...adultData, qp: e.target.value})}
                    placeholder="Ex: Dor torácica há 2 horas / Cefaleia intensa"
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Antecedentes Clínicos / Comorbidades</label>
                  <input 
                    type="text" 
                    value={adultData.pastHistory}
                    onChange={(e) => setAdultData({...adultData, pastHistory: e.target.value})}
                    placeholder="Ex: HAS em uso de Losartana, DM2 em uso de Metformina"
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20"
                  />
                </div>
              </div>

              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">História da Doença Atual (HDA)</label>
                <textarea 
                  rows={4}
                  value={adultData.hda}
                  onChange={(e) => setAdultData({...adultData, hda: e.target.value})}
                  placeholder="Descrição pormenorizada da queixa: irradiação, fatores de melhora/piora, sintomas associados, medicações usadas pré-hospitalar."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                />
              </div>

              {/* Sinais Vitais */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} />
                  Sinais Vitais (Parâmetros de Entrada)
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PA (mmHg)</label>
                    <input 
                      type="text" 
                      value={adultData.pa}
                      onChange={(e) => setAdultData({...adultData, pa: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">FC (bpm)</label>
                    <input 
                      type="text" 
                      value={adultData.fc}
                      onChange={(e) => setAdultData({...adultData, fc: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">FR (irpm)</label>
                    <input 
                      type="text" 
                      value={adultData.fr}
                      onChange={(e) => setAdultData({...adultData, fr: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Temp (°C)</label>
                    <input 
                      type="text" 
                      value={adultData.temp}
                      onChange={(e) => setAdultData({...adultData, temp: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SatO2 (%)</label>
                    <input 
                      type="text" 
                      value={adultData.sat}
                      onChange={(e) => setAdultData({...adultData, sat: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Glicemia (mg/dL)</label>
                    <input 
                      type="text" 
                      value={adultData.glicemia}
                      onChange={(e) => setAdultData({...adultData, glicemia: e.target.value})}
                      placeholder="99"
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                </div>
              </div>

              {/* Habits checkbox */}
              <div className="space-y-3">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block">Hábitos de Vida e Riscos</label>
                <div className="flex gap-6">
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={adultData.habits.smoker}
                      onChange={(e) => setAdultData({
                        ...adultData,
                        habits: { ...adultData.habits, smoker: e.target.checked }
                      })}
                      className="w-4.5 h-4.5 text-medical-primary rounded"
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Tabagista Ativo</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={adultData.habits.alcohol}
                      onChange={(e) => setAdultData({
                        ...adultData,
                        habits: { ...adultData.habits, alcohol: e.target.checked }
                      })}
                      className="w-4.5 h-4.5 text-medical-primary rounded"
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Etilista Habitual</span>
                  </label>
                  <label className="flex items-center gap-3 cursor-pointer">
                    <input 
                      type="checkbox" 
                      checked={adultData.habits.sedentary}
                      onChange={(e) => setAdultData({
                        ...adultData,
                        habits: { ...adultData.habits, sedentary: e.target.checked }
                      })}
                      className="w-4.5 h-4.5 text-medical-primary rounded"
                    />
                    <span className="text-xs font-bold text-slate-600 dark:text-slate-300">Estilo de Vida Sedentário</span>
                  </label>
                </div>
              </div>

              {/* Structured Physical Exam for Adults (matching Pediatric model) */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest flex items-center gap-2">
                  <Stethoscope size={14} className="text-medical-primary animate-pulse" />
                  Exame Físico Geral & Segmentar (Estrutura Padrão)
                </h5>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Geral (Aparência, Hidratação, Mucosas, Perfusão)
                    </label>
                    <textarea 
                      rows={2}
                      value={adultData.generalState}
                      onChange={(e) => setAdultData({...adultData, generalState: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Cardiopulmonar (Ausculta Pulmonar & Cardíaca)
                    </label>
                    <textarea 
                      rows={2}
                      value={adultData.cardiorespiratory}
                      onChange={(e) => setAdultData({...adultData, cardiorespiratory: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Abdômen (Inspeção, Ruídos, Palpação, Massas)
                    </label>
                    <textarea 
                      rows={2}
                      value={adultData.abdomen}
                      onChange={(e) => setAdultData({...adultData, abdomen: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-tighter flex items-center gap-1.5">
                      <span className="w-1.5 h-1.5 rounded-full bg-slate-400" />
                      Orofaringe, Extremidades & Sinais Meníngeos
                    </label>
                    <textarea 
                      rows={2}
                      value={adultData.oropharynx}
                      onChange={(e) => setAdultData({...adultData, oropharynx: e.target.value})}
                      className="w-full p-3.5 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Hipótese Diagnóstica</label>
                  <input 
                    type="text" 
                    value={adultData.diagnosis}
                    onChange={(e) => setAdultData({...adultData, diagnosis: e.target.value})}
                    placeholder="Ex: Pneumonia Adquirida na Comunidade (CURB 1)"
                    className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20"
                  />
                </div>
                <div className="space-y-1.5">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Conduta e Prescrição de Alta</label>
                  <textarea 
                    rows={3}
                    value={adultData.conduct}
                    onChange={(e) => setAdultData({...adultData, conduct: e.target.value})}
                    placeholder="Tratamento farmacológico (Classes, posologia, intervalos), sintomas de alerta..."
                    className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                  />
                </div>
              </div>
            </div>
          )}

          {/* Medication Lookup (Consulta Medicamentos) */}
          {activeFormType === 'prescription' && (() => {
            const selectedDrug = medications.find(m => m.id === selectedDrugId);
            const enrichment = selectedDrug ? (MED_ENRICHMENTS[selectedDrug.name] || MED_ENRICHMENTS[selectedDrug.name.split(' ')[0]]) : null;

            return (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-emerald-500/5 to-teal-500/5 border border-emerald-500/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-emerald-500/15 text-emerald-600 dark:text-emerald-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Pill size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-slate-800 dark:text-white tracking-tight">Guia de Consulta Rápida de Medicamentos</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Digite o nome do fármaco para obter dosagens adultas, pediátricas e apresentações comerciais.</p>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-1.5">Pesquisar Princípio Ativo ou Indicação</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ex: Amoxicilina, Dipirona, Sertralina, Ceftriaxona..."
                      value={medSearchInput}
                      onFocus={() => setShowMedDropdown(true)}
                      onChange={(e) => {
                        setMedSearchInput(e.target.value);
                        setShowMedDropdown(true);
                      }}
                      className="w-full h-12 pl-11 pr-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    {medSearchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setMedSearchInput('');
                          setSelectedDrugId('');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showMedDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowMedDropdown(false)} />
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 custom-scrollbar">
                        {medications.filter(m => 
                          m.name.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                          m.category.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                          m.indication.toLowerCase().includes(medSearchInput.toLowerCase())
                        ).length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 font-semibold italic">
                            Nenhum medicamento correspondente encontrado.
                          </div>
                        ) : (
                          medications.filter(m => 
                            m.name.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                            m.category.toLowerCase().includes(medSearchInput.toLowerCase()) ||
                            m.indication.toLowerCase().includes(medSearchInput.toLowerCase())
                          ).map(m => (
                            <button
                              key={m.id}
                              type="button"
                              onClick={() => {
                                setSelectedDrugId(m.id);
                                setMedSearchInput(m.name);
                                setShowMedDropdown(false);
                              }}
                              className="w-full p-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col gap-0.5 border-none outline-none cursor-pointer"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-bold text-xs text-slate-700 dark:text-white">{m.name}</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black bg-emerald-500/10 text-emerald-500 dark:text-emerald-400 uppercase tracking-wider">{m.category}</span>
                              </div>
                              <span className="text-[10px] text-slate-400 dark:text-slate-500 font-semibold truncate">{m.indication}</span>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Popular Categories Quick Filters */}
                <div className="flex flex-wrap gap-1.5">
                  {['Analgésicos', 'Antibióticos', 'Saúde Mental', 'Anti-inflamatórios', 'Cardiovasculares'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => {
                        const match = medications.find(m => m.category.toLowerCase().includes(cat.toLowerCase().split('-')[0].substring(0,4)));
                        if (match) {
                          setSelectedDrugId(match.id);
                          setMedSearchInput(match.name);
                        } else {
                          setMedSearchInput(cat);
                          setShowMedDropdown(true);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                {/* Selected Medication Card */}
                {selectedDrug ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-emerald-100 dark:bg-emerald-950/40 text-emerald-600 dark:text-emerald-400 border border-emerald-200/20 mb-2 inline-block">
                          {selectedDrug.category}
                        </span>
                        <h4 className="font-serif font-black text-xl text-slate-800 dark:text-white tracking-tight">{selectedDrug.name}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">Indicação Principal: {selectedDrug.indication}</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const brandText = enrichment && enrichment.commercial.length > 0 ? ` [Marcas: ${enrichment.commercial.join(', ')}]` : '';
                          const doseAdultStr = enrichment ? enrichment.adult : selectedDrug.dose;
                          const dosePedStr = enrichment ? enrichment.pediatric : 'Consulte o pediatra com base no peso.';
                          const copyText = `${selectedDrug.name}${brandText}\n- Apresentação: ${selectedDrug.presentation}\n- Dose Adulto: ${doseAdultStr}\n- Dose Pediátrica: ${dosePedStr}`;
                          navigator.clipboard.writeText(copyText);
                          triggerNotification('Posologia e marcas copiadas com sucesso!');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 hover:bg-emerald-100 text-emerald-600 dark:text-emerald-400 border border-emerald-100 dark:border-emerald-900/30 text-xs font-bold flex items-center gap-1.5 transition-all self-start md:self-center cursor-pointer"
                      >
                        <Copy size={13} />
                        Copiar Dados de Consulta
                      </button>
                    </div>

                    {/* Content Grid */}
                    <div className="p-6 space-y-6">
                      
                      {/* Brand Names Section */}
                      <div className="space-y-2">
                        <label className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase tracking-wider">Nomes Comerciais de Referência (Brasil)</label>
                        <div className="flex flex-wrap gap-1.5">
                          {enrichment && enrichment.commercial.length > 0 ? (
                            enrichment.commercial.map(brand => (
                              <span key={brand} className="px-3 py-1 rounded-lg bg-indigo-50 dark:bg-indigo-950/20 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 font-bold text-xs">
                                {brand}
                              </span>
                            ))
                          ) : (
                            <span className="text-xs text-slate-500 dark:text-slate-400 font-semibold italic">Genéricos e similares disponíveis no SUS</span>
                          )}
                        </div>
                      </div>

                      {/* Dosage Cards */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {/* Adult Dose */}
                        <div className="p-4 border border-blue-100 dark:border-blue-900/30 rounded-2xl bg-blue-50/10 dark:bg-blue-950/5 space-y-2.5">
                          <div className="flex items-center gap-2 text-blue-600 dark:text-blue-400 font-bold text-xs uppercase tracking-wider">
                            <User size={14} />
                            Dose Adulto Recomendada
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {enrichment ? enrichment.adult : `${selectedDrug.dose} ${selectedDrug.frequency}`}
                          </p>
                        </div>

                        {/* Pediatric Dose */}
                        <div className="p-4 border border-rose-100 dark:border-rose-900/30 rounded-2xl bg-rose-50/10 dark:bg-rose-950/5 space-y-2.5">
                          <div className="flex items-center gap-2 text-rose-500 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Heart size={14} />
                            Dose Pediátrica Estimada
                          </div>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {enrichment ? enrichment.pediatric : 'Dose orientada por kg de peso corporal em serviço especializado.'}
                          </p>
                        </div>
                      </div>

                      {/* SUS presentation & warnings */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2">
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Apresentações comuns no SUS</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-bold">{selectedDrug.presentation || 'Comprimidos / Gotas / Injetável'}</p>
                        </div>
                        <div className="space-y-1">
                          <span className="text-[10px] font-bold text-slate-400 dark:text-slate-500 uppercase">Ajuste Renal / Notas</span>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold italic">{selectedDrug.renalAdjustment || 'Ajustes não necessários para função renal padrão.'}</p>
                        </div>
                      </div>

                      {/* Notes / Warning */}
                      {selectedDrug.notes && (
                        <div className="p-4 bg-amber-500/5 rounded-2xl border border-amber-500/10 flex gap-3">
                          <Info className="text-amber-500 flex-shrink-0" size={16} />
                          <div className="space-y-0.5">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">Instruções Importantes</h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">{selectedDrug.notes}</p>
                          </div>
                        </div>
                      )}
                    </div>
                  </motion.div>
                ) : (
                  <div className="py-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400 text-xs font-semibold">
                    Selecione ou busque um medicamento para detalhar a posologia.
                  </div>
                )}
              </div>
            );
          })()}

          {/* Disease Lookup (Consulta Doenças) */}
          {activeFormType === 'disease' && (() => {
            const selectedDisease = UBS_CATALOG_DISEASES.find(d => d.id === selectedDiseaseId);
            const enrichment = selectedDisease ? (DISEASE_ENRICHMENTS[selectedDisease.id] || DISEASE_ENRICHMENTS[selectedDisease.id.toLowerCase()]) : null;

            return (
              <div className="space-y-6">
                <div className="bg-gradient-to-br from-indigo-500/5 to-blue-500/5 border border-indigo-500/10 rounded-2xl p-6 relative overflow-hidden">
                  <div className="flex gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-indigo-500/15 text-indigo-600 dark:text-indigo-400 flex items-center justify-center flex-shrink-0 animate-pulse">
                      <Search size={24} />
                    </div>
                    <div>
                      <h4 className="font-serif font-black text-lg text-slate-800 dark:text-white tracking-tight">Guia de Diretrizes de Doenças & Condutas</h4>
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-medium">Consulte critérios diagnósticos, exames necessários, tratamentos de 1ª/2ª linha e sinais de gravidade.</p>
                    </div>
                  </div>
                </div>

                {/* Search Bar */}
                <div className="relative">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block mb-1.5">Pesquisar Suspeita Diagnóstica</label>
                  <div className="relative">
                    <input 
                      type="text" 
                      placeholder="Ex: Hipertensão, Diabetes, Asma, Pneumonia, Infecção Urinária..."
                      value={diseaseSearchInput}
                      onFocus={() => setShowDiseaseDropdown(true)}
                      onChange={(e) => {
                        setDiseaseSearchInput(e.target.value);
                        setShowDiseaseDropdown(true);
                      }}
                      className="w-full h-12 pl-11 pr-10 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-indigo-500/20 outline-none transition-all"
                    />
                    <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
                    {diseaseSearchInput && (
                      <button
                        type="button"
                        onClick={() => {
                          setDiseaseSearchInput('');
                          setSelectedDiseaseId('');
                        }}
                        className="absolute right-4 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 cursor-pointer"
                      >
                        ✕
                      </button>
                    )}
                  </div>

                  {/* Autocomplete Dropdown */}
                  {showDiseaseDropdown && (
                    <>
                      <div className="fixed inset-0 z-40" onClick={() => setShowDiseaseDropdown(false)} />
                      <div className="absolute left-0 right-0 top-full mt-2 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl shadow-2xl z-50 max-h-60 overflow-y-auto divide-y divide-slate-100 dark:divide-slate-700/50 custom-scrollbar">
                        {UBS_CATALOG_DISEASES.filter(d => 
                          d.name.toLowerCase().includes(diseaseSearchInput.toLowerCase()) ||
                          d.category.toLowerCase().includes(diseaseSearchInput.toLowerCase())
                        ).length === 0 ? (
                          <div className="p-4 text-center text-xs text-slate-400 font-semibold italic">
                            Nenhuma diretriz de doença correspondente.
                          </div>
                        ) : (
                          UBS_CATALOG_DISEASES.filter(d => 
                            d.name.toLowerCase().includes(diseaseSearchInput.toLowerCase()) ||
                            d.category.toLowerCase().includes(diseaseSearchInput.toLowerCase())
                          ).map(d => (
                            <button
                              key={d.id}
                              type="button"
                              onClick={() => {
                                setSelectedDiseaseId(d.id);
                                setDiseaseSearchInput(d.name);
                                setShowDiseaseDropdown(false);
                              }}
                              className="w-full p-3.5 text-left hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-colors flex flex-col gap-0.5 border-none outline-none cursor-pointer"
                            >
                              <div className="flex justify-between items-center w-full">
                                <span className="font-bold text-xs text-slate-700 dark:text-white">{d.name}</span>
                                <span className="px-2 py-0.5 rounded text-[8px] font-black bg-indigo-500/10 text-indigo-500 dark:text-indigo-400 uppercase tracking-wider">{d.category}</span>
                              </div>
                            </button>
                          ))
                        )}
                      </div>
                    </>
                  )}
                </div>

                {/* Quick Filters */}
                <div className="flex flex-wrap gap-1.5">
                  {['Hipertensão', 'Diabetes', 'Dengue', 'Asma', 'Infecção Urinária'].map(name => (
                    <button
                      key={name}
                      type="button"
                      onClick={() => {
                        const match = UBS_CATALOG_DISEASES.find(d => d.name.toLowerCase().includes(name.toLowerCase().substring(0,4)));
                        if (match) {
                          setSelectedDiseaseId(match.id);
                          setDiseaseSearchInput(match.name);
                        } else {
                          setDiseaseSearchInput(name);
                          setShowDiseaseDropdown(true);
                        }
                      }}
                      className="px-3.5 py-1.5 rounded-full border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-[10px] font-bold text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-700 transition-all cursor-pointer"
                    >
                      {name}
                    </button>
                  ))}
                </div>

                {/* Selected Disease Details Card */}
                {selectedDisease ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="border border-slate-200 dark:border-slate-700 rounded-3xl bg-white dark:bg-slate-900 overflow-hidden shadow-sm"
                  >
                    {/* Header */}
                    <div className="p-6 border-b border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50 flex flex-col md:flex-row md:items-center justify-between gap-4">
                      <div>
                        <span className="px-2.5 py-1 rounded-full text-[9px] font-black uppercase tracking-wider bg-indigo-100 dark:bg-indigo-950/40 text-indigo-600 dark:text-indigo-400 border border-indigo-200/20 mb-2 inline-block">
                          {selectedDisease.category}
                        </span>
                        <h4 className="font-serif font-black text-xl text-slate-800 dark:text-white tracking-tight">{selectedDisease.name}</h4>
                        <p className="text-xs text-slate-400 font-bold mt-0.5">Protocolo de Conduta Clínica - Diretriz do Ministério da Saúde</p>
                      </div>

                      <button
                        type="button"
                        onClick={() => {
                          const copyText = `DIRETRIZ CLÍNICA: ${selectedDisease.name}\n- Critérios de Diagnóstico: ${selectedDisease.diagnostic}\n- Sinais de Alerta: ${selectedDisease.alarm}\n- Tratamento 1ª Linha: ${selectedDisease.treatment[0]?.title || ''} - ${selectedDisease.treatment[0]?.desc || ''}`;
                          navigator.clipboard.writeText(copyText);
                          triggerNotification('Diretriz clínica copiada com sucesso!');
                        }}
                        className="px-4 py-2.5 rounded-xl bg-indigo-50 dark:bg-indigo-950/20 hover:bg-indigo-100 text-indigo-600 dark:text-indigo-400 border border-indigo-100/30 text-xs font-bold flex items-center gap-1.5 transition-all self-start md:self-center cursor-pointer"
                      >
                        <Copy size={13} />
                        Copiar Diretrizes Completas
                      </button>
                    </div>

                    {/* Content Body */}
                    <div className="p-6 space-y-6">
                      
                      {/* Diagnostic Criteria & Necessary Tests */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 space-y-2">
                          <h5 className="text-[10px] font-black uppercase text-indigo-600 dark:text-indigo-400 tracking-wider">Critérios para Diagnóstico</h5>
                          <p className="text-xs font-semibold text-slate-700 dark:text-slate-300 leading-relaxed">
                            {selectedDisease.diagnostic}
                          </p>
                        </div>

                        <div className="p-4 rounded-2xl bg-sky-500/5 border border-sky-500/10 space-y-2.5">
                          <h5 className="text-[10px] font-black uppercase text-sky-600 dark:text-sky-400 tracking-wider">Testes Clínicos Necessários</h5>
                          <div className="space-y-1.5">
                            {enrichment ? (
                              enrichment.tests.map((test, idx) => (
                                <div key={idx} className="flex gap-2 items-start text-xs text-slate-600 dark:text-slate-400 font-medium">
                                  <span className="text-sky-500 font-bold">•</span>
                                  <span>{test}</span>
                                </div>
                              ))
                            ) : (
                              <p className="text-xs font-semibold text-slate-500 italic">Avaliação de história clínica detalhada, sintomatologia e anamnese física padrão.</p>
                            )}
                          </div>
                        </div>
                      </div>

                      {/* First and Second Line Treatments */}
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        <div className="p-4 rounded-2xl bg-emerald-500/5 border border-emerald-500/10 space-y-2.5">
                          <h5 className="text-[10px] font-black uppercase text-emerald-600 dark:text-emerald-400 tracking-wider">Tratamento de 1ª Linha (Padrão)</h5>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">{selectedDisease.treatment[0]?.title || 'Terapêutica Inicial'}</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                              {selectedDisease.treatment[0]?.desc || 'Apoio de conduta geral sem fármacos na primeira consulta ou sintomáticos leves.'}
                            </p>
                          </div>
                        </div>

                        <div className="p-4 rounded-2xl bg-blue-500/5 border border-blue-500/10 space-y-2.5">
                          <h5 className="text-[10px] font-black uppercase text-blue-600 dark:text-blue-400 tracking-wider">Tratamento de 2ª Linha (Alternativo)</h5>
                          <div className="space-y-1">
                            <span className="text-xs font-bold text-slate-800 dark:text-white block">{selectedDisease.treatment[1]?.title || 'Terapêutica Alternativa'}</span>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-medium leading-relaxed">
                              {selectedDisease.treatment[1]?.desc || 'Alternativas terapêuticas em caso de alergias, intolerâncias ou ausência de resposta ao tratamento inicial.'}
                            </p>
                          </div>
                        </div>
                      </div>

                      {/* Exams to request */}
                      <div className="space-y-3">
                        <h5 className="text-[10px] font-black uppercase text-slate-400 dark:text-slate-500 tracking-wider">Exames Laboratoriais ou Complementares que devem ser solicitados</h5>
                        <div className="grid grid-cols-1 md:grid-cols-2 gap-2">
                          {enrichment ? (
                            enrichment.exams.map((exam, idx) => (
                              <div key={idx} className="flex gap-2 items-center p-2.5 border border-slate-100 dark:border-slate-800/80 rounded-xl bg-slate-50/50 dark:bg-slate-900/50">
                                <div className="w-5 h-5 rounded-md bg-indigo-50 dark:bg-indigo-950/20 text-indigo-500 text-[10px] flex items-center justify-center font-bold">{idx + 1}</div>
                                <span className="text-xs font-semibold text-slate-700 dark:text-slate-300">{exam}</span>
                              </div>
                            ))
                          ) : (
                            <div className="col-span-2 text-xs text-slate-500 dark:text-slate-400 italic">Solicitar exames laboratoriais básicos (ex: Hemograma completo, Ureia, Creatinina, EAS) de acordo com a gravidade clínica aparente.</div>
                          )}
                        </div>
                      </div>

                      {/* Alarm Symptoms */}
                      {selectedDisease.alarm && (
                        <div className="p-4 bg-rose-500/5 rounded-2xl border border-rose-500/10 flex gap-3">
                          <AlertTriangle className="text-rose-500 flex-shrink-0" size={16} />
                          <div className="space-y-0.5">
                            <h5 className="text-[10px] font-bold uppercase tracking-wider text-rose-600 dark:text-rose-400">Sinais de Alarme & Critérios de Gravidade</h5>
                            <p className="text-xs text-slate-600 dark:text-slate-400 font-semibold leading-relaxed">{selectedDisease.alarm}</p>
                          </div>
                        </div>
                      )}

                    </div>
                  </motion.div>
                ) : (
                  <div className="py-16 text-center border-2 border-dashed border-slate-100 dark:border-slate-800 rounded-3xl text-slate-400 text-xs font-semibold">
                    Selecione ou busque uma suspeita diagnóstica para detalhar as diretrizes clínicas.
                  </div>
                )}
              </div>
            );
          })()}

          {/* Manchester Triage Specific Fields */}
          {activeFormType === 'triage' && (
            <div className="space-y-6">
              
              <div className="space-y-1.5">
                <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Queixa Principal na Triagem</label>
                <textarea 
                  rows={2}
                  value={triageData.complaint}
                  onChange={(e) => setTriageData({...triageData, complaint: e.target.value})}
                  placeholder="Ex: Febre alta iniciada há 24h associada a vômitos de repetição e prostração marcante."
                  className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                />
              </div>

              {/* Sinais Vitais */}
              <div className="space-y-4">
                <h5 className="text-xs font-bold text-slate-500 uppercase tracking-widest flex items-center gap-2">
                  <Activity size={14} />
                  Sinais Vitais na Entrada
                </h5>
                <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-6 gap-3">
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">PA (mmHg)</label>
                    <input 
                      type="text" 
                      placeholder="110/70"
                      value={triageData.pa}
                      onChange={(e) => setTriageData({...triageData, pa: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">FC (bpm)</label>
                    <input 
                      type="text" 
                      placeholder="90"
                      value={triageData.fc}
                      onChange={(e) => setTriageData({...triageData, fc: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">FR (irpm)</label>
                    <input 
                      type="text" 
                      placeholder="20"
                      value={triageData.fr}
                      onChange={(e) => setTriageData({...triageData, fr: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Temp (°C)</label>
                    <input 
                      type="text" 
                      placeholder="38.2"
                      value={triageData.temp}
                      onChange={(e) => setTriageData({...triageData, temp: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">SatO2 (%)</label>
                    <input 
                      type="text" 
                      placeholder="97"
                      value={triageData.sat}
                      onChange={(e) => setTriageData({...triageData, sat: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Escala Dor (0-10)</label>
                    <select 
                      value={triageData.painScale}
                      onChange={(e) => setTriageData({...triageData, painScale: e.target.value})}
                      className="w-full h-10 px-3 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-lg text-xs font-bold text-slate-700 dark:text-white"
                    >
                      {[0,1,2,3,4,5,6,7,8,9,10].map(v => (
                        <option key={v} value={v}>{v}</option>
                      ))}
                    </select>
                  </div>
                </div>
              </div>

              {/* Protocolo Manchester */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="space-y-3">
                  <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter block">Classificação de Risco (Manchester)</label>
                  <div className="grid grid-cols-1 gap-2">
                    <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${triageData.riskLevel === 'red' ? 'bg-red-500/10 border-red-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="risk"
                        checked={triageData.riskLevel === 'red'}
                        onChange={() => setTriageData({ ...triageData, riskLevel: 'red', recommendedArea: 'Sala Vermelha (Emergência)' })}
                        className="w-4.5 h-4.5 text-red-600 focus:ring-red-500"
                      />
                      <div className="w-3.5 h-3.5 rounded-full bg-red-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-red-600 block">Vermelho -- Emergência</span>
                        <span className="text-[10px] text-slate-500 font-bold">Atendimento imediato na Sala Vermelha</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${triageData.riskLevel === 'orange' ? 'bg-orange-500/10 border-orange-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="risk"
                        checked={triageData.riskLevel === 'orange'}
                        onChange={() => setTriageData({ ...triageData, riskLevel: 'orange', recommendedArea: 'Sala de Medicação / Amarelo' })}
                        className="w-4.5 h-4.5 text-orange-600 focus:ring-orange-500"
                      />
                      <div className="w-3.5 h-3.5 rounded-full bg-orange-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-orange-600 block">Laranja -- Muito Urgente</span>
                        <span className="text-[10px] text-slate-500 font-bold">Atendimento prioritário em até 10 minutos</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${triageData.riskLevel === 'yellow' ? 'bg-amber-500/10 border-amber-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="risk"
                        checked={triageData.riskLevel === 'yellow'}
                        onChange={() => setTriageData({ ...triageData, riskLevel: 'yellow', recommendedArea: 'Consultório Clínico / Triagem' })}
                        className="w-4.5 h-4.5 text-amber-600 focus:ring-amber-500"
                      />
                      <div className="w-3.5 h-3.5 rounded-full bg-amber-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-amber-600 block">Amarelo -- Urgente</span>
                        <span className="text-[10px] text-slate-500 font-bold">Atendimento moderado em até 60 minutos</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${triageData.riskLevel === 'green' ? 'bg-emerald-500/10 border-emerald-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="risk"
                        checked={triageData.riskLevel === 'green'}
                        onChange={() => setTriageData({ ...triageData, riskLevel: 'green', recommendedArea: 'Consultório de Retornos' })}
                        className="w-4.5 h-4.5 text-emerald-600 focus:ring-emerald-500"
                      />
                      <div className="w-3.5 h-3.5 rounded-full bg-emerald-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-emerald-600 block">Verde -- Pouco Urgente</span>
                        <span className="text-[10px] text-slate-500 font-bold">Atendimento em até 120 minutos</span>
                      </div>
                    </label>

                    <label className={`flex items-center gap-3 p-3.5 rounded-xl cursor-pointer border transition-all ${triageData.riskLevel === 'blue' ? 'bg-sky-500/10 border-sky-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-100 dark:border-slate-800'}`}>
                      <input 
                        type="radio" 
                        name="risk"
                        checked={triageData.riskLevel === 'blue'}
                        onChange={() => setTriageData({ ...triageData, riskLevel: 'blue', recommendedArea: 'Atenção Básica / Ambulatório' })}
                        className="w-4.5 h-4.5 text-sky-600 focus:ring-sky-500"
                      />
                      <div className="w-3.5 h-3.5 rounded-full bg-sky-500 flex-shrink-0" />
                      <div>
                        <span className="text-xs font-black text-sky-600 block">Azul -- Não Urgente</span>
                        <span className="text-[10px] text-slate-500 font-bold">Encaminhar para UBS (até 240 min)</span>
                      </div>
                    </label>
                  </div>
                </div>

                <div className="space-y-6">
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Área de Encaminhamento Direcionada</label>
                    <input 
                      type="text" 
                      value={triageData.recommendedArea}
                      onChange={(e) => setTriageData({...triageData, recommendedArea: e.target.value})}
                      className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white"
                    />
                  </div>
                  <div className="space-y-1.5">
                    <label className="text-xs font-bold text-slate-400 uppercase tracking-tighter">Notas Adicionais do Enfermeiro</label>
                    <textarea 
                      rows={6}
                      value={triageData.triageNotes}
                      onChange={(e) => setTriageData({...triageData, triageNotes: e.target.value})}
                      placeholder="Histórico de alergias relatado na triagem, alergia a medicamentos (ex: dipirona), saturação limítrofe no ar ambiente, etc."
                      className="w-full p-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-sm font-semibold text-slate-700 dark:text-white focus:ring-2 focus:ring-medical-primary/20 outline-none"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex flex-wrap items-center justify-between gap-3">
            <button 
              type="button"
              onClick={() => {
                setPatientName('');
                setPatientAge('');
                setPatientWeight('');
                setPatientSex('Masculino');
                setAllergies('');
                setCurrentMedications('');
                setPastSurgeries('');
                setMedSearchInput('');
                if (activeFormType === 'prescription') setPrescriptionItems([]);
                triggerNotification('Campos limpos com sucesso!');
              }}
              className="px-5 py-3 rounded-xl border border-slate-200 dark:border-slate-700 text-slate-500 dark:text-slate-400 font-bold text-xs hover:bg-slate-50 dark:hover:bg-slate-700/50 transition-all cursor-pointer"
            >
              Limpar Campos
            </button>
            <div className="flex gap-2.5">
              <button 
                type="button"
                onClick={() => {
                  if (!patientName.trim()) {
                    triggerNotification('Atenção: Por favor, insira o nome do paciente antes de copiar!');
                    return;
                  }
                  const formatted = generateClinicalText(activeFormType);
                  navigator.clipboard.writeText(formatted);
                  triggerNotification('Anamnese copiada com sucesso para a área de transferência!');
                }}
                className="px-5 py-3 rounded-xl bg-emerald-50 dark:bg-emerald-950/20 text-emerald-600 dark:text-emerald-400 font-bold text-xs flex items-center justify-center gap-2 hover:bg-emerald-100 dark:hover:bg-emerald-950/40 transition-all border border-emerald-200 dark:border-emerald-900/30 cursor-pointer"
              >
                <Copy size={13} />
                Copiar Anamnese Formatada
              </button>
              <button 
                type="submit"
                className="px-6 py-3 rounded-xl bg-medical-primary text-white font-bold text-xs shadow-lg shadow-medical-primary/20 hover:bg-medical-primary/90 transition-all cursor-pointer flex items-center gap-2"
              >
                <FileText size={14} />
                Salvar Anamnese
              </button>
            </div>
          </div>
        </form>
      </div>

      {/* History of Saved Forms Sidebar */}
      <div className="xl:col-span-4 space-y-6">
        <div className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 shadow-sm space-y-6">
          <div className="border-b border-slate-100 dark:border-slate-700 pb-4">
            <h3 className="font-serif font-black text-xl text-slate-800 dark:text-white tracking-tight flex items-center gap-2">
              <Clock size={18} />
              Histórico de Anamneses
            </h3>
            <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest mt-0.5">Consultas salvas no dispositivo (LGPD Seguras)</p>
          </div>

          {/* Quick Search */}
          <div className="relative">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={16} />
            <input 
              type="text" 
              placeholder="Buscar por paciente ou data..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full h-10 pl-10 pr-4 bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-xl text-xs font-semibold text-slate-700 dark:text-slate-300 outline-none focus:ring-2 focus:ring-medical-primary/10 transition-all"
            />
          </div>

          {/* List of saved forms */}
          <div className="space-y-2 max-h-[480px] overflow-y-auto pr-1 custom-scrollbar">
            {filteredForms.length === 0 ? (
              <div className="py-12 text-center text-slate-400 font-medium text-xs">
                {searchQuery ? 'Nenhuma anamnese coincide com a pesquisa.' : 'Nenhuma anamnese salva neste dispositivo.'}
              </div>
            ) : (
              filteredForms.map(form => (
                <div 
                  key={form.id}
                  onClick={() => setViewingForm(form)}
                  className={`w-full p-4 border rounded-2xl text-left cursor-pointer transition-all hover:scale-[1.01] flex items-center justify-between gap-3 ${viewingForm?.id === form.id ? 'bg-medical-primary/5 border-medical-primary' : 'bg-slate-50 dark:bg-slate-900/50 border-slate-100 dark:border-slate-800/80 hover:border-slate-300'}`}
                >
                  <div className="space-y-1 min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] font-black uppercase tracking-wider ${
                        form.type === 'pediatric' ? 'bg-rose-500/10 text-rose-500' :
                        form.type === 'adult' ? 'bg-blue-500/10 text-blue-500' :
                        form.type === 'prescription' ? 'bg-emerald-500/10 text-emerald-500' :
                        'bg-amber-500/10 text-amber-500'
                      }`}>
                        {form.type === 'pediatric' ? 'Pediatria' :
                         form.type === 'adult' ? 'Clínico' :
                         form.type === 'prescription' ? 'Receita' :
                         'Triagem'}
                      </span>
                      <span className="text-[10px] text-slate-400 font-medium">{form.date}</span>
                    </div>
                    <h5 className="font-bold text-xs text-slate-700 dark:text-white truncate">{form.patientName}</h5>
                    {form.patientAge && <p className="text-[10px] text-slate-400 font-semibold">{form.patientAge}</p>}
                  </div>
                  <div className="flex gap-1.5 flex-shrink-0">
                    <button 
                      onClick={(e) => { e.stopPropagation(); copyToClipboard(form.formattedText, form.id); }}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-500 dark:text-slate-400 hover:text-medical-primary hover:bg-slate-50 transition-colors"
                      title="Copiar Anamnese"
                    >
                      <Copy size={12} />
                    </button>
                    <button 
                      onClick={(e) => deleteForm(form.id, e)}
                      className="p-1.5 rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 text-slate-400 hover:text-rose-500 hover:bg-rose-50/50 transition-colors"
                      title="Excluir Registro"
                    >
                      <Trash2 size={12} />
                    </button>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Viewing modal/sheet of selected form */}
        <AnimatePresence>
          {viewingForm && (
            <motion.div 
              initial={{ opacity: 0, scale: 0.98, y: 10 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.98, y: 10 }}
              className="bg-white dark:bg-slate-800 border-2 border-medical-primary/20 rounded-3xl p-6 shadow-xl space-y-4"
            >
              <div className="flex justify-between items-start">
                <div>
                  <h4 className="font-serif font-black text-lg text-slate-800 dark:text-white tracking-tight">Detalhes da Anamnese</h4>
                  <p className="text-[10px] text-slate-400 font-bold uppercase tracking-widest">{viewingForm.patientName}</p>
                </div>
                <button 
                  onClick={() => setViewingForm(null)}
                  className="p-1 text-slate-400 hover:text-slate-600 dark:hover:text-white rounded-lg"
                >
                  ✕
                </button>
              </div>

              {/* Formatted clinical text ready for copy paste */}
              <div className="bg-slate-50 dark:bg-slate-900 border border-slate-100 dark:border-slate-800 rounded-2xl p-4 max-h-[300px] overflow-y-auto">
                <pre className="text-[10px] font-mono text-slate-700 dark:text-slate-300 whitespace-pre-wrap leading-relaxed">
                  {viewingForm.formattedText}
                </pre>
              </div>

              <div className="flex gap-2">
                <button 
                  onClick={() => copyToClipboard(viewingForm.formattedText, viewingForm.id)}
                  className="flex-1 py-3 bg-medical-primary text-white font-bold text-xs rounded-xl flex items-center justify-center gap-2 shadow-md shadow-medical-primary/10 hover:bg-medical-primary/95 transition-all cursor-pointer"
                >
                  <Copy size={13} />
                  Copiar Anamnese Completa
                </button>
                <button 
                  onClick={() => deleteForm(viewingForm.id)}
                  className="px-4 py-3 bg-rose-500/10 hover:bg-rose-500/20 text-rose-500 font-bold text-xs rounded-xl transition-all cursor-pointer"
                >
                  <Trash2 size={13} />
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {/* MODAL: Criar / Editar Modelo de Anamnese por Especialidade */}
        <AnimatePresence>
          {showPresetModal && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setShowPresetModal(false)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-sm"
              />
              <motion.div
                initial={{ opacity: 0, scale: 0.95, y: 15 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.95, y: 15 }}
                className="relative w-full max-w-xl bg-white dark:bg-slate-900 rounded-[32px] p-6 sm:p-8 shadow-2xl border border-slate-200 dark:border-slate-800 space-y-6 max-h-[90vh] overflow-y-auto custom-scrollbar"
              >
                <div className="flex justify-between items-center border-b border-slate-100 dark:border-slate-800 pb-4">
                  <div>
                    <h3 className="font-serif font-black italic text-xl text-slate-900 dark:text-white">
                      {editingPresetId ? 'Editar Modelo de Anamnese' : 'Novo Modelo Personalizado'}
                    </h3>
                    <p className="text-xs text-slate-400 font-bold uppercase tracking-wider mt-0.5">
                      Selecione quais seções semiológicas farão parte deste modelo
                    </p>
                  </div>
                  <button onClick={() => setShowPresetModal(false)} className="text-slate-400 hover:text-slate-600">
                    <X size={20} />
                  </button>
                </div>

                <div className="space-y-4">
                  <div className="grid grid-cols-4 gap-3">
                    <div className="col-span-1 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Ícone / Emoji</label>
                      <input
                        type="text"
                        value={presetIconInput}
                        onChange={(e) => setPresetIconInput(e.target.value)}
                        placeholder="🩺"
                        className="w-full h-11 text-center text-xl bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl outline-none"
                      />
                    </div>
                    <div className="col-span-3 space-y-1">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Nome do Modelo</label>
                      <input
                        type="text"
                        value={presetNameInput}
                        onChange={(e) => setPresetNameInput(e.target.value)}
                        placeholder="Ex: Endocrinologia / Diabetes"
                        className="w-full h-11 px-4 bg-slate-50 dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl text-xs font-bold text-slate-800 dark:text-slate-200 outline-none"
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <div className="flex justify-between items-center">
                      <label className="text-[10px] font-bold uppercase tracking-wider text-slate-400">
                        Seções Incluídas ({presetSelectedSectionIds.length} ativas)
                      </label>
                      <div className="flex gap-2 text-[10px]">
                        <button
                          type="button"
                          onClick={() => setPresetSelectedSectionIds(ANAMNESE_SECTIONS_CATALOG.map(s => s.id))}
                          className="font-bold text-medical-primary hover:underline"
                        >
                          Marcar Todas
                        </button>
                        <button
                          type="button"
                          onClick={() => setPresetSelectedSectionIds([])}
                          className="font-bold text-rose-500 hover:underline"
                        >
                          Desmarcar
                        </button>
                      </div>
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 max-h-[260px] overflow-y-auto custom-scrollbar p-1 border border-slate-100 dark:border-slate-800 rounded-2xl bg-slate-50/50 dark:bg-slate-900/50">
                      {ANAMNESE_SECTIONS_CATALOG.map(item => {
                        const isChecked = presetSelectedSectionIds.includes(item.id);
                        return (
                          <div
                            key={item.id}
                            onClick={() => {
                              if (isChecked) {
                                setPresetSelectedSectionIds(prev => prev.filter(id => id !== item.id));
                              } else {
                                setPresetSelectedSectionIds(prev => [...prev, item.id]);
                              }
                            }}
                            className={`p-2.5 rounded-xl border text-xs cursor-pointer flex items-center justify-between transition-all ${
                              isChecked
                                ? 'bg-medical-primary/10 border-medical-primary text-medical-primary font-bold'
                                : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-300'
                            }`}
                          >
                            <span>{item.title}</span>
                            <div className={`w-4 h-4 rounded-md flex items-center justify-center text-[10px] ${
                              isChecked ? 'bg-medical-primary text-white' : 'border border-slate-300'
                            }`}>
                              {isChecked && '✓'}
                            </div>
                          </div>
                        );
                      })}
                    </div>
                  </div>
                </div>

                <div className="flex items-center gap-3 pt-2">
                  {editingPresetId && customPresets.some(p => p.id === editingPresetId) && (
                    <button
                      type="button"
                      onClick={() => deleteCustomPreset(editingPresetId)}
                      className="px-4 py-3.5 bg-rose-50 dark:bg-rose-950/40 text-rose-600 rounded-2xl font-bold text-xs hover:bg-rose-100 cursor-pointer"
                    >
                      Excluir
                    </button>
                  )}
                  <button
                    type="button"
                    onClick={savePresetModel}
                    disabled={!presetNameInput.trim()}
                    className="flex-1 py-3.5 bg-medical-primary text-white rounded-2xl font-black text-xs uppercase tracking-wider hover:bg-medical-primary/90 shadow-lg shadow-medical-primary/20 disabled:opacity-50 cursor-pointer flex items-center justify-center gap-2"
                  >
                    <Save size={16} />
                    <span>Salvar Modelo de Anamnese</span>
                  </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
