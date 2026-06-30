import React, { useState, useMemo, useCallback } from 'react';
import { 
  Search, 
  Heart, 
  Brain, 
  Wind, 
  Stethoscope, 
  Activity, 
  ShieldAlert, 
  Pill, 
  ClipboardList, 
  ArrowUpRight, 
  Check, 
  ChevronDown, 
  ChevronRight, 
  Info, 
  AlertTriangle,
  Flame,
  UserCheck,
  TrendingUp,
  Eye,
  Calendar,
  Layers,
  Sparkles
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UBS_CATALOG_DISEASES, DiseaseInfo } from '../ubsCatalog';

interface SpecialtyDefinition {
  id: string;
  name: string;
  icon: React.ComponentType<any>;
  description: string;
  referralCriteria: string[];
  color: string;
  bgLight: string;
  borderClass: string;
  textClass: string;
  diseaseIds: string[];
}

export default function AmbulatoriosModule() {
  const [selectedSpecialty, setSelectedSpecialty] = useState<string>('cardio');
  const [searchTerm, setSearchTerm] = useState<string>('');
  const [expandedDiseaseId, setExpandedDiseaseId] = useState<string | null>(null);

  // Define the specialties and map their corresponding disease IDs from ubsCatalog
  const SPECIALTIES: SpecialtyDefinition[] = useMemo(() => [
    {
      id: 'cardio',
      name: 'Cardiologia',
      icon: Heart,
      description: 'Estratificação de risco cardiovascular global, manejo de hipertensão resistente, insuficiência cardíaca crônica e arritmias cardíacas estáveis.',
      color: 'rose',
      bgLight: 'bg-rose-500/[0.03] dark:bg-rose-950/[0.03]',
      borderClass: 'border-rose-500/15 dark:border-rose-900/20',
      textClass: 'text-rose-600 dark:text-rose-400',
      referralCriteria: [
        'Hipertensão Arterial Resistente (descontrole de PA com 3 classes de fármacos em dose máxima, incluindo diurético).',
        'Insuficiência Cardíaca refratária ao tratamento convencional da UBS ou com fraqueza de ejeção desconhecida.',
        'Palpitações recorrentes com suspeita ou confirmação de arritmia significativa (ex: Fibrilação Atrial).',
        'Angina de peito ou cardiopatia isquêmica crônica para avaliação de revascularização.',
        'Sopros cardíacos novos ou suspeita de valvulopatias clinicamente moderadas a graves.'
      ],
      diseaseIds: ['has', 'insufcard', 'fib-atrial', 'iam', 'varizes', 'ivc', 'estenose_aortica', 'miocardiopatia', 'cor_pulmonale', 'chagas']
    },
    {
      id: 'endocrino',
      name: 'Endocrinologia',
      icon: Sparkles,
      description: 'Manejo de Diabetes Mellitus de difícil controle, distúrbios de tireoide, obesidade refratária, osteoporose e climatério.',
      color: 'amber',
      bgLight: 'bg-amber-500/[0.03] dark:bg-amber-950/[0.03]',
      borderClass: 'border-amber-500/15 dark:border-amber-900/20',
      textClass: 'text-amber-600 dark:text-amber-400',
      referralCriteria: [
        'Diabetes Mellitus Tipo 2 com descontrole glicêmico grave (HbA1c > 9.0%) apesar de insulinoterapia otimizada.',
        'Hipotireoidismo persistente com TSH flutuante e de difícil estabilização com doses altas de Levotiroxina.',
        'Nódulos tireoidianos suspeitos ou volumosos para avaliação de punção por agulha fina (PAAF).',
        'Hipertireoidismo clínico inicial para programação de dose terapêutica ou cirurgia.',
        'Obesidade grau III com indicação de cirurgia bariátrica ou falha extrema de manejo comportamental e farmacológico básico.'
      ],
      diseaseIds: ['dm2', 'hipo', 'hiper-tireo', 'dislip', 'obesidade', 'climaterio', 'cad', 'nodulo_tireoide', 'hipercortisolismo']
    },
    {
      id: 'pneumo',
      name: 'Pneumologia',
      icon: Wind,
      description: 'Manejo de asma grave refratária, DPOC avançado, avaliação de tosse crônica inexplicada e investigação de doenças pulmonares intersticiais.',
      color: 'emerald',
      bgLight: 'bg-emerald-500/[0.03] dark:bg-emerald-950/[0.03]',
      borderClass: 'border-emerald-500/15 dark:border-emerald-900/20',
      textClass: 'text-emerald-600 dark:text-emerald-400',
      referralCriteria: [
        'Asma de difícil controle (exigindo corticoide inalatório de alta dose + LABA e ainda com exacerbações frequentes).',
        'DPOC estágio C ou D (Grupo GOLD) com exacerbações de repetição ou indicação de oxigenioterapia domiciliar.',
        'Nódulos pulmonares de achado incidental em exames de imagem para investigação de malignidade.',
        'Tosse crônica refratária (duração > 8 semanas) após exclusão de DRGE, asma e uso de iECA.',
        'Suspeita clínica de apneia obstrutiva do sono para solicitação de polissonografia.'
      ],
      diseaseIds: ['asma', 'dpoc', 'exacerbacao_asma', 'pneumotorax', 'tep', 'bronquiectasia', 'fibrose_pulmonar', 'apneia_sono']
    },
    {
      id: 'gastro',
      name: 'Gastroenterologia',
      icon: Flame,
      description: 'Manejo de refluxo gastroesofágico refratário, gastrite crônica erosiva, hepatites, colelitíase e cirrose hepática compensada.',
      color: 'orange',
      bgLight: 'bg-orange-500/[0.03] dark:bg-orange-950/[0.03]',
      borderClass: 'border-orange-500/15 dark:border-orange-900/20',
      textClass: 'text-orange-600 dark:text-orange-400',
      referralCriteria: [
        'DRGE refratária ao uso de IBP em dose dobrada por mais de 8 semanas com sintomas persistentes.',
        'Dispepsia persistente com sinais de alarme em pacientes com mais de 50 anos (perda ponderal, disfagia, anemia).',
        'Doença Hepática Gordurosa Não Alcoólica (DHGNA) com fibrose estimada moderada a grave.',
        'Colelitíase sintomática confirmada por imagem para encaminhamento à cirurgia geral/digestiva eletiva.',
        'Cirrose hepática com varizes de esôfago documentadas para rastreio e ligadura elástica.'
      ],
      diseaseIds: ['drge', 'gastrite', 'constipacao', 'diarreia', 'gastro-desidrat', 'cirrose', 'colelitiase', 'hep-cronicas', 'pancreatite', 'hda', 'doenca_crohn', 'retocolite', 'sindrome_intestino_irritavel', 'esteatose_hepatica', 'hepatite_b']
    },
    {
      id: 'neuro',
      name: 'Neurologia',
      icon: Brain,
      description: 'Investigação e manejo de cefaleias crônicas refratárias, epilepsias, tremores, declínio cognitivo e sequelas neurológicas estáveis.',
      color: 'violet',
      bgLight: 'bg-violet-500/[0.03] dark:bg-violet-950/[0.03]',
      borderClass: 'border-violet-500/15 dark:border-violet-900/20',
      textClass: 'text-violet-600 dark:text-violet-400',
      referralCriteria: [
        'Cefaleia refratária ou enxaqueca crônica com falha em pelo menos duas classes de profiláticos em dose otimizada.',
        'Epilepsia refratária ou com crises convulsivas persistentes a despeito do uso de dois anticonvulsivantes.',
        'Suspeita de declínio cognitivo rápido, demências precoces (< 60 anos) ou distúrbios do movimento (ex: Doença de Parkinson).',
        'Déficits neurológicos focais de início recente para elucidação diagnóstica e reabilitação pós-AVC tardia.',
        'Tremores a esclarecer com forte impacto funcional ou social.'
      ],
      diseaseIds: ['parkinson', 'epilepsia', 'cefaleiastens', 'migranea', 'labirintite', 'avc', 'crise_epiletica', 'esclerose_multipla', 'neuropatia_periferica', 'miastenia']
    },
    {
      id: 'reuma',
      name: 'Reumatologia',
      icon: Layers,
      description: 'Manejo de doenças autoimunes sistêmicas (LES, Artrite Reumatoide), gota refratária, osteoartrite grave e osteoporose complicada.',
      color: 'indigo',
      bgLight: 'bg-indigo-500/[0.03] dark:bg-indigo-950/[0.03]',
      borderClass: 'border-indigo-500/15 dark:border-indigo-900/20',
      textClass: 'text-indigo-600 dark:text-indigo-400',
      referralCriteria: [
        'Artrite simétrica persistente por mais de 6 semanas ou suspeita de Artrite Reumatoide.',
        'Suspeita clínica de Lúpus Eritematoso Sistêmico (LES) com FAN reagente em altos títulos associado a manifestações sistêmicas.',
        'Gota tofácea crônica ou com crises frequentes refratárias ao tratamento habitual na UBS.',
        'Doença osteometabólica complexa ou osteoporose refratária com fratura de fragilidade na vigência do tratamento.',
        'Fibromialgia ou lombalgia de difícil manejo álgico após falha terapêutica multidisciplinar básica.'
      ],
      diseaseIds: ['les', 'artrite-reuma', 'gota', 'osteoartrite', 'osteoporose', 'lombalgia', 'osteopenia', 'espondilite_anquilosante', 'fibromialgia', 'sindrome_sjogren', 'polimialgia_reumatica']
    },
    {
      id: 'nefro-uro',
      name: 'Nefrologia & Urologia',
      icon: Stethoscope,
      description: 'Acompanhamento de Doença Renal Crônica estágios 3b a 5, Hiperplasia Prostática Benigna obstrutiva e litíases urinárias recorrentes.',
      color: 'cyan',
      bgLight: 'bg-cyan-500/[0.03] dark:bg-cyan-950/[0.03]',
      borderClass: 'border-cyan-500/15 dark:border-cyan-900/20',
      textClass: 'text-cyan-600 dark:text-cyan-400',
      referralCriteria: [
        'Doença Renal Crônica com taxa de filtração glomerular estimada (eFG) < 45 mL/min/1.73m² (estágios G3b, G4 e G5).',
        'Relação Albumina/Creatinina Urinária (RAC) > 300 mg/g persistentemente (micro/macroalbuminúria severa).',
        'HPB com retenção urinária recorrente, infecções de repetição, hematúria macroscópica ou elevação do PSA.',
        'Cistite recorrente em mulheres jovens ou idosas com falha em profilaxia higiênica e quimioprofilaxia de 1ª linha.',
        'Cálculos renais múltiplos, bilaterais ou coraliformes para planejamento cirúrgico (litotripsia).'
      ],
      diseaseIds: ['doencarenal', 'hpb', 'itu', 'cistite-rec', 'pielonefrite', 'litiase-renal', 'urolitiase', 'pielonefrite_complicada', 'nefropatia_diabetica', 'glomerulonefrite', 'disfuncao_eretil']
    },
    {
      id: 'dermato',
      name: 'Dermatologia',
      icon: Info,
      description: 'Diagnóstico e manejo de eczemas extensos, psoríase, lesões cutâneas indeterminadas, hanseníase e micoses profundas ou refratárias.',
      color: 'teal',
      bgLight: 'bg-teal-500/[0.03] dark:bg-teal-950/[0.03]',
      borderClass: 'border-teal-500/15 dark:border-teal-900/20',
      textClass: 'text-teal-600 dark:text-teal-400',
      referralCriteria: [
        'Lesões de pele suspeitas de malignidade (critérios ABCDE para Melanoma, CBC ou CEC) para biópsia diagnóstica.',
        'Eczema ou Dermatite atópica grave, acometendo áreas extensas do corpo, com má resposta a corticoides tópicos.',
        'Diagnóstico diferencial ou manejo de manchas na pele com perda de sensibilidade suspeitas de Hanseníase.',
        'Micoses extensas ou onicomicoses persistentes refratárias a tratamentos sistêmicos por períodos recomendados.',
        'Dermatite seborreica grave ou psoríase moderada a grave com indicação de terapia sistêmica ou imunobiológicos.'
      ],
      diseaseIds: ['eczema', 'dermatite-seb', 'dermatite_contato', 'escabiose', 'micose', 'impetigo', 'celulite', 'erisipela', 'hzoster', 'farmacodermia', 'ulcera-venosa', 'psoriase', 'melanoma', 'vitiligo', 'acne_grave']
    },
    {
      id: 'mental',
      name: 'Saúde Mental / Psiquiatria',
      icon: UserCheck,
      description: 'Diagnóstico e manejo de transtornos do humor (depressão grave, ansiedade de difícil controle, pânico), prevenção do suicídio e psicofarmacologia.',
      color: 'blue',
      bgLight: 'bg-blue-500/[0.03] dark:bg-blue-950/[0.03]',
      borderClass: 'border-blue-500/15 dark:border-blue-900/20',
      textClass: 'text-blue-600 dark:text-blue-400',
      referralCriteria: [
        'Transtorno Depressivo com ideação suicida recorrente ou refratariedade a duas classes de antidepressivos (ISRS, Dual).',
        'Transtorno do Pânico ou de Ansiedade Generalizada com graves prejuízos laborais e familiares refratário ao tratamento inicial.',
        'Suspeita clínica de Transtorno Afetivo Bipolar (TAB) para introdução e estabilização de Carbonato de Lítio.',
        'Esquizofrenia ou outras psicoses crônicas com episódios de desorganização mental na UBS.',
        'Agitação psicomotora recorrente ou dependência química grave para acompanhamento conjunto com o CAPS.'
      ],
      diseaseIds: ['depressao', 'ansiedade', 'insonia', 'crise_panico', 'agitacao', 'delirium', 'bipolaridade', 'esquizofrenia', 'tdah_adulto', 'borderline']
    },
    {
      id: 'infecto',
      name: 'Infectologia',
      icon: Pill,
      description: 'Manejo de infecções crônicas ou prolongadas, vigilância epidemiológica e terapêutica de tuberculose, hanseníase e sífilis tardia.',
      color: 'indigo',
      bgLight: 'bg-indigo-500/[0.03] dark:bg-indigo-950/[0.03]',
      borderClass: 'border-indigo-500/15 dark:border-indigo-900/20',
      textClass: 'text-indigo-600 dark:text-indigo-400',
      referralCriteria: [
        'Tuberculose pulmonar ou extrapulmonar com falência terapêutica, toxicidade grave ao esquema RIPE ou resistência.',
        'Sífilis latente ou tardia com indicação de investigação neurológica (neurosífilis) ou com VDRL persistentemente alto pós-PQT.',
        'Dengue com sinais de choque, febre hemorrágica ou suspeita de Dengue Grave (referenciar imediatamente à emergência).',
        'Leptospirose moderada a grave (icterícia rubínica, febre, dor nas panturrilhas, plaquetopenia) para suporte hospitalar.',
        'Infeção por HIV / Aids ou profilaxia pós-exposição complexa.'
      ],
      diseaseIds: ['tuberculose', 'hanseniase', 'sifilis', 'dengue', 'leptospirose', 'escarlatina', 'verminose', 'sepse', 'endocardite', 'neutropenia_febril', 'hiv_aids', 'toxoplasmose']
    },
    {
      id: 'gineco',
      name: 'Ginecologia & Obstetrícia',
      icon: ClipboardList,
      description: 'Acompanhamento de intercorrências ginecológicas, pré-natal de alto risco, vaginoses recorrentes e doença inflamatória pélvica.',
      color: 'fuchsia',
      bgLight: 'bg-fuchsia-500/[0.03] dark:bg-fuchsia-950/[0.03]',
      borderClass: 'border-fuchsia-500/15 dark:border-fuchsia-900/20',
      textClass: 'text-fuchsia-600 dark:text-fuchsia-400',
      referralCriteria: [
        'Gestação de Alto Risco (HAS prévia descontrolada, DM gestacional mal controlado, risco de parto prematuro).',
        'Doença Inflamatória Pélvica (DIP) moderada a grave com indicação de internação e antibioticoterapia endovenosa.',
        'Vaginoses bacterianas ou candidíase de repetição com falência completa de esquemas antimicrobianos habituais.',
        'Sangramento uterino anormal persistente pós-menopausa para investigação de lesões endometriais.',
        'Alterações volumétricas de útero (miomas gigantes) ou anexos (cistos ovarianos complexos).'
      ],
      diseaseIds: ['vaginoses', 'dip', 'corrimento_uretral', 'endometriose', 'miomatose_uterina', 'sindrome_ovario_policistico', 'cancer_colo_utero']
    },
    {
      id: 'otorrino',
      name: 'Otorrinolaringologia',
      icon: Eye,
      description: 'Manejo de otites e sinusites recorrentes ou complicadas, amigdalites crônicas, faringites graves e labirintopatias refratárias.',
      color: 'sky',
      bgLight: 'bg-sky-500/[0.03] dark:bg-sky-950/[0.03]',
      borderClass: 'border-sky-500/15 dark:border-sky-900/20',
      textClass: 'text-sky-600 dark:text-sky-400',
      referralCriteria: [
        'Otite Média Aguda recorrente (> 3 episódios in 6 meses) com suspeita de perda auditiva secundária.',
        'Sinusite aguda recorrente ou crônica persistente (> 12 semanas) para avaliação de tomografia e cirurgia funcional.',
        'Amigdalite recorrente com indicação de amigdalectomia eletiva por múltiplos episódios bacterianos anuais.',
        'Vertigens de difícil diagnóstico, zumbido incapacitante ou disacusia neurossensorial de início rápido.',
        'Trismo com desvio de úvula (suspeita de abscesso periamigdaliano) - encaminhar imediatamente à emergência.'
      ],
      diseaseIds: ['oma', 'sinusite', 'amigdalite', 'faringite-strep', 'abscesso_periamigdaliano', 'perda_auditiva', 'rinite_alergica_refrataria', 'zumbido', 'disfonia_cronica']
    },
    {
      id: 'oftalmo',
      name: 'Oftalmologia',
      icon: Eye,
      description: 'Diagnóstico e acompanhamento de erros refrativos complexos, glaucoma, catarata, retinopatia diabética e outras doenças oculares.',
      color: 'teal',
      bgLight: 'bg-teal-500/[0.03] dark:bg-teal-950/[0.03]',
      borderClass: 'border-teal-500/15 dark:border-teal-900/20',
      textClass: 'text-teal-600 dark:text-teal-400',
      referralCriteria: [
        'Presença de pressão intraocular (PIO) elevada ou suspeita de Glaucoma.',
        'Perda progressiva da acuidade visual com opacificação do cristalino compatível com Catarata.',
        'Paciente diabético para rastreio e acompanhamento de Retinopatia Diabética.',
        'Olho seco grave ou conjuntivite alérgica refratária a colírios lubrificantes/anti-histamínicos básicos.'
      ],
      diseaseIds: ['glaucoma', 'catarata', 'conjuntivite_alergica', 'retinopatia_diabetica', 'olho_seco']
    },
    {
      id: 'orto',
      name: 'Ortopedia',
      icon: Activity,
      description: 'Tratamento cirúrgico e conservador de fraturas, tendinopatias crônicas refratárias, síndromes compressivas e afecções osteomusculares.',
      color: 'cyan',
      bgLight: 'bg-cyan-500/[0.03] dark:bg-cyan-950/[0.03]',
      borderClass: 'border-cyan-500/15 dark:border-cyan-900/20',
      textClass: 'text-cyan-600 dark:text-cyan-400',
      referralCriteria: [
        'Tendinite ou tendinopatia de ombro refratária a tratamento fisioterápico e medicamentoso por mais de 3 meses.',
        'Suspeita clínica de Síndrome do Túnel do Carpo com parestesia em território do mediano e teste de Phalen positivo.',
        'Dor plantar incapacitante (Fascite plantar) persistente por mais de 3-6 meses com esporão de calcâneo associado.'
      ],
      diseaseIds: ['tendinite_ombro', 'tunel_carpo', 'fascite_plantar']
    },
    {
      id: 'geriatria',
      name: 'Geriatria',
      icon: UserCheck,
      description: 'Manejo de idosos frágeis, síndromes geriátricas (quedas, demências, sarcopenia) e polifarmácia complexa.',
      color: 'amber',
      bgLight: 'bg-amber-500/[0.03] dark:bg-amber-950/[0.03]',
      borderClass: 'border-amber-500/15 dark:border-amber-900/20',
      textClass: 'text-amber-600 dark:text-amber-400',
      referralCriteria: [
        'Idoso com declínio cognitivo progressivo compatível com Demência de Alzheimer ou demência mista.',
        'Histórico de duas ou mais quedas recorrentes no último ano com instabilidade postural a esclarecer.',
        'Sarcopenia grave com perda de massa muscular e redução severa da velocidade de marcha em idosos.'
      ],
      diseaseIds: ['demencia_alzheimer', 'demencia_vascular', 'sarcopenia', 'quedas_recorrentes']
    },
    {
      id: 'pediatria',
      name: 'Pediatria & Alergologia Infantil',
      icon: Sparkles,
      description: 'Manejo de doenças respiratórias crônicas da infância, dermatite atópica severa e distúrbios de comportamento/desenvolvimento infantil.',
      color: 'purple',
      bgLight: 'bg-purple-500/[0.03] dark:bg-purple-950/[0.03]',
      borderClass: 'border-purple-500/15 dark:border-purple-900/20',
      textClass: 'text-purple-600 dark:text-purple-400',
      referralCriteria: [
        'Criança com Asma Infantil persistente e exacerbações frequentes a despeito de corticoide inalatório otimizado.',
        'Dermatite atópica infantil severa com lesões liquenificadas extensas e infecções bacterianas secundárias.',
        'Otite Média Aguda de repetição em idade escolar com suspeita de perda auditiva secundária.',
        'Suspeita ou diagnóstico de TDAH Infantil ou transtornos de aprendizagem com prejuízo escolar importante.'
      ],
      diseaseIds: ['asma_infantil', 'dermatite_atopica', 'otite_media_recorrente', 'tdah_infantil']
    },
    {
      id: 'urgencia',
      name: 'Urgências, Trauma & Suporte Crítico',
      icon: ShieldAlert,
      description: 'Protocolos críticos de emergências clínicas, acidentes, intoxicações e traumatismos. Encaminhamento imediato para UPA/PS.',
      color: 'rose',
      bgLight: 'bg-rose-500/[0.05] dark:bg-rose-950/[0.05]',
      borderClass: 'border-rose-500/30 dark:border-rose-900/40',
      textClass: 'text-rose-600 dark:text-rose-400',
      referralCriteria: [
        'Sinais inequívocos de Choque Circulatório (hipotensão severa, perfusão lenta, rebaixamento de nível de consciência).',
        'Acidentes por animais peçonhentos (cobras, escorpiões, aranhas) com sinais de envenenamento sistêmico.',
        'Intoxicações exógenas agudas graves (químicos, medicamentos) com comprometimento ventilatório ou hemodinâmico.',
        'Traumatismo Cranioencefálico com perda de consciência, amnésia lacunar ou rebaixamento na escala de Glasgow.',
        'Desnutrição infantil severa com sinais de choque séptico ou hipovolêmico de urgência extrema.'
      ],
      diseaseIds: ['apendicite', 'anafilaxia', 'choque', 'sdra', 'intoxicacao_aguda', 'peconhentos', 'tce_urgente', 'desnutricao_choque']
    }
  ], []);

  // Helper to dynamically get all diseases mapped to a specialty
  const getDiseasesForSpecialty = useCallback((specId: string) => {
    const specDef = SPECIALTIES.find(s => s.id === specId);
    if (!specDef) return [];
    
    return UBS_CATALOG_DISEASES.filter(d => {
      // Core list matches
      if (specDef.diseaseIds.includes(d.id)) return true;
      
      // Dynamic matches for extra seeds
      const isExtra = d.id.includes('_') || d.interactiveType;
      if (!isExtra) return false;
      
      const cat = d.category;
      
      if (specId === 'cardio' && cat === 'Cardiovascular/Crônicas') return true;
      if (specId === 'endocrino' && cat === 'Metabólicas/Endócrinas' && ![
        'nefropatia_iga_estavel', 'glomerulonefrite_membranosa', 'rins_policisticos_autossomicos', 'nefrite_lupica_remissao',
        'acidose_tubular_renal_cronica', 'diabetes_insipidus_nefrogenico', 'incontinencia_urinaria_esforco', 'bexiga_hiperativa_neurogenica',
        'estenose_uretra_masculina', 'hidronefrose_congenita_estavel', 'refluxo_vesicoureteral_grau_ii', 'litiase_vesical_cronica',
        'orquiepididimite_subaguda', 'varicocele_grau_ii_dor', 'esclerose_mesangial_difusa', 'sindrome_nefrotica_lesao_minima'
      ].includes(d.id)) return true;
      if (specId === 'pneumo' && cat === 'Respiratório') return true;
      if (specId === 'gastro' && cat === 'Gastrointestinal') return true;
      if (specId === 'neuro' && cat === 'Neurológico & Mental') return true;
      if (specId === 'reuma' && cat === 'Musculoesquelético & Membros' && [
        'espondilite_anquilosante_axial', 'fibromialgia_refrataria', 'sindrome_sjogren_sicca', 'polimialgia_reumatica_corticoterapia',
        'artrite_psoriasica_axial', 'esclerose_sistemica_cutanea_limitada', 'esclerodermia_linear', 'artropatia_jaeccoud',
        'sindrome_anticorpo_antifosfolipideo', 'amiloidose_reumatologica', 'osteonecrose_faj', 'artropatia_hemofilica_cronica',
        'doenca_paget_ossea', 'policondrite_recidivante', 'sindrome_reiter_reativa', 'sindrome_marfan_reumatologia'
      ].includes(d.id)) return true;
      if (specId === 'nefro-uro' && cat === 'Metabólicas/Endócrinas' && [
        'nefropatia_iga_estavel', 'glomerulonefrite_membranosa', 'rins_policisticos_autossomicos', 'nefrite_lupica_remissao',
        'acidose_tubular_renal_cronica', 'diabetes_insipidus_nefrogenico', 'incontinencia_urinaria_esforco', 'bexiga_hiperativa_neurogenica',
        'estenose_uretra_masculina', 'hidronefrose_congenita_estavel', 'refluxo_vesicoureteral_grau_ii', 'litiase_vesical_cronica',
        'orquiepididimite_subaguda', 'varicocele_grau_ii_dor', 'esclerose_mesangial_difusa', 'sindrome_nefrotica_lesao_minima'
      ].includes(d.id)) return true;
      if (specId === 'orto' && cat === 'Musculoesquelético & Membros' && ![
        'espondilite_anquilosante_axial', 'fibromialgia_refrataria', 'sindrome_sjogren_sicca', 'polimialgia_reumatica_corticoterapia',
        'artrite_psoriasica_axial', 'esclerose_sistemica_cutanea_limitada', 'esclerodermia_linear', 'artropatia_jaeccoud',
        'sindrome_anticorpo_antifosfolipideo', 'amiloidose_reumatologica', 'osteonecrose_faj', 'artropatia_hemofilica_cronica',
        'doenca_paget_ossea', 'policondrite_recidivante', 'sindrome_reiter_reativa', 'sindrome_marfan_reumatologia'
      ].includes(d.id)) return true;
      if (specId === 'dermato' && cat === 'Pele & Dermatologia') return true;
      if (specId === 'mental' && cat === 'Saúde Mental') return true;
      if (specId === 'infecto' && cat === 'Infecciosas/Endemias') return true;
      if (specId === 'geriatria' && cat === 'Geriatria') return true;
      if (specId === 'pediatria' && cat === 'Pediatria') return true;
      
      if (specId === 'gineco' && cat === 'Outros' && [
        'endometriose_pelvica_estavel', 'miomatose_uterina_sintomatica', 'sindrome_ovarios_policisticos_sop', 'cancer_colo_utero_seguimento',
        'mastopatia_fibrocistica_dor', 'cisto_ovariano_simples_unilateral', 'adenomiose_uterina', 'menopausa_precoce_hormonoterapia',
        'hiperprolactinemia_funcional', 'insuficiencia_istmo_cervical', 'dor_pelvica_cronica_ginecologica', 'leucoplasia_vulvar_benigna',
        'polipo_endometrial_baixo_risco', 'prolapso_uterino_estagio_i', 'hiperplasia_endometrial_sem_atipia', 'vaginose_citolitica'
      ].includes(d.id)) return true;
      
      if (specId === 'otorrino' && cat === 'Outros' && [
        'perda_auditiva_induzida_ruido', 'rinite_alergica_sazonal', 'zumbido_subjetivo_incapacitante', 'disfonia_cronica_funcional',
        'otite_externa_eczematosa', 'disfuncao_trompa_eustaquio', 'doenca_meniere_estavel', 'labirintopatia_metabolica',
        'faringolaringite_refluxo', 'polipose_nasossinusal_estavel', 'desvio_septo_nasal_obstrutivo', 'hipertrofia_cornetos_nasais',
        'laringite_cronica_irritativa', 'cerumen_impactado_recorrente', 'rolha_epidermica_conduto', 'presbiacusia_neurossensorial'
      ].includes(d.id)) return true;
      
      if (specId === 'oftalmo' && cat === 'Outros' && [
        'glaucoma_angulo_aberto', 'catarata_senil_incipiente', 'conjuntivite_alergica_sazonal', 'retinopatia_diabetica_nao_proliferativa',
        'olho_seco_evaporativo', 'degeneracao_macular_seca', 'pterigio_grau_ii_irritacao', 'blefarite_seborreica_palpebral',
        'calazio_palpebral_cronico', 'ceratocone_estavel', 'neuropatia_optica_isquemica_ant', 'uveite_anterior_estavel',
        'coriorretinite_toxoplasmose_cicatriz', 'estrabismo_convergente_adulto', 'ectropio_senil_palpebral', 'epiesclerite_nodular_benigna'
      ].includes(d.id)) return true;
      
      if (specId === 'urgencia' && cat === 'Outros' && [
        'apendicite_aguda_diagnostico', 'anafilaxia_alergica_aguda', 'choque_distributivo_sepse', 'sdra_pulmonar_sequela',
        'intoxicacao_aguda_sintomatico', 'acidente_peconhento_ofidico', 'tce_urgente_observacao', 'desnutricao_grave_choque_estavel',
        'hipertensao_intracraniana_benigna', 'sindrome_raynaud_secundaria', 'insuficiencia_hepatica_cronica_estavel', 'amiloidose_sistemica_estavel',
        'fibrose_cistica_adulta_seguimento', 'hemoglobinuria_paroxistica_noturna', 'sarcoidose_cutanea_estavel', 'sindrome_sjogren_secundario'
      ].includes(d.id)) return true;
      
      return false;
    });
  }, [SPECIALTIES]);

  // Filter diseases based on active specialty and search term
  const activeSpecialtyDef = SPECIALTIES.find(s => s.id === selectedSpecialty);

  const matchedDiseases = useMemo(() => {
    // If there is a search term, search globally across ALL diseases
    let sourceDiseases = UBS_CATALOG_DISEASES;
    
    if (!searchTerm) {
      if (!activeSpecialtyDef) return [];
      sourceDiseases = getDiseasesForSpecialty(activeSpecialtyDef.id);
    }

    return sourceDiseases.filter(disease => {
      const matchText = `${disease.name} ${disease.category} ${disease.diagnostic} ${disease.alarm}`.toLowerCase();
      return matchText.includes(searchTerm.toLowerCase());
    });
  }, [selectedSpecialty, searchTerm, activeSpecialtyDef, getDiseasesForSpecialty]);

  const toggleExpand = (id: string) => {
    setExpandedDiseaseId(expandedDiseaseId === id ? null : id);
  };

  return (
    <div className="space-y-8" id="ambulatorio-module">
      {/* Upper Navigation and Search Bar */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-[32px] border border-slate-200 dark:border-slate-800 shadow-sm flex flex-col md:flex-row gap-4 items-center justify-between">
        <div className="space-y-1 w-full md:w-auto">
          <h2 className="text-xl font-black text-slate-800 dark:text-white tracking-tight">Especialidades Ambulatoriais</h2>
          <p className="text-xs text-slate-500 dark:text-slate-400 font-bold">Encaminhamentos regulados, critérios de referência e condutas na Atenção Secundária.</p>
        </div>
        <div className="relative w-full md:w-96">
          <Search size={18} className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" />
          <input 
            type="text" 
            placeholder="Buscar doença em ambulatório..." 
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            className="w-full bg-slate-50 dark:bg-slate-950/40 border border-slate-200 dark:border-slate-800 rounded-2xl pl-11 pr-4 py-3 text-sm font-bold text-slate-800 dark:text-white placeholder-slate-400 focus:outline-none focus:border-medical-primary transition-all shadow-inner"
          />
          {searchTerm && (
            <button 
              onClick={() => setSearchTerm('')} 
              className="absolute right-4 top-1/2 -translate-y-1/2 text-xs font-black text-slate-400 hover:text-slate-600 dark:hover:text-slate-200 uppercase"
            >
              Limpar
            </button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        {/* Left Column: Specialty Sidebar */}
        <div className="lg:col-span-4 space-y-3">
          <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider px-2">Subdivisões Especializadas</span>
          <div className="space-y-2 max-h-[600px] overflow-y-auto pr-1 custom-scrollbar">
            {SPECIALTIES.map((spec) => {
              const Icon = spec.icon;
              const isActive = selectedSpecialty === spec.id && !searchTerm;
              return (
                <button
                  key={spec.id}
                  onClick={() => {
                    setSelectedSpecialty(spec.id);
                    setSearchTerm(''); // Clear global search when selecting specialty
                    setExpandedDiseaseId(null);
                  }}
                  className={`w-full text-left p-4 rounded-2xl transition-all border flex items-center gap-3.5 group relative overflow-hidden ${
                    isActive 
                      ? 'bg-white dark:bg-slate-900 shadow-md border-medical-primary text-slate-800 dark:text-white' 
                      : 'bg-white/60 dark:bg-slate-950/20 border-slate-200/60 dark:border-slate-800/40 hover:bg-white dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400'
                  }`}
                >
                  <div className={`p-2.5 rounded-xl transition-colors ${isActive ? 'bg-medical-primary text-white' : 'bg-slate-100 dark:bg-slate-800 group-hover:bg-slate-200 dark:group-hover:bg-slate-700'}`}>
                    <Icon size={18} strokeWidth={isActive ? 2.5 : 2} />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className={`text-sm font-extrabold tracking-tight ${isActive ? 'text-slate-800 dark:text-white' : 'text-slate-600 dark:text-slate-300'}`}>{spec.name}</p>
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-widest truncate">{getDiseasesForSpecialty(spec.id).length} Doenças Cadastradas</p>
                  </div>
                  <ChevronRight size={14} className={`text-slate-400 transition-transform ${isActive ? 'rotate-90 text-medical-primary' : ''}`} />
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Column: Criteria and Disease List */}
        <div className="lg:col-span-8 space-y-6">
          {!searchTerm && activeSpecialtyDef && (
            <motion.div 
              key={activeSpecialtyDef.id}
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              className={`p-6 bg-white dark:bg-slate-900 border ${activeSpecialtyDef.borderClass} rounded-[32px] space-y-4 shadow-sm`}
            >
              <div className="flex items-start gap-4">
                <div className={`p-3 rounded-2xl bg-medical-primary/10 ${activeSpecialtyDef.textClass}`}>
                  {React.createElement(activeSpecialtyDef.icon, { size: 24 })}
                </div>
                <div className="space-y-1">
                  <h3 className="text-lg font-black text-slate-800 dark:text-white tracking-tight">Ambulatório de {activeSpecialtyDef.name}</h3>
                  <p className="text-xs text-slate-500 dark:text-slate-400 font-bold leading-relaxed">{activeSpecialtyDef.description}</p>
                </div>
              </div>

              <div className={`p-5 rounded-2xl ${activeSpecialtyDef.bgLight} border ${activeSpecialtyDef.borderClass} space-y-3`}>
                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-2">
                  <Info size={14} className={activeSpecialtyDef.textClass} />
                  Critérios para Encaminhamento ao Especialista (Atenção Secundária)
                </h4>
                <ul className="space-y-2">
                  {activeSpecialtyDef.referralCriteria.map((crit, idx) => (
                    <li key={idx} className="flex gap-2.5 items-start text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed">
                      <div className={`w-1.5 h-1.5 rounded-full mt-1.5 shrink-0 bg-medical-primary`} />
                      <span>{crit}</span>
                    </li>
                  ))}
                </ul>
              </div>
            </motion.div>
          )}

          <div className="space-y-3.5">
            <div className="flex justify-between items-center px-1">
              <span className="text-[10px] font-black uppercase text-slate-400 tracking-wider">
                {searchTerm ? `Resultados da busca: ${matchedDiseases.length} Doenças` : `Doenças Reguladas (${matchedDiseases.length})`}
              </span>
              {searchTerm && (
                <button onClick={() => setSearchTerm('')} className="text-[10px] font-black uppercase text-rose-500 hover:underline">
                  Ver todas por especialidade
                </button>
              )}
            </div>

            {matchedDiseases.length === 0 ? (
              <div className="bg-white dark:bg-slate-900 border border-dashed border-slate-200 dark:border-slate-800 p-12 rounded-[32px] text-center space-y-3">
                <AlertTriangle className="text-slate-400 mx-auto" size={32} />
                <h3 className="text-sm font-black text-slate-700 dark:text-slate-300">Nenhuma doença encontrada</h3>
                <p className="text-xs text-slate-400 font-bold max-w-md mx-auto">Tente buscar por termos médicos alternativos (ex: febre, asma, dor, icterícia, etc.) ou mude a especialidade ativa.</p>
              </div>
            ) : (
              <div className="space-y-3">
                {matchedDiseases.map((disease) => {
                  const isExpanded = expandedDiseaseId === disease.id;
                  const isEmergency = disease.alarm.toLowerCase().includes('urgência') || 
                                      disease.alarm.toLowerCase().includes('emergência') || 
                                      disease.alarm.toLowerCase().includes('imediato') ||
                                      disease.alarm.toLowerCase().includes('upa') ||
                                      disease.category.toLowerCase().includes('urgência') ||
                                      disease.category.toLowerCase().includes('emergência');

                  return (
                    <div 
                      key={disease.id}
                      className={`bg-white dark:bg-slate-900 border rounded-3xl transition-all duration-300 overflow-hidden shadow-sm ${
                        isExpanded 
                          ? 'border-medical-primary ring-1 ring-medical-primary' 
                          : 'border-slate-200 dark:border-slate-800 hover:border-slate-300 dark:hover:border-slate-700'
                      }`}
                    >
                      {/* Accordion Trigger Header */}
                      <button
                        onClick={() => toggleExpand(disease.id)}
                        className="w-full text-left p-5 flex items-start gap-4 justify-between"
                      >
                        <div className="space-y-1 flex-1 min-w-0">
                          <div className="flex items-center gap-2 flex-wrap">
                            <span className="text-sm font-extrabold text-slate-800 dark:text-white hover:text-medical-primary transition-colors tracking-tight">
                              {disease.name}
                            </span>
                            {isEmergency && (
                              <span className="text-[9px] font-black uppercase bg-rose-100 dark:bg-rose-950/50 text-rose-600 dark:text-rose-400 px-2 py-0.5 rounded-full tracking-wider animate-pulse flex items-center gap-1 shrink-0">
                                <AlertTriangle size={10} />
                                Urgência/PS
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{disease.category}</p>
                        </div>
                        <div className={`p-2 rounded-xl bg-slate-50 dark:bg-slate-950 text-slate-400 transition-transform ${isExpanded ? 'rotate-180 bg-medical-primary/10 text-medical-primary' : ''}`}>
                          <ChevronDown size={14} />
                        </div>
                      </button>

                      {/* Accordion Expanded Content */}
                      <AnimatePresence initial={false}>
                        {isExpanded && (
                          <motion.div
                            initial={{ height: 0 }}
                            animate={{ height: 'auto' }}
                            exit={{ height: 0 }}
                            transition={{ duration: 0.25 }}
                            className="border-t border-slate-100 dark:border-slate-800/60 bg-slate-50/40 dark:bg-slate-950/10"
                          >
                            <div className="p-6 space-y-6">
                              {/* Diagnostic Criteria */}
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <Info size={12} className="text-medical-primary" />
                                  Critérios Diagnósticos (UBS/Ambulatório)
                                </h4>
                                <p className="text-xs text-slate-700 dark:text-slate-300 font-bold leading-relaxed p-4 bg-slate-50 dark:bg-slate-950/40 border border-slate-200/50 dark:border-slate-800/40 rounded-2xl">
                                  {disease.diagnostic}
                                </p>
                              </div>

                              {/* Alarm Signs */}
                              <div className="space-y-2">
                                <h4 className="text-[10px] font-black uppercase text-rose-500 tracking-wider flex items-center gap-1.5">
                                  <AlertTriangle size={12} className="text-rose-500" />
                                  Sinais de Alarme & Encaminhamento Imediato
                                </h4>
                                <div className="p-4 bg-rose-500/[0.03] dark:bg-rose-950/[0.03] border border-rose-500/15 dark:border-rose-900/20 rounded-2xl flex gap-3">
                                  <ShieldAlert size={16} className="text-rose-500 shrink-0 mt-0.5" />
                                  <p className="text-xs text-rose-700 dark:text-rose-300 font-bold leading-relaxed">
                                    {disease.alarm}
                                  </p>
                                </div>
                              </div>

                              {/* Outpatient Management Steps */}
                              <div className="space-y-3">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <Pill size={12} className="text-medical-primary" />
                                  Manejo Clínico & Esquema Terapêutico
                                </h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                                  {disease.treatment.map((step, idx) => (
                                    <div 
                                      key={idx} 
                                      className="p-4.5 bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 rounded-2xl space-y-1.5 flex flex-col justify-between"
                                    >
                                      <div className="space-y-1">
                                        <div className="flex items-center gap-2">
                                          <div className="w-5 h-5 rounded-full bg-medical-primary/10 text-medical-primary text-[10px] font-black flex items-center justify-center">
                                            {idx + 1}
                                          </div>
                                          <span className="text-xs font-black text-slate-800 dark:text-white tracking-tight leading-none">
                                            {step.title}
                                          </span>
                                        </div>
                                        <p className="text-xs text-slate-500 dark:text-slate-400 font-medium leading-relaxed">
                                          {step.desc}
                                        </p>
                                      </div>
                                    </div>
                                  ))}
                                </div>
                              </div>

                              {/* Path of Care / System Reference */}
                              <div className="p-4 bg-medical-primary/[0.03] dark:bg-medical-primary/[0.02] border border-medical-primary/15 dark:border-medical-primary/20 rounded-2xl flex gap-3">
                                <ArrowUpRight className="text-medical-primary shrink-0 mt-0.5" size={16} />
                                <div className="space-y-0.5">
                                  <strong className="text-[10px] font-black uppercase text-medical-primary tracking-wider block">Fluxo de Referência Regulada</strong>
                                  <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                                    Conduza as investigações iniciais e institua o tratamento de primeira linha conforme detalhado acima. Em caso de refratariedade clínica, reações adversas persistentes ou indicação de {activeSpecialtyDef?.name || 'especialidade'}, encaminhe via SISREG anexando cópia deste protocolo com as justificativas e exames realizados.
                                  </p>
                                </div>
                              </div>
                            </div>
                          </motion.div>
                        )}
                      </AnimatePresence>
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
