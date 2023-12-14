import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import raw from './encrypted_emails.txt';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticatedContent from './components/authenticatedcontent.js';
import Overlay from "./components/Overlay";
import NonAuthenticatedContent from './components/non-authenticated-contented.js';

function App() {
  const [decryptedEmails, setDecryptedEmails] = useState([]);
  const [isAuthenticated, setIsAuthenticated] = useState(false);
	const [isToken ,setToken] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const response = await fetch(raw);
        const text = await response.text();
        const lines = text.split('\n');

        const emails = lines.map((line) => {
          try {
            const decoded = jwtDecode(line);
            return decoded.email;
          } catch (error) {
            console.error('Invalid token:', line);
            return null;
          }
        });

        const validEmails = emails.filter((email) => email !== null);

        setDecryptedEmails(validEmails);
      } catch (error) {
        console.error('Error reading or decoding file:', error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    const toggleOverlayAfterDelay = setTimeout(() => {
      setShowOverlay(false);
    }, 10000);

    return () => clearTimeout(toggleOverlayAfterDelay);
  }, []);

  const responseMessage = (response) => {
    const token = response?.credential;
		console.log('Token: ',token)

		if (token !== null && token !== undefined) {
			setToken(true);
		} else {
			setToken(false);
		}
		
    if (token) {
      const decoded = jwtDecode(token);
			console.log( 'Decode: ' ,decoded)

      if (decryptedEmails.includes(decoded.email)) {
        setIsAuthenticated(true);
      } else {
        setIsAuthenticated(false);
      }
    }
  };

  return (
    <Router>
      <div className="App">
        <Routes>
          <Route
            path="/"
            element={
              isAuthenticated ? (
                <AuthenticatedContent />
              ) : (
								isToken ? (
                <NonAuthenticatedContent />
              ) : (
								<Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)}>
								  <GoogleLogin onSuccess={responseMessage} />
							  </Overlay>
							)
						)
            }
          />
        </Routes>
      </div>
    </Router>
  );
}

export default App;

