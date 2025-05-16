// // App.js con entrada manual de cédula
// import React, { useState } from 'react';
// import axios from 'axios';
//
// function App() {
//   // Estados
//   const [cedula, setCedula] = useState('');
//   const [resultados, setResultados] = useState(null);
//   const [logs, setLogs] = useState([]);
//   const [error, setError] = useState(null);
//   const [cargando, setCargando] = useState(false);
//   const [cedulasRecientes, setCedulasRecientes] = useState([]);
//
//   const proxyUrl = 'http://localhost:3001';
//
//   // Validar formato de cédula ecuatoriana
//   const validarCedula = (cedula) => {
//     // Validación básica: 10 dígitos numéricos
//     return /^\d{10}$/.test(cedula);
//   };
//
//   // Función para agregar entradas al log
//   const addLog = (mensaje) => {
//     const timestamp = new Date().toLocaleTimeString();
//     setLogs(prevLogs => [...prevLogs, `[${timestamp}] ${mensaje}`]);
//     console.log(mensaje);
//   };
//
//   // Manejar cambio en el input de cédula
//   const handleCedulaChange = (e) => {
//     // Solo permitir dígitos
//     const valor = e.target.value.replace(/\D/g, '');
//     setCedula(valor);
//   };
//
//   // Consultar directamente desde el servidor (método recomendado)
//   const consultarDirecto = async () => {
//     // Validar cédula
//     if (!cedula.trim()) {
//       setError({
//         type: 'validation',
//         message: 'Por favor ingrese un número de cédula'
//       });
//       return;
//     }
//
//     if (!validarCedula(cedula)) {
//       setError({
//         type: 'validation',
//         message: 'La cédula debe tener 10 dígitos numéricos'
//       });
//       return;
//     }
//
//     limpiarEstado();
//     addLog(`Consultando directamente desde el servidor para cédula: ${cedula}`);
//     addLog(`URL: ${proxyUrl}/direct/${cedula}`);
//
//     try {
//       setCargando(true);
//
//       const response = await axios.get(`${proxyUrl}/direct/${cedula}`);
//
//       addLog(`¡Éxito! Respuesta recibida con status: ${response.status}`);
//
//       // Guardar resultado
//       setResultados(response.data);
//
//       // Agregar a cédulas recientes si no existe ya
//       if (!cedulasRecientes.includes(cedula)) {
//         setCedulasRecientes(prev => [cedula, ...prev].slice(0, 5));
//       }
//
//     } catch (error) {
//       manejarError(error);
//     } finally {
//       setCargando(false);
//     }
//   };
//
//   // Consultar a través del proxy
//   const consultarConProxy = async () => {
//     // Validar cédula
//     if (!cedula.trim()) {
//       setError({
//         type: 'validation',
//         message: 'Por favor ingrese un número de cédula'
//       });
//       return;
//     }
//
//     if (!validarCedula(cedula)) {
//       setError({
//         type: 'validation',
//         message: 'La cédula debe tener 10 dígitos numéricos'
//       });
//       return;
//     }
//
//     limpiarEstado();
//     addLog(`Consultando a través del proxy para cédula: ${cedula}`);
//     addLog(`URL: ${proxyUrl}/api/${cedula}`);
//
//     try {
//       setCargando(true);
//
//       const response = await axios.get(`${proxyUrl}/api/${cedula}`);
//
//       addLog(`¡Éxito! Respuesta recibida con status: ${response.status}`);
//
//       // Guardar resultado
//       setResultados(response.data);
//
//       // Agregar a cédulas recientes si no existe ya
//       if (!cedulasRecientes.includes(cedula)) {
//         setCedulasRecientes(prev => [cedula, ...prev].slice(0, 5));
//       }
//
//     } catch (error) {
//       manejarError(error);
//     } finally {
//       setCargando(false);
//     }
//   };
//
//   // Limpiar estado para nueva petición
//   const limpiarEstado = () => {
//     setResultados(null);
//     setLogs([]);
//     setError(null);
//   };
//
//   // Manejar errores de forma unificada
//   const manejarError = (error) => {
//     addLog(`¡ERROR! ${error.message}`);
//
//     if (error.response) {
//       // El servidor respondió con un código de error
//       addLog(`Status de error: ${error.response.status}`);
//       addLog(`Mensaje: ${JSON.stringify(error.response.data)}`);
//
//       setError({
//         status: error.response.status,
//         statusText: error.response.statusText,
//         data: error.response.data
//       });
//
//       // Errores específicos
//       if (error.response.status === 401) {
//         addLog(`ERROR 401: Acceso no autorizado - Clave API inválida`);
//         addLog(`La API key parece haber expirado o no ser válida.`);
//       }
//
//       if (error.response.status === 404) {
//         addLog(`ERROR 404: Ruta no encontrada en el servidor proxy.`);
//       }
//     } else if (error.request) {
//       // No hubo respuesta del servidor
//       addLog(`No se recibió respuesta. Verifica que el servidor proxy esté ejecutándose.`);
//
//       setError({
//         type: 'no-response',
//         message: 'No se recibió respuesta del servidor',
//         details: 'Asegúrate de que el servidor proxy esté en ejecución con "node server.js"'
//       });
//     } else {
//       // Error general
//       addLog(`Error general: ${error.message}`);
//
//       setError({
//         type: 'general',
//         message: error.message
//       });
//     }
//   };
//
//   // Formatear JSON para visualización
//   const formatJSON = (data) => {
//     try {
//       return JSON.stringify(data, null, 2);
//     } catch (e) {
//       return String(data);
//     }
//   };
//
//   // Formatear moneda
//   const formatoDinero = (valor) => {
//     return new Intl.NumberFormat('es-EC', {
//       style: 'currency',
//       currency: 'USD'
//     }).format(valor || 0);
//   };
//
//   // Renderizar los contratos de un cliente
//   const renderizarContratos = (cliente) => {
//     if (!cliente.clienteInt || !cliente.clienteInt.contratos) {
//       return <p>No hay contratos disponibles</p>;
//     }
//
//     return cliente.clienteInt.contratos.map((contrato, idx) => (
//         <div key={idx} className="card mb-3">
//           <div className="card-header bg-info text-white">
//             <strong>{contrato.servicio}</strong> - Suscripción: {contrato.suscripcion}
//           </div>
//           <div className="card-body">
//             <div className="row">
//               <div className="col-md-6">
//                 <p><strong>Dirección:</strong> {contrato.direccion}</p>
//                 <p><strong>Estado:</strong> {contrato.pendiente ? 'Pendiente' : 'Al día'}</p>
//                 <p><strong>Aviso:</strong> {contrato.aviso}</p>
//               </div>
//               <div className="col-md-6">
//                 <p><strong>Base:</strong> {formatoDinero(contrato.base)}</p>
//                 <p><strong>IVA:</strong> {formatoDinero(contrato.iva)}</p>
//                 <p><strong>ICE:</strong> {formatoDinero(contrato.ice)}</p>
//                 <p><strong>Total:</strong> {formatoDinero(contrato.total)}</p>
//               </div>
//             </div>
//
//             <h6 className="mt-3">Productos:</h6>
//             <ul className="list-group">
//               {contrato.productos && contrato.productos.map((producto, prodIdx) => (
//                   <li key={prodIdx} className="list-group-item">
//                     <div><strong>{producto.descripcion}</strong></div>
//                     <div className="d-flex justify-content-between">
//                       <span>Valor unitario: {formatoDinero(producto.valorUnitario)}</span>
//                       <span>Meses: {producto.meses}</span>
//                       <span>Total: {formatoDinero(producto.valorTotal)}</span>
//                     </div>
//                   </li>
//               ))}
//             </ul>
//           </div>
//         </div>
//     ));
//   };
//
//   // Componente para mostrar la respuesta
//   const RespuestaAPI = () => {
//     if (!resultados) return null;
//
//     // Si es un objeto de error o mensaje, mostrarlo como JSON
//     if (!Array.isArray(resultados)) {
//       return (
//           <div className="card mb-4">
//             <div className="card-header bg-info text-white">
//               <h5 className="mb-0">Respuesta del servidor</h5>
//             </div>
//             <div className="card-body">
//               <pre className="bg-light p-2 rounded">{formatJSON(resultados)}</pre>
//             </div>
//           </div>
//       );
//     }
//
//     // Si no hay resultados
//     if (resultados.length === 0) {
//       return (
//           <div className="card mb-4">
//             <div className="card-header bg-warning text-dark">
//               <h5 className="mb-0">Sin resultados</h5>
//             </div>
//             <div className="card-body">
//               <p>No se encontraron resultados para la cédula: {cedula}</p>
//             </div>
//           </div>
//       );
//     }
//
//     // Si es un array (respuesta normal), mostrar los datos formateados
//     return (
//         <div className="card mb-4">
//           <div className="card-header bg-success text-white">
//             <h5 className="mb-0">Información del cliente</h5>
//           </div>
//           <div className="card-body">
//             {resultados.map((cliente, index) => (
//                 <div key={index} className="mb-4">
//                   <div className="alert alert-dark">
//                     <h5 className="mb-0">
//                       {cliente.clienteInt?.nombre} ({cliente.clienteInt?.ruc})
//                     </h5>
//                   </div>
//
//                   <div className="row mb-3">
//                     <div className="col-md-6">
//                       <ul className="list-group">
//                         <li className="list-group-item"><strong>Sucursal:</strong> {cliente.sucursal}</li>
//                         <li className="list-group-item"><strong>Dirección:</strong> {cliente.clienteInt?.direccion}</li>
//                       </ul>
//                     </div>
//                     <div className="col-md-6">
//                       <ul className="list-group">
//                         <li className="list-group-item"><strong>Teléfono:</strong> {cliente.clienteInt?.telefono}</li>
//                         <li className="list-group-item"><strong>Celular:</strong> {cliente.clienteInt?.celular}</li>
//                       </ul>
//                     </div>
//                   </div>
//
//                   <h5 className="mb-3">Contratos:</h5>
//                   {renderizarContratos(cliente)}
//                 </div>
//             ))}
//           </div>
//         </div>
//     );
//   };
//
//   // Manejar tecla Enter en el input
//   const handleKeyPress = (e) => {
//     if (e.key === 'Enter') {
//       consultarDirecto();
//     }
//   };
//
//   // Usar una cédula del historial
//   const usarCedulaReciente = (ced) => {
//     setCedula(ced);
//     // Si deseas consultar automáticamente al seleccionar del historial, descomenta la siguiente línea
//     // setTimeout(() => consultarDirecto(), 100);
//   };
//
//   return (
//       <div className="container mt-4 mb-5">
//         <div className="row">
//           <div className="col-12">
//             <div className="card mb-4">
//               <div className="card-header bg-primary text-white">
//                 <h4 className="mb-0">Consulta de Valores Pendientes</h4>
//               </div>
//               <div className="card-body">
//                 {/* Input para cédula */}
//                 <div className="mb-3">
//                   <label htmlFor="cedula" className="form-label">Ingrese número de cédula:</label>
//                   <input
//                       type="text"
//                       className="form-control form-control-lg"
//                       id="cedula"
//                       placeholder="Ej. 1600552598"
//                       value={cedula}
//                       onChange={handleCedulaChange}
//                       onKeyPress={handleKeyPress}
//                       maxLength={10}
//                       disabled={cargando}
//                   />
//                   <div className="form-text">
//                     Ingrese la cédula de identidad de 10 dígitos
//                   </div>
//                 </div>
//
//                 {/* Historial de cédulas recientes */}
//                 {cedulasRecientes.length > 0 && (
//                     <div className="mb-3">
//                       <label className="form-label">Consultas recientes:</label>
//                       <div>
//                         {cedulasRecientes.map((ced, index) => (
//                             <button
//                                 key={index}
//                                 className="btn btn-sm btn-outline-secondary me-2 mb-2"
//                                 onClick={() => usarCedulaReciente(ced)}
//                             >
//                               {ced}
//                             </button>
//                         ))}
//                       </div>
//                     </div>
//                 )}
//
//                 {/* Botones de acción */}
//                 <div className="row">
//                   <div className="col-md-6 mb-2">
//                     <button
//                         className="btn btn-success w-100"
//                         onClick={consultarDirecto}
//                         disabled={cargando}
//                     >
//                       {cargando ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2"></span>
//                             Consultando...
//                           </>
//                       ) : (
//                           'Consultar desde servidor (recomendado)'
//                       )}
//                     </button>
//                   </div>
//                   <div className="col-md-6 mb-2">
//                     <button
//                         className="btn btn-secondary w-100"
//                         onClick={consultarConProxy}
//                         disabled={cargando}
//                     >
//                       {cargando ? (
//                           <>
//                             <span className="spinner-border spinner-border-sm me-2"></span>
//                             Consultando...
//                           </>
//                       ) : (
//                           'Consultar vía proxy'
//                       )}
//                     </button>
//                   </div>
//                 </div>
//               </div>
//             </div>
//
//             {/* Error de validación */}
//             {error && error.type === 'validation' && (
//                 <div className="alert alert-danger">
//                   <strong>Error:</strong> {error.message}
//                 </div>
//             )}
//
//             {/* Terminal con logs */}
//             {logs.length > 0 && (
//                 <div className="card mb-4">
//                   <div className="card-header bg-dark text-white">
//                     <h5 className="mb-0">Log de la operación</h5>
//                   </div>
//                   <div className="card-body bg-dark p-0">
//                     <div className="terminal p-3" style={{
//                       minHeight: '100px',
//                       maxHeight: '200px',
//                       overflow: 'auto',
//                       color: '#33ff33',
//                       fontFamily: 'monospace',
//                       fontSize: '0.9rem'
//                     }}>
//                       {logs.map((log, index) => (
//                           <div key={index} className="log-entry">{log}</div>
//                       ))}
//                     </div>
//                   </div>
//                 </div>
//             )}
//
//             {/* Error si existe (excepto validación) */}
//             {error && error.type !== 'validation' && (
//                 <div className="card mb-4">
//                   <div className="card-header bg-danger text-white">
//                     <h5 className="mb-0">
//                       Error en la petición
//                       {error.status && ` - Status: ${error.status}`}
//                     </h5>
//                   </div>
//                   <div className="card-body">
//                     <pre className="bg-light p-2 rounded">{formatJSON(error)}</pre>
//
//                     {error.status === 401 && (
//                         <div className="alert alert-warning mt-3">
//                           <strong>Error 401 - Clave API inválida:</strong>
//                           <p className="mt-2 mb-0">
//                             Esto indica que la API key ha expirado o ya no es válida.
//                             Necesitarás obtener una nueva API key para acceder al servicio.
//                           </p>
//                         </div>
//                     )}
//
//                     {error.type === 'no-response' && (
//                         <div className="alert alert-warning mt-3">
//                           <strong>Error de conexión:</strong>
//                           <p className="mt-2 mb-0">
//                             No se pudo conectar con el servidor proxy. Asegúrate de que esté ejecutándose
//                             con el comando <code>node server.js</code> en una terminal separada.
//                           </p>
//                         </div>
//                     )}
//                   </div>
//                 </div>
//             )}
//
//             {/* Respuesta */}
//             <RespuestaAPI />
//
//             {/* JSON crudo */}
//             {resultados && (
//                 <div className="card mb-4">
//                   <div className="card-header bg-dark text-white">
//                     <h5 className="mb-0">Datos en formato JSON</h5>
//                   </div>
//                   <div className="card-body">
//                 <pre className="bg-light p-2 rounded" style={{ maxHeight: '300px', overflow: 'auto' }}>
//                   {formatJSON(resultados)}
//                 </pre>
//                   </div>
//                 </div>
//             )}
//
//             {/* Instrucciones */}
//             <div className="card">
//               <div className="card-header bg-info text-white">
//                 <h5 className="mb-0">Instrucciones</h5>
//               </div>
//               <div className="card-body">
//                 <ol>
//                   <li className="mb-2">
//                     <strong>Instala las dependencias del servidor proxy:</strong>
//                     <pre className="bg-light p-2 rounded">npm install express http-proxy-middleware cors axios</pre>
//                   </li>
//
//                   <li className="mb-2">
//                     <strong>Inicia el servidor proxy en una terminal separada:</strong>
//                     <pre className="bg-light p-2 rounded">node server.js</pre>
//                   </li>
//
//                   <li className="mb-2">
//                     <strong>Ingresa una cédula de 10 dígitos y haz clic en "Consultar desde servidor"</strong>
//                     <p>Esta opción es la más recomendada ya que la petición se realiza desde el servidor Node.js, evitando problemas de CORS.</p>
//                   </li>
//
//                   <li className="mb-2">
//                     <strong>Si recibes error 401:</strong>
//                     <p>Significa que la API key ya no es válida. Deberás contactar al administrador del sistema para obtener una nueva.</p>
//                   </li>
//                 </ol>
//               </div>
//             </div>
//           </div>
//         </div>
//       </div>
//   );
// }
//
// export default App;

// src/App.js
import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    // Estados
    const [cedula, setCedula] = useState('');
    const [resultados, setResultados] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [cedulasRecientes, setCedulasRecientes] = useState([]);
    const [servidorActivo, setServidorActivo] = useState(false);

    // URL del servidor proxy local
    const PROXY_URL = 'http://localhost:3001/api/';

    // Verificar si el servidor está activo al cargar la aplicación
    useEffect(() => {
        const verificarServidor = async () => {
            try {
                const response = await axios.get('http://localhost:3001/test');
                if (response.data && response.data.status === 'ok') {
                    console.log('Servidor proxy detectado y funcionando');
                    setServidorActivo(true);
                }
            } catch (error) {
                console.warn('No se pudo conectar con el servidor proxy:', error.message);
                setServidorActivo(false);
            }
        };

        verificarServidor();
    }, []);

    // Manejar cambio en el input de cédula
    const handleCedulaChange = (e) => {
        // Solo permitir dígitos
        const valor = e.target.value.replace(/\D/g, '');
        setCedula(valor);
    };

    // Consultar valores pendientes
    const consultarValores = async () => {
        // Validación básica
        if (!cedula.trim()) {
            setError('Por favor ingrese un número de cédula');
            return;
        }

        if (!/^\d{10}$/.test(cedula)) {
            setError('La cédula debe tener 10 dígitos numéricos');
            return;
        }

        try {
            setError(null);
            setCargando(true);

            if (!servidorActivo) {
                setError('El servidor proxy no está activo. Por favor inicie el servidor con "npm run server" en una terminal separada.');
                setCargando(false);
                return;
            }

            console.log(`Consultando valores para cédula: ${cedula}`);
            const response = await axios.get(`${PROXY_URL}${cedula}`);

            console.log('Respuesta recibida:', response.data);
            setResultados(response.data);

            // Guardar en historial de cédulas
            if (!cedulasRecientes.includes(cedula)) {
                const nuevasRecientes = [cedula, ...cedulasRecientes].slice(0, 5);
                setCedulasRecientes(nuevasRecientes);
                localStorage.setItem('cedulasRecientes', JSON.stringify(nuevasRecientes));
            }

        } catch (error) {
            console.error('Error en consulta:', error);

            if (error.response) {
                setError(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                setError('No se recibió respuesta del servidor. Verifique que el servidor proxy esté activo.');
                setServidorActivo(false);
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setCargando(false);
        }
    };

    // Manejar tecla Enter en el input
    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            consultarValores();
        }
    };

    // Usar una cédula del historial
    const usarCedulaReciente = (ced) => {
        setCedula(ced);
    };

    // Formatear moneda
    const formatoDinero = (valor) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(valor || 0);
    };

    // Cargar cédulas recientes del localStorage
    useEffect(() => {
        try {
            const guardadas = localStorage.getItem('cedulasRecientes');
            if (guardadas) {
                setCedulasRecientes(JSON.parse(guardadas));
            }
        } catch (e) {
            console.error('Error al cargar de localStorage:', e);
        }
    }, []);

    // Renderizar los contratos de un cliente
    const renderizarContratos = (cliente) => {
        if (!cliente.clienteInt || !cliente.clienteInt.contratos) {
            return <p>No hay contratos disponibles</p>;
        }

        return cliente.clienteInt.contratos.map((contrato, idx) => (
            <div key={idx} className="card mb-3">
                <div className="card-header bg-info text-white">
                    <strong>{contrato.servicio}</strong> - Suscripción: {contrato.suscripcion}
                </div>
                <div className="card-body">
                    <div className="row">
                        <div className="col-md-6">
                            <p><strong>Dirección:</strong> {contrato.direccion}</p>
                            <p><strong>Estado:</strong> {contrato.pendiente ? 'Pendiente' : 'Al día'}</p>
                            <p><strong>Aviso:</strong> {contrato.aviso}</p>
                        </div>
                        <div className="col-md-6">
                            <p><strong>Base:</strong> {formatoDinero(contrato.base)}</p>
                            <p><strong>IVA:</strong> {formatoDinero(contrato.iva)}</p>
                            <p><strong>ICE:</strong> {formatoDinero(contrato.ice)}</p>
                            <p><strong>Total:</strong> {formatoDinero(contrato.total)}</p>
                        </div>
                    </div>

                    <h6 className="mt-3">Productos:</h6>
                    <ul className="list-group">
                        {contrato.productos && contrato.productos.map((producto, prodIdx) => (
                            <li key={prodIdx} className="list-group-item">
                                <div><strong>{producto.descripcion}</strong></div>
                                <div className="d-flex justify-content-between">
                                    <span>Valor unitario: {formatoDinero(producto.valorUnitario)}</span>
                                    <span>Meses: {producto.meses}</span>
                                    <span>Total: {formatoDinero(producto.valorTotal)}</span>
                                </div>
                            </li>
                        ))}
                    </ul>
                </div>
            </div>
        ));
    };

    return (
        <div className="container mt-4 mb-5">
            <div className="row">
                <div className="col-12">
                    <div className="card mb-4">
                        <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
                            <h4 className="mb-0">Consulta de Valores Pendientes</h4>
                            <span className={`badge ${servidorActivo ? 'bg-success' : 'bg-danger'}`}>
                {servidorActivo ? 'Servidor Activo' : 'Servidor Inactivo'}
              </span>
                        </div>
                        <div className="card-body">
                            {/* Input para cédula */}
                            <div className="mb-3">
                                <label htmlFor="cedula" className="form-label">Ingrese número de cédula:</label>
                                <input
                                    type="text"
                                    className="form-control form-control-lg"
                                    id="cedula"
                                    placeholder="Ej. 1600552598"
                                    value={cedula}
                                    onChange={handleCedulaChange}
                                    onKeyPress={handleKeyPress}
                                    maxLength={10}
                                    disabled={cargando}
                                />
                                <div className="form-text">
                                    Ingrese la cédula de identidad de 10 dígitos
                                </div>
                            </div>

                            {/* Historial de cédulas recientes */}
                            {cedulasRecientes.length > 0 && (
                                <div className="mb-3">
                                    <label className="form-label">Consultas recientes:</label>
                                    <div>
                                        {cedulasRecientes.map((ced, index) => (
                                            <button
                                                key={index}
                                                className="btn btn-sm btn-outline-secondary me-2 mb-2"
                                                onClick={() => usarCedulaReciente(ced)}
                                            >
                                                {ced}
                                            </button>
                                        ))}
                                    </div>
                                </div>
                            )}

                            {/* Botón de consulta */}
                            <div className="d-grid gap-2">
                                <button
                                    className="btn btn-primary btn-lg"
                                    onClick={consultarValores}
                                    disabled={cargando || !servidorActivo}
                                >
                                    {cargando ? (
                                        <>
                                            <span className="spinner-border spinner-border-sm me-2"></span>
                                            Consultando...
                                        </>
                                    ) : (
                                        'Consultar Valores Pendientes'
                                    )}
                                </button>
                            </div>

                            {/* Mensaje de estado del servidor */}
                            {!servidorActivo && (
                                <div className="alert alert-warning mt-3 mb-0">
                                    <strong>¡Atención!</strong> El servidor proxy no está activo. Asegúrese de que haya iniciado el servidor con:
                                    <pre className="mt-2 mb-0 bg-light p-2">npm run dev</pre>
                                </div>
                            )}
                        </div>
                    </div>

                    {/* Mensaje de error */}
                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

                    {/* Resultados */}
                    {resultados && resultados.length > 0 ? (
                        <div className="card mb-4">
                            <div className="card-header bg-success text-white">
                                <h5 className="mb-0">Información del cliente</h5>
                            </div>
                            <div className="card-body">
                                {resultados.map((cliente, index) => (
                                    <div key={index} className="mb-4">
                                        <div className="alert alert-dark">
                                            <h5 className="mb-0">
                                                {cliente.clienteInt?.nombre} ({cliente.clienteInt?.ruc})
                                            </h5>
                                        </div>

                                        <div className="row mb-3">
                                            <div className="col-md-6">
                                                <ul className="list-group">
                                                    <li className="list-group-item"><strong>Sucursal:</strong> {cliente.sucursal}</li>
                                                    <li className="list-group-item"><strong>Dirección:</strong> {cliente.clienteInt?.direccion}</li>
                                                </ul>
                                            </div>
                                            <div className="col-md-6">
                                                <ul className="list-group">
                                                    <li className="list-group-item"><strong>Teléfono:</strong> {cliente.clienteInt?.telefono}</li>
                                                    <li className="list-group-item"><strong>Celular:</strong> {cliente.clienteInt?.celular}</li>
                                                </ul>
                                            </div>
                                        </div>

                                        <h5 className="mb-3">Contratos:</h5>
                                        {renderizarContratos(cliente)}
                                    </div>
                                ))}
                            </div>
                        </div>
                    ) : resultados && resultados.length === 0 ? (
                        <div className="alert alert-warning">
                            No se encontraron resultados para la cédula ingresada.
                        </div>
                    ) : null}
                </div>
            </div>
        </div>
    );
}

export default App;
