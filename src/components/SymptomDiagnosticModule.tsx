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

interface SymptomOrSign {
  id: string;
  name: string;
  category: string;
  type: 'symptom' | 'sign';
}

const SYMPTOMS_AND_SIGNS: SymptomOrSign[] = [
  // ================= GENERAL / SYSTEMIC =================
  { id: 'febre', name: 'Febre referida (sensação febril ou aferida)', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'fadiga', name: 'Astenia / Fadiga crônica ou fraqueza severa', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'perda_peso', name: 'Perda de peso involuntária e progressiva', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'ganho_peso', name: 'Ganho de peso rápido (em dias/semanas)', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'sudorese_noturna', name: 'Sudorese noturna profusa (molha a roupa)', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'sede_excessiva', name: 'Polidipsia (sede excessiva) e poliúria', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'picada_animal', name: 'Histórico de picada ou contato de animal peçonhento', category: 'Geral / Sistêmico', type: 'symptom' },
  { id: 'ictericia', name: 'Icterícia clínica (escleral ou cutânea)', category: 'Geral / Sistêmico', type: 'sign' },
  { id: 'palidez', name: 'Palidez cutâneo-mucosa severa (sinal de anemia)', category: 'Geral / Sistêmico', type: 'sign' },
  { id: 'desidratacao_sinal', name: 'Turgor cutâneo diminuído / Pregueamento lento (Desidratação)', category: 'Geral / Sistêmico', type: 'sign' },
  { id: 'cyanose', name: 'Cianose periférica ou central (labial/extremidades)', category: 'Geral / Sistêmico', type: 'sign' },
  { id: 'sinal_provado_laco', name: 'Prova do Laço positiva (fratilidade capilar)', category: 'Geral / Sistêmico', type: 'sign' },

  // ================= CARDIORRESPIRATORY =================
  { id: 'dor_peito', name: 'Dor ou aperto no peito (Dor Torácica)', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'dispneia', name: 'Falta de ar / Cansaço respiratório (Dispneia)', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'tosse', name: 'Tosse persistente (seca ou produtiva)', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'chiado_peito', name: 'Chiado no peito referido', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'palpitacao', name: 'Batedeira / Coração acelerado (Palpitação)', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'ortopneia', name: 'Dispneia paroxística noturna ou ortopneia (ar melhora ao sentar)', category: 'Cardiorrespiratório', type: 'symptom' },
  { id: 'taquipneia', name: 'Taquipneia (frequência respiratória > 20 irpm)', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'estertores_crepitantes', name: 'Estertores crepitantes à ausculta pulmonar', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'sibilos_difusos', name: 'Sibilos expiratórios difusos à ausculta pulmonar', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'murmurio_diminuido', name: 'Murmúrio vesicular diminuído (unilateral ou global)', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'tiragem_intercostal', name: 'Tiragem intercostal / Uso de musculatura acessória', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'sopro_cardiaco', name: 'Sopro cardíaco (sistólico ou diastólico)', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'turgencia_jugular', name: 'Turgência jugular patológica a 45 graus', category: 'Cardiorrespiratório', type: 'sign' },
  { id: 'bulhas_hipofoneticas', name: 'Bulhas cardíacas abafadas ou hipofonéticas', category: 'Cardiorrespiratório', type: 'sign' },

  // ================= HEAD, NECK & ENT =================
  { id: 'dor_garganta', name: 'Dor de garganta / Odinofagia persistente', category: 'Cabeça, Pescoço & Otorrino', type: 'symptom' },
  { id: 'sintomas_gripais', name: 'Obstrução nasal, coriza clara/purulenta ou espirros', category: 'Cabeça, Pescoço & Otorrino', type: 'symptom' },
  { id: 'exsudato_amigdaliano', name: 'Presença de exsudato purulento / placas nas amígdalas', category: 'Cabeça, Pescoço & Otorrino', type: 'sign' },
  { id: 'hiperemia_faringe', name: 'Hiperemia e edema de pilares amigdalianos ou orofaringe', category: 'Cabeça, Pescoço & Otorrino', type: 'sign' },
  { id: 'bocio_palpavel', name: 'Aumento palpável da glândula tireoide (Bócio)', category: 'Cabeça, Pescoço & Otorrino', type: 'sign' },
  { id: 'adenopatia_cervical', name: 'Linfadenopatias palpáveis e dolorosas no pescoço', category: 'Cabeça, Pescoço & Otorrino', type: 'sign' },

  // ================= GASTROINTESTINAL & ABDOMEN =================
  { id: 'dor_abdominal', name: 'Dor na barriga (Dor abdominal difusa)', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'dor_abdominal_fid', name: 'Dor localizada na Fossa Ilíaca Direita (FID)', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'dor_abdominal_hd', name: 'Dor localizada no Hipocôndrio Direito (HD)', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'azia_queimacao', name: 'Azia, refluxo ácido ou pirose retroesternal', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'nausea_vomito', name: 'Náuseas ou Vômitos frequentes', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'diarreia', name: 'Diarreia aguda (líquida ou pastosa)', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'constipacao', name: 'Constipação intestinal persistente', category: 'Gastrointestinal & Abdômen', type: 'symptom' },
  { id: 'sinal_blumberg', name: 'Sinal de Blumberg positivo (dor forte à descompressão em FID)', category: 'Gastrointestinal & Abdômen', type: 'sign' },
  { id: 'sinal_murphy', name: 'Sinal de Murphy positivo (interrupção inspiratória na palpação biliar)', category: 'Gastrointestinal & Abdômen', type: 'sign' },
  { id: 'abdomen_tabua', name: 'Defesa muscular involuntária / Abdômen em tábua (Peritonite)', category: 'Gastrointestinal & Abdômen', type: 'sign' },
  { id: 'rha_ausentes', name: 'Ruídos hidroaéreos diminuídos ou totalmente ausentes', category: 'Gastrointestinal & Abdômen', type: 'sign' },

  // ================= GENITOURINARY & GYNECOLOGICAL =================
  { id: 'dor_urinar', name: 'Disúria / Ardência ou dor ao urinar', category: 'Geniturinário & Ginecológico', type: 'symptom' },
  { id: 'secura_vaginal', name: 'Secura vaginal, prurido ou fogachos intensos', category: 'Geniturinário & Ginecológico', type: 'symptom' },
  { id: 'corrimento_vaginal', name: 'Corrimento vaginal anormal (grumoso, amarelado ou fétido)', category: 'Geniturinário & Ginecológico', type: 'symptom' },
  { id: 'corrimento_uretral', name: 'Corrimento uretral masculino purulento', category: 'Geniturinário & Ginecológico', type: 'symptom' },
  { id: 'sinal_giordano', name: 'Sinal de Giordano positivo (dor aguda à punho-percussão lombar)', category: 'Geniturinário & Ginecológico', type: 'sign' },

  // ================= NEUROLOGICAL & MENTAL =================
  { id: 'cefaleia', name: 'Dor de cabeça intensa (Cefaleia de início recente ou crônica)', category: 'Neurológico & Mental', type: 'symptom' },
  { id: 'tontura', name: 'Tontura, vertigem rotatória ou perda de equilíbrio', category: 'Neurológico & Mental', type: 'symptom' },
  { id: 'insonia', name: 'Insônia persistente ou sono fragmentado', category: 'Neurológico & Mental', type: 'symptom' },
  { id: 'ansiedade_nervosismo', name: 'Ansiedade crônica, nervosismo ou irritabilidade', category: 'Neurológico & Mental', type: 'symptom' },
  { id: 'tristeza', name: 'Humor deprimido, anedonia ou apatia profunda', category: 'Neurológico & Mental', type: 'symptom' },
  { id: 'rigidez_nuca', name: 'Rigidez de nuca (resistência passiva à flexão cervical)', category: 'Neurológico & Mental', type: 'sign' },
  { id: 'desvio_rima', name: 'Desvio de rima facial / Paralisia facial unilateral', category: 'Neurológico & Mental', type: 'sign' },
  { id: 'deficit_motor', name: 'Déficit motor focal agudo (fraqueza súbita em braço/perna)', category: 'Neurológico & Mental', type: 'sign' },
  { id: 'disartria', name: 'Disartria / Afasia (fala enrolada, incompreensível ou arrastada)', category: 'Neurológico & Mental', type: 'sign' },
  { id: 'pupilas_anisocoricas', name: 'Anisocoria pupilar (pupilas com diâmetros assimétricos)', category: 'Neurológico & Mental', type: 'sign' },
  { id: 'sinal_babinski', name: 'Sinal de Babinski positivo (reflexo plantar extensor)', category: 'Neurológico & Mental', type: 'sign' },

  // ================= MUSCULOSKELETAL & EXTREMITIES =================
  { id: 'dor_articulacoes', name: 'Dor, calor ou rigidez matinal nas articulações (Artralgia)', category: 'Musculoesquelético & Membros', type: 'symptom' },
  { id: 'dor_lombar', name: 'Dor lombar isolada sem irradiação (Lombalgia comum)', category: 'Musculoesquelético & Membros', type: 'symptom' },
  { id: 'dor_panturrilha', name: 'Dor unilateral espontânea na panturrilha', category: 'Musculoesquelético & Membros', type: 'symptom' },
  { id: 'edema_mmii_bilateral', name: 'Edema bilateral de membros inferiores (cacifo positivo)', category: 'Musculoesquelético & Membros', type: 'sign' },
  { id: 'edema_panturrilha_unilateral', name: 'Edema e empastamento de panturrilha unilateral', category: 'Musculoesquelético & Membros', type: 'sign' },
  { id: 'sinal_homans', name: 'Sinal de Homans positivo (dor na panturrilha à dorsiflexão do pé)', category: 'Musculoesquelético & Membros', type: 'sign' },
  { id: 'pulso_assimetrico', name: 'Ausência ou assimetria acentuada de pulsos periféricos', category: 'Musculoesquelético & Membros', type: 'sign' },
  { id: 'tec_prolongado', name: 'Tempo de enchimento capilar (TEC) prolongado (> 2 segundos)', category: 'Musculoesquelético & Membros', type: 'sign' },

  // ================= SKIN & DERMATOLOGICAL =================
  { id: 'coceira', name: 'Prurido cutâneo intenso (coceira difusa ou localizada)', category: 'Pele & Dermatologia', type: 'symptom' },
  { id: 'manchas_vermelhas', name: 'Manchas vermelhas / Exantema máculo-papular difuso', category: 'Pele & Dermatologia', type: 'symptom' },
  { id: 'lesoes_herpeticas', name: 'Vesículas agrupadas sobre base eritematosa unilateral (Zoster)', category: 'Pele & Dermatologia', type: 'sign' }
];

type DurationType = 'hyperacute' | 'acute' | 'subacute' | 'chronic';

interface EvidenceMarker {
  finding: string;
  metric: string; // "Sensibilidade" | "Especificidade" | "LR+" | "LR-"
  value: string;
  ref: string;
}

interface DiseaseSymptomProfile {
  diseaseId: string;
  symptoms: Record<string, number>; // weight 1 to 5
  durations: DurationType[];
  setting: 'ubs' | 'ps' | 'ambos';
  whyExplanation: string;
  nextStepsExams: string;
  guideline: string;
  treatmentAllowed: 'immediate' | 'confirmation_needed' | 'immediate_critical';
  treatmentAllowedJustification: string;
  evidenceMarkers?: EvidenceMarker[];
}

const DISEASE_SYMPTOM_PROFILES: Record<string, DiseaseSymptomProfile> = {
  has: {
    diseaseId: 'has',
    symptoms: { cefaleia: 2, tontura: 2, palpitacao: 2, edema_mmii_bilateral: 2, pulso_assimetrico: 3 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'A cefaleia persistente com tontura e palpitações em picos pressóricos sugere hipertensão arterial primária. A assimetria de pulsos é sinal de alerta para coartação ou dissecção.',
    nextStepsExams: 'Realizar MRPA (Monitorização Residencial) por 5 dias ou MAPA de 24h. Solicitar Urina 1, Creatinina, Potássio, Glicemia, Perfil Lipídico e ECG de repouso.',
    guideline: 'Diretriz Brasileira de Hipertensão Arterial (SBC 2020)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'O tratamento definitivo com anti-hipertensivos requer confirmação por duas ou mais medições em consultas distintas, ou confirmação via MAPA/MRPA, exceto se PA ≥ 180/120 mmHg ou presença de lesão aguda de órgão-alvo. Evitar introdução intempestiva para não induzir hipotensão iatrogênica em pacientes com síndrome do jaleco branco.',
    evidenceMarkers: [
      { finding: 'Cefaleia isolada', metric: 'LR+ (Razão de Verossimilhança)', 'value': '1.1 (Baixo poder diagnóstico isoladamente)', ref: 'JAMA Evidence-Based Medicine' }
    ]
  },
  dm2: {
    diseaseId: 'dm2',
    symptoms: { sede_excessiva: 5, perda_peso: 3, fadiga: 2, desidratacao_sinal: 2 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'A tríade clássica de polidipsia (sede excessiva), poliúria, perda de peso inexplicada e fadiga indica descompensação glicêmica severa característica do Diabetes.',
    nextStepsExams: 'Solicitar Glicemia de Jejum, Hemoglobina Glicada (HbA1c) e Urina Tipo 1 (pesquisa de glicosúria/cetonúria).',
    guideline: 'Diretrizes da Sociedade Brasileira de Diabetes (SBD 2025)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'Exige confirmação laboratorial com duas glicemias de jejum ≥ 126 mg/dL ou HbA1c ≥ 6.5%. No entanto, se o paciente apresentar sintomas inequívocos de hiperglicemia clássica (poliúria, polidipsia) e glicemia casual ≥ 200 mg/dL, o tratamento e medidas de controle glicêmico podem ser iniciados imediatamente na primeira consulta.',
    evidenceMarkers: [
      { finding: 'Sintomas clássicos (4Ps)', metric: 'Especificidade', 'value': '93%', ref: 'SBD Guidelines 2025' }
    ]
  },
  drge: {
    diseaseId: 'drge',
    symptoms: { azia_queimacao: 5, dor_peito: 2, nausea_vomito: 1 },
    durations: ['subacute', 'chronic'],
    setting: 'ubs',
    whyExplanation: 'Pirose e queimação retroesternal (azia) que pioram em decúbito confirmam refluxo gastroesofágico típico.',
    nextStepsExams: 'Diagnóstico é essencialmente clínico. Solicitar Endoscopia Digestiva Alta (EDA) apenas se houver sinais de alarme.',
    guideline: 'Federação Brasileira de Gastroenterologia (FBG 2022)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'Na ausência de sinais de alarme (disfagia, sangramento, perda de peso involuntária, idade > 50 anos), as diretrizes autorizam o teste terapêutico empírico inicial com IBP (Omeprazol) por 4 a 8 semanas, funcionando como diagnóstico presuntivo e tratamento de alívio sintomático.',
    evidenceMarkers: [
      { finding: 'Pirose + Regurgitação ácida', metric: 'Especificidade', 'value': '89%', ref: 'American Journal of Gastroenterology' }
    ]
  },
  hipo: {
    diseaseId: 'hipo',
    symptoms: { fadiga: 4, ganho_peso: 3, constipacao: 3, bocio_palpavel: 3, edema_mmii_bilateral: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Fadiga crônica, ganho ponderal, bócio palpável, mixedema (edema que não deixa cacifo) e obstipação apontam para o hipotireoidismo.',
    nextStepsExams: 'Solicitar dosagem sérica de TSH e T4 Livre.',
    guideline: 'Sociedade Brasileira de Endocrinologia e Metabologia (SBEM 2021)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'É indispensável aguardar a confirmação de TSH elevado e T4 livre baixo por exame laboratorial. A dosagem excessiva de Levotiroxina sem indicação formal ou em doses incorretas pode induzir taquicardias, fibrilação atrial e angina severa, principalmente em idosos ou cardiopatas graves.',
    evidenceMarkers: [
      { finding: 'Fadiga isolada em mulheres', metric: 'Especificidade', 'value': '12% (Altamente inespecífico)', ref: 'Endocrine Reviews' }
    ]
  },
  asma: {
    diseaseId: 'asma',
    symptoms: { dispneia: 4, tosse: 3, chiado_peito: 4, sibilos_difusos: 5, tiragem_intercostal: 3, murmurio_diminuido: 2 },
    durations: ['acute', 'subacute', 'chronic'],
    setting: 'ambos',
    whyExplanation: 'A sibilância difusa bilateral e a limitação expiratória paroxística com episódios recorrentes são marcas patognomônicas da Asma.',
    nextStepsExams: 'Solicitar Espirometria com prova broncodilatadora para confirmar a variação do fluxo aéreo.',
    guideline: 'Diretrizes da SBPT (2023) / GINA 2024',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'Na presença de sintomas típicos, recorrentes e limitantes com sibilância à ausculta, o início imediato de Corticoide Inalatório de baixa dose é recomendado para prevenir crises graves e remodelamento brônquico, mesmo enquanto se aguarda o agendamento da Espirometria confirmatória.',
    evidenceMarkers: [
      { finding: 'Sibilos expiratórios difusos', metric: 'LR+ (Razão de Verossimilhança)', 'value': '2.6', ref: 'Bates Physical Examination Guide' }
    ]
  },
  dpoc: {
    diseaseId: 'dpoc',
    symptoms: { dispneia: 5, tosse: 4, murmurio_diminuido: 4, sibilos_difusos: 3, taquipneia: 3 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Dispneia progressiva de esforço, tosse crônica produtiva e murmúrio vesicular diminuído em paciente tabagista crônico sugerem DPOC.',
    nextStepsExams: 'Solicitar Espirometria pré e pós-broncodilatadora (critério: VEF1/CVF < 0.70 pós-BD) e Radiografia de Tórax.',
    guideline: 'Global Initiative for Chronic Obstructive Lung Disease (GOLD 2026)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'Requer confirmação formal por Espirometria pós-broncodilatadora demonstrando relação VEF1/CVF < 0.70. O uso de broncodilatadores de longa duração (LAMA/LABA) deve ser baseado nesta confirmação, embora broncodilatadores de curta ação possam ser usados para resgate sintomático imediato.',
    evidenceMarkers: [
      { finding: 'História de tabagismo + MV diminuído', metric: 'LR+', 'value': '5.2', ref: 'GOLD Guidelines' }
    ]
  },
  itu: {
    diseaseId: 'itu',
    symptoms: { dor_urinar: 5, dor_abdominal: 2 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Disúria, polaciúria e urgência miccional aguda em mulher jovem sem corrimento vaginal sugerem fortemente cistite aguda simples.',
    nextStepsExams: 'Nenhum exame inicial necessário em cistite simples de mulher jovem. Urocultura recomendada se grávida, idosa, homem ou recorrência.',
    guideline: 'Diretriz de Infecção Urinária da FEBRASGO (2023)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'Em mulheres jovens, hígidas e não gestantes com queixas clássicas (disúria, urgência e polaciúria) sem corrimento vaginal ou sintomas sistêmicos, o tratamento antibiótico empírico (Fosfomicina ou Nitrofurantoína) está amplamente autorizado e recomendado de imediato, dispensando Urina 1 ou Urocultura prévios.',
    evidenceMarkers: [
      { finding: 'Disúria + Polaciúria sem corrimento', metric: 'LR+ (Razão de Verossimilhança)', 'value': '24.6 (Altamente preditivo)', ref: 'JAMA Rational Clinical Exam' }
    ]
  },
  sinusite: {
    diseaseId: 'sinusite',
    symptoms: { cefaleia: 4, febre: 2, tosse: 2, sintomas_gripais: 5 },
    durations: ['acute', 'subacute'],
    setting: 'ubs',
    whyExplanation: 'Cefaleia pressórica frontal, obstrução nasal crônica e tosse que piora em decúbito apontam para rinossinusite aguda.',
    nextStepsExams: 'Diagnóstico é clínico. Tomografia de seios da face recomendada apenas se houver suspeita de complicação orbitária ou intracraniana.',
    guideline: 'Associação Brasileira de Otorrinolaringologia (ABORL 2022)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'O tratamento dos sintomas obstrutivos e álgicos com lavagem nasal e sintomáticos é imediato. No entanto, o início de antibióticos via oral (Amoxicilina) deve ser restrito aos casos com forte suspeita bacteriana (febre persistente > 3 dias, dor facial intensa unilateral severa ou piora clínica secundária / double-sickening).',
    evidenceMarkers: [
      { finding: 'Secreção purulenta nasal unilateral', metric: 'Especificidade', 'value': '85%', ref: 'Bates Physical Examination Guide' }
    ]
  },
  amigdalite: {
    diseaseId: 'amigdalite',
    symptoms: { febre: 4, dor_garganta: 5, cefaleia: 2, exsudato_amigdaliano: 5, hiperemia_faringe: 4, adenopatia_cervical: 3 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Odinofagia intensa súbita, exsudato amigdaliano cinza-esbranquiçado e adenopatia submandibular dolorosa apontam para amigdalite bacteriana.',
    nextStepsExams: 'Avaliação clínica direta da orofaringe aplicando o Escore de Centor modificado. Swab rápido se disponível no SUS.',
    guideline: 'Diretrizes do Ministério da Saúde / Sociedade Brasileira de Pediatria (2023)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'O início do tratamento antimicrobiano empírico com Penicilina Benzatina ou Amoxicilina é autorizado imediatamente se o paciente preencher alta pontuação na escala de Centor (presença de febre, exsudato amigdaliano, adenopatia cervical dolorosa e ausência de tosse), para prevenir sequelas graves como a febre reumática.',
    evidenceMarkers: [
      { finding: 'Presença de exsudato + adenopatia', metric: 'LR+ (Escore de Centor)', 'value': '3.2 (Moderada correlação)', ref: 'BMJ Evidence Reviews' }
    ]
  },
  pac: {
    diseaseId: 'pac',
    symptoms: { febre: 4, tosse: 4, dispneia: 3, dor_peito: 3, estertores_crepitantes: 5, taquipneia: 4, murmurio_diminuido: 2, tiragem_intercostal: 2 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Febre alta, taquipneia, tosse produtiva e estertores crepitantes localizados em um hemitórax indicam pneumonia lobar lobular.',
    nextStepsExams: 'Solicitar Radiografia de Tórax (PA e Perfil), Hemograma completo, Ureia (para cálculo do escore CURB-65) e Proteína C Reativa.',
    guideline: 'Diretriz de Pneumonia Adquirida na Comunidade da SBPT (2018)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'O início da antibioticoterapia empírica deve ocorrer na primeira hora após a suspeita clínica forte (tosse produtiva, febre alta, dispneia e estertores crepitantes), idealmente após a realização de uma Radiografia de Tórax rápida. Atrasos superiores a 4-6 horas no início do antibiótico elevam drasticamente a mortalidade do paciente.',
    evidenceMarkers: [
      { finding: 'Estertores crepitantes localizados', metric: 'LR+', 'value': '3.5', ref: 'JAMA Rational Clinical Exam' }
    ]
  },
  anemia: {
    diseaseId: 'anemia',
    symptoms: { fadiga: 5, tontura: 3, palpitacao: 2, palidez: 5, tec_prolongado: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Astenia crônica severa associada a palidez palmar e conjuntival reflete a diminuição do oxigênio carreado pelas hemácias.',
    nextStepsExams: 'Solicitar Hemograma Completo, Ferritina, Ferro sérico e Capacidade Total de Ligação do Ferro (TIBC).',
    guideline: 'Diretrizes da Sociedade Brasileira de Hematologia e Hemoterapia (SBHH 2021)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'Embora a palidez acentuada e a fadiga facilitem a suspeita, o início do Sulfato Ferroso exige confirmação por Hemograma completo e Ferritina sérica para descartar outras causas de anemia microcítica (como Talassemia minor ou Anemia de Doença Crônica), onde a reposição de ferro é contraindicada e pode induzir hemossiderose.',
    evidenceMarkers: [
      { finding: 'Palidez de conjuntiva ocular', metric: 'Especificidade', 'value': '96%', ref: 'JAMA Rational Clinical Exam' }
    ]
  },
  depressao: {
    diseaseId: 'depressao',
    symptoms: { tristeza: 5, fadiga: 3, insonia: 4 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Humor deprimido quase diário, anedonia importante e distúrbios de sono por mais de 2 semanas confirmam transtorno depressivo.',
    nextStepsExams: 'Aplicação estruturada do escore PHQ-9. Coletar TSH e Hemograma para afastar causas médicas secundárias.',
    guideline: 'Diretrizes de Saúde Mental da SBPS / DSM-5-TR',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'O diagnóstico é estritamente clínico apoiado em escores (como PHQ-9). Diante de sintomas depressivos moderados a graves durando ≥ 2 semanas com comprometimento funcional explícito, o tratamento farmacológico com ISRS (Sertralina ou Fluoxetina) deve ser iniciado de imediato na UBS associado a suporte psicossocial.',
    evidenceMarkers: [
      { finding: 'Escore PHQ-9 ≥ 10', metric: 'Sensibilidade', 'value': '88%', ref: 'Annals of Internal Medicine' }
    ]
  },
  ansiedade: {
    diseaseId: 'ansiedade',
    symptoms: { ansiedade_nervosismo: 5, insonia: 4, palpitacao: 3, taquipneia: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Preocupações excessivas intratáveis com sintomas somáticos autonômicos (palpitações, taquipneia/hiperventilação, insônia) sugerem ansiedade generalizada.',
    nextStepsExams: 'Aplicar escala rastreadora GAD-7. Solicitar ECG se houver queixas de precordialgia ou palpitação intensa.',
    guideline: 'Manual da Sociedade Brasileira de Psiquiatria (ABP 2023)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'Baseado em critérios do DSM-5 e escore GAD-7. Havendo sintomas físicos limitantes recorrentes por tempo prolongado, está indicado o início imediato de terapia cognitivo-comportamental e terapia farmacológica de controle com ISRS de forma contínua.',
    evidenceMarkers: [
      { finding: 'Escore GAD-7 ≥ 10', metric: 'Sensibilidade', 'value': '89%', ref: 'Archives of Internal Medicine' }
    ]
  },
  dengue: {
    diseaseId: 'dengue',
    symptoms: { febre: 5, dor_articulacoes: 4, cefaleia: 4, manchas_vermelhas: 3, sinal_provado_laco: 5 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Febre de início súbito, artralgias intensas, dor retroorbitária e exantema associados à prova do laço positiva indicam Dengue clássica.',
    nextStepsExams: 'Solicitar Hemograma completo urgente (monitorização de plaquetas e hematócrito) e pesquisa de Antígeno NS1 ou Sorologia IgM.',
    guideline: 'Diretriz de Manejo de Dengue do Ministério da Saúde do Brasil (2024)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'O início imediato do protocolo de reidratação oral vigorosa (Grupo A e B: 60 mL/kg/dia) ou venosa (Grupo C e D) deve ocorrer com base puramente na suspeita clínica em região epidêmica, sem aguardar qualquer resultado de exame laboratorial ou sorológico. A reidratação precoce previne o choque refratário e salva vidas.',
    evidenceMarkers: [
      { finding: 'Prova do Laço positiva', metric: 'LR+', 'value': '6.1', ref: 'WHO Dengue Guidelines' }
    ]
  },
  iam: {
    diseaseId: 'iam',
    symptoms: { dor_peito: 5, dispneia: 3, tec_prolongado: 3, bulhas_hipofoneticas: 2, taquipneia: 2 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Dor retroesternal opressiva lancinante com irradiação, hipofonese de bulhas, pulso periférico em declínio e má-perfusão.',
    nextStepsExams: 'Realizar ECG de 12 derivações em < 10 minutos (porta-ECG). Coletar Troponina ultrassensível de repetição.',
    guideline: 'Diretriz de Síndromes Coronarianas Agudas da SBC (2021) / ESC 2023',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'O início da dupla antiagregação plaquetária (AAS 300mg mastigável + Clopidogrel 300mg) e acionamento do serviço de hemodinâmica/trombolítico deve ocorrer IMEDIATAMENTE após a realização do ECG com supra-desnível de ST (meta porta-ECG < 10 minutos), sem aguardar resultados de troponina. Tempo é músculo!',
    evidenceMarkers: [
      { finding: 'Dor opressiva irradiada para MSE', metric: 'LR+', 'value': '5.6', ref: 'JAMA Rational Clinical Exam' }
    ]
  },
  avc: {
    diseaseId: 'avc',
    symptoms: { fraqueza_unilateral: 5, tontura: 3, cefaleia: 2, desvio_rima: 5, deficit_motor: 5, disartria: 5, sinal_babinski: 4, pupilas_anisocoricas: 3 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Déficit neurológico focal agudo com perda de força unilateral, assimetria facial, desvio de rima e sinal de Babinski extensor positivo.',
    nextStepsExams: 'Encaminhar de imediato para Tomografia de Crânio sem contraste e acionar protocolo de AVC (código AVC).',
    guideline: 'Diretriz da Sociedade Brasileira de Doenças Cerebrovasculares (SBDCV 2022)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'A avaliação neurológica imediata pela escala do NIHSS e transporte emergencial ao hospital com suporte para Tomografia de Crânio é de urgência máxima. O tratamento trombolítico (rtPA) deve ser iniciado em até 4,5h do delta t, sendo obrigatório realizar a TC de Crânio antes para descartar hemorragia.',
    evidenceMarkers: [
      { finding: 'Déficit motor + Fala alterada + Rima desviada', metric: 'Sensibilidade (Escala Cincinnati)', 'value': '88%', ref: 'Stroke Journal' }
    ]
  },
  tep: {
    diseaseId: 'tep',
    symptoms: { dispneia: 5, dor_peito: 4, taquipneia: 4, edema_panturrilha_unilateral: 5, sinal_homans: 4, tec_prolongado: 2 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Instalação súbita de dispneia associada a dor pleurítica na presença de sinais de TVP (edema unilateral e sinal de Homans positivo).',
    nextStepsExams: 'Calcular escore de Wells. Solicitar D-Dímero se baixo risco. Solicitar Angio-TC de tórax se escore de Wells indicar alto risco.',
    guideline: 'Diretrizes de Tromboembolismo Pulmonar da SBC (2022) / ESC 2024',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'Em pacientes com alta suspeita clínica (escore de Wells > 4 ou Wells simplificado > 1) associada à instabilidade hemodinâmica ou dispneia aguda limitante, a anticoagulação terapêutica com Heparina não fracionada ou de baixo peso molecular (Enoxaparina) deve ser iniciada empírica e imediatamente, antes mesmo de realizar a Angiotomografia computadorizada de tórax, exceto se houver contraindicações formais.',
    evidenceMarkers: [
      { finding: 'Empastamento unilateral de panturrilha', metric: 'LR+ (Razão de Verossimilhança)', 'value': '4.8', ref: 'Annals of Internal Medicine' }
    ]
  },
  pancreatite: {
    diseaseId: 'pancreatite',
    symptoms: { dor_abdominal: 5, nausea_vomito: 4, febre: 2, rha_ausentes: 4 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Dor abdominal em barra, de início súbito e severo, irradiada para o dorso, acompanhada de vômitos intensos e íleo paralítico (ruídos hidroaéreos ausentes).',
    nextStepsExams: 'Dosagem de Amilase e Lipase séricas (critério: elevação > 3x o valor de referência) e Ultrassonografia Abdominal.',
    guideline: 'Consenso de Diretrizes de Pancreatite Aguda (IAP/APA 2018)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'A estabilização clínica com jejum oral, reposição volêmica agressiva e precoce com Ringer Lactato (250-500 mL/h) e analgesia com opioides deve ser iniciada imediatamente no Pronto Socorro com base na dor abdominal típica em barra associada ao aumento de Lipase/Amilase (3x o limite superior), não sendo necessário aguardar exames de tomografia para iniciar as medidas de suporte primário.',
    evidenceMarkers: [
      { finding: 'Dor em barra epigástrica com irradiação dorso', metric: 'Sensibilidade', 'value': '92%', ref: 'Gastroenterology Journal' }
    ]
  },
  pielonefrite_complicada: {
    diseaseId: 'pielonefrite_complicada',
    symptoms: { febre: 5, dor_urinar: 3, nausea_vomito: 3, sinal_giordano: 5, taquipneia: 2 },
    durations: ['acute'],
    setting: 'ps',
    whyExplanation: 'Febre alta, vômitos e dor exacerbada à punho-percussão na fossa lombar (Giordano+) caracterizam acometimento renal bacteriano agudo.',
    nextStepsExams: 'Solicitar Urina Tipo 1, Urocultura quantitativa com Antibiograma, Hemoculturas bilaterais e Ultrassonografia de vias urinárias.',
    guideline: 'Diretrizes de Infecção de Vias Urinárias da SBI (2021)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'A primeira dose de antimicrobiano intravenoso (ex: Ceftriaxona ou Ciprofloxacino) ou oral (se tolerância e estabilidade) deve ser administrada imediatamente após a coleta de urinocultura e hemoculturas, devido ao alto risco de progressão rápida para urossepse e insuficiência renal aguda.',
    evidenceMarkers: [
      { finding: 'Giordano positivo + Febre com calafrios', metric: 'Especificidade', 'value': '95%', ref: 'Bates Physical Examination Guide' }
    ]
  },
  apendicite: {
    diseaseId: 'apendicite',
    symptoms: { dor_abdominal_fid: 5, febre: 3, nausea_vomito: 3, sinal_blumberg: 5, abdomen_tabua: 3, rha_ausentes: 2 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Dor migratória localizada em fossa ilíaca direita associada à forte defesa local com dor à descompressão rápida (sinal de Blumberg).',
    nextStepsExams: 'Avaliação da escala de Alvarado. Solicitar Hemograma completo, PCR, e Ultrassonografia de abdômen ou Tomografia com contraste.',
    guideline: 'Diretrizes do Colégio Brasileiro de Cirurgiões (CBC 2021)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'O manejo clínico inicial com jejum absoluto, hidratação endovenosa e controle rigoroso da dor deve ser iniciado imediatamente após a suspeita clínica por meio do exame físico (Sinal de Blumberg e dor migratória para FID - escore de Alvarado ≥ 5). O tratamento definitivo (apendicectomia) é cirúrgico e de urgência.',
    evidenceMarkers: [
      { finding: 'Sinal de Blumberg positivo em FID', metric: 'LR+', 'value': '3.6', ref: 'Alvarado Scale Original Study' }
    ]
  },
  colecistite: {
    diseaseId: 'colecistite',
    symptoms: { dor_abdominal_hd: 5, febre: 2, nausea_vomito: 4, sinal_murphy: 5 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Parada inspiratória dolorosa à compressão do hipocôndrio direito (Murphy+) com febre e vômitos indica inflamação de vesícula biliar.',
    nextStepsExams: 'Solicitar Ultrassonografia de Abdômen Superior, Hemograma completo, PCR e dosagem de transaminases/bilirrubinas.',
    guideline: 'Tokyo Guidelines 2018 (TG18)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'Diante de dor em hipocôndrio direito com sinal de Murphy positivo associado a febre e leucocitose, o paciente deve receber internação imediata, jejum, analgesia potente e antibioticoterapia endovenosa empírica na primeira hora. A colecistectomia precoce idealmente nas primeiras 72 horas reduz complicações cirúrgicas.',
    evidenceMarkers: [
      { finding: 'Sinal de Murphy positivo à palpação', metric: 'Especificidade', 'value': '96%', ref: 'Tokyo Guidelines Study' }
    ]
  },
  icc_descompensada: {
    diseaseId: 'icc_descompensada',
    symptoms: { dispneia: 5, fadiga: 4, ortopneia: 5, edema_mmii_bilateral: 5, turgencia_jugular: 5, estertores_crepitantes: 4, bulhas_hipofoneticas: 2 },
    durations: ['acute', 'subacute', 'chronic'],
    setting: 'ambos',
    whyExplanation: 'Ortopneia e dispneia extrema associadas a turgência jugular a 45º e estertores pulmonares bilaterais denotam congestão pulmonar de alto débito.',
    nextStepsExams: 'Solicitar Radiografia de Tórax, ECG de 12 derivações, Ecocardiograma transtorácico e dosagem sérica de NT-proBNP ou BNP.',
    guideline: 'Diretriz de Insuficiência Cardíaca Aguda da SBC (2021) / ESC 2023',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'A administração de Furosemida 20-40mg EV imediata e suporte de oxigênio (idealmente VNI) deve ser executada de imediato na admissão de paciente com sinais de congestão pulmonar aguda e turgência jugular (perfil B ou úmido), sem aguardar exames de imagem ou dosagem de BNP, para reverter a dispneia limitante e prevenir insuficiência respiratória grave.',
    evidenceMarkers: [
      { finding: 'Ortopneia + Turgência jugular', metric: 'LR+ (Razão de Verossimilhança)', 'value': '7.2', ref: 'Framingham Heart Study Criteria' }
    ]
  },
  acidente_peconhento: {
    diseaseId: 'acidente_peconhento',
    symptoms: { picada_animal: 5, nausea_vomito: 3, tec_prolongado: 2 },
    durations: ['hyperacute'],
    setting: 'ps',
    whyExplanation: 'Picada documentada ou suspeita de escorpião ou serpente com dor local exuberante e vômitos sistêmicos autonômicos rápidos.',
    nextStepsExams: 'Monitorização eletrocardiográfica contínua, dosagem de Eletrólitos (Potássio/Sódio), CPK e Amilase sérica.',
    guideline: 'Ministério da Saúde - Guia de Vigilância Epidemiológica (2022)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'O bloqueio anestésico local da dor e monitorização cardíaca contínua são imediatos. A soroterapia antiescorpiônica ou antiofídica específica deve ser infundida sem qualquer atraso em pacientes com sinais sistêmicos moderados ou graves, visto que a progressão para choque e edema agudo de pulmão em crianças pode ocorrer em poucas horas.',
    evidenceMarkers: [
      { finding: 'Dor local exuberante + Vômitos em crianças', metric: 'Sensibilidade (para gravidade)', 'value': '98%', ref: 'Butantan Institute Protocol' }
    ]
  },
  ivas: {
    diseaseId: 'ivas',
    symptoms: { sintomas_gripais: 5, dor_garganta: 4, tosse: 3, febre: 2, hiperemia_faringe: 3 },
    durations: ['acute'],
    setting: 'ambos',
    whyExplanation: 'Associação de coriza hialina abundante, espirros frequentes, congestão nasal bilateral e orofaringe levemente hiperemiada.',
    nextStepsExams: 'Diagnóstico é eminentemente clínico. Nenhum exame complementar de rotina indicado em quadros virais.',
    guideline: 'Associação Brasileira de Medicina de Família e Comunidade (SBMFC 2021)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'O tratamento sintomático (lavagem nasal, analgésicos e antipiréticos) é imediato e empírico. É expressamente contraindicado o uso de antibióticos ou antivirais em massa na ausência de suspeita bacteriana forte ou fatores de risco para Influenza (onde o Oseltamivir é indicado).',
    evidenceMarkers: [
      { finding: 'Espirros + Coriza clara bilateral', metric: 'Sensibilidade', 'value': '95%', ref: 'BMJ Clinician Resource' }
    ]
  },
  asma_crise: {
    diseaseId: 'asma_crise',
    symptoms: { dispneia: 5, tosse: 4, sibilos_difusos: 5, tiragem_intercostal: 5, taquipneia: 4, murmurio_diminuido: 3 },
    durations: ['hyperacute', 'acute'],
    setting: 'ps',
    whyExplanation: 'Broncoespasmo agudo severo em paciente com histórico de asma, manifestado por tiragem intercostal, fala entrecortada e sibilância difusa.',
    nextStepsExams: 'Oximetria de pulso contínua na urgência. Gasometria arterial indicada apenas se houver refratariedade ou suspeita de fadiga muscular.',
    guideline: 'Global Initiative for Asthma (GINA 2024)',
    treatmentAllowed: 'immediate_critical',
    treatmentAllowedJustification: 'A inalação de curto prazo (Salbutamol 4-10 jatos ou nebulização) associada a corticoterapia sistêmica (Prednisolona VO ou Metilprednisolona EV) deve ser iniciada na PRIMEIRA MINUTO de atendimento de crise asmática em Pronto Socorro, sem aguardar qualquer exame ou raio-X. O retardo aumenta consideravelmente o risco de parada respiratória por broncoespasmo extremo.',
    evidenceMarkers: [
      { finding: 'Sibilos expiratórios + Tiragem intercostal', metric: 'LR+', 'value': '12.4', ref: 'GINA Guideline Reviews' }
    ]
  },
  climaterio: {
    diseaseId: 'climaterio',
    symptoms: { secura_vaginal: 5, insonia: 3, fadiga: 2 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Presença de fogachos vasomotores, insônia e hipoestrogenismo clínico compatível com faixa etária de climatério.',
    nextStepsExams: 'Diagnóstico clínico básico. Realizar exames preventivos (Mamografia de rastreamento, Citologia Oncótica e USG transvaginal).',
    guideline: 'Consenso de Climatério da SOBRAC (2023)',
    treatmentAllowed: 'confirmation_needed',
    treatmentAllowedJustification: 'Embora a suspeita seja clínica, a introdução de Terapia de Reposição Hormonal (TRH) exige avaliação rigorosa de exames preventivos recentes (Mamografia normal com BI-RADS 1 ou 2, Ultrassonografia transvaginal demonstrando endométrio fino < 4-5mm e Citologia oncótica normal), além de exclusão de contraindicações absolutas (histórico de câncer de mama ou trombose).',
    evidenceMarkers: [
      { finding: 'Fogachos vasomotores típicos aos 48 anos', metric: 'Especificidade', 'value': '92%', ref: 'SOBRAC Study' }
    ]
  },
  ivc: {
    diseaseId: 'ivc',
    symptoms: { dor_panturrilha: 3, edema_mmii_bilateral: 4 },
    durations: ['chronic'],
    setting: 'ubs',
    whyExplanation: 'Sensação de peso vespertino, dor incômoda e edema bilateral que reduz com elevação dos membros.',
    nextStepsExams: 'Diagnóstico eminentemente clínico. Doppler Colorido Venoso de MMII reservado para mapeamento de varizes cirúrgicas.',
    guideline: 'Diretriz de Insuficiência Venosa Crônica da SBACV (2021)',
    treatmentAllowed: 'immediate',
    treatmentAllowedJustification: 'As medidas de base, como elevação de membros inferiores, perda de peso e uso de meias de compressão elástica (após descartar insuficiência arterial periférica pelo índice tornozelo-braço), são recomendadas imediatamente com base na apresentação clínica típica (edema vespertino bilateral, cacifo positivo e varizes). O Doppler venoso é reservado para planejamento cirúrgico ou suspeita de trombose.',
    evidenceMarkers: [
      { finding: 'Edema vespertino bilateral com cacifo', metric: 'Sensibilidade', 'value': '85%', ref: 'Bates Physical Examination Guide' }
    ]
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
    const cats = new Set(SYMPTOMS_AND_SIGNS.map(s => s.category));
    return ['Todas', ...Array.from(cats)];
  }, []);

  // Filter symptoms
  const filteredSymptoms = useMemo(() => {
    return SYMPTOMS_AND_SIGNS.filter(s => {
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
        const sObj = SYMPTOMS_AND_SIGNS.find(s => s.id === symptomId);
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
      const selectCount = Object.keys(selectedSymptoms).length;
      Object.entries(profile.symptoms).forEach(([symptomId, weight]) => {
        if (weight >= 4 && !selectedSymptoms[symptomId]) {
          const sObj = SYMPTOMS_AND_SIGNS.find(s => s.id === symptomId);
          const name = sObj ? sObj.name : symptomId;
          
          let penalty = 15;
          if (selectCount === 1) {
            penalty = 2;
          } else if (selectCount === 2) {
            penalty = 5;
          } else if (selectCount === 3) {
            penalty = 8;
          }
          
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
        guideline: profile.guideline,
        treatmentAllowed: profile.treatmentAllowed,
        treatmentAllowedJustification: profile.treatmentAllowedJustification,
        evidenceMarkers: profile.evidenceMarkers,
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
    .filter(res => res.matchedSymptomCount > 0) // show all matches with at least one matching symptom
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
      const s = SYMPTOMS_AND_SIGNS.find(x => x.id === id);
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
                      <div className="flex items-center gap-1.5 flex-wrap">
                        <span className="text-xs font-bold text-slate-800 dark:text-slate-200">{symptom.name}</span>
                        <span className={`text-[8px] font-black uppercase px-1.5 py-0.5 rounded-md ${
                          symptom.type === 'sign' 
                            ? 'bg-cyan-500/10 text-cyan-600 dark:text-cyan-400' 
                            : 'bg-rose-500/10 text-rose-600 dark:text-rose-400'
                        }`}>
                          {symptom.type === 'sign' ? 'Sinal' : 'Sintoma'}
                        </span>
                      </div>
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
                              {suspect.guideline && (
                                <p className="text-[10px] text-slate-500 dark:text-slate-400 font-semibold leading-none">
                                  📖 {suspect.guideline}
                                </p>
                              )}
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

                            {/* Início de Tratamento Autorizado & Evidências Científicas */}
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-1">
                              {/* Decisão de Início do Tratamento */}
                              <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2.5 shadow-xs">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <ClipboardCheck size={12} className="text-rose-600" /> Conduta de Início do Tratamento
                                </h4>
                                {suspect.treatmentAllowed === 'immediate' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 border border-emerald-500/20 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-500 animate-pulse"></span>
                                    Início Imediato Autorizado (Empírico)
                                  </div>
                                )}
                                {suspect.treatmentAllowed === 'immediate_critical' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-red-500/10 text-red-600 dark:text-red-400 border border-red-500/20 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-red-500 animate-bounce"></span>
                                    Emergência Crítica - Tratamento Imediato Mandatório
                                  </div>
                                )}
                                {suspect.treatmentAllowed === 'confirmation_needed' && (
                                  <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[9px] font-extrabold bg-amber-500/10 text-amber-600 dark:text-amber-400 border border-amber-500/20 uppercase tracking-wide">
                                    <span className="w-1.5 h-1.5 rounded-full bg-amber-500"></span>
                                    Aguardar Confirmação por Exames
                                  </div>
                                )}
                                <p className="text-xs font-semibold text-slate-600 dark:text-slate-300 leading-relaxed">
                                  {suspect.treatmentAllowedJustification}
                                </p>
                              </div>

                              {/* Evidências Clínicas e Estatísticas */}
                              <div className="p-4 bg-white dark:bg-slate-850 border border-slate-200 dark:border-slate-850 rounded-2xl space-y-2.5 shadow-xs">
                                <h4 className="text-[10px] font-black uppercase text-slate-400 tracking-wider flex items-center gap-1.5">
                                  <Brain size={12} className="text-purple-600" /> Acurácia Diagnóstica Baseada em Evidências
                                </h4>
                                {suspect.evidenceMarkers && suspect.evidenceMarkers.length > 0 ? (
                                  <div className="space-y-2">
                                    {suspect.evidenceMarkers.map((marker, mIdx) => (
                                      <div key={mIdx} className="text-[11px] leading-relaxed border-b border-slate-100 dark:border-slate-800 pb-1.5 last:border-0 last:pb-0">
                                        <div className="flex justify-between font-bold text-slate-700 dark:text-slate-200">
                                          <span>{marker.finding}</span>
                                          <span className="text-purple-600 dark:text-purple-400">{marker.metric}: {marker.value}</span>
                                        </div>
                                        <div className="text-[9px] text-slate-400 dark:text-slate-500 font-mono">Estudo: {marker.ref}</div>
                                      </div>
                                    ))}
                                  </div>
                                ) : (
                                  <p className="text-[11px] text-slate-400 italic">Estatísticas de probabilidade baseadas nas taxas de incidência do Ministério da Saúde.</p>
                                )}
                              </div>
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
