import "../styling/Footer.css"
const Footer = () => {
  return (
    <footer>
        <h3>Sicilian Squad</h3>
        
          <div className="footer-icons">
              {/* Instagram Icon */}
              <a href="https://instagram.com" target="_blank" rel="noreferrer" aria-label="Instagram">
                  <i className="fab fa-instagram"></i>
              </a>

              {/* Facebook Icon */}
              <a href="https://facebook.com" target="_blank" rel="noreferrer" aria-label="Facebook">
                  <i className="fab fa-facebook-f"></i>
              </a>

              {/* GitHub Icon */}
              <a href="https://github.com" target="_blank" rel="noreferrer" aria-label="GitHub">
                  <i className="fab fa-github"></i>
              </a>

              <div className="footer-nav">
                  <a href="/">Home</a>
                  <a href="/contact">Contact Us</a>
              </div>

          </div>
          <p>Copyright &copy; 2025; Designed by: <strong>Sicilian Squad</strong></p>
    </footer>
  )
}

export default Footer