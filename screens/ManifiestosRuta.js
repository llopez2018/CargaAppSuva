import React, { useState } from 'react';
import {
    StyleSheet,
    View,
    Text,
    TextInput,
    TouchableOpacity,
    ActivityIndicator,
    FlatList
} from 'react-native';
import tw from 'tailwind-react-native-classnames';
import moment from 'moment';
import { useNavigation } from '@react-navigation/native';
import Icon from 'react-native-vector-icons/FontAwesome';
import { Dimensions } from 'react-native';
import DatePicker from 'react-native-date-picker';

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

    const onChange = (selectedDate) => {
        const currentDate = selectedDate || fecha;
        setShowPicker(false);
        setFecha(currentDate);
        setDateInput(moment(currentDate).format('YYYY-MM-DD'));
    };

    const buscarManifiestos = async () => {
        setLoading(true);
        setError('');
        try {
            console.log(ruta, dateInput)
            const json = await fetchGetManifSearch(ruta, dateInput);

            // Asegúrate de que 'orden' sea un número para ordenar correctamente
            const datosOrdenados = json.map(item => ({
                ...item,
                orden: parseFloat(item.orden)
            })).sort((a, b) => a.orden - b.orden); // Ordena de menor a mayor

            setDatos(datosOrdenados);
        } catch (error) {
            console.error(error);
            setError('Error al obtener datos');
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
                    style={[styles.input, tw`flex-1 mr-2 text-center`]}
                    onChangeText={(text) => setRuta(text.replace(/[^0-9]/g, ''))}
                    value={ruta}
                    placeholder="Introduce una ruta"
                    placeholderTextColor="#ccc"
                    keyboardType="numeric"
                    maxLength={10}
                />
                <Text style={styles.header}>Ingresa La fecha de inicio de la ruta</Text>
                <View style={tw`flex-row items-center justify-center w-full`}>
                    <TextInput
                        style={[styles.input, tw`flex-1 mr-2 text-center`]}
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
                {showPicker && (
                    <DatePicker
                        date={fecha}
                        onDateChange={onChange}
                        mode="date"
                        maximumDate={new Date()}
                    />
                )}
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
                        onPress={() => navigation.navigate('DetalleManifiesto', { itemData: item })}
                    >
                        <Text style={[styles.cell, { width: '30%' }]}>{item.clave}</Text>
                        <Text style={[styles.cell, { width: '30%' }]}>{item.orden}</Text>
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
    input: tw`bg-white w-full rounded-md px-4 py-2 border border-gray-300 mb-4`,
    buttonStyle: tw`bg-blue-500 w-11/12 py-4 rounded-lg shadow-lg mb-4`,
    row: tw`flex-row justify-between p-2 border-b border-gray-200`,
    headerRow: tw`flex-row justify-between p-2 border-b border-gray-500 bg-gray-200`,
    cell: tw`text-sm`,
    headerCell: tw`text-sm font-semibold`,
    list: {
        flex: 1,
    },
    inputsContainer: {
        width: screenWidth,
        justifyContent: 'center',  // Centra los elementos en el contenedor
        alignItems: 'center',      // Centra los elementos en el contenedor
        padding: 10
    }
});

export default ManifiestosRuta;