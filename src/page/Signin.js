import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { login, checkLogin } from '../component/Hfortapi';

function Forms() {
    const navigate = useNavigate();
    const [email, setEmail] = React.useState('');
    const [password, setPassword] = React.useState('');
    const [loginData, setLoginData] = useState('')

    useEffect(() => {
        checkPreLogin();
    }, []);

    async function checkPreLogin() {
        let response = await checkLogin();
        setLoginData(response);
    }

    useEffect(() => {
        console.log("loginData", loginData);
        if (loginData) {
            console.log("loginData", loginData);
            navigate('/');
        }
    }, [loginData]);

    const handleLogin = async (e) => {
        e.preventDefault();
        let response = await login(email, password);
        setLoginData(response);
    }
    return (
        <div className='position-absolute top-0 start-50 translate-middle-x mt-5 p-5'>
            <div className="card border-dark">
                <div className="card-body">
                    <form>
                        <div className="mb-3">
                            <label htmlFor="email" className="form-label fw-bold">Email</label>
                            <div className="input-group input-group-lg flex-nowrap">
                                <span className="input-group-text" id="addon-wrapping"><i className="fas fa-envelope"></i></span>
                                <input type="text" className="form-control" id="Email"
                                    value={email}
                                    onChange={(e) => setEmail(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="mb-3">
                            <label htmlFor="Password" className="form-label fw-bold">Password</label>
                            <div className="input-group input-group-lg flex-nowrap">
                                <span className="input-group-text" id="addon-wrapping"><i className="fas fa-lock"></i></span>
                                <input type="Password" className="form-control" id="Password"
                                    value={password}
                                    onChange={(e) => setPassword(e.target.value)}
                                />
                            </div>
                        </div>
                        <div className="d-grid gap-2 col-6 mx-auto">
                            <button type="submit" onClick={handleLogin} className="btn btn-dark">Sign in</button>
                        </div>
                    </form>
                </div>
            </div>
        </div>
    );
}
export default Forms;