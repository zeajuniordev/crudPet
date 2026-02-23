import React, { useState, useEffect } from 'react';
import { isEmpty, size } from 'lodash';
import { Button, Modal, ModalBody, ModalHeader, ModalFooter } from 'reactstrap';
import { addDocument, deleteDocument, getCollection, updateDocument } from './actions';
import swal from 'sweetalert';
import { useAuth } from './context/AuthContext';
import Header from './components/Header';
import Login from './components/Login';
import Register from './components/Register';

const EMPTY_PET = {
  namePet: "",
  typePet: "",
  racePet: "",
  date: "",
  nameOwner: "",
  phone: "",
  address: "",
  mail: ""
};

function App() {
  const { currentUser, isAdmin } = useAuth();
  const [showRegister, setShowRegister] = useState(false);

  // ── Estado del CRUD ────────────────────────────────────────────────────────
  const [pet, setPet] = useState(EMPTY_PET);
  const [pets, setPets] = useState([]);
  const [modal, setModal] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [id, setId] = useState("");
  const [error, setError] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (!currentUser) return;
    (async () => {
      const result = await getCollection("pets");
      if (result.statusResponse) {
        setPets(result.data);
      }
    })();
  }, [currentUser]);

  // ── Mostrar Login / Register si no hay sesión ──────────────────────────────
  if (!currentUser) {
    return showRegister
      ? <Register onSwitch={() => setShowRegister(false)} />
      : <Login onSwitch={() => setShowRegister(true)} />;
  }

  // ── Lógica CRUD ────────────────────────────────────────────────────────────

  const validForm = () => {
    setError(null);
    if (
      isEmpty(pet.namePet) || isEmpty(pet.typePet) || isEmpty(pet.racePet) ||
      isEmpty(pet.date) || isEmpty(pet.nameOwner) || isEmpty(pet.phone) ||
      isEmpty(pet.address) || isEmpty(pet.mail)
    ) {
      setError("Debes ingresar toda la información.");
      return false;
    }
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(pet.mail)) {
      setError("Ingresa un email válido.");
      return false;
    }
    return true;
  };

  const handleInputChange = (e) =>
    setPet({ ...pet, [e.target.name]: e.target.value });

  const resetPet = () => setPet(EMPTY_PET);

  const addPet = async (e) => {
    e.preventDefault();
    if (!validForm()) return;

    setLoading(true);
    const result = await addDocument("pets", { ...pet });
    setLoading(false);

    if (!result.statusResponse) {
      setError("Error al agregar la mascota. Inténtalo de nuevo.");
      return;
    }

    setPets([...pets, { id: result.data.id, ...pet }]);
    resetPet();
    setModal(false);
    swal("¡Exitoso!", "Mascota agregada correctamente.", "success");
  };

  const deletePet = async (petId) => {
    const confirmed = await swal({
      title: "¿Estás seguro?",
      text: "Esta acción no se puede deshacer.",
      icon: "warning",
      buttons: ["Cancelar", "Eliminar"],
      dangerMode: true,
    });
    if (!confirmed) return;

    const result = await deleteDocument("pets", petId);
    if (!result.statusResponse) {
      swal("Error", "Error al eliminar la mascota.", "error");
      return;
    }
    setPets(pets.filter((p) => p.id !== petId));
  };

  const editPet = (thePet) => {
    setPet(thePet);
    setEditMode(true);
    setId(thePet.id);
    setModal(true);
  };

  const savePet = async (e) => {
    e.preventDefault();
    if (!validForm()) return;

    setLoading(true);
    const result = await updateDocument("pets", id, { ...pet });
    setLoading(false);

    if (!result.statusResponse) {
      setError("Error al actualizar la mascota. Inténtalo de nuevo.");
      return;
    }

    setPets(pets.map((item) => (item.id === id ? { id, ...pet } : item)));
    setEditMode(false);
    setId("");
    resetPet();
    setModal(false);
    swal("¡Exitoso!", "Mascota actualizada correctamente.", "success");
  };

  const openModal = () => {
    resetPet();
    setError(null);
    setEditMode(false);
    setModal(true);
  };

  const toggle = () => {
    if (modal) {
      setEditMode(false);
      setId("");
      setError(null);
      resetPet();
    }
    setModal(!modal);
  };

  // ── Render ─────────────────────────────────────────────────────────────────
  return (
    <>
      <Header />

      <div className="container mt-4">
        <div className="row">
          <div className="col-12">
            {/* Botón Crear — solo visible para Administrador */}
            {isAdmin && (
              <button
                className="btn btn-success btn-md float-right"
                onClick={openModal}
                aria-label="Crear nueva mascota"
              >
                <i className="bi bi-plus-square-fill"></i> Crear
              </button>
            )}

            {!isAdmin && (
              <div className="alert alert-secondary py-2 small mb-3">
                <i className="bi bi-eye-fill"></i> Modo <strong>Cliente</strong>: visualización de registros (sin permisos de edición).
              </div>
            )}

            <table className="table table-hover mt-2">
              <thead className="thead-dark">
                <tr>
                  <th>Nombre</th>
                  <th>Tipo</th>
                  <th>Raza</th>
                  <th>Fecha Nacimiento</th>
                  <th>Propietario</th>
                  <th>Teléfono</th>
                  <th>Dirección</th>
                  <th>Email</th>
                  {isAdmin && <th colSpan="2" className="text-center">Acciones</th>}
                </tr>
              </thead>
              <tbody>
                {size(pets) === 0 ? (
                  <tr>
                    <td colSpan={isAdmin ? "10" : "8"}>
                      <h5 className="text-center text-muted mt-3">No hay mascotas registradas</h5>
                    </td>
                  </tr>
                ) : (
                  pets.map((p) => (
                    <tr key={p.id}>
                      <td>{p.namePet}</td>
                      <td>{p.typePet}</td>
                      <td>{p.racePet}</td>
                      <td>{p.date}</td>
                      <td>{p.nameOwner}</td>
                      <td>{p.phone}</td>
                      <td>{p.address}</td>
                      <td>{p.mail}</td>
                      {isAdmin && (
                        <>
                          <td>
                            <button
                              className="btn btn-outline-info btn-sm"
                              onClick={() => editPet(p)}
                              aria-label={`Editar ${p.namePet}`}
                            >
                              <i className="bi bi-pencil-square"></i>
                            </button>
                          </td>
                          <td>
                            <button
                              className="btn btn-outline-danger btn-sm"
                              onClick={() => deletePet(p.id)}
                              aria-label={`Eliminar ${p.namePet}`}
                            >
                              <i className="bi bi-trash"></i>
                            </button>
                          </td>
                        </>
                      )}
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>

      {/* Modal — solo accesible para Administrador */}
      {isAdmin && (
        <Modal isOpen={modal} toggle={toggle}>
          <form onSubmit={editMode ? savePet : addPet}>
            <ModalHeader toggle={toggle}>
              {editMode ? "Editar mascota" : "Agregar mascota"}
            </ModalHeader>
            <ModalBody>
              <div className="form-group">
                <h5 className="text-center">Mascota</h5>
                <label className="mt-2">Nombre</label>
                <input
                  type="text"
                  className="form-control"
                  name="namePet"
                  onChange={handleInputChange}
                  value={pet.namePet}
                  placeholder="Ingrese nombre de la mascota"
                />
                <br />
                <label>Tipo</label>
                <input
                  type="text"
                  className="form-control"
                  name="typePet"
                  onChange={handleInputChange}
                  value={pet.typePet}
                  placeholder="Perro, gato, loro, etc."
                />
                <br />
                <label>Raza</label>
                <input
                  type="text"
                  className="form-control"
                  name="racePet"
                  onChange={handleInputChange}
                  value={pet.racePet}
                  placeholder="Dálmata, pitbull, samoyedo, etc."
                />
                <br />
                <label>Fecha de Nacimiento</label>
                <input
                  type="date"
                  className="form-control"
                  name="date"
                  onChange={handleInputChange}
                  value={pet.date}
                />
              </div>
              <hr />
              <div className="form-group">
                <h5 className="mt-3 text-center">Propietario</h5>
                <label className="mt-2">Nombre y apellidos</label>
                <input
                  type="text"
                  className="form-control"
                  name="nameOwner"
                  onChange={handleInputChange}
                  value={pet.nameOwner}
                  placeholder="Ingrese nombre del propietario"
                />
                <br />
                <label>Teléfono</label>
                <input
                  type="tel"
                  className="form-control"
                  name="phone"
                  onChange={handleInputChange}
                  value={pet.phone}
                  placeholder="312 234 2345"
                />
                <br />
                <label>Dirección</label>
                <input
                  type="text"
                  className="form-control"
                  name="address"
                  onChange={handleInputChange}
                  value={pet.address}
                  placeholder="Ingrese dirección de residencia"
                />
                <br />
                <label>Email</label>
                <input
                  type="email"
                  className="form-control"
                  name="mail"
                  onChange={handleInputChange}
                  value={pet.mail}
                  placeholder="ejemplo@veterinaria.com"
                />
              </div>
            </ModalBody>
            <ModalFooter>
              {error && <span className="text-danger w-100 mb-2">{error}</span>}
              <button
                type="submit"
                className="btn btn-success btn-md"
                disabled={loading}
              >
                <i className={`bi ${loading ? "bi-hourglass-split" : "bi-check-circle"}`}></i>{" "}
                {loading ? "Guardando..." : editMode ? "Guardar" : "Agregar"}
              </button>
              <Button color="secondary" onClick={toggle} disabled={loading}>
                Cancelar
              </Button>
            </ModalFooter>
          </form>
        </Modal>
      )}
    </>
  );
}

export default App;
