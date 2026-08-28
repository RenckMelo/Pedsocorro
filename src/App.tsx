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
  Clock,
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
  Plus,
  Lock,
  Key,
  Eye,
  EyeOff,
  MessageSquarePlus
} from 'lucide-react';
import { motion, AnimatePresence } from 'motion/react';
import { UBS_CATALOG_DISEASES, PS_CATALOG_DISEASES, DiseaseInfo } from './ubsCatalog';
import SymptomDiagnosticModule from './components/SymptomDiagnosticModule';
import AmbulatoriosModule from './components/AmbulatoriosModule';
import FormsModule from './components/FormulariosModule';
import AuthScreen, { getCurrentUser } from './components/AuthModule';
import NotesModule from './components/NotesModule';
import { User } from './types';

// --- Mental Health Screening Constants ---
const PHQ9_QUESTIONS = [
  "Pouco interesse ou prazer em fazer as coisas",
  "Sentir-se para baixo, deprimido(a) ou sem perspectiva",
  "Dificuldade para adormecer ou dormir demais, ou acordar no meio da noite",
  "Sentir-se cansado(a) ou com pouca energia",
  "Falta de apetite ou comer demais",
  "Sentir-se mal consigo mesmo(a) ou achar que Ã© um fracasso para si ou sua famÃ­lia",
  "Dificuldade para se concentrar nas coisas (ex: ler notÃ­cias, ver televisÃ£o)",
  "Mover-se ou falar tÃ£o lentamente que outras pessoas percebem, ou o oposto: inquietaÃ§Ã£o",
  "Pensamentos de que seria melhor morrer ou se machucar de alguma maneira"
];

const GAD7_QUESTIONS = [
  "Sentir-se nervoso(a), ansioso(a) ou muito tenso(a)",
  "NÃ£o ser capaz de parar ou controlar as preocupaÃ§Ãµes",
  "Preocupar-se demais com diversas coisas diferentes",
  "Dificuldade para relaxar",
  "Ficar tÃ£o inquieto(a) que Ã© difÃ­cil permanecer sentado(a)",
  "Ficar facilmente irritÃ¡vel ou aborrecido(a)",
  "Sentir medo, como se algo terrÃ­vel pudesse acontecer"
];

const MENTAL_OPTIONS = [
  { value: 0, label: "Nenhum dia" },
  { value: 1, label: "VÃ¡rios dias" },
  { value: 2, label: "Mais da metade dos dias" },
  { value: 3, label: "Quase todos os dias" }
];

// --- Types ---
type AppSection = 'dashboard' | 'drugs' | 'calculators' | 'flowcharts' | 'prescriptions' | 'summaries' | 'history' | 'lab' | 'emergency' | 'ambulatorio' | 'ubs' | 'symptoms' | 'forms' | 'notes' | 'auth';

export interface Medication {
  id: string;
  name: string;
  indication: string;
  dose: string;
  frequency: string;
  presentation: string;
  renalAdjustment?: string;
  notes: string;
  category: string;
}

export const normalizeText = (str: string): string => {
  if (!str) return '';
  return str
    .normalize('NFD')
    .replace(/[\u0300-\u036f]/g, '')
    .toLowerCase();
};

// --- Data ---
export const MEDICATIONS: Medication[] = [
  // --- ANALGÃ‰SICOS & ANTI-INFLAMATÃ“RIOS ---
  {
    id: 'm1',
    name: 'Dipirona SÃ³dica',
    indication: 'Dor aguda, febre alta, cÃ³licas',
    dose: '500mg a 1g (Adulto) / 10-15 mg/kg (Pediatria)',
    frequency: '6/6h ou 4/4h (MÃ¡x 4g/dia)',
    presentation: '500mg (Comp), 500mg/mL (Gotas - 1g=40gotas), 1g/2mL (Ampola EV/IM)',
    renalAdjustment: 'NÃ£o requer ajuste em dose Ãºnica. Reduzir em DRC severa.',
    category: 'AnalgÃ©sico',
    notes: 'Injetar EV lentamente para evitar hipotensÃ£o. Contraindicado se agranulocitose prÃ©via ou alergia a pirazolonas.'
  },
  {
    id: 'm2',
    name: 'Paracetamol',
    indication: 'Dor leve a moderada, febre (Seguro em Dengue e Gestantes)',
    dose: '500mg a 1000mg (Adulto) / 10-15 mg/kg (Pediatria)',
    frequency: '6/6h ou 4/4h (MÃ¡x 4g/dia)',
    presentation: '500mg, 750mg (Comp), 200mg/mL (Gotas - 10mg/gota), 32mg/mL (Xarope)',
    renalAdjustment: 'ClCr < 10 mL/min: estender intervalo para 8/8h.',
    category: 'AnalgÃ©sico',
    notes: 'AnalgÃ©sico de escolha na Dengue e Zika. Risco de hepatotoxidade grave em doses > 4g/dia ou hepatopatia prÃ©via.'
  },
  {
    id: 'm3',
    name: 'Ibuprofeno',
    indication: 'Dor, febre, inflamaÃ§Ã£o musculoesquelÃ©tica, dismenorreia',
    dose: '300mg a 600mg (Adulto) / 5-10 mg/kg (Pediatria)',
    frequency: '6/6h ou 8/8h (MÃ¡x 2400mg/dia)',
    presentation: '300mg, 600mg (Comp), 50mg/mL (Gotas - 2.5mg/gota), 100mg/5mL (SuspensÃ£o)',
    renalAdjustment: 'Evitar uso em ClCr < 30 mL/min ou InjÃºria Renal Aguda.',
    category: 'AnalgÃ©sico',
    notes: 'AINE nÃ£o seletivo. Tomar apÃ³s refeiÃ§Ãµes. Contraindicado na suspeita de Dengue e em Ãºlcera pÃ©ptica ativa.'
  },
  {
    id: 'm4',
    name: 'Cetoprofeno',
    indication: 'Dor osteomuscular intensa, cÃ³lica renal, gota, pÃ³s-operatÃ³rio',
    dose: '100mg VO / 100mg EV em 100mL SF0.9% em 20 min',
    frequency: '12/12h (MÃ¡x 300mg/dia)',
    presentation: '50mg, 100mg (Caps), 100mg IV (PÃ³ para diluiÃ§Ã£o), 2.5% Gel',
    renalAdjustment: 'Contraindicado em insuficiÃªncia renal grave.',
    category: 'AnalgÃ©sico',
    notes: 'Excelente AINE para dor traumÃ¡tica e Renal. Evitar infusÃ£o EV rÃ¡pida em bolus.'
  },
  {
    id: 'm5',
    name: 'Diclofenaco SÃ³dico / PotÃ¡ssico',
    indication: 'InflamaÃ§Ã£o aguda, lombalgia, artralgia, dor pÃ³s-traumÃ¡tica',
    dose: '50mg a 75mg IM/VO',
    frequency: '8/8h ou 12/12h (MÃ¡x 150mg/dia)',
    presentation: '50mg (Comp), 75mg/3mL (Ampola IM profunda)',
    renalAdjustment: 'Evitar em ClCr < 30 mL/min.',
    category: 'AnalgÃ©sico',
    notes: 'Ampola exclusivamente IM profunda no glÃºteo. Risco gastrointestinal e de piora da funÃ§Ã£o renal.'
  },
  {
    id: 'm6',
    name: 'Nimesulida',
    indication: 'Processos inflamatÃ³rios agudos, IVAS, otalgia, odontalgia',
    dose: '100mg VO / 50mg/mL (Gotas pediÃ¡tricas 1 gta/kg)',
    frequency: '12/12h por no mÃ¡ximo 5 a 7 dias',
    presentation: '100mg (Comp), 50mg/mL (Gotas)',
    renalAdjustment: 'Evitar em doenÃ§a renal grave.',
    category: 'AnalgÃ©sico',
    notes: 'Risco de hepatotoxicidade idiosincrÃ¡sica. Utilizar a menor dose pelo menor tempo possÃ­vel.'
  },
  {
    id: 'm7',
    name: 'Meloxicam',
    indication: 'Osteoartrite, artrite reumatÃ³ide, espondilite anquilosante',
    dose: '7.5mg a 15mg VO',
    frequency: '24/24h (Dose Ãºnica diÃ¡ria)',
    presentation: '7.5mg, 15mg (Comprimidos)',
    renalAdjustment: 'Reduzir dose em insuficiÃªncia renal grave.',
    category: 'AnalgÃ©sico',
    notes: 'AINE preferencialmente COX-2 com boa tolerabilidade gÃ¡strica e posologia confortÃ¡vel de 1x/dia.'
  },
  {
    id: 'm8',
    name: 'Celecoxibe',
    indication: 'Dor crÃ´nica articular, osteoartrite, gota aguda (Paciente com risco gÃ¡strico)',
    dose: '100mg a 200mg VO',
    frequency: '12/12h ou 24/24h',
    presentation: '100mg, 200mg (CÃ¡psulas)',
    renalAdjustment: 'NÃ£o recomendado em insuficiÃªncia renal grave.',
    category: 'AnalgÃ©sico',
    notes: 'Inibidor seletivo da COX-2. MÃ­nimo risco gÃ¡strico. Usar com cautela em pacientes com alto risco cardiovascular.'
  },
  {
    id: 'm9',
    name: 'Tramadol',
    indication: 'Dor moderada a intensa refratÃ¡ria a AINEs, dor pÃ³s-operatÃ³ria',
    dose: '50mg a 100mg VO / 50-100mg EV diluÃ­do em 100mL SF em 20min',
    frequency: '6/6h ou 8/8h (MÃ¡x 400mg/dia)',
    presentation: '50mg (Caps), 100mg/mL (Gotas - 2.5mg/gota), 50mg/mL, 100mg/2mL (Ampolas EV/IM)',
    renalAdjustment: 'ClCr < 30 mL/min: estender intervalo para 12/12h (MÃ¡x 200mg/dia).',
    category: 'AnalgÃ©sico',
    notes: 'Opioide fraco + inibidor de recaptaÃ§Ã£o de serotonina/noradrenalina. Pode causar nÃ¡usea, tontura e convulsÃ£o em doses altas.'
  },
  {
    id: 'm10',
    name: 'CodeÃ­na (Paracetamol + CodeÃ­na)',
    indication: 'Dor moderada, tosse seca refratÃ¡ria',
    dose: '30mg de CodeÃ­na + 500mg Paracetamol VO',
    frequency: '6/6h ou 4/4h conforme necessidade',
    presentation: '30mg (Comp), 30mg/500mg (Tylex / Paco)',
    renalAdjustment: 'ClCr 10-50 mL/min: administrar 75% da dose.',
    category: 'AnalgÃ©sico',
    notes: 'Opioide fraco convertido em morfina no fÃ­gado (CYP2D6). Pode causar constipaÃ§Ã£o intestinal marcante e sonolÃªncia.'
  },
  {
    id: 'm11',
    name: 'Morfina',
    indication: 'Dor severa aguda (IAM, Trauma, Queimaduras, Dor OncolÃ³gica)',
    dose: '2mg a 5mg EV fracionado de 5/5min (Adulto) / 0.05-0.1 mg/kg',
    frequency: '4/4h ou contÃ­nuo em bomba de infusÃ£o',
    presentation: '10mg/mL (Ampola EV/SC), 10mg, 30mg (Dimorf Comp VO), 10mg/mL SoluÃ§Ã£o Oral',
    renalAdjustment: 'AcÃºmulo de metabÃ³litos ativos (M6G/M3G) em DRC; reduzir dose e aumentar intervalo.',
    category: 'EmergÃªncia',
    notes: 'Opioide forte padrÃ£o-ouro. Ter Naloxona disponÃ­vel no leito em caso de depressÃ£o respiratÃ³ria ou miose puntiforme.'
  },
  {
    id: 'm12',
    name: 'Fentanil',
    indication: 'Analgesia e sedaÃ§Ã£o profunda em UTI, intubaÃ§Ã£o (RSI), analgesia cirÃºrgica',
    dose: '1 a 5 mcg/kg EV (Ataque) / 0.5 a 3 mcg/kg/h (ManutenÃ§Ã£o em BCI)',
    frequency: 'InfusÃ£o contÃ­nua ou bolus criterioso',
    presentation: '50 mcg/mL (Frascos-ampola de 2mL, 5mL, 10mL)',
    renalAdjustment: 'Seguro em insuficiÃªncia renal (sem metabÃ³litos ativos tÃ³xicos).',
    category: 'EmergÃªncia',
    notes: 'Opioide sintÃ©tico 100x mais potente que a morfina. Risco de "TÃ³rax RÃ­gido" se injetado em bolus EV muito rÃ¡pido.'
  },
  {
    id: 'm13',
    name: 'Ciclobenzaprina',
    indication: 'Espasmo muscular esquelÃ©tico agudo, lombalgia, cervicalgia, fibromialgia',
    dose: '5mg a 10mg VO ao deitar',
    frequency: '8/8h ou noites (MÃ¡x 30mg/dia por 2 semanas)',
    presentation: '5mg, 10mg (Miosan / Mirtax)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'AnalgÃ©sico',
    notes: 'Relaxante muscular de aÃ§Ã£o central estruturalmente similar aos tricÃ­clicos. Causa boca seca, sonolÃªncia e retenÃ§Ã£o urinÃ¡ria.'
  },
  {
    id: 'm14',
    name: 'Dorflex (Orfenadrina + Dipirona + CafeÃ­na)',
    indication: 'Cefaleia tensional, contratura muscular, dorsalgia',
    dose: '1 a 2 comprimidos VO ou 30 a 60 gotas',
    frequency: '6/6h ou 8/8h',
    presentation: 'Comprimidos e Gotas orais',
    renalAdjustment: 'Usar com cautela em insuficiÃªncia renal.',
    category: 'AnalgÃ©sico',
    notes: 'CombinaÃ§Ã£o analgÃ©sica com relaxante muscular. Cuidado com dependÃªncia secundÃ¡ria a cafeÃ­na e abuso crÃ´nico.'
  },

  // --- ANTIBIÃ“TICOS E ANTIMICROBIANOS ---
  {
    id: 'm15',
    name: 'Amoxicilina',
    indication: 'Otite MÃ©dia Aguda, Sinusite, Amigdalite, Pneumonia ComunitÃ¡ria Leve',
    dose: '500mg VO de 8/8h ou 875mg de 12/12h (Pediatria: 50 a 90 mg/kg/dia)',
    frequency: '8/8h ou 12/12h por 7 a 10 dias',
    presentation: '500mg, 875mg (Comp), 250mg/5mL, 400mg/5mL (SuspensÃ£o Oral)',
    renalAdjustment: 'ClCr 10-30 mL/min: mÃ¡ximo 500mg de 12/12h.',
    category: 'AntibiÃ³tico',
    notes: 'Penicilina de amplo espectro. Dose alta (90 mg/kg/dia) indicada em Ã¡reas com pneumococo resistente.'
  },
  {
    id: 'm16',
    name: 'Amoxicilina + Clavulanato',
    indication: 'InfecÃ§Ãµes por germes produtores de beta-lactamase (Sinusite refratÃ¡ria, Mordedura animal, Bronquiectasias, Pielonefrite)',
    dose: '500/125mg 8/8h ou 875/125mg 12/12h (Pediatria: 45 a 90 mg/kg/dia de amox)',
    frequency: '8/8h ou 12/12h por 7 a 14 dias',
    presentation: '500/125mg, 875/125mg (Comp), 250+62.5mg/5mL, 400+57mg/5mL (SuspensÃ£o)',
    renalAdjustment: 'ClCr < 30 mL/min: contraindicado uso da apresentaÃ§Ã£o 875/125mg.',
    category: 'AntibiÃ³tico',
    notes: 'Tomar no inÃ­cio das refeiÃ§Ãµes para diminuir diarreia e nÃ¡usea. Risco de hepatite colestÃ¡tica.'
  },
  {
    id: 'm17',
    name: 'Cefalexina',
    indication: 'InfecÃ§Ãµes de pele (Erisipela, Impetigo), ITU nÃ£o complicada, Profilaxia cirÃºrgica',
    dose: '500mg VO de 6/6h (Pediatria: 25 a 50 mg/kg/dia dividido de 6/6h)',
    frequency: '6/6h por 7 a 10 dias',
    presentation: '500mg (Comp/Caps), 250mg/5mL (SuspensÃ£o Oral)',
    renalAdjustment: 'ClCr < 10 mL/min: administrar 250mg a 500mg a cada 12-24h.',
    category: 'AntibiÃ³tico',
    notes: 'Cefalosporina de 1Âª geraÃ§Ã£o. Excelente para Staphylococcus aureus sensÃ­vel e Streptococcus pyogenes.'
  },
  {
    id: 'm18',
    name: 'Ceftriaxona',
    indication: 'Pneumonia Grave, Sepse, Meningite, Pielonefrite, Gonorreia, Febre Tifoide',
    dose: '1g a 2g EV/IM 1x ao dia (Meningite: 2g EV de 12/12h; Gonorreia: 500mg IM dose Ãºnica)',
    frequency: '24/24h ou 12/12h',
    presentation: '500mg, 1g, 2g (Frasco-ampola IV/IM)',
    renalAdjustment: 'Sem necessidade de ajuste se funÃ§Ã£o hepÃ¡tica preservada.',
    category: 'AntibiÃ³tico',
    notes: 'Cefalosporina de 3Âª geraÃ§Ã£o. NÃ£o reconstituir com soluÃ§Ãµes contendo cÃ¡lcio (ex: Ringer Lactato) em recÃ©m-nascidos.'
  },
  {
    id: 'm19',
    name: 'Cefepima',
    indication: 'InfecÃ§Ã£o hospitalar grave, Neutropenia Febril, Pseudomonas aeruginosa',
    dose: '1g a 2g EV de 8/8h ou 12/12h',
    frequency: '8/8h em infecÃ§Ãµes graves',
    presentation: '1g, 2g (Frasco-ampola IV)',
    renalAdjustment: 'ClCr < 50 mL/min: reduzir dose/frequÃªncia para evitar neurotoxicidade (encefalopatia/mioclonias).',
    category: 'AntibiÃ³tico',
    notes: 'Cefalosporina de 4Âª geraÃ§Ã£o com ampla cobertura antipseudomonas e contra enterobactÃ©rias.'
  },
  {
    id: 'm20',
    name: 'Azitromicina',
    indication: 'Pneumonia atÃ­pica (Mycoplasma/Chlamydia), DST (ClamÃ­dia/Uretrite), Coqueluche, Diarreia por Campylobacter',
    dose: '500mg VO 1x ao dia por 3 a 5 dias (Uretrite por ClamÃ­dia: 1g VO dose Ãºnica)',
    frequency: '24/24h (Pediatria: 10 mg/kg/dia 1x/dia por 3-5 dias)',
    presentation: '500mg (Comp), 200mg/5mL (SuspensÃ£o Oral), 500mg IV',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'AntibiÃ³tico',
    notes: 'MacrolÃ­deo de meia-vida longa (68h). Pode prolongar o intervalo QT no ECG.'
  },
  {
    id: 'm21',
    name: 'Ciprofloxacino',
    indication: 'InfecÃ§Ã£o UrinÃ¡ria Complicada, Prostatite, Diarreia Bacteriana, InfecÃ§Ã£o Intra-abdominal',
    dose: '500mg VO 12/12h ou 400mg EV 12/12h',
    frequency: '12/12h por 7 a 14 dias',
    presentation: '500mg (Comp), 2mg/mL (Bolsa de 100mL/200mL para InfusÃ£o EV)',
    renalAdjustment: 'ClCr < 30 mL/min: 250mg-500mg de 18/18h ou 24/24h.',
    category: 'AntibiÃ³tico',
    notes: 'Fluoroquinolona. Alerta do FDA para risco de tendinite/ruptura do tendÃ£o de Aquiles, neurotoxicidade e aneurisma de aorta.'
  },
  {
    id: 'm22',
    name: 'Levofloxacino',
    indication: 'Pneumonia ComunitÃ¡ria Grave, Sinusite Bacteriana Aguda, Pielonefrite',
    dose: '500mg a 750mg VO/EV 1x ao dia',
    frequency: '24/24h por 5 a 14 dias',
    presentation: '500mg, 750mg (Comp e Bolsas EV)',
    renalAdjustment: 'ClCr < 50 mL/min: ajustar dose e frequÃªncia.',
    category: 'AntibiÃ³tico',
    notes: 'Quinolona respiratÃ³ria com excelente cobertura contra Streptococcus pneumoniae e germes atÃ­picos.'
  },
  {
    id: 'm23',
    name: 'Doxiciclina',
    indication: 'Febre Maculosa, Leptospirose, ClamÃ­dia, Acne Vulgar, DoenÃ§a de Lyme, Pneumonia AtÃ­pica',
    dose: '100mg VO de 12/12h',
    frequency: '12/12h por 7 a 14 dias',
    presentation: '100mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste em insuficiÃªncia renal.',
    category: 'AntibiÃ³tico',
    notes: 'Tetraciclina. Tomar com copo cheio de Ã¡gua e evitar deitar-se em seguida (esofagite). Evitar em gestantes e crianÃ§as < 8 anos.'
  },
  {
    id: 'm24',
    name: 'Sulfametoxazol + Trimetoprima (Bactrim)',
    indication: 'Pneumocistose (PJP), ITU, Nocardiose, IsosporÃ­ase, ExacerbaÃ§Ã£o de DPOC',
    dose: '800/160mg (1 comp Forte) VO de 12/12h (Tratamento PJP: 15-20 mg/kg/dia de TMP)',
    frequency: '12/12h ou 8/8h',
    presentation: '400/80mg, 800/160mg (Comp), 200+40mg/5mL (SuspensÃ£o), Ampola EV',
    renalAdjustment: 'ClCr 15-30 mL/min: metade da dose. ClCr < 15: evitar.',
    category: 'AntibiÃ³tico',
    notes: 'InibiÃ§Ã£o sequencial do fÃ³lico. Risco de hipercalemia, mielossupressÃ£o e SÃ­ndrome de Stevens-Johnson.'
  },
  {
    id: 'm25',
    name: 'NitrofurantoÃ­na',
    indication: 'Cistite Aguda nÃ£o complicada em mulheres, Profilaxia de ITU de repetiÃ§Ã£o',
    dose: '100mg VO de 6/6h (Tratamento 5 dias) / 100mg Ã  noite (Profilaxia)',
    frequency: '6/6h por 5 dias ou 1x/noite',
    presentation: '100mg (CÃ¡psulas)',
    renalAdjustment: 'Contraindicado em ClCr < 30 mL/min (ineficaz na via urinÃ¡ria e risco de toxicidade).',
    category: 'AntibiÃ³tico',
    notes: 'Atua exclusivamente no trato urinÃ¡rio inferior. Excelente opÃ§Ã£o poupadora de quinolonas.'
  },
  {
    id: 'm26',
    name: 'Fosfomicina Trometamol',
    indication: 'Cistite Aguda nÃ£o complicada em mulheres e gestantes',
    dose: '3g VO em envelope dissolvido em meio copo de Ã¡gua',
    frequency: 'DOSE ÃšNICA (em jejum ou ao deitar)',
    presentation: '3g (SachÃª envelope)',
    renalAdjustment: 'Sem necessidade de ajuste.',
    category: 'AntibiÃ³tico',
    notes: 'Mantenha alta concentraÃ§Ã£o urinÃ¡ria por atÃ© 36-48h. AltÃ­ssima comodidade posolÃ³gica.'
  },
  {
    id: 'm27',
    name: 'Metronidazol',
    indication: 'TricomonÃ­ase, Vaginose Bacteriana, GiardÃ­ase, AmebÃ­ase, InfecÃ§Ã£o por AnaerÃ³bios',
    dose: '250mg a 500mg VO de 8/8h ou 2g VO dose Ãºnica (TricomonÃ­ase) / 500mg EV 8/8h',
    frequency: '8/8h por 7 dias ou dose Ãºnica',
    presentation: '250mg, 400mg (Comp), 5mg/mL (Bolsa de 100mL EV), Gel vaginal 0.75%',
    renalAdjustment: 'ClCr < 10 mL/min: administrar 50% da dose.',
    category: 'AntibiÃ³tico',
    notes: 'Efeito Dissulfiram (ReaÃ§Ã£o tipo Antabuse) - PROIBIDO consumo de bebidas alcoÃ³licas durante e atÃ© 48h apÃ³s o tÃ©rmino.'
  },
  {
    id: 'm28',
    name: 'Clindamicina',
    indication: 'InfecÃ§Ãµes de Pele/Partes Moles, Abscesso Pulmonar, Osteomielite por Staphylococcus/AnaerÃ³bios',
    dose: '300mg a 450mg VO 6/6h ou 600mg a 900mg EV de 8/8h',
    frequency: '6/6h a 8/8h',
    presentation: '300mg (Caps), 150mg/mL (Ampola de 4mL e 6mL EV/IM)',
    renalAdjustment: 'Sem necessidade de ajuste renal.',
    category: 'AntibiÃ³tico',
    notes: 'Lincosamida com excelente penetraÃ§Ã£o Ã³ssea e tecidual. Principal causa de Colite Pseudomembranosa por Clostridioides difficile.'
  },
  {
    id: 'm29',
    name: 'Vancomicina',
    indication: 'InfecÃ§Ãµes graves por MRSA (Staphylococcus aureus resistente Ã  metacilina), Endocardite, Colite por C. difficile (VO)',
    dose: '15 a 20 mg/kg EV de 8/8h ou 12/12h (Alvo de Vancocinemia de vale: 15-20 mcg/mL)',
    frequency: '8/8h ou 12/12h em infusÃ£o lenta de 60min',
    presentation: '500mg, 1g (Frasco-ampola p/ diluiÃ§Ã£o EV)',
    renalAdjustment: 'Ajuste estrito guiado por dosagem de vancocinemia serum e ClCr.',
    category: 'AntibiÃ³tico',
    notes: 'GlicopeptÃ­deo. InfusÃ£o rÃ¡pida causa "SÃ­ndrome do Homem Vermelho" (liberaÃ§Ã£o de histamina). Monitorar funÃ§Ã£o renal.'
  },
  {
    id: 'm30',
    name: 'Meropenem',
    indication: 'InfecÃ§Ãµes intra-abdominais graves, Sepse fÃºngica/bacteriana, Neutropenia febril, Germes ESBL+',
    dose: '1g a 2g EV de 8/8h (Meningite: 2g de 8/8h em infusÃ£o estendida de 3 horas)',
    frequency: '8/8h',
    presentation: '500mg, 1g (Frasco-ampola IV)',
    renalAdjustment: 'ClCr 26-50: 1g de 12/12h; ClCr 10-25: 500mg de 12/12h; ClCr < 10: 500mg de 24/24h.',
    category: 'AntibiÃ³tico',
    notes: 'CarbapenÃªmico de ultralargo espectro. Menor risco convulsivante que o imipenem.'
  },
  {
    id: 'm31',
    name: 'Piperacilina + Tazobactam (Tazocin)',
    indication: 'InfecÃ§Ã£o hospitalar, Pneumonia associada Ã  ventilaÃ§Ã£o, Sepse abdominal, Pseudomonas',
    dose: '4.5g EV de 6/6h (ou infusÃ£o estendida de 3h a 4h)',
    frequency: '6/6h ou 8/8h',
    presentation: '4.5g (Frasco-ampola IV)',
    renalAdjustment: 'Ajustar dose conforme ClCr (ex: ClCr 20-40: 3.375g 6/6h).',
    category: 'AntibiÃ³tico',
    notes: 'Penicilina antipseudomonas + inibidor de beta-lactamase. Pode causar trombocitopenia e nefrite intersticial.'
  },

  // --- ANTIVIRAIS & ANTIFÃšNGICOS ---
  {
    id: 'm32',
    name: 'Aciclovir',
    indication: 'Herpes Simplex (Labial/Genital), Herpes Zoster, Encefalite HerpÃ©tica',
    dose: '200mg VO 5x/dia (Herpes Simplex) / 800mg VO 5x/dia (Zoster) / 10mg/kg EV 8/8h (Encefalite)',
    frequency: '5x ao dia (a cada 4h acordado) por 7 a 10 dias',
    presentation: '200mg, 400mg (Comp), 250mg (Frasco-ampola IV), Creme dermatolÃ³gico 5%',
    renalAdjustment: 'ClCr < 10 mL/min: ajustar dose para 200mg de 12/12h.',
    category: 'Antiviral',
    notes: 'Manter excelente hidrataÃ§Ã£o venosa/oral durante uso de aciclovir EV para evitar cristalÃºria e insuficiÃªncia renal aguda.'
  },
  {
    id: 'm33',
    name: 'Oseltamivir (Tamiflu)',
    indication: 'Tratamento e profilaxia de Influenza A e B (H1N1/H3N2) em pacientes de risco ou SRAG',
    dose: '75mg VO de 12/12h por 5 dias (Pediatria: dose por faixa de peso de 30mg a 75mg)',
    frequency: '12/12h por 5 dias consecutivos',
    presentation: '30mg, 45mg, 75mg (CÃ¡psulas) / PÃ³ para suspensÃ£o oral',
    renalAdjustment: 'ClCr 30-60: 30mg 12/12h; ClCr 10-30: 30mg 24/24h.',
    category: 'Antiviral',
    notes: 'Idealmente iniciar nas primeiras 48h do inÃ­cio dos sintomas gripais, mas deve ser mantido mesmo apÃ³s se houver gravidade.'
  },
  {
    id: 'm34',
    name: 'Fluconazol',
    indication: 'CandidÃ­ase Vulvovaginal, CandidÃ­ase Oral/EsofÃ¡gica, Criptococose',
    dose: '150mg VO dose Ãºnica (Vaginal) ou 200mg-400mg VO/EV 1x ao dia (SistÃªmico)',
    frequency: 'Dose Ãºnica ou 24/24h por 7 a 14 dias',
    presentation: '150mg (Caps), 2mg/mL (Bolsa de 100mL EV)',
    renalAdjustment: 'ClCr < 50 mL/min: administrar 50% da dose de manutenÃ§Ã£o.',
    category: 'AntifÃºngico',
    notes: 'TriazÃ³lico. Potente inibidor da CYP3A4 e CYP2C9 (atentar para interaÃ§Ãµes com anticoagulantes e hipoglicemiantes).'
  },
  {
    id: 'm35',
    name: 'Nistatina',
    indication: 'CandidÃ­ase Oral (Sapo), CandidÃ­ase Vaginal',
    dose: '100.000 UI/mL Bochechar e engolir 5mL de 6/6h / 1 aplicador vaginal Ã  noite por 14 dias',
    frequency: '6/6h (Oral) ou 24/24h (Vaginal)',
    presentation: 'SuspensÃ£o Oral 100.000 UI/mL (50mL), Creme Vaginal 25.000 UI/g',
    renalAdjustment: 'NÃ£o absorvido sistemicamente; sem ajuste.',
    category: 'AntifÃºngico',
    notes: 'Agente antifÃºngico polienico de aÃ§Ã£o estritamente tÃ³pica/luminal.'
  },

  // --- ANTIPARASITÃRIOS ---
  {
    id: 'm36',
    name: 'Albendazol',
    indication: 'AscaridÃ­ase, AncilostomÃ­ase, EnterobÃ­ase, GiardÃ­ase, Neurocisticercose',
    dose: '400mg VO mastigÃ¡vel (Dose Ãºnica na maioria das verminoses; 400mg/dia 5 dias na GiardÃ­ase)',
    frequency: 'Dose Ãºnica ou 1x/dia por 3-5 dias',
    presentation: '400mg (Comp MastigÃ¡vel), 40mg/mL (SuspensÃ£o Oral de 10mL)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'AntiparasitÃ¡rio',
    notes: 'Contraindicado no 1Âº trimestre da gestaÃ§Ã£o. Administrar preferencialmente com refeiÃ§Ã£o gordurosa na neurocisticercose.'
  },
  {
    id: 'm37',
    name: 'Ivermectina',
    indication: 'Escabiose (Sarna), Pediculose (Piolho), EstrongiloidÃ­ase, Oncocercose',
    dose: '200 mcg/kg VO em dose Ãºnica em jejum (Ex: 60kg = 2 comprimidos de 6mg)',
    frequency: 'Dose Ãºnica (Repetir apÃ³s 14 dias na escabiose grave)',
    presentation: '6mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'AntiparasitÃ¡rio',
    notes: 'Tomar com Ã¡gua em jejum (1 hora antes da refeiÃ§Ã£o). Contraindicado em crianÃ§as < 15kg ou < 5 anos.'
  },
  {
    id: 'm38',
    name: 'Nitazoxanida (Annita)',
    indication: 'Gastroenterite por Giardia lamblia, Cryptosporidium, HelmintÃ­ases mistas',
    dose: '500mg VO de 12/12h por 3 dias (Pediatria: 7.5 mg/kg de 12/12h)',
    frequency: '12/12h por 3 dias consecutivos',
    presentation: '500mg (Comp), 20mg/mL (PÃ³ para suspensÃ£o oral)',
    renalAdjustment: 'Usar com cautela em insuficiÃªncia renal grave.',
    category: 'AntiparasitÃ¡rio',
    notes: 'Tomar junto com alimentos. Pode alterar a cor da urina e esperma para amarelo esverdeado intenso.'
  },

  // --- CARDIOVASCULAR & ANTI-HIPERTENSIVOS ---
  {
    id: 'm39',
    name: 'Captopril',
    indication: 'HipertensÃ£o Arterial, Crise Hipertensiva (UrgÃªncia), InsuficiÃªncia CardÃ­aca, PÃ³s-IAM',
    dose: '25mg a 50mg VO/Sublingual',
    frequency: '8/8h ou Sublingual na UrgÃªncia Hipertensiva',
    presentation: '12.5mg, 25mg, 50mg (Comprimidos)',
    renalAdjustment: 'ClCr < 50 mL/min: reduzir dose em 25-50%.',
    category: 'Cardiovascular',
    notes: 'IECA de curta duraÃ§Ã£o. Monitorar PotÃ¡ssio e Creatinina. Contraindicado absoluto na gestaÃ§Ã£o.'
  },
  {
    id: 'm40',
    name: 'Enalapril',
    indication: 'HipertensÃ£o Arterial SistÃªmica, InsuficiÃªncia CardÃ­aca com FraÃ§Ã£o de EjeÃ§Ã£o Reduzida, Nefropatia DiabÃ©tica',
    dose: '5mg a 40mg VO ao dia',
    frequency: '12/12h ou 24/24h',
    presentation: '5mg, 10mg, 20mg (Comprimidos)',
    renalAdjustment: 'ClCr < 30 mL/min: iniciar com 2.5mg ao dia e titular devagar.',
    category: 'Cardiovascular',
    notes: 'IECA de longa aÃ§Ã£o. Causa tosse seca por acÃºmulo de bradicinina em atÃ© 10-15% dos pacientes (trocar por BRA).'
  },
  {
    id: 'm41',
    name: 'Losartana PotÃ¡ssica',
    indication: 'HipertensÃ£o Arterial, IntolerÃ¢ncia ao IECA (Tosse), ProteÃ§Ã£o Renal no DM2, IC',
    dose: '25mg a 100mg VO ao dia',
    frequency: '12/12h ou 24/24h',
    presentation: '25mg, 50mg, 100mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste inicial, mas monitorar hipercalemia se ClCr < 30.',
    category: 'Cardiovascular',
    notes: 'Bloqueador dos Receptores de Angiotensina II (BRA). Excelente tolerabilidade profilÃ¡tica.'
  },
  {
    id: 'm42',
    name: 'Sacubitril + Valsartana (Entresto)',
    indication: 'InsuficiÃªncia CardÃ­aca SintomÃ¡tica com FraÃ§Ã£o de EjeÃ§Ã£o Reduzida (ICFER â‰¤ 40%)',
    dose: '24/26mg a 97/103mg VO',
    frequency: '12/12h',
    presentation: '24/26mg, 49/51mg, 97/103mg (Comprimidos)',
    renalAdjustment: 'Reduzir dose inicial em eTFG < 30 mL/min.',
    category: 'Cardiovascular',
    notes: 'Inibidor da Neprilisina + BRA. Exige janela de "Washout" de 36 horas apÃ³s parar o IECA antes de iniciar.'
  },
  {
    id: 'm43',
    name: 'Atenolol',
    indication: 'HipertensÃ£o, Angina de Peito, Controle de FrequÃªncia na FibrilaÃ§Ã£o Atrial, PÃ³s-IAM',
    dose: '25mg a 100mg VO ao dia',
    frequency: '24/24h',
    presentation: '25mg, 50mg, 100mg (Comprimidos)',
    renalAdjustment: 'ClCr 15-35: mÃ¡x 50mg/dia. ClCr < 15: mÃ¡x 25mg/dia.',
    category: 'Cardiovascular',
    notes: 'Beta-bloqueador beta-1 cardiosseletivo hidrofÃ­lico. Pode piorar broncoespasmo em asmÃ¡ticos nÃ£o controlados.'
  },
  {
    id: 'm44',
    name: 'Carvedilol',
    indication: 'InsuficiÃªncia CardÃ­aca com Fator de EjeÃ§Ã£o Reduzido, PÃ³s-IAM, HipertensÃ£o Arterial',
    dose: '3.125mg a 25mg VO (TitulaÃ§Ã£o progressiva a cada 2 semanas)',
    frequency: '12/12h junto Ã s refeiÃ§Ãµes',
    presentation: '3.125mg, 6.25mg, 12.5mg, 25mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Cardiovascular',
    notes: 'Beta-bloqueador nÃ£o seletivo com aÃ§Ã£o alfa-1 bloqueadora vasodilatadora. Reduz mortalidade na IC.'
  },
  {
    id: 'm45',
    name: 'Metoprolol (Succinato / Tartarato)',
    indication: 'Angina, ICFER (Succinato), Arritmias Supraventriculares, HipertensÃ£o',
    dose: '25mg a 200mg VO ao dia',
    frequency: '24/24h (Succinato de liberaÃ§Ã£o prolongada) ou 12/12h (Tartarato)',
    presentation: '25mg, 50mg, 100mg (Comprimidos Seloken)',
    renalAdjustment: 'NÃ£o requer ajuste em insuficiÃªncia renal.',
    category: 'Cardiovascular',
    notes: 'Beta-1 seletivo. O Succinato de Metoprolol Ã© uma das 3 opÃ§Ãµes de beta-bloqueadores aprovados para IC.'
  },
  {
    id: 'm46',
    name: 'Anlodipino',
    indication: 'HipertensÃ£o Arterial SistÃªmica, Angina EstÃ¡vel e VasospÃ¡stica (Prinzmetal)',
    dose: '2.5mg a 10mg VO ao dia',
    frequency: '24/24h',
    presentation: '2.5mg, 5mg, 10mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Cardiovascular',
    notes: 'Bloqueador de Canais de CÃ¡lcio DihidropiridÃ­nico. Causa vasodilataÃ§Ã£o perifÃ©rica com edema maleolar assintomÃ¡tico.'
  },
  {
    id: 'm47',
    name: 'Nifedipino (Adalat / Retard / OROS)',
    indication: 'HipertensÃ£o na GestaÃ§Ã£o (EmergÃªncia/Crise), TocÃ³lise no Trabalho de Parto Prematuro',
    dose: '10mg a 20mg VO na Crise / 30mg a 60mg OROS ao dia',
    frequency: '8/8h ou 24/24h (FormulaÃ§Ãµes de liberaÃ§Ã£o lenta)',
    presentation: '10mg, 20mg Retard, 30mg, 60mg OROS',
    renalAdjustment: 'Sem necessidade de ajuste.',
    category: 'Cardiovascular',
    notes: 'NUNCA administrar nifedipino de curta aÃ§Ã£o sublingual para urgÃªncia hipertensiva em coronariopatas (risco de roubo coronariano e AVC).'
  },
  {
    id: 'm48',
    name: 'Hidroclorotiazida',
    indication: 'HipertensÃ£o Arterial (Monoterapia ou AssociaÃ§Ã£o), Edema leve',
    dose: '12.5mg a 25mg VO pela manhÃ£',
    frequency: '24/24h (ManhÃ£)',
    presentation: '12.5mg, 25mg (Comprimidos)',
    renalAdjustment: 'Ineficaz como diurÃ©tico isolado se eTFG < 30 mL/min (substituir por diurÃ©tico de alÃ§a).',
    category: 'Cardiovascular',
    notes: 'DiurÃ©tico TiazÃ­dico. Monitorar DVE: hipocalemia, hiponatremia, hiperuricemia (pode desencadear crise de Gota) e hiperglicemia.'
  },
  {
    id: 'm49',
    name: 'Furosemida (Lasix)',
    indication: 'InsuficiÃªncia CardÃ­aca Descompensada (Perfil B/C), Edema Agudo de PulmÃ£o, Cirrose com Ascite, DRC',
    dose: '20mg a 80mg VO / 20mg a 100mg EV em bolus ou infusÃ£o contÃ­nua',
    frequency: '12/12h ou 24/24h ou SOS na hipervolemia',
    presentation: '40mg (Comp), 20mg/2mL (Ampola EV/IM)',
    renalAdjustment: 'Exige doses maiores em DRC avanÃ§ada para atingir o local de aÃ§Ã£o na alÃ§a de Henle.',
    category: 'Cardiovascular',
    notes: 'DiurÃ©tico de AlÃ§a potente. Monitorar rigorosamente potÃ¡ssio, magnÃ©sio e pressÃ£o arterial. Ototoxicidade em infusÃ£o EV rÃ¡pida.'
  },
  {
    id: 'm50',
    name: 'Espironolactona',
    indication: 'InsuficiÃªncia CardÃ­aca (ICFER), Ascite por HipertensÃ£o Portal em Cirrose, HipertensÃ£o RefratÃ¡ria',
    dose: '25mg a 50mg VO ao dia (IC) / 100mg a 400mg VO/dia (Cirrose)',
    frequency: '24/24h (Pela manhÃ£)',
    presentation: '25mg, 50mg, 100mg (Comprimidos)',
    renalAdjustment: 'Contraindicado se K+ > 5.0 mEq/L ou ClCr < 30 mL/min.',
    category: 'Cardiovascular',
    notes: 'DiurÃ©tico Poupador de PotÃ¡ssio / Antagonista da Aldosterona. Causa ginecomastia dolorosa e mastodinia em homens.'
  },
  {
    id: 'm51',
    name: 'Hidralazina',
    indication: 'HipertensÃ£o na GestaÃ§Ã£o, Crise Hipertensiva, AssociaÃ§Ã£o na IC em negros ou com contraindicaÃ§Ã£o a IECA',
    dose: '25mg a 50mg VO de 8/8h ou 5mg a 20mg EV lento a cada 20min',
    frequency: '8/8h VO ou SOS na emergÃªncia',
    presentation: '25mg, 50mg (Comp), 20mg/mL (Ampola EV)',
    renalAdjustment: 'ClCr < 10 mL/min: estender intervalo para 8-16h.',
    category: 'Cardiovascular',
    notes: 'Vasodilatador arterial direto. Pode induzir taquicardia reflexa e sÃ­ndrome Lupus-Like em metabolizadores lentos.'
  },
  {
    id: 'm52',
    name: 'Metildopa',
    indication: 'HipertensÃ£o Arterial na GestaÃ§Ã£o (PrÃ©-EclÃ¢mpsia / HipertensÃ£o CrÃ´nica)',
    dose: '250mg a 500mg VO',
    frequency: '8/8h ou 12/12h (MÃ¡x 2g/dia)',
    presentation: '250mg, 500mg (Comprimidos)',
    renalAdjustment: 'ClCr < 50 mL/min: estender intervalo para 8-12h.',
    category: 'Cardiovascular',
    notes: 'Agonista Alfa-2 AdrenÃ©rgico Central. Anti-hipertensivo mais estudado e seguro na gestaÃ§Ã£o. Pode causar sonolÃªncia e Teste de Coombs direto positivo.'
  },
  {
    id: 'm53',
    name: 'Nitroprussiato de SÃ³dio (Nipride)',
    indication: 'EmergÃªncia Hipertensiva com LesÃ£o de Ã“rgÃ£o-Alvo (EAP, DissecÃ§Ã£o de Aorta, Encefalopatia Hipertensiva)',
    dose: '0.25 a 10 mcg/kg/min em InfusÃ£o EV ContÃ­nua em BCI',
    frequency: 'InfusÃ£o contÃ­nua em ambiente de UTI/Sala Vermelha',
    presentation: '50mg (Frasco-ampola fotossensÃ­vel)',
    renalAdjustment: 'Risco aumentado de intoxicaÃ§Ã£o por tiocianato/cianeto em uso > 48h ou DRC.',
    category: 'EmergÃªncia',
    notes: 'Vasodilatador misto (arterial e venoso) ultra-rÃ¡pido. Exige equipamento fotoprotetor e monitorizaÃ§Ã£o pressÃ³rica PAI.'
  },
  {
    id: 'm54',
    name: 'Nitroglicerina (Tridil)',
    indication: 'SÃ­ndrome Coronariana Aguda (IAM / Angina InstÃ¡vel), Edema Agudo de PulmÃ£o',
    dose: '5 a 200 mcg/min em InfusÃ£o EV ContÃ­nua',
    frequency: 'TitulaÃ§Ã£o contÃ­nua conforme dor e PA',
    presentation: '50mg/10mL (Ampola para diluiÃ§Ã£o EV)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'EmergÃªncia',
    notes: 'Vasodilatador predominantemente venoso. Contraindicado em infarto de VD, hipotensÃ£o (PAS < 90) ou uso recente de sildenafila/tadalafila (Ãºltimas 24-48h).'
  },
  {
    id: 'm55',
    name: 'Isossorbida (Isordil / Monocordil)',
    indication: 'Angina Pectoris, InsuficiÃªncia CardÃ­aca, Dor TorÃ¡cica IsquÃªmica',
    dose: '5mg Sublingual (Isordil) / 10mg a 40mg VO',
    frequency: 'SOS na dor SL ou de 8/8h a 12/12h VO',
    presentation: '5mg Sublingual, 10mg, 20mg, 40mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Cardiovascular',
    notes: 'Promover perÃ­odo de tolerÃ¢ncia ("Janela sem nitrato" de 8-12h Ã  noite) para evitar perda de eficÃ¡cia antanginosa.'
  },
  {
    id: 'm56',
    name: 'Amiodarona',
    indication: 'FibrilaÃ§Ã£o Atrial (CardioversÃ£o/Controle), Taquicardia Ventricular Sustentada, PCR em TV/FV sem pulso',
    dose: '300mg EV em bolus na PCR / Ataque: 150mg EV em 10min / ManutenÃ§Ã£o: 200mg/dia VO',
    frequency: 'VariÃ¡vel conforme protocolo',
    presentation: '150mg/3mL (Ampola EV), 200mg (Comprimido VO)',
    renalAdjustment: 'NÃ£o requer ajuste em insuficiÃªncia renal.',
    category: 'Cardiovascular',
    notes: 'AntiarrÃ­tmico Classe III. Diluir apenas em Soro Glicosado 5%. No uso crÃ´nico monitorar TSH, T4L, RX de tÃ³rax (fibrose pulmonar) e CÃ³rnea.'
  },
  {
    id: 'm57',
    name: 'Adenosina',
    indication: 'ReversÃ£o de Taquicardia ParoxÃ­stica Supraventricular (TPSV) de complexo estreito',
    dose: '6mg EV Bolus RÃ¡pido seguido de Flush de 20mL SF0.9% (Se sem resposta, 12mg EV)',
    frequency: 'Bolus ultra-rÃ¡pido em veia antecubital proximal',
    presentation: '6mg/2mL (Ampola IV)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'EmergÃªncia',
    notes: 'Meia-vida < 10 segundos. Informar ao paciente sensaÃ§Ã£o iminente de opressÃ£o torÃ¡cica/morte. Contraindicada em Asma grave e Bloqueio AV de 2Âº/3Âº grau.'
  },
  {
    id: 'm58',
    name: 'Atropina',
    indication: 'Bradicardia Sinusal SintomÃ¡tica, IntoxicaÃ§Ã£o por Organofosforados / Carbamatos',
    dose: '1mg EV a cada 3-5min (MÃ¡x 3mg em Bradicardia) / 2mg a 5mg EV a cada 10min na IntoxicaÃ§Ã£o',
    frequency: 'SOS conforme protocolo de ressuscitaÃ§Ã£o',
    presentation: '0.25mg/mL, 0.5mg/mL (Ampolas de 1mL)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'EmergÃªncia',
    notes: 'AnticolinÃ©rgico. Doses < 0.5mg podem causar bradicardia paradoxal central.'
  },
  {
    id: 'm59',
    name: 'Digoxina',
    indication: 'InsuficiÃªncia CardÃ­aca SintomÃ¡tica com FibrilaÃ§Ã£o Atrial e FrequÃªncia Elevada',
    dose: '0.125mg a 0.25mg VO ao dia',
    frequency: '24/24h',
    presentation: '0.25mg (Comprimidos)',
    renalAdjustment: 'ClCr < 50 mL/min: reduzir dose para 0.125mg em dias alternados.',
    category: 'Cardiovascular',
    notes: 'InotrÃ³pico digitalis de estreita margem terapÃªutica. Sinais de intoxicaÃ§Ã£o: xantopsia (visÃ£o amarelada), nÃ¡useas, arritmias e bloqueios.'
  },
  {
    id: 'm60',
    name: 'Enoxaparina (Clexane)',
    indication: 'Tratamento de TVP / TEP, SÃ­ndrome Coronariana Aguda (IAM/Angina), Profilaxia de TROMBOSE em internados',
    dose: '1 mg/kg SC de 12/12h (Tratamento) / 40mg SC 1x/dia (Profilaxia de UTI/Enfermaria)',
    frequency: '12/12h ou 24/24h Via SubcutÃ¢nea',
    presentation: '20mg, 40mg, 60mg, 80mg, 100mg (Seringas PrÃ©-preenchidas)',
    renalAdjustment: 'ClCr < 30 mL/min: ajustar dose de tratamento para 1 mg/kg SC 1x ao dia (24/24h).',
    category: 'Cardiovascular',
    notes: 'Heparina de Baixo Peso Molecular (HBPM). NÃ£o requer monitorizaÃ§Ã£o de TTPA de rotina.'
  },
  {
    id: 'm61',
    name: 'Rivaroxabana',
    indication: 'FibrilaÃ§Ã£o Atrial NÃ£o Valvar (PrevenÃ§Ã£o de AVC), Tratamento e PrevenÃ§Ã£o de TVP / TEP',
    dose: '15mg a 20mg VO 1x ao dia (Fase Aguda TVP: 15mg 12/12h por 21 dias)',
    frequency: '24/24h (Junto com a refeiÃ§Ã£o principal)',
    presentation: '10mg, 15mg, 20mg (Comprimidos)',
    renalAdjustment: 'eTFG 15-50 mL/min: dose de 15mg 1x/dia. eTFG < 15: evitar.',
    category: 'Cardiovascular',
    notes: 'DOAC (Anticoagulante Oral Direto Inibidor do Fator Xa). NÃ£o requer RNI.'
  },
  {
    id: 'm62',
    name: 'Aspirina (AAS)',
    indication: 'PrevenÃ§Ã£o SecundÃ¡ria de Eventos Cardiovasculares (IAM, AVC, DAP), Fase Aguda do IAM',
    dose: '100mg VO ao dia (PrevenÃ§Ã£o) / 200mg a 300mg Mastigado na Fase Aguda do IAM',
    frequency: '24/24h apÃ³s refeiÃ§Ã£o',
    presentation: '100mg (Comprimidos)',
    renalAdjustment: 'Usar com cautela em DRC estÃ¡gio 4/5.',
    category: 'Cardiovascular',
    notes: 'Antiagregante plaquetÃ¡rio inibidor irreversÃ­vel da COX-1. Mastigar no IAM agudo para absorÃ§Ã£o estomacal imediata.'
  },
  {
    id: 'm63',
    name: 'Clopidogrel',
    indication: 'SÃ­ndrome Coronariana Aguda, Angioplastia com Stent, PÃ³s-AVCi, Arteriopatia PerifÃ©rica',
    dose: '75mg VO ao dia (Ataque no IAM: 300mg a 600mg VO)',
    frequency: '24/24h',
    presentation: '75mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Cardiovascular',
    notes: 'Inibidor do receptor P2Y12 de ADP. Dupla antiagregaÃ§Ã£o (AAS + Clopidogrel) Ã© padrÃ£o apÃ³s Stent coronariano.'
  },
  {
    id: 'm64',
    name: 'Atorvastatina',
    indication: 'Dislipidemia, PrevenÃ§Ã£o PrimÃ¡ria e SecundÃ¡ria de Eventos Cardiovasculares, SÃ­ndrome Coronariana Aguda',
    dose: '10mg a 80mg VO ao dia (Alta intensidade: 40mg-80mg)',
    frequency: '24/24h (Qualquer horÃ¡rio do dia)',
    presentation: '10mg, 20mg, 40mg, 80mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste em insuficiÃªncia renal.',
    category: 'Cardiovascular',
    notes: 'Estatina de alta potÃªncia. Meia-vida longa. Monitorar TGP/TGO e CPK se mialgia intensa.'
  },
  {
    id: 'm65',
    name: 'Sinvastatina',
    indication: 'Hipercolesterolemia, PrevenÃ§Ã£o de DoenÃ§a Coronariana',
    dose: '20mg a 40mg VO Ã  noite',
    frequency: '24/24h (Ã€ NOITE)',
    presentation: '10mg, 20mg, 40mg (Comprimidos)',
    renalAdjustment: 'ClCr < 10 mL/min: iniciar com 10mg ao dia.',
    category: 'Cardiovascular',
    notes: 'Tomar Ã  noite devido ao pico de sÃ­ntese hepÃ¡tica de colesterol nas primeiras horas da madrugada. NÃ£o ultrapassar 20mg se associado a amiodarona ou anlodipino.'
  },

  // --- RESPIRATÃ“RIO & ALERGIA ---
  {
    id: 'm66',
    name: 'Salbutamol (Aerolin)',
    indication: 'Crise de Asma, Broncoespasmo Agudo, ExacerbaÃ§Ã£o de DPOC',
    dose: '2 a 10 jatos (200-1000mcg) via EspaÃ§ador a cada 20min na 1Âª hora / NebulizaÃ§Ã£o: 2.5 a 5mg (10-20 gotas)',
    frequency: 'SOS ou a cada 20min na crise aguda',
    presentation: '100mcg/dose (Spray Aerossol com EspaÃ§ador), 5mg/mL (SoluÃ§Ã£o para NebulizaÃ§Ã£o), Xarope 2mg/5mL',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'Beta-2 Agonista de Curta AÃ§Ã£o (SABA). Pode causar taquicardia, tremores de extremidade e hipocalemia.'
  },
  {
    id: 'm67',
    name: 'IpratrÃ³pio (Atrovent)',
    indication: 'Broncoespasmo na Crise de Asma Grave e ExacerbaÃ§Ã£o de DPOC',
    dose: '20 a 40 gotas (0.25 - 0.5mg) em 3-5mL SF 0.9% via NebulizaÃ§Ã£o',
    frequency: '8/8h ou a cada 20min junto com o Salbutamol na 1Âª hora da crise',
    presentation: '0.25mg/mL (SoluÃ§Ã£o para InalaÃ§Ã£o Frasco Gotas)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'AnticolinÃ©rgico de curta aÃ§Ã£o (SAMA). Promove broncodilataÃ§Ã£o por bloqueio muscarÃ­nico.'
  },
  {
    id: 'm68',
    name: 'Budesonida',
    indication: 'ManutenÃ§Ã£o e controle da Asma Persistente, Rinite AlÃ©rgica, Laringite PediÃ¡trica',
    dose: '200mcg a 800mcg/dia via inalatÃ³ria / NebulizaÃ§Ã£o: 0.25mg a 1mg de 12/12h',
    frequency: '12/12h ou 24/24h',
    presentation: '200mcg/dose (Inalador PÃ³/Spray), 0.25mg/mL, 0.5mg/mL (Flaconetes de SuspensÃ£o p/ NebulizaÃ§Ã£o), Spray Nasal 32/50mcg',
    renalAdjustment: 'Sem necessidade de ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'Corticosteroide InalatÃ³rio (CI). Orientar lavar a boca / escovar os dentes apÃ³s uso para prevenir CandidÃ­ase Oral (Sapo).'
  },
  {
    id: 'm69',
    name: 'Budesonida + Formoterol (Alenia / Symbicort)',
    indication: 'Tratamento de manutenÃ§Ã£o e resgate da Asma Moderada/Grave (EstratÃ©gia MART - GINA) e DPOC',
    dose: '6/100mcg, 6/200mcg, 12/400mcg 1 a 2 inalaÃ§Ãµes de 12/12h',
    frequency: '12/12h e SOS no resgate dos sintomas',
    presentation: 'Inalador em pÃ³ cÃ¡psulas ou Spray pressurizado',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'CombinaÃ§Ã£o CI + LABA de inÃ­cio rÃ¡pido de aÃ§Ã£o. PadrÃ£o ouro no GINA 2024 tanto para manutenÃ§Ã£o quanto para alÃ­vio imediato.'
  },
  {
    id: 'm70',
    name: 'Montelucaste de SÃ³dio',
    indication: 'Asma AlÃ©rgica, Rinite AlÃ©rgica, Broncoespasmo induzido pelo exercÃ­cio',
    dose: '4mg (6m-5anos), 5mg (6-14anos), 10mg (Adolescente/Adulto) VO Ã  noite',
    frequency: '24/24h (Ã€ NOITE)',
    presentation: '4mg, 5mg (Comp MastigÃ¡vel/SachÃª), 10mg (Comprimido Revestido)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'Antagonista do Receptor de Leucotrienos. Alerta de seguranÃ§a para alteraÃ§Ãµes do sono, pesadelos e sintomas psiquiÃ¡tricos.'
  },
  {
    id: 'm71',
    name: 'Loratadina / Desloratadina',
    indication: 'Rinite AlÃ©rgica, UrticÃ¡ria Aguda e CrÃ´nica, Dermatite AtÃ³pica, Conjuntivite AlÃ©rgica',
    dose: '10mg VO 1x ao dia (Loratadina) / 5mg VO 1x ao dia (Desloratadina)',
    frequency: '24/24h',
    presentation: '10mg (Comp), 1mg/mL (Xarope Loratadina) / 5mg (Comp), 0.5mg/mL (Xarope Desloratadina)',
    renalAdjustment: 'ClCr < 30 mL/min: administrar em dias alternados.',
    category: 'RespiratÃ³rio',
    notes: 'AntihistamÃ­nico de 2Âª geraÃ§Ã£o H1 nÃ£o sedante (mÃ­nima penetraÃ§Ã£o no SNC).'
  },
  {
    id: 'm72',
    name: 'Prometazina (Fenergan)',
    indication: 'ReaÃ§Ã£o AlÃ©rgica Aguda, UrticÃ¡ria Severa, Anafilaxia (Adjuvante), Cinetose, AgitaÃ§Ã£o Psicomotora',
    dose: '25mg VO / 25mg a 50mg IM profunda',
    frequency: '8/8h ou SOS na reaÃ§Ã£o aguda',
    presentation: '25mg (Comp), 50mg/2mL (Ampola IM)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'EmergÃªncia',
    notes: 'AntihistamÃ­nico H1 de 1Âª geraÃ§Ã£o com forte aÃ§Ã£o sedativa e anticolinÃ©rgica. NUNCA administrar via EV (risco de necrose tecidual e gangrena).'
  },
  {
    id: 'm73',
    name: 'AcetilcisteÃ­na (Fluimucil)',
    indication: 'MucolÃ­tico em afecÃ§Ãµes respiratÃ³rias com hipersecretividade, AntÃ­doto para IntoxicaÃ§Ã£o por Paracetamol',
    dose: '200mg a 600mg VO ao dia / IntoxicaÃ§Ã£o Paracetamol: Protocolo EV de 150 mg/kg em 21h',
    frequency: '8/8h ou 24/24h (Envelope 600mg)',
    presentation: '100mg, 200mg, 600mg (Envelopes e Comp Efervescente), 100mg/mL (Ampola EV/InalaÃ§Ã£o)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'RespiratÃ³rio',
    notes: 'Restaura a glutationa hepÃ¡tica na intoxicaÃ§Ã£o por paracetamol. Atua como doador de grupos sulfidrila.'
  },

  // --- GASTROINTESTINAL ---
  {
    id: 'm74',
    name: 'Omeprazol',
    indication: 'Gastrite, Ãšlcera PÃ©ptica, DRGE, ErradicaÃ§Ã£o do H. pylori, Profilaxia de Ãšlcera de Estresse em UTI',
    dose: '20mg a 40mg VO em jejum pela manhÃ£ / 40mg EV 1x ao dia',
    frequency: '24/24h (30min antes do cafÃ© da manhÃ£)',
    presentation: '20mg, 40mg (CÃ¡psulas), 40mg (Frasco-ampola IV)',
    renalAdjustment: 'Sem necessidade de ajuste renal.',
    category: 'Gastro',
    notes: 'Inibidor da Bomba de PrÃ³tons (IBP). O uso crÃ´nico pode reduzir absorÃ§Ã£o de Vitamina B12, MagnÃ©sio e CÃ¡lcio.'
  },
  {
    id: 'm75',
    name: 'Pantoprazol',
    indication: 'DRGE Grave, Ãšlcera PÃ©ptica, Hemorragia Digestiva Alta (HDA por Ãºlcera peptica)',
    dose: '40mg VO ao dia / HDA: Bolus de 80mg EV + InfusÃ£o contÃ­nua de 8mg/h por 72h',
    frequency: '24/24h ou InfusÃ£o contÃ­nua na HDA',
    presentation: '20mg, 40mg (Comp), 40mg (Frasco-ampola IV)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Gastro',
    notes: 'IBP com menor potencial de interaÃ§Ã£o enzimÃ¡tica CYP2C19 do que o omeprazol (mais seguro em uso conjunto de clopidogrel).'
  },
  {
    id: 'm76',
    name: 'Ondansetrona (Vonau / Vonau Flash)',
    indication: 'PrevenÃ§Ã£o e tratamento de NÃ¡useas e VÃ´mitos (PÃ³s-operatÃ³rio, Quimioterapia, Gastroenterite PediÃ¡trica/Adulto)',
    dose: '4mg a 8mg VO/SL/EV (Pediatria: 0.15 mg/kg por dose)',
    frequency: '8/8h conforme necessidade',
    presentation: '4mg, 8mg (Comp DissoluÃ§ao Oral SL), 4mg/2mL (Ampola EV/IM)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Gastro',
    notes: 'Antagonista seletivo dos receptores 5-HT3 de Serotonina. Excelente tolerabilidade sem sintomas extrapiramidais. Pode prolongar QTc em doses altas.'
  },
  {
    id: 'm77',
    name: 'Metoclopramida (Plasil)',
    indication: 'NÃ¡useas, VÃ´mitos, Gastroparesia DiabÃ©tica, Refluxo GastroesofÃ¡gico',
    dose: '10mg VO/EV/IM (Pediatria: 0.1 mg/kg por dose)',
    frequency: '8/8h (Tomar 30min antes das refeiÃ§Ãµes)',
    presentation: '10mg (Comp), 4mg/mL (Gotas - 21gotas=10mg), 10mg/2mL (Ampola EV/IM)',
    renalAdjustment: 'ClCr < 40 mL/min: administrar 50% da dose.',
    category: 'Gastro',
    notes: 'Antagonista DopaminÃ©rgico D2 procinÃ©tico. Risco de ReaÃ§Ãµes Extrapiramidais (Acatisia, Discinesia tardia, Distonia aguda) tratÃ¡veis com Biperideno ou Prometazina.'
  },
  {
    id: 'm78',
    name: 'Bromoprida',
    indication: 'NÃ¡useas, vÃ´mitos, distÃºrbios de motilidade gastrintestinal',
    dose: '10mg VO/EV/IM (Pediatria: 0.5 a 1 mg/kg/dia)',
    frequency: '8/8h',
    presentation: '10mg (Caps), 4mg/mL (Gotas), 10mg/2mL (Ampola EV/IM)',
    renalAdjustment: 'ClCr < 50 mL/min: reduzir dose em 50%.',
    category: 'Gastro',
    notes: 'ProcinÃ©tico similar Ã  metoclopramida, com incidÃªncia ligeiramente menor de efeitos extrapiramidais.'
  },
  {
    id: 'm79',
    name: 'Escopolamina / Hioscina (Buscopan / Buscopan Composto)',
    indication: 'CÃ³licas abdominais, espasmos do trato gastrointestinal e geniturinÃ¡rio, cÃ³lica biliar e renal',
    dose: '10mg a 20mg VO/EV/IM',
    frequency: '6/6h ou 8/8h SOS',
    presentation: '10mg (Comp), 10mg/mL (Gotas), 20mg/mL (Ampola EV/IM)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Gastro',
    notes: 'AntiespasmÃ³dico anticolinÃ©rgico. O Buscopan Composto contÃ©m Dipirona associada.'
  },
  {
    id: 'm80',
    name: 'Lactulona',
    indication: 'ConstipaÃ§Ã£o Intestinal CrÃ´nica, PrevenÃ§Ã£o e Tratamento de Encefalopatia HepÃ¡tica em CirrÃ³ticos',
    dose: '15mL a 30mL VO/dia (ConstipaÃ§Ã£o) / 30mL a 45mL a cada 2h na Encefalopatia HepÃ¡tica atÃ© obter 2-3 evacuaÃ§Ãµes pastosas/dia',
    frequency: '12/12h ou 8/8h',
    presentation: 'Xarope 667mg/mL (Frasco de 120mL)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Gastro',
    notes: 'Laxativo osmÃ³tico nÃ£o absorvÃ­vel. Reduz a absorÃ§Ã£o intestinal de amÃ´nia na insuficiÃªncia hepÃ¡tica.'
  },
  {
    id: 'm81',
    name: 'Sais de ReidrataÃ§Ã£o Oral (SRO OMS)',
    indication: 'PrevenÃ§Ã£o e Tratamento da DesidrataÃ§Ã£o por Diarreia Aguda e VÃ´mitos (Planos A e B da OMS)',
    dose: 'Oferecer Ã  vontade apÃ³s cada evacuaÃ§Ã£o diarreica (Pediatria: 50-100 mL/kg em 4 horas no Plano B)',
    frequency: 'ContÃ­nua/ApÃ³s cada evacuaÃ§Ã£o lÃ­quida',
    presentation: 'Envelopes contendo pÃ³ para diluiÃ§Ã£o em exatamente 1 litro de Ã¡gua filtrada/fervida',
    renalAdjustment: 'Usar com monitorizaÃ§Ã£o eletrolÃ­tica em insuficiÃªncia renal.',
    category: 'Gastro',
    notes: 'SoluÃ§Ã£o de osmolaridade reduzida contendo SÃ³dio, PotÃ¡ssio, Cloreto, Citrato e Glicose. Pilar fundamental do manejo da diarreia.'
  },

  // --- ENDOCRINOLOGIA & METABOLISMO ---
  {
    id: 'm82',
    name: 'Metformina (Glucophage / Glifage XR)',
    indication: 'Diabetes Mellitus Tipo 2 (1Âª linha), SÃ­ndrome dos OvÃ¡rios PolicÃ­sticos (SOP), PrÃ©-diabetes',
    dose: '500mg a 2550mg VO ao dia com ou apÃ³s as refeiÃ§Ãµes',
    frequency: '12/12h ou 24/24h (FormulaÃ§Ãµes XR Ã  noite)',
    presentation: '500mg, 850mg, 1000mg (Comprimidos Simples e XR)',
    renalAdjustment: 'eTFG 30-45: mÃ¡x 1000mg/dia. eTFG < 30 mL/min: CONTRAINDICADO (Risco de Acidose LÃ¡ctica).',
    category: 'Endocrinologia',
    notes: 'Biguanida. Sensibilizador de insulina. Promove discreta perda de peso e nÃ£o causa hipoglicemia em monoterapia.'
  },
  {
    id: 'm83',
    name: 'Glibenclamida',
    indication: 'Diabetes Mellitus Tipo 2',
    dose: '2.5mg a 20mg VO ao dia (Antes do cafÃ© da manhÃ£)',
    frequency: '24/24h ou 12/12h antes das refeiÃ§Ãµes principais',
    presentation: '5mg (Comprimidos)',
    renalAdjustment: 'Contraindicado em eTFG < 60 mL/min (Alto risco de hipoglicemia grave prolongada).',
    category: 'Endocrinologia',
    notes: 'Sulfonilureia de 2Âª geraÃ§Ã£o. Estimula secreÃ§Ã£o pancreÃ¡tica de insulina. EVITAR EM IDOSOS (CritÃ©rios de Beers).'
  },
  {
    id: 'm84',
    name: 'Empagliflozina / Dapagliflozina',
    indication: 'DM2, InsuficiÃªncia CardÃ­aca (ICFER/ICFEP), DoenÃ§a Renal CrÃ´nica (DRC)',
    dose: '10mg VO 1x ao dia (Dapagliflozina 10mg / Empagliflozina 10mg ou 25mg)',
    frequency: '24/24h (ManhÃ£)',
    presentation: '10mg, 25mg (Comprimidos)',
    renalAdjustment: 'Continuar se jÃ¡ em uso atÃ© eTFG 20 mL/min para proteÃ§Ã£o renal/cardÃ­aca.',
    category: 'Endocrinologia',
    notes: 'Inibidores da SGLT-2. Promovem glicosÃºria e natriurese. Reduzem internaÃ§Ãµes por IC e progressÃ£o da DRC. Risco de micose genital e CAD euglicÃªmica.'
  },
  {
    id: 'm85',
    name: 'Insulina NPH (Humana)',
    indication: 'Diabetes Mellitus Tipo 1 e Tipo 2 (Basal)',
    dose: 'Dose inicial total de 0.2 a 0.5 UI/kg/dia (Dividida em 2/3 de manhÃ£ e 1/3 ao deitar SC)',
    frequency: '12/12h ou ao deitar SubcutÃ¢nea',
    presentation: '100 UI/mL (Frasco de 10mL ou Caneta de 3mL)',
    renalAdjustment: 'Reduzir dose em eTFG < 50 devido a menor clearance de insulina.',
    category: 'Endocrinologia',
    notes: 'Insulina humana de aÃ§Ã£o intermediÃ¡ria. InÃ­cio de aÃ§Ã£o em 1-2h, pico em 4-10h, duraÃ§Ã£o 12-18h. Homogeneizar por inversÃ£o suave antes de aplicar.'
  },
  {
    id: 'm86',
    name: 'Insulina Regular (Humana)',
    indication: 'Cetoacidose DiabÃ©tica (CAD), Estado Hiperosmolar, Hipercalemia Aguda, CorreÃ§Ã£o de glicemia pÃ³s-prandial (Bolus)',
    dose: '0.1 UI/kg/h em bomba na CAD / Escala de correÃ§Ã£o de glicemia capilar SC',
    frequency: '30min antes das refeiÃ§Ãµes ou InfusÃ£o EV na emergÃªncia',
    presentation: '100 UI/mL (Frasco de 10mL ou Caneta)',
    renalAdjustment: 'Reduzir dose conforme eTFG.',
    category: 'Endocrinologia',
    notes: 'Insulina de aÃ§Ã£o rÃ¡pida. InÃ­cio em 30min, pico em 2-3h, duraÃ§Ã£o 6-8h. Ãšnica insulina administrada por via Endovenosa na emergÃªncia.'
  },
  {
    id: 'm87',
    name: 'Levotiroxina SÃ³dica (Puran T4)',
    indication: 'Hipotireoidismo PrimÃ¡rio, SecundÃ¡rio, PÃ³s-Tiroidectomia, BÃ³cio',
    dose: '1.6 mcg/kg/dia em jovens (Em idosos/cardiopatas: iniciar com 25-50 mcg/dia)',
    frequency: '24/24h em JEJUM Rigoroso (Aguardar 30-60min antes do cafÃ©)',
    presentation: '12.5, 25, 50, 75, 88, 100, 112, 125, 150, 200 mcg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Endocrinologia',
    notes: 'HormÃ´nio tireoidiano T4. Reavaliar TSH apÃ³s 6 a 8 semanas da alteraÃ§Ã£o de dose. InteraÃ§Ã£o com cÃ¡lcio e ferro.'
  },

  // --- CORTICOIDES ---
  {
    id: 'm88',
    name: 'Prednisona',
    indication: 'ExacerbaÃ§Ã£o de Asma/DPOC, Anafilaxia, DoenÃ§as Autoimunes (LÃºpus, AR), Paralisia de Bell, ReaÃ§Ã£o AlÃ©rgica',
    dose: '5mg a 60mg VO ao dia (ImunossupressÃ£o: 1 mg/kg/dia)',
    frequency: '24/24h (Pela manhÃ£ com o cafÃ© da manhÃ£)',
    presentation: '5mg, 20mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Corticoide',
    notes: 'PrÃ³-fÃ¡rmaco convertido em prednisolona no fÃ­gado. Uso > 14 dias exige desmame gradual para evitar insuficiÃªncia adrenal secundÃ¡ria.'
  },
  {
    id: 'm89',
    name: 'Prednisolona',
    indication: 'Uso pediÃ¡trico em Crise de Asma, Laringite, DoenÃ§as AlÃ©rgicas e InflamatÃ³rias',
    dose: '1 a 2 mg/kg/dia VO (MÃ¡x 40mg/dia)',
    frequency: '24/24h pela manhÃ£ por 3 a 5 dias',
    presentation: 'SoluÃ§Ã£o Oral 3mg/mL (Prelone / Pediapred), 20mg (Comp)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Corticoide',
    notes: 'Forma ativa da prednisona. Excelente aceitaÃ§Ã£o e absorÃ§Ã£o pediÃ¡trica.'
  },
  {
    id: 'm90',
    name: 'Dexametasona (Decadron)',
    indication: 'Croup/Laringite Aguda PediÃ¡trica, Edema Cerebral, Covid-19 grave, Anafilaxia, Teste de SupressÃ£o',
    dose: '0.15 a 0.6 mg/kg VO/IM/EV (Croup: 0.6 mg/kg dose Ãºnica - MÃ¡x 16mg)',
    frequency: 'Dose Ãºnica ou 24/24h',
    presentation: '4mg (Comp), 4mg/mL (Ampola EV/IM), Elixir 0.1mg/mL',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Corticoide',
    notes: 'Glicocorticoide sintÃ©tico de altÃ­ssima potÃªncia (25x mais potente que a hidrocortisona) e sem atividade mineralocorticoide.'
  },
  {
    id: 'm91',
    name: 'Hidrocortisona (Solu-Cortef)',
    indication: 'Choque SÃ©ptico RefratÃ¡rio a Vasopressores, Crise Adrenal Aguda, Broncoespasmo Agudo Grave',
    dose: '100mg a 500mg EV em bolus / Choque SÃ©ptico: 200mg/dia (50mg EV de 6/6h)',
    frequency: '6/6h ou 8/8h ou InfusÃ£o contÃ­nua',
    presentation: '100mg, 500mg (Frasco-ampola IV/IM)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Corticoide',
    notes: 'Corticosteroide bioidÃªntico com retenÃ§Ã£o de sÃ³dio e atividade mineralocorticoide significativa.'
  },

  // --- NEUROLOGIA & PSIQUIATRIA ---
  {
    id: 'm92',
    name: 'Fluoxetina',
    indication: 'Transtorno Depressivo Maior, Bulimia Nervosa, TOC, Transtorno do PÃ¢nico',
    dose: '20mg a 60mg VO ao dia',
    frequency: '24/24h (Pela manhÃ£)',
    presentation: '20mg (CÃ¡psulas), 20mg/mL (Gotas)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Psiquiatria',
    notes: 'ISRS. Meia-vida longa (com metabÃ³lito norfluoxetina de atÃ© 7-14 dias). Pode causar agitaÃ§Ã£o inicial e perda ponderal.'
  },
  {
    id: 'm93',
    name: 'Sertralina',
    indication: 'DepressÃ£o, Transtorno de Ansiedade Generalizada, TEPT, Fobia Social, TOC',
    dose: '25mg a 200mg VO ao dia',
    frequency: '24/24h (Pela manhÃ£ ou noite)',
    presentation: '25mg, 50mg, 100mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Psiquiatria',
    notes: 'ISRS com perfil de seguranÃ§a cardiovascular consagrado em pÃ³s-IAM e idosos.'
  },
  {
    id: 'm94',
    name: 'Escitalopram',
    indication: 'Transtorno do PÃ¢nico, TAG, DepressÃ£o Maior, Fobia Social',
    dose: '10mg a 20mg VO ao dia (Idosos: iniciar com 5mg/dia)',
    frequency: '24/24h',
    presentation: '10mg, 15mg, 20mg (Comp), 20mg/mL (Gotas)',
    renalAdjustment: 'NÃ£o requer ajuste se eTFG > 20 mL/min.',
    category: 'Psiquiatria',
    notes: 'ISRS mais seletivo. BaixÃ­ssimo potencial de interaÃ§Ã£o via citocromo P450. Excelente tolerÃ¢ncia.'
  },
  {
    id: 'm95',
    name: 'Clonazepam (Rivotril)',
    indication: 'Transtorno do PÃ¢nico, Ansiedade ParoxÃ­stica Aguda, Acatisia, Crise Convulsiva',
    dose: '0.5mg a 2mg VO ao dia / 0.5mg a 2mg (Gotas: 2.5mg/mL - 1gota = 0.1mg)',
    frequency: '12/12h ou Ã  noite',
    presentation: '0.5mg, 2mg (Comp), 2.5mg/mL (Gotas Frasco de 20mL)',
    renalAdjustment: 'Usar com cautela em DRC grave.',
    category: 'Psiquiatria',
    notes: 'BenzodiazepÃ­nico de alta potÃªncia e longa duraÃ§Ã£o. Risco de dependÃªncia fÃ­sica, sedaÃ§Ã£o, amnÃ©sia e quedas em idosos.'
  },
  {
    id: 'm96',
    name: 'Diazepam',
    indication: 'Crise Convulsiva Aguda / Status Epilepticus, AbstinÃªncia AlcoÃ³lica (CIWA), Espasmo Muscular Grave',
    dose: '5mg a 10mg VO / 10mg EV Lento sem diluir (2 a 5mg/min) / Via Retal em crianÃ§as',
    frequency: 'SOS ou 8/8h',
    presentation: '5mg, 10mg (Comp), 10mg/2mL (Ampola EV/IM)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Neurologia',
    notes: 'BenzodiazepÃ­nico. No Status Epilepticus: 10mg EV lento (pode repetir em 5min). Risco de depressÃ£o respiratÃ³ria.'
  },
  {
    id: 'm97',
    name: 'Midazolam (Dormonid)',
    indication: 'SedaÃ§Ã£o PrÃ©-AnestÃ©sica, InduÃ§Ã£o Sequencial RÃ¡pida de IntubaÃ§Ã£o, Crise Convulsiva RefratÃ¡ria',
    dose: '15mg VO ao deitar / 0.05 a 0.2 mg/kg EV no bolus de intubaÃ§Ã£o',
    frequency: 'SOS ou InfusÃ£o ContÃ­nua em BCI na UTI',
    presentation: '15mg (Comp), 5mg/5mL, 15mg/3mL, 50mg/10mL (Ampolas EV/IM)',
    renalAdjustment: 'AcÃºmulo de metabÃ³litos em uso prolongado em DRC.',
    category: 'EmergÃªncia',
    notes: 'BenzodiazepÃ­nico de aÃ§Ã£o ultracurta. Ter Flumazenil disponÃ­vel em caso de superdosagem.'
  },
  {
    id: 'm98',
    name: 'Haloperidol (Haldol)',
    indication: 'AgitaÃ§Ã£o Psicomotora, Delirium no idoso, Surto PsicÃ³tico Agudo, Esquizofrenia, SÃ­ndrome de Tourette',
    dose: '1mg a 5mg IM/EV ou VO (MÃ¡x 20mg/dia)',
    frequency: '12/12h ou a cada 30min SOS na agitaÃ§Ã£o grave',
    presentation: '1mg, 5mg (Comp), 2mg/mL (Gotas), 5mg/mL (Ampola IM/EV)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Psiquiatria',
    notes: 'AntipsicÃ³tico TÃ­pico de Alta PotÃªncia (Inibidor D2). Monitorar intervalo QTc (risco de Torsades de Pointes no uso EV) e SÃ­ndrome NeurolÃ©ptica Maligna.'
  },
  {
    id: 'm99',
    name: 'Risperidona',
    indication: 'Esquizofrenia, Transtorno Bipolar (Mania Aguda), Irritabilidade no Autismo, Delirium',
    dose: '1mg a 6mg VO ao dia',
    frequency: '24/24h ou 12/12h',
    presentation: '1mg, 2mg, 3mg (Comp), 1mg/mL (SoluÃ§Ã£o Oral)',
    renalAdjustment: 'Iniciar com 0.5mg de 12/12h e titular com cautela se eTFG < 30.',
    category: 'Psiquiatria',
    notes: 'AntipsicÃ³tico AtÃ­pico. Causa hiperprolactinemia (galactorreia, amenorreia) e ganho ponderal.'
  },
  {
    id: 'm100',
    name: 'Quetiapina',
    indication: 'Esquizofrenia, Transtorno Bipolar, DepressÃ£o RefratÃ¡ria (Adjuvante), InsÃ´nia em idosos',
    dose: '25mg a 800mg VO ao dia',
    frequency: '24/24h (Ã€ NOITE)',
    presentation: '25mg, 100mg, 200mg, 300mg (Comprimidos Simples e XRO)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Psiquiatria',
    notes: 'AntipsicÃ³tico AtÃ­pico de baixÃ­ssimo risco de sintomas extrapiramidais (ideal para DoenÃ§a de Parkinson com psicose). Fortemente sedativo.'
  },
  {
    id: 'm101',
    name: 'Carbonato de LÃ­tio (Carbolitium)',
    indication: 'Transtorno Afetivo Bipolar (ManutenÃ§Ã£o e Mania Aguda), PrevenÃ§Ã£o de SuicÃ­dio',
    dose: '300mg a 1200mg VO ao dia (Litemia alvo: 0.6 a 1.2 mEq/L)',
    frequency: '12/12h ou 24/24h com alimentos',
    presentation: '300mg, 450mg CR (Comprimidos)',
    renalAdjustment: 'Excretado estritamente pelos rins. Exige ajuste minucioso e dosagem periÃ³dica da Litemia.',
    category: 'Psiquiatria',
    notes: 'Estabilizador de humor padrÃ£o-ouro. Estreita margem terapÃªutica. Monitorar Litemia, TSH e FunÃ§Ã£o Renal (Creatinina).'
  },
  {
    id: 'm102',
    name: 'Ãcido ValprÃ³ico / Valproato de SÃ³dio (Depakene / Torval / Depakote)',
    indication: 'Epilepsia (Crises Focais e Generalizadas), Transtorno Bipolar, Profilaxia da Enxaqueca',
    dose: '15 a 60 mg/kg/dia VO (Ex: 250mg a 1500mg/dia)',
    frequency: '12/12h ou 8/8h',
    presentation: '250mg, 500mg (Comp), 250mg/5mL (Xarope), 50mg/mL (Gotas)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Neurologia',
    notes: 'Anticonvulsivante de amplo espectro. TeratogÃªnico grave (Espinha bÃ­fida / Defeito de tubo neural) - CONTRAINDICADO em mulheres em idade fÃ©rtil sem contracepÃ§Ã£o eficaz.'
  },
  {
    id: 'm103',
    name: 'Carbamazepina (Tegretol)',
    indication: 'Epilepsia (Crises Focais e TÃ´nico-ClÃ´nicas), Neuralgia do TrigÃªmeo, Mania Bipolar',
    dose: '200mg a 1200mg VO ao dia',
    frequency: '12/12h ou 8/8h',
    presentation: '200mg, 400mg (Comp Simples e CR), 20mg/mL (SuspensÃ£o Oral)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'Neurologia',
    notes: 'Inibidor de canal de sÃ³dio. Auto-indutor enzimÃ¡tico potente (CYP3A4). Risco de hiponatremia (SIADH) e farmacodermia grave.'
  },

  // --- EMERGÃŠNCIA & VASOATIVAS ---
  {
    id: 'm104',
    name: 'Adrenalina / Epinefrina',
    indication: 'Parada CardiorrespiratÃ³ria (PCR), Choque AnafilÃ¡tico, Laringite PediÃ¡trica Grave (NebulizaÃ§Ã£o)',
    dose: 'PCR: 1mg EV a cada 3-5min / Anafilaxia: 0.3 a 0.5mg IM na face anterolateral da coxa / NebulizaÃ§Ã£o: 3 a 5mL puro',
    frequency: 'SOS conforme protocolo de emergÃªncia',
    presentation: '1mg/mL (Ampola de 1mL 1:1000)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'EmergÃªncia',
    notes: 'InotrÃ³pico, cronotrÃ³pico e vasopressor potente (alfa e beta agonista). Na anafilaxia a via IM no vasto lateral Ã© prioritÃ¡ria.'
  },
  {
    id: 'm105',
    name: 'Noradrenalina',
    indication: 'Choque SÃ©ptico, Choque VasoplÃ©gico, Choque CardiogÃªnico (Primeira escolha de Vasopressor)',
    dose: '0.05 a 2 mcg/kg/min em InfusÃ£o EV ContÃ­nua em BCI por Acesso Venoso Central',
    frequency: 'InfusÃ£o contÃ­nua guiada por PAM (Alvo PAM â‰¥ 65 mmHg)',
    presentation: '1mg/mL (Ampola de 4mL = 4mg)',
    renalAdjustment: 'NÃ£o requer ajuste renal.',
    category: 'EmergÃªncia',
    notes: 'Vasopressor alfa-1 potente com efeito beta-1 discreto. Exige infusÃ£o em Veia Central para prevenir necrose por extravasamento perifÃ©rico.'
  },
  {
    id: 'm106',
    name: 'Dobutamina',
    indication: 'Choque CardiogÃªnico, InsuficiÃªncia CardÃ­aca Agudizada com Baixo DÃ©bito (Perfil C)',
    dose: '2.5 a 20 mcg/kg/min em InfusÃ£o EV ContÃ­nua em BCI',
    frequency: 'InfusÃ£o contÃ­nua guiada por perfusÃ£o e diurese',
    presentation: '12.5mg/mL (Ampola de 20mL = 250mg)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'EmergÃªncia',
    notes: 'InotrÃ³pico positivo beta-1 seletivo. Reduz RVP. Pode precipitar taquiarritmias e hipotensÃ£o se hipovolemia nÃ£o corrigida.'
  },
  {
    id: 'm107',
    name: 'Ãcido TranexÃ¢mico (Transamin)',
    indication: 'Hemorragia Aguda Grave, Trauma (Protocolo CRASH-2), Hipermenorreia, Hemoptise',
    dose: '1g EV em 10min nas primeiras 3h do trauma / 250mg a 500mg VO de 8/8h',
    frequency: '8/8h ou dose de ataque EV no trauma',
    presentation: '250mg (Comp), 250mg/5mL, 500mg/5mL (Ampola EV)',
    renalAdjustment: 'ClCr < 50 mL/min: reduzir dose/frequÃªncia.',
    category: 'EmergÃªncia',
    notes: 'AntifibrinolÃ­tico inibidor do plasminogÃªnio. Administrar precocemente no trauma grave (mÃ¡ximo atÃ© 3 horas do evento).'
  },

  // --- GINECOLOGIA, OBSTETRÃCIA & DIVERSOS ---
  {
    id: 'm108',
    name: 'Oxitocina',
    indication: 'InduÃ§Ã£o do Parto, PrevenÃ§Ã£o e Tratamento da Atonia Uterina / Hemorragia PÃ³s-Parto',
    dose: '10 UI IM apÃ³s a saÃ­da do ombro anterior / 20-40 UI em 500mL SF0.9% EV em infusÃ£o rÃ¡pida na hemorragia',
    frequency: 'InfusÃ£o contÃ­nua ou IM imediato pÃ³s-parto',
    presentation: '5 UI/mL, 10 UI/mL (Ampolas de 1mL)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Ginecologia',
    notes: 'Promove contraÃ§Ã£o do miomÃ©trio. PrevenÃ§Ã£o universal da atonia uterina no 3Âº perÃ­odo do parto.'
  },
  {
    id: 'm109',
    name: 'Sulfato de MagnÃ©sio',
    indication: 'PrevenÃ§Ã£o e Tratamento de EclÃ¢mpsia em Gestantes (Protocolo de Zuspan/Sibai), Broncoespasmo Agudo Grave',
    dose: 'Ataque: 4g a 6g EV em 20min / ManutenÃ§Ã£o: 1g a 2g/h em BCI por 24 horas',
    frequency: 'InfusÃ£o contÃ­nua por 24h pÃ³s-parto ou crise',
    presentation: '10% e 50% (Ampolas de 10mL)',
    renalAdjustment: 'Monitorar reflexo patelar, diurese (>25mL/h) e FR (>16/min). Ter Gluconato de CÃ¡lcio a 10% no leito em caso de intoxicaÃ§Ã£o.',
    category: 'EmergÃªncia',
    notes: 'NeuroproteÃ§Ã£o fetal e anticonvulsivante na DAH. Desaparecimento do reflexo patelar Ã© o 1Âº sinal de hipermagnesemia.'
  },
  {
    id: 'm110',
    name: 'Sulfato Ferroso',
    indication: 'Tratamento e PrevenÃ§Ã£o da Anemia Ferropriva, SuplementaÃ§Ã£o na GestaÃ§Ã£o e LactaÃ§Ã£o',
    dose: '120mg a 200mg de Ferro Elemental/dia VO (Adulto) / 3 a 6 mg/kg/dia (Pediatria)',
    frequency: '24/24h ou 12/12h 1 hora antes das refeiÃ§Ãµes com Suco CÃ­trico (Vit C)',
    presentation: '40mg de Ferro Elemental (Comp), 25mg/mL Gotas (1mL = 5 gotas de 5mg)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Hematologia',
    notes: 'Escurece as fezes para cor preta (tranquilizar paciente). Pode causar epigastralgia, nÃ¡usea e constipaÃ§Ã£o.'
  },
  {
    id: 'm111',
    name: 'Ãcido FÃ³lico',
    indication: 'PrevenÃ§Ã£o de Defeitos do Tubo Neural (Espinha BÃ­fida) na GestaÃ§Ã£o, Anemia MegaloblÃ¡stica',
    dose: '0.4mg a 5mg VO ao dia (Iniciar idealmente 3 meses antes da concepÃ§Ã£o)',
    frequency: '24/24h',
    presentation: '1mg, 5mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Ginecologia',
    notes: 'Dose de 5mg/dia indicada para gestantes de alto risco (uso de anticonvulsivantes ou gestaÃ§Ã£o prÃ©via com DTN).'
  },
  {
    id: 'm112',
    name: 'Tamsulosina (Secotex)',
    indication: 'Hiperplasia ProstÃ¡tica Benigna (HPB), Terapia Expulsiva Renal para CÃ¡lculo em Ureter Distal',
    dose: '0.4mg VO 1x ao dia apÃ³s o cafÃ© da manhÃ£',
    frequency: '24/24h',
    presentation: '0.4mg (CÃ¡psulas de LiberaÃ§Ã£o Prolongada)',
    renalAdjustment: 'NÃ£o requer ajuste em DRC leve/moderada.',
    category: 'Urologia',
    notes: 'Bloqueador Alfa-1A AdrenÃ©rgico seletivo prostÃ¡tico. Promove relaxamento do colo vesical. Pode causar tontura ortostÃ¡tica e ejaculaÃ§Ã£o retrÃ³grada.'
  },
  {
    id: 'm113',
    name: 'Finasterida',
    indication: 'Hiperplasia ProstÃ¡tica Benigna (ReduÃ§Ã£o do volume prostÃ¡tico), Alopecia AndrogenÃ©tica',
    dose: '5mg VO ao dia (HPB) / 1mg VO ao dia (Alopecia)',
    frequency: '24/24h',
    presentation: '1mg, 5mg (Comprimidos)',
    renalAdjustment: 'NÃ£o requer ajuste.',
    category: 'Urologia',
    notes: 'Inibidor da 5-alfa-redutase. Reduz os nÃ­veis de PSA pela metade (multiplicar o valor do teste laboratorial por 2 para interpretaÃ§Ã£o correta).'
  },
  {
    id: 'm114',
    name: 'Permetrina 5%',
    indication: 'Tratamento de Escabiose (Sarna) e Pediculose (Piolho)',
    dose: 'Aplicar do pescoÃ§o aos pÃ©s Ã  noite, deixar agir por 8 a 14 horas e lavar. Repetir apÃ³s 7 dias.',
    frequency: 'AplicaÃ§Ã£o Ãºnica Ã  noite (Repetir em 7 dias)',
    presentation: 'LoÃ§Ã£o DermatolÃ³gica 5% (Frasco de 60mL), Cream Shampoo 1%',
    renalAdjustment: 'NÃ£o absorvido sistemicamente.',
    category: 'Dermatologia',
    notes: 'Tratar obrigatoriamente TODOS os comunicantes do domicÃ­lio simultaneamente. Lavar roupas de cama em Ã¡gua quente.'
  },
  {
    id: 'm115',
    name: 'Neomicina + Bacitracina (Nebacetin)',
    indication: 'InfecÃ§Ãµes bacterianas superficiais de pele, feridas operatÃ³rias pequenas, queimaduras leves',
    dose: 'Aplicar fina camada sobre a lesÃ£o de 2 a 3x ao dia',
    frequency: '8/8h ou 12/12h por 5 a 7 dias',
    presentation: 'Pomada DermatolÃ³gica (Tubo de 15g e 50g)',
    renalAdjustment: 'Uso tÃ³pico seguro em lesÃµes nÃ£o extensas.',
    category: 'Dermatologia',
    notes: 'CombinaÃ§Ã£o tÃ³pica de aminoglicosÃ­deo e polipeptÃ­deo. Evitar uso em grandes superfÃ­cies abertas devido risco de ototoxicidade/nefrotoxicidade.'
  }
];

// --- Prescription Data ---

const PRESCRIPTIONS = [
  {
    id: 'p1',
    title: 'Pneumonia ComunitÃ¡ria (Adulto - Enfermaria)',
    category: 'Infectologia',
    items: [
      'Dieta livre para idade conforme aceitaÃ§Ã£o.',
      'Acesso venoso perifÃ©rico.',
      'Ceftriaxona 2g IV 1x ao dia.',
      'Azitromicina 500mg VO 1x ao dia (por 3-5 dias).',
      'Dipirona 1g IV de 6/6h se dor ou febre (T > 37.8ÂºC).',
      'Bromoprida 10mg IV de 8/8h se nÃ¡useas ou vÃ´mitos.',
      'InalaÃ§Ã£o com SF 0,9% 5mL de 6/6h.',
      'Cabeceira elevada (30-45Âº).'
    ],
    guidelines: 'Avaliar escore CURB-65 para decidir internaÃ§Ã£o. Se CURB >= 2, internaÃ§Ã£o indicada.'
  },
  {
    id: 'p2',
    title: 'InsuficiÃªncia CardÃ­aca Descompensada (Perfil B)',
    category: 'Cardiologia',
    items: [
      'Dieta hipossÃ³dica (2g/dia) e restriÃ§Ã£o hÃ­drica (800-1000mL).',
      'Furosemida 40mg IV 12/12h (dobrar dose usual de casa).',
      'Enalapril 5mg VO 12/12h (manter conforme tolerÃ¢ncia arterial).',
      'Carvedilol 6.25mg VO 12/12h (manter se jÃ¡ usava e PAM > 90).',
      'Acompanhar balanÃ§o hÃ­drico rigoroso.',
      'Peso diÃ¡rio em jejum.',
      'Oxigenioterapia se SatO2 < 92%.'
    ],
    guidelines: 'O objetivo Ã© a "euvolatizaÃ§Ã£o". Monitorar eletrÃ³litos e funÃ§Ã£o renal diariamente.'
  },
  {
    id: 'p3',
    title: 'Sepse - Protocolo das Primeiras 3 Horas',
    category: 'EmergÃªncia',
    items: [
      'Acesso venoso calibroso (2x).',
      'Coletar 2 pares de Hemoculturas (antes do ATB).',
      'Coletar Lactato Arterial/Venoso.',
      'Cristaloide 30mL/kg IV rÃ¡pido (se hipotensÃ£o ou lactato >= 4).',
      'Ceftriaxona 2g IV (fazer na primeira hora).',
      'OxigÃªnio para SatO2 92-96%.',
      'MonitorizaÃ§Ã£o contÃ­nua (ECG, Oximetria, PAM).'
    ],
    guidelines: 'Se PAM < 65 apÃ³s volume, iniciar Noradrenalina. Reavaliar lactato em 2-4h.'
  },
  {
    id: 'p4',
    title: 'InfecÃ§Ã£o do Trato UrinÃ¡rio - ITU (Cistite)',
    category: 'Infectologia',
    items: [
      'NitrofurantoÃ­na 100mg VO 12/12h por 5 dias.',
      'OU Fosfomicina 3g VO dose Ãºnica.',
      'Pyridium 200mg VO 8/8h se disÃºria intensa (mÃ¡x 2 dias).',
      'Aumentar ingestÃ£o hÃ­drica (+2L/dia).',
      'Higiene Ã­ntima adequada.'
    ],
    guidelines: 'Sempre avaliar sinais de Pielonefrite (Febre, Calafrios, Dor lombar/Giordano).'
  },
  {
    id: 'p5',
    title: 'Infarto Agudo do MiocÃ¡rdio (IAM) - Conduta Inicial',
    category: 'Cardiologia',
    items: [
      'Aspirina (AAS) 200-300mg (mastigar).',
      'Clopidogrel 300mg VO (Ataque).',
      'Nitroglicerina (Isordil) 5mg SL se dor persistente (evitar se PAS < 90).',
      'OxigÃªnio se SatO2 < 90%.',
      'Morfina 2-4mg IV se dor refratÃ¡ria.',
      'Encaminhar p/ HemodinÃ¢mica (Cateterismo) imediatamente.'
    ],
    guidelines: 'Tempo Ã© mÃºsculo! Delta T ideal < 90 minutos para angioplastia primÃ¡ria.'
  },
  {
    id: 'p6',
    title: 'Crise Hipertensiva (EmergÃªncia - Nitroprussiato)',
    category: 'EmergÃªncia',
    items: [
      'InternaÃ§Ã£o em UTI / Sala Vermelha.',
      'MonitorizaÃ§Ã£o invasiva de PA (PAI) preferencialmente.',
      'Nitroprussiato de SÃ³dio (Nipride): Iniciar 0.3 a 0.5 mcg/kg/min.',
      'Titular dose para reduzir PAM em 20-25% na primeira hora.',
      'Monitorar intoxicaÃ§Ã£o por tiocianato se uso > 48h ou IR.',
      'Trocar para medicaÃ§Ã£o VO assim que estÃ¡vel.'
    ],
    guidelines: 'NÃ£o baixar a pressÃ£o bruscamente no AVC isquÃªmico (apenas se > 185/110 para trombÃ³lise).'
  },
  {
    id: 'p7',
    title: 'Crise Convulsiva (Estado de Mal EpilÃ©ptico)',
    category: 'Neurologia',
    items: [
      'ProteÃ§Ã£o de via aÃ©rea e aspiraÃ§Ã£o se necessÃ¡rio.',
      'Oximetria e ECG contÃ­nuos.',
      'Diazepam 10mg IV lento (repetir 1x em 5min se necessÃ¡rio).',
      'FosfenitoÃ­na 20mg/kg IV (Ataque) se persistir.',
      'Se refratÃ¡rio: Midazolam em bomba IV ou Propofol.',
      'Investigar causa (Glicemia, EletrÃ³litos, TC).'
    ],
    guidelines: 'Sempre testar glicemia capilar imediatamente. Considerar Tiamina se suspeita de Wernicke.'
  },
  {
    id: 'p8',
    title: 'Anafilaxia - Conduta Imediata',
    category: 'EmergÃªncia',
    items: [
      'ADRENALINA 1:1000 0.5mg IM (Vasto Lateral Coxa) IMEDIATO.',
      'DecÃºbito dorsal com membros inferiores elevados.',
      'Oxigenioterapia sob mÃ¡scara.',
      'ExpansÃ£o volÃªmica vigorosa (SF 0,9% 1-2L).',
      'Prometazina 50mg IM ou IV e Hidrocortisona 500mg IV.',
      'Observar por no mÃ­nimo 6-8h apÃ³s remissÃ£o.'
    ],
    guidelines: 'A adrenalina Ã© o tratamento definitivo. NÃ£o atrasar por outras medicaÃ§Ãµes.'
  },
  {
    id: 'p9',
    title: 'Cetoacidose DiabÃ©tica (Adulto)',
    category: 'Endocrinologia',
    items: [
      'ReposiÃ§Ã£o volÃªmica: 1L de SF 0,9% na 1Âª hora.',
      'Insulina Regular 0.1 UI/kg em bolus + 0.1 UI/kg/h em bomba.',
      'ReposiÃ§Ã£o de PotÃ¡ssio: Adicionar se K+ < 5.2 (se < 3.3, adiar insulina).',
      'HCO3- apenas se pH < 6.9.',
      'Monitorar Glicemia (1/1h) e EletrÃ³litos (2/2h).',
      'Trocar para SG 5% quando glicemia < 250.'
    ],
    guidelines: 'CritÃ©rio de resoluÃ§Ã£o: pH > 7.3, HCO3 > 18, Anion Gap < 12.'
  },
  {
    id: 'p10',
    title: 'DPOC Descompensado',
    category: 'Pneumologia',
    items: [
      'Oxigenioterapia (Alvo SatO2: 88-92%).',
      'Fenoterol 10 gotas + IpratrÃ³pio 20 gotas de 4/4h ou 6/6h.',
      'Prednisona 40mg VO por 5 dias.',
      'Amoxicilina + Clavulanato 875/125mg 12/12h (se sinais de infecÃ§Ã£o).',
      'VNI se acidose respiratÃ³ria ou desconforto grave.'
    ],
    guidelines: 'Sinais de infecÃ§Ã£o: Aumento de escarro, purulÃªncia ou piora da dispneia.'
  },
  {
    id: 'p11',
    title: 'AVC IsquÃªmico - Protocolo de TrombÃ³lise',
    category: 'Neurologia',
    items: [
      'Acesso venoso calibroso (exclusivo).',
      'Manter PA < 185/110 mmHg para trombolisar.',
      'Alteplase (rtPA): 0.9 mg/kg (Max 90mg).',
      'Fazer 10% em bolus e 90% em infusÃ£o contÃ­nua em 60 min.',
      'Monitorar sinais de sangramento e nÃ­vel de consciÃªncia.',
      'NÃƒO usar antiagregantes ou anticoagulantes nas primeiras 24h.'
    ],
    guidelines: 'Janela terapÃªutica: 4,5 horas do inÃ­cio dos sintomas.'
  },
  {
    id: 'p12',
    title: 'Meningite Bacteriana Aguda (Suspeita)',
    category: 'Infectologia',
    items: [
      'Hemoculturas + Coleta de LÃ­quor (se sem contraindicaÃ§Ã£o).',
      'Dexametasona 10mg IV (fazer ANTES ou junto com o ATB).',
      'Ceftriaxona 2g IV 12/12h.',
      'Vancomicina 1g a 1.5g IV 12/12h.',
      'Ampicilina 2g IV 4/4h (se > 50 anos ou imunossuprimido).',
      'Isolamento de gotÃ­culas por 24h pÃ³s inÃ­cio do ATB.'
    ],
    guidelines: 'Prioridade absoluta: inÃ­cio rÃ¡pido do antibiÃ³tico.'
  },
  {
    id: 'p13',
    title: 'Crise de Asma / DPOC Exacerbado',
    category: 'Pneumologia',
    items: [
      'Salbutamol 100mcg: 4-10 jatos com espaÃ§ador a cada 20 min por 1h.',
      'Prednisona 40-50mg VO por 5-7 dias.',
      'Brometo de IpratrÃ³pio 250mcg: 4 jatos de 20/20 min se grave.',
      'OxigÃªnio para manter SatO2 88-92% (DPOC) ou 93-95% (Asma).',
      'Reavaliar necessidade de AntibiÃ³tico (se escarro purulento).'
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
      'Solicitar Endoscopia Digestiva Alta (EDA) de urgÃªncia.'
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
      'Analgesia (Dipirona 1g IV) + AntiemÃ©ticos.',
      'HidrataÃ§Ã£o vigorosa se sinais de sepse.',
      'Coletar Urocultura e Hemoculturas antes do ATB.'
    ],
    guidelines: 'Ajustar ATB conforme cultura apÃ³s 48-72h.'
  },
  {
    id: 'p16',
    title: 'FibrilaÃ§Ã£o Atrial com Resposta Ventricular Alta',
    category: 'Cardiologia',
    items: [
      'Metoprolol 5mg IV lento (max 3 doses) OU Atenolol 50mg VO.',
      'Considerar DeslanosÃ­deo 0.4mg IV se IC associada.',
      'Amiodarona 300mg IV em 1h (se controle de ritmo indicado).',
      'Avaliar AnticoagulaÃ§Ã£o (Enoxaparina 1mg/kg 12/12h) conforme CHADS-VASc.',
      'Monitorar FC (Alvo < 110 bpm em repouso).'
    ],
    guidelines: 'Sempre descartar causas secundÃ¡rias (Sepse, TEP, Hipertireoidismo).'
  },
  {
    id: 'p17',
    title: 'Celulite / Erisipela (Adulto)',
    category: 'Infectologia',
    items: [
      'Cefalexina 500mg VO 6/6h (Ambulatorial).',
      'OU Oxacilina 2g IV 4/4h (Hospitalar).',
      'ElevaÃ§Ã£o do membro afetado.',
      'Dipirona 1g VO/IV SOS dor/febre.',
      'Demarcar Ã¡rea com caneta para monitorar progressÃ£o.'
    ],
    guidelines: 'Considerar cobertura p/ MRSA se fator de risco ou mÃ¡ evoluÃ§Ã£o.'
  },
  {
    id: 'p18',
    title: 'Crise Convulsiva / Estado de Mal (InÃ­cio)',
    category: 'Neurologia',
    items: [
      'Diazepam 10mg IV (ataque - max 20mg).',
      'FenitoÃ­na 20mg/kg IV (fase de impregnaÃ§Ã£o - max 50mg/min).',
      'Glicemia Capilar IMEDIATA.',
      'OxigÃªnio 10L/min em mÃ¡scara + ProteÃ§Ã£o de via aÃ©rea.',
      'MonitorizaÃ§Ã£o cardÃ­aca e oximetria.'
    ],
    guidelines: 'Cronometrar o tempo. ApÃ³s 5 min de crise ativa = Estado de Mal EpilÃ©ptico.'
  },
  {
    id: 'p19',
    title: 'Dengue - Manejo ClÃ­nico (Grupo B/C)',
    category: 'Infectologia',
    items: [
      'ReposiÃ§Ã£o volÃªmica oral vigorosa (SRO) 60mL/kg/dia.',
      'Paracetamol 500-750mg VO atÃ© 6/6h se dor ou febre.',
      'Dipirona 1g VO/IV atÃ© 6/6h (evitar se sinais de choque).',
      'NÃƒO usar AINEs ou AAS (Risco de sangramento).',
      'Monitorar sinais de alarme: Dor abdominal intensa, vÃ´mitos persistentes, queda brusca de plaquetas.',
      'Solicitar Hemograma completo + HematÃ³crito diÃ¡rio.'
    ],
    guidelines: 'Atentar para a fase crÃ­tica (defervescÃªncia da febre). O hematÃ³crito em ascensÃ£o sugere hemoconcentraÃ§Ã£o.'
  },
  {
    id: 'p20',
    title: 'Hipercalemia Aguda (K > 6.5 ou AlteraÃ§Ã£o ECG)',
    category: 'Nefrologia',
    items: [
      'Gluconato de CÃ¡lcio 10% 10mL IV lento (3-5 min) - Se alteraÃ§Ã£o ECG.',
      'SoluÃ§Ã£o Polarizante: 10 UI Insulina Regular + 50g Glicose (SG 50% 100mL) IV em 20-30 min.',
      'NebulizaÃ§Ã£o com Fenoterol 10-20 gotas (Beta-2 agonista shift transcelular).',
      'Furosemida 40-80mg IV se paciente nÃ£o anÃºrico.',
      'Resina de Troca (Sorcal) 30g VO de 6/6h ou 8/8h.',
      'Considerar HemodiÃ¡lise de urgÃªncia se refratÃ¡rio ou IR grave.'
    ],
    guidelines: 'O CÃ¡lcio estabiliza a membrana, mas nÃ£o reduz o potÃ¡ssio. Reavaliar K+ em 2h.'
  },
  {
    id: 'p21',
    title: 'Herpes Zoster (Adulto)',
    category: 'Infectologia',
    items: [
      'Aciclovir 800mg VO 5x ao dia por 7 dias.',
      'OU Valaciclovir 1g VO 8/8h por 7 dias.',
      'Gabapentina 300mg VO Ã  noite (prevenÃ§Ã£o de neuralgia pÃ³s-herpÃ©tica).',
      'Dipirona 1g + Tramadol 50mg se dor intensa.',
      'Compressas frias e limpeza local com SF 0,9%.',
      'Orientar isolamento de contato das lesÃµes.'
    ],
    guidelines: 'Ideal iniciar tratamento nas primeiras 72h do surgimento das vesÃ­culas.'
  },
  {
    id: 'p22',
    title: 'Faringoamigdalite Bacteriana (Suspeita)',
    category: 'Otorrinolaringologia',
    items: [
      'Amoxicilina 500mg VO 8/8h por 10 dias.',
      'OU Penicilina G Benzatina 1.200.000 UI IM dose Ãºnica.',
      'Ibuprofeno 600mg VO 8/8h por 3 dias (analgesia/anti-inflamatÃ³rio).',
      'Nistatina soluÃ§Ã£o (bochecho) se candidÃ­ase associada.',
      'Repouso e hidrataÃ§Ã£o.'
    ],
    guidelines: 'Avaliar critÃ©rios de Centor. Se 4-5 pontos, probabilidade de Estrepto Ã© > 50%.'
  },
  {
    id: 'p23',
    title: 'Crise de Gota Aguda',
    category: 'Reumatologia',
    items: [
      'Naproxeno 500mg VO 12/12h por 3-5 dias.',
      'Colchicina 0.5mg VO 8/8h (ou 12/12h conforme tolerÃ¢ncia GI).',
      'Prednisona 30-40mg VO 1x ao dia se contraindicaÃ§Ã£o a AINE.',
      'Repouso da articulaÃ§Ã£o afetada.',
      'NÃƒO iniciar Alopurinol na crise aguda (se jÃ¡ usa, manter).'
    ],
    guidelines: 'Alvo de Ã¡cido Ãºrico no seguimento: < 6.0 mg/dL.'
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
      'HidrataÃ§Ã£o venosa se necessÃ¡rio.',
      'SintomÃ¡ticos: Dipirona 1g IV atÃ© 6/6h por dor ou febre.'
    ],
    guidelines: 'Considerar cobertura para MRSA ou Pseudomonas se fatores de risco presentes.'
  },
  {
    id: 'p25',
    title: 'InfecÃ§Ã£o do Trato UrinÃ¡rio (Cistite)',
    category: 'Urologia',
    items: [
       'NitrofurantoÃ­na 100mg VO 12/12h por 5 dias.',
       'OU Fosfomicina 3g VO dose Ãºnica.',
       'Fenazopiridina 200mg VO 8/8h por 2 dias (analgesia urinÃ¡ria).',
       'Aumento da ingesta hÃ­drica.',
       'Coletar Urocultura + EAS antes de iniciar tratamento.'
    ],
    guidelines: 'Em gestantes, evitar quinolonas. Preferir Cefalexina ou Amoxicilina.'
  },
  {
    id: 'p26',
    title: 'Acidente Vascular Cerebral (Fase Aguda)',
    category: 'Neurologia',
    items: [
      'Cabeceira 0 graus (se tolerÃ¡vel).',
      'MonitorizaÃ§Ã£o contÃ­nua + O2 se SaO2 < 94%.',
      'Controle de PA: Manter < 185/110 se elegÃ­vel para trombÃ³lise.',
      'Glicemia Capilar: Tratar hipo/hipermetabolismo.',
      'TC de CrÃ¢nio (Sem Contraste) IMEDIATO.',
      'TrombÃ³lise (Alteplase) se < 4.5h do inÃ­cio e sem contraindicaÃ§Ãµes.'
    ],
    guidelines: 'Tempo Ã© CÃ©rebro. NIHSS inicial Ã© mandatÃ³rio para prognÃ³stico.'
  },
  {
    id: 'p27',
    title: 'InsuficiÃªncia CardÃ­aca Descompensada (Perfil B)',
    category: 'Cardiologia',
    items: [
      'RestriÃ§Ã£o hÃ­drica (conforme gravidade).',
      'Furosemida 20-40mg IV 12/12h ou 8/8h (ajustar p/ diurese).',
      'Manter medicaÃ§Ãµes de base (iECA/BRA, Beta-bloq) se estÃ¡vel hemodinamicamente.',
      'Dose de ataque de Espironolactona se nÃ£o houver contraindicaÃ§Ã£o.',
      'OxigÃªnio se SaO2 < 94%.',
      'BalanÃ§o hÃ­drico rigoroso.'
    ],
    guidelines: 'Perfil B: Quente e Ãšmido. O objetivo Ã© a volemia.'
  },
  {
    id: 'p28',
    title: 'DPOC Exacerbada',
    category: 'Pneumologia',
    items: [
      'NBZ com Fenoterol 10 gotas + IpratrÃ³pio 20 gotas atÃ© 4/4h.',
      'Prednisona 40mg VO por 5 dias.',
      'Antibioticoterapia (Amoxicilina + Clavulanato ou Levofloxacino) por 5-7 dias.',
      'OxigÃªnio com alvo de SaO2 88-92% (evitar hiperÃ³xia).',
      'VNI se acidose respiratÃ³ria (pH < 7.35) ou dispneia persistente.'
    ],
    guidelines: 'O uso de O2 em excesso pode causar narcose por CO2 em pacientes retentores.'
  },
  {
    id: 'p29',
    title: 'DesidrataÃ§Ã£o Grave (Plano C)',
    category: 'EmergÃªncia / Pediatria',
    items: [
      'SF 0,9% IV 20mL/kg correr em 20-30 min (repetir atÃ© estabilizar).',
      'OU Ringer Lactato IV 20mL/kg (preferÃ­vel se disponÃ­vel).',
      'Monitorar sinais vitais, perfusÃ£o perifÃ©rica e nÃ­vel de consciÃªncia.',
      'Se choque refratÃ¡rio, considerar expansÃ£o adicional e investigar causas.',
      'Passar para Plano B (ReidrataÃ§Ã£o Oral) assim que o nÃ­vel de consciÃªncia e hidrataÃ§Ã£o melhorarem.'
    ],
    guidelines: 'A fase de expansÃ£o rÃ¡pida Ã© crucial para reverter o choque volÃªmico.'
  },
  {
    id: 'p30',
    title: 'Cetoacidose DiabÃ©tica (CAD) - Manejo Inicial',
    category: 'Endocrinologia',
    items: [
      'ReposiÃ§Ã£o VolÃªmica: SF 0,9% 1000mL IV na primeira hora.',
      'Insulina Regular 0,1 UI/kg IV (Bolus) seguida de 0,1 UI/kg/h (Bomba).',
      'OU Insulina Regular 0,15 UI/kg IV (Bolus) se nÃ£o houver Bomba.',
      'PotÃ¡ssio: Repor 20-30mEq/L se K+ < 5,2 mEq/L (postergar insulina se K < 3,3).',
      'Monitorar Glicemia Capilar de 1/1h e EletrÃ³litos/Gasometria de 2/2h ou 4/4h.',
      'HCO3: Considerar se pH < 6,9.'
    ],
    guidelines: 'O objetivo Ã© fechar o hiato aniÃ´nico (Ã¢nion-gap), nÃ£o apenas baixar a glicemia.'
  },
  {
    id: 'p31',
    title: 'Edema Agudo de PulmÃ£o (EAP)',
    category: 'Cardiologia',
    items: [
      'Sentar o paciente com pernas pendentes.',
      'OxigÃªnio (VNI preferencial se CPAP/BiPAP disponÃ­vel).',
      'Furosemida 40-80mg IV (Bolus).',
      'Nitroglicerina (Tridil) se PAS > 110 mmHg (Nitropalato se crise hipertensiva severa).',
      'Morfina 2-4mg IV (se dor ou agitaÃ§Ã£o intensa, com cautela).',
      'Investigar causa (IAM, Arritmia, MÃ¡ adesÃ£o, InfecÃ§Ã£o).'
    ],
    guidelines: 'MOV: MonitorizaÃ§Ã£o, OxigÃªnio e Veia sÃ£o mandatÃ³rios.'
  },
  {
    id: 'p32',
    title: 'Crise Convulsiva PediÃ¡trica',
    category: 'Pediatria / Neurologia',
    items: [
      'ProteÃ§Ã£o de vias aÃ©reas e lateralizaÃ§Ã£o do paciente.',
      'Diazepam 0,3-0,5mg/kg EV ou Intra-retal (Max: 10mg).',
      'OU Midazolam 0,2mg/kg IM ou Intra-nasal.',
      'Repetir apÃ³s 5 min se crise persistir.',
      'FenitoÃ­na 20mg/kg EV (ataque) se refratÃ¡rio a benzodiazepÃ­nicos.',
      'Verificar glicemia e temperatura (Febre?).'
    ],
    guidelines: 'Manejo agressivo apÃ³s 5 min de crise ativa para evitar estado de mal.'
  },
  {
    id: 'p33',
    title: 'ReposicÌ§aÌƒo de SÃ³dio (Hiponatremia)',
    category: 'EletrÃ³litos',
    items: [
      'CÃ¡lculo do DÃ©ficit: (Na desejado - Na atual) * 0.6 * Peso (Homem) ou 0.5 (Mulher).',
      'Velocidade: NÃ£o exceder 8-10mEq/L em 24h (Risco de MielinÃ³lise Pontina).',
      'UrgÃªncia (Crise Convulsiva): NaCl 3% 1mL/kg IV em 10-20 min (atÃ© 3x).',
      'MonitorizaÃ§Ã£o horÃ¡ria de sÃ³dio plasmÃ¡tico em casos graves.'
    ],
    guidelines: 'A correÃ§Ã£o excessivamente rÃ¡pida Ã© extremamente perigosa.'
  },
  {
    id: 'p34',
    title: 'HidrataÃ§Ã£o de ManutenÃ§Ã£o (Holliday-Segar)',
    category: 'Pediatria / Geral',
    items: [
      'AtÃ© 10kg: 100mL / kg.',
      '10kg a 20kg: 1000mL + 50mL para cada kg > 10.',
      '> 20kg: 1500mL + 20mL para cada kg > 20.',
      'EletrÃ³litos usuais: NaCl 20% (2-4 mEq/100mL) + KCl 10% (1-2 mEq/100mL).',
      'Glicose 5% Ã© o veÃ­culo padrÃ£o.'
    ],
    guidelines: 'Ajustar para febre, perdas digestivas ou atividade fÃ­sica intensa.'
  },
  {
    id: 'p35',
    title: 'Anafilaxia',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: InÃ­cio sÃºbito + Envolvimento cutÃ¢neo (80%) + Comprometimento Resp/CirculatÃ³rio.',
      'Adrenalina 1mg/mL: 0,3-0,5mg IM (Vasto Lateral) - Repetir a cada 5-15 min.',
      'PosiÃ§Ã£o: DecÃºbito dorsal com pernas elevadas.',
      'ExpansÃ£o VolÃªmica: SF 0,9% 1-2L rÃ¡pido se hipotensÃ£o.'
    ],
    guidelines: 'Prioridade absoluta: Adrenalina IM e Vias AÃ©reas.'
  },
  {
    id: 'p36',
    title: 'AVC IsquÃªmico Agudo',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: DÃ©ficit sÃºbito focal (Escala de Cincinnati/NIHSS).',
      'Exame: TC de CrÃ¢nio sem contraste imediata (descartar hemorragia).',
      'Controle de PA: Manter < 185/110 mmHg para trombÃ³lise.',
      'TrombÃ³lise: Alteplase se < 4,5h do inÃ­cio.'
    ],
    guidelines: 'Porta-TC deve ser menor que 20-25 minutos.'
  },
  {
    id: 'p39',
    title: 'Parada CardiorrespiratÃ³ria (PCR)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: AusÃªncia de pulso e movimentos respiratÃ³rios.',
      'CAB: CompressÃµes (100-120/min) + Via AÃ©rea + Boa VentilaÃ§Ã£o.',
      'Ritmos ChocÃ¡veis (FV/TVSP): Choque 200J + Adrenalina 1mg a cada 3-5min + Amiodarona 300mg.',
      'Ritmos NÃ£o ChocÃ¡veis (AESP/Assistolia): Adrenalina imediata + RCP contÃ­nua.'
    ],
    guidelines: 'Minimizar interrupÃ§Ãµes nas compressÃµes torÃ¡cicas.'
  },
  {
    id: 'p40',
    title: 'Apensicite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Dor em FID, Sinais de Blumberg e Rovsing positivos.',
      'Escore de Alvarado: Dor migratÃ³ria, anorexia, nÃ¡useas, leucocitose.',
      'Exame: USG Abdomen ou TC com contraste.',
      'Conduta: Jejum, HidrataÃ§Ã£o, Antibioticoterapia (Cefoxitina) e Cirurgia.'
    ],
    guidelines: 'NÃ£o administrar analgÃ©sicos potentes antes da avaliaÃ§Ã£o do cirurgiÃ£o.'
  },
  {
    id: 'p41',
    title: 'Crise de Asma Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: SibilÃ¢ncia, dispneia e uso de musculatura acessÃ³ria.',
      'Manejo: Fenoterol (Berotec) + IpratrÃ³pio (Atrovent) em nebulizaÃ§Ã£o a cada 20 min.',
      'Corticoide: Metilprednisolona 1-2mg/kg ou Prednisona VO.',
      'Sulfato de MagnÃ©sio: Considerar 2g IV em crises graves refratÃ¡rias.'
    ],
    guidelines: 'Monitorar SatO2 (Alvo 93-95%) e Peak Flow.'
  },
  {
    id: 'p42',
    title: 'Pequenas InfecÃ§Ãµes / Resfriado',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Sintomas leves, estÃ¡vel, sem sinais de sepse ou instabilidade.',
      'Tratamento: SintomÃ¡ticos (Dipirona, Paracetamol), lavagem nasal.',
      'OrientaÃ§Ãµes: HidrataÃ§Ã£o oral e repouso.',
      'Retorno: Se febre persistente > 3 dias ou dispneia.'
    ],
    guidelines: 'EducaÃ§Ã£o do paciente sobre o carÃ¡ter autolimitado da doenÃ§a.'
  },
  {
    id: 'p43',
    title: 'Choque SÃ©ptico',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Necessidade de vasopressor para PAM > 65 + Lactato > 2.',
      'Pacote 1h: Colher culturas + Lactato + AntibiÃ³tico Amplo Espectro.',
      'Cristaloide: 30mL/kg (avaliar resposta volÃªmica - Delta PP ou VCI).',
      'Vasopressor: Noradrenalina se PAM < 65 apÃ³s volume.'
    ],
    guidelines: 'O tempo para o inÃ­cio do antibiÃ³tico Ã© o principal preditor de mortalidade.'
  },
  {
    id: 'p44',
    title: 'Edema Agudo de PulmÃ£o (EAP)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Dispneia grave, estertores crepitantes, ortopneia.',
      'Manejo: VNI imediata (CPAP/BiPAP) - reduz necessidade de IOT.',
      'Vasodilatadores: Nitroglicerina (Tridil) se PAS > 110 mmHg.',
      'DiurÃ©tico: Furosemida 40-80mg IV (dose-dobro se uso crÃ´nico).'
    ],
    guidelines: 'Evitar morfina rotineiramente; priorizar VNI e vasodilataÃ§Ã£o.'
  },
  {
    id: 'p45',
    title: 'Cetoacidose DiabÃ©tica (CAD)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Glicemia > 250 + pH < 7.3 ou HCO3 < 18 + CetonÃºria.',
      'HidrataÃ§Ã£o: SF 0,9% 1-1,5L na 1Âª hora.',
      'PotÃ¡ssio: NÃ£o iniciar insulina se K < 3.3. Repor se K < 5.2.',
      'Insulina: 0,1 U/kg/h apÃ³s inÃ­cio da hidrataÃ§Ã£o.'
    ],
    guidelines: 'Monitorar glicemia capilar horÃ¡ria e eletrÃ³litos a cada 2-4h.'
  },
  {
    id: 'p46',
    title: 'Tromboembolismo Pulmonar (TEP)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Score de Wells + D-DÃ­mero (se Wells â‰¤ 4 ou improvÃ¡vel).',
      'Score de Wells (TEP): Sinais de TVP (+3), Outro diagnÃ³stico menos provÃ¡vel (+3), FC > 100 (+1.5), ImobilizaÃ§Ã£o/Cirurgia (+1.5), TVP/TEP prÃ©vio (+1.5), Hemoptise (+1), CÃ¢ncer (+1).',
      'InterpretaÃ§Ã£o Wells: â‰¤ 4 (TEP improvÃ¡vel - pedir D-DÃ­mero); > 4 (TEP provÃ¡vel - imagem direta).',
      'Imagem: Angio-TC de TÃ³rax (padrÃ£o-ouro).',
      'Estabilidade: Se InstÃ¡vel (Choque) -> TrombÃ³lise.',
      'Se EstÃ¡vel: AnticoagulaÃ§Ã£o (Enoxaparina 1mg/kg 12/12h).'
    ],
    guidelines: 'Classificar risco com score PESI ou PESI simplificado.'
  },
  {
    id: 'p47',
    title: 'Lombalgia Aguda',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Dor lombar sem sinais de alarme (Red Flags).',
      'Red Flags: Perda de forÃ§a, anestesia em sela, trauma, cÃ¢ncer, febre.',
      'Manejo: AINES (Ibuprofeno/Naproxeno) + Ciclobenzaprina.',
      'OrientaÃ§Ãµes: Manter-se ativo; evitar repouso absoluto prolongado.'
    ],
    guidelines: 'Exames de imagem nÃ£o sÃ£o indicados na ausÃªncia de Red Flags.'
  },
  {
    id: 'p48',
    title: 'Hemorragia Digestiva Alta (HDA)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: HematÃªmese ou Melena + Instabilidade hemodinÃ¢mica.',
      'Manejo: Acesso Calibroso (x2), ExpansÃ£o VolÃªmica, IBP IV (Omeprazol 80mg bolus).',
      'Varicosa: Terlipressina ou Octreotide + Ceftriaxona.',
      'Conduta: Endoscopia Digestiva Alta (EDA) em < 24h (ou imediata se instÃ¡vel).'
    ],
    guidelines: 'Estabilizar hemodinÃ¢mica antes da endoscopia.'
  },
  {
    id: 'p49',
    title: 'Trauma Grave (ATLS)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'A: Via AÃ©rea com proteÃ§Ã£o de coluna cervical.',
      'B: RespiraÃ§Ã£o e VentilaÃ§Ã£o (O2, avaliar PneumotÃ³rax).',
      'C: CirculaÃ§Ã£o com controle de hemorragia e ReposiÃ§Ã£o volÃªmica.',
      'D: DisfunÃ§Ã£o NeurolÃ³gica (GCS, pupilas).',
      'E: ExposiÃ§Ã£o e Controle de Hipotermia.'
    ],
    guidelines: 'Seguir rigorosamente a sequÃªncia do ABCDE.'
  },
  {
    id: 'p50',
    title: 'Queimadura Grave',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'CritÃ©rios: > 20% SCQ (Adulto), > 10% (CrianÃ§a) ou vias aÃ©reas.',
      'FÃ³rmula de Parkland: 4mL x Peso x %SCQ (dar metade nas primeiras 8h).',
      'Via AÃ©rea: Suspeitar de lesÃ£o por inalaÃ§Ã£o se fuligem em orofaringe.',
      'Analgesia: Morfina ou Fentanil IV.'
    ],
    guidelines: 'Utilizar Ringer Lactato como fluido de escolha.'
  },
  {
    id: 'p51',
    title: 'Pneumonia (PAC)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Tosse, febre, dispneia e infiltrado no Rx de TÃ³rax.',
      'Escore CURB-65: ConfusÃ£o, Ureia > 50, Resp > 30, B (PA < 90/60), 65 anos.',
      'CURB 0-1: AmbulatÃ³rio (Amoxiclav). CURB 2: Enfermaria. CURB 3+: UTI.',
      'AntibiÃ³tico: Ceftriaxona + Azitromicina (se internaÃ§Ã£o).'
    ],
    guidelines: 'Iniciar antibiÃ³tico na primeira hora se sinais de sepse.'
  },
  {
    id: 'p52',
    title: 'InfecÃ§Ã£o UrinÃ¡ria (ITU/Pielo)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: DisÃºria, polaciÃºria + Giordano positivo (se Pielo).',
      'Exames: Urina 1 + Urocultura.',
      'AntibiÃ³tico (Cistite): NitrofurantoÃ­na ou Fosfomicina.',
      'AntibiÃ³tico (Pielo): Ciprofloxacino ou Ceftriaxona (se internado).'
    ],
    guidelines: 'Gestantes e idosos exigem atenÃ§Ã£o redobrada e internaÃ§Ã£o precoce.'
  },
  {
    id: 'p54',
    title: 'DissecÃ§Ã£o Aguda de Aorta',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Dor torÃ¡cica sÃºbita, "rasgando", com irradiaÃ§Ã£o para dorso.',
      'Sinal: DiferenÃ§a de PA entre membros (> 20 mmHg).',
      'Controle de FC e PA: Beta-bloqueador IV (Esmolol) + Nitroprussiato.',
      'Metas: FC < 60 bpm e PAS entre 100-120 mmHg.',
      'Imagem: Angio-TC de Aorta ou Ecocardio TransesofÃ¡gico.'
    ],
    guidelines: 'Prioridade: Controle da frequÃªncia cardÃ­aca antes da reduÃ§Ã£o da PA.'
  },
  {
    id: 'p55',
    title: 'Hemorragia Intracraniana (AVCh)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Cefaleia sÃºbita, vÃ´mitos em jato, rebaixamento sensorial.',
      'Controle de PA: Manter PAS entre 140-160 mmHg.',
      'ReversÃ£o: Se uso de varfarina (Complexo ProtrumbÃ­nico ou Vit K).',
      'Neurocirurgia: Avaliar drenagem se hematoma > 3cm ou deterioraÃ§Ã£o clÃ­nica.'
    ],
    guidelines: 'Evitar hipotensÃ£o; manter normotermia e normoglicemia.'
  },
  {
    id: 'p56',
    title: 'GECA (Gastroenterocolite Aguda)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Diarreia, vÃ´mitos, dor abdominal.',
      'AvaliaÃ§Ã£o: Sinais de desidrataÃ§Ã£o (Sede, turgor skin, diurese).',
      'Tratamento: ReidrataÃ§Ã£o Oral (SRO) ou Venosa (SF 0,9%) se vÃ´mitos incoercÃ­veis.',
      'SintomÃ¡ticos: Ondansetrona (8mg), Dipirona (1g).',
      'AntibiÃ³tico: Apenas se disenteria grave (Ciprofloxacino).'
    ],
    guidelines: 'Ondansetrona reduz necessidade de hidrataÃ§Ã£o venosa em crianÃ§as.'
  },
  {
    id: 'p57',
    title: 'Cefaleia PrimÃ¡ria (Enxaqueca)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Dor pulsÃ¡til, unilateral, com nÃ¡useas/vÃ´mitos e foto/fonofobia.',
      'Protocolo Abortivo: Dipirona 1-2g IV + Metoclopramida 10mg IV + Cetoprofeno 100mg IV.',
      'Resgate (Opcional): Clorpromazina (Amplictil) 12.5-25mg IV diluÃ­do.',
      'Red Flags: InÃ­cio sÃºbito (Thunderclap), febre, dÃ©ficit focal, > 50 anos.'
    ],
    guidelines: 'Cefaleia Thunderclap exige TC para descartar HSA!'
  },
  {
    id: 'p58',
    title: 'Colecistite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Dor em hipocÃ´ndrio direito, febre, Sinal de Murphy positivo (InterrupÃ§Ã£o da inspiraÃ§Ã£o profunda Ã  palpaÃ§Ã£o do rebordo costal direito).',
      'CritÃ©rios de Tokyo (DiagnÃ³stico): (A) Sinais de inflamaÃ§Ã£o local (Murphy, dor/massa em HCD) + (B) Sinais sistÃªmicos (Febre, PCR elevada, Leucocitose) + (C) Imagem (USG).',
      'Exame: USG de Abdome Superior (parede espessada, cÃ¡lculo impactado).',
      'Manejo: Jejum, HidrataÃ§Ã£o, Analgesia, AntibiÃ³tico (Cipro + Metro).',
      'Cirurgia: Colecistectomia precoce (ideal < 72h).'
    ],
    guidelines: 'Murphy ultrasonogrÃ¡fico Ã© mais sensÃ­vel que o fÃ­sico.'
  },
  {
    id: 'p59',
    title: 'Trombose Venosa Profunda (TVP)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Edema assimÃ©trico, dor, empastamento de panturrilha.',
      'Escore de Wells: PontuaÃ§Ã£o para probabilidade prÃ©-teste.',
      'Exame: Doppler Venoso de membros inferiores.',
      'Tratamento: Enoxaparina (1mg/kg 12/12h) ou DOACs (Rivaroxabana).'
    ],
    guidelines: 'NÃ£o realizar Homan pois pode desprender trombo (baixo valor clÃ­nico).'
  },
  {
    id: 'p60',
    title: 'Cefaleia Tensional',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Dor em aperto, bilateral, leve/moderada, sem nÃ¡useas.',
      'Tratamento: Dipirona ou Paracetamol.',
      'OrientaÃ§Ãµes: Gerenciamento de estresse, ergonomia, sono.',
      'Retorno: Se mudar padrÃ£o de dor ou sintomas neurolÃ³gicos.'
    ],
    guidelines: 'Evitar o uso excessivo de analgÃ©sicos (risco de cefaleia rebote).'
  },
  {
    id: 'p61',
    title: 'Entorse / Trauma Leve',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: HistÃ³ria de trauma, dor localizada, estabilidade articular.',
      'Protocolo RICE: Repouso, Gelo, CompressÃ£o, ElevaÃ§Ã£o.',
      'Analgesia: AINES (Ibuprofeno/Cetoprofeno) por 3-5 dias.',
      'Imagem: Apenas se critÃ©rios de Ottawa para tornozelo/pÃ©.'
    ],
    guidelines: 'Evitar calor local nas primeiras 48-72 horas.'
  },
  {
    id: 'p62',
    title: 'Dengue (Protocolos B, C e D)',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Febre (2-7 dias) + 2 de: NÃ¡useas, Exantema, Mialgia/Artralgia, Cefaleia/Dor retro-orbitÃ¡ria, PetÃ©quias ou Prova do LaÃ§o positiva.',
      'Prova do LaÃ§o: Insuflar manguito na mÃ©dia entre PAS/PAD por 5 min (adulto) ou 3 min (crianÃ§a). Positivo se > 20 petÃ©quias (adulto) ou > 10 (crianÃ§a) em quadrado de 2.5cm.',
      'CritÃ©rios de Gravidade: Extravasamento plasmÃ¡tico, sangramento grave ou disfunÃ§Ã£o orgÃ¢nica.',
      'Sinais de Alarme (Grupo C): Dor abdominal intensa, vÃ´mitos persistentes, hipotensÃ£o postural, hepatomegalia, aumento do hematÃ³crito.',
      'Tratamento Grupo C: HidrataÃ§Ã£o imediata SF 0,9% 10mL/kg na 1Âª hora. Repetir se necessÃ¡rio.',
      'Tratamento Grupo D (Choque): SF 0,9% 20mL/kg em 20 min. Reavaliar a cada 15-30 min.',
      'Exames: Hemograma completo, Transaminases, Prova do LaÃ§o, Sorologia/NS1.'
    ],
    guidelines: 'NÃƒO usar AINES ou Salicilatos. Monitorar plaquetopenia e hematÃ³crito.'
  },
  {
    id: 'p63',
    title: 'Crise Convulsiva / Estado de Mal',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'Fase Inicial (0-5 min): EstabilizaÃ§Ã£o (ABC), O2, acesso venoso, Glicemia Capilar.',
      'Fase 1 (5-20 min - BenzodiazepÃ­nicos): Diazepam 10mg IV (0,15mg/kg) ou Midazolam 10mg IM.',
      'Fase 2 (20-40 min - Anticonvulsivantes): FenitoÃ­na 20mg/kg IV (mÃ¡x 50mg/min) ou Levetiracetam 60mg/kg.',
      'Fase 3 (40-60 min - RefratÃ¡rio): SedaÃ§Ã£o com Midazolam (bolus + BIC) ou Propofol. Preparar IOT.'
    ],
    guidelines: 'O atraso no tratamento aumenta o risco de dano neurolÃ³gico permanente.'
  },
  {
    id: 'p64',
    title: 'Pancreatite Aguda',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico (2 de 3): Dor abdominal tÃ­pica (em barra), Amilase ou Lipase > 3x o limite superior, Imagem compatÃ­vel (TC/USG).',
      'CritÃ©rios de Ranson: Avaliar gravidade na admissÃ£o (Idade > 55, Leucocitos > 16k, Glicose > 200, LDH > 350, AST > 250) e em 48h.',
      'ClassificaÃ§Ã£o (Atlanta): Leve (sem falÃªncia), Moderada (falÃªncia < 48h), Grave (> 48h).',
      'Tratamento: HidrataÃ§Ã£o agressiva (Ringer Lactato 250-500mL/h se nÃ£o houver contraindicaÃ§Ã£o).',
      'Analgesia: OpiÃ³ides (Tramadol ou Meperidina - evitar Morfina teoricamente por esfÃ­ncter de Oddi).',
      'NutriÃ§Ã£o: Dieta zero inicial, mas reiniciar precocemente via oral ou enteral.'
    ],
    guidelines: 'Antibioticoterapia de rotina NÃƒO Ã© indicada, apenas se evidÃªncia de infecÃ§Ã£o/necrose.'
  },
  {
    id: 'p65',
    title: 'CÃ³lica NefreÌtica (UrolitÃ­ase)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Dor lombar sÃºbita com irradiaÃ§Ã£o para fossa ilÃ­aca/testÃ­culo + hematÃºria.',
      'Analgesia: AINES IV (Tenoxicam 40mg ou Cetoprofeno 100mg) - Primeira escolha!',
      'Adjuvantes: Dipirona 2g IV + Morfina 2-5mg se dor refratÃ¡ria.',
      'Expulsivo: Tansulosina 0,4mg VO (facilita saÃ­da de cÃ¡lculos distais).',
      'Exame: TC de abdome sem contraste (Urotomografia) Ã© o padrÃ£o-ouro.'
    ],
    guidelines: 'Sinais de alarme: Febre (obstruÃ§Ã£o infectada), rim Ãºnico, anÃºria.'
  },
  {
    id: 'p66',
    title: 'Estado HiperglicÃªmico Hiperosmolar (EHH)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Glicemia > 600 + Osmolaridade > 320 + pH > 7.3.',
      'HidrataÃ§Ã£o: SF 0,9% 1L/h inicial. ReposiÃ§Ã£o de dÃ©ficit hÃ­drico lento (risco de edema cerebral).',
      'Insulina: 0,1 U/kg/h apÃ³s inÃ­cio da hidrataÃ§Ã£o, manter potÃ¡ssio > 3.3.',
      'MonitorizaÃ§Ã£o: Glicemia horÃ¡ria, eletrÃ³litos, funÃ§Ã£o renal e nÃ­vel de consciÃªncia.'
    ],
    guidelines: 'A mortalidade no EHH Ã© superior Ã  da Cetoacidose.'
  },
  {
    id: 'p67',
    title: 'Crise de Gota Aguda',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Monoartrite sÃºbita (geralmente podagra), hiperemia e calor local.',
      'Tratamento: AINES (Indometacina ou Naproxeno) ou Colchicina (1,2mg inicial + 0,6mg apÃ³s 1h).',
      'Corticoide: Prednisona 30-40mg/dia se contraindicaÃ§Ã£o a AINES/Colchicina.',
      'PrevenÃ§Ã£o: NÃƒO iniciar ou suspender Alopurinol durante a crise.'
    ],
    guidelines: 'Gelo local pode auxiliar na reduÃ§Ã£o da inflamaÃ§Ã£o.'
  },
  {
    id: 'p68',
    title: 'Conjuntivite',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Olho vermelho, secreÃ§Ã£o, sensaÃ§Ã£o de corpo estranho.',
      'Viral (Mais comum): SecreÃ§Ã£o serosa, linfonodo prÃ©-auricular, autolimitada.',
      'Bacteriana: SecreÃ§Ã£o purulenta persistente, pÃ¡lpebras grudadas ao acordar.',
      'Manejo: Compressas frias, lÃ¡grimas artificiais. AntibiÃ³tico tÃ³pico (Tobramicina) se bacteriana.'
    ],
    guidelines: 'OrientaÃ§Ãµes de higiene rigorosa para evitar transmissÃ£o (uso de toalhas separadas).'
  },
  {
    id: 'p69',
    title: 'Surto PsicÃ³tico / AgitaÃ§Ã£o',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: AgitaÃ§Ã£o psicomotora, risco de auto ou heteroagressividade.',
      'ContenÃ§Ã£o FÃ­sica: Apenas se necessÃ¡rio para seguranÃ§a, com equipe treinada.',
      'Manejo QuÃ­mico: Haloperidol 5mg + Prometazina 25mg IM (Fenergan/Haldol).',
      'Alternativa: Midazolam 5-10mg IM ou Olanzapina 5-10mg IM.',
      'MonitorizaÃ§Ã£o: Atentar para distonia aguda e sedaÃ§Ã£o excessiva.'
    ],
    guidelines: 'Priorizar abordagem verbal antes de qualquer contenÃ§Ã£o.'
  },
  {
    id: 'p70',
    title: 'EclÃ¢mpsia',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Crise convulsiva em gestante (> 20 sem) com prÃ©-eclÃ¢mpsia.',
      'Controle Convulsivo: Sulfato de MagnÃ©sio (Esquema Zuspan): 4g IV ataque + 1g/h manut.',
      'AntÃ­doto: Gluconato de CÃ¡lcio 1g IV (se sinais de intoxicaÃ§Ã£o - reflexo/FR).',
      'Controle de PA: Hidralazina 5mg IV se PAS > 160 ou PAD > 110.',
      'Conduta: ResoluÃ§Ã£o da gestaÃ§Ã£o apÃ³s estabilizaÃ§Ã£o materna.'
    ],
    guidelines: 'NÃƒO usar Diazepam ou FenitoÃ­na como primeira linha.'
  },
  {
    id: 'p71',
    title: 'TorÃ§Ã£o Testicular',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Dor testicular sÃºbita, reflexo cremastÃ©rico ausente, testÃ­culo elevado.',
      'Sinal de Phren Negativo: Dor nÃ£o alivia com a elevaÃ§Ã£o do testÃ­culo.',
      'Exame: Doppler de Bolsa Escrotal (ausÃªncia de fluxo arterial).',
      'Tratamento: ExploraÃ§Ã£o cirÃºrgica de emergÃªncia (Janela de 6h para salvar o Ã³rgÃ£o).'
    ],
    guidelines: 'A suspeita clÃ­nica em jovens deve levar Ã  cirurgia imediata, sem aguardar exames se indisponÃ­veis.'
  },
  {
    id: 'p72',
    title: 'Gravidez EctÃ³pica Rota',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Atraso menstrual + Dor abdominal sÃºbita + Choque/SÃ­ncope.',
      'Exame: Beta-hCG positivo + Ãštero vazio ao USG + LÃ­quido livre em fundo de saco.',
      'Manejo: ExpansÃ£o volÃªmica agressiva, tipagem sanguÃ­nea, reserva de concentrado.',
      'Tratamento: Laparotomia exploradora de urgÃªncia (Salpingectomia).'
    ],
    guidelines: 'Causa importante de choque hipovolÃªmico em mulheres em idade fÃ©rtil.'
  },
  {
    id: 'p73',
    title: 'Epistaxe',
    category: 'Verde / Amarelo',
    items: [
      'Manejo Inicial: CompressÃ£o direta da asa do nariz (narinas fechadas) por 10-15 min.',
      'TÃ³pico: AlgodÃ£o embebido em vasoconstritor (Adrenalina 1:10.000).',
      'Tamponamento: Anterior (se refratÃ¡rio) ou Posterior (se sangramento vindo da orofaringe).',
      'OrientaÃ§Ãµes: Evitar assoar o nariz e exposiÃ§Ã£o ao calor.'
    ],
    guidelines: 'Controlar a pressÃ£o arterial, pois hipertensÃ£o dificulta a cessaÃ§Ã£o do sangramento.'
  },
  {
    id: 'p74',
    title: 'SÃ­ncope',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Perda sÃºbita e transitÃ³ria da consciÃªncia e tÃ´nus postural com recuperaÃ§Ã£o espontÃ¢nea.',
      'Escore de San Francisco: Avaliar risco (HIC: HistÃ³ria de ICC, HematÃ³crito < 30%, ECG alterado, Dispneia, PAS < 90).',
      'ECG: Fundamental para descartar BAVT, sÃ­ndrome de Brugada, QT longo ou Wolff-Parkinson-White.',
      'Tratamento: Posicionamento (Trendelenburg), hidrataÃ§Ã£o venosa se hipovolemia, tratamento da causa base.',
      'Sinal de Alarme: SÃ­ncope durante esforÃ§o ou em decÃºbito.'
    ],
    guidelines: 'A maioria Ã© vasovagal, mas causas cardÃ­acas tÃªm alta mortalidade.'
  },
  {
    id: 'p75',
    title: 'Crise de Ansiedade / PÃ¢nico',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: PalpitaÃ§Ãµes, sudorese, tremor, sensaÃ§Ã£o de asfixia, medo de morrer.',
      'ExclusÃ£o: SEMPRE descartar causas orgÃ¢nicas primeiro (IAM, TEP, Arritmia, Hipoglicemia).',
      'Manejo NÃ£o FarmacolÃ³gico: TÃ©cnicas de respiraÃ§Ã£o controlada, ambiente calmo.',
      'Manejo FarmacolÃ³gico: BenzodiazepÃ­nico (Lorazepam 1-2mg ou Alprazolam 0.5mg SL/VO).',
      'Encaminhamento: Psiquiatria/Psicologia para seguimento ambulatorial.'
    ],
    guidelines: 'NÃ£o subestime a dor torÃ¡cica em pacientes ansiosos; faÃ§a o ECG.'
  },
  {
    id: 'p76',
    title: 'IntoxicaÃ§Ã£o por OpiÃ³ides',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: TrÃ­ade (DepressÃ£o respiratÃ³ria + Mioses + Coma).',
      'Suporte: Manter via aÃ©rea pÃ©rvia, ventilaÃ§Ã£o com pressÃ£o positiva (Ambu) se necessÃ¡rio.',
      'AntÃ­doto (Naloxona): 0,4mg IV/IM. Repetir a cada 2-3 min atÃ© melhora da ventilaÃ§Ã£o espontÃ¢nea.',
      'MonitorizaÃ§Ã£o: Risco de edema agudo de pulmÃ£o nÃ£o cardiogÃªnico pÃ³-naloxona.'
    ],
    guidelines: 'O objetivo da Naloxona Ã© a ventilaÃ§Ã£o adequada, nÃ£o necessariamente o despertar total.'
  },
  {
    id: 'p77',
    title: 'InsuficiÃªncia CardÃ­aca (Perfil B)',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: "Quente e Ãšmido" (Edema perifÃ©rico, estertores, turgÃªncia jugular, boa perfusÃ£o).',
      'Tratamento: Furosemida 40-80mg IV (dose-dobro se uso prÃ©vio).',
      'VasodilataÃ§Ã£o: Nitrato SL ou Isossorbida IV se PAS > 110 mmHg para reduzir prÃ©-carga.',
      'RestriÃ§Ã£o: Ingesta hÃ­drica e salina rigorosa na fase aguda.',
      'AvaliaÃ§Ã£o: Avaliar fator descompensador (Isquemia, Arritmia, MÃ¡ adesÃ£o, InfecÃ§Ã£o).'
    ],
    guidelines: 'Perfil B Ã© o tipo mais comum de descompensaÃ§Ã£o na emergÃªncia.'
  },
  {
    id: 'p78',
    title: 'Acidentes por Bothrops (Jararaca)',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Dor local, edema, equimose e sangramentos (gengivorragia).',
      'Exames: Tempo de CoagulaÃ§Ã£o (TC) - costuma estar alterado (> 30 min).',
      'Tratamento EspecÃ­fico: Soro AntibotrÃ³pico (SAB) - n. de ampolas conforme gravidade (3 a 12).',
      'Suporte: HidrataÃ§Ã£o venosa vigorosa para prevenir insuficiÃªncia renal aguda (necrose tubular).',
      'ContraindicaÃ§Ã£o: NÃ£o fazer torniquete, incisÃ£o ou sucÃ§Ã£o local.'
    ],
    guidelines: 'Monitorar rigorosamente a funÃ§Ã£o renal e o tempo de coagulaÃ§Ã£o.'
  },
  {
    id: 'p79',
    title: 'Celulite e Erisipela',
    category: 'Verde / Amarelo',
    items: [
      'DiagnÃ³stico: Ãrea eritematosa, quente e dolorosa. Erisipela (bordas bem definidas, superficial).',
      'Tratamento (Ambulatorial): Cefalexina 500mg 6/6h por 7-10 dias.',
      'Tratamento (Hospitalar): Oxacilina 2g 4/4h ou Cefazolina 1-2g 8/8h IV.',
      'Medidas Subjacentes: ElevaÃ§Ã£o do membro afetado e tratamento de portas de entrada (micoses).'
    ],
    guidelines: 'Internar se sinais de sepse, extremidades da idade ou falha ao tratamento VO.'
  },
  {
    id: 'p80',
    title: 'Otite MÃ©dia Aguda (OMA)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Otalgia sÃºbita, abaulamento da membrana timpÃ¢nica, febre.',
      'Analgesia: Ibuprofeno ou Paracetamol. Gotas otolÃ³gicas sÃ³ se membrana Ã­ntegra.',
      'AntibiÃ³tico: Amoxicilina 500mg 8/8h por 7-10 dias (Adulto/CrianÃ§as > 2 anos com sintomas graves).',
      'Watchful Waiting: Em crianÃ§as > 2 anos sem gravidade, pode-se observar por 48h.'
    ],
    guidelines: 'Evitar limpeza excessiva do conduto auditivo durante a fase aguda.'
  },
  {
    id: 'p81',
    title: 'Sinusite Aguda (Rinossinusite)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: ObstruÃ§Ã£o nasal, secreÃ§Ã£o purulenta, dor facial por > 10 dias.',
      'Tratamento SintomÃ¡tico: Lavagem nasal com SF 0,9% abundante + AnalgÃ©sicos.',
      'Tratamento Bacteriano: Se sintomas > 10 dias ou "double sickening" (piora apÃ³s melhora).',
      'AntibiÃ³tico: Amoxicilina-Clavulanato ou Amoxicilina isolada por 5-7 dias.'
    ],
    guidelines: 'A maioria das rinossinusites agudas Ã© viral; antibiÃ³ticos sÃ£o superutilizados.'
  },
  {
    id: 'p82',
    title: 'Escabiose (Sarna)',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: Prurido intenso (piora Ã  noite), pÃ¡pulas/sulcos em Ã¡reas de dobras.',
      'Tratamento TÃ³pico: Permetrina 5% creme (aplicar do pescoÃ§o aos pÃ©s, retirar apÃ³s 8-14h).',
      'Tratamento SistÃªmico: Ivermectina 200mcg/kg dose Ãºnica (repetir apÃ³s 7-14 dias).',
      'Medidas Gerais: Tratar todos os contatantes simultaneamente. Lavar roupas em Ã¡gua quente.'
    ],
    guidelines: 'O prurido pode persistir por semanas apÃ³s o tratamento eficaz (prurido pÃ³s-escabiÃ³tico).'
  },
  {
    id: 'p83',
    title: 'Taquicardia Supraventricular (TSV)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Taquicardia regular, QRS estreito, ausÃªncia de onda P visÃ­vel.',
      'Manobra Vagal: Manobra de Valsalva modificada ou massagem de seio carotÃ­deo (se sem sopro).',
      'Adenosina: 6mg IV rÃ¡pido em "flush". Se nÃ£o reverter, 12mg IV.',
      'InstÃ¡vel (HipotensÃ£o/Choque): CardioversÃ£o elÃ©trica sincronizada imediata (50-100J).'
    ],
    guidelines: 'Sempre manter o paciente monitorizado e com material de ventilaÃ§Ã£o acessÃ­vel.'
  },
  {
    id: 'p84',
    title: 'Bradiarritmias SintomÃ¡ticas',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: FC < 50 bpm + HipotensÃ£o, AlteraÃ§Ã£o mental, Dor torÃ¡cica ou Choque.',
      'Atropina: 1mg IV a cada cada 3-5 min (mÃ¡x 3mg).',
      'Marcapasso TranscutÃ¢neo: Iniciar se Atropina ineficaz ou BAV de alto grau.',
      'Drogas Adjuvantes: BIC de Dopamina (5-20 mcg/kg/min) ou Adrenalina (2-10 mcg/min).'
    ],
    guidelines: 'NÃ£o atrasar o marcapasso transcutÃ¢neo em pacientes instÃ¡veis com BAV de 2Âº grau tipo II ou BAVT.'
  },
  {
    id: 'p85',
    title: 'Hipercalemia Grave',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: K+ > 6,5 mEq/L ou alteraÃ§Ãµes no ECG (Onda T em tenda, perda de P, QRS alargado).',
      'EstabilizaÃ§Ã£o de Membrana: Gluconato de CÃ¡lcio 10% 10-30mL IV em 5-10 min.',
      'Shift de PotÃ¡ssio: SoluÃ§Ã£o Polarizante (Insulina 10U + Glicose 50% 100mL) + NebulizaÃ§Ã£o com Fenoterol.',
      'EliminaÃ§Ã£o: Furosemida 40-80mg IV ou Resinas de troca (Poliestirenosulfonato de CÃ¡lcio).',
      'Definitivo: HemodiÃ¡lise de urgÃªncia se refratÃ¡rio ou insuficiÃªncia renal grave.'
    ],
    guidelines: 'O Gluconato de CÃ¡lcio nÃ£o baixa o potÃ¡ssio, apenas protege o coraÃ§Ã£o temporariamente.'
  },
  {
    id: 'p86',
    title: 'Neutropenia Febril',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Febre (> 38.3ÂºC uma vez ou > 38ÂºC por 1h) + NeutrÃ³filos < 500.',
      'AvaliaÃ§Ã£o: Escore MASCC (Identificar baixo vs alto risco).',
      'Exames: Hemoculturas (central e perifÃ©rica), Rx TÃ³rax, EAS, Culturas de secreÃ§Ãµes.',
      'AntibiÃ³tico: Iniciar em MENOS de 1 hora. Cefepime 2g ou Piperacilina-Tazo 4,5g IV.',
      'Manejo: Considerar Vancomicina se infecÃ§Ã£o de cateter ou instabilidade hemodinÃ¢mica.'
    ],
    guidelines: 'NÃ£o aguardar o resultado de todos os exames para iniciar o antibiÃ³tico.'
  },
  {
    id: 'p87',
    title: 'Cetoacidose AlcoÃ³lica',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: HistÃ³ria de libaÃ§Ã£o alcoÃ³lica + VÃ´mitos + Acidose com GAP elevado + Cetose.',
      'Glicemia: Geralmente normal ou levemente aumentada.',
      'Tratamento: Soro Glicosado 5% em SF 0,9% para repor reserva de glicogÃªnio e expansÃ£o.',
      'Tiamina: 100-300mg IV ANTES da glicose para prevenir Encefalopatia de Wernicke.',
      'EletrÃ³litos: ReposiÃ§Ã£o de potÃ¡ssio e fÃ³sforo se necessÃ¡rio.'
    ],
    guidelines: 'A cetoacidose alcoÃ³lica costuma responder rÃ¡pido Ã  glicose e hidrataÃ§Ã£o.'
  },
  {
    id: 'p88',
    title: 'MalÃ¡ria Grave / Complicada',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico (Gravidade): Parasitemia alta, icterÃ­cia, insuficiÃªncia renal, alteraÃ§Ã£o consciÃªncia.',
      'Tratamento 1Âª Linha: Artesunato IV (2.4 mg/kg nos tempos 0, 12, 24h e depois 1x ao dia).',
      'Suporte: Manejo de complicaÃ§Ãµes (Hipoglicemia, Anemia grave, Edema pulmonar).',
      'NotificaÃ§Ã£o: DoenÃ§a de notificaÃ§Ã£o compulsÃ³ria imediata.'
    ],
    guidelines: 'Artesunato Ã© superior Ã  quinina no tratamento da malÃ¡ria grave.'
  },
  {
    id: 'p89',
    title: 'ObstruÃ§Ã£o Intestinal',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Dor abdominal, vÃ´mitos, distensÃ£o, parada de eliminaÃ§Ã£o de flatos/fezes.',
      'Exame: Rx de Abdome (NÃ­veis hidroaÃ©reos, empilhamento de moedas).',
      'Manejo Inicial: Jejum absoluto, Sonda NasogÃ¡strica aberta para descompressÃ£o.',
      'HidrataÃ§Ã£o: CorreÃ§Ã£o de distÃºrbios hidroeletrolÃ­ticos e reposiÃ§Ã£o volÃªmica vigorosa.',
      'Abordagem: CirÃºrgica se sinais de sofrimento de alÃ§a (febre, leucocitose, dor persistente).'
    ],
    guidelines: 'A tomografia de abdome ajuda a identificar a causa e o ponto de transiÃ§Ã£o.'
  },
  {
    id: 'p90',
    title: 'CÃ³lica Biliar / ColelitÃ­ase',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: Dor em hipocÃ´ndrio direito/epigÃ¡strio, apÃ³s refeiÃ§Ã£o gordurosa ou Ã  noite.',
      'Exame: USG de Abdome Superior (CÃ¡lculos na vesÃ­cula sem sinais de inflamaÃ§Ã£o da parede).',
      'Conduta: Jejum momentÃ¢neo, Analgesia (Buscopan Composto ou Tenoxicam).',
      'Encaminhamento: Cirurgia eletiva se sintomas recorrentes.'
    ],
    guidelines: 'Diferenciar de Colecistite (dor persistente > 6h, febre, Murphy positivo).'
  },
  {
    id: 'p91',
    title: 'Herpes Zoster',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: VesÃ­culas sobre base eritematosa seguindo um dermÃ¡tomo, dor intensa (neurite).',
      'Tratamento Viral: Aciclovir 800mg 5x/dia por 7 dias (ideal iniciar em < 72h).',
      'Analgesia: Dipirona, AINES, Gabapentina ou Pregabalina para dor neuropÃ¡tica.',
      'Cuidado: Manter as lesÃµes limpas e secas. Risco de transmissÃ£o para quem nÃ£o teve catapora.'
    ],
    guidelines: 'Iniciar antivirais via oral mesmo apÃ³s 72h se houver novas lesÃµes ou em imunossuprimidos.'
  },
  {
    id: 'p92',
    title: 'Escorpionismo (EscorpiÃ£o)',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico (Gravidade): ManifestaÃ§Ãµes sistÃªmicas (vÃ´mitos, sudorese, arritmias, choque).',
      'Bloqueio Local: LidocaÃ­na 2% (sem vasoconstritor) para alÃ­vio da dor excruciante.',
      'Tratamento EspecÃ­fico: Soro AntiescorpiÃ´nico ou AntiaracnÃ­dico (2 a 6 ampolas conforme gravidade).',
      'MonitorizaÃ§Ã£o: Risco de Edema Agudo de PulmÃ£o e insuficiÃªncia cardÃ­aca aguda.'
    ],
    guidelines: 'Casos leves requerem apenas analgesia e observaÃ§Ã£o por 6-12 horas.'
  },
  {
    id: 'p93',
    title: 'Abcesso CutÃ¢neo',
    category: 'Verde (Pouco Urgente)',
    items: [
      'DiagnÃ³stico: ColeÃ§Ã£o purulenta flutuante, dor, calor, rubor.',
      'Tratamento de Escolha: IncisÃ£o e Drenagem Ampla sob anestesia local.',
      'AntibiÃ³tico: Apenas se celulite perilesional extensa, comorbidades ou sinais sistÃªmicos.',
      'AntibiÃ³tico OpÃ§Ã£o: Cefalexina ou SMX-TMP (se suspeita de MRSA comunitÃ¡rio).'
    ],
    guidelines: 'Drenagem Ã© o tratamento definitivo; antibiÃ³tico sem drenagem nÃ£o resolve abcessos.'
  },
  {
    id: 'p94',
    title: 'HÃ©rnia Inguinal Encarcerada',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Abaulamento inguinal doloroso e irredutÃ­vel.',
      'Manejo: Tentar reduÃ§Ã£o manual (se < 6h, sem sinais de peritonite e paciente estÃ¡vel).',
      'ReduÃ§Ã£o: SedaÃ§Ã£o leve + PosiÃ§Ã£o de Trendelenburg + Manobra suave de reduÃ§Ã£o.',
      'Cirurgia de UrgÃªncia: Se falha na reduÃ§Ã£o ou sinais de estrangulamento (isquemia).'
    ],
    guidelines: 'NÃ£o forÃ§ar reduÃ§Ã£o se houver sinais Ã³bvios de isquemia ou necrose de alÃ§a.'
  },
  {
    id: 'p95',
    title: 'Hemorragia em HemofÃ­lico',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Sangramento muscular (psoite), articular (hemartrose) ou vindo de trauma.',
      'Tratamento: ReposiÃ§Ã£o de Fator VIII ou Fator IX o mais rÃ¡pido possÃ­vel!',
      'Dose: Elevar nÃ­vel do fator para 50-100% conforme o sÃ­tio do sangramento.',
      'Terapia Adjuvante: Ãcido TranexÃ¢mico (se sangramento mucoso) e Gelo local.'
    ],
    guidelines: 'Protocolo "Trate primeiro, pergunte depois": repor fator antes mesmo do Rx/TC.'
  },
  {
    id: 'p96',
    title: 'InsuficiÃªncia Adrenal Aguda',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: HipotensÃ£o refratÃ¡ria a volume, febre, nÃ¡useas, hiponatremia, hipercalemia.',
      'Tratamento Imediato: Hidrocortisona 100mg IV em bolus, seguida de 50mg 6/6h.',
      'Volume: SF 0,9% 1-2 litros rÃ¡pido para expansÃ£o.',
      'ManutenÃ§Ã£o: Soro glicosado para prevenir hipoglicemia severa.'
    ],
    guidelines: 'Frequentemente desencadeada por infecÃ§Ã£o ou estresse cirÃºrgico em pacientes em uso de corticoide crÃ´nico.'
  },
  {
    id: 'p97',
    title: 'Encefalopatia HepÃ¡tica',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: AlteraÃ§Ã£o de sono, asterixe (flapping), confusÃ£o mental, hÃ¡lito hepÃ¡tico.',
      'Identificar Fator Precipitante: ConstipaÃ§Ã£o, HDA, InfecÃ§Ã£o (PBE), DesidrataÃ§Ã£o.',
      'Lactulona: 20-30mL VO ou via SNG 3-4x/dia (objetivo: 2-3 evacuaÃ§Ãµes pastosas/dia).',
      'AntibiÃ³tico: Rifaximina 550mg 12/12h (se recidiva) ou Neomicina como alternativa.'
    ],
    guidelines: 'NÃ£o restringir proteÃ­nas na dieta; garantir aporte calÃ³rico adequado.'
  },
  {
    id: 'p98',
    title: 'Delirium no Idoso',
    category: 'Amarelo (Urgente)',
    items: [
      'DiagnÃ³stico: InÃ­cio agudo de confusÃ£o mental, flutuante, desatenÃ§Ã£o (CAM).',
      'Causas (DEMENTIA): Drugs, Electrolytes, Metabolic, Environment, Nutrition, Trauma, Infection, Alcohol.',
      'Tratamento NÃ£o FarmacolÃ³gico: OrientaÃ§Ã£o temporal, presenÃ§a de familiar, ambiente iluminado.',
      'SintomÃ¡tico (Se agitaÃ§Ã£o grave): Haloperidodol 0.5-1mg VO/IM/IV (evite doses altas).'
    ],
    guidelines: 'Evitar BenzodiazepÃ­nicos em idosos com Delirium (piora o quadro/paradoxal).'
  },
  {
    id: 'p99',
    title: 'SCA sem Supra de ST (AI / IAMSSST)',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Dor torÃ¡cica pushes/anginosa + ElevaÃ§Ã£o de biomarcador (Troponina I ou T ultrassensÃ­vel) ou alteraÃ§Ãµes de ECG IsquÃªmicas (InversÃ£o simÃ©trica de T ou Infra do segmento ST â‰¥ 0.5 mm).',
      'EstratificaÃ§Ã£o de Risco (Escore GRACE): Avalia mortalidade com base em FC, PAS, Creatinina, Desvio de ST, Parada cardÃ­aca na admissÃ£o, Idade e Troponina. Score > 140 indica alto risco.',
      'Escore TIMI Risk: Idade â‰¥ 65 (1), â‰¥ 3 FR coronÃ¡rios (HAS/DM/DLP/Tabagismo/Familiar) (1), Estenose coronÃ¡ria prÃ©via â‰¥ 50% (1), Desvio de ST (1), Angina grave nas Ãºltimas 24h (1), Uso de AAS nos Ãºltimos 7d (1) e Marcadores positivos (1). Alto risco se â‰¥ 5 pontos.',
      'Momento do Cateterismo (EstratÃ©gia Invasiva):',
      '  - Imediata (< 2 horas): Se instabilidade hemodinÃ¢mica/choque cardiogÃªnico, dor refratÃ¡ria ao tratamento, arritmias ventriculares graves ou insuficiÃªncia cardÃ­aca aguda.',
      '  - Precoce (< 24 horas): Se Troponina elevada ou alteraÃ§Ãµes de ST dinÃ¢micas ou escore GRACE > 140.',
      '  - Retardada (< 72 horas): Se escore GRACE entre 109 e 140 ou DM/DRC/InsuficiÃªncia hepÃ¡tica/Angioplastia prÃ©via.',
      'Terapia de Ataque: AAS 200mg mastigÃ¡vel + Clopidogrel 300mg VO + Estatina de alta potÃªncia (Atorvastatina 40-80mg VO).',
      'AnticoagulaÃ§Ã£o: Enoxaparina 1mg/kg SC de 12/12h (reduzir para 1mg/kg 1x/dia se ClCr < 30) ou Fondaparinux 2.5mg SC 1x/dia.'
    ],
    guidelines: 'EstÃ¡ terminantemente contraindicado o uso de trombolÃ­ticos em infarto sem supra de ST ou angina instÃ¡vel devido ao perigo de hemorragia e reoclusÃ£o indesejada.'
  },
  {
    id: 'p100',
    title: 'Mal EpilÃ©ptico Convulsivo',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Crise tÃ´nico-clÃ´nica > 5 min ou sucessivas sem recuperaÃ§Ã£o entre elas.',
      'ABC: Cabeceira elevada, O2 masc, Glicemia Capilar (descartar hipo).',
      '1Âª Linha: Midazolam 10mg IM ou Diazepam 10mg IV (se acesso disponÃ­vel).',
      '2Âª Linha: FenitoÃ­na 20mg/kg IV (lentamente) ou Ãcido Valproico 40mg/kg.'
    ],
    guidelines: 'O atraso no controle gera lesÃ£o neuronal citotÃ³xica irreversÃ­vel.'
  },
  {
    id: 'p101',
    title: 'HipertensÃ£o Arterial SistÃªmica (HAS)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: PA â‰¥ 140/90 mmHg em duas ocasiÃµes ou PA â‰¥ 180/110 mmHg em visita Ãºnica.',
      'Exames Iniciais: Creatinina, PotÃ¡ssio, Glicemia jejum, Lipidograma, EAS, ECG.',
      'EstÃ¡gio 1 (140-159/90-99): Iniciar monoterapia (TiazÃ­dico, iECA, BRA ou BCC).',
      'EstÃ¡gio 2 (â‰¥ 160/100): Iniciar combinaÃ§Ã£o de duas drogas (iECA/BRA + BCC ou iECA/BRA + TiazÃ­dico).',
      'Metas: < 140/90 para maioria; < 130/80 se alto risco CV ou DM.'
    ],
    guidelines: 'Enfatizar mudanÃ§as no estilo de vida (DASH, reduÃ§Ã£o de sal, atividade fÃ­sica).'
  },
  {
    id: 'p102',
    title: 'Diabetes Mellitus Tipo 2 (DM2)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Glicemia jejum â‰¥ 126, HbA1c â‰¥ 6.5%, ou Glicemia aleatÃ³ria â‰¥ 200 + sintomas.',
      'Rastreio de ComplicaÃ§Ãµes: Fundo de olho (anual), Pesquisa de microalbuminÃºria, Exame dos pÃ©s.',
      'Tratamento Inicial: Metformina 500-2500mg/dia + MudanÃ§a de Estilo de Vida.',
      'Segunda Linha: Inibidores de SGLT2 (Empagliflozina) ou anÃ¡logos de GLP-1 (Liraglutida) se doenÃ§a CV estabelecida.',
      'InsulinizaÃ§Ã£o: Considerar se HbA1c > 9% ou sintomas de catabolismo (perda peso).'
    ],
    guidelines: 'Monitorar HbA1c a cada 3-6 meses e ajustar terapia conforme meta.'
  },
  {
    id: 'p103',
    title: 'Hipotireoidismo',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: TSH elevado + T4 livre baixo (Hipotireoidismo ClÃ­nico). TSH de referÃªncia normal: 0.45 a 4.5 mIU/L.',
      'SubclÃ­nico: TSH elevado + T4 livre normal. Tratar obrigatoriamente se: TSH â‰¥ 10 mIU/L, gestantes, anticorpos anti-TPO fortemente positivos, ou presenÃ§a de sintomas clÃ¡ssicos marcantes.',
      'Tratamento (Jovens): Levotiroxina sÃ³dica (L-T4) 1.6 mcg/kg/dia pela manhÃ£ em jejum seco.',
      'Tratamento (Idosos/Coronariopatas): Iniciar levotiroxina com dose conservadora de 25 mcg VO ao dia (evita induÃ§Ã£o de arritmia ou angina); reavaliar e aumentar 12.5-25 mcg a cada 6 semanas.',
      'AdministraÃ§Ã£o: Exclusivamente em jejum, 30 a 60 minutos antes do cafÃ© ou ingestÃ£o de outras medicaÃ§Ãµes.',
      'Monitoramento: Repetir dosagem de TSH em 6 a 8 semanas para ajustes posolÃ³gicos.'
    ],
    guidelines: 'A meta terapÃªutica de TSH em idosos ou cardiopatas Ã© mais permissiva (geralmente entre 1.0 e 5.0 mIU/L) para prevenir tireotoxicoses iatrogÃªnicas.'
  },
  {
    id: 'p104',
    title: 'Anemia Ferropriva',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico (VCM): VCM < 80 fL (MicrocÃ­tica); Ferritina < 30 ng/mL (Ã© o marcador mais sensÃ­vel e especÃ­fico para depleÃ§Ã£o de ferro prÃ©-anÃªmica).',
      'DiagnÃ³stico Diferencial (DoenÃ§a CrÃ´nica): Ferritina normal ou elevada (> 100 ng/mL), saturaÃ§Ã£o de transferrina baixa (< 20%), e presenÃ§a de quadro inflamatÃ³rio/infeccioso crÃ´nico de base.',
      'InvestigaÃ§Ã£o: SEMPRE investigar sangramento ativo oculto. Em homens e mulheres pÃ³s-menopausa, realizar Colonoscopia + Endoscopia de rastreio.',
      'Tratamento: Sulfato Ferroso 300mg (equivalente a 60mg de ferro elementar) - Administrar 1 comprimido VO, 1 vez ao dia (ou em dias alternados, o que demonstrou igual eficÃ¡cia posolÃ³gica com menos efeitos colaterais gastrointestinais, devido ao declÃ­nio do pico de hepcidina).',
      'OtimizaÃ§Ã£o: Administrar com estÃ´mago vazio (1h antes das refeiÃ§Ãµes) com suco cÃ­trico (vitamina C) para acidificar o meio; evitar uso concomitante com antiÃ¡cidos, cÃ¡lcio ou cafÃ©.',
      'DuraÃ§Ã£o: Manter a reposiÃ§Ã£o por 3 a 6 meses apÃ³s a normalizaÃ§Ã£o dos nÃ­veis de Hemoglobina para reposiÃ§Ã£o completa dos estoques de ferritina.'
    ],
    guidelines: 'A eficÃ¡cia da reposiÃ§Ã£o oral Ã© comprovada pelo aumento dos reticulÃ³citos em 5 a 10 dias de tratamento correto.'
  },
  {
    id: 'p105',
    title: 'Dislipidemia',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'AvaliaÃ§Ã£o: Calcular Risco Cardiovascular (Escore de Risco Global/Framingham).',
      'Tratamento NÃ£o FarmacolÃ³gico: Dieta pobre em gorduras saturadas e trans, exercÃ­cios.',
      'Tratamento FarmacolÃ³gico (Estatinas): Atorvastatina, Rosuvastatina ou Simvastatina.',
      'Metas de LDL: < 50 (Risco muito alto), < 70 (Alto risco), < 100 (Risco intermediÃ¡rrio).',
      'Controle: Repetir perfil lipÃ­dico 4 a 12 semanas apÃ³s inÃ­cio e depois anualmente.'
    ],
    guidelines: 'Monitorar transaminases e sintomas musculares (mialgia) apÃ³s inÃ­cio da estatina.'
  },
  {
    id: 'p106',
    title: 'Tabagismo',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'Abordagem: Avaliar motivaÃ§Ã£o, grau de dependÃªncia (Escore de FagerstrÃ¶m).',
      'Terapia Cognitivo-Comportamental: SessÃµes em grupo ou individuais.',
      'Farmacoterapia: Terapia de ReposiÃ§Ã£o de Nicotina (Goma/Adesivo) + Bupropiona 150-300mg/dia.',
      'ContraindicaÃ§Ãµes Bupropiona: HistÃ³rico de convulsÃ£o, transtorno alimentar, uso de IMAO.',
      'Acompanhamento: Marcar "Dia D" (parada total) na segunda semana de medicaÃ§Ã£o.'
    ],
    guidelines: 'A combinaÃ§Ã£o de TCC e medicamentos dobra a chance de sucesso.'
  },
  {
    id: 'p107',
    title: 'DepressÃ£o Unipolar',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico (DSM-5): Humos deprimido ou anedonia por > 2 semanas + 4 sintomas (sono, apetite, culpa, energia, concentraÃ§Ã£o, psicomotor, ideaÃ§Ã£o).',
      'Rastreio: PHQ-2 seguido de PHQ-9 se positivo.',
      'Tratamento 1Âª Linha: ISRS (Sertralina 50-200mg, Fluoxetina 20-60mg ou Escitalopram 10-20mg).',
      'Acompanhamento: InÃ­cio da resposta em 2-4 semanas; melhora total em 8-12 semanas.',
      'ManutenÃ§Ã£o: Manter por 6-12 meses apÃ³s remissÃ£o do primeiro episÃ³dio.'
    ],
    guidelines: 'Sempre avaliar risco de suicÃ­dio. Encaminhar se risco alto ou refratariedade.'
  },
  {
    id: 'p108',
    title: 'Transtorno de Ansiedade Generalizada (TAG)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Ansiedade excessiva na maioria dos dias por â‰¥ 6 meses sobre diversos eventos.',
      'Sintomas Associados: Inquietude, fadiga, dificuldade de concentraÃ§Ã£o, irritabilidade, tensÃ£o muscular.',
      'Tratamento 1Âª Linha: ISRS ou Inibidores da RecaptaÃ§Ã£o de Serotonina e Noradrenalina (Venlafaxina).',
      'Tratamento Adjuvante: BenzodiazepÃ­nicos apenas por curto prazo (2-4 semanas) se sintomas graves.',
      'Psicoterapia: TCC Ã© altamente eficaz para TAG.'
    ],
    guidelines: 'Evitar o uso crÃ´nico de benzodiazepÃ­nicos devido ao risco de dependÃªncia e quedas (especialmente idosos).'
  },
  {
    id: 'p109',
    title: 'Osteoartrite (OA)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Dor articular mecÃ¢nica, rigidez matinal curta (< 30 min), crepitaÃ§Ã£o, limitaÃ§Ã£o funcional.',
      'Exame de Imagem: Rx com reduÃ§Ã£o do espaÃ§o articular, esclerose subcondral e osteÃ³fitos.',
      'Manejo NÃ£o FarmacolÃ³gico: ReduÃ§Ã£o de peso, exercÃ­cios aerÃ³bicos e de fortalecimento.',
      'Analgesia: Paracetamol 500-1000mg 8/8h ou AINES tÃ³picos; AINES orais por curto prazo se necessÃ¡rio.',
      'OpÃ§Ã£o Invasiva: InjeÃ§Ã£o intra-articular de corticoide se dor persistente na osteoartrite de joelho.'
    ],
    guidelines: 'Geralmente nÃ£o requer exames laboratoriais na apresentaÃ§Ã£o tÃ­pica.'
  },
  {
    id: 'p110',
    title: 'Osteoporose',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico (Densometria): T-score â‰¤ -2.5 no fÃªmur ou coluna Lombar.',
      'Rastreio: Mulheres â‰¥ 65 anos ou Homens â‰¥ 70 anos (ou mais cedo se fatores de risco).',
      'Tratamento 1Âª Linha: Bisfosfonatos (Alendronato 70mg/semana ou Risedronato 35mg/semana).',
      'SuplementaÃ§Ã£o: CÃ¡lcio (1000-1200mg/dia total) + Vitamina D (800-2000 UI/dia).',
      'OrientaÃ§Ãµes: Tomar bisfosfonato em jejum com Ã¡gua comum e permanecer ereto por 30 min.'
    ],
    guidelines: 'Avaliar risco de fratura pelo escore FRAX.'
  },
  {
    id: 'p111',
    title: 'PsorÃ­ase Vulgar',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Placas eritemato-escamosas bem delimitadas, simÃ©tricas, escala prateada.',
      'Locais Comuns: Cotovelos, joelhos, couro cabeludo, regiÃ£o sacral.',
      'Tratamento TÃ³pico: Corticosteroides de alta potÃªncia (Clobetasol) ou Calcipotriol.',
      'Xampu: AlcatrÃ£o de hulha para couro cabeludo.',
      'Encaminhamento: Se > 10% de superfÃ­cie corporal atingida ou envolvimento articular (Artrite PsoriÃ¡sica).'
    ],
    guidelines: 'PsorÃ­ase Ã© uma doenÃ§a inflamatÃ³ria sistÃªmica com maior risco cardiovascular.'
  },
  {
    id: 'p112',
    title: 'Vitamina D (DeficiÃªncia)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: 25(OH)D < 20 ng/mL (DeficiÃªncia) ou 20-29 ng/mL (InsuficiÃªncia).',
      'Alvos: > 20 ng/mL para populaÃ§Ã£o geral; 30-60 ng/mL para grupos de risco (idosos, gestantes, osteoporose).',
      'Ataque: 50.000 UI/semana por 8 semanas se deficiÃªncia grave.',
      'ManutenÃ§Ã£o: 800-2.000 UI/dia conforme a necessidade.',
      'Fontes: ExposiÃ§Ã£o solar (15 min/dia) e alimentos especÃ­ficos.'
    ],
    guidelines: 'NÃ£o rastrear Vitamina D rotineiramente na populaÃ§Ã£o assintomÃ¡tica de baixo risco.'
  },
  {
    id: 'p113',
    title: 'Asma (ManutenÃ§Ã£o)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico (Protocolo GINA): Sintomas respiratÃ³rios caracterÃ­sticos (sibilos, dispneia, opressÃ£o torÃ¡cica, tosse) com variaÃ§Ã£o temporal e de intensidade, associados a limitaÃ§Ã£o variÃ¡vel do fluxo aÃ©reo (Espirometria com VEF1/CVF < 0.75-0.80 e broncodilataÃ§Ã£o positiva com aumento do VEF1 > 12% e > 200mL).',
      'ClassificaÃ§Ã£o GINA: Avaliar controle nas Ãºltimas 4 semanas (Sintomas diurnos > 2x/sem? Despertar noturno? Uso de resgate > 2x/sem? LimitaÃ§Ã£o de atividade? Controlada: 0 itens; Parcialmente controlada: 1-2 itens; NÃ£o controlada: 3-4 itens).',
      'Etapas 1 e 2 (Dose Baixa SOS): Budesonida/Formoterol (200/6 mcg ou 100/6 mcg) - 1 inalaÃ§Ã£o apenas SOS (resgate e anti-inflamatÃ³rio simultÃ¢neos).',
      'Etapa 3 (ManutenÃ§Ã£o + Resgate SMART): Budesonida/Formoterol (200/6 mcg) - 1 inalaÃ§Ã£o de 12/12h fixa + 1 inalaÃ§Ã£o SOS se sintomas (mÃ¡ximo 8 inalaÃ§Ãµes/dia).',
      'Etapa 4 (Dose MÃ©dia Fixa): Budesonida/Formoterol (200/6 mcg) - 2 inalaÃ§Ãµes de 12/12h fixas + SABA (Salbutamol 100mcg 1-2 jatos) SOS se sintomas.',
      'TÃ©cnica InalatÃ³ria: Revisar o uso do dispositivo (aerossol ou pÃ³ seco), incentivar adesÃ£o e tratar comorbidades (DRGE, rinite).'
    ],
    guidelines: 'O uso de SABA (Salbutamol) isolado sem corticoide inalatÃ³rio estÃ¡ formalmente contraindicado pela GINA devido ao risco de Ã³bito e exacerbaÃ§Ãµes graves.'
  },
  {
    id: 'p114',
    title: 'DPOC (ManutenÃ§Ã£o)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico (Espirometria): VEF1/CVF < 0.70 pÃ³s-broncodilatador.',
      'ClassificaÃ§Ã£o (GOLD): Avaliar gravidade da obstruÃ§Ã£o (1-4) e sintomas/vulnerabilidade (A, B, E).',
      'Tratamento Grupo A: Qualquer broncodilatador (curta ou longa).',
      'Tratamento Grupo B: LAMA (TiotrÃ³pio) ou LABA (Formoterol/Salmeterol).',
      'Tratamento Grupo E: LAMA + LABA; considerar CI se EosinÃ³filos > 300.'
    ],
    guidelines: 'A cessaÃ§Ã£o do tabagismo Ã© a intervenÃ§Ã£o mais eficaz para reduzir a progressÃ£o da doenÃ§a.'
  },
  {
    id: 'p115',
    title: 'HansenÃ­ase',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Manchas com hipoestesia, perda de pelos e diminuiÃ§Ã£o da sudorese; espessamento de nervos perifÃ©ricos.',
      'ClassificaÃ§Ã£o (Paucibacilar): AtÃ© 5 lesÃµes de pele. Tratamento: Rifampicina + Dapsona por 6 meses.',
      'ClassificaÃ§Ã£o (Multibacilar): > 5 lesÃµes ou baciloscopia positiva. Tratamento: Rifampicina + Dapsona + Clofazimina por 12 meses.',
      'Exames: Baciloscopia de linfa (se disponÃ­vel) e teste de sensibilidade.',
      'Contatos: SEMPRE avaliar contatos domiciliares e aplicar BCG se indicado.'
    ],
    guidelines: 'A alta Ã© dada por cura clÃ­nica apÃ³s completar o nÃºmero de doses da PQT.'
  },
  {
    id: 'p116',
    title: 'Gastroenterocolite Aguda (GECA) / Diarreia',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Aumento do nÃºmero de dejeÃ§Ãµes e/ou alteraÃ§Ã£o da consistÃªncia (lÃ­quida). Pode haver vÃ´mitos e febre.',
      'Sinais de DesidrataÃ§Ã£o: Mucosas secas, turgor diminuÃ­do, olhos encovados, saliva espessa.',
      'Plano A (Sem DesidrataÃ§Ã£o): ReidrataÃ§Ã£o oral em casa (SRO), manter dieta habitual, zinco se crianÃ§a.',
      'Plano B (DesidrataÃ§Ã£o Leve/Moderada): ReidrataÃ§Ã£o oral na unidade (SRO 50-100mL/kg em 4h).',
      'Plano C (DesidrataÃ§Ã£o Grave): HidrataÃ§Ã£o venosa imediata (Fase de ExpansÃ£o: SF 0.9%).'
    ],
    guidelines: 'NÃ£o utilizar antidiarrÃ©icos (Loperamida) em quadros infecciosos/disentÃ©ricos.'
  },
  {
    id: 'p117',
    title: 'Cefaleia Tensional',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Dor em aperto, holocraniana, intensidade leve a moderada, sem nÃ¡useas.',
      'Analgesia Simples: Dipirona 1g ou Paracetamol 750mg - 1000mg.',
      'Segunda Linha: AINES (Ibuprofeno 600mg ou Naproxeno 500mg).',
      'PrevenÃ§Ã£o (Se crÃ´nica): Amitriptilina 10-25mg Ã  noite ou Nortriptilina.'
    ],
    guidelines: 'Identificar gatilhos como estresse, privaÃ§Ã£o de sono e mÃ¡ postura.'
  },
  {
    id: 'p118',
    title: 'Enxaqueca (MigrÃ¢nea)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Dor pulsÃ¡til, unilateral, com fotofobia, fonofobia e nÃ¡useas/vÃ´mitos.',
      'CritÃ©rios ICHD-3: â‰¥ 5 crises durando 4-72h + 2 de: Unilateral, PulsÃ¡til, Moderada/Grave, Piora com esforÃ§o + 1 de: NÃ¡usea/VÃ´mito ou Foto/Fonofobia.',
      'Crise Leve/Moderada: AINES + AntiemÃ©ticos (Metoclopramida 10mg).',
      'Crise Moderada/Grave: Triptanos (Sumatriptano 6mg SC ou 50-100mg VO).',
      'PrevenÃ§Ã£o: Propranolol, Topiramato ou Valproato (se crises frequentes > 3-4/mÃªs).'
    ],
    guidelines: 'O uso excessivo de analgÃ©sicos (> 10-15 dias/mÃªs) pode causar cefaleia de rebote.'
  },
  {
    id: 'p119',
    title: 'InfecÃ§Ã£o das Vias AÃ©reas Superiores (IVAS)',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Coriza, obstruÃ§Ã£o nasal, tosse, dor de garganta leve e febre.',
      'Etiologia: Diferenciar de Gripe (Influenza) que apresenta sintomas sistÃªmicos graves (mialgia intensa, febre alta, prostraÃ§Ã£o).',
      'Etiologia: 90% viral (RinovÃ­rus, CoronavÃ­rus, AdenovÃ­rus).',
      'Tratamento: SintomÃ¡ticos (Lavagem nasal com SF 0.9%, AnalgÃ©sicos, HidrataÃ§Ã£o).',
      'OrientaÃ§Ãµes: Repouso, boa alimentaÃ§Ã£o e sinais de alerta (dispneia).'
    ],
    guidelines: 'AntibiÃ³ticos nÃ£o tÃªm indicaÃ§Ã£o em resfriados comuns; o tratamento Ã© de suporte.'
  },
  {
    id: 'p120',
    title: 'Pneumonia Adquirida na Comunidade (PAC)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Tosse, febre, dor pleurÃ­tica e infiltrado novo no Rx de tÃ³rax.',
      'Score CURB-65: ConfusÃ£o, Ureia > 50, RespiraÃ§Ã£o > 30, Blood Pressure < 90/60, Idade >= 65.',
      'Tratamento Ambulatorial (0-1 ponto): Amoxicilina 500mg - 1g 8/8h ou Azitromicina.',
      'Tratamento Hospitalar (>= 2 pontos): Amoxicilina + Clavulanato + Azitromicina ou Ceftriaxone + Claritromicina.'
    ],
    guidelines: 'Avaliar oximetria de pulso; se Sat < 92%, internaÃ§Ã£o obrigatÃ³ria.'
  },
  {
    id: 'p121',
    title: 'InfecÃ§Ã£o do Trato UrinÃ¡rio (Cistite)',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: DisÃºria, polaciÃºria, urgÃªncia miccional e dor suprapÃºbica.',
      'Urocultura: Indicada em gestantes, idosos, homens, sintomas recorrentes ou complicados.',
      'Tratamento (NÃ£o Complicado): NitrofurantoÃ­na 100mg 12/12h (5 dias) ou Fosfomicina 3g dose Ãºnica.',
      'Alternativa: Sulfametoxazol + Trimetoprima 800/160mg 12/12h (3 dias).'
    ],
    guidelines: 'Em homens, sempre investigar causas obstrutivas ou prostatite associada.'
  },
  {
    id: 'p122',
    title: 'Crise de Ansiedade / Ataque de PÃ¢nico',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Taquicardia, sudorese, tremor, sensaÃ§Ã£o de asfixia, medo de morrer ou enlouquecer.',
      'Abordagem: Ambiente calmo, tÃ©cnica de respiraÃ§Ã£o diafragmÃ¡tica, validaÃ§Ã£o dos sintomas.',
      'SintomÃ¡tico (Se necessÃ¡rio): Diazepam 5-10mg VO ou Midazolam 1.5-2.5mg (se agitaÃ§Ã£o extrema).',
      'Encaminhamento: Iniciar seguimento em UBS/SaÃºde Mental para tratamento crÃ´nico (ISRS/Psicoterapia).'
    ],
    guidelines: 'Descartar causas orgÃ¢nicas (SCA, Arritias, TEP) se a apresentaÃ§Ã£o for atÃ­pica.'
  },
  {
    id: 'p123',
    title: 'Lombalgia Aguda',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Dor na regiÃ£o lombar, geralmente apÃ³s esforÃ§o fÃ­sico, sem sinais de alerta.',
      'Sinais de Alerta (Red Flags): Trauma, perda de peso, febre, dÃ©ficit motor, anestesia em sela.',
      'Tratamento: AnalgÃ©sicos (Paracetamol/Dipirona) + AINES por curto prazo (3-5 dias).',
      'Adjuvantes: Relaxantes musculares (Ciclobenzaprina 5-10mg) se houver espasmo importante.'
    ],
    guidelines: 'Evitar repouso absoluto; manter atividade fÃ­sica conforme tolerÃ¢ncia.'
  },
  {
    id: 'p124',
    title: 'CÃ³lica NefrÃ©tica (UrolitÃ­ase)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Dor sÃºbita, intensa, em cÃ³lica, na regiÃ£o lombar com irradiaÃ§Ã£o para flanco/genitÃ¡lia.',
      'Analgesia na EmergÃªncia: Tenoxicam 40mg IV ou Diclofenaco 75mg IM (se nÃ£o houver contraindicaÃ§Ã£o renal).',
      'OpiÃ³ides: Tramadol 50-100mg IV se dor refratÃ¡ria.',
      'Expulsivo (Se cÃ¡lculo < 10mm): Tansulosina 0.4mg/dia + HidrataÃ§Ã£o vigorosa.'
    ],
    guidelines: 'Solicitar TC de abdome sem contraste se dÃºvida diagnÃ³stica ou refratariedade.'
  },
  {
    id: 'p125',
    title: 'Conjuntivite Infecciosa',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Olhos vermelhos, secreÃ§Ã£o (purulenta ou aquosa), sensaÃ§Ã£o de corpo estranho.',
      'Viral: SecreÃ§Ã£o aquosa, associada a IVAS, auto-limitada.',
      'Bacteriana: SecreÃ§Ã£o purulenta abundante, "olho grudado" ao acordar.',
      'Tratamento: Higiene com SF 0.9% gelado; ColÃ­rio de Cloranfenicol ou Tobramicina (se bacteriana).'
    ],
    guidelines: 'Altamente contagiosa; orientar lavagem frequente das mÃ£os e nÃ£o compartilhar toalhas.'
  },
  {
    id: 'p126',
    title: 'Anafilaxia Grave',
    category: 'Ficha Vermelha (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: ReaÃ§Ã£o alÃ©rgica sistÃªmica rÃ¡pida com hipotensÃ£o, broncoespasmo ou edema de glote.',
      'Tratamento Imediato: Adrenalina (1mg/mL) 0.5mg IM no vasto lateral do fÃªmur. Repetir 5-15 min se necessÃ¡rio.',
      'Suporte: Cabeceira baixa (Trendelenburg), OxigÃªnio masc 10-15L/min, HidrataÃ§Ã£o vigorosa (SF 0.9%).',
      'Adjuvantes: Hidrocortisona 200-500mg IV + Anti-histamÃ­nicos (Difenidramina ou Prometazina).'
    ],
    guidelines: 'A Adrenalina IM deve ser a primeira medida; nÃ£o retardar por falta de acesso venoso.'
  },
  {
    id: 'p127',
    title: 'Edema Agudo de PulmÃ£o (EAP)',
    category: 'Ficha Vermelha (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Dispneia sÃºbita, ortopneia, estertores crepitantes atÃ© Ã¡pices, SatO2 baixa.',
      'Manejo Inicial: PosiÃ§Ã£o sentada, VNI (CPAP/BiPAP) se disponÃ­vel, O2 suplementar.',
      'Medicamentoso: Furosemida 40-80mg IV + Nitroglicerina (Tridil) se PAS > 100.',
      'MonitorizaÃ§Ã£o: ECG 12 derivaÃ§Ãµes (buscar causa isquÃªmica/arritmia).'
    ],
    guidelines: 'Evitar morfina rotineiramente; priorizar VNI e vasodilatadores se PA permitir.'
  },
  {
    id: 'p128',
    title: 'ApÃªndicite Aguda (Suspeita)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Dor periumbilical que migra para FID, anorexia, nÃ¡useas, sinal de Blumberg +.',
      'Score de Alvarado: Avaliar necessidade de imagem (Ultrassom ou TC de abdome).',
      'Manejo: Jejum, hidrataÃ§Ã£o venosa, analgesia (evitar AINES se possÃ­vel).',
      'AntibiÃ³tico: Ciprofloxacino + Metronidazol ou Ceftriaxone + Metronidazol (prÃ©-operatÃ³rio).'
    ],
    guidelines: 'Se Blumberg positivo e sinais sistÃªmicos, encaminhar para avaliaÃ§Ã£o cirÃºrgica imediata.'
  },
  {
    id: 'p129',
    title: 'Hemorragia Digestiva Alta (HDA)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: HematÃªmese, melena ou enterorragia (se sangramento vultoso).',
      'EstabilizaÃ§Ã£o (ABC): Dois acessos calibrosos, cristaloides, reservar tipagem sanguÃ­nea.',
      'Medicamentoso: IBP (Omeprazol 80mg ataque + 8mg/h) + Terlipressina (se suspeita de varizes).',
      'Procedimento: Endoscopia Digestiva Alta (EDA) de urgÃªncia (apÃ³s estabilizaÃ§Ã£o).'
    ],
    guidelines: 'A meta de Hemoglobina Ã© 7.0 - 9.0 g/dL na maioria dos pacientes.'
  },
  {
    id: 'p130',
    title: 'Meningite Bacteriana (Suspeita)',
    category: 'Ficha Vermelha (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: Cefaleia, febre, rigidez de nuca, alteraÃ§Ã£o de consciÃªncia ou petÃ©quias.',
      'Manejo Imediato: Coleta de hemoculturas e inÃ­cio rÃ¡pido de antibiÃ³tico (nÃ£o atrasar pelo lÃ­quor).',
      'Antibioticoterapia: Ceftriaxone 2g IV 12/12h + Vancomicina (conforme perfil local).',
      'Adjuvante: Dexametasona 10mg IV ANTES ou junto com a primeira dose de antibiÃ³tico.'
    ],
    guidelines: 'Realizar TC de crÃ¢nio antes da punÃ§Ã£o lombar se houver sinais de HIC ou dÃ©ficit focal.'
  },
  {
    id: 'p131',
    title: 'Faringite Bacteriana (Amigdalite)',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Dor de garganta intensa, febre, exsudato purulento nas amÃ­gdalas, linfonodos cervicais dolorosos.',
      'CritÃ©rios de Centor: Avaliar probabilidade de Streptococo (Febre, AusÃªncia tosse, Exsudato, Idade).',
      'Tratamento 1Âª Linha: Penicilina Benzatina (Benzetacil) 1.200.000 UI IM dose Ãºnica.',
      'Alternativa: Amoxicilina 500mg 8/8h por 10 dias ou Azitromicina (se alÃ©rgico).'
    ],
    guidelines: 'O tratamento visa prevenir a febre reumÃ¡tica e complicaÃ§Ãµes supurativas.'
  },
  {
    id: 'p132',
    title: 'Escabiose (Sarna)',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Prurido intenso (piora Ã  noite), pÃ¡pulas e sulcos em dobras, mÃ£os e axilas.',
      'Tratamento TÃ³pico: Permetrina 5% creme (aplicar do pescoÃ§o para baixo, deixar 8-12h, repetir 1 semana).',
      'Tratamento Oral: Ivermectina 200mcg/kg (dose Ãºnica, repetir em 1-2 semanas).',
      'OrientaÃ§Ãµes: Tratar todos os contatos domiciliares simultaneamente; lavar roupas de cama a 60Â°C.'
    ],
    guidelines: 'O prurido pode persistir por semanas apÃ³s o tratamento eficaz (prurido pÃ³s-escabiÃ³tico).'
  },
  {
    id: 'p133',
    title: 'Otite MÃ©dia Aguda (OMA)',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: Otalgia sÃºbita, plenitude auricular, abaulamento da membrana timpÃ¢nica.',
      'Analgesia: Dipirona ou Ibuprofeno para controle da dor.',
      'AntibiÃ³tico: Amoxicilina 500mg - 1g 8/8h por 7 a 10 dias.',
      'Alternativa: Amoxicilina + Clavulanato se falha terapÃªutica ou uso prÃ©vio de antibiÃ³tico.'
    ],
    guidelines: 'Em adultos, a OMA costuma ser uma complicaÃ§Ã£o de IVAS ou disfunÃ§Ã£o tubÃ¡ria.'
  },
  {
    id: 'p134',
    title: 'Impetigo',
    category: 'Ficha Verde (NÃ£o Urgente)',
    items: [
      'DiagnÃ³stico: VesÃ­culas ou pÃ¡pulas que evoluem para crostas melicÃ©ricas ("cor de mel").',
      'Tratamento TÃ³pico (Localizado): Mupirocina 2% pomada 3x/dia por 5-7 dias.',
      'Tratamento Oral (Extenso): Cefalexina 500mg 6/6h por 7 dias.',
      'Cuidados: Limpeza das lesÃµes com sabÃ£o neutro e remoÃ§Ã£o suave das crostas.'
    ],
    guidelines: 'Monitorar para glomerulonefrite pÃ³s-estreptocÃ³cica (raro mas possÃ­vel).'
  },
  {
    id: 'p135',
    title: 'Crise Hipertensiva (UrgÃªncia)',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: PA >= 180/120 mmHg sem lesÃ£o de Ã³rgÃ£o-alvo aguda.',
      'Manejo: Repouso em local calmo por 30 min e reavaliaÃ§Ã£o. Tratar ansiedade ou dor associada.',
      'Medicamentoso: Anti-hipertensivos orais (Captopril 25-50mg ou Clonidina 0.1-0.2mg).',
      'Objetivo: ReduÃ§Ã£o gradual da PA em 24-48h.'
    ],
    guidelines: 'NÃ£o baixar o nÃ­vel de PA abruptamente; perigo de hipoperfusÃ£o cerebral ou coronÃ¡ria.'
  },
  {
    id: 'p136',
    title: 'Uretrite (GonorrÃ©ia e ClamÃ­dia)',
    category: 'UBS / IST',
    items: [
      'DiagnÃ³stico: Corrimento uretral purulento ou mucoide, disÃºria e prurido uretral.',
      'Tratamento 1Âª Linha: Ceftriaxona 500mg IM + Azitromicina 1g VO (ambos dose Ãºnica).',
      'Parceiros: Tratar todos os parceiros dos Ãºltimos 60 dias.',
      'Aviso: AbstinÃªncia sexual por 7 dias apÃ³s o tratamento.'
    ],
    guidelines: 'O tratamento empÃ­rico deve cobrir ambos os agentes simultaneamente.'
  },
  {
    id: 'p137',
    title: 'SÃ­filis (PrimÃ¡ria e SecundÃ¡ria)',
    category: 'UBS / IST',
    items: [
      'PrimÃ¡ria: Cancro duro (Ãºlcera Ãºnica, indolor, bordas limpas) + adenopatia regional.',
      'SecundÃ¡ria: RosÃ©olas sifilÃ­ticas, placas mucosas, condiloma plano, linfadenopatia generalizada.',
      'Tratamento: Penicilina Benzativa 2.4 milhÃµes UI IM (dose Ãºnica para primÃ¡ria/secundÃ¡ria).',
      'Monitoramento: VDRL trimestral atÃ© cura (queda de 2 titulaÃ§Ãµes em 6 meses).'
    ],
    guidelines: 'Solicitar testes para HIV e Hepatites; tratar parceiros sexuais.'
  },
  {
    id: 'p138',
    title: 'Herpes Simples Genital (Crise)',
    category: 'UBS / IST',
    items: [
      'DiagnÃ³stico: VesÃ­culas agrupadas sobre base em eritema que evoluem para Ãºlceras dolorosas.',
      'Tratamento (PrimoinfecÃ§Ã£o): Aciclovir 400mg 3x/dia por 7 a 10 dias.',
      'Tratamento (RecorrÃªncia): Aciclovir 400mg 3x/dia por 5 dias.',
      'Cuidados: Higiene local e evitar relaÃ§Ãµes sexuais durante a fase ativa.'
    ],
    guidelines: 'O uso de aciclovir tÃ³pico tem eficÃ¡cia muito limitada comparado ao oral.'
  },
  {
    id: 'p139',
    title: 'Prostatite Aguda',
    category: 'Ficha Amarela (Urgente)',
    items: [
      'DiagnÃ³stico: Febre, calafrios, disÃºria e dor perineal/retal intensa.',
      'Exame: PrÃ³stata edemaciada e dolorosa ao toque retal (nÃ£o massagear!).',
      'AntibiÃ³tico 1Âª Linha: Ciprofloxacino 500mg 12/12h ou Levofloxacino 500mg/dia.',
      'DuraÃ§Ã£o: Requer tratamento prolongado (geralmente 4 semanas).'
    ],
    guidelines: 'Sempre coletar urocultura e hemoculturas se houver sinais de sepse.'
  },
  {
    id: 'p140',
    title: 'Dermatite Seborreica',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Placas eritematosas com descamaÃ§Ã£o amarelada e gordurosa.',
      'Ãreas Afetadas: Couro cabeludo, face (sobrancelhas, sulco nasogeniano), tÃ³rax.',
      'Tratamento (Couro): Xampu com Cetoconazol 2% ou Piritionato de zinco.',
      'Tratamento (Face): Hidrocortisona creme ou Cetoconazol creme por curto perÃ­odo.'
    ],
    guidelines: 'DoenÃ§a crÃ´nica com perÃ­odos de melhora e exacerbaÃ§Ã£o (estresse, frio).'
  },
  {
    id: 'p141',
    title: 'Escabiose (Sarna)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Prurido intenso (piora Ã  noite), pÃ¡pulas e sulcos em dobras e mÃ£os.',
      'Tratamento TÃ³pico: Permetrina 5% creme (pescoÃ§o para baixo, deixar 12h, repetir em 1 semana).',
      'Tratamento Oral: Ivermectina 200mcg/kg (dose Ãºnica, repetir em 1-2 semanas).',
      'OrientaÃ§Ãµes: Tratar todos os contatos e ferver roupas de cama/banho.'
    ],
    guidelines: 'O prurido pode persistir por 2-3 semanas mesmo apÃ³s o tratamento efetivo.'
  },
  {
    id: 'p142',
    title: 'Sinusite Aguda Bacteriana',
    category: 'Ficha Verde / UBS',
    items: [
      'DiagnÃ³stico: Dor facial, rinorreia purulenta e obstruÃ§Ã£o nasal por > 10 dias.',
      'Sinais de Gravidade: Edema periorbital, cefaleia intensa, febre alta persistente.',
      'Tratamento: Amoxicilina 500mg 8/8h ou Amoxicilina + Clavulanato.',
      'Adjuvantes: Lavagem nasal com SF 0.9% e analgÃ©sicos.'
    ],
    guidelines: 'A maioria das rinossinusites agudas Ã© viral; antibiÃ³ticos sÃ£o para casos selecionados.'
  },
  {
    id: 'p143',
    title: 'Pediculose (Piolho)',
    category: 'PediÃ¡trico / UBS',
    items: [
      'DiagnÃ³stico: Prurido em couro cabeludo, visualizaÃ§Ã£o de lÃªndeas ou piolhos vivos.',
      'Tratamento TÃ³pico: Permetrina 1% loÃ§Ã£o (deixar 10 min, lavar e repetir em 7 dias).',
      'RemoÃ§Ã£o MecÃ¢nica: Uso de pente fino Ã© fundamental para retirar as lÃªndeas.',
      'OrientaÃ§Ãµes: Higiene de objetos pessoais e tratamento de contatos.'
    ],
    guidelines: 'O pente fino deve ser passado diariamente durante 2 semanas.'
  },
  {
    id: 'p144',
    title: 'RosÃ¡cea',
    category: 'UBS / Dermatologia',
    items: [
      'DiagnÃ³stico: Eritema persistente na face, telangiectasias, pÃ¡pulas e pÃºstulas.',
      'Gatilhos: Sol, Ã¡lcool, comidas condimentadas, estresse tÃ©rmico.',
      'Manejo: ProteÃ§Ã£o solar rigorosa e sabonetes suaves.',
      'Tratamento: Metronidazol gel 0.75% ou Ivermectina 1% creme tÃ³pico.'
    ],
    guidelines: 'Evitar o uso de corticoides tÃ³picos na face, que podem agravar a rosÃ¡cea.'
  },
  {
    id: 'p145',
    title: 'Melasma',
    category: 'UBS / Dermatologia',
    items: [
      'DiagnÃ³stico: MÃ¡culas hipercromicas acastanhadas em Ã¡reas fotoexpostas (geralmente face).',
      'Fatores: ExposiÃ§Ã£o solar, genÃ©tica, anticoncepcionais hormonais.',
      'Pilar do Tratamento: FotoproteÃ§Ã£o de amplo espectro (FPS > 30 com cor).',
      'TÃ³picos: Hidroquinona ou Ãcido Azelaico sob supervisÃ£o.'
    ],
    guidelines: 'O tratamento Ã© longo e a recidiva Ã© comum com qualquer exposiÃ§Ã£o solar.'
  },
  {
    id: 'p146',
    title: 'UrticÃ¡ria CrÃ´nica',
    category: 'UBS / Alergologia',
    items: [
      'DiagnÃ³stico: Urticas recorrentes por perÃ­odo > 6 semanas.',
      'Tratamento 1Âª Linha: Anti-histamÃ­nicos H1 de 2Âª geraÃ§Ã£o (Desloratadina, Cetirizina).',
      'Escalonamento: Pode-se aumentar a dose em atÃ© 4x se nÃ£o houver controle.',
      'Exames: Geralmente nÃ£o requer investigaÃ§Ã£o exaustiva se nÃ£o houver sinais de alarme.'
    ],
    guidelines: 'Foco no controle sintomÃ¡tico e qualidade de vida.'
  },
   {
    id: 'p147',
    title: 'Ceratose ActÃ­nica',
    category: 'UBS / Dermatologia',
    items: [
      'DiagnÃ³stico: LesÃµes eritematosas, Ã¡speras, em Ã¡reas cronicamente expostas ao sol.',
      'ImportÃ¢ncia: LesÃ£o prÃ©-maligna que pode evoluir para Carcinoma Espinocelular.',
      'Tratamento: Crioterapia, 5-Fluorouracil ou Imiquimode tÃ³pico.',
      'PrevenÃ§Ã£o: Uso regular de filtro solar e chapÃ©us.'
    ],
    guidelines: 'MÃºltiplas lesÃµes indicam campo de cancerizaÃ§Ã£o.'
  },
  {
    id: 'p148',
    title: 'RubÃ©ola / Sarampo (Suspeita)',
    category: 'PediÃ¡trico / VigilÃ¢ncia',
    items: [
      'DiagnÃ³stico: Febre + Exantema morbiliforme + Sintomas respiratÃ³rios.',
      'Sarampo: Manchas de Koplik, tosse intensa, coriza.',
      'RubÃ©ola: Linfadenopatia retroauricular/occipital, exantema leve.',
      'Manejo: NotificaÃ§Ã£o compulsÃ³ria imediata e bloqueio vacinal.'
    ],
    guidelines: 'A suplementaÃ§Ã£o com Vitamina A Ã© recomendada no tratamento do Sarampo.'
  },
  {
    id: 'p149',
    title: 'CandidÃ­ase Oral (Manejo)',
    category: 'UBS / Pediatria / Odonto',
    items: [
      'DiagnÃ³stico: Placas esbranquiÃ§adas ("leite coalhado") que sangram ao raspar.',
      'Tratamento (Lactentes): Nistatina suspensÃ£o (aplicar 1-2mL 4x/dia por 7-10 dias).',
      'Tratamento (Adultos): Nistatina ou Fluconazol se refratÃ¡rio.',
      'Higiene: Lavar bicos e mamadeiras; tratar mamilos maternos.'
    ],
    guidelines: 'Investigar uso de antibiÃ³ticos ou corticoides inalatÃ³rios recentes.'
  },
  {
    id: 'p150',
    title: 'Resfriado Comum (Manejo)',
    category: 'UBS (AtenÃ§Ã£o BÃ¡sica)',
    items: [
      'DiagnÃ³stico: Coriza, obstruÃ§Ã£o nasal, tosse leve e febre autolimitada.',
      'Etiologia: RinovÃ­rus Ã© o principal agente. Diferenciar de IVAS bacteriana pela duraÃ§Ã£o e intensidade.',
      'Tratamento: SintomÃ¡ticos (AnalgÃ©sicos e AntitÃ©rmicos).',
      'Lavagem Nasal: Fundamental com SF 0.9%.',
      'OrientaÃ§Ãµes: Repouso e hidrataÃ§Ã£o.'
    ],
    guidelines: 'Uso de antibiÃ³ticos NÃƒO reduz complicaÃ§Ãµes e gera resistÃªncia.'
  },
  {
    id: 'p151',
    title: 'Meningite Bacteriana (Adulto)',
    category: 'Vermelho (EmergÃªncia)',
    items: [
      'DiagnÃ³stico: TrÃ­ade (Febre + Rigidez de Nuca + AlteraÃ§Ã£o Mental - presente em 44%).',
      'Sinais MenÃ­ngeos: Kernig (dor ao estender joelho com quadril fletido) e Brudzinski (flexÃ£o involuntÃ¡ria de pernas ao fletir pescoÃ§o).',
      'Conduta: PunÃ§Ã£o Lombar (LCR) + Culturas. Se sinais de HIC (papiledema, dÃ©ficit focal), fazer TC antes.',
      'LCR TÃ­pico: ProteÃ­na alta, Glicose baixa, Leucocitose com predomÃ­nio de NeutrÃ³filos.',
      'AntibiÃ³tico: Ceftriaxona 2g 12/12h + Vancomicina 15-20mg/kg 12/12h.',
      'Corticoide: Dexametasona 10mg IV 15-20 min antes ou junto com 1Âª dose ATB.'
    ],
    guidelines: 'A dexametasona reduz sequelas neurolÃ³gicas (especialmente em meningite por S. pneumoniae).'
  },
  {
    id: 'p152',
    title: 'Apendicite Aguda',
    category: 'Amarelo / Vermelho',
    items: [
      'DiagnÃ³stico: Dor migratÃ³ria (periumbilical -> FID), anorexia, nÃ¡useas.',
      'Sinal de Blumberg: Dor Ã  descompressÃ£o sÃºbita no ponto de McBurney.',
      'Escore de Alvarado: Dor migratÃ³ria (1), Anorexia (1), NÃ¡usea (1), Defesa FID (2), DescompressÃ£o (1), Febre (1), Leucocitose (2), Desvio Ã  esquerda (1).',
      'InterpretaÃ§Ã£o Alvarado: 0-3 (improvÃ¡vel); 4-6 (possÃ­vel - imagem); 7-8 (provÃ¡vel); 9-10 (cirurgia).',
      'Imagem: USG (crianÃ§as/gestantes) ou TC com contraste (adultos).'
    ],
    guidelines: 'Jejum absoluto e avaliaÃ§Ã£o imediata pela cirurgia geral.'
  },
  {
    id: 'p153',
    title: 'Hipocalemia (K < 3.5)',
    category: 'EletrÃ³litos',
    items: [
      'DiagnÃ³stico: K+ < 3.5 mEq/L. ECG: Onda U visÃ­vel, achatamento de T, depressÃ£o de ST.',
      'ReposiÃ§Ã£o Oral (Leve > 3.0): KCl xarope ou comprimidos de liberaÃ§Ã£o lenta.',
      'ReposiÃ§Ã£o Venosa (Grave < 3.0 ou ECG): KCl 10% ou 19.1%.',
      'Regra de Ouro: ConcentraÃ§Ã£o mÃ¡x 40mEq/L (veia perifÃ©rica) ou 60mEq/L (central). Velocidade mÃ¡x 20mEq/h.',
      'Cuidado: Sempre repor MagnÃ©sio associado (hipomagnesemia bloqueia reposiÃ§Ã£o de K+).'
    ],
    guidelines: 'Evitar diluir em soro glicosado (insulina endÃ³gena piora hipocalemia por shift).'
  },
  {
    id: 'p154',
    title: 'Hipernatremia (Na > 145)',
    category: 'EletrÃ³litos',
    items: [
      'DiagnÃ³stico: Na+ > 145 mEq/L. Geralmente por perda de Ã¡gua livre.',
      'DÃ©ficit de Ãgua Livre: (Na atual / Na desejado - 1) * ACT (Ãgua Corporal Total).',
      'ACT: Peso * 0.6 (homem jovem), 0.5 (homem idoso/mulher jovem), 0.45 (mulher idosa).',
      'Velocidade: Reduzir Na+ no mÃ¡ximo 10 mEq/L em 24h para evitar edema cerebral.',
      'Tratamento: Ãgua livre via oral/enteral (ideal) ou SG 5% IV.'
    ],
    guidelines: 'Monitorar sÃ³dio a cada 4-6h durante a fase aguda da correÃ§Ã£o.'
  },
  {
    id: 'p155',
    title: 'FibrilaÃ§Ã£o Atrial (AnticoagulaÃ§Ã£o e Conduta)',
    category: 'Cardiologia',
    items: [
      'DiagnÃ³stico: PresenÃ§a de batimentos cardÃ­acos arrÃ­tmicos ao exame fÃ­sico. ECG confirmatÃ³rio: AusÃªncia completa de ondas P, presenÃ§a de ondas "f" (fricÃ§Ã£o) basais irregulares e intervalos R-R totalmente assistÃ³licos/irregulares.',
      'Escore CHA2DS2-VASc (IndicaÃ§Ã£o de AnticoagulaÃ§Ã£o): C-CongestÃ£o/IC (1), H-HipertensÃ£o (1), A2-Idade â‰¥ 75 anos (2), D-Diabetes (1), S2-AVC/AIT prÃ©vio (2), V-DoenÃ§a Vascular (IM, DAP) (1), A-Idade 65-74 anos (1), Sc-Categoria Sexo Feminino (1). Indicado se Masculino â‰¥ 2 ou Feminino â‰¥ 3 pontos.',
      'Escore HAS-BLED (Risco de Sangramento): H-HipertensÃ£o sistÃ³lica > 160 (1), A-FunÃ§Ã£o renal ou hepÃ¡tica ruim (1 ou 2), S-HistÃ³ria de AVC (1), B-HistÃ³rico ou predisposiÃ§Ã£o a Sangramento (1), L-RNI instÃ¡vel (1), E-Idade > 65 anos (1), D-Uso de drogas/antiagregantes ou Ãlcool excessivo (1 ou 2). PontuaÃ§Ã£o â‰¥ 3 indica alto risco de sangramento, orientando acompanhamento estrito (NÃƒO contraindica anticoagulaÃ§Ã£o).',
      'AnticoagulaÃ§Ã£o de PreferÃªncia (DOACs): Apixabana 5mg VO de 12/12h (reduzir para 2.5mg 12/12h se houver pelo menos 2 de: Idade â‰¥ 80 anos, Peso â‰¤ 60kg, ou Creatinina sÃ©rica â‰¥ 1.5 mg/dL) ou Rivaroxabana 20mg VO 1x ao dia com a janta (reduzir para 15mg se ClCr 30-50 mL/min).',
      'Controle de FrequÃªncia CardÃ­aca: Metoprolol (Succinato) 25-50mg VO ao dia (ajustar atÃ© 200mg) ou Carvedilol 6.25mg a 25mg VO de 12/12h. Alvo terapÃªutico de FC < 110 bpm em repouso.'
    ],
    guidelines: 'A cardioversÃ£o elÃ©trica ou quÃ­mica imediata sem anticoagulaÃ§Ã£o prÃ©via de 3-4 semanas sÃ³ deve ser tentada se houver instabilidade hemodinÃ¢mica grave, ou se TEE (Eco transesofÃ¡gico) descartar trombo em Ã¡trio esquerdo.'
  },
  {
    id: 'p156',
    title: 'Tuberculose Pulmonar (Esquema Ripe)',
    category: 'Infectologia',
    items: [
      'DiagnÃ³stico (Protocolo TRM-TB): PresenÃ§a de achados clÃ­nicos tÃ­picos (tosse persistente por mais de 3 semanas, febre vespertina baixa, sudorese noturna importante e perda ponderal) combinada com Teste RÃ¡pido Molecular para Tuberculose (TRM-TB) que detecta a presenÃ§a de M. tuberculosis e pesquisa de resistÃªncia Ã  Rifampicina.',
      'AvaliaÃ§Ã£o Complementar: Radiografia de TÃ³rax (padrÃ£o infiltrativo ou cavitaÃ§Ãµes em Ã¡pices e segmentos posteriores dos lobos superiores). Baciloscopia (BAAR) de escarro se TRM-TB indisponÃ­vel.',
      'Ataque (Meses 1 e 2 - Esquema RIPE): Rifampicina (R) + Isoniazida (I) + Pirazinamida (P) + Etambutol (E) administrado em dose combinada fixa (4 em 1) conforme o peso do paciente. Adulto de 50 a 70kg: Administrar 4 comprimidos juntos por via oral pela manhÃ£, rigorosamente em jejum.',
      'ManutenÃ§Ã£o (Meses 3 ao 6 - Esquema RI): Rifampicina (R) + Isoniazida (I) administrados em comprimido combinado contendo 300mg R + 150mg I. Adulto de 50 a 70kg: Administrar 4 comprimidos por via oral, ao dia, pela manhÃ£.',
      'PrevenÃ§Ã£o de Efeitos Adversos: Adicionar Cloridrato de Piridoxina (Vitamina B6) 40mg VO ao dia se gestante, desnutrido severo, diabÃ©tico, alcoÃ³latra ou com doenÃ§a renal prÃ©via em uso de Isoniazida (previne neuropatia perifÃ©rica).'
    ],
    guidelines: 'Orientar o paciente sobre os efeitos adversos mais comuns, como a coloraÃ§Ã£o alaranjada de urina, suor e lÃ¡grimas induzida pela Rifampicina e o risco de hepatotoxicidade.'
  },
  {
    id: 'p157',
    title: 'Artrite Reumatoide',
    category: 'Reumatologia',
    items: [
      'DiagnÃ³stico (CritÃ©rios EULAR/ACR 2010): Indicado para pacientes com pelo menos 1 articulaÃ§Ã£o acometida por sinovite clÃ­nica. Composto por 4 domÃ­nios: (1) Envolvimento articular (grau e quantidade de pequenas/grandes articulaÃ§Ãµes afectadas); (2) Sorologia (Fator Reumatoide e anticorpo anti-CCP); (3) Reagentes de fase aguda (PCR ou VHS altos); (4) DuraÃ§Ã£o dos sintomas (limiar de 6 semanas). ClassificÃ¡vel se escore total â‰¥ 6 de 10.',
      'Tratamento Modificador de Primeira Linha (DMARD): Metotrexato (MTX) dose inicial de 10 mg a 15 mg por via oral, uma Ãºnica vez por semana (nunca fracionar diariamente). Associar obrigatoriamente Ãcido FÃ³lico 5mg VO, 24 a 48 horas apÃ³s a tomada do Metotrexato (evita estomatite, diarreia e mielossupressÃ£o).',
      'Terapia Adjuvante de TransiÃ§Ã£o ("Ponte"): Prednisona 5 mg a 7.5 mg VO em dose Ãºnica diÃ¡ria pela manhÃ£. Usar temporariamente para controle Ã¡lgico e funcional rÃ¡pido enquanto o Metotrexato demora 6-12 semanas para atingir benefÃ­cio completo.',
      'Controle e Metas (Treat-to-Target): Ajustar e progredir a dose do Metotrexato em 2.5-5mg a cada 4 semanas atÃ© atingir remissÃ£o clÃ­nica (ou dose mÃ¡xima de 25mg/semana).'
    ],
    guidelines: 'Realizar hemograma completo, transaminases sÃ©ricas (AST/ALT) e creatinina antes de prescrever Metotrexato, repetindo o controle de 2 em 2 meses.'
  },
  {
    id: 'p158',
    title: 'InsuficiÃªncia Renal Aguda (IRA KDIGO)',
    category: 'Nefrologia',
    items: [
      'DiagnÃ³stico (Diretrizes KDIGO): ClassificaÃ§Ã£o do degrau de lesÃ£o renal baseado em Creatinina (Cr) SÃ©rica ou DÃ©bito UrinÃ¡rio:',
      '  - EstÃ¡gio 1: ElevaÃ§Ã£o da Cr de 1.5 a 1.9 vezes do basal (dentro de 7 dias) ou acrÃ©scimo de â‰¥ 0.3 mg/dL em 48h; ou DÃ©bito urinÃ¡rio < 0.5 mL/kg/h por perÃ­odo de 6 a 12 horas.',
      '  - EstÃ¡gio 2: ElevaÃ§Ã£o da Cr sÃ©rica correspondente a 2.0 a 2.9 vezes o nÃ­vel basal anterior; ou DÃ©bito urinÃ¡rio < 0.5 mL/kg/h por perÃ­odo â‰¥ 12 horas.',
      '  - EstÃ¡gio 3: ElevaÃ§Ã£o da Cr â‰¥ 3.0 vezes o basal, acrÃ©scimo absoluto para Cr â‰¥ 4.0 mg/dL, ou necessidade do inÃ­cio agudo de Terapia de SubstituiÃ§Ã£o Renal (HemodiÃ¡lise); ou DÃ©bito urinÃ¡rio < 0.3 mL/kg/h por â‰¥ 24h ou anÃºria absoluta â‰¥ 12h.',
      'Manejo ClÃ­nico Sequencial: Suspender imediatamente drogas nefrotÃ³xicas (AINEs, AminoglicosÃ­deos). Ajustar a dosagem de todos os fÃ¡rmacos com base no ClCr estimado atual.',
      'EstabilizaÃ§Ã£o de Fluidos: Manter normovolemia fisiolÃ³gica (infundir cristaloide se houver depleÃ§Ã£o volÃªmica Ã³bvia; se houver sobrecarga de volume, prescrever Furosemida 40-80mg IV).'
    ],
    guidelines: 'Monitorar a taxa urinÃ¡ria em ml/kg/h e dosar eletrÃ³litos (K+, Ca++, Na+, P) e gasometria venosa 12/12h nos estÃ¡gios KDIGO 2 e 3 para prevenir hipercalemia refratÃ¡ria.'
  },
  {
    id: 'p159',
    title: 'Colite por Clostridioides difficile',
    category: 'Gastroenterologia',
    items: [
      'DiagnÃ³stico: PresenÃ§a de quadro diarreico agudo aquoso moderado a grave (geralmente â‰¥ 3 evacuaÃ§Ãµes lÃ­quidas em 24h) associado a dor abdominal em cÃ³lica e uso recente de antibiÃ³ticos sistÃªmicos de amplo espectro (como Cefalosporinas, Clindamicina ou Quinolonas).',
      'ConfirmaÃ§Ã£o DiagnÃ³stica: Pesquisa de Toxinas A e B no escarro de fezes por ELISA ou teste de amplificaÃ§Ã£o de Ã¡cido nucleico (PCR de fezes).',
      'Tratamento Primeira Linha (Leve / Moderado): Vancomicina 125mg por via oral (VO) de 6/6h por 10 dias inteiros (importante: a Vancomicina deve ser oral, pois a infusÃ£o venosa nÃ£o atinge a luz intestinal).',
      'Alternativa: Metronidazol 500mg por via oral de 8/8h por 10 dias (indicado somente se a Vancomicina ou Fidaxomicina oral estiver indubitavelmente indisponÃ­vel).',
      'InfecÃ§Ã£o Grave (Definida por LeucÃ³citos > 15k ou Creatinina sÃ©rica > 1.5 mg/dL): Vancomicina 125mg VO de 6/6h por 10 dias (acrescentar Metronidazol 500mg IV de 8/8h se houver Ã­leo paralÃ­tico associado).'
    ],
    guidelines: 'Evitar terminantemente o uso de medicamentos loperamida ou outros inibidores de motilidade intestinal para diminuir o perigo do desenvolvimento de MegacÃ³lon TÃ³xico.'
  },
  {
    id: 'p160',
    title: 'LÃºpus Eritematoso SistÃªmico (LES)',
    category: 'Reumatologia',
    items: [
      'DiagnÃ³stico (CritÃ©rios EULAR/ACR 2019): CritÃ©rio de entrada mandatÃ³rio: TÃ­tulo de FAN â‰¥ 1:80 no teste imunofluorescente indireto em cÃ©lulas HEp-2. Avaliam-se entÃ£o domÃ­nios ClÃ­nicos (Sintomas constitucionais, CutÃ¢neo agudo/crÃ´nico, AlopÃ©cia, Artrite inflamatÃ³ria, NeurolÃ³gico, Serosites, HematolÃ³gico com leucopenia/trombocitopenia e Renal com biÃ³psia) e domÃ­nios ImunolÃ³gicos (Anticorpos AntifosfolÃ­pides, FraÃ§Ãµes do Complemento C3/C4 depletadas, Anti-dsDNA ou Anti-Sm). ClassificaÃ§Ã£o positiva se escore somado â‰¥ 10.',
      'Tratamento Basal de ModulaÃ§Ã£o Universal: Sulfato de Hidroxicloroquina dose diÃ¡ria correspondente a 5 mg/kg/dia por via oral (usualmente 400mg ao dia para adultos). Reduz as recidivas sistÃªmicas graves e melhora a taxa de sobrevida.',
      'Controle das ExacerbaÃ§Ãµes Articulares Leves: Prednisona 5 mg a 10 mg ao dia VO, por curto prazo para controle inicial. Evitar o uso crÃ´nico continuado.',
      'Ataque de Crises Graves ou Nefrite LÃºpica: Pulsoterapia de Metilprednisolona 500 a 1000 mg IV por dia por 3 dias consecutivos, seguida de corticoterapia oral de desmame progressivo + Imunossupressor (como Micofenolato de Mofetila ou Ciclofosfamida).'
    ],
    guidelines: 'Todos os pacientes em terapia com hidroxicloroquina devem realizar exame oftalmolÃ³gico com campo visual de base e anualmente apÃ³s 5 anos de uso para triar toxicidade retiniana maculosa.'
  }
];

const SUMMARIES = [
  {
    area: 'EmergÃªncia',
    subjects: [
      {
        title: 'Abordagem da Dor TorÃ¡cica',
        content: `â€¢ EPIDEMIOLOGIA: A dor torÃ¡cica responde por 5 a 10% de todos os atendimentos de urgÃªncia e emergÃªncia hospitalar, sendo essencial a identificaÃ§Ã£o cÃ©lere das condiÃ§Ãµes que trazem risco iminente de morte (SCA, DissecÃ§Ã£o de Aorta, TEP, PneumotÃ³rax Hipertensivo, Ruptura EsofÃ¡gica e Tamponamento CardÃ­aco).
â€¢ FISIOPATOLOGIA: Ocorre desbalanÃ§o crÃ­tico entre oferta e demanda miocÃ¡rdica de oxigÃªnio. Na SÃ­ndrome Coronariana Aguda (SCA) com ou sem supra-ST, hÃ¡ instabilizaÃ§Ã£o ou ruptura de placa aterosclerÃ³tica prÃ©via com cascata de agregaÃ§Ã£o plaquetÃ¡ria e formaÃ§Ã£o de trombo intracoronÃ¡rio oclusivo ou suboclusivo.
â€¢ DIAGNÃ“STICO: ECG obrigatÃ³rio de 12 derivaÃ§Ãµes realizado e laudado em ATÃ‰ 10 MINUTOS da admissÃ£o. Marcadores de necrose miocÃ¡rdica (Troponina I ou T ultrassensÃ­vel) dosados na curva (m0 e m3h). Empregar escores de risco clÃ­nico como o HEART Score (HistÃ³ria, ECG, Idade, Fatores ClÃ­nicos de Risco, Troponina) para guiar alta segura de pacientes de baixo risco em Unidade de Dor TorÃ¡cica (UDT).
â€¢ TRATAMENTO: Terapia antiplaquetÃ¡ria dupla com AAS dose de ataque 200-300mg mastigado + Clopidogrel 300mg VO ou Ticagrelor 180mg VO. Nitrato SL (Nitroglicerina ou Mononitrato) se dor refratÃ¡ria e sem contraindicaÃ§Ãµes (PAS < 90, uso de PDE5i nas Ãºltimas 24-48h ou infarto de VD). Morfina reservada para dor intensa refratÃ¡ria ao nitrato. Oxigenioterapia reservada estritamente se SatO2 < 90% ou insuficiÃªncia respiratÃ³ria Ã³bvia.`
      },
      {
        title: 'Cetoacidose DiabÃ©tica (CAD)',
        content: `â€¢ EPIDEMIOLOGIA: Ã‰ a complicaÃ§Ã£o metabÃ³lica aguda mais frequente e grave em pacientes portadores de Diabetes Mellitus Tipo 1 (DM1), ocorrendo tambÃ©m em cerca de 10% a 30% de novos diagnÃ³sticos e em diabÃ©ticos Tipo 2 sob intenso estresse metabÃ³lico ou infecÃ§Ãµes desencadeantes.
â€¢ FISIOPATOLOGIA: A deficiÃªncia absoluta ou severamente relativa de insulina, combinada com a elevaÃ§Ã£o drÃ¡stica de hormÃ´nios contrarreguladores (glucagon, cortisol, catecolaminas, GH), ativa a lipÃ³lise descontrolada no tecido adiposo, gerando Ã¡cidos graxos livres que sofrem beta-oxidaÃ§Ã£o hepÃ¡tica acelerada com desvio para cetogÃªnese excessiva (acetoacetato e beta-hidroxibutirato).
â€¢ DIAGNÃ“STICO: TrÃ­ade constituÃ­da por Glicemia capilar/sÃ©rica > 250 mg/dL, Acidose metabÃ³lica (pH arterial/venoso < 7,30 e Bicarbonato sÃ©rico < 15 mEq/L) acompanhada de cetonemia ou cetonÃºria exuberante. O Anion Gap encontra-se francamente elevado (rotineiramente > 12-14), decorrente da produÃ§Ã£o maciÃ§a de cetoÃ¡cidos.
â€¢ TRATAMENTO: Protocolo trifase progressivo: (1) HidrataÃ§Ã£o venosa vigorosa imediata com 1000-1500ml de SF 0,9% na primeira 1 hora; (2) Insulinoterapia contÃ­nua rÃ¡pida por bomba de infusÃ£o (0,1 UI/kg/hora) apÃ³s certificar-se de que o PotÃ¡ssio sÃ©rico estÃ¡ rigorosamente > 3,3 mEq/L; (3) Manejo agressivo e contÃ­nuo de PotÃ¡ssio (se K 3,3-5,2, infundir 20-30 mEq de K+ por litro de fluido administrado). Se K < 3,3, reter o inÃ­cio da insulina e repor potÃ¡ssio venoso imediato.`
      },
      {
        title: 'Anafilaxia',
        content: `â€¢ EPIDEMIOLOGIA: ReaÃ§Ã£o de hipersensibilidade sistÃªmica aguda, potencialmente fatal, desencadeada mais comumente por picadas de himenÃ³pteros, alÃ©rgenos alimentares (leite, ovo, castanhas, frutos do mar) ou fÃ¡rmacos sistÃªmicos (AINEs, Penicilinas, contrastes iodados).
â€¢ FISIOPATOLOGIA: DegranulaÃ§Ã£o maciÃ§a, generalizada e repentina de mastÃ³citos e basÃ³filos teciduais, usualmente ligada Ã  ativaÃ§Ã£o mediada por IgE, com liberaÃ§Ã£o de mediadores inflamatÃ³rios vasoativos potentes (histamina, leucotrienos, prostaglandinas, fator de ativaÃ§Ã£o plaquetÃ¡ria) que causam vasodilataÃ§Ã£o venosa e arterial generalizada, extravasamento plasmÃ¡tico e broncoespasmo severo.
â€¢ DIAGNÃ“STICO: Reconhecimento clÃ­nico imediato de inÃ­cio sÃºbito de sintomas dermatolÃ³gicos (urticÃ¡ria disseminada, prurido, angioedema labial/palpebral) associado a pelo menos 1 destes sistemas acometidos: respiratÃ³rio (sibilos, estridor larÃ­ngeo, dispneia grave), cardiovascular (hipotensÃ£o profunda, colapso circulatÃ³rio) ou gastrointestinal severo persistente (dor abdominal em cÃ³lica intensa, vÃ´mitos profusos).
â€¢ TRATAMENTO: ADMINISTRAÃ‡ÃƒO PRECOCE DE ADRENALINA (EPINEFRINA) 1:1000 na dose de 0,3 a 0,5 mg IM (adultos) ou 0,01 mg/kg IM (pediÃ¡trico) no ventrolateral da coxa (vasto lateral). Pode ser repetida a cada 5-15 minutos se houver refratariedade. Corticoterapia (Metilprednisolona 125mg IV) e Anti-histamÃ­nicos (Difenidramina 50mg IV) sÃ£o estritamente adjuvantes e tardios, nunca devendo postergar a adrenalina.`
      }
    ]
  },
  {
    area: 'Cardiologia',
    subjects: [
      {
        title: 'FibrilaÃ§Ã£o Atrial (FA)',
        content: `â€¢ EPIDEMIOLOGIA: A arritmia sustentada mais prevalente na prÃ¡tica clÃ­nica do clÃ­nico e do cardiologista. O risco cumulativo ao longo da vida atinge 25%, elevando de 4 a 5 vezes a incidÃªncia de Acidente Vascular Cerebral IsquÃªmico (AVCi) tromboembÃ³lico secundÃ¡rio.
â€¢ FISIOPATOLOGIA: DesorganizaÃ§Ã£o completa e caÃ³tica da atividade elÃ©trica atrial decorrente de focos ectÃ³picos de disparo ultrarrÃ¡pido (frequentemente situados na transiÃ§Ã£o das veias pulmonares). Isso gera mÃºltiplos microcircuitos de reentrada errÃ¡ticos, eliminando a sÃ­stole atrial mecÃ¢nica e provocando estase sanguÃ­nea crÃ´nica no apÃªndice atrial esquerdo.
â€¢ DIAGNÃ“STICO: ECG contendo ausÃªncia absoluta de ondas P organizadas (substituÃ­das por ondas de fibrilaÃ§Ã£o "f" desordenadas na linha de base) associado a intervalos R-R completamente irregulares e imprevisÃ­veis. AusÃªncia de dÃ©ficit de pulso fisiolÃ³gico.
â€¢ TRATAMENTO: Estratificar risco tromboembÃ³lico pelo escore CHA2DS2-VASc e de sangramento pelo HAS-BLED. AnticoagulaÃ§Ã£o com DOACs (Apixabana 5mg 12/12h ou Rivaroxabana 20mg 1x/dia) se escore â‰¥ 2 em homens ou â‰¥ 3 em mulheres. O controle de FC em repouso deve objetivar < 110 bpm com uso de Betabloqueadores (Metoprolol 25-50mg 12/12h) ou Bloqueadores de Canais de CÃ¡lcio (Diltiazem).`
      },
      {
        title: 'InsuficiÃªncia CardÃ­aca (IC)',
        content: `â€¢ EPIDEMIOLOGIA: Causa lÃ­der isolada de internaÃ§Ã£o hospitalar eletiva e de emergÃªncia em pacientes idosos (> 65 anos), apresentando uma taxa assustadora de mortalidade de aproximadamente 50% em 5 anos pÃ³s-diagnÃ³stico se mantida sem tratamento moderno.
â€¢ FISIOPATOLOGIA: LesÃ£o miocÃ¡rdica crÃ´nica ou aguda (isquÃªmica por infarto, sobrecarga de pressÃ£o por HAS refratÃ¡ria, miocardiopatia idiopÃ¡tica) induzindo disfunÃ§Ã£o sistÃ³lica ou diastÃ³lica do ventrÃ­culo esquerdo. HÃ¡ estimulaÃ§Ã£o compensatÃ³ria deletÃ©ria crÃ´nica dos sistemas neuro-humorais como o RAA (Renina-Angiotensina-Aldosterona) e o SNS (SimpÃ¡tico), gerando hipertrofia patolÃ³gica, fibrose e remodelaÃ§Ã£o cardÃ­aca progressiva.
â€¢ DIAGNÃ“STICO: Baseado nos critÃ©rios clÃ­nicos clÃ¡ssicos de Framingham (maiores: DPN, turgÃªncia jugular patolÃ³gica, creptaÃ§Ãµes pulmonares bibasais, cardiomegalia no Rx) apoiado pelo doseamento de biomarcadores cardÃ­acos de estiramento ventricular (BNP > 35 pg/mL ou NT-proBNP > 125 pg/mL) e Ecocardiograma transtorÃ¡cico com cÃ¡lculo da FraÃ§Ã£o de EjeÃ§Ã£o do VE (ICFEr vs. ICFEp).
â€¢ TRATAMENTO: O pilar moderno "QuÃ¡drupla Terapia" modificadora de sobrevida na ICFEr (FEVE < 40%) compreende: (1) Sacubitril/Valsartana (ou IECA/BRA); (2) Betabloqueador de liberaÃ§Ã£o sustentada (Succinato de Metoprolol, Carvedilol ou Bisoprolol); (3) Antagonista de Receptor de Mineralocorticoide (Espironolactona 25mg/dia); e (4) Inibidores do SGLT2 (Dapagliflozina 10mg ou Empagliflozina 10mg/dia). DiurÃ©ticos de alÃ§a (Furosemida) titulados apenas para controle dinÃ¢mico da congestÃ£o volÃªmica.`
      }
    ]
  },
  {
    area: 'Infectologia',
    subjects: [
      {
        title: 'Pneumonia ComunitÃ¡ria',
        content: `â€¢ EPIDEMIOLOGIA: Uma das principais causas globais de internamento e morbimortalidade de origem infecciosa no Brasil e no mundo. Acomete principalmente extremos de idade (crianÃ§as menores de 5 anos e idosos acima de 60 anos).
â€¢ FISIOPATOLOGIA: TranslocaÃ§Ã£o microbiana por microaspiraÃ§Ã£o de patÃ³genos aerÃ³bicos da orofaringe que ultrapassam as defesas fÃ­sicas do epitÃ©lio mucociliar e os macrÃ³fagos alveolares. O principal patÃ³geno Ã© o Streptococcus pneumoniae (pneumococo), seguido por Mycoplasma pneumoniae, Chlamydia pneumoniae e vÃ­rus respiratÃ³rios sazonais.
â€¢ DIAGNÃ“STICO: Consiste em infiltrado pulmonar alveolar novo ao estudo radiogrÃ¡fico de tÃ³rax (Rx ou TC) associado a sintomas clÃ­nicos pulmonares agudos como febre aferida (> 37,8ÂºC), tosse produtiva mucopurulenta, expectoraÃ§Ã£o amarelada ou esverdeada, dor torÃ¡cica pleurÃ­tica e dispneia com hipoxemia perifÃ©rica. Aplicar o escore CURB-65 (ConfusÃ£o, Ureia > 43, RespiraÃ§Ã£o â‰¥ 30/min, BP < 90/60, Idade â‰¥ 65 Anos) para definir local de tratamento (0-1: ambulatorial; 2: enfermaria; â‰¥ 3: considerar UTI).
â€¢ TRATAMENTO: Ambulatorial: Amoxicilina 1g de 8/8h isolada ou Claritromicina 500mg de 12/12h por 5-7 dias. Hospitalar (Enfermaria): Ceftriaxona 2g IV 1x/dia associada Ã  Claritromicina 500mg IV 12/12h para cobrir germes atÃ­picos. Hospitalar (UTI): Ceftriaxona 2g IV ao dia + Levofloxacino 750mg IV ao dia.`
      },
      {
        title: 'Sepse (Sepsis-3)',
        content: `â€¢ EPIDEMIOLOGIA: Responde por cerca de 30% das internaÃ§Ãµes em UTIs brasileiras, com taxas de letalidade que chegam a 50% em hospitais pÃºblicos. O reconhecimento rÃ¡pido Ã© o fator prognÃ³stico mais importante para a sobrevida do paciente.
â€¢ FISIOPATOLOGIA: DisfunÃ§Ã£o orgÃ¢nica de evoluÃ§Ã£o aguda que pÃµe em risco a vida do hospedeiro, provocada por uma resposta imune e inflamatÃ³ria desregulada a um foco infeccioso suspeito ou confirmado. Ocorre disfunÃ§Ã£o endotelial progressiva, distÃºrbios da microcirculaÃ§Ã£o por microtrombos, vasodilataÃ§Ã£o profunda por NO e apoptose celular celular difusa que resulta em disÃ³xia tecidual generalizada.
â€¢ DIAGNÃ“STICO: Identificado clÃ­nicos pela variaÃ§Ã£o aguda de â‰¥ 2 pontos no escore SOFA (Sequential Organ Failure Assessment) decorrente da infecÃ§Ã£o. O escore rÃ¡pido qSOFA (FR â‰¥ 22 irpm, alteraÃ§Ã£o mental aguda e PAS â‰¤ 100 mmHg) serve para triagem Ã  beira do leito de pacientes de risco elevado. Choque SÃ©ptico: Necessidade de vasopressor contÃ­nuo para manter PAM â‰¥ 65 mmHg E Lactato sÃ©rico de controle > 2 mmol/L (18 mg/dL) mesmo apÃ³s reposiÃ§Ã£o volÃªmica adequada de cristaloides.
â€¢ TRATAMENTO: Iniciar o "Bundle da 1Âª Hora": (1) Dosar lactato sÃ©rico (repetir de 2/2h se alterado); (2) Coletar no mÃ­nimo 2 pares de hemoculturas de sÃ­tios anatÃ´micos diferentes antes da infusÃ£o de antimicrobiano; (3) Administrar antibiÃ³tico empÃ­rico de amplo espectro na dose correta (ex: Piperacilina/Tazobactam 4,5g IV ou Meropenem 1-2g IV); (4) Infundir infusÃ£o rÃ¡pida de 30 mL/kg de cristaloides se houver hipotensÃ£o arterial persistente (PAM < 65) ou Lactato â‰¥ 4,0 mmol/L; (5) Iniciar precocemente Noradrenalina se hipotensÃ£o persistente.`
      },
      {
        title: 'Endocardite Infecciosa',
        content: `â€¢ EPIDEMIOLOGIA: Afeta preferencialmente pacientes com prÃ³teses valvares, cardiopatias congÃªnitas estruturais, cateteres vasculares permanentes prolongados ou usuÃ¡rios de drogas intravenosas, apresentando alta taxa de mortalidade inter-hospitalar.
â€¢ FISIOPATOLOGIA: Ocorre deposiÃ§Ã£o mecÃ¢nica localizada de fibrina e agregados plaquetÃ¡rios em Ã¡reas de endotÃ©lio cizalhado ou lesado (endocardite trombÃ³tica nÃ£o bacteriana). Bacteremias transientes dÃ£o ancoramento e colonizaÃ§Ã£o bacteriana estÃ¡vel nestes focos, gerando o crescimento progressivo de "vegetaÃ§Ãµes" que destroem o tecido valvar e embolizam periodicamente. Os germes principais sÃ£o Staphylococcus aureus (extremamente destruidor em valvas nativas) e Streptococcus viridans.
â€¢ DIAGNÃ“STICO: Baseado na aplicaÃ§Ã£o dos critÃ©rios modificados de Duke. CritÃ©rios Maiores: (1) Hemoculturas positivas persistentes para patÃ³genos tÃ­picos; (2) EvidÃªncia ecocardiogrÃ¡fica direta de acometimento endocÃ¡rdico (vegetaÃ§Ã£o mÃ³vel, abscesso perivalvar ou deiscÃªncia de prÃ³tese). CritÃ©rios Menores: Febre severa, fenÃ´menos vasculares embÃ³licos, imunolÃ³gicos (nÃ³dulos de Osler, manchas de Roth, glomerulonefrite) e hemoculturas sugestivas.
â€¢ TRATAMENTO: Terapia farmacolÃ³gica prolongada baseada no antibiograma por 4 a 6 semanas. Esquema empÃ­rico inicial usual: Ampicilina 2g IV de 4/4h associada Ã  Oxacilina 2g IV de 4/4h e Gentamicina 3mg/kg/dia IV dividida. A indicaÃ§Ã£o cirÃºrgica precoce deve ser considerada se houver insuficiÃªncia cardÃ­aca congestiva intratÃ¡vel por disfunÃ§Ã£o valvar aguda, infecÃ§Ã£o descontrolada contÃ­nua com hemoculturas persistentes ou vegetaÃ§Ãµes mÃ³veis gigantes (> 10mm) com episÃ³dios embÃ³licos repetidos.`
      }
    ]
  },
  {
    area: 'Medicina Intensiva',
    subjects: [
      {
        title: 'SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo',
        content: `â€¢ EPIDEMIOLOGIA: Presente em aproximadamente 10% de todas as internaÃ§Ãµes em leitos de UTI gerais e em cerca de 23% dos pacientes em ventilaÃ§Ã£o mecÃ¢nica invasiva. Causas comuns incluem sepse grave de foco pulmonar ou extrapulmonar, aspiraÃ§Ã£o de conteÃºdo gÃ¡strico e trauma torÃ¡cico maior.
â€¢ FISIOPATOLOGIA: Resposta inflamatÃ³ria alveolar devastadora com lesÃ£o alveolar difusa e quebra da barreira alvÃ©olo-capilar pulmonar. Ocorre edema pulmonar inflamatÃ³rio exsudativo rico em proteÃ­nas, inativaÃ§Ã£o do surfactante pulmonar com colapso maciÃ§o dos alvÃ©olos e formaÃ§Ã£o de membranas hialinas. Isso induz grave shunt intrapulmonar direito-esquerdo de sangue e severa hipoxemia refratÃ¡ria.
â€¢ DIAGNÃ“STICO: CritÃ©rios clÃ¡ssicos de Berlim: (1) Sintomas respiratÃ³rios agudos com inÃ­cio em atÃ© 7 dias do insulto conhecido; (2) Infiltrados bilaterais opacos e difusos em Rx ou TC de tÃ³rax, nÃ£o explicados completamente por efusÃµes ou colapsos lobares; (3) Edema pulmonar nÃ£o cardiogÃªnico (excluir sobrecarga volÃªmica hidrostÃ¡tica/disfunÃ§Ã£o VE); (4) RelaÃ§Ã£o PaO2/FiO2 < 300 com PEEP â‰¥ 5 cmH2O (Leve 201-300; Moderada 101-200; Grave â‰¤ 100).
â€¢ TRATAMENTO: EstratÃ©gia de VentilaÃ§Ã£o Protetora: Volume Corrente (VC) limitado a 6 mL/kg com base no peso ideal estimado, mantendo a PressÃ£o de PlatÃ´ respiratÃ³ria < 30 cmH2O e a Driving Pressure (PlatÃ´ - PEEP) < 15 cmH2O. Se a relaÃ§Ã£o PaO2/FiO2 estiver persistentemente < 150, utilizar infusÃ£o contÃ­nua de bloqueador neuromuscular (CisatracÃºrio) e realizar ventilaÃ§Ã£o mecÃ¢nica em PosiÃ§Ã£o Prona por pelo menos 16 a 20 horas consecutivas diÃ¡rias.`
      },
      {
        title: 'Choque: ClassificaÃ§Ã£o e Manejo',
        content: `â€¢ FISIOPATOLOGIA: Estado agudo e dinÃ¢mico de falÃªncia circulatÃ³ria generalizada caracterizado pela incapacidade profunda do sistema cardiovascular em prover oxigÃªnio (delivery de O2 [DO2]) adequado ao consumo metabÃ³lico dos tecidos perifÃ©ricos (VO2), resultando em disÃ³xia celular difusa e induÃ§Ã£o de metabolismo anaerÃ³bico compensatÃ³rio produtor de lactato.
â€¢ TIPOS: (1) Distributivo (vasodilataÃ§Ã£o profunda e hipovolemia relativa; ex: Sepse, Anafilaxia, NeurogÃªnico); (2) HipovolÃªmico (perda absoluta de fluido extracelular; ex: Hemorragia maciÃ§a, DesidrataÃ§Ã£o grave); (3) CardiogÃªnico (falÃªncia primÃ¡ria da contratilidade cardÃ­aca; ex: IAM, Miocardite); (4) Obstrutivo (barreira anatÃ´mica mecÃ¢nica ao fluxo de sangue; ex: TEP maciÃ§o, Tamponamento, PneumotÃ³rax hipertensivo).
â€¢ DIAGNÃ“STICO: Sinais clÃ­nicos Ã³bvios de mÃ¡ perfusÃ£o tecidual orgÃ¢nica: Tempo de Enchimento Capilar (TEC) perifÃ©rico lentificado (> 3 segundos), hipotensÃ£o arterial (PAS < 90 mmHg ou queda rÃ¡pida de > 40 mmHg do basal), pele fria e pegajosa (exceto no choque distributivo inicial), oligÃºria (< 0,5 mL/kg/hora), confusÃ£o mental, acidose metabÃ³lica e lactato sÃ©rico elevado (> 2,0 mmol/L).
â€¢ MANEJO: Resgatar com fluidos cristaloides (20-30 ml/kg) se houver probabilidade real de hipovolemia absoluta/relativa. Se hipotensÃ£o persistente, iniciar imediatamente Noradrenalina por via venosa segura em infusÃ£o tateada para manter PAM â‰¥ 65 mmHg de alvo. No choque cardiogÃªnico com congestÃ£o sistÃªmica associada, iniciar agente inotrÃ³pico direto como a Dobutamina (2 a 20 mcg/kg/min) associado a vasopressor se necessÃ¡rio.`
      }
    ]
  },
  {
    area: 'EmergÃªncias PsiquiÃ¡tricas',
    subjects: [
      {
        title: 'AgitaÃ§Ã£o Psicomotora',
        content: `â€¢ DIAGNÃ“STICO: CondiÃ§Ã£o de risco caracterizada por atividade motora excessiva e desorganizada, exacerbaÃ§Ã£o cognitiva, agressividade verbal ou fÃ­sica iminente e perda da autocrÃ­tica. Ã‰ essencial priorizar e descartar etiologias orgÃ¢nicas graves ocultas (IntoxicaÃ§Ã£o por substÃ¢ncias psicoativas, abstinÃªncia alcoÃ³lica, hipoglicemia severa, meningites, hipÃ³xia ou encefalopatia metabÃ³lica flutuante) antes de rotular etiologia puramente psiquiÃ¡trica primÃ¡ria.
â€¢ CONDUTA: Protocolo de seguranÃ§a e controle progressivo: (1) Abordagem verbal pacÃ­fica e calma, sem confrontamento ou tom desafiador, mantendo o ambiente calmo; (2) ContenÃ§Ã£o fÃ­sica ou mecÃ¢nica de emergÃªncia em leito hospitalar se houver risco evidente de autolesÃ£o, heteroagressÃ£o fÃ­sica iminente ou destruiÃ§Ã£o do patrimÃ´nio (deve ser feita com pelo menos 5 profissionais posicionados e com anotaÃ§Ã£o formal no prontuÃ¡rio).
â€¢ FARMACOTERAPIA: Terapia de sedaÃ§Ã£o de urgÃªncia: CÃ³quetel clÃ¡ssico IM contendo Haloperidol 5mg (analÃ©ptico neurolÃ©ptico tÃ­pico de alta potÃªncia) associado Ã  Prometazina 50mg (anti-histamÃ­nico de primeira geraÃ§Ã£o promotor de sedaÃ§Ã£o sinÃ©rgica e bloqueador de efeitos extrapiramidais agudos do haloperidol) por via intramuscular profunda. Evitar o uso de BenzodiazepÃ­nicos se suspeita de sedaÃ§Ã£o respiratÃ³ria induzida ou depressÃ£o respiratÃ³ria mista avanÃ§ada.`
      }
    ]
  },
  {
    area: 'Endocrinologia',
    subjects: [
      {
        title: 'Diabetes Mellitus: DiagnÃ³stico',
        content: `â€¢ EPIDEMIOLOGIA: O Diabetes Mellitus atinge cerca de 9 a 12% da populaÃ§Ã£o brasileira, gerando elevadÃ­ssima morbidade decorrente de complicaÃ§Ãµes microvasculares crÃ´nicas (retinopatia, nefropatia diabÃ©tica acelerada, neuropatia sensitivo-motora perifÃ©rica) e macrovasculares agudas e crÃ´nicas (IAM, AVCi, doenÃ§a arterial obstrutiva perifÃ©rica).
â€¢ FISIOPATOLOGIA: O DM Tipo 1 Ã© gerado pela destruiÃ§Ã£o seletiva autoimune das cÃ©lulas beta das ilhotas pancreÃ¡ticas, resultando em ausÃªncia total e absoluta de secreÃ§Ã£o de insulina. O DM Tipo 2 baseia-se na resistÃªncia perifÃ©rica Ã  aÃ§Ã£o do hormÃ´nio nos tecidos muscular, hepÃ¡tico e adiposo, evoluindo progressivamente com a exaustÃ£o compensatÃ³ria crÃ´nica e apoptose das cÃ©lulas produtoras do pÃ¢ncreas.
â€¢ DIAGNÃ“STICO: PresenÃ§a de um dos seguintes parÃ¢metros confirmados em 2 ocasiÃµes distintas (ou na presenÃ§a de sintomas clÃ¡ssicos de hiperglicemia como poliÃºria, polidipsia, perda ponderal nÃ£o intencional e polifagia): (1) Glicemia de jejum de 8 horas â‰¥ 126 mg/dL; (2) Glicemia 2 horas apÃ³s sobrecarga de 75g de glicose anidra (TOTG) â‰¥ 200 mg/dL; (3) Hemoglobina Glicada (HbA1c) padronizada â‰¥ 6,5%; (4) Glicemia aleatÃ³ria coletada em qualquer horÃ¡rio com sintomas clÃ¡ssicos â‰¥ 200 mg/dL.
â€¢ TRATAMENTO: A primeira linha consensual universal para o paciente portador de DM2 Ã© a Metformina (iniciada com 500-850mg VO ao dia com refeiÃ§Ã£o, titulada atÃ© 2g), associada a inibidores do SGLT2 (Dapagliflozina, Empagliflozina) ou anÃ¡logos do GLP-1 (Liraglutida, Semaglutida) se houver evidÃªncia concomitante de doenÃ§a cardiovascular aterosclerÃ³tica estabelecida, insuficiÃªncia cardÃ­aca crÃ´nica ou disfunÃ§Ã£o renal progressiva com albuminÃºria indesejada.`
      },
      {
        title: 'Hipotireoidismo',
        content: `â€¢ EPIDEMIOLOGIA: DistÃºrbio endÃ³crino prevalente que acomete cerca de 8 a 15% das mulheres adultas na faixa etÃ¡ria acima dos 40 anos, com incidÃªncia que aumenta progressivamente com a senescÃªncia.
â€¢ FISIOPATOLOGIA: No hipotireoidismo primÃ¡rio (99% dos casos clÃ­nicos), hÃ¡ disfunÃ§Ã£o intrÃ­nseca glandular crÃ´nica decorrente principalmente da tireoidite linfocitÃ¡ria crÃ´nica autoimune (Tireoidite de Hashimoto), caracterizada pela presenÃ§a marcante de autoanticorpos dirigidos contra a tireoperoxidase (anti-TPO) e tireoglobulina (anti-Tg) que destroem paulatinamente o tecido parenquimatoso competente, reduzindo a biosÃ­ntese de T3 e T4.
â€¢ DIAGNÃ“STICO: Dosagem sÃ©rica basal combinada de TSH (HormÃ´nio Estimulador da Tireoide) e T4 Livre. Hipotireoidismo ClÃ­nico: PresenÃ§a de TSH elevado associado a T4 Livre cronicamente abaixo da faixa normal de referÃªncia. Hipotireoidismo SubclÃ­nico: Caracterizado por TSH elevado (geralmente entre 4,5 e 10 mIU/L) com nÃ­veis sÃ©ricos circulantes de T4 Livre rigorosamente dentro dos limites normais fisiolÃ³gicos.
â€¢ TRATAMENTO: ReposiÃ§Ã£o hormonal oral com Levotiroxina sÃ³dica pura (T4 sintÃ©tico) na dose metabÃ³lica inicial estimada de 1,6 mcg/kg/dia para adultos eutrÃ³ficos de meia-idade, ingerida pela manhÃ£ estritamente em jejum absoluto com Ã¡gua, no mÃ­nimo 30 a 60 minutos antes da primeira refeiÃ§Ã£o matinal. Em pacientes idosos de risco ou portadores de doenÃ§a coronariana prÃ©via conhecida, iniciar sempre conservadoramente com dosagens reduzidas de 25 mcg a 50 mcg por via oral diariamente para evitar taquiarritmias e descompensaÃ§Ã£o de isquemia miocÃ¡rdica.`
      }
    ]
  },
  {
    area: 'Gastroenterologia',
    subjects: [
      {
        title: 'Hemorragia Digestiva Alta (HDA)',
        content: `â€¢ EPIDEMIOLOGIA: Responde como uma das principais emergÃªncias gastrointestinais agudas do pronto-socorro, caracterizada por taxa de mortalidade total que gira entre 5% e 14% a despeito de suporte avanÃ§ado. Dividida clinicamente em causa NÃ£o Varicosa (Ãšlcera PÃ©ptica Ativa) e Varicosa (decorrente de HipertensÃ£o Portal).
â€¢ FISIOPATOLOGIA: Na HDA nÃ£o-varicosa, ocorre a erosÃ£o Ã¡cida pÃ©ptica direta com perfuraÃ§Ã£o da integridade da parede vascular da artÃ©ria submucosa decorrente de Helicobacter pylori ou uso crÃ´nico de AINEs. Na HDA varicosa, o aumento drÃ¡stico da pressÃ£o no sistema de drenagem portal sinusoidal decorrente de cirrose induz a circulaÃ§Ã£o colateral esofÃ¡gica compensatÃ³ria com formaÃ§Ã£o de varizes volumosas de paredes extremamente finas que se rompem subitamente sob alta tensÃ£o.
â€¢ DIAGNÃ“STICO: ApresentaÃ§Ã£o clÃ¡ssica de hematÃªmese exuberante (vÃ´mito com sangue vivo ou em borra de cafÃ©) e/ou presenÃ§a de melena (fezes pastosas enegrecidas, viscosas e com odor fÃ©tido caracterÃ­stico de sangue digerido). AvaliaÃ§Ã£o prognÃ³stica imediata pelos escores clÃ­nicos de prognÃ³stico Rockall ou Blatchford. ConfirmaÃ§Ã£o do foco e interrupÃ§Ã£o do sangramento por Endoscopia Digestiva Alta (EDA) diagnÃ³stica e terapÃªutica idealmente nas primeiras 12 a 24 horas.
â€¢ TRATAMENTO: EstabilizaÃ§Ã£o hemodinÃ¢mica prioritÃ¡ria com infusÃ£o rÃ¡pida de cristaloides e reserva de concentrado de hemÃ¡cias se hemoglobina alvo < 7,0-8,0 g/dL. HDA Varicosa presumida: Iniciar imediatamente Vasoconstritor esplÃ¢ncnico direto (Terlipressina 2mg IV a cada OP de 4 horas, ou Octreotide) + Profilaxia de Peritonite Bacteriana EspontÃ¢nea (PBE) com Ceftriaxona 1g IV de 24/24h + Eritromicina 250mg IV se disponÃ­vel para esvaziamento gÃ¡strico. HDA NÃ£o Varicosa: Iniciar Inibidor de Bomba de PrÃ³tons em altas doses (Omeprazol 80mg IV em bolus seguido de infusÃ£o contÃ­nua de 8mg/hora ou 40mg IV 12/12h).`
      },
      {
        title: 'Cirrose: ComplicaÃ§Ãµes',
        content: `â€¢ EPIDEMIOLOGIA: EstÃ¡gio terminal de fibrogenese hepÃ¡tica difusa decorrente de insultos crÃ´nicos recorrentes de Ã¡lcool, hepatite B ou C, esteato-hepatite nÃ£o alcoÃ³lica (MASH), com imensa repercussÃ£o de gastos pÃºblicos e mortalidade secundÃ¡ria Ã  falÃªncia hepÃ¡tica severa.
â€¢ FISIOPATOLOGIA: DestruiÃ§Ã£o do parÃªnquima hepÃ¡tico normal por fibrose lobular nodular e alteraÃ§Ã£o profunda da arquitetura celular, gerando aumento drÃ¡stico da resistÃªncia mecÃ¢nica intra-hepÃ¡tica Ã  vasculatura portal (HipertensÃ£o Portal). ConsequÃªncias fisiolÃ³gicas incluem ascite, encefalopatia metabÃ³lica pelo acÃºmulo de escÃ³rias tÃ³xicas digestivas como a amÃ´nia, e disfunÃ§Ã£o hepÃ¡tica de sÃ­ntese dos fatores da coagulaÃ§Ã£o dependentes e de albumina.
â€¢ DIAGNÃ“STICO: DiagnÃ³stico do quadro clÃ­nico (turgÃªncia de veias da parede abdominal, eritema palmar, ginecomastia, aranhas vasculares, esplenomegalia) amparado por ultrassonografia de abdome, alteraÃ§Ã£o marcante de exames de atividade funcional de sÃ­ntese (RNI alargado, Hipoalbuminemia pronunciada, plaquetopenia de sequestro e transaminases ligeiramente normais/elevadas). Classificar de forma contÃ­nua pelo escore prognÃ³stico de CHILD-PUGH (classes A, B e C) e MELD (Model for End-Stage Liver Disease).
â€¢ TRATAMENTO: Ascite refratÃ¡ria inicial: RestriÃ§Ã£o de sÃ³dio dietÃ©tico a < 2g/dia, associado a regime diurÃ©tico seletivo sequencial com uso de Espironolactona (100mg a 400mg VO / dia) de forma sinÃ©rgica com Furosemida (40mg a 160mg VO / dia) em proporÃ§Ã£o de 100:40 para controle do equilÃ­brio potÃ¡ssico. Encefalopatia HepÃ¡tica: Tratar fatores precipitantes desencadeantes (ITU, hemorragia digestiva alta, hipopotassemia excessiva) e iniciar Lactulona VO em dosagem contÃ­nua para manter de 2 a 3 evacuaÃ§Ãµes de consistÃªncia pastosa ao dia, reduzindo a reabsorÃ§Ã£o de amÃ´nia no cÃ³lon.`
      }
    ]
  },
  {
    area: 'Neurologia',
    subjects: [
      {
        title: 'AVC IsquÃªmico vs HemorrÃ¡gico',
        content: `â€¢ EPIDEMIOLOGIA: O Acidente Vascular Cerebral representa uma das causas lÃ­deres isoladas de mortalidade crÃ´nica e de desenvolvimento de incapacidades fÃ­sicas e cognitivas no paciente adulto brasileiro. Cerca de 85% de todos os episÃ³dios agudos sÃ£o isquÃªmicos (AVCi), enquanto cerca de 15% derivam de rotura traumÃ¡tica/espontÃ¢nea hemorrÃ¡gica (AVCh parenquimatosa ou subaracnoide).
â€¢ FISIOPATOLOGIA: No AVC IsquÃªmico, hÃ¡ interrupÃ§Ã£o abrupta do fluxo sanguÃ­neo arterial de um determinado vaso cerebral devido a oclusÃ£o embÃ³lica (fonte cardÃ­aca por FA ou placas carotÃ­deas estenosantes) ou trombÃ³tica "in situ" por aterosclerose intraparenquimatosa estrutural. No AVC HemorrÃ¡gico, ocorre o sangramento intraparenquimatoso parenquimatoso focal devido Ã  ruptura direta exposta de pequenos ramos perfurantes arteriais fragilizados pela hipertensÃ£o arterial crÃ´nica sustentada (microaneurismas de Charcot-Bouchard).
â€¢ DIAGNÃ“STICO: InstalaÃ§Ã£o sÃºbita, focal e catastrÃ³fica de dÃ©ficits neurolÃ³gicos definidos (hemiparesia de face-braÃ§o-perna, afasia de fala motora ou sensitiva, disartria, tontura rotatÃ³ria severa unilateral, perda visual aguda). Realizar IMEDIATAMENTE Tomografia Computadorizada (TC) de CrÃ¢nio sem contraste de admissÃ£o: O exame serve precipuamente para afastar sangramento evidente de AVC hemorrÃ¡gico agudo (hiperdensidade brilhante inicial), pois os achados de AVC isquÃªmico (hipodensidades) demoram de 12 a 24 horas para se consolidarem no exame.
â€¢ TRATAMENTO: No AVC IsquÃªmico agudo dentro da janela temporal de atÃ© 4,5 horas do inÃ­cio preciso dos sintomas (delta t), realizar TrombÃ³lise QuÃ­mica Intravenosa com Alplase (rtPA) na dose de 0,9 mg/kg (dose mÃ¡xima 90mg, fazendo 10% em bolus e o restante em infusÃ£o contÃ­nua em 1 hora), mantendo a PA rigorosamente monitorada < 185/110 mmHg. Se houver oclusÃ£o proximal de grande artÃ©ria intracraniana, direcionar prioritariamente para Trombectomia MecÃ¢nica endovascular em atÃ© 24 horas. No AVC HemorrÃ¡gico, o foco Ã© o controle extremamente rÃ­gido da PressÃ£o Arterial SistÃ³lica com alvo rÃ¡pido de < 140 mmHg com uso de vasodilatadores venosos potentes como o Nitroprussiato de SÃ³dio.`
      },
      {
        title: 'Delirium no Idoso',
        content: `â€¢ EPIDEMIOLOGIA: ComplicaÃ§Ã£o cognitiva extremamente frequente que acomete de 15% a 50% de todos os idosos internados em enfermarias gerais ou sob cuidados cirÃºrgicos de urgÃªncia, elevando drasticamente o perÃ­odo de ocupaÃ§Ã£o e internaÃ§Ã£o, riscos infecciosos e taxas de mortalidade hospitalar.
â€¢ FISIOPATOLOGIA: SÃ­ndrome neurocomportamental caracteristicamente de inÃ­cio rÃ¡pido, flutuante e agudo decorrente de disfunÃ§Ã£o cerebral orgÃ¢nica difusa funcional. Resulta do estresse oxidativo, neuroinflamaÃ§Ã£o sinÃ¡ptica persistente e desequilÃ­brio abrupto de mÃºltiplos neurotransmissores (reduÃ§Ã£o drÃ¡stica do tÃ´nus colinÃ©rgico central associado a hiperatividade dopaminÃ©rgica compensatÃ³ria) secundÃ¡rios a insultos corporais sistÃªmicos aplicados a cÃ©rebros frÃ¡geis ou com demÃªncia prÃ©-existente.
â€¢ DIAGNÃ“STICO: Baseado estritamente na aplicaÃ§Ã£o prÃ¡tica sistemÃ¡tica do algoritmo CAM (Confusion Assessment Method), necessitando obrigatoriamente do preenchimento de: (1) InÃ­cio agudo e curso flutuante dos sintomas; (2) DÃ©ficit agudo pronunciado de atenÃ§Ã£o fÃ­sica direcionada; associado a pelo menos 1 de: (3) Pensamento desorganizado caÃ³tico ou (4) NÃ­vel alterado flutuante de consciÃªncia (hipervigilante, hipovigilante ou letÃ¡rgico).
â€¢ TRATAMENTO: O pilar insubstituÃ­vel baseia-se na abordagem nÃ£o farmacolÃ³gica proativa atravÃ©s de reorientaÃ§Ã£o contÃ­nua calendarizada dia/noite por familiares competentes, reintroduÃ§Ã£o tempestiva do uso de Ã³culos e aparelhos auditivos funcionais do paciente, preservaÃ§Ã£o rÃ­gida da higiene do padrÃ£o do sono fisiolÃ³gico (iluminaÃ§Ã£o adequada diurna / escuro e silÃªncio noturnos), alÃ©m da mobilizaÃ§Ã£o precoce contÃ­nua. Terapia FarmacolÃ³gica: Reservada estritamente se houver agitaÃ§Ã£o psicomotora violenta que coloque em risco a integridade fÃ­sica do paciente ou da equipe cirÃºrgica geral, empregando doses baixas fracionadas curtas de Haloperidol (0,5mg a 1mg VO ou IM de 12/12h); evitar de forma absoluta o uso de benzodiazepÃ­nicos (risco de piora extrema do quadro cognitivo e sedaÃ§Ã£o prolongada).`
      }
    ]
  },
  {
    area: 'Pneumologia',
    subjects: [
      {
        title: 'Asma BrÃ´nquica: Crise Aguda',
        content: `â€¢ EPIDEMIOLOGIA: A exacerbaÃ§Ã£o aguda da asma brÃ´nquica atinge milhÃµes de crianÃ§as e adultos anualmente, gerando elevadÃ­ssima taxa de internaÃ§Ã£o hospitalar passÃ­vel de prevenÃ§Ã£o. A morte por asma na crise aguda pode ocorrer rapidamente por cansaÃ§o muscular diafragmÃ¡tico progressivo.
â€¢ FISIOPATOLOGIA: Processo inflamatÃ³rio brÃ´nquico agudo exuberante hiperreativo exacerbado mediado por vias de hipersensibilidade de tipo 2 (eosinÃ³filos, mastÃ³citos e IgE) desencadeado por fatores ambientais ou infecÃ§Ãµes virais intercorrentes. Isso induz edema grave da mucosa da parede brÃ´nquica profunda, contraÃ§Ã£o espÃ¡stica reflexa das bandas musculares lisas circulantes e hipersecreÃ§Ã£o crÃ´nica estenosante de muco extremamente adesivo, gerando obstruÃ§Ã£o grave difusa do fluxo aÃ©reo expiratÃ³rio.
â€¢ DIAGNÃ“STICO: Consiste na presenÃ§a rÃ¡pida de dispneia intensa de repouso, tosse seca incÃ´moda, expiraÃ§Ã£o muito prolongada e presenÃ§a de sibilos difusos polifÃ´nicos Ã  auscultaÃ§Ã£o pulmonar. Sinais ClÃ­nicos CrÃ­ticos de CansaÃ§o Muscular / Instabilidade: Fraca movimentaÃ§Ã£o torÃ¡cica residual ("tÃ³rax silencioso" por extrema restriÃ§Ã£o do fluxo de ar), incapacidade absoluta de completar frases curtas, respiraÃ§Ã£o paradoxal assincrÃ´nica abdominal, frequÃªncia cardÃ­aca > 120 bpm e saturaÃ§Ã£o de O2 perifÃ©rica cronicamente < 90% em ar ambiente.
â€¢ TRATAMENTO: O pilar imediato Ã© composto por broncodilatadores beta-2-agonistas de curta duraÃ§Ã£o em inalaÃ§Ã£o repetida (Salbutamol 100mcg/jato, aplicando de 4 a 10 jatos por meio de espaÃ§ador a cada 20 minutos na primeira 1 hora) associado sistematicamente a corticosteroides com atividade sistÃªmica (Prednisona 40mg VO ou Metilprednisolona 40-125mg IV na admissÃ£o). Em crises consideradas moderadas a graves de repouso, adicionar precocemente Brometo de IpratrÃ³pio (anticolinÃ©rgico inalatÃ³rio) para bloqueio broncoespÃ¡stico adicional. Se refratariedade inicial de conduta, prescrever infusÃ£o venosa de Sulfato de MagnÃ©sio 2g IV correndo lento em 20 minutos.`
      },
      {
        title: 'Tromboembolismo Pulmonar (TEP)',
        content: `â€¢ EPIDEMIOLOGIA: O TEP representa a terceira causa clÃ­nica mais frequente de mortalidade de origem cardiovascular aguda, ficando posicionado atrÃ¡s apenas do Infarto Agudo do MiocÃ¡rdio e do Acidente Vascular Cerebral. Possui forte associaÃ§Ã£o estabelecida com cirurgias maiores recentes, hospitalizaÃ§Ã£o psiquiÃ¡trica prolongada por perÃ­odos de imobilizaÃ§Ã£o e neoplasia oculta/ativa concomitante.
â€¢ FISIOPATOLOGIA: FormaÃ§Ã£o inicial e migraÃ§Ã£o mecÃ¢nica direta de um trombo venoso do sistema vascular profundo (Trombose Venosa Profunda - TVP localizada usualmente nas veias poplÃ­teas ou coxais proximais dos membros inferiores) que transita pela circulaÃ§Ã£o sistÃªmica e ocluÃ­ repentinamente ramos arteriais do leito pulmonar vascular. Isso causa disfunÃ§Ã£o imediata de barreira por aumento drÃ¡stico e retrÃ³grado da pÃ³s-carga do VentrÃ­culo Direito (VD), isquemia subendocÃ¡rdica do VD e colapso pressÃ³rico final.
â€¢ DIAGNÃ“STICO: ClÃ­nica caracterizada por instalaÃ§Ã£o sÃºbita e inexplicada de dispneia intensa acompanhada de dor torÃ¡cica tipo pleurÃ­tica aguda de inÃ­cio rÃ¡pido, taquipneia sustentada, taquicardia persistente e episÃ³dios de sÃ­ncope. Aplicar sistematicamente o Escore de Wells para classificar a probabilidade clÃ­nica antes do teste: Se suspeito de Baixa Probabilidade, dosar o D-DÃ­mero sÃ©rico quantitativo (exclui se normal < 500 ng/mL). Se Alta Probabilidade de base, direcionar diretamente para Angiotomografia Computadorizada (Angio-TC) de TÃ³rax contrastada (padrÃ£o-ouro confirmatÃ³rio).
â€¢ TRATAMENTO: Conduta baseada na estratificaÃ§Ã£o hemodinÃ¢mica: TEP EstÃ¡vel (NÃ£o MaciÃ§o): AnticoagulaÃ§Ã£o plena imediata com heparina de baixo peso molecular (Enoxaparina 1mg/kg por via SubcutÃ¢nea a cada 12 horas) ou uso de anticoagulantes orais de aÃ§Ã£o direta tipo DOAC (Rivaroxabana 15mg VO de 12/12h por 21 dias). TEP InstÃ¡vel (MaciÃ§o / Choque Obstrutivo com PAS < 90 mmHg sustentada): Fazer trombÃ³lise quÃ­mica sistÃªmica de urgÃªncia rÃ¡pida com Alteplase de ataque (100mg IV correndo continuamente no perÃ­odo de 2 horas) para reperfusÃ£o mecÃ¢nica vascular emergencial.`
      }
    ]
  },
  {
    area: 'Nefrologia',
    subjects: [
      {
        title: 'DistÃºrbios do PotÃ¡ssio',
        content: `â€¢ EPIDEMIOLOGIA: A hipercalemia representa um distÃºrbio metabÃ³lico frequente na emergÃªncia que ameaÃ§a a integridade miocÃ¡rdica de forma iminente, acometendo principalmente portadores de DoenÃ§a Renal CrÃ´nica (DRC) em uso concomitante de IECA, BRA ou poupadores de potÃ¡ssio.
â€¢ FISIOPATOLOGIA: AlteraÃ§Ãµes na homeostase de excreÃ§Ã£o celular de PotÃ¡ssio alteram de forma perigosa o potencial elÃ©trico de aÃ§Ã£o de membrana das cÃ©lulas do sistema de conduÃ§Ã£o elÃ©trica miocÃ¡rdica de repouso, podendo propiciar taquiarritmias graves e parada cardiorrespiratÃ³ria abrupta em sÃ­stole diastÃ³lica.
â€¢ DIAGNÃ“STICO: Classificado como Hiperpotassemia se PotÃ¡ssio sÃ©rico (K+) > 5,5 mEq/L e Hipopotassemia se < 3,5 mEq/L. Achados de ECG ClÃ­nicos na Hiperpotassemia (EmergÃªncia): Ondas T simÃ©tricas, pontiagudas e "em tenda" (K > 5,5 mEq/L) evoluindo sequencialmente para achatamento agudo de onda P com prolongamento PR, alargamento do complexo QRS (K > 6,5 mEq/L), padrÃ£o ondulatÃ³rio sinusoidal final caracterÃ­stico e PCR se K > 7,5-8,0 mEq/L.
â€¢ TRATAMENTO: Tratamento imediato de Hiperpotassemia com alteraÃ§Ãµes no ECG de admissÃ£o: (1) EstabilizaÃ§Ã£o de membrana miocÃ¡rdica IMEDIATA com Gluconato de CÃ¡lcio 10% na dose de 10ml (1 ampola) por via intravenosa administrado lento em 3-5 minutos (pode repetir em 10 minutos se padrÃ£o de ECG persistir); (2) Terapia de desvio transcelular rÃ¡pido (Glicoinsulina: 10 UI de insulina rÃ¡pida diluÃ­da em 100ml de Glicose 50% correndo IV em 20 minutos; inalaÃ§Ã£o com Salbutamol 10-20 jatos); (3) Terapia de eliminaÃ§Ã£o real do Ã­on: Poliestirenossulfonato de CÃ¡lcio (Sorcal) 30g VO de 8/8h e/ou Furosemida 40mg IV.`
      },
      {
        title: 'DoenÃ§a Renal CrÃ´nica (DRC)',
        content: `â€¢ EPIDEMIOLOGIA: DistÃºrbio epidemiolÃ³gico crÃ´nico de forte impacto global que acomete cerca de 10% da populaÃ§Ã£o adulta total, apresentando Ã­ntima relaÃ§Ã£o patogÃªnica causal com a Diabetes Mellitus crÃ´nica mal controlada e a HipertensÃ£o Arterial de longa data.
â€¢ FISIOPATOLOGIA: Perda paulatina, progressiva, prolongada e irreversÃ­vel da densidade de nÃ©frons funcionais em decorrÃªncia de esclerose capilar glomerular e fibrose tubular intersticial crÃ´nica cicatricial. Isso acarreta retenÃ§Ã£o acumulada progressiva de toxinas urÃªmicas nitrogenadas, distÃºrbios de retenÃ§Ã£o Ã¡cida/bicarbonato, expansÃ£o volÃªmica hÃ­drica por perda de capacidade dialÃ­tica de ultrafiltraÃ§Ã£o, anemia hipoproliferativa por dÃ©ficit grave de sÃ­ntese de eritropoietina e alteraÃ§Ãµes Ã³steo-minerais patolÃ³gicas.
â€¢ DIAGNÃ“STICO: EvidÃªncia inabalÃ¡vel estabelecida de taxa de filtraÃ§Ã£o glomerular (TFG estimada pelo escore CKD-EPI) persistentemente < 60 mL/min/1,73mÂ² ou marcadores estabelecidos e confirmados de integridade estrutural e funcional renal prejudicada de base (como AlbuminÃºria sustentada > 30 mg/24 horas) por um perÃ­odo temporal contÃ­nuo superior a 3 meses consecutivos. Classificar pelos estÃ¡gios padrÃ£o do consenso KDIGO.
â€¢ TRATAMENTO: O manejo bÃ¡sico consiste no bloqueio absoluto proativo da velocidade de perda funcional progressiva atravÃ©s do uso de agentes nefroprotetores do eixo renal: Inibidores do Sistema RAA (IECA ou BRA titulados atÃ© dose mÃ¡xima tolerÃ¡vel) associados de forma sinÃ©rgica a inibidores do co-transportador SGLT2 (Dapagliflozina ou Empagliflozina) para controle da hiperfiltraÃ§Ã£o fisiolÃ³gica residual. Controle rÃ­gido da anemia de base com reposiÃ§Ã£o de eritropoietina humana recombinante, reposiÃ§Ã£o oral de Bicarbonato de SÃ³dio para manutenÃ§Ã£o sÃ©rica > 22 mEq/L e abordagem firme do distÃºrbio mineral com quelantes intestinais de fÃ³sforo.`
      }
    ]
  },
  {
    area: 'Reumatologia',
    subjects: [
      {
        title: 'LÃºpus Eritematoso SistÃªmico (LES)',
        content: `â€¢ EPIDEMIOLOGIA: DoenÃ§a inflamatÃ³ria sistÃªmica crÃ´nica autoimune de etiologia multifatorial que acomete em ampla preferÃªncia clÃ­nica mulheres jovens em idade fÃ©rtil reprodutiva na dramÃ¡tica proporÃ§Ã£o de cerca de 9:1 em relaÃ§Ã£o aos homens, preferindo negras e latinas.
â€¢ FISIOPATOLOGIA: Caracteriza-se por uma perda acentuada da autotolerÃ¢ncia imunolÃ³gica das cÃ©lulas B e T com sÃ­ntese hiperativa e desregulada de mÃºltiplos autoanticorpos dirigidos contra antÃ­genos nucleares teciduais. Isso resulta na deposiÃ§Ã£o maciÃ§a generalizada de complexos imunes circulantes (como os complexos DNA-Anti-DNA) na parede de pequenos vasos e tecidos em diversos Ã³rgÃ£os (rins, articulaÃ§Ãµes, pele), gerando vasculite inflamatÃ³ria local e ativaÃ§Ã£o exuberante da cascata do sistema complemento.
â€¢ DIAGNÃ“STICO: AplicaÃ§Ã£o sistemÃ¡tica dos critÃ©rios consorciados de classificaÃ§Ã£o EULAR/ACR 2019. CritÃ©rio de Entrada ObrigatÃ³rio: TÃ­tulo de FAN (Fator Antinuclear) â‰¥ 1:80 em imunofluorescÃªncia indireta sobre cÃ©lulas Hep-2. Avaliar de forma continuada domÃ­nios clÃ­nicos ponderados por escores (como rash malar inflamatÃ³rio em borboleta de face, fotossensibilidade, perda de cabelo difusa alopecia, artrite nÃ£o erosiva de duas juntas, nefrite lÃºpica com proteinÃºria comprovada por biÃ³psia, derrame pleural, plaquetopenia autoimune) e dados imunolÃ³gicos (hipocomplementemia de C3 e C4 sÃ©ricos, presenÃ§a de Anti-dsDNA altamente especÃ­fico ou Anti-Sm).
â€¢ TRATAMENTO: Prescrever de forma obrigatÃ³ria universal para todo paciente lÃºpico ativo sem contraindicaÃ§Ãµes formais o Sulfato de Hidroxicloroquina (antimalÃ¡rico imunomodulador bÃ¡sico de manutenÃ§Ã£o) na dosagem estrita e segura de atÃ© 5 mg/kg do peso ideal/dia. O fÃ¡rmaco previne de forma primÃ¡ria e secundÃ¡ria novos surtos de ativaÃ§Ã£o grave orgÃ¢nica e reduz sensivelmente a progressÃ£o da nefrite, aumentando a expectativa de vida global. Crises agudas leves ou moderadas: Prednisona oral de dose baixa para desmame rÃ¡pido. Surtos de nefrite lÃºpica com proteinÃºria maciÃ§a ou sintomas de SNC agudos de base: Pulsoterapia com Metilprednisolona venosa imediata por 3 dias seguido de imunossupressÃ£o planejada com Micofenolato de Mofetila.`
      },
      {
        title: 'Artrite Reumatoide',
        content: `â€¢ EPIDEMIOLOGIA: PrevalÃªncia aproximada de 1,0% da populaÃ§Ã£o adulta mundial total, ocorrendo principalmente em mulheres na faixa etÃ¡ria produtiva situada entre 30 e 50 anos de idade cronolÃ³gica.
â€¢ FISIOPATOLOGIA: Processo autoimune linfocÃ­tico crÃ´nico difuso direcionado ao tecido sinovial das articulaÃ§Ãµes diartrodiais. Resulta na proliferaÃ§Ã£o exsudativa inflamatÃ³ria do tecido sinovial (denominado crescimento de "Pannus"), que invade de forma invasiva osteoclastos e condrÃ³citos circundantes, gerando erosÃ£o Ã³ssea articular marginal, destruiÃ§Ã£o irreversible da cartilagem local e deformidades graves de articulaÃ§Ã£o.
â€¢ DIAGNÃ“STICO: Caracterizado por quadro clÃ­nico de duraÃ§Ã£o crÃ´nica (> 6 semanas) consistente com poliartrite aditiva simÃ©trica inflamatÃ³ria dolorosa de pequenas articulaÃ§Ãµes bilaterais perifÃ©ricas (carpo, metacarpofalÃ¢ngicas e interfalÃ¢ngicas proximais preservando distais), que cursa tipicamente com rigidez articular matinal prolongada que melhora apÃ³s longo perÃ­odo de movimento diÃ¡rio (> 1 hora). DiagnÃ³stico definitivo amparado por sorologia marcadora de especificidade: Fator Reumatoide (FR) e Anticorpo anti-peptÃ­deo citrulinado cÃ­clico (Anti-CCP) associado a PCR/VHS muito alterados e erosÃµes marginais tÃ­picas visualizadas em Rx.
â€¢ TRATAMENTO: O tratamento ideal deve ser planejado e iniciado de forma imediata o mais precoce possÃ­vel (janela de oportunidade terapÃªutica de atÃ© 3 meses pÃ³s-inÃ­cio) visando a remissÃ£o sustentada ("Treat-to-Target"). Medicamento Modificador de Curso da DoenÃ§a (MMCD) convencional de primeira linha de escolha: Metotrexato (MTX) iniciado por via oral ou subcutÃ¢neo em dosagem semanal de 10mg a 15mg tomada de forma Ãºnica em 1 sÃ³ dia da semana (titula progressivamente atÃ© 25mg/semana). Associar obrigatoriamente Ãcido FÃ³lico (5mg VO administrado rigorosamente 24-48 horas apÃ³s a ingestÃ£o isolada semanal do Metotrexato) para bloquear efeitos de toxicidade mielossupressora e estomatite.`
      },
      {
        title: 'Gota (Artrite Gotosa)',
        content: `â€¢ EPIDEMIOLOGIA: A causa mais prevalente de artrite inflamatÃ³ria invasiva dolorosa em homens adultos acima dos 40 anos, exibindo nÃ­tida associaÃ§Ã£o com a vigÃªncia de distÃºrbios lipÃ­dicos, obesidade androide visceral e SÃ­ndrome MetabÃ³lica sistÃªmica de base.
â€¢ FISIOPATOLOGIA: DistÃºrbio metabÃ³lico crÃ´nico da via de eliminaÃ§Ã£o ou hiperproduÃ§Ã£o de purinas induzindo Hiperuricemia crÃ´nica persistente (nÃ­veis de Ã¡cido Ãºrico sÃ©rico > 6,8-7,0 mg/dL). Ao atingir o limite fÃ­sico de saturaÃ§Ã£o do fluido sinovial articular, formam-se depÃ³sitos e precipitados locais de microcristais de Urato MonossÃ³dico (UMS). A liberaÃ§Ã£o sÃºbita desses cristais para dentro do espaÃ§o articular livre ativa o inflamassoma NLRP3 e atrai leucÃ³citos, desencadeando crise exsudativa extremamente fustigante.
â€¢ DIAGNÃ“STICO: ApresentaÃ§Ã£o marcante clÃ¡ssica de monoartrite aguda extremamente dolorosa com hiperemia local, calor, edema exuberante e incapacidade profunda de marcha ao redor do apoio podal de instalaÃ§Ã£o rÃ¡pida noturna, acometendo classicamente a primeira articulaÃ§Ã£o metatarsofalÃ¢ngica articulante do pÃ© (conhecido pelo epÃ´nimo de "Podagra"). O diagnÃ³stico definitivo inequÃ­voco baseia-se na constataÃ§Ã£o de microcristais de Urato MonossÃ³dico em agulha e com birrefringÃªncia fortemente negativa ao estudo microscÃ³pico com luz polarizada de amostra de lÃ­quido sinovial aspirado por punÃ§Ã£o.
â€¢ TRATAMENTO: Terapia escalonada estrita por fases clÃ­nicas: (1) Manejo emergencial imediato da crise de artrite dolorosa gota: Iniciar AINEs em dosagens mÃ¡ximas toleradas (como Indometacina, Naproxeno) associados simultaneamente a doses baixas fracionadas e controladas de Colchicina (0,5mg VO de 8/8h ou atÃ© alÃ­vio, sem exceder doses diÃ¡rias seguras). Evitar corticoide sistÃªmico se nÃ£o houver refratariedade. NÃ£o iniciar ou suspender de forma brusca o Alopurinol na vigÃªncia da crise em si para evitar mobilizaÃ§Ã£o do urato sinovial e prolongamento dos sintomas agudos. (2) Profilaxia contÃ­nua e reduÃ§Ã£o de urato apÃ³s resoluÃ§Ã£o completa da crise inflamatÃ³ria: Iniciar terapia de base hipouricemiante com uso continuado de Alopurinol (titulado a partir of 100mg/dia VO) objetivando patamar alvo de Ã¡cido Ãºrico sÃ©rico < 6,0 mg/dL.`
      }
    ]
  },
  {
    area: 'Hematologia',
    subjects: [
      {
        title: 'Anemias MicrocÃ­ticas',
        content: `â€¢ EPIDEMIOLOGIA: A Anemia Ferropriva representa as maiores deficiÃªncias nutricionais e de composiÃ§Ã£o na infÃ¢ncia e em mulheres adultas fÃ©rteis no mundo todo. O seu rastreamento Ã© essencial em queixas crÃ´nicas de fadiga inexplicada e cansaÃ§o.
â€¢ FISIOPATOLOGIA: Ocorre dÃ©ficit na produÃ§Ã£o de hemoglobina intracelular decorrente de 3 etiologias de base comuns: (1) DepleÃ§Ã£o crÃ´nica profunda das reservas corporais essenciais de ferro celular (Anemia Ferropriva); (2) Sequestro indevido e inibiÃ§Ã£o da ferroportina macrofÃ¡gica induzida por nÃ­veis elevados de hepcidina inflamatÃ³ria na vigÃªncia de doenÃ§as reumatolÃ³gicas, neoplÃ¡sicas ou infecciosas subclÃ­nicas (Anemia de DoenÃ§a CrÃ´nica); (3) Defeito hereditÃ¡rio genÃ©tico de sÃ­ntese das cadeias normais de globina Î± ou Î² (Talassemia Major/Minor).
â€¢ DIAGNÃ“STICO: Hemograma indicando anemia hipocrÃ´mica microcÃ­tica (VCM < 80 fL, CHCM < 32 g/dL) associada Ã  anÃ¡lise bioquÃ­mica de ferro. Perfil de Ferro tÃ­pico na Anemia Ferropriva: Ferritina sÃ©rica de admissÃ£o francamente depletada (< 15-30 ng/mL - melhor marcador isolado), ferro sÃ©rico baixo e Capacidade Total de LigaÃ§Ã£o do Ferro (TIBC) compensatoriamente alta. Na anemia de doenÃ§a crÃ´nica, as reservas celulares de Ferritina encontram-se normais ou significativamente elevadas, com ferro sÃ©rico depletado por sequestro.
â€¢ TRATAMENTO: Na Anemia Ferropriva comprovada: Prescrever de forma adequada e prolongada Sulfato Ferroso oral na dosagem terapÃªutica calibrada correspondente a 120mg a 200mg de ferro elementar por dia para adultos em regime fracionado, administrado idealmente acompanhado de ambiente Ã¡cido ou vitamina C para absorÃ§Ã£o, no perÃ­odo de 3 a 6 meses apÃ³s a normalizaÃ§Ã£o total do hemograma para reabastecer as reservas basais celulares de depÃ³sitos do organismo.`
      },
      {
        title: 'Neutropenia Febril',
        content: `â€¢ EPIDEMIOLOGIA: EmergÃªncia oncolÃ³gica / hematolÃ³gica de altÃ­ssimo risco e extrema urgÃªncia que ocorre tipicamente pÃ³s-tratamento de quimioterapia para neoplasias sÃ³lidas ou hematolÃ³gicas, apresentando uma taxa bruta de mortalidade alarmante de atÃ© 30% nas primeiras horas se a antibioticoterapia empÃ­rica direcionada for indevidamente protelada.
â€¢ FISIOPATOLOGIA: Ocorre destruiÃ§Ã£o iatrogÃªnica transitÃ³ria do nicho maduro de precursores celulares neutrofÃ­licos na medula Ã³ssea. Sem barreiras de defesa celular fagocÃ­tica na mucosa do trato gastrointestinal inferior por inflamaÃ§Ã£o quimioterÃ¡pica (muco-exsudativa), ocorre rÃ¡pida e massiva translocaÃ§Ã£o bacteriana enteral de patÃ³genos (como Pseudomonas aeruginosa de grande potencial destrutivo vascular imediato) diretamente para a corrente sanguÃ­nea, induzindo sepse hiperaguda fulminante.
â€¢ DIAGNÃ“STICO: DefiniÃ§Ã£o estabelecida pela contagem absoluta de neutrÃ³filos perifÃ©ricos (ANC) < 500 cÃ©lulas/mmÂ³ (ou expectativa inequÃ­voca de queda rÃ¡pida para patamar < 500 nas prÃ³ximas 48 horas) associada a uma Ãºnica medida de temperatura aferida em cavidade oral â‰¥ 38,3ÂºC ou temperatura sustentada â‰¥ 38,0ÂºC por pelo menos 1 hora clÃ­nica sob aferiÃ§Ã£o fidedigna.
â€¢ TRATAMENTO: NÃƒO POSTERGAR Antibioticoterapia empÃ­rica imediata direcionada por via endovenosa na "Hora de Ouro" (idealmente atÃ© 60 minutos do surgimento aferido da febre na triagem). Esquema prioritÃ¡rio de largo espectro com cobertura de Pseudomonas: Escolher preferencialmente o uso de Î²-lactÃ¢mico antipseudomonas como Cefepime 2g IV correndo de 8/8h em adultos, ou Piperacilina/Tazobactam 4,5g IV correndo de 6/6h. Adicionar Vancomicina empÃ­rica se houver instabilidade hemodinÃ¢mica, infecÃ§Ã£o Ã³bvia de pele ou suspeita inequÃ­voca de infecÃ§Ã£o em cateter central.`
      }
    ]
  },
  {
    area: 'Ginecologia (Medicina Interna)',
    subjects: [
      {
        title: 'Vaginites e Vaginose',
        content: `â€¢ EPIDEMIOLOGIA: Representa um dos principais e mais corriqueiros motivos clÃ­nicos de agendamento de consulta ginecolÃ³gica e de atenÃ§Ã£o primÃ¡ria no Brasil, ocorrendo em cerca de 40% de mulheres em idade reprodutiva ativa.
â€¢ FISIOPATOLOGIA: ModificaÃ§Ãµes e desequilÃ­brios na constituiÃ§Ã£o populacional da flora bacteriana protetiva vaginal de DÃ¶derlein normais (Lactobacillus acidophilus que metabolizam glicogÃªnio e preservam o pH vaginal Ã¡cido < 4,5). O declÃ­nio desses bacilos expÃµe o nicho biolÃ³gico para colonizaÃ§Ã£o hiperativa de anaerÃ³bios microscÃ³picos (como a Gardnerella vaginalis, causadora da Vaginose Bacteriana) ou proliferaÃ§Ã£o local saprÃ³fita de fungos sob condiÃ§Ãµes favorÃ¡veis (como a Candida albicans).
â€¢ DIAGNÃ“STICO: Baseia-se no exame ginecorretal com espÃ©culo e na aplicaÃ§Ã£o detalhada dos CritÃ©rios de Amsel para Vaginose Bacteriana: (1) PresenÃ§a de corrimento homogÃªneo acinzetado flutuante; (2) pH do fluido vaginal nitidamente bÃ¡sico/alcalino > 4,5; (3) Teste das aminas exalando odor de peixe podre positivo ao gotejamento de KOH a 10% (Whiff Test); (4) PresenÃ§a marcante de CÃ©lulas-Alvo epiteliais de descamaÃ§Ã£o repletas de bactÃ©rias aderidas (Clue Cells) ao exame microscÃ³pico microscÃ³pico. Na CandidÃ­ase, o corrimento Ã© caracterÃ­stico em nata de leite grumoso, espesso e inodoro, cursando com pH Ã¡cido (< 4,5).
â€¢ TRATAMENTO: Vaginose Bacteriana: Prescrever Metronidazol na dose de 500mg por via oral de 12/12h durante o perÃ­odo de 7 dias inteiros consecutivos, orientando a abstinÃªncia rÃ­gida de Ã¡lcool (Efeito Antabuse / Dissulfiram-like). CandidÃ­ase Vulvovaginal: Prescrever Fluconazol na dose de 150mg VO tomado em dose Ãºnica ou aplicaÃ§Ã£o local tÃ³pica profunda de creme de Miconazol nitrato vaginal de 7 a 14 dias diÃ¡rios.`
      },
      {
        title: 'DoenÃ§a InflamatÃ³ria PÃ©lvica (DIP)',
        content: `â€¢ EPIDEMIOLOGIA: InfecÃ§Ã£o comum grave e insidiosa de causa ascendente de grande impacto reprodutivo que atinge preferencialmente adolescentes jovens em atividade sexual exuberante ou portadoras de histÃ³rico anterior de infecÃ§Ãµes transmissÃ­veis de repetiÃ§Ã£o.
â€¢ FISIOPATOLOGIA: AscensÃ£o mecÃ¢nica retrÃ³gada e disseminaÃ§Ã£o progressiva de microrganismos patogÃªnicos infecciosos bacterianos sexuais (infectando prioritariamente Neisseria gonorrhoeae e Chlamydia trachomatis) que transgridem a mucosa do colo do Ãºtero e progridem pelo canal endometrial, atingindo e destruindo as trompas de FalÃ³pio, tecido ovariano interno e o peritÃ´nio pÃ©lvico circundante, podendo ocasionar peritonite, abscessos pÃ©lvicos e infertilidade por cicatrizes tubÃ¡rias obstrutivas.
â€¢ DIAGNÃ“STICO: Consiste no preenchimento clÃ­nico de pelo menos 3 critÃ©rios maiores essenciais de base: (1) Dor espontÃ¢nea abdominal em quadrante inferior pÃ©lvico difuso; (2) Dor intensa e limitante Ã  mobilizaÃ§Ã£o fÃ­sica firme do colo do Ãºtero ao toque vaginal bidirecional; (3) Dor nÃ­tida Ã  palpaÃ§Ã£o profunda anexial bilateral de trompas/ovÃ¡rios. PresenÃ§a de critÃ©rios menores corroboradores de diagnÃ³stico: ConteÃºdo anormal purulento flutuante no canal, febre (> 38,0ÂºC) de inÃ­cio recente e leucocitose.
â€¢ TRATAMENTO: Regime de Conduta Ambulatorial Consensual (DIP Leve / Moderada Grau 1): Administrar dose Ãºnica intramuscular profunda de Ceftriaxona 500mg IM para esterilizaÃ§Ã£o de Gonococo, associada simultaneamente a Doxiciclina de amplo espectro na dose de 100mg VO de 12/12h por 14 dias inteiros + Metronidazol 500mg VO de 12/12h por 14 dias consecutivos para cobertura anaerÃ³bia. Encaminhar para internaÃ§Ã£o e tratamento venoso se houver instabilidade hemodinÃ¢mica, nÃ¡useas/vÃ´mitos incoercÃ­veis impossibilitando terapia oral ou suspeita de Abscesso Tubo-ovariano estabelecido.`
      }
    ]
  },
  {
    area: 'Dermatologia ClÃ­nica',
    subjects: [
      {
        title: 'Farmacodermias Graves',
        content: `â€¢ EPIDEMIOLOGIA: ReaÃ§Ãµes cutÃ¢neas adversas a medicamentos raras, mas catastrÃ³ficas, que compreendem a SÃ­ndrome de Stevens-Johnson (SSJ), NecrÃ³lise EpidÃ©rmica TÃ³xica (NET) e ReaÃ§Ã£o a Drogas com Eosinofilia e Sintomas SistÃªmicos (DRESS), apresentando mortalidade hospitalar intercorrente que flutua entre 10% e 40%.
â€¢ FISIOPATOLOGIA: Na SSJ e NET, ocorre hipersensibilidade tardia imuno-mediada do tipo IVc com liberaÃ§Ã£o exuberante de linfÃ³citos T citotÃ³xicos e citocinas destruidoras (como a Granulisina) que induzem a apoptose maciÃ§a de queratinÃ³citos basais epidÃ©rmicos, provocando o descolamento dermoepidÃ©rmico em grande extensÃ£o cutÃ¢nea.
â€¢ DIAGNÃ“STICO: Classificado pela extensÃ£o acometida de descolamento de pele por Ã¡rea de superfÃ­cie corporal (SSJ < 10%; sobreposicÃ£o SSJ/NET 10-30%; NET > 30% da Ã¡rea). PresenÃ§a de Sinal de Nikolsky positivo (fÃ¡cil descolamento de pele saudÃ¡vel adjacente Ã  fricÃ§Ã£o lateral). Na sÃ­ndrome DRESS, verifica-se a trÃ­ade diagnÃ³stica: erupÃ§Ã£o cutÃ¢nea difusa pruriginosa + linfadenopatia inflamatÃ³ria em mÃºltiplas cadeias + eosinofilia perifÃ©rica acentuada com acometimento funcional de Ã³rgÃ£os como miosite ou hepatite severa.
â€¢ TRATAMENTO: InterrupÃ§Ã£o imediata absoluta de todo e qualquer medicamento nÃ£o essencial em uso recente. Encaminhar pacientemente o portador de SSJ/NET grave com perda abundante de pele para Unidade de Tratamento de Queimados (UTQ) ou UTI especializada, mantendo rÃ­gido isolamento protetor, controle fisiolÃ³gico tÃ©rmico ideal, reposiÃ§Ã£o hidroeletrolÃ­tica calculada meticulosa com fluidos aquecidos e suporte nutricional por sonda enteral precoce.`
      },
      {
        title: 'Escabiose',
        content: `â€¢ EPIDEMIOLOGIA: InfestaÃ§Ã£o cutÃ¢nea parasitÃ¡ria altamente contagiosa e amplamente disseminada que atinge pessoas de todas as faixas etÃ¡rias e classes sociais, ocorrendo principalmente em ambientes de aglomeraÃ§Ã£o como creches, asilos e quartÃ©is.
â€¢ FISIOPATOLOGIA: Causada pelo Ã¡caro parasita Sarcoptes scabiei var. hominis. A fÃªmea fertilizada escava tÃºneis no estrato cÃ³rneo da epiderme para depositar seus ovos e fezes, o que desencadeia uma intensa reaÃ§Ã£o de hipersensibilidade tardia do hospedeiro, mediada por anticorpos e cÃ©lulas T, resultando em prurido de alta intensidade.
â€¢ DIAGNÃ“STICO: Baseia-se em achados clÃ­nicos consistentes em prurido com exacerbaÃ§Ã£o noturna intensa, lesÃµes papuloverrucosas e pequenos sulcos lineares (tÃºneis) localizados tipicamente em dobras cutÃ¢neas relevantes (espaÃ§os interdigitais das mÃ£os, punhos, axilas, arÃ©olas, regiÃ£o umbilical e genitÃ¡lia masculina). ConfirmaÃ§Ã£o opcional pela pesquisa direta do Ã¡caro ao exame microscÃ³pico de raspado cutÃ¢neo das lesÃµes.
â€¢ TRATAMENTO: Prescrever Permetrina 5% em creme de uso tÃ³pico em todo o corpo, do pescoÃ§o para baixo, deixando agir por 8 a 12 horas e enxaguando em seguida. Recomenda-se repetir a aplicaÃ§Ã£o apÃ³s 7 dias para erradicar Ã¡caros recÃ©m-eclodidos dos ovos persistentes. Alternativa oral: Ivermectina 200 mcg/kg VO em dose Ãºnica, repetida apÃ³s uma semana. Tratar rigorosamente todos os contatos domiciliares simultaneamente e lavar pertences em Ã¡gua quente.`
      }
    ]
  },
  {
    area: 'Pediatria e HidrataÃ§Ã£o',
    subjects: [
      {
        title: 'Planos de HidrataÃ§Ã£o (Plano A, B e C)',
        content: `â€¢ PLANO A (Tratamento Domiciliar): Indicado para crianÃ§as com diarreia aguda sem sinais de desidrataÃ§Ã£o. Consiste em aumentar a oferta de lÃ­quidos (Ã¡gua, soro caseiro ou SRO apÃ³s cada evacuaÃ§Ã£o lÃ­quida: < 2 anos: 50 a 100 mL; â‰¥ 2 anos: 100 a 200 mL), manter a alimentaÃ§Ã£o habitual habitual e orientar detalhadamente a famÃ­lia sobre sinais de alerta para retorno imediato imediato.
â€¢ PLANO B (ReidrataÃ§Ã£o Oral supervisionada na Unidade de SaÃºde): Indicado para desidrataÃ§Ã£o leve a moderada. Administrar SRO na dosagem de 50 a 100 mL/kg ao longo de um perÃ­odo de 4 a 6 horas em colheradas frequentes. Reavaliar continuamente; se houver melhora, passar para o Plano A.
â€¢ PLANO C (ReidrataÃ§Ã£o Intravenosa RÃ¡pida): Indicado para desidrataÃ§Ã£o grave ou choque hipovolÃªmico. Fase de ExpansÃ£o PediÃ¡trica: Infundir Soro FisiolÃ³gico (SF) 0,9% na dose de 20 mL/kg por via endovenosa correndo rÃ¡pido (repetir atÃ© reversÃ£o do choque). Fase de ManutenÃ§Ã£o Segura subsequente baseada na regra clÃ¡ssica de Holliday-Segar: 100 mL/kg para os primeiros 10 kg, mais 50 mL/kg para os prÃ³ximos 10 kg, e mais 20 mL/kg adicionais para cada kg subsequente acima de 20 kg.`
      },
      {
        title: 'DesnutriÃ§Ã£o e Choque',
        content: `â€¢ MANEJO: Cautela hemodinÃ¢mica EXTREMA ao planejar hidrataÃ§Ã£o venosa ou expansor volÃªmico rÃ¡pido em pacientes com diagnÃ³stico de desnutriÃ§Ã£o grave crÃ´nica (portadores de quadros clÃ­nicos de Marasmo ou Kwashiorkor). Esses pacientes apresentam atrofia miocÃ¡rdica de espessura de parede associada a disfunÃ§Ã£o de canais iÃ´nicos estruturais de membrana de base, o que os torna excessivamente suscetÃ­veis ao desenvolvimento de disfunÃ§Ã£o cardÃ­aca congestiva hiperaguda e edema agudo de pulmÃ£o na vigÃªncia de infusÃµes de fluidos.
â€¢ MONITORIZAÃ‡ÃƒO: A avaliaÃ§Ã£o perfusional perifÃ©rica deve ser monitorada rigorosamente Ã  beira do leito de forma contÃ­nua, mensurando de forma constante parÃ¢metros como do dÃ©bito diurÃ©tico horÃ¡rio via sondagem ou pesagem de fralda (alvo terapÃªutico essencial > 1,0 mL/kg/hora de diurese estÃ¡vel), monitoramento da pressÃ£o arterial mÃ©ida e saturaÃ§Ã£o venosa de O2 se disponÃ­vel.
â€¢ SINAIS DE ALERTA: Sinais clÃ­nicos inequÃ­vocos de deterioraÃ§Ã£o hemodinÃ¢mica e colapso perfusional em emergÃªncia pediÃ¡trica de alta prioridade: ReduÃ§Ã£o rebaixamento sÃºbito do estado do nÃ­vel de consciÃªncia, letargia profunda progressiva, tempo de enchimento capilar perifÃ©rico severamente prolongado (> 4 segundos), hipotermia inexplicada (< 35,5ÂºC), alÃ©m de taquiarritmias e ritmo de galope auscultado no precÃ³rdio.`
      }
    ]
  }
];

// --- Flowchart Data ---

const FlowchartShock = () => {
  const [step, setStep] = useState(0);

  const steps = [
    { text: "Paciente com HipotensÃ£o ou Sinais de HipoperfusÃ£o?", options: [{ label: "Sim", next: 1 }] },
    { text: "Avaliar JVP, PresenÃ§a de Edema Pulmonar ou RuÃ­dos.", options: [{ label: "JVP Baixa (Seco)", next: 2 }, { label: "JVP Alta (Ãšmido)", next: 4 }] },
    { text: "ProvÃ¡vel Choque HipovolÃªmico ou Distributivo. Fazer Prova de Carga (Cristaloide).", options: [{ label: "Melhorou", next: 3 }, { label: "NÃ£o Melhorou", next: 5 }] },
    { text: "Ajustar dose e tratar causa base (Hemorragia, Sepse, Anafilaxia).", options: [{ label: "Reset", next: 0 }] },
    { text: "ProvÃ¡vel Choque CardiogÃªnico. Evitar Fluido! Considerar InotrÃ³pico (Dobutamina).", options: [{ label: "Solicitar ECO", next: 0 }] },
    { text: "RefratÃ¡rio a Fluido? Iniciar Noradrenalina (Vasopressor).", options: [{ label: "Avaliar Sepse", next: 0 }] },
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
    { text: "ADRENALINA IM IMEDIATA! (Vasto Lateral da Coxa).", options: [{ label: "Adulto: 0.5mg", next: 2 }, { label: "CrianÃ§a: 0.01mg/kg", next: 2 }] },
    { text: "Sinais de ObstruÃ§Ã£o de Vias AÃ©reas ou HipotensÃ£o?", options: [{ label: "NÃ£o", next: 3 }, { label: "Sim (Chamar UTI)", next: 4 }] },
    { text: "Adjuvantes: Anti-histamÃ­nicos + Corticoide. Observar 4-8h.", options: [{ label: "Reset", next: 0 }] },
    { text: "NebulizaÃ§Ã£o com Adrenalina + ReposiÃ§Ã£o VolÃªmica + VM se necessÃ¡rio.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-rose-950 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-rose-900 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-rose-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-rose-600 flex items-center justify-center shadow-lg">
            <ShieldAlert size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Anafilaxia (EmergÃªncia)</h3>
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
    { text: "Iniciar RCP (30:2) + OxigÃªnio + Monitor/Desfibrilador. Ritmo Ã© chocÃ¡vel?", options: [{ label: "FV / TVSP (SIM)", next: 2 }, { label: "Assistolia / AESP (NÃƒO)", next: 5 }] },
    { text: "Choque! Reiniciar RCP imediatamente por 2 min + Acesso IV/IO.", options: [{ label: "PrÃ³ximo Passo", next: 3 }] },
    { text: "Ritmo Ã© chocÃ¡vel apÃ³s 2 min?", options: [{ label: "Sim (Choque + Epinefrina)", next: 4 }, { label: "NÃ£o", next: 6 }] },
    { text: "Choque! RCP 2 min + Epinefrina 1mg a cada 3-5 min + Via aÃ©rea avanÃ§ada?", options: [{ label: "Considerar Amiodarona", next: 7 }] },
    { text: "Epinefrina 1mg imediatamente + Atentar para 5Hs e 5Ts. Ritmo Ã© chocÃ¡vel?", options: [{ label: "Sim", next: 2 }, { label: "NÃ£o", next: 1 }] },
    { text: "ROSC (Retorno da CirculaÃ§Ã£o EspontÃ¢nea)?", options: [{ label: "Sim (Cuidados PÃ³s-Parada)", next: 8 }, { label: "NÃ£o", next: 1 }] },
    { text: "Amiodarona 300mg (1Âª dose) ou LidocaÃ­na.", options: [{ label: "Voltar ao Ciclo", next: 3 }] },
    { text: "Protocolo de Cuidados PÃ³s-Parada: O2 > 92%, PAM > 65, ECG 12 derivaÃ§Ãµes.", options: [{ label: "Finalizar", next: 0 }] },
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
    { text: "Possui Sinais de Instabilidade? (HipotensÃ£o, Dor TorÃ¡cica, AlteraÃ§Ã£o SensÃ³rio, IC Aguda)?", options: [{ label: "ESTÃVEL", next: 2 }, { label: "INSTÃVEL", next: 5 }] },
    { text: "QRS Estreito e Ritmo Regular?", options: [{ label: "Sim (Manobra Vagal)", next: 3 }, { label: "NÃ£o (Ir p/ Especialista)", next: 4 }] },
    { text: "Se Vagal falhar: Adenosina 6mg (1Âª dose) -> 12mg (2Âª dose).", options: [{ label: "Finalizar", next: 0 }] },
    { text: "Considerar FA (Controle de FrequÃªncia) ou outras arritmias complexas.", options: [{ label: "Finalizar", next: 0 }] },
    { text: "CardioversÃ£o ElÃ©trica Sincronizada!", options: [{ label: "Considerar SedaÃ§Ã£o", next: 6 }] },
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
    { text: "Sinais de Instabilidade? (HipotensÃ£o, AlteraÃ§Ã£o Mental, Choque, Dor TorÃ¡cica, IC Aguda).", options: [{ label: "NÃƒO (Observar)", next: 2 }, { label: "SIM (InstÃ¡vel)", next: 3 }] },
    { text: "Manter monitorizaÃ§Ã£o e considerar causas secundÃ¡rias.", options: [{ label: "Reset", next: 0 }] },
    { text: "Atropina 1mg IV! (Pode repetir a cada 3-5 min, max 3mg).", options: [{ label: "Sucesso?", next: 2 }, { label: "Falhou", next: 4 }] },
    { text: "Considerar Marcapasso TranscutÃ¢neo OU InfusÃ£o de Dopamina OU Adrenalina.", options: [{ label: "Consultar Especialista", next: 0 }] },
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
    { text: "PotÃ¡ssio (K+) > 5.5 mEq/L e/ou AlteraÃ§Ã£o no ECG?", options: [{ label: "Sim", next: 1 }] },
    { text: "AlteraÃ§Ãµes no ECG: Onda T apiculada, QRS largo ou ausÃªncia de P?", options: [{ label: "NÃƒO (EstÃ¡vel)", next: 2 }, { label: "SIM (InstÃ¡vel)", next: 3 }] },
    { text: "Shift Transcelular: Glicoinsulina + Fenoterol + Bicarbonato (se acidose).", options: [{ label: "PrÃ³ximo Passo", next: 4 }] },
    { text: "ESTABILIZAÃ‡ÃƒO DE MEMBRANA: Gluconato de CÃ¡lcio 10% 10-20mL IV!", options: [{ label: "Normalizou ECG?", next: 2 }] },
    { text: "Aumentar ExcreÃ§Ã£o: Furosemida 40mg IV + Sorcal 30g VO.", options: [{ label: "Reset", next: 0 }] },
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
    { text: "LesÃ£o de Ã“rgÃ£o Alvo Aguda (CÃ©rebro, CoraÃ§Ã£o, Rim, Olho)?", options: [{ label: "NÃƒO (UrgÃªncia)", next: 2 }, { label: "SIM (EmergÃªncia)", next: 3 }] },
    { text: "Tratar VO: Captopril ou Clonidina. ReduÃ§Ã£o gradual em 24-48h.", options: [{ label: "Reset", next: 0 }] },
    { text: "InternaÃ§Ã£o + Droga IV (Nitroprussiato ou Tridil). Alvo: Queda de 20% da PAM em 1h.", options: [{ label: "Reset", next: 0 }] },
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
    { text: "Suspeita de AVC (SAMU/Triagem): DÃ©ficit focal sÃºbito?", options: [{ label: "Sim", next: 1 }] },
    { text: "EstabilizaÃ§Ã£o (ABC): Glicemia capilar rÃ¡pida!", options: [{ label: "Glicemia OK", next: 2 }] },
    { text: "Realizar TC de CrÃ¢nio IMEDIATA. HÃ¡ hemorragia?", options: [{ label: "SIM (AVCh)", next: 3 }, { label: "NÃƒO (AVCi)", next: 4 }] },
    { text: "AVCh: Controle rigoroso de PA (< 140 mmHg) + Equipe Neurocirurgia.", options: [{ label: "Reset", next: 0 }] },
    { text: "AVCi: InÃ­cio dos sintomas < 4.5h?", options: [{ label: "SIM", next: 5 }, { label: "NÃƒO (> 4.5h)", next: 6 }] },
    { text: "TrombÃ³lise (Alteplase) se PA < 185/110 e sem contraindicaÃ§Ãµes.", options: [{ label: "Reset", next: 0 }] },
    { text: "Considerar Trombectomia MecÃ¢nica (atÃ© 24h) ou suporte secundÃ¡rio.", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-indigo-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-indigo-600 flex items-center justify-center shadow-lg">
            <Zap size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">AVC IsquÃªmico/HemorrÃ¡gico</h3>
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
    { text: "Paciente com dispneia e sibilÃ¢ncia (Crise de Asma)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Sinais de fala entrecortada, esforÃ§o respiratÃ³rio, SaO2 < 90%?", options: [{ label: "SIM (Grave)", next: 2 }, { label: "NÃƒO (Leve/Mod)", next: 3 }] },
    { text: "GRAVE: OxigÃªnio (SaO2 93-95%) + Beta2 10-20 jatos + IpratrÃ³pio + Corticoide IV.", options: [{ label: "Sem melhora (UTI)", next: 4 }, { label: "Melhora", next: 5 }] },
    { text: "LEVE: Beta2 4-10 jatos a cada 20 min por 1h + Corticoide VO.", options: [{ label: "Reavaliar", next: 5 }] },
    { text: "UTI: Sulfato de MagnÃ©sio 2g IV + Considerar IntubaÃ§Ã£o.", options: [{ label: "Reset", next: 0 }] },
    { text: "MANUTENÃ‡ÃƒO: Corticoide por 5-7 dias + Ajustar tratamento crÃ´nico.", options: [{ label: "Reset", next: 0 }] },
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
    { text: "HematÃªmese ou Melena (Hemorragia Digestiva Alta)?", options: [{ label: "Sim", next: 1 }] },
    { text: "EstabilizaÃ§Ã£o HemodinÃ¢mica (ABC): 2 acessos calibrosos + Cristaloides.", options: [{ label: "EstÃ¡vel", next: 2 }, { label: "InstÃ¡vel", next: 3 }] },
    { text: "Realizar Endoscopia (EDA) em atÃ© 24h. Iniciar IBP 80mg dose ataque.", options: [{ label: "Reset", next: 0 }] },
    { text: "Protocolo de TransfusÃ£o (Alvo Hb > 7) + EDA de urgÃªncia.", options: [{ label: "Reset", next: 0 }] },
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
    { text: "Suspeita de TEP (Dispneia, Dor torÃ¡cica, Taquicardia)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Escore de Wells p/ TEP: Baixa/Intermed (<= 4) ou Alta (> 4)?", options: [{ label: "<= 4 (ImprovÃ¡vel)", next: 2 }, { label: "> 4 (ProvÃ¡vel)", next: 3 }] },
    { text: "Solicitar D-DÃ­mero.", options: [{ label: "Negativo (Exclui)", next: 4 }, { label: "Positivo", next: 3 }] },
    { text: "Solicitar Angio-TC de TÃ³rax.", options: [{ label: "Positiva (Confirma)", next: 5 }, { label: "Negativa", next: 4 }] },
    { text: "Investigar outras causas. TEP excluÃ­do.", options: [{ label: "Reset", next: 0 }] },
    { text: "Iniciar AnticoagulaÃ§Ã£o (Enoxaparina 1mg/kg 12/12h) + Avaliar Instabilidade.", options: [{ label: "Reset", next: 0 }] },
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
    { text: "Suspeita de InfecÃ§Ã£o + DisfunÃ§Ã£o OrgÃ¢nica (qSOFA >= 2)?", options: [{ label: "Sim", next: 1 }] },
    { text: "Protocolo de 1 Hora: Coletar Lactato + Hemoculturas.", options: [{ label: "PrÃ³ximo", next: 2 }] },
    { text: "AntibiÃ³tico de Amplo Espectro IV + Cristaloide 30mL/kg (se hipotenso/Lactato >= 4).", options: [{ label: "Reavaliar", next: 3 }] },
    { text: "PAM >= 65 mmHg? Se nÃ£o, iniciar Vasopressores (Noradrenalina).", options: [{ label: "Reset", next: 0 }] },
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
    { text: "Avaliar Sinais de DesidrataÃ§Ã£o. Paciente apresenta sede intensa, olhos encovados ou prega cutÃ¢nea lenta?", options: [{ label: "NÃ£o (Plano A)", next: 1 }, { label: "Sim, 2 ou + sinais (Plano B/C)", next: 2 }] },
    { text: "PLANO A: Tratamento Domiciliar. Aumentar lÃ­quidos, manter alimentaÃ§Ã£o e dar SRO apÃ³s perdas. Orientar sinais de alarme.", options: [{ label: "Reset", next: 0 }] },
    { text: "HÃ¡ sinais de choque (Pulso fraco, TEC > 2s, Letargia)?", options: [{ label: "NÃ£o (Plano B)", next: 3 }, { label: "Sim (Plano C)", next: 4 }] },
    { text: "PLANO B: ReidrataÃ§Ã£o Oral na Unidade (TRO). 50-100 mL/kg de SRO em 4h. Reavaliar continuamente.", options: [{ label: "Melhorou -> Plano A", next: 1 }, { label: "Piorou -> Plano C", next: 4 }] },
    { text: "PLANO C: HidrataÃ§Ã£o Venosa Imediata (ExpansÃ£o). SF 0,9% 20mL/kg em 20-30min. Repetir conforme necessÃ¡rio.", options: [{ label: "Estabilizou -> Plano B", next: 3 }, { label: "ManutenÃ§Ã£o", next: 5 }] },
    { text: "Fase de ManutenÃ§Ã£o (Holliday-Segar): 100mL/kg (1-10kg) + 50mL/kg (11-20kg) + 20mL/kg (>20kg).", options: [{ label: "Reset", next: 0 }] },
  ];

  return (
    <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }} className="bg-slate-900 text-white rounded-3xl p-8 space-y-8 min-h-[460px] flex flex-col justify-between border border-slate-700 shadow-2xl relative overflow-hidden">
      <div className="absolute top-0 right-0 w-64 h-64 bg-blue-500/10 blur-[100px] pointer-events-none" />
      <div className="flex items-center justify-between relative z-10">
        <div className="flex items-center gap-3">
          <div className="w-10 h-10 rounded-xl bg-blue-600 flex items-center justify-center shadow-lg">
            <Droplets size={20} />
          </div>
          <h3 className="font-serif italic font-bold text-xl tracking-tight">Manejo de DesidrataÃ§Ã£o</h3>
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
          <p className="text-[10px] text-slate-400 mt-2 font-bold uppercase tracking-widest">{currentCount} de {totalTarget} doenÃ§as mapeadas</p>
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
            placeholder="Pesquisar por patologia, sintoma ou classificaÃ§Ã£o de risco (verde, amarelo, vermelho)..."
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
            { label: 'Dor TorÃ¡cica', icon: Heart, term: 'Infarto' },
            { label: 'Falta de Ar / Sibilos', icon: Wind, term: 'Asma' },
            { label: 'Cefaleia Intensa', icon: Zap, term: 'Hipertensiva' },
            { label: 'DÃ©ficit NeurolÃ³gico', icon: Brain, term: 'AVC' },
            { label: 'Alergia / Anafilaxia', icon: ShieldAlert, term: 'Anafilaxia' },
            { label: 'Dor Abdominal Aguda', icon: ClipboardList, term: 'Apendicite' },
            { label: 'Febre / Sepse', icon: AlertTriangle, term: 'Sepse' },
            { label: 'PalpitaÃ§Ãµes / Ritmo', icon: Activity, term: 'FA' },
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
    name: "DoenÃ§a do Refluxo GastroesofÃ¡gico (DRGE)",
    category: "Gastrointestinal",
    diagnostic: "Baseado fundamentalmente na anamnese: pirose retroesternal (queimaÃ§Ã£o) e regurgitaÃ§Ã£o Ã¡cida â‰¥ 2 vezes por semana, por pelo menos 4-8 semanas. A resposta positiva ao teste terapÃªutico com IBP apoia fortemente o diagnÃ³stico.",
    alarm: "Disfagia (dificuldade de engolir), odinofagia (dor para engolir), sangramento digestivo (hematÃªmese/melena), anemia ferropriva inexplicÃ¡vel, perda ponderal involuntÃ¡ria rÃ¡pida, ou inÃ­cio dos sintomas apÃ³s os 50 anos: solicitar Endoscopia Digestiva Alta (EDA) com urgÃªncia para afastar neoplasia.",
    treatment: [
      {
        title: "1Âª Linha - Inibidor de Bomba de PrÃ³tons (IBP) e Comportamental",
        desc: "Omeprazol 20mg a 40mg VO ao dia, pela manhÃ£, em jejum absoluto 30 minutos antes do cafÃ© da manhÃ£, por 4 a 8 semanas consecutivos. Orientar exaustivamente medidas comportamentais: elevar cabeceira da cama em 15cm, evitar deitar-se atÃ© 2-3 horas apÃ³s as refeiÃ§Ãµes, fracionar alimentaÃ§Ã£o e suspender tabaco/Ã¡lcool/cafÃ©/gorduras."
      },
      {
        title: "2Âª Linha - OtimizaÃ§Ã£o Recalcitrante / SubstituiÃ§Ã£o e CoadjuvaÃ§Ã£o",
        desc: "Se falha clÃ­nica apÃ³s 4 semanas, fracionar Omeprazol para 20mg a 40mg VO 12/12h (30 min antes do cafÃ© e antes do jantar) por mais 4 semanas, ou substituir por Pantoprazol 40mg VO ao dia. Em queixas de esvaziamento retardado (plenitude), associar Domperidona 10mg ou Bromoprida 10mg VO atÃ© de 8/8h antes das refeiÃ§Ãµes."
      }
    ]
  },
  {
    id: "hipo",
    name: "Hipotireoidismo ClÃ­nico e SubclÃ­nico",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "TSH elevado (> 4.5 mUI/L) com T4 Livre baixo caracteriza hipotireoidismo clÃ­nico. TSH elevado com T4 Livre normal caracteriza hipotireoidismo subclÃ­nico (tratar apenas se TSH > 10, gestante, anticorpos anti-TPO altamente positivos ou sintomas muito exuberantes em jovens).",
    alarm: "Coma mixedematoso (situaÃ§Ã£o de terapia intensiva rara caracterizada por hipotermia extrema, bradicardia severa, hipoventilaÃ§Ã£o, edema generalizado duro e letargia grave) - encaminhar imediatamente ao pronto-socorro.",
    treatment: [
      {
        title: "1Âª Linha - ReposiÃ§Ã£o FisiolÃ³gica PadrÃ£o de Levotiroxina (Adulto)",
        desc: "Prescrever Levotiroxina SÃ³dica (Puran T4/Synthroid). Dose inicial plena de reposiÃ§Ã£o de 1,6 mcg/kg/dia para adultos sem comorbidades cardÃ­acas. Tomar pela manhÃ£, em jejum absoluto, aguardando de 30 a 60 minutos para realizar alimentaÃ§Ã£o diÃ¡ria ou tomar outras medicaÃ§Ãµes."
      },
      {
        title: "2Âª Linha - Ajuste e IntroduÃ§Ã£o Cautelosa em Idosos / Cardiopatas",
        desc: "IntroduÃ§Ã£o super cautelosa em idosos ou pacientes coronariopatas: iniciar com dose muito baixa, de 12.5 mcg a 25 mcg VO ao dia. Ajustes lentos com incrementos graduais de 12.5 mcg a 25 mcg a cada 4 a 6 semanas de acordo com dosagem laboratorial de TSH para mitigar risco de arritmias ou isquemia miocÃ¡rdica."
      }
    ],
    interactiveType: "hypothyroid"
  },
  {
    id: "asma",
    name: "Asma BrÃ´nquica",
    category: "RespiratÃ³rio",
    diagnostic: "Variabilidade clÃ­nica de sintomas (sibilÃ¢ncia, falta de ar, aperto no peito e tosse, que pioram Ã  noite ou ao acordar) associada a limitaÃ§Ã£o do fluxo aÃ©reo expiratÃ³rio documentada por espirometria (resposta ao broncodilatador com aumento de VEF1 > 12% e > 200ml) ou variabilidade do PFE.",
    alarm: "Crise asmÃ¡tica grave (fala entrecortada, musculatura acessÃ³ria ativa, cianose, sibilÃ¢ncia silenciosa 'tÃ³rax silencioso', SatO2 < 90%): iniciar oxigenoterapia, 3 a 4 ciclos de Salbutamol inalatÃ³rio (ou Fenoterol 10-20 gotas) de 20/20min e Corticoide sistÃªmico (Prednisolona 40mg VO ou Hidrocortisona EV) e acionar transporte de emergÃªncia.",
    treatment: [
      {
        title: "1Âª Linha - Corticoide InalatÃ³rio Exclusivo ou Resgate S.O.S. (GINA Step 1-2)",
        desc: "Medicamento essencial de controle: Beclometasona spray oral 250mcg/dose (1 a 2 jatos VO de 12/12h de uso fixo diÃ¡rio) ou Budesonida inalador em pÃ³ (200mcg VO de 12/12h). Prescrever Salbutamol spray 100mcg/dose (2 jatos de resgate S.O.S se sintomas de broncoespasmo). Higienizar a boca pÃ³s-inalaÃ§Ã£o preventiva (evitar candidÃ­ase)."
      },
      {
        title: "2Âª Linha - AssociaÃ§Ã£o CI + LABA Regular (GINA Step 3-4)",
        desc: "Se controle inadequado (persistÃªncia de uso de resgate, despertares noturnos freqÃ¼entes), associar broncodilatador de longa duraÃ§Ã£o (LABA): prescrever Budesonida + Formoterol (200/6mcg ou 400/12mcg) 1 a 2 inalaÃ§Ãµes de 12/12h de uso fixo contÃ­nuo. Alavancar adesÃ£o e correÃ§Ã£o da tÃ©cnica do inalador."
      }
    ],
    interactiveType: "asma"
  },
  {
    id: "dpoc",
    name: "DoenÃ§a Pulmonar Obstrutiva CrÃ´nica (DPOC)",
    category: "RespiratÃ³rio",
    diagnostic: "Deve ser suspeitada em indivÃ­duos > 40 anos ex-tabagistas ou tabagistas ativos com dispneia progressiva, tosse crÃ´nica e expectoraÃ§Ã£o. ConfirmaÃ§Ã£o obrigatÃ³ria por espirometria: relaÃ§Ã£o VEF1/CVF < 0,70 pÃ³s-broncodilatador.",
    alarm: "ExacerbaÃ§Ã£o aguda (aumento da dispneia, do volume de escarro e da purulÃªncia do escarro): iniciar SABA/SAMA de horÃ¡rio, avaliar uso de Amoxicilina + Clavulanato ou Azitromicina por 5-7 dias se escarro purulento, e Prednisona 40mg VO por 5 dias.",
    treatment: [
      {
        title: "1Âª Linha - CessaÃ§Ã£o do Tabaco + Broncodilatador de Curta / Longa AÃ§Ã£o Isolado",
        desc: "Parada tabÃ¡gica imediata (freia a perda funcional). Adotar vacinaÃ§Ã£o anual contra Influenza e anti-pneumocÃ³cica (Pneumo 23) na UBS. SintomÃ¡tico de base: Brometo de IpratrÃ³pio (SAMA) 4 jatos VO de 6/6h fixos, ou introduzir LAMA isolada (TiotrÃ³pio 18mcg inalaÃ§Ã£o diÃ¡ria)."
      },
      {
        title: "2Âª Linha - Terapia Dupla (LABA + LAMA) ou Tripla (LABA + LAMA + CI)",
        desc: "Para dispneia moderada a severa (GOLD Grupo B ou E): prescrever associaÃ§Ã£o de longa duraÃ§Ã£o LABA + LAMA (ex: Formoterol + TiotrÃ³pio). Adicionar Corticoide InalatÃ³rio (Budesonida 400mcg de 12/12h) se histÃ³rico de â‰¥2 exacerbaÃ§Ãµes agudas ao ano e nÃ­veis de eosinÃ³filos sÃ©ricos > 300/mcL."
      }
    ]
  },
  {
    id: "dislip",
    name: "Dislipidemia e Rastreio Cardiovascular",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "Classificada em hipercolesterolemia isolada, hipertrigliceridemia isolada ou dislipidemia mista por perfil lipÃ­dico de jejum. Deve-se focar no cÃ¡lculo do risco cardiovascular global para definir o alvo do colesterol LDL.",
    alarm: "Xantomas tendinosos, arco corneal antes dos 45 anos ou LDL > 190 mg/dL: alta suspeita de Hipercolesterolemia Familiar (HF) heterozigÃ³tica. Alto risco coronariano precoce.",
    treatment: [
      {
        title: "1Âª Linha - ModificaÃ§Ãµes DietÃ©ticas Intensas e ESTATINAS de MÃ©dia PotÃªncia",
        desc: "Implementar reduÃ§Ã£o rigorosa de gorduras saturadas/trans, carboidratos simples e inserÃ§Ã£o de fibras e atividade fÃ­sica regular. Farmacoterapia base: Sinvastatina 20mg a 40mg VO Ã  noite (reduÃ§Ã£o do LDL de 20-30%). Monitorar queixas musculares severas e colher transaminases (ALT/AST) se suspeita de miopatia."
      },
      {
        title: "2Âª Linha - ESTATINAS de Alta PotÃªncia / AssociaÃ§Ã£o com Ezetimiba",
        desc: "Para pacientes de Alto/Muito Alto risco cardiovascular (ex: coronariopata crÃ´nico, diabÃ©tico com lesÃ£o ou infarto prÃ©vio) onde o alvo Ã© restrito (LDL < 50mg/dL): prescrever Atorvastatina 40mg a 80mg VO/dia em dose Ãºnica ou Rosuvastatina 20mg VO/dia. Se alvo nÃ£o for alcanÃ§ado, associar Ezetimiba 10mg VO ao dia."
      }
    ],
    interactiveType: "cholesterol"
  },
  {
    id: "tabac",
    name: "Tabagismo - Programa de CessaÃ§Ã£o",
    category: "Outros",
    diagnostic: "DefiniÃ§Ã£o de dependÃªncia fÃ­sica e comportamental por anamnese do histÃ³rico tabÃ¡gico. AplicaÃ§Ã£o do escore de FagerstrÃ¶m para definir a gravidade e a necessidade de associaÃ§Ã£o farmacolÃ³gica.",
    alarm: "Pacientes motivados a parar que sofrem de fissura intensa ou recaÃ­das frequentes. Acompanhar em grupos especÃ­ficos ou consultas individuais semanais no primeiro mÃªs.",
    treatment: [
      {
        title: "1Âª Linha - Apoio Cognitivo Comportamental e Terapia de ReposiÃ§Ã£o de Nicotina (TRN)",
        desc: "ParticipaÃ§Ã£o ativa em grupos de cessaÃ§Ã£o estruturados. Apoio com Adesivo TransdÃ©rmico de Nicotina (21mg, 14mg ou 7mg de acordo com o total de cigarros/dia) associado a Nicotina Gomas/Pastilhas 2mg (resgatar fissura aguda S.O.S., mÃ¡x, 10-12/dia) em cronograma regressivo por 12 semanas."
      },
      {
        title: "2Âª Linha - Cloridrato de Bupropiona Isolada ou Associada",
        desc: "Indicado para dependÃªncia moderada a grave com fissura persistente. Prescrever Bupropiona 150mg VO ao dia nos primeiros 3 dias; a partir do 4Âº dia elevar para 150mg VO de 12/12h. O 'Dia D' de parada total deve ocorrer entre o 8Âº e o 14Âº dia de uso. Pode ser associada ao adesivo de Nicotina. Contraindicado em portadores de epilepsia ou transtornos alimentares."
      }
    ],
    interactiveType: "fagerstrom"
  },
  {
    id: "tb",
    name: "Tuberculose Pulmonar",
    category: "Infecciosas/Endemias",
    diagnostic: "Suspeita clÃ­nica em todo 'SintomÃ¡tico RespiratÃ³rio' (tosse â‰¥ 3 semanas). DiagnÃ³stico confirmado por Baciloscopia (BAAR) de escarro (2 amostras), Teste RÃ¡pido Molecular (TRM-TB - detecta DNA e resistÃªncia Ã  Rifampicina) ou Cultura com teste de sensibilidade.",
    alarm: "Hemoptise maciÃ§a (sangramento respiratÃ³rio severo), dispneia grave, dor torÃ¡cica intensa, ou rebaixamento do nÃ­vel de consciÃªncia (risco de meningite tuberculosa) - encaminhar para internamento hospitalar.",
    treatment: [
      {
        title: "1Âª Linha - Fase de Ataque (Esquema BÃ¡sico RIPE - Meses 1 e 2)",
        desc: "Prescrever comprimidos de dose fixa combinada SUS RIPE (Rifampicina 150mg + Isoniazida 75mg + Pirazinamida 400mg + Etambutol 275mg) tomados em jejum diÃ¡rio. Dose padrÃ£o para adultos de 50-70kg: 4 comprimidos juntos em dose Ãºnica matinal diÃ¡ria por 2 meses inteiros."
      },
      {
        title: "2Âª Linha - Fase de ManutenÃ§Ã£o (Esquema RI - Meses 3 a 6)",
        desc: "ApÃ³s 2 meses de ataque e baciloscopia de controle, transicionar para Rifampicina + Isoniazida (suspender Pirazinamida e Etambutol) por mais 4 meses adicionais (completando 6 meses de terapÃªutica). O tratamento deve ser monitorado sob a estratÃ©gia de TDO (Tratamento Diretamente Observado) de forma obrigatÃ³ria!"
      }
    ]
  },
  {
    id: "hanse",
    name: "HansenÃ­ase",
    category: "Infecciosas/Endemias",
    diagnostic: "Manchas na pele de coloraÃ§Ã£o esbranquiÃ§ada, avermelhada ou acastanhada com diminuiÃ§Ã£o ou perda absoluta de sensibilidade tÃ©rmica, dolorosa ou tÃ¡til. Pode haver turgidez e dor Ã  palpaÃ§Ã£o de nervos perifÃ©ricos (ulnar, radial, fibular). Confirmada clinicamente.",
    alarm: "Neurite aguda (dor neuropÃ¡tica sÃºbita intensa no nervo perifÃ©rico com perda recente de forÃ§a na mÃ£o ou pÃ©): iniciar Prednisona 1mg/kg/dia imediatamente para evitar deformidade fÃ­sica irreversÃ­vel e acionar o especialista de referÃªncia.",
    treatment: [
      {
        title: "1Âª Linha - Esquema Paucibacilar (â‰¤ 5 lesÃµes cutÃ¢neas e Sem Troncos Acometidos)",
        desc: "DuraÃ§Ã£o: 6 doses mensais supervisionadas aplicadas em atÃ© 9 meses. Esquema de Poliquimioterapia (PQT): Rifampicina 600mg (mensal supervisionada na UBS) + Dapsona 100mg (mensal supervisionada + 100mg VO diÃ¡rios autoadministrados em domicÃ­lio pelo paciente)."
      },
      {
        title: "2Âª Linha - Esquema Multibacilar (> 5 lesÃµes de pele ou > 1 tronco nervoso acometido)",
        desc: "DuraÃ§Ã£o: 12 doses mensais supervisionadas aplicadas em atÃ© 18 meses. ComposiÃ§Ã£o terapÃªutica tripla: Rifampicina 600mg (mensal supervisionada) + Clofazimina 300mg (mensal supervisionada) + Dapsona 100mg (mensal supervisionada) associado a doses diÃ¡rias em domicÃ­lio: Dapsona 100mg/dia + Clofazimina 50mg/dia VO."
      }
    ]
  },
  {
    id: "dengue",
    name: "Dengue, Zika & Chikungunya",
    category: "Infecciosas/Endemias",
    diagnostic: "Caso suspeito de Dengue: Febre alta de inÃ­cio sÃºbito (2 a 7 dias) acompanhada de pelo menos dois sintomas: cefaleia, dor retro-orbital, mialgias, artralgias, prostraÃ§Ã£o, exantema. Realizar obrigatoriamente a Prova do LaÃ§o em toda suspeita clÃ­nica.",
    alarm: "Sinais de Alarme (surgem no perÃ­odo de defervescÃªncia - febre cedendo): Dor abdominal intensa e contÃ­nua, vÃ´mitos persistentes, acÃºmulo de lÃ­quidos (ascite/derrame pleural), sangramento de mucosa, hipotensÃ£o postural/lipotimia, letargia ou irritabilidade, aumento sÃºbito de hematÃ³crito e queda rÃ¡pida de plaquetas.",
    treatment: [
      {
        title: "1Âª Linha - HidrataÃ§Ã£o Oral Imediata Exaustiva (Manejo Grupo A - Ambulatorial)",
        desc: "Prescrever hidrataÃ§Ã£o vigorosa precoce: 60 ml/kg/dia VO. Sendo 1/3 executado com Soro de ReidrataÃ§Ã£o Oral (SRO) fornecido pelo SUS e 2/3 com lÃ­quidos caseiros (Ã¡gua de coco, sucos, Ã¡gua filtrada). SintomÃ¡ticos permitidos de horÃ¡rio: Dipirona 1g de 6/6h ou Paracetamol 750mg de 6/6h. AINES/AAS sÃ£o terminantemente proibidos!"
      },
      {
        title: "2Âª Linha - HidrataÃ§Ã£o Venosa Imediata de EmergÃªncia (Manejo Grupos B/C/D)",
        desc: "Indicado se sinais de alarme ou recusa/intolerÃ¢ncia oral severa. Iniciar expansÃ£o volÃªmica venosa na UBS: Soro FisiolÃ³gico (SF 0.9%) ou Ringer Lactato 10 ml/kg na primeira hora, repetindo conforme monitorizaÃ§Ã£o laboratorial e micro-hematÃ³critos seriados. Encaminhar para estabilizaÃ§Ã£o/observaÃ§Ã£o de 24h."
      }
    ],
    interactiveType: "dengue"
  },
  {
    id: "anemia",
    name: "Anemia Ferropriva",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "Anemia MicrocÃ­tica (VCM < 80fl) e HipocrÃ´mica (HCM < 27pg, CHCM baixa) com RDW elevado. Ferritina sÃ©rica baixa (< 30 ng/mL) confirma o diagnÃ³stico.",
    alarm: "Anemia grave em idosos ou pacientes cardiopatas (Hb < 7-8 g/dL) ou sintomas de insuficiÃªncia cardÃ­aca congestiva de alto dÃ©bito (taquicardia, dispneia de repouso, turgÃªncia jugular) - encaminhar ao pronto atendimento para transfusÃ£o de concentrado de hemÃ¡cias monitorizada.",
    treatment: [
      {
        title: "1Âª Linha - ReposiÃ§Ã£o Oral de Sulfato Ferroso de Alta Dose (SUS)",
        desc: "Dose terapÃªutica padrÃ£o: 120mg a 200mg de Ferro Elementar por dia para adultos. Prescrever de 3 a 5 comprimidos de Sulfato Ferroso 200mg (cada unidade possui 40mg de ferro metal) divididos ao longo do dia, administrados idealmente 1 hora antes das refeiÃ§Ãµes ou acompanhados de suco cÃ­trico (vitamina C). Manter atÃ© Hb normal + 3 meses."
      },
      {
        title: "2Âª Linha - ReposiÃ§Ã£o de Alta TolerÃ¢ncia / Ferro Intramuscular / Sacarato de Ferro",
        desc: "Em intolerÃ¢ncia gastrointestinal intratÃ¡vel (epigastralgia severa, constipaÃ§Ã£o) ou distÃºrbios de absorÃ§Ã£o intestinal: prescrever Ferro Quelato ou Ferro HidrÃ³xido Polimaltosado. Se refratariedade e anemia limitante, encaminhar para reposiÃ§Ã£o venosa especializada com Sacarato de HidrÃ³xido de Ferro (Noripurum EV) ou Dextrano de Ferro."
      }
    ]
  },
  {
    id: "gota",
    name: "Gota Ãšrica e Hiperuricemia",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "Crise aguda de monoartrite inflamatÃ³ria sÃºbita intensa (mais comum em primeira metatarsofalangeana - podagra, tornozelo ou joelho) com eritema, calor e edema grave. Ãcido Ãºrico sÃ©rico geralmente elevado (> 7.0 mg/dL).",
    alarm: "Artrite sÃ©ptica concomitante (febre alta, calafrios, toxemia, incapacidade absoluta de mobilizaÃ§Ã£o articular): realizar punÃ§Ã£o articular urgente para anÃ¡lise de lÃ­quido sinovial.",
    treatment: [
      {
        title: "1Âª Linha - Crise Aguda: Controle Ãlgico Agressivo de Curto Curso",
        desc: "NÃƒO iniciar ou alterar dose de Alopurinol durante a crise de dor (risco de piora pela oscilaÃ§Ã£o abrupta de urato). Prescrever Colchicina 0.5mg de 8/8h (limitar a 3 comprimidos ao dia) associado a AINE potente (Ibuprofeno 600mg de 8/8h ou Cetoprofeno 100mg de 12/12h por 3 a 5 dias). Se insuficiÃªncia renal, usar Prednisona 20mg a 40mg/dia."
      },
      {
        title: "2Âª Linha - PrevenÃ§Ã£o de Crises CrÃ´nicas e HipouricemiatÃ³ria",
        desc: "Indicado se â‰¥ 2 crises ano ou presenÃ§a de tofos: iniciar Alopurinol 100mg VO ao dia (ajustar rigorosamente pelo clearence de creatinina, mÃ¡ximo de 300mg/dia). Ã‰ mandatÃ³rio associar dose protetora de Colchicina baixa (0.5mg VO ao dia) nos primeiros 3 a 6 meses de introduÃ§Ã£o do Alopurinol para prevenir novas crises secundÃ¡rias."
      }
    ]
  },
  {
    id: "parasito",
    name: "Parasitoses Intestinais (Verminoses)",
    category: "Infecciosas/Endemias",
    diagnostic: "Dor abdominal inespecÃ­fica, gases, distensÃ£o, diarreia intermitente ou prurido anal (enterobÃ­ase). O diagnÃ³stico laboratorial Ã© feito por ProtoparasitolÃ³gico de Fezes (EPF) em 3 amostras, mas o tratamento empÃ­rico na UBS Ã© padronizado.",
    alarm: "SuboclusÃ£o intestinal por carga massiva de vermes (sÃ­ndrome de obstruÃ§Ã£o de LÃ¶ffler por Ascaris): contraindicado o uso de Albendazol por risco de migraÃ§Ã£o errÃ¡tica maciÃ§a. Tratar com Piperazina e Ã“leo Mineral e transferir ao pronto socorro.",
    treatment: [
      {
        title: "1Âª Linha - Tratamento EmpÃ­rico de Amplo Espectro / Monodose (SUS)",
        desc: "Prescrever Albendazol 400mg VO em dose Ãºnica para maiores de 2 anos (repetir em 14 dias se suspeita forte de EnterobÃ­ase ou HimenolepÃ­ase). Co-indicar tratamento de todos os familiares para evitar reinfestaÃ§Ã£o por ovos persistentes de Oxiurus."
      },
      {
        title: "2Âª Linha - Antimicrobianos Direcionados e Outros VermÃ­fugos",
        desc: "Se infecÃ§Ãµes especÃ­ficas ou refratariedade ao tratamento inicial: para AmebÃ­ase/GiardÃ­ase, utilizar Metronidazol 250mg VO de 8/8h por 5 a 7 dias, ou Secnidazol 2g dose Ãºnica (adultos). Para infecÃ§Ãµes multirresistentes, utilizar Nitazoxanida (Annita) 500mg VO de 12/12h por 3 dias inteiros pÃ³s-refeiÃ§Ãµes."
      }
    ]
  },
  {
    id: "escab",
    name: "Escabiose (Sarna) e Pediculose",
    category: "Pele & Dermatologia",
    diagnostic: "Escabiose: Prurido noturno patognomÃ´nico, poupando a face. LesÃµes lineares (sulcos microscÃ³picos), pÃ¡pulas escoriadas em dobras interdigitais, punhos, axilas, arÃ©olas e genitais masculinos. TransmissÃ£o intra-familiar.",
    alarm: "Sarna Crostosa (Norueguesa) em imunodeprimidos ou idosos, com crostas hiperqueratÃ³sicas pelo corpo inteiro contendo milhÃµes de Ã¡caros - requer isolamento de contato rigoroso e cuidados complexos.",
    treatment: [
      {
        title: "1Âª Linha - Permetrina TÃ³pica 5% / Escabicida de Escolha",
        desc: "Aplicar a Permetrina loÃ§Ã£o a 5% em todo o corpo, rigorosamente do pescoÃ§o para baixo, insistindo em dobras e fendas interdigitais. Realizar a aplicaÃ§Ã£o Ã  noite antes de deitar-se. Lavar por completo pela manhÃ£, apÃ³s 8 a 12 horas de contato na pele. Repetir impreterivelmente apÃ³s 7 dias. Tratar concomitantemente todos os coabitantes."
      },
      {
        title: "2Âª Linha - Ivermectina Oral SistÃªmica",
        desc: "Indicado para infestaÃ§Ãµes severas, falha da terapia tÃ³pica ou surtos epidÃªmicos fechados: prescrever Ivermectina 200 mcg/kg VO em dose Ãºnica, devendo-se repetir a dose apÃ³s exatamente 14 dias. Co-indicar lavagem rigorosa e fervura de roupas de cama e toalhas."
      }
    ]
  },
  {
    id: "erisip",
    name: "Erisipela e Celulite Leve",
    category: "Pele & Dermatologia",
    diagnostic: "Erisipela: Celulite superficial com evidente acometimento linfÃ¡tico, caracterizada por eritema bem definido, bordas nÃ­tidas elevadas, dor, calor e edema sÃºbitos, frequentemente associado a febre no membro inferior. Celulite: Acometimento mais profundo, com placas inflamatÃ³rias de bordas mal-delimitadas.",
    alarm: "FasciÃ­te Necrosante (dor desproporcional ao aspecto visual, bolhas hemorrÃ¡gicas, crepitaÃ§Ã£o gasosa na palpaÃ§Ã£o da pele e rÃ¡pida instabilidade/choque sÃ©ptico): emergÃªncia cirÃºrgica mÃ¡xima. Encaminhar para desbridamento urgente.",
    treatment: [
      {
        title: "1Âª Linha - Antibioticoterapia Oral ClÃ¡ssica e ElevaÃ§Ã£o de Membro",
        desc: "Prescrever Cefalexina 500mg VO de 6/6h por 10 dias completos. Co-indicar repouso absoluto com o membro superior ou inferior constantemente elevado acima da linha do quadril. SintomÃ¡ticos: Dipirona 1g se dor ou febre."
      },
      {
        title: "2Âª Linha - Larga Cobertura / Penicilina Benzatina / Casos de RepetiÃ§Ã£o",
        desc: "Se suspeita de Staphylococcus aureus de maior agressividade ou intolerÃ¢ncia Ã  Cefalexina: prescrever Amoxicilina + Clavulanato 500/125mg VO de 8/8h por 10 dias. Para profilaxia de erisipela de repetiÃ§Ã£o recorrente (â‰¥3 episÃ³dios/ano): instituir Penicilina G Benzatina 1.200.000 UI IM profundo de 21 em 21 dias por atÃ© 1-2 anos."
      }
    ]
  },
  {
    id: "clima",
    name: "ClimatÃ©rio e Menopausa",
    category: "Outros",
    diagnostic: "Menopausa Ã© o diagnÃ³stico retrospectivo apÃ³s 12 meses de amenorreia inexplicada em mulheres de meia-idade. Principais queixas: fogachos (surtos de calor sÃºbito), sudorese noturna, insÃ´nia, secura vaginal, labilidade emocional.",
    alarm: "PresenÃ§a de sangramento uterino anormal pÃ³s-menopausa (investigar espessamento endometrial por ultrassonografia transvaginal urgente para descartar hiperplasia endometrial ou malignidade).",
    treatment: [
      {
        title: "1Âª Linha - Terapia de ReposiÃ§Ã£o Hormonal (TRH) PadrÃ£o SUS",
        desc: "SE TEM ÃšTERO (MandatÃ³rio associar progesterona para proteÃ§Ã£o endometrial): prescrever EstrogÃªnios Conjugados 0.3mg a 0.625mg/dia VO de forma contÃ­nua associado ao Acetato de Medroxiprogesterona 2.5mg a 5mg/dia VO. SE NÃƒO TEM ÃšTERO: Pode-se prescrever EstrogÃªnio isolado de forma contÃ­nua."
      },
      {
        title: "2Âª Linha - Terapia NÃ£o-Hormonal de AlÃ­vio (ContraindicaÃ§Ãµes a TRH)",
        desc: "Se a paciente tem contraindicaÃ§Ã£o absoluta (antecedente de cÃ¢ncer de mama/endomÃ©trio, trombose venosa, doenÃ§a coronariana): prescrever inibidor seletivo de recaptaÃ§Ã£o de serotonina/noradrenalina para fogachos, como Succinato de Desvenlafaxina 50mg ao dia ou Cloridrato de Venlafaxina 37.5mg a 75mg VO ao dia."
      }
    ]
  },
  {
    id: "lombalgia",
    name: "Lombalgia CrÃ´nica e Aguda (Dor Lombar)",
    category: "Outros",
    diagnostic: "Comumente de carÃ¡ter mecÃ¢nico-postural. Dor na regiÃ£o lombar ou lombosacra que pode se irradiar para a nÃ¡dega ou coxa. DiagnÃ³stico essencialmente clÃ­nico, dispensando exames de imagem em episÃ³dios agudos autolimitados.",
    alarm: "Sinais de Alarme (Saddle anesthesia/anestesia em sela, perda sÃºbita de forÃ§a de membros inferiores, perda de controle esfincteriano (bexiga/intestino), febre inexplicada ou histÃ³rico de neoplasia): suspeita imediata de SÃ­ndrome da Cauda Equina ou MetÃ¡stase Ã“ssea. Encaminhar para emergÃªncia.",
    treatment: [
      {
        title: "1Âª Linha - AnalgÃ©sicos Simples e Condutas Funcionais",
        desc: "Prescrever Dipirona 1g VO de 6/6h associado ao calor local por 15-20 minutos, 3x ao dia. Desmistificar o repouso prolongado (repouso absoluto prolongado atrofia e piora a reabilitaÃ§Ã£o - incentivar retorno gradual precoce Ã s atividades do lar)."
      },
      {
        title: "2Âª Linha - Curso Curto de AINES e Relaxante Muscular Estruturado",
        desc: "Se dor limitante persistente na primeira linha: associar Ibuprofeno 600mg VO de 8/8h por no mÃ¡ximo 3 a 5 dias consecutivos, somado a Ciclobenzaprina 5mg a 10mg VO ao deitar-se (alivia espasmos musculares reativos severos). Encaminhar cedo dores crÃ´nicas (> 3 meses) Ã  fisioterapia e cinesioterapia."
      }
    ]
  },
  {
    id: "dispepsia",
    name: "Dispepsia Funcional e Gastrite",
    category: "Gastrointestinal",
    diagnostic: "Plenitude pÃ³s-prandial incÃ´moda, saciedade precoce, dor ou queimaÃ§Ã£o epigÃ¡strica sem evidÃªncia de doenÃ§a estrutural na ausÃªncia de sinais de alarme.",
    alarm: "Perda ponderal inexplicÃ¡vel, vÃ´mitos incoercÃ­veis, anemia, disfagia, massa abdominal palpÃ¡vel ou idade de inÃ­cio > 50 anos: encaminhar para Endoscopia Digestiva Alta (EDA) de urgÃªncia para afastar neoplasia gÃ¡strica ou Ãºlcera perfurada.",
    treatment: [
      {
        title: "1Âª Linha - Bloqueador de Ãcido (IBP) e EducaÃ§Ã£o DietÃ©tica",
        desc: "Prescrever Omeprazol 20mg VO ao dia pela manhÃ£, rigorosamente em jejum (30 min antes do cafÃ©), por 4 a 8 semanas seguidas. Orientar rotina: limitaÃ§Ã£o estrita de alimentos Ã¡cidos, condimentados, frituras, refrigerantes, bebida alcoÃ³lica e restriÃ§Ã£o de uso inadequado de AINEs."
      },
      {
        title: "2Âª Linha - Coadjuvantes CinÃ©ticos e InvestigaÃ§Ã£o de H. Pylori / Antidepressivo TricÃ­clico",
        desc: "Se plenitude gÃ¡strica marcada com nÃ¡useas associadas: adicionar Bromoprida 10mg VO atÃ© de 8/8h antes das refeiÃ§Ãµes por 10 dias. Casos funcionais refratÃ¡rios sem causa anatÃ´mica e pesquisa de H. Pylori negativa respondem muito bem ao uso de Amitriptilina 12.5mg a 25mg VO ao deitar."
      }
    ]
  },
  {
    id: "micoses",
    name: "Dermatofitoses e Micoses de Pele (TÃ­neas)",
    category: "Pele & Dermatologia",
    diagnostic: "LesÃµes descamativas na pele com bordas eritematosas, ativas e elevadas, pruriginosas (placas anulares). Podem acometer corpo (Tinea corporis), pÃ©s (Tinea pedis - pÃ© de atleta) ou virilha (Tinea cruris).",
    alarm: "Sinais de infecÃ§Ã£o bacteriana secundÃ¡ria (celulite associada, calor extremo local, presenÃ§a de pus ou febre sistÃªmica): tratar com antibiÃ³ticos sistÃªmicos orais.",
    treatment: [
      {
        title: "1Âª Linha - AntifÃºngicos TÃ³picos de ExtensÃ£o Limitada",
        desc: "Aplicar Nitrato de Miconazol creme vaginal/tÃ³pico a 2% ou Isoconazol creme 2 vezes ao dia por 2 a 4 semanas. Orientar manter a Ã¡rea extensamente limpa e seca apÃ³s o banho, utilizando toalha exclusiva para a lesÃ£o de modo a obstar disseminaÃ§Ã£o para outras dobras corporais."
      },
      {
        title: "2Âª Linha - AntifÃºngicos AntifÃºngicos Orais SistÃªmicos",
        desc: "Indicado se lesÃµes disseminadas, multiplas ou onicomicose severa: prescrever Fluconazol 150mg VO, 1 comprimido por semana por 2 a 4 semanas (na micose de pele) ou Itraconazol 100mg VO ao dia por atÃ© 12 semanas (unha/onicomicose). Monitorar TGO/TGP se uso >4 semanas."
      }
    ]
  },
  {
    id: "ansiedade",
    name: "Ansiedade e Transtorno de Ansiedade Generalizada (TAG)",
    category: "Outros",
    diagnostic: "Ansiedade e preocupaÃ§Ã£o excessivas, na maioria dos dias, por pelo menos 6 meses, difÃ­ceis de controlar. Associada a cansaÃ§o fÃ¡cil, tensÃ£o muscular, irritabilidade e insÃ´nia. Aplicar escore GAD-7 na UBS.",
    alarm: "PresenÃ§a de graves episÃ³dios de pÃ¢nico associados a sintomas simulando infarto agudo (sintomatologia adrenÃ©rgica expressiva) ou ideaÃ§Ã£o de autolesÃ£o - acionar rastreamento seguro de apoio social/familiar e agendar retorno precoce ou psiquiatria.",
    treatment: [
      {
        title: "1Âª Linha - Inibidores Seletivos da RecaptaÃ§Ã£o de Serotonina (ISRS) e Higiene Mental",
        desc: "Prescrever Sertralina 25mg a 50mg VO ao dia (otimizar atÃ© 100mg a 200mg se necessÃ¡rio) ou Fluoxetina 20mg ao dia pela manhÃ£. Explicar detidamente que a resposta benÃ©fica ocorre de forma gradual somente apÃ³s a 3Âª ou 4Âª semana e que pode haver piora paradoxal inicial leve."
      },
      {
        title: "2Âª Linha - TransiÃ§Ã£o para Dual / BenzodiazepÃ­nicos em Uso Estritamente Terminado",
        desc: "Se falha documentada apÃ³s 8 semanas em dose mÃ¡xima e correta adesÃ£o: substituir por Cloridrato de Venlafaxina XR 75mg VO ao dia. O uso de Clonazepam 0.5mg a 1mg VO ou Diazepam 5mg a 10mg ao deitar serve estritamente para o manejo de crises agudas paroxÃ­sticas no inÃ­cio, limitando a no mÃ¡ximo 2 a 4 semanas."
      }
    ]
  },
  {
    id: "depressao",
    name: "DepressÃ£o Unipolar Leve a Moderada",
    category: "Outros",
    diagnostic: "PresenÃ§a de humor deprimido e/ou anedonia (perda de interesse/prazer) por pelo menos 2 semanas, associados a distÃºrbios de sono, fadiga, sentimentos de culpa e dificuldade de foco. Utilizar escore PHQ-9 na UBS.",
    alarm: "IdeaÃ§Ã£o suicida ativa com planejamento formulado: encaminhamento de emergÃªncia em saÃºde mental (CAPS III, UPA ou Pronto Socorro psiquiÃ¡trico) imediatamente sob supervisÃ£o familiar.",
    treatment: [
      {
        title: "1Âª Linha - Antidepressivos de Primeira Escolha (SUS) + Psicoterapia",
        desc: "Introduzir Sertralina 50mg VO pela manhÃ£ (titular atÃ© 150mg se refratariedade) ou Fluoxetina 20mg VO. Manter o tratamento por pelo menos 6 a 9 meses apÃ³s a remissÃ£o total dos sintomas clÃ­nicos para prevenir recidivas graves."
      },
      {
        title: "2Âª Linha - TricÃ­clicos SecundÃ¡rios ou ISRSN (Duais)",
        desc: "Em caso de falha terapÃªutica ou intolerÃ¢ncia aos ISRS: prescrever Amitriptilina 25mg VO Ã  noite, titulado lentamente atÃ© 75mg a 150mg/dia (ideal se insÃ´nia marcada e ausÃªncia de cardiopatia pelo risco de alargamento de QT), ou encaminhar para inÃ­cio de Cloridrato de Duloxetina 30mg a 60mg VO ao dia."
      }
    ]
  },
  {
    id: "has",
    name: "HipertensÃ£o Arterial SistÃªmica (HAS)",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "PressÃ£o arterial de consultÃ³rio â‰¥ 140x90 mmHg aferida em duas ou mais ocasiÃµes, ou via monitoramento residencial (MRPA/MAPA) com valores mÃ©dios â‰¥ 130x80 mmHg.",
    alarm: "Crise Hipertensiva de EmergÃªncia (PA â‰¥ 180x120 mmHg com sintomas neurolÃ³gicos agudos, dor torÃ¡cica opressiva, dispneia sÃºbita): suspeita de AVC, Infarto ou Edema Agudo de PulmÃ£o. Encaminhar para emergÃªncia mÃ©dica imediata com suporte de oxigÃªnio.",
    treatment: [
      {
        title: "1Âª Linha - AssociaÃ§Ã£o TerapÃªutica Dupla Inicial (SUS - Diretriz Brasileira)",
        desc: "HipertensÃ£o estÃ¡gio 1 moderada/estÃ¡gio 2 requer inÃ­cio clÃ¡ssico de monoterapia apenas em idosos frÃ¡geis. Demais pacientes devem iniciar terapia dupla sinÃ©rgica: Losartana 50mg VO pela manhÃ£ associado a Hidroclorotiazida 25mg VO ao dia, ou Enalapril 10mg VO de 12/12h associado a Hidroclorotiazida 25mg pela manhÃ£."
      },
      {
        title: "2Âª Linha - OtimizaÃ§Ã£o com Anlodipino e Quarto EscalÃ£o (Espironolactona)",
        desc: "Se controle tensional refratÃ¡rio: elevar Losartana para 50mg VO de 12/12h e associar Bloqueador de Canais de CÃ¡lcio: Besilato de Anlodipino 5mg a 10mg VO ao dia. Se persistÃªncia (HipertensÃ£o Resistente com 3 drogas), acrescentar Espironolactona 25mg VO ao dia como quarta linha e pesquisar causas secundÃ¡rias de hipertensÃ£o."
      }
    ]
  },
  {
    id: "dm2",
    name: "Diabetes Mellitus Tipo 2 (DM2)",
    category: "MetabÃ³licas/EndÃ³crinas",
    diagnostic: "Glicemia de jejum â‰¥ 126 mg/dL (confirmada), Glicemia pÃ³s-sobrecarga 75g dextrosol â‰¥ 200 mg/dL, ou Hemoglobina Glicada (HbA1c) â‰¥ 6.5%.",
    alarm: "Sintomas exuberantes de cetoacidose diabÃ©tica ou estado hiperosmolar (confusÃ£o mental, nÃ¡useas/vÃ´mitos intensos, fadiga extrema e dor abdominal com glicemia capilar > 250 mg/dL ou marcada por cetonÃºria): encaminhar imediatamente ao PS.",
    treatment: [
      {
        title: "1Âª Linha - Metformina Otimizada e iSGLT2 com ProteÃ§Ã£o Renal/Cardiovascular",
        desc: "Iniciar Metformina 500mg a 850mg VO de 12/12h junto com as principais refeiÃ§Ãµes. Se o paciente possui doenÃ§a renal crÃ´nica estabelecida (TFG < 60) ou insuficiÃªncia cardÃ­aca de base: prescrever Dapagliflozina 10mg VO ao dia associado de imediato (iSGLT2 de alta proteÃ§Ã£o orgÃ¢nica disponÃ­vel no SUS)."
      },
      {
        title: "2Âª Linha - AssociaÃ§Ã£o de Gliclazida MR ou InsulinizaÃ§Ã£o NPH Inicial ao Deitar",
        desc: "Se HbA1c refratÃ¡ria persistente alta: associar Gliclazida MR 30mg a 60mg VO pela manhÃ£. Se a glicemia de jejum se mantÃ©m refratÃ¡ria e hÃ¡ sinais de catabolismo (perda de peso rÃ¡pida/poliÃºria): introduzir Insulina NPH subcutÃ¢nea Ã  noite ao deitar (dose inicial segura de 10 UI, titulando de 2 em 2 UI conforme glicemia de jejum)."
      }
    ]
  },
  {
    id: "itu",
    name: "InfecÃ§Ã£o do Trato UrinÃ¡rio Baixo (Cistite Aguda)",
    category: "Infecciosas/Endemias",
    diagnostic: "DisÃºria (dor/ardor ao urinar), polaciÃºria (aumento da frequÃªncia), urgÃªncia urinÃ¡ria e dor suprapÃºbica. O diagnÃ³stico Ã© estritamente clÃ­nico em mulheres jovens sem comorbidades (dispensa EAS/Urocultura inicial).",
    alarm: "Febre alta (>38ÂºC), calafrios, nÃ¡useas/vÃ´mitos e dor em flanco com sinal de Giordano positivo (punho-percussÃ£o lombar dolorosa): suspeita de Pielonefrite. Tratamento preferencialmente hospitalar ou ambulatorial assistido.",
    treatment: [
      {
        title: "1Âª Linha - Antissepsia UrinÃ¡ria de Escolha / Monodose Altamente Eficaz",
        desc: "Prescrever NitrofurantoÃ­na (Macrodantina) 100mg VO de 6/6h por 5 dias consecutivos, ou prescrever Fosfomicina Trometamol 3g sachÃª (Monuril), dose Ãºnica dissolvida em Ã¡gua Ã  noite antes de deitar-se. Estimular copiosa hidrataÃ§Ã£o."
      },
      {
        title: "2Âª Linha - Crossover AntibiÃ³tico de Reserva SistÃªmica",
        desc: "Em gestantes, idosos ou se intolerÃ¢ncia de primeira linha: prescrever Cefalexina 500mg VO de 6/6h por 7 dias inteiros. Se padrÃ£o de alta resistÃªncia regional Ã s linhas bÃ¡sicas e urocultura confirmando sensibilidade: prescrever Ciprofloxacino 500mg VO de 12/12h por 3 dias completos (evitar uso indiscriminado)."
      }
    ]
  },
  {
    id: "ivas",
    name: "Resfriado Comum e Rinossinusite Aguda",
    category: "RespiratÃ³rio",
    diagnostic: "Coriza lÃ­quida ou purulenta, obstruÃ§Ã£o nasal, espirros, odinofagia leve e tosse protetora. A sinusite bacteriana Ã© sugerida se persistÃªncia >10 dias sem melhoras, piora abrupta apÃ³s melhora inicial, ou dor facial maxilar unilateral pulsÃ¡til severa por >3 dias.",
    alarm: "Edema ou eritema periorbital (celulite orbitÃ¡ria), diplopia, dor extrema de cabeÃ§a com rigidez nucal ou febre alta refratÃ¡ria: internaÃ§Ã£o de emergÃªncia para exames de imagem e antibioticoterapia venosa.",
    treatment: [
      {
        title: "1Âª Linha - Lavagem Nasal Exaustiva e SintomÃ¡ticos S.O.S (Resfriado Viral)",
        desc: "Terapia estritamente sintomÃ¡tica (antibiÃ³ticos nÃ£o funcionam em resfriado ou sinusite aguda viral): prescrever lavagem nasal exaustiva com Soro FisiolÃ³gico 0.9% morno (10-20ml em seringa em cada narina vÃ¡rias vezes ao dia). Prescrever Dipirona 1g de 6/6h ou Ibuprofeno 400mg VO para cefaleia e febre."
      },
      {
        title: "2Âª Linha - Antibioticoterapia SistÃªmica Direcionada (CritÃ©rio Bacteriano)",
        desc: "Indicado apenas se febre alta prolongada por > 3 dias associada a dor facial unilateral intensa pulsÃ¡til e coriza densamente purulenta (sugerindo sinusite bacteriana): prescrever Amoxicilina 500mg VO de 8/8h por 7 a 10 dias inteiros. Se histÃ³rico de uso de beta-lactÃ¢mico recente, optar por Amoxicilina + Clavulanato 500/125mg de 8/8h."
      }
    ]
  },
  {
    id: "icc",
    name: "InsuficiÃªncia CardÃ­aca CrÃ´nica (ICC)",
    category: "Outros",
    diagnostic: "Dispneia de esforÃ§o progressiva, ortopneia (falta de ar ao deitar), dispneia paroxÃ­stica noturna, estase de jugulares a 45Âº e edema simÃ©trico de membros inferiores de carÃ¡ter gravitativo. DiagnÃ³stico por critÃ©rios clÃ­nicos de Framingham ratificado por Ecocardiograma com FraÃ§Ã£o de EjeÃ§Ã£o.",
    alarm: "Dispneia grave em repouso com taquipneia evidente, ansiedade extrema, estertores pulmonares crepitantes atÃ© terÃ§o mÃ©dio e expectoraÃ§Ã£o rosÃ¡cea bolhosa: Edema Agudo de PulmÃ£o (EAP/ICC Descompensada). Chamar unidade mÃ³vel e transferir imediatamente para PS com urgÃªncia.",
    treatment: [
      {
        title: "1Âª Linha - Triplo/QuÃ¡druplo Bloqueio Neuro-Hormonal de SobrevivÃªncia (SBC)",
        desc: "Instituir terapia modificadora de sobrevida: Enalapril 5mg a 10mg VO de 12/12h (ou Losartana 50mg se tosse secundÃ¡ria) associado a Carvedilol 6.25mg VO de 12/12h (titular progressivamente quinzenal atÃ© tolerÃ¢ncia ou FC alvo ~60-65) somado a antagonista de aldosterona: Espironolactona 25mg VO ao dia. Dapagliflozina 10mg VO ao dia Ã© de utilidade crucial."
      },
      {
        title: "2Âª Linha - Controle de Sintomas VolÃªmicos e Digoxina Coadjuvante",
        desc: "Para alÃ­vio de sintomas de congestÃ£o crÃ´nica (edema de pernas, ascite): prescrever Furosemida 40mg VO pela manhÃ£ (titular dose de acordo com peso diÃ¡rio do doador). Se fraÃ§Ã£o de ejeÃ§Ã£o muito deprimida (<35%) com ritmo sinusal e sintomas refratÃ¡rios: associar Digoxina 0.125mg a 0.25mg VO ao dia."
      }
    ]
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite e Osteoartrose (Artrose articular)",
    category: "Outros",
    diagnostic: "Dor articular mecÃ¢nica (piora com carga ou movimento, alivia com repouso absoluto), rigidez articular matinal de curta duraÃ§Ã£o (< 30 minutos), limitaÃ§Ã£o funcional e crepitaÃ§Ãµes na mobilizaÃ§Ã£o. Comum em joelhos, quadris e mÃ£os.",
    alarm: "ArticulaÃ§Ã£o quente, edemaciada, com eritema evidente e febre sistÃªmica associada: suspeita de Artrite SÃ©ptica. Encaminhar imediatamente para punÃ§Ã£o articular diagnÃ³stica de emergÃªncia.",
    treatment: [
      {
        title: "1Âª Linha - EducaÃ§Ã£o FÃ­sica ErgonomÃ©trica e AnalgÃ©sicos Simples de HorÃ¡rio",
        desc: "Prescrever fortalecimento quadricipital isomÃ©trico preventivo de impacto e controle ponderal para diminuiÃ§Ã£o de desgaste por carga. SintomÃ¡tico de horÃ¡rio: Dipirona 1g VO ou Paracetamol 750mg em horÃ¡rios de maior dor articular, limitando o uso de comprimidos. Evitar AINEs orais pelo altÃ­ssimo risco renal."
      },
      {
        title: "2Âª Linha - Anti-inflamatÃ³rios TÃ³picos / Condroprotetores Auxiliares / DiacereÃ­na",
        desc: "Para articulaÃ§Ãµes perifÃ©ricas fÃ¡ceis de palpar (joelhos e mÃ£os), priorizar Diclofenaco DietilamÃ´nio gel 1%, massagear o local 3 a 4x/dia. Se dor refratÃ¡ria de carÃ¡ter crÃ³nico nociceptivo, associar DiacereÃ­na 50mg VO ao dia pÃ³s refeiÃ§Ãµes ou pÃ³ de Condroitina 1200mg + Glucosamina 1500mg para efeitos tardios de amortecimento."
      }
    ]
  },
  {
    id: "venosa",
    name: "InsuficiÃªncia Venosa CrÃ´nica (Varizes de Membros Inferiores)",
    category: "Outros",
    diagnostic: "SensaÃ§Ã£o de peso, queimaÃ§Ã£o, cansaÃ§o ou dor nas pernas ao final do dia. PresenÃ§a de edema vespertino maleolar, telangiectasias, veias varicosas tortuosas ou hiperpigmentaÃ§Ã£o ocre na pele distal.",
    alarm: "InÃ­cio sÃºbito de edema assimÃ©trico unilateral exuberante em uma das panturrilhas, acompanhado de dor forte local: forte suspeita de Trombose Venosa Profunda (TVP). Encaminhar ao PS para Doppler venoso urgente.",
    treatment: [
      {
        title: "1Âª Linha - Higiene de Retorno Venoso e Meias de CompressÃ£o ElÃ¡stica",
        desc: "Evitar de pÃ© ou assentado por perÃ­odos >2h. Realizar repousos com as pernas suspensas acima da altura do esterno por 20 minutos, 3x ao dia. Prescrever e ensinar o uso diÃ¡rio de Meias de CompressÃ£o ElÃ¡stica Graduada (mÃ©dia compressÃ£o, ex: 20-30 mmHg) vestidas imediatamente ao levantar-se."
      },
      {
        title: "2Âª Linha - Bioflavonoides VenotÃ´nicos Coadjuvantes",
        desc: "Indicados para alÃ­vio sintomÃ¡tico de dores incapacitantes e do peso residual persistente mesmo com repouso postural: prescrever Diosmina 450mg + Hesperidina 50mg (ou formulaÃ§Ãµes de 1000mg) VO pela manhÃ£ em dose Ãºnica diÃ¡ria por cursos de atÃ© 3-6 meses."
      }
    ]
  },
  {
    id: "cefaleiastens",
    name: "Cefaleia Tensional e Enxaqueca (MigrÃ¢nea)",
    category: "Outros",
    diagnostic: "Cefaleia Tensional: dor holocraniana em aperto ou pressÃ£o, bilateral, opressiva, leve a moderada. Enxaqueca: dor pulsÃ¡til, unilateral, moderada a severa, associada a irritabilidade com luz (fotofobia), som (fonofobia) e nÃ¡useas.",
    alarm: "InÃ­cio explosivo e sÃºbito da dor ('pior cefaleia da vida' em segundos), associado a febre, rigidez de nuca, confusÃ£o mental, dÃ©ficit focal motor ou inÃ­cio apÃ³s os 50 anos: encaminhar imediatamente para tomografia computadorizada cerebral (excluir hemorragia subaracnÃ³idea, meningite ou tumor).",
    treatment: [
      {
        title: "1Âª Linha - Aborte Agudo Simples e Profilaxia de Base com TricÃ­clicos",
        desc: "Crise Ã¡lgica: Dipirona 1g VO ou Ibuprofeno 600mg associado precoce. Se crises recorrentes (>3/mÃªs): prescrever profilaxia diÃ¡ria regular com Amitriptilina 25mg VO ao deitar-se (titular atÃ© 50mg conforme tolerabilidade clÃ­nica) ou Propranolol 40mg VO de 12/12h."
      },
      {
        title: "2Âª Linha - Abortivos Triptanos e Profilaxia com Topiramato",
        desc: "Crise severa resistente de enxaqueca: prescrever Succinato de Sumatriptana 50mg ou 100mg VO dose Ãºnica no inÃ­cio da crise. Para profilaxia alternativa quando hÃ¡ contraindicaÃ§Ã£o ao betabloqueador: prescrever profilaxia crÃ´nica com Topiramato 25mg Ã  noite, titulado atÃ© 50mg a 100mg VO diÃ¡rios."
      }
    ]
  },
  {
    id: "vaginoses",
    name: "CandidÃ­ase Vulvovaginal e Vaginose Bacteriana",
    category: "Pele & Dermatologia",
    diagnostic: "CandidÃ­ase: prurido vulvovaginal intenso, ardor, corrimento esbranquiÃ§ado grumoso sem cheiro (leite qualhado) e hiperemia. Vaginose: corrimento cinza ou amarelado fluido com odor fÃ©tido (peixe podre), mais proeminente apÃ³s coito.",
    alarm: "Aparecimento de febre alta, dor Ã  mobilizaÃ§Ã£o do colo uterino no exame especular ou dor em fossas ilÃ­acas bilaterais persistente (DIP - DoenÃ§a InflamatÃ³ria PÃ©lvica): iniciar antibiÃ³ticos sistÃªmicos de largo espectro (Ceftriaxona IM + Doxiciclina) e reavaliar de perto.",
    treatment: [
      {
        title: "1Âª Linha - Creme Vaginal Direcionado Local (SUS)",
        desc: "CANDIDÃASE: Nitrato de Miconazol creme vaginal a 2%, aplicar 1 aplicador preenchido profundamente via vaginal Ã  noite ao deitar-se, por 7 noites consecutivas. VAGINOSE: Metronidazol gel vaginal 1 aplicador preenchido via vaginal Ã  noite deitado por 5 noites seguidas."
      },
      {
        title: "2Âª Linha - Tratamento SistÃªmico Oral / CandidÃ­ase Recorrente",
        desc: "Se recusa ou impossibilidade de uso de via tÃ³pica: CANDIDÃASE: Fluconazol 150mg VO dose Ãºnica (se recidivas frequentes: Fluconazol 150mg semanal por 6 semanas). VAGINOSE: Metronidazol 250mg VO, prescrever 2 comprimidos VO de 12/12h por 7 dias (orientar abstinÃªncia absoluta de Ã¡lcool durante o curso terapÃªutico)."
      }
    ]
  },
  {
    id: "verminose",
    name: "Parasitoses Intestinais / Verminoses",
    category: "Gastrointestinal",
    diagnostic: "Prurido anal noturno, epigastralgia ou nÃ¡useas inexplicÃ¡veis. PresenÃ§a de prurido nasal/anal ou eliminaÃ§Ã£o eventual de parasitas nas fezes (altamente sugestivo de EnterobÃ­ase/OxiurÃ­ase).",
    alarm: "PresenÃ§a de eliminaÃ§Ã£o em massa de vermes na boca/nariz ou sinais de suboclusÃ£o intestinal (vÃ´mitos feculoides, parada de eliminaÃ§Ã£o de gases/fezes, distensÃ£o abdominal severa): sinal de obstruÃ§Ã£o por bolo de Ascaris. Tratamento cirÃºrgico ou Piperazina urgente.",
    treatment: [
      {
        title: "Esquema EmpÃ­rico Geral ou Direcionado",
        desc: "Albendazol 400mg VO, dose Ãºnica (em maiores de 2 anos). Para GiardÃ­ase ou AmebÃ­ase: prescrever Secnidazol 2g VO, dose Ãºnica Ã  noite para adultos."
      },
      {
        title: "Tratamento de OxiurÃ­ase (EnterobÃ­ase - Familiar)",
        desc: "Mebendazol 100mg VO de 12/12h por 3 dias consecutivos. Tratar TODOS os membros coabitantes e repetir a dose apÃ³s 14 dias para evitar reinfecÃ§Ãµes por ovos viÃ¡veis."
      }
    ]
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite e Osteoartrose (Artrose articular)",
    category: "Outros",
    diagnostic: "Dor articular mecÃ¢nica (piora com carga ou movimento, alivia com repouso absoluto), rigidez articular matinal de curta duraÃ§Ã£o (< 30 minutos), limitaÃ§Ã£o funcional e crepitaÃ§Ãµes na mobilizaÃ§Ã£o. Comum em joelhos, quadris e mÃ£os.",
    alarm: "ArticulaÃ§Ã£o quente, edemaciada, com eritema evidente e febre sistÃªmica associada: suspeita de Artrite SÃ©ptica. Encaminhar imediatamente para punÃ§Ã£o articular diagnÃ³stica de emergÃªncia.",
    treatment: [
      {
        title: "Medidas NÃ£o FarmacolÃ³gicas de Longo Prazo",
        desc: "Fortalecimento muscular isomÃ©trico direcionado (gabarito de quadrÃ­ceps para joelho), controle ponderal rigoroso para diminuir estresse articular, e atividade fÃ­sica sem impacto como hidroginÃ¡stica."
      },
      {
        title: "Terapia AnalgÃ©sica e Diretriz de AINEs",
        desc: "Paracetamol 500mg a 750mg ou Dipirona 1g em horÃ¡rios de dor, limitando a 3g/dia. Evitar uso prolongado ou contÃ­nuo de AINEs (Ibuprofeno, Nimesulida) pelo altÃ­ssimo risco de lesÃ£o renal e hemorragia digestiva em idosos."
      }
    ]
  },
  {
    id: "venosa",
    name: "InsuficiÃªncia Venosa CrÃ´nica (Varizes de Membros Inferiores)",
    category: "Outros",
    diagnostic: "SensaÃ§Ã£o de peso, queimaÃ§Ã£o, cansaÃ§o ou dor nas pernas ao final do dia. PresenÃ§a de edema vespertino maleolar, telangiectasias, veias varicosas tortuosas ou hiperpigmentaÃ§Ã£o ocre na pele distal.",
    alarm: "InÃ­cio sÃºbito de edema assimÃ©trico unilateral exuberante em uma das panturrilhas, acompanhado de dor forte local: forte suspeita de Trombose Venosa Profunda (TVP). Encaminhar ao PS para Doppler venoso urgente.",
    treatment: [
      {
        title: "Higiene Venosa Comportamental (ObrigatÃ³ria)",
        desc: "Evitar permanecer em pÃ© ou sentado por mais de 1-2 horas seguidas. Elevar as pernas acima do nÃ­vel do coraÃ§Ã£o por 15-20 minutos, 3x ao dia. Uso diÃ¡rio de meias de compressÃ£o elÃ¡stica de mÃ©dia compressÃ£o (20-30 mmHg) ao levantar."
      },
      {
        title: "AuxÃ­lio FarmacolÃ³gico para AlÃ­vio SintomÃ¡tico",
        desc: "Diosmina + Hesperidina (450/50mg) 1 a 2 comprimidos VO ao dia. AtenÃ§Ã£o: medicaÃ§Ã£o sintomÃ¡tica auxiliar, nÃ£o previne varizes nem substitui compressÃ£o elÃ¡stica ou cirurgia venosa."
      }
    ]
  },
  {
    id: "cefaleiastens",
    name: "Cefaleia Tensional e Enxaqueca (MigrÃ¢nea)",
    category: "Outros",
    diagnostic: "Cefaleia Tensional: dor holocraniana em aperto ou pressÃ£o, bilateral, opressiva, leve a moderada. Enxaqueca: dor pulsÃ¡til, unilateral, moderada a severa, associada a irritabilidade com luz (fotofobia), som (fonofobia) e nÃ¡useas.",
    alarm: "InÃ­cio explosivo e sÃºbito da dor ('pior cefaleia da vida' em segundos), associado a febre, rigidez de nuca, confusÃ£o mental, dÃ©ficit focal motor ou inÃ­cio apÃ³s os 50 anos: encaminhar imediatamente para tomografia computadorizada cerebral (excluir hemorragia subaracnÃ³idea, meningite ou tumor).",
    treatment: [
      {
        title: "Tratamento Abortivo da Crise de Dor",
        desc: "Dipirona 1g VO ou Ibuprofeno 400-600mg VO logo no inÃ­cio dos sintomas. Se enxaqueca refratÃ¡ria com nÃ¡usea, associar Metoclopramida 10mg VO e Sumatriptana 50mg VO (contraindicado em coronariopatias)."
      },
      {
        title: "Tratamento ProfilÃ¡tico e Higiene de Gatilhos",
        desc: "Indicado se >3 crises por mÃªs. Amitriptilina 25mg Ã  noite ou Propranolol 40mg VO de 12/12h. Orientar higiene do sono, limitaÃ§Ã£o de cafeÃ­na/analgÃ©sicos de abuso, e diÃ¡rio da cefaleia."
      }
    ]
  },
  {
    id: "vaginoses",
    name: "CandidÃ­ase Vulvovaginal e Vaginose Bacteriana",
    category: "Pele & Dermatologia",
    diagnostic: "CandidÃ­ase: prurido vulvovaginal intenso, ardor, corrimento esbranquiÃ§ado grumoso sem cheiro (leite qualhado) e hiperemia. Vaginose: corrimento cinza ou amarelado fluido com odor fÃ©tido (peixe podre), mais proeminente apÃ³s coito.",
    alarm: "Aparecimento de febre alta, dor Ã  mobilizaÃ§Ã£o do colo uterino no exame especular ou dor em fossas ilÃ­acas bilaterais persistente (DIP - DoenÃ§a InflamatÃ³ria PÃ©lvica): iniciar antibiÃ³ticos sistÃªmicos de largo espectro (Ceftriaxona IM + Doxiciclina) e reavaliar de perto.",
    treatment: [
      {
        title: "CandidÃ­ase Vulvovaginal - Abordagem (SUS)",
        desc: "Miconazol creme vaginal a 2%, aplicar 1 aplicador totalmente preenchido via vaginal Ã  noite ao deitar, por 7 dias seguidos. Alternativa oral: Fluconazol 150mg VO dose Ãºnica."
      },
      {
        title: "Vaginose Bacteriana - Abordagem (SUS)",
        desc: "Metronidazol gel vaginal a 0.75%, aplicar 1 aplicador cheio via vaginal por 5 noites. Alternativa oral: Metronidazol 250mg, 2 comprimidos VO de 12/12h por 7 dias (orientar abstinÃªncia alcoÃ³lica absoluto devido ao efeito dissulfiram)."
      }
    ]
  }
];

const DISEASE_TO_SUMMARY_MAP: Record<string, string[]> = {
  has: ["InsuficiÃªncia CardÃ­aca (IC)", "FibrilaÃ§Ã£o Atrial (FA)", "Abordagem da Dor TorÃ¡cica"],
  dm2: ["Diabetes Mellitus: DiagnÃ³stico", "Cetoacidose DiabÃ©tica (CAD)"],
  dislip: ["InsuficiÃªncia CardÃ­aca (IC)", "Abordagem da Dor TorÃ¡cica"],
  drge: ["Hemorragia Digestiva Alta (HDA)"],
  gastrite: ["Hemorragia Digestiva Alta (HDA)"],
  hipo: ["Hipotireoidismo"],
  asma: ["Asma BrÃ´nquica: Crise Aguda"],
  dpoc: ["SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo"],
  pac: ["Pneumonia ComunitÃ¡ria", "SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo"],
  itu: ["Sepse (Sepsis-3)"],
  pielonefrite: ["Sepse (Sepsis-3)"],
  anemia: ["Anemias MicrocÃ­ticas"],
  depressao: ["AgitaÃ§Ã£o Psicomotora"],
  crise_panico: ["AgitaÃ§Ã£o Psicomotora"],
  gota: ["Gota (Artrite Gotosa)"],
  "artrite-reuma": ["Artrite Reumatoide", "LÃºpus Eritematoso SistÃªmico (LES)"],
  varizes: ["Tromboembolismo Pulmonar (TEP)"],
  "ulcera-venosa": ["Tromboembolismo Pulmonar (TEP)"],
  vaginoses: ["Vaginites e Vaginose"],
  sifilis: ["Vaginites e Vaginose"],
  corrimento_uretral: ["Vaginites e Vaginose"],
  crise_epiletica: ["AgitaÃ§Ã£o Psicomotora", "Delirium no Idoso"],
  oma: ["Pneumonia ComunitÃ¡ria"],
  sinusite: ["Pneumonia ComunitÃ¡ria"],
  amigdalite: ["Pneumonia ComunitÃ¡ria"],
  verminose: ["Anemias MicrocÃ­ticas"],
  ansiedade: ["AgitaÃ§Ã£o Psicomotora"],
  insonia: ["Delirium no Idoso", "AgitaÃ§Ã£o Psicomotora"],
  lombalgia: ["Gota (Artrite Gotosa)", "Artrite Reumatoide"],
  osteoartrite: ["Artrite Reumatoide", "Gota (Artrite Gotosa)"],
  eczema: ["Escabiose"],
  escabiose: ["Escabiose"],
  micose: ["Vaginites e Vaginose"],
  constipacao: ["Cirrose: ComplicaÃ§Ãµes"],
  diarreia: ["Planos de HidrataÃ§Ã£o (Plano A, B e C)", "DesnutriÃ§Ã£o e Choque"],
  cefaleiastens: ["AVC IsquÃªmico vs HemorrÃ¡gico"],
  tabac: ["Tromboembolismo Pulmonar (TEP)", "SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo", "Abordagem da Dor TorÃ¡cica"],
  dengue: ["Sepse (Sepsis-3)"],
  tuberculose: ["Pneumonia ComunitÃ¡ria"],
  hanseniase: ["LÃºpus Eritematoso SistÃªmico (LES)", "Artrite Reumatoide"],
  insufcard: ["InsuficiÃªncia CardÃ­aca (IC)", "FibrilaÃ§Ã£o Atrial (FA)", "Abordagem da Dor TorÃ¡cica"],
  "fib-atrial": ["FibrilaÃ§Ã£o Atrial (FA)", "InsuficiÃªncia CardÃ­aca (IC)", "AVC IsquÃªmico vs HemorrÃ¡gico"],
  doencarenal: ["DoenÃ§a Renal CrÃ´nica (DRC)", "DistÃºrbios do PotÃ¡ssio"],
  "hep-cronicas": ["Cirrose: ComplicaÃ§Ãµes", "Hemorragia Digestiva Alta (HDA)"],
  "hiper-tireo": ["FibrilaÃ§Ã£o Atrial (FA)", "Hipotireoidismo"],
  labirintite: ["AVC IsquÃªmico vs HemorrÃ¡gico"],
  "litiase-renal": ["DistÃºrbios do PotÃ¡ssio", "DoenÃ§a Renal CrÃ´nica (DRC)"],
  celulite: ["Sepse (Sepsis-3)"],
  hzoster: ["Farmacodermias Graves"],
  impetigo: ["Pneumonia ComunitÃ¡ria"],
  colelitiase: ["Hemorragia Digestiva Alta (HDA)"],
  apendicite: ["Sepse (Sepsis-3)"],
  epilepsia: ["AgitaÃ§Ã£o Psicomotora", "Delirium no Idoso"],
  "cistite-rec": ["Sepse (Sepsis-3)", "Vaginites e Vaginose"],
  "gastro-desidrat": ["Planos de HidrataÃ§Ã£o (Plano A, B e C)", "DesnutriÃ§Ã£o e Choque"],
  escarlatina: ["Pneumonia ComunitÃ¡ria"],
  leptospirose: ["Sepse (Sepsis-3)"],
  parkinson: ["Delirium no Idoso", "AgitaÃ§Ã£o Psicomotora"],
  "dermatite-seb": ["Escabiose"],
  "faringite-strep": ["Pneumonia ComunitÃ¡ria"],
  urolitiase: ["DoenÃ§a Renal CrÃ´nica (DRC)"],
  erisipela: ["Sepse (Sepsis-3)"],
  peconhentos: ["Sepse (Sepsis-3)", "Planos de HidrataÃ§Ã£o (Plano A, B e C)"],
  hpb: ["DoenÃ§a Renal CrÃ´nica (DRC)"],
  iam: ["Abordagem da Dor TorÃ¡cica", "InsuficiÃªncia CardÃ­aca (IC)"],
  cad: ["Cetoacidose DiabÃ©tica (CAD)", "Diabetes Mellitus: DiagnÃ³stico"],
  anafilaxia: ["Anafilaxia", "Choque: ClassificaÃ§Ã£o e Manejo"],
  sepse: ["Sepse (Sepsis-3)", "Choque: ClassificaÃ§Ã£o e Manejo"],
  endocardite: ["Endocardite Infecciosa", "InsuficiÃªncia CardÃ­aca (IC)"],
  sdra: ["SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo", "Asma BrÃ´nquica: Crise Aguda"],
  choque: ["Choque: ClassificaÃ§Ã£o e Manejo", "Planos de HidrataÃ§Ã£o (Plano A, B e C)"],
  agitacao: ["AgitaÃ§Ã£o Psicomotora", "Delirium no Idoso"],
  hda: ["Hemorragia Digestiva Alta (HDA)", "Cirrose: ComplicaÃ§Ãµes"],
  cirrose: ["Cirrose: ComplicaÃ§Ãµes", "Hemorragia Digestiva Alta (HDA)"],
  avc: ["AVC IsquÃªmico vs HemorrÃ¡gico", "Delirium no Idoso"],
  delirium: ["Delirium no Idoso", "AgitaÃ§Ã£o Psicomotora"],
  exacerbacao_asma: ["Asma BrÃ´nquica: Crise Aguda", "SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo"],
  tep: ["Tromboembolismo Pulmonar (TEP)", "Abordagem da Dor TorÃ¡cica"],
  hipercalemia: ["DistÃºrbios do PotÃ¡ssio", "DoenÃ§a Renal CrÃ´nica (DRC)"],
  les: ["LÃºpus Eritematoso SistÃªmico (LES)", "Artrite Reumatoide"],
  neutropenia_febril: ["Neutropenia Febril", "Sepse (Sepsis-3)"],
  dip: ["DoenÃ§a InflamatÃ³ria PÃ©lvica (DIP)", "Vaginites e Vaginose"],
  farmacodermia: ["Farmacodermias Graves"],
  desnutricao_choque: ["DesnutriÃ§Ã£o e Choque", "Planos de HidrataÃ§Ã£o (Plano A, B e C)"],
  osteoporose: ["Artrite Reumatoide", "DoenÃ§a Renal CrÃ´nica (DRC)"],
  obesidade: ["Diabetes Mellitus: DiagnÃ³stico", "Cetoacidose DiabÃ©tica (CAD)"],
  climaterio: ["Vaginites e Vaginose"],
  ivc: ["Tromboembolismo Pulmonar (TEP)"],
  dermatite_contato: ["Escabiose"],
  migranea: ["AVC IsquÃªmico vs HemorrÃ¡gico"],
  pneumotorax: ["SDRA - SÃ­ndrome do Desconforto RespiratÃ³rio Agudo", "Asma BrÃ´nquica: Crise Aguda"],
  pancreatite: ["Hemorragia Digestiva Alta (HDA)", "Cirrose: ComplicaÃ§Ãµes"],
  dengue_grave: ["Sepse (Sepsis-3)", "Choque: ClassificaÃ§Ã£o e Manejo", "Planos de HidrataÃ§Ã£o (Plano A, B e C)"],
  pielonefrite_complicada: ["Sepse (Sepsis-3)", "Choque: ClassificaÃ§Ã£o e Manejo"],
  abscesso_periamigdaliano: ["Pneumonia ComunitÃ¡ria"],
  artrite_septica: ["Artrite Reumatoide", "Sepse (Sepsis-3)"],
  intoxicacao_aguda: ["AgitaÃ§Ã£o Psicomotora", "Delirium no Idoso"],
  tce_urgente: ["AVC IsquÃªmico vs HemorrÃ¡gico"]
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
  // --- Guia de DoenÃ§as States ---
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

  // Interactive Calculator: FagerstrÃ¶m
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

  // --- Condutas RÃ¡pidas States ---
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
        return { error: 'A data da DUM estÃ¡ no futuro!' };
      }
      if (diffDays > 300) {
        return { error: 'DUM hÃ¡ mais de 42 semanas. Verifique a data informada.' };
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
    if (phq9Total <= 4) return { label: 'DepressÃ£o MÃ­nima ou Ausente', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'Apoio psicoeducativo, orientaÃ§Ãµes gerais sobre sono e atividade fÃ­sica. Reavaliar em 3-6 meses se persistirem queixas.' };
    if (phq9Total <= 9) return { label: 'DepressÃ£o Leve', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', desc: 'Monitoramento ativo e psicoeducaÃ§Ã£o. Oferecer terapia de apoio na UBS ou prÃ¡ticas integrativas (PICS). NÃ£o requer fÃ¡rmaco de imediato.' };
    if (phq9Total <= 14) return { label: 'DepressÃ£o Moderada', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Iniciar Psicoterapia leve individual/grupo. Avaliar introduÃ§Ã£o de ISRS (Sertralina 50mg/dia ou Fluoxetina 20mg/dia VO pela manhÃ£). Retorno em 2-4 semanas.' };
    if (phq9Total <= 19) return { label: 'DepressÃ£o Moderadamente Grave', color: 'text-rose-500 bg-rose-500/10 border-rose-500/20', desc: 'IndicaÃ§Ã£o clara de tratamento combinado: Antidepressivo ISRS em dose terapÃªutica efetiva + Psicoterapia regular ambulatorial. Monitoramento rigoroso.' };
    return { label: 'DepressÃ£o Grave', color: 'text-red-500 bg-red-500/10 border-red-500/20', desc: 'Tratamento intensivo: Antidepressivo (dose otimizada) + Psicoterapia. Se ideaÃ§Ã£o suicida ativa ou alto risco, pactuar plano de contingÃªncia, envolver famÃ­lia e encaminhar para CAPS ou EmergÃªncia.' };
  }, [phq9Total]);

  // GAD-7 Evaluation
  const gad7Evaluation = useMemo(() => {
    if (gad7Total <= 4) return { label: 'Ansiedade MÃ­nima ou Ausente', color: 'text-emerald-500 bg-emerald-500/10 border-emerald-500/20', desc: 'PsicoeducaÃ§Ã£o, higiene do sono e orientaÃ§Ã£o sobre hÃ¡bitos saudÃ¡veis.' };
    if (gad7Total <= 9) return { label: 'Ansiedade Leve', color: 'text-yellow-500 bg-yellow-500/10 border-yellow-500/20', desc: 'PrÃ¡ticas de relaxamento, tÃ©cnicas de controle de respiraÃ§Ã£o, atividades fÃ­sicas. Reavaliar em consultas clÃ­nicas de rotina.' };
    if (gad7Total <= 14) return { label: 'Ansiedade Moderada', color: 'text-amber-500 bg-amber-500/10 border-amber-500/20', desc: 'Encaminhar para psicoterapia estruturada (TCC) e considerar inÃ­cio de tratamento farmacolÃ³gico com ISRS (Sertralina ou Escitalopram).' };
    return { label: 'Ansiedade Grave', color: 'text-rose-600 bg-rose-500/10 border-rose-500/20', desc: 'Tratamento farmacolÃ³gico ativo (Antidepressivo em dose terapÃªutica) associado a psicoterapia intensiva continuada. Retornos frequentes.' };
  }, [gad7Total]);

  return (
    <div className="space-y-8">
      {/* Sub-tabs bar */}
      <div className="flex flex-wrap gap-2 border-b border-slate-200 dark:border-slate-800 pb-4">
        {[
          { id: 'guia', label: 'Guia de DoenÃ§as da UBS ðŸ‡§ðŸ‡·', icon: BookOpen },
          { id: 'cronicos', label: 'DoenÃ§as CrÃ´nicas (HAS/DM)', icon: Heart },
          { id: 'mulher', label: 'Mulher & Gestante (UBS)', icon: ClipboardCheck },
          { id: 'mental', label: 'Escores de SaÃºde Mental', icon: Brain },
          { id: 'condutas', label: 'Condutas Infecciosas RÃ¡pidas', icon: Stethoscope },
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
              HipertensÃ£o Arterial (HAS)
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
                {/* DiagnÃ³stico */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Bookmark size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">CritÃ©rio DiagnÃ³stico na UBS</h3>
                  </div>
                  <p className="text-sm text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                    AferiÃ§Ã£o de PA em consultÃ³rio em <strong className="text-teal-600">pelo menos 2 ocasiÃµes distintas â‰¥ 140/90 mmHg</strong>. 
                  </p>
                  <p className="text-xs text-slate-450 dark:text-slate-500 uppercase font-bold leading-normal">
                    Nota: Se aferiÃ§Ã£o inicial â‰¥ 180/110 mmHg ou na presenÃ§a de lesÃ£o de Ã³rgÃ£o-alvo (LOA), o diagnÃ³stico de hipertensÃ£o Ã© direto, sem necessidade de reavaliaÃ§Ã£o em outra consulta.
                  </p>
                </div>

                {/* Tratamento / Fluxograma interativo */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-5">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Pill size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Algoritmo de FÃ¡rmacos na UBS</h3>
                  </div>
                  
                  <div className="space-y-4">
                    <span className="text-[10px] uppercase tracking-widest font-black text-slate-400">Selecione o Perfil do Paciente para Tratamento de 1Âº Linha:</span>
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
                        DiabÃ©tico, Nefropata, Jovem ou com ICC
                      </button>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      {hasPatientType === 'normal' ? (
                        <>
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Activity size={14} /> PreferÃªncia: BCC ou TiazÃ­dicos
                          </div>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                            <p>â€¢ <strong>BCC (Bloqueadores de Canal de CÃ¡lcio)</strong>: <span className="text-teal-600 font-mono">Amlodipino 5mg a 10mg VO / dia</span>. Excelente papel vasodilatador em idosos e negros.</p>
                            <p>â€¢ <strong>TiazÃ­dicos (DiurÃ©ticos)</strong>: <span className="text-teal-600 font-mono">Hidroclorotiazida 25mg VO / dia de manhÃ£</span> (ou Clortalidona 12.5mg a 25mg). Risco de hipocalemia/hiperuricemia.</p>
                          </div>
                        </>
                      ) : (
                        <>
                          <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 font-bold text-xs uppercase tracking-wider">
                            <Activity size={14} /> PreferÃªncia: IECA ou BRA (NefroproteÃ§Ã£o)
                          </div>
                          <div className="space-y-2 text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                            <p>â€¢ <strong>IECA</strong>: <span className="text-teal-600 font-mono">Enalapril 10mg a 40mg VO / dia</span> (dividido em 1 ou 2x). Contraindicado em gestantes. Se tosse crÃ´nica induzida, trocar por BRA.</p>
                            <p>â€¢ <strong>BRA</strong>: <span className="text-teal-600 font-mono">Losartana PotÃ¡ssica 50mg a 100mg VO / dia</span> (dividido em 1 ou 2x). Excelente tolerabilidade e nefroprotetor em DM.</p>
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
                      <h3 className="font-bold text-slate-800 dark:text-slate-100">Metas Alvo de PressÃ£o</h3>
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
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">PressÃ£o Arterial Alvo (Alvo TerapÃªutico)</p>
                    <p className="text-4xl font-serif italic font-black text-purple-700 dark:text-purple-400 tracking-tight">
                      {hasTarget === 'geral' ? '< 140 / 90 mmHg' : '< 130 / 80 mmHg'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      {hasTarget === 'geral' 
                        ? 'Alvo para pacientes de baixo-mÃ©dio risco cardiovascular geral.' 
                        : 'Alvo agressivo para otimizaÃ§Ã£o de sobrecarga renal e proteÃ§Ã£o micro/macrovascular.'}
                    </p>
                  </div>
                </div>

                {/* Exames de Linha de Base */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-emerald-500/10 text-emerald-600 flex items-center justify-center">
                      <ClipboardList size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Exames Anuais ObrigatÃ³rios (Rastreio LOA)</h3>
                  </div>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    {[
                      { name: 'Creatinina + TFG', desc: 'Screening de DisfunÃ§Ã£o Renal' },
                      { name: 'PotÃ¡ssio SÃ©rico', desc: 'Monitorar perdas ou retenÃ§Ã£o' },
                      { name: 'EAS / Urina tipo 1', desc: 'Identificar ProteinÃºria/InÃ­cio DRC' },
                      { name: 'ECG de repouso', desc: 'Pesquisa de Sobrecarga de VE' },
                      { name: 'Glicemia de Jejum', desc: 'Rastrear Diabetes concomitante' },
                      { name: 'Ãcido Ãšrico', desc: 'Marcador inflamatÃ³rio de base' }
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
                {/* CritÃ©rios DiagnÃ³sticos DM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <Bookmark size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">VigilÃ¢ncia de Diabetes: DiagnÃ³stico</h3>
                  </div>
                  <p className="text-xs text-slate-400 dark:text-slate-500 font-extrabold uppercase tracking-wide">
                    ConfirmaÃ§Ã£o por duas amostras alteradas de qualquer um dos exames:
                  </p>
                  <div className="space-y-2.5 text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                    <p>â€¢ <strong>Glicemia de Jejum</strong>: <span className="font-extrabold text-teal-600 font-mono">â‰¥ 126 mg/dL</span></p>
                    <p>â€¢ <strong>Hemoglobina Glicada (HbA1c)</strong>: <span className="font-extrabold text-teal-600 font-mono">â‰¥ 6,5%</span></p>
                    <p>â€¢ <strong>TOTG (Teste Oral de TolerÃ¢ncia)</strong> (75g 2h): <span className="font-extrabold text-teal-600 font-mono">â‰¥ 200 mg/dL</span></p>
                    <p>â€¢ <strong>Glicemia ao acaso</strong>: <span className="font-extrabold text-teal-600 font-mono">â‰¥ 200 mg/dL</span> acompanhada de sintomas tÃ­picos (PoliÃºria, Polidipsia, Perda de peso rÃ¡pida).</p>
                  </div>
                  <div className="p-3 bg-teal-500/5 text-teal-600 font-semibold text-[10px] rounded-lg tracking-wide">
                    *PrÃ©-Diabetes: Glicemia de jejum 100-125 mg/dL ou HbA1c 5,7 - 6,4%. Iniciar mudanÃ§a de estilo de vida imediata.
                  </div>
                </div>

                {/* Tratamento Escalonado de DM */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-orange-500/10 text-orange-600 flex items-center justify-center">
                      <Pill size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Escalonamento de FÃ¡rmacos na UBS</h3>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                    {[
                      { id: 'metformina', label: '1Âª Linha' },
                      { id: 'sulfonilureia', label: 'AssociaÃ§Ã£o' },
                      { id: 'isglt2', label: 'ProteÃ§Ã£o CV/DRC' },
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
                          â€¢ Primeira linha absoluta (salvo contraindicaÃ§Ã£o como TFG &lt; 30 mL/min).
                          <br />â€¢ <strong>Dosagem</strong>: Iniciar com 500mg VO Ã  noite ou apÃ³s jantar para diminuir efeitos colaterais gasteintestinal (flatulÃªncia, diarreia). Titular progressivamente atÃ© mÃ¡ximo de 2000mg/dia VO (dividido 2x/dia). Restringe ganho ponderal.
                        </p>
                      </>
                    )}
                    {dmStage === 'sulfonilureia' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Gliclazida MR (Sulfonilureia de escolha)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          â€¢ Segunda linha preferencial sob escopo custo-efetividade SUS. Estimulante de secreÃ§Ã£o de insulina.
                          <br />â€¢ <strong>Dosagem</strong>: Gliclazida MR 30mg a 120mg VO pela manhÃ£ junto ao desjejum. *Cuidado: Alto risco de hipoglicemia. Evitar sulfonilureias de 1Âª geraÃ§Ã£o (Glibenclamida) devido ao excessivo risco de hipoglicemias graves no idoso.
                        </p>
                      </>
                    )}
                    {dmStage === 'isglt2' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">Inibidores de SGLT2 (Dapagliflozina)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          â€¢ PrioritÃ¡rio se paciente portar <strong>InsuficiÃªncia CardÃ­aca (IC)</strong> ou <strong>DoenÃ§a Renal CrÃ´nica (DRC)</strong> de base.
                          <br />â€¢ <strong>Dosagem</strong>: Dapagliflozina 10mg VO / dia de manhÃ£. Reduz hospitalizaÃ§Ã£o por IC, lentifica perda de funÃ§Ã£o renal e promove glicosÃºria (induz perda de peso e queda pressÃ³rica).
                        </p>
                      </>
                    )}
                    {dmStage === 'insulina' && (
                      <>
                        <p className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase">InsulinizaÃ§Ã£o com NPH (Esquema Basal)</p>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold">
                          â€¢ Indicado no diagnÃ³stico se Glicemia de jejum &gt; 300 mg/dL, perda de peso extrema ("glucotoxidade") ou HbA1c &gt; 10%.
                          <br />â€¢ <strong>Dosagem Inicial Basal</strong>: Iniciar Insulina NPH na dose de <strong>0,1 a 0,2 UI/kg de peso VO ao deitar</strong> (habitualmente 10 UI basal). Titular adicionando 2 UI a cada 3 dias conforme monitoramento de glicemia capilar de jejum (meta de jejum: 80-130 mg/dL).
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
                      FrÃ¡gil ou Idoso Complexo
                    </button>
                  </div>

                  <div className="p-6 rounded-2xl bg-gradient-to-br from-slate-50 to-slate-100/50 dark:from-slate-900/60 dark:to-slate-900/20 text-center border border-slate-100 dark:border-slate-800">
                    <p className="text-[10px] text-slate-400 font-black uppercase tracking-widest mb-1">Hemoglobina Glicada Alvo (HbA1c)</p>
                    <p className="text-4xl font-serif italic font-black text-purple-700 dark:text-purple-400 tracking-tight">
                      {dmTarget === 'padrao' ? '< 7,0 %' : '< 8,0 %'}
                    </p>
                    <p className="text-xs text-slate-500 dark:text-slate-400 mt-2 font-medium">
                      {dmTarget === 'padrao' 
                        ? 'Alvo para controle estrito e mitigaÃ§Ã£o de complicaÃ§Ãµes microvasculares de longo prazo.' 
                        : 'Alvo flexÃ­vel para atenuar o risco letal de hipoglicemias graves e polifarmÃ¡cia.'}
                    </p>
                  </div>
                </div>

                {/* Combata complicaÃ§Ãµes anuais */}
                <div className="bg-white dark:bg-slate-800 p-6 rounded-3xl border border-slate-200 dark:border-slate-700 shadow-sm space-y-4">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-xl bg-teal-500/10 text-teal-600 flex items-center justify-center">
                      <UserCheck size={18} />
                    </div>
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Screening de ComplicaÃ§Ãµes Microvasculares</h3>
                  </div>
                  <div className="space-y-4 divide-y divide-slate-100 dark:divide-slate-700 font-medium">
                    <div className="pt-2">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Exame do PÃ© DiabÃ©tico (Sensibilidade)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Realizar anualmente na consulta mÃ©dica/enfermagem: InspeÃ§Ã£o visual de fissuras, micose e calosidades + Teste com Monofilamento de 10g em 4 pontos plantares + VerificaÃ§Ã£o de pulsos perifÃ©ricos.
                      </span>
                    </div>
                    <div className="pt-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Retinopatia DiabÃ©tica (Fundo de Olho)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Referenciar ao oftalmologista para fundoscopia com pupila dilatada anualmente (ou a cada 2 anos se exame prÃ©vio completamente normal e bom controle glicÃªmico).
                      </span>
                    </div>
                    <div className="pt-3">
                      <span className="text-xs font-bold text-slate-800 dark:text-slate-200 block">Nefropatia DiabÃ©tica (Exames de Rastreio)</span>
                      <span className="text-[11px] text-slate-500 dark:text-slate-400 block mt-1 leading-relaxed">
                        Pesquisar anualmente RelaÃ§Ã£o Albumina/Creatinina UrinÃ¡ria (RAC) em amostra isolada e calcular a taxa de filtraÃ§Ã£o glomerular estimada (TFG) por creatinina plasmÃ¡tica.
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
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">CÃ¡lculo de IG e DPP pelo MinistÃ©rio da SaÃºde</p>
                </div>
              </div>

              <div className="space-y-2">
                <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-widest block">Data da Ãšltima MenstruaÃ§Ã£o (DUM):</label>
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
                        <span className="text-[9px] text-slate-400 uppercase font-black block mb-1">Data ProvÃ¡vel do Parto (DPP)</span>
                        <span className="text-xl font-serif italic font-black text-purple-600 block mt-2">
                          {gestationalData.dpp}
                        </span>
                      </div>
                    </div>

                    <div className="p-5 bg-slate-50 dark:bg-slate-900/40 rounded-2xl border border-slate-100 dark:border-slate-800 space-y-3">
                      <div className="flex items-center gap-2 text-rose-600 dark:text-rose-400 text-xs font-black uppercase tracking-wider">
                        <Bookmark size={14} /> RecomendaÃ§Ãµes do {gestationalData.trimester}Âº Trimestre
                      </div>
                      <ul className="text-xs text-slate-600 dark:text-slate-300 space-y-2 leading-relaxed font-semibold">
                        {gestationalData.trimester === 1 && (
                          <>
                            <li>â€¢ ðŸ’Š <strong>Vitaminas</strong>: Iniciar Ãcido FÃ³lico 0,4mg/dia (prevenÃ§Ã£o de defeitos do tubo neural).</li>
                            <li>â€¢ ðŸ§ª <strong>Exames do 1Âº Trimestre</strong>: Tipagem SanguÃ­nea, Coombs Indireto (se Rh-), Hemograma, Glicemia de Jejum, VDRL, HIV, HBsAg, Toxoplasmose IgG/IgM e Urina rotina com Urocultura.</li>
                            <li>â€¢ ðŸ©º <strong>Consultas</strong>: Orientar consultas mensais. Explicar vacinaÃ§Ã£o bÃ¡sica (TÃ©tano, Hepatite B).</li>
                          </>
                        )}
                        {gestationalData.trimester === 2 && (
                          <>
                            <li>â€¢ ðŸ’Š <strong>Vitaminas</strong>: Iniciar Sulfato Ferroso 40mg de ferro elementar por dia.</li>
                            <li>â€¢ ðŸ§ª <strong>Exames de Rotina</strong>: Realizar Teste de TolerÃ¢ncia Ã  Glicose (TOTG 75g) entre as semanas 24 e 28. Ultrassom MorfolÃ³gico de 2Âº trimestre ideal de 20-24s.</li>
                            <li>â€¢ ðŸ©º <strong>Acompanhamento</strong>: Mensurar ganho de peso e acompanhar crescimento da altura uterina (AU).</li>
                          </>
                        )}
                        {gestationalData.trimester === 3 && (
                          <>
                            <li>â€¢ ðŸ§ª <strong>Screening SGB</strong>: Agendar coleta de swab anal e vaginal para Streptococcus B (SGB) entre 35-37 semanas de gestaÃ§Ã£o.</li>
                            <li>â€¢ ðŸ§¬ <strong>Exames RepetiÃ§Ã£o</strong>: Repetir exames bÃ¡sicos do 1Âº trimestre (VDRL, HIV, Urina/Urocultura, Hemograma).</li>
                            <li>â€¢ ðŸ©º <strong>Sinais de Alerta</strong>: Orientar sobre perda de lÃ­quido, diminuiÃ§Ã£o de movimentos fetais (fetalidade), dor de cabeÃ§a extrema, escotomas cintilantes ou dor epigÃ¡strica (sinais de PrÃ©-EclÃ¢mpsia).</li>
                          </>
                        )}
                      </ul>
                    </div>
                  </div>
                )
              ) : (
                <div className="text-center py-6 text-slate-400 text-xs border border-dashed border-slate-200 dark:border-slate-700 rounded-xl">
                  Selecione uma DUM acima para detalhar o protocolo de consultas prÃ©-natal correspondente.
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
                  <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">Verificador interativo por gÃªnero e faixa de idade</p>
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
                      <span className="text-xs font-black text-rose-600 uppercase block tracking-wider">ðŸ”¬ Exame Preventivo (Colo de Ãštero / Papanicolau)</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado de 25 a 64 anos</strong> para quem jÃ¡ iniciou atividade sexual. Periodicidade: anual nos dois primeiros e, se normais, a cada 3 anos.
                      </p>
                    </div>
                  ) : null}

                  {screeningSex === 'female' && screeningAge >= 50 && screeningAge <= 69 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-rose-600 uppercase block tracking-wider">ðŸ’ Mamografia de Rastreamento</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado de 50 a 69 anos</strong>. Mamografia bilateral de rastreamento a cada 2 anos. No SUS, exames em outras idades requerem indicaÃ§Ã£o clÃ­nica por risco aumentado.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge >= 50 && screeningAge <= 75 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-teal-650 uppercase block tracking-wider">ðŸ’© Rastreamento de CÃ¢ncer Colorretal</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        <strong>Indicado dos 50 aos 75 anos</strong>. Realizar Pesquisa de Sangue Oculto nas Fezes (PSOF) anualmente na UBS, seguido de colonoscopia se alterada.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge >= 18 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl font-medium">
                      <span className="text-xs font-black text-purple-600 uppercase block tracking-wider">â¤ï¸ VigilÃ¢ncia Cardiovascular & HAS</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed">
                        AferiÃ§Ã£o de PressÃ£o Arterial anualmente na UBS. Rastreio de Diabetes e dislipidemia com dosagem lipÃ­dica a partir de 35-45 anos, ou antes sob obesidade, histÃ³rico familiar ou gestaÃ§Ã£o prÃ©via.
                      </p>
                    </div>
                  ) : null}

                  {screeningAge < 18 ? (
                    <div className="p-3.5 bg-white dark:bg-slate-800 border border-slate-150 dark:border-slate-700 rounded-xl">
                      <span className="text-xs font-black text-emerald-600 uppercase block tracking-wider">ðŸ‘¶ Puericultura & VacinaÃ§Ã£o BÃ¡sica</span>
                      <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 leading-relaxed font-semibold">
                        Acompanhamento de curvas de crescimento (Peso, Estatura, PerÃ­metro CefÃ¡lico), marcos de desenvolvimento e manutenÃ§Ã£o rigorosa do CartÃ£o de Vacina completo do Programa Nacional de ImunizaÃ§Ãµes (PNI).
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
              Rastreio DepressÃ£o (PHQ-9)
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
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-relaxed">AvaliaÃ§Ã£o de sintomas depressivos nas Ãºltimas 2 semanas na UBS</p>
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
                        <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">Diretriz UBS para esta PontuaÃ§Ã£o:</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-semibold">
                          {phq9Evaluation.desc}
                        </p>
                      </div>

                      {hasSuicidalIdeation && (
                        <div className="p-4 bg-rose-500/10 border border-rose-500/20 text-rose-600 dark:text-rose-400 rounded-2xl text-xs space-y-2 font-bold leading-normal">
                          <div className="flex items-center gap-1.5 uppercase font-black tracking-wider text-[10px]">
                            <AlertTriangle size={14} /> AtenÃ§Ã£o CrÃ­tica de SeguranÃ§a
                          </div>
                          <p className="font-semibold text-rose-750 dark:text-rose-400">
                            Escore positivo na QuestÃ£o 9 (IdeaÃ§Ã£o de autoextermÃ­nio). Ã‰ obrigatÃ³ria a avaliaÃ§Ã£o mÃ©dica detalhada de risco para suicÃ­dio imediato, elaboraÃ§Ã£o de plano de suporte familiar e, se risco grave, acionamento do CAPS de referÃªncia ou sala de emergÃªncia.
                          </p>
                        </div>
                      )}
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <Brain size={36} className="mx-auto text-slate-300 dark:text-slate-655" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                        Selecione uma resposta para as 9 perguntas para computar a avaliaÃ§Ã£o diagnÃ³stica de depressÃ£o continuada.
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
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider leading-relaxed">Rastreio de Transtorno de Ansiedade Geral na AtenÃ§Ã£o BÃ¡sica</p>
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
                        <span className="text-[9px] text-slate-400 uppercase font-black block tracking-wider">Diretriz UBS para esta PontuaÃ§Ã£o:</span>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-normal font-semibold">
                          {gad7Evaluation.desc}
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="p-6 bg-slate-50 dark:bg-slate-900/20 border border-slate-150 dark:border-slate-800 rounded-2xl text-center space-y-3">
                      <Brain size={36} className="mx-auto text-slate-300 dark:text-slate-655" />
                      <p className="text-xs text-slate-500 dark:text-slate-400 font-bold uppercase tracking-wider leading-relaxed">
                        Selecione uma resposta para as 7 perguntas para computar o diagnÃ³stico e a severidade do transtorno ansioso.
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
              InfecÃ§Ã£o de Urina / Cistite
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">CÃ¡lculo de Score de Centor Modificado</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">AuxÃ­lio diagnÃ³stico para uso de antibiÃ³ticos</p>
                  </div>
                </div>

                <div className="space-y-4">
                  <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Identifique os Sinais ClÃ­nicos Presentes:</span>
                  <div className="space-y-3">
                    {[
                      { state: centorFever, setState: setCentorFever, label: 'Febre Aferida ou Referida recente (> 38ÂºC)' },
                      { state: centorNoCough, setState: setCentorNoCough, label: 'AusÃªncia de Tosses e Corizas (IVAS altas puras)' },
                      { state: centorAdenopathy, setState: setCentorAdenopathy, label: 'Linfadenopatia cervical anterior dolorosa (GÃ¢nglios turgidos)' },
                      { state: centorExudate, setState: setCentorExudate, label: 'PresenÃ§a de exsudato amigdaliano fibrinoso/placas purulentas' }
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
                          {item.state && "âœ“"}
                        </div>
                        <span className="text-xs leading-normal font-sans">{item.label}</span>
                      </button>
                    ))}
                  </div>

                  <div className="space-y-1.5 pt-2">
                    <span className="text-[9px] font-black uppercase text-slate-400 tracking-wider">Selecione a Idade do Paciente:</span>
                    <div className="grid grid-cols-3 gap-2">
                      {[
                        { value: 10, label: 'CrianÃ§a (3-14a)' },
                        { value: 30, label: 'Adulto (15-44a)' },
                        { value: 55, label: 'Idoso (â‰¥45a)' }
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
                          Risco &lt; 10%: BaixÃ­ssima probabilidade de S. pyogenes
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-sans">
                          â€¢ <strong>Conduta</strong>: Tratamento exclusivamente sintomÃ¡tico. <strong>Evitar antibiÃ³tico!</strong>
                          <br />â€¢ <strong>SintomÃ¡ticos</strong>: Prescrever Ibuprofeno 400mg VO de 8/8h por 3-5 dias ou Dipirona 500mg-1g VO de 6/6h se febre/dor de garganta. Amigdalites nesta pontuaÃ§Ã£o tÃªm forte viÃ©s viral.
                        </p>
                      </>
                    )}
                    {centorScore >= 2 && centorScore <= 3 && (
                      <>
                        <div className="text-xs uppercase font-black text-amber-600 ring-1 ring-amber-500/30 bg-amber-550/10 px-3 py-1.5 rounded-lg w-fit">
                          Risco IntermediÃ¡rio (~15-30%)
                        </div>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed font-semibold font-sans">
                          â€¢ <strong>Conduta</strong>: Se houver teste rÃ¡pido (Strep Test) na UBS, realizar coleta. Se positivo, iniciar antibiÃ³tico. Se negativo ou indisponÃ­vel teste, o manejo sintomÃ¡tico Ã© prudente. Avaliar prescrever antibiÃ³tico apenas em casos severos com toxicidade ou comorbidades de risco (ex: cardiopata reumÃ¡tico).
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
                            â€¢ <strong>Conduta Governamental</strong>: Recomendada antibioticoterapia empÃ­rica direcionada de primeira linha na UBS:
                          </p>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-700 text-xs leading-relaxed">
                            <span className="font-extrabold block text-teal-600">OpÃ§Ã£o 1: Penicilina G Benzatina (Dose Ãšnica IM)</span>
                            <span className="block text-slate-500 dark:text-slate-400 text-[11px] mt-1 font-sans">
                              â€¢ CrianÃ§as &lt; 27kg: 600.000 UI IM profundo.
                              <br />â€¢ Adultos e crianÃ§as &ge; 27kg: 1.200.000 UI IM profundo.
                            </span>
                          </div>
                          <div className="p-3 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 dark:border-slate-700 text-xs leading-relaxed">
                            <span className="font-extrabold block text-teal-600">OpÃ§Ã£o 2: Amoxicilina Oral (Tratamento 10 dias)</span>
                            <span className="block text-slate-500 dark:text-slate-400 text-[11px] mt-1 font-sans">
                              â€¢ Adultos: 500mg de 8/8h por 10 dias (ou 875mg de 12/12h).
                              <br />â€¢ CrianÃ§as: 50 mg/kg/dia dividido de 8/8h.
                              <br />*Alerta: Manter rigorosamente por <strong>10 dias completos</strong> para prevenÃ§Ã£o segura de surto de febre reumÃ¡tica e glomerulonefrite pÃ³s-estreptocÃ³cica.
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Cistite NÃ£o Complicada na UBS</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider">InfecÃ§Ã£o urinÃ¡ria baixa em mulheres saudÃ¡veis</p>
                  </div>
                </div>

                <div className="space-y-4 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                  <div className="p-4 bg-teal-505/5 text-teal-600 font-semibold text-[11px] rounded-lg tracking-wide leading-normal">
                    ðŸ’¡ <strong>DefiniÃ§Ã£o PrÃ¡tica</strong>: Queixas tÃ­picas de disÃºria intensa, polaciÃºria, urgÃªncia e dor suprapÃºbica. PresenÃ§a de febre ou dor lombar exclui cistite (recomendar avaliaÃ§Ã£o de Pielonefrite).
                  </div>
                  <div className="space-y-3">
                    <span className="text-[10px] font-black uppercase tracking-wider text-slate-450 block mb-2">Exames diagnÃ³sticos na AtenÃ§Ã£o BÃ¡sica:</span>
                    <p>â€¢ <strong>EAS em consultÃ³rio (tiras de dipstick)</strong>: PresenÃ§a de nitrito positivo e esterase leucocitÃ¡ria elevada oferecem altÃ­ssima probabilidade diagnÃ³stica (sensibilidade &gt; 80%).</p>
                    <p>â€¢ <strong>Urocultura com Antibiograma</strong>: DispensÃ¡vel no primeiro episÃ³dio em mulheres adultas nÃ£o gestantes saudÃ¡veis. Solicitar apenas em ITU recorrente (&ge; 3 episÃ³dios/ano), suspeita de pielonefrite ou gestantes.</p>
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
                    <h3 className="font-bold text-slate-800 dark:text-slate-100">Esquemas AntibiÃ³ticos na AtenÃ§Ã£o BÃ¡sica</h3>
                    <p className="text-[10px] text-slate-400 uppercase font-black tracking-wider text-left">Diretriz de 1Âº Escolha do MinistÃ©rio da SaÃºde</p>
                  </div>
                </div>

                <div className="space-y-4 font-semibold">
                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-850 font-semibold text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    <div>
                      <span className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase block">OpÃ§Ã£o 1: NitrofurantoÃ­na (Macrocristais)</span>
                      <span className="block mt-1">
                        â€¢ <strong>Posologia</strong>: 100mg VO de 12/12h (formulaÃ§Ã£o macrocristais) por 5 a 7 dias inteiros.
                        <br />â€¢ <strong>ContraindicaÃ§Ã£o</strong>: Evitar se TFG estimada / depuraÃ§Ã£o de creatinina &lt; 30 ml/min.
                      </span>
                    </div>
                  </div>

                  <div className="p-4 bg-slate-50 dark:bg-slate-900/40 rounded-xl space-y-2.5 border border-slate-100 dark:border-slate-850 font-semibold text-xs text-slate-600 dark:text-slate-300 leading-normal">
                    <div>
                      <span className="text-teal-600 dark:text-teal-400 font-black text-xs uppercase block">OpÃ§Ã£o 2: Fosfomicina Trometamol (AdesÃ£o de 100%)</span>
                      <span className="block mt-1 col-span-2">
                        â€¢ <strong>Posologia</strong>: Envelope de 3g diluÃ­do em Ã¡gua por via oral em <strong>dose Ãºnica</strong>. Usar preferencialmente Ã  noite, antes de dormir com bexiga vazia.
                        <br />â€¢ <strong>Vantagem</strong>: Excelente sobrevida de concentraÃ§Ã£o ativa no trato urinÃ¡rio e virtualmente impossibilidade de abandono de tratamento.
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
                placeholder="Pesquisar doenÃ§a ou conduta..."
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
              {['Todos', 'Cardiovascular/CrÃ´nicas', 'MetabÃ³licas/EndÃ³crinas', 'RespiratÃ³rio', 'Gastrointestinal', 'Infecciosas/Endemias', 'Pele & Dermatologia', 'SaÃºde Mental', 'Outros'].map((cat) => {
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
                Queixas Principais mais Comuns na UBS (AtenÃ§Ã£o BÃ¡sica)
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
                { label: 'Azia / Refluxo Ãcido', icon: Pill, term: 'Refluxo' },
                { label: 'QueimaÃ§Ã£o no EstÃ´mago', icon: Pill, term: 'Gastrite' },
                { label: 'CansaÃ§o / Fraqueza', icon: Activity, term: 'Anemia' },
                { label: 'Ansiedade / InsÃ´nia', icon: Brain, term: 'Ansiedade' },
                { label: 'Tristeza / Desalento', icon: Activity, term: 'DepressÃ£o' },
                { label: 'Coceira / LesÃ£o na Pele', icon: Microscope, term: 'Micoses' },
                { label: 'Tosse / Catarro', icon: Wind, term: 'Tuberculose' },
                { label: 'Dor de Garganta', icon: Stethoscope, term: 'Faringoamigdalite' },
                { label: 'Febre / Dor no Corpo', icon: AlertTriangle, term: 'Dengue' },
                { label: 'Ondas de Calor (Fogachos)', icon: Droplets, term: 'ClimatÃ©rio' },
                { label: 'Ardor ao Urinar / DisÃºria', icon: Activity, term: 'Cistite' },
                { label: 'Tratamento de PressÃ£o', icon: Heart, term: 'HipertensÃ£o' },
                { label: 'Controle de Diabetes', icon: Activity, term: 'Diabetes' },
                { label: 'Nariz Entupido / Coriza', icon: Wind, term: 'Resfriado' },
                { label: 'Prurido / Corrimento Vaginal', icon: Droplets, term: 'CandidÃ­ase' },
                { label: 'Dor nas ArticulaÃ§Ãµes', icon: AlertTriangle, term: 'Artrose' },
                { label: 'Varizes / Peso nas Pernas', icon: Activity, term: 'InsuficiÃªncia' },
                { label: 'Dor de CabeÃ§a / Enxaqueca', icon: Zap, term: 'MigrÃ¢nea' },
                { label: 'CÃ³lica / Vermes Intestinais', icon: ClipboardList, term: 'Parasitoses' },
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
                      Nenhuma doenÃ§a encontrada com os critÃ©rios informados.
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
                      Selecione uma doenÃ§a na barra de pesquisa Ã  esquerda para ver o protocolo completo.
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
                        <h4 className="font-sans font-black text-xs uppercase tracking-wider">CritÃ©rio DiagnÃ³stico na UBS</h4>
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
                          <h4 className="font-sans font-black text-xs uppercase tracking-wider">Sinais de Alarme & Direcionamento de UrgÃªncia</h4>
                        </div>
                        <p className="text-xs text-rose-750 dark:text-rose-200 leading-relaxed font-bold font-sans">
                          â€¢ {disease.alarm}
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
                            <h4 className="font-sans font-black text-xs uppercase tracking-wider">Resumo AcadÃªmico Completo Vinculado</h4>
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
                          <h4 className="font-sans font-black text-xs uppercase tracking-wider">Calculador ClÃ­nico Interativo</h4>
                        </div>

                        {/* calculator: Levotiroxina */}
                        {disease.interactiveType === 'hypothyroid' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Preencha os ParÃ¢metros ClÃ­nicos para Ajuste PosolÃ³gico:</p>
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
                                    {hypoElderly && "âœ“"}
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
                                  ? 'AtenÃ§Ã£o importante: Idosos apresentando coronariopatias devem ser testados inicialmente com 12.5mcg diÃ¡rios, aumentando 12.5-25mcg a cada 4-6 semanas atÃ© otimizaÃ§Ã£o laboratorial.'
                                  : `Dose exata estimada: ${(hypoWeight * 1.6).toFixed(1)} mcg/dia. ApresentaÃ§Ãµes fornecidas nas farmÃ¡cias populares: Levotiroxina 12.5mcg, 25mcg, 50mcg, 75mcg, 85mcg, 100mcg ou 112mcg.`
                                }
                              </span>
                            </div>
                          </div>
                        )}

                        {/* calculator: Cholesterol */}
                        {disease.interactiveType === 'cholesterol' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">AvaliaÃ§Ã£o do Alvo TerapÃªutico e Droga do SUS:</p>
                            <span className="text-xs font-black text-slate-600 dark:text-slate-300 block">Classifique o Risco Cardiovascular Global do Paciente:</span>
                            <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                              {[
                                { id: 'baixo', label: 'Baixo Risco', desc: '< 5% escore' },
                                { id: 'medio', label: 'Risco MÃ©dio', desc: '5-10% escore' },
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
                                <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">IndicaÃ§Ã£o recomendada do SUS:</span>
                                <p className="text-xs font-bold text-slate-700 dark:text-slate-200 leading-normal mt-1">
                                  {lipidRiskLevel === 'baixo' && 'MudanÃ§a Estilo Vida (MEV) por 3-6 meses. Se persistÃªncia, Sinvastatina 20mg Ã  noite.'}
                                  {lipidRiskLevel === 'medio' && 'Controle dietÃ©tico ativo + Sinvastatina 20mg a 40mg VO Ã  noite.'}
                                  {lipidRiskLevel === 'alto' && 'Tratamento farmacolÃ³gico imediato obrigatÃ³rio: Sinvastatina 40mg Ã  noite ou Atorvastatina 20mg.'}
                                  {lipidRiskLevel === 'muito_alto' && 'Tratamento de alta intensidade: Atorvastatina 45mg a 80mg VO diÃ¡ria (visando reduÃ§Ã£o de 50%+).'}
                                </p>
                              </div>
                            </div>
                          </div>
                        )}

                        {/* calculator: Asthma (GINA Classification) */}
                        {disease.interactiveType === 'asma' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-4">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Avalie o Controle ClÃ­nico (Nas Ãšltimas 4 Semanas):</p>
                            
                            <div className="space-y-2.5">
                              {[
                                { state: asthmasymptomDays, setState: setAsthmasymptomDays, label: "Sintomas diurnos ocorridos mais de 2 vezes por semana?" },
                                { state: asthmanightAwake, setState: setAsthmanightAwake, label: "Algum despertar noturno decorrente dos sintomas da asma?" },
                                { state: asthmauseResgate, setState: setAsthmauseResgate, label: "Uso de medicaÃ§Ã£o de resgate (Ex: Salbutamol) mais de 2 vezes por semana?" },
                                { state: asthmalimitActivity, setState: setAsthmalimitActivity, label: "Qualquer limitaÃ§Ã£o de atividades cotidianas devido Ã  asma?" }
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
                                    {item.state && "âœ“"}
                                  </div>
                                </button>
                              ))}
                            </div>

                            {/* Result processing */}
                            {(() => {
                              const score = [asthmasymptomDays, asthmanightAwake, asthmauseResgate, asthmalimitActivity].filter(Boolean).length;
                              let status = "Controlada";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/25";
                              let action = "Manter o tratamento atual estÃ¡vel (Passo/Step atual). Fornecer plano escrito de crises de asma, manter vacinaÃ§Ã£o Influenza em dia e reavaliar de 3 em 3 meses.";
                              
                              if (score >= 1 && score <= 2) {
                                status = "Parcialmente Controlada";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/25";
                                action = "Avaliar a tÃ©cnica do inalador e a adesÃ£o do paciente. Considerar subir 1 degrau terapÃªutico (step-up) temporÃ¡rio ou definitivo por 1-3 meses para melhorar sintomas.";
                              } else if (score >= 3) {
                                status = "NÃ£o Controlada";
                                color = "text-rose-600 bg-rose-500/10 border-rose-500/25";
                                action = "Ajustar tÃ©cnica inalatÃ³ria. Subir degrau (step-up) no tratamento de manutenÃ§Ã£o obrigatÃ³rio: otimizar dose do Corticoide InalatÃ³rio (Beclometasona ou Budesonida) ou adicionar broncodilatador de longa.";
                              }

                              return (
                                <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 space-y-3 font-medium">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-black text-slate-400 uppercase tracking-widest block font-sans">ClassificaÃ§Ã£o de Controle (GINA):</span>
                                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wide border ${color}`}>{status}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">RecomendaÃ§Ã£o de Conduta SUS:</span>
                                    <p className="text-xs text-slate-600 dark:text-slate-350 leading-relaxed font-semibold">
                                      {action}
                                    </p>
                                  </div>
                                </div>
                              );
                            })()}
                          </div>
                        )}

                        {/* calculator: FagerstrÃ¶m nicotine test */}
                        {disease.interactiveType === 'fagerstrom' && (
                          <div className="bg-slate-50 dark:bg-slate-900/40 p-5 rounded-2xl border border-slate-200/50 dark:border-slate-800 space-y-5">
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">Teste de FagerstrÃ¶m (AvaliaÃ§Ã£o de DependÃªncia de Nicotina):</p>
                            
                            {[
                              {
                                id: 0,
                                q: "1. Quanto tempo apÃ³s acordar vocÃª fuma o primeiro cigarro?",
                                opts: [
                                  { l: "Dentro de 5 minutos", v: 3 },
                                  { l: "De 6 a 30 minutos", v: 2 },
                                  { l: "De 31 a 60 minutos", v: 1 },
                                  { l: "ApÃ³s de 60 minutos", v: 0 }
                                ]
                              },
                              {
                                id: 1,
                                q: "2. VocÃª acha difÃ­cil recusar-se a fumar em locais proibidos?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "NÃ£o", v: 0 }
                                ]
                              },
                              {
                                id: 2,
                                q: "3. Qual Ã© o cigarro do dia que traz mais satisfaÃ§Ã£o e Ã© mais difÃ­cil de largar?",
                                opts: [
                                  { l: "O primeiro da manhÃ£ (logo ao acordar)", v: 1 },
                                  { l: "Qualquer outro cigarro ao longo do dia", v: 0 }
                                ]
                              },
                              {
                                id: 3,
                                q: "4. Quantos cigarros vocÃª fuma por dia?",
                                opts: [
                                  { l: "31 ou mais cigarros diariamente", v: 3 },
                                  { l: "De 21 a 30 cigarros diariamente", v: 2 },
                                  { l: "De 11 a 20 cigarros diariamente", v: 1 },
                                  { l: "10 ou menos cigarros diariamente", v: 0 }
                                ]
                              },
                              {
                                id: 4,
                                q: "5. VocÃª fuma mais frequentemente pela manhÃ£ do que no resto do dia?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "NÃ£o", v: 0 }
                                ]
                              },
                              {
                                id: 5,
                                q: "6. VocÃª fuma mesmo se estiver tÃ£o doente a ponto de ficar de cama?",
                                opts: [
                                  { l: "Sim", v: 1 },
                                  { l: "NÃ£o", v: 0 }
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
                                    Responda as 6 perguntas acima para calcular a dependÃªncia Ã  nicotina e a diretriz de medicaÃ§Ã£o.
                                  </div>
                                );
                              }

                              let level = "DependÃªncia Muito Baixa";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/20";
                              let guide = "Tratamento focado na abordagem cognitivo-comportamental em reuniÃµes/consultas na UBS. Geralmente nÃ£o Ã© exigido o uso de fÃ¡rmacos transdÃ©rmicos ou orais de apoio.";

                              if (totalPoints >= 3 && totalPoints <= 4) {
                                level = "DependÃªncia Baixa";
                                color = "text-yellow-600 bg-yellow-500/10 border-yellow-500/20";
                                guide = "Medidas comportamentais ativas, fornecer panfletos informativos. Avaliar goma ou pastilhas de nicotina de 2mg se houver relatos de fissuras difÃ­ceis.";
                              } else if (totalPoints === 5) {
                                level = "DependÃªncia MÃ©dia";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/20";
                                guide = "IndicaÃ§Ã£o de apoio farmacolÃ³gico em associaÃ§Ã£o Ã  terapia comportamental. Fornecer Goma de Nicotina 2mg SOS e considerar adesivos transdÃ©rmicos leves (14mg ou 7mg).";
                              } else if (totalPoints >= 6 && totalPoints <= 7) {
                                level = "DependÃªncia Alta";
                                color = "text-rose-600 bg-rose-500/15 border-rose-500/20";
                                guide = "IndicaÃ§Ã£o formal de Terapia de ReposiÃ§Ã£o de Nicotina (adesivos transdÃ©rmicos de 21mg, decrescendo a dose apÃ³s 4-6 semanas) e/ou Bupropiona 150mg VO ao dia (com acrÃ©scimo para 12/12h apÃ³s 3 dias, evitando se epilepsia).";
                              } else if (totalPoints >= 8) {
                                level = "DependÃªncia Muito Alta";
                                color = "text-red-650 bg-red-500/20 border-red-500/20";
                                guide = "IndicaÃ§Ã£o urgente de terapia combinada mÃ¡xima: Adesivo de Nicotina 21mg transdÃ©rmico diÃ¡rio + Bupropiona 150mg de 12/12h + Goma/Pastilha de Nicotina 2mg nas fissuras para abrandamento imediato. Cuidadosa reavaliaÃ§Ã£o mÃ©dica semanal de tolerabilidade e FC.";
                              }

                              return (
                                <div className="p-5 bg-white dark:bg-slate-850 rounded-2xl border border-slate-150 shadow-sm space-y-4">
                                  <div className="flex flex-wrap items-center justify-between gap-3 border-b border-slate-100 dark:border-slate-800 pb-3">
                                    <div>
                                      <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block">Total de Pontos FagerstrÃ¶m:</span>
                                      <span className="text-3xl font-serif italic font-black text-teal-600">{totalPoints} / 10 pontos</span>
                                    </div>
                                    <span className={`px-3 py-1.5 rounded-lg text-xs font-black uppercase tracking-wide border ${color}`}>{level}</span>
                                  </div>
                                  <div className="space-y-1.5 leading-relaxed font-medium">
                                    <span className="text-[10px] text-slate-400 font-black uppercase block tracking-wider">Diretriz Governamental de FÃ¡rmacos SUS:</span>
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
                            <p className="text-[10px] uppercase font-black tracking-wider text-slate-400">ClassificaÃ§Ã£o EstatutÃ¡ria de Risco do MinistÃ©rio da SaÃºde:</p>
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 space-y-3">
                                <span className="text-xs font-extrabold text-teal-600 uppercase tracking-wider block border-b border-slate-50 pb-1.5">1. Sinais de Alarme</span>
                                <div className="space-y-2">
                                  {[
                                    { id: 'dorAbdomen', label: 'Dor abdominal intensa e contÃ­nua' },
                                    { id: 'vomito', label: 'VÃ´mitos persistentes (frequentes)' },
                                    { id: 'sangramento', label: 'Sangramento de mucosas (epistaxe/gengivorragia)' },
                                    { id: 'letargia', label: 'Irritabilidade, sonolÃªncia ou letargia' },
                                    { id: 'acumulo', label: 'AcÃºmulo de lÃ­quidos (derrame pleural, ascite)' }
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
                                        {dengueSigaAlarms.includes(item.id) && "âœ“"}
                                      </div>
                                    </button>
                                  ))}
                                </div>
                              </div>

                              <div className="p-4 bg-white dark:bg-slate-800 rounded-xl border border-slate-150 space-y-3">
                                <span className="text-xs font-extrabold text-rose-600 uppercase tracking-wider block border-b border-slate-50 pb-1.5">2. Choque e Gravidade</span>
                                <div className="space-y-2">
                                  {[
                                    { id: 'sinalChoque', label: 'HipotensÃ£o, pulso dÃ©bil ou filiforme' },
                                    { id: 'tempoCapilar', label: 'Enchimento capilar lentificado (> 2 segundos)' },
                                    { id: 'sangramentoGrave', label: 'Hemorragias graves (gastrintestinal/hematÃºria)' },
                                    { id: 'insuficienciaOrgaos', label: 'Danos hepÃ¡tico grave, alteraÃ§Ã£o neurolÃ³gica' }
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
                                        {dengueSigaGravity.includes(item.id) && "âœ“"}
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
                                    { id: 'bebe', label: 'BebÃª / lactente < 2a' },
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
                                <span className="text-xs font-extrabold text-slate-600 dark:text-slate-300 uppercase block tracking-wider font-sans">4. Triagem ClÃ­nico-Laboratorial</span>
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
                                    <span className="block text-xs font-bold leading-none font-sans">Prova do LaÃ§o Positiva?</span>
                                    <span className="text-[9px] text-slate-400 font-normal mt-0.5 block italic leading-none font-sans">PresenÃ§a de petÃ©quias na Ã¡rea demarcada</span>
                                  </div>
                                  <div className={`w-4 h-4 rounded flex items-center justify-center text-white text-xs ${dengueSigaRisk.includes('laco') ? 'bg-purple-600' : 'border border-slate-300'}`}>
                                    {dengueSigaRisk.includes('laco') && "âœ“"}
                                  </div>
                                </button>
                              </div>
                            </div>

                            {/* Risk computation result */}
                            {(() => {
                              let group = "GRUPO A (Tratamento Domiciliar)";
                              let color = "text-emerald-600 bg-emerald-500/10 border-emerald-500/25 font-bold";
                              let action = "Prescrever reposiÃ§Ã£o hÃ­drica de 60 ml/kg/dia (sendo 1/3 do volume com sais de reidrataÃ§Ã£o oral SRO e 2/3 com lÃ­quidos caseiros: Ã¡gua, chÃ¡, Ã¡gua de coco, sucos). SintomÃ¡ticos (Dipirona ou Paracetamol) de 6/6h. Retorno imediato na presenÃ§a de sinais de alarme. ProibiÃ§Ãµes: AAS, Ibuprofeno, Nimesulida.";

                              if (dengueSigaGravity.length > 0) {
                                group = "GRUPO D (Choque e Gravidade)";
                                color = "text-red-650 bg-red-500/15 border-red-500/25 font-black";
                                action = "EmergÃªncia clÃ­nica grave! InternaÃ§Ã£o imediata em leito UTI ou enfermaria monitorizada. Estabelecer acesso venoso calibroso imediato e infundir expansor plasmÃ¡tico cristaloide aquecido: 20 mL/kg em atÃ© 20 minutos. Retestar FC e PA. TransferÃªncia monitorizada via equipe mÃ³vel e repetiÃ§Ã£o conforme parÃ¢metros.";
                              } else if (dengueSigaAlarms.length > 0) {
                                group = "GRUPO C (Sinais de Alarme - UrgÃªncia)";
                                color = "text-rose-600 bg-rose-500/10 border-rose-500/25 font-bold";
                                action = "InternaÃ§Ã£o em leito de observaÃ§Ã£o clÃ­nica/permanÃªncia UBS ou UPA. Fornecer de pronto hidrataÃ§Ã£o endovenosa rÃ¡pida: 10 mL/kg de Soro FisiolÃ³gico (SF 0,9%) ou Ringer Lactato (RL) em 1 hora. Reavaliar. Se sem melhora, continuar 25 mL/kg nas prÃ³ximas 4 horas. Monitorar hematÃ³crito urgentemente.";
                              } else if (dengueSigaRisk.length > 0) {
                                group = "GRUPO B (InvestigaÃ§Ã£o CÃ©lula de Risco/Prova LaÃ§o +)";
                                color = "text-amber-600 bg-amber-500/10 border-amber-500/25 font-bold";
                                action = "Solicitar Hemograma completo urgente (com prioridade). O paciente deve permanecer na UBS ingerindo lÃ­quidos (reidrataÃ§Ã£o precoce assistida) atÃ© o resultado do hematÃ³crito para verificar grau de hemoconcentraÃ§Ã£o. Se Ht normal, dar alta para grupo A; se Ht alterado, reavaliar para internamento.";
                              }

                              return (
                                <div className="p-4 bg-white dark:bg-slate-850 rounded-xl border border-slate-150/60 dark:border-slate-800 space-y-3 font-medium">
                                  <div className="flex items-center justify-between pb-2 border-b border-slate-100 dark:border-slate-800">
                                    <span className="text-xs font-black text-slate-400 tracking-widest block font-sans">ClassificaÃ§Ã£o de Risco (Dengue):</span>
                                    <span className={`px-2.5 py-1 rounded text-xs font-black uppercase tracking-wide border ${color}`}>{group}</span>
                                  </div>
                                  <div>
                                    <span className="text-[10px] font-black text-slate-400 uppercase tracking-widest block mb-1">Passo a Passo de Condutas e HidrataÃ§Ã£o:</span>
                                    <p className="text-xs text-slate-655 dark:text-slate-350 leading-relaxed font-semibold">
                                      â€¢ <strong className="text-rose-600 font-bold">ALERTA</strong>: {action}
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
                          {label.replace('â€¢ ', '')}
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
    { category: 'BioquÃ­mica e EletrÃ³litos', values: [
      { name: 'SÃ³dio (Na+)', range: '135 - 145 mEq/L', notes: 'Hiper/Hiponatremia.' },
      { name: 'PotÃ¡ssio (K+)', range: '3.5 - 5.0 mEq/L', notes: 'Risco de arritmias se < 2.5 ou > 6.0.' },
      { name: 'Creatinina', range: '0.7 - 1.3 mg/dL', notes: 'Usar para ClCr.' },
      { name: 'Ureia', range: '15 - 45 mg/dL', notes: 'ProporÃ§Ã£o U/Cr > 40 sugerere prÃ©-renal.' },
      { name: 'MagnÃ©sio', range: '1.7 - 2.2 mg/dL', notes: 'Manter > 2.0 em cardiopatas.' },
      { name: 'CÃ¡lcio IÃ´nico', range: '1.16 - 1.32 mmol/L', notes: 'Corrigir se albumina baixa.' }
    ]},
    { category: 'Hemograma', values: [
      { name: 'Hemoglobina (Hb)', range: '13.5 - 17.5 (M) / 12.0 - 15.5 (F) g/dL', notes: 'Alvo transfusional geral > 7.0.' },
      { name: 'LeucÃ³citos', range: '4.500 - 11.000 /mmÂ³', notes: 'Avaliar desvio Ã  esquerda.' },
      { name: 'Plaquetas', range: '150.000 - 450.000 /mmÂ³', notes: 'Trombocitopenia < 150k.' }
    ]},
    { category: 'Gasometria Arterial', values: [
      { name: 'pH', range: '7.35 - 7.45', notes: 'Acidose < 7.35 | Alcalose > 7.45' },
      { name: 'pCO2', range: '35 - 45 mmHg', notes: 'Componente RespiratÃ³rio.' },
      { name: 'HCO3 (Bicarbonato)', range: '22 - 26 mEq/L', notes: 'Componente MetabÃ³lico.' },
      { name: 'Base Excess', range: '-2 a +2', notes: 'DÃ©ficit de base se < -2.' },
      { name: 'pO2', range: '80 - 100 mmHg', notes: 'Abaixo de 60 = Insuf. RespiratÃ³ria.' }
    ]}
  ];

  return (
    <div className="space-y-8">
      <SectionTitle title="Valores de ReferÃªncia" subtitle="Consulta rÃ¡pida de parÃ¢metros laboratoriais e gasomÃ©tricos." icon={Microscope} />
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
      <SectionTitle title="Guia de PrescriÃ§Ãµes" subtitle="Modelos estruturados de condutas para as principais patologias adultas." icon={ClipboardList} />
      
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-4">
           <div className="relative">
              <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
              <input 
                type="text" 
                placeholder="Buscar prescriÃ§Ã£o..." 
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
                      <p className="text-xs font-bold text-amber-700 dark:text-amber-400 uppercase tracking-widest mb-1">ObservaÃ§Ãµes e Alertas</p>
                      <p className="text-sm italic text-slate-700 dark:text-slate-300">{selectedPrescription.guidelines}</p>
                   </div>
                </div>
             </motion.div>
           ) : (
             <div className="h-full min-h-[400px] flex flex-col items-center justify-center text-slate-400 bg-slate-50 dark:bg-slate-900 border-2 border-dashed border-slate-200 dark:border-slate-700 rounded-3xl">
                <ClipboardList size={48} strokeWidth={1} className="mb-4 opacity-20" />
                <p className="text-sm font-medium">Selecione uma prescriÃ§Ã£o ao lado para visualizar os detalhes.</p>
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
      <SectionTitle title="Resumos MÃ©dicos" subtitle="Biblioteca de conteÃºdos aprofundados para estudo e consulta rÃ¡pida." icon={BookOpen} />
      
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
                   <span className="text-[10px] font-black uppercase tracking-[0.2em] text-medical-primary">Protocolo ClÃ­nico</span>
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
                          {label.replace('â€¢ ', '')}
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
  setSelectedUbsSubTab,
  setSelectedCatalogDisease
}: { 
  setActiveSection: (s: AppSection) => void; 
  addToHistory: (t: string, r: string) => void; 
  setSelectedDisease: (d: typeof PRESCRIPTIONS[0]) => void;
  setSelectedUbsDiseaseId: (id: string) => void;
  setSelectedUbsSubTab: (tab: 'cronicos' | 'mulher' | 'mental' | 'condutas' | 'guia') => void;
  setSelectedCatalogDisease: (d: DiseaseInfo | null) => void;
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

  // 2.5 Filter Pronto Socorro (PS) Catalog Diseases
  const filteredPsDiseases = PS_CATALOG_DISEASES.filter(d =>
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
                     filteredPsDiseases.length > 0 || 
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
              Pedsocorro: <br /> <span className="text-rose-500">Agilidade & SeguranÃ§a.</span>
            </h1>
            <p className="text-white/70 text-lg leading-relaxed max-w-sm font-medium">
              Apoio Ã  decisÃ£o clÃ­nica para o pronto socorro e atenÃ§Ã£o bÃ¡sica com protocolos baseados em evidÃªncia.
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
                BulÃ¡rio RÃ¡pido <ChevronRight size={18} />
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
                    setSelectedCatalogDisease(d);
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-teal-500/5 hover:border-teal-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-teal-600 dark:text-teal-400 bg-teal-500/10 dark:bg-teal-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Geral / AtenÃ§Ã£o BÃ¡sica ðŸ¥
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white group-hover:text-teal-600 dark:group-hover:text-teal-400 transition-colors uppercase italic font-serif leading-snug">{d.name}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{d.diagnostic}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Protocolo Ambulatorial <ChevronRight size={10} />
                  </div>
                </button>
              ))}

              {/* Pronto Socorro (PS) Diseases */}
              {filteredPsDiseases.slice(0, 6).map(d => (
                <button 
                  key={d.id} 
                  onClick={() => { 
                    setSelectedCatalogDisease(d);
                    setGlobalSearch(''); 
                  }} 
                  className="p-5 text-left border border-slate-200 dark:border-slate-700/60 rounded-3xl bg-white dark:bg-slate-850/50 hover:bg-rose-500/5 hover:border-rose-400 group transition-all flex flex-col justify-between"
                >
                  <div>
                    <div className="flex justify-between items-center mb-2.5">
                      <span className="text-[8px] font-black text-rose-600 dark:text-rose-400 bg-rose-500/10 dark:bg-rose-500/20 px-2 py-0.5 rounded uppercase tracking-widest font-sans">
                        Pronto Socorro / PS ðŸš¨
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors uppercase italic font-serif leading-snug">{d.name}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{d.diagnostic}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Conduta de EmergÃªncia <ChevronRight size={10} />
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
                        Legenda: Protocolo PS / EmergÃªncia ðŸš¨
                      </span>
                    </div>
                    <div className="font-bold text-slate-800 dark:text-white group-hover:text-rose-600 dark:group-hover:text-rose-400 transition-colors uppercase italic font-serif leading-snug">{p.title}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{p.guidelines || 'Ficha clÃ­nica de internaÃ§Ã£o e terapia farmacolÃ³gica rÃ¡pida.'}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver Anamnese RÃ¡pida <ChevronRight size={10} />
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
                        Legenda: BulÃ¡rio / Dose ðŸ’Š
                      </span>
                    </div>
                    <div className="font-bold text-emerald-600 group-hover:text-emerald-700 transition-colors uppercase italic font-serif leading-snug">{m.name}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-2 leading-relaxed">{m.indication || 'IndicaÃ§Ã£o e ajuste de funÃ§Ã£o renal.'}</p>
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
                        Legenda: Resumo AcadÃªmico ðŸ“š
                      </span>
                    </div>
                    <div className="font-bold text-purple-600 group-hover:text-purple-700 transition-colors uppercase italic font-serif leading-snug">{s.title}</div>
                    <p className="text-[10px] text-slate-400 dark:text-slate-550 mt-2 line-clamp-1 leading-relaxed font-sans font-medium">{s.area}</p>
                  </div>
                  <div className="text-[10px] text-slate-400 mt-4 font-bold uppercase tracking-widest flex items-center gap-1 font-sans">
                    Ver TÃ³pico de Estudo <ChevronRight size={10} />
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
          { id: 'ubs', title: 'AtenÃ§Ã£o BÃ¡sica & UBS', desc: 'Preventivos, cronograma de prÃ©-natal, rastreamentos, saÃºde mental PHQ-9/GAD-7 e HAS/DM.', icon: Stethoscope, color: 'bg-teal-600 animate-pulse' },
          { id: 'drugs', title: 'Calculadora de Doses', desc: 'Doses por peso, funÃ§Ã£o renal e perfusÃ£o contÃ­nua.', icon: Pill, color: 'bg-emerald-500' },
          { id: 'calculators', title: 'Calculadoras & Scores', desc: 'ClCr, CURB-65, qSOFA, Glasgow e outros.', icon: Calculator, color: 'bg-blue-500' },
          { id: 'flowcharts', title: 'Fluxogramas ClÃ­nicos', desc: 'Diretrizes interativas para emergÃªncia e UTI.', icon: Activity, color: 'bg-rose-500' },
          { id: 'prescriptions', title: 'Guia de PrescriÃ§Ã£o', desc: 'Modelos prontos para patologias comuns.', icon: FileText, color: 'bg-amber-500' },
          { id: 'summaries', title: 'Resumos MÃ©dicos', desc: 'Resumos de diretrizes, matÃ©rias e condutas.', icon: BookOpen, color: 'bg-purple-500' },
          { id: 'lab', title: 'Valores Laboratoriais', desc: 'Valores de referÃªncia para exames e gasometria.', icon: Microscope, color: 'bg-cyan-500' },
          { id: 'history', title: 'HistÃ³rico Recente', desc: 'Acesse cÃ¡lculos recentes guardados localmente.', icon: History, color: 'bg-indigo-500' },
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
  const [activeTab, setActiveTab] = useState<'meds' | 'diseases'>('meds');
  const [search, setSearch] = useState('');
  const [selectedMed, setSelectedMed] = useState<Medication | null>(null);
  const [selectedDisease, setSelectedDisease] = useState<any | null>(null);
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

  // Medications filter & sort
  const filteredMeds = MEDICATIONS.filter(m => 
    m.name.toLowerCase().includes(search.toLowerCase()) || 
    m.indication.toLowerCase().includes(search.toLowerCase()) ||
    m.category.toLowerCase().includes(search.toLowerCase())
  );

  const sortedMedications = [...filteredMeds].sort((a, b) => {
    const aFav = favorites.includes(a.id);
    const bFav = favorites.includes(b.id);
    if (aFav && !bFav) return -1;
    if (!aFav && bFav) return 1;
    return 0;
  });

  // Diseases database union
  const allDiseases = useMemo(() => {
    return [
      ...UBS_CATALOG_DISEASES.map(d => ({ ...d, setting: 'UBS (AtenÃ§Ã£o BÃ¡sica)' })),
      ...PS_CATALOG_DISEASES.map(d => ({ ...d, setting: 'Pronto Socorro / EmergÃªncia' }))
    ];
  }, []);

  const filteredDiseases = allDiseases.filter(d => 
    d.name.toLowerCase().includes(search.toLowerCase()) ||
    d.category.toLowerCase().includes(search.toLowerCase()) ||
    (d.diagnostic && d.diagnostic.toLowerCase().includes(search.toLowerCase()))
  );

  // Dynamic Pediatric Dose Calculator based on patient weight
  const calculatePediatricDose = (med: Medication, weightKg: number) => {
    if (!weightKg || weightKg <= 0) return null;
    const nameLower = med.name.toLowerCase();
    
    if (nameLower.includes('amoxicilina') && !nameLower.includes('clavulanato')) {
      // 50 mg/kg/day divided in 3 doses (Amoxicilina 250mg/5mL)
      const dailyMg = weightKg * 50;
      const singleMg = Math.round(dailyMg / 3);
      const singleMl = parseFloat(((singleMg * 5) / 250).toFixed(1));
      return {
        formula: '50 mg/kg/dia dividido em 3 doses (de 8/8h)',
        mg: `${singleMg} mg por dose`,
        ml: `${singleMl} mL de 8h em 8h`,
        presentation: 'SuspensÃ£o de 250mg/5mL',
        instructions: `Administrar ${singleMl} mL por via oral de 8/8 horas por 7 a 10 dias consecutivos.`
      };
    } 
    else if (nameLower.includes('amoxicilina') && nameLower.includes('clavulanato')) {
      // 45 mg/kg/day divided in 2 doses (Amoxicilina + Clav 400mg + 57mg/5mL)
      const dailyMg = weightKg * 45;
      const singleMg = Math.round(dailyMg / 2);
      const singleMl = parseFloat(((singleMg * 5) / 400).toFixed(1));
      return {
        formula: '45 mg/kg/dia dividido em 2 doses (de 12/12h)',
        mg: `${singleMg} mg (componente Amox) por dose`,
        ml: `${singleMl} mL de 12h em 12h`,
        presentation: 'SuspensÃ£o de 400mg + 57mg / 5mL',
        instructions: `Administrar ${singleMl} mL por via oral de 12/12 horas por 7 a 10 dias.`
      };
    }
    else if (nameLower.includes('ibuprofeno')) {
      // 1 drop per kg up to 40 drops
      const drops = Math.min(Math.round(weightKg), 40);
      const mg = drops * 2.5; // (50mg/mL, 20 drops = 1mL, so 2.5mg/drop)
      return {
        formula: '1 gota/kg por dose (de 6/6h ou 8/8h) -- MÃ¡x: 40 gotas',
        mg: `${mg} mg por dose`,
        drops: `${drops} gotas por dose`,
        presentation: 'Gotas de 50mg/mL (1 gota = 2.5mg)',
        instructions: `Administrar ${drops} gotas via oral de 6/6h ou 8/8h em caso de dor ou febre alta.`
      };
    } 
    else if (nameLower.includes('paracetamol')) {
      // 1 drop per kg up to 35 drops
      const drops = Math.min(Math.round(weightKg), 35);
      const mg = drops * 10; // (200mg/mL, 20 drops = 1mL, so 10mg/drop)
      return {
        formula: '1 gota/kg por dose (de 4/4h ou 6/6h) -- MÃ¡x: 35 gotas',
        mg: `${mg} mg por dose`,
        drops: `${drops} gotas por dose`,
        presentation: 'Gotas de 200mg/mL (1 gota = 10mg)',
        instructions: `Administrar ${drops} gotas via oral de 4/4h ou 6/6h se febre alta ou dor.`
      };
    }
    else if (nameLower.includes('dipirona') && med.presentation.toLowerCase().includes('gotas')) {
      const drops = Math.min(Math.round(weightKg), 40);
      const mg = drops * 25; // (500mg/mL, 20 drops = 1mL, so 25mg/drop)
      return {
        formula: '1 gota/kg por dose (de 6/6h) -- MÃ¡x: 40 gotas',
        mg: `${mg} mg por dose`,
        drops: `${drops} gotas por dose`,
        presentation: 'Gotas de 500mg/mL (1 gota = 25mg)',
        instructions: `Administrar ${drops} gotas via oral de 6/6 horas em caso de febre ou dor moderada/intensa.`
      };
    }
    else if (nameLower.includes('prednisolona')) {
      // 1 mg/kg once daily up to 40mg
      const dailyMg = Math.min(weightKg, 40);
      const ml = parseFloat(((dailyMg * 1) / 3).toFixed(1)); // 3mg/mL
      return {
        formula: '1 mg/kg em dose Ãºnica diÃ¡ria (pela manhÃ£) -- MÃ¡x: 40mg',
        mg: `${Math.round(dailyMg)} mg por dia`,
        ml: `${ml} mL por dia`,
        presentation: 'SoluÃ§Ã£o Oral de 3mg/mL',
        instructions: `Administrar ${ml} mL via oral 1 vez ao dia pela manhÃ£, de preferÃªncia apÃ³s o cafÃ© da manhÃ£, por 3 a 5 dias consecutivos.`
      };
    }
    else if (nameLower.includes('azitromicina') && med.presentation.toLowerCase().includes('susp')) {
      // 10 mg/kg once daily up to 500mg
      const dailyMg = Math.min(weightKg * 10, 500);
      const ml = parseFloat(((dailyMg * 5) / 200).toFixed(1)); // 200mg/5mL
      return {
        formula: '10 mg/kg/dia em dose Ãºnica diÃ¡ria -- MÃ¡x: 500mg',
        mg: `${Math.round(dailyMg)} mg por dia`,
        ml: `${ml} mL por dia`,
        presentation: 'SuspensÃ£o de 200mg/5mL',
        instructions: `Administrar ${ml} mL via oral 1 vez ao dia por 3 a 5 dias.`
      };
    }
    else if (nameLower.includes('cefalexina') && med.presentation.toLowerCase().includes('susp')) {
      // 50 mg/kg/day divided in 4 doses
      const dailyMg = weightKg * 50;
      const singleMg = Math.round(dailyMg / 4);
      const singleMl = parseFloat(((singleMg * 5) / 250).toFixed(1)); // 250mg/5mL
      return {
        formula: '50 mg/kg/dia dividido em 4 doses (de 6/6h)',
        mg: `${singleMg} mg por dose`,
        ml: `${singleMl} mL de 6h em 6h`,
        presentation: 'SuspensÃ£o de 250mg/5mL',
        instructions: `Administrar ${singleMl} mL via oral de 6/6 horas por 7 a 10 dias.`
      };
    }
    else if (nameLower.includes('salbutamol') && med.presentation.toLowerCase().includes('xarope')) {
      // 0.15 mg/kg/dose 3-4 times daily
      const singleMg = parseFloat((weightKg * 0.15).toFixed(2));
      const singleMl = parseFloat(((singleMg * 5) / 2).toFixed(1)); // 2mg/5mL
      return {
        formula: '0.15 mg/kg/dose de 8/8h ou 6/6h',
        mg: `${singleMg} mg por dose`,
        ml: `${singleMl} mL de 8h em 8h`,
        presentation: 'Xarope de 2mg/5mL',
        instructions: `Administrar ${singleMl} mL via oral de 8/8h em caso de broncoespasmo (tosse cheia, chiado).`
      };
    }
    
    // Generic drug pediatric suggestion
    return {
      formula: 'Sob orientaÃ§Ã£o mÃ©dica pediÃ¡trica',
      mg: 'Conforme escala ponderal especÃ­fica',
      presentation: med.presentation,
      instructions: `Ajustar dosagem pediÃ¡trica baseada no peso (${weightKg} kg) e faixa etÃ¡ria. Consulte diretrizes clÃ­nicas locais.`
    };
  };

  return (
    <div className="space-y-6">
      
      {/* Search Mode Tabs */}
      <div className="flex border-b border-slate-100 dark:border-slate-800">
        <button 
          onClick={() => { setActiveTab('meds'); setSearch(''); }}
          className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'meds' ? 'border-medical-primary text-medical-primary' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <Pill size={16} />
          Pesquisa de Medicamentos
        </button>
        <button 
          onClick={() => { setActiveTab('diseases'); setSearch(''); }}
          className={`px-6 py-4 font-bold text-sm flex items-center gap-2 border-b-2 transition-all cursor-pointer ${activeTab === 'diseases' ? 'border-medical-primary text-medical-primary' : 'border-transparent text-slate-400 hover:text-slate-600 dark:hover:text-slate-200'}`}
        >
          <Stethoscope size={16} />
          DiretÃ³rio de DoenÃ§as & Tratamentos
        </button>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* Left Search Sidebar */}
        <div className="lg:col-span-4 space-y-4">
          <div className="relative">
            <Search className="absolute left-4 top-1/2 -translate-y-1/2 text-slate-400" size={18} />
            <input 
              type="text" 
              placeholder={activeTab === 'meds' ? "Buscar medicamento..." : "Buscar doenÃ§a ou conduta..."}
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full h-12 pl-12 pr-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-2xl focus:ring-2 focus:ring-medical-primary/20 outline-none transition-all dark:text-white font-semibold text-sm"
            />
          </div>

          <div className="space-y-2 h-[400px] lg:h-[600px] overflow-y-auto pr-2 custom-scrollbar">
            
            {activeTab === 'meds' ? (
              // Medications List
              sortedMedications.map(med => (
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
                        <div className="font-bold text-sm">{med.name}</div>
                        <div className="text-xs opacity-70 mt-1 font-medium">{med.indication}</div>
                      </div>
                      <button 
                        onClick={(e) => { e.stopPropagation(); toggleFavorite(med.id); }}
                        className={`p-1.5 rounded-lg transition-colors ${favorites.includes(med.id) ? 'text-amber-400' : 'text-slate-300 dark:text-slate-600 hover:text-amber-400'}`}
                      >
                        <Bookmark size={14} fill={favorites.includes(med.id) ? 'currentColor' : 'none'} />
                      </button>
                    </div>
                  </div>
                </div>
              ))
            ) : (
              // Diseases List
              filteredDiseases.slice(0, 80).map(disease => (
                <div key={disease.id} className="relative">
                  <div
                    onClick={() => setSelectedDisease(disease)}
                    className={`w-full p-4 text-left border rounded-2xl transition-all cursor-pointer ${
                      selectedDisease?.id === disease.id 
                        ? 'bg-medical-primary border-medical-primary text-white shadow-lg shadow-medical-primary/20' 
                        : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 text-slate-700 dark:text-slate-300 hover:border-medical-primary/50'
                    }`}
                  >
                    <div className="space-y-1">
                      <div className="font-bold text-xs">{disease.name}</div>
                      <div className="flex justify-between items-center text-[10px] opacity-75 font-semibold">
                        <span>{disease.category}</span>
                        <span className="italic opacity-80">{disease.setting}</span>
                      </div>
                    </div>
                  </div>
                </div>
              ))
            )}

            {activeTab === 'meds' && sortedMedications.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">Nenhum medicamento encontrado.</div>
            )}
            {activeTab === 'diseases' && filteredDiseases.length === 0 && (
              <div className="p-8 text-center text-slate-400 text-xs font-semibold">Nenhuma doenÃ§a encontrada.</div>
            )}
          </div>
        </div>

        {/* Right Detail Card Area */}
        <div className="lg:col-span-8">
          <AnimatePresence mode="wait">
            {activeTab === 'meds' ? (
              selectedMed ? (
                <motion.div 
                  key={`med-${selectedMed.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm"
                >
                  <div className="flex flex-col md:flex-row justify-between items-start gap-4">
                    <div>
                      <div className="inline-block px-2.5 py-1 rounded-full bg-medical-primary/10 text-medical-primary text-[10px] font-bold uppercase tracking-widest mb-4">
                        {selectedMed.category}
                      </div>
                      <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white tracking-tighter italic">
                        {selectedMed.name}
                      </h2>
                      <p className="text-xs text-slate-400 font-bold mt-1 uppercase tracking-wider">IndicaÃ§Ã£o: {selectedMed.indication}</p>
                    </div>
                    
                    {/* Weight Input */}
                    <div className="flex items-center gap-3 bg-slate-50 dark:bg-slate-700/50 p-2 px-3 rounded-2xl border border-slate-100 dark:border-slate-600">
                      <div className="text-right">
                        <p className="text-[9px] font-bold text-slate-400 uppercase tracking-tighter">Peso PediÃ¡trico (kg)</p>
                        <input 
                          type="number" 
                          value={weight}
                          onChange={(e) => setWeight(e.target.value)}
                          placeholder="Ex: 15.0"
                          className="bg-transparent border-none outline-none text-base font-mono text-medical-primary w-20 text-right focus:ring-0 font-bold"
                        />
                      </div>
                      <div className="bg-medical-primary text-white p-2 rounded-xl">
                        <Activity size={18} />
                      </div>
                    </div>
                  </div>

                  {/* Dose Display Section */}
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Adult Dose Card */}
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl space-y-2.5 border border-slate-100 dark:border-slate-800">
                      <div className="flex items-center justify-between">
                        <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Dose Adulta PadrÃ£o</p>
                        <span className="px-2 py-0.5 rounded bg-blue-100 text-blue-600 dark:bg-blue-900/30 dark:text-blue-400 text-[8px] font-black uppercase tracking-wider">Adulto</span>
                      </div>
                      <p className="text-xl font-serif font-black text-slate-700 dark:text-white leading-tight">{selectedMed.dose}</p>
                      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-bold">
                        <Clock size={12} />
                        <span>FrequÃªncia: {selectedMed.frequency}</span>
                      </div>
                    </div>

                    {/* Presentation Card */}
                    <div className="bg-slate-50 dark:bg-slate-700/30 p-6 rounded-2xl space-y-2.5 border border-slate-100 dark:border-slate-800">
                      <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">ApresentaÃ§Ã£o</p>
                      <p className="text-base font-serif font-black text-slate-700 dark:text-white">{selectedMed.presentation}</p>
                      <p className="text-xs text-slate-400 dark:text-slate-500 font-bold">ConcentraÃ§Ã£o padrÃ£o no SUS / FarmÃ¡cia</p>
                    </div>
                  </div>

                  {/* Pediatric Calculator Result */}
                  {weight && parseFloat(weight) > 0 && (
                    <div className="bg-emerald-500/5 dark:bg-emerald-950/20 border border-emerald-500/20 rounded-2xl p-6 space-y-4">
                      <div className="flex items-center justify-between border-b border-emerald-500/10 pb-3">
                        <div className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400">
                          <Heart size={16} />
                          <h4 className="text-xs font-black uppercase tracking-widest">CÃ¡lculo PediÃ¡trico Estimado</h4>
                        </div>
                        <span className="px-2.5 py-1 rounded bg-emerald-500/10 text-emerald-600 dark:text-emerald-400 text-[9px] font-black uppercase tracking-wider">Peso: {weight} kg</span>
                      </div>
                      
                      {(() => {
                        const pedCalc = calculatePediatricDose(selectedMed, parseFloat(weight));
                        if (!pedCalc) return null;
                        return (
                          <div className="grid grid-cols-1 md:grid-cols-2 gap-6 text-slate-700 dark:text-slate-300">
                            <div className="space-y-2">
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter">FÃ³rmula Base Recomendada</p>
                              <p className="text-sm font-bold text-emerald-600 dark:text-emerald-400">{pedCalc.formula}</p>
                              
                              <p className="text-[10px] font-bold text-slate-400 uppercase tracking-tighter mt-4 block">Volume Ponderal por Dose</p>
                              <p className="text-3xl font-serif font-black text-emerald-600 dark:text-emerald-400 tracking-tight">
                                {pedCalc.ml || pedCalc.drops || pedCalc.mg}
                              </p>
                              <p className="text-[10px] text-slate-400 font-bold uppercase tracking-wider">{pedCalc.presentation}</p>
                            </div>

                            <div className="bg-white dark:bg-slate-800/80 p-4 rounded-xl border border-emerald-500/10 text-xs font-semibold leading-relaxed text-slate-600 dark:text-slate-300">
                              <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1.5 flex items-center gap-1.5 text-emerald-600">
                                <Info size={12} />
                                Posologia PediÃ¡trica Detalhada
                              </p>
                              {pedCalc.instructions}
                              <p className="text-[9px] text-rose-500 font-bold uppercase tracking-wide mt-3">* AtenÃ§Ã£o: Sempre confira o peso e confirme a concentraÃ§Ã£o do frasco antes de orientar o paciente.</p>
                            </div>
                          </div>
                        );
                      })()}
                    </div>
                  )}

                  {selectedMed.renalAdjustment && (
                    <div className="bg-amber-50 dark:bg-amber-900/20 border border-amber-200 dark:border-amber-900/50 p-6 rounded-2xl flex gap-4">
                      <AlertTriangle className="text-amber-500 flex-shrink-0" size={20} />
                      <div>
                        <h4 className="text-amber-800 dark:text-amber-400 font-bold text-sm">Ajuste Renal / InsuficiÃªncia Renal</h4>
                        <p className="text-xs text-amber-700 dark:text-amber-500/80 mt-1 font-semibold leading-relaxed">{selectedMed.renalAdjustment}</p>
                      </div>
                    </div>
                  )}

                  <div className="space-y-4">
                    <div className="flex items-center gap-2 text-slate-400">
                      <ClipboardCheck size={18} />
                      <h4 className="text-xs font-bold uppercase tracking-widest">ObservaÃ§Ãµes ClÃ­nicas & Cuidados</h4>
                    </div>
                    <div className="bg-slate-50 dark:bg-slate-900/40 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl text-slate-600 dark:text-slate-300 leading-relaxed italic text-xs font-semibold">
                      "{selectedMed.notes}"
                    </div>
                  </div>
                </motion.div>
              ) : (
                <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 border border-dashed border-slate-200 dark:border-slate-700 rounded-3xl py-20">
                  <div className="bg-slate-100 dark:bg-slate-800 p-8 rounded-full mb-6">
                    <Pill size={64} strokeWidth={1} />
                  </div>
                  <p className="text-lg font-medium">Selecione um medicamento para conferir as dosagens</p>
                  <p className="text-sm opacity-60">Utilize a busca rÃ¡pida Ã  esquerda</p>
                </div>
              )
            ) : (
              // Diseases Directory View
              selectedDisease ? (
                <motion.div 
                  key={`dis-${selectedDisease.id}`}
                  initial={{ opacity: 0, x: 20 }}
                  animate={{ opacity: 1, x: 0 }}
                  exit={{ opacity: 0, x: -20 }}
                  className="bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-3xl p-6 md:p-8 space-y-8 shadow-sm"
                >
                  <div>
                    <div className="flex justify-between items-start flex-wrap gap-2">
                      <div className="inline-block px-2.5 py-1 rounded-full bg-medical-primary/10 text-medical-primary text-[10px] font-bold uppercase tracking-widest">
                        {selectedDisease.category}
                      </div>
                      <span className="text-[10px] bg-slate-100 dark:bg-slate-700/50 text-slate-600 dark:text-slate-300 px-2.5 py-1 rounded-md font-black uppercase tracking-wider">
                        {selectedDisease.setting}
                      </span>
                    </div>
                    <h2 className="text-3xl font-serif font-black text-slate-800 dark:text-white tracking-tighter italic mt-3">
                      {selectedDisease.name}
                    </h2>
                  </div>

                  {/* Diagnostic Criteria Block */}
                  <div className="space-y-3">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest flex items-center gap-2">
                      <ClipboardCheck size={14} className="text-medical-primary" />
                      CritÃ©rios DiagnÃ³sticos e InvestigaÃ§Ã£o
                    </p>
                    <div className="bg-slate-50 dark:bg-slate-900/40 p-6 rounded-2xl border border-slate-100 dark:border-slate-800 text-slate-700 dark:text-slate-200 text-sm font-semibold leading-relaxed">
                      {selectedDisease.diagnostic || 'DiagnÃ³stico essencialmente clÃ­nico baseado em anamnese e exclusÃ£o de diferenciais de alarme.'}
                    </div>
                  </div>

                  {/* Alarm Red Flag Block */}
                  {selectedDisease.alarm && (
                    <div className="bg-rose-500/5 dark:bg-rose-950/20 border border-rose-500/20 rounded-2xl p-6 space-y-2.5">
                      <p className="text-[10px] font-black uppercase text-rose-500 tracking-widest flex items-center gap-2">
                        <AlertTriangle size={15} />
                        Sinais de Alarme & CritÃ©rios de Gravidade (UrgÃªncia)
                      </p>
                      <p className="text-xs text-slate-700 dark:text-rose-200/90 font-bold leading-relaxed">
                        {selectedDisease.alarm}
                      </p>
                    </div>
                  )}

                  {/* Line Treatments */}
                  <div className="space-y-4">
                    <p className="text-[10px] font-black uppercase text-slate-400 tracking-widest">Condutas e Diretrizes de Tratamento</p>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      
                      {/* First line */}
                      {selectedDisease.treatment && selectedDisease.treatment[0] && (
                        <div className="bg-slate-50 dark:bg-slate-700/20 border border-slate-100 dark:border-slate-800 p-6 rounded-2xl space-y-3">
                          <h4 className="font-serif font-black text-slate-800 dark:text-white text-base flex items-center gap-2">
                            <span className="w-6 h-6 rounded-lg bg-emerald-500 text-white font-serif font-black text-xs flex items-center justify-center">1</span>
                            {selectedDisease.treatment[0].title}
                          </h4>
                          <p className="text-xs text-slate-600 dark:text-slate-300 font-semibold leading-relaxed">
                            {selectedDisease.treatment[0].desc}
                          </p>
                        </div>
                      )}

                      {/* Second line */}
                      {selectedDisease.treatment && selectedDisease.treatment[1] && (
       xœì½Ks#G¶&¸×¯pñªD Šxò‘ÌI’LÞJ&Y	*«¬sr¤ à¢2Åƒ±hv»w³èÝ¬zÓ¦ê+«2Óf43‹»lþ“ûæ'Ì9îîî R™*Â¤$àááãÇ¿sü<‰?[ûœô+^[cº½ÔÖÇ
im½I–ÿáYRð¤Ùl´›¤çùê‹?âR«ß,—nBé¤¶A|/rtPk_:$˜X}Z»ª­.í|FŒŸ­ÑšÜ¦3Ïkõí3Â¾ö«ÿ„ô2”ÞÄÞÏÊ.FvHùåžPræÐKEã Ö§nZ“Z»°Ðhª+·âº2’ºã	Œ5îA‡×¡Ò»|hÚóç(í³+ñsi§½ÕÀ·7ð: í‡t°gúY}j…c¨â]ë}=´C‡Þqc´V8¹óqÛ¥AßP—­B™èüØîyÎ€8ÔØî°æSÇº¤ƒ)ƒ^Ü§úÅ]š˜«ßj ¥›.WõÕŸ1\ØjŒ½ÐöÜºæj•<#•ü™å7ªEŽÃIÿ©õ=§ˆVä	YÓLN’ºbV0¢uý¶µë|Bì«°v'Wp£vL$eC…)l&³îŽ{µeluCŽ¼ ïM(	ìèöõÆÚ	Bßû@ÿhÂÑöuë†4f˜%-mÃjf„;¦;/ít‘a*)‰ÆxÔ½ý›E&–o‘¾çžÁÚö	û:ˆBË@xš×câ´Ã+˜š¥çQð}D‰ë‘íÓðögßöÈú–ÃF¾yÞ%”ì©?¼ý‡Û·-byÄ±žö}ÚÞV•ß
™o5:®=†99ñi@Ý>MŸUª’~$_«_}vóÙgg‘ÛGr'»–Ó`z=ÿÈD­\k08õ^Ú”]‘›gD-¥>ÃIÖ°Büøk•lïsÏ›*¹†÷Àø!y×‡úWH@C|Ñ{²M¢€vChúÖrßéûËä/d¹7¶Ùß~ä÷Ø—ïïÌbß†0	Cï‚}¿ ŽðGÖ€YAÏ¡ö}LþÅµG¿Üó­uùÓðNþº¤òþÈOô?è„5Â¢Þ©à¿0PÐFƒt:i‡ðiÖ¡.|Q:ô†öanÅCãF¸¿ììÀˆÂ,Mž‘æ
™àB²"ö½ïYCy˜öÛ±Ï©Ï¯XþÀöÎ­ gF¹ûëS×ràŒòWI›°I]x7…ÖTŽ{6\?·œˆ¼T%V Zóî}µîÓAÔ§•
ô¢ÇfÍ"¿#½ÒL:¼‹ãR;‰†#i±ŒO$~+ÙñžíØÏHk…XNýµ]Ÿÿ`!Ñ€}GžŒà«Ò)öBC¯ØµÙ»åõ?ô}ï,¬½°"'Lûf)ëYgHå~U–—¥ö¼» öp²ÿÈ¾ÜÛÇ½Ïvm—W¼›ü,xÆèØrø‡â‡rÿ™å4éÎó£ÃôáQÚ¸—†Æ‰AøæÍóÚÆºÔTXt¼‘ðEyêš±Ë(`ÊÞ½B"èIòÉÚö‹²žãyƒäŒ¬ø®Î-¼*žÚÌÌÂ•jýÌv`±VÎO©ÖêÃQÜƒïÕõø}² ÿdVd²òDkŒàê?'p1€éZø½¼¦Ô&²KSÚø‚³­´•‚±vŠ‹™–Ò+\k+¸@[¹ö€ã>#JÓDU§ôª?ëø<P|ü“×"°ºâöýY)9Ý?‘ÉŠuÃ·Lë‚«ñ$ôÆA:³N¸g[C×ì´pD-?|O$%0¾°'^Éc~n{‘üÈØ›„Wr-@÷öÐµÜþ•nfX;¾À~ÕãÖ‘¯É*`µfú-.ÉíÔ\NZ×ZõõÌUÑzíµ¸'Ú‹i¯ðræbÚ¿äb²:_vöºµ·n_æ¼°Ù	Îß2Ã:p`ÙNJÈ0¨Wê‡ÔU–.¬Å'ëÉ¯mõ(ãÀñL1X–üLwŸôñôñ3Æ´k™ÌûU—©ˆ¸,5Ws™5ÊÛ™ò¸šGxg4ÏÄÝÒ¿fc]SÎ»š›ª—níù«ý=‰s,Â™0ÿž¬t4ÓqOYgò-åQé„tƒ-^©gTââVõúðe·K*]{<qì3îO{Ä€ëÏküVrÓBÆ ­­ø—s;ˆnÊ-¾2–ô*ýú†ã :|y“…:¬E1ëË vmfTðœAÄ´Ï2²NóKe{ôËàñö°2[ðÃ }Rƒ¸‚Hüp#¨†ïžðëÌ·ûüÇªÒeÞ âgîôÑþ+‰p8º“(äs}”üÌ/GsËËÆá—>û«´k‹[+¬TX3®™$"zWA$èãYa%mBßÂª‹oµ·B3”;ûÆ;ûñö©ôÈÕ—_BÍâK¿TE	 ˜=—Yá¨Î¤ÝJ«I~K*•fýéúøÆ®8Þ°Ò¯2NÑ¬¯>Ù”Ë{¼¼Uoµåb›7ëk«UÑ .×‰76±ìfEž’÷É¤ý%²GÏlÀÎ¤òÒ®éZ¡OÇ¶%-Z&èˆ»¤Yýc®83»®Å§”ã\þ}HAÒÇ)F¸Ì60  ©–-Cuæå7¿¡\/$×R§+ßðºk)ó{1õÞxi®?‡·üå/äóü¾om“ÖLµ<à„°’°wq ÖóáM0M_á¸w°§ˆJhR«æÍ|¨Èöö6Yæ[ÆrJPrµšgãaåOÃÔSß¹Z†-§Y_cÐ¢¾.ˆ…PÜî^-¯uC&Aiœ‚Æ¶¥7üF— Œaƒa´Ä@‹ÁÕCïÀ¾¤ƒJ»“s¾q‚¬Åºuú~	‚ÉÐt¯:dRïñÕ[R1M¦‰`>¾÷u_%„âÇÍ­T`0`,@Ì†!ªÂàTžàšW8N,ÛUãç~‹äµ¹®¿”Œ^+=&ŸÆâ§,ZÆÕ*ƒÙÛ%Ærú`Ô;¸„‰ýk5›Òhñqi†IT.pLF0$£jUÓ»¸cü*]0µÌÝ)c–y×Îx2í ¢xÔÙBzÂÒÓ”0,g2²Ô»jÍz{Ñ#|Ym¶ÓWB»vÈ‡jòL­Uo7e–Ä›„Am%[ÉÄ»¨°/cÛÅJäÃ
,Æ^Q5›u©ÜÆß£Ü}xºº	5¨KZÚ¡8}]}**qeL\™Ñ6ÇgJ›‰
9{ÇÐ·ÿAuzPk‘ñàYús•É
è­^† FHÚRÏÝuìþ‡íkN7BYáúGE¯š¾÷ú;<þêwY“Î5Îô¶
ß‰[ÍròÅ5ª:9«åšÍ¯ÉroÈ´Òp¥6ñí±²¤ÐÓg‹¥#¨ Äï¢†Gnü[æÞF»¹Ä„•óòjúrGË7ß¥½—ÕÏ[GvßŠ{yLÆ½Úš¾£ióYÓØÏ¸ÙE];4ß'VÛÅÿÖh5wnÈN¡„Ši'£¾ÛjŒV•
´‡^©ÆžŒC<8Üu@ÙF’D/gÁ³·?Ý÷êŠ†~«Áéi>ãZåû!1¡±þ„‰¬#£)$–v´ˆÈD³ïHb¿ß«íŸ’J»ÙnUç¤°¶}ëöo·ÿÃ#/oL}¦p¨té„_„RxÕª.Ðð å^¨ŒÌüêI,îå0±Ã£]ò%éF ºÝþÔ·éœDvû_]hcbc¸3ý‰‡‡”Üþl-)X$?Ãó¹ûáfìäïS&4‡úá©o[îÐ™¶gÆ}Õ‘[b“r72Û˜FöÌIc]zNiY0rÒÙ] )ñÞ{¡%qxü	Ó²&Å$”vQGC€ÜèÝIˆ³ÍI9¸†°Ýù·?N€€¸íE@'] 	Ý}òTnÛ›NDw%"¤!Â”ÁsRÒžœE.SÇþðö¯.%Òúæôp´›™Ü9%6,Ÿ0E=÷-Û-&'¹›:Š²±½»3&q|>'AÁÎh9â¦¾7¶HBÜ:é^H>}ÂäÓ¡»?*¦Ÿ´—:êé9Ñ65n÷P9Ý?™Wº;ñ½ž…GTõÛŸG‚ïPé"±63q»°Í­ç>erÙÔ0Ì=k']ÕÑÔ$ò'Î¨j÷eç?þËÙëÂ?ÌvcNÒzcjGJê¼ÝÅ£ªƒÎé)6”¼ŠJ¬0?ašÚó= †0(&(¹§÷›bÛ’»R â¨o¡ÙÛ"ÕšÌÎö^èˆ[ð~ÂDÔí[ÓÄÿ¤:ò¡c4 Ü%¡Ç€÷ß:Odÿ=aCÿ’NnaLºÑÙ÷ENÂ¾û×MOi'ï_=žØ…Ï}ø÷ØgÐ".ÑáŒí#Ï\ Aqëÿ{!(áXð	T	9.í¤qƒ[»+{bF‡sQçÜrì”€·çÆ*®‡Ài‘§*Üyä~V„cÊ§LJž÷^õaÊÙJÚQ9…Ú|çÝŽjÞ-½¢ÒÔÄó	úUáEê˜ÿÑýè¸kÓ'LKåÀwÚO)õ¯,÷î¤´³ ˆÛÿ<Œ¬yõ¨òVL4‹iIøçÅ¿2þ}dìÐÙ²CÉÖ%?4_~©8ªn¥>­Ävx,gûú:n,3²†ÛMrsC,þFåz‹]g—é¥ªÏb©ê8j¢Ùi‰Zç‡n$š¬sif
ù8$JôH59Žç\Í³îÛ)%r
j7oro‹	m	h‹äè…¼²Ïó¨›ÌjÙÔæ–M&ÿÚ-“{¬cõ¨£Ì‹ãÉì*Å§ÞÇÑHµ>÷ðF<ü»ýy`ÃŽF–C*ãýï¯ª[V»ö½6Zu’ðj¯ä–èK„Ù¨o_kízoQŽ@>…*4f•y#åÊ/U®I½^Ÿ¬0#eZ-H…<¹©V•9ºàŽÉ`røst„§)sÑkØ‹BÇv)û±„.›}:òÐxv{iÿÅúú’ÎiÙäX~ß3uBT>8=Ü$sÎ)ŠíÇáizÒ,=KÚ²âÕÊ—çNÁ¦nyò`CÌÍÅçâØ,Ê/flýõ^þ[Þ„ù‘óž.¡áçÒÎó²²]o«Á/—y”Í/íÀfé>»ÕàÃ;Ï¸Ç6ñsŽ|ê ññ=óÈ ùÿÌ4òÂ3`içpà³»nù\k|A> ²«2RD%y$2ˆZFPYÎí¿Ë+ä»/4¯¿!¯¾ÓÆ
‘& Û‰ÓUmg-Þí-'†lH6ô³ï”KpïÀ8*ö€¢]½‡~þRÍ2´æâù¸'Å)K¹vëæµk9ç–‚0F¤è{šIÌ
1ì“‰/¡†"Ý¢±Ï|„žw…ž‰Õ†zf$3†@£U½áiî “67a½èl7ª3æ×‡gÊã<Ò‘‚y3¡*ºÒq½`^œ¬[fúT°üÎVT^®Å)£Z«]Š‰Ïž£ó\Âfqæõ£àúV ­H?òÂ¸ºCdÈjVhúP(™ÚWÆÃÆ`ni"u5ÑÍfiãqR…ŽÙQq' |J-Ÿ­Ë8†x"¶ô¼F,Žn""šÜ(j;«%ÇjÓˆDYeØç’»•N–WwãTu”Ð)êŽz5ì’¥;úÑBúµÀnAEæ^•‹®—<ôœ–3„÷ÚzmÂxÚµž¡WÀ`›lÛÎw·±^°—gï¸¦†bƒý}÷½}X¶/(us.eÙÖê¯àE5ö!›ƒw­æäò½™Eæf4ƒR´–vN­Kfc¤ßâãjô•1hÉÅ9´C(ZÛ²¥eîorAc84v€×ÅúÐ5`ýãWè­ú“Õñÿü¿D|DcÀ¿‚`šXu:Ü÷T¼²|èKî+Ì`,Mn–oïìÿqh{äš¹ŸºaEÅ*ÙÙ&O›¸º_´pášïÚàwµ‹ïZ[gw­ZÅ·­òÊV{Å·µxmkŒ¥¼X_¾)
Ó85ê$Š:°ºœMƒ±%Þx`9"jÞŒwÆ^/[óRskfþX(~N@O^ŠÀàU.|*ë„¨ä¯—A§J¡î¦ew•I5ìhfÑT/œ–O*»R$´’,	²q”™pF‘Ê¥y¾˜‡F
-)ØãÒÎ4~œ7‘½Ð_TÞÐ³gäõïîkrjÈç÷i5C§3I×ÌÁöQ¶žM¶a:kYBœNœû¸@mp®ì:»sŠÓmâ¥ŸkÒõ?Ÿ vŸxç3 ÜO<<Ôåã~
’ ¤“í¥f½õ¨,™s~ÙþRbþn*6‚z„vw}Æxé˜âw?‰1OÇ@Ý1CŸ3]ŽÝXÙ×Bˆ¹«×b'Ã8ºSŒJëŠn2ç€«¤|;×Ôe!aíx4 Ú¼ñ0bÛnÿB ›Ö&Z9-B·“†áÒéo>!MYM³ Mc£iPÓ¤Èä~¸Ã½›T3‹ÔË$ó6³V¦Pc’–s„`]ÖpQ’B…Œzž¨+¢šÑòqœ  ÕÇkÂŠÆ¨Õà¾f»#
Ó ÖÛ†!i@;E$¦’ÒÒN'¤BÏq`ùc«û}.Š‹)ÍÊ¨ebÁvé›Ðv “BD€øÄœ÷-\zL ²ÜÐîÙ €ö=Wkb\¡—ÏÈ¨À›ÐIxûÓ€zÁ
é yyC,xQ•ÀÓªñv¢ÑaqíIÏ
0}‚GNqÞêK³P¦®´Ü¹¶Vôfq:Eï™Eo5ŠYúNb0©;mÄ¥ÑØs‘¸D“2‚wQŠ¢ëwšåqMì ‰$Îýò
aÊvÉüÛÿNvÙ¤Ð#<•õþëer³b®ÃäKu}ÃêúÆ§ÐŸÐ™áû)uHÑõ¥ªÞ°ªàÏÿö¢×ö'ã)±üRÏY'.ÙBÝóxür€
ö ÒÿÍX4¥R÷¥*7ÖY\€-ƒËõ}%ïëckR© 11x•?)š¢ý@¯¶¯ññº=Ð«S5Vø°œ3Æ\ïDïŸ‘Ï'ñ¥õ{gL¸‚?}–í»¦(n¯¿“lÍ™¢bð¢9žÈÛøÃ»§4Œƒåd-!š>“ßŠÿTS?ñ2<!Tðt‘Ú,6þéÇ°7e÷Ê¬ÑëÐë>#´›Â-På8ù¤_¼±í©y¼æzÃ¸§n
ÊX­
‘Ä„#Ê4 6'>YC|2sZ,“ø#ü2æ²²lÒf‘T Pð‚å£öÂ@ºŒô2€½ÅbÔ›ÐÿÜØ?y9¢þ8‰Ê ÿªõ‚"Ð_RQÂ!? É ÿ€¾ÌN×®‰¹Áèýcê8 }f:?,8åsŒVm:),Ð8rˆç–}éîdViÕ×CÆžß³ëÕ:9…Ý{çXîñÓ
 ”udRŠ £m¬‰×qäÁ8ìD*Oëm©2@*—|rˆ‹Ã(*
-VårÇ	“–´åg•^z€;€æ,Œa––µ¬¤4õäÊfBá"ÔÙ#Ÿ†c93øNôIˆ½ãxm Þº¥TXô·û„Ü<“!÷ƒ©ZÀìf,aT.Â=1Û€ê\ùÀ§ßG‰=¿OŸ-†TÛí2:Î%Uûˆ’Žm
$]v¬í`< ÒÈÛÌHúÁ,EÖ\(ø{ž\ë—ÁìåÓš¦j%¬*’ã-ÒŠI|ÚApÏ1ðúQŸ—jÀ§ƒÊ,BÁ2ù~Ä 8YD¿ Žß«"ÍÒ÷ˆËc`<(€­õ>à¯”6qG ÖÎ«Ócòæ°»{\'G–
e%„û/8£ý‘Ç¾Xçžûã9uP'eËÀžs<wh¬:áA@|2¬½8>(G»xûqt »HDì£âþ²à6	™ù+„·²yÝ;Rñ 7fì›F"eè7	ºëÙ_CˆQ2Õ-X›ždíîÖ]s.ù¥Núaä[ä¸Ï-ÅµKþúÝÚ
Y]!íÒâ¸ôÜISPÊðçùeŠáËàLžàô<ë)+ÁÅv6J Eéì×JÊS\Hçƒ¤›CE¨®‚\Ÿ³7¬áöƒ	´xeæÕüÊ*^¹ý7òÖû!-l‹Â=Ïg¯ÇÜ(œx äè9NòÐ`²(‹¥¹	ëèyËÍ	k}…< mÅ9sI]"ƒîÃÐ3{?öñÐö·”ÝñC¨,Í Ó:÷­ Cu]Ï~í4w„ÙB-#Ím¬‡!;‘Ÿy‘TÇª| ¢Û`D×£Ú§)1R|åÁžhÿ¥Ä74´}…@)ÀN,C‰û—˜ÓW”?9Î •metå2é¶¶—I3yFšRn}r-'õÖûµLq=ÊÔêçMœ„ÓÝ}‚±<)©bÊ¥O«8-ÙgZíø¡XÏÌ&^Ñsªó¹¹Q¿… øA¯±nF½qu†yy ôÙõíðöï¾íÜÎçtÿd¥¯ŽÁ)}ã<í’µk»–4à\°HýíÉ×¤²J&a€Uç¸±¯#HIÞ¥º¡3äöï˜ê|èÞþ É
‘çL¼œñI¢xY±¼Kv˜–·7Íw”
ñwQ•"»¼lsbûPf[(úòTÑ?ð;Gõq‚zy@Þž`Õ8.ÿöïpyŽzÓÜöRÍ/Y¡P¬ªKk+¬k<qèZn_@Ø}Š§OGì2“ÙKÕË7z\=w×¨—rd¶À°’æR©3Ö7«J}•sˆ¬ÒOáÄÛÅ×ì¥ÓšÄGÌ0$Uz\”r­_Pg~­ø:Õ’ý>°¹F'74SõÝSïE
ñR-4(ÄÛBœA¯„¾Š€—L„%¢Hë*S¶Áy±!:äùpWZlkBçÙ!J¦:éz£²|@$PÛé ¸à±k¥ãmït·Ê—ruI«IG2³ä:÷j{·?©ï	ÝgçðO¹$÷ žµÛæä".Z¡}.Û‰ìØîÎØNÊwbxi:îÆ:%+‰fuÎ‹ë8:°lG=!?€yèFaçï»–?¸ýÉê[É~^Œ5€­ù(Eª'ú/¡b[W˜å*ƒµöd]ª¥ƒÍK,VŸ‹URis8TX`JØz©ö º=QLŽ`Ûa”kYúÞyäºPfiÎá)ü{ê{ãžGáÇÆž„ÞÊ4öœ…c´|éo±±"«Ã[q¹ô(nèGqc½öd-Ä5ñ€r¯ûPW—^z$ŽYXÑ/öv‘¥ÍgFŒO>4Úc/Ö$ŽgRî!á½´ð×Šøæ!ÍðÜ/ê+ÕÊOõItV„ûTr\ò“fK`?6pwÁ~:æ–Všž»¨{°†‘“øL%¦¨‹T^Â×1»{…EÎ†ƒôp<(Õ‡¨ª¥V˜øRSàO>éÇf ƒü1xäžb¾!´Å ˆ¿m¦#ÄguêÖÅÂÃ$—Ö#@|€¨õ‰ÙbÃ8Á˜>E”fÏP© Òi	£iÀ#:”hP¨×JÒSÅæ£ÖØ¥A\'YMñ¨R¼©jI<#f<ÐM“®1·*Ÿl<ö°Yk‹+–b_!°zý†¼µóÖ€KD3g9·ü3Ë·]kÊ¨Éøj?j;±ƒÖ”›…·¾7„Í§ÒA#Zxw£søz¿Š½¼ýÏNßóœ§½ä¼e.¤&øÒCc5ñÚéÍšnèú+ÅjsŽÐì©wÂj¥[ùiàµ™ÍV‚Õ’¹HMÚ¢±š\-ƒ\ªÅb6‡&Ùí|sºÿªC,ùÁ(å×É‘@ÅCçx·8¡ˆÓ¥â$=„d±8`}¨Å“N>â¬;+âX>F3È’òw2œeNÃ©Yuel	7ŒGL –gæ¹íØ¾õÊ¨*7†ä(òq zZŸ‹ã(¹)³‹ã#¿hz™f½|n™™€‰˜
Û5ä£1Î<ñ‹NDëc›ˆ™b¸•—þ¬ÓÒÿege–åQÿ‰·bù¾yàÈ†ŽHuÆˆ'ˆã†¿ü…,×j†pÄSaÉ‘ä—@yÔ(å¼U2¦ZLKoÂ Ï,ró“V}õ70”k<ªóz»¾‘¿Öf×ZOÅµåC—^2§FûÜZüÉŸÈ!û8îÛ•!v]dhãõáKÒeGI„•
Ë³[:dí”d„³ºø¡j.õúö'tëa~n	Â<ßú»evÆ	Ì³‰†>hËì92WZ¬à¸ç q˜cp›•0—Êjuù}¡&chý øîZ°œí 69vFìlLjÆkÏ£Ê…7îî£¯h7–Ä÷¿óÜ"ÅÅy×O¼€¼Årf=Uö/1¨ëM°Áq¿é0¢¶_¦ïgÖ¥íýA|ÉØ´úŒ›‘´ª-ÃÔ÷3“æWÒû™ù6yŽ‰<²_ôö=êŠß¿kÙñ»Ñš˜gžUTÖJ5á©	{÷Ø„Ê/\Šª’K£xm™"ßå÷—œó¦	´dýŠMÑôuÁõ˜/ê…oMk0µ&€½AŒ.wy‡ y`M“…c°<~d;MP OBaTiü/ƒß5ªŸ¿k¾¯~e¬Ã§aä»›Ñ·"Ícüá“cÐ=ÆŸ¼ò5n‚f$öÍ¨aL†AÒ‹M.O€” ö9Ïî¼û<Û“7sçx¹¤%[S´bŠVçüâãQ§Æ>×0ûEOve#©ÜfaÖ<‹Q¶­•Q¶­-ZÙ¶–B[F/wqEÐ1âJZ+ªD¹¸Ã³Œ0?”$‘£ðVH4gŒœÏ'óã´?ö}ÌªÒ·˜ƒ¹æu¥bÅ£!)ån÷®ë±õxØó>Œá¦TRËÑ¸÷>gs° 4¬óê-DÃÔ<ÅÚÿva:áDÝeWsXŒ5?ž ä(²ÃüžxÆrZe?bØRÙA¨Zê}3f¨úrDé¡•yw@AÀBÁ‹ë·i‰&X"Õ¥|¤‹%ùFtúÖ˜Áý8ê(ØÛîÈšcP‰¨¼ÿÈ‹-eÕŽoF±E4à¹É]¦ÀBßÎ„)zeüŒXiÀ‰×ó“)8t¡ßGÌj„7 “üæmØ¿ìS§ä4œùv?,Éîs’l];°@6b‡™6ù^Ï¡ãŸx!ueÙà5uGÑØ,<ÂâZXÌ¹ðÇ€‹ùžlÆñ&¢Æñ¥G`\òÂq<â…À8¹iQÀ8!Œ9Á,úº"U+ØÄW:®Ž'Àx1L ¤z˜–Ø˜Ç
=n1XTáZ>’¤|RÍ­„yk3›Á‡ÀÆãÇüásZ/Ÿ0\Ípvû_ÑÌ“Å^:‚û-²ëùÏgÁºæInöqe3{L†õé'Ãê8,jQ¥?žwGÆY|ùÏ;‹Ú´?À~çÌú3ç‘ìÇí'n¬9¼ááÑî=äõ‘Þ‹Pc<{¢åÃÆ´ËeSú<pjå™ó*óÂŽg…•d¨XáÍúzv·‚$Å±æî6»—m\vç¡jPâž`aƒ÷hÀµå%Á‹ÚÚ&ðŽvQâ¯M‰0^ë
fóœúgŽwQÙ@pi‰2¯ñJÔ5‰¯†‹€~ÃÑ3LN|d…£úØv+Ð¦RÑLƒ¬5«ä·Ü¢zó›ï/2	ê2ô<†_ŒFun‰AÂ¹y#©Èù¹ãHœ‹2=˜UÙŠ¦ä¤9<ê7o\åÄ:n7ìc¦©’”Z;¨§¾[ì;Wnm­âw®×ÚÂ9ûyûú0Ö·mµxÉQ	}›°Î¨Üve‡¬Ê‰c}ÑÐ
²­k­7?$Íã?ZI>$dVãÆ~(Ñ*Ç®#« o2•«dñ™iÌV«ÞŽÛ_k­úÓ¸5íÚ:þà­Ù¨µØ%Þž@S%Éò¶§ñYÞU. ÷ÐQƒ{¤dZÐ¥ûI2›X°õ$™Ð=XÐ¡}=ÑV‚ìƒÍzKRåZd‡Lo±«x½ÞM¢ÖgÖZOmµ¢¸hO«‰83²d¼¶6J¼œeNShéäSKÄY¦nµ¾·cµ¾^[“ænýÑÆáQ™›Sævó	<œ*·0L<¯jwêêÓ”>êzK^¸³®÷Ž¹dbð›%¡ –âÍ/ÔØ÷›ÓÃgäZ	žÞb¢ÉÎÓ&³×U/1[Þµ&Páoï{°âíìG·¡‡pÊ¦ôeá{pðk'Ñp´ ¢ù4ŠËÞÎy' ¼hKh"Æ;«%ÌD-Gv«î8½hÌÞ¢yÉ€“ä5õÍûôúf‰—Ù®Œ,_¿É¤'	:«?©µëi_Ø÷é½	€¢•ø@V’±nˆÙ¸ƒÛò÷ÄQ¾J¼‹º}:‘=í÷¡àÌr`Y…9kõ/|+"­Z‚>ÙïÕÚÚãÉý#ØÓ?–d@{š 4póƒb@öÆ)íyDüóˆï€)->lP\)žÓ3“Ø]¬„’©¬Ã˜`œ7Œ†Êi´”#-Œàñu´¿áq‚ä
žJ<'•'µ§Æ
6ŠwïÂÞÐ¬µÖ÷¯­ÿæÑeý¡±g&5[y#`â“žgùJ‰ò*ÞÅ{°Ïä¼~0Pä¶nH|µ`—õÊµÙaÝà{o'ÎíøÈY9Gžáü9wä|?žØwŸpæ§	.ëÏ¯Æþqzïkzu.öwší’îõñdçëÿ‰çúWêoùE¨öîû‰÷~Ö??qÝÏ]à~ûmÑ¶à†Ç,+Ôšá]Öô‰l©@7<+Ë‰XîÅQ©l’–ûÏÑ²Ø-‹ÈÐ¢fei$	[Ö`Ç˜ãú-)AË¢ó³Ü==‹””åSÌÉbÈ™±°L-Ó3žrçôY3$#Éîiú-t¦üq3¥yå?Õ¬ê	„»[6ôœÕpùlèeGp‹‰Æ°–ûÉ)Mk-Þ`¶4ÅºÞÜcÆ4Ý9yŠŽ÷hò©8¡¥f3!•"Tb˜+;‡M¼ýƒðVÖ€EÖÄõô€4[ÃTÎî(£ÌÒwèR¢uæ)âÀìÕ"ÕŠ¨íaª¾½_/mm/ÝµúcÐ¥Çý'k2-äÒzr©Û%•®=ž8ö›é_ÊæÑniîXKûAM<ÿn–Xl%lÃŸ#´),
´“‰y´G„?_'Ž÷4{œ#úqF9B÷º?DtŒ¾øÁ[Ðq†‘[Hoˆ[å8tÈÞB =xëà¾üÈPßµ~ñƒûòÃÆ›öÚãü?íü§QêñP=ûùhÕï?˜»NxÈs¿c|)©ÒƒG™ô
ü”'Íy»ËƒK!½©7ðT±C|Ãp×º|#Ú{_îp,~í»ø=I5@j œE.‹ßBºö€ö,˜‹¬C»”•Ãþäv©?€=Ç
%ÀFÅWÏÅ¿Ýh8D[T¨ææÉÔðŒt&ñý«¤¶g¤ÈW:÷ìÁWâ5Ï€– MZðLò>xÈKÊ¥'²­€û¤«7UÆÒ9óS7:D,œ#á8Q‰ŒØ!7l vëxe]yQ¸—K<÷ö§¾”à%¯õä°È«’õž{û£ƒú3Ìð"ô Ù:¢^úx7¤áÈúÞ„Ê1Ž¨ðz~ûc€‰jä›çÝl=Ö¸‡^Bžo{I}É1þ+;¥ù­˜|ÆËµ]‡”kïD«ÒD’Lö=„ý]Dn?70?¦Ý:±GÊ	k0 _’ßïeŸB©”÷!}v7)“}zXÙÀóóÃ‰Ž}Â´ŠXÃ.)xèÒÃÌ
ùç1¼qß·9PHª8°z
Dî?»&æÿ¡ùF€œägiŒ¤VÀ]‘ƒÚ‡ü,¸·d%¢—Ir°—€P‚¡­|7ÿ¼…£äñoêgÞ`ôÌv`^yCÛÍÑu4†×Ù™ðõ/¹ÇEãü‹G@i<bð%ÿ-)•EÚ£~L4ï¿BÅ„’¶bævÝø-y[ÂÀ÷&ä·„Ñiù{€³’"}†ÂcµÊr£rg­†#{“VÏ¡Ü‘‡fœÇUÎ,' ™]Zºö%@KáZ“È§±¿Åð`Žb·¼jïÖ×ßgøLøKõ6Êíñ³Â©ŠjÖ‡žaSBxk“Œj°PE}Q{ÂÎ®M>à1R(ƒËPûÙh¾Ï8þðÜ”¡eè‘"Ÿ9Ib6ì=»Â*»„V~SìÆê•`œä•êlw®ÉWñLñ¡´	çÍ_BƒÐÅ¿Y Hhñ3°C+Ñä”MùÚ¿ûØÈ¸yRk××•CÑUÀèâ[üðû^Èriƒ%äSµ×4îÝZj0ìØµ”ÎOu$¾J($ëC‘D^1X¢Ï:øµÕµt­(!¸J±2¡TÝÞÎI[) G·qÅ4XU3Hº"!Nãró“5sOF ]‚I8L¹TàÒÉÛŸ$µf#Ûìœt#z"¸VŽÈAvd¶(‰Vè4‰bpUƒÍË#}X:Þy‹ç8 S3»N`—æqÙTuº1Ž¹™WT¹«™Q1lE:’lþyM²7ýê^Ëìeäæ!\› ûÒ,
èfòtÜ<­à8UÐÎ±‡¼Ð²¾jà›™#Í‘^– ×ô¸œ{I^F×H€¼÷ ;$ŠåY²ÿˆ‘,¶¯Íö5A^ùŒ´µ1+rç‹Y¥Ö8ÃzÊ7´GT‡hÄt‡/–¶„Fì_%@H²S›DÀ5´¦Z9*Öë.uÂVV·²Úó»ãaÊ„x­gO(ë3Y€YI/·ÖòFt†}T—¸ÆB?Y{Äžò-‘M./Q©y™BÓ¼(ÏdÓ
×²¶{üR5+*â`!4V›Y~'=±Xƒñ’24ù8*G4¬!í~Y>=q¢ÀÌÙ‰ ú]vŠòk„€ÒŽŽœõ´¢*uÝ&„xvÞ­¶qžÔÖgˆÄëÈÃ—’0AœühBõ´ÙjkkV›œôGLÌ»æ·ÍoS|ë{V¥µ±ÒÚ\_iµŸ®4ëkÕ÷ÚÅh²iP°	CHSÀ‰­{ þ—™åk9’!þŽ"•àù)¹:Ô`ë|êX(DÀp/xnqõÈ$…Níf{£Þ"VYh4…ÎÎ¨(ÆxKsþm˜àg8—úHsù)Ý€	ÝÈL'§®vüEl²ÂŠfg–”ä†’¿@²tØ{S6öÖ": ÍÚÝ›Þ9,Í)[¤üÞj0)4Ve¦zÌFƒÔj5r„¹Ž ‹áÏ>£—Ï Î,ŒM—è:á†Š¬|—Qy¬îÈ%ïÉ6‰ÚE‘h+Ez;IkÈ4÷¢º€ÁC:Ø³
Í*ìªeJ•ÂšèäÍ~w÷ÍáÉéáñëî;vÿB\˜¸
þ[eŠÑMÔáN¿ÓVëpÒ€~äû05x{ùnú[y1«'~·CåîJ•õ+}s7ê%1Ò 'ÖÕîCš6Ø¸·GBgœ(­
Ý¸Ü
ãÁ"êb^Ô!­CÛäW–'‰ ÷mÔ¹\åF,¡Ñelõ2'#ïâÄ·ûÀtŽ¼åðIÉê›Åe+ÍüŠGOËUæX*Wjø	Å@6 ®–£Ðà(¤¿§WÌc€Õ÷J-Ó×¥Ô2±®0²ïjŽù¨ŸÈ%JËûrfŸ…KZ†šð·\[L‹rÓU—˜›“’Ë	°¤`.¤…#Šùn-~Ú £éž„d”²’Ó3/MòD.‘kÉ¿o(ËWžd%Ê“yª@b·§Ô%
´Â³P¶v†Â¤Lüö†Õ“ÚÌ)ûéÆÆÓåjr@ 
Ò~r†˜m¾ÔdX„Âü›êu‡áˆ%
DÁCmÆçúf¨¯QÁ'´	ÁÀ½§ðÕ‹ÔþfªaïŠ§¦D_ 7+h¢ÝL~Ç
döŽ>Ð‰¿–µ$ƒÏØ“*Á¼W˜ê™çã)Æ»ŽJ^bú w•€c®ðM/Lþp °ù‚~ñü!Õî$ð(0ÏS«—­—ªëºï{.j›ØâGÎˆúü+Æüvø’÷ÜAZü–ad[¸þÙ_ÝÛw-xÎê¶3õ’ÒŽ¸¯î™gÞÉÒñg ›H&¬?R‡wŸ`ü]þ]yÝ5ž8ð‘\zšþôYPÊô÷ ˆÝ¼{¯î<ü}u°tÛ°ºû6>ÜÄ$HŽ?÷5ù×îñë:3©°¢*yFÞ½·¥¤[Ö`pêÅ]ß&•Â†çéÒ‹CfÅ“¬#ŸäÄ7®Të¡×eWV7ªuÜ-C¿Ò^!O«±]{åJ²pð…ñ/>Nð²‡|+{…ãAE•Ë“°öüÍr•¯¦¯”–]†xÄ*Z¸‚¦&bÀÞ×Üì*Í ÷Õ¯~Oé„ |¡ä3±ÜÅ T°&1ÄÊ\º¹XáãÎ‡*š=~#:l6{ì±Pü:;æU¤lpàõ#\aõøË>²_g¸Ï\ë0ÙýË*ž¡
ŸŽ½sš©E°1Þ¢÷Uµ£â`_:º—J¦ïh©®E…M™ò)%7ósS¬C)*Ø“Óg»0™g±È4u@W‡gÄõ`-K@-³GQ2ô€ÝzQ@^ÁZAv~tE¾$¾IðöTýŸöÏ38¥ªâÕXO—ÓÍÙn-9Óõ}÷/Í§Í½VG¤ŸjéÕ¦¢B1ÙÔ/õ”,ï="{Ðã©ê©7!@äÂ†ßGÆæMó†CØîÒ£Vƒt¿ †–Œ­ËÚEm_.cm$JŸŠØ­5pÓm =ãˆ³•f<½Àã¶þ“Ñç™,Égsš-'þ–Qvc1œôu¡¬O×³j½D‰G@’<¿6ñlf@¥åÛV)•·—NùT%s'ß™9+áÃ‰N+ÝÈÍ9«yžktUÉ+ö²'<HM»|X0ØêTÚ©µ¦¯¤Øé¯JW3ì§^ê¨ÆçûŠ0 Ã•=t‘ü2WXí™²KØþá•µì½øúes…Àµµÿ5ßgLIM«âeo¨¯¯XÏÈÇYÇQ¸DÔÎÜ|(ë‰±‚­Éu<¯:7ß76²¶f‡¼W¯ŸÝP:„ž7=‚Ïð1™F
è(ð$räà V>C<’éPG‹¨‡Ä%Éü>¦ž±[½Às"˜Ø#«øM ¾âá™vèblð7Tçµ6T‹Ëä-Éô°ßO×ÙAÆ 3«(ç·s]{9&—¤<.I®9(cÃ/N6ËäNŒÉ¶íéÆhG*›¦æŽì2MíôixäEhz™6g	Jùyéö	¹EœíÁsÐÖÍ¬Â<×ÀÔ¶¡£1±Æ=›ÅésãTªŸÙÏ¸X'‡ÀT|‹x¤ûóÀ²<©{qoÿfqr;°Àd<°ÐŽóÊü¸…,YÏŒÉ$3‹l]Æê Wc`ÇŽ4ðÂ`êU †rhÎ|µ2;eO$Ød8«Ÿ_G6_â°F-W¿®³Ø•êMvŒ¯‘ƒ®½ú^XÀz¼4¸p k¶ã0YR¯h!¬Ž¼áw§ÀVn‡‹?Ü+4¸¨¶kÀWÖÇL’ LDJZü¨›¦á&n} šŠË\Ó`W€ŸgéxïÉU¿!U¿¡c‚ëÍev­µšK©uv"[ÐVf	¡lz«F‰	êp¼aÝeæMð£wMÐÞg‰)ë= ã²¸>Ýs;°{ $]¾õðuŠê!ºømL¦¥Á4¦yáÕwÛÜæOgÚb¶—2kn)s·“RöêÄ
a»ÛKïšµ§ï›½ÌjD{±¶‰~ö`¬¯ØÚÛ¾^ËŽ¨î£¬Ôì=¹P?¦¥Ï=…ÔP? Á³X9•Æ»ÿÛß®EÓ™ô„Mx"f[Ûd­šW’ÂùÙÎ6XvÝòkžë\e‡aõr½ìXËa}þãßþšü§VÐÐÐÒ1;#²øN,éÜ¦Ø±Ï&>=CRbR¦–~2@îÌ{ì¹^î Û”,·ß
wSPf´žQ÷Âõ¡,XRnÉèû+ŸËÇù­$w Ï%D](„Ü­@çê+7yâq?r0ëã.ßò™…ëþ¥Ý³Ó¢¼ÙÎ6 [óÖþ=>;‹åÆf,LB±RV‚)5gÏÒ=³©3ŠÒpí”X´~Ez@›Ö»f}•ŽßëEhr!³Ð`\ÙùžU «…ï—cn“3u%àÙ>C°Ó`{®¹©VkYf ¡ºb¥ÆæË<g°k ¯×ÔüIÁL‰1ùÈ¶–º$§ÌºÞ9O^Ï7[Kª%w¾ßÓ«‰5˜:ð¯ûUa,$äeŽØßµ7‘Eå‡þ€ŽLÐá}c…<a²ÿS&a¿ÒZ­šíVàƒuÐ€ï£üÑ,ÇÇO†…é1ñ„p7$ÌmT§_ÂþþÊ|uÉíhøÉë+¬`‚ü9`&mYe`­YÎ/Õ]¬k[i9f>Y—ç'šý¨7Š5Yi?áÊ“…hñ£w€Ô•É…5ï3l"Ùb¢Ìïª¹Cá"ûê(¡%k¦djh—Ü$¤PÖô®ÐÐY¦ª¼±3^š2­Å“™ŸÊWö¤ŠÜ¶¤ŸÇ…ÌšŽ)ÌÃF¦1‘å¦8ëXˆ†<²±<Å5’Ø
‰$=j®µta9GÑ<v&Ö°$ç(é®;.:ð<íDŠŽ‹m­ÞîX'æm(€³Ò¢>Øÿü;³;–•ª ó’Ä£Ðé0‚Â}—ÙBÂ:Éö0÷ƒÛ `ÏÅ)rjy§#äõ9N[1z€<„T‹gJŠö+)U]ê
Ž3‡Ê¯­s<SV¦tÄÔGŠB"„µ|%¼GÀîÄ§NMM,TžÆƒ˜íöÊú’2?gøþ¶Xô’µ½5çóÕ|`OÍrnšº3ÛæÝü3U*œÏ?s±Î™Ð,=…-áœi±Ÿs(ÐðµLAY÷K‘ž<O ›™Ý  Š•.JæjînË"#Ÿžm/ý‹Oç–
§”
óZ¥7âÙ­†eª6Úþ|•¿ò†·?!`NE'>½ý›Wð¢…­¥ÿy»ØÆŽ|Iºßt3¯Êëæ\çúøM3¸”3qÉÛ=„™‹ sf.*þÈ©ùÑðp;µGY:òÙu,ß["ÏÄÏý èÏ[RÇ&§Z¹ƒM‹Ñ”šÅ¼à’ñtP­¡ÓÞ–QïØ°"œ
ÂŠ)o/°	WîTœ\*<LÈL§	°®ãþ¹ª’b·j¨Ó ˜˜îÓúçOz‘¦€óù­)ØçŒ¦\E˜;·Ã%±YbjÝ0Ýhê2,p'MÄ…4 œBSüü3Ë²­¬×§°b2ÙHÈ$áÐÉÜ³’'*ÊOZª´7ÏÚms„”¢¦+­ßçÜu‚Àvîv†°¤§ŽvE ÜaÀ8#½Äð¿±C¸‚£Q¨3Jb'ÄÑ®`q0¸3ÐÎ€_®²~Ã×ÉbVì¦½Yˆ~sÖPµp§B‰Ä·¶åÔ†øª¬PÇ±'ýÖ
¿Ä¿òí¹åWjµð"¹£@yP­¨ó½±HîÜ¶ä3r”ŸL@Ã(1]5zÅ8­k”„l¶Ëò¡˜?Tj¶øŠCÞ-¢åÅNæFõ€Ê¡âÃ•4¥O³ ¤ãòÁ¡z¬òÚ;·È[êBLøÖö½1‘‚•ŸÁÒ¶lí<I„¢ëK1LR…Ö‡5\ãgID?ŒÁƒßŸÄÚ(=(bÁ4!‚ÓïšD¿±¡Ô»V½•=„9&]Ýž-@·?¡“Ù£gÌ:ôÜã6OúÃ¯4T`Êe…08‰Ä&Q,~¸k…^žßrYF.È2=œÞx¸@Î›_ô¼-õœsÒ§˜‹²Ã5‹Û´Ùø´œX¤/ÅR#,õ‡1¯tÂ´@fB¹ýyˆÃ€Ä3qhÈ¿1#E#{t˜ÈaÑ€ùœc©Ìœ¼Ë‘)Šñ7Z®5v)Æ„Åb}” x€'×˜ðÚÂ“Úueˆ'Óq{¶åŠ0,¡)4Å#,Þè7¹>E‰õ¥‚?BÌãA¡"Hzv	<Õ"»RAÆH˜ö…œ©È¬8o³8H¼çýëíÐ!wä¡µFa?°~€1øW-†}‡ûRr¸î+=¥mð[ÙÿÂd¦IfÃBƒÿæÒj®@ƒÆ·ÿÐÆM!,È¹ï¹oØÞ'‹¬‹›É_–E•f&çÍ×[ï»Š‹³Q |[S™ÚÒŒ:¡1Žldæ&§Ð_8&xeŸû”TöèØ›ÂJä²,.DæsóÍZxO±­i«-ÖxêWÜ™[ü¬KàGÌcXò`Šj^».ð~)‘‰Äèø"‘JQtl=]U´@Í&Ã¶¥ßµ6šf35QRÖe¡ç GÇ¦À(•,íìy¢Ø
˜'e"U€¡'$íñÃ¯j.B
"0›‹õæït*ndhç¢Ã¡ù„æÿ¬3‘²ÁöZãÉƒÎE'–lŽÏÎ˜ŽáÀöƒðŸu&&‘b#_˜~þA§ÃŒaB —+8¾$»G¥&"§¶z¸ŒÞn†–.*ÔiÄÝB%zDhè¸ænšÂ.‰›ºQ¨¥Óéõr2nñx›€Ð»f½Ò9UÉÏ ¶ó9I=Ïì€©JPÝçécŽÚZ’Š•#kSÉkýQŽ¦O# |QòÖëßþ%ûv`!­œ¤
ø%ÇÍÏPÍ¨=Õ°Œn'«”3XpO®é»ïŒú>3†¯žMÄ{„P ž€¡hädÃÈ8žé½†ðÚ>±†"½ÝŠìˆ1ùp X÷ÇìŠ3¨qúË­–ò/—Ä¨>kl½™éw.ŸY^¼ÑÞÏÝ%"¯,'|úDÒ@Áö‰(o9ÿqã÷s–¬¡Šucü%±îÉ¹B4jÈÆ–ó1ðøL{Î9?àÆ”ðçãbÈóÄ2÷Ì8y.Ò«•+1q
© fµ‘uM#Ùx—7ç'ÔÖyutÖ-—KÊ4Ø,Éƒqˆ_D6;ð?b1ù>¢E/€f1Éœi”‡¦“	¨Q…º\Wìùx‚`	uã ýTÈfÃ·ô/*—ô+Ls‚Y:°â9š(1í¡c!ôÂg‘È»Át›SÇ8Æ|Ì±¿«cœÝaŒåLÆ¡æ™9j"3ò~ªÒ5³„ÛýÛ'öÀcãÙÙ}ÕE®0Á Pý‘‡\²oûý„® %û$ôà¡>Œè
9ì­Ìš7úvxûwLoÁô¼0ücÊ¿óí ïMÔ¾ÉÁzåaMËî0®<m‹™?ä2°T@¶©¢E‰uûïŒªY˜-ãàî£ ÖìÉË?ÔžÂÀ¼èìÕž&ããžÀØÞþˆŠx¶êyªQŒwLƒ9ÔUö¾9ª®°ôÎ5ão)b*>2²@39·ÆÌØ=ŠÇ•—x~V§uŠÏp¬Å/u°¥Â;Œv’L¥€„åS´Š÷á—ÉJ66z‚:Ü±™Ôa]l|Ô…=œ0ÆjÉÙpV[}Ú,Á
î¿p+2Ùã‰ÇëŒëh(ùÔÁí9Q2´ì»:°IÑ†UÊ”cX9sN| ÆÄvžN>0ê.FÔ³Ü>[À}P®íÂ†F*»€¾û€öÂÚ¹
Tš¦¦Ç°0Uq÷›7Ïkë+ä¬‚¡w±B¬!ì_¡ûÿŽ‘”1›(Æ†§´=XØXêàÆ1—ÅøJ!˜¥!–K5£¬üÎYgÐKØ•—úÄiÂÄÁe™Œ¶OñOî ­	Åcrº‘µè°çÐ…ìP†haŒ€–+}ª­Ø×8\u617RÙ{kŠ~´¥Øê%\¾Ë¹Ì²ö±jå¨þº¸"Zš«Y§‹©S­X—vxOÙšºÑäí%sÀEê2èò÷â‚Ô¥ÀÓ¹*G5%EÙ8ž*¡¡f	QVc:« ;Å×BÄÏOÖÍZsžuó‘IË‡ï34,KÌzeÝ)yý~¥dÝ.xØ˜RdÇ^(}¢1nBÎ£Ý Ñd
ø›oÛAØç¶/³Ú]AÓØúCQ0vÏ@˜`&# ©úÔ‰˜(Z=õè‚Ô¡Oˆ_½Wñx~y˜¥sæ!¨ó›)ˆ¿u±:2ÝD½'sM`_à9Ã±f®JÐT0Æ‚O³QÝu \5ôö:$r&Tk,9Ÿ­eÙ´p¦ Æ |,§\r§jÀ’Ø¯ NÆ\„,Ó²PÈ6³núAzdi—1±9fRf,\rC±œ‹áF ’G.µg„…¨ÌßÑ³CÊÒŠ1, :%ý\ÌÐc\Érp 6pºñ¤¼lìU§ÐÌÕÀ"•7_µM Ýc1ål– œ´¦†h:ÕU)Ó ¸¶/] d¹Ýür¶}ÀÞèH
 ,¦=£È`FÁ`ìqiM&NC<‘…gPa»ª‹îF6Ø¼ãƒƒ‘h,èßT‚éàM¤C;n’9±†\uDnÿ³äƒÉÉÞ\ÃÉÆ+G¨zKÝ=ÐVÒ“²„”Ô=†C:1ÑÆ€ìÆ\Õ° ~Ž¨`5ÐF(Iˆª²Ê§±ª°¡§Ie,¶]”IK˜%’·‡'ˆÙ<T¶`.Qfã9…²ÐPÃLX¢EÌ’(Pºõg/Ð)C3´&kM‰ 1R3ÚÓ2p›šì”’É÷NÇð–Lþúëï[iUüÚ`äüIU‚AìÂÐº‰Á´N|1ÚM×Ðûq'Òl5ÚDÉ:‰±Ù1†T1x*öÈyç¸)6,qŠ·|\Aüð¡`¡‹¡µ¦ö>AÕhÒ¡MËcÊIr‚\,«MèŠ9ÖKdJ9Ž½¸LdÇÞ|xB¿2fjúTæÆ.tOCƒb<eæ‘x´£k`ò‰Òô½´óæSþ:s…kF“ï¥>\ŒmÓè™›a˜§XdhˆÚ×/¨Þ<‘££ïUfLl°O2æ.3Ìoc¼ÕÅÔ
±aƒDÃ[¨¦nÔ¢9*R, ;KåÜO•°375ÌSk°#Ø>ÔtÖj™YÞ¹>+$œ/ÇÖ_Ó„Àû#Ç¨PÊ—ëM.ñS*º’>kPEìZ(ÄXî•ÁÎÛh’«‰RB)ILÊÌ/ç³ÄVä@eŠÊ:›àÃ4ò|¥åŒˆÍ>`ÓMõ¡7y(OM;£Æž}ŠíúÍÐÅÿÔQvls,mhz6„dY°Þ°AØÒ÷¢¾¦é££VE‡xÍÐ•KÛžÝí”Lè? Þ‰„©¦YÀàÁ³¼ædª[[:ÿëÍÆ“|
cLHyÆ‰š³ÝæàßRh¹‚¼²?„PˆJ&ñYŸÀl~e¬~T{÷tý|dT¤š‚i`:×1Œ'ÊÕúj'Oæ£g>mh‡œÀmFƒÊ™jbŠQ^ä°FT ¤mI![Î*®ÀÏáÅ®ŸÄ$U¼Î‡ Æ\âFbU,Wg‰AA\šH†˜…Ùh§±¯¬^R¼Ë2½éFc–•3ïQgi¹.ÙÉhCí+Ã±¨°ûº°3i´²3+ÉX‘ã†š¬÷¬ˆü×f;XS}uß·ØÙ>P	kÒ0ò<yB·ˆ¢ÇfJœÔ§š‹v;­âTç'Õª:™ÚJ£r$µSMÍÿb®B“^ÊÕe’¶LUP‰7>™ëŸgÆÐx:ÆÛr?IÕ£rˆ­2³œní®œîú&/zämŠ“u‹ÛGYø¯ƒF:þìÜGdá$<§`Fž_‚ÿ$b¤Ž°ä?³Ÿ@æ
%–ÓK;,&žêÅúUXöì=ÓZ9]tuj´T©‹ð'e1™Jõ-‹4¹ïœ9Ëg»S‚»ii\‡ÛE©¤>ðeý0Ê·‰'çÐ&‹ËB{g®L_tA,ËzÇMWÌ’»À ¾Ñ‡.8±/1kIˆÇmu)ð‹õß=àŠWÕò
ý2e×îD,cî¯ YG)0û‘3	êÛ¡Dàî][2I€ÄƒF’ÓnQ†ÃÀ)`>4‘ÁõžAáj×K9þ»}Ã.j«˜ÅjUr\ÊÊ‰!Pb/fjÜÌqïõmÊ!džQÂ¼<Sº‹í±ôé¢âÏ;ò‡7d÷xoŸœþ‰t¾yÕÙ;&ï·z>Z»ÔæÃHÏrû:²*Ò:/”>©ˆ5à»#ëœ26»ëMlôùØõë™éT"Gx«et±œŽô»V+ÆUÞx5‰IÊxáLTk˜žf³Ùn¶Úë°*Zk=¿>ôÎë½~¯‹­ÙZÝH=Ûñ51ªçS˜¨®SO_È³­®Äv®¾n¢ý)`±¬’ÿõí¿1.žjsžhÄ‡ìµ<óéŒu-©IeÖÖWÛDÎ,£þØÜ|ÚZRÙWSgwÖ[ËL<.1¿:5C”>—Óâbý¼Î3³‹›Û··×*œÑésztÔèt>ÖY+˜·_vðwß¾eÜ“ôX†$MKjž«Oo6fb©7:©û•»8àèßÓ+ùìg¦*£û3Üšõá-°c ‰‘M"lÆ6q@©¬óèº‰2“F\ßòuiažA,&Qè7 mr7þ‘ƒéÄ/¥ØýËgä¤[Ã=¶v´¿w¸{øºcxNdgsø¼Â´jS.ñO.Kˆq¯Ô+jj¶©]œ± N&B÷½.”"tI|ô[Óâ­I\Ä8õ™‘®‡¾=®TÓ4\«ä/aöcæL@¥ÃÅŸGB3Ÿk˜žÑ“ö ]æ”[i™ÎŠ§ÏùT“ÔÇ$Ü²C¤lVü,Fx¾ÛáÎ ÏYmùÄ®F«ZÖc4½æ{F5âŒ/Êæ‰r6‚œ–ú*fIe¨¯0ºnq´o=9þÿý¿ýˆ™î™>˜©Ò=îEöa²³ôà#]—«5îq5å„V¬»„(¾ ¡²Dò· C’ñðd³
e
d<)å¨Q|ÞÎx™:æ­l€åYá£¬|*£´‘û0Ùù²ïM®¾Ê&¯©“ÓÔyÉ§6úAû4 þ9Fa©):äG—·?9¶§O®hƒ¶|âM¾%©Í´”6ïþe·³·º·û~öœ6Ú¤¨úô48¡G^Ïv(yÉóÑ¤óšm!Ì£0™	¿D“‚kÖ$4Sþ9!åòãHS^.=E¿+iaÌÁåM	crVÓSÁ¨gýºÅ©`T£ƒ¬Zž×ëmtõ,ÿxB]–|)ý© ~EŸÙ.›OmSÑo¦<M¸kå¥˜©âOÊ³<Ô”B‰Ûdx›
¾¶DÕé(Xr(ßíkå§”ÞsùQ4ŒUÛse'Êk~³’¬[÷ì€Â¾Pq#GÎX}#5Æ°šmu¤Ò!`ïãwd_}#uw£!Ì`]W¬›Òš¶	¡ëyÁõw™ó8™¹/r¼,ÌYšåå¶%8µ'mÙ5YÑ©7Éó!¢Ë•5B/ê$=VNÔ6E¹ôX²6;¯bYg´Uš‹9£SBâ ¬Ëï–;Q`':©Ø¼ƒñG£À`À¤giSÅ.ƒwf­i^™Ç#³[>µ!ù”£Œ†þš`P#7ž˜ Ÿù`s·ô`Oxh|—Ï`†n:{@ƒí[kº(Lckæöœý½îñîñ›7ÇääÍñ)|}¥YZ$úbdoî½èâ9zLéÄ_CÞËüÆ¥È^˜ÆÒ¡fp5v"Ëè®L±–gS\‰]QšöÕÌ†)]JEÒq’Ëç3æ™¥–^PŸÅóQÂ-´@G.—Â4EÌ=rzLMD”'€ŸÈš_\Cƒ0		Îþ×uëà´¿‹Õc²lì™jÐ‘7IÆ@Emšþ]ï,¿VšUÖ˜=YIÓnLgÇ£lrpGÏôÇß¹%)=d:1%|RÛ	‹ž
Ížmùqà÷ë±§¬ÁºÐhàZÐ›wO5öé†7ž%¢)ÓÜ¾?f­}uüâðõLí4èé´ÁâÔ$3gªËæªk¡´Ôº.3KžºuC‘{f<RJ;®l%™Ìvr©6ÁŽi“ÜqûøL’;^˜ÛuŠ³0O%³‚_þhŽ˜•Xºôîùû¦%ïþÈ-I›«KE©I %mŠé…4ƒb‹©¥Âíà¾wÏçxÄœ gS$Uº–íWKìš²ÝSdÓc¹¬h¸—£-uÇ§–*1-ÛUExáêÕjjÂMqåÓ;SMæ|Ô1¹¬frFmux–-ŒBH1âÝØ ÕY6n{Y¨`á3p5ž„Þ8`ð[iRlæ’»\-–Êr¶¯¯‰7±úvxõŒ4WüíYäùR®·Øuv™^Ú¡ú,”îl‰FœâdÆSÚqot@G5_7Ž&û%éÄ¿=Ûº·?£ÀŒ*öK‡çœ!F”3óÇÐ‡»è8‰Cú~ô1Œñ”:†ð˜&
uÙæªòÍI§qÒ­Ö—XØÂík{Ée«Ë‡µÈÃ³Œ 'pIÎ,ž?÷×LAÔ3Œ~Ô{ÐÑÏMÓ"È-^…‘>·‡¶sûWž~+÷‰QVEŠ…¾ûóøD”Pµ‘E
æ‘HYh'Ünˆ¥p×„²!þ¦ˆAcõN­Þvâ×yÑ$Š$÷$šå6^„aJ„Âçp T˜”ÞÈÊ¡ÜýråÒ#¹ÉŸ>÷" '¯§§k|_4ÐI_˜¨wzX6à<WúæÓ{k¾Ž„Åá„Í”«$Ž£—Àƒ$˜Z@¤¬@À?!NR*MÃ³	ßû/†0UYæµ‹sQÈÀ
F,0¸~€÷Æ#öâç$}Ö·Žª³µƒSï¥ =]m_Ë¿n4zVýèVÁŠÓ­sóêOJw‘OyC]cÔKóÍ˜}à?ärˆ™ïyn‰òzà›0&páÏöG`ã?²À‰Éö™Æ#OãÏ7FSgµ‡ŸŸ•àŸaÜÎ¼‡Å!"Æ>%èo9L 	a?óÆ>4J]hýÏi!YIÇ’Y²@öëÎÝ6x4á#Ëí *Š£ÍC;sUPÊÔLlà±•AÂ€ÞP<Fí‡§ž@)Ye—À¿ê/ÉŽàfêÖ9=<~Ý½!’ü¿-+æZ®R>Í+óìÄ»÷5ñ:µ…Ž^³TÓWPÃ‡ÆáÍ8ö‡ÐŠâÙ´ÝÛ¿ŽYjÐ1	ožð¬°Â‚8ÛBh<	
$7™ž÷a…ZM²ªŒÑºÜ°®¼ÆAQ4{š§õöÿ¬ÖœOÅ¦bP ÕÎïÒ“†fgMVC(ƒu3÷Ðà}ÿŒ†¬ â°åŒ!ZÂÌ'ˆ`æ\Aý˜&HÏ²ƒºÁ…5ÏÐ@¯>Ÿžš¼ÐTªLöø¥Øz‰¥ã,òD,°€ÖèÙfðÙ”ÛµxÇ $o°¢_˜7Ä
|.-¢ëÓãIN0F¼ërUQ•kø#¡áˆaî	Ê¬£]LÍÓ¥"“°Ï•óà±˜4„ÙÄÄ¼"ÉÔjXË[¨êêríäšyƒövÏeÓúH?@ÊÜ[¨~2ßM«å÷›,[õÖj|[r¾µ&“oE¿Åj–WÈ¿v_×aßÂ¶Ï®xåÆÚó.…Ö†‡nŠ†Á‹ÂiºÇLç3Æ÷éØ;§Sú?S£µQJî¸XûIlë[	Ûô	#äÕ×MTCß:i¤ÔÔ9˜î;IRÅµlù ‰¥,é7@éÏX_Q Í˜Æ¦&Ý}±Á-†¦¢/ðïûÂÒðïÌ¹Ÿ¾éœ¨òQ¡x›t¤vàD—ÐÐ˜“È.×(@p`L? f!ÍCz,·ÏÖ´P7€= Žº,³vÆ« ÁÎ>=»’¬­Æ.WwOÎË«7*ˆn˜Þ}ºRê¾.v`¾5½Ó8•¹ïÔê®ÊÜød²R7vCßû@Kµ1G°_—¸óÅás‡ÒA™[_^Zû`9C-—½ó(Î•Ô½žz”ékMFWŽuiœ0£ó[áŽR‚ELx6%æWšKLîK«¢íú‰ÔÄÀé9öÖ#áX==¿wîMã÷ÊêÍ¯½ñ®ìœì‡ãìyk4Þ&g™¦AÄvÈƒ&¨0‚F¹ýw'´ÇÀ¼ÛÍ$!jÔbFN\TãÈé8Ö.]»®ÅP¦~lM£ ¿ˆœ•&Wo¥-ËÏ™‹"ù&íáá|áîLhsS¶)¨qcZ5ÉÔxõè0wU;œÓA
ÍÁTÛƒÑïòñ¬Íþ*K;|xpç” Ãæ¾]Ô6ÉHŠ0Ï¼®aN„ÀQ›ø6Â?ÌKVÎÌ ó`‰aÁV¥ðY	i3½;f?ùÙîÑÌN†ÎÏ¨ÍõF­x.’[špêóú*7en4ùk`÷‰œÐŒ½dÇõ±¥Å£EÎ¹ü“5½AAW0µÊ»÷Õ¯
…Ùoãî3x­òì‰3x«†tÎyXòk•ûªf.Ù9çWdÅYÞ1gÂª66­hà_Ùã‰å3&â‘t71w¡ò­`"ÍzÚÂta<Ù™Ù#ü©ƒI›½'€iïÞF×ÎlÚHiŸÞ+PaYS™SbRÓ3A¸=‚ˆöý«©çÑj»GMY~Eù!Ùært©’¡O† kæDì-¦äe¸DÆ,«Åq`À. ¡Êjh^é£šÄú>²ôÝ{}ñV#cé$b¡eU6É=?ÀÉî5½³–SŠ7T Mç1í}GûVsnÜ´ÈYÇMµZw£LO³¹49PZD.ßÐ.ÏÔ–·Ö›y¨V³C„oõ§L h—½äÙT)1š%ß85ÆúÚ}ÇXobŒõ>©7F×WÏqzVÎ
sº5>³jÔ;r³Š©h[Ú¶òf›:3tæQÌ´¾<¤(›O»_g»ÌÈŸÙËÙ$¯‹™Ã¼£$!É1Æ8™ÞTG+æ!Šh¶Ûw"¨ª²ü–úcêŒ¼åª$s]›†"ñqj7Ñpþ—v ¥R'}gš=ÿR%ºù­Ëj†dMEÅ™’ùçFïŒ‚Ÿ,£Oú¥Ç¥…Y}49OÍ©…bäŒgñ4Oäras½â¢‰¡KÙœ§q¹)îÕl¡iKîøÉ˜F—°&h_:%¢qºƒ›²sçBÕü´@ÆØ­2ú®'#?%ÎM9Þ›Ä†3³»œÞHÑµ
Ìì2'Q—ç„ŠÏjªAÜ®ÁRæè_¢ñŠ¤W0GÀ ºü‡P4Ã¢ö[S?dýÙâeòOnÝ²îò4ZøÕœß=÷fm®÷$fÚF^ÛV“wMï–bÞÈY"uÇå:Or”¸§¨ŠòrbåÄV3ëT“Äû)­³Ê%õÊ*ðÄÎ"^¶É‘ËÕÐ3h	Nùi©EJiµŒ²Ÿ)bNÚ×L*w5žÓAÝ›ò©(ôå”8Œš+¹å4ŒXÊgs•ê)XuùØ_ÊŽ÷ñ0ÆØÄ°,c<î±h<")0Ëó*rœ­å¥»²“†·L–Y¼Þ}äZEËI³ zIR³;o[`”[·¯ã¥"Ê»!f½b6»ziö¥¡U¸Ì !f$ûRÒ™"âEC/VCß	hê‚Í^Õqu¦xcéisŠ|×ª7ÛïK:JÊÐ7Qž´›Zâ2ÐTâC^Ùi‡i ÑÖ	3RëOýgŒÀhRîån—&J£èS{ÂAcA
>ÕÝãQÏ'>æå¥Ø£ºÏ0¨ê¾_ºoé!´}Ð«ZŽAË_B?Ué£®Ð_™F+Ó9}öXÞ±‡Ñk•ã‡øyTo‰	xõC
¾ÞþÝÏÐ¼Š_bZÚÖfÚ¶$ïø©1ŠD¥ïƒe%ómfônZ;émÑj…$»¤úÿ  ÿÿÜ]ÍNÛ@¾óK*U HE@B@H FuzCvƒ«8Ií˜¶ŠxŒ>AOíkðbÝYÛ»^{v½NRÁ)8ñßxg<;ßÎ÷ýƒzTí¸â
^]tÁE‡ôµÐxõÇÔçëÅ;#õšéš 7x=…‹ú> )=ôÝBŸŽ‡#“|‰;BÉðo	?%P¶’2çß•ÈVKŽÜ<Ü…T7$R¦”7HîVÔWg²MÔ*”•N?³)7cm•%ºò‚g~z =:ãÒ£,¾M1.~ÔÔ«Ú/¢"·<P1ðB:}þÏt`…!¤×*tãf–=Ì±ˆØµA,^(^!rîÚx…5Z‘½­íÑŠlÑ
±û*Ð
¬¢©Ð*ZU!BíÊE»:ºFa¨ÆÉ©\¹Û^TAÛÊÛ;º˜\€Tø5°Iáý’¸Šñkè² ¾Õ+. ÛÏèudáiH¯þ)óJ&|¯»FŒ	_ ÂTSè¢6¹½¸P
\©„×¿ryÃ~Ar+¦Ô¼£’n[žÿË,“ŒàZ—š¤¹6r^`Êño…Þ£ñUÆ ²Õ"Mr
£_j*Kv]C`ÒÑ–§JEº`ÔäÚ&œJúGs'WžËúZÒ7ºxœ‰K´yº ß®êL–oÚWm5³à?hµÕa$œ­­É;ç7§Îm·3è\}¸¸=»tz§ç¤ý^OäÖ´%Ä„È×1I«Â$8¥zÎ$Bž	a	Õ™$áY/˜$Ç³®1Iß`•Ølôí-ƒ‡Ì=’L³"'“Ô[(y½ÏÇ7Š¶(R]kœÈîð£mºä±®.úgš£h™gôb§“½qÒí\~ê³qn.zÎàùgÏ©¡qDL‚@7Ñ$¡©Gu}Ê4(ýf^‚÷\õpá<*[«X‡YNXZ°Ë´„m€ÁÅa½((ifÚÊ„¹@i²½œòà\[öÛØ­4cúÓUBk…îíBñRž\h@©D¹2«ÐiLb4mWvJ"˜°¢Í;™ag•µB%î]:­—µ´.m]	é¨´†žó5¦¡×Å‘Âs^ƒ2€{¥ù®QÕ*+b’diOY—úß9?$ó9ær°¶KßP†Ì}KÝËU3™¬ù¬qrîy.8{&vß\W·Ýl­¯hŽ9Èþ®" \¤ð·‘æ²Ó”¸>¨*^¼…­óHÜ±ÅWŒ] ¢‡_ŽøåA"M—õ`*Â-³MyÇÌ7~Ôì÷Ô÷äñÉL×ï~ måÔ»)Ö1.·UA9ÄõàÙ„+u»_òÑ»÷î|—®ëÊ´8ÅaÑ«®cŸYxrúCù×™_'lr¡'pÒBú%v)¡„#!ÙÇé(“XÔuv®B²ÙènÚ¶x“x¶!V¾é6	3‚–­
’ SEœýÂ‹dÁu5(­!ösHzAÖÕxÿx=8 r\b•Q1wDDBåÞÉ”åo0lŸM›KSÊxÒóq=‰	ã€x0+ôÂ>N³JÃ&ºþ=%ÌÄ~Ê¯ÈvŠ„çqzpŸ¾GMŠ;ÜôÒSxdìçö2ðŽ²Ÿ
¼"YÏñ}Ý*´js©¼á­­-|ýq¹”ùÐÜÛå­•äyY¬¾˜<'k½£CàqdoÕÜ?
pÊB _ˆJE Ë¢w¢Z„ÜP}Ùy×èÝÈsçëêƒKUåµÏÏ6ò©1Ë¨2_¨òüUG6,¨íªéq._‘épfÃt&Ól+Õì%d•³™	{Q"ý ö‘°7~õ4ñ]ALT­©«N—å˜³íhAüœ=Ã§µµ¿   ÿÿ ,‚É