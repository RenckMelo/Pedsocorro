/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import { useState, useEffect, useMemo } from 'react';
import { 
  Search, 
  Calculator, 
  BookOpen, 
  Activity, 
  Menu, 
  X,
  XCircle,
  ChevronRight, 
  Droplets, 
  Stethoscope,
  Info,
  ExternalLink,
  ShieldCheck,
  Moon,
  Sun,
  LayoutDashboard,
  Pill,
  FileText,
  AlertTriangle,
  History,
  ArrowRight,
  ClipboardCheck,
  Zap,
  Microscope,
  RotateCcw,
  Brain,
  Download,
  Bookmark,
  Home,
  ClipboardList,
  ShieldAlert,
  Scale,
  Wind,
  CheckCircle,
  Circle,
  Database,
  Heart,
  Filter,
  TrendingUp,
  UserCheck,
  Sparkles,
  Plus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UBS_CATALOG_DISEASES } from './ubsCatalog';

// --- Mental Health Screening Constants ---
const PHQ9_QUESTIONS = [
  "Pouco interesse ou prazer em fazer as coisas",
  "Sentir-se para baixo, deprimido(a) ou sem perspectiva",
  "Dificuldade para adormecer ou dormir demais, ou acordar no meio da noite",
  "Sentir-se cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Sentir-se mal consigo mesmo(a) ou achar que é um fracasso para si ou sua família",
  "Dificuldade para se concentrar nas coisas (ex: ler notícias, ver televisão)",
  "Mover-se ou falar tão lentamente que outras pessoas percebem, ou o oposto: inquietação",
  "Pensamentos de que seria melhor morrer ou se machucar de alguma maneira"
];

const GAD7_QUESTIONS = [
  "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
  "Não ser capaz de parar ou controlar as preocupações",
  "Preocupar-se demais com diversas coisas diferentes",
  "Dificuldade para relaxar",
  "Ficar tão inquieto(a) que é difícil permanecer sentado(a)",
  "Ficar facilmente irritável ou aborrecido(a)",
  "Sentir medo, como se algo terrível pudesse acontecer"
];

const MENTAL_OPTIONS = [
  { value: 0, label: "Nenhum dia" },
  { value: 1, label: "Vários dias" },
  { value: 2, label: "Mais da metade dos dias" },
  { value: 3, label: "Quase todos os dias" }
];

// --- Types ---
type AppSection = 'dashboard' | 'drugs' | 'calculators' | 'flowcharts' | 'prescriptions' | 'summaries' | 'history' | 'lab' | 'emergency' | 'ambulatorio' | 'ubs';

interface Medication {
  id: string;
  name: string;
  indication: string;
  dose: string;
  frequency: string;
  presentation: string;
  renalAdjustment?: string;
  notes: string;
  category: 'Analgésico' | 'Antibiótico' | 'Cardiovascular' | 'Respiratório' | 'Gastro' | 'Emergência' | 'Endocrino' | 'Endocrinologia' | 'Corticoide' | 'Neurologia' | 'Psiquiatria' | 'Cardiologia' | 'Antifúngico' | 'Rheuma';
}

// --- Data ---
const MEDICATIONS: Medication[] = [
  {
    id: '1',
    name: 'Amoxicilina + Clavulanato',
    indication: 'Infecções bacterianas',
    dose: '500/125mg a 875/125mg',
    frequency: '8/8h ou 12/12h',
    presentation: '500/125mg, 875/125mg (Comprimidos)',
    renalAdjustment: 'ClCr < 30ml/min: evitar formulação 875mg.',
    category: 'Antibiótico',
    notes: 'Tomar preferencialmente no início das refeições.'
  },
  {
    id: '2',
    name: 'Amiodarona',
    indication: 'Arritmias ventriculares e supraventriculares',
    dose: 'Ataque: 150-300mg IV. Manutenção: 200mg-400mg/dia VO.',
    frequency: 'Variável',
    presentation: '150mg/3mL (Ampola), 200mg (Comprimido)',
    category: 'Cardiovascular',
    notes: 'Monitorar intervalo QT e função tireoidiana no uso crônico.'
  },
  {
    id: '3',
    name: 'Ceftriaxona',
    indication: 'Pneumonia, Meningite, ITU Complicada',
    dose: '1g a 2g',
    frequency: '12/12h ou 24/24h',
    presentation: '1g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Pode ser administrada IM ou IV. Diluir corretamente.'
  },
  {
    id: '51',
    name: 'Fluoxetina',
    indication: 'Depressão, Transtorno do Pânico, TOC',
    dose: '20mg a 60mg VO',
    frequency: 'Manhã',
    presentation: '20mg (Cápsula)',
    category: 'Psiquiatria',
    notes: 'ISRS. Pode causar náuseas e insônia no início.'
  },
  {
    id: '52',
    name: 'Sertralina',
    indication: 'Depressão, Ansiedade, TEPT',
    dose: '25mg a 200mg VO',
    frequency: 'Manhã ou Noite',
    presentation: '25mg, 50mg, 100mg',
    category: 'Psiquiatria',
    notes: 'Opção segura em idosos e cardiopatas.'
  },
  {
    id: '53',
    name: 'Quetiapina',
    indication: 'Esquizofrenia, Bipolaridade, Insônia (Off-label)',
    dose: '25mg a 800mg VO',
    frequency: 'Noite',
    presentation: '25mg, 100mg, 200mg',
    category: 'Psiquiatria',
    notes: 'Antipsicótico atípico. Cuidado com síndrome metabólica.'
  },
  {
    id: '55',
    name: 'Metotrexato',
    indication: 'Artrite Reumatoide, Psoríase, Neoplasias',
    dose: '7.5mg a 25mg VO/IM',
    frequency: 'SEMANAL',
    presentation: '2.5mg (Comp), 50mg/mL (Ampola)',
    category: 'Rheuma',
    notes: 'NUNCA usar diariamente para AR. Repor Ácido Fólico.'
  },
  {
    id: '56',
    name: 'Propofol',
    indication: 'Indução e Manutenção de Anestesia, Sedação em UTI',
    dose: '1 a 2 mg/kg (Indução) / 5 a 50 mcg/kg/min (Manutenção)',
    frequency: 'Contínua',
    presentation: '10mg/mL (Frasco-ampola)',
    category: 'Emergência',
    notes: 'Risco de Síndrome da Infusão do Propofol (acidose, rabdomiólise). Lipídico.'
  },
  {
    id: '57',
    name: 'Noradrenalina',
    indication: 'Choque Séptico, Cardiogênico ou Neurogênico (Vasopressor)',
    dose: '0.05 a 2 mcg/kg/min',
    frequency: 'Contínua',
    presentation: '1mg/mL (Ampola 4mL)',
    category: 'Emergência',
    notes: 'Diluir preferencialmente em SG 5%. Acesso venoso central obrigatório.'
  },
  {
    id: '58',
    name: 'Dobutamina',
    indication: 'Choque Cardiogênico, IC Descompensada (Inotrópico)',
    dose: '2 a 20 mcg/kg/min',
    frequency: 'Contínua',
    presentation: '12.5mg/mL (Ampola 20mL)',
    category: 'Emergência',
    notes: 'Pode causar taquicardia e arritmias. Monitorar debito cardíaco.'
  },
  {
    id: '59',
    name: 'Succinilcolina',
    indication: 'Sequência Rápida de Intubação (SRI)',
    dose: '1 a 1.5 mg/kg IV',
    frequency: 'Dose única',
    presentation: '100mg (Frasco-ampola)',
    category: 'Emergência',
    notes: 'Bloqueador despolarizante. Contraindicações: Hipercalemia, Grandes Queimados (após 48h), Trauma Craniano.'
  },
  {
    id: '60',
    name: 'Adenosina',
    indication: 'Taquicardia Supraventricular Paroxística (Reentrada)',
    dose: '6mg (1ª dose) e 12mg (2ª dose) IV Rápido',
    frequency: 'Bolus Rápido (Flush)',
    presentation: '3mg/mL (Ampola 2mL)',
    category: 'Emergência',
    notes: 'Informa ao paciente sensação de morte iminente. Curta meia-vida.'
  },
  {
    id: '4',
    name: 'Enoxaparina',
    indication: 'Profilaxia e tratamento de TEV / SCA',
    dose: 'Profilaxia: 40mg. Tratamento: 1mg/kg.',
    frequency: '24/24h (Prof) ou 12/12h (Trat)',
    presentation: '20mg, 40mg, 60mg, 80mg (Seringas preenchidas)',
    renalAdjustment: 'Ajustar dose em ClCr < 30mL/min (0.5mg/kg 12/12h ou 1mg/kg 24/24h).',
    category: 'Cardiovascular',
    notes: 'Administração SC profunda na região abdominal.'
  },
  {
    id: '5',
    name: 'Furosemida',
    indication: 'Edema agudo de pulmão, Insuficiência Cardíaca',
    dose: '20mg a 40mg IV ou VO',
    frequency: 'Variável (conforme balanço hídrico)',
    presentation: '20mg/2mL (Ampola), 40mg (Comprimido)',
    category: 'Cardiovascular',
    notes: 'Monitorar potássio e função renal.'
  },
  {
    id: '6',
    name: 'Metoprolol (Succinato)',
    indication: 'HAS, Insuficiência Cardíaca, Angina',
    dose: '25mg a 200mg',
    frequency: '24/24h',
    presentation: '25mg, 50mg, 100mg (Liberação controlada)',
    category: 'Cardiovascular',
    notes: 'Não suspender abruptamente.'
  },
  {
    id: '7',
    name: 'Pip/Tazo (Piperacilina + Tazobactam)',
    indication: 'Infecções hospitalares, sepse',
    dose: '4.5g (standard inf. 30min ou estendida 3-4h)',
    frequency: '6/6h ou 8/8h',
    presentation: '4.5g (Frasco-ampola)',
    renalAdjustment: 'Obrigatório ajuste conforme clearance.',
    category: 'Antibiótico',
    notes: 'Considerar infusão estendida para melhorar desfecho em graves.'
  },
  {
    id: '8',
    name: 'Noradrenalina',
    indication: 'Choque circulatório (Vasopressor)',
    dose: '0.05 a 0.5 mcg/kg/min (titular)',
    frequency: 'Contínua',
    presentation: '4mg/4mL (Ampola)',
    category: 'Emergência',
    notes: 'Administrar obrigatoriamente via Acesso Venoso Central. Monitorar PAM.'
  },
  {
    id: '9',
    name: 'Morfina',
    indication: 'Dor intensa, IAM, Edema Pulmonar',
    dose: '2mg a 4mg IV (titular)',
    frequency: 'Até 5/5 min (agudo)',
    presentation: '10mg/mL (Ampola)',
    category: 'Analgésico',
    notes: 'Riscos: Depressão respiratória e hipotensão.'
  },
  {
    id: '10',
    name: 'Omeprazol',
    indication: 'Profilaxia de úlcera de estresse, DRGE',
    dose: '20mg a 40mg',
    frequency: '24/24h',
    presentation: '40mg (Frasco-ampola), 20mg (Cápsula)',
    category: 'Gastro',
    notes: 'Administrar em jejum.'
  },
  {
    id: '11',
    name: 'Ceftriaxona',
    indication: 'Pneumonia, ITU, Sepse, Meningite',
    dose: '1g a 2g IV/IM',
    frequency: '12/12h ou 24/24h',
    presentation: '1g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Atinge boa concentração no líquor. Dose de 2g 12/12h para Meningite.'
  },
  {
    id: '12',
    name: 'Amoxicilina + Clavulanato',
    indication: 'Infecções respiratórias, Sinusite, Mordeduras',
    dose: '500mg/125mg ou 875mg/125mg',
    frequency: '8/8h ou 12/12h',
    presentation: 'Comprimidos, Suspensão',
    category: 'Antibiótico',
    notes: 'Tomar no início das refeições para reduzir efeitos gastrointestinais.'
  },
  {
    id: '13',
    name: 'Furosemida',
    indication: 'Edema, Insuficiência Cardíaca, Crise Hipertensiva',
    dose: '20mg a 40mg (pode ser maior)',
    frequency: 'EV ou VO',
    presentation: '20mg (Ampola), 40mg (Comprimido)',
    category: 'Cardiovascular',
    notes: 'Monitorar Potássio e função renal.'
  },
  {
    id: '14',
    name: 'Amiodarona',
    indication: 'Taquiarritmias (FV, TV, Fibrilação Atrial)',
    dose: 'Ataque: 150-300mg / Manut: 900mg/24h',
    frequency: 'EV (Bomba de Infusão)',
    presentation: '150mg/3mL (Ampola)',
    category: 'Emergência',
    notes: 'Diluir apenas em Soro Glicosado (SG5%).'
  },
  {
    id: '15',
    name: 'Enoxaparina',
    indication: 'Profilaxia e tratamento de TVP/TEP, SCA',
    dose: '1mg/kg (Tratamento) ou 40mg (Profilaxia)',
    frequency: '12/12h (Tratamento) ou 24/24h (Profilaxia)',
    presentation: '20mg, 40mg, 60mg, 80mg (Seringa)',
    category: 'Cardiovascular',
    notes: 'Ajustar dose para ClCr < 30 mL/min.'
  },
  {
    id: '16',
    name: 'Insulina Regular',
    indication: 'Diabetes Mellitus, Hipercalemia, Emergências Glicêmicas',
    dose: '0.1 UI/kg/h (Bomba) ou conforme escala',
    frequency: 'Variável',
    presentation: '100 UI/mL (Frasco)',
    category: 'Endocrino',
    notes: 'Início de ação rápido (30 min). Cuidado com hipoglicemia.'
  },
  {
    id: '17',
    name: 'Metformina',
    indication: 'DM2, SOP',
    dose: '500mg a 2550mg/dia',
    frequency: '8/8h ou 12/12h',
    presentation: '500mg, 850mg, 1g',
    category: 'Endocrino',
    notes: 'Suspender 48h antes de exames com contraste iodado.'
  },
  {
    id: '18',
    name: 'Losartana',
    indication: 'Hipertensão, IC, Nefropatia Diabética',
    dose: '25mg a 100mg/dia',
    frequency: '12/12h ou 24/24h',
    presentation: '25mg, 50mg, 100mg',
    category: 'Cardiovascular',
    notes: 'Risco de hipercalemia. Contraindicado na gestação.'
  },
  {
    id: '19',
    name: 'Anlodipino',
    indication: 'Hipertensão, Angina Estável',
    dose: '2.5mg a 10mg/dia',
    frequency: '24/24h',
    presentation: '5mg, 10mg',
    category: 'Cardiovascular',
    notes: 'Pode causar edema maleolar.'
  },
  {
    id: '20',
    name: 'Clopidogrel',
    indication: 'SCA, Pós-Angioplastia, AVC Isquêmico',
    dose: '75mg (Manutenção) / 300-600mg (Ataque)',
    frequency: '24/24h',
    presentation: '75mg',
    category: 'Cardiovascular',
    notes: 'Antiagregante plaquetário.'
  },
  {
    id: '21',
    name: 'Fentanil',
    indication: 'Sedação, Analgesia em UTI',
    dose: '1 a 5 mcg/kg (Ataque) / 0.5-2 mcg/kg/h',
    frequency: 'Contínua',
    presentation: '50 mcg/mL (Frasco-ampola)',
    category: 'Emergência',
    notes: 'Risco de tórax rígido em infusão rápida.'
  },
  {
    id: '22',
    name: 'Midazolam',
    indication: 'Sedação, Estado de Mal Epiléptico',
    dose: '0.05 a 0.2 mg/kg',
    frequency: 'EV',
    presentation: '5mg/mL (Ampola)',
    category: 'Emergência',
    notes: 'Benzodiazepínico de curta ação.'
  },
  {
    id: '23',
    name: 'Hidrocortisona',
    indication: 'Choque Séptico Refratário, Crise Adrenal, Exacerbação de Asma',
    dose: '100mg a 500mg IV',
    frequency: '8/8h ou 12/12h',
    presentation: '100mg, 500mg (Frasco-ampola)',
    category: 'Corticoide',
    notes: 'Mineralocorticoide potente.'
  },
  {
    id: '24',
    name: 'Aspirina (AAS)',
    indication: 'SCA, Prevenção Secundária de AVC/IAM',
    dose: '100mg a 300mg',
    frequency: '24/24h',
    presentation: '100mg (Comprimido)',
    category: 'Cardiovascular',
    notes: 'Mastigar no IAM para absorção rápida.'
  },
  {
    id: '25',
    name: 'Sinvastatina',
    indication: 'Dislipidemia, Prevenção Cardiovascular',
    dose: '20mg a 40mg',
    frequency: 'Noite',
    presentation: '20mg, 40mg',
    category: 'Cardiovascular',
    notes: 'Risco de miopatia/rabdomiólise se associado a certos fármacos.'
  },
  {
    id: '26',
    name: 'Diazepam',
    indication: 'Crise Convulsiva, Ansiedade Aguda, Abstinência Alcoólica',
    dose: '5mg a 10mg EV lento (2-5mg/min)',
    frequency: 'Se necessário',
    presentation: '10mg/2mL (Ampola), 5mg/10mg (Comprimido)',
    category: 'Neurologia',
    notes: 'Risco de depressão respiratória. Evitar em idosos (Cuidado de Beers).'
  },
  {
    id: '27',
    name: 'Haloperidol',
    indication: 'Delirium, Agitação Psicomotora, Esquizofrênia',
    dose: '1mg a 5mg IM/EV',
    frequency: '12/12h ou SOS',
    presentation: '5mg/mL (Ampola)',
    category: 'Psiquiatria',
    notes: 'Pode prolongar intervalo QTc. Risco de Síndrome Extrapiramidal.'
  },
  {
    id: '28',
    name: 'Vancomicina',
    indication: 'Infecções por MRSA, Endocardite, Sepse',
    dose: '15-20 mg/kg (Ataque 25-30mg/kg em graves)',
    frequency: '8/8h ou 12/12h',
    presentation: '500mg, 1g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Monitorar vancocinemia e função renal. Risco de "Síndrome do Homem Vermelho" se infusão rápida.'
  },
  {
    id: '29',
    name: 'Meropenem',
    indication: 'Infecções Graves multirresistentes, Neutropenia Febril',
    dose: '1g a 2g IV',
    frequency: '8/8h',
    presentation: '500mg, 1g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Carbapenêmico. Considerar infusão estendida (3h).'
  },
  {
    id: '30',
    name: 'Rivaroxabana',
    indication: 'FA (Prevenção AVC), Tratamento TVP/TEP',
    dose: '15mg a 20mg VO',
    frequency: '24/24h (ou 12/12h na fase aguda TVP)',
    presentation: '10mg, 15mg, 20mg',
    category: 'Cardiovascular',
    notes: 'DOAC (Anticoagulante Oral Direto). Não requer monitorização de RNI.'
  },
  {
    id: '31',
    name: 'Atropina',
    indication: 'Bradicardia Sinusal Sintomática, Intoxicação por Organofosforados',
    dose: '1mg IV (Bradicardia) / Até 2-5mg (Intoxicação)',
    frequency: '3-5 min (Max 3mg em bradicardia)',
    presentation: '0.25mg/mL, 0.50mg/mL (Ampola)',
    category: 'Emergência',
    notes: 'Anticolinérgico. Cuidado em glaucoma.'
  },
  {
    id: '32',
    name: 'Amiodarona',
    indication: 'Arritmias Ventriculares, FA (Controle de Ritmo)',
    dose: '150mg a 300mg (Ataque) / 900mg/24h (Manutenção)',
    frequency: 'EV / VO',
    presentation: '150mg/3mL (Ampola)',
    category: 'Cardiologia',
    notes: 'Diluir apenas em Soro Glicosado (SG 5%).'
  },
  {
    id: '33',
    name: 'Lactulona',
    indication: 'Constipação, Encefalopatia Hepática',
    dose: '15mL a 30mL VO',
    frequency: 'Até 6/6h (na encefalopatia)',
    presentation: 'Xarope 667mg/mL',
    category: 'Gastro',
    notes: 'Alvo: 2-3 evacuações pastosas/dia.'
  },
  {
    id: '34',
    name: 'Ceftriaxona',
    indication: 'Sepse, Meningite, Pneumonia, ITU Grave',
    dose: '1g a 2g IV',
    frequency: '12/12h ou 24/24h',
    presentation: '500mg, 1g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Cefalosporina de 3ª geração. Amplo espectro.'
  },
  {
    id: '35',
    name: 'Clindamicina',
    indication: 'Infeccções por Anaeróbios, Pele e Partes Moles',
    dose: '600mg IV ou 300-450mg VO',
    frequency: '6/6h ou 8/8h',
    presentation: '150mg/mL (Ampola), 300mg (Cápsula)',
    category: 'Antibiótico',
    notes: 'Risco de colite pseudomembranosa (C. difficile).'
  },
  {
    id: '36',
    name: 'Piperacilina + Tazobactam',
    indication: 'Infecções Hospitalares, Neutropenia Febril',
    dose: '4.5g IV',
    frequency: '6/6h ou 8/8h',
    presentation: '4.5g (Frasco-ampola)',
    category: 'Antibiótico',
    notes: 'Excelente cobertura para Pseudômonas.'
  },
  {
    id: '37',
    name: 'Levofloxacino',
    indication: 'Pneumonia, ITU Complicada, Sinusite',
    dose: '500mg a 750mg VO/IV',
    frequency: '24/24h',
    presentation: '500mg, 750mg',
    category: 'Antibiótico',
    notes: 'Quinolona respiratória. Risco de ruptura de tendão.'
  },
  {
    id: '38',
    name: 'Fluconazol',
    indication: 'Candidíase (Vaginal, Oral, Esofágica), Criptococose',
    dose: '150mg dose única (Vaginal) ou 200-400mg/dia',
    frequency: 'Variável',
    presentation: '100mg, 150mg (Cápsula), 2mg/mL (Bolsa IV)',
    category: 'Antifúngico',
    notes: 'Muitas interações medicamentosas (Inibidor CYP).'
  },
  {
    id: '39',
    name: 'Ciprofloxacino',
    indication: 'ITU, Diarreia Infecciosa, Prostatite',
    dose: '500mg VO ou 400mg IV',
    frequency: '12/12h',
    presentation: '500mg (Comprimido), 2mg/mL (Bolsa IV)',
    category: 'Antibiótico',
    notes: 'Evitar em idosos se possível (risco de Delirium).'
  },
  {
    id: '40',
    name: 'Azitromicina',
    indication: 'Pneumonia, ISTs, Coqueluche',
    dose: '500mg VO/IV',
    frequency: '24/24h (3 a 5 dias)',
    presentation: '500mg',
    category: 'Antibiótico',
    notes: 'Excelente para germes atípicos.'
  },
  {
    id: '41',
    name: 'Metronidazol',
    indication: 'Tricomoníase, Vaginose, Infecções Anaeróbias',
    dose: '400mg a 500mg VO/IV',
    frequency: '8/8h ou 12/12h',
    presentation: '250mg, 400mg (Comprimido), 5mg/mL (Bolsa IV)',
    category: 'Antibiótico',
    notes: 'Efeito Dissulfiram (não ingerir álcool).'
  },
  {
    id: '42',
    name: 'Sulfametoxazol + Trimetoprima',
    indication: 'Pneumocistose, ITU, Nocardiose',
    dose: '800/160mg (1 cp forte) VO',
    frequency: '12/12h',
    presentation: '400/80mg, 800/160mg',
    category: 'Antibiótico',
    notes: 'Risco de hipercalemia e Steven-Johnson.'
  },
  {
    id: '43',
    name: 'Atenolol',
    indication: 'Hipertensão, Angina estável, Pós-IAM',
    dose: '25mg a 100mg VO',
    frequency: '24/24h',
    presentation: '25mg, 50mg, 100mg',
    category: 'Cardiovascular',
    notes: 'Beta-bloqueador cardiosseletivo (B1).'
  },
  {
    id: '44',
    name: 'Espironolactona',
    indication: 'IC (Frequência reduzida), Ascite em Cirrose, Hipertensão',
    dose: '25mg a 100mg VO',
    frequency: '24/24h',
    presentation: '25mg, 100mg',
    category: 'Cardiovascular',
    notes: 'Poupador de Potássio. Risco de ginecomastia.'
  },
  {
    id: '45',
    name: 'Digoxina',
    indication: 'IC Grave, Fibrilação Atrial (Controle FC)',
    dose: '0.125mg a 0.25mg VO',
    frequency: '24/24h',
    presentation: '0.25mg',
    category: 'Cardiologia',
    notes: 'Cuidado com intoxicação digitálica (especialmente se hipocalemia).'
  },
  {
    id: '46',
    name: 'Enalapril',
    indication: 'Hipertensão, IC, Nefropatia',
    dose: '5mg a 40mg/dia',
    frequency: '12/12h ou 24/24h',
    presentation: '5mg, 10mg, 20mg',
    category: 'Cardiologia',
    notes: 'Pode causar tosse seca (substituir por BRA se necessário).'
  },
  {
    id: '47',
    name: 'Glibenclamida',
    indication: 'Diabetes Mellitus tipo 2',
    dose: '2.5mg a 20mg VO',
    frequency: 'Antes das refeições',
    presentation: '5mg',
    category: 'Endocrinologia',
    notes: 'Sulfonilureia. Alto risco de hipoglicemia em idosos.'
  },
  {
    id: '48',
    name: 'Empagliflozina',
    indication: 'DM2, IC, Doença Renal Crônica',
    dose: '10mg a 25mg VO',
    frequency: '24/24h',
    presentation: '10mg, 25mg',
    category: 'Endocrinologia',
    notes: 'iSGLT2. Benefício cardiovascular e renal comprovado.'
  },
  {
    id: '49',
    name: 'Pregabalina',
    indication: 'Dor Neuropática, Fibromialgia, Ansiedade',
    dose: '75mg a 600mg/dia',
    frequency: '8/8h ou 12/12h',
    presentation: '75mg, 150mg',
    category: 'Neurologia',
    notes: 'Ajustar para função renal. Pode causar edema e sonolência.'
  },
  {
    id: '50',
    name: 'Tramadol',
    indication: 'Dor moderada a intensa',
    dose: '50mg a 100mg VO/IV',
    frequency: '6/6h ou 8/8h',
    presentation: '50mg, 100mg',
    category: 'Analgésico',
    notes: 'Opioide fraco. Risco de Síndrome Serotoninérgica se associado a ISRS.'
  }
];

// --- Prescription Data ---

const PRESCRIPTIONS = [
  {
    id: 'p1',
    title: 'Pneumonia Comunitária (Adulto - Enfermaria)',
    category: 'Infectologia',
    items: [
      'Dieta livre para idade conforme aceitação.',
      'Acesso venoso periférico.',
      'Ceftriaxona 2g IV 1x ao dia.',
      'Azitromicina 500mg VO 1x ao dia (por 3-5 dias).',
      'Dipirona 1g IV de 6/6h se dor ou febre (T > 37.8ºC).',
      'Bromoprida 10mg IV de 8/8h se náuseas ou vômitos.',
      'Inalação com SF 0,9% 5mL de 6/6h.',
      'Cabeceira elevada (30-45º).'
    ],
    guidelines: 'Avaliar escore CURB-65 para decidir internação. Se CURB >= 2, internação indicada.'
  },
  {
    id: 'p2',
    title: 'Insuficiência Cardíaca Descompensada (Perfil B)',
    category: 'Cardiologia',
    items: [
      'Dieta hipossódica (2g/dia) e restrição hídrica (800-1000mL).',
      'Furosemida 40mg IV 12/12h (dobrar dose usual de casa).',
      'Enalapril 5mg VO 12/12h (manter conforme tolerância arterial).',
      'Carvedilol 6.25mg VO 12/12h (manter se já usava e PAM > 90).',
      'Acompanhar balanço hídrico rigoroso.',
      'Peso diário em jejum.',
      'Oxigenioterapia se SatO2 < 92%.'
    ],
    guidelines: 'O objetivo é a "euvolatização". Monitorar eletrólitos e função renal diariamente.'
  },
  {
    id: 'p3',
    title: 'Sepse - Protocolo das Primeiras 3 Horas',
    category: 'Emergência',
    items: [
      'Acesso venoso calibroso (2x).',
      'Coletar 2 pares de Hemoculturas (antes do ATB).',
      'Coletar Lactato Arterial/Venoso.',
      'Cristaloide 30mL/kg IV rápido (se hipotensão ou lactato >= 4).',
      'Ceftriaxona 2g IV (fazer na primeira hora).',
      'Oxigênio para SatO2 92-96%.',
      'Monitorização contínua (ECG, Oximetria, PAM).'
    ],
    guidelines: 'Se PAM < 65 após volume, iniciar Noradrenalina. Reavaliar lactato em 2-4h.'
  },
  {
    id: 'p4',
    title: 'Infecção do Trato Urinário - ITU (Cistite)',
    category: 'Infectologia',
    items: [
      'Nitrofurantoína 100mg VO 12/12h por 5 dias.',
      'OU Fosfomicina 3g VO dose única.',
      'Pyridium 200mg VO 8/8h se disúria intensa (máx 2 dias).',
      'Aumentar ingestão hídrica (+2L/dia).',
      'Higiene íntima adequada.'
    ],
    guidelines: 'Sempre avaliar sinais de Pielonefrite (Febre, Calafrios, Dor lombar/Giordano).'
  },
  {
    id: 'p5',
    title: 'Infarto Agudo do Miocárdio (IAM) - Conduta Inicial',
    category: 'Cardiologia',
    items: [
      'Aspirina (AAS) 200-300mg (mastigar).',
      'Clopidogrel 300mg VO (Ataque).',
      'Nitroglicerina (Isordil) 5mg SL se dor persistente (evitar se PAS < 90).',
      'Oxigênio se SatO2 < 90%.',
      'Morfina 2-4mg IV se dor refratária.',
      'Encaminhar p/ Hemodinâmica (Cateterismo) imediatamente.'
    ],
    guidelines: 'Tempo é músculo! Delta T ideal < 90 minutos para angioplastia primária.'
  },
  {
    id: 'p6',
    title: 'Crise Hipertensiva (Emergência - Nitroprussiato)',
    category: 'Emergência',
    items: [
      'Internação em UTI / Sala Vermelha.',
      'Monitorização invasiva de PA (PAI) preferencialmente.',
      'Nitroprussiato de Sódio (Nipride): Iniciar 0.3 a 0.5 mcg/kg/min.',
      'Titular dose para reduzir PAM em 20-25% na primeira hora.',
      'Monitorar intoxicação por tiocianato se uso > 48h ou IR.',
      'Trocar para medicação VO assim que estável.'
    ],
    guidelines: 'Não baixar a pressão bruscamente no AVC isquêmico (apenas se > 185/110 para trombólise).'
  },
  {
    id: 'p7',
    title: 'Crise Convulsiva (Estado de Mal Epiléptico)',
    category: 'Neurologia',
    items: [
      'Proteção de via aérea e aspiração se necessário.',
      'Oximetria e ECG contínuos.',
      'Diazepam 10mg IV lento (repetir 1x em 5min se necessário).',
      'Fosfenitoína 20mg/kg IV (Ataque) se persistir.',
      'Se refratário: Midazolam em bomba IV ou Propofol.',
      'Investigar causa (Glicemia, Eletrólitos, TC).'
    ],
    guidelines: 'Sempre testar glicemia capilar imediatamente. Considerar Tiamina se suspeita de Wernicke.'
  },
  {
    id: 'p8',
    title: 'Anafilaxia - Conduta Imediata',
    category: 'Emergência',
    items: [
      'ADRENALINA 1:1000 0.5mg IM (Vasto Lateral Coxa) IMEDIATO.',
      'Decúbito dorsal com membros inferiores elevados.',
      'Oxigenioterapia sob máscara.',
      'Expansão volêmica vigorosa (SF 0,9% 1-2L).',
      'Prometazina 50mg IM ou IV e Hidrocortisona 500mg IV.',
      'Observar por no mínimo 6-8h após remissão.'
    ],
    guidelines: 'A adrenalina é o tratamento definitivo. Não atrasar por outras medicações.'
  },
  {
    id: 'p9',
    title: 'Cetoacidose Diabética (Adulto)',
    category: 'Endocrinologia',
    items: [
      'Reposição volêmica: 1L de SF 0,9% na 1ª hora.',
      'Insulina Regular 0.1 UI/kg em bolus + 0.1 UI/kg/h em bomba.',
      'Reposição de Potássio: Adicionar se K+ < 5.2 (se < 3.3, adiar insulina).',
      'HCO3- apenas se pH < 6.9.',
      'Monitorar Glicemia (1/1h) e Eletrólitos (2/2h).',
      'Trocar para SG 5% quando glicemia < 250.'
    ],
    guidelines: 'Critério de resolução: pH > 7.3, HCO3 > 18, Anion Gap < 12.'
  },
  {
    id: 'p10',
    title: 'DPOC Descompensado',
    category: 'Pneumologia',
    items: [
      'Oxigenioterapia (Alvo SatO2: 88-92%).',
      'Fenoterol 10 gotas + Ipratrópio 20 gotas de 4/4h ou 6/6h.',
      'Prednisona 40mg VO por 5 dias.',
      'Amoxicilina + Clavulanato 875/125mg 12/12h (se sinais de infecção).',
      'VNI se acidose respiratória ou desconforto grave.'
    ],
    guidelines: 'Sinais de infecção: Aumento de escarro, purulência ou piora da dispneia.'
  },
  {
    id: 'p11',
    title: 'AVC Isquêmico - Protocolo de Trombólise',
    category: 'Neurologia',
    items: [
      'Acesso venoso calibroso (exclusivo).',
      'Manter PA < 185/110 mmHg para trombolisar.',
      'Alteplase (rtPA): 0.9 mg/kg (Max 90mg).',
      'Fazer 10% em bolus e 90% em infusão contínua em 60 min.',
      'Monitorar sinais de sangramento e nível de consciência.',
      'NÃO usar antiagregantes ou anticoagulantes nas primeiras 24h.'
    ],
    guidelines: 'Janela terapêutica: 4,5 horas do início dos sintomas.'
  },
  {
    id: 'p12',
    title: 'Meningite Bacteriana Aguda (Suspeita)',
    category: 'Infectologia',
    items: [
      'Hemoculturas + Coleta de Líquor (se sem contraindicação).',
      'Dexametasona 10mg IV (fazer ANTES ou junto com o ATB).',
      'Ceftriaxona 2g IV 12/12h.',
      'Vancomicina 1g a 1.5g IV 12/12h.',
      'Ampicilina 2g IV 4/4h (se > 50 anos ou imunossuprimido).',
      'Isolamento de gotículas por 24h pós início do ATB.'
    ],
    guidelines: 'Prioridade absoluta: início rápido do antibiótico.'
  },
  {
    id: 'p13',
    title: 'Crise de Asma / DPOC Exacerbado',
    category: 'Pneumologia',
    items: [
      'Salbutamol 100mcg: 4-10 jatos com espaçador a cada 20 min por 1h.',
      'Prednisona 40-50mg VO por 5-7 dias.',
      'Brometo de Ipratrópio 250mcg: 4 jatos de 20/20 min se grave.',
      'Oxigênio para manter SatO2 88-92% (DPOC) ou 93-95% (Asma).',
      'Reavaliar necessidade de Antibiótico (se escarro purulento).'
    ],
    guidelines: 'Monitorar FC, FR e SatO2 continuamente.'
  },
  {
    id: 'p14',
    title: 'Hemorragia Digestiva Alta (Varicosa)',
    category: 'Gastroenterologia',
    items: [
      'Terlipressina 2mg IV (ataque) -> 1mg a 2mg IV 4/4h.',
      'Ceftriaxona 1g IV 24/24h (profilaxia de PBE).',
      'Omeprazol 80mg IV (ataque) -> 40mg IV 12/12h.',
      'Dieta zero + Acesso venoso calibroso + Cristaloides.',
      'Solicitar Endoscopia Digestiva Alta (EDA) de urgência.'
    ],
    guidelines: 'Manter Hg entre 7 e 9 g/dL.'
  },
  {
    id: 'p15',
    title: 'Pielonefrite Aguda (Tratamento Hospitalar)',
    category: 'Infectologia',
    items: [
      'Ceftriaxona 1g a 2g IV 24/24h.',
      'Ciprofloxacino 400mg IV 12/12h (alternativa).',
      'Analgesia (Dipirona 1g IV) + Antieméticos.',
      'Hidratação vigorosa se sinais de sepse.',
      'Coletar Urocultura e Hemoculturas antes do ATB.'
    ],
    guidelines: 'Ajustar ATB conforme cultura após 48-72h.'
  },
  {
    id: 'p16',
    title: 'Fibrilação Atrial com Resposta Ventricular Alta',
    category: 'Cardiologia',
    items: [
      'Metoprolol 5mg IV lento (max 3 doses) OU Atenolol 50mg VO.',
      'Considerar Deslanosídeo 0.4mg IV se IC associada.',
      'Amiodarona 300mg IV em 1h (se controle de ritmo indicado).',
      'Avaliar Anticoagulação (Enoxaparina 1mg/kg 12/12h) conforme CHADS-VASc.',
      'Monitorar FC (Alvo < 110 bpm em repouso).'
    ],
    guidelines: 'Sempre descartar causas secundárias (Sepse, TEP, Hipertireoidismo).'
  },
  {
    id: 'p17',
    title: 'Celulite / Erisipela (Adulto)',
    category: 'Infectologia',
    items: [
      'Cefalexina 500mg VO 6/6h (Ambulatorial).',
      'OU Oxacilina 2g IV 4/4h (Hospitalar).',
      'Elevação do membro afetado.',
      'Dipirona 1g VO/IV SOS dor/febre.',
      'Demarcar área com caneta para monitorar progressão.'
    ],
    guidelines: 'Considerar cobertura p/ MRSA se fator de risco ou má evolução.'
  },
  {
    id: 'p18',
    title: 'Crise Convulsiva / Estado de Mal (Início)',
    category: 'Neurologia',
    items: [
      'Diazepam 10mg IV (ataque - max 20mg).',
      'Fenitoína 20mg/kg IV (fase de impregnação - max 50mg/min).',
      'Glicemia Capilar IMEDIATA.',
      'Oxigênio 10L/min em máscara + Proteção de via aérea.',
      'Monitorização cardíaca e oximetria.'
    ],
    guidelines: 'Cronometrar o tempo. Após 5 min de crise ativa = Estado de Mal Epiléptico.'
  },
  {
    id: 'p19',
    title: 'Dengue - Manejo Clínico (Grupo B/C)',
    category: 'Infectologia',
    items: [
      'Reposição volêmica oral vigorosa (SRO) 60mL/kg/dia.',
      'Paracetamol 500-750mg VO até 6/6h se dor ou febre.',
      'Dipirona 1g VO/IV até 6/6h (evitar se sinais de choque).',
      'NÃO usar AINEs ou AAS (Risco de sangramento).',
      'Monitorar sinais de alarme: Dor abdominal intensa, vômitos persistentes, queda brusca de plaquetas.',
      'Solicitar Hemograma completo + Hematócrito diário.'
    ],
    guidelines: 'Atentar para a fase crítica (defervescência da febre). O hematócrito em ascensão sugere hemoconcentração.'
  },
  {
    id: 'p20',
    title: 'Hipercalemia Aguda (K > 6.5 ou Alteração ECG)',
    category: 'Nefrologia',
    items: [
      'Gluconato de Cálcio 10% 10mL IV lento (3-5 min) - Se alteração ECG.',
      'Solução Polarizante: 10 UI Insulina Regular + 50g Glicose (SG 50% 100mL) IV em 20-30 min.',
      'Nebulização com Fenoterol 10-20 gotas (Beta-2 agonista shift transcelular).',
      'Furosemida 40-80mg IV se paciente não anúrico.',
      'Resina de Troca (Sorcal) 30g VO de 6/6h ou 8/8h.',
      'Considerar Hemodiálise de urgência se refratário ou IR grave.'
    ],
    guidelines: 'O Cálcio estabiliza a membrana, mas não reduz o potássio. Reavaliar K+ em 2h.'
  },
  {
    id: 'p21',
    title: 'Herpes Zoster (Adulto)',
    category: 'Infectologia',
    items: [
      'Aciclovir 800mg VO 5x ao dia por 7 dias.',
      'OU Valaciclovir 1g VO 8/8h por 7 dias.',
      'Gabapentina 300mg VO à noite (prevenção de neuralgia pós-herpética).',
      'Dipirona 1g + Tramadol 50mg se dor intensa.',
      'Compressas frias e limpeza local com SF 0,9%.',
      'Orientar isolamento de contato das lesões.'
    ],
    guidelines: 'Ideal iniciar tratamento nas primeiras 72h do surgimento das vesículas.'
  },
  {
    id: 'p22',
    title: 'Faringoamigdalite Bacteriana (Suspeita)',
    category: 'Otorrinolaringologia',
    items: [
      'Amoxicilina 500mg VO 8/8h por 10 dias.',
      'OU Penicilina G Benzatina 1.200.000 UI IM dose única.',
      'Ibuprofeno 600mg VO 8/8h por 3 dias (analgesia/anti-inflamatório).',
      'Nistatina solução (bochecho) se candidíase associada.',
      'Repouso e hidratação.'
    ],
    guidelines: 'Avaliar critérios de Centor. Se 4-5 pontos, probabilidade de Estrepto é > 50%.'
  },
  {
    id: 'p23',
    title: 'Crise de Gota Aguda',
    category: 'Reumatologia',
    items: [
      'Naproxeno 500mg VO 12/12h por 3-5 dias.',
      'Colchicina 0.5mg VO 8/8h (ou 12/12h conforme tolerância GI).',
      'Prednisona 30-40mg VO 1x ao dia se contraindicação a AINE.',
      'Repouso da articulação afetada.',
      'NÃO iniciar Alopurinol na crise aguda (se já usa, manter).'
    ],
    guidelines: 'Alvo de ácido úrico no seguimento: < 6.0 mg/dL.'
  },
  {
    id: 'p24',
    title: 'Pneumonia Adquirida na Comunidade (PAC)',
    category: 'Pneumologia',
    items: [
      'CURB-65: 0-1 (Ambulatorial), 2 (Enfermaria), >=3 (UTI).',
      'Ambulatorial: Amoxicilina + Clavulanato 875/125mg VO 12/12h por 5-7 dias.',
      'Enfermaria: Ceftriaxona 2g IV/dia + Azitromicina 500mg VO/dia por 7 dias.',
      'UTI: Ceftriaxona 2g IV/dia + Azitromicina 500mg IV/dia OU Levofloxacino 750mg IV/dia.',
      'Hidratação venosa se necessário.',
      'Sintomáticos: Dipirona 1g IV até 6/6h por dor ou febre.'
    ],
    guidelines: 'Considerar cobertura para MRSA ou Pseudomonas se fatores de risco presentes.'
  },
  {
    id: 'p25',
    title: 'Infecção do Trato Urinário (Cistite)',
    category: 'Urologia',
    items: [
       'Nitrofurantoína 100mg VO 12/12h por 5 dias.',
       'OU Fosfomicina 3g VO dose única.',
       'Fenazopiridina 200mg VO 8/8h por 2 dias (analgesia urinária).',
       'Aumento da ingesta hídrica.',
       'Coletar Urocultura + EAS antes de iniciar tratamento.'
    ],
    guidelines: 'Em gestantes, evitar quinolonas. Preferir Cefalexina ou Amoxicilina.'
  },
  {
    id: 'p26',
    title: 'Acidente Vascular Cerebral (Fase Aguda)',
    category: 'Neurologia',
    items: [
      'Cabeceira 0 graus (se tolerável).',
      'Monitorização contínua + O2 se SaO2 < 94%.',
      'Controle de PA: Manter < 185/110 se elegível para trombólise.',
      'Glicemia Capilar: Tratar hipo/hipermetabolismo.',
      'TC de Crânio (Sem Contraste) IMEDIATO.',
      'Trombólise (Alteplase) se < 4.5h do início e sem contraindicações.'
    ],
    guidelines: 'Tempo é Cérebro. NIHSS inicial é mandatório para prognóstico.'
  },
  {
    id: 'p27',
    title: 'Insuficiência Cardíaca Descompensada (Perfil B)',
    category: 'Cardiologia',
    items: [
      'Restrição hídrica (conforme gravidade).',
      'Furosemida 20-40mg IV 12/12h ou 8/8h (ajustar p/ diurese).',
      'Manter medicações de base (iECA/BRA, Beta-bloq) se estável hemodinamicamente.',
      'Dose de ataque de Espironolactona se não houver contraindicação.',
      'Oxigênio se SaO2 < 94%.',
      'Balanço hídrico rigoroso.'
    ],
    guidelines: 'Perfil B: Quente e Úmido. O objetivo é a volemia.'
  },
  {
    id: 'p28',
    title: 'DPOC Exacerbada',
    category: 'Pneumologia',
    items: [
      'NBZ com Fenoterol 10 gotas + Ipratrópio 20 gotas até 4/4h.',
      'Prednisona 40mg VO por 5 dias.',
      'Antibioticoterapia (Amoxicilina + Clavulanato ou Levofloxacino) por 5-7 dias.',
      'Oxigênio com alvo de SaO2 88-92% (evitar hiperóxia).',
      'VNI se acidose respiratória (pH < 7.35) ou dispneia persistente.'
    ],
    guidelines: 'O uso de O2 em excesso pode causar narcose por CO2 em pacientes retentores.'
  },
  {
    id: 'p29',
    title: 'Desidratação Grave (Plano C)',
    category: 'Emergência / Pediatria',
    items: [
      'SF 0,9% IV 20mL/kg correr em 20-30 min (repetir até estabilizar).',
      'OU Ringer Lactato IV 20mL/kg (preferível se disponível).',
      'Monitorar sinais vitais, perfusão periférica e nível de consciência.',
      'Se choque refratário, considerar expansão adicional e investigar causas.',
      'Passar para Plano B (Reidratação Oral) assim que o nível de consciência e hidratação melhorarem.'
    ],
    guidelines: 'A fase de expansão rápida é crucial para reverter o choque volêmico.'
  },
  {
    id: 'p30',
    title: 'Cetoacidose Diabética (CAD) - Manejo Inicial',
    category: 'Endocrinologia',
    items: [
      'Reposição Volêmica: SF 0,9% 1000mL IV na primeira hora.',
      'Insulina Regular 0,1 UI/kg IV (Bolus) seguida de 0,1 UI/kg/h (Bomba).',
      'OU Insulina Regular 0,15 UI/kg IV (Bolus) se não houver Bomba.',
      'Potássio: Repor 20-30mEq/L se K+ < 5,2 mEq/L (postergar insulina se K < 3,3).',
      'Monitorar Glicemia Capilar de 1/1h e Eletrólitos/Gasometria de 2/2h ou 4/4h.',
      'HCO3: Considerar se pH < 6,9.'
    ],
    guidelines: 'O objetivo é fechar o hiato aniônico (ânion-gap), não apenas baixar a glicemia.'
  },
  {
    id: 'p31',
    title: 'Edema Agudo de Pulmão (EAP)',
    category: 'Cardiologia',
    items: [
      'Sentar o paciente com pernas pendentes.',
      'Oxigênio (VNI preferencial se CPAP/BiPAP disponível).',
      'Furosemida 40-80mg IV (Bolus).',
      'Nitroglicerina (Tridil) se PAS > 110 mmHg (Nitropalato se crise hipertensiva severa).',
      'Morfina 2-4mg IV (se dor ou agitação intensa, com cautela).',
      'Investigar causa (IAM, Arritmia, Má adesão, Infecção).'
    ],
    guidelines: 'MOV: Monitorização, Oxigênio e Veia são mandatórios.'
  },
  {
    id: 'p32',
    title: 'Crise Convulsiva Pediátrica',
    category: 'Pediatria / Neurologia',
    items: [
      'Proteção de vias aéreas e lateralização do paciente.',
      'Diazepam 0,3-0,5mg/kg EV ou Intra-retal (Max: 10mg).',
      'OU Midazolam 0,2mg/kg IM ou Intra-nasal.',
      'Repetir após 5 min se crise persistir.',
      'Fenitoína 20mg/kg EV (ataque) se refratário a benzodiazepínicos.',
      'Verificar glicemia e temperatura (Febre?).'
    ],
    guidelines: 'Manejo agressivo após 5 min de crise ativa para evitar estado de mal.'
  },
  {
    id: 'p33',
    title: 'Reposição de Sódio (Hiponatremia)',
    category: 'Eletrólitos',
    items: [
      'Cálculo do Déficit: (Na desejado - Na atual) * 0.6 * Peso (Homem) ou 0.5 (Mulher).',
      'Velocidade: Não exceder 8-10mEq/L em 24h (Risco de Mielinólise Pontina).',
      'Urgência (Crise Convulsiva): NaCl 3% 1mL/kg IV em 10-20 min (até 3x).',
      'Monitorização horária de sódio plasmático em casos graves.'
    ],
    guidelines: 'A correção excessivamente rápida é extremamente perigosa.'
  },
  {
    id: 'p34',
    title: 'Hidratação de Manutenção (Holliday-Segar)',
    category: 'Pediatria / Geral',
    items: [
      'Até 10kg: 100mL / kg.',
      '10kg a 20kg: 1000mL + 50mL para cada kg > 10.',
      '> 20kg: 1500mL + 20mL para cada kg > 20.',
      'Eletrólitos usuais: NaCl 20% (2-4 mEq/100mL) + KCl 10% (1-2 mEq/100mL).',
      'Glicose 5% é o veículo padrão.'
    ],
    guidelines: 'Ajustar para febre, perdas digestivas ou atividade física intensa.'
  },
  {
    id: 'p35',
    title: 'Anafilaxia',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Início súbito + Envolvimento cutâneo (80%) + Comprometimento Resp/Circulatório.',
      'Adrenalina 1mg/mL: 0,3-0,5mg IM (Vasto Lateral) - Repetir a cada 5-15 min.',
      'Posição: Decúbito dorsal com pernas elevadas.',
      'Expansão Volêmica: SF 0,9% 1-2L rápido se hipotensão.'
    ],
    guidelines: 'Prioridade absoluta: Adrenalina IM e Vias Aéreas.'
  },
  {
    id: 'p36',
    title: 'AVC Isquêmico Agudo',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Déficit súbito focal (Escala de Cincinnati/NIHSS).',
      'Exame: TC de Crânio sem contraste imediata (descartar hemorragia).',
      'Controle de PA: Manter < 185/110 mmHg para trombólise.',
      'Trombólise: Alteplase se < 4,5h do início.'
    ],
    guidelines: 'Porta-TC deve ser menor que 20-25 minutos.'
  },
  {
    id: 'p39',
    title: 'Parada Cardiorrespiratória (PCR)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Ausência de pulso e movimentos respiratórios.',
      'CAB: Compressões (100-120/min) + Via Aérea + Boa Ventilação.',
      'Ritmos Chocáveis (FV/TVSP): Choque 200J + Adrenalina 1mg a cada 3-5min + Amiodarona 300mg.',
      'Ritmos Não Chocáveis (AESP/Assistolia): Adrenalina imediata + RCP contínua.'
    ],
    guidelines: 'Minimizar interrupções nas compressões torácicas.'
  },
  {
    id: 'p40',
    title: 'Apensicite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Dor em FID, Sinais de Blumberg e Rovsing positivos.',
      'Escore de Alvarado: Dor migratória, anorexia, náuseas, leucocitose.',
      'Exame: USG Abdomen ou TC com contraste.',
      'Conduta: Jejum, Hidratação, Antibioticoterapia (Cefoxitina) e Cirurgia.'
    ],
    guidelines: 'Não administrar analgésicos potentes antes da avaliação do cirurgião.'
  },
  {
    id: 'p41',
    title: 'Crise de Asma Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Sibilância, dispneia e uso de musculatura acessória.',
      'Manejo: Fenoterol (Berotec) + Ipratrópio (Atrovent) em nebulização a cada 20 min.',
      'Corticoide: Metilprednisolona 1-2mg/kg ou Prednisona VO.',
      'Sulfato de Magnésio: Considerar 2g IV em crises graves refratárias.'
    ],
    guidelines: 'Monitorar SatO2 (Alvo 93-95%) e Peak Flow.'
  },
  {
    id: 'p42',
    title: 'Pequenas Infecções / Resfriado',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Sintomas leves, estável, sem sinais de sepse ou instabilidade.',
      'Tratamento: Sintomáticos (Dipirona, Paracetamol), lavagem nasal.',
      'Orientações: Hidratação oral e repouso.',
      'Retorno: Se febre persistente > 3 dias ou dispneia.'
    ],
    guidelines: 'Educação do paciente sobre o caráter autolimitado da doença.'
  },
  {
    id: 'p43',
    title: 'Choque Séptico',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Necessidade de vasopressor para PAM > 65 + Lactato > 2.',
      'Pacote 1h: Colher culturas + Lactato + Antibiótico Amplo Espectro.',
      'Cristaloide: 30mL/kg (avaliar resposta volêmica - Delta PP ou VCI).',
      'Vasopressor: Noradrenalina se PAM < 65 após volume.'
    ],
    guidelines: 'O tempo para o início do antibiótico é o principal preditor de mortalidade.'
  },
  {
    id: 'p44',
    title: 'Edema Agudo de Pulmão (EAP)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Dispneia grave, estertores crepitantes, ortopneia.',
      'Manejo: VNI imediata (CPAP/BiPAP) - reduz necessidade de IOT.',
      'Vasodilatadores: Nitroglicerina (Tridil) se PAS > 110 mmHg.',
      'Diurético: Furosemida 40-80mg IV (dose-dobro se uso crônico).'
    ],
    guidelines: 'Evitar morfina rotineiramente; priorizar VNI e vasodilatação.'
  },
  {
    id: 'p45',
    title: 'Cetoacidose Diabética (CAD)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Glicemia > 250 + pH < 7.3 ou HCO3 < 18 + Cetonúria.',
      'Hidratação: SF 0,9% 1-1,5L na 1ª hora.',
      'Potássio: Não iniciar insulina se K < 3.3. Repor se K < 5.2.',
      'Insulina: 0,1 U/kg/h após início da hidratação.'
    ],
    guidelines: 'Monitorar glicemia capilar horária e eletrólitos a cada 2-4h.'
  },
  {
    id: 'p46',
    title: 'Tromboembolismo Pulmonar (TEP)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Score de Wells + D-Dímero (se Wells ≤ 4 ou improvável).',
      'Score de Wells (TEP): Sinais de TVP (+3), Outro diagnóstico menos provável (+3), FC > 100 (+1.5), Imobilização/Cirurgia (+1.5), TVP/TEP prévio (+1.5), Hemoptise (+1), Câncer (+1).',
      'Interpretação Wells: ≤ 4 (TEP improvável - pedir D-Dímero); > 4 (TEP provável - imagem direta).',
      'Imagem: Angio-TC de Tórax (padrão-ouro).',
      'Estabilidade: Se Instável (Choque) -> Trombólise.',
      'Se Estável: Anticoagulação (Enoxaparina 1mg/kg 12/12h).'
    ],
    guidelines: 'Classificar risco com score PESI ou PESI simplificado.'
  },
  {
    id: 'p47',
    title: 'Lombalgia Aguda',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Dor lombar sem sinais de alarme (Red Flags).',
      'Red Flags: Perda de força, anestesia em sela, trauma, câncer, febre.',
      'Manejo: AINES (Ibuprofeno/Naproxeno) + Ciclobenzaprina.',
      'Orientações: Manter-se ativo; evitar repouso absoluto prolongado.'
    ],
    guidelines: 'Exames de imagem não são indicados na ausência de Red Flags.'
  },
  {
    id: 'p48',
    title: 'Hemorragia Digestiva Alta (HDA)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Hematêmese ou Melena + Instabilidade hemodinâmica.',
      'Manejo: Acesso Calibroso (x2), Expansão Volêmica, IBP IV (Omeprazol 80mg bolus).',
      'Varicosa: Terlipressina ou Octreotide + Ceftriaxona.',
      'Conduta: Endoscopia Digestiva Alta (EDA) em < 24h (ou imediata se instável).'
    ],
    guidelines: 'Estabilizar hemodinâmica antes da endoscopia.'
  },
  {
    id: 'p49',
    title: 'Trauma Grave (ATLS)',
    category: 'Vermelho (Emergência)',
    items: [
      'A: Via Aérea com proteção de coluna cervical.',
      'B: Respiração e Ventilação (O2, avaliar Pneumotórax).',
      'C: Circulação com controle de hemorragia e Reposição volêmica.',
      'D: Disfunção Neurológica (GCS, pupilas).',
      'E: Exposição e Controle de Hipotermia.'
    ],
    guidelines: 'Seguir rigorosamente a sequência do ABCDE.'
  },
  {
    id: 'p50',
    title: 'Queimadura Grave',
    category: 'Vermelho (Emergência)',
    items: [
      'Critérios: > 20% SCQ (Adulto), > 10% (Criança) ou vias aéreas.',
      'Fórmula de Parkland: 4mL x Peso x %SCQ (dar metade nas primeiras 8h).',
      'Via Aérea: Suspeitar de lesão por inalação se fuligem em orofaringe.',
      'Analgesia: Morfina ou Fentanil IV.'
    ],
    guidelines: 'Utilizar Ringer Lactato como fluido de escolha.'
  },
  {
    id: 'p51',
    title: 'Pneumonia (PAC)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Tosse, febre, dispneia e infiltrado no Rx de Tórax.',
      'Escore CURB-65: Confusão, Ureia > 50, Resp > 30, B (PA < 90/60), 65 anos.',
      'CURB 0-1: Ambulatório (Amoxiclav). CURB 2: Enfermaria. CURB 3+: UTI.',
      'Antibiótico: Ceftriaxona + Azitromicina (se internação).'
    ],
    guidelines: 'Iniciar antibiótico na primeira hora se sinais de sepse.'
  },
  {
    id: 'p52',
    title: 'Infecção Urinária (ITU/Pielo)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Disúria, polaciúria + Giordano positivo (se Pielo).',
      'Exames: Urina 1 + Urocultura.',
      'Antibiótico (Cistite): Nitrofurantoína ou Fosfomicina.',
      'Antibiótico (Pielo): Ciprofloxacino ou Ceftriaxona (se internado).'
    ],
    guidelines: 'Gestantes e idosos exigem atenção redobrada e internação precoce.'
  },
  {
    id: 'p54',
    title: 'Dissecção Aguda de Aorta',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Dor torácica súbita, "rasgando", com irradiação para dorso.',
      'Sinal: Diferença de PA entre membros (> 20 mmHg).',
      'Controle de FC e PA: Beta-bloqueador IV (Esmolol) + Nitroprussiato.',
      'Metas: FC < 60 bpm e PAS entre 100-120 mmHg.',
      'Imagem: Angio-TC de Aorta ou Ecocardio Transesofágico.'
    ],
    guidelines: 'Prioridade: Controle da frequência cardíaca antes da redução da PA.'
  },
  {
    id: 'p55',
    title: 'Hemorragia Intracraniana (AVCh)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Cefaleia súbita, vômitos em jato, rebaixamento sensorial.',
      'Controle de PA: Manter PAS entre 140-160 mmHg.',
      'Reversão: Se uso de varfarina (Complexo Protrumbínico ou Vit K).',
      'Neurocirurgia: Avaliar drenagem se hematoma > 3cm ou deterioração clínica.'
    ],
    guidelines: 'Evitar hipotensão; manter normotermia e normoglicemia.'
  },
  {
    id: 'p56',
    title: 'GECA (Gastroenterocolite Aguda)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Diarreia, vômitos, dor abdominal.',
      'Avaliação: Sinais de desidratação (Sede, turgor skin, diurese).',
      'Tratamento: Reidratação Oral (SRO) ou Venosa (SF 0,9%) se vômitos incoercíveis.',
      'Sintomáticos: Ondansetrona (8mg), Dipirona (1g).',
      'Antibiótico: Apenas se disenteria grave (Ciprofloxacino).'
    ],
    guidelines: 'Ondansetrona reduz necessidade de hidratação venosa em crianças.'
  },
  {
    id: 'p57',
    title: 'Cefaleia Primária (Enxaqueca)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Dor pulsátil, unilateral, com náuseas/vômitos e foto/fonofobia.',
      'Protocolo Abortivo: Dipirona 1-2g IV + Metoclopramida 10mg IV + Cetoprofeno 100mg IV.',
      'Resgate (Opcional): Clorpromazina (Amplictil) 12.5-25mg IV diluído.',
      'Red Flags: Início súbito (Thunderclap), febre, déficit focal, > 50 anos.'
    ],
    guidelines: 'Cefaleia Thunderclap exige TC para descartar HSA!'
  },
  {
    id: 'p58',
    title: 'Colecistite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Dor em hipocôndrio direito, febre, Sinal de Murphy positivo (Interrupção da inspiração profunda à palpação do rebordo costal direito).',
      'Critérios de Tokyo (Diagnóstico): (A) Sinais de inflamação local (Murphy, dor/massa em HCD) + (B) Sinais sistêmicos (Febre, PCR elevada, Leucocitose) + (C) Imagem (USG).',
      'Exame: USG de Abdome Superior (parede espessada, cálculo impactado).',
      'Manejo: Jejum, Hidratação, Analgesia, Antibiótico (Cipro + Metro).',
      'Cirurgia: Colecistectomia precoce (ideal < 72h).'
    ],
    guidelines: 'Murphy ultrasonográfico é mais sensível que o físico.'
  },
  {
    id: 'p59',
    title: 'Trombose Venosa Profunda (TVP)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Edema assimétrico, dor, empastamento de panturrilha.',
      'Escore de Wells: Pontuação para probabilidade pré-teste.',
      'Exame: Doppler Venoso de membros inferiores.',
      'Tratamento: Enoxaparina (1mg/kg 12/12h) ou DOACs (Rivaroxabana).'
    ],
    guidelines: 'Não realizar Homan pois pode desprender trombo (baixo valor clínico).'
  },
  {
    id: 'p60',
    title: 'Cefaleia Tensional',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Dor em aperto, bilateral, leve/moderada, sem náuseas.',
      'Tratamento: Dipirona ou Paracetamol.',
      'Orientações: Gerenciamento de estresse, ergonomia, sono.',
      'Retorno: Se mudar padrão de dor ou sintomas neurológicos.'
    ],
    guidelines: 'Evitar o uso excessivo de analgésicos (risco de cefaleia rebote).'
  },
  {
    id: 'p61',
    title: 'Entorse / Trauma Leve',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: História de trauma, dor localizada, estabilidade articular.',
      'Protocolo RICE: Repouso, Gelo, Compressão, Elevação.',
      'Analgesia: AINES (Ibuprofeno/Cetoprofeno) por 3-5 dias.',
      'Imagem: Apenas se critérios de Ottawa para tornozelo/pé.'
    ],
    guidelines: 'Evitar calor local nas primeiras 48-72 horas.'
  },
  {
    id: 'p62',
    title: 'Dengue (Protocolos B, C e D)',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Febre (2-7 dias) + 2 de: Náuseas, Exantema, Mialgia/Artralgia, Cefaleia/Dor retro-orbitária, Petéquias ou Prova do Laço positiva.',
      'Prova do Laço: Insuflar manguito na média entre PAS/PAD por 5 min (adulto) ou 3 min (criança). Positivo se > 20 petéquias (adulto) ou > 10 (criança) em quadrado de 2.5cm.',
      'Critérios de Gravidade: Extravasamento plasmático, sangramento grave ou disfunção orgânica.',
      'Sinais de Alarme (Grupo C): Dor abdominal intensa, vômitos persistentes, hipotensão postural, hepatomegalia, aumento do hematócrito.',
      'Tratamento Grupo C: Hidratação imediata SF 0,9% 10mL/kg na 1ª hora. Repetir se necessário.',
      'Tratamento Grupo D (Choque): SF 0,9% 20mL/kg em 20 min. Reavaliar a cada 15-30 min.',
      'Exames: Hemograma completo, Transaminases, Prova do Laço, Sorologia/NS1.'
    ],
    guidelines: 'NÃO usar AINES ou Salicilatos. Monitorar plaquetopenia e hematócrito.'
  },
  {
    id: 'p63',
    title: 'Crise Convulsiva / Estado de Mal',
    category: 'Vermelho (Emergência)',
    items: [
      'Fase Inicial (0-5 min): Estabilização (ABC), O2, acesso venoso, Glicemia Capilar.',
      'Fase 1 (5-20 min - Benzodiazepínicos): Diazepam 10mg IV (0,15mg/kg) ou Midazolam 10mg IM.',
      'Fase 2 (20-40 min - Anticonvulsivantes): Fenitoína 20mg/kg IV (máx 50mg/min) ou Levetiracetam 60mg/kg.',
      'Fase 3 (40-60 min - Refratário): Sedação com Midazolam (bolus + BIC) ou Propofol. Preparar IOT.'
    ],
    guidelines: 'O atraso no tratamento aumenta o risco de dano neurológico permanente.'
  },
  {
    id: 'p64',
    title: 'Pancreatite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico (2 de 3): Dor abdominal típica (em barra), Amilase ou Lipase > 3x o limite superior, Imagem compatível (TC/USG).',
      'Critérios de Ranson: Avaliar gravidade na admissão (Idade > 55, Leucocitos > 16k, Glicose > 200, LDH > 350, AST > 250) e em 48h.',
      'Classificação (Atlanta): Leve (sem falência), Moderada (falência < 48h), Grave (> 48h).',
      'Tratamento: Hidratação agressiva (Ringer Lactato 250-500mL/h se não houver contraindicação).',
      'Analgesia: Opióides (Tramadol ou Meperidina - evitar Morfina teoricamente por esfíncter de Oddi).',
      'Nutrição: Dieta zero inicial, mas reiniciar precocemente via oral ou enteral.'
    ],
    guidelines: 'Antibioticoterapia de rotina NÃO é indicada, apenas se evidência de infecção/necrose.'
  },
  {
    id: 'p65',
    title: 'Cólica Nefrética (Urolitíase)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Dor lombar súbita com irradiação para fossa ilíaca/testículo + hematúria.',
      'Analgesia: AINES IV (Tenoxicam 40mg ou Cetoprofeno 100mg) - Primeira escolha!',
      'Adjuvantes: Dipirona 2g IV + Morfina 2-5mg se dor refratária.',
      'Expulsivo: Tansulosina 0,4mg VO (facilita saída de cálculos distais).',
      'Exame: TC de abdome sem contraste (Urotomografia) é o padrão-ouro.'
    ],
    guidelines: 'Sinais de alarme: Febre (obstrução infectada), rim único, anúria.'
  },
  {
    id: 'p66',
    title: 'Estado Hiperglicêmico Hiperosmolar (EHH)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Glicemia > 600 + Osmolaridade > 320 + pH > 7.3.',
      'Hidratação: SF 0,9% 1L/h inicial. Reposição de déficit hídrico lento (risco de edema cerebral).',
      'Insulina: 0,1 U/kg/h após início da hidratação, manter potássio > 3.3.',
      'Monitorização: Glicemia horária, eletrólitos, função renal e nível de consciência.'
    ],
    guidelines: 'A mortalidade no EHH é superior à da Cetoacidose.'
  },
  {
    id: 'p67',
    title: 'Crise de Gota Aguda',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Monoartrite súbita (geralmente podagra), hiperemia e calor local.',
      'Tratamento: AINES (Indometacina ou Naproxeno) ou Colchicina (1,2mg inicial + 0,6mg após 1h).',
      'Corticoide: Prednisona 30-40mg/dia se contraindicação a AINES/Colchicina.',
      'Prevenção: NÃO iniciar ou suspender Alopurinol durante a crise.'
    ],
    guidelines: 'Gelo local pode auxiliar na redução da inflamação.'
  },
  {
    id: 'p68',
    title: 'Conjuntivite',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Olho vermelho, secreção, sensação de corpo estranho.',
      'Viral (Mais comum): Secreção serosa, linfonodo pré-auricular, autolimitada.',
      'Bacteriana: Secreção purulenta persistente, pálpebras grudadas ao acordar.',
      'Manejo: Compressas frias, lágrimas artificiais. Antibiótico tópico (Tobramicina) se bacteriana.'
    ],
    guidelines: 'Orientações de higiene rigorosa para evitar transmissão (uso de toalhas separadas).'
  },
  {
    id: 'p69',
    title: 'Surto Psicótico / Agitação',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Agitação psicomotora, risco de auto ou heteroagressividade.',
      'Contenção Física: Apenas se necessário para segurança, com equipe treinada.',
      'Manejo Químico: Haloperidol 5mg + Prometazina 25mg IM (Fenergan/Haldol).',
      'Alternativa: Midazolam 5-10mg IM ou Olanzapina 5-10mg IM.',
      'Monitorização: Atentar para distonia aguda e sedação excessiva.'
    ],
    guidelines: 'Priorizar abordagem verbal antes de qualquer contenção.'
  },
  {
    id: 'p70',
    title: 'Eclâmpsia',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Crise convulsiva em gestante (> 20 sem) com pré-eclâmpsia.',
      'Controle Convulsivo: Sulfato de Magnésio (Esquema Zuspan): 4g IV ataque + 1g/h manut.',
      'Antídoto: Gluconato de Cálcio 1g IV (se sinais de intoxicação - reflexo/FR).',
      'Controle de PA: Hidralazina 5mg IV se PAS > 160 ou PAD > 110.',
      'Conduta: Resolução da gestação após estabilização materna.'
    ],
    guidelines: 'NÃO usar Diazepam ou Fenitoína como primeira linha.'
  },
  {
    id: 'p71',
    title: 'Torção Testicular',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Dor testicular súbita, reflexo cremastérico ausente, testículo elevado.',
      'Sinal de Phren Negativo: Dor não alivia com a elevação do testículo.',
      'Exame: Doppler de Bolsa Escrotal (ausência de fluxo arterial).',
      'Tratamento: Exploração cirúrgica de emergência (Janela de 6h para salvar o órgão).'
    ],
    guidelines: 'A suspeita clínica em jovens deve levar à cirurgia imediata, sem aguardar exames se indisponíveis.'
  },
  {
    id: 'p72',
    title: 'Gravidez Ectópica Rota',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Atraso menstrual + Dor abdominal súbita + Choque/Síncope.',
      'Exame: Beta-hCG positivo + Útero vazio ao USG + Líquido livre em fundo de saco.',
      'Manejo: Expansão volêmica agressiva, tipagem sanguínea, reserva de concentrado.',
      'Tratamento: Laparotomia exploradora de urgência (Salpingectomia).'
    ],
    guidelines: 'Causa importante de choque hipovolêmico em mulheres em idade fértil.'
  },
  {
    id: 'p73',
    title: 'Epistaxe',
    category: 'Verde / Amarelo',
    items: [
      'Manejo Inicial: Compressão direta da asa do nariz (narinas fechadas) por 10-15 min.',
      'Tópico: Algodão embebido em vasoconstritor (Adrenalina 1:10.000).',
      'Tamponamento: Anterior (se refratário) ou Posterior (se sangramento vindo da orofaringe).',
      'Orientações: Evitar assoar o nariz e exposição ao calor.'
    ],
    guidelines: 'Controlar a pressão arterial, pois hipertensão dificulta a cessação do sangramento.'
  },
  {
    id: 'p74',
    title: 'Síncope',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Perda súbita e transitória da consciência e tônus postural com recuperação espontânea.',
      'Escore de San Francisco: Avaliar risco (HIC: História de ICC, Hematócrito < 30%, ECG alterado, Dispneia, PAS < 90).',
      'ECG: Fundamental para descartar BAVT, síndrome de Brugada, QT longo ou Wolff-Parkinson-White.',
      'Tratamento: Posicionamento (Trendelenburg), hidratação venosa se hipovolemia, tratamento da causa base.',
      'Sinal de Alarme: Síncope durante esforço ou em decúbito.'
    ],
    guidelines: 'A maioria é vasovagal, mas causas cardíacas têm alta mortalidade.'
  },
  {
    id: 'p75',
    title: 'Crise de Ansiedade / Pânico',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Palpitações, sudorese, tremor, sensação de asfixia, medo de morrer.',
      'Exclusão: SEMPRE descartar causas orgânicas primeiro (IAM, TEP, Arritmia, Hipoglicemia).',
      'Manejo Não Farmacológico: Técnicas de respiração controlada, ambiente calmo.',
      'Manejo Farmacológico: Benzodiazepínico (Lorazepam 1-2mg ou Alprazolam 0.5mg SL/VO).',
      'Encaminhamento: Psiquiatria/Psicologia para seguimento ambulatorial.'
    ],
    guidelines: 'Não subestime a dor torácica em pacientes ansiosos; faça o ECG.'
  },
  {
    id: 'p76',
    title: 'Intoxicação por Opióides',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Tríade (Depressão respiratória + Mioses + Coma).',
      'Suporte: Manter via aérea pérvia, ventilação com pressão positiva (Ambu) se necessário.',
      'Antídoto (Naloxona): 0,4mg IV/IM. Repetir a cada 2-3 min até melhora da ventilação espontânea.',
      'Monitorização: Risco de edema agudo de pulmão não cardiogênico pó-naloxona.'
    ],
    guidelines: 'O objetivo da Naloxona é a ventilação adequada, não necessariamente o despertar total.'
  },
  {
    id: 'p77',
    title: 'Insuficiência Cardíaca (Perfil B)',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: "Quente e Úmido" (Edema periférico, estertores, turgência jugular, boa perfusão).',
      'Tratamento: Furosemida 40-80mg IV (dose-dobro se uso prévio).',
      'Vasodilatação: Nitrato SL ou Isossorbida IV se PAS > 110 mmHg para reduzir pré-carga.',
      'Restrição: Ingesta hídrica e salina rigorosa na fase aguda.',
      'Avaliação: Avaliar fator descompensador (Isquemia, Arritmia, Má adesão, Infecção).'
    ],
    guidelines: 'Perfil B é o tipo mais comum de descompensação na emergência.'
  },
  {
    id: 'p78',
    title: 'Acidentes por Bothrops (Jararaca)',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Dor local, edema, equimose e sangramentos (gengivorragia).',
      'Exames: Tempo de Coagulação (TC) - costuma estar alterado (> 30 min).',
      'Tratamento Específico: Soro Antibotrópico (SAB) - n. de ampolas conforme gravidade (3 a 12).',
      'Suporte: Hidratação venosa vigorosa para prevenir insuficiência renal aguda (necrose tubular).',
      'Contraindicação: Não fazer torniquete, incisão ou sucção local.'
    ],
    guidelines: 'Monitorar rigorosamente a função renal e o tempo de coagulação.'
  },
  {
    id: 'p79',
    title: 'Celulite e Erisipela',
    category: 'Verde / Amarelo',
    items: [
      'Diagnóstico: Área eritematosa, quente e dolorosa. Erisipela (bordas bem definidas, superficial).',
      'Tratamento (Ambulatorial): Cefalexina 500mg 6/6h por 7-10 dias.',
      'Tratamento (Hospitalar): Oxacilina 2g 4/4h ou Cefazolina 1-2g 8/8h IV.',
      'Medidas Subjacentes: Elevação do membro afetado e tratamento de portas de entrada (micoses).'
    ],
    guidelines: 'Internar se sinais de sepse, extremidades da idade ou falha ao tratamento VO.'
  },
  {
    id: 'p80',
    title: 'Otite Média Aguda (OMA)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Otalgia súbita, abaulamento da membrana timpânica, febre.',
      'Analgesia: Ibuprofeno ou Paracetamol. Gotas otológicas só se membrana íntegra.',
      'Antibiótico: Amoxicilina 500mg 8/8h por 7-10 dias (Adulto/Crianças > 2 anos com sintomas graves).',
      'Watchful Waiting: Em crianças > 2 anos sem gravidade, pode-se observar por 48h.'
    ],
    guidelines: 'Evitar limpeza excessiva do conduto auditivo durante a fase aguda.'
  },
  {
    id: 'p81',
    title: 'Sinusite Aguda (Rinossinusite)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Obstrução nasal, secreção purulenta, dor facial por > 10 dias.',
      'Tratamento Sintomático: Lavagem nasal com SF 0,9% abundante + Analgésicos.',
      'Tratamento Bacteriano: Se sintomas > 10 dias ou "double sickening" (piora após melhora).',
      'Antibiótico: Amoxicilina-Clavulanato ou Amoxicilina isolada por 5-7 dias.'
    ],
    guidelines: 'A maioria das rinossinusites agudas é viral; antibióticos são superutilizados.'
  },
  {
    id: 'p82',
    title: 'Escabiose (Sarna)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Prurido intenso (piora à noite), pápulas/sulcos em áreas de dobras.',
      'Tratamento Tópico: Permetrina 5% creme (aplicar do pescoço aos pés, retirar após 8-14h).',
      'Tratamento Sistêmico: Ivermectina 200mcg/kg dose única (repetir após 7-14 dias).',
      'Medidas Gerais: Tratar todos os contatantes simultaneamente. Lavar roupas em água quente.'
    ],
    guidelines: 'O prurido pode persistir por semanas após o tratamento eficaz (prurido pós-escabiótico).'
  },
  {
    id: 'p83',
    title: 'Taquicardia Supraventricular (TSV)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Taquicardia regular, QRS estreito, ausência de onda P visível.',
      'Manobra Vagal: Manobra de Valsalva modificada ou massagem de seio carotídeo (se sem sopro).',
      'Adenosina: 6mg IV rápido em "flush". Se não reverter, 12mg IV.',
      'Instável (Hipotensão/Choque): Cardioversão elétrica sincronizada imediata (50-100J).'
    ],
    guidelines: 'Sempre manter o paciente monitorizado e com material de ventilação acessível.'
  },
  {
    id: 'p84',
    title: 'Bradiarritmias Sintomáticas',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: FC < 50 bpm + Hipotensão, Alteração mental, Dor torácica ou Choque.',
      'Atropina: 1mg IV a cada cada 3-5 min (máx 3mg).',
      'Marcapasso Transcutâneo: Iniciar se Atropina ineficaz ou BAV de alto grau.',
      'Drogas Adjuvantes: BIC de Dopamina (5-20 mcg/kg/min) ou Adrenalina (2-10 mcg/min).'
    ],
    guidelines: 'Não atrasar o marcapasso transcutâneo em pacientes instáveis com BAV de 2º grau tipo II ou BAVT.'
  },
  {
    id: 'p85',
    title: 'Hipercalemia Grave',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: K+ > 6,5 mEq/L ou alterações no ECG (Onda T em tenda, perda de P, QRS alargado).',
      'Estabilização de Membrana: Gluconato de Cálcio 10% 10-30mL IV em 5-10 min.',
      'Shift de Potássio: Solução Polarizante (Insulina 10U + Glicose 50% 100mL) + Nebulização com Fenoterol.',
      'Eliminação: Furosemida 40-80mg IV ou Resinas de troca (Poliestirenosulfonato de Cálcio).',
      'Definitivo: Hemodiálise de urgência se refratário ou insuficiência renal grave.'
    ],
    guidelines: 'O Gluconato de Cálcio não baixa o potássio, apenas protege o coração temporariamente.'
  },
  {
    id: 'p86',
    title: 'Neutropenia Febril',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Febre (> 38.3ºC uma vez ou > 38ºC por 1h) + Neutrófilos < 500.',
      'Avaliação: Escore MASCC (Identificar baixo vs alto risco).',
      'Exames: Hemoculturas (central e periférica), Rx Tórax, EAS, Culturas de secreções.',
      'Antibiótico: Iniciar em MENOS de 1 hora. Cefepime 2g ou Piperacilina-Tazo 4,5g IV.',
      'Manejo: Considerar Vancomicina se infecção de cateter ou instabilidade hemodinâmica.'
    ],
    guidelines: 'Não aguardar o resultado de todos os exames para iniciar o antibiótico.'
  },
  {
    id: 'p87',
    title: 'Cetoacidose Alcoólica',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: História de libação alcoólica + Vômitos + Acidose com GAP elevado + Cetose.',
      'Glicemia: Geralmente normal ou levemente aumentada.',
      'Tratamento: Soro Glicosado 5% em SF 0,9% para repor reserva de glicogênio e expansão.',
      'Tiamina: 100-300mg IV ANTES da glicose para prevenir Encefalopatia de Wernicke.',
      'Eletrólitos: Reposição de potássio e fósforo se necessário.'
    ],
    guidelines: 'A cetoacidose alcoólica costuma responder rápido à glicose e hidratação.'
  },
  {
    id: 'p88',
    title: 'Malária Grave / Complicada',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico (Gravidade): Parasitemia alta, icterícia, insuficiência renal, alteração consciência.',
      'Tratamento 1ª Linha: Artesunato IV (2.4 mg/kg nos tempos 0, 12, 24h e depois 1x ao dia).',
      'Suporte: Manejo de complicações (Hipoglicemia, Anemia grave, Edema pulmonar).',
      'Notificação: Doença de notificação compulsória imediata.'
    ],
    guidelines: 'Artesunato é superior à quinina no tratamento da malária grave.'
  },
  {
    id: 'p89',
    title: 'Obstrução Intestinal',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Dor abdominal, vômitos, distensão, parada de eliminação de flatos/fezes.',
      'Exame: Rx de Abdome (Níveis hidroaéreos, empilhamento de moedas).',
      'Manejo Inicial: Jejum absoluto, Sonda Nasogástrica aberta para descompressão.',
      'Hidratação: Correção de distúrbios hidroeletrolíticos e reposição volêmica vigorosa.',
      'Abordagem: Cirúrgica se sinais de sofrimento de alça (febre, leucocitose, dor persistente).'
    ],
    guidelines: 'A tomografia de abdome ajuda a identificar a causa e o ponto de transição.'
  },
  {
    id: 'p90',
    title: 'Cólica Biliar / Colelitíase',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Dor em hipocôndrio direito/epigástrio, após refeição gordurosa ou à noite.',
      'Exame: USG de Abdome Superior (Cálculos na vesícula sem sinais de inflamação da parede).',
      'Conduta: Jejum momentâneo, Analgesia (Buscopan Composto ou Tenoxicam).',
      'Encaminhamento: Cirurgia eletiva se sintomas recorrentes.'
    ],
    guidelines: 'Diferenciar de Colecistite (dor persistente > 6h, febre, Murphy positivo).'
  },
  {
    id: 'p91',
    title: 'Herpes Zoster',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Vesículas sobre base eritematosa seguindo um dermátomo, dor intensa (neurite).',
      'Tratamento Viral: Aciclovir 800mg 5x/dia por 7 dias (ideal iniciar em < 72h).',
      'Analgesia: Dipirona, AINES, Gabapentina ou Pregabalina para dor neuropática.',
      'Cuidado: Manter as lesões limpas e secas. Risco de transmissão para quem não teve catapora.'
    ],
    guidelines: 'Iniciar antivirais via oral mesmo após 72h se houver novas lesões ou em imunossuprimidos.'
  },
  {
    id: 'p92',
    title: 'Escorpionismo (Escorpião)',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico (Gravidade): Manifestações sistêmicas (vômitos, sudorese, arritmias, choque).',
      'Bloqueio Local: Lidocaína 2% (sem vasoconstritor) para alívio da dor excruciante.',
      'Tratamento Específico: Soro Antiescorpiônico ou Antiaracnídico (2 a 6 ampolas conforme gravidade).',
      'Monitorização: Risco de Edema Agudo de Pulmão e insuficiência cardíaca aguda.'
    ],
    guidelines: 'Casos leves requerem apenas analgesia e observação por 6-12 horas.'
  },
  {
    id: 'p93',
    title: 'Abcesso Cutâneo',
    category: 'Verde (Pouco Urgente)',
    items: [
      'Diagnóstico: Coleção purulenta flutuante, dor, calor, rubor.',
      'Tratamento de Escolha: Incisão e Drenagem Ampla sob anestesia local.',
      'Antibiótico: Apenas se celulite perilesional extensa, comorbidades ou sinais sistêmicos.',
      'Antibiótico Opção: Cefalexina ou SMX-TMP (se suspeita de MRSA comunitário).'
    ],
    guidelines: 'Drenagem é o tratamento definitivo; antibiótico sem drenagem não resolve abcessos.'
  },
  {
    id: 'p94',
    title: 'Hérnia Inguinal Encarcerada',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Abaulamento inguinal doloroso e irredutível.',
      'Manejo: Tentar redução manual (se < 6h, sem sinais de peritonite e paciente estável).',
      'Redução: Sedação leve + Posição de Trendelenburg + Manobra suave de redução.',
      'Cirurgia de Urgência: Se falha na redução ou sinais de estrangulamento (isquemia).'
    ],
    guidelines: 'Não forçar redução se houver sinais óbvios de isquemia ou necrose de alça.'
  },
  {
    id: 'p95',
    title: 'Hemorragia em Hemofílico',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Sangramento muscular (psoite), articular (hemartrose) ou vindo de trauma.',
      'Tratamento: Reposição de Fator VIII ou Fator IX o mais rápido possível!',
      'Dose: Elevar nível do fator para 50-100% conforme o sítio do sangramento.',
      'Terapia Adjuvante: Ácido Tranexâmico (se sangramento mucoso) e Gelo local.'
    ],
    guidelines: 'Protocolo "Trate primeiro, pergunte depois": repor fator antes mesmo do Rx/TC.'
  },
  {
    id: 'p96',
    title: 'Insuficiência Adrenal Aguda',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Hipotensão refratária a volume, febre, náuseas, hiponatremia, hipercalemia.',
      'Tratamento Imediato: Hidrocortisona 100mg IV em bolus, seguida de 50mg 6/6h.',
      'Volume: SF 0,9% 1-2 litros rápido para expansão.',
      'Manutenção: Soro glicosado para prevenir hipoglicemia severa.'
    ],
    guidelines: 'Frequentemente desencadeada por infecção ou estresse cirúrgico em pacientes em uso de corticoide crônico.'
  },
  {
    id: 'p97',
    title: 'Encefalopatia Hepática',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Alteração de sono, asterixe (flapping), confusão mental, hálito hepático.',
      'Identificar Fator Precipitante: Constipação, HDA, Infecção (PBE), Desidratação.',
      'Lactulona: 20-30mL VO ou via SNG 3-4x/dia (objetivo: 2-3 evacuações pastosas/dia).',
      'Antibiótico: Rifaximina 550mg 12/12h (se recidiva) ou Neomicina como alternativa.'
    ],
    guidelines: 'Não restringir proteínas na dieta; garantir aporte calórico adequado.'
  },
  {
    id: 'p98',
    title: 'Delirium no Idoso',
    category: 'Amarelo (Urgente)',
    items: [
      'Diagnóstico: Início agudo de confusão mental, flutuante, desatenção (CAM).',
      'Causas (DEMENTIA): Drugs, Electrolytes, Metabolic, Environment, Nutrition, Trauma, Infection, Alcohol.',
      'Tratamento Não Farmacológico: Orientação temporal, presença de familiar, ambiente iluminado.',
      'Sintomático (Se agitação grave): Haloperidodol 0.5-1mg VO/IM/IV (evite doses altas).'
    ],
    guidelines: 'Evitar Benzodiazepínicos em idosos com Delirium (piora o quadro/paradoxal).'
  },
  {
    id: 'p99',
    title: 'SCA sem Supra de ST (AI / IAMSSST)',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Dor torácica pushes/anginosa + Elevação de biomarcador (Troponina I ou T ultrassensível) ou alterações de ECG Isquêmicas (Inversão simétrica de T ou Infra do segmento ST ≥ 0.5 mm).',
      'Estratificação de Risco (Escore GRACE): Avalia mortalidade com base em FC, PAS, Creatinina, Desvio de ST, Parada cardíaca na admissão, Idade e Troponina. Score > 140 indica alto risco.',
      'Escore TIMI Risk: Idade ≥ 65 (1), ≥ 3 FR coronários (HAS/DM/DLP/Tabagismo/Familiar) (1), Estenose coronária prévia ≥ 50% (1), Desvio de ST (1), Angina grave nas últimas 24h (1), Uso de AAS nos últimos 7d (1) e Marcadores positivos (1). Alto risco se ≥ 5 pontos.',
      'Momento do Cateterismo (Estratégia Invasiva):',
      '  - Imediata (< 2 horas): Se instabilidade hemodinâmica/choque cardiogênico, dor refratária ao tratamento, arritmias ventriculares graves ou insuficiência cardíaca aguda.',
      '  - Precoce (< 24 horas): Se Troponina elevada ou alterações de ST dinâmicas ou escore GRACE > 140.',
      '  - Retardada (< 72 horas): Se escore GRACE entre 109 e 140 ou DM/DRC/Insuficiência hepática/Angioplastia prévia.',
      'Terapia de Ataque: AAS 200mg mastigável + Clopidogrel 300mg VO + Estatina de alta potência (Atorvastatina 40-80mg VO).',
      'Anticoagulação: Enoxaparina 1mg/kg SC de 12/12h (reduzir para 1mg/kg 1x/dia se ClCr < 30) ou Fondaparinux 2.5mg SC 1x/dia.'
    ],
    guidelines: 'Está terminantemente contraindicado o uso de trombolíticos em infarto sem supra de ST ou angina instável devido ao perigo de hemorragia e reoclusão indesejada.'
  },
  {
    id: 'p100',
    title: 'Mal Epiléptico Convulsivo',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Crise tônico-clônica > 5 min ou sucessivas sem recuperação entre elas.',
      'ABC: Cabeceira elevada, O2 masc, Glicemia Capilar (descartar hipo).',
      '1ª Linha: Midazolam 10mg IM ou Diazepam 10mg IV (se acesso disponível).',
      '2ª Linha: Fenitoína 20mg/kg IV (lentamente) ou Ácido Valproico 40mg/kg.'
    ],
    guidelines: 'O atraso no controle gera lesão neuronal citotóxica irreversível.'
  },
  {
    id: 'p101',
    title: 'Hipertensão Arterial Sistêmica (HAS)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: PA ≥ 140/90 mmHg em duas ocasiões ou PA ≥ 180/110 mmHg em visita única.',
      'Exames Iniciais: Creatinina, Potássio, Glicemia jejum, Lipidograma, EAS, ECG.',
      'Estágio 1 (140-159/90-99): Iniciar monoterapia (Tiazídico, iECA, BRA ou BCC).',
      'Estágio 2 (≥ 160/100): Iniciar combinação de duas drogas (iECA/BRA + BCC ou iECA/BRA + Tiazídico).',
      'Metas: < 140/90 para maioria; < 130/80 se alto risco CV ou DM.'
    ],
    guidelines: 'Enfatizar mudanças no estilo de vida (DASH, redução de sal, atividade física).'
  },
  {
    id: 'p102',
    title: 'Diabetes Mellitus Tipo 2 (DM2)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Glicemia jejum ≥ 126, HbA1c ≥ 6.5%, ou Glicemia aleatória ≥ 200 + sintomas.',
      'Rastreio de Complicações: Fundo de olho (anual), Pesquisa de microalbuminúria, Exame dos pés.',
      'Tratamento Inicial: Metformina 500-2500mg/dia + Mudança de Estilo de Vida.',
      'Segunda Linha: Inibidores de SGLT2 (Empagliflozina) ou análogos de GLP-1 (Liraglutida) se doença CV estabelecida.',
      'Insulinização: Considerar se HbA1c > 9% ou sintomas de catabolismo (perda peso).'
    ],
    guidelines: 'Monitorar HbA1c a cada 3-6 meses e ajustar terapia conforme meta.'
  },
  {
    id: 'p103',
    title: 'Hipotireoidismo',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: TSH elevado + T4 livre baixo (Hipotireoidismo Clínico). TSH de referência normal: 0.45 a 4.5 mIU/L.',
      'Subclínico: TSH elevado + T4 livre normal. Tratar obrigatoriamente se: TSH ≥ 10 mIU/L, gestantes, anticorpos anti-TPO fortemente positivos, ou presença de sintomas clássicos marcantes.',
      'Tratamento (Jovens): Levotiroxina sódica (L-T4) 1.6 mcg/kg/dia pela manhã em jejum seco.',
      'Tratamento (Idosos/Coronariopatas): Iniciar levotiroxina com dose conservadora de 25 mcg VO ao dia (evita indução de arritmia ou angina); reavaliar e aumentar 12.5-25 mcg a cada 6 semanas.',
      'Administração: Exclusivamente em jejum, 30 a 60 minutos antes do café ou ingestão de outras medicações.',
      'Monitoramento: Repetir dosagem de TSH em 6 a 8 semanas para ajustes posológicos.'
    ],
    guidelines: 'A meta terapêutica de TSH em idosos ou cardiopatas é mais permissiva (geralmente entre 1.0 e 5.0 mIU/L) para prevenir tireotoxicoses iatrogênicas.'
  },
  {
    id: 'p104',
    title: 'Anemia Ferropriva',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico (VCM): VCM < 80 fL (Microcítica); Ferritina < 30 ng/mL (é o marcador mais sensível e específico para depleção de ferro pré-anêmica).',
      'Diagnóstico Diferencial (Doença Crônica): Ferritina normal ou elevada (> 100 ng/mL), saturação de transferrina baixa (< 20%), e presença de quadro inflamatório/infeccioso crônico de base.',
      'Investigação: SEMPRE investigar sangramento ativo oculto. Em homens e mulheres pós-menopausa, realizar Colonoscopia + Endoscopia de rastreio.',
      'Tratamento: Sulfato Ferroso 300mg (equivalente a 60mg de ferro elementar) - Administrar 1 comprimido VO, 1 vez ao dia (ou em dias alternados, o que demonstrou igual eficácia posológica com menos efeitos colaterais gastrointestinais, devido ao declínio do pico de hepcidina).',
      'Otimização: Administrar com estômago vazio (1h antes das refeições) com suco cítrico (vitamina C) para acidificar o meio; evitar uso concomitante com antiácidos, cálcio ou café.',
      'Duração: Manter a reposição por 3 a 6 meses após a normalização dos níveis de Hemoglobina para reposição completa dos estoques de ferritina.'
    ],
    guidelines: 'A eficácia da reposição oral é comprovada pelo aumento dos reticulócitos em 5 a 10 dias de tratamento correto.'
  },
  {
    id: 'p105',
    title: 'Dislipidemia',
    category: 'UBS (Atenção Básica)',
    items: [
      'Avaliação: Calcular Risco Cardiovascular (Escore de Risco Global/Framingham).',
      'Tratamento Não Farmacológico: Dieta pobre em gorduras saturadas e trans, exercícios.',
      'Tratamento Farmacológico (Estatinas): Atorvastatina, Rosuvastatina ou Simvastatina.',
      'Metas de LDL: < 50 (Risco muito alto), < 70 (Alto risco), < 100 (Risco intermediárrio).',
      'Controle: Repetir perfil lipídico 4 a 12 semanas após início e depois anualmente.'
    ],
    guidelines: 'Monitorar transaminases e sintomas musculares (mialgia) após início da estatina.'
  },
  {
    id: 'p106',
    title: 'Tabagismo',
    category: 'UBS (Atenção Básica)',
    items: [
      'Abordagem: Avaliar motivação, grau de dependência (Escore de Fagerström).',
      'Terapia Cognitivo-Comportamental: Sessões em grupo ou individuais.',
      'Farmacoterapia: Terapia de Reposição de Nicotina (Goma/Adesivo) + Bupropiona 150-300mg/dia.',
      'Contraindicações Bupropiona: Histórico de convulsão, transtorno alimentar, uso de IMAO.',
      'Acompanhamento: Marcar "Dia D" (parada total) na segunda semana de medicação.'
    ],
    guidelines: 'A combinação de TCC e medicamentos dobra a chance de sucesso.'
  },
  {
    id: 'p107',
    title: 'Depressão Unipolar',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico (DSM-5): Humos deprimido ou anedonia por > 2 semanas + 4 sintomas (sono, apetite, culpa, energia, concentração, psicomotor, ideação).',
      'Rastreio: PHQ-2 seguido de PHQ-9 se positivo.',
      'Tratamento 1ª Linha: ISRS (Sertralina 50-200mg, Fluoxetina 20-60mg ou Escitalopram 10-20mg).',
      'Acompanhamento: Início da resposta em 2-4 semanas; melhora total em 8-12 semanas.',
      'Manutenção: Manter por 6-12 meses após remissão do primeiro episódio.'
    ],
    guidelines: 'Sempre avaliar risco de suicídio. Encaminhar se risco alto ou refratariedade.'
  },
  {
    id: 'p108',
    title: 'Transtorno de Ansiedade Generalizada (TAG)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Ansiedade excessiva na maioria dos dias por ≥ 6 meses sobre diversos eventos.',
      'Sintomas Associados: Inquietude, fadiga, dificuldade de concentração, irritabilidade, tensão muscular.',
      'Tratamento 1ª Linha: ISRS ou Inibidores da Recaptação de Serotonina e Noradrenalina (Venlafaxina).',
      'Tratamento Adjuvante: Benzodiazepínicos apenas por curto prazo (2-4 semanas) se sintomas graves.',
      'Psicoterapia: TCC é altamente eficaz para TAG.'
    ],
    guidelines: 'Evitar o uso crônico de benzodiazepínicos devido ao risco de dependência e quedas (especialmente idosos).'
  },
  {
    id: 'p109',
    title: 'Osteoartrite (OA)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Dor articular mecânica, rigidez matinal curta (< 30 min), crepitação, limitação funcional.',
      'Exame de Imagem: Rx com redução do espaço articular, esclerose subcondral e osteófitos.',
      'Manejo Não Farmacológico: Redução de peso, exercícios aeróbicos e de fortalecimento.',
      'Analgesia: Paracetamol 500-1000mg 8/8h ou AINES tópicos; AINES orais por curto prazo se necessário.',
      'Opção Invasiva: Injeção intra-articular de corticoide se dor persistente na osteoartrite de joelho.'
    ],
    guidelines: 'Geralmente não requer exames laboratoriais na apresentação típica.'
  },
  {
    id: 'p110',
    title: 'Osteoporose',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico (Densometria): T-score ≤ -2.5 no fêmur ou coluna Lombar.',
      'Rastreio: Mulheres ≥ 65 anos ou Homens ≥ 70 anos (ou mais cedo se fatores de risco).',
      'Tratamento 1ª Linha: Bisfosfonatos (Alendronato 70mg/semana ou Risedronato 35mg/semana).',
      'Suplementação: Cálcio (1000-1200mg/dia total) + Vitamina D (800-2000 UI/dia).',
      'Orientações: Tomar bisfosfonato em jejum com água comum e permanecer ereto por 30 min.'
    ],
    guidelines: 'Avaliar risco de fratura pelo escore FRAX.'
  },
  {
    id: 'p111',
    title: 'Psoríase Vulgar',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Placas eritemato-escamosas bem delimitadas, simétricas, escala prateada.',
      'Locais Comuns: Cotovelos, joelhos, couro cabeludo, região sacral.',
      'Tratamento Tópico: Corticosteroides de alta potência (Clobetasol) ou Calcipotriol.',
      'Xampu: Alcatrão de hulha para couro cabeludo.',
      'Encaminhamento: Se > 10% de superfície corporal atingida ou envolvimento articular (Artrite Psoriásica).'
    ],
    guidelines: 'Psoríase é uma doença inflamatória sistêmica com maior risco cardiovascular.'
  },
  {
    id: 'p112',
    title: 'Vitamina D (Deficiência)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: 25(OH)D < 20 ng/mL (Deficiência) ou 20-29 ng/mL (Insuficiência).',
      'Alvos: > 20 ng/mL para população geral; 30-60 ng/mL para grupos de risco (idosos, gestantes, osteoporose).',
      'Ataque: 50.000 UI/semana por 8 semanas se deficiência grave.',
      'Manutenção: 800-2.000 UI/dia conforme a necessidade.',
      'Fontes: Exposição solar (15 min/dia) e alimentos específicos.'
    ],
    guidelines: 'Não rastrear Vitamina D rotineiramente na população assintomática de baixo risco.'
  },
  {
    id: 'p113',
    title: 'Asma (Manutenção)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico (Protocolo GINA): Sintomas respiratórios característicos (sibilos, dispneia, opressão torácica, tosse) com variação temporal e de intensidade, associados a limitação variável do fluxo aéreo (Espirometria com VEF1/CVF < 0.75-0.80 e broncodilatação positiva com aumento do VEF1 > 12% e > 200mL).',
      'Classificação GINA: Avaliar controle nas últimas 4 semanas (Sintomas diurnos > 2x/sem? Despertar noturno? Uso de resgate > 2x/sem? Limitação de atividade? Controlada: 0 itens; Parcialmente controlada: 1-2 itens; Não controlada: 3-4 itens).',
      'Etapas 1 e 2 (Dose Baixa SOS): Budesonida/Formoterol (200/6 mcg ou 100/6 mcg) - 1 inalação apenas SOS (resgate e anti-inflamatório simultâneos).',
      'Etapa 3 (Manutenção + Resgate SMART): Budesonida/Formoterol (200/6 mcg) - 1 inalação de 12/12h fixa + 1 inalação SOS se sintomas (máximo 8 inalações/dia).',
      'Etapa 4 (Dose Média Fixa): Budesonida/Formoterol (200/6 mcg) - 2 inalações de 12/12h fixas + SABA (Salbutamol 100mcg 1-2 jatos) SOS se sintomas.',
      'Técnica Inalatória: Revisar o uso do dispositivo (aerossol ou pó seco), incentivar adesão e tratar comorbidades (DRGE, rinite).'
    ],
    guidelines: 'O uso de SABA (Salbutamol) isolado sem corticoide inalatório está formalmente contraindicado pela GINA devido ao risco de óbito e exacerbações graves.'
  },
  {
    id: 'p114',
    title: 'DPOC (Manutenção)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico (Espirometria): VEF1/CVF < 0.70 pós-broncodilatador.',
      'Classificação (GOLD): Avaliar gravidade da obstrução (1-4) e sintomas/vulnerabilidade (A, B, E).',
      'Tratamento Grupo A: Qualquer broncodilatador (curta ou longa).',
      'Tratamento Grupo B: LAMA (Tiotrópio) ou LABA (Formoterol/Salmeterol).',
      'Tratamento Grupo E: LAMA + LABA; considerar CI se Eosinófilos > 300.'
    ],
    guidelines: 'A cessação do tabagismo é a intervenção mais eficaz para reduzir a progressão da doença.'
  },
  {
    id: 'p115',
    title: 'Hanseníase',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Manchas com hipoestesia, perda de pelos e diminuição da sudorese; espessamento de nervos periféricos.',
      'Classificação (Paucibacilar): Até 5 lesões de pele. Tratamento: Rifampicina + Dapsona por 6 meses.',
      'Classificação (Multibacilar): > 5 lesões ou baciloscopia positiva. Tratamento: Rifampicina + Dapsona + Clofazimina por 12 meses.',
      'Exames: Baciloscopia de linfa (se disponível) e teste de sensibilidade.',
      'Contatos: SEMPRE avaliar contatos domiciliares e aplicar BCG se indicado.'
    ],
    guidelines: 'A alta é dada por cura clínica após completar o número de doses da PQT.'
  },
  {
    id: 'p116',
    title: 'Gastroenterocolite Aguda (GECA) / Diarreia',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Aumento do número de dejeções e/ou alteração da consistência (líquida). Pode haver vômitos e febre.',
      'Sinais de Desidratação: Mucosas secas, turgor diminuído, olhos encovados, saliva espessa.',
      'Plano A (Sem Desidratação): Reidratação oral em casa (SRO), manter dieta habitual, zinco se criança.',
      'Plano B (Desidratação Leve/Moderada): Reidratação oral na unidade (SRO 50-100mL/kg em 4h).',
      'Plano C (Desidratação Grave): Hidratação venosa imediata (Fase de Expansão: SF 0.9%).'
    ],
    guidelines: 'Não utilizar antidiarréicos (Loperamida) em quadros infecciosos/disentéricos.'
  },
  {
    id: 'p117',
    title: 'Cefaleia Tensional',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Dor em aperto, holocraniana, intensidade leve a moderada, sem náuseas.',
      'Analgesia Simples: Dipirona 1g ou Paracetamol 750mg - 1000mg.',
      'Segunda Linha: AINES (Ibuprofeno 600mg ou Naproxeno 500mg).',
      'Prevenção (Se crônica): Amitriptilina 10-25mg à noite ou Nortriptilina.'
    ],
    guidelines: 'Identificar gatilhos como estresse, privação de sono e má postura.'
  },
  {
    id: 'p118',
    title: 'Enxaqueca (Migrânea)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Dor pulsátil, unilateral, com fotofobia, fonofobia e náuseas/vômitos.',
      'Critérios ICHD-3: ≥ 5 crises durando 4-72h + 2 de: Unilateral, Pulsátil, Moderada/Grave, Piora com esforço + 1 de: Náusea/Vômito ou Foto/Fonofobia.',
      'Crise Leve/Moderada: AINES + Antieméticos (Metoclopramida 10mg).',
      'Crise Moderada/Grave: Triptanos (Sumatriptano 6mg SC ou 50-100mg VO).',
      'Prevenção: Propranolol, Topiramato ou Valproato (se crises frequentes > 3-4/mês).'
    ],
    guidelines: 'O uso excessivo de analgésicos (> 10-15 dias/mês) pode causar cefaleia de rebote.'
  },
  {
    id: 'p119',
    title: 'Infecção das Vias Aéreas Superiores (IVAS)',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Coriza, obstrução nasal, tosse, dor de garganta leve e febre.',
      'Etiologia: Diferenciar de Gripe (Influenza) que apresenta sintomas sistêmicos graves (mialgia intensa, febre alta, prostração).',
      'Etiologia: 90% viral (Rinovírus, Coronavírus, Adenovírus).',
      'Tratamento: Sintomáticos (Lavagem nasal com SF 0.9%, Analgésicos, Hidratação).',
      'Orientações: Repouso, boa alimentação e sinais de alerta (dispneia).'
    ],
    guidelines: 'Antibióticos não têm indicação em resfriados comuns; o tratamento é de suporte.'
  },
  {
    id: 'p120',
    title: 'Pneumonia Adquirida na Comunidade (PAC)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Tosse, febre, dor pleurítica e infiltrado novo no Rx de tórax.',
      'Score CURB-65: Confusão, Ureia > 50, Respiração > 30, Blood Pressure < 90/60, Idade >= 65.',
      'Tratamento Ambulatorial (0-1 ponto): Amoxicilina 500mg - 1g 8/8h ou Azitromicina.',
      'Tratamento Hospitalar (>= 2 pontos): Amoxicilina + Clavulanato + Azitromicina ou Ceftriaxone + Claritromicina.'
    ],
    guidelines: 'Avaliar oximetria de pulso; se Sat < 92%, internação obrigatória.'
  },
  {
    id: 'p121',
    title: 'Infecção do Trato Urinário (Cistite)',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Disúria, polaciúria, urgência miccional e dor suprapúbica.',
      'Urocultura: Indicada em gestantes, idosos, homens, sintomas recorrentes ou complicados.',
      'Tratamento (Não Complicado): Nitrofurantoína 100mg 12/12h (5 dias) ou Fosfomicina 3g dose única.',
      'Alternativa: Sulfametoxazol + Trimetoprima 800/160mg 12/12h (3 dias).'
    ],
    guidelines: 'Em homens, sempre investigar causas obstrutivas ou prostatite associada.'
  },
  {
    id: 'p122',
    title: 'Crise de Ansiedade / Ataque de Pânico',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Taquicardia, sudorese, tremor, sensação de asfixia, medo de morrer ou enlouquecer.',
      'Abordagem: Ambiente calmo, técnica de respiração diafragmática, validação dos sintomas.',
      'Sintomático (Se necessário): Diazepam 5-10mg VO ou Midazolam 1.5-2.5mg (se agitação extrema).',
      'Encaminhamento: Iniciar seguimento em UBS/Saúde Mental para tratamento crônico (ISRS/Psicoterapia).'
    ],
    guidelines: 'Descartar causas orgânicas (SCA, Arritias, TEP) se a apresentação for atípica.'
  },
  {
    id: 'p123',
    title: 'Lombalgia Aguda',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Dor na região lombar, geralmente após esforço físico, sem sinais de alerta.',
      'Sinais de Alerta (Red Flags): Trauma, perda de peso, febre, déficit motor, anestesia em sela.',
      'Tratamento: Analgésicos (Paracetamol/Dipirona) + AINES por curto prazo (3-5 dias).',
      'Adjuvantes: Relaxantes musculares (Ciclobenzaprina 5-10mg) se houver espasmo importante.'
    ],
    guidelines: 'Evitar repouso absoluto; manter atividade física conforme tolerância.'
  },
  {
    id: 'p124',
    title: 'Cólica Nefrética (Urolitíase)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Dor súbita, intensa, em cólica, na região lombar com irradiação para flanco/genitália.',
      'Analgesia na Emergência: Tenoxicam 40mg IV ou Diclofenaco 75mg IM (se não houver contraindicação renal).',
      'Opióides: Tramadol 50-100mg IV se dor refratária.',
      'Expulsivo (Se cálculo < 10mm): Tansulosina 0.4mg/dia + Hidratação vigorosa.'
    ],
    guidelines: 'Solicitar TC de abdome sem contraste se dúvida diagnóstica ou refratariedade.'
  },
  {
    id: 'p125',
    title: 'Conjuntivite Infecciosa',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Olhos vermelhos, secreção (purulenta ou aquosa), sensação de corpo estranho.',
      'Viral: Secreção aquosa, associada a IVAS, auto-limitada.',
      'Bacteriana: Secreção purulenta abundante, "olho grudado" ao acordar.',
      'Tratamento: Higiene com SF 0.9% gelado; Colírio de Cloranfenicol ou Tobramicina (se bacteriana).'
    ],
    guidelines: 'Altamente contagiosa; orientar lavagem frequente das mãos e não compartilhar toalhas.'
  },
  {
    id: 'p126',
    title: 'Anafilaxia Grave',
    category: 'Ficha Vermelha (Emergência)',
    items: [
      'Diagnóstico: Reação alérgica sistêmica rápida com hipotensão, broncoespasmo ou edema de glote.',
      'Tratamento Imediato: Adrenalina (1mg/mL) 0.5mg IM no vasto lateral do fêmur. Repetir 5-15 min se necessário.',
      'Suporte: Cabeceira baixa (Trendelenburg), Oxigênio masc 10-15L/min, Hidratação vigorosa (SF 0.9%).',
      'Adjuvantes: Hidrocortisona 200-500mg IV + Anti-histamínicos (Difenidramina ou Prometazina).'
    ],
    guidelines: 'A Adrenalina IM deve ser a primeira medida; não retardar por falta de acesso venoso.'
  },
  {
    id: 'p127',
    title: 'Edema Agudo de Pulmão (EAP)',
    category: 'Ficha Vermelha (Emergência)',
    items: [
      'Diagnóstico: Dispneia súbita, ortopneia, estertores crepitantes até ápices, SatO2 baixa.',
      'Manejo Inicial: Posição sentada, VNI (CPAP/BiPAP) se disponível, O2 suplementar.',
      'Medicamentoso: Furosemida 40-80mg IV + Nitroglicerina (Tridil) se PAS > 100.',
      'Monitorização: ECG 12 derivações (buscar causa isquêmica/arritmia).'
    ],
    guidelines: 'Evitar morfina rotineiramente; priorizar VNI e vasodilatadores se PA permitir.'
  },
  {
    id: 'p128',
    title: 'Apêndicite Aguda (Suspeita)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Dor periumbilical que migra para FID, anorexia, náuseas, sinal de Blumberg +.',
      'Score de Alvarado: Avaliar necessidade de imagem (Ultrassom ou TC de abdome).',
      'Manejo: Jejum, hidratação venosa, analgesia (evitar AINES se possível).',
      'Antibiótico: Ciprofloxacino + Metronidazol ou Ceftriaxone + Metronidazol (pré-operatório).'
    ],
    guidelines: 'Se Blumberg positivo e sinais sistêmicos, encaminhar para avaliação cirúrgica imediata.'
  },
  {
    id: 'p129',
    title: 'Hemorragia Digestiva Alta (HDA)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Hematêmese, melena ou enterorragia (se sangramento vultoso).',
      'Estabilização (ABC): Dois acessos calibrosos, cristaloides, reservar tipagem sanguínea.',
      'Medicamentoso: IBP (Omeprazol 80mg ataque + 8mg/h) + Terlipressina (se suspeita de varizes).',
      'Procedimento: Endoscopia Digestiva Alta (EDA) de urgência (após estabilização).'
    ],
    guidelines: 'A meta de Hemoglobina é 7.0 - 9.0 g/dL na maioria dos pacientes.'
  },
  {
    id: 'p130',
    title: 'Meningite Bacteriana (Suspeita)',
    category: 'Ficha Vermelha (Emergência)',
    items: [
      'Diagnóstico: Cefaleia, febre, rigidez de nuca, alteração de consciência ou petéquias.',
      'Manejo Imediato: Coleta de hemoculturas e início rápido de antibiótico (não atrasar pelo líquor).',
      'Antibioticoterapia: Ceftriaxone 2g IV 12/12h + Vancomicina (conforme perfil local).',
      'Adjuvante: Dexametasona 10mg IV ANTES ou junto com a primeira dose de antibiótico.'
    ],
    guidelines: 'Realizar TC de crânio antes da punção lombar se houver sinais de HIC ou déficit focal.'
  },
  {
    id: 'p131',
    title: 'Faringite Bacteriana (Amigdalite)',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Dor de garganta intensa, febre, exsudato purulento nas amígdalas, linfonodos cervicais dolorosos.',
      'Critérios de Centor: Avaliar probabilidade de Streptococo (Febre, Ausência tosse, Exsudato, Idade).',
      'Tratamento 1ª Linha: Penicilina Benzatina (Benzetacil) 1.200.000 UI IM dose única.',
      'Alternativa: Amoxicilina 500mg 8/8h por 10 dias ou Azitromicina (se alérgico).'
    ],
    guidelines: 'O tratamento visa prevenir a febre reumática e complicações supurativas.'
  },
  {
    id: 'p132',
    title: 'Escabiose (Sarna)',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Prurido intenso (piora à noite), pápulas e sulcos em dobras, mãos e axilas.',
      'Tratamento Tópico: Permetrina 5% creme (aplicar do pescoço para baixo, deixar 8-12h, repetir 1 semana).',
      'Tratamento Oral: Ivermectina 200mcg/kg (dose única, repetir em 1-2 semanas).',
      'Orientações: Tratar todos os contatos domiciliares simultaneamente; lavar roupas de cama a 60°C.'
    ],
    guidelines: 'O prurido pode persistir por semanas após o tratamento eficaz (prurido pós-escabiótico).'
  },
  {
    id: 'p133',
    title: 'Otite Média Aguda (OMA)',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Otalgia súbita, plenitude auricular, abaulamento da membrana timpânica.',
      'Analgesia: Dipirona ou Ibuprofeno para controle da dor.',
      'Antibiótico: Amoxicilina 500mg - 1g 8/8h por 7 a 10 dias.',
      'Alternativa: Amoxicilina + Clavulanato se falha terapêutica ou uso prévio de antibiótico.'
    ],
    guidelines: 'Em adultos, a OMA costuma ser uma complicação de IVAS ou disfunção tubária.'
  },
  {
    id: 'p134',
    title: 'Impetigo',
    category: 'Ficha Verde (Não Urgente)',
    items: [
      'Diagnóstico: Vesículas ou pápulas que evoluem para crostas melicéricas ("cor de mel").',
      'Tratamento Tópico (Localizado): Mupirocina 2% pomada 3x/dia por 5-7 dias.',
      'Tratamento Oral (Extenso): Cefalexina 500mg 6/6h por 7 dias.',
      'Cuidados: Limpeza das lesões com sabão neutro e remoção suave das crostas.'
    ],
    guidelines: 'Monitorar para glomerulonefrite pós-estreptocócica (raro mas possível).'
  },
  {
    id: 'p135',
    title: 'Crise Hipertensiva (Urgência)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: PA >= 180/120 mmHg sem lesão de órgão-alvo aguda.',
      'Manejo: Repouso em local calmo por 30 min e reavaliação. Tratar ansiedade ou dor associada.',
      'Medicamentoso: Anti-hipertensivos orais (Captopril 25-50mg ou Clonidina 0.1-0.2mg).',
      'Objetivo: Redução gradual da PA em 24-48h.'
    ],
    guidelines: 'Não baixar o nível de PA abruptamente; perigo de hipoperfusão cerebral ou coronária.'
  },
  {
    id: 'p136',
    title: 'Uretrite (Gonorréia e Clamídia)',
    category: 'UBS / IST',
    items: [
      'Diagnóstico: Corrimento uretral purulento ou mucoide, disúria e prurido uretral.',
      'Tratamento 1ª Linha: Ceftriaxona 500mg IM + Azitromicina 1g VO (ambos dose única).',
      'Parceiros: Tratar todos os parceiros dos últimos 60 dias.',
      'Aviso: Abstinência sexual por 7 dias após o tratamento.'
    ],
    guidelines: 'O tratamento empírico deve cobrir ambos os agentes simultaneamente.'
  },
  {
    id: 'p137',
    title: 'Sífilis (Primária e Secundária)',
    category: 'UBS / IST',
    items: [
      'Primária: Cancro duro (úlcera única, indolor, bordas limpas) + adenopatia regional.',
      'Secundária: Roséolas sifilíticas, placas mucosas, condiloma plano, linfadenopatia generalizada.',
      'Tratamento: Penicilina Benzativa 2.4 milhões UI IM (dose única para primária/secundária).',
      'Monitoramento: VDRL trimestral até cura (queda de 2 titulações em 6 meses).'
    ],
    guidelines: 'Solicitar testes para HIV e Hepatites; tratar parceiros sexuais.'
  },
  {
    id: 'p138',
    title: 'Herpes Simples Genital (Crise)',
    category: 'UBS / IST',
    items: [
      'Diagnóstico: Vesículas agrupadas sobre base em eritema que evoluem para úlceras dolorosas.',
      'Tratamento (Primoinfecção): Aciclovir 400mg 3x/dia por 7 a 10 dias.',
      'Tratamento (Recorrência): Aciclovir 400mg 3x/dia por 5 dias.',
      'Cuidados: Higiene local e evitar relações sexuais durante a fase ativa.'
    ],
    guidelines: 'O uso de aciclovir tópico tem eficácia muito limitada comparado ao oral.'
  },
  {
    id: 'p139',
    title: 'Prostatite Aguda',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'Diagnóstico: Febre, calafrios, disúria e dor perineal/retal intensa.',
      'Exame: Próstata edemaciada e dolorosa ao toque retal (não massagear!).',
      'Antibiótico 1ª Linha: Ciprofloxacino 500mg 12/12h ou Levofloxacino 500mg/dia.',
      'Duração: Requer tratamento prolongado (geralmente 4 semanas).'
    ],
    guidelines: 'Sempre coletar urocultura e hemoculturas se houver sinais de sepse.'
  },
  {
    id: 'p140',
    title: 'Dermatite Seborreica',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Placas eritematosas com descamação amarelada e gordurosa.',
      'Áreas Afetadas: Couro cabeludo, face (sobrancelhas, sulco nasogeniano), tórax.',
      'Tratamento (Couro): Xampu com Cetoconazol 2% ou Piritionato de zinco.',
      'Tratamento (Face): Hidrocortisona creme ou Cetoconazol creme por curto período.'
    ],
    guidelines: 'Doença crônica com períodos de melhora e exacerbação (estresse, frio).'
  },
  {
    id: 'p141',
    title: 'Escabiose (Sarna)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Prurido intenso (piora à noite), pápulas e sulcos em dobras e mãos.',
      'Tratamento Tópico: Permetrina 5% creme (pescoço para baixo, deixar 12h, repetir em 1 semana).',
      'Tratamento Oral: Ivermectina 200mcg/kg (dose única, repetir em 1-2 semanas).',
      'Orientações: Tratar todos os contatos e ferver roupas de cama/banho.'
    ],
    guidelines: 'O prurido pode persistir por 2-3 semanas mesmo após o tratamento efetivo.'
  },
  {
    id: 'p142',
    title: 'Sinusite Aguda Bacteriana',
    category: 'Ficha Verde / UBS',
    items: [
      'Diagnóstico: Dor facial, rinorreia purulenta e obstrução nasal por > 10 dias.',
      'Sinais de Gravidade: Edema periorbital, cefaleia intensa, febre alta persistente.',
      'Tratamento: Amoxicilina 500mg 8/8h ou Amoxicilina + Clavulanato.',
      'Adjuvantes: Lavagem nasal com SF 0.9% e analgésicos.'
    ],
    guidelines: 'A maioria das rinossinusites agudas é viral; antibióticos são para casos selecionados.'
  },
  {
    id: 'p143',
    title: 'Pediculose (Piolho)',
    category: 'Pediátrico / UBS',
    items: [
      'Diagnóstico: Prurido em couro cabeludo, visualização de lêndeas ou piolhos vivos.',
      'Tratamento Tópico: Permetrina 1% loção (deixar 10 min, lavar e repetir em 7 dias).',
      'Remoção Mecânica: Uso de pente fino é fundamental para retirar as lêndeas.',
      'Orientações: Higiene de objetos pessoais e tratamento de contatos.'
    ],
    guidelines: 'O pente fino deve ser passado diariamente durante 2 semanas.'
  },
  {
    id: 'p144',
    title: 'Rosácea',
    category: 'UBS / Dermatologia',
    items: [
      'Diagnóstico: Eritema persistente na face, telangiectasias, pápulas e pústulas.',
      'Gatilhos: Sol, álcool, comidas condimentadas, estresse térmico.',
      'Manejo: Proteção solar rigorosa e sabonetes suaves.',
      'Tratamento: Metronidazol gel 0.75% ou Ivermectina 1% creme tópico.'
    ],
    guidelines: 'Evitar o uso de corticoides tópicos na face, que podem agravar a rosácea.'
  },
  {
    id: 'p145',
    title: 'Melasma',
    category: 'UBS / Dermatologia',
    items: [
      'Diagnóstico: Máculas hipercromicas acastanhadas em áreas fotoexpostas (geralmente face).',
      'Fatores: Exposição solar, genética, anticoncepcionais hormonais.',
      'Pilar do Tratamento: Fotoproteção de amplo espectro (FPS > 30 com cor).',
      'Tópicos: Hidroquinona ou Ácido Azelaico sob supervisão.'
    ],
    guidelines: 'O tratamento é longo e a recidiva é comum com qualquer exposição solar.'
  },
  {
    id: 'p146',
    title: 'Urticária Crônica',
    category: 'UBS / Alergologia',
    items: [
      'Diagnóstico: Urticas recorrentes por período > 6 semanas.',
      'Tratamento 1ª Linha: Anti-histamínicos H1 de 2ª geração (Desloratadina, Cetirizina).',
      'Escalonamento: Pode-se aumentar a dose em até 4x se não houver controle.',
      'Exames: Geralmente não requer investigação exaustiva se não houver sinais de alarme.'
    ],
    guidelines: 'Foco no controle sintomático e qualidade de vida.'
  },
   {
    id: 'p147',
    title: 'Ceratose Actínica',
    category: 'UBS / Dermatologia',
    items: [
      'Diagnóstico: Lesões eritematosas, ásperas, em áreas cronicamente expostas ao sol.',
      'Importância: Lesão pré-maligna que pode evoluir para Carcinoma Espinocelular.',
      'Tratamento: Crioterapia, 5-Fluorouracil ou Imiquimode tópico.',
      'Prevenção: Uso regular de filtro solar e chapéus.'
    ],
    guidelines: 'Múltiplas lesões indicam campo de cancerização.'
  },
  {
    id: 'p148',
    title: 'Rubéola / Sarampo (Suspeita)',
    category: 'Pediátrico / Vigilância',
    items: [
      'Diagnóstico: Febre + Exantema morbiliforme + Sintomas respiratórios.',
      'Sarampo: Manchas de Koplik, tosse intensa, coriza.',
      'Rubéola: Linfadenopatia retroauricular/occipital, exantema leve.',
      'Manejo: Notificação compulsória imediata e bloqueio vacinal.'
    ],
    guidelines: 'A suplementação com Vitamina A é recomendada no tratamento do Sarampo.'
  },
  {
    id: 'p149',
    title: 'Candidíase Oral (Manejo)',
    category: 'UBS / Pediatria / Odonto',
    items: [
      'Diagnóstico: Placas esbranquiçadas ("leite coalhado") que sangram ao raspar.',
      'Tratamento (Lactentes): Nistatina suspensão (aplicar 1-2mL 4x/dia por 7-10 dias).',
      'Tratamento (Adultos): Nistatina ou Fluconazol se refratário.',
      'Higiene: Lavar bicos e mamadeiras; tratar mamilos maternos.'
    ],
    guidelines: 'Investigar uso de antibióticos ou corticoides inalatórios recentes.'
  },
  {
    id: 'p150',
    title: 'Resfriado Comum (Manejo)',
    category: 'UBS (Atenção Básica)',
    items: [
      'Diagnóstico: Coriza, obstrução nasal, tosse leve e febre autolimitada.',
      'Etiologia: Rinovírus é o principal agente. Diferenciar de IVAS bacteriana pela duração e intensidade.',
      'Tratamento: Sintomáticos (Analgésicos e Antitérmicos).',
      'Lavagem Nasal: Fundamental com SF 0.9%.',
      'Orientações: Repouso e hidratação.'
    ],
    guidelines: 'Uso de antibióticos NÃO reduz complicações e gera resistência.'
  },
  {
    id: 'p151',
    title: 'Meningite Bacteriana (Adulto)',
    category: 'Vermelho (Emergência)',
    items: [
      'Diagnóstico: Tríade (Febre + Rigidez de Nuca + Alteração Mental - presente em 44%).',
      'Sinais Meníngeos: Kernig (dor ao estender joelho com quadril fletido) e Brudzinski (flexão involuntária de pernas ao fletir pescoço).',
      'Conduta: Punção Lombar (LCR) + Culturas. Se sinais de HIC (papiledema, déficit focal), fazer TC antes.',
      'LCR Típico: Proteína alta, Glicose baixa, Leucocitose com predomínio de Neutrófilos.',
      'Antibiótico: Ceftriaxona 2g 12/12h + Vancomicina 15-20mg/kg 12/12h.',
      'Corticoide: Dexametasona 10mg IV 15-20 min antes ou junto com 1ª dose ATB.'
    ],
    guidelines: 'A dexametasona reduz sequelas neurológicas (especialmente em meningite por S. pneumoniae).'
  },
  {
    id: 'p152',
    title: 'Apendicite Aguda',
    category: 'Amarelo / Vermelho',
    items: [
      'Diagnóstico: Dor migratória (periumbilical -> FID), anorexia, náuseas.',
      'Sinal de Blumberg: Dor à descompressão súbita no ponto de McBurney.',
      'Escore de Alvarado: Dor migratória (1), Anorexia (1), Náusea (1), Defesa FID (2), Descompressão (1), Febre (1), Leucocitose (2), Desvio à esquerda (1).',
      'Interpretação Alvarado: 0-3 (improvável); 4-6 (possível - imagem); 7-8 (provável); 9-10 (cirurgia).',
      'Imagem: USG (crianças/gestantes) ou TC com contraste (adultos).'
    ],
    guidelines: 'Jejum absoluto e avaliação imediata pela cirurgia geral.'
  },
  {
    id: 'p153',
    title: 'Hipocalemia (K < 3.5)',
    category: 'Eletrólitos',
    items: [
      'Diagnóstico: K+ < 3.5 mEq/L. ECG: Onda U visível, achatamento de T, depressão de ST.',
      'Reposição Oral (Leve > 3.0): KCl xarope ou comprimidos de liberação lenta.',
      'Reposição Venosa (Grave < 3.0 ou ECG): KCl 10% ou 19.1%.',
      'Regra de Ouro: Concentração máx 40mEq/L (veia periférica) ou 60mEq/L (central). Velocidade máx 20mEq/h.',
      'Cuidado: Sempre repor Magnésio associado (hipomagnesemia bloqueia reposição de K+).'
    ],
    guidelines: 'Evitar diluir em soro glicosado (insulina endógena piora hipocalemia por shift).'
  },
  {
    id: 'p154',
    title: 'Hipernatremia (Na > 145)',
    category: 'Eletrólitos',
    items: [
      'Diagnóstico: Na+ > 145 mEq/L. Geralmente por perda de água livre.',
      'Déficit de Água Livre: (Na atual / Na desejado - 1) * ACT (Água Corporal Total).',
      'ACT: Peso * 0.6 (homem jovem), 0.5 (homem idoso/mulher jovem), 0.45 (mulher idosa).',
      'Velocidade: Reduzir Na+ no máximo 10 mEq/L em 24h para evitar edema cerebral.',
      'Tratamento: Água livre via oral/enteral (ideal) ou SG 5% IV.'
    ],
    guidelines: 'Monitorar sódio a cada 4-6h durante a fase aguda da correção.'
  },
  {
    id: 'p155',
    title: 'Fibrilação Atrial (Anticoagulação e Conduta)',
    category: 'Cardiologia',
    items: [
      'Diagnóstico: Presença de batimentos cardíacos arrítmicos ao exame físico. ECG confirmatório: Ausência completa de ondas P, presença de ondas "f" (fricção) basais irregulares e intervalos R-R totalmente assistólicos/irregulares.',
      'Escore CHA2DS2-VASc (Indicação de Anticoagulação): C-Congestão/IC (1), H-Hipertensão (1), A2-Idade ≥ 75 anos (2), D-Diabetes (1), S2-AVC/AIT prévio (2), V-Doença Vascular (IM, DAP) (1), A-Idade 65-74 anos (1), Sc-Categoria Sexo Feminino (1). Indicado se Masculino ≥ 2 ou Feminino ≥ 3 pontos.',
      'Escore HAS-BLED (Risco de Sangramento): H-Hipertensão sistólica > 160 (1), A-Função renal ou hepática ruim (1 ou 2), S-História de AVC (1), B-Histórico ou predisposição a Sangramento (1), L-RNI instável (1), E-Idade > 65 anos (1), D-Uso de drogas/antiagregantes ou Álcool excessivo (1 ou 2). Pontuação ≥ 3 indica alto risco de sangramento, orientando acompanhamento estrito (NÃO contraindica anticoagulação).',
      'Anticoagulação de Preferência (DOACs): Apixabana 5mg VO de 12/12h (reduzir para 2.5mg 12/12h se houver pelo menos 2 de: Idade ≥ 80 anos, Peso ≤ 60kg, ou Creatinina sérica ≥ 1.5 mg/dL) ou Rivaroxabana 20mg VO 1x ao dia com a janta (reduzir para 15mg se ClCr 30-50 mL/min).',
      'Controle de Frequência Cardíaca: Metoprolol (Succinato) 25-50mg VO ao dia (ajustar até 200mg) ou Carvedilol 6.25mg a 25mg VO de 12/12h. Alvo terapêutico de FC < 110 bpm em repouso.'
    ],
    guidelines: 'A cardioversão elétrica ou química imediata sem anticoagulação prévia de 3-4 semanas só deve ser tentada se houver instabilidade hemodinâmica grave, ou se TEE (Eco transesofágico) descartar trombo em átrio esquerdo.'
  },
  {
    id: 'p156',
    title: 'Tuberculose Pulmonar (Esquema Ripe)',
    category: 'Infectologia',
    items: [
      'Diagnóstico (Protocolo TRM-TB): Presença de achados clínicos típicos (tosse persistente por mais de 3 semanas, febre vespertina baixa, sudorese noturna importante e perda ponderal) combinada com Teste Rápido Molecular para Tuberculose (TRM-TB) que detecta a presença de M. tuberculosis e pesquisa de resistência à Rifampicina.',
      'Avaliação Complementar: Radiografia de Tórax (padrão infiltrativo ou cavitações em ápices e segmentos posteriores dos lobos superiores). Baciloscopia (BAAR) de escarro se TRM-TB indisponível.',
      'Ataque (Meses 1 e 2 - Esquema RIPE): Rifampicina (R) + Isoniazida (I) + Pirazinamida (P) + Etambutol (E) administrado em dose combinada fixa (4 em 1) conforme o peso do paciente. Adulto de 50 a 70kg: Administrar 4 comprimidos juntos por via oral pela manhã, rigorosamente em jejum.',
      'Manutenção (Meses 3 ao 6 - Esquema RI): Rifampicina (R) + Isoniazida (I) administrados em comprimido combinado contendo 300mg R + 150mg I. Adulto de 50 a 70kg: Administrar 4 comprimidos por via oral, ao dia, pela manhã.',
      'Prevenção de Efeitos Adversos: Adicionar Cloridrato de Piridoxina (Vitamina B6) 40mg VO ao dia se gestante, desnutrido severo, diabético, alcoólatra ou com doença renal prévia em uso de Isoniazida (previne neuropatia periférica).'
    ],
    guidelines: 'Orientar o paciente sobre os efeitos adversos mais comuns, como a coloração alaranjada de urina, suor e lágrimas induzida pela Rifampicina e o risco de hepatotoxicidade.'
  },
  {
    id: 'p157',
    title: 'Artrite Reumatoide',
    category: 'Reumatologia',
    items: [
      'Diagnóstico (Critérios EULAR/ACR 2010): Indicado para pacientes com pelo menos 1 articulação acometida por sinovite clínica. Composto por 4 domínios: (1) Envolvimento articular (grau e quantidade de pequenas/grandes articulações afectadas); (2) Sorologia (Fator Reumatoide e anticorpo anti-CCP); (3) Reagentes de fase aguda (PCR ou VHS altos); (4) Duração dos sintomas (limiar de 6 semanas). Classificável se escore total ≥ 6 de 10.',
      'Tratamento Modificador de Primeira Linha (DMARD): Metotrexato (MTX) dose inicial de 10 mg a 15 mg por via oral, uma única vez por semana (nunca fracionar diariamente). Associar obrigatoriamente Ácido Fólico 5mg VO, 24 a 48 horas após a tomada do Metotrexato (evita estomatite, diarreia e mielossupressão).',
      'Terapia Adjuvante de Transição ("Ponte"): Prednisona 5 mg a 7.5 mg VO em dose única diária pela manhã. Usar temporariamente para controle álgico e funcional rápido enquanto o Metotrexato demora 6-12 semanas para atingir benefício completo.',
      'Controle e Metas (Treat-to-Target): Ajustar e progredir a dose do Metotrexato em 2.5-5mg a cada 4 semanas até atingir remissão clínica (ou dose máxima de 25mg/semana).'
    ],
    guidelines: 'Realizar hemograma completo, transaminases séricas (AST/ALT) e creatinina antes de prescrever Metotrexato, repetindo o controle de 2 em 2 meses.'
  },
  {
    id: 'p158',
    title: 'Insuficiência Renal Aguda (IRA KDIGO)',
    category: 'Nefrologia',
    items: [
      'Diagnóstico (Diretrizes KDIGO): Classificação do degrau de lesão renal baseado em Creatinina (Cr) Sérica ou Débito Urinário:',
      '  - Estágio 1: Elevação da Cr de 1.5 a 1.9 vezes do basal (dentro de 7 dias) ou acréscimo de ≥ 0.3 mg/dL em 48h; ou Débito urinário < 0.5 mL/kg/h por período de 6 a 12 horas.',
      '  - Estágio 2: Elevação da Cr sérica correspondente a 2.0 a 2.9 vezes o nível basal anterior; ou Débito urinário < 0.5 mL/kg/h por período ≥ 12 horas.',
      '  - Estágio 3: Elevação da Cr ≥ 3.0 vezes o basal, acréscimo absoluto para Cr ≥ 4.0 mg/dL, ou necessidade do início agudo de Terapia de Substituição Renal (Hemodiálise); ou Débito urinário < 0.3 mL/kg/h por ≥ 24h ou anúria absoluta ≥ 12h.',
      'Manejo Clínico Sequencial: Suspender imediatamente drogas nefrotóxicas (AINEs, Aminoglicosídeos). Ajustar a dosagem de todos os fármacos com base no ClCr estimado atual.',
      'Estabilização de Fluidos: Manter normovolemia fisiológica (infundir cristaloide se houver depleção volêmica óbvia; se houver sobrecarga de volume, prescrever Furosemida 40-80mg IV).'
    ],
    guidelines: 'Monitorar a taxa urinária em ml/kg/h e dosar eletrólitos (K+, Ca++, Na+, P) e gasometria venosa 12/12h nos estágios KDIGO 2 e 3 para prevenir hipercalemia refratária.'
  },
  {
    id: 'p159',
    title: 'Colite por Clostridioides difficile',
    category: 'Gastroenterologia',
    items: [
      'Diagnóstico: Presença de quadro diarreico agudo aquoso moderado a grave (geralmente ≥ 3 evacuações líquidas em 24h) associado a dor abdominal em cólica e uso recente de antibióticos sistêmicos de amplo espectro (como Cefalosporinas, Clindamicina ou Quinolonas).',
      'Confirmação Diagnóstica: Pesquisa de Toxinas A e B no escarro de fezes por ELISA ou teste de amplificação de ácido nucleico (PCR de fezes).',
      'Tratamento Primeira Linha (Leve / Moderado): Vancomicina 125mg por via oral (VO) de 6/6h por 10 dias inteiros (importante: a Vancomicina deve ser oral, pois a infusão venosa não atinge a luz intestinal).',
      'Alternativa: Metronidazol 500mg por via oral de 8/8h por 10 dias (indicado somente se a Vancomicina ou Fidaxomicina oral estiver indubitavelmente indisponível).',
      'Infecção Grave (Definida por Leucócitos > 15k ou Creatinina sérica > 1.5 mg/dL): Vancomicina 125mg VO de 6/6h por 10 dias (acrescentar Metronidazol 500mg IV de 8/8h se houver íleo paralítico associado).'
    ],
    guidelines: 'Evitar terminantemente o uso de medicamentos loperamida ou outros inibidores de motilidade intestinal para diminuir o perigo do desenvolvimento de Megacólon Tóxico.'
  },
  {
    id: 'p160',
    title: 'Lúpus Eritematoso Sistêmico (LES)',
    category: 'Reumatologia',
    items: [
      'Diagnóstico (Critérios EULAR/ACR 2019): Critério de entrada mandatório: Título de FAN ≥ 1:80 no teste imunofluorescente indireto em células HEp-2. Avaliam-se então domínios Clínicos (Sintomas constitucionais, Cutâneo agudo/crônico, Alopécia, Artrite inflamatória, Neurológico, Serosites, Hematológico com leucopenia/trombocitopenia e Renal com biópsia) e domínios Imunológicos (Anticorpos Antifosfolípides, Frações do Complemento C3/C4 depletadas, Anti-dsDNA ou Anti-Sm). Classificação positiva se escore somado ≥ 10.',
      'Tratamento Basal de Modulação Universal: Sulfato de Hidroxicloroquina dose diária correspondente a 5 mg/kg/dia por via oral (usualmente 400mg ao dia para adultos). Reduz as recidivas sistêmicas graves e melhora a taxa de sobrevida.',
      'Controle das Exacerbações Articulares Leves: Prednisona 5 mg a 10 mg ao dia VO, por curto prazo para controle inicial. Evitar o uso crônico continuado.',
      'Ataque de Crises Graves ou Nefrite Lúpica: Pulsoterapia de Metilprednisolona 500 a 1000 mg IV por dia por 3 dias consecutivos, seguida de corticoterapia oral de desmame progressivo + Imunossupressor (como Micofenolato de Mofetila ou Ciclofosfamida).'
    ],
    guidelines: 'Todos os pacientes em terapia com hidroxicloroquina devem realizar exame oftalmológico com campo visual de base e anualmente após 5 anos de uso para triar toxicidade retiniana maculosa.'
  }
];

const SUMMARIES = [
  {
    area: 'Emergência',
    subjects: [
      {
        title: 'Abordagem da Dor Torácica',
        content: `• EPIDEMIOLOGIA: A dor torácica responde por 5 a 10% de todos os atendimentos de urgência e emergência hospitalar, sendo essencial a identificação célere das condições que trazem risco iminente de morte (SCA, Dissecção de Aorta, TEP, Pneumotórax Hipertensivo, Ruptura Esofágica e Tamponamento Cardíaco).
• FISIOPATOLOGIA: Ocorre desbalanço crítico entre oferta e demanda miocárdica de oxigênio. Na Síndrome Coronariana Aguda (SCA) com ou sem supra-ST, há instabilização ou ruptura de placa aterosclerótica prévia com cascata de agregação plaquetária e formação de trombo intracoronário oclusivo ou suboclusivo.
• DIAGNÓSTICO: ECG obrigatório de 12 derivações realizado e laudado em ATÉ 10 MINUTOS da admissão. Marcadores de necrose miocárdica (Troponina I ou T ultrassensível) dosados na curva (m0 e m3h). Empregar escores de risco clínico como o HEART Score (História, ECG, Idade, Fatores Clínicos de Risco, Troponina) para guiar alta segura de pacientes de baixo risco em Unidade de Dor Torácica (UDT).
• TRATAMENTO: Terapia antiplaquetária dupla com AAS dose de ataque 200-300mg mastigado + Clopidogrel 300mg VO ou Ticagrelor 180mg VO. Nitrato SL (Nitroglicerina ou Mononitrato) se dor refratária e sem contraindicações (PAS < 90, uso de PDE5i nas últimas 24-48h ou infarto de VD). Morfina reservada para dor intensa refratária ao nitrato. Oxigenioterapia reservada estritamente se SatO2 < 90% ou insuficiência respiratória óbvia.`
      },
      {
        title: 'Cetoacidose Diabética (CAD)',
        content: `• EPIDEMIOLOGIA: É a complicação metabólica aguda mais frequente e grave em pacientes portadores de Diabetes Mellitus Tipo 1 (DM1), ocorrendo também em cerca de 10% a 30% de novos diagnósticos e em diabéticos Tipo 2 sob intenso estresse metabólico ou infecções desencadeantes.
• FISIOPATOLOGIA: A deficiência absoluta ou severamente relativa de insulina, combinada com a elevação drástica de hormônios contrarreguladores (glucagon, cortisol, catecolaminas, GH), ativa a lipólise descontrolada no tecido adiposo, gerando ácidos graxos livres que sofrem beta-oxidação hepática acelerada com desvio para cetogênese excessiva (acetoacetato e beta-hidroxibutirato).
• DIAGNÓSTICO: Tríade constituída por Glicemia capilar/sérica > 250 mg/dL, Acidose metabólica (pH arterial/venoso < 7,30 e Bicarbonato sérico < 15 mEq/L) acompanhada de cetonemia ou cetonúria exuberante. O Anion Gap encontra-se francamente elevado (rotineiramente > 12-14), decorrente da produção maciça de cetoácidos.
• TRATAMENTO: Protocolo trifase progressivo: (1) Hidratação venosa vigorosa imediata com 1000-1500ml de SF 0,9% na primeira 1 hora; (2) Insulinoterapia contínua rápida por bomba de infusão (0,1 UI/kg/hora) após certificar-se de que o Potássio sérico está rigorosamente > 3,3 mEq/L; (3) Manejo agressivo e contínuo de Potássio (se K 3,3-5,2, infundir 20-30 mEq de K+ por litro de fluido administrado). Se K < 3,3, reter o início da insulina e repor potássio venoso imediato.`
      },
      {
        title: 'Anafilaxia',
        content: `• EPIDEMIOLOGIA: Reação de hipersensibilidade sistêmica aguda, potencialmente fatal, desencadeada mais comumente por picadas de himenópteros, alérgenos alimentares (leite, ovo, castanhas, frutos do mar) ou fármacos sistêmicos (AINEs, Penicilinas, contrastes iodados).
• FISIOPATOLOGIA: Degranulação maciça, generalizada e repentina de mastócitos e basófilos teciduais, usualmente ligada à ativação mediada por IgE, com liberação de mediadores inflamatórios vasoativos potentes (histamina, leucotrienos, prostaglandinas, fator de ativação plaquetária) que causam vasodilatação venosa e arterial generalizada, extravasamento plasmático e broncoespasmo severo.
• DIAGNÓSTICO: Reconhecimento clínico imediato de início súbito de sintomas dermatológicos (urticária disseminada, prurido, angioedema labial/palpebral) associado a pelo menos 1 destes sistemas acometidos: respiratório (sibilos, estridor laríngeo, dispneia grave), cardiovascular (hipotensão profunda, colapso circulatório) ou gastrointestinal severo persistente (dor abdominal em cólica intensa, vômitos profusos).
• TRATAMENTO: ADMINISTRAÇÃO PRECOCE DE ADRENALINA (EPINEFRINA) 1:1000 na dose de 0,3 a 0,5 mg IM (adultos) ou 0,01 mg/kg IM (pediátrico) no ventrolateral da coxa (vasto lateral). Pode ser repetida a cada 5-15 minutos se houver refratariedade. Corticoterapia (Metilprednisolona 125mg IV) e Anti-histamínicos (Difenidramina 50mg IV) são estritamente adjuvantes e tardios, nunca devendo postergar a adrenalina.`
      }
    ]
  },
  {
    area: 'Cardiologia',
    subjects: [
      {
        title: 'Fibrilação Atrial (FA)',
        content: `• EPIDEMIOLOGIA: A arritmia sustentada mais prevalente na prática clínica do clínico e do cardiologista. O risco cumulativo ao longo da vida atinge 25%, elevando de 4 a 5 vezes a incidência de Acidente Vascular Cerebral Isquêmico (AVCi) tromboembólico secundário.
• FISIOPATOLOGIA: Desorganização completa e caótica da atividade elétrica atrial decorrente de focos ectópicos de disparo ultrarrápido (frequentemente situados na transição das veias pulmonares). Isso gera múltiplos microcircuitos de reentrada erráticos, eliminando a sístole atrial mecânica e provocando estase sanguínea crônica no apêndice atrial esquerdo.
• DIAGNÓSTICO: ECG contendo ausência absoluta de ondas P organizadas (substituídas por ondas de fibrilação "f" desordenadas na linha de base) associado a intervalos R-R completamente irregulares e imprevisíveis. Ausência de déficit de pulso fisiológico.
• TRATAMENTO: Estratificar risco tromboembólico pelo escore CHA2DS2-VASc e de sangramento pelo HAS-BLED. Anticoagulação com DOACs (Apixabana 5mg 12/12h ou Rivaroxabana 20mg 1x/dia) se escore ≥ 2 em homens ou ≥ 3 em mulheres. O controle de FC em repouso deve objetivar < 110 bpm com uso de Betabloqueadores (Metoprolol 25-50mg 12/12h) ou Bloqueadores de Canais de Cálcio (Diltiazem).`
      },
      {
        title: 'Insuficiência Cardíaca (IC)',
        content: `• EPIDEMIOLOGIA: Causa líder isolada de internação hospitalar eletiva e de emergência em pacientes idosos (> 65 anos), apresentando uma taxa assustadora de mortalidade de aproximadamente 50% em 5 anos pós-diagnóstico se mantida sem tratamento moderno.
• FISIOPATOLOGIA: Lesão miocárdica crônica ou aguda (isquêmica por infarto, sobrecarga de pressão por HAS refratária, miocardiopatia idiopática) induzindo disfunção sistólica ou diastólica do ventrículo esquerdo. Há estimulação compensatória deletéria crônica dos sistemas neuro-humorais como o RAA (Renina-Angiotensina-Aldosterona) e o SNS (Simpático), gerando hipertrofia patológica, fibrose e remodelação cardíaca progressiva.
• DIAGNÓSTICO: Baseado nos critérios clínicos clássicos de Framingham (maiores: DPN, turgência jugular patológica, creptações pulmonares bibasais, cardiomegalia no Rx) apoiado pelo doseamento de biomarcadores cardíacos de estiramento ventricular (BNP > 35 pg/mL ou NT-proBNP > 125 pg/mL) e Ecocardiograma transtorácico com cálculo da Fração de Ejeção do VE (ICFEr vs. ICFEp).
• TRATAMENTO: O pilar moderno "Quádrupla Terapia" modificadora de sobrevida na ICFEr (FEVE < 40%) compreende: (1) Sacubitril/Valsartana (ou IECA/BRA); (2) Betabloqueador de liberação sustentada (Succinato de Metoprolol, Carvedilol ou Bisoprolol); (3) Antagonista de Receptor de Mineralocorticoide (Espironolactona 25mg/dia); e (4) Inibidores do SGLT2 (Dapagliflozina 10mg ou Empagliflozina 10mg/dia). Diuréticos de alça (Furosemida) titulados apenas para controle dinâmico da congestão volêmica.`
      }
    ]
  },
  {
    area: 'Infectologia',
    subjects: [
      {
        title: 'Pneumonia Comunitária',
        content: `• EPIDEMIOLOGIA: Uma das principais causas globais de internamento e morbimortalidade de origem infecciosa no Brasil e no mundo. Acomete principalmente extremos de idade (crianças menores de 5 anos e idosos acima de 60 anos).
• FISIOPATOLOGIA: Translocação microbiana por microaspiração de patógenos aeróbicos da orofaringe que ultrapassam as defesas físicas do epitélio mucociliar e os macrófagos alveolares. O principal patógeno é o Streptococcus pneumoniae (pneumococo), seguido por Mycoplasma pneumoniae, Chlamydia pneumoniae e vírus respiratórios sazonais.
• DIAGNÓSTICO: Consiste em infiltrado pulmonar alveolar novo ao estudo radiográfico de tórax (Rx ou TC) associado a sintomas clínicos pulmonares agudos como febre aferida (> 37,8ºC), tosse produtiva mucopurulenta, expectoração amarelada ou esverdeada, dor torácica pleurítica e dispneia com hipoxemia periférica. Aplicar o escore CURB-65 (Confusão, Ureia > 43, Respiração ≥ 30/min, BP < 90/60, Idade ≥ 65 Anos) para definir local de tratamento (0-1: ambulatorial; 2: enfermaria; ≥ 3: considerar UTI).
• TRATAMENTO: Ambulatorial: Amoxicilina 1g de 8/8h isolada ou Claritromicina 500mg de 12/12h por 5-7 dias. Hospitalar (Enfermaria): Ceftriaxona 2g IV 1x/dia associada à Claritromicina 500mg IV 12/12h para cobrir germes atípicos. Hospitalar (UTI): Ceftriaxona 2g IV ao dia + Levofloxacino 750mg IV ao dia.`
      },
      {
        title: 'Sepse (Sepsis-3)',
        content: `• EPIDEMIOLOGIA: Responde por cerca de 30% das internações em UTIs brasileiras, com taxas de letalidade que chegam a 50% em hospitais públicos. O reconhecimento rápido é o fator prognóstico mais importante para a sobrevida do paciente.
• FISIOPATOLOGIA: Disfunção orgânica de evolução aguda que põe em risco a vida do hospedeiro, provocada por uma resposta imune e inflamatória desregulada a um foco infeccioso suspeito ou confirmado. Ocorre disfunção endotelial progressiva, distúrbios da microcirculação por microtrombos, vasodilatação profunda por NO e apoptose celular celular difusa que resulta em disóxia tecidual generalizada.
• DIAGNÓSTICO: Identificado clínicos pela variação aguda de ≥ 2 pontos no escore SOFA (Sequential Organ Failure Assessment) decorrente da infecção. O escore rápido qSOFA (FR ≥ 22 irpm, alteração mental aguda e PAS ≤ 100 mmHg) serve para triagem à beira do leito de pacientes de risco elevado. Choque Séptico: Necessidade de vasopressor contínuo para manter PAM ≥ 65 mmHg E Lactato sérico de controle > 2 mmol/L (18 mg/dL) mesmo após reposição volêmica adequada de cristaloides.
• TRATAMENTO: Iniciar o "Bundle da 1ª Hora": (1) Dosar lactato sérico (repetir de 2/2h se alterado); (2) Coletar no mínimo 2 pares de hemoculturas de sítios anatômicos diferentes antes da infusão de antimicrobiano; (3) Administrar antibiótico empírico de amplo espectro na dose correta (ex: Piperacilina/Tazobactam 4,5g IV ou Meropenem 1-2g IV); (4) Infundir infusão rápida de 30 mL/kg de cristaloides se houver hipotensão arterial persistente (PAM < 65) ou Lactato ≥ 4,0 mmol/L; (5) Iniciar precocemente Noradrenalina se hipotensão persistente.`
      },
      {
        title: 'Endocardite Infecciosa',
        content: `• EPIDEMIOLOGIA: Afeta preferencialmente pacientes com próteses valvares, cardiopatias congênitas estruturais, cateteres vasculares permanentes prolongados ou usuários de drogas intravenosas, apresentando alta taxa de mortalidade inter-hospitalar.
• FISIOPATOLOGIA: Ocorre deposição mecânica localizada de fibrina e agregados plaquetários em áreas de endotélio cizalhado ou lesado (endocardite trombótica não bacteriana). Bacteremias transientes dão ancoramento e colonização bacteriana estável nestes focos, gerando o crescimento progressivo de "vegetações" que destroem o tecido valvar e embolizam periodicamente. Os germes principais são Staphylococcus aureus (extremamente destruidor em valvas nativas) e Streptococcus viridans.
• DIAGNÓSTICO: Baseado na aplicação dos critérios modificados de Duke. Critérios Maiores: (1) Hemoculturas positivas persistentes para patógenos típicos; (2) Evidência ecocardiográfica direta de acometimento endocárdico (vegetação móvel, abscesso perivalvar ou deiscência de prótese). Critérios Menores: Febre severa, fenômenos vasculares embólicos, imunológicos (nódulos de Osler, manchas de Roth, glomerulonefrite) e hemoculturas sugestivas.
• TRATAMENTO: Terapia farmacológica prolongada baseada no antibiograma por 4 a 6 semanas. Esquema empírico inicial usual: Ampicilina 2g IV de 4/4h associada à Oxacilina 2g IV de 4/4h e Gentamicina 3mg/kg/dia IV dividida. A indicação cirúrgica precoce deve ser considerada se houver insuficiência cardíaca congestiva intratável por disfunção valvar aguda, infecção descontrolada contínua com hemoculturas persistentes ou vegetações móveis gigantes (> 10mm) com episódios embólicos repetidos.`
      }
    ]
  },
  {
    area: 'Medicina Intensiva',
    subjects: [
      {
        title: 'SDRA - Síndrome do Desconforto Respiratório Agudo',
        content: `• EPIDEMIOLOGIA: Presente em aproximadamente 10% de todas as internações em leitos de UTI gerais e em cerca de 23% dos pacientes em ventilação mecânica invasiva. Causas comuns incluem sepse grave de foco pulmonar ou extrapulmonar, aspiração de conteúdo gástrico e trauma torácico maior.
• FISIOPATOLOGIA: Resposta inflamatória alveolar devastadora com lesão alveolar difusa e quebra da barreira alvéolo-capilar pulmonar. Ocorre edema pulmonar inflamatório exsudativo rico em proteínas, inativação do surfactante pulmonar com colapso maciço dos alvéolos e formação de membranas hialinas. Isso induz grave shunt intrapulmonar direito-esquerdo de sangue e severa hipoxemia refratária.
• DIAGNÓSTICO: Critérios clássicos de Berlim: (1) Sintomas respiratórios agudos com início em até 7 dias do insulto conhecido; (2) Infiltrados bilaterais opacos e difusos em Rx ou TC de tórax, não explicados completamente por efusões ou colapsos lobares; (3) Edema pulmonar não cardiogênico (excluir sobrecarga volêmica hidrostática/disfunção VE); (4) Relação PaO2/FiO2 < 300 com PEEP ≥ 5 cmH2O (Leve 201-300; Moderada 101-200; Grave ≤ 100).
• TRATAMENTO: Estratégia de Ventilação Protetora: Volume Corrente (VC) limitado a 6 mL/kg com base no peso ideal estimado, mantendo a Pressão de Platô respiratória < 30 cmH2O e a Driving Pressure (Platô - PEEP) < 15 cmH2O. Se a relação PaO2/FiO2 estiver persistentemente < 150, utilizar infusão contínua de bloqueador neuromuscular (Cisatracúrio) e realizar ventilação mecânica em Posição Prona por pelo menos 16 a 20 horas consecutivas diárias.`
      },
      {
        title: 'Choque: Classificação e Manejo',
        content: `• FISIOPATOLOGIA: Estado agudo e dinâmico de falência circulatória generalizada caracterizado pela incapacidade profunda do sistema cardiovascular em prover oxigênio (delivery de O2 [DO2]) adequado ao consumo metabólico dos tecidos periféricos (VO2), resultando em disóxia celular difusa e indução de metabolismo anaeróbico compensatório produtor de lactato.
• TIPOS: (1) Distributivo (vasodilatação profunda e hipovolemia relativa; ex: Sepse, Anafilaxia, Neurogênico); (2) Hipovolêmico (perda absoluta de fluido extracelular; ex: Hemorragia maciça, Desidratação grave); (3) Cardiogênico (falência primária da contratilidade cardíaca; ex: IAM, Miocardite); (4) Obstrutivo (barreira anatômica mecânica ao fluxo de sangue; ex: TEP maciço, Tamponamento, Pneumotórax hipertensivo).
• DIAGNÓSTICO: Sinais clínicos óbvios de má perfusão tecidual orgânica: Tempo de Enchimento Capilar (TEC) periférico lentificado (> 3 segundos), hipotensão arterial (PAS < 90 mmHg ou queda rápida de > 40 mmHg do basal), pele fria e pegajosa (exceto no choque distributivo inicial), oligúria (< 0,5 mL/kg/hora), confusão mental, acidose metabólica e lactato sérico elevado (> 2,0 mmol/L).
• MANEJO: Resgatar com fluidos cristaloides (20-30 ml/kg) se houver probabilidade real de hipovolemia absoluta/relativa. Se hipotensão persistente, iniciar imediatamente Noradrenalina por via venosa segura em infusão tateada para manter PAM ≥ 65 mmHg de alvo. No choque cardiogênico com congestão sistêmica associada, iniciar agente inotrópico direto como a Dobutamina (2 a 20 mcg/kg/min) associado a vasopressor se necessário.`
      }
    ]
  },
  {
    area: 'Emergências Psiquiátricas',
    subjects: [
      {
        title: 'Agitação Psicomotora',
        content: `• DIAGNÓSTICO: Condição de risco caracterizada por atividade motora excessiva e desorganizada, exacerbação cognitiva, agressividade verbal ou física iminente e perda da autocrítica. É essencial priorizar e descartar etiologias orgânicas graves ocultas (Intoxicação por substâncias psicoativas, abstinência alcoólica, hipoglicemia severa, meningites, hipóxia ou encefalopatia metabólica flutuante) antes de rotular etiologia puramente psiquiátrica primária.
• CONDUTA: Protocolo de segurança e controle progressivo: (1) Abordagem verbal pacífica e calma, sem confrontamento ou tom desafiador, mantendo o ambiente calmo; (2) Contenção física ou mecânica de emergência em leito hospitalar se houver risco evidente de autolesão, heteroagressão física iminente ou destruição do patrimônio (deve ser feita com pelo menos 5 profissionais posicionados e com anotação formal no prontuário).
• FARMACOTERAPIA: Terapia de sedação de urgência: Cóquetel clássico IM contendo Haloperidol 5mg (analéptico neuroléptico típico de alta potência) associado à Prometazina 50mg (anti-histamínico de primeira geração promotor de sedação sinérgica e bloqueador de efeitos extrapiramidais agudos do haloperidol) por via intramuscular profunda. Evitar o uso de Benzodiazepínicos se suspeita de sedação respiratória induzida ou depressão respiratória mista avançada.`
      }
    ]
  },
  {
    area: 'Endocrinologia',
    subjects: [
      {
        title: 'Diabetes Mellitus: Diagnóstico',
        content: `• EPIDEMIOLOGIA: O Diabetes Mellitus atinge cerca de 9 a 12% da população brasileira, gerando elevadíssima morbidade decorrente de complicações microvasculares crônicas (retinopatia, nefropatia diabética acelerada, neuropatia sensitivo-motora periférica) e macrovasculares agudas e crônicas (IAM, AVCi, doença arterial obstrutiva periférica).
• FISIOPATOLOGIA: O DM Tipo 1 é gerado pela destruição seletiva autoimune das células beta das ilhotas pancreáticas, resultando em ausência total e absoluta de secreção de insulina. O DM Tipo 2 baseia-se na resistência periférica à ação do hormônio nos tecidos muscular, hepático e adiposo, evoluindo progressivamente com a exaustão compensatória crônica e apoptose das células produtoras do pâncreas.
• DIAGNÓSTICO: Presença de um dos seguintes parâmetros confirmados em 2 ocasiões distintas (ou na presença de sintomas clássicos de hiperglicemia como poliúria, polidipsia, perda ponderal não intencional e polifagia): (1) Glicemia de jejum de 8 horas ≥ 126 mg/dL; (2) Glicemia 2 horas após sobrecarga de 75g de glicose anidra (TOTG) ≥ 200 mg/dL; (3) Hemoglobina Glicada (HbA1c) padronizada ≥ 6,5%; (4) Glicemia aleatória coletada em qualquer horário com sintomas clássicos ≥ 200 mg/dL.
• TRATAMENTO: A primeira linha consensual universal para o paciente portador de DM2 é a Metformina (iniciada com 500-850mg VO ao dia com refeição, titulada até 2g), associada a inibidores do SGLT2 (Dapagliflozina, Empagliflozina) ou análogos do GLP-1 (Liraglutida, Semaglutida) se houver evidência concomitante de doença cardiovascular aterosclerótica estabelecida, insuficiência cardíaca crônica ou disfunção renal progressiva com albuminúria indesejada.`
      },
      {
        title: 'Hipotireoidismo',
        content: `• EPIDEMIOLOGIA: Distúrbio endócrino prevalente que acomete cerca de 8 a 15% das mulheres adultas na faixa etária acima dos 40 anos, com incidência que aumenta progressivamente com a senescência.
• FISIOPATOLOGIA: No hipotireoidismo primário (99% dos casos clínicos), há disfunção intrínseca glandular crônica decorrente principalmente da tireoidite linfocitária crônica autoimune (Tireoidite de Hashimoto), caracterizada pela presença marcante de autoanticorpos dirigidos contra a tireoperoxidase (anti-TPO) e tireoglobulina (anti-Tg) que destroem paulatinamente o tecido parenquimatoso competente, reduzindo a biosíntese de T3 e T4.
• DIAGNÓSTICO: Dosagem sérica basal combinada de TSH (Hormônio Estimulador da Tireoide) e T4 Livre. Hipotireoidismo Clínico: Presença de TSH elevado associado a T4 Livre cronicamente abaixo da faixa normal de referência. Hipotireoidismo Subclínico: Caracterizado por TSH elevado (geralmente entre 4,5 e 10 mIU/L) com níveis séricos circulantes de T4 Livre rigorosamente dentro dos limites normais fisiológicos.
• TRATAMENTO: Reposição hormonal oral com Levotiroxina sódica pura (T4 sintético) na dose metabólica inicial estimada de 1,6 mcg/kg/dia para adultos eutróficos de meia-idade, ingerida pela manhã estritamente em jejum absoluto com água, no mínimo 30 a 60 minutos antes da primeira refeição matinal. Em pacientes idosos de risco ou portadores de doença coronariana prévia conhecida, iniciar sempre conservadoramente com dosagens reduzidas de 25 mcg a 50 mcg por via oral diariamente para evitar taquiarritmias e descompensação de isquemia miocárdica.`
      }
    ]
  },
  {
    area: 'Gastroenterologia',
    subjects: [
      {
        title: 'Hemorragia Digestiva Alta (HDA)',
        content: `• EPIDEMIOLOGIA: Responde como uma das principais emergências gastrointestinais agudas do pronto-socorro, caracterizada por taxa de mortalidade total que gira entre 5% e 14% a despeito de suporte avançado. Dividida clinicamente em causa Não Varicosa (Úlcera Péptica Ativa) e Varicosa (decorrente de Hipertensão Portal).
• FISIOPATOLOGIA: Na HDA não-varicosa, ocorre a erosão ácida péptica direta com perfuração da integridade da parede vascular da artéria submucosa decorrente de Helicobacter pylori ou uso crônico de AINEs. Na HDA varicosa, o aumento drástico da pressão no sistema de drenagem portal sinusoidal decorrente de cirrose induz a circulação colateral esofágica compensatória com formação de varizes volumosas de paredes extremamente finas que se rompem subitamente sob alta tensão.
• DIAGNÓSTICO: Apresentação clássica de hematêmese exuberante (vômito com sangue vivo ou em borra de café) e/ou presença de melena (fezes pastosas enegrecidas, viscosas e com odor fétido característico de sangue digerido). Avaliação prognóstica imediata pelos escores clínicos de prognóstico Rockall ou Blatchford. Confirmação do foco e interrupção do sangramento por Endoscopia Digestiva Alta (EDA) diagnóstica e terapêutica idealmente nas primeiras 12 a 24 horas.
• TRATAMENTO: Estabilização hemodinâmica prioritária com infusão rápida de cristaloides e reserva de concentrado de hemácias se hemoglobina alvo < 7,0-8,0 g/dL. HDA Varicosa presumida: Iniciar imediatamente Vasoconstritor esplâncnico direto (Terlipressina 2mg IV a cada OP de 4 horas, ou Octreotide) + Profilaxia de Peritonite Bacteriana Espontânea (PBE) com Ceftriaxona 1g IV de 24/24h + Eritromicina 250mg IV se disponível para esvaziamento gástrico. HDA Não Varicosa: Iniciar Inibidor de Bomba de Prótons em altas doses (Omeprazol 80mg IV em bolus seguido de infusão contínua de 8mg/hora ou 40mg IV 12/12h).`
      },
      {
        title: 'Cirrose: Complicações',
        content: `• EPIDEMIOLOGIA: Estágio terminal de fibrogenese hepática difusa decorrente de insultos crônicos recorrentes de álcool, hepatite B ou C, esteato-hepatite não alcoólica (MASH), com imensa repercussão de gastos públicos e mortalidade secundária à falência hepática severa.
• FISIOPATOLOGIA: Destruição do parênquima hepático normal por fibrose lobular nodular e alteração profunda da arquitetura celular, gerando aumento drástico da resistência mecânica intra-hepática à vasculatura portal (Hipertensão Portal). Consequências fisiológicas incluem ascite, encefalopatia metabólica pelo acúmulo de escórias tóxicas digestivas como a amônia, e disfunção hepática de síntese dos fatores da coagulação dependentes e de albumina.
• DIAGNÓSTICO: Diagnóstico do quadro clínico (turgência de veias da parede abdominal, eritema palmar, ginecomastia, aranhas vasculares, esplenomegalia) amparado por ultrassonografia de abdome, alteração marcante de exames de atividade funcional de síntese (RNI alargado, Hipoalbuminemia pronunciada, plaquetopenia de sequestro e transaminases ligeiramente normais/elevadas). Classificar de forma contínua pelo escore prognóstico de CHILD-PUGH (classes A, B e C) e MELD (Model for End-Stage Liver Disease).
• TRATAMENTO: Ascite refratária inicial: Restrição de sódio dietético a < 2g/dia, associado a regime diurético seletivo sequencial com uso de Espironolactona (100mg a 400mg VO / dia) de forma sinérgica com Furosemida (40mg a 160mg VO / dia) em proporção de 100:40 para controle do equilíbrio potássico. Encefalopatia Hepática: Tratar fatores precipitantes desencadeantes (ITU, hemorragia digestiva alta, hipopotassemia excessiva) e iniciar Lactulona VO em dosagem contínua para manter de 2 a 3 evacuações de consistência pastosa ao dia, reduzindo a reabsorção de amônia no cólon.`
      }
    ]
  },
  {
    area: 'Neurologia',
    subjects: [
      {
        title: 'AVC Isquêmico vs Hemorrágico',
        content: `• EPIDEMIOLOGIA: O Acidente Vascular Cerebral representa uma das causas líderes isoladas de mortalidade crônica e de desenvolvimento de incapacidades físicas e cognitivas no paciente adulto brasileiro. Cerca de 85% de todos os episódios agudos são isquêmicos (AVCi), enquanto cerca de 15% derivam de rotura traumática/espontânea hemorrágica (AVCh parenquimatosa ou subaracnoide).
• FISIOPATOLOGIA: No AVC Isquêmico, há interrupção abrupta do fluxo sanguíneo arterial de um determinado vaso cerebral devido a oclusão embólica (fonte cardíaca por FA ou placas carotídeas estenosantes) ou trombótica "in situ" por aterosclerose intraparenquimatosa estrutural. No AVC Hemorrágico, ocorre o sangramento intraparenquimatoso parenquimatoso focal devido à ruptura direta exposta de pequenos ramos perfurantes arteriais fragilizados pela hipertensão arterial crônica sustentada (microaneurismas de Charcot-Bouchard).
• DIAGNÓSTICO: Instalação súbita, focal e catastrófica de déficits neurológicos definidos (hemiparesia de face-braço-perna, afasia de fala motora ou sensitiva, disartria, tontura rotatória severa unilateral, perda visual aguda). Realizar IMEDIATAMENTE Tomografia Computadorizada (TC) de Crânio sem contraste de admissão: O exame serve precipuamente para afastar sangramento evidente de AVC hemorrágico agudo (hiperdensidade brilhante inicial), pois os achados de AVC isquêmico (hipodensidades) demoram de 12 a 24 horas para se consolidarem no exame.
• TRATAMENTO: No AVC Isquêmico agudo dentro da janela temporal de até 4,5 horas do início preciso dos sintomas (delta t), realizar Trombólise Química Intravenosa com Alplase (rtPA) na dose de 0,9 mg/kg (dose máxima 90mg, fazendo 10% em bolus e o restante em infusão contínua em 1 hora), mantendo a PA rigorosamente monitorada < 185/110 mmHg. Se houver oclusão proximal de grande artéria intracraniana, direcionar prioritariamente para Trombectomia Mecânica endovascular em até 24 horas. No AVC Hemorrágico, o foco é o controle extremamente rígido da Pressão Arterial Sistólica com alvo rápido de < 140 mmHg com uso de vasodilatadores venosos potentes como o Nitroprussiato de Sódio.`
      },
      {
        title: 'Delirium no Idoso',
        content: `• EPIDEMIOLOGIA: Complicação cognitiva extremamente frequente que acomete de 15% a 50% de todos os idosos internados em enfermarias gerais ou sob cuidados cirúrgicos de urgência, elevando drasticamente o período de ocupação e internação, riscos infecciosos e taxas de mortalidade hospitalar.
• FISIOPATOLOGIA: Síndrome neurocomportamental caracteristicamente de início rápido, flutuante e agudo decorrente de disfunção cerebral orgânica difusa funcional. Resulta do estresse oxidativo, neuroinflamação sináptica persistente e desequilíbrio abrupto de múltiplos neurotransmissores (redução drástica do tônus colinérgico central associado a hiperatividade dopaminérgica compensatória) secundários a insultos corporais sistêmicos aplicados a cérebros frágeis ou com demência pré-existente.
• DIAGNÓSTICO: Baseado estritamente na aplicação prática sistemática do algoritmo CAM (Confusion Assessment Method), necessitando obrigatoriamente do preenchimento de: (1) Início agudo e curso flutuante dos sintomas; (2) Déficit agudo pronunciado de atenção física direcionada; associado a pelo menos 1 de: (3) Pensamento desorganizado caótico ou (4) Nível alterado flutuante de consciência (hipervigilante, hipovigilante ou letárgico).
• TRATAMENTO: O pilar insubstituível baseia-se na abordagem não farmacológica proativa através de reorientação contínua calendarizada dia/noite por familiares competentes, reintrodução tempestiva do uso de óculos e aparelhos auditivos funcionais do paciente, preservação rígida da higiene do padrão do sono fisiológico (iluminação adequada diurna / escuro e silêncio noturnos), além da mobilização precoce contínua. Terapia Farmacológica: Reservada estritamente se houver agitação psicomotora violenta que coloque em risco a integridade física do paciente ou da equipe cirúrgica geral, empregando doses baixas fracionadas curtas de Haloperidol (0,5mg a 1mg VO ou IM de 12/12h); evitar de forma absoluta o uso de benzodiazepínicos (risco de piora extrema do quadro cognitivo e sedação prolongada).`
      }
    ]
  },
  {
    area: 'Pneumologia',
    subjects: [
      {
        title: 'Asma Brônquica: Crise Aguda',
        content: `• EPIDEMIOLOGIA: A exacerbação aguda da asma brônquica atinge milhões de crianças e adultos anualmente, gerando elevadíssima taxa de internação hospitalar passível de prevenção. A morte por asma na crise aguda pode ocorrer rapidamente por cansaço muscular diafragmático progressivo.
• FISIOPATOLOGIA: Processo inflamatório brônquico agudo exuberante hiperreativo exacerbado mediado por vias de hipersensibilidade de tipo 2 (eosinófilos, mastócitos e IgE) desencadeado por fatores ambientais ou infecções virais intercorrentes. Isso induz edema grave da mucosa da parede brônquica profunda, contração espástica reflexa das bandas musculares lisas circulantes e hipersecreção crônica estenosante de muco extremamente adesivo, gerando obstrução grave difusa do fluxo aéreo expiratório.
• DIAGNÓSTICO: Consiste na presença rápida de dispneia intensa de repouso, tosse seca incômoda, expiração muito prolongada e presença de sibilos difusos polifônicos à auscultação pulmonar. Sinais Clínicos Críticos de Cansaço Muscular / Instabilidade: Fraca movimentação torácica residual ("tórax silencioso" por extrema restrição do fluxo de ar), incapacidade absoluta de completar frases curtas, respiração paradoxal assincrônica abdominal, frequência cardíaca > 120 bpm e saturação de O2 periférica cronicamente < 90% em ar ambiente.
• TRATAMENTO: O pilar imediato é composto por broncodilatadores beta-2-agonistas de curta duração em inalação repetida (Salbutamol 100mcg/jato, aplicando de 4 a 10 jatos por meio de espaçador a cada 20 minutos na primeira 1 hora) associado sistematicamente a corticosteroides com atividade sistêmica (Prednisona 40mg VO ou Metilprednisolona 40-125mg IV na admissão). Em crises consideradas moderadas a graves de repouso, adicionar precocemente Brometo de Ipratrópio (anticolinérgico inalatório) para bloqueio broncoespástico adicional. Se refratariedade inicial de conduta, prescrever infusão venosa de Sulfato de Magnésio 2g IV correndo lento em 20 minutos.`
      },
      {
        title: 'Tromboembolismo Pulmonar (TEP)',
        content: `• EPIDEMIOLOGIA: O TEP representa a terceira causa clínica mais frequente de mortalidade de origem cardiovascular aguda, ficando posicionado atrás apenas do Infarto Agudo do Miocárdio e do Acidente Vascular Cerebral. Possui forte associação estabelecida com cirurgias maiores recentes, hospitalização psiquiátrica prolongada por períodos de imobilização e neoplasia oculta/ativa concomitante.
• FISIOPATOLOGIA: Formação inicial e migração mecânica direta de um trombo venoso do sistema vascular profundo (Trombose Venosa Profunda - TVP localizada usualmente nas veias poplíteas ou coxais proximais dos membros inferiores) que transita pela circulação sistêmica e ocluí repentinamente ramos arteriais do leito pulmonar vascular. Isso causa disfunção imediata de barreira por aumento drástico e retrógrado da pós-carga do Ventrículo Direito (VD), isquemia subendocárdica do VD e colapso pressórico final.
• DIAGNÓSTICO: Clínica caracterizada por instalação súbita e inexplicada de dispneia intensa acompanhada de dor torácica tipo pleurítica aguda de início rápido, taquipneia sustentada, taquicardia persistente e episódios de síncope. Aplicar sistematicamente o Escore de Wells para classificar a probabilidade clínica antes do teste: Se suspeito de Baixa Probabilidade, dosar o D-Dímero sérico quantitativo (exclui se normal < 500 ng/mL). Se Alta Probabilidade de base, direcionar diretamente para Angiotomografia Computadorizada (Angio-TC) de Tórax contrastada (padrão-ouro confirmatório).
• TRATAMENTO: Conduta baseada na estratificação hemodinâmica: TEP Estável (Não Maciço): Anticoagulação plena imediata com heparina de baixo peso molecular (Enoxaparina 1mg/kg por via Subcutânea a cada 12 horas) ou uso de anticoagulantes orais de ação direta tipo DOAC (Rivaroxabana 15mg VO de 12/12h por 21 dias). TEP Instável (Maciço / Choque Obstrutivo com PAS < 90 mmHg sustentada): Fazer trombólise química sistêmica de urgência rápida com Alteplase de ataque (100mg IV correndo continuamente no período de 2 horas) para reperfusão mecânica vascular emergencial.`
      }
    ]
  },
  {
    area: 'Nefrologia',
    subjects: [
      {
        title: 'Distúrbios do Potássio',
        content: `• EPIDEMIOLOGIA: A hipercalemia representa um distúrbio metabólico frequente na emergência que ameaça a integridade miocárdica de forma iminente, acometendo principalmente portadores de Doença Renal Crônica (DRC) em uso concomitante de IECA, BRA ou poupadores de potássio.
• FISIOPATOLOGIA: Alterações na homeostase de excreção celular de Potássio alteram de forma perigosa o potencial elétrico de ação de membrana das células do sistema de condução elétrica miocárdica de repouso, podendo propiciar taquiarritmias graves e parada cardiorrespiratória abrupta em sístole diastólica.
• DIAGNÓSTICO: Classificado como Hiperpotassemia se Potássio sérico (K+) > 5,5 mEq/L e Hipopotassemia se < 3,5 mEq/L. Achados de ECG Clínicos na Hiperpotassemia (Emergência): Ondas T simétricas, pontiagudas e "em tenda" (K > 5,5 mEq/L) evoluindo sequencialmente para achatamento agudo de onda P com prolongamento PR, alargamento do complexo QRS (K > 6,5 mEq/L), padrão ondulatório sinusoidal final característico e PCR se K > 7,5-8,0 mEq/L.
• TRATAMENTO: Tratamento imediato de Hiperpotassemia com alterações no ECG de admissão: (1) Estabilização de membrana miocárdica IMEDIATA com Gluconato de Cálcio 10% na dose de 10ml (1 ampola) por via intravenosa administrado lento em 3-5 minutos (pode repetir em 10 minutos se padrão de ECG persistir); (2) Terapia de desvio transcelular rápido (Glicoinsulina: 10 UI de insulina rápida diluída em 100ml de Glicose 50% correndo IV em 20 minutos; inalação com Salbutamol 10-20 jatos); (3) Terapia de eliminação real do íon: Poliestirenossulfonato de Cálcio (Sorcal) 30g VO de 8/8h e/ou Furosemida 40mg IV.`
      },
      {
        title: 'Doença Renal Crônica (DRC)',
        content: `• EPIDEMIOLOGIA: Distúrbio epidemiológico crônico de forte impacto global que acomete cerca de 10% da população adulta total, apresentando íntima relação patogênica causal com a Diabetes Mellitus crônica mal controlada e a Hipertensão Arterial de longa data.
• FISIOPATOLOGIA: Perda paulatina, progressiva, prolongada e irreversível da densidade de néfrons funcionais em decorrência de esclerose capilar glomerular e fibrose tubular intersticial crônica cicatricial. Isso acarreta retenção acumulada progressiva de toxinas urêmicas nitrogenadas, distúrbios de retenção ácida/bicarbonato, expansão volêmica hídrica por perda de capacidade dialítica de ultrafiltração, anemia hipoproliferativa por déficit grave de síntese de eritropoietina e alterações ósteo-minerais patológicas.
• DIAGNÓSTICO: Evidência inabalável estabelecida de taxa de filtração glomerular (TFG estimada pelo escore CKD-EPI) persistentemente < 60 mL/min/1,73m² ou marcadores estabelecidos e confirmados de integridade estrutural e funcional renal prejudicada de base (como Albuminúria sustentada > 30 mg/24 horas) por um período temporal contínuo superior a 3 meses consecutivos. Classificar pelos estágios padrão do consenso KDIGO.
• TRATAMENTO: O manejo básico consiste no bloqueio absoluto proativo da velocidade de perda funcional progressiva através do uso de agentes nefroprotetores do eixo renal: Inibidores do Sistema RAA (IECA ou BRA titulados até dose máxima tolerável) associados de forma sinérgica a inibidores do co-transportador SGLT2 (Dapagliflozina ou Empagliflozina) para controle da hiperfiltração fisiológica residual. Controle rígido da anemia de base com reposição de eritropoietina humana recombinante, reposição oral de Bicarbonato de Sódio para manutenção sérica > 22 mEq/L e abordagem firme do distúrbio mineral com quelantes intestinais de fósforo.`
      }
    ]
  },
  {
    area: 'Reumatologia',
    subjects: [
      {
        title: 'Lúpus Eritematoso Sistêmico (LES)',
        content: `• EPIDEMIOLOGIA: Doença inflamatória sistêmica crônica autoimune de etiologia multifatorial que acomete em ampla preferência clínica mulheres jovens em idade fértil reprodutiva na dramática proporção de cerca de 9:1 em relação aos homens, preferindo negras e latinas.
• FISIOPATOLOGIA: Caracteriza-se por uma perda acentuada da autotolerância imunológica das células B e T com síntese hiperativa e desregulada de múltiplos autoanticorpos dirigidos contra antígenos nucleares teciduais. Isso resulta na deposição maciça generalizada de complexos imunes circulantes (como os complexos DNA-Anti-DNA) na parede de pequenos vasos e tecidos em diversos órgãos (rins, articulações, pele), gerando vasculite inflamatória local e ativação exuberante da cascata do sistema complemento.
• DIAGNÓSTICO: Aplicação sistemática dos critérios consorciados de classificação EULAR/ACR 2019. Critério de Entrada Obrigatório: Título de FAN (Fator Antinuclear) ≥ 1:80 em imunofluorescência indireta sobre células Hep-2. Avaliar de forma continuada domínios clínicos ponderados por escores (como rash malar inflamatório em borboleta de face, fotossensibilidade, perda de cabelo difusa alopecia, artrite não erosiva de duas juntas, nefrite lúpica com proteinúria comprovada por biópsia, derrame pleural, plaquetopenia autoimune) e dados imunológicos (hipocomplementemia de C3 e C4 séricos, presença de Anti-dsDNA altamente específico ou Anti-Sm).
• TRATAMENTO: Prescrever de forma obrigatória universal para todo paciente lúpico ativo sem contraindicações formais o Sulfato de Hidroxicloroquina (antimalárico imunomodulador básico de manutenção) na dosagem estrita e segura de até 5 mg/kg do peso ideal/dia. O fármaco previne de forma primária e secundária novos surtos de ativação grave orgânica e reduz sensivelmente a progressão da nefrite, aumentando a expectativa de vida global. Crises agudas leves ou moderadas: Prednisona oral de dose baixa para desmame rápido. Surtos de nefrite lúpica com proteinúria maciça ou sintomas de SNC agudos de base: Pulsoterapia com Metilprednisolona venosa imediata por 3 dias seguido de imunossupressão planejada com Micofenolato de Mofetila.`
      },
      {
        title: 'Artrite Reumatoide',
        content: `• EPIDEMIOLOGIA: Prevalência aproximada de 1,0% da população adulta mundial total, ocorrendo principalmente em mulheres na faixa etária produtiva situada entre 30 e 50 anos de idade cronológica.
• FISIOPATOLOGIA: Processo autoimune linfocítico crônico difuso direcionado ao tecido sinovial das articulações diartrodiais. Resulta na proliferação exsudativa inflamatória do tecido sinovial (denominado crescimento de "Pannus"), que invade de forma invasiva osteoclastos e condrócitos circundantes, gerando erosão óssea articular marginal, destruição irreversible da cartilagem local e deformidades graves de articulação.
• DIAGNÓSTICO: Caracterizado por quadro clínico de duração crônica (> 6 semanas) consistente com poliartrite aditiva simétrica inflamatória dolorosa de pequenas articulações bilaterais periféricas (carpo, metacarpofalângicas e interfalângicas proximais preservando distais), que cursa tipicamente com rigidez articular matinal prolongada que melhora após longo período de movimento diário (> 1 hora). Diagnóstico definitivo amparado por sorologia marcadora de especificidade: Fator Reumatoide (FR) e Anticorpo anti-peptídeo citrulinado cíclico (Anti-CCP) associado a PCR/VHS muito alterados e erosões marginais típicas visualizadas em Rx.
• TRATAMENTO: O tratamento ideal deve ser planejado e iniciado de forma imediata o mais precoce possível (janela de oportunidade terapêutica de até 3 meses pós-início) visando a remissão sustentada ("Treat-to-Target"). Medicamento Modificador de Curso da Doença (MMCD) convencional de primeira linha de escolha: Metotrexato (MTX) iniciado por via oral ou subcutâneo em dosagem semanal de 10mg a 15mg tomada de forma única em 1 só dia da semana (titula progressivamente até 25mg/semana). Associar obrigatoriamente Ácido Fólico (5mg VO administrado rigorosamente 24-48 horas após a ingestão isolada semanal do Metotrexato) para bloquear efeitos de toxicidade mielossupressora e estomatite.`
      },
      {
        title: 'Gota (Artrite Gotosa)',
        content: `• EPIDEMIOLOGIA: A causa mais prevalente de artrite inflamatória invasiva dolorosa em homens adultos acima dos 40 anos, exibindo nítida associação com a vigência de distúrbios lipídicos, obesidade androide visceral e Síndrome Metabólica sistêmica de base.
• FISIOPATOLOGIA: Distúrbio metabólico crônico da via de eliminação ou hiperprodução de purinas induzindo Hiperuricemia crônica persistente (níveis de ácido úrico sérico > 6,8-7,0 mg/dL). Ao atingir o limite físico de saturação do fluido sinovial articular, formam-se depósitos e precipitados locais de microcristais de Urato Monossódico (UMS). A liberação súbita desses cristais para dentro do espaço articular livre ativa o inflamassoma NLRP3 e atrai leucócitos, desencadeando crise exsudativa extremamente fustigante.
• DIAGNÓSTICO: Apresentação marcante clássica de monoartrite aguda extremamente dolorosa com hiperemia local, calor, edema exuberante e incapacidade profunda de marcha ao redor do apoio podal de instalação rápida noturna, acometendo classicamente a primeira articulação metatarsofalângica articulante do pé (conhecido pelo epônimo de "Podagra"). O diagnóstico definitivo inequívoco baseia-se na constatação de microcristais de Urato Monossódico em agulha e com birrefringência fortemente negativa ao estudo microscópico com luz polarizada de amostra de líquido sinovial aspirado por punção.
• TRATAMENTO: Terapia escalonada estrita por fases clínicas: (1) Manejo emergencial imediato da crise de artrite dolorosa gota: Iniciar AINEs em dosagens máximas toleradas (como Indometacina, Naproxeno) associados simultaneamente a doses baixas fracionadas e controladas de Colchicina (0,5mg VO de 8/8h ou até alívio, sem exceder doses diárias seguras). Evitar corticoide sistêmico se não houver refratariedade. Não iniciar ou suspender de forma brusca o Alopurinol na vigência da crise em si para evitar mobilização do urato sinovial e prolongamento dos sintomas agudos. (2) Profilaxia contínua e redução de urato após resolução completa da crise inflamatória: Iniciar terapia de base hipouricemiante com uso continuado de Alopurinol (titulado a partir of 100mg/dia VO) objetivando patamar alvo de ácido úrico sérico < 6,0 mg/dL.`
      }
    ]
  },
  {
    area: 'Hematologia',
    subjects: [
      {
        title: 'Anemias Microcíticas',
        content: `• EPIDEMIOLOGIA: A Anemia Ferropriva representa as maiores deficiências nutricionais e de composição na infância e em mulheres adultas férteis no mundo todo. O seu rastreamento é essencial em queixas crônicas de fadiga inexplicada e cansaço.
• FISIOPATOLOGIA: Ocorre déficit na produção de hemoglobina intracelular decorrente de 3 etiologias de base comuns: (1) Depleção crônica profunda das reservas corporais essenciais de ferro celular (Anemia Ferropriva); (2) Sequestro indevido e inibição da ferroportina macrofágica induzida por níveis elevados de hepcidina inflamatória na vigência de doenças reumatológicas, neoplásicas ou infecciosas subclínicas (Anemia de Doença Crônica); (3) Defeito hereditário genético de síntese das cadeias normais de globina α ou β (Talassemia Major/Minor).
• DIAGNÓSTICO: Hemograma indicando anemia hipocrômica microcítica (VCM < 80 fL, CHCM < 32 g/dL) associada à análise bioquímica de ferro. Perfil de Ferro típico na Anemia Ferropriva: Ferritina sérica de admissão francamente depletada (< 15-30 ng/mL - melhor marcador isolado), ferro sérico baixo e Capacidade Total de Ligação do Ferro (TIBC) compensatoriamente alta. Na anemia de doença crônica, as reservas celulares de Ferritina encontram-se normais ou significativamente elevadas, com ferro sérico depletado por sequestro.
• TRATAMENTO: Na Anemia Ferropriva comprovada: Prescrever de forma adequada e prolongada Sulfato Ferroso oral na dosagem terapêutica calibrada correspondente a 120mg a 200mg de ferro elementar por dia para adultos em regime fracionado, administrado idealmente acompanhado de ambiente ácido ou vitamina C para absorção, no período de 3 a 6 meses após a normalização total do hemograma para reabastecer as reservas basais celulares de depósitos do organismo.`
      },
      {
        title: 'Neutropenia Febril',
        content: `• EPIDEMIOLOGIA: Emergência oncológica / hematológica de altíssimo risco e extrema urgência que ocorre tipicamente pós-tratamento de quimioterapia para neoplasias sólidas ou hematológicas, apresentando uma taxa bruta de mortalidade alarmante de até 30% nas primeiras horas se a antibioticoterapia empírica direcionada for indevidamente protelada.
• FISIOPATOLOGIA: Ocorre destruição iatrogênica transitória do nicho maduro de precursores celulares neutrofílicos na medula óssea. Sem barreiras de defesa celular fagocítica na mucosa do trato gastrointestinal inferior por inflamação quimioterápica (muco-exsudativa), ocorre rápida e massiva translocação bacteriana enteral de patógenos (como Pseudomonas aeruginosa de grande potencial destrutivo vascular imediato) diretamente para a corrente sanguínea, induzindo sepse hiperaguda fulminante.
• DIAGNÓSTICO: Definição estabelecida pela contagem absoluta de neutrófilos periféricos (ANC) < 500 células/mm³ (ou expectativa inequívoca de queda rápida para patamar < 500 nas próximas 48 horas) associada a uma única medida de temperatura aferida em cavidade oral ≥ 38,3ºC ou temperatura sustentada ≥ 38,0ºC por pelo menos 1 hora clínica sob aferição fidedigna.
• TRATAMENTO: NÃO POSTERGAR Antibioticoterapia empírica imediata direcionada por via endovenosa na "Hora de Ouro" (idealmente até 60 minutos do surgimento aferido da febre na triagem). Esquema prioritário de largo espectro com cobertura de Pseudomonas: Escolher preferencialmente o uso de β-lactâmico antipseudomonas como Cefepime 2g IV correndo de 8/8h em adultos, ou Piperacilina/Tazobactam 4,5g IV correndo de 6/6h. Adicionar Vancomicina empírica se houver instabilidade hemodinâmica, infecção óbvia de pele ou suspeita inequívoca de infecção em cateter central.`
      }
    ]
  },
  {
    area: 'Ginecologia (Medicina Interna)',
    subjects: [
      {
        title: 'Vaginites e Vaginose',
        content: `• EPIDEMIOLOGIA: Representa um dos principais e mais corriqueiros motivos clínicos de agendamento de consulta ginecológica e de atenção primária no Brasil, ocorrendo em cerca de 40% de mulheres em idade reprodutiva ativa.
• FISIOPATOLOGIA: Modificações e desequilíbrios na constituição populacional da flora bacteriana protetiva vaginal de Döderlein normais (Lactobacillus acidophilus que metabolizam glicogênio e preservam o pH vaginal ácido < 4,5). O declínio desses bacilos expõe o nicho biológico para colonização hiperativa de anaeróbios microscópicos (como a Gardnerella vaginalis, causadora da Vaginose Bacteriana) ou proliferação local saprófita de fungos sob condições favoráveis (como a Candida albicans).
• DIAGNÓSTICO: Baseia-se no exame ginecorretal com espéculo e na aplicação detalhada dos Critérios de Amsel para Vaginose Bacteriana: (1) Presença de corrimento homogêneo acinzetado flutuante; (2) pH do fluido vaginal nitidamente básico/alcalino > 4,5; (3) Teste das aminas exalando odor de peixe podre positivo ao gotejamento de KOH a 10% (Whiff Test); (4) Presença marcante de Células-Alvo epiteliais de descamação repletas de bactérias aderidas (Clue Cells) ao exame microscópico microscópico. Na Candidíase, o corrimento é característico em nata de leite grumoso, espesso e inodoro, cursando com pH ácido (< 4,5).
• TRATAMENTO: Vaginose Bacteriana: Prescrever Metronidazol na dose de 500mg por via oral de 12/12h durante o período de 7 dias inteiros consecutivos, orientando a abstinência rígida de álcool (Efeito Antabuse / Dissulfiram-like). Candidíase Vulvovaginal: Prescrever Fluconazol na dose de 150mg VO tomado em dose única ou aplicação local tópica profunda de creme de Miconazol nitrato vaginal de 7 a 14 dias diários.`
      },
      {
        title: 'Doença Inflamatória Pélvica (DIP)',
        content: `• EPIDEMIOLOGIA: Infecção comum grave e insidiosa de causa ascendente de grande impacto reprodutivo que atinge preferencialmente adolescentes jovens em atividade sexual exuberante ou portadoras de histórico anterior de infecções transmissíveis de repetição.
• FISIOPATOLOGIA: Ascensão mecânica retrógada e disseminação progressiva de microrganismos patogênicos infecciosos bacterianos sexuais (infectando prioritariamente Neisseria gonorrhoeae e Chlamydia trachomatis) que transgridem a mucosa do colo do útero e progridem pelo canal endometrial, atingindo e destruindo as trompas de Falópio, tecido ovariano interno e o peritônio pélvico circundante, podendo ocasionar peritonite, abscessos pélvicos e infertilidade por cicatrizes tubárias obstrutivas.
• DIAGNÓSTICO: Consiste no preenchimento clínico de pelo menos 3 critérios maiores essenciais de base: (1) Dor espontânea abdominal em quadrante inferior pélvico difuso; (2) Dor intensa e limitante à mobilização física firme do colo do útero ao toque vaginal bidirecional; (3) Dor nítida à palpação profunda anexial bilateral de trompas/ovários. Presença de critérios menores corroboradores de diagnóstico: Conteúdo anormal purulento flutuante no canal, febre (> 38,0ºC) de início recente e leucocitose.
• TRATAMENTO: Regime de Conduta Ambulatorial Consensual (DIP Leve / Moderada Grau 1): Administrar dose única intramuscular profunda de Ceftriaxona 500mg IM para esterilização de Gonococo, associada simultaneamente a Doxiciclina de amplo espectro na dose de 100mg VO de 12/12h por 14 dias inteiros + Metronidazol 500mg VO de 12/12h por 14 dias consecutivos para cobertura anaeróbia. Encaminhar para internação e tratamento venoso se houver instabilidade hemodinâmica, náuseas/vômitos incoercíveis impossibilitando terapia oral ou suspeita de Abscesso Tubo-ovariano estabelecido.`
      }
    ]
  },
  {
    area: 'Dermatologia Clínica',
    subjects: [
      {
        title: 'Farmacodermias Graves',
        content: `• EPIDEMIOLOGIA: Reações cutâneas adversas a medicamentos raras, mas catastróficas, que compreendem a Síndrome de Stevens-Johnson (SSJ), Necrólise Epidérmica Tóxica (NET) e Reação a Drogas com Eosinofilia e Sintomas Sistêmicos (DRESS), apresentando mortalidade hospitalar intercorrente que flutua entre 10% e 40%.
• FISIOPATOLOGIA: Na SSJ e NET, ocorre hipersensibilidade tardia imuno-mediada do tipo IVc com liberação exuberante de linfócitos T citotóxicos e citocinas destruidoras (como a Granulisina) que induzem a apoptose maciça de queratinócitos basais epidérmicos, provocando o descolamento dermoepidérmico em grande extensão cutânea.
• DIAGNÓSTICO: Classificado pela extensão acometida de descolamento de pele por área de superfície corporal (SSJ < 10%; sobreposicão SSJ/NET 10-30%; NET > 30% da área). Presença de Sinal de Nikolsky positivo (fácil descolamento de pele saudável adjacente à fricção lateral). Na síndrome DRESS, verifica-se a tríade diagnóstica: erupção cutânea difusa pruriginosa + linfadenopatia inflamatória em múltiplas cadeias + eosinofilia periférica acentuada com acometimento funcional de órgãos como miosite ou hepatite severa.
• TRATAMENTO: Interrupção imediata absoluta de todo e qualquer medicamento não essencial em uso recente. Encaminhar pacientemente o portador de SSJ/NET grave com perda abundante de pele para Unidade de Tratamento de Queimados (UTQ) ou UTI especializada, mantendo rígido isolamento protetor, controle fisiológico térmico ideal, reposição hidroeletrolítica calculada meticulosa com fluidos aquecidos e suporte nutricional por sonda enteral precoce.`
      },
      {
        title: 'Escabiose',
        content: `• EPIDEMIOLOGIA: Infestação cutânea parasitária altamente contagiosa e amplamente disseminada que atinge pessoas de todas as faixas etárias e classes sociais, ocorrendo principalmente em ambientes de aglomeração como creches, asilos e quartéis.
• FISIOPATOLOGIA: Causada pelo ácaro parasita Sarcoptes scabiei var. hominis. A fêmea fertilizada escava túneis no estrato córneo da epiderme para depositar seus ovos e fezes, o que desencadeia uma intensa reação de hipersensibilidade tardia do hospedeiro, mediada por anticorpos e células T, resultando em prurido de alta intensidade.
• DIAGNÓSTICO: Baseia-se em achados clínicos consistentes em prurido com exacerbação noturna intensa, lesões papuloverrucosas e pequenos sulcos lineares (túneis) localizados tipicamente em dobras cutâneas relevantes (espaços interdigitais das mãos, punhos, axilas, aréolas, região umbilical e genitália masculina). Confirmação opcional pela pesquisa direta do ácaro ao exame microscópico de raspado cutâneo das lesões.
• TRATAMENTO: Prescrever Permetrina 5% em creme de uso tópico em todo o corpo, do pescoço para baixo, deixando agir por 8 a 12 horas e enxaguando em seguida. Recomenda-se repetir a aplicação após 7 dias para erradicar ácaros recém-eclodidos dos ovos persistentes. Alternativa oral: Ivermectina 200 mcg/kg VO em dose única, repetida após uma semana. Tratar rigorosamente todos os contatos domiciliares simultaneamente e lavar pertences em água quente.`
      }
    ]
  },
  {
    area: 'Pediatria e Hidratação',
    subjects: [
      {
        title: 'Planos de Hidratação (Plano A, B e C)',
        content: `• PLANO A (Tratamento Domiciliar): Indicado para crianças com diarreia aguda sem sinais de desidratação. Consiste em aumentar a oferta de líquidos (água, soro caseiro ou SRO após cada evacuação líquida: < 2 anos: 50 a 100 mL; ≥ 2 anos: 100 a 200 mL), manter a alimentação habitual habitual e orientar detalhadamente a família sobre sinais de alerta para retorno imediato imediato.
• PLANO B (Reidratação Oral supervisionada na Unidade de Saúde): Indicado para desidratação leve a moderada. Administrar SRO na dosagem de 50 a 100 mL/kg ao longo de um período de 4 a 6 horas em colheradas frequentes. Reavaliar continuamente; se houver melhora, passar para o Plano A.
• PLANO C (Reidratação Intravenosa Rápida): Indicado para desidratação grave ou choque hipovolêmico. Fase de Expansão Pediátrica: Infundir Soro Fisiológico (SF) 0,9% na dose de 20 mL/kg por via endovenosa correndo rápido (repetir até reversão do choque). Fase de Manutenção Segura subsequente baseada na regra clássica de Holliday-Segar: 100 mL/kg para os primeiros 10 kg, mais 50 mL/kg para os próximos 10 kg, e mais 20 mL/kg adicionais para cada kg subsequente acima de 20 kg.`
      },
      {
        title: 'Desnutrição e Choque',
        content: `• MANEJO: Cautela hemodinâmica EXTREMA ao planejar hidratação venosa ou expansor volêmico rápido em pacientes com diagnóstico de desnutrição grave crônica (portadores de quadros clínicos de Marasmo ou Kwashiorkor). Esses pacientes apresentam atrofia miocárdica de espessura de parede associada a disfunção de canais iônicos estruturais de membrana de base, o que os torna excessivamente suscetíveis ao desenvolvimento de disfunção cardíaca congestiva hiperaguda e edema agudo de pulmão na vigência de infusões de fluidos.
• MONITORIZAÇÃO: A avaliação perfusional periférica deve ser monitorada rigorosamente à beira do leito de forma contínua, mensurando de forma constante parâmetros como do débito diurético horário via sondagem ou pesagem de fralda (alvo terapêutico essencial > 1,0 mL/kg/hora de diurese estável), monitoramento da pressão arterial méida e saturação venosa de O2 se disponível.
• SINAIS DE ALERTA: Sinais clínicos inequívocos de deterioração hemodinâmica e colapso perfusional em emergência pediátrica de alta prioridade: Redução rebaixamento súbito do estado do nível de consciência, letargia profunda progressiva, tempo de enchimento capilar periférico severamente prolongado (> 4 segundos), hipotermia inexplicada (< 35,5ºC), além de taquiarritmias e ritmo de galope auscultado no precórdio.`
      }
    ]
  }
];

// --- Flowchart Data ---

const FlowchartShock = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente com Hipotensão ou Sinais de Hipoperfusão?", options: [{ label: "Sim", next: 1 }] },
    { text: "Avaliar JVP, Presença de Edema Pulmonar ou Ruídos.", options: [{ label: "JVP Baixa (Seco)", next: 2 }, { label: "JVP Alta (Úmido)", next: 4 }] },
    { text: "Provável Choque Hipovolêmico ou Distributivo. Fazer Prova de Carga (Cristaloide).", options: [{ label: "Melhorou", next: 3 }, { label: "Não Melhorou", next: 5 }] },
    { text: "Ajustar dose e tratar causa base (Hemorragia, Sepse, Anafilaxia).", options: [{ label: "Reset", next: 0 }] },
    { text: "Provável Choque Cardiogênico. Evitar Fluido! Considerar Inotrópico (Dobutamina).", options: [{ label: "Solicitar ECO", next: 0 }] },
    { text: "Refratário a Fluido? Iniciar Noradrenalina (Vasopressor).", options: [{ label: "Avaliar Sepse", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-medical-secondary/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-medical-secondary flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Choque (Abordagem)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-medical-secondary text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-medical-secondary/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartAnaphylaxis = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Suspeita de Anafilaxia (Pele + Resp/CV)?", options: [{ label: "Sim", next: 1 }] },
    { text: "ADRENALINA IM IMEDIATA! (Vasto Lateral da Coxa).", options: [{ label: "Adulto: 0.5mg", next: 2 }, { label: "Criança: 0.01mg/kg", next: 2 }] },
    { text: "Sinais de Obstrução de Vias Aéreas ou Hipotensão?", options: [{ label: "Não", next: 3 }, { label: "Sim (Chamar UTI)", next: 4 }] },
    { text: "Adjuvantes: Anti-histamínicos + Corticoide. Observar 4-8h.", options: [{ label: "Reset", next: 0 }] },
    { text: "Nebulização com Adrenalina + Reposição Volêmica + VM se necessário.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-950 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-rose-900 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Anafilaxia (Emergência)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-rose-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-rose-900/50 px-4 py-2 rounded-xl border border-rose-800">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-rose-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-rose-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartACLS = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente Inconsciente e sem Pulso?", options: [{ label: "Sim", next: 1 }] },
    { text: "Iniciar RCP (30:2) + Oxigênio + Monitor/Desfibrilador. Ritmo é chocável?", options: [{ label: "FV / TVSP (SIM)", next: 2 }, { label: "Assistolia / AESP (NÃO)", next: 5 }] },
    { text: "Choque! Reiniciar RCP imediatamente por 2 min + Acesso IV/IO.", options: [{ label: "Próximo Passo", next: 3 }] },
    { text: "Ritmo é chocável após 2 min?", options: [{ label: "Sim (Choque + Epinefrina)", next: 4 }, { label: "Não", next: 6 }] },
    { text: "Choque! RCP 2 min + Epinefrina 1mg a cada 3-5 min + Via aérea avançada?", options: [{ label: "Considerar Amiodarona", next: 7 }] },
    { text: "Epinefrina 1mg imediatamente + Atentar para 5Hs e 5Ts. Ritmo é chocável?", options: [{ label: "Sim", next: 2 }, { label: "Não", next: 1 }] },
    { text: "ROSC (Retorno da Circulação Espontânea)?", options: [{ label: "Sim (Cuidados Pós-Parada)", next: 8 }, { label: "Não", next: 1 }] },
    { text: "Amiodarona 300mg (1ª dose) ou Lidocaína.", options: [{ label: "Voltar ao Ciclo", next: 3 }] },
    { text: "Protocolo de Cuidados Pós-Parada: O2 > 92%, PAM > 65, ECG 12 derivações.", options: [{ label: "Finalizar", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none" />
      
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-500 flex items-center justify-center animate-pulse shadow-lg shadow-rose-500/50">
            <Zap size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Algoritmo PCR (ACLS)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>

      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div 
           key={step} 
           initial={{ opacity: 0, y: 10 }} 
           animate={{ opacity: 1, y: 0 }}
           className="space-y-10"
         >
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button 
                  key={i}
                  onClick={() => setStep(opt.next)}
                  className="bg-rose-500 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-rose-500/20 text-lg"
                >
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>

      <div className="flex justify-center relative z-10">
        <div className="flex gap-2">
          {steps.map((_, i) => (
            <div key={i} className={`h-1 !rounded-full transition-all duration-500 ${i === step ? 'w-10 bg-rose-500' : 'w-2 bg-slate-700'}`} />
          ))}
        </div>
      </div>
    </motion.div>
  );
}

const FlowchartTachy = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente com Taquiarritmia (FC > 150 bpm)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Possui Sinais de Instabilidade? (Hipotensão, Dor Torácica, Alteração Sensório, IC Aguda)?", options: [{ label: "ESTÁVEL", next: 2 }, { label: "INSTÁVEL", next: 5 }] },
    { text: "QRS Estreito e Ritmo Regular?", options: [{ label: "Sim (Manobra Vagal)", next: 3 }, { label: "Não (Ir p/ Especialista)", next: 4 }] },
    { text: "Se Vagal falhar: Adenosina 6mg (1ª dose) -> 12mg (2ª dose).", options: [{ label: "Finalizar", next: 0 }] },
    { text: "Considerar FA (Controle de Frequência) ou outras arritmias complexas.", options: [{ label: "Finalizar", next: 0 }] },
    { text: "Cardioversão Elétrica Sincronizada!", options: [{ label: "Considerar Sedação", next: 6 }] },
    { text: "Dose inicial conforme ritmo: 50-100J (SVPT), 120-200J (FA).", options: [{ label: "Reiniciar", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-500 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Taquiarritmias (ACLS)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-indigo-500 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-indigo-500/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartBrady = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente com Bradicardia (FC < 50 bpm)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Sinais de Instabilidade? (Hipotensão, Alteração Mental, Choque, Dor Torácica, IC Aguda).", options: [{ label: "NÃO (Observar)", next: 2 }, { label: "SIM (Instável)", next: 3 }] },
    { text: "Manter monitorização e considerar causas secundárias.", options: [{ label: "Reset", next: 0 }] },
    { text: "Atropina 1mg IV! (Pode repetir a cada 3-5 min, max 3mg).", options: [{ label: "Sucesso?", next: 2 }, { label: "Falhou", next: 4 }] },
    { text: "Considerar Marcapasso Transcutâneo OU Infusão de Dopamina OU Adrenalina.", options: [{ label: "Consultar Especialista", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-500 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Bradicardias (ACLS)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-emerald-500 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-emerald-500/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartHyperkalemia = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Potássio (K+) > 5.5 mEq/L e/ou Alteração no ECG?", options: [{ label: "Sim", next: 1 }] },
    { text: "Alterações no ECG: Onda T apiculada, QRS largo ou ausência de P?", options: [{ label: "NÃO (Estável)", next: 2 }, { label: "SIM (Instável)", next: 3 }] },
    { text: "Shift Transcelular: Glicoinsulina + Fenoterol + Bicarbonato (se acidose).", options: [{ label: "Próximo Passo", next: 4 }] },
    { text: "ESTABILIZAÇÃO DE MEMBRANA: Gluconato de Cálcio 10% 10-20mL IV!", options: [{ label: "Normalizou ECG?", next: 2 }] },
    { text: "Aumentar Excreção: Furosemida 40mg IV + Sorcal 30g VO.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Hipercalemia (Manejo)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-cyan-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartHypertension = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "PA > 180/120 mmHg?", options: [{ label: "Sim", next: 1 }] },
    { text: "Lesão de Órgão Alvo Aguda (Cérebro, Coração, Rim, Olho)?", options: [{ label: "NÃO (Urgência)", next: 2 }, { label: "SIM (Emergência)", next: 3 }] },
    { text: "Tratar VO: Captopril ou Clonidina. Redução gradual em 24-48h.", options: [{ label: "Reset", next: 0 }] },
    { text: "Internação + Droga IV (Nitroprussiato ou Tridil). Alvo: Queda de 20% da PAM em 1h.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-amber-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-amber-500 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Crise Hipertensiva</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-amber-500 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-amber-500/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartStroke = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Suspeita de AVC (SAMU/Triagem): Déficit focal súbito?", options: [{ label: "Sim", next: 1 }] },
    { text: "Estabilização (ABC): Glicemia capilar rápida!", options: [{ label: "Glicemia OK", next: 2 }] },
    { text: "Realizar TC de Crânio IMEDIATA. Há hemorragia?", options: [{ label: "SIM (AVCh)", next: 3 }, { label: "NÃO (AVCi)", next: 4 }] },
    { text: "AVCh: Controle rigoroso de PA (< 140 mmHg) + Equipe Neurocirurgia.", options: [{ label: "Reset", next: 0 }] },
    { text: "AVCi: Início dos sintomas < 4.5h?", options: [{ label: "SIM", next: 5 }, { label: "NÃO (> 4.5h)", next: 6 }] },
    { text: "Trombólise (Alteplase) se PA < 185/110 e sem contraindicações.", options: [{ label: "Reset", next: 0 }] },
    { text: "Considerar Trombectomia Mecânica (até 24h) ou suporte secundário.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <Zap size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">AVC Isquêmico/Hemorrágico</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-indigo-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-indigo-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartAsthma = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente com dispneia e sibilância (Crise de Asma)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Sinais de fala entrecortada, esforço respiratório, SaO2 < 90%?", options: [{ label: "SIM (Grave)", next: 2 }, { label: "NÃO (Leve/Mod)", next: 3 }] },
    { text: "GRAVE: Oxigênio (SaO2 93-95%) + Beta2 10-20 jatos + Ipratrópio + Corticoide IV.", options: [{ label: "Sem melhora (UTI)", next: 4 }, { label: "Melhora", next: 5 }] },
    { text: "LEVE: Beta2 4-10 jatos a cada 20 min por 1h + Corticoide VO.", options: [{ label: "Reavaliar", next: 5 }] },
    { text: "UTI: Sulfato de Magnésio 2g IV + Considerar Intubação.", options: [{ label: "Reset", next: 0 }] },
    { text: "MANUTENÇÃO: Corticoide por 5-7 dias + Ajustar tratamento crônico.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-emerald-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-emerald-600 flex items-center justify-center shadow-lg">
            <Wind size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Asma Aguda Exacerbada</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-emerald-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-emerald-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartGIBleed = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Hematêmese ou Melena (Hemorragia Digestiva Alta)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Estabilização Hemodinâmica (ABC): 2 acessos calibrosos + Cristaloides.", options: [{ label: "Estável", next: 2 }, { label: "Instável", next: 3 }] },
    { text: "Realizar Endoscopia (EDA) em até 24h. Iniciar IBP 80mg dose ataque.", options: [{ label: "Reset", next: 0 }] },
    { text: "Protocolo de Transfusão (Alvo Hb > 7) + EDA de urgência.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-red-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-red-600 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Hemorragia Digestiva Alta</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-red-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-red-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartTEP = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Suspeita de TEP (Dispneia, Dor torácica, Taquicardia)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Escore de Wells p/ TEP: Baixa/Intermed (<= 4) ou Alta (> 4)?", options: [{ label: "<= 4 (Improvável)", next: 2 }, { label: "> 4 (Provável)", next: 3 }] },
    { text: "Solicitar D-Dímero.", options: [{ label: "Negativo (Exclui)", next: 4 }, { label: "Positivo", next: 3 }] },
    { text: "Solicitar Angio-TC de Tórax.", options: [{ label: "Positiva (Confirma)", next: 5 }, { label: "Negativa", next: 4 }] },
    { text: "Investigar outras causas. TEP excluído.", options: [{ label: "Reset", next: 0 }] },
    { text: "Iniciar Anticoagulação (Enoxaparina 1mg/kg 12/12h) + Avaliar Instabilidade.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-cyan-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-cyan-600 flex items-center justify-center shadow-lg">
            <Activity size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Manejo de TEP</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-cyan-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-cyan-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartSepsis = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Suspeita de Infecção + Disfunção Orgânica (qSOFA >= 2)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Protocolo de 1 Hora: Coletar Lactato + Hemoculturas.", options: [{ label: "Próximo", next: 2 }] },
    { text: "Antibiótico de Amplo Espectro IV + Cristaloide 30mL/kg (se hipotenso/Lactato >= 4).", options: [{ label: "Reavaliar", next: 3 }] },
    { text: "PAM >= 65 mmHg? Se não, iniciar Vasopressores (Noradrenalina).", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-purple-600 flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Sepse (Protocolo 1h)</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-purple-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-purple-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

const FlowchartHydration = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Avaliar Sinais de Desidratação. Paciente apresenta sede intensa, olhos encovados ou prega cutânea lenta?", options: [{ label: "Não (Plano A)", next: 1 }, { label: "Sim, 2 ou + sinais (Plano B/C)", next: 2 }] },
    { text: "PLANO A: Tratamento Domiciliar. Aumentar líquidos, manter alimentação e dar SRO após perdas. Orientar sinais de alarme.", options: [{ label: "Reset", next: 0 }] },
    { text: "Há sinais de choque (Pulso fraco, TEC > 2s, Letargia)?", options: [{ label: "Não (Plano B)", next: 3 }, { label: "Sim (Plano C)", next: 4 }] },
    { text: "PLANO B: Reidratação Oral na Unidade (TRO). 50-100 mL/kg de SRO em 4h. Reavaliar continuamente.", options: [{ label: "Melhorou -> Plano A", next: 1 }, { label: "Piorou -> Plano C", next: 4 }] },
    { text: "PLANO C: Hidratação Venosa Imediata (Expansão). SF 0,9% 20mL/kg em 20-30min. Repetir conforme necessário.", options: [{ label: "Estabilizou -> Plano B", next: 3 }, { label: "Manutenção", next: 5 }] },
    { text: "Fase de Manutenção (Holliday-Segar): 100mL/kg (1-10kg) + 50mL/kg (11-20kg) + 20mL/kg (>20kg).", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <Droplets size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Manejo de Desidratação</h3>
        </div>
        <button onClick={() => setStep(0)} className="text-slate-400 hover:text-white transition-colors flex items-center gap-2 text-xs font-bold uppercase tracking-widest bg-slate-800/50 px-4 py-2 rounded-xl border border-slate-700">
          Reset <RotateCcw size={14} />
        </button>
      </div>
      <div className="flex-1 flex items-center justify-center py-12 relative z-10 text-center">
         <motion.div key={step} initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} className="space-y-10">
           <p className="text-2xl md:text-3xl font-bold leading-tight max-w-lg mx-auto">{steps[step].text}</p>
           <div className="flex flex-wrap justify-center gap-4">
              {steps[step].options.map((opt, i) => (
                <button key={i} onClick={() => setStep(opt.next)} className="bg-blue-600 text-white px-10 py-4 rounded-2xl font-bold hover:scale-105 transition-transform shadow-xl shadow-blue-600/20 text-lg">
                  {opt.label}
                </button>
              ))}
           </div>
         </motion.div>
      </div>
    </motion.div>
  );
}

function EmergencyModule({ onSelect }: { onSelect: (d: typeof PRESCRIPTIONS[0]) => void }) {
  const [search, setSearch] = useState('');
  
  const filteredProtocols = PRESCRIPTIONS.filter(p => 
    p.title.toLowerCase().includes(search.toLowerCase()) ||
    p.category.toLowerCase().includes(search.toLowerCase())
  );

  const totalTarget = 160;
  const currentCount = PRESCRIPTIONS.length;
  const progressPercent = Math.round((currentCount / totalTarget) * 100);


  return (
    <div className="space-y-10">
      <div className="bg-white dark:bg-slate-900 p-8 rounded-[32px] border border-slate-200 dark:border-slate-800 flex flex-col md:flex-row md:items-center justify-between gap-8 shadow-sm">
        <div className="flex items-center gap-6">
          <div className="w-16 h-16 bg-rose-600 rounded-2xl flex items-center justify-center text-white shadow-xl shadow-rose-600/20 rotate-3">
             <Database size={32} />
          </div>
          <div>
            <h3 className="text-xl font-bold dark:text-white mb-1 tracking-tight">Status da Base de Dados</h3>
            <p className="text-sm text-slate-500 font-medium">Protocolos de PS finalizados</p>
          </div>
        </div>
        <div className="flex-1 max-w-md">
          <div className="flex justify-between items-center mb-3">
            <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">Progresso Atual</span>
            <span className="text-sm font-black text-rose-600 font-mono">{progressPercent}%</span>
          </div>
          <div className="h-3 bg-slate-100 dark:bg-slate-800 rounded-full overflow-hidden border border-slate-200 dark:border-slate-700">
            <motion.div 
              initial={{ width: 0 }}
              animate={{ width: `${progressPercent}%` }}
              className="h-full bg-gradient-to-r from-rose-600 to-rose-400 shadow-[0_0_15px_rgba(225,29,72,0.3)]"
            />
          </div>
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{currentCount} de {totalTarget} doenças mapeadas</p>
        </div>
      </div>

      <div className="relative group">
        <div className="absolute -inset-1 bg-gradient-to-r from-rose-600 to-orange-600 rounded-3xl blur opacity-25 group-focus-within:opacity-40 transition duration-1000"></div>
        <div className="relative flex items-center bg-white dark:bg-slate-800 rounded-[28px] border-2 border-slate-200 dark:border-slate-700 p-2 shadow-sm focus-within:border-rose-500 transition-all">
          <div className="p-4">
            <Search size={24} className="text-slate-400" />
          </div>
          <input
            type="text"
            placeholder="Pesquisar por patologia, sintoma ou classificação de risco (verde, amarelo, vermelho)..."
            className="flex-1 bg-transparent border-none focus:ring-0 text-slate-900 dark:text-white px-2 font-medium placeholder:text-slate-400"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
          {search && (
            <button 
              onClick={() => setSearch('')}
              className="p-3 text-slate-400 hover:text-slate-600 mr-2"
            >
              <XCircle size={20} />
            </button>
          )}
        </div>
      </div>

      {/* Main UPA Chief Complaints Selector */}
      <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
        <div className="flex items-center justify-between">
          <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
            <ClipboardList size={16} className="text-rose-600" />
            Queixas Principais mais Comuns na UPA (Pronto Atendimento)
          </h4>
          {search && (
            <button 
              onClick={() => setSearch('')} 
              className="text-[10px] font-black text-rose-600 uppercase tracking-widest hover:underline"
            >
              Limpar Filtro
            </button>
          )}
        </div>
        
        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
          {[
            { label: 'Dor Torácica', icon: Heart, term: 'Infarto' },
            { label: 'Falta de Ar / Sibilos', icon: Wind, term: 'Asma' },
            { label: 'Cefaleia Intensa', icon: Zap, term: 'Hipertensiva' },
            { label: 'Déficit Neurológico', icon: Brain, term: 'AVC' },
            { label: 'Alergia / Anafilaxia', icon: ShieldAlert, term: 'Anafilaxia' },
            { label: 'Dor Abdominal Aguda', icon: ClipboardList, term: 'Apendicite' },
            { label: 'Febre / Sepse', icon: AlertTriangle, term: 'Sepse' },
            { label: 'Palpitações / Ritmo', icon: Activity, term: 'FA' },
            { label: 'Crise Convulsiva', icon: Zap, term: 'Convulsiva' },
            { label: 'Pielonefrite / Dor Lombar', icon: Stethoscope, term: 'Pielonefrite' },
          ].map((comp) => {
            const Icon = comp.icon;
            const isActive = search.toLowerCase() === comp.term.toLowerCase();
            return (
              <button
                key={comp.label}
                onClick={() => setSearch(isActive ? '' : comp.term)}
                className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                  isActive 
                    ? 'bg-rose-500/10 border-rose-500 text-rose-700 dark:text-rose-450 font-black shadow-sm ring-1 ring-rose-500/30'
                    : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                }`}
              >
                <div className={`p-1.5 rounded-lg ${isActive ? 'bg-rose-500 text-white' : 'bg-slate-200/50 dark:bg-slate-850 text-slate-500'}`}>
                  <Icon size={14} />
                </div>
                <span className="text-[11px] leading-tight font-sans tracking-tight">{comp.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredProtocols.map((protocol) => (
          <motion.button
            key={protocol.id}
            whileHover={{ y: -8, scale: 1.02 }}
            whileTap={{ scale: 0.98 }}
            onClick={() => onSelect(protocol)}
            className="bg-white dark:bg-slate-800 rounded-[32px] border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm hover:shadow-2xl hover:shadow-rose-600/10 transition-all text-left flex flex-col group"
          >
            <div className="p-6 bg-slate-50 dark:bg-slate-900/50 border-b border-slate-100 dark:border-slate-700 flex items-start justify-between">
              <div>
                <span className={`inline-block px-2.5 py-1 rounded-lg text-[10px] font-black uppercase tracking-widest mb-3 ${
                   protocol.category.includes('Vermelho') ? 'bg-rose-500 text-white' : 
                   protocol.category.includes('Amarelo') ? 'bg-amber-500 text-white' : 
                   'bg-emerald-500 text-white'
                }`}>
                  {protocol.category}
                </span>
                <h3 className="text-xl font-bold dark:text-white leading-tight tracking-tight group-hover:text-rose-600 transition-colors uppercase italic font-serif">{protocol.title}</h3>
              </div>
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center transition-colors ${
                 protocol.category.includes('Vermelho') ? 'bg-rose-100 text-rose-600' : 
                 protocol.category.includes('Amarelo') ? 'bg-amber-100 text-amber-600' : 
                 'bg-emerald-100 text-emerald-600'
              }`}>
                <ShieldAlert size={20} />
              </div>
            </div>
            
            <div className="p-6 space-y-4 flex-1 flex flex-col">
              <div className="flex-1">
                <p className="text-sm dark:text-slate-400 text-slate-500 line-clamp-3 leading-relaxed font-medium">
                  {protocol.items[0]}
                </p>
              </div>
              
              <div className="pt-4 border-t border-slate-100 dark:border-slate-700 flex items-center justify-between text-rose-600">
                <span className="text-xs font-black uppercase tracking-[0.15em]">Ver Protocolo</span>
                <ChevronRight size={18} className="group-hover:translate-x-1 transition-transform" />
              </div>
            </div>
          </motion.button>
        ))}
      </div>
    </div>
  );
}

const REMOVED_PREV_CATALOG = [
  {
    id: "drge",
    name: "Doença do Refluxo Gastroesofágico (DRGE)",
    category: "Gastrointestinal",
    diagnostic: "Baseado fundamentalmente na anamnese: pirose retroesternal (queimação) e regurgitação ácida ≥ 2 vezes por semana, por pelo menos 4-8 semanas. A resposta positiva ao teste terapêutico com IBP apoia fortemente o diagnóstico.",
    alarm: "Disfagia (dificuldade de engolir), odinofagia (dor para engolir), sangramento digestivo (hematêmese/melena), anemia ferropriva inexplicável, perda ponderal involuntária rápida, ou início dos sintomas após os 50 anos: solicitar Endoscopia Digestiva Alta (EDA) com urgência para afastar neoplasia.",
    treatment: [
      {
        title: "1ª Linha - Inibidor de Bomba de Prótons (IBP) e Comportamental",
        desc: "Omeprazol 20mg a 40mg VO ao dia, pela manhã, em jejum absoluto 30 minutos antes do café da manhã, por 4 a 8 semanas consecutivos. Orientar exaustivamente medidas comportamentais: elevar cabeceira da cama em 15cm, evitar deitar-se até 2-3 horas após as refeições, fracionar alimentação e suspender tabaco/álcool/café/gorduras."
      },
      {
        title: "2ª Linha - Otimização Recalcitrante / Substituição e Coadjuvação",
        desc: "Se falha clínica após 4 semanas, fracionar Omeprazol para 20mg a 40mg VO 12/12h (30 min antes do café e antes do jantar) por mais 4 semanas, ou substituir por Pantoprazol 40mg VO ao dia. Em queixas de esvaziamento retardado (plenitude), associar Domperidona 10mg ou Bromoprida 10mg VO até de 8/8h antes das refeições."
      }
    ]
  },
  {
    id: "hipo",
    name: "Hipotireoidismo Clínico e Subclínico",
    category: "Metabólicas/Endócrinas",
    diagnostic: "TSH elevado (> 4.5 mUI/L) com T4 Livre baixo caracteriza hipotireoidismo clínico. TSH elevado com T4 Livre normal caracteriza hipotireoidismo subclínico (tratar apenas se TSH > 10, gestante, anticorpos anti-TPO altamente positivos ou sintomas muito exuberantes em jovens).",
    alarm: "Coma mixedematoso (situação de terapia intensiva rara caracterizada por hipotermia extrema, bradicardia severa, hipoventilação, edema generalizado duro e letargia grave) - encaminhar imediatamente ao pronto-socorro.",
    treatment: [
      {
        title: "1ª Linha - Reposição Fisiológica Padrão de Levotiroxina (Adulto)",
        desc: "Prescrever Levotiroxina Sódica (Puran T4/Synthroid). Dose inicial plena de reposição de 1,6 mcg/kg/dia para adultos sem comorbidades cardíacas. Tomar pela manhã, em jejum absoluto, aguardando de 30 a 60 minutos para realizar alimentação diária ou tomar outras medicações."
      },
      {
        title: "2ª Linha - Ajuste e Introdução Cautelosa em Idosos / Cardiopatas",
        desc: "Introdução super cautelosa em idosos ou pacientes coronariopatas: iniciar com dose muito baixa, de 12.5 mcg a 25 mcg VO ao dia. Ajustes lentos com incrementos graduais de 12.5 mcg a 25 mcg a cada 4 a 6 semanas de acordo com dosagem laboratorial de TSH para mitigar risco de arritmias ou isquemia miocárdica."
      }
    ],
    interactiveType: "hypothyroid"
  },
  {
    id: "asma",
    name: "Asma Brônquica",
    category: "Respiratório",
    diagnostic: "Variabilidade clínica de sintomas (sibilância, falta de ar, aperto no peito e tosse, que pioram à noite ou ao acordar) associada a limitação do fluxo aéreo expiratório documentada por espirometria (resposta ao broncodilatador com aumento de VEF1 > 12% e > 200ml) ou variabilidade do PFE.",
    alarm: "Crise asmática grave (fala entrecortada, musculatura acessória ativa, cianose, sibilância silenciosa 'tórax silencioso', SatO2 < 90%): iniciar oxigenoterapia, 3 a 4 ciclos de Salbutamol inalatório (ou Fenoterol 10-20 gotas) de 20/20min e Corticoide sistêmico (Prednisolona 40mg VO ou Hidrocortisona EV) e acionar transporte de emergência.",
    treatment: [
      {
        title: "1ª Linha - Corticoide Inalatório Exclusivo ou Resgate S.O.S. (GINA Step 1-2)",
        desc: "Medicamento essencial de controle: Beclometasona spray oral 250mcg/dose (1 a 2 jatos VO de 12/12h de uso fixo diário) ou Budesonida inalador em pó (200mcg VO de 12/12h). Prescrever Salbutamol spray 100mcg/dose (2 jatos de resgate S.O.S se sintomas de broncoespasmo). Higienizar a boca pós-inalação preventiva (evitar candidíase)."
      },
      {
        title: "2ª Linha - Associação CI + LABA Regular (GINA Step 3-4)",
        desc: "Se controle inadequado (persistência de uso de resgate, despertares noturnos freqüentes), associar broncodilatador de longa duração (LABA): prescrever Budesonida + Formoterol (200/6mcg ou 400/12mcg) 1 a 2 inalações de 12/12h de uso fixo contínuo. Alavancar adesão e correção da técnica do inalador."
      }
    ],
    interactiveType: "asma"
  },
  {
    id: "dpoc",
    name: "Doença Pulmonar Obstrutiva Crônica (DPOC)",
    category: "Respiratório",
    diagnostic: "Deve ser suspeitada em indivíduos > 40 anos ex-tabagistas ou tabagistas ativos com dispneia progressiva, tosse crônica e expectoração. Confirmação obrigatória por espirometria: relação VEF1/CVF < 0,70 pós-broncodilatador.",
    alarm: "Exacerbação aguda (aumento da dispneia, do volume de escarro e da purulência do escarro): iniciar SABA/SAMA de horário, avaliar uso de Amoxicilina + Clavulanato ou Azitromicina por 5-7 dias se escarro purulento, e Prednisona 40mg VO por 5 dias.",
    treatment: [
      {
        title: "1ª Linha - Cessação do Tabaco + Broncodilatador de Curta / Longa Ação Isolado",
        desc: "Parada tabágica imediata (freia a perda funcional). Adotar vacinação anual contra Influenza e anti-pneumocócica (Pneumo 23) na UBS. Sintomático de base: Brometo de Ipratrópio (SAMA) 4 jatos VO de 6/6h fixos, ou introduzir LAMA isolada (Tiotrópio 18mcg inalação diária)."
      },
      {
        title: "2ª Linha - Terapia Dupla (LABA + LAMA) ou Tripla (LABA + LAMA + CI)",
        desc: "Para dispneia moderada a severa (GOLD Grupo B ou E): prescrever associação de longa duração LABA + LAMA (ex: Formoterol + Tiotrópio). Adicionar Corticoide Inalatório (Budesonida 400mcg de 12/12h) se histórico de ≥2 exacerbações agudas ao ano e níveis de eosinófilos séricos > 300/mcL."
      }
    ]
  },
  {
    id: "dislip",
    name: "Dislipidemia e Rastreio Cardiovascular",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Classificada em hipercolesterolemia isolada, hipertrigliceridemia isolada ou dislipidemia mista por perfil lipídico de jejum. Deve-se focar no cálculo do risco cardiovascular global para definir o alvo do colesterol LDL.",
    alarm: "Xantomas tendinosos, arco corneal antes dos 45 anos ou LDL > 190 mg/dL: alta suspeita de Hipercolesterolemia Familiar (HF) heterozigótica. Alto risco coronariano precoce.",
    treatment: [
      {
        title: "1ª Linha - Modificações Dietéticas Intensas e ESTATINAS de Média Potência",
        desc: "Implementar redução rigorosa de gorduras saturadas/trans, carboidratos simples e inserção de fibras e atividade física regular. Farmacoterapia base: Sinvastatina 20mg a 40mg VO à noite (redução do LDL de 20-30%). Monitorar queixas musculares severas e colher transaminases (ALT/AST) se suspeita de miopatia."
      },
      {
        title: "2ª Linha - ESTATINAS de Alta Potência / Associação com Ezetimiba",
        desc: "Para pacientes de Alto/Muito Alto risco cardiovascular (ex: coronariopata crônico, diabético com lesão ou infarto prévio) onde o alvo é restrito (LDL < 50mg/dL): prescrever Atorvastatina 40mg a 80mg VO/dia em dose única ou Rosuvastatina 20mg VO/dia. Se alvo não for alcançado, associar Ezetimiba 10mg VO ao dia."
      }
    ],
    interactiveType: "cholesterol"
  },
  {
    id: "tabac",
    name: "Tabagismo - Programa de Cessação",
    category: "Outros",
    diagnostic: "Definição de dependência física e comportamental por anamnese do histórico tabágico. Aplicação do escore de Fagerström para definir a gravidade e a necessidade de associação farmacológica.",
    alarm: "Pacientes motivados a parar que sofrem de fissura intensa ou recaídas frequentes. Acompanhar em grupos específicos ou consultas individuais semanais no primeiro mês.",
    treatment: [
      {
        title: "1ª Linha - Apoio Cognitivo Comportamental e Terapia de Reposição de Nicotina (TRN)",
        desc: "Participação ativa em grupos de cessação estruturados. Apoio com Adesivo Transdérmico de Nicotina (21mg, 14mg ou 7mg de acordo com o total de cigarros/dia) associado a Nicotina Gomas/Pastilhas 2mg (resgatar fissura aguda S.O.S., máx, 10-12/dia) em cronograma regressivo por 12 semanas."
      },
      {
        title: "2ª Linha - Cloridrato de Bupropiona Isolada ou Associada",
        desc: "Indicado para dependência moderada a grave com fissura persistente. Prescrever Bupropiona 150mg VO ao dia nos primeiros 3 dias; a partir do 4º dia elevar para 150mg VO de 12/12h. O 'Dia D' de parada total deve ocorrer entre o 8º e o 14º dia de uso. Pode ser associada ao adesivo de Nicotina. Contraindicado em portadores de epilepsia ou transtornos alimentares."
      }
    ],
    interactiveType: "fagerstrom"
  },
  {
    id: "tb",
    name: "Tuberculose Pulmonar",
    category: "Infecciosas/Endemias",
    diagnostic: "Suspeita clínica em todo 'Sintomático Respiratório' (tosse ≥ 3 semanas). Diagnóstico confirmado por Baciloscopia (BAAR) de escarro (2 amostras), Teste Rápido Molecular (TRM-TB - detecta DNA e resistência à Rifampicina) ou Cultura com teste de sensibilidade.",
    alarm: "Hemoptise maciça (sangramento respiratório severo), dispneia grave, dor torácica intensa, ou rebaixamento do nível de consciência (risco de meningite tuberculosa) - encaminhar para internamento hospitalar.",
    treatment: [
      {
        title: "1ª Linha - Fase de Ataque (Esquema Básico RIPE - Meses 1 e 2)",
        desc: "Prescrever comprimidos de dose fixa combinada SUS RIPE (Rifampicina 150mg + Isoniazida 75mg + Pirazinamida 400mg + Etambutol 275mg) tomados em jejum diário. Dose padrão para adultos de 50-70kg: 4 comprimidos juntos em dose única matinal diária por 2 meses inteiros."
      },
      {
        title: "2ª Linha - Fase de Manutenção (Esquema RI - Meses 3 a 6)",
        desc: "Após 2 meses de ataque e baciloscopia de controle, transicionar para Rifampicina + Isoniazida (suspender Pirazinamida e Etambutol) por mais 4 meses adicionais (completando 6 meses de terapêutica). O tratamento deve ser monitorado sob a estratégia de TDO (Tratamento Diretamente Observado) de forma obrigatória!"
      }
    ]
  },
  {
    id: "hanse",
    name: "Hanseníase",
    category: "Infecciosas/Endemias",
    diagnostic: "Manchas na pele de coloração esbranquiçada, avermelhada ou acastanhada com diminuição ou perda absoluta de sensibilidade térmica, dolorosa ou tátil. Pode haver turgidez e dor à palpação de nervos periféricos (ulnar, radial, fibular). Confirmada clinicamente.",
    alarm: "Neurite aguda (dor neuropática súbita intensa no nervo periférico com perda recente de força na mão ou pé): iniciar Prednisona 1mg/kg/dia imediatamente para evitar deformidade física irreversível e acionar o especialista de referência.",
    treatment: [
      {
        title: "1ª Linha - Esquema Paucibacilar (≤ 5 lesões cutâneas e Sem Troncos Acometidos)",
        desc: "Duração: 6 doses mensais supervisionadas aplicadas em até 9 meses. Esquema de Poliquimioterapia (PQT): Rifampicina 600mg (mensal supervisionada na UBS) + Dapsona 100mg (mensal supervisionada + 100mg VO diários autoadministrados em domicílio pelo paciente)."
      },
      {
        title: "2ª Linha - Esquema Multibacilar (> 5 lesões de pele ou > 1 tronco nervoso acometido)",
        desc: "Duração: 12 doses mensais supervisionadas aplicadas em até 18 meses. Composição terapêutica tripla: Rifampicina 600mg (mensal supervisionada) + Clofazimina 300mg (mensal supervisionada) + Dapsona 100mg (mensal supervisionada) associado a doses diárias em domicílio: Dapsona 100mg/dia + Clofazimina 50mg/dia VO."
      }
    ]
  },
  {
    id: "dengue",
    name: "Dengue, Zika & Chikungunya",
    category: "Infecciosas/Endemias",
    diagnostic: "Caso suspeito de Dengue: Febre alta de início súbito (2 a 7 dias) acompanhada de pelo menos dois sintomas: cefaleia, dor retro-orbital, mialgias, artralgias, prostração, exantema. Realizar obrigatoriamente a Prova do Laço em toda suspeita clínica.",
    alarm: "Sinais de Alarme (surgem no período de defervescência - febre cedendo): Dor abdominal intensa e contínua, vômitos persistentes, acúmulo de líquidos (ascite/derrame pleural), sangramento de mucosa, hipotensão postural/lipotimia, letargia ou irritabilidade, aumento súbito de hematócrito e queda rápida de plaquetas.",
    treatment: [
      {
        title: "1ª Linha - Hidratação Oral Imediata Exaustiva (Manejo Grupo A - Ambulatorial)",
        desc: "Prescrever hidratação vigorosa precoce: 60 ml/kg/dia VO. Sendo 1/3 executado com Soro de Reidratação Oral (SRO) fornecido pelo SUS e 2/3 com líquidos caseiros (água de coco, sucos, água filtrada). Sintomáticos permitidos de horário: Dipirona 1g de 6/6h ou Paracetamol 750mg de 6/6h. AINES/AAS são terminantemente proibidos!"
      },
      {
        title: "2ª Linha - Hidratação Venosa Imediata de Emergência (Manejo Grupos B/C/D)",
        desc: "Indicado se sinais de alarme ou recusa/intolerância oral severa. Iniciar expansão volêmica venosa na UBS: Soro Fisiológico (SF 0.9%) ou Ringer Lactato 10 ml/kg na primeira hora, repetindo conforme monitorização laboratorial e micro-hematócritos seriados. Encaminhar para estabilização/observação de 24h."
      }
    ],
    interactiveType: "dengue"
  },
  {
    id: "anemia",
    name: "Anemia Ferropriva",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Anemia Microcítica (VCM < 80fl) e Hipocrômica (HCM < 27pg, CHCM baixa) com RDW elevado. Ferritina sérica baixa (< 30 ng/mL) confirma o diagnóstico.",
    alarm: "Anemia grave em idosos ou pacientes cardiopatas (Hb < 7-8 g/dL) ou sintomas de insuficiência cardíaca congestiva de alto débito (taquicardia, dispneia de repouso, turgência jugular) - encaminhar ao pronto atendimento para transfusão de concentrado de hemácias monitorizada.",
    treatment: [
      {
        title: "1ª Linha - Reposição Oral de Sulfato Ferroso de Alta Dose (SUS)",
        desc: "Dose terapêutica padrão: 120mg a 200mg de Ferro Elementar por dia para adultos. Prescrever de 3 a 5 comprimidos de Sulfato Ferroso 200mg (cada unidade possui 40mg de ferro metal) divididos ao longo do dia, administrados idealmente 1 hora antes das refeições ou acompanhados de suco cítrico (vitamina C). Manter até Hb normal + 3 meses."
      },
      {
        title: "2ª Linha - Reposição de Alta Tolerância / Ferro Intramuscular / Sacarato de Ferro",
        desc: "Em intolerância gastrointestinal intratável (epigastralgia severa, constipação) ou distúrbios de absorção intestinal: prescrever Ferro Quelato ou Ferro Hidróxido Polimaltosado. Se refratariedade e anemia limitante, encaminhar para reposição venosa especializada com Sacarato de Hidróxido de Ferro (Noripurum EV) ou Dextrano de Ferro."
      }
    ]
  },
  {
    id: "gota",
    name: "Gota Úrica e Hiperuricemia",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Crise aguda de monoartrite inflamatória súbita intensa (mais comum em primeira metatarsofalangeana - podagra, tornozelo ou joelho) com eritema, calor e edema grave. Ácido úrico sérico geralmente elevado (> 7.0 mg/dL).",
    alarm: "Artrite séptica concomitante (febre alta, calafrios, toxemia, incapacidade absoluta de mobilização articular): realizar punção articular urgente para análise de líquido sinovial.",
    treatment: [
      {
        title: "1ª Linha - Crise Aguda: Controle Álgico Agressivo de Curto Curso",
        desc: "NÃO iniciar ou alterar dose de Alopurinol durante a crise de dor (risco de piora pela oscilação abrupta de urato). Prescrever Colchicina 0.5mg de 8/8h (limitar a 3 comprimidos ao dia) associado a AINE potente (Ibuprofeno 600mg de 8/8h ou Cetoprofeno 100mg de 12/12h por 3 a 5 dias). Se insuficiência renal, usar Prednisona 20mg a 40mg/dia."
      },
      {
        title: "2ª Linha - Prevenção de Crises Crônicas e Hipouricemiatória",
        desc: "Indicado se ≥ 2 crises ano ou presença de tofos: iniciar Alopurinol 100mg VO ao dia (ajustar rigorosamente pelo clearence de creatinina, máximo de 300mg/dia). É mandatório associar dose protetora de Colchicina baixa (0.5mg VO ao dia) nos primeiros 3 a 6 meses de introdução do Alopurinol para prevenir novas crises secundárias."
      }
    ]
  },
  {
    id: "parasito",
    name: "Parasitoses Intestinais (Verminoses)",
    category: "Infecciosas/Endemias",
    diagnostic: "Dor abdominal inespecífica, gases, distensão, diarreia intermitente ou prurido anal (enterobíase). O diagnóstico laboratorial é feito por Protoparasitológico de Fezes (EPF) em 3 amostras, mas o tratamento empírico na UBS é padronizado.",
    alarm: "Suboclusão intestinal por carga massiva de vermes (síndrome de obstrução de Löffler por Ascaris): contraindicado o uso de Albendazol por risco de migração errática maciça. Tratar com Piperazina e Óleo Mineral e transferir ao pronto socorro.",
    treatment: [
      {
        title: "1ª Linha - Tratamento Empírico de Amplo Espectro / Monodose (SUS)",
        desc: "Prescrever Albendazol 400mg VO em dose única para maiores de 2 anos (repetir em 14 dias se suspeita forte de Enterobíase ou Himenolepíase). Co-indicar tratamento de todos os familiares para evitar reinfestação por ovos persistentes de Oxiurus."
      },
      {
        title: "2ª Linha - Antimicrobianos Direcionados e Outros Vermífugos",
        desc: "Se infecções específicas ou refratariedade ao tratamento inicial: para Amebíase/Giardíase, utilizar Metronidazol 250mg VO de 8/8h por 5 a 7 dias, ou Secnidazol 2g dose única (adultos). Para infecções multirresistentes, utilizar Nitazoxanida (Annita) 500mg VO de 12/12h por 3 dias inteiros pós-refeições."
      }
    ]
  },
  {
    id: "escab",
    name: "Escabiose (Sarna) e Pediculose",
    category: "Pele & Dermatologia",
    diagnostic: "Escabiose: Prurido noturno patognomônico, poupando a face. Lesões lineares (sulcos microscópicos), pápulas escoriadas em dobras interdigitais, punhos, axilas, aréolas e genitais masculinos. Transmissão intra-familiar.",
    alarm: "Sarna Crostosa (Norueguesa) em imunodeprimidos ou idosos, com crostas hiperqueratósicas pelo corpo inteiro contendo milhões de ácaros - requer isolamento de contato rigoroso e cuidados complexos.",
    treatment: [
      {
        title: "1ª Linha - Permetrina Tópica 5% / Escabicida de Escolha",
        desc: "Aplicar a Permetrina loção a 5% em todo o corpo, rigorosamente do pescoço para baixo, insistindo em dobras e fendas interdigitais. Realizar a aplicação à noite antes de deitar-se. Lavar por completo pela manhã, após 8 a 12 horas de contato na pele. Repetir impreterivelmente após 7 dias. Tratar concomitantemente todos os coabitantes."
      },
      {
        title: "2ª Linha - Ivermectina Oral Sistêmica",
        desc: "Indicado para infestações severas, falha da terapia tópica ou surtos epidêmicos fechados: prescrever Ivermectina 200 mcg/kg VO em dose única, devendo-se repetir a dose após exatamente 14 dias. Co-indicar lavagem rigorosa e fervura de roupas de cama e toalhas."
      }
    ]
  },
  {
    id: "erisip",
    name: "Erisipela e Celulite Leve",
    category: "Pele & Dermatologia",
    diagnostic: "Erisipela: Celulite superficial com evidente acometimento linfático, caracterizada por eritema bem definido, bordas nítidas elevadas, dor, calor e edema súbitos, frequentemente associado a febre no membro inferior. Celulite: Acometimento mais profundo, com placas inflamatórias de bordas mal-delimitadas.",
    alarm: "Fasciíte Necrosante (dor desproporcional ao aspecto visual, bolhas hemorrágicas, crepitação gasosa na palpação da pele e rápida instabilidade/choque séptico): emergência cirúrgica máxima. Encaminhar para desbridamento urgente.",
    treatment: [
      {
        title: "1ª Linha - Antibioticoterapia Oral Clássica e Elevação de Membro",
        desc: "Prescrever Cefalexina 500mg VO de 6/6h por 10 dias completos. Co-indicar repouso absoluto com o membro superior ou inferior constantemente elevado acima da linha do quadril. Sintomáticos: Dipirona 1g se dor ou febre."
      },
      {
        title: "2ª Linha - Larga Cobertura / Penicilina Benzatina / Casos de Repetição",
        desc: "Se suspeita de Staphylococcus aureus de maior agressividade ou intolerância à Cefalexina: prescrever Amoxicilina + Clavulanato 500/125mg VO de 8/8h por 10 dias. Para profilaxia de erisipela de repetição recorrente (≥3 episódios/ano): instituir Penicilina G Benzatina 1.200.000 UI IM profundo de 21 em 21 dias por até 1-2 anos."
      }
    ]
  },
  {
    id: "clima",
    name: "Climatério e Menopausa",
    category: "Outros",
    diagnostic: "Menopausa é o diagnóstico retrospectivo após 12 meses de amenorreia inexplicada em mulheres de meia-idade. Principais queixas: fogachos (surtos de calor súbito), sudorese noturna, insônia, secura vaginal, labilidade emocional.",
    alarm: "Presença de sangramento uterino anormal pós-menopausa (investigar espessamento endometrial por ultrassonografia transvaginal urgente para descartar hiperplasia endometrial ou malignidade).",
    treatment: [
      {
        title: "1ª Linha - Terapia de Reposição Hormonal (TRH) Padrão SUS",
        desc: "SE TEM ÚTERO (Mandatório associar progesterona para proteção endometrial): prescrever Estrogênios Conjugados 0.3mg a 0.625mg/dia VO de forma contínua associado ao Acetato de Medroxiprogesterona 2.5mg a 5mg/dia VO. SE NÃO TEM ÚTERO: Pode-se prescrever Estrogênio isolado de forma contínua."
      },
      {
        title: "2ª Linha - Terapia Não-Hormonal de Alívio (Contraindicações a TRH)",
        desc: "Se a paciente tem contraindicação absoluta (antecedente de câncer de mama/endométrio, trombose venosa, doença coronariana): prescrever inibidor seletivo de recaptação de serotonina/noradrenalina para fogachos, como Succinato de Desvenlafaxina 50mg ao dia ou Cloridrato de Venlafaxina 37.5mg a 75mg VO ao dia."
      }
    ]
  },
  {
    id: "lombalgia",
    name: "Lombalgia Crônica e Aguda (Dor Lombar)",
    category: "Outros",
    diagnostic: "Comumente de caráter mecânico-postural. Dor na região lombar ou lombosacra que pode se irradiar para a nádega ou coxa. Diagnóstico essencialmente clínico, dispensando exames de imagem em episódios agudos autolimitados.",
    alarm: "Sinais de Alarme (Saddle anesthesia/anestesia em sela, perda súbita de força de membros inferiores, perda de controle esfincteriano (bexiga/intestino), febre inexplicada ou histórico de neoplasia): suspeita imediata de Síndrome da Cauda Equina ou Metástase Óssea. Encaminhar para emergência.",
    treatment: [
      {
        title: "1ª Linha - Analgésicos Simples e Condutas Funcionais",
        desc: "Prescrever Dipirona 1g VO de 6/6h associado ao calor local por 15-20 minutos, 3x ao dia. Desmistificar o repouso prolongado (repouso absoluto prolongado atrofia e piora a reabilitação - incentivar retorno gradual precoce às atividades do lar)."
      },
      {
        title: "2ª Linha - Curso Curto de AINES e Relaxante Muscular Estruturado",
        desc: "Se dor limitante persistente na primeira linha: associar Ibuprofeno 600mg VO de 8/8h por no máximo 3 a 5 dias consecutivos, somado a Ciclobenzaprina 5mg a 10mg VO ao deitar-se (alivia espasmos musculares reativos severos). Encaminhar cedo dores crônicas (> 3 meses) à fisioterapia e cinesioterapia."
      }
    ]
  },
  {
    id: "dispepsia",
    name: "Dispepsia Funcional e Gastrite",
    category: "Gastrointestinal",
    diagnostic: "Plenitude pós-prandial incômoda, saciedade precoce, dor ou queimação epigástrica sem evidência de doença estrutural na ausência de sinais de alarme.",
    alarm: "Perda ponderal inexplicável, vômitos incoercíveis, anemia, disfagia, massa abdominal palpável ou idade de início > 50 anos: encaminhar para Endoscopia Digestiva Alta (EDA) de urgência para afastar neoplasia gástrica ou úlcera perfurada.",
    treatment: [
      {
        title: "1ª Linha - Bloqueador de Ácido (IBP) e Educação Dietética",
        desc: "Prescrever Omeprazol 20mg VO ao dia pela manhã, rigorosamente em jejum (30 min antes do café), por 4 a 8 semanas seguidas. Orientar rotina: limitação estrita de alimentos ácidos, condimentados, frituras, refrigerantes, bebida alcoólica e restrição de uso inadequado de AINEs."
      },
      {
        title: "2ª Linha - Coadjuvantes Cinéticos e Investigação de H. Pylori / Antidepressivo Tricíclico",
        desc: "Se plenitude gástrica marcada com náuseas associadas: adicionar Bromoprida 10mg VO até de 8/8h antes das refeições por 10 dias. Casos funcionais refratários sem causa anatômica e pesquisa de H. Pylori negativa respondem muito bem ao uso de Amitriptilina 12.5mg a 25mg VO ao deitar."
      }
    ]
  },
  {
    id: "micoses",
    name: "Dermatofitoses e Micoses de Pele (Tíneas)",
    category: "Pele & Dermatologia",
    diagnostic: "Lesões descamativas na pele com bordas eritematosas, ativas e elevadas, pruriginosas (placas anulares). Podem acometer corpo (Tinea corporis), pés (Tinea pedis - pé de atleta) ou virilha (Tinea cruris).",
    alarm: "Sinais de infecção bacteriana secundária (celulite associada, calor extremo local, presença de pus ou febre sistêmica): tratar com antibióticos sistêmicos orais.",
    treatment: [
      {
        title: "1ª Linha - Antifúngicos Tópicos de Extensão Limitada",
        desc: "Aplicar Nitrato de Miconazol creme vaginal/tópico a 2% ou Isoconazol creme 2 vezes ao dia por 2 a 4 semanas. Orientar manter a área extensamente limpa e seca após o banho, utilizando toalha exclusiva para a lesão de modo a obstar disseminação para outras dobras corporais."
      },
      {
        title: "2ª Linha - Antifúngicos Antifúngicos Orais Sistêmicos",
        desc: "Indicado se lesões disseminadas, multiplas ou onicomicose severa: prescrever Fluconazol 150mg VO, 1 comprimido por semana por 2 a 4 semanas (na micose de pele) ou Itraconazol 100mg VO ao dia por até 12 semanas (unha/onicomicose). Monitorar TGO/TGP se uso >4 semanas."
      }
    ]
  },
  {
    id: "ansiedade",
    name: "Ansiedade e Transtorno de Ansiedade Generalizada (TAG)",
    category: "Outros",
    diagnostic: "Ansiedade e preocupação excessivas, na maioria dos dias, por pelo menos 6 meses, difíceis de controlar. Associada a cansaço fácil, tensão muscular, irritabilidade e insônia. Aplicar escore GAD-7 na UBS.",
    alarm: "Presença de graves episódios de pânico associados a sintomas simulando infarto agudo (sintomatologia adrenérgica expressiva) ou ideação de autolesão - acionar rastreamento seguro de apoio social/familiar e agendar retorno precoce ou psiquiatria.",
    treatment: [
      {
        title: "1ª Linha - Inibidores Seletivos da Recaptação de Serotonina (ISRS) e Higiene Mental",
        desc: "Prescrever Sertralina 25mg a 50mg VO ao dia (otimizar até 100mg a 200mg se necessário) ou Fluoxetina 20mg ao dia pela manhã. Explicar detidamente que a resposta benéfica ocorre de forma gradual somente após a 3ª ou 4ª semana e que pode haver piora paradoxal inicial leve."
      },
      {
        title: "2ª Linha - Transição para Dual / Benzodiazepínicos em Uso Estritamente Terminado",
        desc: "Se falha documentada após 8 semanas em dose máxima e correta adesão: substituir por Cloridrato de Venlafaxina XR 75mg VO ao dia. O uso de Clonazepam 0.5mg a 1mg VO ou Diazepam 5mg a 10mg ao deitar serve estritamente para o manejo de crises agudas paroxísticas no início, limitando a no máximo 2 a 4 semanas."
      }
    ]
  },
  {
    id: "depressao",
    name: "Depressão Unipolar Leve a Moderada",
    category: "Outros",
    diagnostic: "Presença de humor deprimido e/ou anedonia (perda de interesse/prazer) por pelo menos 2 semanas, associados a distúrbios de sono, fadiga, sentimentos de culpa e dificuldade de foco. Utilizar escore PHQ-9 na UBS.",
    alarm: "Ideação suicida ativa com planejamento formulado: encaminhamento de emergência em saúde mental (CAPS III, UPA ou Pronto Socorro psiquiátrico) imediatamente sob supervisão familiar.",
    treatment: [
      {
        title: "1ª Linha - Antidepressivos de Primeira Escolha (SUS) + Psicoterapia",
        desc: "Introduzir Sertralina 50mg VO pela manhã (titular até 150mg se refratariedade) ou Fluoxetina 20mg VO. Manter o tratamento por pelo menos 6 a 9 meses após a remissão total dos sintomas clínicos para prevenir recidivas graves."
      },
      {
        title: "2ª Linha - Tricíclicos Secundários ou ISRSN (Duais)",
        desc: "Em caso de falha terapêutica ou intolerância aos ISRS: prescrever Amitriptilina 25mg VO à noite, titulado lentamente até 75mg a 150mg/dia (ideal se insônia marcada e ausência de cardiopatia pelo risco de alargamento de QT), ou encaminhar para início de Cloridrato de Duloxetina 30mg a 60mg VO ao dia."
      }
    ]
  },
  {
    id: "has",
    name: "Hipertensão Arterial Sistêmica (HAS)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Pressão arterial de consultório ≥ 140x90 mmHg aferida em duas ou mais ocasiões, ou via monitoramento residencial (MRPA/MAPA) com valores médios ≥ 130x80 mmHg.",
    alarm: "Crise Hipertensiva de Emergência (PA ≥ 180x120 mmHg com sintomas neurológicos agudos, dor torácica opressiva, dispneia súbita): suspeita de AVC, Infarto ou Edema Agudo de Pulmão. Encaminhar para emergência médica imediata com suporte de oxigênio.",
    treatment: [
      {
        title: "1ª Linha - Associação Terapêutica Dupla Inicial (SUS - Diretriz Brasileira)",
        desc: "Hipertensão estágio 1 moderada/estágio 2 requer início clássico de monoterapia apenas em idosos frágeis. Demais pacientes devem iniciar terapia dupla sinérgica: Losartana 50mg VO pela manhã associado a Hidroclorotiazida 25mg VO ao dia, ou Enalapril 10mg VO de 12/12h associado a Hidroclorotiazida 25mg pela manhã."
      },
      {
        title: "2ª Linha - Otimização com Anlodipino e Quarto Escalão (Espironolactona)",
        desc: "Se controle tensional refratário: elevar Losartana para 50mg VO de 12/12h e associar Bloqueador de Canais de Cálcio: Besilato de Anlodipino 5mg a 10mg VO ao dia. Se persistência (Hipertensão Resistente com 3 drogas), acrescentar Espironolactona 25mg VO ao dia como quarta linha e pesquisar causas secundárias de hipertensão."
      }
    ]
  },
  {
    id: "dm2",
    name: "Diabetes Mellitus Tipo 2 (DM2)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Glicemia de jejum ≥ 126 mg/dL (confirmada), Glicemia pós-sobrecarga 75g dextrosol ≥ 200 mg/dL, ou Hemoglobina Glicada (HbA1c) ≥ 6.5%.",
    alarm: "Sintomas exuberantes de cetoacidose diabética ou estado hiperosmolar (confusão mental, náuseas/vômitos intensos, fadiga extrema e dor abdominal com glicemia capilar > 250 mg/dL ou marcada por cetonúria): encaminhar imediatamente ao PS.",
    treatment: [
      {
        title: "1ª Linha - Metformina Otimizada e iSGLT2 com Proteção Renal/Cardiovascular",
        desc: "Iniciar Metformina 500mg a 850mg VO de 12/12h junto com as principais refeições. Se o paciente possui doença renal crônica estabelecida (TFG < 60) ou insuficiência cardíaca de base: prescrever Dapagliflozina 10mg VO ao dia associado de imediato (iSGLT2 de alta proteção orgânica disponível no SUS)."
      },
      {
        title: "2ª Linha - Associação de Gliclazida MR ou Insulinização NPH Inicial ao Deitar",
        desc: "Se HbA1c refratária persistente alta: associar Gliclazida MR 30mg a 60mg VO pela manhã. Se a glicemia de jejum se mantém refratária e há sinais de catabolismo (perda de peso rápida/poliúria): introduzir Insulina NPH subcutânea à noite ao deitar (dose inicial segura de 10 UI, titulando de 2 em 2 UI conforme glicemia de jejum)."
      }
    ]
  },
  {
    id: "itu",
    name: "Infecção do Trato Urinário Baixo (Cistite Aguda)",
    category: "Infecciosas/Endemias",
    diagnostic: "Disúria (dor/ardor ao urinar), polaciúria (aumento da frequência), urgência urinária e dor suprapúbica. O diagnóstico é estritamente clínico em mulheres jovens sem comorbidades (dispensa EAS/Urocultura inicial).",
    alarm: "Febre alta (>38ºC), calafrios, náuseas/vômitos e dor em flanco com sinal de Giordano positivo (punho-percussão lombar dolorosa): suspeita de Pielonefrite. Tratamento preferencialmente hospitalar ou ambulatorial assistido.",
    treatment: [
      {
        title: "1ª Linha - Antissepsia Urinária de Escolha / Monodose Altamente Eficaz",
        desc: "Prescrever Nitrofurantoína (Macrodantina) 100mg VO de 6/6h por 5 dias consecutivos, ou prescrever Fosfomicina Trometamol 3g sachê (Monuril), dose única dissolvida em água à noite antes de deitar-se. Estimular copiosa hidratação."
      },
      {
        title: "2ª Linha - Crossover Antibiótico de Reserva Sistêmica",
        desc: "Em gestantes, idosos ou se intolerância de primeira linha: prescrever Cefalexina 500mg VO de 6/6h por 7 dias inteiros. Se padrão de alta resistência regional às linhas básicas e urocultura confirmando sensibilidade: prescrever Ciprofloxacino 500mg VO de 12/12h por 3 dias completos (evitar uso indiscriminado)."
      }
    ]
  },
  {
    id: "ivas",
    name: "Resfriado Comum e Rinossinusite Aguda",
    category: "Respiratório",
    diagnostic: "Coriza líquida ou purulenta, obstrução nasal, espirros, odinofagia leve e tosse protetora. A sinusite bacteriana é sugerida se persistência >10 dias sem melhoras, piora abrupta após melhora inicial, ou dor facial maxilar unilateral pulsátil severa por >3 dias.",
    alarm: "Edema ou eritema periorbital (celulite orbitária), diplopia, dor extrema de cabeça com rigidez nucal ou febre alta refratária: internação de emergência para exames de imagem e antibioticoterapia venosa.",
    treatment: [
      {
        title: "1ª Linha - Lavagem Nasal Exaustiva e Sintomáticos S.O.S (Resfriado Viral)",
        desc: "Terapia estritamente sintomática (antibióticos não funcionam em resfriado ou sinusite aguda viral): prescrever lavagem nasal exaustiva com Soro Fisiológico 0.9% morno (10-20ml em seringa em cada narina várias vezes ao dia). Prescrever Dipirona 1g de 6/6h ou Ibuprofeno 400mg VO para cefaleia e febre."
      },
      {
        title: "2ª Linha - Antibioticoterapia Sistêmica Direcionada (Critério Bacteriano)",
        desc: "Indicado apenas se febre alta prolongada por > 3 dias associada a dor facial unilateral intensa pulsátil e coriza densamente purulenta (sugerindo sinusite bacteriana): prescrever Amoxicilina 500mg VO de 8/8h por 7 a 10 dias inteiros. Se histórico de uso de beta-lactâmico recente, optar por Amoxicilina + Clavulanato 500/125mg de 8/8h."
      }
    ]
  },
  {
    id: "icc",
    name: "Insuficiência Cardíaca Crônica (ICC)",
    category: "Outros",
    diagnostic: "Dispneia de esforço progressiva, ortopneia (falta de ar ao deitar), dispneia paroxística noturna, estase de jugulares a 45º e edema simétrico de membros inferiores de caráter gravitativo. Diagnóstico por critérios clínicos de Framingham ratificado por Ecocardiograma com Fração de Ejeção.",
    alarm: "Dispneia grave em repouso com taquipneia evidente, ansiedade extrema, estertores pulmonares crepitantes até terço médio e expectoração rosácea bolhosa: Edema Agudo de Pulmão (EAP/ICC Descompensada). Chamar unidade móvel e transferir imediatamente para PS com urgência.",
    treatment: [
      {
        title: "1ª Linha - Triplo/Quádruplo Bloqueio Neuro-Hormonal de Sobrevivência (SBC)",
        desc: "Instituir terapia modificadora de sobrevida: Enalapril 5mg a 10mg VO de 12/12h (ou Losartana 50mg se tosse secundária) associado a Carvedilol 6.25mg VO de 12/12h (titular progressivamente quinzenal até tolerância ou FC alvo ~60-65) somado a antagonista de aldosterona: Espironolactona 25mg VO ao dia. Dapagliflozina 10mg VO ao dia é de utilidade crucial."
      },
      {
        title: "2ª Linha - Controle de Sintomas Volêmicos e Digoxina Coadjuvante",
        desc: "Para alívio de sintomas de congestão crônica (edema de pernas, ascite): prescrever Furosemida 40mg VO pela manhã (titular dose de acordo com peso diário do doador). Se fração de ejeção muito deprimida (<35%) com ritmo sinusal e sintomas refratários: associar Digoxina 0.125mg a 0.25mg VO ao dia."
      }
    ]
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite e Osteoartrose (Artrose articular)",
    category: "Outros",
    diagnostic: "Dor articular mecânica (piora com carga ou movimento, alivia com repouso absoluto), rigidez articular matinal de curta duração (< 30 minutos), limitação funcional e crepitações na mobilização. Comum em joelhos, quadris e mãos.",
    alarm: "Articulação quente, edemaciada, com eritema evidente e febre sistêmica associada: suspeita de Artrite Séptica. Encaminhar imediatamente para punção articular diagnóstica de emergência.",
    treatment: [
      {
        title: "1ª Linha - Educação Física Ergonométrica e Analgésicos Simples de Horário",
        desc: "Prescrever fortalecimento quadricipital isométrico preventivo de impacto e controle ponderal para diminuição de desgaste por carga. Sintomático de horário: Dipirona 1g VO ou Paracetamol 750mg em horários de maior dor articular, limitando o uso de comprimidos. Evitar AINEs orais pelo altíssimo risco renal."
      },
      {
        title: "2ª Linha - Anti-inflamatórios Tópicos / Condroprotetores Auxiliares / Diacereína",
        desc: "Para articulações periféricas fáceis de palpar (joelhos e mãos), priorizar Diclofenaco Dietilamônio gel 1%, massagear o local 3 a 4x/dia. Se dor refratária de caráter crónico nociceptivo, associar Diacereína 50mg VO ao dia pós refeições ou pó de Condroitina 1200mg + Glucosamina 1500mg para efeitos tardios de amortecimento."
      }
    ]
  },
  {
    id: "venosa",
    name: "Insuficiência Venosa Crônica (Varizes de Membros Inferiores)",
    category: "Outros",
    diagnostic: "Sensação de peso, queimação, cansaço ou dor nas pernas ao final do dia. Presença de edema vespertino maleolar, telangiectasias, veias varicosas tortuosas ou hiperpigmentação ocre na pele distal.",
    alarm: "Início súbito de edema assimétrico unilateral exuberante em uma das panturrilhas, acompanhado de dor forte local: forte suspeita de Trombose Venosa Profunda (TVP). Encaminhar ao PS para Doppler venoso urgente.",
    treatment: [
      {
        title: "1ª Linha - Higiene de Retorno Venoso e Meias de Compressão Elástica",
        desc: "Evitar de pé ou assentado por períodos >2h. Realizar repousos com as pernas suspensas acima da altura do esterno por 20 minutos, 3x ao dia. Prescrever e ensinar o uso diário de Meias de Compressão Elástica Graduada (média compressão, ex: 20-30 mmHg) vestidas imediatamente ao levantar-se."
      },
      {
        title: "2ª Linha - Bioflavonoides Venotônicos Coadjuvantes",
        desc: "Indicados para alívio sintomático de dores incapacitantes e do peso residual persistente mesmo com repouso postural: prescrever Diosmina 450mg + Hesperidina 50mg (ou formulações de 1000mg) VO pela manhã em dose única diária por cursos de até 3-6 meses."
      }
    ]
  },
  {
    id: "cefaleiastens",
    name: "Cefaleia Tensional e Enxaqueca (Migrânea)",
    category: "Outros",
    diagnostic: "Cefaleia Tensional: dor holocraniana em aperto ou pressão, bilateral, opressiva, leve a moderada. Enxaqueca: dor pulsátil, unilateral, moderada a severa, associada a irritabilidade com luz (fotofobia), som (fonofobia) e náuseas.",
    alarm: "Início explosivo e súbito da dor ('pior cefaleia da vida' em segundos), associado a febre, rigidez de nuca, confusão mental, déficit focal motor ou início após os 50 anos: encaminhar imediatamente para tomografia computadorizada cerebral (excluir hemorragia subaracnóidea, meningite ou tumor).",
    treatment: [
      {
        title: "1ª Linha - Aborte Agudo Simples e Profilaxia de Base com Tricíclicos",
        desc: "Crise álgica: Dipirona 1g VO ou Ibuprofeno 600mg associado precoce. Se crises recorrentes (>3/mês): prescrever profilaxia diária regular com Amitriptilina 25mg VO ao deitar-se (titular até 50mg conforme tolerabilidade clínica) ou Propranolol 40mg VO de 12/12h."
      },
      {
        title: "2ª Linha - Abortivos Triptanos e Profilaxia com Topiramato",
        desc: "Crise severa resistente de enxaqueca: prescrever Succinato de Sumatriptana 50mg ou 100mg VO dose única no início da crise. Para profilaxia alternativa quando há contraindicação ao betabloqueador: prescrever profilaxia crônica com Topiramato 25mg à noite, titulado até 50mg a 100mg VO diários."
      }
    ]
  },
  {
    id: "vaginoses",
    name: "Candidíase Vulvovaginal e Vaginose Bacteriana",
    category: "Pele & Dermatologia",
    diagnostic: "Candidíase: prurido vulvovaginal intenso, ardor, corrimento esbranquiçado grumoso sem cheiro (leite qualhado) e hiperemia. Vaginose: corrimento cinza ou amarelado fluido com odor fétido (peixe podre), mais proeminente após coito.",
    alarm: "Aparecimento de febre alta, dor à mobilização do colo uterino no exame especular ou dor em fossas ilíacas bilaterais persistente (DIP - Doença Inflamatória Pélvica): iniciar antibióticos sistêmicos de largo espectro (Ceftriaxona IM + Doxiciclina) e reavaliar de perto.",
    treatment: [
      {
        title: "1ª Linha - Creme Vaginal Direcionado Local (SUS)",
        desc: "CANDIDÍASE: Nitrato de Miconazol creme vaginal a 2%, aplicar 1 aplicador preenchido profundamente via vaginal à noite ao deitar-se, por 7 noites consecutivas. VAGINOSE: Metronidazol gel vaginal 1 aplicador preenchido via vaginal à noite deitado por 5 noites seguidas."
      },
      {
        title: "2ª Linha - Tratamento Sistêmico Oral / Candidíase Recorrente",
        desc: "Se recusa ou impossibilidade de uso de via tópica: CANDIDÍASE: Fluconazol 150mg VO dose única (se recidivas frequentes: Fluconazol 150mg semanal por 6 semanas). VAGINOSE: Metronidazol 250mg VO, prescrever 2 comprimidos VO de 12/12h por 7 dias (orientar abstinência absoluta de álcool durante o curso terapêutico)."
      }
    ]
  },
  {
    id: "verminose",
    name: "Parasitoses Intestinais / Verminoses",
    category: "Gastrointestinal",
    diagnostic: "Prurido anal noturno, epigastralgia ou náuseas inexplicáveis. Presença de prurido nasal/anal ou eliminação eventual de parasitas nas fezes (altamente sugestivo de Enterobíase/Oxiuríase).",
    alarm: "Presença de eliminação em massa de vermes na boca/nariz ou sinais de suboclusão intestinal (vômitos feculoides, parada de eliminação de gases/fezes, distensão abdominal severa): sinal de obstrução por bolo de Ascaris. Tratamento cirúrgico ou Piperazina urgente.",
    treatment: [
      {
        title: "Esquema Empírico Geral ou Direcionado",
        desc: "Albendazol 400mg VO, dose única (em maiores de 2 anos). Para Giardíase ou Amebíase: prescrever Secnidazol 2g VO, dose única à noite para adultos."
      },
      {
        title: "Tratamento de Oxiuríase (Enterobíase - Familiar)",
        desc: "Mebendazol 100mg VO de 12/12h por 3 dias consecutivos. Tratar TODOS os membros coabitantes e repetir a dose após 14 dias para evitar reinfecções por ovos viáveis."
      }
    ]
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite e Osteoartrose (Artrose articular)",
    category: "Outros",
    diagnostic: "Dor articular mecânica (piora com carga ou movimento, alivia com repouso absoluto), rigidez articular matinal de curta duração (< 30 minutos), limitação funcional e crepitações na mobilização. Comum em joelhos, quadris e mãos.",
    alarm: "Articulação quente, edemaciada, com eritema evidente e febre sistêmica associada: suspeita de Artrite Séptica. Encaminhar imediatamente para punção articular diagnóstica de emergência.",
    treatment: [
      {
        title: "Medidas Não Farmacológicas de Longo Prazo",
        desc: "Fortalecimento muscular isométrico direcionado (gabarito de quadríceps para joelho), controle ponderal rigoroso para diminuir estresse articular, e atividade física sem impacto como hidroginástica."
      },
      {
        title: "Terapia Analgésica e Diretriz de AINEs",
        desc: "Paracetamol 500mg a 750mg ou Dipirona 1g em horários de dor, limitando a 3g/dia. Evitar uso prolongado ou contínuo de AINEs (Ibuprofeno, Nimesulida) pelo altíssimo risco de lesão renal e hemorragia digestiva em idosos."
      }
    ]
  },
  {
    id: "venosa",
    name: "Insuficiência Venosa Crônica (Varizes de Membros Inferiores)",
    category: "Outros",
    diagnostic: "Sensação de peso, queimação, cansaço ou dor nas pernas ao final do dia. Presença de edema vespertino maleolar, telangiectasias, veias varicosas tortuosas ou hiperpigmentação ocre na pele distal.",
    alarm: "Início súbito de edema assimétrico unilateral exuberante em uma das panturrilhas, acompanhado de dor forte local: forte suspeita de Trombose Venosa Profunda (TVP). Encaminhar ao PS para Doppler venoso urgente.",
    treatment: [
      {
        title: "Higiene Venosa Comportamental (Obrigatória)",
        desc: "Evitar permanecer em pé ou sentado por mais de 1-2 horas seguidas. Elevar as pernas acima do nível do coração por 15-20 minutos, 3x ao dia. Uso diário de meias de compressão elástica de média compressão (20-30 mmHg) ao levantar."
      },
      {
        title: "Auxílio Farmacológico para Alívio Sintomático",
        desc: "Diosmina + Hesperidina (450/50mg) 1 a 2 comprimidos VO ao dia. Atenção: medicação sintomática auxiliar, não previne varizes nem substitui compressão elástica ou cirurgia venosa."
      }
    ]
  },
  {
    id: "cefaleiastens",
    name: "Cefaleia Tensional e Enxaqueca (Migrânea)",
    category: "Outros",
    diagnostic: "Cefaleia Tensional: dor holocraniana em aperto ou pressão, bilateral, opressiva, leve a moderada. Enxaqueca: dor pulsátil, unilateral, moderada a severa, associada a irritabilidade com luz (fotofobia), som (fonofobia) e náuseas.",
    alarm: "Início explosivo e súbito da dor ('pior cefaleia da vida' em segundos), associado a febre, rigidez de nuca, confusão mental, déficit focal motor ou início após os 50 anos: encaminhar imediatamente para tomografia computadorizada cerebral (excluir hemorragia subaracnóidea, meningite ou tumor).",
    treatment: [
      {
        title: "Tratamento Abortivo da Crise de Dor",
        desc: "Dipirona 1g VO ou Ibuprofeno 400-600mg VO logo no início dos sintomas. Se enxaqueca refratária com náusea, associar Metoclopramida 10mg VO e Sumatriptana 50mg VO (contraindicado em coronariopatias)."
      },
      {
        title: "Tratamento Profilático e Higiene de Gatilhos",
        desc: "Indicado se >3 crises por mês. Amitriptilina 25mg à noite ou Propranolol 40mg VO de 12/12h. Orientar higiene do sono, limitação de cafeína/analgésicos de abuso, e diário da cefaleia."
      }
    ]
  },
  {
    id: "vaginoses",
    name: "Candidíase Vulvovaginal e Vaginose Bacteriana",
    category: "Pele & Dermatologia",
    diagnostic: "Candidíase: prurido vulvovaginal intenso, ardor, corrimento esbranquiçado grumoso sem cheiro (leite qualhado) e hiperemia. Vaginose: corrimento cinza ou amarelado fluido com odor fétido (peixe podre), mais proeminente após coito.",
    alarm: "Aparecimento de febre alta, dor à mobilização do colo uterino no exame especular ou dor em fossas ilíacas bilaterais persistente (DIP - Doença Inflamatória Pélvica): iniciar antibióticos sistêmicos de largo espectro (Ceftriaxona IM + Doxiciclina) e reavaliar de perto.",
    treatment: [
      {
        title: "Candidíase Vulvovaginal - Abordagem (SUS)",
        desc: "Miconazol creme vaginal a 2%, aplicar 1 aplicador totalmente preenchido via vaginal à noite ao deitar, por 7 dias seguidos. Alternativa oral: Fluconazol 150mg VO dose única."
      },
      {
        title: "Vaginose Bacteriana - Abordagem (SUS)",
        desc: "Metronidazol gel vaginal a 0.75%, aplicar 1 aplicador cheio via vaginal por 5 noites. Alternativa oral: Metronidazol 250mg, 2 comprimidos VO de 12/12h por 7 dias (orientar abstinência alcoólica absoluto devido ao efeito dissulfiram)."
      }
    ]
  }
];

const DISEASE_TO_SUMMARY_MAP: Record<string, string[]> = {
  has: ["Insuficiência Cardíaca (IC)", "Fibrilação Atrial (FA)", "Abordagem da Dor Torácica"],
  dm2: ["Diabetes Mellitus: Diagnóstico", "Cetoacidose Diabética (CAD)"],
  dislip: ["Insuficiência Cardíaca (IC)", "Abordagem da Dor Torácica"],
  drge: ["Hemorragia Digestiva Alta (HDA)"],
  gastrite: ["Hemorragia Digestiva Alta (HDA)"],
  hipo: ["Hipotireoidismo"],
  asma: ["Asma Brônquica: Crise Aguda"],
  dpoc: ["SDRA - Síndrome do Desconforto Respiratório Agudo"],
  pac: ["Pneumonia Comunitária", "SDRA - Síndrome do Desconforto Respiratório Agudo"],
  itu: ["Sepse (Sepsis-3)"],
  pielonefrite: ["Sepse (Sepsis-3)"],
  anemia: ["Anemias Microcíticas"],
  depressao: ["Agitação Psicomotora"],
  crise_panico: ["Agitação Psicomotora"],
  gota: ["Gota (Artrite Gotosa)"],
  "artrite-reuma": ["Artrite Reumatoide", "Lúpus Eritematoso Sistêmico (LES)"],
  varizes: ["Tromboembolismo Pulmonar (TEP)"],
  "ulcera-venosa": ["Tromboembolismo Pulmonar (TEP)"],
  vaginoses: ["Vaginites e Vaginose"],
  sifilis: ["Vaginites e Vaginose"],
  corrimento_uretral: ["Vaginites e Vaginose"],
  crise_epiletica: ["Agitação Psicomotora", "Delirium no Idoso"],
  oma: ["Pneumonia Comunitária"],
  sinusite: ["Pneumonia Comunitária"],
  amigdalite: ["Pneumonia Comunitária"],
  verminose: ["Anemias Microcíticas"],
  ansiedade: ["Agitação Psicomotora"],
  insonia: ["Delirium no Idoso", "Agitação Psicomotora"],
  lombalgia: ["Gota (Artrite Gotosa)", "Artrite Reumatoide"],
  osteoartrite: ["Artrite Reumatoide", "Gota (Artrite Gotosa)"],
  eczema: ["Escabiose"],
  escabiose: ["Escabiose"],
  micose: ["Vaginites e Vaginose"],
  constipacao: ["Cirrose: Complicações"],
  diarreia: ["Planos de Hidratação (Plano A, B e C)", "Desnutrição e Choque"],
  cefaleiastens: ["AVC Isquêmico vs Hemorrágico"],
  tabac: ["Tromboembolismo Pulmonar (TEP)", "SDRA - Síndrome do Desconforto Respiratório Agudo", "Abordagem da Dor Torácica"],
  dengue: ["Sepse (Sepsis-3)"],
  tuberculose: ["Pneumonia Comunitária"],
  hanseniase: ["Lúpus Eritematoso Sistêmico (LES)", "Artrite Reumatoide"],
  insufcard: ["Insuficiência Cardíaca (IC)", "Fibrilação Atrial (FA)", "Abordagem da Dor Torácica"],
  "fib-atrial": ["Fibrilação Atrial (FA)", "Insuficiência Cardíaca (IC)", "AVC Isquêmico vs Hemorrágico"],
  doencarenal: ["Doença Renal Crônica (DRC)", "Distúrbios do Potássio"],
  "hep-cronicas": ["Cirrose: Complicações", "Hemorragia Digestiva Alta (HDA)"],
  "hiper-tireo": ["Fibrilação Atrial (FA)", "Hipotireoidismo"],
  labirintite: ["AVC Isquêmico vs Hemorrágico"],
  "litiase-renal": ["Distúrbios do Potássio", "Doença Renal Crônica (DRC)"],
  celulite: ["Sepse (Sepsis-3)"],
  hzoster: ["Farmacodermias Graves"],
  impetigo: ["Pneumonia Comunitária"],
  colelitiase: ["Hemorragia Digestiva Alta (HDA)"],
  apendicite: ["Sepse (Sepsis-3)"],
  epilepsia: ["Agitação Psicomotora", "Delirium no Idoso"],
  "cistite-rec": ["Sepse (Sepsis-3)", "Vaginites e Vaginose"],
  "gastro-desidrat": ["Planos de Hidratação (Plano A, B e C)", "Desnutrição e Choque"],
  escarlatina: ["Pneumonia Comunitária"],
  leptospirose: ["Sepse (Sepsis-3)"],
  parkinson: ["Delirium no Idoso", "Agitação Psicomotora"],
  "dermatite-seb": ["Escabiose"],
  "faringite-strep": ["Pneumonia Comunitária"],
  urolitiase: ["Doença Renal Crônica (DRC)"],
  erisipela: ["Sepse (Sepsis-3)"],
  peconhentos: ["Sepse (Sepsis-3)", "Planos de Hidratação (Plano A, B e C)"],
  hpb: ["Doença Renal Crônica (DRC)"],
  iam: ["Abordagem da Dor Torácica", "Insuficiência Cardíaca (IC)"],
  cad: ["Cetoacidose Diabética (CAD)", "Diabetes Mellitus: Diagnóstico"],
  anafilaxia: ["Anafilaxia", "Choque: Classificação e Manejo"],
  sepse: ["Sepse (Sepsis-3)", "Choque: Classificação e Manejo"],
  endocardite: ["Endocardite Infecciosa", "Insuficiência Cardíaca (IC)"],
  sdra: ["SDRA - Síndrome do Desconforto Respiratório Agudo", "Asma Brônquica: Crise Aguda"],
  choque: ["Choque: Classificação e Manejo", "Planos de Hidratação (Plano A, B e C)"],
  agitacao: ["Agitação Psicomotora", "Delirium no Idoso"],
  hda: ["Hemorragia Digestiva Alta (HDA)", "Cirrose: Complicações"],
  cirrose: ["Cirrose: Complicações", "Hemorragia Digestiva Alta (HDA)"],
  avc: ["AVC Isquêmico vs Hemorrágico", "Delirium no Idoso"],
  delirium: ["Delirium no Idoso", "Agitação Psicomotora"],
  exacerbacao_asma: ["Asma Brônquica: Crise Aguda", "SDRA - Síndrome do Desconforto Respiratório Agudo"],
  tep: ["Tromboembolismo Pulmonar (TEP)", "Abordagem da Dor Torácica"],
  hipercalemia: ["Distúrbios do Potássio", "Doença Renal Crônica (DRC)"],
  les: ["Lúpus Eritematoso Sistêmico (LES)", "Artrite Reumatoide"],
  neutropenia_febril: ["Neutropenia Febril", "Sepse (Sepsis-3)"],
  dip: ["Doença Inflamatória Pélvica (DIP)", "Vaginites e Vaginose"],
  farmacodermia: ["Farmacodermias Graves"],
  desnutricao_choque: ["Desnutrição e Choque", "Planos de Hidratação (Plano A, B e C)"],
  osteoporose: ["Artrite Reumatoide", "Doença Renal Crônica (DRC)"],
  obesidade: ["Diabetes Mellitus: Diagnóstico", "Cetoacidose Diabética (CAD)"],
  climaterio: ["Vaginites e Vaginose"],
  ivc: ["Tromboembolismo Pulmonar (TEP)"],
  dermatite_contato: ["Escabiose"],
  migranea: ["AVC Isquêmico vs Hemorrágico"],
  pneumotorax: ["SDRA - Síndrome do Desconforto Respiratório Agudo", "Asma Brônquica: Crise Aguda"],
  pancreatite: ["Hemorragia Digestiva Alta (HDA)", "Cirrose: Complicações"],
  dengue_grave: ["Sepse (Sepsis-3)", "Choque: Classificação e Manejo", "Planos de Hidratação (Plano A, B e C)"],
  pielonefrite_complicada: ["Sepse (Sepsis-3)", "Choque: Classificação e Manejo"],
  abscesso_periamigdaliano: ["Pneumonia Comunitária"],
  artrite_septica: ["Artrite Reumatoide", "Sepse (Sepsis-3)"],
  intoxicacao_aguda: ["Agitação Psicomotora", "Delirium no Idoso"],
  tce_urgente: ["AVC Isquêmico vs Hemorrágico"]
};

function UbsModule({
  activeSubTab,
  setActiveSubTab,
  selectedGuiaDiseaseId,
  setSelectedGuiaDiseaseId
}: {
  activeSubTab: 'cronicos' | 'mulher' | 'mental' | 'condutas' | 'guia';
  setActiveSubTab: (tab: 'cronicos' | 'mulher' | 'mental' | 'condutas' | 'guia') => void;
  selectedGuiaDiseaseId: string;
  setSelectedGuiaDiseaseId: (id: string) => void;
}) {
  // --- Guia de Doenças States ---
  const [guiaSearch, setGuiaSearch] = useState('');
  const [guiaSelectedCategory, setGuiaSelectedCategory] = useState<string>('Todos');
  const [selectedLinkedSummary, setSelectedLinkedSummary] = useState<{ title: string; content: string; area: string } | null>(null);

  // Keep selected disease in sync with filters
  useEffect(() => {
    const filtered = UBS_CATALOG_DISEASES.filter((d) => {
      const matchCat = guiaSelectedCategory === 'Todos' || d.category === guiaSelectedCategory;
      const matchSearch = d.name.toLowerCase().includes(guiaSearch.toLowerCase()) || 
        d.category.toLowerCase().includes(guiaSearch.toLowerCase()) ||
        d.diagnostic.toLowerCase().includes(guiaSearch.toLowerCase());
      return matchCat && matchSearch;
    });
    if (filtered.length > 0) {
      const exists = filtered.some(d => d.id === selectedGuiaDiseaseId);
      if (!exists) {
        setSelectedGuiaDiseaseId(filtered[0].id);
      }
    }
  }, [guiaSearch, guiaSelectedCategory, selectedGuiaDiseaseId]);

  // Interactive Calculator: Fagerström
  const [fagerstromAnswers, setFagerstromAnswers] = useState<number[]>(Array(6).fill(-1));

  // Interactive Calculator: Dengue Risk
  const [dengueSigaSymptoms, setDengueSigaSymptoms] = useState<string[]>([]);
  const [dengueSigaAlarms, setDengueSigaAlarms] = useState<string[]>([]);
  const [dengueSigaGravity, setDengueSigaGravity] = useState<string[]>([]);
  const [dengueSigaRisk, setDengueSigaRisk] = useState<string[]>([]);

  // Interactive Calculator: Asthma
  const [asthmasymptomDays, setAsthmasymptomDays] = useState(false);
  const [asthmanightAwake, setAsthmanightAwake] = useState(false);
  const [asthmauseResgate, setAsthmauseResgate] = useState(false);
  const [asthmalimitActivity, setAsthmalimitActivity] = useState(false);

  // Interactive Calculator: Hipotireoidismo
  const [hypoWeight, setHypoWeight] = useState<number>(70);
  const [hypoElderly, setHypoElderly] = useState(false);

  // Interactive Calculator: Dislipidemia
  const [lipidRiskLevel, setLipidRiskLevel] = useState<'baixo' | 'medio' | 'alto' | 'muito_alto'>('baixo');

  // --- Chronic States ---
  const [chronicProfile, setChronicProfile] = useState<'has' | 'dm'>('has');
  const [hasTarget, setHasTarget] = useState<'geral' | 'alto'>('geral');
  const [hasPatientType, setHasPatientType] = useState<'normal' | 'diabetico'>('normal');
  const [dmTarget, setDmTarget] = useState<'padrao' | 'fragil'>('padrao');
  const [dmStage, setDmStage] = useState<'metformina' | 'sulfonilureia' | 'isglt2' | 'insulina'>('metformina');

  // --- Mental Health States ---
  const [mentalProfile, setMentalProfile] = useState<'phq9' | 'gad7'>('phq9');
  const [phq9Answers, setPhq9Answers] = useState<number[]>(Array(9).fill(-1));
  const [gad7Answers, setGad7Answers] = useState<number[]>(Array(7).fill(-1));

  // --- Woman & Gestational States ---
  const [dum, setDum] = useState<string>('');
  const [screeningSex, setScreeningSex] = useState<'female' | 'male'>('female');
  const [screeningAge, setScreeningAge] = useState<number>(35);

  // --- Condutas Rápidas States ---
  const [rapidConduta, setRapidConduta] = useState<'faringo' | 'cistite'>('faringo');
  const [centorFever, setCentorFever] = useState(false);
  const [centorNoCough, setCentorNoCough] = useState(false);
  const [centorAdenopathy, setCentorAdenopathy] = useState(false);
  const [centorExudate, setCentorExudate] = useState(false);
  const [centorAge, setCentorAge] = useState<number>(25); // age in years

  // --- Handlers & Computations ---
  const phq9Total = phq9Answers.reduce((acc, val) => acc + (val >= 0 ? val : 0), 0);
  const isPhq9Complete = phq9Answers.every(v => v >= 0);
  const hasSuicidalIdeation = phq9Answers[8] > 0;

  const gad7Total = gad7Answers.reduce((acc, val) => acc + (val >= 0 ? val : 0), 0);
  const isGad7Complete = gad7Answers.every(v => v >= 0);

  // Centor Score Calculation
  const centorScore = useMemo(() => {
    let score = 0;
    if (centorFever) score += 1;
    if (centorNoCough) score += 1;
    if (centorAdenopathy) score += 1;
    if (centorExudate) score += 1;
    if (centorAge >= 3 && centorAge <= 14) score += 1;
    else if (centorAge >= 45) score -= 1;
    return Math.max(0, score);
  }, [centorFever, centorNoCough, centorAdenopathy, centorExudate, centorAge]);

  // Gestational calculation
  const gestationalData = useMemo(() => {
    if (!dum) return null;
    try {
      const parts = dum.split('-');
      if (parts.length !== 3) return null;
      // create date in local timezone
      const dumDate = new Date(parseInt(parts[0]), parseInt(parts[1]) - 1, parseInt(parts[2]));
      const today = new Date();
      // zero out times
      today.setHours(0,0,0,0);
      dumDate.setHours(0,0,0,0);

      const diffTime = today.getTime() - dumDate.getTime();
      const diffDays = Math.floor(diffTime / (1000 * 60 * 60 * 24));

      if (diffDays < 0) {
        return { error: 'A data da DUM está no futuro!' };
      }
      if (diffDays > 300) {
        return { error: 'DUM há mais de 42 semanas. Verifique a data informada.' };
      }

      const weeks = Math.floor(diffDays / 7);
      const days = diffDays % 7;

      // Naegele rule for DPP
      const dppDate = new Date(dumDate);
      dppDate.setDate(dppDate.getDate() + 7);
      dppDate.setMonth(dppDate.getMonth() + 9);

      let trimester = 1;
      if (weeks >= 14 && weeks < 28) trimester = 2;
      else if (weeks >= 28) trimester = 3;

      return {
        weeks,
        days,
        dpp: dppDate.toLocaleDateString('pt-BR'),
        trimester,
        daysTotal: diffDays
      };
    } catch (e) {
      return null;
    }
  }, [dum]);

  // PHQ-9 Evaluation
  const phq9Evaluation = useMemo(() => {
    if (phq9Total <= 4) return { label: 'Depressão Mínima ou Ausente', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Apoio psicoeducativo, orientações gerais sobre sono e atividade física. Reavaliar em 3-6 meses se persistirem queixas.' };
    if (phq9Total <= 9) return { label: 'Depressão Leve', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', desc: 'Monitoramento ativo e psicoeducação. Oferecer terapia de apoio na UBS ou práticas integrativas (PICS). Não requer fármaco de imediato.' };
    if (phq9Total <= 14) return { label: 'Depressão Moderada', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Iniciar Psicoterapia leve individual/grupo. Avaliar introdução de ISRS (Sertralina 50mg/dia ou Fluoxetina 20mg/dia VO pela manhã). Retorno em 2-4 semanas.' };
    if (phq9Total <= 19) return { label: 'Depressão Moderadamente Grave', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', desc: 'Indicação clara de tratamento combinado: Antidepressivo ISRS em dose terapêutica efetiva + Psicoterapia regular ambulatorial. Monitoramento rigoroso.' };
    return { label: 'Depressão Grave', color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Tratamento intensivo: Antidepressivo (dose otimizada) + Psicoterapia. Se ideação suicida ativa ou alto risco, pactuar plano de contingência, envolver família e encaminhar para CAPS ou Emergência.' };
  }, [phq9Total]);

  // GAD-7 Evaluation
  const gad7Evaluation = useMemo(() => {
    if (gad7Total <= 4) return { label: 'Ansiedade Mínima ou Ausente', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Psicoeducação, higiene do sono e orientação sobre hábitos saudáveis.' };
    if (gad7Total <= 9) return { label: 'Ansiedade Leve', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', desc: 'Práticas de relaxamento, técnicas de controle de respiração, atividades físicas. Reavaliar em consultas clínicas de rotina.' };
    if (gad7Total <= 14) return { label: 'Ansiedade Moderada', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Encaminhar para psicoterapia estruturada (TCC) e considerar início de tratamento farmacológico com ISRS (Sertralina ou Escitalopram).' };
    return { label: 'Ansiedade Grave', color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', desc: 'Tratamento farmacológico ativo (Antidepressivo em dose terapêutica) associado a psicoterapia intensiva continuada. Retornos frequentes.' };
  }, [gad7Total]);

  return (
    <div className="space-y-8">
      {/* Sub-tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {[
          { id: 'guia', label: 'Guia de Doenças da UBS 🇧🇷', icon: BookOpen },
          { id: 'cronicos', label: 'Doenças Crônicas (HAS/DM)', icon: Heart },
          { id: 'mulher', label: 'Mulher & Gestante (UBS)', icon: ClipboardCheck },
          { id: 'mental', label: 'Escores de Saúde Mental', icon: Brain },
          { id: 'condutas', label: 'Condutas Infecciosas Rápidas', icon: Stethoscope },
        ].map((tab) => {
          const Icon = tab.icon;
          return (
            <button
              key={tab.id}
              onClick={() => setActiveSubTab(tab.id as any)}
              className={`flex items-center gap-2.5 px-5 py-3 rounded-2xl text-sm font-bold transition-all ${
                activeSubTab === tab.id
                  ? 'bg-teal-600 text-white shadow-md shadow-teal-600/10'
                  : 'text-slate-500 dark:text-slate-400 hover:bg-slate-100 dark:hover:bg-slate-800'
              }`}
            >
              <Icon size={18} />
              {tab.label}
            </button>
          );
        })}
      </div>

      {activeSubTab === 'cronicos' && (
        <div className="space-y-6">
          <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
            <button
              onClick={() => setChronicProfile('has')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                chronicProfile === 'has'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Hipertensão Arterial (HAS)
            </button>
            <button
              onClick={() => setChronicProfile('dm')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                chronicProfile === 'dm'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Diabetes Mellitus (DM)
            </button>
          </div>

          {chronicProfile === 'has' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* HAS Left */}
              <div className="space-y-6">
                {/* Diagnóstico */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Bookmark size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Critério Diagnóstico na UBS</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    Aferição de PA em consultório em <strong className="text-teal-600">pelo menos 2 ocasiões distintas ≥ 140/90 mmHg</strong>. 
                  </p>
                  <p className="text-xs text-slate-450 dark:text-slate-500 uppercase font-bold leading-normal">
                    Nota: Se aferição inicial ≥ 180/110 mmHg ou na presença de lesão de órgão-alvo (LOA), o diagnóstico de hipertensão é direto, sem necessidade de reavaliação em outra consulta.
                  </p>
                </div>

                {/* Tratamento / Fluxograma interativo */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Pill size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Algoritmo de Fármacos na UBS</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Selecione o Perfil do Paciente para Tratamento de 1º Linha:</span>
                    <div className="grid grid-cols-2 gap-3">
                      <button
                        onClick={() => setHasPatientType('normal')}
                        className={`p-3 text-left rounded-xl border text-xs font-bold leading-normal transition-all ${
                          hasPatientType === 'normal'
                            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/50 text-teal-700 dark:text-teal-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        Idoso ou Afrodescendente (sem DRC/DM)
                      </button>
                      <button
                        onClick={() => setHasPatientType('diabetico')}
                        className={`p-3 text-left rounded-xl border text-xs font-bold leading-normal transition-all ${
                          hasPatientType === 'diabetico'
                            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/50 text-teal-700 dark:text-teal-400'
                            : 'border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                        }`}
                      >
                        Diabético, Nefropata, Jovem ou com ICC
                      </button>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      {hasPatientType === 'normal' ? (
                        <>
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Activity size={14} /> Preferência: BCC ou Tiazídicos
                          </div>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                            <p>• <strong>BCC (Bloqueadores de Canal de Cálcio)</strong>: <span className="text-teal-600 font-mono">Amlodipino 5mg a 10mg VO / dia</span>. Excelente papel vasodilatador em idosos e negros.</p>
                            <p>• <strong>Tiazídicos (Diuréticos)</strong>: <span className="text-teal-600 font-mono">Hidroclorotiazida 25mg VO / dia de manhã</span> (ou Clortalidona 12.5mg a 25mg). Risco de hipocalemia/hiperuricemia.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Activity size={14} /> Preferência: IECA ou BRA (Nefroproteção)
                          </div>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                            <p>• <strong>IECA</strong>: <span className="text-teal-600 font-mono">Enalapril 10mg a 40mg VO / dia</span> (dividido em 1 ou 2x). Contraindicado em gestantes. Se tosse crônica induzida, trocar por BRA.</p>
                            <p>• <strong>BRA</strong>: <span className="text-teal-600 font-mono">Losartana Potássica 50mg a 100mg VO / dia</span> (dividido em 1 ou 2x). Excelente tolerabilidade e nefroprotetor em DM.</p>
                          </div>
                        </>
                      )}
                    </div>
                  </div>
                </div>
              </div>

              {/* HAS Right */}
              <div className="space-y-6">
                {/* Meta Alvo */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <TrendingUp size={18} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Metas Alvo de Pressão</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setHasTarget('geral')}
                      className={`p-3 text-center rounded-xl border text-xs font-bold leading-snug transition-all ${
                        hasTarget === 'geral'
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/50 text-purple-700 dark:text-purple-400 shadow-sm font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Meta Geral de PA
                    </button>
                    <button
                      onClick={() => setHasTarget('alto')}
                      className={`p-3 text-center rounded-xl border text-xs font-bold leading-snug transition-all ${
                        hasTarget === 'alto'
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/50 text-purple-700 dark:text-purple-400 shadow-sm font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Nefropata / DM / Alto Risco
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:to-slate-900/20 text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Pressão Arterial Alvo (Alvo Terapêutico)</p>
                    <p className="text-4xl font-serif italic font-black text-purple-700 dark:text-purple-400 tracking-tight">
                      {hasTarget === 'geral' ? '< 140 / 90 mmHg' : '< 130 / 80 mmHg'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      {hasTarget === 'geral' 
                        ? 'Alvo para pacientes de baixo-médio risco cardiovascular geral.' 
                        : 'Alvo agressivo para otimização de sobrecarga renal e proteção micro/macrovascular.'}
                    </p>
                  </div>
                </div>

                {/* Exames de Linha de Base */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <ClipboardList size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Exames Anuais Obrigatórios (Rastreio LOA)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'Creatinina + TFG', desc: 'Screening de Disfunção Renal' },
                      { name: 'Potássio Sérico', desc: 'Monitorar perdas ou retenção' },
                      { name: 'EAS / Urina tipo 1', desc: 'Identificar Proteinúria/Início DRC' },
                      { name: 'ECG de repouso', desc: 'Pesquisa de Sobrecarga de VE' },
                      { name: 'Glicemia de Jejum', desc: 'Rastrear Diabetes concomitante' },
                      { name: 'Ácido Úrico', desc: 'Marcador inflamatório de base' }
                    ].map((exam, i) => (
                      <div key={i} className="p-3 bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 rounded-xl">
                        <span className="font-bold block text-slate-700 dark:text-slate-200 text-xs">{exam.name}</span>
                        <span className="text-[9px] text-slate-400 font-semibold">{exam.desc}</span>
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* DM Left */}
              <div className="space-y-6">
                {/* Critérios Diagnósticos DM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Bookmark size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Vigilância de Diabetes: Diagnóstico</h3>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">
                    Confirmação por duas amostras alteradas de qualquer um dos exames:
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                    <p>• <strong>Glicemia de Jejum</strong>: <span className="font-extrabold text-teal-600 font-mono">≥ 126 mg/dL</span></p>
                    <p>• <strong>Hemoglobina Glicada (HbA1c)</strong>: <span className="font-extrabold text-teal-600 font-mono">≥ 6,5%</span></p>
                    <p>• <strong>TOTG (Teste Oral de Tolerância)</strong> (75g 2h): <span className="font-extrabold text-teal-600 font-mono">≥ 200 mg/dL</span></p>
                    <p>• <strong>Glicemia ao acaso</strong>: <span className="font-extrabold text-teal-600 font-mono">≥ 200 mg/dL</span> acompanhada de sintomas típicos (Poliúria, Polidipsia, Perda de peso rápida).</p>
                  </div>
                  <div className="p-3 bg-teal-500/5 text-teal-600 font-semibold text-[10px] rounded-lg tracking-wide">
                    *Pré-Diabetes: Glicemia de jejum 100-125 mg/dL ou HbA1c 5,7 - 6,4%. Iniciar mudança de estilo de vida imediata.
                  </div>
                </div>

                {/* Tratamento Escalonado de DM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Pill size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Escalonamento de Fármacos na UBS</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'metformina', label: '1ª Linha' },
                      { id: 'sulfonilureia', label: 'Associação' },
                      { id: 'isglt2', label: 'Proteção CV/DRC' },
                      { id: 'insulina', label: 'Descompensado' }
                    ].map((el) => (
                      <button
                        key={el.id}
                        onClick={() => setDmStage(el.id as any)}
                        className={`py-2 text-center rounded-xl border text-[11px] font-bold transition-all ${
                          dmStage === el.id
                            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/50 text-teal-700 dark:text-teal-400 shadow-sm'
                            : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                        }`}
                      >
                        {el.label}
                      </button>
                    ))}
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2 border border-slate-100 dark:border-slate-850">
                    {dmStage === 'metformina' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Metformina (Glifage)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          • Primeira linha absoluta (salvo contraindicação como TFG &lt; 30 mL/min).
                          <br />• <strong>Dosagem</strong>: Iniciar com 500mg VO à noite ou após jantar para diminuir efeitos colaterais gasteintestinal (flatulência, diarreia). Titular progressivamente até máximo de 2000mg/dia VO (dividido 2x/dia). Restringe ganho ponderal.
                        </p>
                      </>
                    )}
                    {dmStage === 'sulfonilureia' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Gliclazida MR (Sulfonilureia de escolha)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          • Segunda linha preferencial sob escopo custo-efetividade SUS. Estimulante de secreção de insulina.
                          <br />• <strong>Dosagem</strong>: Gliclazida MR 30mg a 120mg VO pela manhã junto ao desjejum. *Cuidado: Alto risco de hipoglicemia. Evitar sulfonilureias de 1ª geração (Glibenclamida) devido ao excessivo risco de hipoglicemias graves no idoso.
                        </p>
                      </>
                    )}
                    {dmStage === 'isglt2' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Inibidores de SGLT2 (Dapagliflozina)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          • Prioritário se paciente portar <strong>Insuficiência Cardíaca (IC)</strong> ou <strong>Doença Renal Crônica (DRC)</strong> de base.
                          <br />• <strong>Dosagem</strong>: Dapagliflozina 10mg VO / dia de manhã. Reduz hospitalização por IC, lentifica perda de função renal e promove glicosúria (induz perda de peso e queda pressórica).
                        </p>
                      </>
                    )}
                    {dmStage === 'insulina' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Insulinização com NPH (Esquema Basal)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          • Indicado no diagnóstico se Glicemia de jejum &gt; 300 mg/dL, perda de peso extrema ("glucotoxidade") ou HbA1c &gt; 10%.
                          <br />• <strong>Dosagem Inicial Basal</strong>: Iniciar Insulina NPH na dose de <strong>0,1 a 0,2 UI/kg de peso VO ao deitar</strong> (habitualmente 10 UI basal). Titular adicionando 2 UI a cada 3 dias conforme monitoramento de glicemia capilar de jejum (meta de jejum: 80-130 mg/dL).
                        </p>
                      </>
                    )}
                  </div>
                </div>
              </div>

              {/* DM Right */}
              <div className="space-y-6">
                {/* Meta Alvo DM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 rounded-xl bg-purple-500/10 text-purple-600 flex items-center justify-center">
                        <TrendingUp size={18} />
                      </div>
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">HbA1c Alvo</h3>
                    </div>
                  </div>

                  <div className="grid grid-cols-2 gap-3">
                    <button
                      onClick={() => setDmTarget('padrao')}
                      className={`p-3 text-center rounded-xl border text-xs font-bold leading-snug transition-all ${
                        dmTarget === 'padrao'
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/50 text-purple-700 dark:text-purple-400 shadow-sm font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Adulto Geral
                    </button>
                    <button
                      onClick={() => setDmTarget('fragil')}
                      className={`p-3 text-center rounded-xl border text-xs font-bold leading-snug transition-all ${
                        dmTarget === 'fragil'
                          ? 'bg-purple-50/50 dark:bg-purple-950/20 border-purple-500/50 text-purple-700 dark:text-purple-400 shadow-sm font-bold'
                          : 'border-slate-200 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                      }`}
                    >
                      Frágil ou Idoso Complexo
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:to-slate-900/20 text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Hemoglobina Glicada Alvo (HbA1c)</p>
                    <p className="text-4xl font-serif italic font-black text-purple-700 dark:text-purple-400 tracking-tight">
                      {dmTarget === 'padrao' ? '< 7,0 %' : '< 8,0 %'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      {dmTarget === 'padrao' 
                        ? 'Alvo para controle estrito e mitigação de complicações microvasculares de longo prazo.' 
                        : 'Alvo flexível para atenuar o risco letal de hipoglicemias graves e polifarmácia.'}
                    </p>
                  </div>
                </div>

                {/* Combata complicações anuais */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <UserCheck size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Screening de Complicações Microvasculares</h3>
                  </div>
                  <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Exame do Pé Diabético (Sensibilidade)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Realizar anualmente na consulta médica/enfermagem: Inspeção visual de fissuras, micose e calosidades + Teste com Monofilamento de 10g em 4 pontos plantares + Verificação de pulsos periféricos.
                      </span>
                    </div>
                    <div className="pt-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Retinopatia Diabética (Fundo de Olho)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Referenciar ao oftalmologista para fundoscopia com pupila dilatada anualmente (ou a cada 2 anos se exame prévio completamente normal e bom controle glicêmico).
                      </span>
                    </div>
                    <div className="pt-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Nefropatia Diabética (Exames de Rastreio)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Pesquisar anualmente Relação Albumina/Creatinina Urinária (RAC) em amostra isolada e calcular a taxa de filtração glomerular estimada (TFG) por creatinina plasmática.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'mulher' && (
        <div className="space-y-8">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            {/* Gestational Age Calculator */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-rose-500/10 text-rose-600 flex items-center justify-center">
                  <Calculator size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Calculadora Gestacional (Regra de Naegele)</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Cálculo de IG e DPP pelo Ministério da Saúde</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Data da Última Menstruação (DUM):</label>
                <input
                  type="date"
                  value={dum}
                  onChange={(e) => setDum(e.target.value)}
                  className="w-full p-4 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 outline-none text-sm dark:text-white focus:ring-2 focus:ring-teal-500"
                />
              </div>

              {gestationalData ? (
                'error' in gestationalData ? (
                  <div className="p-4 bg-amber-500/10 border border-amber-500/20 text-amber-600 dark:text-amber-400 font-semibold rounded-xl text-xs">
                    {gestationalData.error}
                  </div>
                ) : (
                  <div className="space-y-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div className="p-4 bg-teal-500/5 border border-teal-500/10 rounded-2xl text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">Idade Gestacional</span>
                        <span className="text-xl font-serif italic font-black text-teal-600 block">
                          {gestationalData.weeks} Semanas
                        </span>
                        <span className="text-xs text-slate-500 font-bold block mt-1">
                          {gestationalData.days > 0 ? `e ${gestationalData.days} dia(s)` : 'exatas'}
                        </span>
                      </div>
                      <div className="p-4 bg-purple-500/5 border border-purple-500/10 rounded-2xl text-center">
                        <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">Data Provável do Parto (DPP)</span>
                        <span className="text-xl font-serif italic font-black text-purple-600 block mt-2">
                          {gestationalData.dpp}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
                        <Bookmark size={14} /> Recomendações do {gestationalData.trimester}º Trimestre
                      </div>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-semibold">
                        {gestationalData.trimester === 1 && (
                          <>
                            <li>• 💊 <strong>Vitaminas</strong>: Iniciar Ácido Fólico 0,4mg/dia (prevenção de defeitos do tubo neural).</li>
                            <li>• 🧪 <strong>Exames do 1º Trimestre</strong>: Tipagem Sanguínea, Coombs Indireto (se Rh-), Hemograma, Glicemia de Jejum, VDRL, HIV, HBsAg, Toxoplasmose IgG/IgM e Urina rotina com Urocultura.</li>
                            <li>• 🩺 <strong>Consultas</strong>: Orientar consultas mensais. Explicar vacinação básica (Tétano, Hepatite B).</li>
                          </>
                        )}
                        {gestationalData.trimester === 2 && (
                          <>
                            <li>• 💊 <strong>Vitaminas</strong>: Iniciar Sulfato Ferroso 40mg de ferro elementar por dia.</li>
                            <li>• 🧪 <strong>Exames de Rotina</strong>: Realizar Teste de Tolerância à Glicose (TOTG 75g) entre as semanas 24 e 28. Ultrassom Morfológico de 2º trimestre ideal de 20-24s.</li>
                            <li>• 🩺 <strong>Acompanhamento</strong>: Mensurar ganho de peso e acompanhar crescimento da altura uterina (AU).</li>
                          </>
                        )}
                        {gestationalData.trimester === 3 && (
                          <>
                            <li>• 🧪 <strong>Screening SGB</strong>: Agendar coleta de swab anal e vaginal para Streptococcus B (SGB) entre 35-37 semanas de gestação.</li>
                            <li>• 🧬 <strong>Exames Repetição</strong>: Repetir exames básicos do 1º trimestre (VDRL, HIV, Urina/Urocultura, Hemograma).</li>
                            <li>• 🩺 <strong>Sinais de Alerta</strong>: Orientar sobre perda de líquido, diminuição de movimentos fetais (fetalidade), dor de cabeça extrema, escotomas cintilantes ou dor epigástrica (sinais de Pré-Eclâmpsia).</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  Selecione uma DUM acima para detalhar o protocolo de consultas pré-natal correspondente.
                </div>
              )}
            </div>

            {/* Screening of Women & General Adults */}
            <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
              <div className="flex items-center gap-3">
                <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                  <UserCheck size={18} />
                </div>
                <div>
                  <h3 className="font-bold text-slate-800 dark:text-slate-100">Guia de Rastreamentos Preventivos (INCA/MS)</h3>
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Verificador interativo por gênero e faixa de idade</p>
                </div>
              </div>

              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Sexo Administrativo:</span>
                  <div className="flex bg-slate-100 dark:bg-slate-900 rounded-xl p-1">
                    <button
                      onClick={() => setScreeningSex('female')}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        screeningSex === 'female'
                          ? 'bg-white dark:bg-slate-700 text-slate-850 dark:text-white shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Feminino
                    </button>
                    <button
                      onClick={() => setScreeningSex('male')}
                      className={`flex-1 text-center py-2 rounded-lg text-xs font-bold transition-all ${
                        screeningSex === 'male'
                          ? 'bg-white dark:bg-slate-700 text-slate-855 dark:text-white shadow-sm'
                          : 'text-slate-500'
                      }`}
                    >
                      Masculino
                    </button>
                  </div>
                </div>

                <div className="space-y-1.5">
                  <span className="text-[10px] font-bold text-slate-400 uppercase block tracking-wider">Idade (em Anos):</span>
                  <div className="flex items-center gap-3">
                    <input
                      type="number"
                      min="0"
                      max="110"
                      value={screeningAge}
                      onChange={(e) => setScreeningAge(parseInt(e.target.value) || 0)}
                      className="w-full p-2 rounded-xl border border-slate-200 dark:border-slate-700 dark:bg-slate-900 outline-none text-xs text-center dark:text-white font-mono font-bold"
                    />
                  </div>
                </div>
              </div>

              {/* Recommendations Output */}
              <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:to-slate-900/20 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-4">
                <h4 className="text-xs font-extrabold text-slate-400 uppercase tracking-widest">Rastreios Governamentais Recomendados para este Perfil:</h4>
                <div className="space-y-3 font-medium">
                  {screeningSex === 'female' && screeningAge >= 25 && screeningAge <= 64 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-rose-600 uppercase block tracking-wider">🔬 Exame Preventivo (Colo de Útero / Papanicolau)</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado de 25 a 64 anos</strong> para quem já iniciou atividade sexual. Periodicidade: anual nos dois primeiros e, se normais, a cada 3 anos.
                      </p>
                    </div>
                  ) : null}

                  {screeningSex === 'female' && screeningAge >= 50 && screeningAge <= 69 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-rose-600 uppercase block tracking-wider">🍒 Mamografia de Rastreamento</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado de 50 a 69 anos</strong>. Mamografia bilateral de rastreamento a cada 2 anos. No SUS, exames em outras idades requerem indicação clínica por risco aumentado.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge >= 50 && screeningAge <= 75 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-teal-650 uppercase block tracking-wider">💩 Rastreamento de Câncer Colorretal</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado dos 50 aos 75 anos</strong>. Realizar Pesquisa de Sangue Oculto nas Fezes (PSOF) anualmente na UBS, seguido de colonoscopia se alterada.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge >= 18 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl font-medium">
                      <span className="text-xs font-black text-purple-600 uppercase block tracking-wider">❤️ Vigilância Cardiovascular & HAS</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        Aferição de Pressão Arterial anualmente na UBS. Rastreio de Diabetes e dislipidemia com dosagem lipídica a partir de 35-45 anos, ou antes sob obesidade, histórico familiar ou gestação prévia.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge < 18 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-emerald-600 uppercase block tracking-wider">👶 Puericultura & Vacinação Básica</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                        Acompanhamento de curvas de crescimento (Peso, Estatura, Perímetro Cefálico), marcos de desenvolvimento e manutenção rigorosa do Cartão de Vacina completo do Programa Nacional de Imunizações (PNI).
                      </p>
                    </div>
                  ) : null}
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {activeSubTab === 'mental' && (
        <div className="space-y-6">
          <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
            <button
              onClick={() => setMentalProfile('phq9')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                mentalProfile === 'phq9'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Rastreio Depressão (PHQ-9)
            </button>
            <button
              onClick={() => setMentalProfile('gad7')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                mentalProfile === 'gad7'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Rastreio Ansiedade (GAD-7)
            </button>
          </div>

          {mentalProfile === 'phq9' ? (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Questionario PHQ-9 */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h3 className="font-serif italic font-black text-xl text-slate-800 dark:text-white">Escala PHQ-9 interativa</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-relaxed">Avaliação de sintomas depressivos nas últimas 2 semanas na UBS</p>
                  </div>
                  <button
                    onClick={() => setPhq9Answers(Array(9).fill(-1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-black border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all"
                  >
                    <RotateCcw size={12} /> Limpar
                  </button>
                </div>

                <div className="space-y-6">
                  {PHQ9_QUESTIONS.map((q, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b border-slate-55 dark:border-slate-800 last:border-b-0">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{idx + 1}. {q}</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {MENTAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              const next = [...phq9Answers];
                              next[idx] = opt.value;
                              setPhq9Answers(next);
                            }}
                            className={`p-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all leading-snug ${
                              phq9Answers[idx] === opt.value
                                ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-500/80 text-teal-800 dark:text-teal-300 shadow-sm font-bold'
                                : 'border-slate-150 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'
                            }`}
                          >
                            {opt.label} <span className="font-mono text-[10px] font-bold block opacity-60 font-medium">+{opt.value} pt</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultado PHQ-9 */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 sticky top-24">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Resultado do Calculador</span>
                    <div className="w-24 h-24 rounded-full border-4 border-teal-500/10 bg-teal-500/5 mx-auto flex items-center justify-center">
                      <span className="text-4xl font-serif italic font-black text-teal-600">{isPhq9Complete ? phq9Total : '?'}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-bold block mt-1">Pontos Totais (0-27)</span>
                  </div>

                  {isPhq9Complete ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border text-center font-bold text-xs uppercase tracking-wide leading-relaxed ${phq9Evaluation.color}`}>
                        {phq9Evaluation.label}
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">Diretriz UBS para esta Pontuação:</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-semibold">
                          {phq9Evaluation.desc}
                        </p>
                      </div>

                      {hasSuicidalIdeation && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs space-y-2 font-bold leading-normal">
                          <div className="flex items-center gap-1.5 uppercase font-black tracking-wider text-[10px]">
                            <AlertTriangle size={14} /> Atenção Crítica de Segurança
                          </div>
                          <p className="font-semibold text-rose-750 dark:text-rose-400">
                            Escore positivo na Questão 9 (Ideação de autoextermínio). É obrigatória a avaliação médica detalhada de risco para suicídio imediato, elaboração de plano de suporte familiar e, se risco grave, acionamento do CAPS de referência ou sala de emergência.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <Brain size={36} className="mx-auto text-slate-300 dark:text-slate-655" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                        Selecione uma resposta para as 9 perguntas para computar a avaliação diagnóstica de depressão continuada.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
              {/* Questionario GAD-7 */}
              <div className="lg:col-span-2 bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex justify-between items-center pb-4 border-b border-slate-100 dark:border-slate-700">
                  <div>
                    <h3 className="font-serif italic font-black text-xl text-slate-800 dark:text-white">Escala GAD-7 interativa</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-relaxed">Rastreio de Transtorno de Ansiedade Geral na Atenção Básica</p>
                  </div>
                  <button
                    onClick={() => setGad7Answers(Array(7).fill(-1))}
                    className="flex items-center gap-1.5 px-3 py-1.5 text-[10px] uppercase font-black border border-slate-200 dark:border-slate-700 rounded-xl hover:bg-slate-50 dark:hover:bg-slate-900 text-slate-500 dark:text-slate-400 transition-all"
                  >
                    <RotateCcw size={12} /> Limpar
                  </button>
                </div>

                <div className="space-y-6">
                  {GAD7_QUESTIONS.map((q, idx) => (
                    <div key={idx} className="space-y-2 pb-4 border-b border-slate-55 dark:border-slate-800 last:border-b-0">
                      <span className="text-xs font-bold text-slate-700 dark:text-slate-200 block">{idx + 1}. {q}</span>
                      <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                        {MENTAL_OPTIONS.map((opt) => (
                          <button
                            key={opt.value}
                            onClick={() => {
                              const next = [...gad7Answers];
                              next[idx] = opt.value;
                              setGad7Answers(next);
                            }}
                            className={`p-2.5 rounded-xl border text-[11px] font-semibold text-center transition-all leading-snug ${
                              gad7Answers[idx] === opt.value
                                ? 'bg-teal-50 dark:bg-teal-950/20 border-teal-500/80 text-teal-800 dark:text-teal-300 shadow-sm font-bold'
                                : 'border-slate-150 dark:border-slate-700 text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-750'
                            }`}
                          >
                            {opt.label} <span className="font-mono text-[10px] font-bold block opacity-60 font-medium">+{opt.value} pt</span>
                          </button>
                        ))}
                      </div>
                    </div>
                  ))}
                </div>
              </div>

              {/* Resultado GAD-7 */}
              <div className="lg:col-span-1 space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6 sticky top-24">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Resultado do Calculador</span>
                    <div className="w-24 h-24 rounded-full border-4 border-teal-500/10 bg-teal-500/5 mx-auto flex items-center justify-center">
                      <span className="text-4xl font-serif italic font-black text-teal-600">{isGad7Complete ? gad7Total : '?'}</span>
                    </div>
                    <span className="text-xs text-slate-400 font-bold block mt-1">Pontos Totais (0-21)</span>
                  </div>

                  {isGad7Complete ? (
                    <div className="space-y-4">
                      <div className={`p-4 rounded-2xl border text-center font-bold text-xs uppercase tracking-wide leading-relaxed ${gad7Evaluation.color}`}>
                        {gad7Evaluation.label}
                      </div>
                      <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-2">
                        <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">Diretriz UBS para esta Pontuação:</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-semibold">
                          {gad7Evaluation.desc}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <Brain size={36} className="mx-auto text-slate-300 dark:text-slate-655" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                        Selecione uma resposta para as 7 perguntas para computar o diagnóstico e a severidade do transtorno ansioso.
                      </p>
                    </div>
                  )}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'condutas' && (
        <div className="space-y-6">
          <div className="flex gap-4 p-1.5 bg-slate-100 dark:bg-slate-800/80 rounded-2xl w-fit">
            <button
              onClick={() => setRapidConduta('faringo')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                rapidConduta === 'faringo'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Faringoamigdalite Bacteriana (Centor)
            </button>
            <button
              onClick={() => setRapidConduta('cistite')}
              className={`px-5 py-2.5 rounded-xl font-bold text-xs uppercase tracking-wider transition-all ${
                rapidConduta === 'cistite'
                  ? 'bg-white dark:bg-slate-700 text-slate-800 dark:text-white shadow-sm'
                  : 'text-slate-500'
              }`}
            >
              Infecção de Urina / Cistite
            </button>
          </div>

          {rapidConduta === 'faringo' ? (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Centor Calculator */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                    <ClipboardCheck size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Cálculo de Score de Centor Modificado</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Auxílio diagnóstico para uso de antibióticos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Identifique os Sinais Clínicos Presentes:</span>
                  <div className="space-y-3">
                    {[
                      { state: centorFever, setState: setCentorFever, label: 'Febre Aferida ou Referida recente (> 38ºC)' },
                      { state: centorNoCough, setState: setCentorNoCough, label: 'Ausência de Tosses e Corizas (IVAS altas puras)' },
                      { state: centorAdenopathy, setState: setCentorAdenopathy, label: 'Linfadenopatia cervical anterior dolorosa (Gânglios turgidos)' },
                      { state: centorExudate, setState: setCentorExudate, label: 'Presença de exsudato amigdaliano fibrinoso/placas purulentas' }
                    ].map((item, idx) => (
                      <button
                        key={idx}
                        onClick={() => item.setState(!item.state)}
                        className={`w-full flex items-center gap-4 p-4 rounded-2xl border text-left font-bold transition-all ${
                          item.state
                            ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/50 text-teal-800 dark:text-teal-300'
                            : 'bg-white dark:bg-slate-850 border-slate-150 dark:border-slate-700 text-slate-600 dark:text-slate-450 hover:bg-slate-50'
                        }`}
                      >
                        <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-white text-xs ${item.state ? 'bg-teal-600 border-teal-600' : 'border-slate-300'}`}>
                          {item.state && "✓"}
                        </div>
                        <span className="text-xs leading-normal font-sans">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Selecione a Idade do Paciente:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 10, label: 'Criança (3-14a)' },
                        { value: 30, label: 'Adulto (15-44a)' },
                        { value: 55, label: 'Idoso (≥45a)' }
                      ].map((item, i) => (
                        <button
                          key={i}
                          onClick={() => setCentorAge(item.value)}
                          className={`p-2.5 text-center rounded-xl border text-[11px] font-bold transition-all ${
                            (item.value === 10 && centorAge < 15) ||
                            (item.value === 30 && centorAge >= 15 && centorAge < 45) ||
                            (item.value === 55 && centorAge >= 45)
                              ? 'bg-teal-50/50 dark:bg-teal-950/20 border-teal-500/50 text-teal-800 dark:text-teal-300'
                              : 'border-slate-150 dark:border-slate-700 text-slate-500 hover:bg-slate-50'
                          }`}
                        >
                          {item.label}
                        </button>
                      ))}
                    </div>
                  </div>
                </div>
              </div>

              {/* Centor Result & Conduct */}
              <div className="space-y-6">
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                  <div className="text-center space-y-2">
                    <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Resultado do Centor</span>
                    <div className="w-20 h-20 rounded-full border-4 border-teal-500/10 bg-teal-500/5 mx-auto flex items-center justify-center">
                      <span className="text-3xl font-serif italic font-black text-teal-600">{centorScore}</span>
                    </div>
                    <span className="text-[10px] text-slate-400 font-bold block uppercase tracking-widest font-sans">Pontos do Score Centor</span>
                  </div>

                  <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3 font-medium">
                    {centorScore <= 1 && (
                      <>
                        <div className="text-xs uppercase font-black text-emerald-600 ring-1 ring-emerald-500/30 bg-emerald-550/10 px-3 py-1.5 rounded-lg w-fit">
                          Risco &lt; 10%: Baixíssima probabilidade de S. pyogenes
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-sans">
                          • <strong>Conduta</strong>: Tratamento exclusivamente sintomático. <strong>Evitar antibiótico!</strong>
                          <br />• <strong>Sintomáticos</strong>: Prescrever Ibuprofeno 400mg VO de 8/8h por 3-5 dias ou Dipirona 500mg-1g VO de 6/6h se febre/dor de garganta. Amigdalites nesta pontuação têm forte viés viral.
                        </p>
                      </>
                    )}
                    {centorScore >= 2 && centorScore <= 3 && (
                      <>
                        <div className="text-xs uppercase font-black text-amber-600 ring-1 ring-amber-500/30 bg-amber-550/10 px-3 py-1.5 rounded-lg w-fit">
                          Risco Intermediário (~15-30%)
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-sans">
                          • <strong>Conduta</strong>: Se houver teste rápido (Strep Test) na UBS, realizar coleta. Se positivo, iniciar antibiótico. Se negativo ou indisponível teste, o manejo sintomático é prudente. Avaliar prescrever antibiótico apenas em casos severos com toxicidade ou comorbidades de risco (ex: cardiopata reumático).
                        </p>
                      </>
                    )}
                    {centorScore >= 4 && (
                      <>
                        <div className="text-xs uppercase font-black text-rose-600 ring-1 ring-rose-500/30 bg-rose-550/10 px-3 py-1.5 rounded-lg w-fit">
                          Risco Elevado (&gt; 50% bacteriano)
                        </div>
                        <div className="space-y-3.5 mt-2 font-semibold">
                          <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                            • <strong>Conduta Governamental</strong>: Recomendada antibioticoterapia empírica direcionada de primeira linha na UBS:
                          </p>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-700 text-xs leading-relaxed">
                            <span className="font-extrabold block text-teal-600">Opção 1: Penicilina G Benzatina (Dose Única IM)</span>
                            <span className="block text-slate-500 dark:text-slate-400 text-[11px] mt-1 font-sans">
                              • Crianças &lt; 27kg: 600.000 UI IM profundo.
                              <br />• Adultos e crianças &ge; 27kg: 1.200.000 UI IM profundo.
                            </span>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-700 text-xs leading-relaxed">
                            <span className="font-extrabold block text-teal-600">Opção 2: Amoxicilina Oral (Tratamento 10 dias)</span>
                            <span className="block text-slate-500 dark:text-slate-400 text-[11px] mt-1 font-sans">
                              • Adultos: 500mg de 8/8h por 10 dias (ou 875mg de 12/12h).
                              <br />• Crianças: 50 mg/kg/dia dividido de 8/8h.
                              <br />*Alerta: Manter rigorosamente por <strong>10 dias completos</strong> para prevenção segura de surto de febre reumática e glomerulonefrite pós-estreptocócica.
                            </span>
                          </div>
                        </div>
                      </>
                    )}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
              {/* Cistite Left */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-6">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                    <Bookmark size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Cistite Não Complicada na UBS</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Infecção urinária baixa em mulheres saudáveis</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                  <div className="p-4 bg-teal-505/5 text-teal-600 font-semibold text-[11px] rounded-lg tracking-wide leading-normal">
                    💡 <strong>Definição Prática</strong>: Queixas típicas de disúria intensa, polaciúria, urgência e dor suprapúbica. Presença de febre ou dor lombar exclui cistite (recomendar avaliação de Pielonefrite).
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 block mb-2">Exames diagnósticos na Atenção Básica:</span>
                    <p>• <strong>EAS em consultório (tiras de dipstick)</strong>: Presença de nitrito positivo e esterase leucocitária elevada oferecem altíssima probabilidade diagnóstica (sensibilidade &gt; 80%).</p>
                    <p>• <strong>Urocultura com Antibiograma</strong>: Dispensável no primeiro episódio em mulheres adultas não gestantes saudáveis. Solicitar apenas em ITU recorrente (&ge; 3 episódios/ano), suspeita de pielonefrite ou gestantes.</p>
                  </div>
                </div>
              </div>

              {/* Tratamento Cistite right */}
              <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                <div className="flex items-center gap-3">
                  <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                    <Pill size={18} />
                  </div>
                  <div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Esquemas Antibióticos na Atenção Básica</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider text-left">Diretriz de 1º Escolha do Ministério da Saúde</p>
                  </div>
                </div>

                <div className="space-y-4 font-semibold">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-850 font-semibold text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    <div>
                      <span className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase block">Opção 1: Nitrofurantoína (Macrocristais)</span>
                      <span className="block mt-1">
                        • <strong>Posologia</strong>: 100mg VO de 12/12h (formulação macrocristais) por 5 a 7 dias inteiros.
                        <br />• <strong>Contraindicação</strong>: Evitar se TFG estimada / depuração de creatinina &lt; 30 ml/min.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-850 font-semibold text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    <div>
                      <span className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase block">Opção 2: Fosfomicina Trometamol (Adesão de 100%)</span>
                      <span className="block mt-1 col-span-2">
                        • <strong>Posologia</strong>: Envelope de 3g diluído em água por via oral em <strong>dose única</strong>. Usar preferencialmente à noite, antes de dormir com bexiga vazia.
                        <br />• <strong>Vantagem</strong>: Excelente sobrevida de concentração ativa no trato urinário e virtualmente impossibilidade de abandono de tratamento.
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {activeSubTab === 'guia' && (
        <div className="space-y-6">
          {/* Top category filter & Search bar */}
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4 items-center">
            {/* Search Input */}
            <div className="relative md:col-span-1">
              <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input
                type="text"
                placeholder="Pesquisar doença ou conduta..."
                value={guiaSearch}
                onChange={(e) => setGuiaSearch(e.target.value)}
                className="w-full pl-11 pr-10 py-3 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl text-sm font-semibold focus:outline-none focus:ring-2 focus:ring-teal-500 text-slate-800 dark:text-slate-100"
              />
              {guiaSearch && (
                <button
                  onClick={() => setGuiaSearch('')}
                  className="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-650"
                >
                  <XCircle size={16} />
                </button>
              )}
            </div>

            {/* Category chips */}
            <div className="md:col-span-2 flex flex-wrap gap-1.5 overflow-x-auto pb-1">
              {['Todos', 'Cardiovascular/Crônicas', 'Metabólicas/Endócrinas', 'Respiratório', 'Gastrointestinal', 'Infecciosas/Endemias', 'Pele & Dermatologia', 'Saúde Mental', 'Outros'].map((cat) => {
                const count = cat === 'Todos' 
                  ? UBS_CATALOG_DISEASES.length 
                  : UBS_CATALOG_DISEASES.filter(d => d.category === cat).length;
                return (
                  <button
                    key={cat}
                    onClick={() => setGuiaSelectedCategory(cat)}
                    className={`px-3.5 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap ${
                      guiaSelectedCategory === cat
                        ? 'bg-teal-600 text-white shadow-sm'
                        : 'bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 text-slate-600 dark:text-slate-350 hover:bg-slate-50'
                    }`}
                  >
                    {cat} <span className="opacity-60 ml-0.5">({count})</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Main UBS Chief Complaints Selector */}
          <div className="bg-white dark:bg-slate-900 p-6 rounded-3xl border border-slate-200 dark:border-slate-800 space-y-4 shadow-sm">
            <div className="flex items-center justify-between">
              <h4 className="text-xs font-black uppercase tracking-wider text-slate-400 dark:text-slate-500 flex items-center gap-2">
                <ClipboardList size={16} className="text-teal-600" />
                Queixas Principais mais Comuns na UBS (Atenção Básica)
              </h4>
              {guiaSearch && (
                <button 
                  onClick={() => setGuiaSearch('')} 
                  className="text-[10px] font-black text-teal-600 uppercase tracking-widest hover:underline"
                >
                  Limpar Filtro
                </button>
              )}
            </div>
            
            <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-5 gap-3">
              {[
                { label: 'Dor Lombar (Lombalgia)', icon: Stethoscope, term: 'Lombalgia' },
                { label: 'Azia / Refluxo Ácido', icon: Pill, term: 'Refluxo' },
                { label: 'Queimação no Estômago', icon: Pill, term: 'Gastrite' },
                { label: 'Cansaço / Fraqueza', icon: Activity, term: 'Anemia' },
                { label: 'Ansiedade / Insônia', icon: Brain, term: 'Ansiedade' },
                { label: 'Tristeza / Desalento', icon: Activity, term: 'Depressão' },
                { label: 'Coceira / Lesão na Pele', icon: Microscope, term: 'Micoses' },
                { label: 'Tosse / Catarro', icon: Wind, term: 'Tuberculose' },
                { label: 'Dor de Garganta', icon: Stethoscope, term: 'Faringoamigdalite' },
                { label: 'Febre / Dor no Corpo', icon: AlertTriangle, term: 'Dengue' },
                { label: 'Ondas de Calor (Fogachos)', icon: Droplets, term: 'Climatério' },
                { label: 'Ardor ao Urinar / Disúria', icon: Activity, term: 'Cistite' },
                { label: 'Tratamento de Pressão', icon: Heart, term: 'Hipertensão' },
                { label: 'Controle de Diabetes', icon: Activity, term: 'Diabetes' },
                { label: 'Nariz Entupido / Coriza', icon: Wind, term: 'Resfriado' },
                { label: 'Prurido / Corrimento Vaginal', icon: Droplets, term: 'Candidíase' },
                { label: 'Dor nas Articulações', icon: AlertTriangle, term: 'Artrose' },
                { label: 'Varizes / Peso nas Pernas', icon: Activity, term: 'Insuficiência' },
                { label: 'Dor de Cabeça / Enxaqueca', icon: Zap, term: 'Migrânea' },
                { label: 'Cólica / Vermes Intestinais', icon: ClipboardList, term: 'Parasitoses' },
              ].map((comp) => {
                const Icon = comp.icon;
                const isActive = guiaSearch.toLowerCase() === comp.term.toLowerCase();
                return (
                  <button
                    key={comp.label}
                    onClick={() => {
                      setGuiaSearch(isActive ? '' : comp.term);
                      if (!isActive) {
                        setGuiaSelectedCategory('Todos');
                      }
                    }}
                    className={`flex items-center gap-2.5 p-3 rounded-2xl border text-left transition-all ${
                      isActive 
                        ? 'bg-teal-500/10 border-teal-500 text-teal-700 dark:text-teal-450 font-black shadow-sm ring-1 ring-teal-500/30'
                        : 'bg-slate-50 dark:bg-slate-850 hover:bg-slate-100 dark:hover:bg-slate-800 border-slate-150 dark:border-slate-800 text-slate-600 dark:text-slate-400 font-bold'
                    }`}
                  >
                    <div className={`p-1.5 rounded-lg ${isActive ? 'bg-teal-500 text-white' : 'bg-slate-200/50 dark:bg-slate-800 text-slate-500'}`}>
                      <Icon size={14} />
                    </div>
                    <span className="text-[11px] leading-tight font-sans tracking-tight">{comp.label}</span>
                  </button>
                );
              })}
            </div>
          </div>

          {/* Core Guia Layout */}
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
            {/* Left Column: Disease list selection */}
            <div className="lg:col-span-4 space-y-2.5 max-h-[650px] overflow-y-auto pr-1">
              {(() => {
                const filtered = UBS_CATALOG_DISEASES.filter((d) => {
                  const matchCat = guiaSelectedCategory === 'Todos' || d.category === guiaSelectedCategory;
                  const matchSearch = d.name.toLowerCase().includes(guiaSearch.toLowerCase()) || 
                    d.category.toLowerCase().includes(guiaSearch.toLowerCase()) ||
                    d.diagnostic.toLowerCase().includes(guiaSearch.toLowerCase());
                  return matchCat && matchSearch;
                });

                if (filtered.length === 0) {
                  return (
                    <div className="p-8 text-center bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 rounded-3xl text-sm font-semibold text-slate-500 dark:text-slate-400">
                      Nenhuma doença encontrada com os critérios informados.
                    </div>
                  );
                }

                return filtered.map((d) => (
                  <button
                    key={d.id}
                    onClick={() => setSelectedGuiaDiseaseId(d.id)}
                    className={`w-full text-left p-4 rounded-2xl border transition-all flex flex-col gap-1.5 ${
                      selectedGuiaDiseaseId === d.id
                        ? 'bg-teal-500/5 dark:bg-teal-500/10 border-teal-500/60 shadow-sm ring-1 ring-teal-500/40'
                        : 'bg-white dark:bg-slate-800 border-slate-150 dark:border-slate-750 hover:bg-slate-50 dark:hover:bg-slate-750'
                    }`}
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[9px] uppercase tracking-widest font-black text-slate-400 font-sans">{d.category}</span>
                      {d.interactiveType && (
                        <span className="px-1.5 py-0.5 bg-purple-500/10 text-purple-600 dark:text-purple-400 border border-purple-500/20 text-[8px] font-black uppercase rounded">Calculador</span>
                      )}
                    </div>
                    <span className={`text-xs font-black transition-colors ${selectedGuiaDiseaseId === d.id ? 'text-teal-700 dark:text-teal-400' : 'text-slate-800 dark:text-slate-200'}`}>
                      {d.name}
                    </span>
                    <p className="text-[10px] text-slate-400 dark:text-slate-500 line-clamp-2 leading-relaxed">
                      {d.diagnostic}
                    </p>
                  </button>
                ));
              })()}
            </div>

            {/* Right Column: Disease full information & interactive tools */}
            <div className="lg:col-span-8">
              {(() => {
                const disease = UBS_CATALOG_DISEASES.find(d => d.id === selectedGuiaDiseaseId);
                if (!disease) {
                  return (
                    <div className="p-12 text-center bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-750 rounded-3xl text-sm text-slate-400 dark:text-slate-500 font-semibold uppercase tracking-wider">
                      Selecione uma doença na barra de pesquisa à esquerda para ver o protocolo completo.
                    </div>
                  );
                }

                return (
                  <div className="bg-white dark:bg-slate-800 p-6 sm:p-8 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-7">
                    {/* Header */}
                    <div className="flex flex-wrap items-start justify-between gap-4 border-b border-slate-100 dark:border-slate-700 pb-5">
                      <div>
                        <span className="text-[10px] bg-teal-500/10 text-teal-600 dark:text-teal-400 px-2.5 py-1 rounded-full font-black uppercase tracking-wider">{disease.category}</span>
                        <h2 className="text-xl sm:text-2xl font-serif italic font-black text-slate-800 dark:text-slate-100 mt-2 tracking-tight">{disease.name}</h2>
                      </div>
                    </div>

                    {/* Diagnostic section */}
                    <div className="p-5 bg-gradient-to-br from-slate-50 to-slate-100/30 dark:from-slate-900/40 dark:to-slate-900/10 rounded-2xl border border-slate-150/40 dark:border-slate-800 space-y-2.5">
                      <div className="flex items-center gap-2.5 text-teal-700 dark:text-teal-400">
                        <Bookmark size={18} />
                        <h4 className="font-sans font-black text-xs uppercase tracking-wider">Critério Diagnóstico na UBS</h4>
                      </div>
                      <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                        {disease.diagnostic}
                      </p>
                    </div>

                    {/* Alarm symptoms (strictly highlighted box!) */}
                    {disease.alarm && (
                      <div className="p-5 bg-rose-500/5 dark:bg-rose-500/10 rounded-2xl border border-rose-500/25 space-y-2.5 shadow-sm">
                        <div className="flex items-center gap-2.5 text-rose-600 dark:text-rose-400">
                          <AlertTriangle size={18} className="animate-pulse" />
                          <h4 className="font-sans font-black text-xs uppercase tracking-wider">Sinais de Alarme & Direcionamento de Urgência</h4>
                        </div>
                        <p className="text-xs text-rose-750 dark:text-rose-200 leading-relaxed font-bold font-sans">
                          • {disease.alarm}
                        </p>
                      </div>
                    )}

                    {/* Treatment paths */}
                    <div className="space-y-4">
                      <div className="flex items-center gap-2.5 text-orange-600 dark:text-orange-400">
                        <Pill size={18} />
                        <h4 className="font-sans font-black text-xs uppercase tracking-wider">Farmacoterapia Padronizada no SUS / Condutas</h4>
                      </div>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                        {disease.treatment.map((tr, index) => (
                          <div key={index} className="p-4 bg-white dark:bg-slate-850 rounded-2xl border border-slate-150 dark:border-slate-700 space-y-2">
                            <span className="text-[11px] font-black text-teal-600 uppercase tracking-wide block">{tr.title}</span>
                            <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                              {tr.desc}
                            </p>
                          </div>
                        ))}
                      </div>
                    </div>

                    {/* Linked academic summaries */}
                    {(() => {
                      const matchedSummaryNames = DISEASE_TO_SUMMARY_MAP[disease.id] || [];
                      if (matchedSummaryNames.length === 0) return null;

                      // Find matching summaries in SUMMARIES
                      const matchedSummaryObjs: any[] = [];
                      SUMMARIES.forEach(cat => {
                        cat.subjects.forEach(sub => {
                          if (matchedSummaryNames.includes(sub.title)) {
                            matchedSummaryObjs.push({
                              area: cat.area,
                              title: sub.title,
                              content: sub.content
                            });
                          }
                        });
                      });

                      if (matchedSummaryObjs.length === 0) return null;

                      return (
                        <div className="space-y-4 pt-4 border-t border-slate-200/50 dark:border-slate-800/80">
                          <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
                            <BookOpen size={18} />
                            <h4 className="font-sans font-black text-xs uppercase tracking-wider">Resumo Acadêmico Completo Vinculado</h4>
                          </div>
                          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                            {matchedSummaryObjs.map((s, sIdx) => (
                              <button
                                key={sIdx}
                                onClick={() => setSelectedLinkedSummary(s)}
                                className="flex items-center justify-between p-3.5 bg-purple-500/5 dark:bg-purple-500/10 border border-purple-200 dark:border-purple-800/60 rounded-xl hover:bg-purple-500/10 transition-colors text-left group"
                              >
                                <div className="space-y-0.5 max-w-[85%]">
                                  <span className="text-[8px] font-black uppercase text-purple-600 dark:text-purple-400 block tracking-widest">{s.area}</span>
                                  <span className="text-xs font-bold text-slate-800 dark:text-slate-100 group-hover:text-purple-750 dark:group-hover:text-purple-300 transition-colors line-clamp-1">{s.title}</span>
                                </div>
                                <ChevronRight className="text-purple-400 group-hover:translate-x-0.5 transition-transform" size={16} />
                              </button>
                            ))}
                          </div>
                        </div>
                      );
                    })()}

                    {/* Interactive Calculator Block - If present */}
                    {disease.interactiveType && (
                      <div className="mt-8 pt-6 border-t border-slate-100 dark:border-slate-700 space-y-5">
                        <div className="flex items-center gap-2.5 text-purple-600 dark:text-purple-400">
                          <Calculator size={18} />
                          <h4 className="font-sans font-black text-xs uppercase tracking-wider">Calculador Clínico Interativo</h4>
                        </div>

                        {/* calculator: Levotiroxina */}
                        {disease.interactiveType === 'hypothyroid' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Preencha os Parâmetros Clínicos para Ajuste Posológico:</p>
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="space-y-2">
                                <label className="text-xs font-black text-slate-700 dark:text-slate-300 block">Peso Corporal Real: <span className="text-teal-600 font-mono text-sm">{hypoWeight} kg</span></label>
                                <input
                                  type="range"
                                  min="30"
                                  max="150"
                                  value={hypoWeight}
                                  onChange={(e) => setHypoWeight(parseInt(e.target.value))}
                                  className="w-full h-1.5 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer accent-teal-600"
                                />
                              </div>

                              <div className="flex items-center">
                                <button
                                  onClick={() => setHypoElderly(!hypoElderly)}
                                  className={`w-full p-3.5 rounded-xl border font-bold text-xs text-left leading-snug transition-all flex items-center gap-3 ${
                                    hypoElderly
                                      ? 'bg-purple-500/10 border-purple-500/50 text-purple-700 dark:text-purple-400 font-black'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  <div className={`w-4 h-4 rounded-md border flex items-center justify-center text-white text-[10px] ${hypoElderly ? 'bg-purple-600 border-purple-600' : 'border-slate-350'}`}>
                                    {hypoElderly && "✓"}
                                  </div>
                                  <div>
                                    <span className="block text-xs font-black font-sans">Paciente Idoso ou Cardiopata Grave?</span>
                                    <span className="text-[10px] text-slate-400 font-normal leading-relaxed block">Requer dose inicial muito reduzida</span>
                                  </div>
                                </button>
                              </div>
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 text-center space-y-1.5 font-medium">
                              <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Dose Inicial Recomendada no SUS:</span>
                              <p className="text-3xl font-serif italic font-black text-purple-700 dark:text-purple-400">
                                {hypoElderly ? '12.5 mcg a 25 mcg ao dia' : `${Math.round(hypoWeight * 1.6)} mcg ao dia`}
                              </p>
                              <span className="text-[10px] text-slate-500 dark:text-slate-400 font-medium block leading-normal pt-1 font-sans">
                                {hypoElderly 
                                  ? 'Atenção importante: Idosos apresentando coronariopatias devem ser testados inicialmente com 12.5mcg diários, aumentando 12.5-25mcg a cada 4-6 semanas até otimização laboratorial.'
                                  : `Dose exata estimada: ${(hypoWeight * 1.6).toFixed(1)} mcg/dia. Apresentações fornecidas nas farmácias populares: Levotiroxina 12.5mcg, 25mcg, 50mcg, 75mcg, 85mcg, 100mcg ou 112mcg.`
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {/* calculator: Cholesterol */}
                        {disease.interactiveType === 'cholesterol' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Avaliação do Alvo Terapêutico e Droga do SUS:</p>
                            <span className="text-xs font-black text-slate-600 dark:text-slate-300 block">Classifique o Risco Cardiovascular Global do Paciente:</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {[
                                { id: 'baixo', label: 'Baixo Risco', desc: '< 5% escore' },
                                { id: 'medio', label: 'Risco Médio', desc: '5-10% escore' },
                                { id: 'alto', label: 'Alto Risco', desc: 'DM ou LOA' },
                                { id: 'muito_alto', label: 'Muito Alto Risco', desc: 'DAC / IAM / AVC' }
                              ].map((risk) => (
                                <button
                                  key={risk.id}
                                  onClick={() => setLipidRiskLevel(risk.id as any)}
                                  className={`p-3 text-center rounded-xl border text-xs font-black transition-all flex flex-col items-center justify-center leading-snug ${
                                    lipidRiskLevel === risk.id
                                      ? 'bg-purple-100/40 dark:bg-purple-950/20 border-purple-500 text-purple-700 dark:text-purple-400 shadow-sm'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-500 hover:bg-slate-50'
                                  }`}
                                >
                                  <span>{risk.label}</span>
                                  <span className="text-[8px] font-semibold text-slate-400 block mt-0.5">{risk.desc}</span>
                                </button>
                              ))}
                            </div>

                            <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 text-center space-y-2 font-medium">
                              <div>
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Colesterol LDL Alvo:</span>
                                <p className="text-4xl font-serif italic font-black text-purple-700 dark:text-purple-400">
                                  {lipidRiskLevel === 'baixo' && 'LDL < 130 mg/dL'}
                                  {lipidRiskLevel === 'medio' && 'LDL < 100 mg/dL'}
                                  {lipidRiskLevel === 'alto' && 'LDL < 70 mg/dL'}
                                  {lipidRiskLevel === 'muito_alto' && 'LDL < 50 mg/dL'}
                                </p>
                              </div>
                              <div className="border-t border-slate-100 dark:border-slate-800 pt-2">
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Indicação recomendada do SUS:</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-normal mt-1">
                                  {lipidRiskLevel === 'baixo' && 'Mudança Estilo Vida (MEV) por 3-6 meses. Se persistência, Sinvastatina 20mg à noite.'}
                                  {lipidRiskLevel === 'medio' && 'Controle dietético ativo + Sinvastatina 20mg a 40mg VO à noite.'}
                                  {lipidRiskLevel === 'alto' && 'Tratamento farmacológico imediato obrigatório: Sinvastatina 40mg à noite ou Atorvastatina 20mg.'}
                                  {lipidRiskLevel === 'muito_alto' && 'Tratamento de alta intensidade: Atorvastatina 45mg a 80mg VO diária (visando redução de 50%+).'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* calculator: Asthma (GINA Classification) */}
                        {disease.interactiveType === 'asma' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Avalie o Controle Clínico (Nas Últimas 4 Semanas):</p>
                            
                            <div className="space-y-2.5">
                              {[
                                { state: asthmasymptomDays, setState: setAsthmasymptomDays, label: "Sintomas diurnos ocorridos mais de 2 vezes por semana?" },
                                { state: asthmanightAwake, setState: setAsthmanightAwake, label: "Algum despertar noturno decorrente dos sintomas da asma?" },
                                { state: asthmauseResgate, setState: setAsthmauseResgate, label: "Uso de medicação de resgate (Ex: Salbutamol) mais de 2 vezes por semana?" },
                                { state: asthmalimitActivity, setState: setAsthmalimitActivity, label: "Qualquer limitação de atividades cotidianas devido à asma?" }
                              ].map((item, id) => (
                                <button
                                  key={id}
                                  onClick={() => item.setState(!item.state)}
                                  className={`w-full flex items-center justify-between p-3.5 rounded-xl border text-left font-bold transition-all ${
                                    item.state
                                      ? 'bg-purple-500/10 border-purple-500/40 text-purple-700 dark:text-purple-400'
                                      : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-600 dark:text-slate-400 hover:bg-slate-50'
                                  }`}
                                >
                                  <span className="text-xs font-bold leading-normal">{item.label}</span>
                                  <div className={`w-5 h-5 rounded-md border flex items-center justify-center text-white text-xs ${item.state ? 'bg-purple-600 border-purple-600' : 'border-slate-300'}`}>
                                    {item.state && "✓"}
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Result processing */}
                            {(() => {
                              const score = [asthmasymptomDays, asthmanightAwake, asthmauseResgate, asthmalimitActivity].filter(Boolean).length;
                              let status = "Controlada";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/25";
                              let action = "Manter o tratamento atual estável (Passo/Step atual). Fornecer plano escrito de crises de asma, manter vacinação Influenza em dia e reavaliar de 3 em 3 meses.";
                              
                              if (score >= 1 && score <= 2) {
                                status = "Parcialmente Controlada";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/25";
                                action = "Avaliar a técnica do inalador e a adesão do paciente. Considerar subir 1 degrau terapêutico (step-up) temporário ou definitivo por 1-3 meses para melhorar sintomas.";
                              } else if (score >= 3) {
                                status = "Não Controlada";
                                color = "text-rose-600 bg-rose-500/10 border-rose-500/25";
                                action = "Ajustar técnica inalatória. Subir degrau (step-up) no tratamento de manutenção obrigatório: otimizar dose do Corticoide Inalatório (Beclometasona ou Budesonida) ou adicionar broncodilatador de longa.";
                              }

                              return (
                                <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 space-y-3 font-medium">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block font-sans">Classificação de Controle (GINA):</span>
                                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wide border ${color}`}>{status}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Recomendação de Conduta SUS:</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                      {action}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* calculator: Fagerström nicotine test */}
                        {disease.interactiveType === 'fagerstrom' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-5">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Teste de Fagerström (Avaliação de Dependência de Nicotina):</p>
                            
                            {[
                              {
                                id: 0,
                                q: "1. Quanto tempo após acordar você fuma o primeiro cigarro?",
                                opts: [
                                  { l: "Dentro de 5 minutos", v: 3 },
                                  { l: "De 6 a 30 minutos", v: 2 },
                                  { l: "De 31 a 60 minutos", v: 1 },
                                  { l: "Após de 60 minutos", v: 0 }
                                ]
                              },
                              {
                                id: 1,
                                q: "2. Você acha difícil recusar-se a fumar em locais proibidos?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "Não", v: 0 }
                                ]
                              },
                              {
                                id: 2,
                                q: "3. Qual é o cigarro do dia que traz mais satisfação e é mais difícil de largar?",
                                opts: [
                                  { l: "O primeiro da manhã (logo ao acordar)", v: 1 },
                                  { l: "Qualquer outro cigarro ao longo do dia", v: 0 }
                                ]
                              },
                              {
                                id: 3,
                                q: "4. Quantos cigarros você fuma por dia?",
                                opts: [
                                  { l: "31 ou mais cigarros diariamente", v: 3 },
                                  { l: "De 21 a 30 cigarros diariamente", v: 2 },
                                  { l: "De 11 a 20 cigarros diariamente", v: 1 },
                                  { l: "10 ou menos cigarros diariamente", v: 0 }
                                ]
                              },
                              {
                                id: 4,
                                q: "5. Você fuma mais frequentemente pela manhã do que no resto do dia?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "Não", v: 0 }
                                ]
                              },
                              {
                                id: 5,
                                q: "6. Você fuma mesmo se estiver tão doente a ponto de ficar de cama?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "Não", v: 0 }
                                ]
                              }
                            ].map((question) => (
                              <div key={question.id} className="space-y-2">
                                <span className="text-xs font-bold text-slate-700 dark:text-slate-300 block leading-relaxed">{question.q}</span>
                                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                                  {question.opts.map((opt, i) => (
                                    <button
                                      key={i}
                                      onClick={() => {
                                        const copy = [...fagerstromAnswers];
                                        copy[question.id] = opt.v;
                                        setFagerstromAnswers(copy);
                                      }}
                                      className={`p-2.5 rounded-xl border text-[11px] font-semibold transition-all leading-normal text-center ${
                                        fagerstromAnswers[question.id] === opt.v
                                          ? 'bg-purple-100/40 dark:bg-purple-950/20 border-purple-500 text-purple-700 dark:text-purple-400 font-extrabold'
                                          : 'bg-white dark:bg-slate-800 border-slate-200 text-slate-550 hover:bg-slate-50'
                                      }`}
                                    >
                                      {opt.l} <span className="block text-[8px] font-mono opacity-60 font-bold">+{opt.v} pt</span>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            ))}

                            {/* Fagertrom Results analysis */}
                            {(() => {
                              const complete = fagerstromAnswers.every(ans => ans >= 0);
                              const totalPoints = fagerstromAnswers.reduce((a, b) => a + (b >= 0 ? b : 0), 0);
                              
                              if (!complete) {
                                return (
                                  <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-dashed border-slate-250 text-center text-[11px] text-slate-400 font-extrabold uppercase tracking-wide">
                                    Responda as 6 perguntas acima para calcular a dependência à nicotina e a diretriz de medicação.
                                  </div>
                                );
                              }

                              let level = "Dependência Muito Baixa";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
                              let guide = "Tratamento focado na abordagem cognitivo-comportamental em reuniões/consultas na UBS. Geralmente não é exigido o uso de fármacos transdérmicos ou orais de apoio.";

                              if (totalPoints >= 3 && totalPoints <= 4) {
                                level = "Dependência Baixa";
                                color = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
                                guide = "Medidas comportamentais ativas, fornecer panfletos informativos. Avaliar goma ou pastilhas de nicotina de 2mg se houver relatos de fissuras difíceis.";
                              } else if (totalPoints === 5) {
                                level = "Dependência Média";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/20";
                                guide = "Indicação de apoio farmacológico em associação à terapia comportamental. Fornecer Goma de Nicotina 2mg SOS e considerar adesivos transdérmicos leves (14mg ou 7mg).";
                              } else if (totalPoints >= 6 && totalPoints <= 7) {
                                level = "Dependência Alta";
                                color = "text-rose-600 bg-rose-500/15 border-rose-500/20";
                                guide = "Indicação formal de Terapia de Reposição de Nicotina (adesivos transdérmicos de 21mg, decrescendo a dose após 4-6 semanas) e/ou Bupropiona 150mg VO ao dia (com acréscimo para 12/12h após 3 dias, evitando se epilepsia).";
                              } else if (totalPoints >= 8) {
                                level = "Dependência Muito Alta";
                                color = "text-red-650 bg-red-500/20 border-red-500/20";
                                guide = "Indicação urgente de terapia combinada máxima: Adesivo de Nicotina 21mg transdérmico diário + Bupropiona 150mg de 12/12h + Goma/Pastilha de Nicotina 2mg nas fissuras para abrandamento imediato. Cuidadosa reavaliação médica semanal de tolerabilidade e FC.";
                              }

                              return (
                                <div className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total de Pontos Fagerström:</span>
                                      <span className="text-3xl font-serif italic font-black text-teal-600">{totalPoints} / 10 pontos</span>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide border ${color}`}>{level}</span>
                                  </div>
                                  <div className="space-y-1.5 leading-relaxed font-medium">
                                    <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Diretriz Governamental de Fármacos SUS:</span>
                                    <p className="text-xs text-slate-655 dark:text-slate-300 font-semibold font-sans">{guide}</p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* calculator: Dengue class (MS Guidelines) */}
                        {disease.interactiveType === 'dengue' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-850 space-y-5">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Classificação Estatutária de Risco do Ministério da Saúde:</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 space-y-3">
                                <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider block border-b border-slate-50 pb-1.5">1. Sinais de Alarme</span>
                                <div className="space-y-2">
                                  {[
                                    { id: 'dorAbdomen', label: 'Dor abdominal intensa e contínua' },
                                    { id: 'vomito', label: 'Vômitos persistentes (frequentes)' },
                                    { id: 'sangramento', label: 'Sangramento de mucosas (epistaxe/gengivorragia)' },
                                    { id: 'letargia', label: 'Irritabilidade, sonolência ou letargia' },
                                    { id: 'acumulo', label: 'Acúmulo de líquidos (derrame pleural, ascite)' }
                                  ].map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        const exists = dengueSigaAlarms.includes(item.id);
                                        setDengueSigaAlarms(exists ? dengueSigaAlarms.filter(a => a !== item.id) : [...dengueSigaAlarms, item.id]);
                                      }}
                                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                                        dengueSigaAlarms.includes(item.id)
                                          ? 'bg-rose-50 dark:bg-rose-950/20 border-rose-450 text-rose-700'
                                          : 'bg-white dark:bg-slate-850 border-slate-150 text-slate-500'
                                      }`}
                                    >
                                      <span className="text-[10px] font-bold leading-normal font-sans">{item.label}</span>
                                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] text-white ${dengueSigaAlarms.includes(item.id) ? 'bg-rose-600' : 'border border-slate-350'}`}>
                                        {dengueSigaAlarms.includes(item.id) && "✓"}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 space-y-3">
                                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block border-b border-slate-50 pb-1.5">2. Choque e Gravidade</span>
                                <div className="space-y-2">
                                  {[
                                    { id: 'sinalChoque', label: 'Hipotensão, pulso débil ou filiforme' },
                                    { id: 'tempoCapilar', label: 'Enchimento capilar lentificado (> 2 segundos)' },
                                    { id: 'sangramentoGrave', label: 'Hemorragias graves (gastrintestinal/hematúria)' },
                                    { id: 'insuficienciaOrgaos', label: 'Danos hepático grave, alteração neurológica' }
                                  ].map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        const exists = dengueSigaGravity.includes(item.id);
                                        setDengueSigaGravity(exists ? dengueSigaGravity.filter(g => g !== item.id) : [...dengueSigaGravity, item.id]);
                                      }}
                                      className={`w-full flex items-center justify-between p-2 rounded-lg border text-left transition-all ${
                                        dengueSigaGravity.includes(item.id)
                                          ? 'bg-red-50 dark:bg-red-950/20 border-red-500 text-red-750'
                                          : 'bg-white dark:bg-slate-850 border-slate-155 text-slate-500'
                                      }`}
                                    >
                                      <span className="text-[10px] font-bold leading-normal font-sans">{item.label}</span>
                                      <div className={`w-3.5 h-3.5 rounded flex items-center justify-center text-[10px] text-white ${dengueSigaGravity.includes(item.id) ? 'bg-red-600' : 'border border-slate-350'}`}>
                                        {dengueSigaGravity.includes(item.id) && "✓"}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>
                            </div>

                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-150 rounded-xl space-y-2.5">
                                <span className="text-xs font-extrabold text-amber-600 uppercase block tracking-wider font-sans">3. Grupos de Risco e Especiais</span>
                                <div className="grid grid-cols-2 gap-1.5">
                                  {[
                                    { id: 'idoso', label: 'Idoso > 65 anos' },
                                    { id: 'bebe', label: 'Bebê / lactente < 2a' },
                                    { id: 'gestante', label: 'Gestante ativa' },
                                    { id: 'comorbidade', label: 'HAS, DM, DRC, ICC' }
                                  ].map((item) => (
                                    <button
                                      key={item.id}
                                      onClick={() => {
                                        const exists = dengueSigaRisk.includes(item.id);
                                        setDengueSigaRisk(exists ? dengueSigaRisk.filter(r => r !== item.id) : [...dengueSigaRisk, item.id]);
                                      }}
                                      className={`p-2 rounded-lg border text-center transition-all text-[9.5px] font-bold ${
                                        dengueSigaRisk.includes(item.id)
                                          ? 'bg-amber-50 dark:bg-amber-950/20 border-amber-500 text-amber-700'
                                          : 'bg-white dark:bg-slate-850 border-slate-150 text-slate-500'
                                      }`}
                                    >
                                      {item.label}
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 border border-slate-150 rounded-xl flex flex-col justify-center space-y-3">
                                <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase block tracking-wider font-sans">4. Triagem Clínico-Laboratorial</span>
                                <button
                                  onClick={() => {
                                    const exists = dengueSigaRisk.includes('laco');
                                    setDengueSigaRisk(exists ? dengueSigaRisk.filter(r => r !== 'laco') : [...dengueSigaRisk, 'laco']);
                                  }}
                                  className={`w-full flex items-center justify-between p-3 rounded-xl border text-left font-bold transition-all ${
                                    dengueSigaRisk.includes('laco')
                                      ? 'bg-purple-10/50 dark:bg-purple-950/25 border-purple-500/50 text-purple-700'
                                      : 'bg-white dark:bg-slate-850 border-slate-150 text-slate-500'
                                  }`}
                                >
                                  <div>
                                    <span className="block text-xs font-bold leading-none font-sans">Prova do Laço Positiva?</span>
                                    <span className="text-[9px] text-slate-400 font-normal mt-0.5 block italic leading-none font-sans">Presença de petéquias na área demarcada</span>
                                  </div>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center text-white text-xs ${dengueSigaRisk.includes('laco') ? 'bg-purple-600' : 'border border-slate-300'}`}>
                                    {dengueSigaRisk.includes('laco') && "✓"}
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Risk computation result */}
                            {(() => {
                              let group = "GRUPO A (Tratamento Domiciliar)";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/25 font-bold";
                              let action = "Prescrever reposição hídrica de 60 ml/kg/dia (sendo 1/3 do volume com sais de reidratação oral SRO e 2/3 com líquidos caseiros: água, chá, água de coco, sucos). Sintomáticos (Dipirona ou Paracetamol) de 6/6h. Retorno imediato na presença de sinais de alarme. Proibições: AAS, Ibuprofeno, Nimesulida.";

                              if (dengueSigaGravity.length > 0) {
                                group = "GRUPO D (Choque e Gravidade)";
                                color = "text-red-650 bg-red-500/15 border-red-500/25 font-black";
                                action = "Emergência clínica grave! Internação imediata em leito UTI ou enfermaria monitorizada. Estabelecer acesso venoso calibroso imediato e infundir expansor plasmático cristaloide aquecido: 20 mL/kg em até 20 minutos. Retestar FC e PA. Transferência monitorizada via equipe móvel e repetição conforme parâmetros.";
                              } else if (dengueSigaAlarms.length > 0) {
                                group = "GRUPO C (Sinais de Alarme - Urgência)";
                                color = "text-rose-600 bg-rose-500/10 border-rose-500/25 font-bold";
                                action = "Internação em leito de observação clínica/permanência UBS ou UPA. Fornecer de pronto hidratação endovenosa rápida: 10 mL/kg de Soro Fisiológico (SF 0,9%) ou Ringer Lactato (RL) em 1 hora. Reavaliar. Se sem melhora, continuar 25 mL/kg nas próximas 4 horas. Monitorar hematócrito urgentemente.";
                              } else if (dengueSigaRisk.length > 0) {
                                group = "GRUPO B (Investigação Célula de Risco/Prova Laço +)";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/25 font-bold";
                                action = "Solicitar Hemograma completo urgente (com prioridade). O paciente deve permanecer na UBS ingerindo líquidos (reidratação precoce assistida) até o resultado do hematócrito para verificar grau de hemoconcentração. Se Ht normal, dar alta para grupo A; se Ht alterado, reavaliar para internamento.";
                              }

                              return (
                                <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 space-y-3 font-medium">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-black text-slate-400 tracking-widest block font-sans">Classificação de Risco (Dengue):</span>
                                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wide border ${color}`}>{group}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Passo a Passo de Condutas e Hidratação:</span>
                                    <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
                                      • <strong className="text-rose-600 font-bold">ALERTA</strong>: {action}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                );
              })()}
            </div>
          </div>
        </div>
      )}

      {/* Linked Academic Summary Modal */}
      <AnimatePresence>
        {selectedLinkedSummary && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedLinkedSummary(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-2xl h-full md:h-auto max-h-[95vh] md:max-h-[80vh] overflow-hidden rounded-t-[40px] md:rounded-[40px] shadow-2xl relative z-10 flex flex-col border border-slate-200 dark:border-slate-700"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between bg-slate-50 dark:bg-slate-900/50">
                <div>
                    <span className="text-[8px] font-black uppercase tracking-[0.2em] text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 rounded">{selectedLinkedSummary.area}</span>
                    <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight mt-1">{selectedLinkedSummary.title}</h3>
                </div>
                <button onClick={() => setSelectedLinkedSummary(null)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:rotate-90 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                {selectedLinkedSummary.content.split('\n').map((line, lIdx) => {
                  if (line.includes(': ')) {
                    const [label, text] = line.split(': ');
                    return (
                      <div key={lIdx} className="space-y-1">
                        <span className="inline-block px-2 py-0.5 bg-purple-500/10 text-purple-600 text-[9px] font-black uppercase tracking-wider rounded">
                          {label.replace('• ', '')}
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs font-semibold">{text}</p>
                      </div>
                    )
                  }
                  return <p key={lIdx} className="text-slate-600 dark:text-slate-300 leading-relaxed text-xs">{line}</p>
                })}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                 <button 
                   onClick={() => setSelectedLinkedSummary(null)}
                   className="px-8 py-3 bg-purple-600 text-white rounded-2xl font-bold text-sm shadow-lg shadow-purple-600/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   Fechar Guia
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>

    </div>
  );
}

function LabModule() {
  const labValues = [
    { category: 'Bioquímica e Eletrólitos', values: [
      { name: 'Sódio (Na+)', range: '135 - 145 mEq/L', notes: 'Hiper/Hiponatremia.' },
      { name: 'Potássio (K+)', range: '3.5 - 5.0 mEq/L', notes: 'Risco de arritmias se < 2.5 ou > 6.0.' },
      { name: 'Creatinina', range: '0.7 - 1.3 mg/dL', notes: 'Usar para ClCr.' },
      { name: 'Ureia', range: '15 - 45 mg/dL', notes: 'Proporção U/Cr > 40 sugerere pré-renal.' },
      { name: 'Magnésio', range: '1.7 - 2.2 mg/dL', notes: 'Manter > 2.0 em cardiopatas.' },
      { name: 'Cálcio Iônico', range: '1.16 - 1.32 mmol/L', notes: 'Corrigir se albumina baixa.' }
    ]},
    { category: 'Hemograma', values: [
      { name: 'Hemoglobina (Hb)', range: '13.5 - 17.5 (M) / 12.0 - 15.5 (F) g/dL', notes: 'Alvo transfusional geral > 7.0.' },
      { name: 'Leucócitos', range: '4.500 - 11.000 /mm³', notes: 'Avaliar desvio à esquerda.' },
      { name: 'Plaquetas', range: '150.000 - 450.000 /mm³', notes: 'Trombocitopenia < 150k.' }
    ]},
    { category: 'Gasometria Arterial', values: [
      { name: 'pH', range: '7.35 - 7.45', notes: 'Acidose < 7.35 | Alcalose > 7.45' },
      { name: 'pCO2', range: '35 - 45 mmHg', notes: 'Componente Respiratório.' },
      { name: 'HCO3 (Bicarbonato)', range: '22 - 26 mEq/L', notes: 'Componente Metabólico.' },
      { name: 'Base Excess', range: '-2 a +2', notes: 'Déficit de base se < -2.' },
      { name: 'pO2', range: '80 - 100 mmHg', notes: 'Abaixo de 60 = Insuf. Respiratória.' }
    ]}
  ];

  return (
    <div className="space-y-8">
      <SectionTitle title="Valores de Referência" subtitle="Consulta rápida de parâmetros laboratoriais e gasométricos." icon={Microscope} />
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {labValues.map((cat, idx) => (
          <div key={idx} className="bg-white dark:bg-slate-800 rounded-3xl border border-slate-200 dark:border-slate-700 overflow-hidden shadow-sm">
             <div className="bg-slate-50 dark:bg-slate-900/50 p-4 border-b border-slate-200 dark:border-slate-700">
                <h3 className="font-bold text-medical-primary uppercase text-xs tracking-widest">{cat.category}</h3>
             </div>
             <div className="p-4 divide-y divide-slate-100 dark:divide-slate-700">
                {cat.values.map((v, vIdx) => (
                  <div key={vIdx} className="py-4 space-y-1">
                     <div className="flex justify-between items-center">
                        <span className="font-bold text-slate-700 dark:text-slate-200">{v.name}</span>
                        <span className="text-sm font-mono bg-medical-primary/5 text-medical-primary px-2 py-1 rounded-lg">{v.range}</span>
                     </div>
                     <p className="text-[10px] text-slate-400 font-medium uppercase">{v.notes}</p>
                  </div>
                ))}
             </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// --- Sub-Components ---

const PrescriptionGuide = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedPrescription, setSelectedPrescription] = useState<any>(null);

  const filtered = PRESCRIPTIONS.filter(p => 
    p.title.toLowerCase().includes(searchTerm.toLowerCase()) || 
    p.category.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="space-y-6">
      <SectionTitle title="Guia de Prescrições" subtitle="Modelos estruturados de condutas para as principais patologias adultas." icon={ClipboardList} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar prescrição..." 
                className="w-full pl-12 pr-4 py-4 rounded-2xl bg-white dark:bg-slate-800 border-none shadow-lg focus:ring-2 focus:ring-medical-primary outline-none text-sm"
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
           </div>
           
           <div className="space-y-2 max-h-[500px] overflow-y-auto pr-2 custom-scrollbar">
              {filtered.map(p => (
                <button 
                  key={p.id} 
                  onClick={() => setSelectedPrescription(p)}
                  className={`w-full text-left p-4 rounded-2xl border transition-all ${selectedPrescription?.id === p.id ? 'bg-medical-primary border-medical-primary text-white shadow-lg' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-medical-primary/50'}`}
                >
                  <p className="text-[10px] font-bold uppercase opacity-60 mb-1">{p.category}</p>
                  <h4 className="font-bold text-sm leading-tight">{p.title}</h4>
                </button>
              ))}
           </div>
        </div>

        <div className="lg:col-span-2">
           {selectedPrescription ? (
             <motion.div initial={{ opacity: 0, x: 20 }} animate={{ opacity: 1, x: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl shadow-xl shadow-slate-200/50 dark:shadow-none border border-slate-200 dark:border-slate-700 h-fit">
                <div className="flex justify-between items-start mb-6">
                   <div>
                     <span className="bg-medical-secondary/10 text-medical-secondary text-[10px] font-bold px-3 py-1 rounded-full uppercase tracking-widest">{selectedPrescription.category}</span>
                     <h3 className="text-2xl font-bold mt-2 dark:text-white">{selectedPrescription.title}</h3>
                   </div>
                   <button 
                     onClick={() => {
                       const text = `${selectedPrescription.title}\n\n${selectedPrescription.items.join('\n')}`;
                       navigator.clipboard.writeText(text);
                       alert('Copiado!');
                     }}
                     className="p-3 bg-slate-100 dark:bg-slate-700 rounded-xl hover:bg-medical-primary hover:text-white transition-colors"
                   >
                      <ClipboardList size={20} />
                   </button>
                </div>

                <div className="bg-slate-50 dark:bg-slate-900/50 rounded-2xl p-6 mb-6 space-y-3 font-mono text-sm border-l-4 border-medical-primary">
                    {selectedPrescription.items.map((item: string, i: number) => (
                      <p key={i} className="flex items-start gap-3">
                         <span className="text-slate-400 mt-1">{i + 1}.</span>
                         <span>{item}</span>
                      </p>
                    ))}
                </div>

                <div className="flex items-start gap-4 p-4 bg-amber-500/10 rounded-2xl border border-amber-500/20">
                   <AlertTriangle className="text-amber-500 shrink-0" size={24} />
                   <div>
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">Observações e Alertas</p>
                      <p className="text-sm italic text-slate-700 dark:text-slate-300">{selectedPrescription.guidelines}</p>
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                <ClipboardList size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Selecione uma prescrição ao lado para visualizar os detalhes.</p>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}

const SummaryModule = () => {
  const [selectedSubject, setSelectedSubject] = useState<{title: string, content: string} | null>(null);

  return (
    <div className="space-y-8">
      <SectionTitle title="Resumos Médicos" subtitle="Biblioteca de conteúdos aprofundados para estudo e consulta rápida." icon={BookOpen} />
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {SUMMARIES.map((category, idx) => (
          <div key={idx} className="space-y-4">
             <h3 className="text-sm font-bold uppercase tracking-widest text-medical-primary flex items-center gap-2 mb-4">
                <Bookmark size={16} /> {category.area}
             </h3>
             <div className="grid gap-3">
                {category.subjects.map((sub, sIdx) => (
                  <motion.button 
                    key={sIdx}
                    whileHover={{ x: 5 }}
                    onClick={() => setSelectedSubject(sub)}
                    className="bg-white dark:bg-slate-800 p-5 rounded-2xl border border-slate-200 dark:border-slate-700 shadow-sm text-left flex items-center justify-between group hover:border-medical-primary transition-all"
                  >
                    <div>
                      <h4 className="font-bold text-slate-800 dark:text-white group-hover:text-medical-primary transition-colors">{sub.title}</h4>
                      <p className="text-xs text-slate-400 mt-1 line-clamp-1">Toque para ver detalhes completos</p>
                    </div>
                    <ChevronRight size={18} className="text-slate-300 group-hover:text-medical-primary transition-colors" />
                  </motion.button>
                ))}
             </div>
          </div>
        ))}
      </div>

      <AnimatePresence>
        {selectedSubject && (
          <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
            <motion.div 
              initial={{ opacity: 0 }} 
              animate={{ opacity: 1 }} 
              exit={{ opacity: 0 }}
              onClick={() => setSelectedSubject(null)}
              className="absolute inset-0 bg-slate-900/60 backdrop-blur-md" 
            />
            <motion.div 
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-white dark:bg-slate-800 w-full max-w-2xl h-full md:h-auto max-h-[95vh] md:max-h-[80vh] overflow-hidden rounded-t-[40px] md:rounded-[40px] shadow-2xl relative z-10 flex flex-col"
            >
              <div className="p-6 md:p-8 border-b border-slate-100 dark:border-slate-700 flex items-center justify-between">
                <div>
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-medical-primary">Protocolo Clínico</span>
                   <h3 className="text-xl md:text-2xl font-serif font-bold text-slate-900 dark:text-white tracking-tight">{selectedSubject.title}</h3>
                </div>
                <button onClick={() => setSelectedSubject(null)} className="p-3 bg-slate-100 dark:bg-slate-700 rounded-2xl hover:rotate-90 transition-transform">
                  <X size={20} />
                </button>
              </div>

              <div className="p-6 md:p-8 overflow-y-auto space-y-6">
                {selectedSubject.content.split('\n').map((line, lIdx) => {
                  if (line.includes(': ')) {
                    const [label, text] = line.split(': ');
                    return (
                      <div key={lIdx} className="space-y-2">
                        <span className="inline-block px-3 py-1 bg-medical-primary/10 text-medical-primary text-[10px] font-black uppercase tracking-widest rounded-lg">
                          {label.replace('• ', '')}
                        </span>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{text}</p>
                      </div>
                    )
                  }
                  return <p key={lIdx} className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm">{line}</p>
                })}
              </div>

              <div className="p-6 bg-slate-50 dark:bg-slate-900 border-t border-slate-100 dark:border-slate-700 flex justify-center">
                 <button 
                   onClick={() => setSelectedSubject(null)}
                   className="px-8 py-3 bg-medical-primary text-white rounded-2xl font-bold text-sm shadow-lg shadow-medical-primary/20 hover:scale-105 active:scale-95 transition-all"
                 >
                   Entendido
                 </button>
              </div>
            </motion.div>
          </div>
        )}
      </AnimatePresence>
    </div>
  );
}

const SectionTitle = ({ title, subtitle, icon: Icon }: { title: string; subtitle?: string; icon: any }) => (
  <div className="flex items-center gap-4 mb-8">
    <div className="bg-medical-primary text-white p-3 rounded-2xl shadow-lg shadow-medical-primary/20">
      <Icon size={24} />
    </div>
    <div>
      <h2 className="text-2xl font-serif font-black text-slate-800 dark:text-white tracking-tighter leading-none">{title}</h2>
      {subtitle && <p className="text-sm text-slate-500 dark:text-slate-400 mt-1">{subtitle}</p>}
    </div>
  </div>
);

// --- Modules ---

function Dashboard({ 
  setActiveSection, 
  addToHistory, 
  setSelectedDisease,
  setSelectedUbsDiseaseId,
  setSelectedUbsSubTab
}: { 
  setActiveSection: (s: AppSection) => void; 
  addToHistory: (t: string, r: string) => void; 
  setSelectedDisease: (d: typeof PRESCRIPTIONS[0]) => void;
  setSelectedUbsDiseaseId: (id: string) => void;
  setSelectedUbsSubTab: (tab: 'cronicos' | 'mulher' | 'mental' | 'condutas' | 'guia') => void;
}) {
  const [globalSearch, setGlobalSearch] = useState('');

  // 1. Filter Prescriptions (Emergency Protocols)
  const filteredPrescriptions = PRESCRIPTIONS.filter(p => 
    p.title.toLowerCase().includes(globalSearch.toLowerCase()) || 
    p.items.join(' ').toLowerCase().includes(globalSearch.toLowerCase()) ||
    p.category.toLowerCase().includes(globalSearch.toLowerCase())
  );

  // 2. Filter UBS & UPA Catalog Diseases
  const filteredUbsDiseases = UBS_CATALOG_DISEASES.filter(d =>
    d.name.toLowerCase().includes(globalSearch.toLowerCase()) ||
    d.category.toLowerCase().includes(globalSearch.toLowerCase()) ||
    d.diagnostic.toLowerCase().includes(globalSearch.toLowerCase()) ||
    d.alarm.toLowerCase().includes(globalSearch.toLowerCase()) ||
    d.treatment.some(t => t.title.toLowerCase().includes(globalSearch.toLowerCase()) || t.desc.toLowerCase().includes(globalSearch.toLowerCase()))
  );

  // 3. Filter Medications
  const filteredMedications = MEDICATIONS.filter(m => 
    m.name.toLowerCase().includes(globalSearch.toLowerCase()) || 
    m.indication.toLowerCase().includes(globalSearch.toLowerCase()) ||
    m.category.toLowerCase().includes(globalSearch.toLowerCase())
  );

  // 4. Filter Summaries
  const filteredSummaries: any[] = [];
  SUMMARIES.forEach(cat => {
    cat.subjects.forEach(sub => {
      if (
        sub.title.toLowerCase().includes(globalSearch.toLowerCase()) ||
        sub.content.toLowerCase().includes(globalSearch.toLowerCase()) ||
        cat.area.toLowerCase().includes(globalSearch.toLowerCase())
      ) {
        filteredSummaries.push({
          area: cat.area,
          title: sub.title,
          content: sub.content,
          subject: sub
        });
      }
    });
  });

  const hasResults = filteredPrescriptions.length > 0 || 
                     filteredUbsDiseases.length > 0 || 
                     filteredMedications.length > 0 || 
                     filteredSummaries.length > 0;

  return (
    <div className="space-y-8">
      {/* Hero */}
      <div className="bg-gradient-to-br from-rose-600 via-slate-800 to-slate-900 rounded-[40px] p-8 md:p-12 text-white relative overflow-hidden shadow-2xl">
        <div className="relative z-10 grid md:grid-cols-2 gap-8 items-center">
          <div className="space-y-6">
            <div className="inline-flex items-center gap-2 bg-white/10 px-3 py-1 rounded-full border border-white/10 backdrop-blur-sm">
              <Zap size={14} className="text-amber-400" />
              <span className="text-[10px] font-bold uppercase tracking-widest text-white/90">Protocolos Atualizados 2026.1</span>
            </div>
            <h1 className="text-5xl md:text-6xl font-serif italic font-black leading-[0.9] tracking-tighter">
              Pedsocorro: <br /> <span className="text-rose-500">Agilidade & Segurança.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm font-medium">
              Apoio à decisão clínica para o pronto socorro e atenção básica com protocolos baseados em evidência.
            </p>
            <div className="flex flex-wrap gap-4">
              <button 
                onClick={() => setActiveSection('emergency')}
                className="bg-rose-600 text-white px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2 shadow-lg shadow-rose-600/20"
              >
                Pronto Socorro <ShieldAlert size={18} />
              </button>
              <button 
                onClick={() => setActiveSection('drugs')}
                className="bg-white/10 text-white border border-white/20 backdrop-blur-md px-8 py-4 rounded-2xl font-bold hover:scale-105 transition-transform flex items-center gap-2"
              >
                Bulário Rápido <ChevronRight size={18} />
              </button>
            </div>
          </div>
          <div className="hidden md:flex justify-end">
             <div className="relative w-72 h-72 border-4 border-white/5 rounded-full flex items-center justify-center">
                <div className="absolute inset-0 bg-rose-500/20 blur-[100px] animate-pulse" />
                <ShieldCheck size={180} strokeWidth={1} className="text-white/20 relative animate-float" />
             </div>
          </div>
        </div>
      </div>
      {/* Search */}
        <div className="relative group">
           <Search className="absolute left-6 top-1/2 -translate-y-1/2 text-slate-400 group-focus-within:text-rose-600 transition-colors" size={24} />
           <input 
             type="text" 
             placeholder="Pesquisar protocolos, enfermidades, medicamentos ou resumos..." 
             value={globalSearch}
             onChange={(e) => setGlobalSearch(e.target.value)}
             className="w-full h-18 bg-white dark:bg-slate-800 rounded-[30px] pl-16 pr-6 shadow-sm border-2 border-slate-200 dark:border-slate-700 focus:ring-4 focus:ring-rose-500/10 focus:border-rose-500 outline-none dark:text-white transition-all font-medium font-sans"
           />
           {globalSearch && (
             <button 
               onClick={() => setGlobalSearch('')}
               className="absolute right-6 top-1/2 -translate-y-1/2 text-slate-400 hover:text-slate-600 dark:text-slate-500"
             >
               <XCircle size={24} />
             </button>
           )}
        </div>

        {/* Global Search Results */}
        {globalSearch && (
          <motion.div initial={{ opacity: 0, scale: 0.98 }} animate={{ opacity: 1, scale: 1 }} className="bg-white dark:bg-slate-800 rounded-[40px] border border-slate-200 dark:border-slate-700 p-8 shadow-2xl space-y-8">
            <h3 className="font-black text-slate-400 uppercase text-[10px] tracking-widest flex items-center gap-2">
              <Search size={14} /> Resultados para "{globalSearch}"
            </h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* UBS & UPA Diseases */}
              {filteredUbsDiseases.slice(0, 6).map(d => (
                <button 
                  key={d.id} 
                  onClick={() => { 
                    setSelectedUbsSubTab('guia');
                    setSelectedUbsDiseaseId(d.id); 
                    setActiveSection('ubs'); 
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-teal-500/5 hover:border-teal-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Legenda: Doença UBS / UPA 🏥
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase italic font-serif leading-snug">{d.name}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{d.diagnostic}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Protocolo Amambulatorial <ChevronRight size={10} />
                  </div>
                </button>
              ))}

              {/* Emergency Protocols */}
              {filteredPrescriptions.slice(0, 6).map(p => (
                <button 
                  key={p.id} 
                  onClick={() => { 
                    setSelectedDisease(p); 
                    setActiveSection('prescriptions'); 
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-rose-500/5 hover:border-rose-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Legenda: Protocolo PS / Emergência 🚨
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors uppercase italic font-serif leading-snug">{p.title}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{p.guidelines || 'Ficha clínica de internação e terapia farmacológica rápida.'}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Prontuário Rápido <ChevronRight size={10} />
                  </div>
                </button>
              ))}

              {/* Medications */}
              {filteredMedications.slice(0, 6).map(m => (
                <button 
                  key={m.id} 
                  onClick={() => { 
                    setActiveSection('drugs'); 
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-emerald-500/5 hover:border-emerald-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-emerald-600 dark:text-emerald-400 bg-emerald-500/10 dark:bg-emerald-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Legenda: Bulário / Dose 💊
                      </span>
                    </div>
                    <div className="font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors uppercase italic font-serif leading-snug">{m.name}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{m.indication || 'Indicação e ajuste de função renal.'}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Posologia <ChevronRight size={10} />
                  </div>
                </button>
              ))}

              {/* Summaries */}
              {filteredSummaries.slice(0, 6).map((s, sIdx) => (
                <button 
                  key={sIdx} 
                  onClick={() => { 
                    setActiveSection('summaries'); 
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-purple-500/5 hover:border-purple-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-purple-600 dark:text-purple-400 bg-purple-500/10 dark:bg-purple-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Legenda: Resumo Acadêmico 📚
                      </span>
                    </div>
                    <div className="font-bold text-purple-600 group-hover:text-purple-700 transition-colors uppercase italic font-serif leading-snug">{s.title}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-1 leading-relaxed font-sans font-medium">{s.area}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Tópico de Estudo <ChevronRight size={10} />
                  </div>
                </button>
              ))}
            </div>

            {!hasResults && (
              <div className="text-center py-16 text-slate-400">
                <Search size={48} className="mx-auto mb-4 opacity-10" />
                <p className="font-bold uppercase tracking-widest text-xs font-sans">Nenhum resultado encontrado.</p>
              </div>
            )}
            
            <div className="pt-6 border-t border-slate-100 dark:border-slate-700 flex justify-center">
              <button onClick={() => setGlobalSearch('')} className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 hover:text-rose-600 transition-colors font-sans">
                Limpar Busca
              </button>
            </div>
          </motion.div>
        )}

      {/* Grid Menu */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        {[
          { id: 'ubs', title: 'Atenção Básica & UBS', desc: 'Preventivos, cronograma de pré-natal, rastreamentos, saúde mental PHQ-9/GAD-7 e HAS/DM.', icon: Stethoscope, color: 'bg-teal-600 animate-pulse' },
          { id: 'drugs', title: 'Calculadora de Doses', desc: 'Doses por peso, função renal e perfusão contínua.', icon: Pill, color: 'bg-emerald-500' },
          { id: 'calculators', title: 'Calculadoras & Scores', desc: 'ClCr, CURB-65, qSOFA, Glasgow e outros.', icon: Calculator, color: 'bg-blue-500' },
          { id: 'flowcharts', title: 'Fluxogramas Clínicos', desc: 'Diretrizes interativas para emergência e UTI.', icon: Activity, color: 'bg-rose-500' },
          { id: 'prescriptions', title: 'Guia de Prescrição', desc: 'Modelos prontos para patologias comuns.', icon: FileText, color: 'bg-amber-500' },
          { id: 'summaries', title: 'Resumos Médicos', desc: 'Resumos de diretrizes, matérias e condutas.', icon: BookOpen, color: 'bg-purple-500' },
          { id: 'lab', title: 'Valores Laboratoriais', desc: 'Valores de referência para exames e gasometria.', icon: Microscope, color: 'bg-cyan-500' },
          { id: 'history', title: 'Histórico Recente', desc: 'Acesse cálculos recentes guardados localmente.', icon: History, color: 'bg-indigo-500' },
        ].map((item) => (
          <button 
            key={item.id}
            onClick={() => setActiveSection(item.id as AppSection)}
            className="group p-6 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl text-left hover:border-medical-primary transition-all hover:shadow-xl hover:shadow-medical-primary/10 relative overflow-hidden"
          >
            <div className={`${item.color} w-12 h-12 rounded-2xl flex items-center justify-center text-white mb-4 group-hover:scale-110 transition-transform`}>
              <item.icon size={22} />
            </div>
            <h3 className="font-bold text-lg text-slate-800 dark:text-slate-100 group-hover:text-medical-primary transition-colors">{item.title}</h3>
            <p className="text-sm text-slate-500 dark:text-slate-400 mt-2 leading-relaxed">{item.desc}</p>
            <div className="absolute top-4 right-4 text-slate-200 dark:text-slate-700 opacity-0 group-hover:opacity-100 transition-opacity">
              <ArrowRight size={24} />
            </div>
          </button>
        ))}
      </div>
    </div>
  );
}

function DrugsModule() {
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [weight, setWeight] = useState('');
  const [favorites, setFavorites] = useState<string[]>(() => {
    const saved = localStorage.getItem('med_favorites');
    return saved ? JSON.parse(saved) : [];
  });

  const toggleFavorite = (id: string) => {
    setFavorites(prev => {
      const next = prev.includes(id) ? prev.filter(f => f !== id) : [...prev, id];
      localStorage.setItem('med_favorites', JSON.stringify(next));
      return next;
    });
  };

  const filtered = MEDICATIONS.filter(m => m.name.toLowerCase().includes(search.toLowerCase()) || m.indication.toLowerCase().includes(search.toLowerCase()));

  // Sort favorites to the top
  const sortedMedications = [...filtered].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
      <div className="lg:col-span-4 space-y-6">
        <div className="relative">
          <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
          <input 
            type="text" 
            placeholder="Buscar medicamento..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all dark:text-white"
          />
        </div>
        <div className="space-y-2 h-[400px] lg:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
          {sortedMedications.map(med => (
            <div key={med.id} className="relative group/item">
              <div
                onClick={() => setSelectedMed(med)}
                className={`w-full p-4 text-left border rounded-2xl transition-all cursor-pointer ${
                  selectedMed?.id === med.id 
                    ? 'bg-medical-primary border-medical-primary text-white shadow-lg shadow-medical-primary/20' 
                    : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-medical-primary/50'
                }`}
              >
                <div className="flex justify-between items-start">
                  <div>
                    <div className="font-bold">{med.name}</div>
                    <div className={`text-xs opacity-70 mt-1`}>{med.indication}</div>
                  </div>
                  <button 
                    onClick={(e) => { e.stopPropagation(); toggleFavorite(med.id); }}
                    className={`p-2 rounded-lg transition-colors ${favorites.includes(med.id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'}`}
                  >
                    <Bookmark size={14} fill={favorites.includes(med.id) ? 'currentColor' : 'none'} />
                  </button>
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="lg:col-span-8">
        <AnimatePresence mode="wait">
          {selectedMed ? (
            <motion.div 
              key={selectedMed.id}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-8 space-y-8 shadow-sm"
            >
              <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                <div>
                  <div className="inline-block px-2.5 py-1 rounded-full bg-medical-primary/10 text-medical-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                    {selectedMed.category}
                  </div>
                  <h2 className="text-4xl font-serif font-black text-slate-800 dark:text-white tracking-tighter italic">
                    {selectedMed.name}
                  </h2>
                </div>
                <div className="flex items-center gap-2 bg-slate-50 dark:bg-slate-700/50 p-2 rounded-2xl border border-slate-100 dark:border-slate-600">
                  <div className="text-right px-2">
                    <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">Peso p/ Conferência</p>
                    <input 
                      type="number" 
                      value={weight}
                      onChange={(e) => setWeight(e.target.value)}
                      placeholder="70.0"
                      className="bg-transparent border-none outline-none text-xl font-mono text-medical-primary w-20 text-right"
                    />
                  </div>
                  <div className="bg-medical-primary text-white p-2 rounded-xl">
                    <Activity size={20} />
                  </div>
                </div>
              </div>

              <div className="grid md:grid-cols-2 gap-6">
                <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Dose Padrão</p>
                  <p className="text-2xl font-bold text-medical-primary leading-tight">{selectedMed.dose}</p>
                  <p className="text-sm text-slate-600 dark:text-slate-400 font-medium">{selectedMed.frequency}</p>
                </div>
                <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl space-y-2">
                  <p className="text-[10px] font-bold uppercase text-slate-400 tracking-widest">Apresentação</p>
                  <p className="text-lg font-bold text-slate-800 dark:text-white">{selectedMed.presentation}</p>
                </div>
              </div>

              {selectedMed.renalAdjustment && (
                <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl flex gap-4">
                  <AlertTriangle className="text-amber-500 flex-shrink-0" size={24} />
                  <div>
                    <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Ajuste Renal</h4>
                    <p className="text-sm text-amber-700 dark:text-amber-500/80 mt-1">{selectedMed.renalAdjustment}</p>
                  </div>
                </div>
              )}

              <div className="space-y-4">
                <div className="flex items-center gap-2 text-slate-400">
                  <ClipboardCheck size={18} />
                  <h4 className="text-xs font-bold uppercase tracking-widest">Observações Clínicas</h4>
                </div>
                <div className="bg-white dark:bg-slate-900 border border-slate-100 dark:border-slate-700 p-6 rounded-2xl text-slate-600 dark:text-slate-300 leading-relaxed italic text-sm">
                   "{selectedMed.notes}"
                </div>
              </div>
            </motion.div>
          ) : (
            <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-700 rounded-3xl py-20">
              <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
                <Microscope size={64} strokeWidth={1} />
              </div>
              <p className="text-lg font-medium">Selecione um medicamento para conferir a conduta</p>
              <p className="text-sm opacity-60">Utilize a busca rápida ao lado</p>
            </div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}

function CalculatorModule({ addToHistory }: { addToHistory: (t: string, r: string) => void }) {
  const [calc, setCalc] = useState<'clcr' | 'bmi' | 'curb' | 'qsofa' | 'glasgow' | 'wells' | 'chads' | 'hasbled' | 'meld' | 'nihss' | 'braden' | 'water' | 'sofa' | 'child' | 'ckdepi' | null>(null);

  // SOFA
  const [sofa, setSofa] = useState<Record<string, number>>({ resp: 0, plateau: 0, coagulation: 0, liver: 0, cardiovascular: 0, cns: 0, renal: 0 });
  const sofaScore = (Object.values(sofa) as number[]).reduce((a, b) => a + b, 0);

  // Child-Pugh
  const [child, setChild] = useState<Record<string, number>>({ bili: 1, alb: 1, inr: 1, ascites: 1, enceph: 1 });
  const childScore = (Object.values(child) as number[]).reduce((a, b) => a + b, 0);

  // Cockcroft-Gault
  const [age, setAge] = useState('');
  const [weight, setWeight] = useState('');
  const [creatinine, setCreatinine] = useState('');
  const [isFemale, setIsFemale] = useState(false);

  // BMI
  const [height, setHeight] = useState('');

  // CURB-65
  const [curb, setCurb] = useState({ confusion: false, urea: false, respiration: false, blood: false, age: false });
  const curbScore = Object.values(curb).filter(v => v).length;

  // qSOFA
  const [qsofa, setQsofa] = useState({ resp: false, mental: false, pressure: false });
  const qsofaScore = Object.values(qsofa).filter(v => v).length;

  // Glasgow
  const [glasgow, setGlasgow] = useState({ eyes: 4, verbal: 5, motor: 6 });
  const glasgowTotal = glasgow.eyes + glasgow.verbal + glasgow.motor;

  // Wells TEP
  const [wells, setWells] = useState({ symptoms: false, altDiagnosis: false, heartRate: false, surgery: false, previous: false, hemoptysis: false, malignancy: false });
  const wellsScore = (wells.symptoms ? 3 : 0) + (wells.altDiagnosis ? 3 : 0) + (wells.heartRate ? 1.5 : 0) + (wells.surgery ? 1.5 : 0) + (wells.previous ? 1.5 : 0) + (wells.hemoptysis ? 1 : 0) + (wells.malignancy ? 1 : 0);

  // CHADS-VASc
  const [chads, setChads] = useState({ heartFailure: false, hypertension: false, age75: false, diabetes: false, stroke: false, vascular: false, age65: false, female: false });
  const chadsScore = (chads.heartFailure ? 1 : 0) + (chads.hypertension ? 1 : 0) + (chads.age75 ? 2 : 0) + (chads.diabetes ? 1 : 0) + (chads.stroke ? 2 : 0) + (chads.vascular ? 1 : 0) + (chads.age65 ? 1 : 0) + (chads.female ? 1 : 0);

  // HAS-BLED
  const [hasbled, setHasbled] = useState({ h: false, a: false, s: false, b: false, l: false, e: false, d: false });
  const hasbledScore = Object.values(hasbled).filter(v => v).length;

  // NIHSS (Simplified)
  const [nihss, setNihss] = useState<Record<string, number>>({ state: 0, gaze: 0, visual: 0, facial: 0, motorL: 0, motorR: 0, legL: 0, legR: 0 });
  const nihssTotal = (Object.values(nihss) as number[]).reduce((a, b) => a + b, 0);

  // Braden
  const [braden, setBraden] = useState<Record<string, number>>({ sensory: 4, moisture: 4, activity: 4, mobility: 4, nutrition: 4, friction: 3 });
  const bradenScore = (Object.values(braden) as number[]).reduce((a, b) => a + b, 0);

  // MELD
  const [meldInputs, setMeldInputs] = useState({ bili: '', inr: '', cr: '' });
  const meldScore = useMemo(() => {
    const b = parseFloat(meldInputs.bili);
    const i = parseFloat(meldInputs.inr);
    const c = parseFloat(meldInputs.cr);
    if (b > 0 && i > 0 && c > 0) {
      return Math.round(10 * ((0.957 * Math.log(c)) + (0.378 * Math.log(b)) + (1.12 * Math.log(i)) + 0.643));
    }
    return 0;
  }, [meldInputs]);

  // Water Deficit (Hipernatremia)
  const [waterDeficitInputs, setWaterDeficitInputs] = useState({ na: '', weight: '', gender: 'male', ageGroup: 'adult' });
  const waterDeficitResult = useMemo(() => {
    const na = parseFloat(waterDeficitInputs.na);
    const w = parseFloat(waterDeficitInputs.weight);
    if (!na || !w || na <= 140) return 0;
    
    let tbwFactor = 0.6; // Adult male
    if (waterDeficitInputs.gender === 'female') {
      tbwFactor = waterDeficitInputs.ageGroup === 'elderly' ? 0.45 : 0.5;
    } else {
      tbwFactor = waterDeficitInputs.ageGroup === 'elderly' ? 0.5 : 0.6;
    }
    
    const deficit = tbwFactor * w * ((na / 140) - 1);
    return deficit.toFixed(2);
  }, [waterDeficitInputs]);

  const clcrResult = useMemo(() => {
    const a = parseFloat(age);
    const w = parseFloat(weight);
    const cr = parseFloat(creatinine);
    if (!a || !w || !cr) return null;
    let result = ((140 - a) * w) / (72 * cr);
    if (isFemale) result *= 0.85;
    return result.toFixed(1);
  }, [age, weight, creatinine, isFemale]);

  const bmiResult = useMemo(() => {
    const w = parseFloat(weight);
    const h = parseFloat(height) / 100;
    if (!w || !h) return null;
    return (w / (h * h)).toFixed(1);
  }, [weight, height]);

  const ckdepiResult = useMemo(() => {
    const a = parseFloat(age);
    const cr = parseFloat(creatinine);
    if (!a || !cr) return null;
    
    let k = isFemale ? 0.7 : 0.9;
    let alpha = isFemale ? -0.241 : -0.302;
    if (cr > k) alpha = -1.200;
    
    const res = 142 * Math.pow(Math.min(cr / k, 1), alpha) * Math.pow(Math.max(cr / k, 1), -1.200) * Math.pow(0.9938, a);
    return Math.round(res).toString();
  }, [age, creatinine, isFemale]);

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <button 
          onClick={() => setCalc('clcr')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'clcr' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Microscope className={`mb-4 ${calc === 'clcr' ? 'text-white' : 'text-medical-secondary'}`} size={32} />
          <h3 className="font-bold text-lg">Cockcroft-Gault</h3>
          <p className="text-xs opacity-60 mt-2">Clearance de Creatinina clássico.</p>
        </button>
        <button 
          onClick={() => setCalc('ckdepi')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'ckdepi' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Activity className={`mb-4 ${calc === 'ckdepi' ? 'text-white' : 'text-medical-primary'}`} size={32} />
          <h3 className="font-bold text-lg">CKD-EPI (2021)</h3>
          <p className="text-xs opacity-60 mt-2">Filtração Glomerular (Sem fator raça).</p>
        </button>
        <button 
          onClick={() => setCalc('bmi')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'bmi' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Activity className={`mb-4 ${calc === 'bmi' ? 'text-white' : 'text-medical-secondary'}`} size={32} />
          <h3 className="font-bold text-lg">IMC & Superfície</h3>
          <p className="text-xs opacity-60 mt-2">Índice de massa corporal e área corporal.</p>
        </button>
        <button 
          onClick={() => setCalc('curb')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'curb' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <AlertTriangle className={`mb-4 ${calc === 'curb' ? 'text-white' : 'text-amber-500'}`} size={32} />
          <h3 className="font-bold text-lg">Escore CURB-65</h3>
          <p className="text-xs opacity-60 mt-2">Severidade da PAC.</p>
        </button>
        <button 
          onClick={() => setCalc('qsofa')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'qsofa' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Zap className={`mb-4 ${calc === 'qsofa' ? 'text-white' : 'text-rose-500'}`} size={32} />
          <h3 className="font-bold text-lg">qSOFA</h3>
          <p className="text-xs opacity-60 mt-2">Triagem rápida para sepse.</p>
        </button>
        <button 
          onClick={() => setCalc('sofa')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'sofa' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Activity className={`mb-4 ${calc === 'sofa' ? 'text-white' : 'text-rose-600'}`} size={32} />
          <h3 className="font-bold text-lg">SOFA Score</h3>
          <p className="text-xs opacity-60 mt-2">Disfunção Orgânica em UTI.</p>
        </button>
        <button 
          onClick={() => setCalc('glasgow')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'glasgow' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Brain className={`mb-4 ${calc === 'glasgow' ? 'text-white' : 'text-indigo-500'}`} size={32} />
          <h3 className="font-bold text-lg">Glasgow</h3>
          <p className="text-xs opacity-60 mt-2">Escala de coma.</p>
        </button>
        <button 
          onClick={() => setCalc('wells')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'wells' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Search className={`mb-4 ${calc === 'wells' ? 'text-white' : 'text-blue-500'}`} size={32} />
          <h3 className="font-bold text-lg">Wells (TEP)</h3>
          <p className="text-xs opacity-60 mt-2">Probabilidade clínica de TEP.</p>
        </button>
        <button 
          onClick={() => setCalc('chads')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'chads' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <ShieldAlert className={`mb-4 ${calc === 'chads' ? 'text-white' : 'text-purple-500'}`} size={32} />
          <h3 className="font-bold text-lg">CHA₂DS₂-VASc</h3>
          <p className="text-xs opacity-60 mt-2">Risco de AVC na FA.</p>
        </button>
        <button 
          onClick={() => setCalc('hasbled')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'hasbled' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Droplets className={`mb-4 ${calc === 'hasbled' ? 'text-white' : 'text-rose-600'}`} size={32} />
          <h3 className="font-bold text-lg">HAS-BLED</h3>
          <p className="text-xs opacity-60 mt-2">Risco de sangramento.</p>
        </button>
        <button 
          onClick={() => setCalc('meld')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'meld' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Scale className={`mb-4 ${calc === 'meld' ? 'text-white' : 'text-emerald-500'}`} size={32} />
          <h3 className="font-bold text-lg">MELD Score</h3>
          <p className="text-xs opacity-60 mt-2">Gravidade da Doença Hepática.</p>
        </button>
        <button 
          onClick={() => setCalc('child')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'child' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Scale className={`mb-4 ${calc === 'child' ? 'text-white' : 'text-medical-primary'}`} size={32} />
          <h3 className="font-bold text-lg">Child-Pugh</h3>
          <p className="text-xs opacity-60 mt-2">Classificação de Cirrose.</p>
        </button>
        <button 
          onClick={() => setCalc('nihss')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'nihss' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Brain className={`mb-4 ${calc === 'nihss' ? 'text-white' : 'text-rose-400'}`} size={32} />
          <h3 className="font-bold text-lg">NIHSS</h3>
          <p className="text-xs opacity-60 mt-2">Avaliação de déficit no AVC.</p>
        </button>
        <button 
          onClick={() => setCalc('braden')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'braden' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Bookmark className={`mb-4 ${calc === 'braden' ? 'text-white' : 'text-teal-500'}`} size={32} />
          <h3 className="font-bold text-lg">Braden</h3>
          <p className="text-xs opacity-60 mt-2">Risco de Lesão por Pressão.</p>
        </button>
        <button 
          onClick={() => setCalc('water')}
          className={`p-6 border rounded-3xl text-left transition-all ${calc === 'water' ? 'bg-medical-primary border-medical-primary text-white shadow-xl shadow-medical-primary/20' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700'}`}
        >
          <Droplets className={`mb-4 ${calc === 'water' ? 'text-white' : 'text-cyan-500'}`} size={32} />
          <h3 className="font-bold text-lg">Déficit de Água</h3>
          <p className="text-xs opacity-60 mt-2">Para Hipernatremia.</p>
        </button>
      </div>

      <AnimatePresence mode="wait">
        {calc === 'water' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Droplets size={20} className="text-cyan-500" /> Déficit de Água Livre</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Sódio Atual (mEq/L)</label>
                  <input type="number" value={waterDeficitInputs.na} onChange={(e) => setWaterDeficitInputs(p => ({ ...p, na: e.target.value }))} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none" placeholder="Ex: 155" />
                </div>
                <div>
                  <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Peso (kg)</label>
                  <input type="number" value={waterDeficitInputs.weight} onChange={(e) => setWaterDeficitInputs(p => ({ ...p, weight: e.target.value }))} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none" placeholder="Ex: 70" />
                </div>
             </div>
             <div className="grid grid-cols-2 gap-4 mb-8">
                <select value={waterDeficitInputs.gender} onChange={(e) => setWaterDeficitInputs(p => ({ ...p, gender: e.target.value }))} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none text-sm">
                   <option value="male">Masculino</option>
                   <option value="female">Feminino</option>
                </select>
                <select value={waterDeficitInputs.ageGroup} onChange={(e) => setWaterDeficitInputs(p => ({ ...p, ageGroup: e.target.value }))} className="p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none text-sm">
                   <option value="adult">Adulto</option>
                   <option value="elderly">Idoso</option>
                </select>
             </div>
             {waterDeficitResult !== "0" && (
                <button 
                  onClick={() => addToHistory('Déficit de Água', `${waterDeficitResult} L`)}
                  className="mt-6 w-full py-3 bg-cyan-500/10 text-cyan-600 rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-cyan-500 transition-colors hover:text-white"
                >
                  Salvar no Histórico
                </button>
             )}
          </motion.div>
        )}
        {calc === 'ckdepi' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Activity size={20} className="text-medical-primary" /> CKD-EPI (Filtração Glomerular)</h3>
             <div className="grid md:grid-cols-3 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Idade (Anos)</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Creatinina (mg/dL)</label>
                  <input type="number" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="flex bg-slate-50 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-700 h-12">
                   <button onClick={() => setIsFemale(false)} className={`flex-1 rounded-lg text-xs font-bold transition-all ${!isFemale ? 'bg-medical-primary text-white shadow-sm' : 'text-slate-400'}`}>Masc</button>
                   <button onClick={() => setIsFemale(true)} className={`flex-1 rounded-lg text-xs font-bold transition-all ${isFemale ? 'bg-medical-primary text-white shadow-sm' : 'text-slate-400'}`}>Fem</button>
                </div>
             </div>
             {ckdepiResult && ckdepiResult !== "NaN" && (
                <>
                  <div className="mt-8 p-8 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                    <div>
                       <h4 className="text-[10px] font-bold uppercase text-medical-primary tracking-widest mb-1">Taxa de Filtração Glomerular</h4>
                       <p className="text-6xl font-serif font-black italic text-medical-primary">{ckdepiResult}<span className="text-xl ml-2 opacity-40">mL/min/1.73m²</span></p>
                    </div>
                    <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                       <p className="text-sm font-bold dark:text-white">Estágio {parseInt(ckdepiResult) >= 90 ? 'G1' : parseInt(ckdepiResult) >= 60 ? 'G2' : parseInt(ckdepiResult) >= 45 ? 'G3a' : parseInt(ckdepiResult) >= 30 ? 'G3b' : parseInt(ckdepiResult) >= 15 ? 'G4' : 'G5'}</p>
                       <p className="text-xs text-slate-500 mt-1">{parseInt(ckdepiResult) < 15 ? 'Falência Renal' : 'Disfunção Renal'}</p>
                    </div>
                  </div>
                  <button 
                    onClick={() => addToHistory('TFG (CKD-EPI)', `${ckdepiResult} mL/min/1.73m²`)}
                    className="mt-6 w-full py-3 bg-medical-primary/10 text-medical-primary rounded-xl font-bold text-xs uppercase tracking-widest hover:bg-medical-primary transition-colors hover:text-white"
                  >
                    Salvar no Histórico
                  </button>
                </>
             )}
             <p className="mt-6 text-[10px] text-slate-400 text-center uppercase tracking-widest font-medium italic">Fórmula CKD-EPI 2021 (Ref: NKF/ASN Task Force)</p>
          </motion.div>
        )}
        {calc === 'clcr' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Calculator size={20} className="text-medical-secondary" /> Clearance de Creatinina (ClCr)</h3>
             <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Idade (Anos)</label>
                  <input type="number" value={age} onChange={e => setAge(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Creatinina (mg/dL)</label>
                  <input type="number" step="0.1" value={creatinine} onChange={e => setCreatinine(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="flex gap-2">
                   <button onClick={() => setIsFemale(false)} className={`flex-1 h-12 rounded-xl font-bold transition-all ${!isFemale ? 'bg-medical-primary text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>Masc</button>
                   <button onClick={() => setIsFemale(true)} className={`flex-1 h-12 rounded-xl font-bold transition-all ${isFemale ? 'bg-rose-500 text-white shadow-md' : 'bg-slate-100 dark:bg-slate-700 text-slate-500'}`}>Fem</button>
                   <button onClick={() => {setAge(''); setWeight(''); setCreatinine('')}} className="p-3 bg-slate-100 dark:bg-slate-700 text-slate-400 rounded-xl hover:text-rose-500"><RotateCcw size={18} /></button>
                </div>
             </div>
             {clcrResult && (
               <div className="mt-8 p-8 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h4 className="text-[10px] font-bold uppercase text-medical-primary/60 tracking-widest mb-1">Clearance Estimado</h4>
                    <p className="text-6xl font-serif font-black italic text-medical-primary">{clcrResult}<span className="text-xl ml-2 opacity-40">mL/min</span></p>
                 </div>
                 <div className="max-w-md bg-white dark:bg-slate-900 p-4 rounded-2xl shadow-sm border border-slate-100 dark:border-slate-700">
                    <div className="flex items-center gap-2 text-medical-accent mb-2">
                       <ShieldCheck size={16} />
                       <span className="text-[10px] font-bold uppercase tracking-widest">Atenção Farmacêutica</span>
                    </div>
                    <p className="text-xs text-slate-500 italic">"Utilize este valor para ajuste de antibioticoterapia (ex: Glicopeptídeos, Aminoglicosídeos) e avaliação de função renal basal do paciente."</p>
                 </div>
               </div>
             )}
          </motion.div>
        )}

        {calc === 'curb' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><AlertTriangle size={20} className="text-amber-500" /> Severidade da Pneumonia (CURB-65)</h3>
             <div className="space-y-3">
                {[
                  { id: 'confusion', label: 'C — Confusão Mental recente?' },
                  { id: 'urea', label: 'U — Ureia > 50 mg/dL?' },
                  { id: 'respiration', label: 'R — FR ≥ 30 irpm?' },
                  { id: 'blood', label: 'B — PAS < 90 mmHg ou PAD ≤ 60 mmHg?' },
                  { id: 'age', label: '65 — Idade ≥ 65 anos?' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setCurb(p => ({ ...p, [item.id]: !p[item.id as keyof typeof curb] }))}
                    className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all ${curb[item.id as keyof typeof curb] ? 'bg-amber-500/10 border-amber-500 text-amber-600 dark:text-amber-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span className="font-bold text-sm">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${curb[item.id as keyof typeof curb] ? 'bg-amber-500 border-amber-500 text-white' : 'border-slate-300'}`}>
                       {curb[item.id as keyof typeof curb] && <ShieldCheck size={14} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-8 bg-amber-500/5 rounded-3xl border border-amber-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-amber-600 tracking-widest mb-1">Escore Total</h4>
                  <p className="text-6xl font-serif font-black italic text-amber-600">{curbScore}<span className="text-xl ml-2 opacity-40">Pontos</span></p>
                </div>
                <div className="max-w-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold uppercase text-slate-400 mb-1">Recomendação:</p>
                   <p className="text-sm font-medium">
                      {curbScore <= 1 ? 'Baixo Risco (1.5% morbi.). Tratamento Ambulatorial.' : curbScore === 2 ? 'Risco Moderado (9.2% morbi.). Considerar Internação curta.' : 'Alto Risco (22% morbi.). Internação Hospitalar / UTI.'}
                   </p>
                </div>
             </div>
          </motion.div>
        )}

        {calc === 'qsofa' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Zap size={20} className="text-rose-500" /> Triagem de Sepse (qSOFA)</h3>
             <div className="space-y-3">
                {[
                  { id: 'mental', label: 'Estado Mental Alterado (Glasgow < 15)?' },
                  { id: 'respiration', label: 'Frequência Respiratória ≥ 22 irpm?' },
                  { id: 'pressure', label: 'Pressão Arterial Sistólica ≤ 100 mmHg?' },
                ].map((item) => (
                  <button 
                    key={item.id}
                    onClick={() => setQsofa(p => ({ ...p, [item.id]: !p[item.id as keyof typeof qsofa] }))}
                    className={`w-full p-4 flex items-center justify-between rounded-2xl border transition-all ${qsofa[item.id as keyof typeof qsofa] ? 'bg-rose-500/10 border-rose-500 text-rose-600 dark:text-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span className="font-bold text-sm">{item.label}</span>
                    <div className={`w-6 h-6 rounded-lg border-2 flex items-center justify-center ${qsofa[item.id as keyof typeof qsofa] ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'}`}>
                       {qsofa[item.id as keyof typeof qsofa] && <ShieldCheck size={14} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-8 bg-rose-500/5 rounded-3xl border border-rose-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                <div>
                  <h4 className="text-[10px] font-bold uppercase text-rose-600 tracking-widest mb-1">Escore Total</h4>
                  <p className="text-6xl font-serif font-black italic text-rose-600">{qsofaScore}<span className="text-xl ml-2 opacity-40">Pontos</span></p>
                </div>
                <div className="max-w-xs bg-white dark:bg-slate-900 p-4 rounded-2xl border border-slate-100 dark:border-slate-700">
                   <p className="text-xs font-bold uppercase text-slate-400 mb-1">Resultado:</p>
                   <p className="text-sm font-medium">
                      {qsofaScore >= 2 ? 'ALTO RISCO. Maior probabilidade de desfecho desfavorável ou internação prolongada. Avaliar disfunção orgânica.' : 'Baixo risco de mortalidade hospitalar.'}
                   </p>
                </div>
             </div>
          </motion.div>
        )}

        {calc === 'glasgow' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700 text-center">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Brain size={20} className="text-indigo-500" /> Escala de Coma de Glasgow</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Abertura Ocular</p>
                  {[4, 3, 2, 1].map(v => (
                    <button key={v} onClick={() => setGlasgow(p => ({ ...p, eyes: v }))} className={`w-full p-2 border rounded-xl text-xs font-bold ${glasgow.eyes === v ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-900'}`}>
                      {v === 4 ? 'Espontânea' : v === 3 ? 'À Voz' : v === 2 ? 'À Dor' : 'Sem resposta'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Resposta Verbal</p>
                  {[5, 4, 3, 2, 1].map(v => (
                    <button key={v} onClick={() => setGlasgow(p => ({ ...p, verbal: v }))} className={`w-full p-2 border rounded-xl text-xs font-bold ${glasgow.verbal === v ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-900'}`}>
                      {v === 5 ? 'Orientada' : v === 4 ? 'Confusa' : v === 3 ? 'Palavras' : v === 2 ? 'Sons' : 'Sem resposta'}
                    </button>
                  ))}
                </div>
                <div className="space-y-2">
                  <p className="text-xs font-bold uppercase text-slate-400">Resposta Motora</p>
                  {[6, 5, 4, 3, 2, 1].map(v => (
                    <button key={v} onClick={() => setGlasgow(p => ({ ...p, motor: v }))} className={`w-full p-2 border rounded-xl text-xs font-bold ${glasgow.motor === v ? 'bg-indigo-500 text-white' : 'bg-slate-50 dark:bg-slate-900'}`}>
                      {v === 6 ? 'Obedece' : v === 5 ? 'Localiza' : v === 4 ? 'Retirada' : v === 3 ? 'Flexão' : v === 2 ? 'Extensão' : 'Sem resposta'}
                    </button>
                  ))}
                </div>
             </div>
             <div className="mt-8 p-6 bg-indigo-500/5 rounded-3xl border border-indigo-500/20">
                <p className="text-6xl font-black italic text-indigo-500 mb-2">{glasgowTotal}</p>
                <p className="text-sm font-bold">{glasgowTotal <= 8 ? 'TCE Grave (Indicação IOT)' : glasgowTotal <= 12 ? 'TCE Moderado' : 'TCE Leve'}</p>
             </div>
          </motion.div>
        )}

        {calc === 'wells' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Search size={20} className="text-blue-500" /> Wells - Critérios para TEP</h3>
             <div className="space-y-2">
                {[
                  { id: 'symptoms', label: 'Sinais/Sintomas de TVP? (3 pts)', val: 3 },
                  { id: 'altDiagnosis', label: 'TEP é diagnóstico provável? (3 pts)', val: 3 },
                  { id: 'heartRate', label: 'FC > 100 bpm? (1.5 pts)', val: 1.5 },
                  { id: 'surgery', label: 'Cirurgia ou Imobilização? (1.5 pts)', val: 1.5 },
                  { id: 'previous', label: 'TVP ou TEP prévio? (1.5 pts)', val: 1.5 },
                  { id: 'hemoptysis', label: 'Hemoptise? (1 pt)', val: 1 },
                  { id: 'malignancy', label: 'Câncer / Malignidade? (1 pt)', val: 1 },
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setWells(p => ({ ...p, [item.id]: !p[item.id as keyof typeof wells] }))}
                    className={`w-full p-3 flex justify-between items-center border rounded-xl text-sm ${wells[item.id as keyof typeof wells] ? 'bg-blue-500/10 border-blue-500 font-bold' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span>{item.label}</span>
                    <div className={`w-5 h-5 rounded border ${wells[item.id as keyof typeof wells] ? 'bg-blue-500 border-blue-500 text-white' : 'border-slate-300'} flex items-center justify-center`}>
                       {wells[item.id as keyof typeof wells] && <ShieldCheck size={12} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-6 bg-blue-500/5 rounded-3xl border border-blue-500/10 text-center">
                <p className="text-5xl font-black text-blue-500 mb-2">{wellsScore}</p>
                <p className="text-sm font-bold">{wellsScore > 4 ? 'ALTA Probabilidade. Solicitar exames de imagem (AngioTC).' : wellsScore >= 2 ? 'Probabilidade Moderada. Solicitar D-Dímero.' : 'BAIXA Probabilidade. D-Dímero descarta se negativo.'}</p>
             </div>
          </motion.div>
        )}

        {calc === 'chads' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><ShieldAlert size={20} className="text-purple-500" /> CHA₂DS₂-VASc</h3>
             <div className="space-y-2">
                {[
                  { id: 'heartFailure', label: 'I - Insuficiência Cardíaca? (1 pt)' },
                  { id: 'hypertension', label: 'H - Hipertensão? (1 pt)' },
                  { id: 'age75', label: 'A - Idade ≥ 75 anos? (2 pts)' },
                  { id: 'diabetes', label: 'D - Diabetes Mellitus? (1 pt)' },
                  { id: 'stroke', label: 'S - AVC / AIT / Tromboembolismo prévio? (2 pts)' },
                  { id: 'vascular', label: 'V - Doença Vascular? (1 pt)' },
                  { id: 'age65', label: 'A - Idade 65-74 anos? (1 pt)' },
                  { id: 'female', label: 'Sc - Sexo Feminino? (1 pt)' },
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setChads(p => ({ ...p, [item.id]: !p[item.id as keyof typeof chads] }))}
                    className={`w-full p-3 flex justify-between items-center border rounded-xl text-sm ${chads[item.id as keyof typeof chads] ? 'bg-purple-500/10 border-purple-500 font-bold' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span>{item.label}</span>
                    <div className={`w-5 h-5 rounded border ${chads[item.id as keyof typeof chads] ? 'bg-purple-500 border-purple-500 text-white' : 'border-slate-300'} flex items-center justify-center`}>
                       {chads[item.id as keyof typeof chads] && <ShieldCheck size={12} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-6 bg-purple-500/5 rounded-3xl border border-purple-500/10 text-center">
                <p className="text-5xl font-black text-purple-500 mb-2">{chadsScore}</p>
                <p className="text-sm font-bold">
                  {chadsScore >= 2 ? 'Anticoaguloterapia Recomendada (Homem >= 2, Mulher >= 3).' : chadsScore === 1 ? 'Anticoagulação deve ser considerada.' : 'Baixo risco. Anticoagulação geralmente não indicada.'}
                </p>
             </div>
          </motion.div>
        )}

        {calc === 'hasbled' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Droplets size={20} className="text-rose-600" /> HAS-BLED Score</h3>
             <div className="space-y-2">
                {[
                  { id: 'h', label: 'H - Hipertensão (PAS > 160 mmHg)' },
                  { id: 'a', label: 'A - Função Renal ou Hepática Alterada' },
                  { id: 's', label: 'S - AVC Prévio' },
                  { id: 'b', label: 'B - História de Sangramento ou Predisposição' },
                  { id: 'l', label: 'L - INR Labital (se em uso de varfarina)' },
                  { id: 'e', label: 'E - Idade > 65 anos' },
                  { id: 'd', label: 'D - Drogas (Aspirina/AINE) ou Álcool' },
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setHasbled(p => ({ ...p, [item.id]: !p[item.id as keyof typeof hasbled] }))}
                    className={`w-full p-3 flex justify-between items-center border rounded-xl text-sm ${hasbled[item.id as keyof typeof hasbled] ? 'bg-rose-500/10 border-rose-500 font-bold' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                  >
                    <span>{item.label}</span>
                    <div className={`w-5 h-5 rounded border ${hasbled[item.id as keyof typeof hasbled] ? 'bg-rose-500 border-rose-500 text-white' : 'border-slate-300'} flex items-center justify-center`}>
                       {hasbled[item.id as keyof typeof hasbled] && <ShieldCheck size={12} />}
                    </div>
                  </button>
                ))}
             </div>
             <div className="mt-8 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10 text-center">
                <p className="text-5xl font-black text-rose-500 mb-2">{hasbledScore}</p>
                <p className="text-sm font-bold">
                  {hasbledScore >= 3 ? 'ALTO RISCO de sangramento. CAUTELA ao anticoagular. Monitorar de perto.' : 'Risco de sangramento baixo/moderado.'}
                </p>
             </div>
          </motion.div>
        )}

        {calc === 'meld' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Scale size={20} className="text-emerald-500" /> MELD Score</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Bilirrubina (mg/dL)</label>
                   <input type="number" value={meldInputs.bili} onChange={(e) => setMeldInputs(p => ({ ...p, bili: e.target.value }))} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none" placeholder="0.0" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2">INR</label>
                   <input type="number" value={meldInputs.inr} onChange={(e) => setMeldInputs(p => ({ ...p, inr: e.target.value }))} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none" placeholder="1.0" />
                </div>
                <div>
                   <label className="block text-xs font-bold text-slate-400 uppercase mb-2">Creatinina (mg/dL)</label>
                   <input type="number" value={meldInputs.cr} onChange={(e) => setMeldInputs(p => ({ ...p, cr: e.target.value }))} className="w-full p-4 rounded-2xl bg-slate-50 dark:bg-slate-900 border-none outline-none" placeholder="0.0" />
                </div>
             </div>
             <div className="p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 text-center">
                <p className="text-6xl font-black text-emerald-500 mb-2">{meldScore || '--'}</p>
                <p className="text-sm font-bold">Mortalidade estimada em 3 meses: {meldScore >= 40 ? '71.3%' : meldScore >= 30 ? '52.6%' : meldScore >= 20 ? '19.6%' : 'Inexpressiva'}</p>
             </div>
          </motion.div>
        )}

        {calc === 'nihss' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Brain size={20} className="text-rose-400" /> NIH Stroke Scale (NIHSS)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {[
                  { id: 'state', label: 'Nível de Consciência', options: ['Alerta (0)', 'Sonolento (1)', 'Obnubilado (2)', 'Coma (3)'] },
                  { id: 'gaze', label: 'Paralisia do Olhar', options: ['Normal (0)', 'Parcial (1)', 'Total (2)'] },
                  { id: 'visual', label: 'Campos Visuais', options: ['Normal (0)', 'Parcial (1)', 'Hemianopsia (2)', 'Cegueira (3)'] },
                  { id: 'facial', label: 'Paralisia Facial', options: ['Normal (0)', 'Leve (1)', 'Parcial (2)', 'Total (3)'] },
                  { id: 'motorL', label: 'Motor Braço E', options: ['Normal (0)', 'Deriva (1)', 'Cai (2)', 'Sem esforço (4)'] },
                  { id: 'motorR', label: 'Motor Braço D', options: ['Normal (0)', 'Deriva (1)', 'Cai (2)', 'Sem esforço (4)'] },
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((opt, i) => {
                        const val = parseInt(opt.match(/\d+/)![0]);
                        return (
                          <button 
                            key={i} 
                            onClick={() => setNihss(p => ({ ...p, [item.id]: val }))}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${nihss[item.id] === val ? 'bg-rose-400 text-white border-rose-400' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-6 bg-rose-400/5 rounded-3xl border border-rose-400/10 text-center">
                <p className="text-5xl font-black text-rose-400 mb-2">{nihssTotal}</p>
                <p className="text-sm font-bold">
                  {(nihssTotal as number) >= 16 ? 'Déficit Grave (Risco de transformação hemorrágica)' : (nihssTotal as number) >= 5 ? 'Déficit Moderado' : 'Déficit Leve'}
                </p>
             </div>
          </motion.div>
        )}

        {calc === 'braden' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Bookmark size={20} className="text-teal-500" /> Escala de Braden</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'sensory', label: 'Percepção Sensorial', options: ['Totalmente (1)', 'Muito (2)', 'Pouco (3)', 'Normal (4)'] },
                  { id: 'moisture', label: 'Umidade', options: ['Constante (1)', 'Muita (2)', 'Ocasional (3)', 'Raramente (4)'] },
                  { id: 'activity', label: 'Atividade', options: ['Acamado (1)', 'Cadeira (2)', 'Caminha (3)', 'Normal (4)'] },
                  { id: 'mobility', label: 'Mobilidade', options: ['Imóvel (1)', 'Bastante (2)', 'Pouco (3)', 'Normal (4)'] },
                  { id: 'nutrition', label: 'Nutrição', options: ['Pobre (1)', 'Inadequada (2)', 'Adequada (3)', 'Excelente (4)'] },
                  { id: 'friction', label: 'Fricção / Cisalhamento', options: ['Problema (1)', 'Potencial (2)', 'Nenhum (3)'] },
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((opt, i) => {
                        const val = parseInt(opt.match(/\d+/)![0]);
                        return (
                          <button 
                            key={i} 
                            onClick={() => setBraden(p => ({ ...p, [item.id]: val }))}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${braden[item.id] === val ? 'bg-teal-500 text-white border-teal-500' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-6 bg-teal-500/5 rounded-3xl border border-teal-500/10 text-center">
                <p className="text-5xl font-black text-teal-500 mb-2">{bradenScore}</p>
                <p className="text-sm font-bold">
                  {(bradenScore as number) <= 12 ? 'ALTO RISCO (Implementar protocolo imediato).' : (bradenScore as number) <= 14 ? 'Risco Moderado.' : 'Risco Baixo / Sem risco.'}
                </p>
             </div>
          </motion.div>
        )}

        {calc === 'bmi' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white"><Activity size={20} className="text-medical-secondary" /> Índice de Massa Corporal</h3>
             <div className="grid md:grid-cols-2 gap-6 items-end">
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Peso (kg)</label>
                  <input type="number" value={weight} onChange={e => setWeight(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
                <div className="space-y-2">
                  <label className="text-xs font-bold uppercase text-slate-400">Altura (cm)</label>
                  <input type="number" value={height} onChange={e => setHeight(e.target.value)} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-xl px-4 focus:ring-2 focus:ring-medical-primary/20 outline-none dark:text-white" />
                </div>
             </div>
             {bmiResult && (
               <div className="mt-8 p-8 bg-emerald-500/5 rounded-3xl border border-emerald-500/10 flex flex-col md:flex-row items-center justify-between gap-6">
                 <div>
                    <h4 className="text-[10px] font-bold uppercase text-emerald-600 tracking-widest mb-1">IMC</h4>
                    <p className="text-6xl font-serif font-black italic text-emerald-600">{bmiResult}<span className="text-xl ml-2 opacity-40">kg/m²</span></p>
                 </div>
                 <div className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-100 dark:border-slate-700">
                    <p className="text-sm font-bold dark:text-white">{parseFloat(bmiResult) < 18.5 ? 'Baixo Peso' : parseFloat(bmiResult) < 25 ? 'Peso Normal' : 'Sobrepeso / Obesidade'}</p>
                    <div className="w-48 h-2 bg-slate-100 dark:bg-slate-800 rounded-full mt-2 overflow-hidden">
                       <div className="h-full bg-emerald-500" style={{ width: `${Math.min(100, (parseFloat(bmiResult) / 40) * 100)}%` }} />
                    </div>
                 </div>
               </div>
             )}
          </motion.div>
        )}

        {calc === 'sofa' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Activity size={20} className="text-medical-secondary" /> SOFA Score (Disfunção Orgânica)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'resp', label: 'Respiração (PaO2/FiO2)', options: ['>400 (0)', '<400 (1)', '<300 (2)', '<200 + VNI (3)', '<100 + VM (4)'] },
                  { id: 'coagulation', label: 'Coagulação (Plaquetas)', options: ['>150k (0)', '<150k (1)', '<100k (2)', '<50k (3)', '<20k (4)'] },
                  { id: 'liver', label: 'Fígado (Bilirrubina)', options: ['<1.2 (0)', '1.2-1.9 (1)', '2-5.9 (2)', '6-11.9 (3)', '>12 (4)'] },
                  { id: 'cardiovascular', label: 'Cardiovascular (PAM/Drogas)', options: ['PAM ≥70 (0)', 'PAM <70 (1)', 'Dopa ≤5 (2)', 'Nora ≤0.1 (3)', 'Nora >0.1 (4)'] },
                  { id: 'cns', label: 'SNC (Glasgow)', options: ['15 (0)', '13-14 (1)', '10-12 (2)', '6-9 (3)', '<6 (4)'] },
                  { id: 'renal', label: 'Renal (Creatinina)', options: ['<1.2 (0)', '1.2-1.9 (1)', '2-3.4 (2)', '3.5-4.9 (3)', '>5 (4)'] },
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((opt, i) => {
                        const val = parseInt(opt.match(/\d+/)![0]);
                        return (
                          <button 
                            key={i} 
                            onClick={() => setSofa(p => ({ ...p, [item.id]: val }))}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${sofa[item.id as keyof typeof sofa] === val ? 'bg-medical-primary text-white border-medical-primary' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-6 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 text-center">
                <p className="text-6xl font-black text-medical-primary mb-2">{sofaScore}</p>
                <p className="text-sm font-bold">Mortalidade estimada em UTI: {sofaScore >= 15 ? '>90%' : sofaScore >= 10 ? '40-50%' : 'Baixa'}</p>
             </div>
          </motion.div>
        )}

        {calc === 'child' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 flex items-center gap-2 dark:text-white justify-center"><Scale size={20} className="text-medical-primary" /> Child-Pugh Score</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'bili', label: 'Bilirrubina (mg/dL)', options: ['<2 (1)', '2-3 (2)', '>3 (3)'] },
                  { id: 'alb', label: 'Albumina (g/dL)', options: ['>3.5 (1)', '2.8-3.5 (2)', '<2.8 (3)'] },
                  { id: 'inr', label: 'INR', options: ['<1.7 (1)', '1.7-2.3 (2)', '>2.3 (3)'] },
                  { id: 'ascites', label: 'Ascite', options: ['Ausente (1)', 'Leve (2)', 'Moderada (3)'] },
                  { id: 'enceph', label: 'Encefalopatia', options: ['Ausente (1)', 'Grau 1-2 (2)', 'Grau 3-4 (3)'] },
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((opt, i) => {
                        const val = parseInt(opt.match(/\d+/)![0]);
                        return (
                          <button 
                            key={i} 
                            onClick={() => setChild(p => ({ ...p, [item.id as keyof typeof child]: val }))}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${child[item.id as keyof typeof child] === val ? 'bg-medical-primary text-white border-medical-primary' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-6 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 text-center">
                <p className="text-6xl font-black text-medical-primary mb-2">{childScore}</p>
                <p className="text-sm font-bold">
                  {childScore <= 6 ? 'Classe A (5-6 pts) - Sobrevida 1 ano: 100%' : childScore <= 9 ? 'Classe B (7-9 pts) - Sobrevida 1 ano: 80%' : 'Classe C (10-15 pts) - Sobrevida 1 ano: 45%'}
                </p>
             </div>
          </motion.div>
        )}

        {calc === 'meld' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 justify-center flex items-center gap-2 dark:text-white"><ClipboardCheck size={20} className="text-medical-secondary" /> MELD Score</h3>
             <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Bilirrubina (mg/dL)</p>
                   <input type="number" value={meldInputs.bili} onChange={(e) => setMeldInputs(p =>({...p, bili: e.target.value}))} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-medical-primary/20 dark:text-white" placeholder="1.0" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">INR</p>
                   <input type="number" value={meldInputs.inr} onChange={(e) => setMeldInputs(p =>({...p, inr: e.target.value}))} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-medical-primary/20 dark:text-white" placeholder="1.0" />
                </div>
                <div>
                   <p className="text-[10px] font-bold text-slate-400 uppercase mb-2">Creatinina (mg/dL)</p>
                   <input type="number" value={meldInputs.cr} onChange={(e) => setMeldInputs(p =>({...p, cr: e.target.value}))} className="w-full h-12 bg-slate-50 dark:bg-slate-900 border border-slate-200 dark:border-slate-700 rounded-2xl px-4 outline-none focus:ring-2 focus:ring-medical-primary/20 dark:text-white" placeholder="1.0" />
                </div>
             </div>
             <div className="mt-8 p-6 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 text-center">
                <p className="text-6xl font-black text-medical-primary mb-2">{meldScore}</p>
                <p className="text-sm font-bold">Mortalidade em 3 meses: {meldScore > 40 ? '71%' : meldScore > 30 ? '52%' : meldScore > 20 ? '20%' : '<2%'}</p>
             </div>
          </motion.div>
        )}

        {calc === 'wells' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 justify-center flex items-center gap-2 dark:text-white"><Activity size={20} className="text-medical-primary" /> Escore de Wells para TEP</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'symptoms', label: 'Sinais/Sintomas de TVP (3 pts)', val: 3 },
                  { id: 'altDiagnosis', label: 'TEP é diagnóstico provável (3 pts)', val: 3 },
                  { id: 'heartRate', label: 'FC > 100 bpm (1.5 pts)', val: 1.5 },
                  { id: 'surgery', label: 'Imobilização/Cirurgia 4 sem (1.5 pts)', val: 1.5 },
                  { id: 'previous', label: 'TVP/TEP prévio (1.5 pts)', val: 1.5 },
                  { id: 'hemoptysis', label: 'Hemoptise (1 pt)', val: 1 },
                  { id: 'malignancy', label: 'Malignidade (1 pt)', val: 1 },
                ].map(item => (
                  <button 
                    key={item.id} 
                    onClick={() => setWells(p => ({ ...p, [item.id as keyof typeof wells]: !p[item.id as keyof typeof wells] }))}
                    className={`flex items-center justify-between p-4 rounded-2xl border transition-all ${wells[item.id as keyof typeof wells] ? 'bg-medical-primary border-medical-primary text-white' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700 text-slate-600 dark:text-slate-400'}`}
                  >
                    <span className="text-xs font-bold">{item.label}</span>
                    {wells[item.id as keyof typeof wells] ? <CheckCircle size={18} /> : <Circle size={18} />}
                  </button>
                ))}
             </div>
             <div className="mt-8 p-6 bg-medical-primary/5 rounded-3xl border border-medical-primary/10 text-center">
                <p className="text-6xl font-black text-medical-primary mb-2">{wellsScore}</p>
                <p className="text-sm font-bold">
                  {wellsScore > 4 ? 'Alta Probabilidade (> 6 pts) ou Intermediária (4.5 - 6 pts)' : 'Baixa Probabilidade (< 4 pts)'}
                </p>
                <p className="text-xs text-slate-500 mt-2">D-dímero indicado se Wells {"<="} 4.</p>
             </div>
          </motion.div>
        )}

        {calc === 'nihss' && (
          <motion.div initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="bg-white dark:bg-slate-800 p-8 rounded-3xl border border-slate-200 dark:border-slate-700">
             <h3 className="text-xl font-bold mb-6 justify-center flex items-center gap-2 dark:text-white"><Zap size={20} className="text-rose-500" /> NIHSS (Simplificado)</h3>
             <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {[
                  { id: 'state', label: 'Nível Consciência', options: ['Alerta (0)', 'Sonolento (1)', 'Estupor (2)', 'Coma (3)'] },
                  { id: 'gaze', label: 'Olhar Conjugado', options: ['Normal (0)', 'Parcial (1)', 'Desvio Forçado (2)'] },
                  { id: 'facial', label: 'Paresia Facial', options: ['Normal (0)', 'Leve (1)', 'Parcial (2)', 'Total (3)'] },
                  { id: 'motorL', label: 'Motor Braço E', options: ['Sem Queda (0)', 'Queda (1)', 'Algum esforço (2)', 'Sem esforço (3)', 'Plegia (4)'] },
                  { id: 'motorR', label: 'Motor Braço D', options: ['Sem Queda (0)', 'Queda (1)', 'Algum esforço (2)', 'Sem esforço (3)', 'Plegia (4)'] },
                  { id: 'legL', label: 'Motor Perna E', options: ['Sem Queda (0)', 'Queda (1)', 'Algum esforço (2)', 'Sem esforço (3)', 'Plegia (4)'] },
                  { id: 'legR', label: 'Motor Perna D', options: ['Sem Queda (0)', 'Queda (1)', 'Algum esforço (2)', 'Sem esforço (3)', 'Plegia (4)'] },
                ].map(item => (
                  <div key={item.id} className="space-y-1">
                    <p className="text-[10px] font-bold text-slate-400 uppercase">{item.label}</p>
                    <div className="flex flex-wrap gap-1">
                      {item.options.map((opt, i) => {
                        const val = parseInt(opt.match(/\d+/)![0]);
                        return (
                          <button 
                            key={i} 
                            onClick={() => setNihss(p => ({ ...p, [item.id]: val }))}
                            className={`px-2 py-1 text-[10px] rounded-lg border transition-all ${nihss[item.id] === val ? 'bg-medical-primary text-white border-medical-primary' : 'bg-slate-50 dark:bg-slate-900 border-slate-200 dark:border-slate-700'}`}
                          >
                            {opt}
                          </button>
                        );
                      })}
                    </div>
                  </div>
                ))}
             </div>
             <div className="mt-8 p-6 bg-rose-500/5 rounded-3xl border border-rose-500/10 text-center">
                <p className="text-6xl font-black text-rose-500 mb-2">{nihssTotal}</p>
                <p className="text-sm font-bold text-rose-600">
                  {nihssTotal >= 21 ? 'AVC Grave' : nihssTotal >= 16 ? 'Moderado/Grave' : nihssTotal >= 5 ? 'Moderado' : 'Leve'}
                </p>
             </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

function Sidebar({ activeSection, onSelect, isOpen, setIsOpen }: { activeSection: AppSection; onSelect: (s: AppSection) => void; isOpen: boolean; setIsOpen: (o: boolean) => void }) {
  const menuItems = [
    { id: 'dashboard', icon: LayoutDashboard, label: 'Início' },
    { id: 'ubs', icon: Stethoscope, label: 'Atenção Básica / UBS' },
    { id: 'emergency', icon: ShieldAlert, label: 'Pronto Socorro' },
    { id: 'drugs', icon: Pill, label: 'Doses & KD' },
    { id: 'calculators', icon: Calculator, label: 'Calculadoras' },
    { id: 'flowcharts', icon: Activity, label: 'Fluxogramas' },
    { id: 'prescriptions', icon: FileText, label: 'Prescrições' },
    { id: 'summaries', icon: BookOpen, label: 'Resumos' },
    { id: 'history', icon: History, label: 'Histórico' },
  ];

  return (
    <>
      {/* Backdrop */}
      <AnimatePresence>
        {isOpen && (
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 bg-slate-900/40 backdrop-blur-sm z-[55] lg:hidden"
          />
        )}
      </AnimatePresence>

      <aside className={`fixed left-0 top-0 h-screen w-72 bg-white dark:bg-slate-900 border-r border-slate-200 dark:border-slate-800 z-[60] flex flex-col py-8 transition-transform duration-300 lg:translate-x-0 ${isOpen ? 'translate-x-0 shadow-2xl' : '-translate-x-full'}`}>
         <div className="px-8 mb-10 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <div className="bg-rose-600 text-white p-2.5 rounded-2xl shadow-lg shadow-rose-600/20 rotate-3">
                 <ShieldCheck size={24} />
              </div>
              <div>
                 <h1 className="font-serif font-black italic text-xl text-slate-800 dark:text-white tracking-tighter">Pedsocorro</h1>
                 <p className="text-[10px] font-bold uppercase tracking-widest text-rose-500">Protocolos Médicos</p>
              </div>
            </div>
            <button onClick={() => setIsOpen(false)} className="lg:hidden p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl">
              <X size={20} />
            </button>
         </div>

         <nav className="flex-1 px-4 space-y-1.5 overflow-y-auto custom-scrollbar">
            {menuItems.map((item) => (
              <button
                key={item.id}
                onClick={() => onSelect(item.id as AppSection)}
                className={`w-full flex items-center gap-4 p-4 rounded-2xl transition-all group ${
                  activeSection === item.id 
                    ? 'bg-medical-primary text-white shadow-lg shadow-medical-primary/20' 
                    : 'text-slate-500 dark:text-slate-400 hover:bg-slate-50 dark:hover:bg-slate-800'
                }`}
              >
                <item.icon size={20} strokeWidth={activeSection === item.id ? 2.5 : 2} />
                <span className="font-bold text-sm tracking-tight">{item.label}</span>
                {activeSection === item.id && (
                  <div className="ml-auto w-1.5 h-1.5 rounded-full bg-white animate-pulse" />
                )}
              </button>
            ))}
         </nav>

         <div className="px-6 mt-8">
            <div className="bg-slate-50 dark:bg-slate-800/50 rounded-[32px] p-5 border border-slate-100 dark:border-slate-800/50">
               <div className="flex items-center gap-3 mb-3">
                  <div className="w-2.5 h-2.5 rounded-full bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.4)]" />
                  <span className="text-[10px] font-black uppercase tracking-widest text-slate-400">System Core</span>
               </div>
               <p className="text-[10px] text-slate-500 dark:text-slate-400 font-bold leading-relaxed mb-4">Base de protocolos 2026.1 atualizada e validada.</p>
               <div className="flex -space-x-2">
                 <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-medical-primary flex items-center justify-center text-[10px] text-white font-bold">DR</div>
                 <div className="w-6 h-6 rounded-full border-2 border-white dark:border-slate-800 bg-slate-400 flex items-center justify-center text-[10px] text-white font-bold">AI</div>
               </div>
            </div>
         </div>
      </aside>
    </>
  );
}

// --- Main App ---

export default function App() {
  const [activeSection, setActiveSection] = useState<AppSection>('dashboard');
  const [selectedDisease, setSelectedDisease] = useState<typeof PRESCRIPTIONS[0] | null>(null);
  
  // --- State for UBS Module Hoisting ---
  const [selectedUbsDiseaseId, setSelectedUbsDiseaseId] = useState<string>('drge');
  const [selectedUbsSubTab, setSelectedUbsSubTab] = useState<'cronicos' | 'mulher' | 'mental' | 'condutas' | 'guia'>('guia');

  // --- State for History and Search ---
  const [history, setHistory] = useState<{id: string, title: string, result: string, date: string}[]>(() => {
    const saved = localStorage.getItem('med_history');
    return saved ? JSON.parse(saved) : [];
  });

  const addToHistory = (title: string, result: string) => {
    const newItem = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      result,
      date: new Date().toLocaleString('pt-BR')
    };
    const next = [newItem, ...history].slice(0, 20); // Keep last 20
    setHistory(next);
    localStorage.setItem('med_history', JSON.stringify(next));
  };

  const [isDark, setIsDark] = useState(false);

  useEffect(() => {
    if (isDark) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [isDark]);

  const [isSidebarOpen, setIsSidebarOpen] = useState(false);

  return (
    <div className="min-h-screen bg-[#CAD3DC] dark:bg-[#090D1A] text-slate-900 dark:text-slate-300 transition-colors duration-300">
      {/* Mobile Header */}
      <div className="lg:hidden h-16 bg-white dark:bg-slate-900 border-b border-slate-200 dark:border-slate-800 flex items-center justify-between px-6 sticky top-0 z-50">
        <div className="flex items-center gap-2">
           <ShieldCheck className="text-rose-600" size={24} />
           <span className="font-serif font-black italic text-lg text-slate-800 dark:text-white tracking-tighter">Pedsocorro</span>
        </div>
        <button 
          onClick={() => setIsSidebarOpen(!isSidebarOpen)}
          className="p-2 hover:bg-slate-100 dark:hover:bg-slate-800 rounded-xl"
        >
          {isSidebarOpen ? <X size={24} /> : <Menu size={24} />}
        </button>
      </div>

      <Sidebar 
        activeSection={activeSection} 
        onSelect={(s) => {
          setActiveSection(s);
          setIsSidebarOpen(false);
          setSelectedDisease(null);
        }} 
        isOpen={isSidebarOpen}
        setIsOpen={setIsSidebarOpen}
      />
      
      <div className={`transition-all duration-300 ${isSidebarOpen ? 'blur-md' : ''} lg:pl-72`}>
        {/* Top Header */}
        <header className="h-20 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md sticky top-0 z-40 border-b border-slate-200 dark:border-slate-800 px-8 flex items-center justify-between">
           <div className="flex items-center gap-2">
              <span className="text-slate-400 dark:text-slate-600 font-mono text-[10px] uppercase">Status:</span>
              <span className="font-black text-xs uppercase tracking-[0.2em] text-rose-600">{activeSection}</span>
           </div>
           
           <div className="flex items-center gap-6">
              <div className="hidden sm:flex items-center gap-3 text-rose-600 bg-rose-50 dark:bg-rose-900/20 px-4 py-2 rounded-2xl border border-rose-100 dark:border-rose-900/50 shadow-sm shadow-rose-500/10">
                <ShieldCheck size={16} />
                <span className="text-[11px] font-black uppercase tracking-[0.15em]">PEDSOCORRO PROTOCOLS</span>
              </div>
              <button 
                onClick={() => setIsDark(!isDark)}
                className="w-11 h-11 rounded-2xl bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 flex items-center justify-center text-slate-500 dark:text-slate-400 hover:scale-105 active:scale-95 transition-all shadow-sm"
              >
                {isDark ? <Sun size={20} /> : <Moon size={20} />}
              </button>
           </div>
        </header>

        {/* Content Area */}
        <main className="p-4 md:p-10 max-w-7xl mx-auto min-h-[calc(100vh-80px)]">
           <AnimatePresence mode="wait">

              {activeSection === 'ubs' && <motion.div key="ub" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SectionTitle title="Atenção Básica / UBS" subtitle="Protocolos de vigilância, pré-natal, doenças crônicas e escores de saúde mental." icon={Stethoscope} /><UbsModule activeSubTab={selectedUbsSubTab} setActiveSubTab={setSelectedUbsSubTab} selectedGuiaDiseaseId={selectedUbsDiseaseId} setSelectedGuiaDiseaseId={setSelectedUbsDiseaseId} /></motion.div>}
              {activeSection === 'emergency' && <motion.div key="em" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SectionTitle title="Pronto Socorro" subtitle="Protocolos de emergência, exames imediatos e condutas críticas." icon={ShieldAlert} /><EmergencyModule onSelect={setSelectedDisease} /></motion.div>}
              {activeSection === 'dashboard' && <motion.div key="db" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><Dashboard setActiveSection={setActiveSection} addToHistory={addToHistory} setSelectedDisease={setSelectedDisease} setSelectedUbsDiseaseId={setSelectedUbsDiseaseId} setSelectedUbsSubTab={setSelectedUbsSubTab} /></motion.div>}
              {activeSection === 'drugs' && <motion.div key="dr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SectionTitle title="Guia de Dosagem" subtitle="Doses recomendadas para prática clínica hospitalar e ambulatorial." icon={Pill} /><DrugsModule /></motion.div>}
              {activeSection === 'calculators' && <motion.div key="ca" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SectionTitle title="Calculadoras Clínicas" subtitle="Scores de gravidade, função renal e ferramentas de screening." icon={Calculator} /><CalculatorModule addToHistory={addToHistory} /></motion.div>}
              {activeSection === 'summaries' && <motion.div key="su" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><SummaryModule /></motion.div>}
              
              {activeSection === 'flowcharts' && (
                <motion.div key="fl" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-8">
                   <SectionTitle title="Fluxogramas de Conduta" subtitle="Diretrizes interativas baseadas em consensos atualizados." icon={Activity} />
                   <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
                       <FlowchartHydration />
                       <FlowchartTEP />
                       <FlowchartSepsis />
                      <FlowchartACLS />
                      <FlowchartTachy />
                      <FlowchartBrady />
                      <FlowchartStroke />
                      <FlowchartAsthma />
                      <FlowchartGIBleed />
                      <FlowchartHyperkalemia />
                      <FlowchartHypertension />
                      <FlowchartShock />
                      <FlowchartAnaphylaxis />
                   </div>
                </motion.div>
              )}

              {activeSection === 'prescriptions' && (
                <motion.div key="pr" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}>
                   <PrescriptionGuide />
                </motion.div>
              )}

              {activeSection === 'lab' && <motion.div key="lb" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }}><LabModule /></motion.div>}
              {activeSection === 'history' && (
                <motion.div key="hi" initial={{ opacity: 0, y: 10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0 }} className="space-y-6">
                   <SectionTitle title="Histórico de Atividades" subtitle="Seus últimos 20 cálculos realizados neste dispositivo." icon={History} />
                   {history.length > 0 ? (
                     <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                        {history.map(item => (
                          <div key={item.id} className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm hover:shadow-md transition-all">
                             <div className="flex justify-between items-start mb-4">
                                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest">{item.date}</span>
                                <div className="w-8 h-8 rounded-full bg-medical-primary/10 flex items-center justify-center text-medical-primary">
                                   <Calculator size={14} />
                                </div>
                             </div>
                             <h4 className="font-bold text-slate-700 dark:text-slate-200 mb-1">{item.title}</h4>
                             <p className="text-2xl font-black text-medical-primary">{item.result}</p>
                          </div>
                        ))}
                        <button 
                          onClick={() => { setHistory([]); localStorage.removeItem('med_history'); }}
                          className="md:col-span-2 lg:col-span-3 py-4 text-rose-500 font-bold text-sm hover:bg-rose-50 rounded-2xl transition-colors mt-4"
                        >
                          Limpar Todo o Histórico
                        </button>
                     </div>
                   ) : (
                     <div className="text-center py-20 bg-slate-50 dark:bg-slate-900/50 rounded-[40px] border border-dashed border-slate-200 dark:border-slate-700">
                        <div className="w-20 h-20 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-6">
                          <History className="text-slate-300" size={32} />
                        </div>
                        <h3 className="text-xl font-bold dark:text-white">Sem histórico recente</h3>
                        <p className="text-slate-500 mt-2">Os cálculos realizados nas ferramentas aparecerão aqui.</p>
                     </div>
                   )}
                </motion.div>
              )}
           </AnimatePresence>
        </main>

        {/* Disease Detail Modal */}
        <AnimatePresence>
          {selectedDisease && (
            <div className="fixed inset-0 z-[100] flex items-center justify-center p-4 md:p-8">
              <motion.div 
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                onClick={() => setSelectedDisease(null)}
                className="absolute inset-0 bg-slate-950/60 backdrop-blur-md"
              />
              <motion.div 
                initial={{ opacity: 0, scale: 0.9, y: 20 }}
                animate={{ opacity: 1, scale: 1, y: 0 }}
                exit={{ opacity: 0, scale: 0.9, y: 20 }}
                className="relative w-full max-w-4xl bg-white dark:bg-slate-900 rounded-[40px] shadow-2xl overflow-hidden overflow-y-auto max-h-[90vh] custom-scrollbar"
              >
                <div className="p-10 border-b border-slate-100 dark:border-slate-800 flex justify-between items-start bg-slate-50/50 dark:bg-slate-800/50 backdrop-blur-sm sticky top-0 z-10">
                  <div>
                    <span className={`inline-block px-4 py-1.5 rounded-xl text-[10px] font-black uppercase tracking-widest mb-4 shadow-sm ${
                      selectedDisease.category.includes('Vermelho') ? 'bg-rose-500 text-white shadow-rose-500/20' : 
                      selectedDisease.category.includes('Amarelo') ? 'bg-amber-500 text-white shadow-amber-500/20' : 
                      'bg-emerald-500 text-white shadow-emerald-500/20'
                    }`}>
                      {selectedDisease.category}
                    </span>
                    <h2 className="text-4xl font-serif font-black italic tracking-tighter text-slate-800 dark:text-white leading-tight">
                      {selectedDisease.title}
                    </h2>
                  </div>
                  <button 
                    onClick={() => setSelectedDisease(null)}
                    className="p-4 bg-white dark:bg-slate-800 rounded-2xl shadow-sm border border-slate-200 dark:border-slate-700 hover:bg-rose-50 dark:hover:bg-rose-900/20 hover:text-rose-600 transition-all"
                  >
                    <X size={24} />
                  </button>
                </div>

                <div className="p-10 space-y-10">
                  <div className="grid md:grid-cols-1 gap-8">
                    <div>
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <Activity size={14} className="text-rose-600" /> Conduta e Manejo Clínico
                      </h4>
                      <div className="space-y-4">
                        {selectedDisease.items.map((item, idx) => (
                          <div key={idx} className="flex gap-6 p-6 rounded-3xl bg-slate-50 dark:bg-slate-800/40 border border-slate-100 dark:border-slate-800 group hover:border-rose-500/30 transition-colors">
                            <div className="w-10 h-10 rounded-2xl bg-rose-600/10 flex items-center justify-center text-rose-600 shrink-0 font-bold text-base shadow-sm group-hover:bg-rose-600 group-hover:text-white transition-all">
                              {idx + 1}
                            </div>
                            <p className="text-slate-700 dark:text-slate-300 text-base leading-relaxed font-medium">{item}</p>
                          </div>
                        ))}
                      </div>
                    </div>
                  </div>

                  {selectedDisease.guidelines && (
                    <div className="pt-6 border-t border-slate-100 dark:border-slate-800">
                      <h4 className="text-[10px] font-black uppercase tracking-[0.2em] text-slate-400 mb-6 flex items-center gap-2">
                        <Bookmark size={14} className="text-rose-600" /> Observações & Guidelines
                      </h4>
                      <div className="p-8 bg-rose-600/5 border-l-4 border-rose-600 rounded-r-3xl">
                         <p className="text-base text-slate-800 dark:text-slate-200 font-medium leading-relaxed italic">
                           " {selectedDisease.guidelines} "
                         </p>
                      </div>
                    </div>
                  )}
                </div>

                <div className="p-10 border-t border-slate-100 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-800/50 flex justify-center">
                   <button 
                     onClick={() => setSelectedDisease(null)}
                     className="w-full py-5 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-3xl font-black uppercase tracking-widest text-sm hover:scale-[1.02] active:scale-95 transition-all shadow-2xl shadow-slate-950/20"
                   >
                     Protocolo Lido & Compreendido
                   </button>
                </div>
              </motion.div>
            </div>
          )}
        </AnimatePresence>

        <footer className="p-8 border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-md">
           <div className="flex flex-col md:flex-row justify-between items-center gap-4 text-xs font-medium text-slate-400">
              <div className="flex items-center gap-2">
                 <ShieldCheck size={14} className="text-rose-500" />
                 <span>Protocolos revisados 2026.1 - Base Pedsocorro Integrada</span>
              </div>
              <div className="flex gap-6 uppercase tracking-widest text-[10px]">
                 <a href="#" className="hover:text-rose-600">Diretrizes</a>
                 <a href="#" className="hover:text-rose-600">LGPD</a>
                 <a href="#" className="hover:text-rose-600">Feedback</a>
              </div>
              <p>&copy; 2026 Pedsocorro. Uso Profissional.</p>
           </div>
        </footer>
      </div>
    </div>
  );
}

