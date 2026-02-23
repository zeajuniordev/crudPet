import React from 'react'
import { useAuth } from '../context/AuthContext'
import { logoutUser } from '../actions'
import swal from 'sweetalert'

const Header = () => {
    const { currentUser, isAdmin } = useAuth()

    const handleLogout = async () => {
        const confirmed = await swal({
            title: '¿Cerrar sesión?',
            icon: 'warning',
            buttons: ['Cancelar', 'Salir'],
        })
        if (!confirmed) return
        await logoutUser()
    }

    return (
        <nav className="navbar navbar-expand navbar-dark bg-dark px-4">
            <span className="navbar-brand mb-0 h5">
                <i className="bi bi-heart-pulse-fill text-danger"></i> Mascotas CRUD
            </span>

            <div className="ml-auto d-flex align-items-center">
                {/* Badge de rol */}
                <span
                    className={`badge mr-3 ${isAdmin ? 'badge-danger' : 'badge-info'}`}
                    title={isAdmin ? 'Acceso total' : 'Solo lectura'}
                >
                    <i className={`bi ${isAdmin ? 'bi-shield-fill' : 'bi-person-fill'}`}></i>{' '}
                    {isAdmin ? 'Administrador' : 'Cliente'}
                </span>

                {/* Email del usuario */}
                <span className="text-light small mr-3">
                    <i className="bi bi-person-circle"></i>{' '}
                    {currentUser?.displayName || currentUser?.email}
                </span>

                {/* Botón cerrar sesión */}
                <button
                    className="btn btn-outline-light btn-sm"
                    onClick={handleLogout}
                >
                    <i className="bi bi-box-arrow-right"></i> Salir
                </button>
            </div>
        </nav>
    )
}

export default Header
