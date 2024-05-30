import React from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ChecadorStack } from './Navigation';
import CustomDrawerContent from './Layout/CustomDrawerContent';
import LoginScreen from './screens/LoginScreen';
import ImagePickerScreen from './screens/ImagePickerScreen';  // Asegúrate de que la ruta es correcta
import ManifiestoRuta from './screens/ManifiestosRuta';

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="ChecadorDrawer"
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="ChecadorDrawer" component={ChecadorStack} />
      <Drawer.Screen name="Manifiestos" component={ManifiestoRuta} />
      <Drawer.Screen name="Cargar Imágenes" component={ImagePickerScreen} />
    </Drawer.Navigator>
  );
};

const App = () => {
  return (
    <NavigationContainer>
      <Stack.Navigator screenOptions={{ headerShown: false }}>
        <Stack.Screen name="Login" component={LoginScreen} />
        <Stack.Screen name="Drawer" component={DrawerNavigator} />
      </Stack.Navigator>
    </NavigationContainer>
  );
};

export default App;