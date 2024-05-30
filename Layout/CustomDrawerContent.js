// CustomDrawerContent.js
import React from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { DrawerContentScrollView, DrawerItemList } from '@react-navigation/drawer';

const CustomDrawerContent = (props) => {
    const handleLogout = () => {
        props.navigation.reset({
            index: 0,
            routes: [{ name: 'Login' }],
        });
    };

    return (
        <DrawerContentScrollView {...props}>
            <DrawerItemList {...props} />
            <View style={styles.footer}>
                <TouchableOpacity onPress={handleLogout}>
                    <Text style={styles.logoutText}>Cerrar sesión</Text>
                </TouchableOpacity>
            </View>
        </DrawerContentScrollView>
    );
};

const styles = StyleSheet.create({
    footer: {
        marginTop: 'auto', // Esto empujará el footer hacia abajo
        padding: 20,
        borderTopWidth: 1,
        borderTopColor: '#ccc',
    },
    logoutText: {
        color: 'red', // Color rojo para el texto de cerrar sesión
        textAlign: 'center',
    },
});

export default CustomDrawerContent;
