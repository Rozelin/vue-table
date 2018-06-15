import Vue from 'vue'
import Vuex from 'vuex'

Vue.use(Vuex)

export default new Vuex.Store({
    state: {
        products: [
            {id: 1, name: 'sasdaads', qty: 4, avail: true},
            {id: 2, name: 'fghfhf', qty: 2, avail: true},
            {id: 3, name: 'tyytutyut', qty: 4, avail: false},
            {id: 4, name: 'yoyuipiop', qty: 5, avail: true},
            {id: 5, name: 'sasdaads', qty: 7, avail: false},
            {id: 6, name: 'vbnvnvbnv', qty: 8, avail: true}
        ],
        currentPage: 1,
        sortedColumn: ''
    },
    mutations: {
        addProducts(state, payload) {
            state.products.push(payload);
        },
        removeProduct(state, index) {
            state.products.splice(index, 1);
        },
        clearProducts(state) {
            state.products = [];
        },
        addRandomContent(state, content) {
            state.products.push(...content);
        },
        setPaginationPage(state, pageNo) {
            state.currentPage = pageNo;
        },
        sortByType(state, type) {
            if (state.sortedColumn === type) {
                state.products.reverse();
            } else {
                state.products.sort((a, b) => a[type] > b[type] ? 1 : -1 );
                state.sortedColumn = type;
            }
        }
    },
    getters: {
        pages(state) {
            return Math.ceil(state.products.length / 10);
        },
        currentPageContent(state) {
            let start = +state.currentPage * 10 - 10;
            let end = +state.currentPage * 10;
            return state.products.slice(start, end);
        }
    },
    actions: {

    }
  })
  