
import '../../styles/footer.scss';

export default function Footer (){
  return (
    <footer className="footer-container">
      <div className="footer-content">
        <div className="footer-links">
          <a href="#">Privacy Policy</a>
          <a href="#">Career</a>
          <a href="#">Contact Us</a>
          <a href="#">About Us</a>
        </div>
      </div>
      <p className="footer-company">&copy; 2023 InvoiceForge. All rights reserved.</p>
    </footer>
  );
}
