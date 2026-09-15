/**
 * app.js — motor de pesquisa OSINT.
 *
 * Fluxo (conforme SKILL.md):
 *   Investigador insere identificador
 *     -> categoria escolhida define a seção da Knowledge Base
 *     -> para cada fonte da categoria: monta URL (auto) ou aponta
 *        link direto para consulta manual
 *     -> organiza tudo em tabela
 *     -> permite exportação em PDF/XLSX
 *
 * Não há geração de conteúdo por IA. Não há banco de dados.
 * Não há localStorage. Os dados só existem em memória durante a sessão.
 */

(function () {
  "use strict";

  const state = {
    lastResults: [], // { source, query, status, note, url }
    lastCategory: null,
    lastQuery: "",
  };

  const el = {
    kbVersion: document.getElementById("kbVersion"),
    legalBanner: document.getElementById("legalBanner"),
    integrityNotice: document.getElementById("integrityNotice"),
    categorySelect: document.getElementById("categorySelect"),
    queryInput: document.getElementById("queryInput"),
    categoryHint: document.getElementById("categoryHint"),
    searchForm: document.getElementById("searchForm"),
    resultsPanel: document.getElementById("resultsPanel"),
    resultsMeta: document.getElementById("resultsMeta"),
    resultsBody: document.getElementById("resultsBody"),
    observationsInput: document.getElementById("observationsInput"),
    openAllBtn: document.getElementById("openAllBtn"),
    downloadPdfBtn: document.getElementById("downloadPdfBtn"),
    downloadXlsxBtn: document.getElementById("downloadXlsxBtn"),
    custodyNote: document.getElementById("custodyNote"),
  };

  function init() {
    el.kbVersion.textContent = `KB v${OSINT_KB.meta.version} · ${OSINT_KB.meta.updated}`;
    el.legalBanner.textContent = OSINT_KB.meta.disclaimer;
    el.integrityNotice.textContent = OSINT_SKILL.integrityNotice;
    el.custodyNote.textContent = OSINT_SKILL.custodyNote + " " + OSINT_SKILL.legalReminder;

    OSINT_KB.categories.forEach((cat) => {
      const opt = document.createElement("option");
      opt.value = cat.id;
      opt.textContent = `${cat.label} (${cat.section})`;
      el.categorySelect.appendChild(opt);
    });

    updateHint();
    el.categorySelect.addEventListener("change", updateHint);
    el.searchForm.addEventListener("submit", onSearch);
    el.openAllBtn.addEventListener("click", openAllAuto);
    el.downloadPdfBtn.addEventListener("click", downloadPdf);
    el.downloadXlsxBtn.addEventListener("click", downloadXlsx);
  }

  function currentCategory() {
    const id = el.categorySelect.value;
    return OSINT_KB.categories.find((c) => c.id === id);
  }

  function updateHint() {
    const cat = currentCategory();
    if (!cat) return;
    el.queryInput.placeholder = cat.placeholder || "";
    el.categoryHint.textContent = `${cat.sources.length} fonte(s) cadastrada(s) para esta categoria — seção ${cat.section} da Knowledge Base.`;
  }

  function buildUrl(template, rawQuery) {
    const encoded = encodeURIComponent(rawQuery.trim());
    return template.replace("{q}", encoded).replace("{qraw}", rawQuery.trim());
  }

  function onSearch(evt) {
    evt.preventDefault();
    const cat = currentCategory();
    const query = el.queryInput.value.trim();
    if (!cat || !query) return;

    const now = new Date();
    const timestamp = now.toISOString();

    const results = cat.sources.map((src) => {
      if (src.mode === "auto") {
        const url = buildUrl(src.url, query);
        return {
          source: src.name,
          query,
          status: "auto",
          statusLabel: OSINT_SKILL.statusLabels.auto,
          note: src.note || "",
          url,
          timestamp,
        };
      }
      // manual
      return {
        source: src.name,
        query,
        status: "manual",
        statusLabel: OSINT_SKILL.statusLabels.manual,
        note: src.note || "",
        url: src.url,
        timestamp,
      };
    });

    state.lastResults = results;
    state.lastCategory = cat;
    state.lastQuery = query;

    renderResults(cat, query, results, timestamp);
  }

  function renderResults(cat, query, results, timestamp) {
    el.resultsPanel.hidden = false;
    const autoCount = results.filter((r) => r.status === "auto").length;
    const manualCount = results.length - autoCount;
    el.resultsMeta.textContent =
      `${cat.label} · termo: "${query}" · ${new Date(timestamp).toLocaleString("pt-BR")} · ` +
      `${autoCount} pesquisa(s) automática(s), ${manualCount} consulta(s) manual(is)`;

    el.resultsBody.innerHTML = "";
    results.forEach((r) => {
      const tr = document.createElement("tr");

      const tdSource = document.createElement("td");
      tdSource.textContent = r.source;

      const tdQuery = document.createElement("td");
      tdQuery.textContent = r.query;

      const tdStatus = document.createElement("td");
      const pill = document.createElement("span");
      pill.className = `status-pill status-${r.status}`;
      pill.textContent = r.statusLabel;
      tdStatus.appendChild(pill);

      const tdNote = document.createElement("td");
      tdNote.textContent = r.note;

      const tdAction = document.createElement("td");
      const a = document.createElement("a");
      a.href = r.url;
      a.target = "_blank";
      a.rel = "noopener noreferrer";
      a.className = "row-action-link";
      a.textContent = r.status === "auto" ? "Abrir pesquisa →" : "Abrir fonte →";
      tdAction.appendChild(a);

      tr.append(tdSource, tdQuery, tdStatus, tdNote, tdAction);
      el.resultsBody.appendChild(tr);
    });

    el.resultsPanel.scrollIntoView({ behavior: "smooth", block: "start" });
  }

  function openAllAuto() {
    const autoResults = state.lastResults.filter((r) => r.status === "auto");
    if (autoResults.length === 0) return;
    autoResults.forEach((r) => window.open(r.url, "_blank", "noopener,noreferrer"));
  }

  function exportRows() {
    const obs = el.observationsInput.value.trim();
    return state.lastResults.map((r) => ({
      Fonte: r.source,
      Tipo: state.lastCategory ? state.lastCategory.label : "",
      "Termo pesquisado": r.query,
      Status: r.statusLabel,
      URL: r.url,
      "Data/Hora": new Date(r.timestamp).toLocaleString("pt-BR"),
      Observações: obs,
    }));
  }

  function downloadPdf() {
    if (!state.lastResults.length) return;
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF({ unit: "pt", format: "a4" });
    const marginX = 40;
    let y = 50;

    doc.setFontSize(14);
    doc.text("Relatório de Pesquisa OSINT", marginX, y);
    y += 20;

    doc.setFontSize(10);
    doc.text(`Categoria: ${state.lastCategory.label} (${state.lastCategory.section})`, marginX, y); y += 14;
    doc.text(`Termo pesquisado: ${state.lastQuery}`, marginX, y); y += 14;
    doc.text(`Data/Hora: ${new Date().toLocaleString("pt-BR")}`, marginX, y); y += 14;

    const obs = el.observationsInput.value.trim();
    if (obs) {
      const obsLines = doc.splitTextToSize(`Observações: ${obs}`, 515);
      doc.text(obsLines, marginX, y);
      y += obsLines.length * 12;
    }
    y += 10;

    doc.setFontSize(11);
    doc.text("Fontes consultadas / a consultar", marginX, y);
    y += 16;
    doc.setFontSize(9);

    state.lastResults.forEach((r) => {
      if (y > 760) { doc.addPage(); y = 50; }
      doc.setFont(undefined, "bold");
      doc.text(`${r.source} — ${r.statusLabel}`, marginX, y);
      doc.setFont(undefined, "normal");
      y += 12;
      const urlLines = doc.splitTextToSize(r.url, 515);
      doc.text(urlLines, marginX, y);
      y += urlLines.length * 11;
      if (r.note) {
        const noteLines = doc.splitTextToSize(`Obs.: ${r.note}`, 515);
        doc.text(noteLines, marginX, y);
        y += noteLines.length * 11;
      }
      y += 8;
    });

    y += 6;
    if (y > 740) { doc.addPage(); y = 50; }
    doc.setFontSize(8);
    const limitLines = doc.splitTextToSize(
      "Limitações: este relatório lista fontes públicas/oficiais indicadas pela Knowledge Base OSINT. " +
      "O sistema não extrai, simula ou valida resultados automaticamente — cada consulta deve ser conferida " +
      "diretamente pelo investigador na fonte indicada. " + OSINT_SKILL.legalReminder,
      515
    );
    doc.text(limitLines, marginX, y);

    doc.save(`osint-relatorio-${Date.now()}.pdf`);
  }

  function downloadXlsx() {
    if (!state.lastResults.length) return;
    const rows = exportRows();
    const ws = XLSX.utils.json_to_sheet(rows);
    ws["!cols"] = [
      { wch: 28 }, { wch: 16 }, { wch: 20 }, { wch: 26 }, { wch: 50 }, { wch: 20 }, { wch: 30 },
    ];
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, "Resultados OSINT");
    XLSX.writeFile(wb, `osint-resultados-${Date.now()}.xlsx`);
  }

  document.addEventListener("DOMContentLoaded", init);
})();
