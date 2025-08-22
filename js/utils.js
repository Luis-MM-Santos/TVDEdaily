export function safe(val) {
    let n = Number(val);
    return isNaN(n) ? 0 : n;
  }
  
  export function getMonthName(dateStr) {
    if (!dateStr) return "";
    const d = new Date(dateStr);
    const months = ["Jan","Feb","Mar","Apr","May","Jun","Jul","Aug","Sep","Oct","Nov","Dec"];
    return `${months[d.getMonth()]} ${d.getFullYear()}`;
  }
  
  export function calcNetProfit(uber, bolt) {
    return (safe(uber) * 0.75 + safe(bolt) * 0.80);
  }
  
  export function calcNetPlus2(netProfit, tips) {
    return (safe(netProfit) * 0.5 + safe(tips));
  }
  