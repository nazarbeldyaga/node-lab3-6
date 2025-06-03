const {response} = require("express");

const createForecast = (req, res) => {
    try {
        const newForecast = req.body;

        fetch("http://localhost:3002/api/forecasts", {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newForecast)
        })
            .then((response) => response.json())
            .then(() => {
                res.render("admin/result", {
                    title: "Результат",
                    message: "Прогноз успішно додано ",
                    result
                });
            });
    } catch (error) {
        console.error("Помилка при додаванні погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося додати прогноз погоди"
        });
    }
};

const updateForecast = (req, res) => {
    try {
        const updates = req.body;

        fetch("http://localhost:3002/api/forecasts", {
            method: "PATCH",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        })
            .then((response) => response.json())
            .then(() => {
                res.render("admin/result", {
                    title: "Результат",
                    message: "Прогноз успішно оновлено ",
                    result
                });
            });
    } catch (error) {
        console.error("Помилка при оновленні погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося оновити прогноз погоди"
        });
    }
};

const deleteForecast = (req, res) => {
    const toDelete = req.body;

    try {
        fetch("http://localhost:3001/api/forecasts", {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toDelete)
        })
            .then((response) => response.json())
            .then(() => {
                res.render("admin/result", {
                    title: "Результат",
                    message: "Прогноз успішно видалено ✅",
                    result
                });
            });
    } catch (error) {
        console.error("Помилка при видалити погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося видалити прогноз погоди"
        });
    }
};

const searchByDay = async (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    try {
        // Для GET запитів не використовуємо body, а передаємо параметри в URL
        const response = await fetch(`http://localhost:3001/api/forecasts?locationId=${locationId}&date=${date}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!response.ok) {
            throw new Error(`HTTP помилка! Статус: ${response.status}`);
        }
        // const data = await response.json();
        // console.log(data);
        // renderForecastPage(res, data, date);
        const forecastData = await response.json();
        console.log(forecastData);

        // Отримуємо інформацію про локацію
        const locationResponse = await fetch(`http://localhost:3001/api/locations/${locationId}`, {
            method: "GET",
            headers: {
                "Accept": "application/json"
            }
        });

        if (!locationResponse.ok) {
            throw new Error(`HTTP помилка при отриманні локації! Статус: ${locationResponse.status}`);
        }

        const locationData = await locationResponse.json();

        // Форматуємо дані у потрібному форматі для renderForecastPage
        const formattedData = {
            location: locationData,
            date: { date: date, is_weekend: false }, // Можна додати логіку для визначення вихідних
            forecast: forecastData,
            nextDateData: null,
            prevDateData: null
        };

        renderForecastPage(res, formattedData, date);
    } catch (error) {
        console.error("Помилка при отриманні прогнозу:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: "Помилка при отриманні прогнозу погоди"
        });
    }
};

const getLocations = async (req, res) => {
        const response = await fetch("http://localhost:3001/api/locations");
        const locations = await response.json();
        console.log(locations);
        return locations;
};

const renderForecastPage = (res, data, date) => {
    res.render("calendar/day", {
        title: "Прогноз погоди",
        searchTerm: `${data.location?.name || "Локація"} — ${date}`,
        locationName: data.location?.name || "Невідомо",
        locationId: data.location?.id || null,
        date: data.date?.date || null,
        isWeekend: data.date?.is_weekend,
        forecast: data.forecast || [],
        nextDate: data.nextDateData?.date || null,
        prevDate: data.prevDateData?.date || null
    });
};

module.exports = {
    createForecast,
    deleteForecast,
    updateForecast,
    getLocations,
    searchByDay,
};
