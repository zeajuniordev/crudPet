import firebase from 'firebase/app'
import { auth, db } from './firebase'

// ─── CRUD de mascotas ────────────────────────────────────────────────────────

export const getCollection = async (collection) => {
    const result = { statusResponse: false, data: null, error: null }
    try {
        const data = await db.collection(collection).get()
        const arrayData = data.docs.map(doc => ({ id: doc.id, ...doc.data() }))
        result.statusResponse = true
        result.data = arrayData
    } catch (error) {
        result.error = error
    }
    return result
}

export const addDocument = async (collection, data) => {
    const result = { statusResponse: false, data: null, error: null }
    try {
        const response = await db.collection(collection).add(data)
        result.data = { id: response.id }
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

export const updateDocument = async (collection, id, data) => {
    const result = { statusResponse: false, error: null }
    try {
        await db.collection(collection).doc(id).update(data)
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

export const deleteDocument = async (collection, id) => {
    const result = { statusResponse: false, error: null }
    try {
        await db.collection(collection).doc(id).delete()
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

// ─── Autenticación ───────────────────────────────────────────────────────────
// Firebase cifra las contraseñas con bcrypt en el servidor antes de almacenarlas.
// Los tokens JWT firmados con RS256 garantizan la autorización entre cliente y Firestore.

export const registerUser = async (email, password, displayName) => {
    const result = { statusResponse: false, data: null, error: null }
    try {
        const credential = await auth.createUserWithEmailAndPassword(email, password)
        const user = credential.user

        await user.updateProfile({ displayName })

        // Perfil de usuario en Firestore — rol 'client' por defecto
        await db.collection('users').doc(user.uid).set({
            uid: user.uid,
            email,
            displayName,
            role: 'client',
            createdAt: firebase.firestore.FieldValue.serverTimestamp()
        })

        result.statusResponse = true
        result.data = { uid: user.uid, email, displayName, role: 'client' }
    } catch (error) {
        result.error = error
    }
    return result
}

export const loginUser = async (email, password) => {
    const result = { statusResponse: false, data: null, error: null }
    try {
        const credential = await auth.signInWithEmailAndPassword(email, password)
        result.statusResponse = true
        result.data = credential.user
    } catch (error) {
        result.error = error
    }
    return result
}

export const logoutUser = async () => {
    const result = { statusResponse: false, error: null }
    try {
        await auth.signOut()
        result.statusResponse = true
    } catch (error) {
        result.error = error
    }
    return result
}

export const getUserProfile = async (uid) => {
    const result = { statusResponse: false, data: null, error: null }
    try {
        const doc = await db.collection('users').doc(uid).get()
        if (doc.exists) {
            result.statusResponse = true
            result.data = doc.data()
        }
    } catch (error) {
        result.error = error
    }
    return result
}
