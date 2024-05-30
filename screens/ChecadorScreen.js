import React, { useState, useEffect } from 'react';
import { Alert, View, Text, TouchableOpacity, ScrollView } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { fetchPostInicioDia } from '../Fetch/apiService';  // Cambia aquí el nombre de la función
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { PermissionsAndroid, Platform } from 'react-native';




function ChecadorScreen({ route, navigation }) {
    const [isLoading, setIsLoading] = useState(false);
    const [inicioDiaCompletado, setInicioDiaCompletado] = useState(false);
    const [FinDiaCompletado, setfinDiaCompletado] = useState(false);
    const [FinDiaHoraCompletado, setFinHoraDiaCompletado] = useState(false);
    const [horaActual, setHoraActual] = useState(moment().hour());
    const [minutoActual, setMinutoActual] = useState(moment().minute()); console.log(FinDiaHoraCompletado);


    const activeButtonStyle = tw`bg-blue-500 w-full h-20 py-6 rounded-lg shadow-lg mb-4`;
    const disabledButtonStyle = tw`bg-gray-500 w-full h-20 py-6 rounded-lg shadow-lg mb-4`;

    console.log('Datos recibidos en ChecadorScreen:', route.params); // Asegúrate de que esto se muestre en la consola
    const user = route.params?.user ?? { name: 'Usuario' };


    // Utilizar más campos del objeto usuario según sea necesario
    const userName = user.name;
    const tipousuario = user.type;
    //obtiene la geolocalizacion del dispositovo

    const getLocation = () => {
        return new Promise((resolve, reject) => {
            if (Platform.OS === 'android') {
                PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.ACCESS_FINE_LOCATION,
                ).then(granted => {
                    if (granted === PermissionsAndroid.RESULTS.GRANTED) {
                        Geolocation.getCurrentPosition(resolve, reject, {
                            enableHighAccuracy: true,
                            timeout: 40000,
                            maximumAge: 1000
                        });
                    } else {
                        reject('Location permission denied');
                    }
                });
            } else {
                Geolocation.getCurrentPosition(resolve, reject, {
                    enableHighAccuracy: true,
                    timeout: 40000,
                    maximumAge: 1000
                });
            }
        });
    };




    useEffect(() => {
        // Actualizar la hora actual cada minuto
        const interval = setInterval(() => {
            setHoraActual(moment().hour());
            setMinutoActual(moment().minute());
        }, 60000);
        getLocation(); // Llama a la función al cargar el componente.

        // Limpia el temporizador cuando el componente se desmonta
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        // Cambia 17 por 20 para que la verificación sea después de las 20:00 horas
        if (horaActual >= 20) {
            setFinHoraDiaCompletado(true);
        } else {
            setFinHoraDiaCompletado(false);
        }
    }, [horaActual, minutoActual]);


    console.log(horaActual);

    const handleInicioDia = async (action) => {
        setIsLoading(true);
        try {
            const location = await getLocation();
            if (!location) {
                // Si no hay ubicación, muestra una alerta y no continúes
                Alert.alert("Error", "Ubicación no disponible");
                return;  // Asegúrate de retornar para no seguir ejecutando la función
            }


            const data = {
                userName: userName,
                tipoUser: tipousuario,
                clave: "LHLD",
                fechaInicio: action === 'inicio' ? moment().format('YYYY-MM-DDTHH:mm:ss') : '',
                fechaFin: action === 'fin' ? moment().format('YYYY-MM-DDTHH:mm:ss') : '',
                localizacionInicio: action === 'inicio' ? `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}` : '',
                localizacionFin: action === 'fin' ? `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}` : ''
            };
            console.log(data);

            const status = await fetchPostInicioDia(data); // Obtiene solo el estado de la respuesta
            console.log(status)
            if (status === 200) {
                if (action === 'inicio') {
                    setInicioDiaCompletado(true);
                    Alert.alert("Inicio de día", "Inicio de día registrado correctamente!");
                } else if (action === 'fin') {
                    // Aquí puedes manejar el estado de finalización, por ejemplo:
                    setfinDiaCompletado(true);
                    Alert.alert("Fin del día", "Fin del día registrado correctamente!");
                    // Si necesitas otro estado para manejar el botón de finalización:
                    // setFinDiaCompletado(true);
                }
            } else {
                throw new Error('Respuesta del servidor no exitosa');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error);
        } finally {
            setIsLoading(false);
        }
    };




    return (
        <ScrollView style={tw`flex-1 bg-white p-4`}>
            <Text style={tw`text-center text-xl font-bold`}>Checador de Asistencia</Text>
            <Text style={tw`text-center text-lg font-semibold mb-4`}>Bienvenido, {user.name}</Text>
            <Text style={tw`text-center text-justify text-lg mb-5`}>
                Para hacer uso de la plataforma, primero debes registrar el inicio de tu día con el botón "Inicio de día". Para finalizar tu día, ingresa de nuevo a la app y presiona "Finalizar día".
            </Text>

            <View style={tw`flex-grow items-center justify-around`}>
                <TouchableOpacity
                    onPress={() => handleInicioDia('inicio')}
                    style={inicioDiaCompletado || isLoading ? disabledButtonStyle : activeButtonStyle}
                    disabled={isLoading || inicioDiaCompletado}
                >
                    <Text style={tw`text-center text-white text-lg`}>{isLoading ? 'Registrando...' : 'INICIO'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleInicioDia('fin')}
                    style={(FinDiaCompletado || FinDiaHoraCompletado || isLoading) ? disabledButtonStyle : activeButtonStyle}
                    disabled={isLoading || FinDiaCompletado || FinDiaHoraCompletado}
                >
                    <Text style={tw`text-center text-white text-lg`}>{isLoading ? 'Registrando...' : 'FIN'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );

}

export default ChecadorScreen;