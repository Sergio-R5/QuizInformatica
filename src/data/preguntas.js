// Banco de 30 preguntas (fuente: Informe de Evaluación Técnica en Informática).
// Cada pregunta: id, modulo, texto, alternativas (4), correcta (índice 0 a 3) y explicacion.
// Es un arreglo constante en memoria: viaja dentro de la app, sin red ni disco,
// por eso leer una pregunta es instantáneo.

const PREGUNTAS = [
  {
    "id": 1,
    "modulo": "Arquitectura de Computadores y Sistemas Operativos",
    "texto": "¿Cuál es la función principal de la Unidad Aritmético-Lógica (ALU) dentro de la CPU?",
    "alternativas": [
      "Almacenar temporalmente las instrucciones que se van a ejecutar.",
      "Coordinar el flujo de datos entre la memoria RAM y los periféricos.",
      "Ejecutar operaciones matemáticas básicas y comparaciones lógicas.",
      "Traducir direcciones virtuales de memoria a direcciones físicas."
    ],
    "correcta": 2,
    "explicacion": "La ALU (Arithmetic Logic Unit) es el circuito digital encargado exclusivamente de realizar operaciones aritméticas (suma, resta, multiplicación) y lógicas (AND, OR, NOT, XOR) sobre los datos que recibe desde los registros del procesador."
  },
  {
    "id": 2,
    "modulo": "Arquitectura de Computadores y Sistemas Operativos",
    "texto": "En la gestión de memoria de un sistema operativo, ¿qué fenómeno ocurre cuando existe suficiente memoria libre total para satisfacer una solicitud, pero esta se encuentra dividida en bloques pequeños no contiguos?",
    "alternativas": [
      "Paginación bajo demanda (Demand Paging).",
      "Fragmentación externa.",
      "Hiperpaginación (Thrashing).",
      "Desbordamiento de búfer (Buffer Overflow)."
    ],
    "correcta": 1,
    "explicacion": "La fragmentación externa sucede cuando la asignación y liberación dinámica de memoria deja múltiples espacios libres dispersos que, sumados, alcanzarían para alojar un proceso, pero individualmente resultan insuficientes si se requiere asignación contigua."
  },
  {
    "id": 3,
    "modulo": "Arquitectura de Computadores y Sistemas Operativos",
    "texto": "¿Qué diferencia fundamental existe entre un proceso y un hilo (thread) dentro de un sistema operativo moderno?",
    "alternativas": [
      "Los hilos tienen su propio espacio de direcciones aislado; los procesos lo comparten.",
      "Los procesos son gestionados por el hardware y los hilos exclusivamente por el compilador.",
      "Los hilos de un mismo proceso comparten el espacio de memoria y recursos abiertos, pero mantienen su propio contador de programa y pila.",
      "Un proceso solo puede contener un único hilo activo a la vez en arquitecturas multinúcleo."
    ],
    "correcta": 2,
    "explicacion": "Los hilos (threads) son unidades ligeras de ejecución dentro de un proceso. Comparten el código, los datos globales y los descriptores de archivos del proceso padre, pero cada hilo posee sus propios registros, contador de programa (Program Counter) y pila (Stack) para mantener su flujo de control independiente."
  },
  {
    "id": 4,
    "modulo": "Arquitectura de Computadores y Sistemas Operativos",
    "texto": "¿Qué ocurre exactamente durante un cambio de contexto (Context Switch) en la CPU?",
    "alternativas": [
      "Se reinicia la memoria caché L1 para evitar fugas de información entre usuarios.",
      "Se guarda el estado actual de los registros y contador de programa de un proceso en su PCB y se carga el estado de otro proceso.",
      "Se transfiere un archivo desde el disco duro hacia la memoria principal mediante DMA.",
      "Se cambia el modo de ejecución de usuario a modo kernel sin detener el hilo actual."
    ],
    "correcta": 1,
    "explicacion": "El cambio de contexto permite la multitarea. El sistema operativo almacena el contexto completo de ejecución del proceso saliente en su Bloque de Control de Proceso (PCB) y restaura el PCB del siguiente proceso planificado para que continúe exactamente donde se detuvo."
  },
  {
    "id": 5,
    "modulo": "Arquitectura de Computadores y Sistemas Operativos",
    "texto": "¿Cuál de los siguientes niveles de RAID ofrece redundancia mediante escritura en espejo (mirroring) sin paridad?",
    "alternativas": [
      "RAID 0",
      "RAID 1",
      "RAID 5",
      "RAID 6"
    ],
    "correcta": 1,
    "explicacion": "RAID 1 duplica exactamente los mismos datos en dos o más discos simultáneamente. A diferencia de RAID 5 y 6 (que calculan bloques de paridad distribuida) o RAID 0 (que divide datos sin redundancia), RAID 1 garantiza tolerancia a fallos mediante copia íntegra."
  },
  {
    "id": 6,
    "modulo": "Estructuras de Datos y Algoritmos",
    "texto": "¿Cuál es la complejidad temporal en el peor caso del algoritmo de ordenamiento Quicksort?",
    "alternativas": [
      "O(n log n)",
      "O(n)",
      "O(n²)",
      "O(log n)"
    ],
    "correcta": 2,
    "explicacion": "Aunque su rendimiento promedio es O(n log n), si la elección del pivote produce particiones completamente desbalanceadas de forma sistemática (por ejemplo, elegir siempre el elemento menor o mayor en un arreglo ya ordenado), el árbol de recursión alcanza profundidad n, degradando su complejidad a O(n²)."
  },
  {
    "id": 7,
    "modulo": "Estructuras de Datos y Algoritmos",
    "texto": "¿Qué estructura de datos sigue estrictamente el principio LIFO (Last In, First Out)?",
    "alternativas": [
      "Cola (Queue).",
      "Pila (Stack).",
      "Árbol binario de búsqueda (BST).",
      "Tabla hash (Hash Table)."
    ],
    "correcta": 1,
    "explicacion": "Una pila (stack) restringe las inserciones (push) y extracciones (pop) a un único extremo denominado cima (top), garantizando que el último elemento ingresado sea siempre el primero en salir."
  },
  {
    "id": 8,
    "modulo": "Estructuras de Datos y Algoritmos",
    "texto": "En una tabla hash, ¿qué es una colisión?",
    "alternativas": [
      "Cuando el factor de carga supera el 100% y el programa se detiene.",
      "Cuando dos claves distintas producen el mismo índice o dirección mediante la función hash.",
      "Cuando se intenta eliminar una clave que no existe en la estructura.",
      "Cuando el tiempo de búsqueda alcanza O(1) de manera constante."
    ],
    "correcta": 1,
    "explicacion": "Dado que el dominio de claves posibles suele ser mucho mayor que el tamaño finito del arreglo subyacente, diferentes entradas pueden mapearse al mismo bucket, requiriendo estrategias de resolución como encadenamiento separado (separate chaining) o direccionamiento abierto (open addressing)."
  },
  {
    "id": 9,
    "modulo": "Estructuras de Datos y Algoritmos",
    "texto": "¿Qué recorrido de un Árbol Binario de Búsqueda (BST) devuelve todos sus elementos ordenados de forma ascendente?",
    "alternativas": [
      "Preorden (Pre-order).",
      "Postorden (Post-order).",
      "Inorden (In-order).",
      "Por niveles (Breadth-First)."
    ],
    "correcta": 2,
    "explicacion": "En un BST, los nodos del subárbol izquierdo son menores que la raíz y los del derecho son mayores. El recorrido inorden visita primero el subárbol izquierdo, luego la raíz y finalmente el subárbol derecho, produciendo la secuencia ordenada de menor a mayor."
  },
  {
    "id": 10,
    "modulo": "Estructuras de Datos y Algoritmos",
    "texto": "¿Qué condición es indispensable para aplicar el algoritmo de búsqueda binaria (Binary Search) sobre un arreglo?",
    "alternativas": [
      "Que todos los elementos sean números enteros positivos.",
      "Que el tamaño del arreglo sea una potencia de dos.",
      "Que el arreglo se encuentre previamente ordenado.",
      "Que no existan elementos duplicados en el conjunto."
    ],
    "correcta": 2,
    "explicacion": "La búsqueda binaria descarta la mitad del espacio de búsqueda en cada iteración comparando el valor objetivo con el elemento central. Esta deducción lógica solo es válida si los elementos mantienen una relación de orden total previa."
  },
  {
    "id": 11,
    "modulo": "Redes y Comunicaciones",
    "texto": "¿En qué capa del modelo OSI opera principalmente un switch (conmutador) tradicional de red local?",
    "alternativas": [
      "Capa 1 (Física).",
      "Capa 2 (Enlace de datos).",
      "Capa 3 (Red).",
      "Capa 4 (Transporte)."
    ],
    "correcta": 1,
    "explicacion": "Un switch estándar toma decisiones de reenvío basándose en las direcciones físicas MAC contenidas en las tramas Ethernet, lo cual corresponde a la subcapa MAC de la Capa 2 (Enlace de datos)."
  },
  {
    "id": 12,
    "modulo": "Redes y Comunicaciones",
    "texto": "¿Cuál es la diferencia esencial entre los protocolos de transporte TCP y UDP?",
    "alternativas": [
      "TCP cifra los datos automáticamente y UDP los envía en texto plano.",
      "TCP opera en la capa de red y UDP en la capa de aplicación.",
      "TCP es orientado a conexión y garantiza la entrega ordenada; UDP no establece conexión ni garantiza entrega.",
      "UDP utiliza direcciones IPv6 exclusivamente, mientras que TCP solo soporta IPv4."
    ],
    "correcta": 2,
    "explicacion": "TCP implementa un saludo de tres vías (3-way handshake), números de secuencia, acuses de recibo (ACK) y retransmisión para asegurar fiabilidad. UDP envía datagramas de forma directa con mínima sobrecarga, priorizando baja latencia sobre fiabilidad."
  },
  {
    "id": 13,
    "modulo": "Redes y Comunicaciones",
    "texto": "¿Qué protocolo se encarga de traducir nombres de dominio legibles por humanos (como ejemplo.com) a direcciones IP?",
    "alternativas": [
      "DHCP",
      "ARP",
      "DNS",
      "ICMP"
    ],
    "correcta": 2,
    "explicacion": "El Domain Name System (DNS) actúa como un sistema jerárquico y distribuido de resolución de nombres que asocia registros de dominio con sus respectivas direcciones IPv4 (registros A) o IPv6 (registros AAAA)."
  },
  {
    "id": 14,
    "modulo": "Redes y Comunicaciones",
    "texto": "Dada una dirección IPv4 con máscara de subred /26 (255.255.255.192), ¿cuántas direcciones IP utilizables para hosts quedan disponibles en esa subred?",
    "alternativas": [
      "64",
      "62",
      "30",
      "126"
    ],
    "correcta": 1,
    "explicacion": "Una máscara /26 deja 32 - 26 = 6 bits para la porción de host. Esto genera 2⁶ = 64 direcciones totales, pero deben restarse 2 direcciones reservadas (la dirección de red y la dirección de broadcast), resultando en 64 - 2 = 62 hosts asignables."
  },
  {
    "id": 15,
    "modulo": "Redes y Comunicaciones",
    "texto": "¿Qué función cumple NAT (Network Address Translation) en un enrutador doméstico o empresarial?",
    "alternativas": [
      "Detectar y bloquear paquetes maliciosos mediante inspección profunda.",
      "Traducir direcciones IP privadas de una red local a una o más direcciones IP públicas para acceder a Internet.",
      "Asignar direcciones MAC dinámicas a los dispositivos inalámbricos conectados.",
      "Dividir un dominio de colisión en múltiples redes VLAN independientes."
    ],
    "correcta": 1,
    "explicacion": "NAT modifica la información de dirección IP en los encabezados de los paquetes en tránsito, permitiendo que múltiples dispositivos con direcciones privadas (RFC 1918) compartan una única dirección IP pública enrutada en Internet."
  },
  {
    "id": 16,
    "modulo": "Bases de Datos",
    "texto": "En el contexto de transacciones en bases de datos relacionales, ¿qué significa la propiedad \"A\" de las siglas ACID?",
    "alternativas": [
      "Autenticación (Authentication).",
      "Atomicidad (Atomicity).",
      "Asincronía (Asynchrony).",
      "Agregación (Aggregation)."
    ],
    "correcta": 1,
    "explicacion": "La atomicidad garantiza que una transacción se trate como una unidad indivisible (\"todo o nada\"): si alguna de sus operaciones falla, toda la transacción se revierte (rollback) y la base de datos vuelve a su estado previo intacto."
  },
  {
    "id": 17,
    "modulo": "Bases de Datos",
    "texto": "¿Qué objetivo persigue la Tercera Forma Normal (3FN) en el diseño de bases de datos relacionales?",
    "alternativas": [
      "Eliminar todas las claves foráneas para acelerar las consultas SELECT.",
      "Asegurar que ningún atributo no clave dependa transitivamente de la clave primaria.",
      "Permitir valores multivaluados dentro de una misma celda.",
      "Convertir todas las tablas en estructuras desnormalizadas orientadas a columnas."
    ],
    "correcta": 1,
    "explicacion": "Una tabla está en 3FN si cumple con la Segunda Forma Normal (2FN) y, además, ningún atributo no primo depende funcionalmente de otro atributo no primo (dependencia transitiva), evitando redundancia y anomalías de actualización."
  },
  {
    "id": 18,
    "modulo": "Bases de Datos",
    "texto": "¿Qué diferencia existe entre las cláusulas SQL WHERE y HAVING?",
    "alternativas": [
      "WHERE solo funciona con texto y HAVING solo con valores numéricos.",
      "WHERE filtra filas individuales antes de agruparlas; HAVING filtra grupos resultantes después de aplicar GROUP BY.",
      "HAVING se ejecuta antes que la cláusula FROM, mientras que WHERE se ejecuta al final.",
      "No existe diferencia funcional; son sinónimos definidos por el estándar ANSI SQL."
    ],
    "correcta": 1,
    "explicacion": "La cláusula WHERE no puede evaluar funciones de agregación (SUM, COUNT, AVG) porque actúa a nivel de registro individual antes de la agrupación. HAVING se evalúa posteriormente para filtrar los grupos creados por GROUP BY."
  },
  {
    "id": 19,
    "modulo": "Bases de Datos",
    "texto": "¿Cuál es el propósito principal de crear un índice (como un árbol B+) sobre una columna de una tabla?",
    "alternativas": [
      "Reducir el espacio total ocupado en disco por la tabla.",
      "Acelerar la velocidad de recuperación de datos en consultas de búsqueda a costa de un ligero impacto en escrituras y espacio adicional.",
      "Garantizar automáticamente el cifrado de los datos almacenados en esa columna.",
      "Evitar que la base de datos requiera copias de seguridad periódicas."
    ],
    "correcta": 1,
    "explicacion": "Un índice mantiene una estructura auxiliar ordenada con punteros hacia las filas físicas de la tabla, evitando escaneos secuenciales completos (full table scans), aunque exige actualizar dicha estructura cada vez que ocurre un INSERT, UPDATE o DELETE."
  },
  {
    "id": 20,
    "modulo": "Bases de Datos",
    "texto": "Según el Teorema CAP para sistemas distribuidos, ¿qué sucede cuando ocurre una partición de red (P)?",
    "alternativas": [
      "El sistema puede garantizar simultáneamente consistencia total y disponibilidad al 100%.",
      "El sistema debe elegir entre mantener la consistencia (C) o garantizar la disponibilidad (A).",
      "El sistema detiene automáticamente todas las réplicas para evitar pérdida de datos.",
      "La partición de red solo afecta a bases de datos relacionales, nunca a sistemas NoSQL."
    ],
    "correcta": 1,
    "explicacion": "El Teorema CAP establece que ante una falla de comunicación entre nodos (partición), un sistema distribuido debe decidir si rechaza escrituras/lecturas para evitar devolver datos desactualizados (priorizando Consistencia) o responde con los datos locales disponibles aunque no estén sincronizados (priorizando Disponibilidad)."
  },
  {
    "id": 21,
    "modulo": "Ingeniería de Software y Desarrollo",
    "texto": "En los principios SOLID de diseño orientado a objetos, ¿qué establece el Principio de Responsabilidad Única (SRP)?",
    "alternativas": [
      "Una clase debe heredar únicamente de una clase padre concreta.",
      "Una clase o módulo debe tener una única razón para cambiar, encargándose de una sola responsabilidad.",
      "Cada método de una aplicación debe contener exactamente una línea de código.",
      "Solo un desarrollador puede modificar un archivo dentro del repositorio de código."
    ],
    "correcta": 1,
    "explicacion": "El SRP (Single Responsibility Principle) busca alta cohesión y bajo acoplamiento separando distintas responsabilidades de negocio en módulos independientes, de modo que un cambio en un requisito no afecte funcionalidades no relacionadas."
  },
  {
    "id": 22,
    "modulo": "Ingeniería de Software y Desarrollo",
    "texto": "En Git, ¿qué diferencia técnica existe entre git merge y git rebase al integrar cambios de una rama?",
    "alternativas": [
      "git merge elimina el historial previo; git rebase crea una copia de seguridad en la nube.",
      "git merge conserva la bifurcación creando un commit de fusión; git rebase reescribe el historial aplicando los commits linealmente sobre la rama destino.",
      "git rebase solo funciona en repositorios locales sin conexión a Internet.",
      "git merge se usa exclusivamente para resolver conflictos y git rebase para crear etiquetas (tags)."
    ],
    "correcta": 1,
    "explicacion": "Mientras merge une dos historias manteniendo intactos los hashes originales mediante un nuevo commit con dos padres, rebase toma los commits de una rama y los vuelve a aplicar uno por uno encima de otra base, generando nuevos hashes y un historial lineal."
  },
  {
    "id": 23,
    "modulo": "Ingeniería de Software y Desarrollo",
    "texto": "¿Qué caracteriza a una arquitectura de software basada en API RESTful respecto al estado de la comunicación?",
    "alternativas": [
      "El servidor mantiene abierta una sesión persistente en memoria para cada cliente conectado.",
      "Es sin estado (stateless): cada petición del cliente debe contener toda la información necesaria para ser comprendida y procesada.",
      "Requiere obligatoriamente el intercambio de mensajes en formato XML mediante protocolo SOAP.",
      "Solo permite el uso de los métodos HTTP GET y POST."
    ],
    "correcta": 1,
    "explicacion": "La restricción stateless de REST implica que el servidor no almacena contexto de sesión del cliente entre peticiones consecutivas; cualquier estado de sesión reside en el cliente (por ejemplo, enviando un token JWT en cada solicitud)."
  },
  {
    "id": 24,
    "modulo": "Ingeniería de Software y Desarrollo",
    "texto": "¿Cuál es la diferencia principal entre un contenedor (como Docker) y una máquina virtual (VM) tradicional?",
    "alternativas": [
      "Los contenedores virtualizan el hardware completo; las VMs solo virtualizan la interfaz gráfica.",
      "Los contenedores comparten el núcleo (kernel) del sistema operativo anfitrión, mientras que cada VM ejecuta su propio sistema operativo completo sobre un hipervisor.",
      "Las máquinas virtuales consumen menos memoria RAM y arrancan más rápido que los contenedores.",
      "Los contenedores únicamente pueden ejecutarse sobre sistemas operativos Windows."
    ],
    "correcta": 1,
    "explicacion": "Los contenedores aislan procesos en el espacio de usuario mediante características del kernel (como namespaces y cgroups en Linux) sin necesidad de emular hardware ni cargar un sistema operativo invitado completo, haciéndolos mucho más ligeros."
  },
  {
    "id": 25,
    "modulo": "Ingeniería de Software y Desarrollo",
    "texto": "¿Qué método HTTP es idempotente pero NO seguro (safe) según la especificación RFC del protocolo?",
    "alternativas": [
      "GET",
      "POST",
      "PUT",
      "HEAD"
    ],
    "correcta": 2,
    "explicacion": "Un método es seguro si no altera el estado del servidor (GET, HEAD). Un método es idempotente si ejecutarlo múltiples veces produce exactamente el mismo efecto que ejecutarlo una sola vez. PUT modifica o reemplaza un recurso (no es seguro), pero enviarlo repetidamente con la misma carga deja el recurso en idéntico estado (es idempotente), a diferencia de POST."
  },
  {
    "id": 26,
    "modulo": "Ciberseguridad y Criptografía",
    "texto": "¿En qué consiste una vulnerabilidad de Inyección SQL (SQL Injection)?",
    "alternativas": [
      "Saturar el ancho de banda de un servidor de bases de datos mediante peticiones ping masivas.",
      "Insertar fragmentos de código SQL malicioso a través de entradas de usuario no sanitizadas para alterar la consulta original ejecutada por el motor.",
      "Descifrar contraseñas almacenadas mediante ataques de fuerza bruta sobre archivos de respaldo.",
      "Interceptar el tráfico entre el cliente y el servidor modificando los certificados TLS."
    ],
    "correcta": 1,
    "explicacion": "Ocurre cuando una aplicación concatena directamente entradas externas en una cadena de consulta SQL en lugar de usar consultas parametrizadas (prepared statements), permitiendo que el atacante manipule la estructura lógica de la instrucción."
  },
  {
    "id": 27,
    "modulo": "Ciberseguridad y Criptografía",
    "texto": "¿Cuál es la diferencia fundamental entre cifrado simétrico y cifrado asimétrico?",
    "alternativas": [
      "El cifrado simétrico usa la misma clave para cifrar y descifrar; el asimétrico utiliza un par de claves matemáticamente vinculadas (pública y privada).",
      "El cifrado asimétrico es mucho más rápido y se usa para cifrar discos duros completos.",
      "El cifrado simétrico no puede ser descifrado nunca, funcionando igual que una función hash.",
      "El cifrado asimétrico fue reemplazado completamente por algoritmos simétricos como RSA y ECC."
    ],
    "correcta": 0,
    "explicacion": "Algoritmos simétricos (como AES) emplean una única clave secreta compartida para ambos procesos. Los asimétricos (como RSA o ECC) utilizan una clave pública para cifrar (o verificar firmas) y una clave privada exclusiva para descifrar (o firmar)."
  },
  {
    "id": 28,
    "modulo": "Ciberseguridad y Criptografía",
    "texto": "¿Por qué las contraseñas de usuarios deben almacenarse aplicando una función hash criptográfica con salt en lugar de cifrarlas o aplicar solo un hash simple?",
    "alternativas": [
      "Porque el salt permite recuperar la contraseña original en texto plano si el usuario la olvida.",
      "Porque el hash impide revertir la contraseña y el salt aleatorio único neutraliza los ataques con tablas arcoíris (rainbow tables) y detecta contraseñas idénticas.",
      "Porque las funciones hash comprimen la base de datos reduciendo su tamaño en un 90%.",
      "Porque las leyes internacionales prohíben el uso de algoritmos de cifrado en bases de datos web."
    ],
    "correcta": 1,
    "explicacion": "Las funciones hash son unidireccionales (no reversibles). Agregar un valor aleatorio único (salt) por usuario antes de calcular el hash garantiza que dos usuarios con la misma contraseña generen resúmenes completamente distintos, invalidando diccionarios precalculados."
  },
  {
    "id": 29,
    "modulo": "Ciberseguridad y Criptografía",
    "texto": "¿Qué propiedad de seguridad garantiza una firma digital válida aplicada sobre un documento electrónico?",
    "alternativas": [
      "Confidencialidad exclusivamente.",
      "Autenticidad, integridad y no repudio.",
      "Disponibilidad frente a ataques de denegación de servicio (DDoS).",
      "Anonimato total del remitente frente a cualquier auditoría."
    ],
    "correcta": 1,
    "explicacion": "Al cifrar el hash del documento con la clave privada del emisor, cualquier receptor puede verificar con la clave pública que el mensaje proviene realmente del emisor (autenticidad), que no fue alterado en tránsito (integridad) y que el firmante no puede negar su autoría (no repudio)."
  },
  {
    "id": 30,
    "modulo": "Ciberseguridad y Criptografía",
    "texto": "¿Qué principio de seguridad informática dicta que un usuario o proceso debe recibir únicamente los permisos estrictamente indispensables para cumplir su función?",
    "alternativas": [
      "Seguridad por oscuridad (Security through obscurity).",
      "Principio de mínimo privilegio (Principle of Least Privilege).",
      "Defensa en profundidad (Defense in Depth).",
      "Confianza cero (Zero Trust)."
    ],
    "correcta": 1,
    "explicacion": "El principio de mínimo privilegio limita la superficie de ataque y el radio de impacto (blast radius): si una cuenta o servicio resulta comprometido, el atacante solo heredará los permisos mínimos asignados a dicha entidad en lugar de obtener control administrativo total."
  }
];

export default PREGUNTAS;
