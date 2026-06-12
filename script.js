// Estado da aplicação (carrega do LocalStorage ou inicia zerado)
let dadosFinanceiros = JSON.parse(localStorage.getItem('financasData')) || {
    salario: 0,
    gastos: []
};

// Executa assim que a página carrega
document.addEventListener("DOMContentLoaded", () => {
    atualizarInterface();
});

// Função para alternar entre as abas do menu
function mudarPagina(idPagina) {
    document.querySelectorAll('.pagina').forEach(pag => {
        pag.classList.remove('ativa');
    });
    document.getElementById(`pag-${idPagina}`).classList.add('ativa');
}

// Salva o salário inicial
function salvarSalario() {
    const inputSalario = document.getElementById('salario-input');
    const valor = parseFloat(inputSalario.value);

    if (isNaN(valor) || valor <= 0) {
        alert("Por favor, insira um salário válido.");
        return;
    }

    dadosFinanceiros.salario = valor;
    salvarNoLocalStorage();
    atualizarInterface();
    inputSalario.value = '';
    alert("Salário atualizado com sucesso!");
}

// Adiciona um novo gasto à lista
function adicionarGasto() {
    const descInput = document.getElementById('gasto-desc');
    const valorInput = document.getElementById('gasto-valor');

    const descricao = descInput.value.trim();
    const valor = parseFloat(valorInput.value);

    if (descricao === "" || isNaN(valor) || valor <= 0) {
        alert("Preencha a descrição e o valor corretamente.");
        return;
    }

    const novoGasto = {
        id: Date.now(),
        descricao: descricao,
        valor: valor
    };

    dadosFinanceiros.gastos.push(novoGasto);
    salvarNoLocalStorage();
    atualizarInterface();

    // Limpa os campos
    descInput.value = '';
    valorInput.value = '';
}

// Calcula totais e atualiza todas as páginas
function atualizarInterface() {
    const totalGastos = dadosFinanceiros.gastos.reduce((total, gasto) => total + gasto.valor, 0);
    const saldo = dadosFinanceiros.salario - totalGastos;

    // Formatadores de moeda
    const formatar = (v) => v.toLocaleString('pt-BR', { style: 'currency', currency: 'BRL' });

    // Atualiza Dashboard
    document.getElementById('dash-renda').innerText = formatar(dadosFinanceiros.salario);
    document.getElementById('dash-gastos').innerText = formatar(totalGastos);
    document.getElementById('dash-saldo').innerText = formatar(saldo);

    // Atualiza Lista de Gastos da Página 2
    const listaUl = document.getElementById('lista-gastos');
    listaUl.innerHTML = '';
    dadosFinanceiros.gastos.forEach(gasto => {
        const li = document.createElement('li');
        li.innerHTML = `<span>${gasto.descricao}</span> <span class="valor">-${formatar(gasto.valor)}</span>`;
        listaUl.appendChild(li);
    });

    // Atualiza Resumo de Fim de Mês
    document.getElementById('resumo-renda').innerText = formatar(dadosFinanceiros.salario);
    document.getElementById('resumo-gastos').innerText = formatar(totalGastos);
    document.getElementById('resumo-saldo').innerText = formatar(saldo);

    // Define status e gera as dicas baseadas na saúde financeira
    const statusSpan = document.getElementById('resumo-status');
    if (dadosFinanceiros.salario === 0) {
        statusSpan.innerText = "Defina seu salário primeiro.";
        statusSpan.style.color = "orange";
    } else {
        const percentualComprometido = (totalGastos / dadosFinanceiros.salario) * 100;
        gerarDicas(percentualComprometido, saldo);
    }
}

// Gera dicas condicionais automáticas
function gerarDicas(porcentagem, saldo) {
    const containerDicas = document.getElementById('container-dicas');
    const statusSpan = document.getElementById('resumo-status');
    let htmlDicas = "";

    if (saldo < 0) {
        statusSpan.innerText = "No Vermelho 🚨";
        statusSpan.style.color = "red";
        htmlDicas = `
            <p>⚠️ <strong>Atenção Crítica:</strong> Você gastou mais do que ganhou. Evite parcelamentos e cartões de crédito imediatamente.</p>
            <p>💡 <strong>Corte o supérfluo:</strong> Revise sua lista de gastos e veja o que pode ser cancelado (assinaturas que não usa, delivery excessivo).</p>
            <p>🎯 <strong>Meta:</strong> Tente negociar dívidas fixas se houver e priorize pagar o essencial no próximo mês.</p>
        `;
    } else if (porcentagem > 80) {
        statusSpan.innerText = "Alerta: Orçamento Apertado ⚠️";
        statusSpan.style.color = "orange";
        htmlDicas = `
            <p>📉 <strong>Zona de risco:</strong> Mais de 80% da sua renda está comprometida. Qualquer imprevisto pode te levar ao vermelho.</p>
            <p>🛒 <strong>Regra das 24 horas:</strong> Antes de fazer qualquer compra não planejada, espere 24 horas para decidir se realmente precisa dela.</p>
        `;
    } else if (porcentagem > 0 && porcentagem <= 50) {
        statusSpan.innerText = "Excelente Saúde Financeira! 🟢";
        statusSpan.style.color = "green";
        htmlDicas = `
            <p>🎉 <strong>Parabéns!</strong> Você gasta menos da metade do seu salário. Você tem excelente controle.</p>
            <p>💰 <strong>Invista seu futuro:</strong> Que tal pegar esse saldo livre e começar uma "Reserva de Emergência" (equivalente a 6 meses do seu custo de vida)?</p>
        `;
    } else {
        statusSpan.innerText = "Equilibrado, mas pode melhorar 👍";
        statusSpan.style.color = "blue";
        htmlDicas = `
            <p>⚖️ <strong>Bom caminho:</strong> Seus gastos estão controlados, mas a margem de segurança está pequena.</p>
            <p>📊 <strong>Regra 50/30/20:</strong> Tente direcionar 50% para necessidades, 30% para desejos e guardar 20% para o seu futuro.</p>
        `;
    }

    containerDicas.innerHTML = htmlDicas;
}

function salvarNoLocalStorage() {
    localStorage.setItem('financasData', JSON.stringify(dadosFinanceiros));
}

// Reseta o aplicativo
function limparDados() {
    if (confirm("Deseja realmente apagar todos os dados deste mês?")) {
        dadosFinanceiros = { salario: 0, gastos: [] };
        salvarNoLocalStorage();
        atualizarInterface();
        alert("Dados limpos!");
    }
}
