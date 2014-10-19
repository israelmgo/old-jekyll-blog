---
layout: post
title: "Glances Monitorizacion de Sistemas"
description: Simple y elegante
cover: 2012-09-06-Glances-Monitorizacion-de-Sistemas.png
comments: true
categories:
- linux
tags:
- glances
---
Glances es un herramienta para la motorización de sistemas desde tu terminal, esta escrita en python y utiliza la librería PsUtil, su creador es Nicolas Hennion y para mi gusto ha conseguido una herramienta muy limpia.

Su instalación es muy sencilla y podemos hacerlo de diversas maneras, pero antes debemos tener instalado en nuestro sistema lo siguiente:

* Python 2.6+
* build-essential
* python-dev
* python-setuptools
* python-psutil 0.4.1+
* python-jinja2 2.0+

Si por alguna razón no dispones de alguno o de todos los paquetes, ya sabes, con un aptitude o apt-get nombre del paquete podemos instalarlo sin mayor complicación, si ya contamos con estos paquetes podemos descargar e instalar Glances desde http://nicolargo.github.com/glances/ o puedes añadirlo a tus repositorios.

		sudo add-apt-repository ppa:arnaud-hartmann/glances-stable
		sudo apt-get update

Y si decides descargar el archivo lo puedes instalar de la siguiente forma:

		sudo apt-get update
		sudo apt-get install python-setuptools build-essential python-dev
		tar zxvf glances-last.tgz
		cd nicolargo-glances-*
		sudo python setup.py install

Los usuarios de Debian en la rama SID (unstable) pueden instalarlo con un simple “aptitude install glances“

Una vez ejecutado podemos ver las opciones disponibles presionando la tecla “h” que nos mostrara la ayuda y diversas opciones de Glances

* ‘h’ Oculta o muestra la ayuda de Glances
* ‘a’ Glances en modo automático. Los procesos se muestran automáticamente
* ‘c’ Muestra los procesos por consumo de CPU
* ‘d’ Oculta o muestra disk IO stats
* ‘f’ Oculta o muestra  file system stats
* ‘l’ Oculta o muestra los logs
* ‘m’ Muestra los procesos por consumo de  memoria
* ‘n’ Oculta o muestra network interfaces stats
* ‘p’ Muestra los procesos alfabéticamente
* ‘q’ Sale de glances

Para que podamos prestar mayor o menor atención a los datos que se muestran, disponemos de un código de colores para facilitarnos su interpretación.

* VERDE: Estado “OK”
* AZUL: Estado “CUIDADO”
* MAGENTA: Estado “ALERTA”
* ROJO: Estado “CRITICO”

Como veis es una herramienta sencilla y que no tiene mayor complicación, en [http://nicolargo.github.com/glances/](http://nicolargo.github.com/glances/) podéis informaros un poco mas sobre Glances,  yo personalmente os la recomiendo, buena herramienta, limpia y muy detallada a la vez.
