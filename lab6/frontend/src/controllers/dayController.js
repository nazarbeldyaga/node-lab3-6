const getPaginatedForecast = async (req, res) => {
    const page = parseInt(req.query.page) || 1;
    const limit = parseInt(req.query.limit);
    const locationId = parseInt(req.query.locationId) || 1;
    console.log(locationId)

    try {
        const response = await fetch(
            `http://localhost:3001/api/forecasts/pagination?page=${page}&limit=${limit}&locationId=${locationId}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Помилка при додаванні прогнозу");
        }

        const result = await response.json();

        result.limit = result.limit / 8;

        res.render("pagination/index", {
            message: "Дані сторінки отримано успішно",
            title: "Локації",
            items: result.forecast,
            totalItems: result.totalItems,
            totalPages: result.totalPages,
            currentPage: result.currentPage,
            locationName: result.locationName,
            date: result.date
        });
    } catch (error) {
        console.error("Помилка при отриманні даних сторінки front:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося отримати дані сторінки"
        });
    }
};

const createForecast = async (req, res) => {
    try {
        const newForecast = req.body;
        const url = "http://localhost:3001/api/forecasts";

        // Логування для Postman
        console.log('===== CREATE FORECAST =====');
        console.log('URL:', url);
        console.log('Method: POST');
        console.log('Body:', JSON.stringify(newForecast, null, 2));
        console.log('==========================');

        const response = await fetch(url, {
            method: "POST",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(newForecast)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Помилка при додаванні прогнозу");
        }

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        res.render("admin/result", {
            title: "Результат",
            message: "Прогноз успішно додано ",
            result
        });
    } catch (error) {
        console.error("Помилка при додаванні погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося додати прогноз погоди"
        });
    }
};

const updateForecast = async (req, res) => {
    try {
        const updates = req.body;
        const url = "http://localhost:3001/api/forecasts";

        // Логування для Postman
        console.log('===== UPDATE FORECAST =====');
        console.log('URL:', url);
        console.log('Method: PUT');
        console.log('Body:', JSON.stringify(updates, null, 2));
        console.log('==========================');

        const response = await fetch(url, {
            method: "PUT",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(updates)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Помилка при оновленні прогнозу");
        }

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        res.render("admin/result", {
            title: "Результат",
            message: "Прогноз успішно оновлено ",
            result
        });
    } catch (error) {
        console.error("Помилка при оновленні погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося оновити прогноз погоди"
        });
    }
};

const deleteForecast = async (req, res) => {
    try {
        const toDelete = req.body;
        const url = "http://localhost:3001/api/forecasts";

        // Логування для Postman
        console.log('===== DELETE FORECAST =====');
        console.log('URL:', url);
        console.log('Method: DELETE');
        console.log('Body:', JSON.stringify(toDelete, null, 2));
        console.log('==========================');

        const response = await fetch(url, {
            method: "DELETE",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify(toDelete)
        });

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || "Помилка при видаленні прогнозу");
        }

        const result = await response.json();
        console.log('Response:', JSON.stringify(result, null, 2));

        res.render("admin/result", {
            title: "Результат",
            message: "Прогноз успішно видалено ",
            result
        });
    } catch (error) {
        console.error("Помилка при видаленні погоди:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Не вдалося видалити прогноз погоди"
        });
    }
};

const searchByDay = async (req, res) => {
    const locationId = parseInt(req.query.location_id);
    const date = req.query.date;

    try {
        const response = await fetch(
            `http://localhost:3001/api/forecasts?locationId=${locationId}&date=${date}`,
            {
                method: "GET",
                headers: {
                    Accept: "application/json"
                }
            }
        );

        if (!response.ok) {
            const errorData = await response.json();
            throw new Error(errorData.error || `HTTP помилка! Статус: ${response.status}`);
        }

        const data = await response.json();

        if (!data.location || !data.date || !data.forecast) {
            throw new Error("Отримано неповні дані з API");
        }

        renderForecastPage(res, data, date);
    } catch (error) {
        console.error("Помилка при отриманні прогнозу:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: error.message || "Помилка при отриманні прогнозу погоди"
        });
    }
};

const getLocations = async (req, res) => {
    try {
        const response = await fetch("http://localhost:3001/api/locations");
        const locations = await response.json();
        return locations;
    } catch (error) {
        console.error("Помилка при отриманні локацій:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: "Помилка при отриманні прогнозу локацій"
        });
    }
};

// Рендер
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
    getPaginatedForecast,
    createForecast,
    deleteForecast,
    updateForecast,
    getLocations,
    searchByDay
};
