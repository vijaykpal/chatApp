import React from 'react';
import {
    View,
    Text,
    TextInput,
    StyleSheet,
    TouchableOpacity
} from 'react-native';

const SignIn = (props) => {
    let {name = '', setName, handlePress} = props;

    return(
        <View style = {styles.userContainer}>
            <TextInput 
                style = {styles.input} 
                placeholder = 'Enter user name' 
                value = {name} 
                onChangeText = {setName} />

            <TouchableOpacity
                style={styles.button}
                onPress={()=>{handlePress()}}>
            <Text style = {{color: '#1E90FF', fontSize: 16}}>Continue</Text>
        </TouchableOpacity>
      </View>
    )
};

const styles = StyleSheet.create({
    userContainer: {
      flex: 1,
      justifyContent: 'center',
      alignItems: 'center'
    },
    input: {
      width: '80%',
      borderWidth: 1,
      borderRadius: 5,
      borderColor: 'gray'
    },
    button: {
      marginVertical: 10
    }
  });

  export default SignIn;