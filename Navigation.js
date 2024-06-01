import React from 'react';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import ChecadorScreen from './screens/ChecadorScreen';
import ManifiestoRuta from './screens/ManifiestosRuta';
import DetalleManifiestoScreen from './screens/DetalleManifiestoScreen';

const Stack = createNativeStackNavigator();

function ChecadorStack() {
    return (
        <Stack.Navigator screenOptions={{ headerShown: false }}>
            <Stack.Screen name="ChecadorScreen" component={ChecadorScreen} />
            <Stack.Screen name="ManifiestosScreen" component={ManifiestoRuta} />
            <Stack.Screen name="DetalleManifiestoScreen" component={DetalleManifiestoScreen} />
        </Stack.Navigator>
    );
}

export { ChecadorStack };
