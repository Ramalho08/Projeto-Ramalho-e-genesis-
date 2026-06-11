function Transactions() {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Controle de gastos</p>
          <h2>Transações</h2>
          <p className="page-description">Aqui você pode ver todas as suas transações e adicionar novas entradas.</p>
        </div>
        <button className="primary-button" type="button">
          Adicionar
        </button>
      </div>

      <div className="section-block">
        <div className="section-title">
          <h3>Filtros rápidos</h3>
          <button className="secondary-button" type="button">
            Limpar filtros
          </button>
        </div>
        <div className="filter-row">
          <input type="text" placeholder="Buscar descrição" />
          <select>
            <option>Todos os tipos</option>
            <option>Entrada</option>
            <option>Saída</option>
          </select>
          <button className="secondary-button" type="button">
            Aplicar
          </button>
        </div>
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
              <th>Ações</th>
            </tr>
          </thead>
          <tbody>
            <tr>
              <td>Plano de celular</td>
              <td>Assinaturas</td>
              <td className="type expense">Saída</td>
              <td>R$ 89,90</td>
              <td>01/06/2026</td>
              <td>
                <button className="text-button">Editar</button>
                <button className="text-button danger">Excluir</button>
              </td>
            </tr>
            <tr>
              <td>Freelance</td>
              <td>Trabalho</td>
              <td className="type income">Entrada</td>
              <td>R$ 1.200,00</td>
              <td>30/05/2026</td>
              <td>
                <button className="text-button">Editar</button>
                <button className="text-button danger">Excluir</button>
              </td>
            </tr>
          </tbody>
        </table>
      </div>
    </div>
  );
}

export default Transactions;
