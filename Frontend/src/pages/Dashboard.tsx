function Dashboard() {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Visão Geral</p>
          <h2>Dashboard</h2>
          <p className="page-description">Resumo rápido das finanças e seus próximos passos.</p>
        </div>
        <button className="primary-button" type="button">
          Nova transação
        </button>
      </div>

      <div className="cards-grid">
        <article className="info-card">
          <span className="card-label">Saldo total</span>
          <strong>R$ 12.420,75</strong>
          <p className="card-meta">Receitas: R$ 8.560,00 • Despesas: R$ 4.139,25</p>
        </article>
        <article className="info-card">
          <span className="card-label">Receitas mês</span>
          <strong>R$ 8.560,00</strong>
          <p className="card-meta">Meta: 90% do objetivo</p>
        </article>
        <article className="info-card">
          <span className="card-label">Despesas mês</span>
          <strong>R$ 4.139,25</strong>
          <p className="card-meta">Redução de 12% em relação ao mês passado</p>
        </article>
      </div>

      <div className="section-block">
        <div className="section-title">
          <h3>Últimas transações</h3>
          <button className="secondary-button" type="button">
            Ver todas
          </button>
        </div>
        <div className="table-container">
          <table>
            <thead>
              <tr>
                <th>Descrição</th>
                <th>Categoria</th>
                <th>Tipo</th>
                <th>Valor</th>
                <th>Data</th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td>Salário</td>
                <td>Renda</td>
                <td className="type income">Entrada</td>
                <td>R$ 5.500,00</td>
                <td>05/06/2026</td>
              </tr>
              <tr>
                <td>Supermercado</td>
                <td>Alimentação</td>
                <td className="type expense">Saída</td>
                <td>R$ 620,00</td>
                <td>03/06/2026</td>
              </tr>
              <tr>
                <td>Transporte</td>
                <td>Mobilidade</td>
                <td className="type expense">Saída</td>
                <td>R$ 105,20</td>
                <td>02/06/2026</td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}

export default Dashboard;
