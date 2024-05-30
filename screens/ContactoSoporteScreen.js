import React, { useState } from 'react';
import { View, Text, TextInput, Button, StyleSheet } from 'react-native';

function ContactoSoporteScreen({ navigation }) {
    const [inputText, setInputText] = useState('');

    const handleSend = () => {
        alert(`Mensaje enviado: ${inputText}`);
        setInputText(''); // Clear input after sending
    };

    return (
        <View style={styles.container}>
            <TextInput
                style={styles.input}
                onChangeText={setInputText}
                value={inputText}
                placeholder="Escribe tu mensaje aquí"
            />
            <Button title="Enviar Mensaje" onPress={handleSend} />
            <Button title="Volver al Inicio" onPress={() => navigation.popToTop()} />
        </View>
    );
}

const styles = StyleSheet.create({
    container: {
        flex: 1,
        alignItems: 'center',
        justifyContent: 'center',
    },
    input: {
        height: 40,
        margin: 12,
        borderWidth: 1,
        padding: 10,
        width: '80%',
    },
});

export default ContactoSoporteScreen;
