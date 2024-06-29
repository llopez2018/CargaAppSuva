import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    FlatList,
    Modal,
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker';
import { fetchGetManifSearch } from '../Fetch/ManifSearchService'; // Asegúrate de que la ruta es correcta

const screenWidth = Dimensions.get('window').width;

const ManifiestosRuta = () => {
    const [ruta, setRuta] = useState('');
    const [fecha, setFecha] = useState(new Date());
    const [showPicker, setShowPicker] = useState(false);
    const [dateInput, setDateInput] = useState(moment(new Date()).format('YYYY-MM-DD'));
    const [datos, setDatos] = useState(null);
    const [loading, setLoading] = useState(false);
    const [error, setError] = useState('');

    const navigation = useNavigation();

    // Handler para el cambio de fecha en el DatePicker
    const onChange = (selectedDate) => {
        setFecha(selectedDate);
    };

    // Función para confirmar la fecha seleccionada
    const confirmDate = () => {
        setDateInput(moment(fecha).format('YYYY-MM-DD'));
        setShowPicker(false);
    };

    // Función para manejar la búsqueda de manifiestos
    const buscarManifiestos = async () => {
        setLoading(true);
        setError('');
        try {
            console.log(ruta, dateInput);
            const json = await fetchGetManifSearch(ruta, dateInput);

            if (json && Array.isArray(json)) {
                const datosOrdenados = json.map(item => ({
                    ...item,
                    orden: parseFloat(item.orden)
                })).sort((a, b) => a.orden - b.orden);

                setDatos(datosOrdenados);
            } else {
                throw new Error("Invalid data format received");
            }
        } catch (error) {
            console.error(error);
            setError(error.message || 'Error al obtener datos');
        }
        setLoading(false);
    };

    return (
        <View style={styles.container}>
            {loading && <ActivityIndicator size="large" color="#0000ff" />}
            {error && <Text style={tw`text-red-500 text-center my-2`}>{error}</Text>}
            <View style={styles.inputsContainer}>
                <Text style={styles.header}>Ingresa La ruta a buscar</Text>
                <TextInput
                    style={[styles.input, styles.inputText, tw`text-center`]}
                    onChangeText={(text) => setRuta(text.replace(/[^0-9]/g, ''))}
                    value={ruta}
                    placeholder="Introduce una ruta"
                    placeholderTextColor="#ccc"
                    maxLength={10}
                />
                <Text style={styles.header}>Ingresa La fecha de inicio de la ruta</Text>
                <View style={tw`flex-row items-center justify-center w-full`}>
                    <TextInput
                        style={[styles.input, styles.inputText, tw`text-center`]}
                        value={dateInput}
                        editable={false}
                        placeholder="YYYY-MM-DD"
                        placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity
                        onPress={() => setShowPicker(true)}
                        style={tw`p-2`}
                    >
                        <Icon name="calendar" size={24} color="blue" />
                    </TouchableOpacity>
                </View>
                <Modal
                    transparent={true}
                    animationType="slide"
                    visible={showPicker}
                    onRequestClose={() => setShowPicker(false)}
                >
                    <View style={styles.modalContainer}>
                        <View style={styles.datePickerContainer}>
                            <DatePicker
                                date={fecha}
                                onDateChange={onChange}
                                mode="date"
                                maximumDate={new Date()}
                            />
                            <TouchableOpacity
                                onPress={confirmDate}
                                style={styles.confirmButton}
                            >
                                <Text style={styles.confirmButtonText}>Confirmar</Text>
                            </TouchableOpacity>
                            <TouchableOpacity
                                onPress={() => setShowPicker(false)}
                                style={styles.closeButton}
                            >
                                <Text style={styles.closeButtonText}>Cerrar</Text>
                            </TouchableOpacity>
                        </View>
                    </View>
                </Modal>
                <TouchableOpacity
                    style={styles.buttonStyle}
                    onPress={buscarManifiestos}
                >
                    <Text style={tw`text-white text-lg text-center`}>Enviar</Text>
                </TouchableOpacity>
            </View>
            <FlatList
                data={datos}
                style={styles.list}
                keyExtractor={item => item.id.toString()}
                renderItem={({ item, index }) => (
                    <TouchableOpacity
                        style={[styles.row, { backgroundColor: index % 2 === 0 ? '#f9fafb' : 'white' }]}
                        onPress={() => navigation.navigate('DetalleManifiestoScreen', { itemData: item })}
                    >
                        <Text style={[styles.cell, { width: '30%' }]}>{item.clave}</Text>
                        <Text style={[styles.cell, { width: '30%' }]}>{item.orden.toString()}</Text>
                        <Text style={[styles.cell, { width: '40%' }]}>{item.nombre}</Text>
                    </TouchableOpacity>
                )}
            />
        </View>
    );
};

const styles = StyleSheet.create({
    container: tw`flex-1 bg-white p-5`,
    header: tw`text-center text-xl font-bold`,
    input: tw`bg-white w-11/12 rounded-md px-4 py-2 border border-gray-300 mb-4`,
    scrollView: tw`bg-white bg-opacity-80 rounded-lg p-5 `,
    view: tw`px-3 py-4`,
    group_image: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow bg-white bg-opacity-80 `,
    groupTitle: tw`text-lg text-black mb-2 font-semibold text-center`,
    imageGrid: tw`flex flex-wrap justify-center items-center`,
    imageItem: tw`w-1/2 p-1 shadow rounded-lg`,
    image: { width: '100%', height: 100, borderRadius: 5 },
    textInputStyle: tw`border border-gray-300 rounded-lg p-2 text-center mb-4`,
    group: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow`,
    pickerWrapper: tw`border border-gray-300 rounded-lg p-2 mb-4 bg-white`,
    picker: tw`w-full text-center`,
    inputText: {
        height: 50, // Increase the height of the TextInput
    },
    buttonStyle: tw`bg-blue-500 w-11/12 py-4 rounded-lg shadow-lg mb-4`,
    row: tw`flex-row justify-between p-2 border-b border-gray-200`,
    headerRow: tw`flex-row justify-between p-2 border-b border-gray-500 bg-gray-200`,
    cell: tw`text-sm`,
    headerCell: tw`text-sm font-semibold`,
    list: {
        flex: 1,
    },
    inputsContainer: {
        width: '100%',
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
    modalContainer: {
        flex: 1,
        justifyContent: 'center',
        alignItems: 'center',
        backgroundColor: 'rgba(0, 0, 0, 0.5)',
    },
    datePickerContainer: {
        backgroundColor: 'white',
        padding: 20,
        borderRadius: 10,
        alignItems: 'center',
    },
    confirmButton: {
        marginTop: 20,
        padding: 10,
        backgroundColor: 'green',
        borderRadius: 5,
    },
    confirmButtonText: {
        color: 'white',
        fontSize: 16,
    },
    closeButton: {
        marginTop: 10,
        padding: 10,
        backgroundColor: 'blue',
        borderRadius: 5,
    },
    closeButtonText: {
        color: 'white',
        fontSize: 16,
    },
});

export default ManifiestosRuta;
