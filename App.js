// Punto de entrada: tema + navegación.
// Pila de pantallas: Inicio -> Quiz -> Resultados.
// El paso Quiz -> Resultados usa navigation.replace(), así el quiz terminado
// sale de la pila y el botón atrás desde Resultados vuelve a Inicio.

import { NavigationContainer } from '@react-navigation/native';
import { createNativeStackNavigator } from '@react-navigation/native-stack';
import { StatusBar } from 'expo-status-bar';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import InicioScreen from './src/screens/InicioScreen';
import QuizScreen from './src/screens/QuizScreen';
import ResultadosScreen from './src/screens/ResultadosScreen';
import { TemaProvider, useTema } from './src/theme/TemaContext';

const Stack = createNativeStackNavigator();

function Navegacion() {
  const { tema } = useTema();
  return (
    <NavigationContainer>
      <StatusBar style={tema.oscuro ? 'light' : 'dark'} />
      <Stack.Navigator
        initialRouteName="Inicio"
        screenOptions={{
          headerShown: false,
          animation: 'slide_from_right',
          contentStyle: { backgroundColor: tema.fondo },
        }}
      >
        <Stack.Screen name="Inicio" component={InicioScreen} />
        {/* gestureEnabled: false -> en el quiz no se sale deslizando; la salida es controlada */}
        <Stack.Screen name="Quiz" component={QuizScreen} options={{ gestureEnabled: false }} />
        <Stack.Screen name="Resultados" component={ResultadosScreen} options={{ animation: 'fade' }} />
      </Stack.Navigator>
    </NavigationContainer>
  );
}

export default function App() {
  return (
    <SafeAreaProvider>
      <TemaProvider>
        <Navegacion />
      </TemaProvider>
    </SafeAreaProvider>
  );
}
