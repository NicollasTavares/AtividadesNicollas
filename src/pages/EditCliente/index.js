import React, { useState, useEffect } from 'react';
import { StyleSheet, Text, View, Button, TextInput, Alert, SafeAreaView, Platform, ScrollView, TouchableOpacity } from 'react-native';
import { getStatusBarHeight } from 'react-native-status-bar-height';
import { DatabaseConnection } from '../../database/database'
import { SafeAreaProvider } from 'react-native-safe-area-context';
import FontAwesome6 from 'react-native-vector-icons/FontAwesome6';
import { useNavigation, useRoute } from '@react-navigation/native'

import TodosClientes from '../TodosClientes/index';

const db = new DatabaseConnection.getConnection;

export default function EditCliente() {
  const route = useRoute();
  const navigation = useNavigation();

  // console.log(route.params);

  const [id, setId] = useState("");
  const [nomeCliente, setNomeCliente] = useState("");
  const [dataNasc, setDataNasc] = useState("");
  const [telefone, setTelefone] = useState("");
  const [tipo, setTipo] = useState("");


  const salvarRegistro = () => {
    if (nomeCliente.trim() === '') {
      Alert.alert('Erro', 'O nome do cliente deve ser preenchido');
      return;
    }
    if (dataNasc.trim() === '') {
      Alert.alert('Erro', 'A data do cliente deve ser preenchida');
      return;
    }
    if (telefone === null) {
      Alert.alert('Erro', 'O telefone do cliente deve ser inserido');
      return;
    }
    if (tipo === null) {
      Alert.alert('Erro', 'O tipo de telefone do cliente deve ser inserido');
      return;
    }

    db.transaction(
      tx => {
        tx.executeSql(
          'UPDATE clientes SET nome=?, data_nasc=?',
          [nomeCliente, dataNasc, id],
          (_, { rowsAffected }) => {

            tx.executeSql(
              'UPDATE tbl_telefones SET numero=?, tipo=?',
              [telefone, tipo],
              (_, { rowsAffected }) => {

                Alert.alert('Info', 'Registro alterado com sucesso',
                  [
                    {
                      onPress: () => {
                        navigation.navigate('TodosClientes');
                      }
                    }]);
              }
            )

          },

          (_, error) => {
            console.error('Erro ao editar o registro:', error);
            Alert.alert('Erro', 'Ocorreu um erro ao editar o registro.');
          }
        );
      },
      setNomeCliente(''),
      setDataNasc(''),
      setTelefone(''),
      setTipo('')
    );
    
  };

  return (
    <SafeAreaProvider>
      <SafeAreaView style={styles.androidSafeArea}>
        <View style={styles.container}>

          <View style={styles.viewTitle}>
            <Text style={styles.title}>Editar registro</Text>
          </View>

          <TextInput
            style={styles.input}
            value={nomeCliente}
            onChangeText={setNomeCliente}
            placeholder="Informe o nome do cliente"
          />

          <TextInput
            style={styles.input}
            value={dataNasc}
            onChangeText={setDataNasc}
            placeholder="Informe a data de nascimento do cliente"
          />

          <TextInput
            style={styles.input}
            value={telefone}
            onChangeText={setTelefone}
            placeholder="Informe o telefone do cliente"
          />

          <TextInput
            style={styles.input}
            value={tipo}
            onChangeText={setTipo}
            placeholder="Informe o tipo de telefone do cliente"
          />

          <TouchableOpacity
            style={styles.buttonSalvar}
            onPress={salvarRegistro}
          >
            <Text style={styles.buttonTitle}>Salvar</Text>
            <FontAwesome6 name='check' size={32} color="#FFF" />
          </TouchableOpacity>
          

        </View>


      </SafeAreaView>
    </SafeAreaProvider>
  );

}

const styles = StyleSheet.create({
  androidSafeArea: {
    flex: 1,
    alignItems: 'center',
    paddingTop: Platform.OS === 'android' ? getStatusBarHeight() : 0,
    marginTop: 10
  },
  container: {
    width: '90%',
    backgroundColor: '#fff',
    padding: 15,
    gap: 10,
    borderRadius: 10,
    elevation: 5
  },
  title: {
    fontSize: 20,
    fontWeight: 'bold',
    marginBottom: 10,
  },
  viewTitle: {
    alignItems: 'center',
    alignContent: 'center',
    width: '100%'
  },
  
  input: {
    width: '100%',
    borderWidth: 1,
    borderColor: '#ccc',
    borderRadius: 5,
    padding: 10,
    marginBottom: 10,
  },

  buttonSalvar: {
    alignItems: "center",
    justifyContent: 'center',
    flexDirection: 'row',
    // width: "100%",
    backgroundColor: "#7a42f4",
    borderRadius: 8,
    elevation: 5,
    shadowOpacity: 1,
    shadowColor: 'black',
    shadowRadius: 5,
    gap: 10,
    padding: 10,
  },
  buttonTitle: {
    fontSize: 24,
    color: "#fff",
    fontWeight: "bold"
  },

});