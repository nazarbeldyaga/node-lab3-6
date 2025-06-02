const createForecast = (req, res) => {
    try {
        const newForecast = req.body;

        fetch("localhost:3001/api/forecasts/", {
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
                    message: "Прогноз успішно додано ✅",
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

        fetch("localhost:3001/api/forecasts/", {
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
                    message: "Прогноз успішно оновлено ✅",
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
        fetch("localhost:3001/api/forecasts/", {
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

const searchByDay = (req, res) => {
    const { location_id, date } = req.query;
    const locationId = parseInt(location_id);

    try {
        fetch("localhost:3001/api/forecasts/", {
            method: "GET",
            headers: {
                "Content-Type": "application/json"
            },
            body: JSON.stringify({ locationId: locationId, date: date })
        })
            .then((response) => response.json())
            .then(() => {
                renderForecastPage(res, data, date);
            });
    } catch (error) {
        console.error("Помилка при отриманні прогнозу:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: "Помилка при отриманні прогнозу погоди"
        });
    }
};

const getLocations = (req, res) => {
    try {
        fetch("localhost:3001/api/locations/")
            .then((response) => response.json())
            .then(() => {
                console.log(response);
                return response;
            });
    } catch (error) {
        console.error("Помилка при отриманні локацій:", error);
        res.status(500).render("error", {
            title: "Помилка",
            message: "Помилка при отриманні локацій"
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
    createForecast,
    deleteForecast,
    updateForecast,
    getLocations,
    searchByDay,
};
