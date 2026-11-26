// Contexto del tema: comparte la paleta activa con todas las pantallas
// y la guarda en el teléfono para recordarla la próxima vez.

import { createContext, useContext, useEffect, useState } from 'react';
import { almacen } from '../logic/almacen';
import { TEMAS, TEMA_INICIAL } from './temas';

const CLAVE_TEMA = 'tema';
const TemaContext = createContext(null);

export function TemaProvider({ children }) {
  const [claveTema, setClaveTema] = useState(TEMA_INICIAL);
  const [listo, setListo] = useState(false);

  // Al abrir la app: leer el tema guardado con async/await.
  // Mientras tanto no se bloquea nada: React sigue dibujando.
  useEffect(() => {
    let activo = true; // evita actualizar el estado si el componente ya se desmontó
    (async () => {
      const guardado = await almacen.leer(CLAVE_TEMA);
      if (activo && guardado && TEMAS[guardado]) setClaveTema(guardado);
      if (activo) setListo(true);
    })();
    return () => { activo = false; };
  }, []);

  // Cambiar tema: primero se actualiza la pantalla (instantáneo) y después
  // se guarda en segundo plano. No se espera (await) el guardado para no frenar la interfaz.
  const cambiarTema = (clave) => {
    setClaveTema(clave);
    almacen.guardar(CLAVE_TEMA, clave);
  };

  return (
    <TemaContext.Provider value={{ tema: TEMAS[claveTema], claveTema, cambiarTema, listo }}>
      {children}
    </TemaContext.Provider>
  );
}

export function useTema() {
  return useContext(TemaContext);
}
