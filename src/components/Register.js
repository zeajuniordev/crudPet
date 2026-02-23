import React, { useState } from 'react'
import { registerUser } from '../actions'

const AUTH_ERRORS = {
    'auth/email-already-in-use': 'Este email ya está registrado.',
    'auth/invalid-email': 'Email inválido.',
    'auth/weak-password': 'La contraseña debe tener al menos 6 caracteres.',
    'auth/operation-not-allowed': 'El registro por email no está habilitado.',
}

const getAuthError = (code) =>
    AUTH_ERRORS[code] || 'Error al registrar. Inténtalo de nuevo.'

const EMPTY_FORM = { displayName: '', email: '', password: '', confirmPassword: '' }

const Register = ({ onSwitch }) => {
    const [form, setForm] = useState(EMPTY_FORM)
    const [error, setError] = useState(null)
    const [loading, setLoading] = useState(false)

    const handleChange = (e) =>
        setForm({ ...form, [e.target.name]: e.target.value })

    const handleSubmit = async (e) => {
        e.preventDefault()
        setError(null)

        const { displayName, email, password, confirmPassword } = form

        if (!displayName || !email || !password || !confirmPassword) {
            setError('Completa todos los campos.')
            return
        }
        if (password.length < 8) {
            setError('La contraseña debe tener al menos 8 caracteres.')
            return
        }
        if (password !== confirmPassword) {
            setError('Las contraseñas no coinciden.')
            return
        }

        setLoading(true)
        const result = await registerUser(email, password, displayName)
        setLoading(false)

        if (!result.statusResponse) {
            setError(getAuthError(result.error?.code))
        }
        // Si el registro es exitoso, Firebase Auth inicia sesión automáticamente
        // y AuthContext detecta el cambio
    }

    return (
        <div className="container mt-5">
            <div className="row justify-content-center">
                <div className="col-md-5">
                    <div className="card shadow-sm">
                        <div className="card-body p-4">
                            <h3 className="card-title text-center mb-3">
                                <i className="bi bi-person-plus-fill text-success"></i> Crear Cuenta
                            </h3>

                            <div className="alert alert-info py-2 small mb-3">
                                <i className="bi bi-info-circle-fill"></i>{' '}
                                Los nuevos usuarios se registran con rol <strong>Cliente</strong> (solo lectura).<br />
                                Un <strong>Administrador</strong> puede cambiar el rol directamente en Firestore.
                            </div>

                            <form onSubmit={handleSubmit}>
                                <div className="form-group">
                                    <label htmlFor="reg-name">Nombre completo</label>
                                    <input
                                        id="reg-name"
                                        type="text"
                                        className="form-control"
                                        name="displayName"
                                        value={form.displayName}
                                        onChange={handleChange}
                                        placeholder="Tu nombre"
                                    />
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="reg-email">Email</label>
                                    <input
                                        id="reg-email"
                                        type="email"
                                        className="form-control"
                                        name="email"
                                        value={form.email}
                                        onChange={handleChange}
                                        placeholder="ejemplo@veterinaria.com"
                                        autoComplete="email"
                                    />
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="reg-password">
                                        Contraseña{' '}
                                        <small className="text-muted">(mínimo 8 caracteres)</small>
                                    </label>
                                    <input
                                        id="reg-password"
                                        type="password"
                                        className="form-control"
                                        name="password"
                                        value={form.password}
                                        onChange={handleChange}
                                        placeholder="••••••••"
                                        autoComplete="new-password"
                                    />
                                </div>

                                <div className="form-group mt-2">
                                    <label htmlFor="reg-confirm">Confirmar contraseña</label>
                                    <input
                                        id="reg-confirm"
                                        type="password"
                                        className="form-control"
                                        name="confirmPassword"
                                        value={form.confirmPassword}
                                        onChange={handleChange}
                                        placeholder="Repite tu contraseña"
                                        autoComplete="new-password"
                                    />
                                </div>

                                {error && (
                                    <div className="alert alert-danger mt-3 py-2 small">
                                        <i className="bi bi-exclamation-triangle-fill"></i> {error}
                                    </div>
                                )}

                                <button
                                    type="submit"
                                    className="btn btn-success btn-block mt-4"
                                    disabled={loading}
                                >
                                    <i className={`bi ${loading ? 'bi-hourglass-split' : 'bi-person-check-fill'}`}></i>{' '}
                                    {loading ? 'Registrando...' : 'Registrarse'}
                                </button>
                            </form>

                            <hr />
                            <p className="text-center mb-0 small">
                                ¿Ya tienes cuenta?{' '}
                                <button className="btn btn-link p-0 small" onClick={onSwitch}>
                                    Inicia sesión aquí
                                </button>
                            </p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
}

export default Register
