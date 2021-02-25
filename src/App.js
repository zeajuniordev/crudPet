import React,{ useState, useEffect} from 'react';

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
  const [id, setId] = useState("")
  const [error, setError] = useState(null)

  


  return (
    <div className="container mt-5">
      <h1>Mascotas Crud</h1>
      <br/>
      <div className="row">
        <div className="col-12">
        <button className="btn btn-success btn-md float-right"><i class="bi bi-plus-square-fill"></i> Crear</button>
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
              </tr>
            </thead>
            <tbody>
              <tr className="" key="{pet.id}">
                <td>"pet.name"</td>
                <td>"pet.type"</td>
                <td>"pet.raza"</td>
                <td>"pet.date"</td>
                <td>"pet.owner"</td>
                <td>"pet.phone"</td>
                <td>"pet.adress"</td>
                <td>"pet.emal"</td>
                <td>
                    <button className="btn btn-outline-info btn-sm float-right"><i className="bi bi-pencil-square"></i></button>
                    <button className="btn btn-outline-danger btn-sm float-right"><i class="bi bi-trash"></i></button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
        <hr/>
        <div className="container">
          <form onSubmit="">
            <div className="form-group">
              <h2>Información de la Mascota</h2>
              <label className="mt-5" for="name">Nombre</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="Ingrese nombre de la mascota"></input>
              <br/>
              <label for="type">Tipo</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="Perro, gato, loro, etc..."></input>
              <br/>
              <label for="race">Raza</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="Dálmata, pitbull, samoyedo, etc..."></input>
              <br/>
              <label for="date">Fecha de Nacimiento</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="23/03/2020"></input>
            </div>
            <div className="form-group">
              <h2 className="mt-5">Información del Propietario</h2>
              <label className="mt-5" for="name">Nombre y apellidos</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="Ingrese nombre del propietario"></input>
              <br/>
              <label for="phone">Telefono</label>
              <input type="number" className="form-control" onChange="" value="" placeholder="312234234"></input>
              <br/>
              <label for="adress">Dirección</label>
              <input type="text" className="form-control" onChange="" value="" placeholder="Ingrese dirección recidencia"></input>
              <br/>
              <label for="email">Email</label>
              <input type="email" className="form-control" onChange="" value="" placeholder="ejemplo@veterianairia.com"></input>
              <br/>
            </div>
              <button className="btn btn-success btn-md btn-block"> <i class="bi bi-check-circle"></i> Guardar</button>
              <br/>         
          </form>
        </div>
    </div>
  );
}

export default App;
