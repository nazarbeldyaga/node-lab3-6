document.addEventListener("DOMContentLoaded", async () => {
    const forecastContainer = document.getElementById("forecast-container");
    const locationSelect = document.getElementById("location-select");
    const dateInput = document.getElementById("date-input");
    const searchButton = document.getElementById("search-button");
    const paginationContainer = document.getElementById("pagination");

    const loadLocations = async () => {
        try {
            const response = await fetch("/locations");
            if (!response.ok) throw new Error("Failed to fetch locations");
            const locations = await response.json();
            locationSelect.innerHTML = '<option value="">Оберіть локацію</option>';
            locations.forEach((loc) => {
                const option = document.createElement("option");
                option.value = loc.id;
                option.textContent = loc.name;
                locationSelect.appendChild(option);
            });
        } catch (error) {
            console.error("Error loading locations:", error);
            alert("Помилка завантаження локацій");
        }
    };

    const loadForecasts = async (page = 1) => {
        try {
            const limit = 10;
            const locationId = locationSelect.value;
            const date = dateInput.value;
            const query = new URLSearchParams({ page, limit });
            if (locationId) query.set("locationId", locationId);
            if (date) query.set("date", date);

            const response = await fetch(`/forecasts?${query}`);
            if (!response.ok) throw new Error("Failed to fetch forecasts");
            const { data, pagination } = await response.json();

            forecastContainer.innerHTML = "";
            data.forEach((forecast) => {
                const div = document.createElement("div");
                div.className = "forecast-item";
                div.innerHTML = `
                    <p>Локація: ${forecast.Location.name}</p>
                    <p>Дата: ${forecast.date}</p>
                    <p>Температура: ${forecast.temperature}°C</p>
                    <p>Опис: ${forecast.description}</p>
                `;
                forecastContainer.appendChild(div);
            });

            paginationContainer.innerHTML = "";
            for (let i = 1; i <= Math.ceil(pagination.total / pagination.limit); i++) {
                const button = document.createElement("button");
                button.textContent = i;
                button.disabled = i === pagination.page;
                button.onclick = () => loadForecasts(i);
                paginationContainer.appendChild(button);
            }
        } catch (error) {
            console.error("Error loading forecasts:", error);
            alert("Помилка завантаження прогнозів");
        }
    };

    await loadLocations();
    searchButton.addEventListener("click", () => loadForecasts(1));
    await loadForecasts(1);
});
