import { getMonthName, calcNetProfit, calcNetPlus2, safe } from "./utils.js";
import { saveRegistos } from "./storage.js";
import { exportarMesExcel, exportarMesPDF } from "./export.js";

const tabela = document.querySelector("#tabela tbody");
const resumoMensalBody = document.querySelector("#resumoMensal tbody");

export function renderTabela(registros, deleteRegistro) {
  tabela.innerHTML = "";
  registros.forEach((r, idx) => {
    let netProfit = calcNetProfit(r.uber, r.bolt);
    let netPlus2 = calcNetPlus2(netProfit, r.tips);
    let row = `<tr>
      <td>${r.date}</td>
      <td>${r.uber.toFixed(2)}</td>
      <td>${r.bolt.toFixed(2)}</td>
      <td>${r.tips.toFixed(2)}</td>
      <td>${r.prizes.toFixed(2)}</td>
      <td>${r.charging.toFixed(2)}</td>
      <td>${r.washing.toFixed(2)}</td>
      <td>${r.tolls.toFixed(2)}</td>
      <td>${r.snacks.toFixed(2)}</td>
      <td>${r.other.toFixed(2)}</td>
      <td>${netProfit.toFixed(2)}</td>
      <td>${netPlus2.toFixed(2)}</td>
      <td><button class="delete-btn" data-idx="${idx}">Delete</button></td>
    </tr>`;
    tabela.innerHTML += row;
  });

  // delegate delete event
  tabela.querySelectorAll(".delete-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const idx = e.target.dataset.idx;
      deleteRegistro(idx);
    });
  });
}

export function atualizarResumoMensal(registros) {
  resumoMensalBody.innerHTML = "";
  if (registros.length === 0) return;
  let resumo = {};

  registros.forEach(r => {
    let mes = getMonthName(r.date);
    if (!resumo[mes]) {
      resumo[mes] = {
        dias: 0, uber: 0, bolt: 0, tips: 0, prizes: 0,
        charging: 0, washing: 0, tolls: 0, snacks: 0, other: 0,
        netProfit: 0, netPlus2: 0
      };
    }
    resumo[mes].dias++;
    resumo[mes].uber += safe(r.uber);
    resumo[mes].bolt += safe(r.bolt);
    resumo[mes].tips += safe(r.tips);
    resumo[mes].prizes += safe(r.prizes);
    resumo[mes].charging += safe(r.charging);
    resumo[mes].washing += safe(r.washing);
    resumo[mes].tolls += safe(r.tolls);
    resumo[mes].snacks += safe(r.snacks);
    resumo[mes].other += safe(r.other);

    let netProfit = calcNetProfit(r.uber, r.bolt);
    let netPlus2 = calcNetPlus2(netProfit, r.tips);
    resumo[mes].netProfit += netProfit;
    resumo[mes].netPlus2 += netPlus2;
  });

  for (let mes in resumo) {
    let r = resumo[mes];
    let row = `<tr>
      <td>${mes}</td>
      <td>${r.dias}</td>
      <td>${r.uber.toFixed(2)}</td>
      <td>${r.bolt.toFixed(2)}</td>
      <td>${r.tips.toFixed(2)}</td>
      <td>${r.prizes.toFixed(2)}</td>
      <td>${r.charging.toFixed(2)}</td>
      <td>${r.washing.toFixed(2)}</td>
      <td>${r.tolls.toFixed(2)}</td>
      <td>${r.snacks.toFixed(2)}</td>
      <td>${r.other.toFixed(2)}</td>
      <td>${r.netProfit.toFixed(2)}</td>
      <td>${r.netPlus2.toFixed(2)}</td>
      <td>
        <button class="export-btn" data-action="excel" data-mes="${mes}">Excel</button>
        <button class="export-btn" data-action="pdf" data-mes="${mes}">PDF</button>
      </td>
    </tr>`;
    resumoMensalBody.innerHTML += row;
  }

  resumoMensalBody.querySelectorAll(".export-btn").forEach(btn => {
    btn.addEventListener("click", e => {
      const mes = e.target.dataset.mes;
      const action = e.target.dataset.action;
      if (action === "excel") exportarMesExcel(mes, registros);
      else exportarMesPDF(mes, registros);
    });
  });
}
