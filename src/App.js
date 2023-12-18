import React, { useState, useEffect } from 'react';
import { GoogleLogin } from '@react-oauth/google';
import { jwtDecode } from 'jwt-decode';
import { BrowserRouter as Router, Route, Routes } from 'react-router-dom';
import AuthorizedContent from '/home/sangeetha/Programming/google-oauth/client/src/components/autherizedcontent.js';
import Overlay from "./components/Overlay/overlay";
import NonauthorizedContent from './components/non-autherized-content.js';

const CryptoJS = require('crypto-js');


function App() {
  const [decryptedEmails, setDecryptedEmails] = useState([]);
  const [isauthorized, setIsauthorized] = useState(false);
	const [isToken ,setToken] = useState(false)
  const [showOverlay, setShowOverlay] = useState(true);

  useEffect(() => {
			const fetchData = async () => {
				try {
					const response = await fetch('https://raw.githubusercontent.com/flame-tao/ltkw-encrypt/main/base.json?token=GHSAT0AAAAAACLGDDYRVGP2J2WDRZSUSWDKZMAEM4Q');
					const data = await response.json();

					const secret_key = process.env.REACT_APP_SECRET_KEY ? process.env.REACT_APP_SECRET_KEY : '12345';										

					const emails = data.map((encryptedEmail) => {
						try {            
							const decryptedEmails = CryptoJS.AES.decrypt(encryptedEmail.data, secret_key).toString(CryptoJS.enc.Utf8);
							return decryptedEmails;
						} catch (error) {
							console.error('Invalid token:', response);
							console.error('Error decrypting email:', error);
			
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
					setIsauthorized(true);
				} else {
					setIsauthorized(false);
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
              isauthorized ? (
                <AuthorizedContent />
              ) : (
								isToken ? (
                <NonauthorizedContent />
              ) : (
								<Overlay isOpen={showOverlay} onClose={() => setShowOverlay(false)}>
      	          <center style={{paddingBottom: "10%", fontSize: "30px"}}>Welcome!</center>
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

