import {Component} from './component';
import '../partials/addToPlaylistWidget.tmpl';
import '../partials/playlistRow.tmpl';
import {API} from 'utils/api';
import {CREATED, ENTER_KEYCODE} from 'utils/codes';

/**
 * Компонент "Добавить в плейлист"
 */
export class AddToPlaylistWidget extends Component {
    /**
     * Конструктор компонента
     * @param {Object} parent - родитель компонента
     * @param {Object} state - перечиление полей-состояний компонента
     */
    constructor(parent, state) {
        super(parent, state);
        // eslint-disable-next-line no-undef
        this.renderHBS = Handlebars.templates['addToPlaylistWidget.hbs'];
        // eslint-disable-next-line no-undef
        this.renderPlaylistRowHBS = Handlebars.templates['playlistRow.hbs'];
        this.createPlaylistClickedCallback = this.createPlaylistClicked.bind(this);
        this.createPlaylistCallback = this.createPlaylist.bind(this);
        this.enterPressedCallback = this.enterPressed.bind(this);
        this.removeCreationCallback = this.removeCreationForm.bind(this);
        this.checkboxClickedCallback = this.checkboxClicked.bind(this);
    }

    /**
     * HTML-код компонента
     * @return {string} - html-код
     */
    tmpl() {
        return this.renderHBS(this.state);
    }

    /**
     * Установить листенеры компоненту
     */
    setEventListeners() {
        document.getElementById('create-playlist-button')
            .addEventListener('click', this.createPlaylistClickedCallback);
        [...document.getElementsByClassName('add-to-playlist-widget__checkbox')]
            .forEach((el) => el.addEventListener('click', this.checkboxClickedCallback));
    }

    /**
     * Убрать листенеры компонента
     */
    removeEventListeners() {
        document.getElementById('create-playlist-button')
            .removeEventListener('click', this.createPlaylistClickedCallback);
        [...document.getElementsByClassName('add-to-playlist-widget__checkbox')]
            .forEach((el) => el.removeEventListener('click', this.checkboxClickedCallback));
        // если была нажата кнопка "Создать плейлист"
        if (document.getElementById('submit-create-playlist')) {
            this.removeCreationForm();
        }
    }

    /**
     * Обработка нажатия на кнопку "Создать плейлист"
     */
    createPlaylistClicked() {
        document.getElementById('create-playlist-container')
            .classList.remove('create-playlist-container_hidden');
        document.getElementById('submit-create-playlist')
            .addEventListener('click', this.createPlaylistCallback);
        document.getElementById('input-create-playlist')
            .addEventListener('keyup', this.enterPressedCallback);
        document.getElementById('cancel-create-playlist')
            .addEventListener('click', this.removeCreationCallback);
    }

    /**
     * Убрать форму создания плейлиста
     */
    removeCreationForm() {
        document.getElementById('create-playlist-container')
            .classList.add('create-playlist-container_hidden');
        document.getElementById('submit-create-playlist')
            .removeEventListener('click', this.createPlaylistCallback);
        document.getElementById('input-create-playlist')
            .removeEventListener('keyup', this.enterPressedCallback);
        document.getElementById('cancel-create-playlist')
            .removeEventListener('click', this.removeCreationCallback);
    }

    /**
     * Отобразить созданный плейлист в списке
     */
    createPlaylist() {
        const playlistName = document.getElementById('input-create-playlist').value;
        API.createPlaylist(playlistName).then((res) => this.processCreate(res.status === CREATED, playlistName));
    }

    /**
     * Отображение результата создания плейлиста
     * @param {boolean} status - успешность запроса
     * @param {string} playlistName - имя созданного плейлиста
     */
    processCreate(status, playlistName) {
        const playlists = document.getElementById('playlists-list');
        const newId = playlists.childElementCount + 1;
        playlists.insertAdjacentHTML('beforeend', this.renderPlaylistRowHBS({
            id: newId,
            playlist_name: playlistName,
            is_added: false,
            movieId: this.state.movieId,
        }));
        const newCheckbox = document.getElementById(`checkbox-${newId}`);
        newCheckbox.addEventListener('click', this.checkboxClickedCallback);
        document.getElementById('no-playlists-message')?.remove();
        document.getElementById('input-create-playlist').value = '';
        this.removeCreationForm();
    }

    /**
     * Обработка нажатия на checkbox плейлиста
     * @param {Object} event - событие нажатия на checkbox
     */
    checkboxClicked(event) {
        const checkbox = event.target;
        const label = checkbox.previousElementSibling;
        const playlistId = label.getAttribute('data-playlist-id');
        const movieId = checkbox.getAttribute('data-movie-id');
        if (checkbox.checked) {
            API.addMovieToPlaylist(playlistId, movieId).then(() => {});
        } else {
            API.deleteMovieFromPlaylist(playlistId, movieId).then(() => {});
        }
    }

    /**
     * Обработка нажатия Enter в строке создания плейлиста
     * @param {Object} event - объект события
     */
    enterPressed(event) {
        if (event.keyCode === ENTER_KEYCODE) {
            this.createPlaylistCallback();
        }
    }
}
