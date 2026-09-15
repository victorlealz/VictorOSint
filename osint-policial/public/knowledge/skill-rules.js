/**
 * SKILL RULES — regras e metodologia do fluxo de pesquisa.
 * Baseado em "OSINT Investigator Forense v2.0" (Ciclo de Inteligência,
 * separação FATO vs INFERÊNCIA, pivôs, cadeia de custódia).
 *
 * Este arquivo NÃO contém fontes/URLs (isso fica em knowledge-base.js).
 * Contém apenas: rótulos de status, textos padrão e a ordem/prioridade
 * de exibição por categoria.
 */

const OSINT_SKILL = {
  statusLabels: {
    auto: "Pesquisa aberta automaticamente",
    manual: "Consulta manual necessária",
    unavailable: "Fonte indisponível",
  },

  // Nota fixa exibida acima dos resultados — reforça §4 do prompt
  // operacional: nunca simular/inventar resultados.
  integrityNotice:
    "O sistema não extrai nem simula resultados de terceiros. Cada linha abre a fonte oficial/pública correspondente para consulta direta pelo investigador. Quando a fonte exige login, CAPTCHA ou upload, a consulta é sinalizada como manual.",

  // Texto de cadeia de custódia sugerido para o relatório (PDF/XLSX)
  custodyNote:
    "Registre nesta pesquisa: identificador buscado, data/hora (UTC e local), fontes consultadas, resultados obtidos, hipótese(s) e providência processual associada, quando houver.",

  legalReminder:
    "Verifique respaldo legal (autorização judicial/administrativa ou dado manifestamente público) antes de utilizar qualquer achado em peça processual.",
};

if (typeof module !== "undefined" && module.exports) {
  module.exports = OSINT_SKILL;
}
