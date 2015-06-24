Cómo instalar el script de inicio para CentOS:

1) Fichero emakers-api

 - Editar las variables de arriba si hace falta
 - Copiar el script en /etc/init.d/ con permisos 755 y propietario root:root

2) Añadir/quitar/listar el servicio en los runlevels:

 $ chkconfig --add emarkers-api
 
 $ chkconfig --del emarkers-api
 $ chkconfig --list emarkers-api
 
3) Usar el servicio:

 $ /etc/init.d/emakers-api {start | stop | restart | status}