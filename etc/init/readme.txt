Cómo instalar el script de inicio para Ubuntu:

1) Fichero emakers-api.conf

 - Editar el path de node.js, el path donde está la API y el usuario/grupo si hace falta
 - Copiar el script en /etc/init con permisos 422 y propietario root:root

2) Fichero ../sudoers/emakers-service

 - Editar el usuario si hace falta
 - Copiar en /etc/sudoers.d/ con permisos 440 y propietario root:root
 - Con esto el usuario no tiene que poner la contraseña de sudo para usar el comando service, de forma que cualquier script (como p.ej un hook de git) puede reiniciar la API.
 
3) Usar el servicio:

 $ sudo service {start | stop | restart}