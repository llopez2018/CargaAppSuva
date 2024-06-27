import React, { useState, useEffect, useContext } from 'react';
import { View, Button, Text, ScrollView, Alert, Image, PermissionsAndroid, Platform, TextInput } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import { fetchPostCrearImagen } from '../Fetch/CrearImagenes';  // Import the API service function
import DeviceInfo from 'react-native-device-info';  // Import Device Info
import { UserContext } from '../App';

const styles = {
    scrollView: tw`bg-white bg-opacity-80 rounded-lg p-5 `,
    view: tw`px-3 py-4`,
    group_image: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow bg-white bg-opacity-80 `,
    groupTitle: tw`text-lg text-black mb-2 font-semibold text-center`,
    imageGrid: tw`flex flex-wrap justify-center items-center`,
    imageItem: tw`w-1/2 p-1 shadow rounded-lg`,
    image: { width: '100%', height: 100, borderRadius: 5 },
    textInputStyle: tw`border border-gray-300 rounded-lg p-2 text-center`,
    group: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow` // Se añade sombra al grupo
};

const ImagePickerScreen = () => {
    const [images, setImages] = useState([]);
    const [Ruta, setRuta] = useState('');
    const [manifiesto, setManifiesto] = useState('');
    const [categoria, setCategoria] = useState('');
    const { user } = useContext(UserContext);

    useEffect(() => {
        // Obtener el identificador único del dispositivo
        const fetchDeviceInfo = async () => {
            const uniqueId = await DeviceInfo.getUniqueId();
        };

        fetchDeviceInfo();
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
        // Verificar si no hay imágenes cargadas
        if (images.length === 0) {
            Alert.alert('Alerta de verificacion', 'No se han cargado imágenes para almacenar.');
            return;
        }

        const base64Images = await Promise.all(images.map(async (image) => {
            const originalSize = await getFileSize(image.uri);
            console.log(`Original size of image: ${originalSize} bytes`);

            const base64 = await convertToBase64(image.uri); // Convert original image to Base64
            if (base64) {
                console.log(`Size of image in Base64: ${base64.length} characters`);
            }
            return {
                base64,
                path: image.uri
            };
        }));

        // Enviar cada imagen en una petición separada
        let allUploadsSuccessful = true;
        for (const image of base64Images.filter(image => image !== null)) {
            const data = {
                ruta: Ruta,
                usuario: user.name,
                manifiesto: manifiesto,
                imagenBase64: image.base64,
                tipoDeImagen: "png",
                categoria: categoria
            };

            try {
                const responseStatus = await fetchPostCrearImagen(data);
                if (responseStatus !== 200) {
                    Alert.alert('Error', `Failed to upload image. Status code: ${responseStatus}`);
                    allUploadsSuccessful = false;
                }
            } catch (error) {
                Alert.alert('Error', `Failed to upload image: ${error.message}`);
                allUploadsSuccessful = false;
            }
        }

        if (allUploadsSuccessful) {
            // Mostrar alerta de éxito
            Alert.alert('Success', 'All images uploaded successfully!', [
                {
                    text: 'OK',
                    onPress: () => {
                        // Limpiar la pantalla
                        setImages([]);
                    }
                }
            ]);
        }
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.view}>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>Cargar Evidencia, {user.name}</Text>
                    <TextInput
                        style={[styles.textInputStyle, { width: '100%' }]}
                        placeholder="Ruta"
                        value={Ruta}
                        onChangeText={text => {
                            // Only allow numbers
                            const numericValue = text.replace(/[^0-9]/g, '');
                            setRuta(numericValue);
                        }}
                    />
                    <TextInput
                        style={[styles.textInputStyle, { width: '100%' }]}
                        placeholder="Manifiesto"
                        value={manifiesto}
                        onChangeText={text => setManifiesto(text)}
                    />

                    <TextInput
                        style={[styles.textInputStyle, { width: '100%' }]}
                        placeholder="Categoria"
                        value={categoria}
                        onChangeText={text => setCategoria(text)}
                    />

                    <Button title="Seleccionar Manifiestos" onPress={handleSelectImages} />
                    <Button title="Tomar Foto" onPress={takePhoto} />
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
