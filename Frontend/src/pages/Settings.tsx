function Settings() {
  return (
    <div className="page-card">
      <div className="page-header">
        <div>
          <p className="eyebrow">Preferências</p>
          <h2>Configurações</h2>
          <p className="page-description">Ajuste suas preferências de conta e o visual do painel.</p>
        </div>
      </div>

      <div className="section-block">
        <h3>Perfil</h3>
        <div className="settings-grid">
          <div className="settings-card">
            <strong>Nome do usuário</strong>
            <p>João Silva</p>
          </div>
          <div className="settings-card">
            <strong>Email</strong>
            <p>joao.silva@example.com</p>
          </div>
          <div className="settings-card">
            <strong>Idioma</strong>
            <p>Português (BR)</p>
          </div>
        </div>
      </div>

      <div className="section-block">
        <h3>Aparência</h3>
        <div className="settings-grid">
          <button className="secondary-button">Modo claro</button>
          <button className="secondary-button">Modo escuro</button>
        </div>
      </div>
    </div>
  );
}

export default Settings;
