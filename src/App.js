import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import raw from './encrypted_emails.txt';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthenticatedContent from './components/authenticatedcontent.js';
import Overlay from "./components/Overlay/overlay";
import NonAuthenticatedContent from './components/non-authenticated-contented.js';
import env from "react-dotenv";

const CryptoJS = require('crypto-js');


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
						const secret_key = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345';										
						try {            
							const decryptedEmails = CryptoJS.AES.decrypt(line, secret_key).toString(CryptoJS.enc.Utf8);
							return decryptedEmails;
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
		}, []
	);

  useEffect(() => {
			const toggleOverlayAfterDelay = setTimeout(() => {
				setShowOverlay(false);
			}, 2000000);

			return () => clearTimeout(toggleOverlayAfterDelay);
		}, []
	);

  const responseMessage = (response) => {
			const token = response?.credential;

			if (token !== null && token !== undefined) {
				setToken(true);
			} else {
				setToken(false);
			}
			
			if (token) {
				const decoded = jwtDecode(token);

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

