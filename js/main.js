import { loadRegistos, saveRegistos } from "./storage.js";
import { renderTabela, atualizarResumoMensal } from "./renderer.js";

let registros = loadRegistos();

const form = document.getElementById("tvdeForm");

function renderAll() {
  renderTabela(registros, deleteRegistro);
  atualizarResumoMensal(registros);
}

function deleteRegistro(idx) {
  if (confirm("Are you sure you want to delete this record?")) {
    registros.splice(idx, 1);
    saveRegistos(registros);
    renderAll();
  }
}

form.addEventListener("submit", e => {
  e.preventDefault();
  let reg = {
    date: form.data.value,
    uber: Number(form.uber.value) || 0,
    bolt: Number(form.bolt.value) || 0,
    tips: Number(form.tips.value) || 0,
    prizes: Number(form.prizes.value) || 0,
    charging: Number(form.charging.value) || 0,
    washing: Number(form.washing.value) || 0,
    tolls: Number(form.tolls.value) || 0,
    snacks: Number(form.snacks.value) || 0,
    other: Number(form.other.value) || 0
  };

  registros.push(reg);
  saveRegistos(registros);
  form.reset();
  renderAll();
});

renderAll();
