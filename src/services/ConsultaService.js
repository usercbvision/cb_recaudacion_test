import axios from 'axios';


const API_URL = 'http://10.194.5.185/cbrecaudaciones/valores-pendientes/';
const API_KEY = '9c5bfd0e-acde-4b1c-b3a1-de97e76d08a7';


class ConsultaService {
    // Método para consultar los valores pendientes de una cédula
    static async consultarValoresPendientes(cedula) {
        try {
            const response = await axios({
                method: 'GET',
                url: `${API_URL}${cedula}`,
                headers: {
                    'api-key': API_KEY
                }
            });

            return response.data;
        } catch (error) {

            if (error.response) {
                throw {
                    status: error.response.status,
                    data: error.response.data,
                    message: `Error ${error.response.status}: ${JSON.stringify(error.response.data)}`
                };
            } else if (error.request) {

                throw {
                    message: 'No se recibió respuesta del servidor. Verifique su conexión.'
                };
            } else {

                throw {
                    message: `Error: ${error.message}`
                };
            }
        }
    }

    static async probarMultiplesCedulas(cedulas) {
        const resultados = {};

        for (const cedula of cedulas) {
            try {
                const resultado = await this.consultarValoresPendientes(cedula);
                resultados[cedula] = resultado;
            } catch (error) {
                resultados[cedula] = { error: true, message: error.message };
            }
        }

        return resultados;
    }
}

export default ConsultaService;