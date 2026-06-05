import { mc, ms, tf, withTopic } from '../builder';

// Banco TEÓRICO (a mano) — Comunicaciones y Redes.
// Preguntas de razonamiento: escenarios, "cuál es la INCORRECTA",
// selección múltiple con varias opciones plausibles, comparaciones finas.
export const redesTheory = withTopic('redes_comunicaciones', [
  mc('red-t-001', 'Seguridad/DMZ', 3,
    'Una empresa debe publicar su servidor web y su servidor de correo en Internet, pero quiere que, si los comprometen, el atacante NO llegue directo a la LAN interna. ¿Qué arquitectura conviene?',
    [
      'Alojarlos en una DMZ ubicada entre un firewall externo y uno interno',
      'Alojarlos en la LAN interna, detrás del único firewall',
      'Publicarlos con la IP pública del router, sin firewall de por medio',
      'Alojarlos en una VLAN dentro de la misma LAN interna',
    ], 0,
    'La DMZ es una red perimetral entre Internet y la LAN. Si comprometen un servidor de la DMZ, el firewall interno todavía protege los datos de la LAN. Ponerlos en la LAN expondría la red interna.'),

  mc('red-t-002', 'TCP/UDP', 3,
    '¿Cuál de las siguientes afirmaciones sobre TCP y UDP es INCORRECTA?',
    [
      'TCP es orientado a conexión y retransmite los segmentos que se pierden',
      'UDP no garantiza orden ni entrega, pero tiene menos overhead que TCP',
      'UDP establece una conexión con saludo (handshake) antes de enviar datos',
      'TCP realiza control de flujo y de congestión',
    ], 2,
    'UDP NO establece conexión ni handshake: envía datagramas sin garantías (por eso es liviano y rápido). El saludo de tres vías es propio de TCP.'),

  mc('red-t-003', 'Modelo OSI', 3,
    'Un dato baja desde la capa de Aplicación hasta la Física. ¿En qué orden se van formando las PDU (encapsulamiento)?',
    [
      'Segmento → Paquete → Trama → Bits',
      'Paquete → Segmento → Trama → Bits',
      'Trama → Paquete → Segmento → Bits',
      'Segmento → Trama → Paquete → Bits',
    ], 0,
    'Transporte forma el segmento, Red el paquete, Enlace la trama y Física los bits. Cada capa agrega su cabecera a la PDU de la capa superior.'),

  ms('red-t-004', 'Dispositivos', 3,
    'Seleccioná TODAS las funciones que son propias de un router (capa 3):',
    [
      'Enruta paquetes entre redes distintas según la IP de destino',
      'Separa dominios de broadcast: cada interfaz delimita una red distinta',
      'Realiza NAT para que la LAN salga a Internet con una IP pública',
      'Conmuta tramas dentro de la misma LAN usando direcciones MAC',
      'Repite la señal a todos sus puertos formando un único dominio de colisión',
      'No puede interconectar redes con distinto direccionamiento IP',
    ], [0, 1, 2],
    'El router opera en capa 3: enruta por IP, separa dominios de broadcast y suele hacer NAT. Conmutar por MAC es tarea del switch (capa 2); repetir a todos los puertos es el hub (capa 1).'),

  tf('red-t-005', 'Direccionamiento', 3,
    'Dos hosts que están en la misma subred IP pueden comunicarse directamente por la LAN, sin que su tráfico tenga que pasar por el gateway predeterminado.',
    true,
    'Verdadero. El gateway (router) solo se usa para salir hacia otras redes. Dentro de la misma subred, los hosts se comunican directamente (resolviendo la MAC por ARP).'),

  mc('red-t-006', 'Direccionamiento', 3,
    'El host 192.168.1.70 usa la máscara 255.255.255.192 (/26). ¿A qué dirección de red pertenece y cuál es su broadcast?',
    [
      'Red 192.168.1.64 — broadcast 192.168.1.127',
      'Red 192.168.1.0 — broadcast 192.168.1.63',
      'Red 192.168.1.64 — broadcast 192.168.1.128',
      'Red 192.168.1.70 — broadcast 192.168.1.127',
    ], 0,
    '/26 crea bloques de 64 direcciones: 0–63, 64–127, 128–191… El .70 cae en el bloque 64–127, cuya red es .64 y su broadcast es .127.'),

  mc('red-t-007', 'Dispositivos', 3,
    'Reemplazás un hub por un switch en una LAN. ¿Cuál es la mejora principal y por qué?',
    [
      'Cada puerto pasa a ser su propio dominio de colisión, reduciendo las colisiones',
      'Aumenta el dominio de broadcast, acelerando toda la red',
      'Elimina la necesidad de usar direcciones MAC',
      'Convierte automáticamente la red en capa 3',
    ], 0,
    'El hub comparte un único dominio de colisión (repite a todos los puertos). El switch segmenta: cada puerto es un dominio de colisión y reenvía la trama solo al destino según la MAC.'),

  ms('red-t-008', 'Seguridad/DMZ', 3,
    'Marcá TODAS las afirmaciones correctas sobre una DMZ (zona desmilitarizada):',
    [
      'Es una red perimetral ubicada entre Internet y la LAN interna',
      'Aloja servicios públicos como web, correo o DNS',
      'Idealmente se ubica entre dos firewalls (uno externo y uno interno)',
      'Si comprometen un host de la DMZ, el firewall interno todavía protege la LAN',
      'Forma parte de la LAN interna y comparte su mismo nivel de seguridad',
      'Hace innecesario el uso de firewalls',
    ], [0, 1, 2, 3],
    'La DMZ es un buffer entre Internet y la LAN, con servicios públicos, idealmente entre dos firewalls. Justamente NO comparte la seguridad de la LAN ni reemplaza al firewall: depende de ellos.'),

  tf('red-t-009', 'Seguridad/DMZ', 2,
    'NAT permite que varios equipos con IP privada compartan una única IP pública para salir a Internet, lo que además ayuda a mitigar el agotamiento de direcciones IPv4.',
    true,
    'Verdadero. NAT traduce las IP privadas a una IP pública compartida; por eso ahorra direcciones IPv4 públicas además de ocultar la red interna.'),

  mc('red-t-010', 'Seguridad/DMZ', 3,
    '¿Por qué una VPN site-to-site permite unir dos sedes de forma segura a través de Internet?',
    [
      'Crea un túnel cifrado sobre la red pública, como si ambas sedes fueran una misma LAN',
      'Asigna direcciones IP públicas a todos los hosts de ambas sedes',
      'Reemplaza el router de cada sede por un switch de capa 3',
      'Convierte todo el tráfico en UDP para que viaje más rápido',
    ], 0,
    'La VPN encapsula y cifra el tráfico en un túnel sobre Internet, conectando las redes privadas de ambas sedes de forma segura, sin exponer los datos.'),

  mc('red-t-011', 'Conmutación', 3,
    'MPLS (Multiprotocol Label Switching) agiliza el reenvío de paquetes porque…',
    [
      'Conmuta usando etiquetas (labels) en lugar de consultar la IP de destino en cada salto',
      'Reenvía usando direcciones MAC dentro de todo el backbone',
      'Decide la ruta según el número de puerto TCP',
      'Usa la máscara de subred del destino para conmutar',
    ], 0,
    'MPLS antepone etiquetas a los paquetes y los reenvía por esas etiquetas, evitando el análisis de la IP en cada router. Permite ingeniería de tráfico y VPNs.'),

  mc('red-t-012', 'Modelo OSI', 3,
    '¿Cuál de estas asociaciones capa–dispositivo–PDU es INCORRECTA?',
    [
      'Capa 2 (Enlace) – switch – trama',
      'Capa 3 (Red) – router – paquete',
      'Capa 1 (Física) – hub – bits',
      'Capa 4 (Transporte) – switch – segmento',
    ], 3,
    'El switch opera en capa 2 (tramas), no en capa 4. La capa de Transporte (segmentos) la manejan los hosts mediante TCP/UDP, no un switch.'),

  ms('red-t-013', 'Servicios', 3,
    'Seleccioná TODOS los protocolos que pertenecen a la capa de Aplicación:',
    [
      'HTTP / HTTPS',
      'DNS (resolución de nombres a IP)',
      'DHCP (asignación dinámica de direcciones)',
      'FTP (transferencia de archivos)',
      'ARP (resuelve IP↔MAC en la capa de enlace)',
      'IP (enrutamiento de paquetes en la capa de red)',
    ], [0, 1, 2, 3],
    'HTTP, DNS, DHCP y FTP son protocolos de aplicación. ARP trabaja en la capa de enlace/red (resuelve direcciones) e IP es el protocolo de la capa de red.'),

  tf('red-t-014', 'Dispositivos', 3,
    'Un switch de capa 2 separa dominios de colisión (uno por puerto) pero NO separa dominios de broadcast: un broadcast llega a todos los puertos de la misma VLAN.',
    true,
    'Verdadero. El switch crea un dominio de colisión por puerto, pero todos comparten el mismo dominio de broadcast (salvo que se definan VLANs). Para separar broadcast se necesita un router o VLANs.'),

  mc('red-t-015', 'Servicios', 2,
    'Un servidor publica un sitio por HTTPS. ¿Qué combinación capa de transporte–puerto es la correcta?',
    [
      'TCP, puerto 443',
      'UDP, puerto 443',
      'TCP, puerto 80',
      'UDP, puerto 53',
    ], 0,
    'HTTPS es HTTP sobre TLS y usa TCP en el puerto 443. El 80 es HTTP sin cifrar y el 53 (UDP) es DNS.'),

  mc('red-t-016', 'Servicios', 3,
    'Una PC nueva se conecta y obtiene IP automáticamente, pero no puede abrir sitios por nombre (sí por IP). ¿Qué servicio funciona y cuál falla?',
    [
      'DHCP funciona (le asignó IP); DNS falla (no resuelve nombres)',
      'DNS funciona; DHCP falla',
      'ARP funciona; NAT falla',
      'Ambos son el mismo servicio, así que fallan juntos',
    ], 0,
    'Si obtuvo IP automáticamente, DHCP funcionó. Que abra por IP pero no por nombre indica que la resolución de nombres (DNS) es la que falla.'),

  ms('red-t-017', 'Medios', 2,
    'Marcá TODAS las ventajas reales de la fibra óptica frente al cable de cobre (UTP):',
    [
      'Es inmune a la interferencia electromagnética',
      'Soporta mayor ancho de banda',
      'Alcanza mayores distancias sin repetidores',
      'Es más barata y más fácil de instalar que el cobre',
      'Transmite electricidad además de datos',
      'No necesita conversores óptico-eléctricos en los extremos',
    ], [0, 1, 2],
    'La fibra usa luz: inmune a interferencia, más ancho de banda y mayor alcance. Pero es más cara y delicada de instalar, no transmite electricidad y SÍ requiere conversores en los extremos.'),

  tf('red-t-018', 'Conmutación', 2,
    'En la conmutación de paquetes, distintos paquetes de un mismo mensaje pueden seguir rutas diferentes y llegar desordenados, reensamblándose en el destino.',
    true,
    'Verdadero. Cada paquete se enruta de forma independiente (a diferencia de la conmutación de circuitos), por eso pueden tomar rutas distintas y reordenarse al llegar.'),

  mc('red-t-019', 'Dispositivos', 3,
    'Tenés un switch de 24 puertos sin VLANs configuradas. ¿Cuántos dominios de broadcast y de colisión hay?',
    [
      '1 dominio de broadcast y 24 de colisión',
      '24 dominios de broadcast y 1 de colisión',
      '1 de broadcast y 1 de colisión',
      '24 de broadcast y 24 de colisión',
    ], 0,
    'Sin VLANs, todo el switch es un único dominio de broadcast. Pero cada puerto es un dominio de colisión independiente: 1 broadcast, 24 colisión.'),

  mc('red-t-020', 'Direccionamiento', 3,
    '¿Cuál de estas direcciones NO es privada (RFC 1918)?',
    [
      '172.32.5.4',
      '10.10.10.10',
      '172.16.5.4',
      '192.168.100.1',
    ], 0,
    'Los rangos privados son 10.0.0.0/8, 172.16.0.0–172.31.255.255 y 192.168.0.0/16. 172.32.5.4 queda FUERA del rango 172.16–172.31, por lo tanto es pública.'),

  ms('red-t-021', 'Seguridad/DMZ', 3,
    'Seleccioná TODAS las afirmaciones correctas sobre un firewall:',
    [
      'Filtra el tráfico según reglas de IP, puerto y protocolo',
      'Suele ubicarse entre el router y el switch',
      'Puede ser "stateful": recuerda el estado de las conexiones activas',
      'Cifra por defecto todo el tráfico de la red',
      'Reemplaza al antivirus de cada host',
      'Opera únicamente en la capa física',
    ], [0, 1, 2],
    'El firewall filtra por reglas, se ubica en el perímetro y puede ser stateful. No cifra el tráfico (eso es VPN/TLS), no reemplaza al antivirus y trabaja en varias capas, no solo en la física.'),

  tf('red-t-022', 'Direccionamiento', 3,
    'Una máscara /30 deja solo 2 direcciones utilizables, por eso es ideal para enlaces punto a punto entre dos routers.',
    true,
    'Verdadero. /30 tiene 4 direcciones: red, broadcast y 2 utilizables. Justo alcanzan para los dos extremos de un enlace punto a punto, sin desperdiciar IPs.'),

  mc('red-t-023', 'Servicios', 3,
    '¿Cuál es la función de ARP y en qué ámbito opera?',
    [
      'Traduce una dirección IP a su dirección MAC dentro de la misma red local',
      'Traduce un nombre de dominio a una IP en Internet',
      'Asigna direcciones IP dinámicas a los hosts',
      'Enruta paquetes entre subredes distintas',
    ], 0,
    'ARP resuelve IP→MAC en la LAN para poder armar la trama. Traducir nombre→IP es DNS; asignar IP es DHCP; enrutar entre subredes es el router.'),

  mc('red-t-024', 'Dispositivos', 3,
    '¿Cuál afirmación sobre el comportamiento de un switch es INCORRECTA?',
    [
      'Aprende las direcciones MAC de origen y las guarda en una tabla',
      'Si conoce la MAC destino, reenvía la trama solo a ese puerto',
      'Si NO conoce la MAC destino, descarta la trama',
      'Cada puerto constituye un dominio de colisión separado',
    ], 2,
    'Si el switch no conoce la MAC destino hace "flooding": reenvía la trama por todos los puertos menos el de origen (no la descarta). Así aprende y entrega.'),

  tf('red-t-025', 'TCP/UDP', 2,
    'TCP utiliza un saludo de tres vías (SYN, SYN-ACK, ACK) para establecer la conexión antes de transmitir datos.',
    true,
    'Verdadero. Ese three-way handshake sincroniza los números de secuencia y confirma que ambos extremos están listos antes de enviar datos.'),

  ms('red-t-026', 'Direccionamiento', 3,
    'Seleccioná TODAS las afirmaciones correctas al comparar IPv4 con IPv6:',
    [
      'IPv4 usa direcciones de 32 bits',
      'IPv6 usa direcciones de 128 bits',
      'IPv6 amplía enormemente el espacio de direcciones disponible',
      'NAT surgió en parte como respuesta al agotamiento de IPv4',
      'IPv6 usa direcciones de 64 bits',
      'IPv4 ofrece más direcciones que IPv6',
    ], [0, 1, 2, 3],
    'IPv4 = 32 bits, IPv6 = 128 bits (muchísimas más direcciones). NAT ayudó a paliar el agotamiento de IPv4. Las dos últimas son falsas (IPv6 es de 128 bits y tiene muchas más direcciones).'),

  mc('red-t-027', 'Direccionamiento', 3,
    'Dos PCs están conectadas a switches distintos que llegan al mismo router, pero en subredes diferentes. Para que se comuniquen entre sí…',
    [
      'El tráfico debe pasar por el router, que enruta entre ambas subredes',
      'Se comunican directamente por MAC, sin intervención del router',
      'Deben estar en el mismo dominio de colisión',
      'Es imposible comunicarlas si usan switches distintos',
    ], 0,
    'Al estar en subredes diferentes, la comunicación es "inter-red": cada host envía al gateway y el router enruta entre las subredes. La MAC solo sirve dentro de la misma subred.'),

  ms('red-t-028', 'Modelo OSI', 3,
    'Marcá TODAS las afirmaciones correctas sobre el encapsulamiento y las capas:',
    [
      'Cada capa agrega su propia cabecera a los datos que recibe de la capa superior',
      'En el receptor se desencapsula en orden inverso (de Física hacia Aplicación)',
      'El router trabaja con paquetes (capa 3) y el switch con tramas (capa 2)',
      'La capa Física transmite bits como señales por el medio',
      'El switch reordena los segmentos TCP perdidos',
      'La capa de Aplicación se encarga del direccionamiento IP',
    ], [0, 1, 2, 3],
    'El encapsulamiento agrega cabeceras al bajar y se deshace al subir en el receptor. Router=paquetes, switch=tramas, Física=bits. Reordenar segmentos es tarea de TCP (host), y el direccionamiento IP es de la capa de Red, no de Aplicación.'),
]);
