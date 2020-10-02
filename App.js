// @refresh reset
import React, {useState, useEffect, useCallback} from 'react';
import {
  ActivityIndicator,
  StyleSheet,
  StatusBar,
  Text,
  View,
  TouchableOpacity,
} from 'react-native';

import AsyncStorage from '@react-native-community/async-storage';
import { GiftedChat } from 'react-native-gifted-chat';

import {initFirebase, createDb} from './src/Fire';
import SignIn from './src/components/SignIn';

initFirebase();

const db = createDb();
const chatsRef = db.collection('chats');

const App = () => {
  const [loading, setLoading] = useState(true);
  const [user, setUser] = useState(null);
  const [name, setName] = useState('');
  const [messages, setMessages] = useState([])

  useEffect(() => {
    fetchUser();
    const interval = setInterval(() => {
      fetchMessages();
    }, 5000);

    /**
     * Method for real time message updation
     */
    
    // const unsubscribe = chatsRef.onSnapshot((querySnapshot) => {
    //   const messagesFirestore = querySnapshot
    //       .docChanges()
    //       .filter(({ type }) => type === 'added')
    //       .map(({ doc }) => {
    //           const message = doc.data()
    //           return { ...message, createdAt: message.createdAt.toDate() }
    //       })
    //       .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime())
    //   appendMessages(messagesFirestore)
    // })
    // return () => unsubscribe()
    return () => clearInterval(interval);
  }, []);

  const fetchMessages = () => {
    chatsRef.get()
    .then(function(querySnapshot) {
      let messagesFirestore = [];
        querySnapshot.forEach(function(doc) {
            let message = doc.data()
            message = { ...message, createdAt: message.createdAt.toDate()}
            messagesFirestore.push(message)
        })
        messagesFirestore.sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime());
        if(messagesFirestore.length !== messages.length){
          setMessages(messagesFirestore)
        }
    })
    .catch(function(error) {
        console.log("Error getting documents: ", error);
    });
  }

  /**
   * Method used to append the messages if using Real time updation
   */
  const appendMessages = useCallback(
    (messages) => {
        setMessages((previousMessages) => GiftedChat.append(previousMessages, messages))
    },
    [messages]
  );

  const fetchUser = async () => {
    let user = await AsyncStorage.getItem('user');
    if(user){
      setUser(JSON.parse(user));
    }
    setLoading(false);
  };

  const handlePress = async () => {
    let _id = Math.random().toString(36).substring(7);
    let user = {_id, name};
    if(name.length){
      await AsyncStorage.setItem('user', JSON.stringify(user));
      setUser(user);
    }
  };

  const handleSend = async (messages) => {
    const writes = messages.map((m) => chatsRef.add(m))
    await Promise.all(writes)
  }

  const clearUser = async () => {
    await AsyncStorage.removeItem('user');
    setUser('');
  };

  if(loading){
    return <ActivityIndicator size = 'large' color = '#33F1FF' />
  }

  if(!user){
    return <SignIn name = {name} setName = {setName} handlePress = {handlePress} />
  }

  return (
    <>
      <StatusBar backgroundColor = '#87CEEB' />
      <View style = {styles.header}>
        <Text style = {{fontSize: 16}}>{name}</Text>
        <TouchableOpacity
          style={styles.button}
          onPress={()=>{clearUser()}}>
          <Text style = {{color: 'blue', fontSize: 16}}>Clear User</Text>
      </TouchableOpacity>
      </View>
     
      <GiftedChat messages={messages} user={user} onSend={handleSend} />
    </>
  )
};

const styles = StyleSheet.create({
  header:{
    flexDirection:'row',
    justifyContent: 'space-between',
    alignItems:'center',
    paddingHorizontal: 10,
    height: 30,
    backgroundColor: '#87CEFA'
  }
});

export default App;
