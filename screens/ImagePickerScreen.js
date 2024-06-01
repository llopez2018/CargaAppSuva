import React, { useState } from 'react';
import { View, Button, Text, ScrollView, Alert, Image, PermissionsAndroid, Platform } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';
import { check, request, PERMISSIONS, RESULTS } from 'react-native-permissions';
import RNFS from 'react-native-fs';
import ImageResizer from 'react-native-image-resizer';  // Import the image resizer library

const styles = {
    scrollView: tw`bg-white bg-opacity-80 rounded-lg p-5 `,
    view: tw`px-3 py-4`,
    group: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow bg-white bg-opacity-80 `,
    group_image: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow bg-white bg-opacity-80 `,
    groupTitle: tw`text-lg text-black mb-2 font-semibold text-center`,
    imageGrid: tw`flex flex-wrap justify-center items-center`,
    imageItem: tw`w-1/2 p-1 shadow rounded-lg`,
    image: { width: '100%', height: 100, borderRadius: 5 }
};

const ImagePickerScreen = () => {
    const [images, setImages] = useState([]);

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

    const compressImage = async (uri) => {
        try {
            const compressedImage = await ImageResizer.createResizedImage(
                uri, // image uri
                800, // width to resize to
                600, // height to resize to
                'JPEG', // format (JPEG, PNG)
                80, // quality (0-100)
                0 // rotation
            );
            return compressedImage.uri;
        } catch (error) {
            console.error('Error compressing image:', error);
            return null;
        }
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
        const base64Images = await Promise.all(images.map(async (image) => {
            const originalSize = await getFileSize(image.uri);
            console.log(`Original size of image: ${originalSize} bytes`);

            const compressedUri = await compressImage(image.uri); // Compress the image
            if (compressedUri) {
                const compressedSize = await getFileSize(compressedUri);
                console.log(`Compressed size of image: ${compressedSize} bytes`);

                const base64 = await convertToBase64(compressedUri); // Convert compressed image to Base64
                if (base64) {
                    console.log(`Size of image in Base64: ${base64.length} characters`);
                }
                return base64;
            }
            return null;
        }));
    };

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.view}>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>Cargar Evidencia</Text>
                    <TextInput
                        style={tw`flex-1 h-10 my-2 bg-white rounded-md p-2 border border-gray-300`}
                        value="Ruta Asignada"
                    />
                    <TextInput
                        style={tw`flex-1 h-10 my-2 bg-white rounded-md p-2 border border-gray-300`}
                        value="Fecha"
                    />
                    <TextInput
                        style={tw`flex-1 h-10 my-2 bg-white rounded-md p-2 border border-gray-300`}
                        value="Manifiesto"
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
