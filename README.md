Инициализация проекта (пустая папка)
yarn init -> появляется package.json

Установка express
yarn add express -> установка в dependencies (package.json)

Поднять сервер
node index.ts

Watcher (nodemon) - устанавливаем локально в devdependencies (package.json)
yarn add nodemon -D

typeScript
yarn add typescript ts-node @types/express @types/node -D

Инициализируем настройки компилятора
yarn tsc --init
yarn tsc -w (в режиме watcher)

!NB Все локальные пакеты запускаем при помощи yarn
nodemon - yarn nodemon index.ts (поднимаем сервер при помощи вотчера)
debug - yarn nodemon --inspect index.ts (поднимаем сервер при помощи вотчера флаг --inspect включает режим debug)

Установка jest и supertest
yarn add jest ts-jest @types/jest supertest @types/supertest
Добавляем конфиг для jest
yarn ts-jest config:init
