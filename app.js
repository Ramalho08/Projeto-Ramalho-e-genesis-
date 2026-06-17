
const dados=JSON.parse(localStorage.getItem('financeiroPro'))||{
salario:0,meta:0,gastos:[],historico:{}
};

function salvar(){
localStorage.setItem('financeiroPro',JSON.stringify(dados));
render();
}

function salvarConfiguracoes(){
dados.salario=+salario.value;
dados.meta=+meta.value;
salvar();
}

function adicionarGasto(){
dados.gastos.push({
descricao:descricao.value,
valor:+valor.value,
categoria:categoria.value
});
salvar();
}

function excluir(i){
dados.gastos.splice(i,1);
salvar();
}

function fecharMes(){
const chave=new Date().toISOString().slice(0,7);
dados.historico[chave]={
salario:dados.salario,
gastos:[...dados.gastos]
};
dados.gastos=[];
salvar();
}

function toggleTheme(){
document.body.classList.toggle('dark');
}

function render(){
const total=dados.gastos.reduce((a,g)=>a+g.valor,0);
const saldo=dados.salario-total;

renda.textContent='R$ '+dados.salario.toFixed(2);
gastos.textContent='R$ '+total.toFixed(2);
saldo.textContent='R$ '+saldo.toFixed(2);

metaStatus.textContent=dados.meta>0
? `${Math.max(0,(saldo/dados.meta*100)).toFixed(0)}% da meta`
: 'Não definida';

lista.innerHTML='';
dados.gastos.forEach((g,i)=>{
lista.innerHTML+=`<li>${g.descricao} (${g.categoria}) - R$ ${g.valor.toFixed(2)}
<button onclick="excluir(${i})">❌</button></li>`;
});

historico.innerHTML='';
Object.entries(dados.historico).forEach(([mes,v])=>{
const totalMes=v.gastos.reduce((a,g)=>a+g.valor,0);
historico.innerHTML+=`<li>${mes} | Saldo: R$ ${(v.salario-totalMes).toFixed(2)}</li>`;
});

const categorias={};
dados.gastos.forEach(g=>{
categorias[g.categoria]=(categorias[g.categoria]||0)+g.valor;
});

const ctx=document.getElementById('grafico');
if(window.chartInstance) window.chartInstance.destroy();

window.chartInstance=new Chart(ctx,{
type:'pie',
data:{
labels:Object.keys(categorias),
datasets:[{data:Object.values(categorias)}]
}
});
}

render();
