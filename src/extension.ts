// Utiliza el modo estricto de JavaScript
'use strict';

// Importa el modulo de referencia y lo referencia con el alias vscode
import * as vscode from 'vscode';

// Este metodo es llamado cuando la extension es activada
export function activate(context: vscode.ExtensionContext) {
    // Nombre del parametro debe ser igual al nombre de comando del archivo package.json
    let disposable = vscode.commands.registerCommand('gapline.lineGapper', () => {
        // Obtiene el editor activo en VS Code
        var editor = vscode.window.activeTextEditor;

        // En caso de no encontrar ningun editor, simplemente retornara
        if (!editor) { return; }

        // Selecciona el texto del editor activo
        var selection = editor.selection;
        var text = editor.document.getText(selection);

        // Visualiza un cuadro para solicitarnos el numero de lineas donde se insertara la linea en blanco
        vscode.window.showInputBox({ prompt: 'Lineas?' }).then(value => {

            // Asigna el valor que ingresamos a la variable 'numerOfLines'
            let numberOfLines = +value;
            // Crea un nuevo array
            var textInChunks: Array<string> = [];
            // Divide el texto a partir de cada salto de linea en un array
            text.split('\n').forEach((currentLine: string, lineIndex) => {
                // Agrega la linea actual al array 'textInChunks'
                textInChunks.push(currentLine);
                // Verifica si el numero de linea no deja residuo en su division, si es asi, ingresa un texto vacio al array
                if ((lineIndex + 1) % numberOfLines === 0) { textInChunks.push(''); }
            });

            // Une el array con un salto de linea de diferencia
            text = textInChunks.join('\n');

            // Utiliza la funcion para editar el texto seleccionado
            editor.edit((editBuilder) => {
                // Toma un rango del parametro seleccionado
                var range = new vscode.Range(
                    // Toma la linea y columna inicial
                    selection.start.line, 0,
                    // Toma la linea final
                    selection.end.line,
                    // Toma la columna final
                    editor.document.lineAt(selection.end.line).text.length
                );
                // Reemplaza el texto seleccionado con el array que se unio
                editBuilder.replace(range, text);
            });
        });
    });

    // Elimina, por decirlo de una forma, los archivos temporales al cerrar la extension
    context.subscriptions.push(disposable);
}

// Este metodo se usa cuando se desactiva la extension
export function deactivate() { }
