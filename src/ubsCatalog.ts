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

export const UBS_CATALOG_DISEASES: DiseaseInfo[] = [
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
  }
];
