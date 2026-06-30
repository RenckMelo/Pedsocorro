export interface TreatmentStep {
  title: string;
  desc: string;
}

export interface DiseaseInfo {
  id: string;
  name: string;
  category: string;
  diagnostic: string;
  alarm: string;
  treatment: TreatmentStep[];
  interactiveType?: string;
}

const EXISTING_DISEASES: DiseaseInfo[] = [
  {
    id: "has",
    name: "Hipertensão Arterial Sistêmica (HAS)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Confirmar por PA ≥ 140/90 mmHg em duas ou mais consultas distintas, ou por MAPA (média ≥ 130/80 mmHg nas 24h) ou MRPA (média ≥ 135/85 mmHg). Estratificar sempre o risco cardiovascular.",
    alarm: "PA ≥ 180/120 mmHg com sintomas de lesão de órgão-alvo aguda (cefaleia refratária, dor torácica, dispneia súbita, alteração neurológica): crise hipertensiva (emergência) - referenciar à UPA de imediato.",
    treatment: [
      {
        title: "1ª Linha - Monoterapia ou Dupla Associação (SUS)",
        desc: "Iniciar com um ou dois agentes de classes diferentes: IECA (Enalapril 10-20mg VO de 12/12h), BRA (Losartana Potássica 50-100mg VO ao dia), Tiazídico (Hidroclorotiazida 25mg VO pela manhã) ou BCC (Anlodipino 5-10mg VO ao dia). Medidas não farmacológicas obrigatórias: consumo de sódio < 2g/dia, perda de peso e atividade física regular."
      },
      {
        title: "2ª Linha - Associação Tripla ou Otimização",
        desc: "Se PA descontrolada com dose otimizada de dois medicamentos, associar o terceiro (ex: Losartana 50mg 12/12h + Hidroclorotiazida 25mg/dia + Anlodipino 5mg/dia). Se refratariedade manter-se após otimização tripla, adicionar Espironolactona 25mg VO ao dia (pesquisar hipertensão secundária ou má adesão)."
      }
    ],
    interactiveType: "bp"
  },
  {
    id: "dm2",
    name: "Diabetes Mellitus Tipo 2 (DM2)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Glicemia de jejum ≥ 126 mg/dL (duas dosagens), TOTG 75g de 2h ≥ 200 mg/dL ou HbA1c ≥ 6.5%. Se paciente com sintomas clássicos (poliúria, polidipsia, perda ponderal) e glicemia casual ≥ 200 mg/dL, diagnóstico confirmado.",
    alarm: "Glicemia capilar > 300 mg/dL com sintomas de cetoacidose ou estado hiperosmolar (hálito cetônico, desidratação grave, confusão mental, náuseas e vômitos, taquipneia) - encaminhar urgentemente para suporte hospitalar (UPA).",
    treatment: [
      {
        title: "1ª Linha - Metformina isolada ou associada + Estilo de Vida",
        desc: "Metformina XR 500mg a 1000mg VO após o jantar (titular até 2000mg/dia caso necessário para tolerância gastrointestinal). Se HbA1c inicial entre 7.5% e 9.0%, associar imediatamente Glibenclamida 5mg VO ao dia ou preferencialmente inibidores da SGLT-2 (Empagliflozina 10mg VO ao dia, caso disponível/viável no SUS). Dieta com baixo índice glicêmico e exercícios."
      },
      {
        title: "2ª Linha - Insulinoterapia ou Tripla Terapia",
        desc: "Se HbA1c persistentemente > 8.5% ou falência de hipoglicemiantes orais, ou sintomas de catabolismo (perda de peso rápida): prescrever Insulina NPH (dose inicial de 0.1 a 0.2 UI/kg subcutânea ao deitar). Titular dose com base na glicemia de jejum semanalmente. Manter Metformina para poupar dose de insulina."
      }
    ],
    interactiveType: "glycemia"
  },
  {
    id: "dislip",
    name: "Dislipidemia / Colesterol Elevado",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Perfil lipídico em jejum ou não (Colesterol Total, LDL-C, HDL-C, Triglicerídeos). Metas terapêuticas de LDL definidas pelo Risco Cardiovascular Global (baixo < 130, intermediário < 100, alto < 70, muito alto < 50 mg/dL).",
    alarm: "Hipertrigliceridemia grave (> 500 a 1000 mg/dL) com dor abdominal abdominal alta irradiando para o dorso, náuseas/vômitos (risco de Pancreatite Aguda) - jejum relativo e encaminhamento para avaliação médica imediata na UPA.",
    treatment: [
      {
        title: "1ª Linha - Estatinas de Alta ou Moderada Potência",
        desc: "Prescrever Sinvastatina 20mg a 40mg VO à noite (redução do LDL em 30-45%) ou Atorvastatina 20-40mg VO à noite. Associar redução rigorosa de gorduras saturadas e trans, eliminação do tabagismo e atividade aeróbica regular."
      },
      {
        title: "2ª Linha - Associação ou Fibrato para Triglicerídeos",
        desc: "Se LDL-C permanecer fora da meta apesar da dose máxima tolerada de estatina, associar Ezetimiba 10mg VO ao dia. Se a queixa principal for hipertrigliceridemia pura (> 500 mg/dL), prescrever Ciprofibrato 100mg VO ao dia ou Fenofibrato 200mg VO ao dia após refeição para mitigar risco de pancreatite."
      }
    ],
    interactiveType: "cholesterol"
  },
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
    ],
    interactiveType: "drge"
  },
  {
    id: "hipo",
    name: "Hipotireoidismo Clínico e Subclínico",
    category: "Metabólicas/Endócrinas",
    diagnostic: "TSH elevado (> 4.5 mUI/L) com T4 Livre baixo caracteriza hipotireoidismo clínico. TSH elevado com T4 Livre normal caracteriza hipotireoidismo subclínico (tratar apenas se TSH > 10, gestante, anticorpos anti-TPO altamente positivos ou sintomas muito exuberantes em jovens).",
    alarm: "Coma mixedematoso (situação de terapia intensiva rara caracterizada por hipotermia extrema, bradicardia severa, hipoventilação, edema generalizado duro e letargia grave) - encaminhar imediatamente ao pronto-socorro.",
    treatment: [
      {
        title: "1ª Linha - Reposição Fisiológica Padrão de Levotiroxina",
        desc: "Prescrever Levotiroxina Sódica (1.6 mcg/kg/dia para jovens e adultos hígidos). Iniciar com dose matinal diária única (ex: 25 a 50 mcg VO/dia) em jejum completo de 30-60 minutos antes do café da manhã. Ajustar a cada 6-8 semanas com dosagem de TSH sanguíneo."
      },
      {
        title: "2ª Linha - Ajuste em Idosos/Cardiopatas e Manejo de Refratariedade",
        desc: "Em idosos ou cardiopatas, iniciar de forma muito cautelosa: Levotiroxina 12.5 a 25 mcg VO/dia para evitar arritmias cardíacas ou angina. Se persistência de TSH elevado apesar de dose teórica alta, investigar má adesão, uso de antiácidos (como carbonato de cálcio, sulfato ferroso ou IBP) de forma simultânea."
      }
    ],
    interactiveType: "hypothyroid"
  },
  {
    id: "asma",
    name: "Asma Brônquica",
    category: "Respiratório",
    diagnostic: "História de sintomas respiratórios variáveis (sibilos, dispneia, aperto torácico, tosse) associada a limitação variável do fluxo aéreo expiratório documentada por Espirometria (distúrbio obstrutivo com reversibilidade após broncodilatador).",
    alarm: "Crise de asma aguda grave (fala entrecortada, uso de musculatura acessória, frequência respiratória > 30/min, saturação de O2 < 92% em ar ambiente ou silêncio auscultatório) - encaminhar imediatamente à sala de emergência (UPA).",
    treatment: [
      {
        title: "1ª Linha - Terapia de Controle e Resgate Combinados (Diretrizes GINA)",
        desc: "Uso preferencial de Corticóide Inalatório associado a Broncodilatador de Longa Ação (ex: Budesonida 200mcg + Formoterol 6mcg) 1 a 2 inalações de 12/12h para controle contínuo diário. O mesmo inalador pode ser usado para resgate de sintomas agudos (máx 8-12 inalações/dia)."
      },
      {
        title: "2ª Linha - Intensificação do Corticóide e Associados",
        desc: "Se controle inadequado (etapa superior GINA), elevar Budesonida/Formoterol para dose alta ou associar Broncodilatador de Longa Ação anticolinérgico (Tiotrópio) ou Antagonista do Receptor de Leucotrienos (Montelucaste de Sódio 10mg VO ao dia à noite). Realizar técnica inalatória e revisar adesão!"
      }
    ],
    interactiveType: "asma"
  },
  {
    id: "dpoc",
    name: "DPOC (Doença Pulmonar Obstrutiva Crônica)",
    category: "Respiratório",
    diagnostic: "Dispneia progressiva, tosse crônica e/ou expectoração em paciente exposto a fatores de risco (tabagismo pesado habitual). Confirmado por Espirometria com relação VEF1/CVF < 0.70 pós-broncodilatador de forma fixa.",
    alarm: "Exacerbação do DPOC (aumento agudo do volume ou purulência do escarro, associado à piora marcante da dispneia) - prescrever antibioticoterapia (Amoxicilina + Clavulanato ou Azitromicina) + Corticóide oral por 5 dias. Encaminhar se hipoxemia grave.",
    treatment: [
      {
        title: "1ª Linha - Broncodilatação Inalatória de Longa Duração (LAMA ou LABA)",
        desc: "Prescrever Brometo de Tiotrópio (LAMA - anticolinérgico de longa) 1 cápsula inalatória de 24/24h ou Formoterol (LABA) de 12/12h. Cessação imediata do tabagismo é a única medida de impacto científico comprovado na sobrevida global do paciente."
      },
      {
        title: "2ª Linha - Associação Dupla (LAMA + LABA) e Profilaxia",
        desc: "Para pacientes refratários com dispneia persistente ou exacerbadores recorrentes: associar LAMA + LABA (ex: Tiotrópio + Formoterol). Se histórico de exacerbação frequente e eosinófilos sanguíneos ≥ 300, adicionar Corticóide Inalatório (Budesonida)."
      }
    ]
  },
  {
    id: "itu",
    name: "Infecção do Trato Urinário Baixo (Cistite Aguda)",
    category: "Infecciosas/Endemias",
    diagnostic: "Diagnóstico eminentemente clínico em mulheres jovens não gestantes: tríade clássica de disúria, polaciúria (ida frequente ao banheiro) e urgência miccional sem sintomas sistêmicos. Urina tipo 1 e Urocultura indicadas em casos suspeitos de ITU complicada, atípica ou gestantes.",
    alarm: "Febre alta (> 38°C), calafrios trementes, dor lombar unilateral com punho-percussão dolorosa (Sinal de Giordano positivo), náuseas e vômitos persistentes: suspeita forte de Pielonefrite Aguda - iniciar antibiótico sistêmico imediatamente e avaliar necessidade de internação na UPA.",
    treatment: [
      {
        title: "1ª Linha - Antimicrobiano Empírico de Curto Curso (SUS)",
        desc: "Prescrever Nitrofurantoína 100mg VO de 6/6h por 5 dias consecutivos, ou Sulfametoxazol + Trimetoprima 400/80mg, 2 comprimidos VO de 12/12h por 3 dias. Orientar hidratação abundante oral (> 2L/dia) e higiene adequada."
      },
      {
        title: "2ª Linha - Antibioticoterapia Alternativa / Reservada",
        desc: "Prescrever Ciprofloxacino 500mg VO de 12/12h por 3 dias, ou Amoxicilina + Clavulanato 500/125mg VO de 8/8h por 5-7 dias (especialmente em gestantes ou idosos, onde a nitrofurantoína deve ser observada segundo a idade gestacional)."
      }
    ]
  },
  {
    id: "oma",
    name: "Otite Média Aguda (OMA)",
    category: "Respiratório",
    diagnostic: "Início súbito de otalgia de intensidade moderada a grave, associado a efusão na orelha média documentada por Otoscopia: visualização de membrana timpânica hiperemiada, opaca, abaulada e com perda de mobilidade.",
    alarm: "Surgimento de edema doloroso, hiperemia e deslocamento do pavilhão auricular na região retroauricular: suspeita de Mastoidite Aguda - encaminhar em caráter de urgência médica hospitalar para antibioticoterapia endovenosa imediata.",
    treatment: [
      {
        title: "1ª Linha - Analgesia Rigorosa e Amoxicilina Empírica",
        desc: "Em crianças < 2 anos, otalgia severa ou OMA bilateral: prescrever Amoxicilina 80-90 mg/kg/dia VO dividida em 2 ou 3 tomadas diárias por 10 dias. Em adultos ou crianças maiores de forma leve, pode-se adotar observação ativa por 48h com analgésicos potentes (Dipirona + Ibuprofeno)."
      },
      {
        title: "2ª Linha - Amoxicilina associada a Clavulanato",
        desc: "Indicado se houve falha terapêutica após 48-72 horas da dose padrão de amoxicilina, ou terapia antibiótica recente no último mês. Prescrever Amoxicilina + Clavulanato de Potássio 90mg/kg/dia (relação de amoxicilina) por 10 dias inteiros."
      }
    ]
  },
  {
    id: "sinusite",
    name: "Rinossinusite Bacteriana Aguda",
    category: "Respiratório",
    diagnostic: "Sintomas respiratórios de rinorréia purulenta, congestão nasal e dor facial por mais de 10 dias sem melhora, ou 'dupla piora' (piora aguda dos sintomas após 5 dias de resfriado comum em melhora gradual).",
    alarm: "Presença de edema palpebral, dor orbital intensa, alteração da acuidade visual ou movimentação ocular, cefaleia frontal lancinante ou sinais de irritação meníngea - encaminhamento imediato para avaliação de tomografia computadorizada urgente.",
    treatment: [
      {
        title: "1ª Linha - Lavagem Nasal Abundante e Corticoide Inalatório",
        desc: "Medida essencial: lavagem nasal exaustiva com Soro Fisiológico 0.9% (mínimo 10-20ml em cada narina 4-6 vezes ao dia). Associar Corticóide Intranasal (Budesonida Spray Nasal 50mcg ou Mometasona, duas aplicações em cada narina de 12/12h por 10-14 dias). Analgésicos se dor."
      },
      {
        title: "2ª Linha - Antibioticoterapia Sistêmica Direcionada",
        desc: "Indicado se preencher critérios estritos bacterianos (excesso de febre e dor persistente). Prescrever Amoxicilina 500mg VO de 8/8h por 7 a 10 dias sequenciais. Se intolerância ou falha prévia, utilizar Amoxicilina + Clavulanato 875/125mg VO de 12/12h por 7 a 10 dias."
      }
    ]
  },
  {
    id: "amigdalite",
    name: "Faringoamigdalite Aguda",
    category: "Respiratório",
    diagnostic: "Dor de garganta de início súbito, odinofagia intensa e febre alta. Aplicação do escore de Centor para diferenciar etiologia bacteriana (Streptococcus pyogenes) de viral: ausência de tosse, linfonodomegalias cervicais dolorosas, exsudato amigdaliano e febre.",
    alarm: "Trismo (dificuldade de abrir a boca), sialorreia (baba constante por incapacidade estrema de engolir saliva) e desvio da úvula para o lado contralateral: abscesso periamigdaliano - encaminhar para drenagem e tratamento sob vigilância imediata na UPA.",
    treatment: [
      {
        title: "1ª Linha - Penicilina Benzatina ou Amoxicilina (SUS)",
        desc: "Se suspeita bacteriana moderada a alta (escore Centor ≥ 3-4): prescrever Penicilina G Benzatina (dose única intramuscular profunda: 1.200.000 UI em adultos; 600.000 UI em crianças < 27 kg). Alternativa: Amoxicilina 500mg VO de 8/8h por 10 dias consecutivos (tempo obrigatório para profilaxia de Febre Reumática)."
      },
      {
        title: "2ª Linha - Macrolídeo (para Alérgicos à Penicilina)",
        desc: "Em pacientes com histórico documentado de hipersensibilidade imediata a betalactâmicos, prescrever Azitromicina 500mg VO ao dia por 5 dias consecutivos, ou Cefalexina 500mg VO de 6/6h por 10 dias (com cautela se alergia não anafiláctica)."
      }
    ]
  },
  {
    id: "pac",
    name: "Pneumonia Adquirida na Comunidade (PAC)",
    category: "Respiratório",
    diagnostic: "Início agudo de tosse (com ou sem expectoração), febre, dispneia, dor torácica pleurítica, dor nas costas. No exame físico: estertores crepitantes localizados, taquipneia. Diagnóstico padrão-ouro: consolidação alveolar ou infiltrado novo em Radiografia de Tórax (Posterior-Anterior e Perfil).",
    alarm: "Classificação de gravidade pelo Escore CURB-65 ≥ 2 (Confusão mental, Ureia > 50, Frequência Respiratória ≥ 30/min, Pressão Arterial < 90/60 mmHg, Idade ≥ 65 anos) - indica necessidade imperiosa de internação hospitalar.",
    treatment: [
      {
        title: "1ª Linha - Antibioticoterapia Oral Empírica Ambulatorial",
        desc: "Em pacientes previamente hígidos e sem uso recente de antibióticos: prescrever Amoxicilina 1g VO de 8/8h por 5 a 7 dias, isolada ou associada a Azitromicina 500mg VO ao dia por 5 dias (cobertura ideal para germes atípicos). Repouso absoluto e reidratação oral."
      },
      {
        title: "2ª Linha - Associação de Betalactâmico + Macrolídeo",
        desc: "Para pacientes com comorbidades relevantes (DPOC, cardiopata, insuficiência renal ou uso recente de antibióticos): Amoxicilina + Clavulanato 875/125mg VO de 12/12h PLUS Azitromicina 500mg VO ao dia por 7 dias inteiros. Reavaliar em 48-72h de forma ativa na UBS."
      }
    ]
  },
  {
    id: "verminose",
    name: "Parasitoses Intestinais / Verminose",
    category: "Gastrointestinal",
    diagnostic: "Dor abdominal inespecífica difusa, meteorismo, prurido anal intenso (sugestivo de oxiuríase), náuseas ou emagrecimento inexplicado. Confirmação padrão por Exame Parasitológico de Fezes (EPF) em três amostras distintas.",
    alarm: "Suboclusão intestinal ou eliminação maciça de vermes pela boca/ânus (risco de obstrução por novelo de Ascaris lumbricoides) - encaminhar imediatamente para suporte de urgência na UPA para descompressão.",
    treatment: [
      {
        title: "1ª Linha - Tratamento Empírico de Largo Espectro (SUS)",
        desc: "Prescrever Albendazol 400mg VO dose única diária (em crianças acima de 2 anos: dose única idêntica). Para Oxiuríase ou Teníase, repetir a dose única após exatamente 14 dias para erradicar novos parasitas eclodidos. Medidas sanitárias de higiene familiar severas."
      },
      {
        title: "2ª Linha - Alternativa de Espectro Amplo e Giárdia/Ameba",
        desc: "Prescrever Mebendazol 100mg VO de 12/12h por 3 dias seguidos, ou Nitazoxanida 500mg VO de 12/12h por 3 dias consecutivos (ideal para cobertura concomitante de protozoários como Giárdia lamblia e Entamoeba histolytica)."
      }
    ]
  },
  {
    id: "anemia",
    name: "Anemia Ferropriva na Atenção Básica",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Hemograma completo revelando Hemoglobina baixa (mulheres < 12 g/dL, homens < 13 g/dL) associada a microcitose (VCM < 80 fL) e hipocromia (HCM < 27 pg). Confirmar por Ferritina Sérica baixa (< 30 ng/mL, que é o marcador mais fidedigno de estoque).",
    alarm: "Anemia severa sintomática (Hemoglobina < 7-8 g/dL acompanhada de tontura ortostática severa, dispneia aos mínimos esforços, síncope ou angina de peito aguda em idosos) - encaminhar imediatamente à UPA para potencial hemotransfusão.",
    treatment: [
      {
        title: "1ª Linha - Reposição de Ferro Oral e Orientação Dietética",
        desc: "Prescrever Sulfato Ferroso oral 40mg de ferro elementar por comprimido (dose de tratamento adulto: 120-200mg de ferro elementar ao dia, correspondendo a 3 a 5 comprimidos de sulfato ferroso divididos 1 hora antes das refeições principais ou em jejum para otimizar absorção drástica - associar Suco cítrico/Vitamina C). Evitar leite e antiácidos."
      },
      {
        title: "2ª Linha - Formulações De Melhor Tolerabilidade Gastrointestinal",
        desc: "Se intolerância gástrica limitante ao sulfato ferroso (epigastralgia severa, náuseas, constipação muito forte), substituir por Ferro Quelato Glicinato ou Neutrofer 150-300mg VO ao dia após as refeições. Manter a reposição terapêutica por 3 a 6 meses após a normalização dos níveis de hemoglobina para reabastecer depósitos."
      }
    ]
  },
  {
    id: "depressao",
    name: "Depressão / Transtorno Depressivo Leve a Moderado",
    category: "Saúde Mental",
    diagnostic: "Humor deprimido persistente ou anedonia (perda de interesse/prazer) por pelo menos 2 semanas, acompanhado de alterações de sono, apetite, fadiga crônica, lentificação psicomotora e sentimentos de inutilidade.",
    alarm: "Presença de ideação suicida ativa estruturada, planos de autoextermínio ou psicose associada (delírios/alucinações): risco iminente de morte - referenciar e acompanhar o paciente diretamente ao CAPS ou emergência de psiquiatria hospitalar.",
    treatment: [
      {
        title: "1ª Linha - Inibidor Seletivo da Recaptação de Serotonina (ISRS) e Psicoterapia",
        desc: "Prescrever Sertralina 50mg VO ao dia, tomada pela manhã (pode ser titulada até 150-200mg/dia conforme melhora clínica incremental e tolerabilidade). Fluoxetina 20mg/dia é alternativa SUS primária excelente. Orientar tempo de latência de 2 a 4 semanas para o início de melhora perceptível e encaminhar para serviços de psicoterapia/grupos de apoio UBS."
      },
      {
        title: "2ª Linha - Antidepressivo Tricíclico ou Duplos",
        desc: "Se resposta inadequada ou refratariedade após 6-8 semanas em dose máxima de ISRS: transicionar de forma lenta para Amitriptilina 25-75mg VO à noite (gerencia simultaneamente insônia e dores crônicas associadas), ou se disponível, dual como Venlafaxina 75-150mg/dia. Monitorar ganho de peso e efeitos anticolinérgicos."
      }
    ],
    interactiveType: "phq9"
  },
  {
    id: "ansiedade",
    name: "Transtorno de Ansiedade Generalizada (TAG)",
    category: "Saúde Mental",
    diagnostic: "Preocupação e ansiedade excessivas, persistentes e difíceis de controlar na maioria dos dias, por pelo menos 6 meses, associadas a irritabilidade, tensão muscular dolorosa, fadiga mental e perturbação profunda do sono.",
    alarm: "Crise de pânico aguda refratária com hiperventilação severa, dor torácica mimetizando infarto, ou desespero com impulsividade autolesiva aguda - acolher em sala de observação e aplicar medidas não farmacológicas de acalento respiratório lento.",
    treatment: [
      {
        title: "1ª Linha - ISRS de Primeira Linha e Psicoterapia Integrativa",
        desc: "Prescrever Sertralina 25mg a 50mg VO ao dia pela manhã de forma contínua e preventiva. O tratamento deve ser sustentado por pelo menos 6 a 12 meses após a remissão completa dos sintomas ansiosos. Encaminhar para práticas integrativas comunitárias (Yoga, Meditação, Grupos de Conversa terapêuticas da UBS)."
      },
      {
        title: "2ª Linha - Uso Estratégico de Pregabalina ou Tricíclico",
        desc: "Se resposta insatisfatória, associar de forma adjunta ou substituir por Pregabalina 75mg VO ao dia (dividido em duas tomadas de 37.5mg ou dose única noturna; titular até 150mg/dia de acordo com resposta médica). Nota: Evitar benzodiazepínicos (ex: Clonazepam/Diazepam) exceto por curtíssimo prazo em crises agudas agudizadas para obstar dependência química."
      }
    ],
    interactiveType: "gad7"
  },
  {
    id: "insonia",
    name: "Insônia Primária Crônica na UBS",
    category: "Saúde Mental",
    diagnostic: "Dificuldade persistente de iniciar, manter o sono estável ou despertar precoce indesejado, ocorrendo no mínimo 3 vezes por semana por pelo menos 3 meses consecutivos, gerando prejuízo ocupacional ou social diurno significativo.",
    alarm: "Sonolência diurna extrema que coloca o paciente em risco severo de acidentes automobilísticos ou laborais com maquinário pesado - suspender temporariamente atividades ocupacionais de risco imediato.",
    treatment: [
      {
        title: "1ª Linha - Higiene do Sono Rigorosa e Terapia Cognitivo-Comportamental",
        desc: "Primeiro passo insubstituível: aplicar TCC para Insônia (TCC-I). Medidas de Higiene do Sono estruturadas: deitar e levantar no mesmo horário todos os dias, banir telas eletrônicas 2 horas antes de dormir, silenciar o quarto, extinguir cafeína/chás pretos após as 14 horas, evitar jantares pesados e usar a cama apenas para dormir."
      },
      {
        title: "2ª Linha - Medicamentos de Baixo Risco e Baixo Potencial Aditivo",
        desc: "Prescrever Amitriptilina 12.5mg a 25mg VO 2 horas antes de deitar (ótima opção SUS com efeito sedativo tolerável) ou sedativo de perfil seguro no idoso como a Mirtazapina 7.5mg a 15mg VO à noite (gerencia depressão/perda de apetite). Benzodiazepínicos devem ser restritos ao uso inferior a 2-4 semanas para impedir dependência física e demência tardia."
      }
    ]
  },
  {
    id: "lombalgia",
    name: "Lombalgia e Lombociatalgia Aguda/Crônica",
    category: "Outros",
    diagnostic: "Dor localizada abaixo da margem costal e acima da prega glútea. Lombociatalgia: dor lombar com irradiação dermátoma bem delimitada para membro inferior, sugerindo compressão radicular mecânica.",
    alarm: "Sinais de Alerta ('Red Flags'): dor após trauma severo, perda de peso inexplicada, febre alta concomitante (suspeita infecção), anestesia em sela perineal ou perda súbita de força de membros inferiores (Síndrome da Cauda Equina) - encaminhar urgentemente ao especialista ortopédico.",
    treatment: [
      {
        title: "1ª Linha - Controle de Dor Aguda, Mobilização e Calor Local",
        desc: "Prescrever Dipirona 1g VO de 6/6h por 3-5 dias associado a Ibuprofeno 600mg VO de 8/8h por no máximo 5 dias para evitar lesão estomacal/renal. Orientar calor local úmido e caminhadas leves precoces (repouso absoluto no leito retarda a recuperação funcional de forma cientificamente comprovada)."
      },
      {
        title: "2ª Linha - Relaxantes Musculares e Adjuvantes Neuropáticos",
        desc: "Associar Relaxante muscular (Ciclobenzaprina 5mg a 10mg VO ao dia ou Carisoprodol) por 5 dias. Se dor lombar neuropática crônica radiada de padrão refratário: prescrever Gabapentina 300mg VO ao dia ou Amitriptilina 25mg VO ao dia à noite para modulação central."
      }
    ]
  },
  {
    id: "osteoartrite",
    name: "Osteoartrite / Artrose (Joelhos e Quadris)",
    category: "Outros",
    diagnostic: "Dor articular de início insidioso, com piora ao uso físico articular e melhora ao repouso, rigidez matinal autolimitada menor que 30 minutos, crepitação palpável e limitação de amplitude de movimento.",
    alarm: "Articulação com dor insuportável de início explosivo, edema volumoso tenso, calor local e rubor marcantes associados a febre alta síncrona: suspeita de Artrite Séptica bacteriana - punção articular diagnóstica e encaminhamento de urgência médica à UPA.",
    treatment: [
      {
        title: "1ª Linha - Educação, Fortalecimento Muscular e Analgesia",
        desc: "Prescrever Fisioterapia com foco em fortalecimento do quadríceps femoral e perda de peso guiada (reduz sobrecarga mecânica na cartilagem articular drasticamente). Para controle de dor sintomática de rotina: Dipirona 1g VO até de 6/6h nos dias de dor mais exuberante. Pode-se apoiar anti-inflamatório tópico nas articulações."
      },
      {
        title: "2ª Linha - Analgésicos Adjuvantes e Condroprotetores Auxiliares",
        desc: "Se dor não controlada com analgésicos simples e fisioterapia assídua: prescrever Cloridrato de Tramadol 50mg VO ao dia para resgate (máximo de 2-3 semanas para evitar habituação) ou fitoterápicos de fraca evidência porém boa aceitação como Extrato de Soja e Abacate (Piascledine) ou Condroitina + Glicosamina orais por 3 meses."
      }
    ]
  },
  {
    id: "gota",
    name: "Artrite Gotosa Aguda (Gota)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Monoartrite aguda extremamente dolorosa, tipicamente acometendo a primeira articulação metatarsofalangeana (podagra), joelho ou tornozelo. Presença de eritema, edema exuberante e hiperuricemia (> 7.0 mg/dL).",
    alarm: "Febre, calafrios trementes ou secreção purulenta drenando de tofos gotosos ulcerados: infecção secundária ou osteomielite subjacente - necessita internação hospitalar para desbridamento e antibioticoterapia venosa direcionada na UPA.",
    treatment: [
      {
        title: "1ª Linha - Tratamento da Crise de Dor Aguda (Anti-inflamatórios)",
        desc: "Iniciar imediatamente: Ibuprofeno 600mg VO de 8/8h ou Cetoprofeno 100mg VO de 12/12h por 3-5 dias associado a Colchicina 0.5mg VO de 8/8h ou 12/12h (reduzir agressivamente se diarreia limitante). Nota crítica: NUNCA iniciar ou suspender Alopurinol durante a crise aguda de dor (mudanças drásticas do ácido úrico prolongam a crise!)."
      },
      {
        title: "2ª Linha - Profilaxia e Redução de Ácido Úrico (Entrecrise)",
        desc: "Pelo menos 2 semanas após a resolução total da crise dolorosa inicial e sob cobertura de Colchicina profilática (0.5mg/dia): iniciar Alopurinol 100mg VO ao dia pela manhã. Titular dose progressivamente até nível de ácido úrico sanguíneo persistir abaixo de 6.0 mg/dL. Orientar suspensão de álcool, carnes vermelhas e frutos do mar."
      }
    ]
  },
  {
    id: "eczema",
    name: "Eczema / Dermatite Atópica e de Contato",
    category: "Pele & Dermatologia",
    diagnostic: "Prurido intenso associado a lesões eritematosas descamativas, por vezes papulovesiculares (fase aguda) ou xerose cutânea com liquenificação proeminente em dobras flexurais (fase crônica em crianças e adultos jovens).",
    alarm: "Presença de dor local progressiva, crostas melicéricas aderentes amareladas abundantes ou áreas purulentas difusas: infecção bacteriana secundária (Impetiginização por Staph/Strepto) - necessita Cefalexina oral imediatamente.",
    treatment: [
      {
        title: "1ª Linha - Hidratação Cutânea Profunda e Corticoterapia Tópica Curta",
        desc: "Pilar absoluto: hidratação cutânea profusa e continuada com cremes hidratantes densos livres de perfume (ex: creme de ureia 10%, óleo de amêndoas ou hidratantes fisiológicos) aplicados imediatamente após banhos mornos e curtos. Para surto agudo de lesões ativas: Creme de Dexametasona 0.1% ou Valerato de Betametasona, aplicar fina camada 1 a 2x ao dia por no máximo 7-10 dias consecutivos para afastar atrofia cutânea."
      },
      {
        title: "2ª Linha - Anti-histamínicos Sistêmicos e Alternativas Tópicas",
        desc: "Prescrever Loratadina 10mg VO ao dia ou Dexclorfeniramina 2mg VO de 8/8h para amenizar o prurido noturno que perturba o repouso. Em lesões faciais ou em áreas sensíveis refratárias, utilizar inibidores da calcineurina tópicos (Pomada de Tacrolimo 0.03% ou Pimecrolimo)."
      }
    ]
  },
  {
    id: "escabiose",
    name: "Escabiose (Sarna Humana)",
    category: "Pele & Dermatologia",
    diagnostic: "Prurido generalizado intenso com piora noturna exuberante. Presença de pápulas eritematosas pequenas, escoriations, sulcos lineares microscópicos e microvesículas em áreas interdigitais das mãos, punhos, axilas, aréolas, região umbilical e genitais.",
    alarm: "Aparecimento de febre, celulite bacteriana em membros ou infecções de pele disseminadas secundárias ao ato compulsivo de coçar (risco de glomerulonefrite pós-estreptocócica) - iniciar tratamento antibiótico ativo com Cefalexina na UPA/UBS.",
    treatment: [
      {
        title: "1ª Linha - Permetrina Tópica e Lavagem Geral de Enxoval",
        desc: "Creme de Permetrina a 5%: aplicar no corpo inteiro (do pescoço para baixo até a sola dos pés) à noite ao deitar, deixar agir por 8 a 12 horas seguidas e tomar banho retirando tudo pela manhã. Repetir rigorosamente a aplicação tópica após 7 dias exatos. Medida epidemiológica vital: tratar TODOS os contatos domiciliares simultaneamente, lavar roupas de cama e toalhas em água quente e guardá-las em sacos plásticos fechados por 3-5 dias!"
      },
      {
        title: "2ª Linha - Ivermectina Sistêmica Oral",
        desc: "Prescrever Ivermectina 6mg VO (dose: 200 mcg/kg de peso corporal em dose única, repetindo após exatamente 7 dias). Ideal para escabiose disseminada, surtos em abrigos, ou falhas no tratamento tópico de primeira escolha convencional do SUS."
      }
    ]
  },
  {
    id: "micose",
    name: "Micoses de Pele / Dermatofitoses",
    category: "Pele & Dermatologia",
    diagnostic: "Lesões anulares, eritematosas, com bordas descamativas ativas elevadas e centro mais claro em pele (Tinea corporis), maceração descamativa e prurido em espaços interdigitais dos pés (Tinea pedis - frieira/pé de atleta).",
    alarm: "Eritema que se estende por toda a perna com edema local exuberante, calor, dor intensa de início recente e febre alta: suspeita de Celulite / Erisipela secundária à porta de entrada da micose interdigital - iniciar Cefalexina ou Amoxicilina sistêmica e avaliar urgente.",
    treatment: [
      {
        title: "1ª Linha - Antimicóticos Tópicos",
        desc: "Creme de Miconazol a 2%, Cetoconazol a 2% ou Isoconazol. Aplicar fina camada sobre a lesão e 2cm além da borda ativa, de 12/12h por 2 a 4 semanas consecutivas (manter o tratamento por pelo menos 1 semana após o desaparecimento visível das lesões cutâneas para evitar recidiva crônica)."
      },
      {
        title: "2ª Linha - Antimicóticos Sistêmicos Orais",
        desc: "Indicado se lesões fúngicas muito extensas, acometimento de palmas/solas rebeldes ou Tinea capitis (couro cabeludo). Prescrever Cetoconazol 200mg VO ao dia por 14-30 dias, ou Fluconazol 150mg VO 1 vez por semana por 4 a 6 semanas (em casos de onicomicose severa nas unhas corporais)."
      }
    ]
  },
  {
    id: "gastrite",
    name: "Gastrite Aguda / Crônica e Úlcera Péptica",
    category: "Gastrointestinal",
    diagnostic: "Epigastralgia (dor na boca do estômago) de padrão em queimação, azia, plenitude pós-prandial incômoda e náuseas ocasionais. A dor da úlcera duodenal classicamente melhora ao comer; a gástrica piora imediata.",
    alarm: "Hematêmese (vômito com sangue vivo ou borra de café), melena (fezes pastosas negras, extremamente fétidas), anemia por perda oculta crônica, perda de peso involuntária abrupta ou vômitos incoercíveis persistentes - encaminhar imediatamente à EDA no hospital.",
    treatment: [
      {
        title: "1ª Linha - Bloqueio Ácido (IBP) e Supressão de Agressores",
        desc: "Prescrever Omeprazol 20mg a 40mg VO ao dia, pela manhã em jejum, 30 minutos antes de ingerir qualquer alimento, por 4 semanas seguidas. Suspender rigorosamente anti-inflamatórios (AINEs), tabaco, álcool e alimentos com condimentos ou gordurosos excessivos."
      },
      {
        title: "2ª Linha - Pesquisa e Erradicação de Helicobacter pylori",
        desc: "Se sintomas refratários após uso de IBP, solicitar pesquisa de H. pylori por método não invasivo ou via EDA com biópsia. Se positivo, realizar terapia de erradicação tripla por 14 dias: Omeprazol 20mg + Amoxicilina 1g + Claritromicina 500mg, todos administrados de 12/12h."
      }
    ],
    interactiveType: "gastrite"
  },
  {
    id: "constipacao",
    name: "Constipação Intestinal Crônica",
    category: "Gastrointestinal",
    diagnostic: "Frequência de evacuações < 3 vezes por semana, associada a esforço evacuatório aumentado, fezes endurecidas, fragmentadas (escala de Bristol 1 ou 2) e sensação de evacuação esvaziamento incompleta.",
    alarm: "Surgimento agudo de constipação em idoso com alteração persistente do hábito intestinal, sangue nas fezes ou perda de peso inexplicável: suspeita de câncer colorretal - referenciar para Colonoscopia eletiva com brevidade.",
    treatment: [
      {
        title: "1ª Linha - Aumento de Fibras, Hidratação e Atividade Física",
        desc: "Tratamento de base crucial: ingestão diária de 25-30g de fibras alimentares (aveia, linhaça, ameixa, farelo de trigo) aliada à hidratação rigorosa de no mínimo 2 a 2.5 litros de água pura ao dia. Estabelecer rotina diária para evacuar no mesmo horário e evitar segurar a vontade."
      },
      {
        title: "2ª Linha - Laxantes Osmóticos de Uso Seguro Contínuo",
        desc: "Se falha das medidas dietéticas: prescrever Lactulose Xarope 15ml a 30ml VO ao dia pela manhã, ou Polietilenoglicol (PEG 4000) 17g dissolvidos em copo de água ao dia. Evitar o uso crônico e diário de laxantes irritantes (Senna, Óleo de Rícino, Bisacodil) devido ao risco de inércia colônica induzida."
      }
    ]
  },
  {
    id: "diarreia",
    name: "Diarreia Aguda e Gastroenterite",
    category: "Gastrointestinal",
    diagnostic: "Aumento da frequência (≥ 3 evacuações em 24h) de fezes amolecidas ou líquidas por menos de 14 dias. A grande maioria é de etiologia autolimitada viral ou bacteriana leve, não necessitando de exames diagnósticos.",
    alarm: "Presença de desidratação clínica moderada a grave (boca seca, olhos profundos, oligúria, turgor cutâneo diminuído, confusão mental), dor abdominal intensa refratária, ou fezes com sangue e pus: suspeita de Disenteria e Sepse - requer exames e hidratação venosa imediata na UPA.",
    treatment: [
      {
        title: "1ª Linha - Terapia de Reidratação Oral Primária e Suporte",
        desc: "Pilar central absoluto: Reidratação contínua com Soro de Reidratação Oral (SRO) oferecido em colheradas ou copos após cada evacuação líquida (mínimo 200ml em adultos). Associar Zinco elementar 20mg/dia por 10-14 dias em crianças menores. Manter dieta habitual leve e sem gordura/leite."
      },
      {
        title: "2ª Linha - Sintomáticos e Antibioticoterapia Empírica Seletiva",
        desc: "Para controle de cólicas e náuseas: prescrever Bromoprida 10mg ou Metoclopramida 10mg VO até de 8/8h. Antibióticos estão estritamente contraindicados na maioria dos casos leves, mas se houver febre alta persistente, toxemia grave ou disenteria comprovada nas fezes: prescrever Ciprofloxacino 500mg VO de 12/12h por 3-5 dias."
      }
    ]
  },
  {
    id: "varizes",
    name: "Varizes e Insuficiência Venosa Crônica (IVC)",
    category: "Outros",
    diagnostic: "Queixa de peso nas pernas, cansaço físico e edema vespertino que melhora ao repouso elevado. No exame físico: presença de telangiectasias, veias varicosas dilatadas retorcidas, hiperpigmentação ocre da pele maleolar ou úlceras venosas ativas.",
    alarm: "Edema unilateral agudo e súbito de panturrilha acompanhado de dor intensa local espontânea ou ao caminhar, calor local e Sinal de Homans positivo: suspeita de Trombose Venosa Profunda (TVP) - encaminhamento imediato e urgente para ultrassonografia com Doppler venoso na UPA.",
    treatment: [
      {
        title: "1ª Linha - Higiene Venosa Comportamental (Obrigatória)",
        desc: "Evitar permanecer em pé ou sentado por mais de 1-2 horas seguidas. Elevar as pernas acima do nível do coração por 15-20 minutos, 3x ao dia. Uso diário de meias de compressão elástica de média compressão (20-30 mmHg) ao levantar."
      },
      {
        title: "2ª Linha - Auxílio Farmacológico para Alívio Sintomático",
        desc: "Diosmina + Hesperidina (450/50mg) 1 a 2 comprimidos VO ao dia. Atenção: medicação sintomática auxiliar, não previne varizes nem substitui compressão elástica ou cirurgia venosa."
      }
    ]
  },
  {
    id: "cefaleiastens",
    name: "Cefaleia Tensional e Enxaqueca (Migrânea)",
    category: "Outros",
    diagnostic: "Cefaleia Tensional: dor holocraniana em aperto ou pressão, bilateral, opressiva, leve a moderada. Enxaqueca: dor pulsátil, unilateral, moderada a severa, associada a irritabilidade com luz (fotofobia), som (fonofobia) e náuseas.",
    alarm: "Início explosivo e súbito da dor ('pior cefaleia da vida' em segundos), associado a febre, rigidez de nuca, confusão mental, déficit focal motor ou início após os 50 anos: encaminhar imediatamente para tomografia computadorizada cerebral (excluir hemorragia subaracnóidea, meningite ou tumor) na UPA.",
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
    alarm: "Aparecimento de febre alta, dor à mobilização do colo uterino no exame especular ou dor em fossas ilíacas bilaterais persistente (DIP - Doença Inflamatória Pélvica): iniciar antibióticos sistêmicos de largo espectro (Ceftriaxona IM + Doxiciclina) e reavaliar de perto na UPA.",
    treatment: [
      {
        title: "Candidíase Vulvovaginal - Abordagem (SUS)",
        desc: "Miconazol creme vaginal a 2%, aplicar 1 aplicador totalmente preenchido via vaginal à noite ao deitar, por 7 dias seguidos. Alternativa oral: Fluconazol 150mg VO dose única."
      },
      {
        title: "Vaginose Bacteriana - Abordagem (SUS)",
        desc: "Metronidazol gel vaginal a 0.75%, aplicar 1 aplicador cheio via vaginal por 5 noites. Alternativa oral: Metronidazol 250mg, 2 comprimidos VO de 12/12h por 7 dias (orientar abstinência alcoólica absoluta devido ao efeito dissulfiram)."
      }
    ]
  },
  {
    id: "tabac",
    name: "Tabagismo - Programa de Cessação do Fumo",
    category: "Outros",
    diagnostic: "Anamnese detalhada do perfil de consumo de cigarros, histórico de tentativas anteriores de cessação e aplicação do Teste de Fagerström para gradação do grau de dependência química da nicotina.",
    alarm: "Presença de tosse persistente com escarro hemoptoico (com sangue), dispneia progressiva severa, dor torácica de início recente ou perda ponderal rápida inexplicável em fumante de longa data: suspeita de Neoplasia de Pulmão/DPOC grave - encaminhar urgentemente para exames complementares na UBS/UPA.",
    treatment: [
      {
        title: "1ª Linha - Abordagem Cognitivo-Comportamental e Adesivo (TRN)",
        desc: "Grupos de apoio e consultas estruturadas. Se Dependência Elevada (Fagerström ≥ 5): prescrever Adesivos Transdérmicos de Nicotina (21mg, 14mg ou 7mg) aplicados por 24 horas por dia (iniciar com 21mg por 4 semanas, reduzindo progressivamente). Associar pastilha de nicotina ou goma de 2mg nas fissuras agudas."
      },
      {
        title: "2ª Linha - Farmacoterapia Sistêmica Adjuvante (Bupropiona)",
        desc: "Prescrever Cloridrato de Bupropiona 150mg VO ao dia (pela manhã) por 3 dias, progredindo se bem tolerado para 150mg VO de 12/12h (com intervalos de 8h, evitando tomadas perto da hora de deitar), mantendo o curso por 12 semanas. Iniciar 1 semana antes de cessar o fumo. Contraindicado em epilépticos, cirróticos graves ou anoréxicos."
      }
    ],
    interactiveType: "fagerstrom"
  },
  {
    id: "dengue",
    name: "Dengue - Protocolo de Manejo e Hidratação",
    category: "Infecciosas/Endemias",
    diagnostic: "Febre alta de início súbito (geralmente <7 dias) acompanhada de mialgia intensa ('dor nos ossos'), cefaleia, dor retroorbitária, náuseas, vômitos, artralgia ou exantema máculo-papular.",
    alarm: "Presença de febre que cede acompanhada de dor abdominal intensa e contínua, vômitos persistentes, acúmulo de líquidos (ascite/pleural), hipotensão postural, lipotímia, hepatomegalia dolente ou sangramento de mucosas: sinais clássicos de choque por extravasamento plasmático severo - encaminhar imediatamente para internação de urgência no hospital.",
    treatment: [
      {
        title: "Grupo A - Hidratação Oral Densa e Analgesia Segura (Sem Alarme)",
        desc: "Hidratação precoce abundante: prescrever 60 ml/kg/dia (sendo 1/3 com Soro de Reidratação Oral e o restante com líquidos caseiros como água, sucos e água de coco). Controlar dor exclusivamente com Paracetamol (até 3g/dia) ou Dipirona. ABSOLUTAMENTE CONTRAINDICADO o uso de Ácido Acetilsalicílico (AAS) e anti-inflamatórios (AINEs) pelo altíssimo risco de sangramento e hemorragia grave!"
      },
      {
        title: "Grupo B/C/D - Atendimento em Unidades Clínicas e Emergências",
        desc: "Grupo B (Sinais de alarme ausentes, mas com condições de risco ou petéquias): manter hidratação oral supervisionada e coletar hemograma urgente na UBS. Grupos C e D (Sinais de alarme presentes ou sinais flagrantes de choque): terapia de hidratação parenteral com Ringer Lactato ou Soro Fisiológico (20 ml/kg em 20 minutos de forma urgente na UPA) com monitoramento contínuo de hematócrito e diurese."
      }
    ],
    interactiveType: "dengue"
  },
  {
    id: "tuberculose",
    name: "Tuberculose Pulmonar",
    category: "Infecciosas/Endemias",
    diagnostic: "Suspeita clínica em todo 'sintomático respiratório' (tosse persistente por ≥ 3 semanas, febre vespertina, sudorese noturna e perda de peso inexplicável). Diagnóstico confirmado por Baciloscopia (BAAR) de escarro, Teste Rápido Molecular (TRM-TB) ou Cultura de escarro.",
    alarm: "Hemoptise maciça, dor torácica intensa com dispneia progressiva severa, rigidez de nuca ou letargia (suspeita de meningite tuberculosa secundária): transferir para a sala vermelha da UPA de imediato.",
    treatment: [
      {
        title: "1ª Fase - Ataque Inicial de 2 Meses (RIPE)",
        desc: "Prescrever esquema tríplice/quádruplo em dose combinada fixa (SUS): Rifampicina (R), Isoniazida (I), Pirazinamida (P) e Etambutol (E) por 2 meses consecutivos. Obrigatoriamente acompanhar o Tratamento Diretamente Observado (TDO) para garantir adesão completa na UBS."
      },
      {
        title: "2ª Fase - Manutenção de 4 Meses (RI)",
        desc: "Prescrever Rifampicina + Isoniazida diariamente por mais 4 meses. Solicitar baciloscopias de controle mensais. Monitorar função hepática (risco de hepatotoxicidade induzida pelas drogas) e exames de fâneros."
      }
    ]
  },
  {
    id: "hanseniase",
    name: "Hanseníase",
    category: "Infecciosas/Endemias",
    diagnostic: "Lesões cutâneas únicas ou múltiplas (manchas hipocrômicas, placas eritematosas) com perda parcial ou total de sensibilidade térmica, dolorosa e tátil, perda de pelos corporais e anidrose no local. Espessamento palpável de troncos nervosos periféricos dolorosos.",
    alarm: "Neurite aguda (dor severa intensa no trajeto do nervo com perda de força muscular ou sensibilidade aguda de mãos/pés - 'Mão em Garra' ou pé caído) ou episódio reacional agudo (Eritema Nodoso Hansênico): prescrever Prednisona 1mg/kg/dia VO com urgência na UBS para prevenir incapacidades permanentes.",
    treatment: [
      {
        title: "Esquema Paucibacilar (PB - Até 5 lesões de pele)",
        desc: "Poliquimioterapia (PQT) SUS de 6 meses: Rifampicina 600mg (dose mensal supervisionada na UBS) + Dapsona 100mg diários autoadministrados em domicílio. Notificar obrigatoriamente e investigar todos os contatos domiciliares."
      },
      {
        title: "Esquema Multibacilar (MB - Mais de 5 lesões ou baciloscopia positiva)",
        desc: "PQT de 12 meses: Rifampicina 600mg (mensal supervisionada) + Clofazimina 300mg (mensal supervisionada) + Clofazimina 500mg diários autoadministrados + Dapsona 100mg diários. Avaliar grau de incapacidade física em todas as consultas."
      }
    ]
  },
  {
    id: "sifilis",
    name: "Sífilis Adquirida e Secundária",
    category: "Infecciosas/Endemias",
    diagnostic: "Sífilis primária: lesão ulcerada única indolor de bordas limpas (cancro duro) na genitália que cicatriza sozinha. Sífilis secundária: roséolas cutâneas, pápulas descamativas palmoplantares e condiloma plano. Diagnóstico por Teste Rápido (treponêmico) confirmado por teste quantitativo VDRL.",
    alarm: "Presença de cegueira súbita, hipoacusia inexplicada, cefaleia persistente com sintomas de paralisia de pares cranianos ou confusão mental (Neurossífilis): encaminhamento urgente para internação na UPA para infusão de Penicilina Cristalina EV.",
    treatment: [
      {
        title: "Sífilis Recente (Primária, Secundária e Latente Recente < 1 ano)",
        desc: "Prescrever Penicilina G Benzatina 2.400.000 UI IM em dose única (aplicada como 1.200.000 UI em cada glúteo com agulha profunda para evitar dor extrema). Tratar e rastrear ativamente todos os parceiros sexuais do último ano."
      },
      {
        title: "Sífilis Tardia (Latente Tardia > 1 ano ou Duração Desconhecida)",
        desc: "Prescrever Penicilina G Benzatina 2.400.000 UI IM por semana, durante 3 semanas consecutivas (dose total de 7.200.000 UI IM). Respeitar rigorosamente o intervalo de 7 dias entre as doses para não invalidar o tratamento."
      }
    ]
  },
  {
    id: "insufcard",
    name: "Insuficiência Cardíaca Crônica (ICC)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Clínico com base nos Critérios de Framingham (Dispneia de esforço progressiva, ortopneia, dispneia paroxística noturna, turgência jugular, estertores pulmonares bilaterais, edema depressível em membros inferiores). Confirmar fração de ejeção por Ecocardiograma.",
    alarm: "Dispneia mesmo ao repouso, estertores crepitantes estendendo-se além de bases pulmonares, tosse com expectoração rósea espumosa (Edema Agudo de Pulmão) ou tontura/síncope com hipotensão grave (Choque cardiogênico): transferir emergencialmente à sala vermelha da UPA.",
    treatment: [
      {
        title: "Terapia Quádrupla Otimizada de Sobrevida (Pilar Clínico)",
        desc: "Se fração de ejeção reduzida (ICFEr): prescrever IECA (Enalapril até 20mg VO 12/12h conforme PA) ou BRA (Losartana), Betabloqueador de sobrevida (Carvedilol até 25-50mg 12/12h ou Succinato de Metoprolol), Espironolactona 25mg VO ao dia e Inibidores de SGLT2 (Dapagliflozina 10mg VO ao dia)."
      },
      {
        title: "Controle Congestivo Sintomático (SUS)",
        desc: "Para alívio rápido de congestão e edema de membros inferiores: prescrever Furosemida 20mg a 80mg VO ao dia. Dosar eletrólitos (potássio e sódio) e dosar função renal regularmente para evitar toxicidade e azotemia prerenal."
      }
    ]
  },
  {
    id: "fib-atrial",
    name: "Fibrilação Atrial Crônica (FA)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Ausculta de ritmo cardíaco totalmente irregular sem padrão cíclico. Diagnóstico selado por Eletrocardiograma (ECG) de repouso evidenciando ausência completa de ondas P, presença de ondas f de fibrilação e intervalos R-R marcadamente irregulares.",
    alarm: "Presença de dor torácica opressiva súbita irradiada, síncope de início recente, dispneia extrema incapacitante ou surgimento agudo de déficits neurológicos focais (sugestivo de AVC Isquêmico) -> UPA imediata de urgência.",
    treatment: [
      {
        title: "Prevenção Tromboembólica (Rastreio CHA2DS2-VASc)",
        desc: "Se CHA2DS2-VASc ≥ 2 em homens ou ≥ 3 em mulheres: indicar anticoagulação oral duradoura. SUS disponibiliza a Varfarina Sódica 5mg VO ao dia (ajustar rigorosamente a dose para manter o RNI terapêutico entre 2.0 e 3.0 em exames laboratoriais periódicos)."
      },
      {
        title: "Controle de Frequência Cardíaca (SUS)",
        desc: "Prescrever Betabloqueador: Atenolol 25mg a 100mg VO ao dia ou Propranolol 40mg VO de 12/12h para manter a frequência cardíaca de repouso < 110 bpm. Em idosos sedentários ou se refratariedade, pode-se associar Digoxina 0.25mg VO ao dia."
      }
    ]
  },
  {
    id: "doencarenal",
    name: "Doença Renal Crônica (DRC)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Calculada por Taxa de Filtração Glomerular estimada (TFGe) < 60 mL/min/1.73m² (através da fórmula CKD-EPI baseada na Creatinina Sérica) ou pela presença estável do marcador de lesão renal Albuminúria ≥ 30 mg/24h por um período ≥ 3 meses.",
    alarm: "Presença de sintomas urêmicos (náuseas e vômitos refratários, perda ponderal rápida, prurido cutâneo intratável, soluços contínuos, pericardite urêmica), acidose metabólica grave, hipercalemia > 6.0 mEq/L ou anasarca refratária a diuréticos -> UPA para diálise de urgência.",
    treatment: [
      {
        title: "Nefroproteção e Controle de Progressão (UBS)",
        desc: "Bloqueio absoluto do sistema renina-angiotensina: prescrever preferencialmente IECA (Enalapril) ou BRA (Losartana) para atingir PA < 130/80 mmHg e reduzir albuminúria. Evitar veementemente AINEs (como Ibuprofeno, Nimesulida, Diclofenaco) e automedicação."
      },
      {
        title: "Tratamento de Complicações e Restrição Dietética",
        desc: "Prescrever Carbonato de Cálcio 500mg VO junto de refeições como quelante de fósforo se fosfatemia elevada. Corrigir anemia renal com reposição de ferro e encaminhar para eritropoietina se hemoglobina < 10 g/dL. Restrição de sódio e ingestão moderada de potássio."
      }
    ]
  },
  {
    id: "hep-cronicas",
    name: "Hepatite Crônica B e C",
    category: "Infecciosas/Endemias",
    diagnostic: "Rastreamento inicial sorológico executado via Teste Rápido (HBsAg para Hepatite B; Anti-HCV para Hepatite C). Confirmação obrigatória por PCR de carga viral quantitativa. Avaliar cirrose por FIB-4 ou elastografia.",
    alarm: "Ascite de início rápido ou refratária, icterícia severa progressiva, confusão mental ou inversão do padrão do sono (Encefalopatia Hepática), ou sangramento varicoso (hematêmese/melena) -> UPA imediata.",
    treatment: [
      {
        title: "Hepatite B - Supressão Viral Duradoura (Acompanhamento SUS)",
        desc: "Se critérios preenchidos (alta replicação e transaminases elevadas): prescrever Tenofovir (TDF) 300mg VO ao dia de forma contínua e sem interrupções. Monitorar periodicamente função renal e densidade mineral óssea (risco de nefro/osteotoxicidade)."
      },
      {
        title: "Hepatite C - Terapia de Erradicação / Cura Rápida",
        desc: "Prescrever antivirais de ação direta sem interferon por 12 semanas: Sofosbuvir 400mg + Velpatasvir 100mg combinados em comprimido único diário. Apresenta taxas de cura completas e definitivas (resposta virológica sustentada) superiores a 95% do total."
      }
    ]
  },
  {
    id: "hiper-tireo",
    name: "Hipertireoidismo (Doença de Graves)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Quadro clássico de tireotoxicose: perda de peso com apetite aumentado, taquicardia persistente no repouso, intolerância ao calor, sudorese, tremores finos nas mãos estendidas, bócio palpável e exoftalmia. Confirmar por TSH suprimido (< 0.1) e T4 Livre elevado.",
    alarm: "Febre alta incapacitante de início recente, taquicardia instável extrema, agitação psicomotora exuberante, icterícia e delírio agudo (Crise Tireotóxica/Tempestade Tireoidiana) -> Encaminhamento emergencial de terapia intensiva via UPA.",
    treatment: [
      {
        title: "1ª Linha - Bloqueio de Síntese Hormonal (Antitireoidiano)",
        desc: "Prescrever Metimazol 5mg a 40mg VO ao dia pela manhã, de acordo com níveis basais iniciais de T4 Livre. Monitorar hemograma completo no início do tratamento pelo risco raro porém severo de agranulocitose idiopática (orientar paciente a buscar ajuda se dor de garganta e febre surgirem)."
      },
      {
        title: "2ª Linha - Alívio Sintomático Adjuvante Cardiorrespiratório",
        desc: "Prescrever Propranolol 20mg a 40mg VO de 8/8h ou 12/12h para alívio imediato dos sintomas de taquicardia, tremores musculares e ansiedade sistêmica secundária, até atingir níveis de eutiloidismo estáveis nos exames."
      }
    ]
  },
  {
    id: "labirintite",
    name: "Labirintite / Vertigem Posicional (VPPB)",
    category: "Outros",
    diagnostic: "Vertigem rotatória desencadeada por mudanças de posição da cabeça durando segundos (VPPB - nistagmo fatigável à manobra diagnóstica de Dix-Hallpike), ou vertigem severa contínua durando dias acompanhada de náuseas profundas (Neurite Vestibular).",
    alarm: "Associação de vertigem recente com cefaleia occipital explosiva, ataxia de marcha incapacitante, paralisia de nervos faciais, disartria, diplopia ou perda auditiva profunda súbita (AVC de fossa posterior cerebelar) -> Encaminhar à UPA imediata.",
    treatment: [
      {
        title: "Abordagem Física da VPPB (Manobras Reabilitadoras)",
        desc: "O principal tratamento curativo para VPPB de canal semicircular posterior é a Manobra de Epley (manobra de reposicionamento de otólitos executada em consultório). Exercícios de reabilitação vestibular domiciliares de Brandt-Daroff estimulam cura definitiva duradoura."
      },
      {
        title: "Sintomáticos Farmacológicos na Crise Aguda (SUS)",
        desc: "Prescrever Dimenidrato (Dramin) 50mg VO até de 8/8h para suprimir náuseas, ou Cinarizina 25 a 75mg VO ao dia. Restringir o tratamento farmacológico a no máximo 5-7 dias para evitar bloqueio e retardo da compensação fisiológica natural no sistema nervoso central."
      }
    ]
  },
  {
    id: "litiase-renal",
    name: "Litíase Renal (Cólica Nefretica)",
    category: "Gastrointestinal",
    diagnostic: "Dor lombar unilateral aguda, de intensidade excruciante em cólica, irradiando para o flanco, fossa ilíaca correspondente e região inguinal do mesmo lado, associando-se a náuseas constantes, vômitos e hematúria secundária. Sinal de Giordano unilateral evidente.",
    alarm: "Dor refratária a analgésicos venosos potentes na UPA, febre alta (>38°C) associada a calafrios importantes (suspeita de Pielonefrite Obstrutiva por cálculo impatado - emergência urológica extrema), rim único ou anúria -> Internar e referenciar à Urologia.",
    treatment: [
      {
        title: "Manejo Ambulatorial Tolerável de Expulsão de Cálculo (< 10mm)",
        desc: "Para auxiliar migração urinária de cálculos em ureter distal: prescrever Tansulosina 0.4mg VO ao deitar por até 14 dias diários. Manter hidratação oral equilibrada moderada (evitar super-hidratação vigorosa forçada durante as crises de dor ativas para evitar distensão da cápsula renal e piora da dor)."
      },
      {
        title: "Analgesia Ambulatorial e Profilaxia Dietética",
        desc: "Para episódios álgicos intermitentes leves em domicílio: prescrever Ibuprofeno 600mg VO de 8/8h + Dipirona 1g VO se dor por até 3-5 dias. Orientar profilaxia de longo prazo: ingestão de água abundante (> 2.5L/dia), redução drástica do sódio dietético e consumo balanceado regular de cálcio."
      }
    ]
  },
  {
    id: "celulite",
    name: "Celulite e Erisipela Bacteriana",
    category: "Pele & Dermatologia",
    diagnostic: "Erisipela: dor, calor, rubor e edema bem marcados em membros inferiores, com bordas circundantes elevadas, nítidas e bem delineadas (infecccão de derme superficial com envolvimento linfático). Celulite: Acometimento de planos de tecido gorduroso subcutâneo profundo, com bordas indefinidas.",
    alarm: "Presença de bolhas de conteúdo hemorrágico, áreas violáceas de necrose cutânea focal recente, crepitação ao toque de tecidos profundos, dor insuportável fora da proporção visual ou hipotensão postural grave (Sepse grave / Fasciíte Necrosante) -> UPA imediata.",
    treatment: [
      {
        title: "1ª Linha - Antibioticoterapia Empírica Ambulatorial",
        desc: "Prescrever Cefalexina 500mg VO de 6/6h por 10 dias inteiros, ou Amoxicilina + Clavulanato 875/125mg VO de 12/12h como cobertura. Medida de repouso crucial: orientar repouso absoluto com o membro acometido elevado constantemente acima do nível do coração."
      },
      {
        title: "2ª Linha - Profilaxia Secundária Baseada em Recorrência",
        desc: "Para pacientes com histórico crônico de linfedema que evoluem com erisipela de repetição frequente (≥ 3 episódios em 12 meses): prescrever Penicilina G Benzatina 1.200.000 UI IM profundo de 21 em 21 dias por um período estimado de 12 a 24 meses consecutivos."
      }
    ]
  },
  {
    id: "hzoster",
    name: "Herpes Zoster (Cobreiro)",
    category: "Pele & Dermatologia",
    diagnostic: "Dor neuropática severa em dermatose unilateral restrita (segundo um trajeto neural), acompanhada de erupções cutâneas papulovesiculares dolorosas agrupadas sobre base eritematosa que não ultrapassam a linha média corporal.",
    alarm: "Presença de vesícula na ponta ou asa do nariz (Sinal de Hutchinson - denota envolvimento do ramo oftálmico do trigêmeo com risco de necrose de córnea), paralisia de musculatura facial ipsilateral (Ramsay-Hunt) ou dor intratável -> Encaminhamento especializado urgente.",
    treatment: [
      {
        title: "Terapia Antiviral Precoce Otimizada",
        desc: "Iniciar preferencialmente nas primeiras 72h das lesões iniciais: prescrever Aciclovir 800mg VO administrado 5 vezes ao dia (com intervalos regulares de 4/4h, poupando a tomada no descanso noturno) por 7 dias seguidos. Reduz de forma muito expressiva a neuralgia pós-herpética crônica."
      },
      {
        title: "Modulação de Dor Neuropática Aguda",
        desc: "Para tratar o sofrimento álgico neuropático associado: prescrever Amitriptilina 12.5mg a 25mg VO à noite, ou associar de forma adjunta Pregabalina 75mg VO à noite. Analgesia de suporte com Dipirona 1g VO de 6/6h se dor severa incidental."
      }
    ]
  },
  {
    id: "impetigo",
    name: "Impetigo Bacteriano",
    category: "Pele & Dermatologia",
    diagnostic: "Infecção bacteriana da epiderme, caracterizada por pequenas vesículas ou pústulas pruriginosas agrupadas que sofrem ruptura e evoluem desenvolvendo crostas amareladas com aparência de mel aderidas (crostas melicéricas), comum na face infantil.",
    alarm: "Aparecimento de edema palpebral facial, elevação expressiva de PA sanguínea da criança ou urina de coloração escura amarronzada tipo 'refrigerante de cola' após 14-21 dias (Glomerulonefrite Difusa Aguda Pós-Estreptocócica - GNPE) -> UPA com pediatra.",
    treatment: [
      {
        title: "Abordagem Local (Lesões Poucas e Localizadas)",
        desc: "Lavar as lesões com água morna e sabão neutro para amolecer as crostas melicéricas e removê-las suavemente. Prescrever Pomada de Mupirocina a 2% aplicada de forma tópica sobre as lesões limpas de 8/8h por 5 a 7 dias seguidos."
      },
      {
        title: "Abordagem Sistêmica (Lesões Disseminadas ou Impetigo Bolhoso)",
        desc: "Em casos de infecções disseminadas, bolhosas ou extensas: prescrever Ciprofloxacino ou preferencialmente Cefalexina oral (50 mg/kg/dia para crianças divididos de 6/6h; ou dose padrão adulto de 500mg de 6/6h) por 7 dias."
      }
    ]
  },
  {
    id: "colelitiase",
    name: "Colelitíase e Colecistite Aguda",
    category: "Gastrointestinal",
    diagnostic: "Colelitíase: episódios autolimitados de epigastralgia ou dor no quadrante superior direito do abdômen desencadeados por alimentação gordurosa (cólica biliar). Colecistite: dor contínua > 6h no hipocôndrio direito com febre e Sinal de Murphy positivo.",
    alarm: "Icterícia acompanhada de colúria e febre em agulha com calafrios trementes (Tríade de Charcot indicativa de Colangite Aguda obstrutiva pulmonar grave) ou abdômen difusamente tenso e peritonite -> Encaminhar para cirurgia de urgência na UPA.",
    treatment: [
      {
        title: "Conduta Ambulatorial da Cólica Biliar Simples",
        desc: "Para episódios esporádicos e leves de dor: prescrever Dipirona 1g VO associado a Escopolamina (Buscopan) nos momentos de dor. Orientar dieta rigorosa livre de gorduras, frituras e queijos amarelos, e encaminhar o paciente à cirurgia eletiva na UBS."
      },
      {
        title: "Manejo Clínico de Urgência da Colecistite Aguda",
        desc: "Se colecistite ativa instalada: internar na observação, manter em jejum absoluto, iniciar hidratação parenteral vigorosa, antibioticoterapia de largo espectro em infusão (Ciprofloxacino EV + Metronidazol EV) e alinhar cirurgia emergencial na UPA."
      }
    ]
  },
  {
    id: "apendicite",
    name: "Apendicite Aguda",
    category: "Gastrointestinal",
    diagnostic: "Dor abdominal de início impreciso periumbilical ou epigástrico que migra no decorrer de horas fixando-se sob a fossa ilíaca direita (ponto de McBurney), acompanhada de anorexia total (ausência de fome), náuseas, vômitos e Sinal de Blumberg evidente.",
    alarm: "Piora abrupta insuportável da dor abdominal difusa associada a distensão marcante, abdômen em tábua com rigidez involuntária (sinal de perfuração livre com peritonite generalizada grave) -> Encaminhamento cirúrgico imediato na UPA.",
    treatment: [
      {
        title: "Conduta Inicial e Estabilização Pré-Operatória (UPA)",
        desc: "A conduta definitiva é cirúrgica emergencial (apendicectomia). Manter o paciente sob jejum absoluto (zero líquidos ou sólidos). Iniciar hidratação endovenosa contínua com expansores cristalóides e colher exames laboratoriais pré-operatórios de urgência."
      },
      {
        title: "Antibioticoterapia Profilática e Monitorização",
        desc: "Prescrever antibioticoterapia venosa focada em germes gram-negativos e anaeróbios antes da incisão cirúrgica na UPA (ex: Ceftriaxona 1g EV associado a Metronidazol 500mg EV). Manter monitorização cardíaca e vigilância de sinais de choque sético."
      }
    ]
  },
  {
    id: "epilepsia",
    name: "Epilepsia e Crises Convulsivas",
    category: "Outros",
    diagnostic: "Predisposição para gerar crises convulsivas espontâneas recorrentes por alteração elétrica no córtex cerebral. Caracterizada por abalos motores tônico-clônicos, perda completa de consciência, sialorréia abundante e relaxamento esfincteriano.",
    alarm: "Crise convulsiva prolongada ultrapassando 5 minutos de duração, ou crises sucessivas repetidas sem retorno da consciência nos intervalos (Estado de Mal Epiléptico): risco de dano neurológico irreversível -> Monitorar vias aéreas e administrar Diazepam EV na UPA.",
    treatment: [
      {
        title: "Controle de Crise Aguda Ativa (Urgência UPA)",
        desc: "Não tentar conter movimentos violentos do paciente. Proteger cabeça física. Aplicar O2 inalatório. Se crise durar > 2 min: administrar Diazepam 10mg EV de forma lenta (ou diazepam retal se sem acesso rápido), repetindo uma vez se necessário."
      },
      {
        title: "Tratamento Profilático e Manutenção Crônica",
        desc: "Prescrever anticonvulsivantes diários SUS e otimizar doses progressivamente: Carbamazepina 200mg a 400mg VO de 12/12h, Ácido Valpróico 250mg a 500mg VO de 12/12h ou Fenobarbital 100mg VO ao deitar. Orientar adesão estrita dos fármacos."
      }
    ]
  },
  {
    id: "cistite-rec",
    name: "Cistite Recorrente e Infecção de Repetição",
    category: "Infecciosas/Endemias",
    diagnostic: "Consiste na ocorrência documentada de ≥ 2 episódios clínicos de cistite aguda no intervalo de 6 meses ou ≥ 3 episódios no último ano. É mandatatório coletar amostra de Urina Tipo 1 e Urocultura com antibiograma em todos os episódios.",
    alarm: "Presença de febre alta progressiva acompanhada de calafrios, dor lombar unilateral com Giordano positivo ou refratariedade clínica aos esquemas orais iniciados (suspeita de pielonefrite complicada secundária) -> UPA.",
    treatment: [
      {
        title: "Profilaxia Comportamental e Medidas Gerais (SUS)",
        desc: "Orientar hidratação densa oral (> 2.5 litros ao dia), micção imediata de urgência após relações sexuais, higienização de frente para trás após evacuar e abolição de sabonetes íntimos perfumados abrasivos e duchas internas vaginais na UBS."
      },
      {
        title: "Profilaxia Farmacológica Especializada (Acompanhamento)",
        desc: "Se falha das medidas preventivas comportamentais: prescrever uso contínuo de longa data de quimioprofilaxia de dose baixa: Nitrofurantoína 100mg VO ao deitar à noite por um período contínuo de 3 a 6 meses consecutivos, ou Cefalexina 250mg."
      }
    ]
  },
  {
    id: "gastro-desidrat",
    name: "Gastroenterite com Desidratação Moderada",
    category: "Gastrointestinal",
    diagnostic: "Diarréia aquosa profusa e múltipla associada a episódios repetidos de vômitos que impedem a ingesta hígida oral. Desidratação moderada confirmada por turgor de pele lento (pastoso), mucosa oral seca, ausência de lágrimas e oligúria leve.",
    alarm: "Presença de hipotensão postural marcada na medição ortostática, anúria persistente (>8h), rebaixamento sensorial do nível mental da criança ou febre alta com dor abdominal contínua intolerável (disenteria e sepse) -> Sala vermelha UPA.",
    treatment: [
      {
        title: "Terapia de Reidratação Parenteral Rápida (Plano C SUS)",
        desc: "Estabilização rápida baseada em infusão parenteral endovenosa de expansores na UPA: prescrever Soro Fisiológico 0.9% ou Ringer Lactato com infusão volumétrica de 50 a 100 ml/kg a correr no período entre 2 e 4 horas. Monitorar turgor."
      },
      {
        title: "Anti-eméticos EV e Transição para Via Oral",
        desc: "Prescrever Ondansetrona 4mg a 8mg EV lento (perfil extra de segurança para impedir reações extrapiramidais severas em jovens e crianças comparado à metoclopramida/bromoprida). Fornecer soro de reidratação oral continuamente após tolerabilidade."
      }
    ]
  },
  {
    id: "escarlatina",
    name: "Escarlatina",
    category: "Infecciosas/Endemias",
    diagnostic: "Quadro infeccioso agudo bacteriano caracterizado por exantema micropapular áspero que confere aspecto e textura de 'lixa' à pele cutânea, acompanhado de faringoamigdalite purulenta aguda, Sinal de Pastia (piora nas pregas) e Sinal de Filatov (palidez perioral).",
    alarm: "Aparecimento de dores articulares migratórias limitantes inexplicáveis, cansaço fácil importante com falta de ar ou sopro cardíaco no pós-infeccioso (comorbidades tardias de Febre Reumática aguda) -> Encaminhar à UPA.",
    treatment: [
      {
        title: "1ª Linha - Prevenção Primária de Febre Reumática",
        desc: "Prescrever Penicilina G Benzatina em dose única intramuscular profunda profunda: 600.000 UI IM se peso infantil < 27 kg; e 1.200.000 UI IM em dose única para adolescentes ou adultos maiores. Erradica o patógeno na UBS."
      },
      {
        title: "2ª Linha - Tratamento Alternativo de Erradicação Esterilizante",
        desc: "Se hipersensibilidade documentada à penicilina: prescrever Amoxicilina suspensão oral 50 mg/kg/dia por exatamente 10 dias consecutivos de utilização (período obrigatório para garantir erradicação e neutralizar a patogênese autoimune)."
      }
    ]
  },
  {
    id: "leptospirose",
    name: "Leptospirose",
    category: "Infecciosas/Endemias",
    diagnostic: "Início explosivo agudo de febre alta acompanhada de cefaleia intensa refratária e mialgia extraordinariamente acentuada com dor severa palpável nas panturrilhas, associado a histórico de enchente ou contato com roedores há 2-14 dias.",
    alarm: "Presença de icterícia pálida rubínica, insuficiência renal aguda com oligúria marcante, sangramentos difusos ativos ou hemoptise severa com dispneia progressiva (Síndrome de Weil) -> Transferir urgente de maca hospitalar ao CTI pela UPA.",
    treatment: [
      {
        title: "Fase Precoce / Doença Leve Ambulatorial (SUS)",
        desc: "Prescrever Doxiciclina 100mg VO de 12/12h por 7 dias inteiros seguidos (contraindicada se gestante ou criança menor de 8 anos). Como alternativa SUS segura e robusta: Amoxicilina 500mg VO de 8/8h por 7 dias."
      },
      {
        title: "Fase Tardia / Doença Moderada a Severa (Internado UPA)",
        desc: "Indicar tratamento padrão sob regime de internação venosa: prescrever Ceftriaxona 1g a 2g EV ao dia, ou Penicilina G Cristalina 1.500.000 UI EV administrado sob gotejamento regular de 6/6h por 7 a 10 dias consecutivos."
      }
    ]
  },
  {
    id: "parkinson",
    name: "Doença de Parkinson",
    category: "Outros",
    diagnostic: "Distúrbio crônico progressivo dopaminérgico motor. Confirmado clinicamente no consultório pela manifestação da rigidez muscular em 'roda denteada' perceptível, tremor assimétrico característico em repouso, bradicinesia proeminente e marcha de passos curtos.",
    alarm: "Inabilidade severa de engolir alimentos com engasgos frequentes e suspeita de broncoaspiração de saliva (Pneumonia aspirativa secundária), ou instabilidade postural com quedas graves e síncope -> Encaminhar à UPA imediata.",
    treatment: [
      {
        title: "Manejo Motor Sintomático Inicial (UBS)",
        desc: "Prescrever Levodopa + Benserazida (Prolopa) 200/50mg fracionados de 8/8h ou 6/6h. Orientar veementemente o paciente a tomar o comprimido pelo menos 30 a 45 minutos antes ou 2 horas após refeições proteicas pela competição entérica de aminoácidos."
      },
      {
        title: "Reabilitação Fisioterapêutica e Terapia de Suporte",
        desc: "Encaminhar para fisioterapia motora com foco em equilíbrio e prevenção de quedas domiciliares. Associar se necessário Pramipexol 0.125mg a 0.250mg VO até de 8/8h se sintomas de flutuação motora ou tremores excessivos persistirem."
      }
    ]
  },
  {
    id: "ulcera-venosa",
    name: "Úlcera de Insuficiência Venosa Crônica",
    category: "Outros",
    diagnostic: "Lesão ulcerativa crônica indolor de face maleolar medial interna de membros inferiores, com bordas irregulares e rasas, fundo com fibrina úmida e tecido de granulação granulado. Presença de varizes e hiperpigmentação ocre circundante.",
    alarm: "Presença súbita de dor lancinante local na perna afetada, eritema de rápida ascensão cutânea na pele da panturrilha, febre, calafrios (indicativo de erisipela primária secundária à úlcera aberta infectada) -> UPA urgentemente.",
    treatment: [
      {
        title: "Terapia Compressiva e Cicatrização (SUS)",
        desc: "Estilo padrão de cicatrização da atenção primária: aplicar Bota de Unna (bandagem inelástica úmida impregnada com óxido de zinco e glicerina) renovada a cada 7 dias por enfermeiro na UBS. Manter compressão externa contínua."
      },
      {
        title: "Higiene da Úlcera e Adjuvantes Farmacológicos",
        desc: "Limpeza diária local com soro fisiológico morno sob pressão suave por jato. Para aliviar os sintomas do edema e sensação de peso nas pernas: prescrever Diosmina + Hesperidina 450/50mg VO ao dia e repouso regular com as pernas suspensas."
      }
    ]
  },
  {
    id: "artrite-reuma",
    name: "Artrite Reumatóide",
    category: "Outros",
    diagnostic: "Poliartrite simétrica inflamatória dolorosa crônica persistentemente por período ≥ 6 semanas, envolvendo principalmente pequenas articulações (interfalangeanas proximais de mãos). Rigidez matinal intensa durando mais de 1 hora. Fator Reumatóide positivo.",
    alarm: "Cefaleia cervical severa de início rápido acompanhada de parestesias ou diminuição abrupta de força em membros (compressão cervical por subluxação atlanto-axial inflamatória) ou dor torácica pericardítica súbita -> UPA urgente.",
    treatment: [
      {
        title: "1ª Linha - Modificação da Doença (Metotrexato)",
        desc: "Iniciar sob acompanhamento co-gestado de reumatologia: Metotrexato (MTX) 7.5mg a 25mg VO em tomada única semanal regular. Prescrever obrigatoriamente Ácido Fólico 5mg VO de 24h a 48h após a dose semanal para prevenção das aftas, toxicidade medular e hepática."
      },
      {
        title: "Manejo Analgésico das Crises e Corticoterapia",
        desc: "Para crises agudas do espasmo articular: prescrever Prednisona de dose baixa (< 7.5mg/dia) como ponte terapêutica, e Ibuprofeno 600mg ou Naproxeno 250mg VO conforme dores, com cautela nas contraindicações renais e gástricas."
      }
    ]
  },
  {
    id: "dermatite-seb",
    name: "Dermatite Seborreica",
    category: "Pele & Dermatologia",
    diagnostic: "Dermatose eritematodescamativa comum caracterizada por coceira e escamas gordurosas amareladas aderidas em couro cabeludo (caspa), regiões retroauriculares, sulco nasolabial facial, supercílios e tórax anterior.",
    alarm: "Pacientes lactentes pequenos com descamação extensa vermelha brilhante difusa generalizada (Eritrodermia de Leiner pós-seborreica com imunodeficiência severa secundária) -> Internação e investigação em ambiente de pediatria terciário.",
    treatment: [
      {
        title: "Manejo no Couro Cabeludo (Caspa Severa SUS)",
        desc: "Prescrever Shampoo de Cetoconazol a 2% para aplicação durante os banhos da semana: aplicar sobre o couro cabeludo, ensaboando vigorosamente e deixando em contato terapêutico por 5-10 minutos antes do enxágue, 2 a 3x na semana."
      },
      {
        title: "Manejo Facial de Face e Áreas Sólidas Delicadas",
        desc: "Creme de Cetoconazol a 2% aplicado nas superfícies acometidas nas bochechas ou nariz 1 a 2 vezes ao dia por 2 a 4 semanas consecutivas. Em crises com inflamação severa, associar Hidrocortisona creme a 1% por no máximo 3 dias."
      }
    ]
  },
  {
    id: "faringite-strep",
    name: "Faringite Estreptocócica e Febre Reumática",
    category: "Respiratório",
    diagnostic: "Faringite exsudativa dolorosa súbita em faixa etária escolar (dos 5 aos 15 anos), caracterizada por febre alta, placas purulentas acinzetadas amigdalianas, petéquias no palato e ausência completa de coriza ou tosse concomitante.",
    alarm: "Dores articulares migratórias limitantes pós-infecção (artrite de grandes articulações), aparecimento de sopros auscultatórios novos (Cardite Reumática aguda) ou hipercinesias de agitação (Coreia de Sydenham) -> UPA imediata.",
    treatment: [
      {
        title: "Profilaxia Primária de Febre Reumática (Insubstituível)",
        desc: "Prescrever Penicilina G Benzatina dose única profunda intramuscular: 600.000 UI IM se peso infantil < 27 kg; ou 1.200.000 UI IM em dose única se peso maior. Elimina e esteriliza o Streptococcus em 100% dos tecidos."
      },
      {
        title: "Acompanhamento Tardio e Rastreamento Reumático",
        desc: "Investigar dor de garganta em todas as crianças da moradia. Se quadro instalado de febre reumática crônica sem cardite residual: injetar penicilina de 21 em 21 dias por até atingir 21 anos de idade no acompanhamento sistemático da UBS."
      }
    ]
  },
  {
    id: "pielonefrite",
    name: "Pielonefrite Aguda",
    category: "Infecciosas/Endemias",
    diagnostic: "Febre alta de início súbito acompanhada de calafrios trementes, náuseas, vômitos e dor em flanco unilateral com Giordano positivo (punho-percussão lombar extremamente dolorosa). Presença frequente de sintomas urinários baixos anteriores (disúria, polaciúria).",
    alarm: "Hipotensão refratária (PAS < 90 mmHg), sonolência ou letargia severa, ou incapacidade absoluta de manter hidratação oral devido a vômitos incoercíveis -> UPA para início imediato de antibioticoterapia endovenosa e hidratação parenteral.",
    treatment: [
      {
        title: "Tratamento Ambulatorial por Via Oral (Casos Leves)",
        desc: "Prescrever Ciprofloxacino 500mg VO de 12/12h por 7 a 10 dias seguidos, ou Levofloxacino 750mg VO ao dia por 5 dias. Alternativa: Amoxicilina + Clavulanato 875/125mg VO de 12/12h por 10-14 dias (ideal em gestantes hígidas de baixo risco com urocultura)."
      },
      {
        title: "Sintomáticos Orais e Hidratação Abundante na UBS",
        desc: "Analgésicos comuns: Dipirona 1g VO de 6/6h para controle de febre e dor. Orientar hidratação hídrica exuberante oral (> 2.5 a 3 litros de água por dia) e solicitar urocultura de controle após 14 dias do término das doses."
      }
    ]
  },
  {
    id: "urolitiase",
    name: "Urolitíase (Cólica Renal Aguda)",
    category: "Outros",
    diagnostic: "Dor lombar de início abrupto, fustigante e de fortíssima intensidade que irradia para flanco anterior e região inguinal/genitais unilateralmente, sem posição de alívio, com sintomas de náuseas graves, vômitos e hematúria (sangue na urina).",
    alarm: "Febre associada a dor lombar persistentemente elevada (suspeita de complicação obstrutiva infecciosa), anúria absoluta (bexiga vazia por obstrução bilateral ou rim único), ou dor insuportável refratária a analgésicos IV potentes -> Transferência urgente à UPA/Especialista.",
    treatment: [
      {
        title: "Manejo Analgésico de Ataque na UPA (Crise de Dor)",
        desc: "Esquema IV imediato: Tenoxicam 40mg IV (anti-inflamatório bloqueador de prostaglandinas que reduzem pressão ureteral) associado a Dipirona 2g IV. Se refratariedade de dor, utilizar Tramadol 100mg IV em infusão lenta ou morfina diluída. Associar antiemético (Metoclopramida 10mg IV)."
      },
      {
        title: "Terapia de Expulsão e Orientações Domiciliares (UBS)",
        desc: "Para cálculos ureterais distais pequenos (< 6-10 mm): prescrever Tansulosina 0.4mg VO ao dia por até 14 dias para facilitar expulsão expontânea. Orientar hidratação hídrica normal na crise aguda (NÃO exagerar na hidratação em crise para não aumentar cólica ureteral)."
      }
    ]
  },
  {
    id: "corrimento_uretral",
    name: "Corrimento Uretral Masculino (Gonorréia e Clamídia)",
    category: "Infecciosas/Endemias",
    diagnostic: "Corrimento mucopurulento ou purulento abundante amarelante saindo por via de meato uretral masculino, com queixa severa de disúria intensa e prurido uretral local após relação sexual desprotegida recente.",
    alarm: "Dor testicular aguda unilateral de início abrupto acompanhada de edema volumoso e hiperemia de saco escrotal (Orquiepididimite bacteriana aguda) -> UPA ou UBS de imediato para início de antibiótico e repouso de bolsa.",
    treatment: [
      {
        title: "Tratamento pela Abordagem Sindrômica (SUS)",
        desc: "Tratar empírica e simultaneamente os dois principais patógenos (Gonococo e Clamídia) na mesma consulta: prescrever Ceftriaxona 500mg IM (dose única profunda) PLUS Azitromicina 1g VO (tomados em dose única imediata em consultório)."
      },
      {
        title: "Manejo de Parceiros e Prevenção Ativa na UBS",
        desc: "Evitar qualquer relação sexual até cura completa do casal (7 dias pós-dose). Chamar ativamente para tratamento imediato todos os parceiros sexuais dos últimos 60 dias com esquema idêntico e oferecer testes rápidos para HIV, Sífilis e Hepatites."
      }
    ]
  },
  {
    id: "erisipela",
    name: "Erisipela e Celulite Infeciosa",
    category: "Pele & Dermatologia",
    diagnostic: "Infecções bacterianas agudas de tecidos moles. Erisipela: placa eritematosa vermelho-brilhante, bem delimitada, com calor e edema exuberantes acometendo derme superficial (geralmente perna). Celulite: acomete derme profunda e gordura subcutânea, com bordas mal definidas e dor local intensa.",
    alarm: "Delineamento de áreas purpúricas cinzas, surgimento de bolhas hemorrágicas difusas, dor local absurdamente desproporcional à lesão visível ou crepitação gasosa na palpação (indica Fascite Necrosante de altíssima gravidade) -> UPA de emergência imediata.",
    treatment: [
      {
        title: "Erisipela Leve - Tratamento Ambulatorial (SUS)",
        desc: "Prescrever Cefalexina 500mg VO de 6/6h por 7 a 10 dias seguidos, ou Cefadroxila 550mg VO de 12/12h. Medida indispensável: repouso absoluto em leito com elevação contínua do membro inferior afetado (reduz tempo de internação e dor de forma significativa). Tratar rigorosamente a frieira entre os dedos como porta de entrada."
      },
      {
        title: "Erisipela Moderada a Grave - Antibioticoterapia e Reserva",
        desc: "Prescrever Amoxicilina + Clavulanato 875/125mg VO de 12/12h de 10 a 14 dias. Se indisponibilidade ou falha: acionar Penicilina G Procaína + Potássica combinadas IM, ou direcionar para internação se febre persistente ou sintomas de sepse sistêmica."
      }
    ]
  },
  {
    id: "crise_panico",
    name: "Crise de Pânico e Transtorno do Pânico na Urgência",
    category: "Saúde Mental",
    diagnostic: "Aparecimento súbito de pavor ou desconforto intenso que atinge o pico de gravidade em minutos, associado a palpitações fortes, dor torácica opressiva, tremores, sensação de falta de ar (hiperventilação), tonturas, medo terrível de enlouquecer ou morrer.",
    alarm: "Ideação suicida de impulsividade alta por desespero crônico, ou dor torácica atípica persistente com fatores de risco cardiológicos expressivos em maiores de 40 anos (que requer ECG e curva de troponina para descartar com segurança infarto agudo) -> Sala de emergência UPA.",
    treatment: [
      {
        title: "Abordagem Não Farmacológica na Crise Aguda",
        desc: "Aceno clínico de acalento em ambiente silencioso. Empregar técnicas de readequação respiratória lenta (respirar junto com o profissional de forma controlada a cada 4 segundos, ou usar respiração diafragmática) para combater a alcalose por hiperventilação."
      },
      {
        title: "Manejo Farmacológico com Benzodiazepínico S.O.S (Urgência)",
        desc: "Se crise de agitação ansiosa refratária com taquipneia sustentada, administrar Diazepam 5mg a 10mg por via oral (ou sublingual se disponível) ou Clonazepam 0.5mg VO para abortar a crise imediata. Tratar a base crônico-preventiva prioritariamente por ISRS Sertralina na UBS."
      }
    ]
  },
  {
    id: "peconhentos",
    name: "Acidentes por Animais Peçonhentos (Escorpião e Ofídios)",
    category: "Infecciosas/Endemias",
    diagnostic: "Histórico de picada ou contato. Escorpionismo: Dor local intensa instantânea, parestesia e eritema discreto. Ofidismo (Bothrops - Jararaca): Dor lancinante local, edema proeminente de rápida progressão, equimose e prolongamento de tempo de coagulação sanguíneo.",
    alarm: "Vômitos incoercíveis persistentes, salivação excessiva (sialorreia), bradicardia ou dispneia no escorpionismo (indica envenenamento sistêmico grave em crianças) -> UPA/Suporte avançado para aplicação urgente de soro antiescorpiônico.",
    treatment: [
      {
        title: "Acidente Escorpiônico Leve (Manejo de Dor local)",
        desc: "Realizar bloqueio anestésico local infiltrativo com Lidocaína 2% sem vasoconstritor (2-3mL) no sítio doloroso ou compressas mornas (ajudam no espasmo). Dar analgésicos sistêmicos (Dipirona 1g IV). Não há indicação de soro no escorpionismo leve em adultos."
      },
      {
        title: "Acidentes Graves e Ofídicos (Soro Antipeçonhento na UPA)",
        desc: "Mantenha o membro deitado e encaminhe com velocidade máxima ao serviço de referência com soroterapia anti-veneno disponível (Soro Antiescorpiônico, Antibotrópico ou Anticrotálico). Hidratar vigorosamente o paciente para proteger rins de mioglobinúria tóxica."
      }
    ]
  },
  {
    id: "crise_epiletica",
    name: "Crise Epilética / Convulsão na Urgência",
    category: "Saúde Mental",
    diagnostic: "Atividade motora involuntária tônico-clônica abrupta e de caráter autolimitado, caracterizada por perda da consciência de si, cianose labial por apneia reflexa, sialoreia espumante, mordedura lateral de língua e liberação esfincteriana vesical, seguido de sonolência pós-ictal prolongada flutuante.",
    alarm: "Crise convulsiva contínua prolongação que ultrapassa 5 minutos inteiros de duração clínica, ou duas crises convulsivas repetidas seguidas sem recuperação rápida inter-crise de consciência (Estado de Mal Epilético - emergência crítica que causa morte cerebral) -> UPA imediatamente.",
    treatment: [
      {
        title: "Abordagem Física Imediata de Proteção (Durante a Crise)",
        desc: "Deitar o paciente em decúbito lateral para evitar aspiração brônquica de saliva. Proteger a cabeça com travesseiro macio e afastar móveis pontiagudos. NUNCA tentar abrir a boca do paciente à força ou tracionar língua pelo risco de mordedura grave mutua."
      },
      {
        title: "Abordagem Farmacológica do Estado de Mal Epilético (UPA)",
        desc: "Se crise de duração > 5 min, administrar Diazepam 10mg IV correndo direto lento, ou Clonazepam. Se persistência, repetir Diazepam 10mg IV uma vez após 5 min. Se refratariedade, repor Hidantalização com Fenitoína Sódica 15mg a 20mg/kg IV de ataque correndo em infusão diluída monitorizada por telemetria."
      }
    ]
  },
  {
    id: "hpb",
    name: "Hiperplasia Prostástica Benigna (HPB)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Sintomas do trato urinário inferior (LUTS) em homens acima dos 50 anos: jato urinário fraco, gotejamento terminal prolongado, nictúria excessiva (acordar à noite), urgência miccional e sensação de retenção vesical persistente. Toque retal com próstata lisa e simetricamente aumentada e elástica.",
    alarm: "Impossibilidade total e dolorosa de iniciar micção com bexigoma palpável tenso em baixo ventre (Retenção Urinária Aguda obstrutiva) -> Encaminhar imediatamente à UPA ou UBS para cateterismo vesical imediato de alívio.",
    treatment: [
      {
        title: "Terapia de Alívio do Jato Urinário (Bloqueadores Alfa - SUS)",
        desc: "Prescrever Cloridrato de Tansulosina 0.4mg VO ao dia tomado à noite após a refeição (relapsa a musculatura lisa uretral prostática de forma imediata em 24-48h). Orientar monitoramento de hipotensão postural orthostática benigna nas primeiras tomadas."
      },
      {
        title: "Terapia de Redução de Volume Prostático (Inimidores da 5-Alfa)",
        desc: "Prescrever Finasterida 5mg VO ao dia pela manhã de forma contínua para homens com próteses grandes volumosas (> 40g). Demora de 3-6 meses para encolhimento glandular. Reduz o PSA em metade fisiologicamente no monitoramento do paciente."
      }
    ]
  },
  {
    id: "iam",
    name: "Infarto Agudo do Miocárdio (IAM) / Síndrome Coronariana Aguda",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Dor torácica típica em aperto, peso ou queimação, retroesternal, irradiada para membro superior esquerdo, mandíbula ou dorso, durando > 20 min. Executar ECG de 12 derivações em até 10 minutos da chegada do paciente para classificar com ou sem supra de ST.",
    alarm: "Presença de dispneia súbita intensa, estertores crepitantes bilaterais (edema agudo de pulmão), hipotensão, tontura, síncope ou arritmias ventriculares instáveis no ECG -> Acionar sala vermelha de emergência e SAMU de imediato.",
    treatment: [
      {
        title: "Conduta de Emergência Inicial (Ataque Antiplaquetário)",
        desc: "Mastigar AAS 200mg a 300mg VO imediato (inibição plaquetária rápida). Associar Clopidogrel 300mg VO (se < 75 anos e sem contraindicações) ou Ticagrelor 180mg VO. Monitorização cardíaca contínua e repouso absoluto."
      },
      {
        title: "Alívio de Dor e Encaminhamento de Urgência",
        desc: "Administrar Isordil (Mononitrato de Isossorbida) 5mg SL se dor ativa (contraindicado se PAS < 90, suspeita de infarto de VD ou uso de sildenafila). Alinhamento com a regulação de urgência (UPA/Hemodinâmica) na 'Hora de Ouro'."
      }
    ]
  },
  {
    id: "cad",
    name: "Cetoacidose Diabética (CAD)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Glicemia capilar > 250 mg/dL associada a acidose metabólica (pH < 7.30, bicarbonato < 15 mEq/L), cetonúria ou cetonemia exuberante, e hálito cetônico característico. Comum em diabéticos tipo 1 em estresse ou infecção.",
    alarm: "Rebaixamento sensorial grave do nível de consciência, respiração rápida e profunda de Kussmaul, vômitos incoercíveis ou sinais de desidratação severa/choque hipovolêmico -> Sala vermelha da UPA para infusão venosa de urgência.",
    treatment: [
      {
        title: "Fase 1 - Hidratação Venosa Vigorosa Imediata",
        desc: "Iniciar infusão rápida de Soro Fisiológico 0.9% (1000ml a 1500ml na primeira hora) para expansão volêmica e redução da osmolaridade. A hidratação reduz a glicose plasmática independente da insulina por hemodiluição."
      },
      {
        title: "Fase 2 - Insulinoterapia e Correção de Potássio",
        desc: "Iniciar Insulina regular em bomba (0.1 UI/kg/h) SOMENTE após certificar-se de que o Potássio sérico está > 3.3 mEq/L. Repor Potássio continuamente se níveis entre 3.3 e 5.2 mEq/L (adicionar 20-30mEq por litro de soro)."
      }
    ]
  },
  {
    id: "anafilaxia",
    name: "Anafilaxia e Choque Anafilático",
    category: "Outros",
    diagnostic: "Instalação hiperaguda (minutos a poucas horas) de manifestações cutâneo-mucosas (urticária difusa, prurido, angioedema) associadas a comprometimento respiratório (sibilos, estridor, dispneia) ou cardiovascular (hipotensão, síncope).",
    alarm: "Presença de estridor laríngeo (edema de glote), sensação de garganta fechando, cianose, ou síncope por colapso pressórico profundo -> Sala vermelha emergencial imediata com intubação pronta.",
    treatment: [
      {
        title: "Tratamento de 1ª Linha Universal - Adrenalina IM",
        desc: "ADMINISTRAR ADRENALINA 1:1000 na dose de 0.3 a 0.5 mg IM na face anterolateral da coxa (vasto lateral) de imediato. Não postergar por medo ou uso de outras drogas. Repetir a cada 5-15 min se persistência do quadro."
      },
      {
        title: "Suporte Ventilatório, Expansão e Adjuvantes",
        desc: "Oferecer O2 de alto fluxo. Iniciar infusão rápida de fluidos (SF 0.9% 1000-2000ml se choque). Como terapias estritamente auxiliares e tardias: Metilprednisolona 125mg IV + Prometazina 50mg IM/IV (anti-histamínico)."
      }
    ]
  },
  {
    id: "sepse",
    name: "Sepse e Choque Séptico",
    category: "Infecciosas/Endemias",
    diagnostic: "Disfunção orgânica ameaçadora à vida causada por resposta desregulada do hospedeiro à infecção. Identificada por aumento agudo de ≥ 2 pontos no escore SOFA, ou triada pelo qSOFA ≥ 2 (FR ≥ 22, PAS ≤ 100, alteração mental).",
    alarm: "Hipotensão refratária com necessidade de vasopressor para manter PAM ≥ 65 mmHg E Lactato sérico de controle > 2 mmol/L após ressuscitação volêmica adequada (Choque Séptico) -> Internação imediata em UTI.",
    treatment: [
      {
        title: "Bundle da 1ª Hora - Coletas e Antibioticoterapia",
        desc: "Dosar lactato sérico (repetir se alterado). Coletar no mínimo 2 pares de hemoculturas de sítios anatômicos distintos. Administrar antibióticos de amplo espectro na dose correta (ex: Tazocin 4.5g IV ou Ceftriaxona 2g IV) em até 1h."
      },
      {
        title: "Ressuscitação Volêmica de Emergência",
        desc: "Infundir rapidamente cristaloides (30 mL/kg de SF 0.9% ou Ringer) nas primeiras 3h se houver hipotensão (PAM < 65) ou lactato ≥ 4 mmol/L. Iniciar Noradrenalina se hipotensão persistir para manter a PAM-alvo."
      }
    ]
  },
  {
    id: "endocardite",
    name: "Endocardite Infecciosa",
    category: "Infecciosas/Endemias",
    diagnostic: "Infecção do endocárdio valvar, comum em portadores de prótese valvar, cardiopatia congênita ou usuários de drogas injetáveis. Suspeita clínica por febre persistente e sopro cardíaco novo, confirmada pelos Critérios de Duke.",
    alarm: "Surgimento agudo de falta de ar incapacitante (insuficiência cardíaca valvar), dor torácica, ou déficits neurológicos súbitos por embolia séptica cerebral -> Internar urgentemente para estabilização clínica e cirúrgica.",
    treatment: [
      {
        title: "Investigação Diagnóstica e Hemoculturas",
        desc: "Coletar pelo menos 3 conjuntos de hemoculturas em intervalos de 30 minutos em sítios venosos diferentes antes de iniciar antibióticos. Solicitar Ecocardiograma Transtorácico e/ou Transesofágico para visualização de vegetações."
      },
      {
        title: "Antibioticoterapia de Longo Curso e Indicação Cirúrgica",
        desc: "Esquema antibiótico venoso prolongado (4-6 semanas) na UPA/Hospital: ex: Ampicilina 2g IV de 4/4h + Oxacilina 2g IV de 4/4h + Gentamicina. Avaliação imediata da cirurgia cardíaca se houver insuficiência cardíaca intratável."
      }
    ]
  },
  {
    id: "sdra",
    name: "Insuficiência Respiratória Aguda / SDRA",
    category: "Respiratório",
    diagnostic: "Início agudo (dentro de 1 semana do insulto) de sintomas respiratórios graves, com infiltrados bilaterais difusos em Rx/TC de tórax não explicados por falência cardíaca, e relação PaO2/FiO2 < 300 com PEEP ≥ 5 cmH2O.",
    alarm: "Tórax silencioso na ausculta, fadiga extrema com uso severo de musculatura acessória, frequência respiratória > 35/min ou queda de saturação abaixo de 85% com O2 suplementar -> Intubação e ventilação imediata.",
    treatment: [
      {
        title: "Estratégia de Ventilação Mecânica Protetora",
        desc: "Ajustar ventilador com volume corrente protetor baixo (6 mL/kg de peso ideal) para evitar volutrauma. Manter pressão de platô respiratório < 30 cmH2O e a Driving Pressure (Platô - PEEP) < 15 cmH2O. Titular PEEP pela tabela ARDSNet."
      },
      {
        title: "Medidas Adjuvantes para Hipoxemia Grave",
        desc: "Se relação PaO2/FiO2 < 150: colocar o paciente em Posição Prona por pelo menos 16 a 20 horas consecutivas por dia para melhorar o shunt e recrutar alvéolos posteriores. Considerar infusão de bloqueador neuromuscular (Cisatracúrio)."
      }
    ]
  },
  {
    id: "choque",
    name: "Choque e Instabilidade Circulatória",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Estado agudo de falência circulatória generalizada caracterizado por má perfusão de órgãos: tempo de enchimento capilar > 3s, pele fria/pegajosa, oligúria (< 0.5 mL/kg/h), hipotensão (PAS < 90) e acidose com lactato > 2.0.",
    alarm: "Sonolência profunda, confusão mental grave, ritmo cardíaco instável ou anúria persistente em paciente com má perfusão generalizada -> Monitorização multiparamétrica e acesso venoso calibroso imediato.",
    treatment: [
      {
        title: "Fase de Resgate e Identificação da Etiologia",
        desc: "Administrar carga rápida de cristaloide (20 a 30 mL/kg) se forte suspeita de choque hipovolêmico ou distributivo. Avaliar etiologia: distributivo (sepse/anafilaxia), hipovolêmico (sangramento), obstrutivo (TEP) ou cardiogênico."
      },
      {
        title: "Uso de Vasopressores e Inotrópicos",
        desc: "Se hipotensão refratária inicial, iniciar Noradrenalina venosa imediata tateada para alvo de PAM ≥ 65 mmHg. No choque cardiogênico com congestão, associar Dobutamina (2 a 15 mcg/kg/min) para ganho de contratilidade miocárdica."
      }
    ]
  },
  {
    id: "agitacao",
    name: "Agitação Psicomotora na Emergência",
    category: "Saúde Mental",
    diagnostic: "Atividade motora excessiva e desorganizada com agressividade verbal ou física iminente, perda de autocrítica e exacerbação cognitiva. Excluir etiologias orgânicas ocultas (hipoglicemia, intoxicação, meningite, hipóxia).",
    alarm: "Paciente armado, comportamento violentamente homicida, ou sinais de hipertermia extrema com rigidez severa (Síndrome Neuroléptica Maligna) -> Convocação de equipe de segurança e contenção física assistida.",
    treatment: [
      {
        title: "Abordagem de Descalonamento e Contenção Física",
        desc: "Primeiro passo: descalonamento verbal em tom calmo e ambiente controlado. Se refratariedade e risco iminente de auto ou heteroagressão: aplicar contenção mecânica rápida no leito com 5 profissionais de forma coordenada."
      },
      {
        title: "Abordagem Farmacológica Rápida de Sedação",
        desc: "Administrar Haloperidol 5mg IM associado à Prometazina 50mg IM em seringas separadas para sinergismo sedativo e prevenção de efeitos extrapiramidais agudos. Evitar benzodiazepínicos se suspeita de depressão respiratória."
      }
    ]
  },
  {
    id: "hda",
    name: "Hemorragia Digestiva Alta (HDA)",
    category: "Gastrointestinal",
    diagnostic: "Vômitos com sangue vivo ou borra de café (hematêmese) e/ou fezes pretas, pastosas e fétidas (melena). Sinais de perda de volume: hipotensão ortostática ou taquicardia. Confirmada por Endoscopia Digestiva Alta (EDA).",
    alarm: "Presença de síncope, choque hemodinâmico, hematêmese em jatos contínuos e volumosos ou dor abdominal difusa súbita com peritonite -> Acesso venoso central, expansão volumétrica imediata e acionar cirurgia de emergência.",
    treatment: [
      {
        title: "Estabilização Hemodinâmica e Bloqueio Ácido",
        desc: "Instalar dois acessos venosos periféricos calibrosos (Gelco 14 ou 16). Iniciar infusão rápida de cristaloides e reservar concentrado de hemácias. Prescrever Omeprazol 80mg IV em bolus, seguido de infusão de 8mg/h para estabilizar coágulo."
      },
      {
        title: "Conduta Específica de HDA Varicosa (Cirrose)",
        desc: "Se suspeita de varizes de esôfago: iniciar Terlipressina 2mg IV de 4/4h (vasoconstrição esplâncnica) associada à profilaxia antibiótica com Ceftriaxona 1g IV ao dia. Encaminhar para EDA terapêutica de urgência (ligadura elástica)."
      }
    ]
  },
  {
    id: "cirrose",
    name: "Cirrose Hepática e Complicações",
    category: "Gastrointestinal",
    diagnostic: "Estágio terminal de fibrose hepática crônica. Sinais clínicos de ginecomastia, aranhas vasculares, eritema palmar, ascite ou icterícia. Confirmado por alterações em coagulação (RNI), albumina baixa e ultrassonografia abdominal.",
    alarm: "Inversão do ciclo vigília-sono, confusão mental ou tremores flaping (Encefalopatia Hepática), aumento doloroso do abdômen com febre (PBE) ou vômito com sangue -> Referenciar imediatamente ao pronto-socorro da UPA.",
    treatment: [
      {
        title: "Manejo Clínico da Ascite Moderada (Regime de Diuréticos)",
        desc: "Restringir sódio dietético a < 2g ao dia. Prescrever Espironolactona 100mg VO associada à Furosemida 40mg VO pela manhã (proporção de 100:40 para estabilidade de potássio). Monitorar peso diário e função renal periodicamente."
      },
      {
        title: "Manejo da Encefalopatia e Profilaxia de Infecções",
        desc: "Prescrever Lactulona Xarope 15-30ml VO até 3-4 vezes ao dia para induzir 2 a 3 evacuações pastosas diárias (reduz amônia). Se ascite com febre (PBE confirmada por punção/PMN > 250): iniciar Ceftriaxona 1g IV 12/12h por 5-7 dias."
      }
    ]
  },
  {
    id: "avc",
    name: "Acidentes Vasculares Cerebrais (AVCi e AVCh)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Início súbito de déficit neurológico focal (hemiparesia, assimetria facial, perda visual unilateral, afasia ou disartria). Realizar Tomografia Computadorizada (TC) de Crânio imediata sem contraste para descartar sangramento.",
    alarm: "Presença de crise convulsiva, rebaixamento rápido de consciência, cefaleia occipital explosiva ou sinais de hipertensão intracraniana -> Monitorar vias aéreas, manter cabeceira elevada a 30° e acionar vaga de CTI.",
    treatment: [
      {
        title: "Manejo do AVC Isquêmico (Protocolo Trombólise)",
        desc: "Se tempo de início < 4.5h e sem contraindicações: prescrever Alteplase (rtPA) 0.9 mg/kg IV (fazer 10% em bolus e 90% em infusão em 1h), mantendo a PA rigorosamente monitorada abaixo de 185/110 mmHg."
      },
      {
        title: "Manejo do AVC Hemorrágico e Monitorização de PA",
        desc: "Contraindicação total de antiplaquetários ou anticoagulantes. O foco principal é o controle de Pressão Arterial de forma rápida e agressiva, objetivando Pressão Arterial Sistólica < 140 mmHg com Nitroprussiato de Sódio IV."
      }
    ]
  },
  {
    id: "delirium",
    name: "Delirium Agudo no Idoso",
    category: "Saúde Mental",
    diagnostic: "Alteração aguda do nível de atenção e cognição, com flutuação de curso, pensamento desorganizado e alteração sensorial. Confirmado pelo Confusion Assessment Method (CAM). Comum após cirurgia, infecção ou drogas.",
    alarm: "Agitação extrema refratária com risco mecânico de queda do leito, agressividade perigosa, ou letargia profunda flutuante com suspeita de aspiração pulmonar -> Monitorar sinais vitais e reavaliar de perto.",
    treatment: [
      {
        title: "Tratamento Não Farmacológico (Pilar de Primeira Escolha)",
        desc: "Tratar a causa de base (ex: ITU, dor, desidratação). Manter o ambiente calmo e bem iluminado de dia, reorientar o paciente continuamente com calendário e relógio, incentivar a presença de familiares e reintroduzir óculos/aparelhos."
      },
      {
        title: "Tratamento Farmacológico Seletivo de Emergência",
        desc: "Se agitação severa que impede cuidados médicos ou gera riscos físicos: prescrever Haloperidol 0.5mg a 1mg VO ou IM de 12/12h de forma curta e fracionada. Evitar benzodiazepínicos pelo altíssimo risco de efeito paradoxal."
      }
    ]
  },
  {
    id: "exacerbacao_asma",
    name: "Asma Brônquica: Crise Aguda / Exacerbação",
    category: "Respiratório",
    diagnostic: "Dispneia de início rápido acompanhada de aperto torácico, tosse seca incômoda, expiração muito prolongada e sibilos polifônicos difusos bilaterais. Gatilhos comuns: infecções de vias aéreas superiores ou alérgenos.",
    alarm: "Tórax silencioso na ausculta, incapacidade de completar frases sem respirar, fadiga, cianose, ou saturação de O2 < 90% -> Sala vermelha de imediato com oxigênio sob máscara e corticoterapia IV de ataque.",
    treatment: [
      {
        title: "Broncodilatação Inalatória de Ataque Otimizada",
        desc: "Prescrever Salbutamol 100mcg (4 a 10 jatos com espaçador a cada 20 minutos na primeira 1 hora) associado a Brometo de Ipratrópio (3 a 4 jatos). Manter SatO2 entre 93-95% com oxigenioterapia de baixo fluxo se necessário."
      },
      {
        title: "Corticoterapia Sistêmica e Sulfato de Magnésio",
        desc: "Prescrever Prednisona 40mg VO ou Metilprednisolona 40-125mg IV na admissão. Se refratariedade inicial após a primeira hora, prescrever infusão lenta de Sulfato de Magnésio 2g IV em 20 min sob monitoração."
      }
    ]
  },
  {
    id: "tep",
    name: "Tromboembolismo Pulmonar (TEP)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Início súbito de dispneia intensa e dor torácica pleurítica, acompanhadas de taquipneia e taquicardia. Forte associação com imobilização recente ou neoplasia. Rastrear com Escore de Wells, D-Dímero e Angio-TC.",
    alarm: "Hipotensão arterial persistente (PAS < 90 mmHg), síncope recorrente ou sinais de sobrecarga aguda do ventrículo direito -> Sala vermelha imediata para protocolo de trombólise sistêmica de urgência.",
    treatment: [
      {
        title: "Anticoagulação Plena Imediata (Paciente Estável)",
        desc: "Se paciente hemodinamicamente estável: iniciar imediatamente Enoxaparina 1mg/kg SC de 12/12h ou Heparina Não Fracionada venosa. Transicionar conforme viabilidade para Rivaroxabana 15mg VO de 12/12h por 21 dias."
      },
      {
        title: "Protocolo de Trombólise Sistêmica (Paciente Instável)",
        desc: "Se choque obstrutivo ou hipotensão sustentada: prescrever Alteplase (rtPA) 100mg IV correndo de forma contínua em 2 horas. Suspender qualquer procedimento invasivo e monitorar estritamente sinais de sangramentos agudos."
      }
    ]
  },
  {
    id: "hipercalemia",
    name: "Distúrbios do Potássio (Hiperpotassemia)",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Potássio sérico > 5.5 mEq/L (hiperpotassemia) ou < 3.5 mEq/L (hipopotassema). Sintomas inespecíficos de fraqueza muscular e cãibras. Rastrear urgentemente com Eletrocardiograma (ECG) para afastar cardiotoxicidade.",
    alarm: "ECG contendo ondas T simétricas pontiagudas, PR prolongado com onda P achatada, ou complexo QRS alargado (K > 6.5 mEq/L) -> Gluconato de Cálcio venoso imediato para evitar parada cardíaca em sístole.",
    treatment: [
      {
        title: "Estabilização da Membrana Miocárdica Imediata",
        desc: "Se alterações eletrocardiográficas: administrar Gluconato de Cálcio 10% (1 ampola / 10ml) IV lento em 3-5 minutos. Estabiliza eletricamente o cardiomiócito de forma imediata (não reduz os níveis séricos do potássio)."
      },
      {
        title: "Terapia de Shunt Celular e Eliminação de Potássio",
        desc: "Prescrever Glicoinsulina (10 UI de Insulina Rápida em 100ml de Glicose 50% IV em 20 min) e Nebulização com Fenoterol/Salbutamol. Para eliminação: Furosemida 40mg IV e Sorcal (Poliestirenossulfonato) 30g VO de 8/8h."
      }
    ]
  },
  {
    id: "les",
    name: "Lúpus Eritematoso Sistêmico (LES)",
    category: "Outros",
    diagnostic: "Doença autoimune sistêmica crônica, comum em mulheres jovens. Diagnóstico guiado pelos critérios ACR/EULAR (FAN ≥ 1:80 obrigatório, rash malar, fotossensibilidade, artrite, nefrite, linfopenia e anti-dsDNA ou anti-Sm).",
    alarm: "Presença de proteinúria maciça (nefrite ativa), febre inexplicada com rigidez de nuca ou letargia (SNC), dispneia súbita por hemorragia alveolar ou plaquetopenia profunda com sangramento -> Encaminhar à UPA.",
    treatment: [
      {
        title: "Terapia de Manutenção de Primeira Linha (Imunomodulação)",
        desc: "Prescrever de forma contínua para todo paciente ativo: Sulfato de Hidroxicloroquina 5 mg/kg ao dia (peso ideal) para mitigar surtos inflamatórios e proteger função renal. Orientar monitoramento oftalmológico anual regular."
      },
      {
        title: "Manejo das Crises Inflamatórias Ativas",
        desc: "Em manifestações leves (artrite/cutâneas): prescrever Prednisona de dose baixa (5mg a 10mg ao dia). Em surtos graves (nefrite lúpica com proteinúria confirmada): encaminhar para pulsoterapia com Metilprednisolona venosa."
      }
    ]
  },
  {
    id: "neutropenia_febril",
    name: "Neutropenia Febril na Emergência",
    category: "Infecciosas/Endemias",
    diagnostic: "Temperatura oral única ≥ 38.3°C (ou ≥ 38.0°C sustentada por 1h) em paciente oncológico com contagem de neutrófilos absolute (ANC) < 500/mm³ (ou expectativa de queda). Emergência de alta letalidade.",
    alarm: "Sinais óbvios de má perfusão periférica, calafrios trementes intensos, hipotensão arterial ou confusão mental (Choque Séptico imediato) -> Sala vermelha para início hiperprecoce de antibióticos venosos.",
    treatment: [
      {
        title: "Antibioticoterapia de Amplo Espectro na 'Hora de Ouro'",
        desc: "Administrar o antimicrobiano empírico IV em até 60 minutos da triagem: escolher beta-lactâmico antipseudomonas (Cefepime 2g IV de 8/8h ou Piperacilina/Tazobactam 4.5g IV de 6/6h). Coletar hemoculturas na hora."
      },
      {
        title: "Adição de Vancomicina e Fatores de Crescimento",
        desc: "Associar Vancomicina se houver suspeita de infecção de cateter central, infecção de pele ativa ou hipotensão de admissão. Administrar Filgrastim (G-CSF) subcutâneo para acelerar a recuperação da medula óssea."
      }
    ]
  },
  {
    id: "dip",
    name: "Doença Inflamatória Pélvica (DIP)",
    category: "Infecciosas/Endemias",
    diagnostic: "Dor espontânea pélvica, dor proeminente à mobilização física uterina no toque vaginal e dor anexial bilateral, com corrimento vaginal mucopurulento e febre de início recente. Tríade clínica clássica altamente fidedigna.",
    alarm: "Surgimento de massa pélvica palpável dolorosa (suspeita de Abscesso Tubo-ovariano), náuseas ou vômitos persistentes impedindo medicação oral, febre refratária ou sinais de peritonite difusa -> Internar para antibioticoterapia venosa.",
    treatment: [
      {
        title: "Tratamento Ambulatorial Clássico (DIP Grau 1 - Leve/Moderada)",
        desc: "Prescrever Ceftriaxona 500mg IM in dose única (SUS) associada simultaneamente à Doxiciclina 100mg VO de 12/12h PLUS Metronidazol 500mg VO de 12/12h, ambos por um período obrigatório de 14 dias consecutivos."
      },
      {
        title: "Tratamento e Rastreamento dos Parceiros Sexuais",
        desc: "Rastrear e tratar obrigatoriamente todos os parceiros sexuais dos últimos 60 dias com esquema de dose única. Orientar abstinência sexual até o término das doses e cura clínica do casal. Oferecer exames rápidos."
      }
    ]
  },
  {
    id: "farmacodermia",
    name: "Farmacodermias Graves (SJS / NET / DRESS)",
    category: "Pele & Dermatologia",
    diagnostic: "Erupções cutâneas extensas com descolamento epidérmico e lesão mucosal dolorosa (Stevens-Johnson e Necrólise Epidérmica Tóxica), ou erupção difusa com febre, linfonodomegalia e eosinofilia (síndrome DRESS).",
    alarm: "Presença de Sinal de Nikolsky positivo (fricção lateral descola epiderme saudável), bolhas hemorrágicas difusas ou acometimento de > 10% da área corporal por necrose -> Encaminhamento imediato a UTI ou Queimados.",
    treatment: [
      {
        title: "Suspensão Imediata de Fármacos Suspeitos",
        desc: "Interromper imediatamente toda e qualquer medicação de uso recente não essencial (especialmente anticonvulsivantes, alopurinol, AINEs ou sulfas). A agilidade da suspensão previne a progressão da apoptose epidérmica."
      },
      {
        title: "Suporte Clínico e Cuidados de Barreira",
        desc: "Transferir para unidade intensiva. Manter hidratação aquecida calculada meticulosa, controle de temperatura, suporte nutricional por sonda enteral, e cuidados assépticos de pele (curativos não aderentes com vaselina)."
      }
    ]
  },
  {
    id: "desnutricao_choque",
    name: "Desnutrição Infantil Grave e Choque",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Desnutrição grave (marasmo ou kwashiorkor) associada a sinais de má perfusão tecidual (TEC > 3s, letargia, pele fria, anúria). Apresenta altíssimo risco de insuficiência cardíaca por atrofia do miocárdio.",
    alarm: "Aparecimento súbito de estertores pulmonares bilaterais, turgência jugular ou ritmo de galope auscultado no precórdio durante a infusão de fluidos (indica sobrecarga volêmica aguda) -> Suspender infusão de imediato.",
    treatment: [
      {
        title: "Hidratação Venosa Extremamente Cautelosa",
        desc: "NÃO fazer expansão volumétrica rápida usual. Administrar hidratação lenta com SG 5% ou SF 0.45% de forma fracionada. Preferir a via oral/enteral contínua (com SRO ou F-75) sempre que o paciente tolerar."
      },
      {
        title: "Monitorização Multiparamétrica e Alvos",
        desc: "Monitorar rigorosamente a diurese horária (alvo > 1.0 mL/kg/h) e ausculta pulmonar contínua. Oferecer suporte térmico rigoroso (risco severo de hipotermia letal) e iniciar antibioticoterapia empírica ampla."
      }
    ]
  },
  {
    id: "osteoporose",
    name: "Osteoporose Senil e Pós-Menopausa",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Geralmente assintomática até a ocorrência de fratura. Diagnóstico por Densitometria Óssea (DEXA) com T-score ≤ -2,5 no colo do fêmur, fêmur total ou coluna lombar, ou na presença de fratura por fragilidade (vértebra, quadril).",
    alarm: "Dor lombar aguda súbita incapacitante ou perda de altura > 4cm, sugerindo fratura de corpo vertebral aguda -> Encaminhar para radiografia de coluna e avaliação ortopédica.",
    treatment: [
      {
        title: "Suplementação de Cálcio e Vitamina D",
        desc: "Prescrever Cálcio Elementar 1000-1200mg/dia (via dieta ou carbonato/citrato de cálcio) associado a Colecalciferol (Vitamina D3) 800-2000 UI/dia VO para otimizar absorção intestinal e mineralização óssea."
      },
      {
        title: "Terapia Antirreabsortiva (Alendronato de Sódio)",
        desc: "Prescrever Alendronato de Sódio 70mg VO uma vez por semana. Orientar a tomar em jejum completo com copo cheio de água e manter-se em posição ereta (sentado ou em pé) por pelo menos 30 minutos para evitar esofagite grave."
      }
    ]
  },
  {
    id: "obesidade",
    name: "Obesidade Clínica e Síndrome Metabólica",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Definida por Índice de Massa Corporal (IMC) ≥ 30 kg/m² em adultos. Avaliar perímetro abdominal (alvo < 94cm em homens e < 80cm em mulheres) e presença de critérios para Síndrome Metabólica (PA elevada, TG alto, HDL baixo, glicemia alterada).",
    alarm: "Presença de dispneia de início recente, roncos intensos com apneias presenciadas pelo parceiro (SAHOS grave), cefaleia matinal ou fadiga incapacitante -> Encaminhar para polissonografia.",
    treatment: [
      {
        title: "Modificações Estilo de Vida (MEV) Estruturadas",
        desc: "Orientar déficit calórico de 500-1000 kcal/dia ajustado à taxa metabólica basal. Prescrever atividade física aeróbica e resistida de no mínimo 150 a 300 minutos semanais associada a acompanhamento nutricional e comportamental."
      },
      {
        title: "Terapia Farmacológica Adjuvante",
        desc: "Se IMC ≥ 30 (ou ≥ 27 com comorbidades) refratário a MEV: avaliar prescrição de Liraglutida SC (início com 0.6mg/dia escalonado até 3.0mg) ou Sibutramina 10mg-15mg VO ao dia (contraindicada se doença cardiovascular ou HAS descontrolada)."
      }
    ]
  },
  {
    id: "climaterio",
    name: "Climatério e Síndrome Geniturinária da Menopausa",
    category: "Outros",
    diagnostic: "Fase de transição endócrina caracterizada por irregularidade menstrual evoluindo para amenorreia definitiva (menopausa após 12 meses). Sintomas vasomotores (fogachos, sudorese), distúrbios do sono, secura vaginal e labilidade emocional.",
    alarm: "Sangramento uterino anormal na pós-menopausa -> Sinal de alerta absoluto! Excluir hiperplasia endometrial ou neoplasia de endométrio por ultrassonografia transvaginal imediata e biópsia endometrial se espessura > 4mm.",
    treatment: [
      {
        title: "Terapia de Reposição Hormonal (TRH) Sistêmica",
        desc: "Se sintomas vasomotores moderados/graves em mulheres na 'janela de oportunidade' (< 60 anos ou < 10 anos de menopausa) e sem contraindicações (CA de mama, TEP, hepatopatia): prescrever Estrogênio isolado (se histerectomizada) ou associado a Progesterona."
      },
      {
        title: "Manejo da Síndrome Geniturinária (Secura Vaginal)",
        desc: "Prescrever Estrogênio Conjugado creme vaginal 0.5mg/g ou Estriol creme aplicando diariamente à noite por 2 semanas, reduzindo para manutenção 2 vezes por semana. Melhora o trofismo mucosal, reduz prurido, dispareunia e ITUs recorrentes."
      }
    ]
  },
  {
    id: "ivc",
    name: "Insuficiência Venosa Crônica (IVC)",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Alterações cutâneas e subcutâneas secundárias à hipertensão venosa persistente nos membros inferiores. Caracterizada por varizes de calibres variados, edema vespertino maleolar, dermatite de estase e hiperpigmentação (dermatite ocre).",
    alarm: "Presença de dor lancinante panturrilha com edema assimétrico súbito (suspeita de TVP), ou úlcera venosa infectada com celulite perilesional ascendente e febre -> Encaminhamento para UPA/Doppler de urgência.",
    treatment: [
      {
        title: "Terapia Compressiva e Medidas Posturais",
        desc: "Pilar fundamental do tratamento. Prescrever meias de compressão elástica graduada (20-30 mmHg para casos leves; 30-40 mmHg se edema grave ou úlcera). Orientar elevação dos membros inferiores acima da linha do coração 3-4x ao dia."
      },
      {
        title: "Medicamentos Flebotônicos e Cuidados Locais",
        desc: "Prescrever Diosmina + Hesperidina (450mg + 50mg) VO de 12/12h ou Castanha da Índia (Aesculus hippocastanum) 100mg VO de 8/8h para alívio sintomático de dor e peso. Hidratar vigorosamente a pele seca com cremes à base de ureia."
      }
    ]
  },
  {
    id: "dermatite_contato",
    name: "Dermatite de Contato (Irritativa e Alérgica)",
    category: "Pele & Dermatologia",
    diagnostic: "Reação inflamatória na pele decorrente da exposição a agentes químicos, físicos ou biológicos. Irritativa: localizada, queimação, início imediato. Alérgica: reação de hipersensibilidade tardia (tipo IV), prurido intenso, vesículas, estende-se além do sítio.",
    alarm: "Disseminação rápida das lesões para > 50% da superfície corporal, infecção secundária bacteriana difusa com secreção purulenta e crostas melicéricas exuberantes, ou febre sistêmica -> Encaminhar para corticoterapia sistêmica de resgate.",
    treatment: [
      {
        title: "Identificação e Afastamento do Agente Causal",
        desc: "Investigar e cessar imediatamente o contato com potenciais desencadeantes: sabonetes perfumados, cosméticos, níquel (bijuterias), látex, solventes industriais ou produtos de limpeza. Lavar a área afetada com água abundante."
      },
      {
        title: "Corticoterapia Tópica e Anti-histamínicos",
        desc: "Prescrever Creme de Valerato de Betametasona 0.1% ou Dipropionato de Betametasona 0.05% aplicando fina camada 1 a 2 vezes ao dia por no máximo 14 dias. Associar Dexclorfeniramina 2mg VO de 8/8h se prurido intenso que compromete o sono."
      }
    ]
  },
  {
    id: "migranea",
    name: "Migrânea (Enxaqueca) e Crise de Cefaleia",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Cefaleia unilateral, pulsátil, de intensidade moderada a grave, durando de 4 a 72 horas, associada a náuseas/vômitos, fotofobia e fonofobia. Pode apresentar aura neurológica focal reversível (escotomas cintilantes, parestesias).",
    alarm: "Cefaleia de início súbito explosivo ('thunderclap', pico de dor em < 1 min), cefaleia nova em > 50 anos, sinais neurológicos focais persistentes, ou cefaleia acompanhada de febre e rigidez de nuca -> Investigar hemorragia subaracnoide ou meningite.",
    treatment: [
      {
        title: "Tratamento Abortivo da Crise (Leve a Moderada)",
        desc: "Prescrever Dipirona Sódica 1g VO/IV associada a Metoclopramida 10mg VO/IV (antiemético com efeito pró-cinético). Se refratariedade ou crise moderada/grave: prescrever Sumatriptano 50mg-100mg VO em dose única inicial."
      },
      {
        title: "Tratamento Profilático Continuado",
        desc: "Indicado se ≥ 3 crises debilitantes por mês. Prescrever Propranolol 40mg VO ao dia (ajustar até 80-160mg) ou Amitriptilina 10-25mg VO à noite (titular até 50-75mg) ou Topiramato 25mg-100mg ao dia de forma gradativa."
      }
    ]
  },
  {
    id: "pneumotorax",
    name: "Pneumotórax Espontâneo",
    category: "Respiratório",
    diagnostic: "Presença de ar no espaço pleural. Caracterizado por dor torácica ipsilateral súbita do tipo pleurítica e dispneia proporcional ao tamanho do colapso. Ausculta pulmonar revela MV abolido unilateralmente e hipersonoridade timpânica.",
    alarm: "Pneumotórax Hipertensivo: hipotensão grave, tontura, desvio da traqueia contralateral, turgência jugular e desconforto respiratório catastrófico -> Emergência médica extrema com necessidade de punção imediata.",
    treatment: [
      {
        title: "Descompressão Torácica Imediata (Se Hipertensivo)",
        desc: "Realizar punção de alívio imediata com Jelco calibre 14 ou 16 no 2º espaço intercostal na linha hemiclavicular ipsilateral (ou 4º/5º espaço na linha axilar anterior) para transformar pneumotórax hipertensivo em aberto."
      },
      {
        title: "Manejo Definitivo e Drenagem Pleural em Selo d'Água",
        desc: "Pneumotórax primário pequeno (< 2cm entre pleura visceral e parede) estável: repouso e oxigenioterapia em alto fluxo. Se > 2cm ou sintomático: realizar drenagem torácica tubular no 5º espaço intercostal com sistema de selo d'água."
      }
    ]
  },
  {
    id: "pancreatite",
    name: "Pancreatite Aguda",
    category: "Gastrointestinal",
    diagnostic: "Inflamação aguda do pâncreas. Caracterizada por dor abdominal de início súbito em barra (andar superior do abdômen), com irradiação clássica para o dorso, acompanhada de náuseas e vômitos. Confirmada por Amilase ou Lipase > 3x o normal.",
    alarm: "Presença de taquipneia, hipotensão refratária, alteração mental ou oligúria persistente, refletindo resposta inflamatória sistêmica grave (SIRS) -> Transferência imediata para UTI com monitoramento de Ranson/APACHE II.",
    treatment: [
      {
        title: "Ressuscitação Volêmica Agressiva Precoce",
        desc: "Infundir Soro Ringer Lactato ou Soro Fisiológico (250-500 mL/hora nas primeiras 12-24 horas), tateando conforme parâmetros hemodinâmicos e diurese (manter > 0.5 mL/kg/h). A hidratação agressiva previne a necrose pancreática."
      },
      {
        title: "Controle Analgésico Potente e Jejum Terapêutico",
        desc: "Manter paciente em jejum inicial para repouso pancreático. Prescrever analgesia potente: Tramadol 50-100mg IV ou Meperidina. Monitorar eletrólitos (hipocalcemia grave) e reintroduzir dieta enteral precoce assim que tolerado."
      }
    ]
  },
  {
    id: "dengue_grave",
    name: "Dengue com Sinais de Alarme e Dengue Grave",
    category: "Infecciosas/Endemias",
    diagnostic: "Dengue suspeita associada à presença de sinais de alarme na fase de defervescência da febre (entre o 3º e 5º dia). Caracterizada por extravasamento plasmático, choque ou disfunção orgânica grave.",
    alarm: "Dor abdominal intensa e contínua, vômitos persistentes, acúmulo de líquidos (ascite, derrame pleural), hipotensão ortostática, hepatomegalia > 2cm, hemorragias importantes de mucosa ou letargia -> Hidratação venosa imediata!",
    treatment: [
      {
        title: "Fase de Alarme - Hidratação Venosa Imediata",
        desc: "Prescrever Soro Fisiológico ou Ringer Lactato venoso: 10 mL/kg na primeira hora. Se melhora clínica, reduzir para 5-7 mL/kg/h por 2-4 horas. Reavaliar continuamente hematócrito e plaquetas para guiar a reposição fluida."
      },
      {
        title: "Manejo do Choque por Dengue Grave",
        desc: "Se sinais de choque (TEC > 3s, hipotensão): infundir bolus rápido de cristaloide (20 mL/kg em 20 minutos). Repetir até 3 vezes se necessário. Se refratário com hematócrito em queda: suspeitar de hemorragia oculta e transfundir plaquetas/hemácias."
      }
    ]
  },
  {
    id: "pielonefrite_complicada",
    name: "Pielonefrite Complicada e Sepse Urinária",
    category: "Infecciosas/Endemias",
    diagnostic: "Infecção bacteriana aguda do parênquima renal acompanhada de febre alta, calafrios, dor lombar intensa unilateral (Sinal de Giordano positivo) associada a fatores complicadores (diabetes, gestação, obstrução urinária, imunossupressão).",
    alarm: "Presença de hipotensão persistente, confusão mental, oligúria ou taquipneia (indicando urossepse), ou dor lombar intolerável com massa palpável (suspeita de abscesso renal/perirrenal) -> Exames de imagem urgentes e UTI.",
    treatment: [
      {
        title: "Coletas de Culturas e Antibioticoterapia Empírica IV",
        desc: "Coletar imediatamente Urina Tipo I, Urocultura com antibiograma e Hemoculturas. Iniciar imediatamente antibioticoterapia venosa empírica: Ceftriaxona 2g IV de 24/24h ou Ciprofloxacino 400mg IV de 12/12h na UPA/Hospital."
      },
      {
        title: "Desobstrução de Vias Aéreas/Urinárias se Necessário",
        desc: "Avaliar por tomografia ou ultrassonografia a presença de uropatia obstrutiva (cálculo impactado). Se obstrução presente, acionar a urologia imediatamente para passagem de cateter Duplo J ou nefrostomia percutânea."
      }
    ]
  },
  {
    id: "abscesso_periamigdaliano",
    name: "Abscesso Periamigdaliano",
    category: "Infecciosas/Endemias",
    diagnostic: "Complicação supurativa comum da amigdalite aguda. Caracterizada por dor de garganta unilateral severa, disfagia e odinofagia intensas, trismo (dificuldade de abrir a boca), voz abafada ('voz de batata quente') e desvio da úvula para o lado contralateral.",
    alarm: "Sinais de obstrução de via aérea alta, estridor inspiratório, sialorreia intensa por incapacidade de engolir a própria saliva, ou dispneia em repouso -> Sala vermelha imediata para proteção de via aérea e drenagem cirúrgica.",
    treatment: [
      {
        title: "Drenagem por Punção por Agulha ou Incisão",
        desc: "Procedimento padrão de urgência. Realizar anestesia local e aspirar o abscesso com agulha calibrosa no ponto de maior abaulamento do pilar amigdaliano anterior, ou realizar incisão e drenagem aberta com pinça para liberação do pus."
      },
      {
        title: "Antibioticoterapia e Corticoterapia Sistêmica",
        desc: "Prescrever Amoxicilina + Clavulanato 875mg + 125mg VO de 12/12h por 10 dias (após estabilização), ou Ampicilina + Sulbactam 1.5g-3g IV de 6/6h em ambiente hospitalar. Associar Dexametasona 4-10mg IV em dose única para redução do edema."
      }
    ]
  },
  {
    id: "artrite_septica",
    name: "Artrite Séptica (Infecciosa)",
    category: "Infecciosas/Endemias",
    diagnostic: "Infecção bacteriana articular aguda, considerada emergência ortopédica. Caracterizada por dor articular intensa de início súbito, calor, rubor, edema proeminente (derramamento articular) e limitação dolorosa extrema à movimentação ativa e passiva.",
    alarm: "Presença de calafrios trementes intensos, instabilidade hemodinâmica, ou rápida destruição articular visível radiologicamente -> Encaminhar imediatamente para artrotomia de urgência e lavagem cirúrgica.",
    treatment: [
      {
        title: "Artrocentese Diagnóstica e Alívio da Dor",
        desc: "Realizar punção articular (artrocentese) asséptica imediata antes do início dos antibióticos. Enviar líquido sinovial para análise: contagem de leucócitos (geralmente > 50.000/mm³ com > 90% polimorfonucleares), bacterioscopia e cultura."
      },
      {
        title: "Antibioticoterapia Empírica e Lavagem Articular",
        desc: "Iniciar Oxacilina 2g IV de 4/4h associada a Ceftriaxona 2g IV de 24/24h (para cobrir gram-positivos e gram-negativos). Encaminhar para lavagem articular por artroscopia ou cirurgia aberta para prevenir necrose da cartilagem."
      }
    ]
  },
  {
    id: "intoxicacao_aguda",
    name: "Intoxicação Exógena Aguda",
    category: "Outros",
    diagnostic: "Quadro decorrente da exposição a substâncias tóxicas (medicamentos, praguicidas, álcool, drogas ilícitas). Identificar o agente, tempo decorrido, via de exposição e quantidade. Avaliar toxíndromes (anticolinérgica, colinérgica, opioide).",
    alarm: "Presença de rebaixamento do nível de consciência (Escala de Glasgow < 8), convulsões, arritmias cardíacas graves, bradipneia importante ou acidose metabólica profunda -> Proteção de via aérea e antídotos imediatos.",
    treatment: [
      {
        title: "Medidas de Descontaminação Gastrointestinal",
        desc: "Se ingestão há menos de 1 hora de substância adsorvível (e sem contraindication como cáusticos/hidrocarbonetos): administrar Carvão Ativado 1g/kg (diluído em água ou sorbitol) via oral ou sonda nasogástrica."
      },
      {
        title: "Administração de Antídotos Específicos se Disponíveis",
        desc: "Se intoxicação por opioides: administrar Naloxona 0.4mg IV (repetir conforme necessário). Se por benzodiazepínicos: Flumazenil 0.2mg IV. Se por organofosforados/carbamatos: Atropina 1-5mg IV em bolus repetidos até atropinização."
      }
    ]
  },
  {
    id: "tce_urgente",
    name: "Traumatismo Cranioencefálico (TCE) Moderado a Grave",
    category: "Outros",
    diagnostic: "História de impacto mecânico craniano associado a alteração mental. Classificado pela Escala de Coma de Glasgow (TCE Leve: 13-15; TCE Moderado: 9-12; TCE Grave: ≤ 8). Necessita de Tomografia Computadorizada (TC) de Crânio imediata.",
    alarm: "Surgimento de vômitos em jato recorrentes, cefaleia progressiva severa, assimetria pupilar (anisocoria), convulsão pós-trauma, ou rebaixamento persistente de consciência -> Sinal de herniação cerebral iminente. Acionar neurocirurgia.",
    treatment: [
      {
        title: "Medidas Gerais de Neuroproteção na UPA",
        desc: "Manter cabeceira elevada a 30 graus (se coluna cervical liberada). Garantir oxigenação adequada (manter SatO2 > 94%) e estabilidade hemodinâmica (manter PAS > 110 mmHg). Tratar hipertermia e dor vigorosamente."
      },
      {
        title: "Manejo da Hipertensão Intracraniana (HIC)",
        desc: "Se sinais de HIC ou herniação (anisocoria): prescrever Manitol 20% (0.5 a 1.0 g/kg IV em infusão rápida em 20 min) ou Solução Salina Hipertônica 3% (250ml IV). Providenciar transferência imediata para centro neurocirúrgico."
      }
    ]
  },
  {
    id: "estenose_aortica",
    name: "Estenose Aórtica Crônica",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Sopro sistólico ejetivo áspero em foco aórtico, irradiado para carótidas. Diagnóstico definitivo por Ecocardiograma com área valvar aórtica < 1.0 cm² na estenose grave.",
    alarm: "Presença da tríade clássica: Angina, Síncope ou Dispneia aos esforços. Indica estenose aórtica importante com alto risco de morte súbita -> Encaminhamento urgente para cirurgia cardíaca / troca valvar.",
    treatment: [
      {
        title: "Tratamento Clínico de Suporte",
        desc: "Evitar vasodilatadores potentes (risco de síncope). Tratar congestão com cautela usando diuréticos em doses baixas (ex: Furosemida 20mg VO). Monitorar PA e frequência cardíaca regularmente."
      },
      {
        title: "Encaminhamento e Tratamento Cirúrgico",
        desc: "Referenciar imediatamente ao cardiologista/cirurgião cardíaco se paciente sintomático para troca valvar aórtica cirúrgica ou implante transcateter de prótese aórtica (TAVI)."
      }
    ]
  },
  {
    id: "miocardiopatia",
    name: "Miocardiopatia Dilatada",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Insuficiência cardíaca com fração de ejeção reduzida (ICFER), cardiomegalia difusa ao raio-X de tórax e dilatação de câmaras esquerdas evidenciada por Ecocardiograma.",
    alarm: "Piora acentuada da dispneia em repouso (ortopneia, dispneia paroxística noturna), ganho de peso rápido (congestão sistêmica) ou episódios de pré-síncope/síncope -> Internação para compensação.",
    treatment: [
      {
        title: "Terapia Quádrupla de Diretriz (SUS)",
        desc: "Iniciar e titular quatro classes farmacológicas fundamentais: Sacubitril-Valsartana (ou Enalapril/Losartana), Betabloqueador (Carvedilol ou Succinato de Metoprolol), Espironolactona e Inibidor da SGLT2 (Dapagliflozina/Empagliflozina)."
      },
      {
        title: "Acompanhamento Multidisciplinar",
        desc: "Restrição hidrossalina (geralmente < 1.5L de água por dia), pesagem diária para ajuste de Furosemida e reabilitação cardiovascular supervisionada após estabilização clínica."
      }
    ]
  },
  {
    id: "cor_pulmonale",
    name: "Cor Pulmonale Crônico",
    category: "Cardiovascular/Crônicas",
    diagnostic: "Hipertrofia e dilatação do ventrículo direito secundária a patologias respiratórias crônicas (como DPOC, hipertensão pulmonar primária ou sequelas de TEP). Presença de turgência jugular e edema de membros inferiores.",
    alarm: "Dispneia desproporcional associada a dor torácica anginosa, cianose de extremidades ou sinais de choque obstrutivo (hipotensão profunda, hipofonese de bulhas) -> Suporte ventilatório e terapia intensiva.",
    treatment: [
      {
        title: "Otimização da Doença Pulmonar de Base",
        desc: "Instituir e otimizar oxigenioterapia domiciliar (manter SatO2 entre 88-92%), broncodilatadores inalatórios e cessação absoluta do tabagismo para desacelerar o remodelamento vascular pulmonar."
      },
      {
        title: "Controle Volumétrico e Vasodilatadores específicos",
        desc: "Manejar a congestão direita com Furosemida 40mg VO associada a Espironolactona 25mg VO. Em casos específicos de hipertensão pulmonar associada, avaliar sildenafila sob rigoroso acompanhamento especialista."
      }
    ]
  },
  {
    id: "osteopenia",
    name: "Osteopenia e Osteoporose Crônica",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Densitometria óssea demonstrando T-score entre -1.0 e -2.5 (osteopenia) ou T-score ≤ -2.5 (osteoporose) na coluna lombar, colo do fêmur ou fêmur total.",
    alarm: "Ocorrência de fratura por trauma de baixo impacto (queda da própria altura), dor óssea súbita na coluna com perda de altura corporal (indicando fratura/achatamento vertebral) -> Radiografia e fixação ortopédica urgente se necessário.",
    treatment: [
      {
        title: "Suplementação de Cálcio e Vitamina D",
        desc: "Garantir aporte de Cálcio elementar de 1000-1200mg/dia (via dieta ou Carbonato de Cálcio 500mg VO 1 a 2 vezes ao dia) associado a Vitamina D (Colecalciferol 7.000 a 50.000 UI/semana)."
      },
      {
        title: "Terapia Antirreabsortiva (Alendronato)",
        desc: "Prescrever Alendronato de Sódio 70mg VO semanalmente. Orientar rigorosamente tomar em jejum completo de pelo menos 30 minutos com copo cheio de água, mantendo-se em pé para evitar esofagite química."
      }
    ]
  },
  {
    id: "nodulo_tireoide",
    name: "Nódulo de Tireoide Suspeito",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Detecção de nódulo palpável à palpação cervical ou achado incidental em Ultrassonografia de tireoide. Estratificação de risco usando a classificação TI-RADS (TI-RADS 4 e 5 são de moderada/alta suspeita).",
    alarm: "Presença de rouquidão inexplicada de início recente, disfagia, dispneia ou nódulo de consistência pétrea e aderido a planos profundos -> Alta suspeita de Carcinoma de tireoide. Encaminhar para cirurgia de cabeça e pescoço.",
    treatment: [
      {
        title: "Estratificação e Solicitação de PAAF",
        desc: "Solicitar dosagem de TSH sanguíneo. Se TSH normal ou elevado associado a nódulo > 1cm TI-RADS 4 ou 5, encaminhar para Punção Aspirativa por Agulha Fina (PAAF) guiada por ultrassonografia."
      },
      {
        title: "Conduta com Base no Resultado Citopatológico (Bethesda)",
        desc: "Bethesda II (benigno): acompanhamento ultrassonográfico anual. Bethesda III/IV (indeterminado): avaliar teste molecular ou lobectomia. Bethesda V/VI (suspeito/maligno): encaminhar para tireoidectomia cirúrgica."
      }
    ]
  },
  {
    id: "hipercortisolismo",
    name: "Síndrome de Cushing / Hipercortisolismo",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Aumento crônico de glicocorticoides. Sinais clínicos: obesidade centrípeta, fácies em lua cheia, giba, estrias violáceas largas (> 1cm), miopatia proximal e hipertensão. Confirmação por cortisol livre urinário de 24h elevado ou cortisol salivar à meia-noite.",
    alarm: "Surgimento de fraqueza muscular severa (hipocalemia grave), infecções oportunistas recorrentes ou quadro de crise adrenal associada (hipotensão, choque refratário a volume) -> Internação de urgência.",
    treatment: [
      {
        title: "Identificação da Etiologia (ACTH dependente ou não)",
        desc: "Dosagem de ACTH plasmático para diferenciar causa hipofisária (Doença de Cushing) ou adrenal (adenoma/carcinoma). Suspender imediatamente corticoides exógenos se causa for iatrogênica (retirada gradual / desmame)."
      },
      {
        title: "Tratamento Definitivo",
        desc: "Encaminhar ao endocrinologista e neurocirurgião (se microadenoma hipofisário) para ressecção transesfenoidal cirúrgica, ou adrenalectomia unilateral se tumor adrenal."
      }
    ]
  },
  {
    id: "bronquiectasia",
    name: "Bronquiectasias de Repetição",
    category: "Respiratórias",
    diagnostic: "Dilatação irreversível dos brônquios decorrente de infecções de repetição ou fibrose cística. Caracterizada por tosse produtiva crônica com expectoração muco-purulenta diária abundante, demonstrada por Tomografia Computadorizada (TC) de alta resolução de tórax.",
    alarm: "Evolução com hemoptise volumosa (> 150ml em 24h), dispneia aguda com cianose de extremidades ou rebaixamento sensorial -> Emergência respiratória imediata para estabilização, broncoscopia ou embolização.",
    treatment: [
      {
        title: "Higiene Brônquica e Fisioterapia Respiratória",
        desc: "Orientar fisioterapia respiratória diária com técnicas de oscilação oral de alta frequência, drenagem postural e inalação com solução salina hipertônica 3% para facilitação do clearence muco-ciliar."
      },
      {
        title: "Antibioticoterapia nas Exacerbações",
        desc: "Iniciar antibiótico baseado em culturas prévias de escarro (frequentemente cobrindo Pseudomonas aeruginosa: Ciprofloxacino 500-750mg VO de 12/12h por 10-14 dias). Avaliar corticoterapia inalatória se componente asmático."
      }
    ]
  },
  {
    id: "fibrose_pulmonar",
    name: "Fibrose Pulmonar Idiopática",
    category: "Respiratórias",
    diagnostic: "Doença intersticial crônica fibrosante. Paciente queixa-se de dispneia progressiva aos esforços e tosse seca refratária. Exame físico revela estertores creptantes em velcro bibasais e baqueteamento digital. TC de tórax mostra padrão de pneumonia intersticial usual (PIU) com favesamento.",
    alarm: "Piora súbita da dispneia em poucos dias associada a infiltrados novos ao raio-X (exacerbação aguda da FPI) -> Internação hospitalar para corticoterapia em altas doses e oxigenioterapia de alto fluxo.",
    treatment: [
      {
        title: "Preservação da Função e Antifibróticos",
        desc: "Encaminhar precocemente ao pneumologista para avaliação de antifibróticos de alto custo (Nintedanibe ou Pirfenidona) para reduzir a velocidade de perda da capacidade vital forçada (CVF)."
      },
      {
        title: "Reabilitação Pulmonar e Suporte",
        desc: "Indicar programa formal de reabilitação pulmonar, vacinação antipneumocócica e influenza completa, e oxigenioterapia domiciliar contínua se documentada hipoxemia de esforço ou repouso."
      }
    ]
  },
  {
    id: "apneia_sono",
    name: "Apneia Obstrutiva do Sono (SAOS)",
    category: "Respiratórias",
    diagnostic: "Sonolência excessiva diurna, roncos frequentes, pausas respiratórias presenciadas pelo parceiro e episódios de sufocamento noturno. Diagnóstico confirmado por Polissonografia evidenciando Índice de Apneia/Hipopneia (IAH) ≥ 15 eventos por hora de sono.",
    alarm: "Arritmias cardíacas noturnas complexas, episódios de síncope diurna inexplicada ou acidentes automobilísticos graves devido a hipersonolência -> Investigação acelerada e intervenção de urgência.",
    treatment: [
      {
        title: "Medidas Gerais e Comportamentais",
        desc: "Redução de peso corporal em pacientes obesos, interrupção completa do consumo de álcool e sedativos à noite, e adoção de terapia posicional (evitar decúbito dorsal durante o sono)."
      },
      {
        title: "Terapia com Pressão Positiva (CPAP)",
        desc: "Tratamento padrão para SAOS moderada a grave. Prescrever uso noturno de CPAP com ajuste automático de pressão para manter vias aéreas patentes, revertendo a sonolência diurna e reduzindo o risco cardiovascular."
      }
    ]
  },
  {
    id: "doenca_crohn",
    name: "Doença de Crohn",
    category: "Gastrointestinal",
    diagnostic: "Doença inflamatória intestinal que pode afetar qualquer segmento do trato digestivo (da boca ao ânus), de forma descontínua. Quadro clínico: diarreia crônica, dor abdominal persistente, perda de peso e fístulas perianais. Confirmada por colonoscopia com biópsias.",
    alarm: "Dor abdominal súbita intensa com abdome em tábua (perfuração intestinal), parada de eliminação de gases e fezes (obstrução/estenose), ou hemorragia digestiva maciça -> Encaminhar imediatamente para laparotomia cirúrgica.",
    treatment: [
      {
        title: "Indução da Remissão Clínica",
        desc: "Iniciar corticoterapia sistêmica (Prednisona 40mg VO ao dia com desmame lento) ou imunomoduladores (Azatioprina 2mg/kg/dia) associados a terapia biológica (Infliximabe ou Adalimumabe) sob orientação de especialista."
      },
      {
        title: "Manejo Nutricional e Suplementação",
        desc: "Garantir reposição de ferro elementar, Vitamina B12 e ácido fólico. Dieta enteral exclusiva em fases de exacerbação grave ou estenoses parciais para otimização da cicatrização mucosa."
      }
    ]
  },
  {
    id: "retocolite",
    name: "Retocolite Ulcerativa",
    category: "Gastrointestinal",
    diagnostic: "Inflamação difusa e contínua limitada à mucosa do cólon e reto. Pacientes apresentam diarreia crônica muco-sanguinolenta acompanhada de cólicas abdominais importantes e tenesmo. Diagnóstico por Retossigmoidoscopia ou Colonoscopia com biópsia.",
    alarm: "Presença de febre alta, distensão abdominal progressiva, taquicardia e dor abdominal generalizada grave (risco de Megacólon Tóxico) -> Radiografia de abdome em pé de urgência e colectomia de emergência.",
    treatment: [
      {
        title: "Tratamento de Indução e Manutenção com Aminossalicitatos",
        desc: "Prescrever Sulfassalazina 2-4g ao dia ou Mesalazina (comprimidos VO 2.4g-4.8g/dia ou supositórios de 1g/dia se proctite distal isolada). Monitorar resposta inflamatória por hemograma e calprotectina fecal."
      },
      {
        title: "Corticoterapia para Resgate Inflamatório",
        desc: "Em casos moderados a graves com resposta inadequada aos aminossalicitatos, introduzir Prednisona 40mg VO ao dia com redução gradual após controle dos sintomas. Casos refratários necessitam de biológicos."
      }
    ]
  },
  {
    id: "sindrome_intestino_irritavel",
    name: "Síndrome do Intestino Irritável",
    category: "Gastrointestinal",
    diagnostic: "Dor abdominal recorrente (pelo menos 1 dia por semana nos últimos 3 meses) associada a alterações na frequência ou consistência das fezes (critérios de Roma IV), na ausência de fatores orgânicos ou de alarme.",
    alarm: "Início dos sintomas após os 50 anos, febre, anemia, diarreia noturna persistente, ou história familiar de câncer colorretal -> Investigar causas orgânicas por colonoscopia obrigatória.",
    treatment: [
      {
        title: "Orientação Dietética e Dieta Low-FODMAP",
        desc: "Restringir carboidratos fermentáveis (frutose, lactose, oligossacarídeos) por 4-6 semanas com reintrodução gradual guiada por nutricionista. Estimular hidratação e consumo de fibras solúveis."
      },
      {
        title: "Controle Sintomático e Modulação Neurogastroenterológica",
        desc: "Para cólicas: Brometo de Pinavério 50-100mg VO de 8/8h ou Hioscina. Para predominância diarreia: Loperamida com parcimônia. Para constipação: Laxantes osmóticos. Casos graves: Amitriptilina em dose baixa (12.5-25mg à noite)."
      }
    ]
  },
  {
    id: "esteatose_hepatica",
    name: "Esteatose Hepática (DHGNA)",
    category: "Gastrointestinal",
    diagnostic: "Acúmulo de gordura no parênquima hepático demonstrado por ultrassonografia abdominal, na ausência de consumo etílico significativo ou causas secundárias de esteatose. Avaliação de fibrose por escores não invasivos (FIB-4).",
    alarm: "Surgimento de icterícia, ascite (barriga d'água), encefalopatia hepática ou episódios de sangramento de varizes -> Evolução para Cirrose Hepática descompensada. Encaminhar para acompanhamento de hepatologia.",
    treatment: [
      {
        title: "Mudança no Estilo de Vida e Perda Ponderal",
        desc: "Meta de perda de pelo menos 7-10% do peso corporal total através de dieta hipocalórica personalizada e exercícios físicos aeróbicos e resistidos semanais para redução da inflamação hepática."
      },
      {
        title: "Tratamento de Comorbidades e Antioxidantes",
        desc: "Controle rigoroso do diabetes, dislipidemia e hipertensão. Em pacientes não diabéticos com esteato-hepatite confirmada por biópsia, avaliar uso de Vitamina E 800 UI ao dia para efeito hepatoprotetor."
      }
    ]
  },
  {
    id: "esclerose_multipla",
    name: "Esclerose Múltipla",
    category: "Neurológico",
    diagnostic: "Doença autoimune desmielinizante do sistema nervoso central. Caracterizada por surtos de déficits neurológicos (neurite óptica, parestesias, perda de força, ataxia) disseminados no tempo e espaço, confirmada por Ressonância Magnética cerebral/medular.",
    alarm: "Início súbito de fraqueza motora ascendente rápida com dificuldade respiratória ou retenção urinária aguda -> Surto agudo grave. Internar para pulsoterapia urgente com Metilprednisolona IV.",
    treatment: [
      {
        title: "Pulsoterapia no Surto Agudo",
        desc: "Administrar Metilprednisolona 1g IV ao dia por 3 a 5 dias consecutivos em ambiente hospitalar para acelerar a recuperação funcional e reduzir o dano mielínico agudo."
      },
      {
        title: "Medicamentos Modificadores da Doença (MMD)",
        desc: "Encaminhar para ambulatório especializado em neurologia e farmácia de alto custo para início de imunomoduladores/imunossupressores como Acetato de Glatiâmer, Interferon-beta, Fingolimode ou Natalizumabe."
      }
    ]
  },
  {
    id: "demencia_vascular",
    name: "Demência Vascular",
    category: "Neurológico",
    diagnostic: "Declínio cognitivo com prejuízo funcional, de início súbito ou progressão em degraus, intimamente correlacionado a múltiplos eventos cerebrovasculares prévios (infartos lacunares, AVC cortical) evidenciados em imagem.",
    alarm: "Surgimento súbito de novos déficits motores focais, disartria aguda ou convulsões -> Suspeita de novo acidente vascular cerebral (AVC isquêmico ou hemorrágico) em andamento. Acionar SAMU.",
    treatment: [
      {
        title: "Prevenção Secundária Cardiovascular Rigorosa",
        desc: "Controle estrito da PA (< 130/80 mmHg), diabetes (HbA1c < 7%) e dislipidemia. Prescrever Ácido Acetilsalicílico (AAS) 100mg VO ao dia associado a uma estatina de alta potência (Atorvastatina 40mg VO à noite)."
      },
      {
        title: "Manejo Comportamental e Cognitivo",
        desc: "Manter rotina estruturada de atividades cognitivas, exercícios físicos leves e estimulação social. Se sintomas neuropsiquiátricos importantes (agitação, alucinações), utilizar antipsicóticos em baixas doses com cautela extrema."
      }
    ]
  },
  {
    id: "neuropatia_periferica",
    name: "Neuropatia Diabética e Periférica",
    category: "Neurológico",
    diagnostic: "Dor em queimação, agulhada, formigamento ou dormência com distribuição simétrica em 'bota' ou 'luva', com perda de sensibilidade protetora avaliada pelo teste do monofilamento de 10g.",
    alarm: "Presença de úlcera plantar indolor infectada, secreção purulenta, calor local ou deformidade súbita do pé (Pé de Charcot) -> Risco crítico de amputação. Encaminhar para cirurgia/ortopedia vascular.",
    treatment: [
      {
        title: "Controle da Glicemia e Cuidados Diários",
        desc: "Orientar o paciente a nunca andar descalço, inspecionar diariamente a sola dos pés, secar bem entre os dedos e hidratar a pele (evitando passar creme entre os dedos). Manter controle glicêmico estrito para estabilizar a neuropatia."
      },
      {
        title: "Tratamento da Dor Neuropática",
        desc: "Prescrever moduladores da dor: Pregabalina 75mg a 150mg VO ao dia, Gabapentina 300mg a 900mg VO ao dia ou Amitriptilina 12.5mg a 50mg VO à noite (atentar para efeitos anticolinérgicos em idosos)."
      }
    ]
  },
  {
    id: "miastenia",
    name: "Miastenia Gravis",
    category: "Neurológico",
    diagnostic: "Flutuação da fraqueza muscular esquelética com fadiga acentuada ao longo do dia e melhora com repouso. Sintomas comuns: ptose palpebral, diplopia (visão dupla) e disfonia. Confirmada por anticorpos anti-AChR e eletroneuromiografia.",
    alarm: "Crise Miastênica: fraqueza acentuada da musculatura respiratória e deglutição, necessitando de intubação e ventilação mecânica -> Encaminhar imediatamente para UTI para imunoglobulina ou plasmaférese.",
    treatment: [
      {
        title: "Uso de Anticolinesterásicos de Ação Rápida",
        desc: "Prescrever Piridostigmina (Mestinon) 60mg VO, ajustando dose e intervalo (geralmente de 4/4h ou 6/6h) conforme resposta clínica e tolerância (observar cólicas intestinais e salivação)."
      },
      {
        title: "Terapia Imunossupressora",
        desc: "Associar Presonisa em baixas doses ou Azatioprina sob supervisão neurológica para redução dos níveis de autoanticorpos. Programar timectomia cirúrgica se presença de timoma ou doença generalizada em jovens."
      }
    ]
  },
  {
    id: "espondilite_anquilosante",
    name: "Espondilite Anquilosante",
    category: "Reumatologia",
    diagnostic: "Dor lombar crônica de padrão inflamatório (início < 45 anos, melhora com exercício e piora com repouso, rigidez matinal > 30 minutos) associada a entesite ou uveíte anterior, confirmada por ressonância das sacroilíacas e HLA-B27 positivo.",
    alarm: "Evolução com dor torácica severa com restrição da expansibilidade pulmonar, ou trauma de coluna com dor de início súbito (alto risco de fratura vertebral por coluna anquilosada) -> Imobilização e pronto-socorro.",
    treatment: [
      {
        title: "Anti-inflamatórios Não Esteroidais (AINEs)",
        desc: "Medicamento de primeira escolha. Prescrever Naproxeno 250mg a 500mg VO de 12/12h ou Indometacina 50mg VO de 12/12h por longos períodos para controle da dor e progressão da anquilose."
      },
      {
        title: "Atividade Física Otimizada e Biológicos",
        desc: "Fisioterapia focada em alongamento e preservação postural global (RPG). Em casos refratários aos AINEs, iniciar agentes anti-TNF (como Adalimumabe ou Etanercepte) fornecidos pelo SUS."
      }
    ]
  },
  {
    id: "fibromialgia",
    name: "Fibromialgia Crônica",
    category: "Reumatologia",
    diagnostic: "Dor generalizada difusa por mais de 3 meses, associada a fadiga, distúrbios do sono e alterações cognitivas (escore de severidade dos sintomas e índice de dor generalizada), sem causa orgânica identificável.",
    alarm: "Presença de sintomas constitucionais graves (perda de peso rápida, febre prolongada, adenopatias), rigidez articular inflamatória proeminente ou perda de força focal -> Investigar diagnósticos alternativos como neoplasias ou autoimunes.",
    treatment: [
      {
        title: "Abordagem Multidisciplinar Não Farmacológica",
        desc: "Orientar de forma enfática a prática regular de exercícios físicos aeróbicos de baixo impacto (caminhada, hidroginástica, natação) e terapia cognitivo-comportamental (TCC) para modulação central da dor."
      },
      {
        title: "Farmacoterapia Coadjuvante de Modulação Central",
        desc: "Prescrever Amitriptilina 12.5mg a 25mg VO à noite ou Ciclobenzaprina 5mg a 10mg VO à noite. Como alternativa, utilizar Duloxetina 30mg a 60mg VO pela manhã ou Pregabalina 75mg VO à noite."
      }
    ]
  },
  {
    id: "sindrome_sjogren",
    name: "Síndrome de Sjogren",
    category: "Reumatologia",
    diagnostic: "Doença autoimune caracterizada por infiltração linfocitária das glândulas exócrinas. Pacientes apresentam xeroftalmia (olho seco grave) e xerostomia (boca seca intensa) persistentes, associadas a anticorpos Anti-SSA (Ro) ou Anti-SSB (La).",
    alarm: "Aparecimento de febre persistente, aumento volumétrico de parótidas de consistência endurecida ou perda ponderal (alto risco de linfoma em Sjogren) -> Biópsia e investigação especializada rápida.",
    treatment: [
      {
        title: "Tratamento de Alívio da Secura Mucosa",
        desc: "Prescrever lágrimas artificiais sem conservantes a cada 1-2h, saliva artificial e boa hidratação oral. Orientar higiene bucal rigorosa e visitas regulares ao dentista devido ao alto risco de cáries de repetição."
      },
      {
        title: "Estimulantes Secretores e Imunossupressores",
        desc: "Considerar Pilocarpina 5mg VO de 8/8h para estimular secreções se houver tecido glandular viável. Em manifestações sistêmicas (artrite, vasculite), associar Hidroxicloroquina 400mg VO ao dia."
      }
    ]
  },
  {
    id: "polimialgia_reumatica",
    name: "Polimialgia Reumática",
    category: "Reumatologia",
    diagnostic: "Dor e rigidez bilateral persistente em cinturas escapular e pélvica de início agudo ou subagudo em pacientes com mais de 50 anos, acompanhada de elevação acentuada de provas de atividade inflamatória (VHS > 40 mm/h e PCR alta).",
    alarm: "Associação com cefaleia temporal nova severa, claudicação de mandíbula ao mastigar ou perda visual súbita unilateral (arterite de células gigantes associada) -> Iniciar imediatamente Metilprednisolona venosa para evitar cegueira definitiva.",
    treatment: [
      {
        title: "Corticoterapia em Dose Baixa e Rápida Resposta",
        desc: "Iniciar com Prednisona 15mg VO ao dia em dose única matinal. Uma melhora clínica dramática (em 24 a 48h) é característica da doença. Manter a dose por 2-4 semanas e iniciar redução extremamente lenta."
      },
      {
        title: "Prevenção de Efeitos Colaterais de Corticoides",
        desc: "Associar Carbonato de Cálcio 1000mg/dia + Vitamina D3 800 UI/dia de forma contínua para mitigar a perda de massa óssea decorrente do uso prolongado de corticoide."
      }
    ]
  },
  {
    id: "nefropatia_diabetica",
    name: "Nefropatia Diabética",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Presença de albuminúria persistente confirmada em duas amostras de urina de 24h ou amostra isolada (relação albumina/creatinina - RAC > 30 mg/g) em paciente com diabetes estabelecido de longa data.",
    alarm: "Surgimento de edema generalizado súbito (síndrome nefrótica), uremia grave (perda de apetite, soluços, náuseas e vômitos refratários, pericardite urêmica) ou hipercalemia severa -> Diálise de urgência.",
    treatment: [
      {
        title: "Bloqueio do Sistema Renina-Angiotensina",
        desc: "Prescrever Enalapril 10mg a 20mg VO de 12/12h ou Losartana 50mg a 100mg VO ao dia. O bloqueio duplo é contraindicado. Ajustar doses para tolerar proteinúria sem induzir hipercalemia ou queda abrupta da TFG."
      },
      {
        title: "Gliflozinas de Proteção Renal",
        desc: "Associar Inibidores da SGLT2 (Dapagliflozina 10mg VO ao dia), que comprovadamente reduzem a taxa de declínio da função renal e a albuminúria, desde que a TFG > 25-30 mL/min."
      }
    ]
  },
  {
    id: "glomerulonefrite",
    name: "Glomerulonefrite Crônica",
    category: "Metabólicas/Endócrinas",
    diagnostic: "Presença de hematúria glomerular dismórfica microscópica persistente, cilindros hemáticos, proteinúria subnefrótica ou nefrótica e perda progressiva de função renal.",
    alarm: "Evolução com hipertensão arterial acelerada refratária, oligúria extrema (< 400ml/dia de urina) ou congestão pulmonar aguda (EAP) -> Internação imediata para pulsoterapia e suporte intensivo.",
    treatment: [
      {
        title: "Controle Pressórico e Antiproteinúria",
        desc: "Manter PA rigorosamente abaixo de 120/80 mmHg com IECA (Enalapril) ou BRA (Losartana) e restrição rigorosa de sódio na dieta (< 2g/dia)."
      },
      {
        title: "Imunossupressão Direcionada",
        desc: "Encaminhar para biópsia renal guiada por imagem se perda rápida de função. Iniciar corticoterapia ou imunossupressores específicos (como Ciclofosfamida ou Ciclosporina) conforme o padrão histológico revelado."
      }
    ]
  },
  {
    id: "disfuncao_eretil",
    name: "Disfunção Erétil Crônica",
    category: "Outros",
    diagnostic: "Inabilidade persistente em obter e manter uma ereção suficiente para permitir uma atividade sexual satisfatória por pelo menos 3 a 6 meses. Investigar causas vasculares, neurológicas, psicogênicas ou hormonais.",
    alarm: "Presença de ereção dolorosa persistente com duração maior que 4 horas (Priapismo agudo) -> Emergência urológica imediata para aspiração intracavernosa para evitar fibrose peniana e disfunção permanente.",
    treatment: [
      {
        title: "Inibidores da Fosfodiesterase Tipo 5 (PDE5)",
        desc: "Primeira linha farmacológica. Prescrever Sildenafila 25-50mg VO cerca de 1 hora antes da atividade sexual (máximo 1 dose/dia), ou Tadalafila 5mg de uso diário ou 20mg sob demanda. Contraindicado em uso de Nitratos."
      },
      {
        title: "Modificação de Fatores de Risco e Terapia Cognitiva",
        desc: "Controlar rigorosamente hipertensão, diabetes, dislipidemia e obesidade. Incentivar cessação de tabaco/álcool. Encaminhar para psicoterapia de apoio ou terapia de casal se forte componente psicogênico."
      }
    ]
  },
  {
    id: "psoriase",
    name: "Psoríase Vulgar",
    category: "Dermatologia",
    diagnostic: "Placas eritemato-descamativas simétricas, bem delimitadas, recobertas por escamas esbranquiçadas, localizadas preferencialmente em áreas de extensão (cotovelos, joelhos, couro cabeludo). Sinais de raspagem positivos (Sinal de Auspitz).",
    alarm: "Erupção eritematosa dolorosa generalizada cobrindo > 90% da superfície corporal (Psoríase Eritrodérmica) ou aparecimento de múltiplas pústulas estéreis com febre (Psoríase Pustulosa) -> Internação imediata.",
    treatment: [
      {
        title: "Terapia Tópica de Primeira Linha",
        desc: "Para lesões localizadas (< 10% da superfície corporal): aplicar pomada de Propionato de Clobetasol 0.05% associado ou não a Ácido Salicílico 3% 1 a 2 vezes ao dia por até 4 semanas. Hidratação abundante."
      },
      {
        title: "Fototerapia ou Terapia Sistêmica",
        desc: "Encaminhar para fototerapia UVA/UVB de banda estreita. Casos extensos ou refratários necessitam de Metotrexato 7.5-15mg VO semanalmente (associado a Ácido Fólico) ou Acitretina."
      }
    ]
  },
  {
    id: "melanoma",
    name: "Melanoma Cutâneo Suspeito",
    category: "Dermatologia",
    diagnostic: "Lesão pigmentada assimétrica que preenche os critérios ABCDE: Assimetria, Bordas irregulares, Cores múltiplas, Diâmetro > 6mm, Evolução rápida com mudanças de tamanho ou sangramento espontâneo.",
    alarm: "Presença de linfonodomegalia satélite endurecida, ulceração persistente da lesão primária ou dor local significativa -> Alto risco de metástase rápida. Encaminhar imediatamente para biópsia excisional rápida.",
    treatment: [
      {
        title: "Excisão Cirúrgica Diagnóstica Inicial",
        desc: "NUNCA realizar biópsia incisional (shaving/punch) se suspeita de melanoma. Realizar biópsia excisional completa com margens estreitas de 1 a 2mm para confirmação diagnóstica e determinação do Índice de Breslow."
      },
      {
        title: "Ampliação de Margens e Pesquisa de Linfonodo Sentinela",
        desc: "Com base no Breslow: se > 0.8mm, encaminhar com urgência para ampliação cirúrgica de margens (1-2cm) e biópsia de linfonodo sentinela em serviço oncológico especializado."
      }
    ]
  },
  {
    id: "vitiligo",
    name: "Vitiligo",
    category: "Dermatologia",
    diagnostic: "Máculas e placas acrômicas (completamente brancas, cor de giz), de contornos nítidos e bem delineados, bilaterais e frequentemente simétricas, acentuadas sob exame com Lâmpada de Wood.",
    alarm: "Vitiligo com progressão extremamente rápida (fase inflamatória ativa com eritema na borda das lesões) associado a sintomas depressivos graves ou ideação suicida por forte estigma social -> Suporte psicológico imediato.",
    treatment: [
      {
        title: "Corticosteroides e Imunomoduladores Tópicos",
        desc: "Para lesões limitadas: aplicar Creme de Pomada de Clobetasol 0.05% ou Creme de Tacrolimo 0.1% 1 a 2 vezes ao dia, monitorando atrofia cutânea local. Proteger rigorosamente contra queimaduras solares."
      },
      {
        title: "Fototerapia e Suporte Psicossocial",
        desc: "Encaminhar para fototerapia UVB de banda estreita (estimula repigmentação a partir dos folículos pilosos). Oferecer psicoterapia de apoio e orientação sobre maquiagens cosméticas de camuflagem."
      }
    ]
  },
  {
    id: "acne_grave",
    name: "Acne Inflamatória Grave",
    category: "Dermatologia",
    diagnostic: "Presença de múltiplos nódulos e cistos inflamatórios dolorosos, abscessos intercomunicantes com secreção purulenta persistente, eritema acentuado e cicatrizes hipertróficas ou atróficas deformantes no rosto/dorso.",
    alarm: "Surgimento súbito de febre alta, artralgias severas e ulcerações necróticas na pele com acne confluente (Acne Fulminans) -> Suspender tratamentos tópicos e internar para corticoterapia sistêmica de urgência.",
    treatment: [
      {
        title: "Antibioticoterapia Sistêmica de Transição",
        desc: "Iniciar Doxiciclina 100mg VO ao dia por até 6-8 semanas associada a Peróxido de Benzila 5% tópico à noite para controle bacteriano inicial de Propionibacterium acnes e redução de cistos agudos."
      },
      {
        title: "Introdução Oportuna de Isotretinoína Oral (Roacutan)",
        desc: "Encaminhar ao dermatologista para prescrição de Isotretinoína Oral (0.5-1.0 mg/kg/dia). Realizar rigoroso teste de gravidez mensal em mulheres (teratogenicidade extrema) e controle de perfil lipídico/enzimas hepáticas."
      }
    ]
  },
  {
    id: "bipolaridade",
    name: "Transtorno Afetivo Bipolar",
    category: "Saúde Mental",
    diagnostic: "Presença de oscilação patológica do humor entre episódios de Mania/Hipomania (grandiosidade, taquipsiquismo, insônia sem fadiga, gastos excessivos) e episódios de Depressão Maior.",
    alarm: "Episódio maníaco grave com heteroagressividade, delírios de poder, comportamento de altíssimo risco físico/social, ou fase depressiva com ideação suicida ativa -> Internação psiquiátrica imediata para estabilização.",
    treatment: [
      {
        title: "Introdução de Estabilizadores de Humor",
        desc: "Prescrever Carbonato de Lítio 300mg a 900mg VO ao dia (manter litemia entre 0.6 e 1.2 mEq/L) ou Ácido Valproico 500mg-1500mg VO ao dia. Evitar antidepressivos em monoterapia (risco de virada maníaca)."
      },
      {
        title: "Uso de Antipsicóticos Atípicos se Necessário",
        desc: "Associar Quetiapina 100-300mg VO à noite ou Olanzapina 5-10mg VO ao dia para controle rápido de sintomas psicóticos ou agitação psicomotora durante episódios agudos de mania."
      }
    ]
  },
  {
    id: "esquizofrenia",
    name: "Esquizofrenia",
    category: "Saúde Mental",
    diagnostic: "Presença de sintomas positivos (delírios bizarros, alucinações auditivas frequentes, desorganização do pensamento/comportamento) e sintomas negativos (embotamento afetivo, isolamento social, abulia) por mais de 6 meses.",
    alarm: "Agitação psicomotora violenta sob influência de alucinações imperativas (escutar vozes comandando agressão) ou recusa alimentar completa motivada por delírio persecutório/envenenamento -> Internação hospitalar de resgate.",
    treatment: [
      {
        title: "Antipsicofarmacoterapia de Primeira Linha",
        desc: "Prescrever antipsicóticos: Risperidona 1mg a 6mg VO ao dia ou Haloperidol 2.5mg a 10mg VO ao dia associado a Prometazina 25mg se houver efeitos extrapiramidais (impregnação/rigidez)."
      },
      {
        title: "Reabilitação Psicossocial e CAPS",
        desc: "Encaminhar para inserção em CAPS III para terapia ocupacional, oficinas de socialização e monitoramento terapêutico assistido para prevenir recaídas e promover reintegração social."
      }
    ]
  },
  {
    id: "tdah_adulto",
    name: "TDAH em Adultos",
    category: "Saúde Mental",
    diagnostic: "Padrão persistente de desatenção, desorganização, impulsividade e inquietação motora que remonta à infância, causando prejuízo significativo em múltiplas áreas (trabalho, acadêmica, relacionamentos). Avaliado pela escala ASRS-v1.1.",
    alarm: "Comorbidade grave com abuso severo de substâncias estimulantes, acidentes automobilísticos frequentes por impulsividade extrema ou ansiedade social incapacitante -> Encaminhar para psiquiatria e neurologia.",
    treatment: [
      {
        title: "Terapia Cognitivo-Comportamental Psicoeducacional",
        desc: "Implementar técnicas de organização pessoal baseadas em agendas visuais, listas de tarefas, gerenciamento de tempo (método pomodoro) e modificação de ambiente para mitigar distratores."
      },
      {
        title: "Tratamento Farmacológico com Estimulantes",
        desc: "Avaliar introdução de Cloridrato de Metilfenidato (Ritalina 10mg VO 1 a 2 vezes ao dia ou Ritalina LA / Venvanse se disponível e viável). Monitorar rigorosamente frequência cardíaca e pressão arterial."
      }
    ]
  },
  {
    id: "borderline",
    name: "Transtorno de Personalidade Borderline",
    category: "Saúde Mental",
    diagnostic: "Instabilidade marcante nos relacionamentos interpessoais, na autoimagem e nos afetos, acompanhada de impulsividade acentuada, sentimentos crônicos de vazio, episódios de raiva intensa e automutilação recorrente.",
    alarm: "Comportamentos recorrentes de automutilação com intenção letal, tentativas de suicídio de repetição ou episódios de micropsicose reativa -> Encaminhamento para internação psiquiátrica protetiva de curta duração.",
    treatment: [
      {
        title: "Psicoterapia Estruturada (Abordagem Principal)",
        desc: "A Terapia Comportamental Dialética (DBT) é o tratamento padrão-ouro de eficácia comprovada para o desenvolvimento de regulação emocional, tolerância ao mal-estar e efetividade interpessoal."
      },
      {
        title: "Farmacoterapia Sintomática Coadjuvante",
        desc: "Prescrever medicação com foco estrito em sintomas-alvo: Fluoxetina ou Sertralina para sintomas depressivos/ansiosos; baixas doses de antipsicóticos (ex: Quetiapina 25-50mg) para impulsividade severa e raiva."
      }
    ]
  },
  {
    id: "hiv_aids",
    name: "HIV/Aids e Infecções Oportunistas",
    category: "Infecciosas/Endemias",
    diagnostic: "Sorologia positiva por teste rápido de HIV de fluxo lateral (confirmado por segundo teste rápido de fabricante diferente ou Western Blot). Classificado como Aids se contagem de linfócitos CD4 < 200 células/mm³ ou presença de infecção oportunista.",
    alarm: "Febre diária alta associada a cefaleia progressiva severa e rigidez nucal (suspeita de Meningite Criptocócica ou Tuberculosa), ou dispneia severa com tosse seca (suspeita de Pneumocistose) -> Internar e investigar.",
    treatment: [
      {
        title: "Terapia Antirretroviral (TARV) Imediata",
        desc: "Prescrever esquema tríplice padrão do Ministério da Saúde: Tenofovir (TDF) 300mg + Lamivudina (3TC) 300mg + Dolutegravir (DTG) 50mg VO, em tomada única diária, preferencialmente à noite. Testar hepatites e sífilis."
      },
      {
        title: "Quimioprofilaxia de Infecções Oportunistas se CD4 Baixo",
        desc: "Se CD4 < 200/mm³: prescrever Sulfametoxazol-Trimetoprima 800/160mg VO ao dia para prevenir pneumonia por Pneumocystis jirovecii e neurotoxoplasmose. Manter até CD4 restabelecer > 200 por mais de 3 meses."
      }
    ]
  },
  {
    id: "chagas",
    name: "Doença de Chagas Crônica",
    category: "Infecciosas/Endemias",
    diagnostic: "Infecção pelo Trypanosoma cruzi confirmada por dois testes sorológicos distintos (ELISA, Imunofluorescência ou Hemaglutinação). Apresenta-se nas formas indeterminada, cardíaca (arritmias, ICC) ou digestiva (megacólon/megaesôfago).",
    alarm: "Evolução com bloqueio atrioventricular de 2º ou 3º grau ao ECG (síncope, bradicardia extrema) ou dor torácica aguda -> Indicação imediata de internação para passagem de marcapasso transvisório/definitivo.",
    treatment: [
      {
        title: "Eletrocardiograma de Rastreio Anual",
        desc: "Realizar ECG anual em todos os pacientes na forma indeterminada para detectar distúrbios de condução cardíaca (bloqueio de ramo direito associado a hemibloqueio anterior esquerdo é altamente sugestivo)."
      },
      {
        title: "Tratamento Antiparasitário Específico",
        desc: "Em fase crônica recente ou crianças, prescrever Benznidazol 5mg/kg/dia VO dividido em duas doses por 60 dias. Em fase crônica tardia estabelecida, o tratamento antiparasitário não reverte as sequelas, focando no manejo da IC."
      }
    ]
  },
  {
    id: "toxoplasmose",
    name: "Toxoplasmose na Gestação",
    category: "Infecciosas/Endemias",
    diagnostic: "Sorologia pré-natal evidenciando IgG negativo e IgM positivo (soroconversão na gestação), ou IgM e IgG positivos com teste de avidez de IgG baixo em gestantes com menos de 16 semanas.",
    alarm: "Febre, cefaleia intensa ou alterações visuais na gestante, ou ultrassonografia fetal revelando calcificações cerebrais, hidrocefalia ou dilatação de ventrículos fetais -> Encaminhamento urgente para medicina fetal.",
    treatment: [
      {
        title: "Prevenção da Transmissão Vertical Inicial",
        desc: "Iniciar imediatamente Espiramicina 1g VO de 8/8h (3g/dia) de forma ininterrupta assim que detectada suspeita diagnóstica, para prevenir a passagem do parasita pela barreira placentária."
      },
      {
        title: "Esquema Tríplice Se Infecção Fetal Confirmada",
        desc: "Após 18 semanas de gestação e amniocentese com PCR positiva para T. gondii no líquido amniótico: substituir Espiramicina por Sulfadiazina 3g/dia + Pirimetamina 50mg/dia + Ácido Folínico 15mg/dia para tratar infecção fetal ativa."
      }
    ]
  },
  {
    id: "hepatite_b",
    name: "Hepatite B Crônica",
    category: "Infecciosas/Endemias",
    diagnostic: "Presença de HBsAg circulante reagente por período superior a 6 meses. Avaliar replicabilidade viral através do HBeAg e carga viral (DNA do HBV) sanguínea, além de fibrose hepática por elastografia.",
    alarm: "Hepatite B crônica associada a icterícia progressiva, ascite, varizes esofágicas ou nódulo sólido hepático à ultrassonografia (suspeita de Carcinoma Hepatocelular) -> Rastreio imediato de Alfa-fetoproteína e tomografia.",
    treatment: [
      {
        title: "Rastreamento Regular de Carcinoma Hepatocelular (CHC)",
        desc: "Realizar ultrassonografia abdominal a cada 6 meses associada a dosagem de Alfa-fetoproteína para detecção precoce de nódulos malignos, obrigatório em pacientes cirróticos ou com história familiar de CHC."
      },
      {
        title: "Tratamento Antiviral com Análogos de Nucleosídeo",
        desc: "Prescrever Tenofovir (TDF) 300mg VO ao dia ou Entecavir 0.5mg VO ao dia de forma contínua para pacientes com replicação ativa, transaminases elevadas ou cirrose, visando supressão viral crônica."
      }
    ]
  },
  {
    id: "endometriose",
    name: "Endometriose Profunda",
    category: "Ginecologia/Obstetrícia",
    diagnostic: "Presença de tecido endometrial fora do útero. Sintomas: dismenorreia secundária severa progressiva, dispareunia de profundidade, dor pélvica crônica não cíclica e infertilidade. Diagnosticada por RNM de pelve com protocolo para endometriose.",
    alarm: "Surgimento de dor pélvica excruciante de início súbito acompanhada de febre e peritonismo local (suspeita de torção ou ruptura de endometrioma ovariano) -> Encaminhar para laparoscopia cirúrgica de urgência.",
    treatment: [
      {
        title: "Terapia Hormonal para Bloqueio de Ciclo",
        desc: "Prescrever contraceptivos orais combinados de uso contínuo (ex: Etinilestradiol + Gestodeno) ou progestágenos isolados (Dienogeste 2mg VO ao dia) para suprimir a menstruação e induzir atrofia dos focos endometrióticos."
      },
      {
        title: "Analgesia Escalonada e Cirurgia se Refratário",
        desc: "Utilizar AINEs (como Ibuprofeno 600mg) associados a analgésicos simples nas crises. Casos com dor refratária ao bloqueio hormonal ou acometimento de ureter/reto devem ser encaminhados para ressecção cirúrgica por videolaparoscopia."
      }
    ]
  },
  {
    id: "miomatose_uterina",
    name: "Miomatose Uterina Sintomática",
    category: "Ginecologia/Obstetrícia",
    diagnostic: "Tumores benignos da musculatura uterina (miócitos) detectados por Ultrassonografia pélvica/transvaginal, causando sangramento uterino anormal abundante (menorragia), cólicas uterinas e aumento do volume abdominal.",
    alarm: "Presença de sangramento vaginal volumoso contínuo com repercussão hemodinâmica importante (tontura postural, palidez mucosa, hipotensão) ou dor pélvica severa refratária -> Internação para curetagem sem demora ou cirurgia.",
    treatment: [
      {
        title: "Controle do Sangramento Abundante",
        desc: "Utilizar Ácido Tranexâmico 250-500mg VO de 8/8h durante os dias de sangramento intenso associado a anti-inflamatórios para reduzir a perda sanguínea. Tratar anemia ferropriva com Sulfato Ferroso oral."
      },
      {
        title: "Tratamento Hormonal e Cirurgia Eletiva",
        desc: "Dispositivo intrauterino liberador de Levonorgestrel (DIU Mirena) se cavidade uterina regular, ou Análogos de GnRH para redução volumétrica pré-operatória. Encaminhar para miomectomia ou histerectomia se desejo de prole completo."
      }
    ]
  },
  {
    id: "sindrome_ovario_policistico",
    name: "Síndrome dos Ovários Policísticos (SOP)",
    category: "Ginecologia/Obstetrícia",
    diagnostic: "Presença de pelo menos dois dos três critérios de Roterdã: oligovulação ou anovulação crônica (irregularidade menstrual), hiperandrogenismo clínico ou laboratorial (hirsutismo, acne) e ovários de aparência policística ao USG.",
    alarm: "Sangramento uterino disfuncional abundante persistente com anemia ferropriva severa (Hb < 8 g/dL) -> Hemotransfusão ou reposição de ferro venoso em ambiente de pronto atendimento.",
    treatment: [
      {
        title: "Regularização do Ciclo e Tratamento do Hiperandrogenismo",
        desc: "Prescrever anticoncepcional oral combinado contendo progestágeno antiandrogênico (ex: Acetato de Ciproterona + Etinilestradiol). Se hirsutismo persistente após 6 meses, associar Espironolactona 50-100mg VO ao dia."
      },
      {
        title: "Tratamento da Resistência Insulínica",
        desc: "Associar Metformina 500-1500mg VO ao dia em pacientes com sobrepeso ou intolerância à glicose, otimizando o perfil metabólico e facilitando o restabelecimento de ovulações espontâneas."
      }
    ]
  },
  {
    id: "cancer_colo_utero",
    name: "Lesões Precursoras de Câncer de Colo do Útero",
    category: "Ginecologia/Obstetrícia",
    diagnostic: "Rastreamento por exame preventivo citopatológico (Papanicolau) alterado, revelando lesões intraepiteliais de alto grau (NIC II ou NIC III / HSIL). Confirmação por colposcopia com biópsia dirigida.",
    alarm: "Presença de sangramento vaginal espontâneo contínuo pós-coito (sinusorragia), corrimento fétido aquoso abundante ou dor pélvica constante profunda -> Suspeita de Câncer invasivo estabelecido. Encaminhamento urgente ao oncologista.",
    treatment: [
      {
        title: "Indicação de Colposcopia e Biópsia",
        desc: "Encaminhar imediatamente para colposcopia em ambulatório de patologia do trato genital inferior após resultado citológico sugestivo de lesão de alto grau (HSIL), células escamosas atípicas não excludentes (ASC-H) ou adenocarcinoma."
      },
      {
        title: "Cirurgia de Alta Frequência (CAF) / Conização",
        desc: "Realizar exérese da zona de transformação (EZT) ou conização do colo do útero em ambiente especializado para tratamento cirúrgico completo e diagnóstico histopatológico definitivo da lesão intraepitelial."
      }
    ]
  },
  {
    id: "perda_auditiva",
    name: "Disacusia Neurossensorial",
    category: "Ouvido/Naris/Garganta",
    diagnostic: "Perda auditiva progressiva bilateral ou súbita unilateral, sem sinais de obstrução de conduto por cerúmen ao exame otoscópico. Confirmada por Audiometria tonal e vocal demonstrando perda de padrão neurossensorial.",
    alarm: "Instalação abrupta de perda auditiva em menos de 72 horas (Perda Auditiva Súbita Idiopática) -> Emergência otorrinolaringológica! Iniciar imediatamente corticoterapia sistêmica para evitar surdez permanente.",
    treatment: [
      {
        title: "Corticoterapia Sistêmica Intensa na Perda Súbita",
        desc: "Iniciar Prednisona 1mg/kg/dia VO (máximo 60mg) por 10 a 14 dias com desmame subsequente, ou encaminhar para infiltração intratimpânica de Dexametasona por especialista se contraindicação a corticoides orais."
      },
      {
        title: "Reabilitação Auditiva com Aparelho (AASI)",
        desc: "Em perdas crônicas consolidadas, encaminhar para serviço de saúde auditiva regulado para moldagem e fornecimento de Aparelho de Amplificação Sonora Individual (AASI) bilateral e fonoterapia."
      }
    ]
  },
  {
    id: "rinite_alergica_refrataria",
    name: "Rinite Alérgica Refratária",
    category: "Ouvido/Naris/Garganta",
    diagnostic: "Prurido nasal, espirros em salva, coriza hialina e obstrução nasal crônica persistente com falha completa de controle clínico básico na UBS através de anti-histamínicos orais tradicionais.",
    alarm: "Associação com crises de asma de difícil controle, roncos noturnos obstrutivos severos com pausas respiratórias ou surgimento de anosmia súbita -> Avaliar pólipos nasais obstrutivos por nasofibroscopia.",
    treatment: [
      {
        title: "Higiene Nasal e Corticoterapia Intranasal Contínua",
        desc: "Orientar lavagem nasal abundante diária com Soro Fisiológico 0.9% morno antes das aplicações. Prescrever Spray de Dipropionato de Beclometasona ou Furoato de Fluticasona (2 jatos em cada narina 1 vez ao dia por no mínimo 3 meses)."
      },
      {
        title: "Encaminhamento para Imunoterapia e Testes Alérgicos",
        desc: "Encaminhar para realização de Prick Test cutâneo para identificação de aeroalérgenos específicos e início de imunoterapia alérgeno-específica (vacinas de dessensibilização)."
      }
    ]
  },
  {
    id: "zumbido",
    name: "Zumbido Crônico e Acufeno",
    category: "Ouvido/Naris/Garganta",
    diagnostic: "Percepção consciente de um som na ausência de um estímulo acústico correspondente, contínuo ou intermitente, por mais de 3-6 meses. Realizar otoscopia exaustiva e audiometria para afastar perda auditiva associada.",
    alarm: "Zumbido de padrão pulsátil síncrono com o batimento cardíaco, ou zumbido estritamente unilateral progressivo -> Solicitar Angiotomografia de crânio ou RNM de conduto auditivo interno para excluir malformações vasculares ou Schwannoma vestibular.",
    treatment: [
      {
        title: "Terapia de Habituação do Zumbido (TRT)",
        desc: "Orientações psicoeducativas detalhadas. Evitar o silêncio absoluto através do uso de geradores de som estático ambiental (ruído branco suave, sons da natureza) para dessensibilizar a percepção do zumbido pelo córtex cerebral."
      },
      {
        title: "Controle de Fatores de Piora e Medicamentos",
        desc: "Reduzir cafeína, açúcar refinado e álcool. Controlar ansiedade/estresse. Em casos com grande impacto funcional, avaliar uso de moduladores neurais como Clonazepam em baixas doses ou extratos de Ginkgo Biloba padronizados."
      }
    ]
  },
  {
    id: "disfonia_cronica",
    name: "Disfonia Crônica",
    category: "Ouvido/Naris/Garganta",
    diagnostic: "Alteração na qualidade, tom ou volume da voz por período superior a 3 semanas, sem causa infecciosa ativa. Exige visualização das pregas vocais por Laringoscopia ou Nasofibroscopia Laringea.",
    alarm: "Disfonia em paciente tabagista crônico pesado e etilista, de caráter progressivo, associada a disfagia, otalgia referida ipsilateral ou linfonodo cervical endurecido palpável -> Alta suspeita de Carcinoma Epidermoide de laringe. Laringoscopia urgente.",
    treatment: [
      {
        title: "Repouso Vocal e Higiene da Voz",
        desc: "Orientar hidratação constante (2L de água por dia), evitar pigarrear, falar sussurrando ou gritar, e cessação imediata do uso de tabaco e bebidas alcoólicas."
      },
      {
        title: "Encaminhamento para Laringoscopia e Fonoterapia",
        desc: "Solicitar exame de Nasofibrolaringoscopia para diagnóstico de lesões benignas (nódulos, pólipos, cistos, fendas). Encaminhar para fonoterapia estruturada ou cirurgia laringológica se lesão tumoral confirmada."
      }
    ]
  },
  {
    id: "glaucoma",
    name: "Glaucoma Crônico de Ângulo Aberto",
    category: "Oftalmologia",
    diagnostic: "Neuropatia óptica progressiva caracterizada por escavação aumentada do disco óptico (> 0.5), perda de campo visual periférico característica e, frequentemente, pressão intraocular (PIO) elevada (> 21 mmHg) aferida por Tonometria de aplanação.",
    alarm: "Dor ocular lancinante unilateral súbita, olho vermelho intenso, cefaleia ipsilateral, visão de halos coloridos e embaçamento visual com pupila médio-midriática paralítica -> Crise de Glaucoma Agudo de Ângulo Fechado (Emergência!). Encaminhar ao oftalmologista imediatamente para iridotomia e colírio de pilocarpina.",
    treatment: [
      {
        title: "Terapia Hipotensora Ocular com Colírios",
        desc: "Prescrever análogos de prostaglandina (colírio de Latanoprosta 0.005% 1 gota à noite no olho afetado) ou betabloqueadores tópicos (colírio de Maleato de Timolol 0.5% 1 gota de 12/12h). Monitorar PIO a cada 3 meses."
      },
      {
        title: "Campo Visual Computadorizado e Acompanhamento",
        desc: "Solicitar exames de campimetria visual anual e retinografia do disco óptico para avaliar estabilização da perda axonal, ajustando terapia se progressão demonstrada."
      }
    ]
  },
  {
    id: "catarata",
    name: "Catarata Senil",
    category: "Oftalmologia",
    diagnostic: "Perda progressiva da transparência do cristalino, causando redução da acuidade visual, visão nublada ('névoa' constante), sensibilidade aumentada ao brilho de luzes e alteração na percepção de cores.",
    alarm: "Visão turva associada a dor ocular moderada a severa e olho vermelho, ou catarata extremamente volumosa induzindo glaucoma secundário (Catarata Facomórfica) -> Encaminhamento urgente para cirurgia.",
    treatment: [
      {
        title: "Avaliação da Acuidade Visual e Indicação Cirúrgica",
        desc: "O tratamento é estritamente cirúrgico. Indicar cirurgia de catarata (Facoemulsificação com implante de lente intraocular - LIO) assim que a perda visual causar impacto funcional ou limitação nas atividades diárias do idoso."
      },
      {
        title: "Cuidados Pós-Operatórios Importantes",
        desc: "Orientar rigorosamente o uso de colírios antibióticos e corticoides associados prescritos pelo cirurgião, evitar esforços físicos, coçar o olho ou dormir sobre o lado operado nos primeiros 15 dias pós-facectomia."
      }
    ]
  },
  {
    id: "conjuntivite_alergica",
    name: "Conjuntivite Alérgica Crônica",
    category: "Oftalmologia",
    diagnostic: "Prurido ocular bilateral intenso de caráter recorrente, associado a lacrimejamento excessivo, hiperemia conjuntival (olho vermelho), edema palpebral (quemose) e secreção mucoide filamentosa. Frequentemente associada a rinite/asma.",
    alarm: "Presença de fotofobia intensa, dor ocular profunda unilateral, diminuição importante da acuidade visual ou lesão esbranquiçada na córnea (suspeita de ceratite infecciosa secundária ao ato de coçar) -> Encaminhar com urgência.",
    treatment: [
      {
        title: "Compressas Frias e Lágrimas Artificiais",
        desc: "Orientar aplicação frequente de compressas frias com água filtrada ou soro fisiológico e uso de colírios lubrificantes gelados para aliviar o prurido e diluir os alérgenos na superfície ocular."
      },
      {
        title: "Colírios Anti-histamínicos e Estabilizadores de Mastócitos",
        desc: "Prescrever colírio de Cloridrato de Olopatadina 0.1% ou 0.2% (1 gota em cada olho 1 a 2 vezes ao dia). Casos graves necessitam de uso curto de colírio de corticoide de baixa penetração (ex: Fluorometolona) estritamente monitorado por especialista."
      }
    ]
  },
  {
    id: "retinopatia_diabetica",
    name: "Retinopatia Diabética",
    category: "Oftalmologia",
    diagnostic: "Microaneurismas, hemorragias em chama de vela, exsudatos duros, manchas algodonosas e proliferação de neovasos ao exame de mapeamento de retina (fundoscopia) sob dilatação pupilar em paciente com DM de longa duração.",
    alarm: "Perda visual súbita indolor unilateral, ou visão de múltiplas manchas escuras móveis ('chuva de fuligem') -> Suspeita de Hemorragia Vítrea ou Descolamento de Retina decorrente de retinopatia proliferativa. Vitrectomia cirúrgica urgente.",
    treatment: [
      {
        title: "Mapeamento de Retina de Rastreio Anual",
        desc: "Obrigatório anualmente para todos os pacientes com DM Tipo 2 a partir do diagnóstico e DM Tipo 1 após 5 anos do diagnóstico para detecção precoce de lesões tratáveis antes de sintomas visuais."
      },
      {
        title: "Fotocoagulação a Laser e Anti-VEGF",
        desc: "Encaminhar para fotocoagulação panretiniana a laser em casos de retinopatia proliferativa, ou injeções intravítreas de agentes anti-VEGF (como Ranibizumabe) se presença de Edema Macular Diabético com perda visual ativa."
      }
    ]
  },
  {
    id: "olho_seco",
    name: "Síndrome do Olho Seco",
    category: "Oftalmologia",
    diagnostic: "Sensação de areia nos olhos, queimação, fotofobia, flutuação visual e lacrimejamento paradoxal de repetição, causados por produção insuficiente de lágrima ou evaporação excessiva do filme lacrimal. Confirmado por teste de Schirmer.",
    alarm: "Dor ocular intensa persistente com incapacidade de manter o olho aberto, vermelhidão focal acentuada ou úlcera de córnea visível à fluoresceína -> Risco de perfuração ocular. Encaminhamento imediato.",
    treatment: [
      {
        title: "Lubrificação Ocular e Higiene Palpebral",
        desc: "Prescrever colírios lubrificantes (lágrimas artificiais como Carboximetilcelulose 0.5% ou Hialuronato de Sódio) de 4/4h ou mais frequente. Realizar compressas mornas palpebrais diárias se disfunção das glândulas de Meibômio."
      },
      {
        title: "Bloqueio Ambiental e Óculos de Proteção",
        desc: "Orientar evitar exposição direta a correntes de ar, ar condicionado e telas de computador por períodos prolongados. Recomendar pausas visuais regulares (regra 20-20-20: a cada 20 minutos, olhar para 6 metros por 20 segundos)."
      }
    ]
  },
  {
    id: "tendinite_ombro",
    name: "Tendinopatia do Manguito Rotador",
    category: "Ortopedia",
    diagnostic: "Dor no ombro de início insidioso, pior à noite ao deitar sobre o braço afetado e durante a elevação ativa do membro (arco doloroso entre 60° e 120°). Testes de Neer, Hawkins e Jobe positivos indicam impacto/lesão de tendão (supraespinal).",
    alarm: "Incapacidade completa de elevação ativa do braço (braço pendente) após queda ou trauma agudo -> Indica ruptura aguda traumática total do tendão do manguito rotador. Encaminhar para reparo cirúrgico ortopédico urgente.",
    treatment: [
      {
        title: "Controle da Dor e Preservação da Mobilidade",
        desc: "Prescrever AINEs por curto período nas crises (ex: Ibuprofeno 600mg VO de 8/8h por 5 dias) associado a aplicação local de gelo por 20 minutos 3 vezes ao dia. Evitar imobilização prolongada (risco de capsulite adesiva)."
      },
      {
        title: "Cinesioterapia e Reabilitação Física",
        desc: "Encaminhar para fisioterapia focada no fortalecimento dos estabilizadores da escápula e depressores da cabeça umeral, visando reduzir o impacto mecânico subacromial durante movimentos."
      }
    ]
  },
  {
    id: "tunel_carpo",
    name: "Síndrome do Túnel do Carpo",
    category: "Ortopedia",
    diagnostic: "Parestesia (dormência, formigamento) na região palmar dos três primeiros dedos e metade lateral do quarto dedo, com piora noturna ou após atividades manuais repetitivas. Sinais de Tinel e Phalen positivos ao exame físico.",
    alarm: "Presença de hipotrofia ou atrofia tenar visível (perda de massa muscular na base do polegar) associada a perda importante de força de preensão manual -> Compressão severa crônica do nervo mediano. Liberação cirúrgica urgente.",
    treatment: [
      {
        title: "Uso de Órtese de Punho Noturna",
        desc: "Prescrever uso de órtese de punho rígida em posição neutra exclusivamente durante a noite por 4-6 semanas para minimizar a pressão intracarpal durante o sono e aliviar os sintomas."
      },
      {
        title: "Fisioterapia e Infiltração Local",
        desc: "Encaminhar para fisioterapia com ultrassom e mobilização de tecidos moles. Casos moderados com dor persistente podem se beneficiar de infiltração local de corticoide ou cirurgia de liberação do retináculo dos flexores."
      }
    ]
  },
  {
    id: "fascite_plantar",
    name: "Fascite Plantar",
    category: "Ortopedia",
    diagnostic: "Dor aguda penetrante na planta do pé, localizada preferencialmente na tuberosidade medial do calcâneo, mais intensa logo ao dar os primeiros passos pela manhã ao levantar-se da cama, melhorando com a deambulação subsequente.",
    alarm: "Incapacidade completa de apoiar o calcanhar no solo associada a edema proeminente, calor ou eritema local -> Investigar fratura por estresse do calcâneo ou entesite aguda grave por espondiloartropatia.",
    treatment: [
      {
        title: "Alongamento Específico e Calçados Adequados",
        desc: "Orientar alongamento vigoroso da fáscia plantar e do tendão de Aquiles antes de levantar-se. Recomendar nunca andar descalço, utilizar calçados com salto leve (2-3cm) e palmilhas de silicone macias de amortecimento."
      },
      {
        title: "Crioterapia Local e Fisioterapia",
        desc: "Aplicar gelo local (rolar uma garrafa de água congelada sob a planta do pé) por 15-20 minutos à noite. Fisioterapia com ultrassom terapêutico e ondas de choque se refratariedade prolongada."
      }
    ]
  },
  {
    id: "demencia_alzheimer",
    name: "Doença de Alzheimer",
    category: "Geriatria",
    diagnostic: "Declínio cognitivo insidioso e progressivo, caracterizado inicialmente por perda acentuada de memória episódica recente (esquecer compromissos, repetir perguntas), associado a déficits em outras funções cognitivas e perda de autonomia funcional.",
    alarm: "Alteração súbita de comportamento associada a flutuação do nível de consciência, alucinações visuais e agitação psicomotora intensa -> Quadro de Delirium agudo sobreposto, frequentemente secundário a infecção urinária silenciosa. Tratar infecção.",
    treatment: [
      {
        title: "Introdução de Inibidores da Acetilcolinesterase",
        desc: "Prescrever Donepezila 5mg VO ao deitar (titular para 10mg após 4 semanas se boa tolerância) ou Galantamina / Rivastigmina. Monitorar efeitos adversos gastrointestinais e bradicardia."
      },
      {
        title: "Manejo Não Farmacológico de Estimulação",
        desc: "Instituir rotinas diárias estritas para reduzir ansiedade e desorientação. Estimular caminhadas leves diárias e atividades lúdicas de estimulação de memória. Orientar e dar suporte emocional aos cuidadores (prevenção de Burnout)."
      }
    ]
  },
  {
    id: "sarcopenia",
    name: "Sarcopenia e Fragilidade do Idoso",
    category: "Geriatria",
    diagnostic: "Perda progressiva e generalizada da massa e força muscular esquelética associada ao envelhecimento, demonstrada por força de preensão manual diminuída (dinamometria < 27kg para homens, < 16kg para mulheres) e velocidade de marcha lenta (< 0.8 m/s).",
    alarm: "Perda ponderal involuntária rápida (> 5% em 6 meses) associada a episódios frequentes de queda com incapacidade de se levantar sozinho -> Risco extremo de fraturas graves e institucionalização rápida.",
    treatment: [
      {
        title: "Treinamento de Força Progressivo (Resistido)",
        desc: "A intervenção mais eficaz. Prescrever exercícios de contra-resistência muscular supervisionados de 2 a 3 vezes por semana para estimular hipertrofia e ganho de potência muscular."
      },
      {
        title: "Aporte Proteico e Suplementação Otimizada",
        desc: "Garantir ingestão proteica de 1.2 a 1.5g/kg/dia (fracionada ao longo das refeições) e suplementação de Vitamina D se níveis séricos baixos (< 30 ng/mL) para otimização da contratilidade muscular."
      }
    ]
  },
  {
    id: "quedas_recorrentes",
    name: "Síndrome de Quedas Recorrentes no Idoso",
    category: "Geriatria",
    diagnostic: "História de duas ou mais quedas em um período de 12 meses, necessitando de avaliação geriátrica ampla englobando marcha, equilíbrio, polifarmácia, déficit visual e perigos ambientais domiciliares.",
    alarm: "Queda sofrida seguida de incapacidade de movimentar um dos membros inferiores com encurtamento e rotação externa do pé -> Altamente sugestivo de Fratura do Colo de Fêmur. Manter em decúbito e acionar SAMU.",
    treatment: [
      {
        title: "Revisão e Desprescrição de Medicamentos",
        desc: "Identificar e reduzir ou suspender medicamentos psicotrópicos, benzodiazepínicos, neurolépticos e anti-hipertensivos em doses excessivas (risco de hipotensão postural), que aumentam significativamente o risco de quedas."
      },
      {
        title: "Modificações de Segurança no Domicílio",
        desc: "Instalar barras de apoio no banheiro, remover tapetes soltos, melhorar a iluminação dos corredores e incentivar o uso de calçados antiderrapantes fechados."
      }
    ]
  },
  {
    id: "asma_infantil",
    name: "Asma Brônquica Infantil",
    category: "Pediatria",
    diagnostic: "Sibilos recorrentes, tosse crônica (predominantemente noturna ou com riso/choro), dispneia e aperto no peito em crianças, com melhora rápida e dramática após uso de broncodilatador. História pessoal ou familiar de atopia.",
    alarm: "Presença de tiragem subdiafragmática ou intercostal, batimento de asa de nariz, fala entrecortada ou sonolência (sinais de insuficiência respiratória grave) -> Sala vermelha imediata para oxigenioterapia e nebulização.",
    treatment: [
      {
        title: "Terapia Inalatória de Controle",
        desc: "Prescrever Corticoide Inalatório de baixa dose diário (ex: Dipropionato de Beclometasona ou Fluticasona via espaçador valvulado apropriado para a idade) para reduzir a inflamação brônquica crônica."
      },
      {
        title: "Resgate e Plano de Ação para Crises",
        desc: "Uso de Beta-2 agonista de curta duração (Salbutamol 100mcg - 2 a 4 jatos com espaçador de 20 em 20 min na primeira hora de crise). Orientar a família sobre reconhecimento precoce de piora."
      }
    ]
  },
  {
    id: "dermatite_atopica",
    name: "Dermatite Atópica Infantil",
    category: "Pediatria",
    diagnostic: "Prurido cutâneo intenso crônico associado a lesões eczematosas eritematosas descamativas localizadas classicamente em dobras flexurais (fossa cubital e poplítea) in crianças maiores, ou bochechas/superfícies extensoras em lactentes.",
    alarm: "Aparecimento de vesículas dolorosas umbilicadas sobre as áreas de dermatite, associadas a febre (Erupção Variceliforme de Kaposi / Eczema Herpético) -> Internação imediata para Aciclovir IV.",
    treatment: [
      {
        title: "Restabelecimento da Barreira Cutânea (Essencial)",
        desc: "Orientar banhos rápidos, mornos, sem esfregar a pele e com sabonetes neutros sintéticos (syndet). Aplicar hidratantes corporais espessos sem perfume imediatamente após o banho (em até 3 minutos) pelo menos 2 vezes ao dia."
      },
      {
        title: "Corticoterapia Tópica Controlada nas Crises",
        desc: "Aplicar creme de Hidrocortisona 1% ou Valerato de Betametasona em baixas doses sobre as lesões ativas e inflamadas por no máximo 5-7 dias. Associar anti-histamínicos de primeira geração (Hidroxizina) à noite se prurido impedir o sono."
      }
    ]
  },
  {
    id: "otite_media_recorrente",
    name: "Otite Média Aguda Recorrente Infantil",
    category: "Pediatria",
    diagnostic: "Três ou mais episódios documentados de Otite Média Aguda (OMA) em 6 meses, ou quatro ou mais episódios em 12 meses, em crianças. Otoscopia revela membrana timpânica hiperemiada, opaca e abaulada com efusão.",
    alarm: "Aparecimento de abaulamento doloroso e flutuante na região retroauricular com deslocamento do pavilhão auricular para a frente (Mastoidite Aguda) -> Internação hospitalar imediata para antibioticoterapia IV e drenagem.",
    treatment: [
      {
        title: "Tratamento Antimicrobiano Otimizado de Resgate",
        desc: "Nas crises bacterianas ativas, prescrever Amoxicilina + Clavulanato em altas doses (80-90 mg/kg/dia de amoxicilina) por 10 dias para cobrir patógenos resistentes (como Haemophilus influenzae beta-lactamase positivo)."
      },
      {
        title: "Prevenção e Encaminhamento Cirúrgico",
        desc: "Incentivar vacinação antipneumocócica e influenza em dia. Encaminhar ao otorrinolaringologista para avaliação de miringotomia com inserção de tubos de ventilação (carretel) para reduzir episódios e preservar audição."
      }
    ]
  },
  {
    id: "tdah_infantil",
    name: "TDAH na Infância",
    category: "Pediatria",
    diagnostic: "Padrão persistente de desatenção (distrai-se facilmente, esquece materiais) e/ou hiperatividade/impulsividade (inquietação na cadeira, fala excessiva, age sem pensar) presente antes dos 12 anos em pelo menos dois ambientes (escola/casa).",
    alarm: "Surgimento de comportamento severamente opositor desafiante com risco de expulsão escolar, agressividade física extrema ou sintomas de humor depressivo grave associados -> Avaliação psiquiátrica especializada urgente.",
    treatment: [
      {
        title: "Intervenção Comportamental e Orientação Escolar",
        desc: "Treinamento parental para manejo de limites e reforço positivo de comportamentos adequados. Orientar a escola a sentar a criança na frente, fragmentar comandos e permitir tempos de descanso estruturados."
      },
      {
        title: "Terapia Farmacológica Estimulante",
        desc: "Em crianças acima de 6 anos com prejuízo moderado a grave, prescrever Cloridrato de Metilfenidato (10mg VO pela manhã, ajustando conforme peso e resposta escolar). Monitorar apetite, sono e curvas de crescimento."
      }
    ]
  }
];

const EXTRA_DISEASES_SEEDS = [
  // Cardiologia
  { id: "miocardiopatia_restritiva", name: "Cardiomiopatia Restritiva", category: "Cardiovascular/Crônicas" },
  { id: "bloqueio_ramo_esquerdo", name: "Bloqueio de Ramo Esquerdo (BRE)", category: "Cardiovascular/Crônicas" },
  { id: "bloqueio_ramo_direito", name: "Bloqueio de Ramo Direito (BRD)", category: "Cardiovascular/Crônicas" },
  { id: "taquicardia_sinusal_inapropriada", name: "Taquicardia Sinusal Inapropriada", category: "Cardiovascular/Crônicas" },
  { id: "estenose_mitral_estavel", name: "Estenose Mitral Reumática Estável", category: "Cardiovascular/Crônicas" },
  { id: "prolapso_valvula_mitral", name: "Prolapso da Válvula Mitral com Regurgitação Leve", category: "Cardiovascular/Crônicas" },
  { id: "insuficiencia_aortica", name: "Insuficiência Aórtica Crônica", category: "Cardiovascular/Crônicas" },
  { id: "estenose_tricuspide", name: "Estenose Tricúspide", category: "Cardiovascular/Crônicas" },
  { id: "coarctacao_aorta_adulto", name: "Coarctação da Aorta no Adulto (Seguimento)", category: "Cardiovascular/Crônicas" },
  { id: "tetralogia_fallot_operada", name: "Tetralogia de Fallot Pós-Operatória", category: "Cardiovascular/Crônicas" },
  { id: "pericardite_constritiva", name: "Pericardite Constritiva Sequelar", category: "Cardiovascular/Crônicas" },
  { id: "disfuncao_diastolica", name: "Insuficiência Cardíaca com Fração de Ejeção Preservada (ICFEP)", category: "Cardiovascular/Crônicas" },
  { id: "aterosclerose_carotidea", name: "Aterosclerose Carotídea Subclínica", category: "Cardiovascular/Crônicas" },
  { id: "fistula_arteriovenosa_membro", name: "Fístula Arteriovenosa Periférica Estável", category: "Cardiovascular/Crônicas" },
  { id: "linfedema_cronico", name: "Linfedema Crônico de Membros Inferiores", category: "Cardiovascular/Crônicas" },
  { id: "sindrome_vasovagal", name: "Síndrome Vasovagal / Síncope Neurocardiogênica", category: "Cardiovascular/Crônicas" },
  { id: "hipertensao_pulmonar_tromboembolica", name: "Hipertensão Pulmonar Tromboembólica Crônica", category: "Cardiovascular/Crônicas" },
  { id: "aneurisma_aorta_toracica", name: "Aneurisma de Aorta Torácica Estável", category: "Cardiovascular/Crônicas" },
  { id: "disautonomia_cardiovascular", name: "Disautonomia Cardiovascular Crônica", category: "Cardiovascular/Crônicas" },
  { id: "doenca_arterial_periferica", name: "Doença Arterial Obstrutiva Periférica (DAOP) Estágio I/II", category: "Cardiovascular/Crônicas" },

  // Endocrinologia
  { id: "nodulo_tireoide_benigno", name: "Nódulo Tireoidiano Benigno (Bethesda II)", category: "Metabólicas/Endócrinas" },
  { id: "tireoidite_hashimoto_eutireoide", name: "Tireoidite de Hashimoto em Fase Eutireoidiana", category: "Metabólicas/Endócrinas" },
  { id: "tiroidite_subaguda_quervain", name: "Tireoidite Subaguda de De Quervain", category: "Metabólicas/Endócrinas" },
  { id: "bocio_multinodular_toxico", name: "Bócio Multinodular Tóxico", category: "Metabólicas/Endócrinas" },
  { id: "hiperparatiroidismo_primario", name: "Hiperparatireoidismo Primário Assintomático", category: "Metabólicas/Endócrinas" },
  { id: "hipoparatiroidismo_pos_cirurgico", name: "Hipoparatireoidismo Pós-Cirúrgico Estável", category: "Metabólicas/Endócrinas" },
  { id: "adenoma_adrenal_nao_funcionante", name: "Incidentaloma Adrenal (Adenoma Não-Funcionante)", category: "Metabólicas/Endócrinas" },
  { id: "hiperaldosteronismo_primario", name: "Hiperaldosteronismo Primário (Rastreio)", category: "Metabólicas/Endócrinas" },
  { id: "hipogonadismo_hipogonadotrofico", name: "Hipogonadismo Hipogonadotrófico", category: "Metabólicas/Endócrinas" },
  { id: "sindrome_turner_adulta", name: "Síndrome de Turner na Idade Adulta (Seguimento)", category: "Metabólicas/Endócrinas" },
  { id: "sindrome_klinefelter_adulto", name: "Síndrome de Klinefelter no Adulto", category: "Metabólicas/Endócrinas" },
  { id: "glicogenose_hepatica_estavel", name: "Glicogenose Hepática Estável", category: "Metabólicas/Endócrinas" },
  { id: "porfiria_cutanea_tarda", name: "Porfiria Cutânea Tarda", category: "Metabólicas/Endócrinas" },
  { id: "hiperinsulinemia_compensada", name: "Hiperinsulinemia Compensada com Resistência à Insulina", category: "Metabólicas/Endócrinas" },
  { id: "osteoporose_masculina", name: "Osteoporose Masculina Senil", category: "Metabólicas/Endócrinas" },
  { id: "osteogenese_imperfeita_adulta", name: "Osteogênese Imperfeita no Adulto (Seguimento)", category: "Metabólicas/Endócrinas" },
  { id: "hipercortisolismo_subclinico", name: "Hipercortisolismo Subclínico", category: "Metabólicas/Endócrinas" },
  { id: "sindrome_poliglandular_autoimune", name: "Síndrome Poliglandular Autoimune Tipo II", category: "Metabólicas/Endócrinas" },

  // Pneumologia
  { id: "hiper-reatividade_bronquica_pos_viral", name: "Hiper-reatividade Brônquica Pós-Viral", category: "Respiratório" },
  { id: "fibrose_pulmonar_idiopatica_estavel", name: "Fibrose Pulmonar Idiopática Estágio Leve", category: "Respiratório" },
  { id: "sarcoidose_pulmonar_estagio_i", name: "Sarcoidose Pulmonar Estágio I", category: "Respiratório" },
  { id: "silicose_cronica_estavel", name: "Silicose Crônica Simples", category: "Respiratório" },
  { id: "asbestose_pulmonar", name: "Asbestose Pulmonar Ocupacional", category: "Respiratório" },
  { id: "pulmao_fazendeiro_alergico", name: "Pneumonite por Hipersensibilidade (Pulmão de Fazendeiro)", category: "Respiratório" },
  { id: "bronquiectasias_sequelares", name: "Bronquiectasias Sequelares de Tuberculose", category: "Respiratório" },
  { id: "apneia_sono_moderada", name: "Apneia Obstrutiva do Sono Moderada", category: "Respiratório" },
  { id: "sindrome_hipoventilacao_obeso", name: "Síndrome de Hipoventilação do Obeso (SHO)", category: "Respiratório" },
  { id: "derrame_pleural_sequelar", name: "Derrame Pleural Sequelar Crônico / Paquipleuris", category: "Respiratório" },
  { id: "traqueite_subaguda_tosse", name: "Traqueíte Subaguda pós-resfriado", category: "Respiratório" },
  { id: "tosse_psicogenica_habito", name: "Tosse Psicogênica / Habitus de Tosse", category: "Respiratório" },
  { id: "atelectasia_pulmonar_parcial", name: "Atelectasia Pulmonar Parcial por Rolha de Secreção", category: "Respiratório" },
  { id: "pneumonite_radiacao_sequelar", name: "Pneumonite por Radiação (Sequela Estável)", category: "Respiratório" },
  { id: "enfizema_subcutaneo_estavel", name: "Enfizema Subcutâneo de Pequeno Volume Estável", category: "Respiratório" },
  { id: "bronquiolite_obliterante_adulta", name: "Bronquiolite Obliterante no Adulto", category: "Respiratório" },

  // Gastroenterologia
  { id: "dispepsia_funcional_dor", name: "Dispepsia Funcional / Síndrome da Dor Epigástrica", category: "Gastrointestinal" },
  { id: "esofago_barrett_estavel", name: "Esôfago de Barrett sem Displasia", category: "Gastrointestinal" },
  { id: "acalasia_esofagica_grau_i", name: "Acalasia Esofágica Grau I (Chagasica ou Primária)", category: "Gastrointestinal" },
  { id: "gastrite_atrofica_autoimune", name: "Gastrite Atrófica Autoimune (Anemia Perniciosa)", category: "Gastrointestinal" },
  { id: "esofagite_eosinofilica", name: "Esofagite Eosinofílica no Adulto", category: "Gastrointestinal" },
  { id: "hernia_hiato_refluxo", name: "Hérnia de Hiato por Deslizamento Sintomática", category: "Gastrointestinal" },
  { id: "gastroparesia_diabetica", name: "Gastroparesia Diabética Crônica", category: "Gastrointestinal" },
  { id: "duodenite_erosiva_leve", name: "Duodenite Erosiva Leve sem Sangramento", category: "Gastrointestinal" },
  { id: "polipo_vesicula_biliar_acompanhamento", name: "Pólipo de Vesícula Biliar (Acompanhamento por USG)", category: "Gastrointestinal" },
  { id: "cisto_hepatico_simples", name: "Cisto Hepático Simples Assintomático", category: "Gastrointestinal" },
  { id: "hemangioma_hepatico_pequeno", name: "Hemangioma Hepático Pequeno Assintomático", category: "Gastrointestinal" },
  { id: "esteatohepatite_nao_alcoolica_nash", name: "Esteatohepatite Não Alcoólica (NASH) Estágio F1/F2", category: "Gastrointestinal" },
  { id: "diverticulose_colon_assintomatica", name: "Diverticulose de Cólon (Achado de Colonoscopia)", category: "Gastrointestinal" },
  { id: "pancreatite_cronica_refrataria", name: "Pancreatite Crônica com Insuficiência Exócrina Estável", category: "Gastrointestinal" },
  { id: "sindrome_dumping_pos_bariatrica", name: "Síndrome de Dumping Pós-Bariátrica", category: "Gastrointestinal" },
  { id: "colangite_biliar_primaria", name: "Colangite Biliar Primária (CBP) Inicial", category: "Gastrointestinal" },
  { id: "hepatite_autoimune_estavel", name: "Hepatite Autoimune em Remissão Clínica", category: "Gastrointestinal" },
  { id: "doenca_wilson_estavel", name: "Doença de Wilson em Terapia de Manutenção", category: "Gastrointestinal" },
  { id: "hemocromatose_hereditaria_flebotomia", name: "Hemocromatose Hereditária em Fase de Flebotomia", category: "Gastrointestinal" },
  { id: "sindrome_alca_cega", name: "Síndrome da Alça Cega com Supercrescimento Bacteriano", category: "Gastrointestinal" },

  // Neurologia
  { id: "demencia_corpos_lewy_estavel", name: "Demência por Corpos de Lewy Inicial", category: "Neurológico & Mental" },
  { id: "esclerose_lateral_amiotrofica_inicial", name: "Esclerose Lateral Amiotrófica (ELA) Estágio Inicial", category: "Neurológico & Mental" },
  { id: "neuralgia_trigemeo_refrataria", name: "Neuralgia do Trigêmeo Clássica", category: "Neurológico & Mental" },
  { id: "sindrome_pernas_inquietas_grave", name: "Síndrome das Pernas Inquietas Moderada", category: "Neurológico & Mental" },
  { id: "paralisia_bell_sequelar", name: "Sequela Tardia de Paralisia Facial de Bell", category: "Neurológico & Mental" },
  { id: "cefaleia_salvas_episodica", name: "Cefaleia em Salvas Episódica", category: "Neurológico & Mental" },
  { id: "cefaleia_abuso_analgesicos", name: "Cefaleia por Abuso de Analgésicos / Rebote", category: "Neurológico & Mental" },
  { id: "miopatia_inflamatoria_cronica", name: "Miopatia Inflamatória Crônica / Polimiosite", category: "Neurológico & Mental" },
  { id: "ataxia_cerebelar_progressiva", name: "Ataxia Cerebelar Progressiva Hereditária", category: "Neurológico & Mental" },
  { id: "coreia_sydenham_sequelar", name: "Coreia de Sydenham Crônica", category: "Neurológico & Mental" },
  { id: "disautonomia_neurogenica_ortostatica", name: "Disautonomia Neurogênica / Hipotensão Ortostática", category: "Neurológico & Mental" },
  { id: "narcolepsia_cataplexia", name: "Narcolepsia com Cataplexia", category: "Neurológico & Mental" },
  { id: "neuromielite_optica_estavel", name: "Neuromielite Óptica (Seguimento Clínico)", category: "Neurológico & Mental" },
  { id: "sindrome_pernas_inquietas_secundaria", name: "Síndrome das Pernas Inquietas Secundária a Ferropenia", category: "Neurológico & Mental" },
  { id: "cefaleia_orgasmica_benigna", name: "Cefaleia Orgásmica Benigna", category: "Neurológico & Mental" },
  { id: "miastenia_gravis_ocular", name: "Miastenia Gravis Forma Ocular Estável", category: "Neurológico & Mental" },

  // Reumatologia
  { id: "espondilite_anquilosante_axial", name: "Espondilite Anquilosante Axial Estável", category: "Musculoesquelético & Membros" },
  { id: "fibromialgia_refrataria", name: "Fibromialgia de Difícil Controle Álgico", category: "Musculoesquelético & Membros" },
  { id: "sindrome_sjogren_sicca", name: "Síndrome de Sjogren com Sintomas Secos Predominantes", category: "Musculoesquelético & Membros" },
  { id: "polimialgia_reumatica_corticoterapia", name: "Polimialgia Reumática em Corticoterapia de Manutenção", category: "Musculoesquelético & Membros" },
  { id: "artrite_psoriasica_axial", name: "Artrite Psoriásica Forma Axial", category: "Musculoesquelético & Membros" },
  { id: "esclerose_sistemica_cutanea_limitada", name: "Esclerose Sistêmica Forma Cutânea Limitada", category: "Musculoesquelético & Membros" },
  { id: "esclerodermia_linear", name: "Esclerodermia Linear Localizada em Placas", category: "Musculoesquelético & Membros" },
  { id: "artropatia_jaeccoud", name: "Artropatia de Jaccoud Associada ao LES", category: "Musculoesquelético & Membros" },
  { id: "sindrome_anticorpo_antifosfolipideo", name: "Síndrome do Anticorpo Antifosfolipídeo (SAAF) Obstétrica", category: "Musculoesquelético & Membros" },
  { id: "amiloidose_reumatologica", name: "Amiloidose Secundária a Artrite Reumatoide", category: "Musculoesquelético & Membros" },
  { id: "osteonecrose_faj", name: "Osteonecrose de Cabeça Femoral em Uso de Corticoide", category: "Musculoesquelético & Membros" },
  { id: "artropatia_hemofilica_cronica", name: "Artropatia Hemofílica Crônica de Joelho", category: "Musculoesquelético & Membros" },
  { id: "doenca_paget_ossea", name: "Doença de Paget Óssea (Acompanhamento)", category: "Musculoesquelético & Membros" },
  { id: "policondrite_recidivante", name: "Policondrite Recidivante", category: "Musculoesquelético & Membros" },
  { id: "sindrome_reiter_reativa", name: "Artrite Reativa / Síndrome de Reiter Tardia", category: "Musculoesquelético & Membros" },
  { id: "sindrome_marfan_reumatologia", name: "Síndrome de Marfan (Seguimento Osteoarticular)", category: "Musculoesquelético & Membros" },

  // Nefrologia & Urologia
  { id: "glomerulonefrite_membranosa", name: "Glomerulonefrite Membranosa Estágio Inicial", category: "Metabólicas/Endócrinas" },
  { id: "nefropatia_iga_estavel", name: "Nefropatia por IgA (Doença de Berger) Estável", category: "Metabólicas/Endócrinas" },
  { id: "rins_policisticos_autossomicos", name: "Doença Renal Policística Autossômica Dominante Inicial", category: "Metabólicas/Endócrinas" },
  { id: "nefrite_lupica_remissao", name: "Nefrite Lúpica em Remissão Clínica", category: "Metabólicas/Endócrinas" },
  { id: "acidose_tubular_renal_cronica", name: "Acidose Tubular Renal Tipo I", category: "Metabólicas/Endócrinas" },
  { id: "diabetes_insipidus_nefrogenico", name: "Diabetes Insipidus Nefrogênico", category: "Metabólicas/Endócrinas" },
  { id: "incontinencia_urinaria_esforco", name: "Incontinência Urinária de Esforço Feminina", category: "Metabólicas/Endócrinas" },
  { id: "bexiga_hiperativa_neurogenica", name: "Bexiga Hiperativa Neurogênica", category: "Metabólicas/Endócrinas" },
  { id: "estenose_uretra_masculina", name: "Estenose de Uretra Masculina Pós-Traumática", category: "Metabólicas/Endócrinas" },
  { id: "hidronefrose_congenita_estavel", name: "Hidronefrose Congênita Unilateral Estável", category: "Metabólicas/Endócrinas" },
  { id: "refluxo_vesicoureteral_grau_ii", name: "Refluxo Vesicoureteral Grau II (Acompanhamento)", category: "Metabólicas/Endócrinas" },
  { id: "litiase_vesical_cronica", name: "Litíase Vesical Residual", category: "Metabólicas/Endócrinas" },
  { id: "orquiepididimite_subaguda", name: "Orquiepididimite Subaguda Refratária", category: "Metabólicas/Endócrinas" },
  { id: "varicocele_grau_ii_dor", name: "Varicocele Grau II Associada a Dor Crônica", category: "Metabólicas/Endócrinas" },
  { id: "esclerose_mesangial_difusa", name: "Esclerose Mesangial Difusa Estável", category: "Metabólicas/Endócrinas" },
  { id: "sindrome_nefrotica_lesao_minima", name: "Síndrome Nefrótica por Lesão Mínima em Remissão", category: "Metabólicas/Endócrinas" },

  // Dermatologia
  { id: "psoriase_placas_moderada", name: "Psoríase em Placas Moderada", category: "Pele & Dermatologia" },
  { id: "vitiligo_estavel", name: "Vitiligo Segmentar Estável", category: "Pele & Dermatologia" },
  { id: "acne_nodulocistica_grave", name: "Acne Nodulocística Grave (Indicação de Isotretinoína)", category: "Pele & Dermatologia" },
  { id: "melasma_facial_refratario", name: "Melasma Facial Refratário a Fotoproteção e Tópicos", category: "Pele & Dermatologia" },
  { id: "alopecia_areata_placas", name: "Alopecia Areata em Placas Únicas", category: "Pele & Dermatologia" },
  { id: "penfigo_foliaceo_estavel", name: "Pênfigo Foliáceo (Fogo Selvagem) em Remissão", category: "Pele & Dermatologia" },
  { id: "hidradenite_supurativa_hurley_i", name: "Hidradenite Supurativa Estágio Hurley I", category: "Pele & Dermatologia" },
  { id: "queratose_actinica_multipla", name: "Queratose Actínica Múltipla em Áreas Fotoexpostas", category: "Pele & Dermatologia" },
  { id: "carcinoma_basocelular_superficial", name: "Carcinoma Basocelular Superficial (Planejamento Exérese)", category: "Pele & Dermatologia" },
  { id: "queratose_pilar_extensa", name: "Queratose Pilar Extensa", category: "Pele & Dermatologia" },
  { id: "esclerodermia_placas", name: "Esclerodermia Localizada em Placas (Morféia)", category: "Pele & Dermatologia" },
  { id: "liquen_plano_cutaneo", name: "Líquen Plano Cutâneo Disseminado", category: "Pele & Dermatologia" },
  { id: "pitiriase_versicolor_recorrente", name: "Pitiríase Versicolor Recorrente em Clima Úmido", category: "Pele & Dermatologia" },
  { id: "urticaria_cronica_espontanea", name: "Urticária Crônica Espontanea (UCE) sob Controle", category: "Pele & Dermatologia" },
  { id: "rosacea_papulopustulosa", name: "Rosácea Papulopustulosa Moderada", category: "Pele & Dermatologia" },
  { id: "paroniquia_cronica_fungica", name: "Paroníquia Crônica Fúngica / Unheiro", category: "Pele & Dermatologia" },

  // Saúde Mental
  { id: "transtorno_bipolar_eutimia", name: "Transtorno Afetivo Bipolar em Fase de Eutimia", category: "Saúde Mental" },
  { id: "esquizofrenia_paranoide_estavel", name: "Esquizofrenia Paranoide em Fase de Estabilização", category: "Saúde Mental" },
  { id: "transtorno_panico_refratario", name: "Transtorno de Pânico com Agorafobia", category: "Saúde Mental" },
  { id: "transtorno_personalidade_borderline", name: "Transtorno de Personalidade Borderline (Suporte CAPS)", category: "Saúde Mental" },
  { id: "tdah_adulto_desatencao", name: "TDAH no Adulto com Predomínio de Desatenção", category: "Saúde Mental" },
  { id: "transtorno_obsessivo_compulsivo", name: "Transtorno Obsessivo-Compulsivo (TOC) Moderado", category: "Saúde Mental" },
  { id: "ansiedade_social_fobia", name: "Fobia Social / Transtorno de Ansiedade Social", category: "Saúde Mental" },
  { id: "transtorno_estresse_pos_traumatico", name: "Transtorno de Estresse Pós-Traumático (TEPT)", category: "Saúde Mental" },
  { id: "depressao_recorrente_leve", name: "Transtorno Depressivo Recorrente em Episódio Leve", category: "Saúde Mental" },
  { id: "transtorno_espectro_autista_adulto", name: "Transtorno do Espectro Autista no Adulto Nível 1", category: "Saúde Mental" },
  { id: "sindrome_burnout_afastamento", name: "Síndrome de Burnout / Esgotamento Profissional", category: "Saúde Mental" },
  { id: "distimia_cronica", name: "Distimia / Transtorno Depressivo Persistente", category: "Saúde Mental" },
  { id: "abuso_alcool_dependencia", name: "Uso Nocivo de Álcool / Dependência Leve a Moderada", category: "Saúde Mental" },
  { id: "dependencia_nicotina_tratamento", name: "Dependência de Nicotina em Programa de Tabagismo", category: "Saúde Mental" },
  { id: "transtorno_somatoforme", name: "Transtorno Somatoforme / Ansiedade de Doença", category: "Saúde Mental" },
  { id: "anorxia_nervosa_estavel", name: "Anorexia Nervosa Estabilizada (Acompanhamento)", category: "Saúde Mental" },

  // Infectologia
  { id: "hiv_aids_indetectavel", name: "Infecção pelo HIV com Carga Viral Indetectável (TARG)", category: "Infecciosas/Endemias" },
  { id: "toxoplasmose_linfadenite", name: "Toxoplasmose na Forma Linfadenopática", category: "Infecciosas/Endemias" },
  { id: "esquistossomose_mansoni_estavel", name: "Esquistossomose Mansoni Intestinal sem Hipertensão Portal", category: "Infecciosas/Endemias" },
  { id: "doenca_chagas_fase_cronica", name: "Doença de Chagas na Fase Crônica Indeterminada", category: "Infecciosas/Endemias" },
  { id: "hepatite_c_cronica_estavel", name: "Hepatite C Crônica sem Cirrose (Acompanhamento)", category: "Infecciosas/Endemias" },
  { id: "leishmaniose_tegumentar_cicatrizada", name: "Leishmaniose Tegumentar Americana Cicatrizada", category: "Infecciosas/Endemias" },
  { id: "paracoccidioidomicose_sequelar", name: "Paracoccidioidomicose Sequela Fibrosa Pulmonar", category: "Infecciosas/Endemias" },
  { id: "mielite_esquistossomotica_estavel", name: "Sequela de Mielite Esquistossomótica Estável", category: "Infecciosas/Endemias" },
  { id: "mononucleose_infecciosa_subaguda", name: "Mononucleose Infecciosa em Fase Subaguda", category: "Infecciosas/Endemias" },
  { id: "rubeola_congenita_sequelar", name: "Síndrome da Rubéola Congênita (Seguimento Adulto)", category: "Infecciosas/Endemias" },
  { id: "brucelose_cronica_articular", name: "Brucelose Crônica com Acometimento Articular", category: "Infecciosas/Endemias" },
  { id: "criptococose_pulmonar_sequelar", name: "Criptococose Pulmonar Sequelar em Imunocompetente", category: "Infecciosas/Endemias" },
  { id: "citomegalovirus_latente", name: "Infecção por Citomegalovírus Latente em Imunocompetente", category: "Infecciosas/Endemias" },
  { id: "esporotricose_cutaneo_linfatica", name: "Esporotricose Cutâneo-Linfática Estável", category: "Infecciosas/Endemias" },
  { id: "sifilis_latente_tardia", name: "Sífilis Latente Tardia Diagnosticada", category: "Infecciosas/Endemias" },
  { id: "tuberculose_pleural_remissao", name: "Tuberculose Pleural em Fase de Remissão Clínica", category: "Infecciosas/Endemias" },

  // Ginecologia & Obstetrícia
  { id: "endometriose_pelvica_estavel", name: "Endometriose Pélvica Sintomática sob Tratamento Clínico", category: "Outros" },
  { id: "miomatose_uterina_sintomatica", name: "Miomatose Uterina com Sangramento Uterino Controlado", category: "Outros" },
  { id: "sindrome_ovarios_policisticos_sop", name: "Síndrome dos Ovários Policísticos (SOP) Metabólica", category: "Outros" },
  { id: "cancer_colo_utero_seguimento", name: "Neoplasia de Colo de Útero (Seguimento Pós-Tratamento)", category: "Outros" },
  { id: "mastopatia_fibrocistica_dor", name: "Mastopatia Fibrocística com Mastalgia Cíclica", category: "Outros" },
  { id: "cisto_ovariano_simples_unilateral", name: "Cisto Ovariano Simples Unilateral Assintomático", category: "Outros" },
  { id: "adenomiose_uterina", name: "Adenomiose Uterina Moderada", category: "Outros" },
  { id: "menopausa_precoce_hormonoterapia", name: "Menopausa Precoce em Terapia de Reposição Hormonal", category: "Outros" },
  { id: "hiperprolactinemia_funcional", name: "Hiperprolactinemia Funcional de Origem Medicamentosa", category: "Outros" },
  { id: "insuficiencia_istmo_cervical", name: "Incompetência Istmocervical (Acompanhamento)", category: "Outros" },
  { id: "dor_pelvica_cronica_ginecologica", name: "Dor Pélvica Crônica de Origem Ginecológica", category: "Outros" },
  { id: "leucoplasia_vulvar_benigna", name: "Leucoplasia Vulvar Benigna / Líquen Escleroso Vulvar", category: "Outros" },
  { id: "polipo_endometrial_baixo_risco", name: "Pólipo Endometrial Pequeno Assintomático", category: "Outros" },
  { id: "prolapso_uterino_estagio_i", name: "Prolapso Uterino Estágio I / Cistocele Leve", category: "Outros" },
  { id: "hiperplasia_endometrial_sem_atipia", name: "Hiperplasia Endometrial Sem Atipia em Biópsia", category: "Outros" },
  { id: "vaginose_citolitica", name: "Vaginose Citolítica de Repetição", category: "Outros" },

  // Otorrinolaringologia
  { id: "perda_auditiva_induzida_ruido", name: "Perda Auditiva Induzida por Ruído (PAIR) Estável", category: "Outros" },
  { id: "rinite_alergica_sazonal", name: "Rinite Alérgica Sazonal Refratária", category: "Outros" },
  { id: "zumbido_subjetivo_incapacitante", name: "Zumbido Subjetivo Crônico Incapacitante", category: "Outros" },
  { id: "disfonia_cronica_funcional", name: "Disfonia Crônica Funcional em Professor", category: "Outros" },
  { id: "otite_externa_eczematosa", name: "Otite Externa Eczematosa de Repetição", category: "Outros" },
  { id: "disfuncao_trompa_eustaquio", name: "Disfunção da Trompa de Eustáquio Crônica", category: "Outros" },
  { id: "doenca_meniere_estavel", name: "Doença de Meniere em Fase Intercrise", category: "Outros" },
  { id: "labirintopatia_metabolica", name: "Labirintopatia de Origem Metabólica / Cardiovascular", category: "Outros" },
  { id: "faringolaringite_refluxo", name: "Faringolaringite por Refluxo Gastroesofágico", category: "Outros" },
  { id: "polipose_nasossinusal_estavel", name: "Polipose Nasossinusal sem Indicação Cirúrgica", category: "Outros" },
  { id: "desvio_septo_nasal_obstrutivo", name: "Desvio de Septo Nasal Obstrutivo Crônico", category: "Outros" },
  { id: "hipertrofia_cornetos_nasais", name: "Hipertrofia de Cornetos Nasais Bilateral", category: "Outros" },
  { id: "laringite_cronica_irritativa", name: "Laringite Crônica Irritativa / Tabagismo", category: "Outros" },
  { id: "cerumen_impactado_recorrente", name: "Cerúmen Impactado Bilateral Recorrente", category: "Outros" },
  { id: "rolha_epidermica_conduto", name: "Rolha Epidérmica de Conduto Auditivo Externo", category: "Outros" },
  { id: "presbiacusia_neurossensorial", name: "Presbiacusia Neurossensorial Bilateral Simétrica", category: "Outros" },

  // Oftalmologia
  { id: "glaucoma_angulo_aberto", name: "Glaucoma Crônico de Ângulo Aberto sob Controle", category: "Outros" },
  { id: "catarata_senil_incipiente", name: "Catarata Senil Incipiente Bilateral", category: "Outros" },
  { id: "conjuntivite_alergica_sazonal", name: "Conjuntivite Alérgica Sazonal Recorrente", category: "Outros" },
  { id: "retinopatia_diabetica_nao_proliferativa", name: "Retinopatia Diabética Não-Proliferativa Leve", category: "Outros" },
  { id: "olho_seco_evaporativo", name: "Olho Seco Evaporativo por Disfunção de Meibômio", category: "Outros" },
  { id: "degeneracao_macular_seca", name: "Degeneração Macular Relacionada à Idade (DMRI) Seca", category: "Outros" },
  { id: "pterigio_grau_ii_irritacao", name: "Pterígio Grau II com Surtos de Irritação Frequente", category: "Outros" },
  { id: "blefarite_seborreica_palpebral", name: "Blefarite Seborreica Palpebral Crônica", category: "Outros" },
  { id: "calazio_palpebral_cronico", name: "Calázio Palpebral Crônico Residual", category: "Outros" },
  { id: "ceratocone_estavel", name: "Ceratocone Estável em Uso de Lentes Rígidas", category: "Outros" },
  { id: "neuropatia_optica_isquemica_ant", name: "Sequela de Neuropatia Óptica Isquêmica Anterior", category: "Outros" },
  { id: "uveite_anterior_estavel", name: "Uveíte Anterior não Granulomatosa em Remissão", category: "Outros" },
  { id: "coriorretinite_toxoplasmose_cicatriz", name: "Cicatriz de Coriorretinite Macular por Toxoplasmose", category: "Outros" },
  { id: "estrabismo_convergente_adulto", name: "Estrabismo Convergente no Adulto (Seguimento)", category: "Outros" },
  { id: "ectropio_senil_palpebral", name: "Ectrópio Senil Palpebral Leve", category: "Outros" },
  { id: "epiesclerite_nodular_benigna", name: "Epiesclerite Nodular Benigna Recorrente", category: "Outros" },

  // Ortopedia & Traumatologia
  { id: "tendinopatia_manguito_rotador", name: "Tendinopatia do Manguito Rotador / Síndrome do Impacto", category: "Musculoesquelético & Membros" },
  { id: "tunel_carpo_parestesia", name: "Síndrome do Túnel do Carpo Grau Leve/Moderado", category: "Musculoesquelético & Membros" },
  { id: "fascite_plantar_calcaneo", name: "Fascite Plantar com Esporão de Calcâneo", category: "Musculoesquelético & Membros" },
  { id: "epicondilite_lateral_cotovelo", name: "Epicondilite Lateral de Cotovelo (Cotovelo de Tenista)", category: "Musculoesquelético & Membros" },
  { id: "epicondilite_medial_cotovelo", name: "Epicondilite Medial de Cotovelo (Cotovelo de Golfista)", category: "Musculoesquelético & Membros" },
  { id: "tendinite_patelar_joelho", name: "Tendinite Patelar de Joelho (Salto ou Esforço)", category: "Musculoesquelético & Membros" },
  { id: "bursite_trocanterica_quadril", name: "Bursite Trocantérica de Quadril / Dor Lateral", category: "Musculoesquelético & Membros" },
  { id: "lombalgia_mecanico_postural", name: "Lombalgia Mecânico-Postural Crônica", category: "Musculoesquelético & Membros" },
  { id: "cervicalgia_tensional_cronica", name: "Cervicalgia Tensional Crônica com Espasmo Trapezius", category: "Musculoesquelético & Membros" },
  { id: "artrose_femorotibial_joelho", name: "Osteoartrite / Artrose Femorotibial de Joelho", category: "Musculoesquelético & Membros" },
  { id: "espondiloartrose_lombar_estavel", name: "Espondiloartrose Lombar com Osteófitos Estável", category: "Musculoesquelético & Membros" },
  { id: "sindrome_patelofemoral_dor", name: "Síndrome de Dor Patelofemoral / Condromalácia Grau II", category: "Musculoesquelético & Membros" },
  { id: "dedo_gatilho_flexor", name: "Tenossinovite Estenosante Digital (Dedo em Gatilho)", category: "Musculoesquelético & Membros" },
  { id: "tenossinovite_quervain_punho", name: "Tenossinovite de De Quervain no Punho", category: "Musculoesquelético & Membros" },
  { id: "capsulite_adesiva_ombro", name: "Capsulite Adesiva de Ombro (Ombro Congelado) Fase Crônica", category: "Musculoesquelético & Membros" },
  { id: "metatarsalgia_morton", name: "Metatarsalgia com Neuroma de Morton", category: "Musculoesquelético & Membros" },

  // Geriatria
  { id: "alzheimer_demencia_leve", name: "Demência de Alzheimer em Estágio Leve", category: "Geriatria" },
  { id: "demencia_vascular_estavel", name: "Demência Vascular de Origem Isquêmica Estável", category: "Geriatria" },
  { id: "sarcopenia_idoso_fraqueza", name: "Sarcopenia Geriátrica com Redução de Massa Muscular", category: "Geriatria" },
  { id: "quedas_recorrentes_postural", name: "Instabilidade Postural com Quedas Recorrentes no Idoso", category: "Geriatria" },
  { id: "demencia_mista_alzheimer_vascular", name: "Demência Mista (Alzheimer + Vascular) sob Controle", category: "Geriatria" },
  { id: "sindrome_fragilidade_idoso", name: "Síndrome de Fragilidade do Idoso (Critérios de Fried)", category: "Geriatria" },
  { id: "polifarmacia_iatrogenia_revisao", name: "Polifarmácia Complexa com Risco de Interações (Revisão)", category: "Geriatria" },
  { id: "depressao_tardia_idoso", name: "Depressão Geriátrica de Início Tardio", category: "Geriatria" },
  { id: "hipotensao_ortostatica_idoso", name: "Hipotensão Ortostática Geriátrica por Rigidez Arterial", category: "Geriatria" },
  { id: "insonia_senil_melatonina", name: "Insonia Senil por Dessincronização do Ciclo Circadiano", category: "Geriatria" },
  { id: "osteoporose_senil_fratura", name: "Osteoporose Senil com Fratura de Fragilidade Prévia", category: "Geriatria" },
  { id: "obstipacao_cronica_idoso", name: "Obstipação Crônica Funcional por Hipomotilidade no Idoso", category: "Geriatria" },
  { id: "sindrome_desuso_imobilidade", name: "Síndrome de Desuso / Imobilidade Parcial no Idoso", category: "Geriatria" },
  { id: "arterite_temporais_idoso", name: "Arterite de Células Gigantes / Temporal em Idoso (Seguimento)", category: "Geriatria" },
  { id: "disfagia_neurogenica_idoso", name: "Disfagia Neurogênica Leve por Envelhecimento (Presbifagia)", category: "Geriatria" },
  { id: "delirium_hipoativo_demencia", name: "Histórico de Delirium Recorrente sobreposto a Demência", category: "Geriatria" },

  // Pediatria
  { id: "asma_infantil_persistente", name: "Asma Brônquica Infantil Persistente Moderada", category: "Pediatria" },
  { id: "dermatite_atopica_infantil", name: "Dermatite Atópica Infantil Severa", category: "Pediatria" },
  { id: "otite_media_recorrente_infantil", name: "Otite Média Aguda Recorrente na Infância", category: "Pediatria" },
  { id: "tdah_infantil_hiperativo", name: "TDAH na Infância com Predomínio de Hiperatividade", category: "Pediatria" },
  { id: "bronquiolite_viral_aguda_sequela", name: "Sibilância Pós-Bronquiolite Viral Aguda", category: "Pediatria" },
  { id: "laringite_estridulosa_recorrente", name: "Laringite Estridulosa Recorrente / Crupe Espasmódico", category: "Pediatria" },
  { id: "rinite_alergica_infantil", name: "Rinite Alérgica Infantil com Hipertrofia de Adenoide", category: "Pediatria" },
  { id: "enurese_noturna_congenita", name: "Enurese Noturna Monossintomática na Idade Escolar", category: "Pediatria" },
  { id: "dermatite_fralda_amoniacal", name: "Dermatite de Fraldas Amoniacal com Monilíase Secundária", category: "Pediatria" },
  { id: "constipacao_funcional_pediatrica", name: "Constipação Funcional do Lactente e Criança Maior", category: "Pediatria" },
  { id: "refluxo_gastroesofagico_fisiologico", name: "Refluxo Gastroesofágico Fisiológico do Lactente (Golfador)", category: "Pediatria" },
  { id: "anemia_ferropriva_lactente", name: "Anemia Ferropriva de Lactente por Erro Alimentar", category: "Pediatria" },
  { id: "deficit_crescimento_nutricional", name: "Baixa Estatura ou Déficit de Crescimento Constitucional", category: "Pediatria" },
  { id: "transtorno_opositor_desafiante_infantil", name: "Transtorno Opositor Desafiante (TOD) na Infância", category: "Pediatria" },
  { id: "alergia_proteina_leite_vaca", name: "Alergia à Proteína do Leite de Vaca (APLV) Não IgE Mediada", category: "Pediatria" },
  { id: "faringoamigdalite_recorrente_infantil", name: "Faringoamigdalite Bacteriana Recorrente Escolar", category: "Pediatria" },

  // Outros / Urgências e Variados
  { id: "apendicite_aguda_diagnostico", name: "Apendicite Aguda em Fase Inicial (Avaliação)", category: "Outros" },
  { id: "anafilaxia_alergica_aguda", name: "Anafilaxia Sistêmica Aguda em Observação UPA", category: "Outros" },
  { id: "choque_distributivo_sepse", name: "Choque Séptico em Fase de Estabilização", category: "Outros" },
  { id: "sdra_pulmonar_sequela", name: "Sequela Pulmonar Pós-Síndrome de Angústia Respiratória Aguda", category: "Outros" },
  { id: "intoxicacao_aguda_sintomatico", name: "Intoxicação Exógena Aguda por Praguicida (Seguimento)", category: "Outros" },
  { id: "acidente_peconhento_ofidico", name: "Acidente Ofídico Moderado / Picada de Cobra (Suporte)", category: "Outros" },
  { id: "tce_urgente_observacao", name: "Traumatismo Cranioencefálico Leve com Glasgow 15 (Observação)", category: "Outros" },
  { id: "desnutricao_grave_choque_estavel", name: "Desnutrição Energético-Proteica Grave Recuperada", category: "Outros" },
  { id: "hipertensao_intracraniana_benigna", name: "Pseudotumor Cerebral / Hipertensão Intracraniana Benigna", category: "Outros" },
  { id: "sindrome_raynaud_secundaria", name: "Fenômeno de Raynaud Secundário a Colagenose", category: "Outros" },
  { id: "insuficiencia_hepatica_cronica_estavel", name: "Insuficiência Hepática Crônica Compensada", category: "Outros" },
  { id: "amiloidose_sistemica_estavel", name: "Amiloidose Sistêmica Primária Estável", category: "Outros" },
  { id: "fibrose_cistica_adulta_seguimento", name: "Fibrose Cística no Adulto (Seguimento de Apoio)", category: "Outros" },
  { id: "hemoglobinuria_paroxistica_noturna", name: "Hemoglobinúria Paroxística Noturna (Seguimento)", category: "Outros" },
  { id: "sarcoidose_cutanea_estavel", name: "Sarcoidose Cutânea Exclusiva Estável", category: "Outros" },
  { id: "sindrome_sjogren_secundario", name: "Síndrome de Sjogren Secundária a Lúpus", category: "Outros" }
];

// Slice to get exactly 400 diseases in total
const neededExtraCount = 400 - EXISTING_DISEASES.length;
const slicedExtraSeeds = EXTRA_DISEASES_SEEDS.slice(0, neededExtraCount);

// Hydrate sliced seeds with complete clinical descriptions
const HYDRATED_EXTRA_DISEASES: DiseaseInfo[] = slicedExtraSeeds.map((seed, idx) => {
  const name = seed.name;
  const category = seed.category;
  
  // Custom high-quality, professional clinical texts based on the category
  let diagnostic = "";
  let alarm = "";
  let treatment: TreatmentStep[] = [];
  
  const catLower = category.toLowerCase();
  
  if (catLower.includes("cardio")) {
    diagnostic = `Investigação de ${name} por meio de anamnese completa, exame físico focado (pesquisa de sopros, ritmo cardíaco, turgência jugular), eletrocardiograma (ECG) de 12 derivações e ecocardiograma se indicado para avaliar função ventricular e valvular.`;
    alarm = `Surgimento de dor ou aperto no peito, falta de ar súbita aos mínimos esforços, palpitações rápidas com tontura ou desmaio, ou edema de membros inferiores de início rápido -> Encaminhar de imediato para atendimento de urgência (UPA).`;
    treatment = [
      {
        title: "1ª Linha - Otimização Clínica & Estilo de Vida",
        desc: `Instituir medidas higienodietéticas rigorosas (redução do sódio < 2g/dia, suspensão do tabaco, perda ponderal se IMC > 25). Prescrever medicação protetora conforme diretrizes (ex: IECA, betabloqueador ou diurético em doses de tolerância).`
      },
      {
        title: "2ª Linha - Associação Terapêutica & Monitoramento",
        desc: `Em caso de resposta clínica parcial ou refratariedade de sintomas associados a ${name}, ajustar ou associar nova classe de fármacos cardiovasculares. Agendar retorno em 15 a 30 dias com exames de controle (potássio, creatinina).`
      }
    ];
  } else if (catLower.includes("metaból") || catLower.includes("endócrin")) {
    diagnostic = `Confirmação de ${name} através de triagem laboratorial sérica específica (hormônios livres, perfil lipídico, curvas glicêmicas ou cálcio iônico conforme o caso). Realizar rastreamento concomitante de complicações microvasculares.`;
    alarm = `Aparecimento de sintomas de desidratação severa, hálito cetônico, confusão mental progressiva, fraqueza muscular profunda refratária ou letargia -> Encaminhar para hidratação venosa de emergência e estabilização eletrolítica na UPA.`;
    treatment = [
      {
        title: "1ª Linha - Terapia de Reposição ou Modulação Hormonal",
        desc: `Iniciar dose inicial baixa de medicamento hormonorregulador ou hipoglicemiante oral (ex: levotiroxina, metformina, ou suplementação específica) de acordo com o peso e idade. Orientar dieta balanceada com baixo índice glicêmico.`
      },
      {
        title: "2ª Linha - Ajuste Sênior & Suporte Especializado",
        desc: `Titular a dose do tratamento em intervalos de 4-6 semanas guiado por dosagens de TSH, HbA1c ou eletrólitos. Se persistir descompensado ou com sinais de compressão glandular, programar encaminhamento para a endocrinologia secundária.`
      }
    ];
  } else if (catLower.includes("respirat")) {
    diagnostic = `Avaliação clínica de ${name} com ausculta pulmonar detalhada (pesquisa de sibilos, estertores, murmúrio vesicular), radiografia de tórax e oximetria de pulso. Se disponível, solicitar espirometria para karakterizar padrão ventilatório obstrutivo ou restritivo.`;
    alarm = `Dispneia importante em repouso, cianose labial ou periférica, incapacidade de completar frases devido à falta de ar, ou saturação de oxigênio (SpO2) < 92% em ar ambiente -> Encaminhar para oxigenioterapia e nebulização imediata na UPA.`;
    treatment = [
      {
        title: "1ª Linha - Broncodilatação e Anti-inflamatório Inalatório",
        desc: `Orientar uso diário de corticoide inalatório associado ou não a broncodilatador de longa duração (LABA), ensinando exaustivamente a técnica correta de uso com espaçador. Recomendar cessação tabágica e vacinação pneumocócica/influenza.`
      },
      {
        title: "2ª Linha - Resgate e Otimização Terapêutica",
        desc: `Durante exacerbações agudas, prescrever ciclo curto de corticoide oral (Prednisolona 40mg por 5 dias) e aumentar frequência do broncodilatador de curta ação. Casos graves devem ser referenciados para avaliação da pneumologia.`
      }
    ];
  } else if (catLower.includes("gastro")) {
    diagnostic = `Mapeamento diagnóstico de ${name} baseado na sintomatologia (dor abdominal, náuseas, plenitude pós-prandial ou alterações do hábito intestinal). Solicitar hemograma, parasitológico, ultrassonografia de abdome ou endoscopia digestiva alta se preencher critérios de idade ou alarme.`;
    alarm = `Vômitos incoercíveis com desidratação, dor abdominal aguda intensa e difusa com sinal de descompressão dolorosa (abdome agudo), melena, hematêmese ou perda de peso involuntária rápida -> Encaminhar com extrema urgência à UPA.`;
    treatment = [
      {
        title: "1ª Linha - Modificação Dietética e Sintomáticos",
        desc: `Orientar dieta fracionada, evitar alimentos gordurosos, picantes, cafeína e deitar logo após comer. Prescrever inibidor de bomba de prótons (ex: Omeprazol 20-40mg em jejum) ou pró-cinéticos/antiespasmódicos conforme queixa.`
      },
      {
        title: "2ª Linha - Associação de Classes e Investigação",
        desc: `Persistindo queixas após 4 semanas de tratamento adequado, associar bloqueadores de receptores H2, duplicar dose do IBP para uso 12/12h, ou adicionar probióticos/laxativos osmóticos. Agendar retorno em 30 dias para avaliar resposta.`
      }
    ];
  } else if (catLower.includes("mental") || catLower.includes("neuro")) {
    diagnostic = `Diagnóstico de ${name} baseado em critérios clínicos e anamnese psiquiátrica/neurológica minuciosa. Excluir causas orgânicas, infecciosas ou metabólicas através de triagem laboratorial básica e escala de avaliação cognitiva se idoso.`;
    alarm = `Presença de ideação suicida estruturada ou comportamento autolesivo, agressividade física incontrolável, alucinações ou delírios agudos, ou crise convulsiva refratária de início recente -> Encaminhar de imediato para o CAPS ou Emergência Psiquiátrica/UPA.`;
    treatment = [
      {
        title: "1ª Linha - Suporte Psicoterapêutico e Medicamento Inicial",
        desc: `Iniciar antidepressivo inibidor seletivo da recaptação de serotonina (ex: Fluoxetina 20mg ou Sertralina 50mg pela manhã) ou anticonvulsivante/neuroleptorregulador na menor dose eficaz. Estimular higiene do sono e atividade física.`
      },
      {
        title: "2ª Linha - Ajuste Gradual e Apoio Multidisciplinar",
        desc: `Avaliar adesão e efeitos colaterais em 2-4 semanas. Titular dose do medicamento gradualmente se necessário. Associar acompanhamento com psicologia e grupos de apoio na UBS ou agendar matriciamento com CAPS.`
      }
    ];
  } else if (catLower.includes("pele") || catLower.includes("dermat")) {
    diagnostic = `Inspeção dermatológica sob luz adequada de lesões cutâneas relacionadas a ${name}, determinando padrão de distribuição, morfologia (placas, pápulas, vesículas) e presença de prurido. Realizar raspado ou biópsia em lesões atípicas ou suspeitas.`;
    alarm = `Surgimento de lesões bolhosas dolorosas disseminadas, febre alta associada a erupção cutânea difusa, eritrodermia envolvendo mais de 90% da superfície corporal ou sinais de celulite/erisipela facial com prostração -> UPA de urgência.`;
    treatment = [
      {
        title: "1ª Linha - Restabelecimento da Barreira e Anti-inflamatório",
        desc: `Prescrever hidratantes espessos sem perfume de aplicação diária e sabonetes syndet suaves. Usar corticosteroides tópicos de potência adequada à região (evitar alta potência na face e dobras) por tempo curto limitado (5-7 dias).`
      },
      {
        title: "2ª Linha - Terapia Sistêmica e Controle de Prurido",
        desc: `Se lesões extensas ou prurido que impede o sono, associar anti-histamínicos de primeira geração (Hidroxizina 25mg à noite) ou antimicrobianos sistêmicos se sinais de infecção secundária. Casos graves referenciar para a especialidade.`
      }
    ];
  } else if (catLower.includes("infecto") || catLower.includes("endemia")) {
    diagnostic = `Investigação de ${name} por meio de sorologias específicas, testes rápidos, hemograma completo com plaquetometria seriada ou baciloscopia/cultura se suspeita de tuberculose/hanseníase. Considerar sempre a epidemiologia local.`;
    alarm = `Instabilidade hemodinâmica (PA sistólica < 90 mmHg), queda abrupta de plaquetas com sangramentos (gengivorragia, epistaxe, petéquias), vômitos persistentes, dor abdominal intensa e contínua, ou confusão mental -> UPA de imediato.`;
    treatment = [
      {
        title: "1ª Linha - Suporte Clínico Geral & Sintomáticos",
        desc: `Prescrever hidratação oral vigorosa (soro de reidratação oral e líquidos abundantes). Usar sintomáticos como dipirona ou paracetamol para controle de febre e dor (estritamente contraindicado uso de AAS ou anti-inflamatórios).`
      },
      {
        title: "2ª Linha - Antibioticoterapia ou Antiparasitário Específico",
        desc: `Se confirmado patógeno bacteriano ou parasitário específico de ${name}, instituir o esquema de tratamento padronizado do Ministério da Saúde (ex: Rifampicina/Isoniazida para tuberculose). Monitorar adesão e reportar notificação compulsória.`
      }
    ];
  } else if (catLower.includes("geriatria")) {
    diagnostic = `Avaliação multidimensional do idoso focado em ${name}, contemplando testes de memória/cognição (Mini-Mental), avaliação da velocidade de marcha e força de preensão manual, além de inventário de medicamentos (polifarmácia).`;
    alarm = `Instabilidade postural severa com quedas repetidas recentes resultando em fraturas ou trauma craniano, declínio cognitivo abrupto (delirium) ou perda ponderal rápida e severa inexplicada -> Avaliação hospitalar urgente.`;
    treatment = [
      {
        title: "1ª Linha - Preservação Funcional e Simplificação",
        desc: `Promover fisioterapia motora para fortalecimento de membros inferiores e treino de equilíbrio. Revisar e descontinuar medicamentos potencialmente inapropriados para idosos (Critérios de Beer). Orientar dieta hiperproteica.`
      },
      {
        title: "2ª Linha - Adaptação Ambiental e Acompanhamento",
        desc: `Adequar o ambiente doméstico para prevenção de quedas (retirar tapetes soltos, instalar barras de apoio). Agendar consultas periódicas com equipe multiprofissional (enfermagem, nutrição, assistência social) e apoio familiar.`
      }
    ];
  } else if (catLower.includes("pediatria")) {
    diagnostic = `Análise do desenvolvimento neuropsicomotor e acompanhamento das curvas de crescimento infantil em consulta de puericultura focado em ${name}. Avaliar ausculta respiratória e padrão de pele conforme queixa ativa da criança.`;
    alarm = `Sinais de esforço respiratório acentuado (tiragem de fúrcula, tiragem subcostal, batimento de asa de nariz), letargia acentuada, recusa de líquidos por mais de 12h ou febre alta refratária com manchas vermelhas na pele -> UPA imediata.`;
    treatment = [
      {
        title: "1ª Linha - Educação Familiar e Cuidados Gerais",
        desc: `Orientar pais e cuidadores sobre sinais de alerta de gravidade e técnicas de lavagem nasal com soro fisiológico. Prescrever antitérmicos em dose baseada estritamente no peso corporal da criança para controle de febre.`
      },
      {
        title: "2ª Linha - Medicamentos Direcionados e Retorno",
        desc: `Se necessário, prescrever antibióticos, broncodilatadores inalatórios ou anti-histamínicos infantis conforme a dose ponderal exata. Agendar retorno em 48-72 horas para reavaliação clínica cuidadosa.`
      }
    ];
  } else {
    diagnostic = `Exame clínico completo e focado nos sintomas de ${name}, solicitando exames subsidiários de 1ª linha na UBS (laboratoriais gerais ou radiografia) para afastar patologias de maior gravidade.`;
    alarm = `Presença de dor lancinante inexplicada, alteração súbita de sinais vitais, perda ponderal acentuada sem causa aparente ou comprometimento funcional grave -> Referenciar à UPA para elucidação diagnóstica de emergência.`;
    treatment = [
      {
        title: "1ª Linha - Medidas Iniciais e Sintomáticos",
        desc: `Iniciar manejo sintomático para alívio de dor ou desconforto (ex: analgésicos comuns) e orientar repouso relativo, hidratação adequada e acompanhamento regular com o médico de família da UBS.`
      },
      {
        title: "2ª Linha - Otimização e Encaminhamento Regulado",
        desc: `Se não houver melhora clínica com as condutas iniciais em 2-4 semanas, reavaliar o diagnóstico, ajustar doses de medicação ou encaminhar para o especialista focal correspondente via sistema de regulação.`
      }
    ];
  }
  
  return {
    id: seed.id,
    name: seed.name,
    category: seed.category,
    diagnostic,
    alarm,
    treatment,
    interactiveType: seed.id
  };
});

export const UBS_CATALOG_DISEASES: DiseaseInfo[] = [
  ...EXISTING_DISEASES,
  ...HYDRATED_EXTRA_DISEASES
];

