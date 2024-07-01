import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Text, ScrollView, Alert, Image, PermissionsAndroid, Platform, TextInput } from 'react-native';
import { Picker } from '@react-native-picker/picker';
import tw from 'tailwind-react-native-classnames';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { BASE_URL, createEntity } from '../Fetch/CategoriasService';  // Import BASE_URL and createEntity
import DeviceInfo from 'react-native-device-info';
import { UserContext } from '../App';
import { fetchRutasNombre } from '../Fetch/RutasCarga';
import DocumentScanner from 'react-native-document-scanner-plugin';

const styles = {
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
};

const categoryFields = {
    Alimentos: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'lugar', placeholder: 'Lugar', type: 'text' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Hoteles: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'lugar', placeholder: 'Lugar', type: 'text' },
        { name: 'factura', placeholder: 'Factura', type: 'text' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Combustible: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'porcentaje_tanque', placeholder: 'Porcentaje Tanque', type: 'number' },
        { name: 'kilometraje', placeholder: 'Kilometraje', type: 'number' },
        { name: 'proveedor', placeholder: 'Proveedor', type: 'text' },
        { name: 'poblacion', placeholder: 'Población', type: 'text' },
        { name: 'factura', placeholder: 'Factura', type: 'text' },
        { name: 'litros', placeholder: 'Litros', type: 'number' },
        { name: 'metodo_pago', placeholder: 'Método de Pago', type: 'text' }
    ],
    Casetas: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'lugar', placeholder: 'Lugar', type: 'text' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Reparacion_y_Mantenimiento: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'concepto', placeholder: 'Concepto', type: 'text' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Imprevistos: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'concepto', placeholder: 'Concepto', type: 'text' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Depositos: [
        { name: 'fecha', placeholder: 'Fecha', type: 'date' },
        { name: 'importe', placeholder: 'Importe', type: 'number' }
    ],
    Observaciones: [
        { name: 'observacion', placeholder: 'Observación', type: 'text' }
    ],
    Firmas: [
        { name: 'operador_responsable', placeholder: 'Operador Responsable', type: 'text' },
        { name: 'firma_autorizacion', placeholder: 'Firma Autorización', type: 'text' }
    ],
};

const ImagePickerScreen = () => {
    const [images, setImages] = useState([]);
    const [formState, setFormState] = useState({});
    const [selectedCategory, setSelectedCategory] = useState('');
    const { user } = useContext(UserContext);
    const [rutas, setRutas] = useState([]);
    const [selectedRuta, setSelectedRuta] = useState('');
    const [currentDate, setCurrentDate] = useState(new Date().toISOString().split('T')[0]);

    useEffect(() => {
        const fetchDeviceInfo = async () => {
            const uniqueId = await DeviceInfo.getUniqueId();
        };
        fetchDeviceInfo();

        const fetchRutas = async () => {
            try {
                const rutasData = await fetchRutasNombre();
                setRutas(rutasData);
            } catch (error) {
                console.error('Error fetching rutas:', error);
            }
        };

        fetchRutas();
    }, []);

    const requestCameraPermission = async () => {
        if (Platform.OS === 'android') {
            try {
                const granted = await PermissionsAndroid.request(
                    PermissionsAndroid.PERMISSIONS.CAMERA,
                    {
                        title: "Camera Permission",
                        message: "We need access to your camera to take photos.",
                        buttonNeutral: "Ask Me Later",
                        buttonNegative: "Cancel",
                        buttonPositive: "OK"
                    }
                );
                return granted === PermissionsAndroid.RESULTS.GRANTED;
            } catch (err) {
                console.warn(err);
                return false;
            }
        } else {
            const result = await request(PERMISSIONS.IOS.CAMERA);
            return result === RESULTS.GRANTED;
        }
    };

    const takePhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'You need to give permission to access the camera.');
            return;
        }

        launchCamera({ mediaType: 'photo' }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                const newImages = response.assets.map(asset => ({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                }));
                setImages(prevImages => [...prevImages, ...newImages]);
            }
        });
    };

    const scanPhoto = async () => {
        const hasPermission = await requestCameraPermission();
        if (!hasPermission) {
            Alert.alert('Permission denied', 'You need to give permission to access the camera.');
            return;
        }

        try {
            const result = await DocumentScanner.scanDocument();
            console.log('Scan result:', result);  // Agregar esta línea para depuración
            if (result && result.scannedImages) {
                const newImages = result.scannedImages.map(uri => ({
                    uri: uri,
                    width: null,  // Ajustar según sea necesario
                    height: null,  // Ajustar según sea necesario
                }));
                setImages(prevImages => [...prevImages, ...newImages]);
            } else {
                console.log('ScanDocument Error: No scanned images found.');
                Alert.alert('Error', 'No scanned images found.');
            }
        } catch (error) {
            console.log('ScanDocument Error: ', error);
            Alert.alert('Error', `ScanDocument Error: ${error.message}`);
        }
    };

    const handleSelectImages = async () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.errorCode) {
                console.log('ImagePicker Error: ', response.errorMessage);
            } else if (response.assets) {
                const newImages = response.assets.map(asset => ({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                }));
                setImages(prevImages => [...prevImages, ...newImages]);
            }
        });
    };

    const getFileSize = async (uri) => {
        try {
            const stat = await RNFS.stat(uri);
            return stat.size;
        } catch (error) {
            console.error('Error getting file size:', error);
            return null;
        }
    };

    const convertToBase64 = async (uri) => {
        try {
            const base64String = await RNFS.readFile(uri, 'base64');
            return base64String;
        } catch (error) {
            console.error('Error converting to base64:', error);
            return null;
        }
    };

    const grabar = async () => {
        if (images.length === 0) {
            Alert.alert('Alerta de verificacion', 'No se han cargado imágenes para almacenar.');
            return;
        }

        const base64Images = await Promise.all(images.map(async (image) => {
            const originalSize = await getFileSize(image.uri);
            console.log(`Original size of image: ${originalSize} bytes`);

            const base64 = await convertToBase64(image.uri);
            if (base64) {
                console.log(`Size of image in Base64: ${base64.length} characters`);
            }
            return {
                base64,
                path: image.uri
            };
        }));

        const endpointMap = {
            Alimentos: 'api/alimentos',
            Hoteles: 'api/hoteles',
            Combustible: 'api/combustibles',
            Casetas: 'api/casetas',
            Reparacion_y_Mantenimiento: 'api/reparacionesymantenimiento',
            Imprevistos: 'api/imprevistos',
            Depositos: 'api/depositos',
            Observaciones: 'api/observaciones',
            Firmas: 'api/firmas',
        };

        for (const image of base64Images.filter(image => image !== null)) {
            const endpoint = endpointMap[selectedCategory];
            const url = `${BASE_URL}${endpoint}`;
            console.log('Sending data to:', url);

            const data = {
                viajeId: selectedRuta,
                fecha: currentDate,
                imagenBase64: image.base64,
            };

            switch (selectedCategory) {
                case 'Alimentos':
                    data.lugar = formState.lugar;
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Hoteles':
                    data.lugar = formState.lugar;
                    data.factura = formState.factura;
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Combustible':
                    data.porcentaje_tanque = parseFloat(formState.porcentaje_tanque);
                    data.kilometraje = parseInt(formState.kilometraje, 10);
                    data.proveedor = formState.proveedor;
                    data.poblacion = formState.poblacion;
                    data.factura = formState.factura;
                    data.litros = parseFloat(formState.litros);
                    data.metodo_pago = formState.metodo_pago;
                    break;
                case 'Casetas':
                    data.lugar = formState.lugar;
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Reparacion_y_Mantenimiento':
                    data.concepto = formState.concepto;
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Imprevistos':
                    data.concepto = formState.concepto;
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Depositos':
                    data.importe = parseFloat(formState.importe);
                    break;
                case 'Observaciones':
                    data.observacion = formState.observacion;
                    break;
                case 'Firmas':
                    data.operador_responsable = formState.operador_responsable;
                    data.firma_autorizacion = formState.firma_autorizacion;
                    break;
                default:
                    break;
            }

            console.log('Data:', JSON.stringify(data, null, 2));

            try {
                const response = await createEntity(endpoint, data);
                if (!response) {
                    Alert.alert('Error', 'Failed to upload image');
                } else {
                    Alert.alert('Success', 'All images uploaded successfully!', [
                        {
                            text: 'OK',
                            onPress: () => {
                                setImages([]);
                            }
                        }
                    ]);
                }
            } catch (error) {
                Alert.alert('Error', `Failed to upload image: ${error.message}`);
            }
        }
    };

    const renderFields = () => {
        if (!selectedCategory) return null;

        return categoryFields[selectedCategory].map(field => (
            <View key={field.name} style={tw`mb-4`}>
                <TextInput
                    style={styles.textInputStyle}
                    placeholder={field.placeholder}
                    value={field.type === 'date' ? currentDate : formState[field.name]}
                    onChangeText={text => setFormState({ ...formState, [field.name]: text })}
                    keyboardType={field.type === 'number' ? 'numeric' : 'default'}
                    editable={field.type !== 'date'}
                />
            </View>
        ));
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.view}>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>Cargar Evidencia, {user.name}</Text>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedRuta}
                            onValueChange={(itemValue) => setSelectedRuta(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione una ruta" value="" />
                            {rutas.map((ruta) => (
                                <Picker.Item key={ruta.id} label={ruta.nombre} value={ruta.id} />
                            ))}
                        </Picker>
                    </View>

                    <View style={styles.pickerWrapper}>
                        <Picker
                            selectedValue={selectedCategory}
                            onValueChange={(itemValue) => setSelectedCategory(itemValue)}
                            style={styles.picker}
                        >
                            <Picker.Item label="Seleccione una categoría" value="" />
                            {Object.keys(categoryFields).map((category) => (
                                <Picker.Item key={category} label={category} value={category} />
                            ))}
                        </Picker>
                    </View>

                    {renderFields()}

                    <Button title="Seleccionar Manifiestos" onPress={handleSelectImages} />
                    <Button title="Tomar Foto" onPress={takePhoto} />
                    <Button title="Escanear Foto" onPress={scanPhoto} />
                </View>
                <View style={styles.group_image}>
                    <View style={styles.imageGrid}>
                        {images.map((image, index) => (
                            <View key={index} style={styles.imageItem}>
                                <Image source={{ uri: image.uri }} style={styles.image} />
                            </View>
                        ))}
                    </View>
                    <Button title="Grabar Evidencia" onPress={grabar} />
                </View>
            </View>
        </ScrollView>
    );
};

export default ImagePickerScreen;
