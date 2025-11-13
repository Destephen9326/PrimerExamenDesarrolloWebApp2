import React, { useState, useEffect, createContext, useContext } from "react";
import "./App.css";

const GastosContexto = createContext();

function ProveedorGastos(props) {
  const [pantalla, setPantalla] = useState("login");
  

  const [usuario, setUsuario] = useState("");
  const [clave, setClave] = useState("");
  const [errorLogin, setErrorLogin] = useState("");

  const [presupuestoTexto, setPresupuestoTexto] = useState("");
  const [presupuestoGuardado, setPresupuestoGuardado] = useState(0);


  const [monto, setMonto] = useState("");
  const [categoria, setCategoria] = useState("");
  const [fecha, setFecha] = useState("");
  const [listaGastos, setListaGastos] = useState([]);
  const [idEditando, setIdEditando] = useState(null);

  const API_URL = "http://localhost:5000/gasto";


  useEffect(() => {
    if (pantalla === "gastos") {
      cargarGastos();
    }
  }, [pantalla]);

  async function cargarGastos() {
    try {
      const res = await fetch(API_URL);
      const data = await res.json();
      console.log("gastos traidos:", data);
      setListaGastos(data);
    } catch (err) {
      console.log("error cargando gastos:", err);
    }
  }

  const totalGastado = listaGastos.reduce((total, gasto) => {
    return total + Number(gasto.monto || 0);
  }, 0);

  function hacerLogin(e) {
    e.preventDefault();

    if (!usuario || !clave) {
      setErrorLogin("Debe escribir usuario y clave");
      return;
    }


    if (usuario === "admin" && clave === "admin123") {
      setErrorLogin("");
      setPantalla("presupuesto");
    } else {
      setErrorLogin("Usuario o clave incorrectos");
    }
  }

  function guardarPresupuesto(e) {
    e.preventDefault();

    const presup = Number(presupuestoTexto);
    if (!presupuestoTexto || presup <= 0) {
      alert("Debe escribir un monto valido");
      return;
    }

    setPresupuestoGuardado(presup);
  }


  let alerta80 = "";
  let alertaLimite = "";

  if (presupuestoGuardado > 0) {
    const pct = (totalGastado / presupuestoGuardado) * 100;
    
    if (pct >= 80 && pct < 100) {
      alerta80 = "Ha alcanzado el 80% del presupuesto";
    }
    
    if (pct >= 100) {
      alertaLimite = "Has superado el limite del presupuesto, debes ajustar gastos";
    }
  }

  async function guardarGasto(e) {
    e.preventDefault();

    if (!monto || categoria.trim() === "" || !fecha) {
      alert("Monto, categoria y fecha son obligatorios");
      return;
    }

    const nuevoGasto = {
      categoria: categoria,
      monto: Number(monto),
      fecha: fecha
    };

    try {
      let url = API_URL;
      let metodo = "POST";
      
      if (idEditando != null) {
        url = `${API_URL}/${idEditando}`;
        metodo = "PUT";
      }

      await fetch(url, {
        method: metodo,
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(nuevoGasto)
      });

      cargarGastos();
      limpiarFormulario();
    } catch (err) {
      console.log("error guardando:", err);
    }
  }

  function limpiarFormulario() {
    setMonto("");
    setCategoria("");
    setFecha("");
    setIdEditando(null);
  }

  function editarGasto(gasto) {
    setIdEditando(gasto.idgasto);
    setMonto(gasto.monto);
    setCategoria(gasto.categoria);
 
    setFecha(gasto.fecha ? gasto.fecha.substring(0, 10) : "");
  }

  async function eliminarGasto(id) {
    if (!window.confirm("Seguro que desea borrar este gasto?")) {
      return;
    }

    try {
      await fetch(`${API_URL}/${id}`, { method: "DELETE" });
      cargarGastos();
    } catch (err) {
      console.log("error borrando:", err);
    }
  }

  const valorContexto = {
    pantalla,
    setPantalla,
    usuario,
    setUsuario,
    clave,
    setClave,
    errorLogin,
    hacerLogin,
    presupuestoTexto,
    setPresupuestoTexto,
    presupuestoGuardado,
    guardarPresupuesto,
    monto,
    setMonto,
    categoria,
    setCategoria,
    fecha,
    setFecha,
    listaGastos,
    guardarGasto,
    editarGasto,
    eliminarGasto,
    idEditando,
    totalGastado,
    alerta80,
    alertaLimite
  };

  return (
    <GastosContexto.Provider value={valorContexto}>
      {props.children}
    </GastosContexto.Provider>
  );
}

// Pantalla para el login
function PantallaLogin() {
  const ctx = useContext(GastosContexto);

  return (
    <div className="contenedor">
      <div className="tarjeta">
        <h2>Mis Gastos / Inicio de Sesion</h2>

        <form onSubmit={ctx.hacerLogin}>
          <input
            type="text"
            className="entrada"
            placeholder="Usuario"
            value={ctx.usuario}
            onChange={(e) => ctx.setUsuario(e.target.value)}
          />
          <input
            type="password"
            className="entrada"
            placeholder="Clave"
            value={ctx.clave}
            onChange={(e) => ctx.setClave(e.target.value)}
          />
          
          {ctx.errorLogin && (
            <p className="texto-error">{ctx.errorLogin}</p>
          )}
          
          <button className="boton-azul" type="submit">
            Iniciar Sesion
          </button>
        </form>
      </div>
    </div>
  );
}

// Esta pantalla me sirve para establecer presupuesto
function PantallaPresupuesto() {
  const ctx = useContext(GastosContexto);

  return (
    <div className="contenedor">
      <div className="tarjeta">
        <h2>Establecer Presupuesto Mensual</h2>

        <form onSubmit={ctx.guardarPresupuesto}>
          <input
            type="number"
            className="entrada"
            placeholder="Monto de presupuesto Mensual"
            value={ctx.presupuestoTexto}
            onChange={(e) => ctx.setPresupuestoTexto(e.target.value)}
          />
          <button className="boton-azul" type="submit">
            Guardar Presupuesto
          </button>
        </form>

        {ctx.presupuestoGuardado > 0 && (
          <p style={{ marginTop: "10px" }}>
            Presupuesto Establecido Lps. {ctx.presupuestoGuardado.toFixed(2)}
          </p>
        )}

        {ctx.alerta80 && (
          <div className="alerta-amarilla">{ctx.alerta80}</div>
        )}

        {ctx.alertaLimite && (
          <div className="alerta-roja">{ctx.alertaLimite}</div>
        )}

        <button
          className="boton-simple"
          onClick={() => ctx.setPantalla("gastos")}
          style={{ marginTop: "20px" }}
        >
          Ir a Mis Gastos
        </button>
      </div>
    </div>
  );
}

function PantallaGastos() {
  const ctx = useContext(GastosContexto);

  return (
    <div className="contenedor">
      <div className="tarjeta">
        <h2>
          Presupuesto Establecido Lps. {ctx.presupuestoGuardado.toFixed(2)}
        </h2>

        <form onSubmit={ctx.guardarGasto} className="form-gasto">
          <input
            type="number"
            className="entrada"
            placeholder="Monto"
            value={ctx.monto}
            onChange={(e) => ctx.setMonto(e.target.value)}
          />
          <input
            type="text"
            className="entrada"
            placeholder="Categoria"
            value={ctx.categoria}
            onChange={(e) => ctx.setCategoria(e.target.value)}
          />
          <input
            type="date"
            className="entrada"
            value={ctx.fecha}
            onChange={(e) => ctx.setFecha(e.target.value)}
          />
          <button className="boton-azul" type="submit">
            {ctx.idEditando == null ? "Guardar Gasto" : "Actualizar Gasto"}
          </button>
        </form>

        <table className="tabla">
          <thead>
            <tr>
              <th>Monto</th>
              <th>Categoria</th>
              <th>Fecha</th>
              <th>Editar</th>
              <th>Eliminar</th>
            </tr>
          </thead>
          <tbody>
            {ctx.listaGastos.map((g) => (
              <tr key={g.idgasto}>
                <td>{g.monto}</td>
                <td>{g.categoria}</td>
                <td>{g.fecha ? g.fecha.substring(0, 10) : ""}</td>
                <td>
                  <button
                    type="button"
                    className="boton-editar"
                    onClick={() => ctx.editarGasto(g)}
                  >
                    Editar
                  </button>
                </td>
                <td>
                  <button
                    type="button"
                    className="boton-borrar"
                    onClick={() => ctx.eliminarGasto(g.idgasto)}
                  >
                    Borrar
                  </button>
                </td>
              </tr>
            ))}
            {ctx.listaGastos.length === 0 && (
              <tr>
                <td colSpan="5">No hay gastos registrados</td>
              </tr>
            )}
          </tbody>
        </table>

        <p style={{ marginTop: "10px" }}>
          Total gastado: Lps. {ctx.totalGastado.toFixed(2)}
        </p>

        <button
          className="boton-simple"
          onClick={() => ctx.setPantalla("presupuesto")}
          style={{ marginTop: "20px" }}
        >
          Volver a Presupuesto
        </button>
      </div>
    </div>
  );
}

function App() {
  return (
    <ProveedorGastos>
      <SelectorPantalla />
    </ProveedorGastos>
  );
}

function SelectorPantalla() {
  const ctx = useContext(GastosContexto);

  if (ctx.pantalla === "login") {
    return <PantallaLogin />;
  }

  if (ctx.pantalla === "presupuesto") {
    return <PantallaPresupuesto />;
  }

  return <PantallaGastos />;
}

export default App;