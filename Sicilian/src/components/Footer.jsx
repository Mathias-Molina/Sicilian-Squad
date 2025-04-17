import { Link } from "react-router-dom";

export const Footer = () => {
  return (
    <footer>
      <h3>Sicilian Squad</h3>
      <div className="footer-icons">
        {/* Instagram Icon */}
        <a
          href="https://instagram.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Instagram"
        >
          <i className="fab fa-instagram"></i>
        </a>

        {/* Facebook Icon */}
        <a
          href="https://facebook.com"
          target="_blank"
          rel="noreferrer"
          aria-label="Facebook"
        >
          <i className="fab fa-facebook-f"></i>
        </a>

        {/* GitHub Icon */}
        <a
          href="https://github.com"
          target="_blank"
          rel="noreferrer"
          aria-label="GitHub"
        >
          <i className="fab fa-github"></i>
        </a>

        <div className="footer-nav">
          <Link to="/">Hem</Link>
          <Link to="/contact">Kontakta oss</Link>
        </div>
      </div>
      <p>
        Copyright &copy; 2025; Designad av: <strong>Sicilian Squad</strong>
      </p>
    </footer>
  );
};
