export const getLastHistoryDate = (client) => {
    if (!client.history) return null;

    const entries = Object.values(client.history);
    if (!entries.length) return null;

    const parsedDates = entries.map(h => {
        const [d, t] = h.date.split(" ");
        const [day, month, year] = d.split(".");
        return new Date(`${year}-${month}-${day}T${t}`);
    });

    return new Date(Math.max(...parsedDates));
};
