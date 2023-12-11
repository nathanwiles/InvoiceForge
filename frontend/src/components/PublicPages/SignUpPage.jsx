import "../../styles/signup-page.scss"

export default function SignUpForm(props) {

  return (
    <div className="sign-up-container">
      <form className="sign-up-form" >
        <h2>Create an Account</h2>
        <div className="form-group">
          <label htmlFor="firstName">First Name</label>
          <input type="text" id="firstName" name="firstName" required />
        </div>
        <div className="form-group">
          <label htmlFor="lastName">Last Name</label>
          <input type="text" id="lastName" name="lastName" required />
        </div>
        <div className="form-group">
          <label htmlFor="businessName">Business Name</label>
          <input type="text" id="businessName" name="businessName" required />
        </div>
        <div className="form-group">
          <label htmlFor="standardRate">Standard Rate</label>
          <input type="number" id="standardRate" name="standardRate" required />
        </div>
        <div className="form-group">
          <label htmlFor="email">Email</label>
          <input type="email" id="email" name="email" required />
        </div>
        <div className="form-group">
          <label htmlFor="password">Password</label>
          <input type="password" id="password" name="password" required />
        </div>
        <button type="submit">Sign Up</button>
      </form>
      <div className="sign-up-image"><imag></imag></div>
    </div>
  );
};
