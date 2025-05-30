//
// import React, { useState, useEffect } from 'react';
// import axios from 'axios';
//
// function App() {
//     const [cedula, setCedula] = useState('');
//     const [resultados, setResultados] = useState(null);
//     const [cargando, setCargando] = useState(false);
//     const [error, setError] = useState(null);
//     const [cedulasRecientes, setCedulasRecientes] = useState([]);
//     const [servidorActivo, setServidorActivo] = useState(false);
//
//     const API_URL = 'http://10.194.5.185/cbrecaudaciones/valores-pendientes/';
//     const API_KEY = '9c5bfd0e-acde-4b1c-b3a1-de97e76d08a7';
//
//     useEffect(() => {
//         const verificarAPI = async () => {
//             try {
//                 const response = await axios({
//                     method: 'GET',
//                     url: `${API_URL}1600552598`,
//                     headers: {
//                         'api-key': API_KEY
//                     }
//                 });
//
//                 if (response.data && response.data.length > 0) {
//                     setServidorActivo(true);
//                 } else {
//                     setServidorActivo(true);
//                 }
//             } catch (error) {
//                 setServidorActivo(false);
//             }
//         };
//
//         verificarAPI();
//     }, []);
//
//     const handleCedulaChange = (e) => {
//         const valor = e.target.value.replace(/\D/g, '');
//         setCedula(valor);
//     };
//
//     const consultarValores = async () => {
//         if (!cedula.trim()) {
//             setError('Por favor ingrese un número de cédula');
//             return;
//         }
//
//         if (!/^\d{10}$/.test(cedula)) {
//             setError('La cédula debe tener 10 dígitos numéricos');
//             return;
//         }
//
//         try {
//             setError(null);
//             setCargando(true);
//
//             if (!servidorActivo) {
//                 setError('La API no está accesible. Por favor intente más tarde.');
//                 setCargando(false);
//                 return;
//             }
//
//             const response = await axios({
//                 method: 'GET',
//                 url: `${API_URL}${cedula}`,
//                 headers: {
//                     'api-key': API_KEY
//                 }
//             });
//
//             setResultados(response.data);
//
//             if (!cedulasRecientes.includes(cedula)) {
//                 const nuevasRecientes = [cedula, ...cedulasRecientes].slice(0, 5);
//                 setCedulasRecientes(nuevasRecientes);
//                 localStorage.setItem('cedulasRecientes', JSON.stringify(nuevasRecientes));
//             }
//
//         } catch (error) {
//             if (error.response) {
//                 setError(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
//             } else if (error.request) {
//                 setError('No se recibió respuesta del servidor. Verifique su conexión.');
//                 setServidorActivo(false);
//             } else {
//                 setError(`Error: ${error.message}`);
//             }
//         } finally {
//             setCargando(false);
//         }
//     };
//
//     const handleKeyPress = (e) => {
//         if (e.key === 'Enter') {
//             consultarValores();
//         }
//     };
//
//     const usarCedulaReciente = (ced) => {
//         setCedula(ced);
//     };
//
//     const formatoDinero = (valor) => {
//         return new Intl.NumberFormat('es-EC', {
//             style: 'currency',
//             currency: 'USD'
//         }).format(valor || 0);
//     };
//
//     useEffect(() => {
//         try {
//             const guardadas = localStorage.getItem('cedulasRecientes');
//             if (guardadas) {
//                 setCedulasRecientes(JSON.parse(guardadas));
//             }
//         } catch (e) {}
//     }, []);
//
//     const renderizarContratos = (cliente) => {
//         if (!cliente.clienteInt || !cliente.clienteInt.contratos) {
//             return <p>No hay contratos disponibles</p>;
//         }
//
//         return cliente.clienteInt.contratos.map((contrato, idx) => (
//             <div key={idx} className="card mb-3">
//                 <div className="card-header bg-info text-white">
//                     <strong>{contrato.servicio}</strong> - Suscripción: {contrato.suscripcion}
//                 </div>
//                 <div className="card-body">
//                     <div className="row">
//                         <div className="col-md-6">
//                             <p><strong>Dirección:</strong> {contrato.direccion}</p>
//                             <p><strong>Estado:</strong> {contrato.pendiente ? 'Pendiente' : 'Al día'}</p>
//                             <p><strong>Aviso:</strong> {contrato.aviso}</p>
//                         </div>
//                         <div className="col-md-6">
//                             <p><strong>Base:</strong> {formatoDinero(contrato.base)}</p>
//                             <p><strong>IVA:</strong> {formatoDinero(contrato.iva)}</p>
//                             <p><strong>ICE:</strong> {formatoDinero(contrato.ice)}</p>
//                             <p><strong>Total:</strong> {formatoDinero(contrato.total)}</p>
//                         </div>
//                     </div>
//
//                     <h6 className="mt-3">Productos:</h6>
//                     <ul className="list-group">
//                         {contrato.productos && contrato.productos.map((producto, prodIdx) => (
//                             <li key={prodIdx} className="list-group-item">
//                                 <div><strong>{producto.descripcion}</strong></div>
//                                 <div className="d-flex justify-content-between">
//                                     <span>Valor unitario: {formatoDinero(producto.valorUnitario)}</span>
//                                     <span>Meses: {producto.meses}</span>
//                                     <span>Total: {formatoDinero(producto.valorTotal)}</span>
//                                 </div>
//                             </li>
//                         ))}
//                     </ul>
//                 </div>
//             </div>
//         ));
//     };
//
//     return (
//         <div className="container mt-4 mb-5">
//             <div className="row">
//                 <div className="col-12">
//                     <div className="card mb-4">
//                         <div className="card-header bg-primary text-white d-flex justify-content-between align-items-center">
//                             <h4 className="mb-0">Consulta de Valores Pendientes</h4>
//                             <span className={`badge ${servidorActivo ? 'bg-success' : 'bg-danger'}`}>
//                                 {servidorActivo ? 'API Activa' : 'API Inactiva'}
//                             </span>
//                         </div>
//                         <div className="card-body">
//                             <div className="mb-3">
//                                 <label htmlFor="cedula" className="form-label">Ingrese número de cédula:</label>
//                                 <input
//                                     type="text"
//                                     className="form-control form-control-lg"
//                                     id="cedula"
//                                     placeholder="Ej. 1600552598"
//                                     value={cedula}
//                                     onChange={handleCedulaChange}
//                                     onKeyPress={handleKeyPress}
//                                     maxLength={10}
//                                     disabled={cargando}
//                                 />
//                                 <div className="form-text">
//                                     Ingrese la cédula de identidad de 10 dígitos
//                                 </div>
//                             </div>
//
//                             {cedulasRecientes.length > 0 && (
//                                 <div className="mb-3">
//                                     <label className="form-label">Consultas recientes:</label>
//                                     <div>
//                                         {cedulasRecientes.map((ced, index) => (
//                                             <button
//                                                 key={index}
//                                                 className="btn btn-sm btn-outline-secondary me-2 mb-2"
//                                                 onClick={() => usarCedulaReciente(ced)}
//                                             >
//                                                 {ced}
//                                             </button>
//                                         ))}
//                                     </div>
//                                 </div>
//                             )}
//
//                             <div className="d-grid gap-2">
//                                 <button
//                                     className="btn btn-primary btn-lg"
//                                     onClick={consultarValores}
//                                     disabled={cargando || !servidorActivo}
//                                 >
//                                     {cargando ? (
//                                         <>
//                                             <span className="spinner-border spinner-border-sm me-2"></span>
//                                             Consultando...
//                                         </>
//                                     ) : (
//                                         'Consultar Valores Pendientes'
//                                     )}
//                                 </button>
//                             </div>
//
//                             {!servidorActivo && (
//                                 <div className="alert alert-warning mt-3 mb-0">
//                                     <strong>¡Atención!</strong> No se puede conectar con la API. Verifique su conexión a internet o intente más tarde.
//                                 </div>
//                             )}
//                         </div>
//                     </div>
//
//                     {error && (
//                         <div className="alert alert-danger" role="alert">
//                             <strong>Error:</strong> {error}
//                         </div>
//                     )}
//
//                     {resultados && resultados.length > 0 ? (
//                         <div className="card mb-4">
//                             <div className="card-header bg-success text-white">
//                                 <h5 className="mb-0">Información del cliente</h5>
//                             </div>
//                             <div className="card-body">
//                                 {resultados.map((cliente, index) => (
//                                     <div key={index} className="mb-4">
//                                         <div className="alert alert-dark">
//                                             <h5 className="mb-0">
//                                                 {cliente.clienteInt?.nombre} ({cliente.clienteInt?.ruc})
//                                             </h5>
//                                         </div>
//
//                                         <div className="row mb-3">
//                                             <div className="col-md-6">
//                                                 <ul className="list-group">
//                                                     <li className="list-group-item"><strong>Sucursal:</strong> {cliente.sucursal}</li>
//                                                     <li className="list-group-item"><strong>Dirección:</strong> {cliente.clienteInt?.direccion}</li>
//                                                 </ul>
//                                             </div>
//                                             <div className="col-md-6">
//                                                 <ul className="list-group">
//                                                     <li className="list-group-item"><strong>Teléfono:</strong> {cliente.clienteInt?.telefono}</li>
//                                                     <li className="list-group-item"><strong>Celular:</strong> {cliente.clienteInt?.celular}</li>
//                                                 </ul>
//                                             </div>
//                                         </div>
//
//                                         <h5 className="mb-3">Contratos:</h5>
//                                         {renderizarContratos(cliente)}
//                                     </div>
//                                 ))}
//                             </div>
//                         </div>
//                     ) : resultados && resultados.length === 0 ? (
//                         <div className="alert alert-warning">
//                             No se encontraron resultados para la cédula ingresada.
//                         </div>
//                     ) : null}
//                 </div>
//             </div>
//         </div>
//     );
// }
//
// export default App;
//


import React, { useState, useEffect } from 'react';
import axios from 'axios';

function App() {
    const [cedula, setCedula] = useState('');
    const [resultados, setResultados] = useState(null);
    const [cargando, setCargando] = useState(false);
    const [error, setError] = useState(null);
    const [cedulasRecientes, setCedulasRecientes] = useState([]);
    const [servidorActivo, setServidorActivo] = useState(false);

    const API_URL = '/cbrecaudaciones/valores-pendientes/';
    const API_KEY = '9c5bfd0e-acde-4b1c-b3a1-de97e76d08a7';

    useEffect(() => {
        const verificarAPI = async () => {
            try {
                const response = await axios({
                    method: 'GET',
                    url: `${API_URL}1600552598`,
                    headers: {
                        'api-key': API_KEY
                    }
                });

                if (response.data && response.data.length > 0) {
                    setServidorActivo(true);
                } else {
                    setServidorActivo(true);
                }
            } catch (error) {
                setServidorActivo(false);
            }
        };

        verificarAPI();
    }, []);

    const handleCedulaChange = (e) => {
        const valor = e.target.value.replace(/\D/g, '');
        setCedula(valor);
    };

    const consultarValores = async () => {
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
                setError('La API no está accesible. Por favor intente más tarde.');
                setCargando(false);
                return;
            }

            const response = await axios({
                method: 'GET',
                url: `${API_URL}${cedula}`,
                headers: {
                    'api-key': API_KEY
                }
            });

            setResultados(response.data);

            if (!cedulasRecientes.includes(cedula)) {
                const nuevasRecientes = [cedula, ...cedulasRecientes].slice(0, 5);
                setCedulasRecientes(nuevasRecientes);
                localStorage.setItem('cedulasRecientes', JSON.stringify(nuevasRecientes));
            }

        } catch (error) {
            if (error.response) {
                setError(`Error ${error.response.status}: ${JSON.stringify(error.response.data)}`);
            } else if (error.request) {
                setError('No se recibió respuesta del servidor. Verifique su conexión.');
                setServidorActivo(false);
            } else {
                setError(`Error: ${error.message}`);
            }
        } finally {
            setCargando(false);
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            consultarValores();
        }
    };

    const usarCedulaReciente = (ced) => {
        setCedula(ced);
    };

    const formatoDinero = (valor) => {
        return new Intl.NumberFormat('es-EC', {
            style: 'currency',
            currency: 'USD'
        }).format(valor || 0);
    };

    useEffect(() => {
        try {
            const guardadas = localStorage.getItem('cedulasRecientes');
            if (guardadas) {
                setCedulasRecientes(JSON.parse(guardadas));
            }
        } catch (e) {}
    }, []);

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
                                {servidorActivo ? 'API Activa' : 'API Inactiva'}
                            </span>
                        </div>
                        <div className="card-body">
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

                            {!servidorActivo && (
                                <div className="alert alert-warning mt-3 mb-0">
                                    <strong>¡Atención!</strong> No se puede conectar con la API. Verifique su conexión a internet o intente más tarde.
                                </div>
                            )}
                        </div>
                    </div>

                    {error && (
                        <div className="alert alert-danger" role="alert">
                            <strong>Error:</strong> {error}
                        </div>
                    )}

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