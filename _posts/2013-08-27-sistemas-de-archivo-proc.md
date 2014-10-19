---
layout: post
title: "Sistema de archivo /Proc"
description: Conociendo en sistema de archivos
cover: 2013-08-27-sistemas-de-archivo-proc.jpg
comments: true
categories:
- linux
tags:
- proc
---
Esta es una serie de posts que iré escribiendo sobre el temario para obtener la certificación del Instituto profesional del Linux (LPIC), basados en los objetivos descritos en su web, y que creo son los los mas adecuados para centrarse en obtener dicha certificación, no quiero ni espero que esto se tome como una guía, son mis notas lo que se y he aprendido, lo que he leído en libros, blogs, foros o cualquier otro lado o formato, y especialmente la documentación oficial y wikis de diversas distribuciones linux como Debian, RedHat, ArchLinux, etc…

En muchas ocasiones daré por echo que ya se tienen ciertos conocimientos sobre sistemas Linux arquitecturas de sistemas, o que creo ya se tienen que conocer, aunque si alguien tiene alguna duda solo tiene que preguntar y yo intentare indicarle o explicarle de le mejor manera que pueda como despejar esa duda.

Una vez instalado nuestro sistema linux debemos de saber que es lo que necesitamos o no, y como habilitar o deshabilitar cierto dispositivo, puerto, o modulo innecesario, por lo que es importante conocer las herramientas, utilidades o directorios y archivos que tenemos a nuestra disposición en cualquier sistema Linux.

Una de las mejores maneras de conocer nuestra sistema es gracias al directorio /proc, dentro de este directorio tenemos mucha información sobre nuestro sistema, podemos ver los procesos que actualmente se están ejecutando, o archivos y directorios con información sobre el estado de nuestro sistema y kernel, una cosa importante que debemos tener en cuenta es que el directorio /proc es un directorio virtual, su contenido no existe físicamente hasta que iniciamos nuestro sistema, por lo que también se considera a /proc, como un sistema de ficheros virtuales, otra de sus característica es que sus archivos pueden tener un tamaño de 0 bytes pero pueden contener mucha información, y si te fijas en su fecha y hora, veras que se refleja en tiempo real, otra característica es la agrupación y organización de archivos que contengan información sobre un tipo de dispositivos en un mismo directorio, como /proc/scsi por ejemplo.

Como podéis ver, encontramos directorios nombrados con el ID del proceso (PID) que se esta ejecutando, o archivos como cpuinfo, modules, dma, etc… estos archivos podemos visualizarlos para obtener información del sistema lanzando un simple #cat 'nombre_archivo', por ejemplo para obtener información sobre nuestra memoria haremos un #cat meminfo.

Como podéis imaginar sobre la mayoría de los archivos listados en /proc el proceso es el mismo, si quieres información sobre tu cpu #cat cpuinfo, sobre tu versión de linux #cat version o sobre la carga del sistema #cat loadavg, pero si te fijas bien en la salida de muchos de estos archivos, alguna de la información que muestran no la encontraras sentido, para eso disponemos de comandos como lspci, lsmod, free, o top entre otros muchos, que nos mostraran toda esta información de una manera mas clara, algunos de los archivos que  debemos conocer son los siguientes:

**/proc/devices** Muestra solo los dispositivos de caracteres y bloque cuyo modulo este cargado y configurado.

**/proc/dma** Muestra los canales de acceso directo a memoria DMA utilizados.

**/proc/fb** Muestra los dispositivos frame buffer.

**/proc/filesystems** Muestra los tipos de sistema de ficheros soportados por nuestro Kernel, los que no están montados comienzan con nodev.

**/proc/interrupts** Muestra el numero de interrupciones por IRQ , la primera columna muestra el numero de IRQ, la siguiente muestra el numero de interrupciones, la siguiente el tipo de interrupción y la ultima el nombre del dispositivo.

**/proc/ioports** Muestra información de los puertos de Entrada/Salida que se están utilizando.

**/proc/modules** Muestra todos los módulos cargados en el sistema, para una mejor lectura de este archivo se puede utilizar lsmod, el cual nos mostrara en varias columnas la información, la primera el nombre del modulo, la segunda el tamaño del modulo en bytes, la siguiente columna el numero de instancias que tienen cargado ese modulo y la cuarta muestra si el modulo depende de otro modulo para funcionar.

**/proc/mounts** Muestra los dispositivos montados en el sistema, también podemos utilizar mount para ver esta información.

**/proc/partitions** Muestra información sobre las particiones, los bloques asignados y sus nombres.

**/proc/swap** Muestra el tamaño y uso de memoria SWAP en nuestro sistema.

Como se puede ver la cantidad de información que podemos obtener con un simple cat, dentro de este directorio es mucha, pero aun queda mas que dejare para el siguiente post, en el cual tratare los directorios dentro de /proc como /proc/bus/, /proc/sys/ o /proc/net/ entre otros.
