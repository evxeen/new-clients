const fs = require('fs');
const path = require('path');
const config = require('../config');

class ClientModel {
    constructor() {
        this.DB_PATH = config.DB_PATH;
    }

    readData() {
        if (!fs.existsSync(this.DB_PATH)) {
            return [];
        }
        const rawData = fs.readFileSync(this.DB_PATH, 'utf-8');
        try {
            return JSON.parse(rawData);
        } catch (e) {
            console.error('Ошибка парсинга JSON:', e);
            return [];
        }
    }

    writeData(data) {
        fs.writeFileSync(this.DB_PATH, JSON.stringify(data, null, 2));
    }

    getAllClients() {
        return this.readData();
    }

    getClientById(id) {
        const clients = this.readData();
        return clients.find(c => c.id === id);
    }

    createClient(clientData) {
        const clients = this.readData();
        clients.push(clientData);
        this.writeData(clients);
        return clientData;
    }

    updateClient(id, updateFn) {
        const clients = this.readData();
        const index = clients.findIndex(c => c.id === id);
        if (index === -1) return null;

        clients[index] = updateFn(clients[index]);
        this.writeData(clients);
        return clients[index];
    }

    mainStatusClient(id, newMainStatus) {
        return this.updateClient(id, client => ({
            ...client,
            mainStatus: newMainStatus // <— Перезаписываем старый mainStatus новым
        }));
    }

}

module.exports = new ClientModel();