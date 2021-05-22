import {globalEventBus} from 'utils/eventbus';
import {busEvents} from 'utils/busEvents';
import {API} from 'utils/api';

/**
 * Модель страницы поиска
 */
export default class SearchModel {
    /**
     * Конструктор
     */
    constructor() {
        globalEventBus.on(busEvents.GET_SEARCH_RESULTS, this.getSearchResults.bind(this));
    }

    /**
     * Получение поисковой выдачи
     * @param {string} query - строка поиска
     */
    getSearchResults(query) {
        API.getSearchResults(query)
            .then((res) => globalEventBus.emit(busEvents.SET_SEARCH_RESULTS, {
                query: query,
                search_results: (Object.values(res.data).every((el) => el === null)) ? [] : res.data,
            }));
    }
}
