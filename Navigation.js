import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChecadorScreen from './screens/ChecadorScreen';
import ManifiestoRuta from './screens/ManifiestosRuta';
import ImagePickerScreen from './screens/ImagePickerScreen';  // Asegúrate de que la ruta es correcta
import DetalleManifiestoScreen from './screens/DetalleManifiestoScreen';

const Stack = createNativeStackNavigator();

function ChecadorStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="Checador" component={ChecadorScreen} />
            <Stack.Screen name="Manifiestos" component={ManifiestoRuta} />
            <Stack.Screen name="DetalleManifiesto" component={DetalleManifiestoScreen} />
        </Stack.Navigator>
    );
}

export { ChecadorStack };
