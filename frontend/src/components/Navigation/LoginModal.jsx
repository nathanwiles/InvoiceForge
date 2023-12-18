import { useState } from 'react';
import { getAuth, signInWithEmailAndPassword } from 'firebase/auth';
import { app as firebase } from '../../api/firebase'; // import firebase
import '../../styles/login-modal.scss';

const LoginModal = (props) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState(''); // add password state
  const [loginError, setLoginError] = useState(null);
  const { setUser, handleLinkClick } = props;

  const fetchUser = async () => {
    try {
      if (!email || !password) {
        setLoginError('Email and password cannot be empty');
        return;
      }

      const auth = getAuth(firebase);
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      const user = userCredential.user;
      setUser(user);
      setLoginError(null);
    } catch (error) {
      console.log(error);
      setLoginError('Login failed');
    }
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    fetchUser();
  };

  return (
    <div className="login-container">
      <div className="login-modal" id="loginModal">
        <span className="login-close" onClick={props.onClose}>
          &times;
        </span>
        <div className="modal-content">
          <h2>Login</h2>
          <form onSubmit={handleSubmit}>
            <div className="login-form">
              <div className="login-form-group">
                <label htmlFor="email">Email:</label>
                <input
                  type="email"
                  id="email"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="login-form-group">
                <label htmlFor="password">Password:</label>
                <input
                  type="password"
                  id="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)} // add password onChange handler
                  required
                />
              </div>
              <button className='login-button' type="submit">Login</button>
            </div>
          </form>
          {loginError && <div className="error-message">{loginError}</div>}
        </div>
      </div>
    </div>
  );
};

export default LoginModal;
