# Lampa Clean

Lightweight preroll blocker for Lampa.

**Текущая версия:** 1.0.0

Lampa Clean пропускает preroll-рекламу перед запуском видео и сразу передаёт управление плееру. Плагин не изменяет источник фильма и не предоставляет контент — он работает только с рекламным механизмом интерфейса Lampa.

## Установка

Добавьте в Lampa основной URL:

`https://cdn.jsdelivr.net/gh/Saffy96/lampa---clean@main/c.js`

Путь в Lampa:

`Настройки → Расширения → Добавить плагин`

После добавления проверка должна показать `200`.

### Резервный URL

Если CDN временно недоступен:

`https://saffy96.github.io/lampa---clean/c.js`

На некоторых устройствах или у некоторых провайдеров `github.io` может быть недоступен, поэтому jsDelivr используется как основной способ установки.

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

Основной URL использует ветку `main`, поэтому совместимые обновления публикуются по тому же адресу без необходимости менять ссылку в Lampa. CDN может кэшировать изменения, поэтому обновление может появляться не мгновенно.

История изменений: [CHANGELOG.md](CHANGELOG.md)

## English

**Lampa Clean** is a lightweight plugin that skips Lampa's built-in preroll before normal video playback. It does not provide movies, streams, or content sources.

Primary install URL:

`https://cdn.jsdelivr.net/gh/Saffy96/lampa---clean@main/c.js`

Fallback URL:

`https://saffy96.github.io/lampa---clean/c.js`

Open Lampa → Settings → Extensions → Add plugin, paste the primary URL and restart Lampa if needed.

## License

MIT License. See [LICENSE](LICENSE).

## Disclaimer

This is an independent community project and is not affiliated with the Lampa developers.
