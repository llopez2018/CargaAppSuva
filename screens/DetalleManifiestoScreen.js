import React, { useState } from 'react';
import { View, Text, TextInput, ScrollView, Button, Platform } from 'react-native';
import { useRoute } from '@react-navigation/native';
import tw from 'tailwind-react-native-classnames';





const DetalleManifiestoScreen = () => {
    const route = useRoute();
    const { itemData } = route.params;
    // Estado para manejar la fecha y la visibilidad del selector de fecha
    const [date, setDate] = useState(new Date());
    const [showDatePicker, setShowDatePicker] = useState(false);

    const [data, setData] = useState([
        { id: 1, descripcion: 'SANGRE BI 5', cantidad: '0.00', unidad: 'Kg' },
        { id: 2, descripcion: 'CULTIVOS Y CEPAS BI 1', cantidad: '0.00', unidad: 'Kg' },
        { id: 3, descripcion: 'PATOLOGICO BI 3', cantidad: '0.00', unidad: 'Kg' },
        { id: 4, descripcion: 'NO ANATOMICO BI 4', cantidad: '0.00', unidad: 'Kg' },
        { id: 5, descripcion: 'PUNZOCORTANTE BI 2', cantidad: '0.00', unidad: 'Kg' },
    ]);

    const handleCantidadChange = (text, id) => {
        const newData = data.map(item => {
            if (item.id === id) {
                return { ...item, cantidad: text };
            }
            return item;
        });
        setData(newData);
    };

    const getCurrentDate = () => {
        const date = new Date();
        const day = date.getDate().toString().padStart(2, '0');  // Asegura dos dígitos
        const month = (date.getMonth() + 1).toString().padStart(2, '0');  // Meses son 0-indexados, añade 1
        const year = date.getFullYear();

        return `${day}/${month}/${year}`;
    };

    const formattedDate = getCurrentDate();

    return (
        <ScrollView style={styles.scrollView}>
            <View style={styles.view}>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>GENERADOR</Text>
                    <Text style={styles.text}>No. Identificacion</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.clave}
                        editable={false}
                    />
                    <Text style={styles.text}>Manifiesto</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.clave}
                        editable={false}
                    />
                    <Text style={styles.text}>No. Semarnat</Text>
                    <TextInput
                        style={styles.textInput}
                        value="012090"
                        editable={false}
                    />
                    <Text style={styles.text}>Razon Social De la Empresa</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.nombre}
                        editable={false}
                    />
                    <Text style={styles.text}>Domicilio</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.calle}
                        editable={false}
                    />
                    <Text style={styles.text}>Municipio o Delegacion</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.ciudad}
                        editable={false}
                    />
                    <Text style={styles.text}>Estado</Text>
                    <TextInput
                        style={styles.textInput}
                        value={itemData.estado}
                        editable={false}
                    />

                    <Text style={styles.tableTitle}>Favor de complementar los datos segun sea el peso</Text>
                    <View style={styles.tableHeader}>
                        <Text style={styles.headerCell}>Descripción Residuo</Text>
                        <Text style={styles.headerCell}>Cantidad Total</Text>
                        <Text style={styles.headerCell}>Unidad Volumen/Peso</Text>
                    </View>
                    <View style={styles.table}>
                        {data.map((item) => (
                            <View key={item.id} style={styles.tableRow}>
                                <Text style={styles.tableCell}>{item.descripcion}</Text>
                                <TextInput
                                    style={styles.tableCellInput}
                                    onChangeText={text => handleCantidadChange(text, item.id)}
                                    value={item.cantidad}
                                />
                                <Text style={styles.tableCell}>{item.unidad}</Text>
                            </View>
                        ))}
                    </View>
                    <Text style={styles.text}>Nombre y Firma del Responsable</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />

                </View>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>TRANSPORTE</Text>
                    <Text style={styles.text}>Nombre de la Empresa Transportadora</Text>
                    <TextInput
                        style={styles.textInput}
                        value="SUVALSA SA de CV"
                        editable={false}
                    />
                    <Text style={styles.text}>Domicilio Empresa Transportadora</Text>
                    <TextInput
                        style={styles.textInput}
                        value="Jose Vasconcelos 39 Edif. 1 Depto 004 Santisima Trinidad Tlalpan, Mexico DF CP 14429 (55) 54852800"
                        editable={false}
                    />
                    <Text style={styles.text}>No Registro S.C.T.</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                    <Text style={styles.text}>Aut Semarnat</Text>
                    <TextInput
                        style={styles.textInput}
                        value="09-I-18-18"
                        editable={false}
                    />
                    <Text style={styles.text}>Recibi los materiales descritos en el manifiesto para su transporte</Text>
                    <Text style={styles.text}>Nombre</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                    <Text style={styles.text}>Cargo</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                    <Text style={styles.text}>Fecha Embarque</Text>
                    <TextInput
                        style={styles.textInput}
                        value={formattedDate}
                        editable={false}
                    />
                    <Text style={styles.text}>Firma</Text>
                    <Text style={styles.text}>Se debera de implementar la firma electronica?</Text>
                    <Text style={styles.text}>Ruta de la empresa desde el generador hasta su entrega</Text>
                    <Text style={styles.text}>tipo Vehiculo</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                    <Text style={styles.text}>Placas</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                </View>
                <View style={styles.group}>
                    <Text style={styles.groupTitle}>DESTINATARIO</Text>
                    <Text style={styles.text}>Nombre de la empresa</Text>
                    <TextInput
                        style={styles.textInput}
                        value="SUVALSA SA de CV"
                        editable={false}
                    />
                    <Text style={styles.text}>Licencia Semarnat</Text>
                    <TextInput
                        style={styles.textInput}
                        value="12-II-01-2014"
                        editable={false}
                    />
                    <Text style={styles.text}>Telefono</Text>
                    <TextInput
                        style={styles.textInput}
                        value="744 1267034"
                        editable={false}
                    />
                    <Text style={styles.text}>Domicilio</Text>
                    <TextInput
                        style={styles.textInput}
                        value="Carretera al Arenal km 1+500 Localidad El Bejuco, Acapulco de Juárez, Gro. CP 39931"
                        editable={false}
                    />
                    <Text style={styles.text}>Observaciones</Text>
                    <TextInput
                        style={styles.textInput}
                        value=""
                        editable={false}
                    />
                    <Text style={styles.text}>Nombre</Text>
                    <TextInput
                        style={styles.textInput}
                        value="Tomás Paz Valderrama"
                        editable={false}
                    />
                    <Text style={styles.text}>Cargo</Text>
                    <TextInput
                        style={styles.textInput}
                        value="Gerente"
                        editable={false}
                    />
                    <Text style={styles.text}>Fecha Embarque</Text>
                    <TextInput
                        style={styles.textInput}
                        value={formattedDate}
                        editable={false}
                    />
                    <Text style={styles.text}>Firma</Text>
                    <Text style={styles.text}>Se debera de implementar la firma electronica?</Text>
                </View>
            </View>
        </ScrollView>
    );
};

// Estilos encapsulados en un objeto
const styles = {
    scrollView: tw`flex-1 bg-white p-4`,
    view: tw`px-3 py-4`,
    group: tw`mb-4 p-3 border border-gray-300 rounded-lg shadow`, // Se añade sombra al grupo
    groupTitle: tw`text-lg text-black mb-2 font-semibold text-center`, // Título del grupo en negrita
    table: tw`mb-4 border border-gray-600`, // Borde exterior de la tabla
    tableTitle: tw`text-lg text-black my-2 font-semibold`, // Título de la tabla en negrita
    tableHeader: tw`flex-row justify-between items-center bg-gray-200 p-2 rounded-t-lg`, // Fondo para la cabecera de la tabla y redondeo superior
    headerCell: tw`flex-1 text-center font-bold p-2`, // Celdas del encabezado
    tableRow: tw`flex-row justify-between items-center`, // Filas de la tabla
    tableCell: tw`flex-1 text-center p-2 border-b border-gray-400`, // Bordes entre filas
    tableCellInput: tw`flex-1 text-center p-2 h-10 bg-white border border-gray-300 rounded`, // Celdas editables con bordes y redondeados
    textInput: tw`h-10 w-full px-2.5 border border-gray-300 rounded-md bg-white mb-2 shadow`, // Inputs de texto generales
};





export default DetalleManifiestoScreen;
