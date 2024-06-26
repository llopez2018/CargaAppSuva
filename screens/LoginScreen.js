import React, { useState, useEffect, useContext } from 'react';
import { View, Text, TextInput, TouchableOpacity, Image, StyleSheet } from 'react-native';
import LinearGradient from 'react-native-linear-gradient';
import { loginUser } from '../Fetch/AuthService';
import tw from 'tailwind-react-native-classnames';
import MaterialCommunityIcons from 'react-native-vector-icons/MaterialCommunityIcons';
import NetInfo from "@react-native-community/netinfo";
import LogoImage from '../assets/LogoDisplay.png';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { UserContext } from '../App';

const styles = StyleSheet.create({
    textShadow: {
        textShadowColor: 'rgba(0, 0, 0, 0.75)',
        textShadowOffset: { width: -1, height: 1 },
        textShadowRadius: 10
    }
});

function LoginScreen({ navigation }) {
    const [username, setUsername] = useState('');
    const [password, setPassword] = useState('');
    const [isPasswordVisible, setIsPasswordVisible] = useState(false);
    const [rememberCredentials, setRememberCredentials] = useState(false);
    const { setUser } = useContext(UserContext);

    useEffect(() => {
        const loadCredentials = async () => {
            try {
                const storedCredentials = await AsyncStorage.getItem('userCredentials');
                if (storedCredentials) {
                    const { username, password } = JSON.parse(storedCredentials);
                    setUsername(username);
                    setPassword(password);
                    setRememberCredentials(true); // Set rememberCredentials to true if we loaded stored credentials
                }
            } catch (error) {
                console.error('Error loading stored credentials:', error);
            }
        };

        loadCredentials();

        const unsubscribe = NetInfo.addEventListener(state => {
            if (!state.isConnected) {
                alert("Tu dispositivo no está conectado a internet. Por favor, verifica tu conexión.");
            }
        });

        return () => unsubscribe();
    }, []);

    const handleLogin = async () => {
        try {
            const result = await loginUser(username, password);
            if (result.success) {
                if (rememberCredentials) {
                    await AsyncStorage.setItem('userCredentials', JSON.stringify({ username, password }));
                } else {
                    await AsyncStorage.removeItem('userCredentials');
                }
                setUser(result.user);
                navigation.navigate('Drawer');
            } else {
                alert('Credenciales incorrectas o no se pudo autenticar');
            }
        } catch (error) {
            alert('Error de conexión: ' + error.message);
        }
    };

    return (
        <LinearGradient
            colors={['#4c669f', '#5a55ae', '#673ab7', '#8e44ad']}
            style={tw`flex-1 items-center justify-center`}
        >
            <View style={tw`bg-white bg-opacity-80 rounded-lg p-5 w-4/5 items-center`}>
                <Text style={[tw`text-2xl font-bold mb-5 text-white tracking-wide font-bold`, styles.textShadow]}>S U V A L S A</Text>
                <Image
                    source={LogoImage}
                    style={tw`w-36 h-40 rounded-lg`}
                />

                <TextInput
                    style={tw`w-full h-10 my-2 bg-white rounded-md p-2 border border-gray-300`}
                    onChangeText={setUsername}
                    value={username}
                    placeholder="Usuario"
                    placeholderTextColor="#ccc"
                    autoCapitalize="none"
                />
                <View style={tw`flex-row items-center w-full`}>
                    <TextInput
                        style={tw`flex-1 h-10 my-2 bg-white rounded-md p-2 border border-gray-300`}
                        onChangeText={setPassword}
                        value={password}
                        placeholder="Contraseña"
                        secureTextEntry={!isPasswordVisible}
                        placeholderTextColor="#ccc"
                    />
                    <TouchableOpacity
                        onPress={() => setIsPasswordVisible(!isPasswordVisible)}
                        style={tw`ml-2`}
                    >
                        <MaterialCommunityIcons
                            name={isPasswordVisible ? 'eye' : 'eye-off'}
                            color={isPasswordVisible ? "green" : "gray"}
                            size={30}
                        />
                    </TouchableOpacity>
                </View>
                <View style={tw`flex-row items-center w-full`}>
                    <TouchableOpacity
                        style={tw`mr-2`}
                        onPress={() => setRememberCredentials(!rememberCredentials)}
                    >
                        <MaterialCommunityIcons
                            name={rememberCredentials ? 'checkbox-marked-circle' : 'checkbox-blank-circle-outline'}
                            size={24}
                            color={rememberCredentials ? 'blue' : 'gray'}
                        />
                    </TouchableOpacity>
                    <Text style={tw`text-gray-700 text-justify font-bold`}>No olvidar credenciales</Text>
                </View>

                <TouchableOpacity
                    onPress={handleLogin}
                    style={tw`mt-3 bg-blue-600 p-3 rounded-md w-full items-center justify-center shadow-lg`}
                >
                    <Text style={tw`text-white`}>Iniciar Sesión</Text>
                </TouchableOpacity>
            </View>
        </LinearGradient>
    );
}

export default LoginScreen;
