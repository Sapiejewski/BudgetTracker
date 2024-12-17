import { SafeAreaView } from 'react-native-safe-area-context';
import { View,Text } from 'react-native';
import { useLocalSearchParams } from 'expo-router';


export default function Group() {
    const { id } = useLocalSearchParams();

   return (
    <SafeAreaView>
        <View>
            <Text>{id}</Text>
        </View>
    </SafeAreaView>
   ) 
}