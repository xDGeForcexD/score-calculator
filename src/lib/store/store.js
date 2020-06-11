

class Store {

    constructor(save) {
        this.save = save;

    }

    store(dataStore) {
        let data = JSON.parse(window.localStorage.getItem(this.save));
        if(typeof data !== 'object' || data === null) {
            dataStore.id = this.id = 0;
            data = {lid: dataStore.id, data: [dataStore]};
        } else if(dataStore.id === -1) {
            dataStore.id = this.id = ++data.lid;
            data.data.push(dataStore); 
        } else {
            for(let i = 0; i<data.data.length; i++) {
                if(dataStore.id === data.data[i].id) {
                    data.data[i] = dataStore;
                    break;
                }
            }
        }
        window.localStorage.setItem(this.save, JSON.stringify(data));
        return dataStore.id;
    }

    restoreAll() {
        let data = JSON.parse(window.localStorage.getItem(this.save));
        if(typeof data !== 'object' || data === null) {
            return [];
        }
        return data.data;
    }

    restoreById(id) {
        let data = this.restoreAll();
        for(let entry of data) {
            if(entry.id === id) {
                return entry;
            }
        }
        return {};
    }

    deleteById(id) {
        let data = JSON.parse(window.localStorage.getItem(this.save));
        if(typeof data !== 'object' || data === null) {
            return false;
        }
        let index = 0;
        for(let entry of data.data) {
            if(entry.id === id) {
                break;
            }
            index++;
        }
        if(index < data.data.length) {
            data.data.splice(index, 1);
        }
        window.localStorage.setItem(this.save, JSON.stringify(data));
        return true;
    }
}

export default Store;