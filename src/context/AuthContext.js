import React, { createContext, useContext, useEffect, useState } from 'react'
import { auth, db } from '../firebase'

const AuthContext = createContext()

export const useAuth = () => useContext(AuthContext)

/**
 * Proveedor de autenticación.
 * Escucha el estado de Firebase Auth y carga el perfil del usuario (rol) desde Firestore.
 * Mientras resuelve el estado inicial no renderiza hijos para evitar parpadeos.
 */
export const AuthProvider = ({ children }) => {
    const [currentUser, setCurrentUser] = useState(null)
    const [userRole, setUserRole] = useState(null)
    const [loadingAuth, setLoadingAuth] = useState(true)

    useEffect(() => {
        const unsubscribe = auth.onAuthStateChanged(async (user) => {
            setCurrentUser(user)
            if (user) {
                try {
                    const doc = await db.collection('users').doc(user.uid).get()
                    setUserRole(doc.exists ? doc.data().role : null)
                } catch {
                    setUserRole(null)
                }
            } else {
                setUserRole(null)
            }
            setLoadingAuth(false)
        })
        return unsubscribe
    }, [])

    const value = {
        currentUser,
        userRole,
        isAdmin: userRole === 'admin',
        isClient: userRole === 'client',
    }

    return (
        <AuthContext.Provider value={value}>
            {!loadingAuth && children}
        </AuthContext.Provider>
    )
}
