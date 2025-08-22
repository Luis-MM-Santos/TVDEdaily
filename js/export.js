import { getMonthName, calcNetProfit, calcNetPlus2, safe } from "./utils.js";

// =============== EXPORT TO EXCEL ==================
export function exportarMesExcel(mes, registros) {
  const registosMes = registros.filter(r => getMonthName(r.date) === mes);

  if (registosMes.length === 0) {
    alert("No records for " + mes);
    return;
  }

  const detalhes = registosMes.map(r => ({
    Date: r.date,
    Uber: r.uber.toFixed(2),
    Bolt: r.bolt.toFixed(2),
    Tips: r.tips.toFixed(2),
    Prizes: r.prizes.toFixed(2),
    Charging: r.charging.toFixed(2),
    Washing: r.washing.toFixed(2),
    Tolls: r.tolls.toFixed(2),
    Snacks: r.snacks.toFixed(2),
    Other: r.other.toFixed(2),
    "Net Profit": calcNetProfit(r.uber, r.bolt).toFixed(2),
    "Net + 2": calcNetPlus2(calcNetProfit(r.uber, r.bolt), r.tips).toFixed(2)
  }));

  // Monthly summary
  let summary = {
    Uber: 0, Bolt: 0, Tips: 0, Prizes: 0, Charging: 0, Washing: 0,
    Tolls: 0, Snacks: 0, Other: 0, "Net Profit": 0, "Net + 2": 0
  };

  registosMes.forEach(r => {
    summary.Uber += safe(r.uber);
    summary.Bolt += safe(r.bolt);
    summary.Tips += safe(r.tips);
    summary.Prizes += safe(r.prizes);
    summary.Charging += safe(r.charging);
    summary.Washing += safe(r.washing);
    summary.Tolls += safe(r.tolls);
    summary.Snacks += safe(r.snacks);
    summary.Other += safe(r.other);
    summary["Net Profit"] += calcNetProfit(r.uber, r.bolt);
    summary["Net + 2"] += calcNetPlus2(calcNetProfit(r.uber, r.bolt), r.tips);
  });

  detalhes.push({
    Date: "Summary",
    Uber: summary.Uber.toFixed(2),
    Bolt: summary.Bolt.toFixed(2),
    Tips: summary.Tips.toFixed(2),
    Prizes: summary.Prizes.toFixed(2),
    Charging: summary.Charging.toFixed(2),
    Washing: summary.Washing.toFixed(2),
    Tolls: summary.Tolls.toFixed(2),
    Snacks: summary.Snacks.toFixed(2),
    Other: summary.Other.toFixed(2),
    "Net Profit": summary["Net Profit"].toFixed(2),
    "Net + 2": summary["Net + 2"].toFixed(2)
  });

  // Create worksheet & export
  const ws = XLSX.utils.json_to_sheet(detalhes);
  const wb = XLSX.utils.book_new();
  XLSX.utils.book_append_sheet(wb, ws, mes);
  XLSX.writeFile(wb, `Resumo_${mes}.xlsx`);
}

// =============== EXPORT TO PDF ==================
export function exportarMesPDF(mes, registros) {
  const registosMes = registros.filter(r => getMonthName(r.date) === mes);

  if (registosMes.length === 0) {
    alert("No records for " + mes);
    return;
  }

  const doc = new jspdf.jsPDF();
  doc.setFontSize(18);
  doc.text(`TVDE Monthly Report - ${mes}`, 14, 15);

  const columns = [
    "Date", "Uber", "Bolt", "Tips", "Prizes", "Charging", "Washing",
    "Tolls", "Snacks", "Other", "Net Profit", "Net + 2"
  ];

  const rows = registosMes.map(r => [
    r.date,
    r.uber.toFixed(2),
    r.bolt.toFixed(2),
    r.tips.toFixed(2),
    r.prizes.toFixed(2),
    r.charging.toFixed(2),
    r.washing.toFixed(2),
    r.tolls.toFixed(2),
    r.snacks.toFixed(2),
    r.other.toFixed(2),
    calcNetProfit(r.uber, r.bolt).toFixed(2),
    calcNetPlus2(calcNetProfit(r.uber, r.bolt), r.tips).toFixed(2)
  ]);

  // Summary row
  let summary = {
    Uber: 0, Bolt: 0, Tips: 0, Prizes: 0, Charging: 0, Washing: 0,
    Tolls: 0, Snacks: 0, Other: 0, NetProfit: 0, NetPlus2: 0
  };

  registosMes.forEach(r => {
    summary.Uber += safe(r.uber);
    summary.Bolt += safe(r.bolt);
    summary.Tips += safe(r.tips);
    summary.Prizes += safe(r.prizes);
    summary.Charging += safe(r.charging);
    summary.Washing += safe(r.washing);
    summary.Tolls += safe(r.tolls);
    summary.Snacks += safe(r.snacks);
    summary.Other += safe(r.other);
    summary.NetProfit += calcNetProfit(r.uber, r.bolt);
    summary.NetPlus2 += calcNetPlus2(calcNetProfit(r.uber, r.bolt), r.tips);
  });

  rows.push([
    "Summary",
    summary.Uber.toFixed(2),
    summary.Bolt.toFixed(2),
    summary.Tips.toFixed(2),
    summary.Prizes.toFixed(2),
    summary.Charging.toFixed(2),
    summary.Washing.toFixed(2),
    summary.Tolls.toFixed(2),
    summary.Snacks.toFixed(2),
    summary.Other.toFixed(2),
    summary.NetProfit.toFixed(2),
    summary.NetPlus2.toFixed(2)
  ]);

  doc.autoTable({
    startY: 25,
    head: [columns],
    body: rows
  });

  doc.save(`Resumo_${mes}.pdf`);
}
