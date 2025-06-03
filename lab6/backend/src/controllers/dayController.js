const dayService = require("../services/dayService");
const forecastRepository = require("../repositories/forecastRepository");

const createForecast = async (req, res) => {
    const newForecast = req.body;

    try {
        const result = await dayService.createForecastTransaction(newForecast);
        res.status(201).json(result);
    } catch (error) {
        console.error("Помилка при додаванні погоди:", error);
        res.status(500).json({ error: error.message || "Не вдалося додати прогноз погоди" });
    }
};

const updateForecast = async (req, res) => {
    try {
        const updates = req.body;
        const result = await dayService.updateAllForecastTransaction(updates);
        res.status(200).json(result);
    } catch (error) {
        console.error("Помилка при оновленні погоди:", error);
        res.status(500).json({ error: error.message || "Не вдалося оновити прогноз погоди" });
    }
};

const deleteForecast = async (req, res) => {
    const toDelete = req.body;
    try {
        const result = await dayService.deleteForecastTransaction(toDelete);
        res.status(200).json({ success: true, message: "Прогноз успішно видалено" });
    } catch (error) {
        console.error("Помилка при видаленні погоди:", error);
        res.status(500).json({ error: error.message || "Не вдалося видалити прогноз погоди" });
    }
};

const searchByDay = async (req, res) => {
    try {
        const { locationId, date } = req.query;
        const locationParsed = parseInt(locationId)

        if (!locationId || !date) {
            return res.status(400).json({ error: "Необхідно вказати locationId та date" });
        }

        // Використовуємо транзакцію з бази даних
        const db = require("../config/database");

        // Використовуємо транзакцію для всіх операцій
        const result = await db.tx(async (t) => {
            // Отримуємо інформацію про локацію
            const location = await forecastRepository.getLocationById(t, locationParsed);
            if (!location) {
                return { error: "Локацію не знайдено" };
            }

            // Спочатку отримуємо об'єкт дати за рядком дати
            const dateObj = await forecastRepository.getDateByDateString(t, date);
            if (!dateObj) {
                return { error: "Дату не знайдено" };
            }

            // Тепер отримуємо прогнози за locationId та dateId
            const forecasts = await forecastRepository.getForecastsByLocationAndDate(
                t,
                locationParsed,
                dateObj.id
            );

            // Отримуємо дані для наступного дня
            const nextDate = new Date(date);
            nextDate.setDate(nextDate.getDate() + 1);
            const nextDateStr = nextDate.toISOString().split("T")[0];
            const nextDateData = await forecastRepository.getDateByDateString(t, nextDateStr);

            // Отримуємо дані для попереднього дня
            const prevDate = new Date(date);
            prevDate.setDate(prevDate.getDate() - 1);
            const prevDateStr = prevDate.toISOString().split("T")[0];
            const prevDateData = await forecastRepository.getDateByDateString(t, prevDateStr);

            return {
                location,
                date: dateObj,
                forecast: forecasts,
                nextDateData,
                prevDateData
            };
        });

        if (result.error) {
            return res.status(404).json({ error: result.error });
        }

        res.status(200).json(result);
    } catch (error) {
        console.error("Помилка при отриманні прогнозів:", error);
        res.status(500).json({ error: error.message || "Внутрішня помилка сервера" });
    }
};

const getLocations = async (req, res) => {
    try {
        const locations = await forecastRepository.getLocations();
        res.status(200).json(locations);
    } catch (error) {
        console.error("Помилка при отриманні локацій:", error);
        res.status(500).json({ error: "Помилка при отриманні локацій" });
    }
};

const getPagination = async (req, res) => {
    try {
        const { page, limit, locationId } = req.query;
        console.log("Pagination")
        console.log(page, limit, locationId)

        if (!page || !limit || !locationId) {
            return res.status(400).json({ error: "Необхідно вказати page, limit, locationId" });
        }

        const pageNum = parseInt(page);
        const dayLimit = parseInt(limit) * 8;
        const location_Id = parseInt(locationId)
        console.log(pageNum, dayLimit, location_Id)

        const data = await dayService.getPaginatedDaysByLocation(pageNum, dayLimit, location_Id);
        // console.log(await data.json());
        res.status(200).json(data);
    } catch (error) {
        console.error("Помилка при отриманні даних сторінки:", error);
        res.status(500).json({ error: "Помилка при отриманні даних сторінки" });
    }
};

const getLocationById = async (req, res) => {
    try {
        const locationId = parseInt(req.params.id);

        if (isNaN(locationId)) {
            return res.status(400).json({ error: "Некоректний ID локації" });
        }
        const location = await forecastRepository.getLocationById(locationId);

        if (!location) {
            return res.status(404).json({ error: "Локацію не знайдено" });
        }

        res.status(200).json(location);
    } catch (error) {
        console.error("Помилка при отриманні локації:", error);
        res.status(500).json({ error: "Внутрішня помилка сервера" });
    }
};

module.exports = {
    createForecast,
    updateForecast,
    deleteForecast,
    getLocations,
    searchByDay,
    getPagination,
    getLocationById
};
