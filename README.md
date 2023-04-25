# TASK-CLI

## Configuración del proyecto

1. Crear archivo <mock.db> en la raiz del proyecto

2. Crear archivo <schema.sqlite3> con las tablas que se utilizan

3. Crear las tablas de la base de datos con el siguiente comando

    ```
    node src/command.js config
    ```

4. Ejecutar el siguiente comando para ver las opciones
    ```
    node src/command.js -h
    ```

## Inicio de la interfaz principal en desarrollo
```
node src/command.js interface
```
## Instalación

```
npm link
```

## Eliminar cli

```
npm unlik taskcli
```