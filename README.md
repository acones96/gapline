# Creación de una extensión para Visual Studio Code
## Objetivo
Se desea practicar la programación en JavaScript (y conocer de paso TypeScript) y aplicarlo de manera novedosa.  De manera paralela, vamos a trabajar con otras tecnologías modernas muy usadas hoy en día en el desarrollo web, tales como generadores y gestores de paquetes.
## Introducción
En este ejercicio proponemos crear una extensión para el conocidísimo editor de texto de Microsoft:  Visual Studio Code.  Esta extensión va a hacer una cosa muy sencilla: insertar una línea en blanco cada N líneas.
Veremos detalladamente la instalación y configuración de las aplicaciones y componentes para la creación y ejecución de una extensión Visual Studio Code.
* _**VS Code**_ es un editor de código fuente desarrollado por Microsoft para Windows, Linux, macOS y Web.
* _**Node.Js**_ es un motor JavaScript para el servidor. Se está convirtiendo poco a poco en la tecnología de servidor por excelencia.
* _**TypeScript**_ es un lenguaje basado sobre JavaScript (un superset) y desarrollado también por Microsoft (al igual que Visual Studio Code). Se parece enormemente a JavaScript, ya que solo añade lo justo para que JavaScript sea un lenguaje más seguro.
* _**Yeoman**_ es una aplicación para generar el esqueleto inicial de un proyecto web. Utiliza a su vez generadores para cada tipo de proyecto (web estáticas, páginas que usen jQuery, programas basados en Node, etc.). Yeoman está escrito, a su vez, en JavaScript.
* _**Generator-code**_ es uno de estos generadores para Yeoman y sirve para comenzar el desarrollo de una extensión para Visual Studio Code.

## Instalación

### Visual Studio Code
La instalación de este software resulta sencilla. Únicamente tendremos que acceder al URL https://code.visualstudio.com/#alt-downloads, seleccionar el instalador que requerimos y, una vez terminada su descarga, ejecutaremos su instalador.

### Node.js
Igual que con la instalación de VS Code, únicamente tendremos que acceder al URL https://nodejs.org/en/download/current/, seleccionar el instalador que requerimos y, una vez terminada su descarga, ejecutaremos su instalador.
Podemos comprobar si su instalación se realizo de manera correcta al abrir consola o la terminal de VS Code y escribir el comando ``node``.

### Paquetes npm
Se requerirá el uso de dos paquetes npm 
1. **Yeoman**
Esta paqueteria nos ayuda a poner en marcha nuevos proyectos web proporcionando un ecosistema de generadores para cada tipo de proyectos (web estáticas, paginas que usen jQuery, programas basados en Node). Un generador es un plugin que puede ser ejecutado con el comando ``yo`` para armar proyectos.
2. **Generator-Code**
El generador de Yeoman nos guiara a través de los pasos necesarios para crear nuestra personalización o extensión solicitando la información requerida.

Para poder instalar ambos paguetes, escribiremos en a terminal el comando ``npm install-g yo generator-code typescript``

## Desarrollo
Para la creación del témplate de la nueva extensión utilizaremos el comando ``yo code`` que ejecutara el generador de extensiones para VS Code y aplicaremos la configuración requerida.

Se sustituirá el contenido del archivo _extensión.ts_ por el siguiente código que es referente al funcionamiento de la extensión que queremos utilizar

```typescript
'use strict';

import * as vscode from 'vscode';

export function activate(context: vscode.ExtensionContext) {
    let disposable = vscode.commands.registerCommand('extension.gapline', () => {
        var editor = vscode.window.activeTextEditor;
        if (!editor) { return; }
        var selection = editor.selection;
        var text = editor.document.getText(selection);
        vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {
            let numberOfLines = +value;
            var textInChunks: Array<string> = [];
            text.split('\n').forEach((currentLine: string, lineIndex) => {
                textInChunks.push(currentLine);
                if ((lineIndex+1) % numberOfLines === 0) textInChunks.push('');
            });
            text = textInChunks.join('\n');
            editor.edit((editBuilder) => {
                var range = new vscode.Range(
                    selection.start.line, 0, 
                    selection.end.line,
                    editor.document.lineAt(selection.end.line).text.length
                );
                editBuilder.replace(range, text);
            });
        })
    });
    context.subscriptions.push(disposable);
}
export function deactivate() { }
```

Así como se deberá de cambiar en el archivo _tsconfig.json_ el valor del _‘strict’_ 

## Resultados
Para poder ejecutar el codigo, deberemos seguir los siguientes pasos: 
1. Presionar la tecla F5 o iniciar depuracion a traves del menu run.
2. Tras abrir la ventana con la extension precargada, abriremos un fichero de texto, seleccionaremos su contenido y pulsaremos Ctrl + Shift + P e introduciremos el nombre de la extension (``Line Gapper``)
3. Al ubicar la extension, nos solicitara cada cuantas lineas querremos inssertar la linea en blanco.
4. Nos devolvera el resultado sobre el texto seleccionado
