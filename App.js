import React, { useState } from 'react';
import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { createDrawerNavigator } from '@react-navigation/drawer';
import { ChecadorStack } from './Navigation';
import CustomDrawerContent from './Layout/CustomDrawerContent';
import LoginScreen from './screens/LoginScreen';
import ManifiestoRuta from './screens/ManifiestosRuta'; // Asegúrate de que la ruta es correcta
import DetalleManifiestoScreen from './screens/DetalleManifiestoScreen'; // Asegúrate de que la ruta es correcta
import ImagePickerScreen from './screens/ImagePickerScreen';

export const UserContext = React.createContext();

const Stack = createNativeStackNavigator();
const Drawer = createDrawerNavigator();

const DrawerNavigator = () => {
  return (
    <Drawer.Navigator
      initialRouteName="Checador Suvalsa"
      drawerContent={props => <CustomDrawerContent {...props} />}
    >
      <Drawer.Screen name="Checador Suvalsa" component={ChecadorStack} />
      <Stack.Screen name="Manifiesto" component={ManifiestoRuta} />
      <Stack.Screen name="Carga Fotografias" component={ImagePickerScreen} />
    </Drawer.Navigator>

  );
};

const App = () => {
  const [user, setUser] = useState(null);

  return (
    <UserContext.Provider value={{ user, setUser }}>
      <NavigationContainer>
        <Stack.Navigator screenOptions={{ headerShown: false }}>
          <Stack.Screen name="Login" component={LoginScreen} />
          <Stack.Screen name="Drawer" component={DrawerNavigator} />
        </Stack.Navigator>
      </NavigationContainer>
    </UserContext.Provider>
  );
};

export default App;
