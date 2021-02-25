import React,{ useState, useEffect} from 'react';
import {isEmpty, size} from 'lodash'
import { Button, Modal, ModalBody, ModalHeader, ModalFooter} from 'reactstrap';
import { addDocument , deleteDocument, getCollection, updateDocument } from './actions';


function App() {
  const [pet, setPet] = useState({
    namePet : "",
    typePet: "",
    racePet: "",
    date: "",
    nameOwner: "",
    phone: "",
    adress: "",
    mail: ""
  })

  const [pets, setPets] = useState([])
  const [editMode, setEditMode] = useState(false)
  const [id, setId] = useState("")
  const [error, setError] = useState(null)

  useEffect(() => {
    (async () => {
      const result = await getCollection("pets")
      if(result.statusResponse){
        setPets(result.data)
      }
    })()
  }, [])

  const validForm = () => {
    let isValid = true
    setError(null)
    setModal(true)
    if(isEmpty(pet.namePet) || isEmpty(pet.typePet) || isEmpty(pet.racePet) || isEmpty(pet.date) || isEmpty(pet.nameOwner) || isEmpty(pet.phone) || isEmpty(pet.adress) || isEmpty(pet.mail)){
      setError("Debes ingresar información")
      isValid = false 
    }
    return isValid
  }

  const handleInputChangePet = (e) => {
    setPet({
      ...pet, 
      [e.target.name] : e.target.value,
    })    
  }

  const addPet = async (e) => {
    e.preventDefault()

    if(!validForm()){
      return
    }

    const result = await addDocument("pets", {
                                                namePet : pet.namePet,
                                                typePet: pet.typePet,
                                                racePet: pet.racePet,
                                                date: pet.date,
                                                nameOwner: pet.nameOwner,
                                                phone: pet.phone,
                                                adress: pet.adress,
                                                mail: pet.mail})

    if(!result.statusResponse){
      setError(result.error)
      return
    }
    setModal(false)
    setPets([...pets, {id : result.data.id, 
                        namePet : pet.namePet,
                        typePet: pet.typePet,
                        racePet: pet.racePet,
                        date: pet.date,
                        nameOwner: pet.nameOwner,
                        phone: pet.phone,
                        adress: pet.adress,
                        mail: pet.mail}])
    setPet({
      namePet : "",
      typePet: "",
      racePet: "",
      date: "",
      nameOwner: "",
      phone: "",
      adress: "",
      mail: ""
    })
  }

  const deletePet = async (id) => {
    const result = await deleteDocument("pets", id)
    if(!result.statusResponse){
      setError(result.error)
      return
    }
    const filterPets = pets.filter(pet => pet.id !== id)
    setPets(filterPets)
  }

  const editPet = (thePet) => {
    setModal(true)
    setPet(thePet)
    setEditMode(true)
    setId(thePet.id)
  }

  const savePet = async (e) => {
    e.preventDefault()

    if(!validForm()){
      return
    }

    const result = await updateDocument("pets", id , {namePet: pet.namePet, 
                                                      typePet: pet.typePet,
                                                      racePet: pet.racePet,
                                                      date: pet.date,
                                                      nameOwner: pet.nameOwner,
                                                      phone: pet.phone,
                                                      adress: pet.adress,
                                                      mail: pet.mail})

    if(!result.statusResponse){
      setError(result.error)
      return
    }


    const editedPets = pets.map(item => item.id === id ?{
      id: pet.id, 
      namePet: pet.namePet, 
      typePet: pet.typePet,
      racePet: pet.racePet,
      date: pet.date,
      nameOwner: pet.nameOwner,
      phone: pet.phone,
      adress: pet.adress,
      mail: pet.mail } : item)
    setPets(editedPets)
    setEditMode(false)
    setModal(false)
    setId("")
    setPet({
      namePet : "",
      typePet: "",
      racePet: "",
      date: "",
      nameOwner: "",
      phone: "",
      adress: "",
      mail: ""
    })
  }

  //Modal

  const [modal, setModal] = useState(false)

  const openModal=()=>{
    setModal(true)
    setEditMode(false)
  }

  const toggle = () => setModal(!modal);


  return (
    <div className="container mt-5">
      <h1>Mascotas Crud</h1>
      <br/>
      <div className="row">
        <div className="col-12">
        <button className="btn btn-success btn-md float-right" onClick={()=>openModal()} ><i className="bi bi-plus-square-fill"></i> Crear</button>
          <table className="table table-hover mt-5">
            <thead>
              <tr>
                <th className="col">Nombre</th>
                <th className="col">Tipo</th>
                <th className="col">Raza</th>
                <th className="col">Fecha Nacimiento</th>
                <th className="col">Propietario</th>
                <th className="col">Telefono</th>
                <th className="col">Dirección</th>
                <th className="col">Email</th>
                <th className="col"></th>
                <th className="col"></th>
              </tr>
            </thead>
            {
              size(pets) === 0 ? (
                <tbody>
                  <tr>
                    <td colSpan="8"><h5 className="text-center">No hay mascotas agregadas</h5></td>
                  </tr>
                </tbody>
              ):(
              <tbody>
                {
                  pets.map((pet) => (
                    <tr className="" key={pet.id}>
                      <td>{pet.namePet}</td>
                      <td>{pet.typePet}</td>
                      <td>{pet.racePet}</td>
                      <td>{pet.date}</td>
                      <td>{pet.nameOwner}</td>
                      <td>{pet.phone}</td>
                      <td>{pet.adress}</td>
                      <td>{pet.mail}</td>
                      <td>
                          <button 
                            className="btn btn-outline-info btn-sm float-right"
                            onClick={() => editPet(pet)}
                            >
                            <i className="bi bi-pencil-square"></i>
                          </button>
                      </td>
                      <td>
                          <button 
                            className="btn btn-outline-danger btn-sm float-right"
                            onClick={() => deletePet(pet.id)}>
                            <i className="bi bi-trash"></i>
                          </button>
                      </td>
                  </tr>
                  ))
                }
              </tbody>
              )
            }
          </table>
        </div>
      </div>
        <hr/>
 {/*        <div className="container">
          <form onSubmit={editMode ? savePet : addPet}>
            <div className="form-group">
              <h1>{editMode ? "Editar mascota" : "Agregar mascota"}</h1>
              <h2>Información de la Mascota</h2>
              <label className="mt-5">Nombre</label>
              <input type="text" className="form-control"  name="namePet" onChange={handleInputChangePet} value={pet.namePet} placeholder="Ingrese nombre de la mascota"></input>
              <br/>
              <label>Tipo</label>
              <input type="text" className="form-control"  name="typePet" onChange={handleInputChangePet} value={pet.typePet} placeholder="Perro, gato, loro, etc..."></input>
              <br/>
              <label>Raza</label>
              <input type="text" className="form-control"  name="racePet" onChange={handleInputChangePet} value={pet.racePet} placeholder="Dálmata, pitbull, samoyedo, etc..."></input>
              <br/>
              <label>Fecha de Nacimiento</label>
              <input type="text" className="form-control"  name="date" onChange={handleInputChangePet} value={pet.date} placeholder="23/03/2020"></input>
            </div>
            <div className="form-group">
              <h2 className="mt-5">Información del Propietario</h2>
              <label className="mt-5">Nombre y apellidos</label>
              <input type="text" className="form-control"  name="nameOwner" onChange={handleInputChangePet} value={pet.nameOwner} placeholder="Ingrese nombre del propietario"></input>
              <br/>
              <label>Telefono</label>
              <input type="number" className="form-control"  name="phone" onChange={handleInputChangePet} value={pet.phone} placeholder="312234234"></input>
              <br/>
              <label>Dirección</label>
              <input type="text" className="form-control" name="adress" onChange={handleInputChangePet} value={pet.adress} placeholder="Ingrese dirección recidencia"></input>
              <br/>
              <label>Email</label>
              <input type="text" className="form-control"  name="mail" onChange={handleInputChangePet} value={pet.mail} placeholder="ejemplo@veterianairia.com"></input>
              <br/>
            </div>
              {error && <span className="text-danger">{error}</span>}
              <button type="submit" className="btn btn-success btn-md btn-block"> <i className="bi bi-check-circle"></i> {editMode ? "Guardar" : "Agregar"}</button>
              <br/>         
          </form>
        </div> */}
        <div>
        <Modal isOpen={modal} toggle={toggle}>
        <form onSubmit={editMode ? savePet : addPet}>
        <ModalHeader toggle={toggle}>{editMode ? "Editar" : "Agregar"}</ModalHeader>
        <ModalBody>
            <div className="form-group">
              <h5 className="text-center">Mascota</h5>
              <label className="mt-2 ">Nombre</label>
              <input type="text" className="form-control"  name="namePet" onChange={handleInputChangePet} value={pet.namePet} placeholder="Ingrese nombre de la mascota"></input>
              <br/>
              <label>Tipo</label>
              <input type="text" className="form-control"  name="typePet" onChange={handleInputChangePet} value={pet.typePet} placeholder="Perro, gato, loro, etc..."></input>
              <br/>
              <label>Raza</label>
              <input type="text" className="form-control"  name="racePet" onChange={handleInputChangePet} value={pet.racePet} placeholder="Dálmata, pitbull, samoyedo, etc..."></input>
              <br/>
              <label>Fecha de Nacimiento</label>
              <input type="text" className="form-control"  name="date" onChange={handleInputChangePet} value={pet.date} placeholder="23/03/2020"></input>
            </div>
            <hr/>
            <div className="form-group">
              <h5 className="mt-3 text-center">Propietario</h5>
              <label className="mt-2">Nombre y apellidos</label>
              <input type="text" className="form-control"  name="nameOwner" onChange={handleInputChangePet} value={pet.nameOwner} placeholder="Ingrese nombre del propietario"></input>
              <br/>
              <label>Telefono</label>
              <input type="number" className="form-control"  name="phone" onChange={handleInputChangePet} value={pet.phone} placeholder="312234234"></input>
              <br/>
              <label>Dirección</label>
              <input type="text" className="form-control" name="adress" onChange={handleInputChangePet} value={pet.adress} placeholder="Ingrese dirección recidencia"></input>
              <br/>
              <label>Email</label>
              {/* email */}
              <input type="text" className="form-control"  name="mail" onChange={handleInputChangePet} value={pet.mail} placeholder="ejemplo@veterianairia.com"></input>
            </div>             
        </ModalBody>
        <ModalFooter>
              {error && <span className="text-danger">{error}</span>}
              <button type="submit" className="btn btn-success btn-md"> <i className="bi bi-check-circle"></i> {editMode ? "Guardar" : "Agregar"}</button>
              <Button color="secondary" onClick={toggle}>Cancel</Button>
        </ModalFooter>
        </form>
      </Modal>
        </div>
    </div>

  );
}

export default App;
