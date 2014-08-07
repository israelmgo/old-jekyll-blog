---
layout: post
title:  "GoAccess Analiza en tiempo real logs"
date:   2013-04-24
header_image: "/images/headers/2013-04-24-GoAccess-Analiza-en-tiempo-real-logs.png"
categories: linux GoAccess
---

GoAccess , es una de esas herramientas que te pueden facilitar mucho el trabajo a la hora de analizar el trafico y estado de un servidor web, y lo mejor de todo desde la terminal.

Esta herramienta esta disponible en las tres ramas de Debian por lo que su instalación es muy simple, con un aptitude o apt-get goaccess podemos disponer de goaccess inmediatamente, también esta disponible para diferentes distribuciones Linux como RedHat, OpenSuse o ArchLinux entre otras, y opcionalmente podemos añadirle soporte para GeoIP o el formato de caracteres Unicode UTF-8.

GoAccess nos ofrece algunas características muy interesantes entre las que se encuentran:

    Estadísticas Generales y de ancho de banda.
    Top de visitas
    Estadisticas de archivos solicitados al servidor
    URLs de referencia
    Errores 404
    Sistemas Operativos de los visitantes
    Browser y Spiders
    Host, IP reverse, IP location
    Códigos de estado HTTP
    Palabras claves
    Soporte para IPv6
    Generar reportes en HTML

La utilización de Goaccess es muy simple como podemos ver un su Man Page y dispones de varias opciones a la hora de ejecutar GoAcces:

    -f Archivo de Entrada o ruta al archivo log
    -c Configurar el formato de salida del archivo (también se puede modificar el archivo ~/.goaccessrc)
    -e Excluir una IP del HOST.
    -a Habilitar una lista de Users-Agents para el host seleccionado

A Continuación os dejo algunos ejemplos de uso muy básicos, pero que con la utilización de pipes y añadiendo mas opciones podemos hacer mucho mas completo.

    Genera una salida interactiva de modo texto:

        # goacces -f <archivo.log> o <ruta del archivo>

    Generar una salida completa de estadísticas del archivo.log:

        # goaccess -f access.log -a

    Generar un archivo HTML:

        # goaccess -f access.log -a > archivo.html

Para obtener mas información, o descargar esta herramienta para compilarla tu mismo te recomiendo que visites la web del proyecto GoAcces
