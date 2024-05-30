import React from 'react';
import { View, Text, Image, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';
import usuarioImage from '../assets/usuario.png';


const ProfileScreen = () => {
    return (
        <View style={tw`flex-1 items-center justify-center p-4 bg-gray-100`}>
            {/* Header: Imagen del perfil */}
            <Image
                source={usuarioImage}
                style={tw`w-24 h-24 rounded-full border-gray-300 border-2 mb-4`}
            />
            {/* Nombre y biografía */}
            <Text style={tw`text-xl font-bold text-gray-800`}>Juan Pérez</Text>
            <Text style={tw`text-sm text-gray-600 text-center p-2`}>
                Amante de la tecnología y la naturaleza. Viajero frecuente y fotógrafo aficionado.
            </Text>
            {/* Botones de acción */}
            <View style={tw`flex-row mt-4`}>
                <TouchableOpacity style={tw`bg-blue-500 p-3 rounded-lg m-1 flex-1`}>
                    <Text style={tw`text-center text-white`}>Editar Perfil</Text>
                </TouchableOpacity>
                <TouchableOpacity style={tw`bg-red-500 p-3 rounded-lg m-1 flex-1`}>
                    <Text style={tw`text-center text-white`}>Cerrar Sesión</Text>
                </TouchableOpacity>
            </View>
        </View>
    );
};

export default ProfileScreen;
