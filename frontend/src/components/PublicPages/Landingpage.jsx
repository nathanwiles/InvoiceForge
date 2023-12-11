import "../../styles/landing-page.scss";

export default function LandingPage(props) {
  return (
    <div className="landing-container">
      <div className="landing-text-box card">
        <h3>Master your schedule with</h3>
        <div className="langing-page__logo">InvoiceForge</div>
        <article className="landing-text">
          <section>
            Create an account, add clients, and navigate your schedule intuitively!
          </section>
          <section>
            Edit, review, and bill appointments with ease!
          </section>
          <section>
            Generate accurate invoices with a few clicks!
          </section>

        </article>
        <p>Join today for a simplified approach to time management and billing!</p>

      </div>
      <img className="landing-image" src="/landing.jpg" alt="landing" />
    </div>
  );
};
