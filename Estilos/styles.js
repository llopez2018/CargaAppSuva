import { StyleSheet } from 'react-native';
import tw from 'tailwind-react-native-classnames';


const styles = StyleSheet.create({
    container: tw`flex-1 bg-white p-5`,
    header: tw`text-center text-xl font-bold`,
    input: {
        backgroundColor: 'white',
        width: '90%',
        borderRadius: 4,
        borderWidth: 1,
        borderColor: '#d1d5db',
        padding: 12,
        marginBottom: 12
    },
    row: tw`flex-row justify-between p-2 border-b border-gray-200`,
    headerRow: tw`flex-row justify-between p-2 border-b border-gray-500 bg-gray-200`,
    cell: tw`text-sm`,
    headerCell: tw`text-sm font-semibold`,
    list: {
        flex: 1,
    },
    inputsContainer: {
        width: screenWidth,
        justifyContent: 'center',
        alignItems: 'center',
        padding: 10
    },
});
