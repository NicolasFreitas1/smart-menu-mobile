import { View, Text, StyleSheet } from 'react-native';
import Button from '../components/ui/button';

export default function HomeScreen() {
  return (
    <View style={styles.container}>
      <Text>Bem-vindo ao app React Native!</Text>
      <Button style={{backgroundColor: "red", }}> TESTE</Button>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
  },
});