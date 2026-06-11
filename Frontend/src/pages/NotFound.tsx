import { Link } from 'react-router-dom';

function NotFound() {
  return (
    <div className="page-card notfound-card">
      <h2>Página não encontrada</h2>
      <p>A página que você está procurando não existe.</p>
      <Link to="/" className="primary-button">
        Voltar ao dashboard
      </Link>
    </div>
  );
}

export default NotFound;
