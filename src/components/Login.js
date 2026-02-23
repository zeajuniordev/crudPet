import React, { useState } from 'react'
import { loginUser } from '../actions'

const AUTH_ERRORS = {
    'auth/invalid-email': 'Email inválido.',
    'auth/user-not-found': 'Usuario no encontrado.',
    'auth/wrong-password': 'Contraseña incorrecta.',
    'auth/invalid-credential': 'Credenciales inválidas. Verifica email y contraseña.',
    'auth/too-many-requests': 'Demasiados intentos fallidos. Inténtalo más tarde.',
    'auth/user-disabled': 'Esta cuenta ha sido deshabilitada.',
}

const getAuthError = (code) =>
    AUTH_ERRORS[code] || 'Error al iniciar sesión. Inténtalo de nuevo.'

const Login = ({ onSwitch }) => {
    const [email, setEmail] = useState('')
    const [password, setPassword] = useState('')
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        if (!email || !password) {
            setError('Completa todos los campos.')
            return
        }

        setLoading(true)
        const result = await loginUser(email, password)
        setLoading(false)

        if (!result.statusResponse) {
            setError(getAuthError(result.error?.code))
        }
        // Si el login es exitoso, AuthContext detecta el cambio y muestra la app
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="card-title text-center mb-3">
                                <i className="bi bi-shield-lock-fill text-primary"></i> Iniciar Sesión
                            </h3>
                            <p className="text-center text-muted small mb-4">
                                <i className="bi bi-lock-fill"></i>{' '}
                                Contraseñas protegidas con cifrado <strong>bcrypt</strong> · Sesión via <strong>JWT</strong>
                            </p>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="login-email">Email</label>
                                    <input
                                        id="login-email"
                                        type="email"
                                        className="form-control"
                                        value={email}
                                        onChange={(e) => setEmail(e.target.value)}
                                        placeholder="ejemplo@veterinaria.com"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="form-group mt-3">
                                    <label htmlFor="login-password">Contraseña</label>
                                    <input
                                        id="login-password"
                                        type="password"
                                        className="form-control"
                                        value={password}
                                        onChange={(e) => setPassword(e.target.value)}
                                        placeholder="••••••••"
                                        autoComplete="current-password"
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3 py-2 small">
                                        <i className="bi bi-exclamation-triangle-fill"></i> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-primary btn-block mt-4"
                                    disabled={loading}
                                >
                                    <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-box-arrow-in-right'}`}></i>{' '}
                                    {loading ? 'Ingresando...' : 'Ingresar'}
                                </button>
                            </form>

                            <hr />
                            <p className="text-center mb-0 small">
                                ¿No tienes cuenta?{' '}
                                <button className="btn btn-link p-0 small" onClick={onSwitch}>
                                    Regístrate aquí
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Login
