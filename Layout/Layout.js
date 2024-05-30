import React from 'react';
import { View, Text, SafeAreaView, TouchableOpacity } from 'react-native';
import tw from 'tailwind-react-native-classnames';

const Layout = ({ children, navigation }) => {
    return (
        <SafeAreaView style={tw`flex-1`}>
            <View style={tw`h-12 bg-blue-500 flex-row justify-between items-center px-4`}>
                <TouchableOpacity onPress={() => navigation.openDrawer()}>
                </TouchableOpacity>
            </View>
            <View style={tw`flex-grow`}>
                {children}
            </View>
        </SafeAreaView>
    );
};

export default Layout;
