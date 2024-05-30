import React, { useState } from 'react';
import { View, Button, Text, ScrollView, Alert, Image } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import { TextInput } from 'react-native-gesture-handler';
import { launchCamera, launchImageLibrary } from 'react-native-image-picker';

const styles = {
    scrollView: tw`bg-white bg-opacity-80 rounded-lg p-5 `,
    view: tw`px-3 py-4`,
    group: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow`,
    groupTitle: tw`text-lg text-black mb-2 font-semibold text-center`,
};

const ImagePickerScreen = () => {
    const [images, setImages] = useState([]);

    const takePhoto = async () => {
        launchCamera({ mediaType: 'photo' }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const newImages = response.assets.map(asset => ({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                }));
                setImages(newImages);
            }
        });
    };

    const handleSelectImages = async () => {
        launchImageLibrary({ mediaType: 'photo', selectionLimit: 0 }, response => {
            if (response.didCancel) {
                console.log('User cancelled image picker');
            } else if (response.error) {
                console.log('ImagePicker Error: ', response.error);
            } else {
                const newImages = response.assets.map(asset => ({
                    uri: asset.uri,
                    width: asset.width,
                    height: asset.height,
                }));
                setImages(newImages);
            }
        });
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
                    <Button title="Seleccionar Manifiestos" onPress={handleSelectImages} />
                    <Button title="Tomar Foto" onPress={takePhoto} />
                </View>
                <View>
                    {images.map((image, index) => (
                        <Image key={index} source={{ uri: image.uri }} style={{ width: 100, height: 100 }} />
                    ))}
                </View>
            </View>
        </ScrollView>
    );
};

export default ImagePickerScreen;
