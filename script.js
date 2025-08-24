// Itens fixos iniciais
const itensFixos = ["2 pares de luvas", "2 capacetes"];
const dias = ["Domingo","Segunda","Terça","Quarta","Quinta","Sexta","Sábado"];
const hoje = new Date();
const diaSemana = dias[hoje.getDay()];
document.getElementById("diaSemana").innerText = "Hoje é " + diaSemana;

// Carregar checklist do dia
function carregarChecklist() {
  let checklist = JSON.parse(localStorage.getItem("checklist_" + diaSemana)) || [];

  if (checklist.length === 0) {
    checklist = itensFixos.map(item => ({item, conferido: false, bom_estado: true}));
  }

  renderizarChecklist(checklist);
}

// Renderizar checklist
function renderizarChecklist(checklist) {
  let html = `
    <table class="table table-bordered bg-white shadow">
      <thead class="table-dark">
        <tr>
          <th>Item</th>
          <th>Conferido</th>
          <th>Bom Estado</th>
          <th>Ações</th>
        </tr>
      </thead>
      <tbody>
  `;

  checklist.forEach((row, index) => {
    html += `
      <tr>
        <td>${row.item}</td>
        <td><input type="checkbox" class="form-check-input" onchange="atualizar(${index}, 'conferido', this.checked)" ${row.conferido ? "checked" : ""}></td>
        <td>
          <select class="form-select" onchange="atualizar(${index}, 'bom_estado', this.value == 'true')">
            <option value="true" ${row.bom_estado ? "selected" : ""}>Sim</option>
            <option value="false" ${!row.bom_estado ? "selected" : ""}>Não</option>
          </select>
        </td>
        <td>
          <button class="btn btn-danger btn-sm" onclick="removerItem(${index})">🗑️ Remover</button>
        </td>
      </tr>
    `;
  });

  html += "</tbody></table>";
  document.getElementById("checklistContainer").innerHTML = html;
  localStorage.setItem("checklist_" + diaSemana, JSON.stringify(checklist));
}

// Atualizar status
function atualizar(index, campo, valor) {
  let checklist = JSON.parse(localStorage.getItem("checklist_" + diaSemana)) || [];
  checklist[index][campo] = valor;
  localStorage.setItem("checklist_" + diaSemana, JSON.stringify(checklist));
}

// Adicionar item
function adicionarItem() {
  let novoItem = document.getElementById("novoItem").value.trim();
  if (novoItem === "") {
    alert("Digite o nome do item antes de adicionar!");
    return;
  }

  let checklist = JSON.parse(localStorage.getItem("checklist_" + diaSemana)) || [];
  checklist.push({item: novoItem, conferido: false, bom_estado: true});

  localStorage.setItem("checklist_" + diaSemana, JSON.stringify(checklist));
  document.getElementById("novoItem").value = "";
  renderizarChecklist(checklist);
}

// Remover item
function removerItem(index) {
  if (confirm("Tem certeza que deseja remover este item?")) {
    let checklist = JSON.parse(localStorage.getItem("checklist_" + diaSemana)) || [];
    checklist.splice(index, 1);
    localStorage.setItem("checklist_" + diaSemana, JSON.stringify(checklist));
    renderizarChecklist(checklist);
  }
}

// Salvar checklist
function salvarChecklist() {
  alert("Checklist de " + diaSemana + " salvo com sucesso ✅");
  gerarRelatorio();
}

// Limpar relatórios semanais
function limparRelatorio() {
  if (confirm("Tem certeza que deseja limpar TODOS os relatórios?")) {
    dias.forEach(dia => {
      localStorage.removeItem("checklist_" + dia);
    });
    carregarChecklist();
    gerarRelatorio();
    alert("Relatórios apagados com sucesso 🧹");
  }
}

// Relatório semanal
function gerarRelatorio() {
  let html = `
    <table class="table table-striped bg-white shadow">
      <thead class="table-primary">
        <tr>
          <th>Dia</th>
          <th>Item</th>
          <th>Conferido</th>
          <th>Bom Estado</th>
        </tr>
      </thead>
      <tbody>
  `;

  dias.forEach(dia => {
    let checklist = JSON.parse(localStorage.getItem("checklist_" + dia)) || [];
    checklist.forEach(row => {
      html += `
        <tr>
          <td>${dia}</td>
          <td>${row.item}</td>
          <td>${row.conferido ? "✅" : "❌"}</td>
          <td>${row.bom_estado ? "👍" : "⚠️"}</td>
        </tr>
      `;
    });
  });

  html += "</tbody></table>";
  document.getElementById("relatorio").innerHTML = html;
}

// Inicialização
carregarChecklist();
gerarRelatorio();
