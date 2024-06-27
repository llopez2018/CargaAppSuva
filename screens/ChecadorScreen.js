import React, { useState, useEffect, useContext } from 'react';
import { Alert, View, Text, TextInput, TouchableOpacity, ScrollView, PermissionsAndroid, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { fetchPostInicioDia } from '../Fetch/apiService';
import moment from 'moment';
import Geolocation from '@react-native-community/geolocation';
import { UserContext } from '../App';

// Función para obtener la ubicación
const getLocation = async () => {
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

const ChecadorScreen = ({ route, navigation }) => {
    const { user } = useContext(UserContext);
    const [state, setState] = useState({
        isLoading: false,
        inicioDiaCompletado: false,
        finDiaCompletado: false,
        finDiaHoraCompletado: false,
        horaActual: moment().hour(),
        minutoActual: moment().minute(),
        location: null,
        region: null,
    });
    const [kilometrajeInicio, setKilometrajeInicio] = useState('');
    const [kilometrajeFin, setKilometrajeFin] = useState('');

    const userName = user?.name;
    const tipousuario = user?.type;

    const activeButtonStyle = tw`bg-blue-500 w-full h-20 py-6 rounded-lg shadow-lg mb-4`;
    const disabledButtonStyle = tw`bg-gray-500 w-full h-20 py-6 rounded-lg shadow-lg mb-4`;

    useEffect(() => {
        const checkHour = () => {
            const currentHour = moment().hour();
            setState(prevState => ({
                ...prevState,
                horaActual: currentHour,
                finDiaHoraCompletado: currentHour >= 18,
            }));
        };

        // Comprobar la hora inmediatamente
        checkHour();

        // Configurar un intervalo para comprobar la hora cada minuto
        const interval = setInterval(checkHour, 60000);

        // Limpiar el intervalo al desmontar el componente
        return () => clearInterval(interval);
    }, []);

    useEffect(() => {
        getLocation().then(position => {
            setState(prevState => ({
                ...prevState,
                location: position,
                region: {
                    latitude: position.coords.latitude,
                    longitude: position.coords.longitude,
                    latitudeDelta: 0.01,
                    longitudeDelta: 0.01,
                }
            }));
        }).catch(error => {
            console.log(error);
        });
    }, []);

    const handleKilometrajeChange = (value, setFunction) => {
        // Solo permitir números y mantener la longitud mínima
        const numericValue = value.replace(/[^0-9]/g, '');
        setFunction(numericValue);
    };

    const handleInicioDia = async (action) => {
        // Validar kilometraje antes de ejecutar la acción
        if (action === 'inicio' && (!kilometrajeInicio || kilometrajeInicio.length < 3)) {
            Alert.alert("Error", "Debe ingresar un kilometraje de inicio de al menos 3 cifras");
            return;
        }
        if (action === 'fin' && (!kilometrajeInicio || !kilometrajeFin || kilometrajeInicio.length < 3 || kilometrajeFin.length < 3)) {
            Alert.alert("Error", "Debe ingresar un kilometraje de inicio y fin de al menos 3 cifras");
            return;
        }

        setState(prevState => ({ ...prevState, isLoading: true }));
        try {
            const location = await getLocation();
            if (!location) {
                Alert.alert("Error", "Ubicación no disponible");
                return;
            }

            const data = {
                userName: userName,
                tipoUser: tipousuario,
                kminicial: action === 'inicio' ? kilometrajeInicio : '',
                kmfinal: action === 'fin' ? kilometrajeFin : '',
                clave: "LHLD",
                fechaInicio: action === 'inicio' ? moment().format('YYYY-MM-DDTHH:mm:ss') : '',
                fechaFin: action === 'fin' ? moment().format('YYYY-MM-DDTHH:mm:ss') : '',
                localizacionInicio: action === 'inicio' ? `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}` : '',
                localizacionFin: action === 'fin' ? `latitude: ${location.coords.latitude}, longitude: ${location.coords.longitude}` : ''
            };
            console.log(data);

            const status = await fetchPostInicioDia(data);
            if (status === 200) {
                if (action === 'inicio') {
                    setState(prevState => ({
                        ...prevState,
                        inicioDiaCompletado: true,
                        isLoading: false,
                    }));
                    Alert.alert("Inicio de día", "Inicio de día registrado correctamente!");
                } else if (action === 'fin') {
                    setState(prevState => ({
                        ...prevState,
                        finDiaCompletado: true,
                        isLoading: false,
                    }));
                    Alert.alert("Fin del día", "Fin del día registrado correctamente!");
                }
            } else {
                throw new Error('Respuesta del servidor no exitosa');
            }
        } catch (error) {
            console.error(error);
            Alert.alert("Error", error);
            setState(prevState => ({ ...prevState, isLoading: false }));
        }
    };

    return (
        <ScrollView style={tw`flex-1 bg-white p-4`}>
            <Text style={tw`text-center text-xl font-bold`}>Checador de Asistencia</Text>
            <Text style={tw`text-center text-lg font-semibold mb-4`}>Bienvenido, {userName}</Text>
            <Text style={tw`text-center text-justify text-lg mb-5`}>
                Para hacer uso de la plataforma, primero debes registrar el inicio de tu día con el botón "Inicio de día". Para finalizar tu día, ingresa de nuevo a la app y presiona "Finalizar día".
            </Text>
            <View style={tw`mb-4`}>
                <Text style={tw`text-lg mb-2`}>Kilometraje Inicio:</Text>
                <TextInput
                    style={tw`border p-2 rounded`}
                    placeholder="Ingrese el kilometraje de inicio"
                    keyboardType="numeric"
                    value={kilometrajeInicio}
                    onChangeText={(value) => handleKilometrajeChange(value, setKilometrajeInicio)}
                    editable={!state.inicioDiaCompletado} // Bloquea si ya se ha completado
                />
            </View>

            <View style={tw`mb-4`}>
                <Text style={tw`text-lg mb-2`}>Kilometraje Fin:</Text>
                <TextInput
                    style={tw`border p-2 rounded`}
                    placeholder="Ingrese el kilometraje de fin"
                    keyboardType="numeric"
                    value={kilometrajeFin}
                    onChangeText={(value) => handleKilometrajeChange(value, setKilometrajeFin)}
                    editable={!state.finDiaCompletado} // Bloquea si ya se ha completado
                />
            </View>

            <View style={tw`flex-grow items-center justify-around`}>
                <TouchableOpacity
                    onPress={() => handleInicioDia('inicio')}
                    style={(!kilometrajeInicio || kilometrajeInicio.length < 3 || state.inicioDiaCompletado || state.isLoading) ? disabledButtonStyle : activeButtonStyle}
                    disabled={!kilometrajeInicio || kilometrajeInicio.length < 3 || state.isLoading || state.inicioDiaCompletado}
                >
                    <Text style={tw`text-center text-white text-lg`}>{state.isLoading ? 'Registrando...' : 'INICIO'}</Text>
                </TouchableOpacity>
                <TouchableOpacity
                    onPress={() => handleInicioDia('fin')}
                    style={(!kilometrajeInicio || kilometrajeInicio.length < 3 || !kilometrajeFin || kilometrajeFin.length < 3 || state.finDiaCompletado || !state.finDiaHoraCompletado || state.isLoading) ? disabledButtonStyle : activeButtonStyle}
                    disabled={!kilometrajeInicio || kilometrajeInicio.length < 3 || !kilometrajeFin || kilometrajeFin.length < 3 || state.isLoading || state.finDiaCompletado || !state.finDiaHoraCompletado}
                >
                    <Text style={tw`text-center text-white text-lg`}>{state.isLoading ? 'Registrando...' : 'FIN'}</Text>
                </TouchableOpacity>
            </View>
        </ScrollView>
    );
};

export default ChecadorScreen;
