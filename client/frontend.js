<<<<<<< HEAD
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js';

// Компонент загрузки
Vue.component('loader', {
    template: `<div class="spinner-border text-primary" role="status"><span class="sr-only">Загрузка...</span></div>`
});
=======
import Vue from 'https://cdn.jsdelivr.net/npm/vue@2.6.11/dist/vue.esm.browser.js'

Vue.component('loader', {
    template: `
    <div style="display:flex; justify-content:center; align-items:center; margin-top: 60px;">
        <div class="spinner-border" role="status">
            <span class="sr-only">Загрузка...</span>
        </div>
    </div>`
})
>>>>>>> 611885622bb2f5d8ee49c78592503876bc1d2669

new Vue({
    el: '#app',
    data() {
        return {
            loading: false,
<<<<<<< HEAD
            form: { name: '', meaning: '' },
            contacts: [],
            user: null
        };
    },
    computed: {
        canCreate() {
            return this.form.name.trim() && this.form.meaning.trim();
        }
    },
    methods: {
        async checkAuth() {
            const res = await fetch('/api/me', { credentials: 'same-origin' });
            if (res.status === 401) {
                window.location.href = '/auth.html';
                return;
            }
            this.user = await res.json();
        },
        async fetchContacts() {
            this.loading = true;
            const res = await request('/api/contacts');
            this.contacts = res.map(c => ({ ...c, marked: false }));
            this.loading = false;
        },
        async createContact() {
            if (!this.canCreate) return;
            const res = await request('/api/contacts', 'POST', { 
                name: this.form.name, 
                meaning: this.form.meaning 
            });
            this.contacts.push({ ...res, marked: false });
            this.form.name = '';
            this.form.meaning = '';
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE');
            this.contacts = this.contacts.filter(c => c.id_contact !== id);
        },
        markContact(id) {
            const contact = this.contacts.find(c => c.id_contact === id);
            if (contact) contact.marked = !contact.marked;
        },
        async logout() {
            await fetch('/logout', { method: 'POST', credentials: 'same-origin' });
            window.location.href = '/auth.html';
        }
    },
    async mounted() {
        await this.checkAuth();
        await this.fetchContacts();
    }
});

// Универсальная функция fetch с cookie
async function request(url, method = 'GET', data = null) {
    const headers = {};
    let body;
    if (data) {
        headers['Content-Type'] = 'application/json';
        body = JSON.stringify(data);
    }
    const res = await fetch(url, { method, headers, body, credentials: 'same-origin' });
    return await res.json();
}
=======
            form: {
                name: '',
                value: '',
            },
            contacts: [
            ],
        }
    },
    computed: {
        canCreate() {
            return this.form.value.trim() && this.form.name.trim()
        }
    },
    methods: {
        async createContact() {
            const {...contact} = this.form;
            const newContact = await request('/api/contacts', 'POST', contact)
            this.contacts.push(newContact);
            this.form.name = this.form.value = ''; 
        },
        async markContact(id) {
            const contact = this.contacts.find(c => c.id === id);
            await request(`/api/contacts/${id}`, 'PUT', {
                ...contact,
                marked: !contact.marked,
            })
            contact.marked = !contact.marked;
        },
        async removeContact(id) {
            await request(`/api/contacts/${id}`, 'DELETE');
            this.contacts = this.contacts.filter(c => c.id !== id);
        }
    },
    async mounted() {
        this.loading = true;
        this.contacts = await request('/api/contacts');  
        this.loading = false;
    }
});



async function request(url, method = 'GET', data = null) {
    try {
        const headers = {};
        let body
        if (data) {
            headers['Content-Type'] = 'application/json';
            body = JSON.stringify(data);
        }

        const response = await fetch(url, {
            method,
            headers,
            body
        });
        return await response.json();
    } catch (e) {
        console.warn('Error: ', e.message)
    }
}
>>>>>>> 611885622bb2f5d8ee49c78592503876bc1d2669
