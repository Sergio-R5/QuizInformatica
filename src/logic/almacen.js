// Capa de almacenamiento local (AsyncStorage) con async/await y try/catch.
// Las pantallas no usan AsyncStorage directamente: si mañana cambia el almacén,
// solo se modifica este archivo.

import AsyncStorage from '@react-native-async-storage/async-storage';

export const almacen = {
  /** Lee un valor guardado. Devuelve null si no existe o si falla la lectura. */
  async leer(clave) {
    try {
      const texto = await AsyncStorage.getItem(clave);
      return texto === null ? null : JSON.parse(texto);
    } catch (error) {
      console.warn('No se pudo leer', clave, error);
      return null;
    }
  },

  /** Guarda un valor. Si falla, la app sigue funcionando (solo no se recordará). */
  async guardar(clave, valor) {
    try {
      await AsyncStorage.setItem(clave, JSON.stringify(valor));
    } catch (error) {
      console.warn('No se pudo guardar', clave, error);
    }
  },
};
