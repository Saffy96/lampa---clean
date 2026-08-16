# Lampa Clean

Lightweight preroll blocker for Lampa.

**Текущая версия:** 1.0.0

Lampa Clean пропускает preroll-рекламу перед запуском видео и сразу передаёт управление плееру. Плагин не изменяет источник фильма и не предоставляет контент — он работает только с рекламным механизмом интерфейса Lampa.

## Установка

Добавьте в Lampa постоянную ссылку:

`https://saffy96.github.io/lampa---clean/plugin.js`

Путь в Lampa:

`Настройки → Расширения → Добавить плагин`

После добавления проверка должна показать `200`.

## Как это работает

Lampa Clean подписывается на событие создания плеера через `Lampa.Player.listener`, временно помечает запуск как тип, для которого встроенный preroll не показывается, а затем сразу восстанавливает исходные данные плеера.

Дополнительно плагин скрывает резервные элементы preroll-интерфейса, если они всё же успели появиться.

## Что блокируется

- встроенный preroll Lampa перед воспроизведением;
- экран ожидания рекламы;
- рекламный video-block, если он успел создаться.

## Что не блокируется

Lampa Clean не гарантирует блокировку рекламы, которая встроена непосредственно в видеопоток или реализована сторонним онлайн-плагином независимо от рекламного механизма Lampa.

## Обновления

Используйте постоянный URL `plugin.js`. Новые совместимые версии можно публиковать по этому адресу без необходимости менять ссылку в Lampa.

История изменений: [CHANGELOG.md](CHANGELOG.md)

## English

**Lampa Clean** is a lightweight plugin that skips Lampa's built-in preroll before normal video playback. It does not provide movies, streams, or content sources.

Install URL:

`https://saffy96.github.io/lampa---clean/plugin.js`

Open Lampa → Settings → Extensions → Add plugin, paste the URL and restart Lampa if needed.

## License

MIT License. See [LICENSE](LICENSE).

## Disclaimer

This is an independent community project and is not affiliated with the Lampa developers.
