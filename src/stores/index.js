import { writable, derived } from 'svelte/store';
import { de, en } from './locale';


export const language = writable('de');

export const msg = derived(language, lang => {
    return lang === 'de' ? de : en;
});

export const stations = writable([]);

