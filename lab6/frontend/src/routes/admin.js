document.addEventListener('DOMContentLoaded', async () => {
    const forecastContainer = document.getElementById('forecast-container');
    const createForm = document.getElementById('create-forecast-form');
    const locationSelect = document.getElementById('location-select');

    const loadLocations = async () => {
        try {
            const response = await fetch('/locations');
            if (!response.ok) throw new Error('Failed to fetch locations');
            const locations = await response.json();
            locationSelect.innerHTML = '<option value="">Оберіть локацію</option>';
            locations.forEach(loc => {
                const option = document.createElement('option');
                option.value = loc.id;
                option.textContent = loc.name;
                locationSelect.appendChild(option);
            });
        } catch (error) {
            console.error('Error loading locations:', error);
            alert('Помилка завантаження локацій');
        }
    };

    const loadForecasts = async () => {
        try {
            const response = await fetch('/forecasts');
            if (!response.ok) throw new Error('Failed to fetch forecasts');
            const { data } = await response.json();
            forecastContainer.innerHTML = '';
            data.forEach(forecast => {
                const div = document.createElement('div');
                div.className = 'forecast-item';
                div.innerHTML = `
          <p>ID: ${forecast.id}</p>
          <p>Локація: ${forecast.Location.name}</p>
          <p>Дата: ${forecast.date}</p>
          <p>Температура: ${forecast.temperature}°C</p>
          <p>Опис: ${forecast.description}</p>
          <button onclick="editForecast(${forecast.id})">Редагувати</button>
          <button onclick="deleteForecast(${forecast.id})">Видалити</button>
        `;
                forecastContainer.appendChild(div);
            });
        } catch (error) {
            console.error('Error loading forecasts:', error);
            alert('Помилка завантаження прогнозів');
        }
    };

    createForm.addEventListener('submit', async (e) => {
        e.preventDefault();
        try {
            const formData = new FormData(createForm);
            const data = Object.fromEntries(formData);
            data.locationId = parseInt(data.locationId);
            data.temperature = parseFloat(data.temperature);
            const response = await fetch('/forecasts', {
                method: 'POST',
                headers: { 'Content-Type': 'application/json' },
                body: JSON.stringify(data),
            });
            if (!response.ok) {
                const { error } = await response.json();
                throw new Error(error);
            }
            createForm.reset();
            await loadForecasts();
        } catch (error) {
            console.error('Error creating forecast:', error);
            alert(`Помилка створення прогнозу: ${error.message}`);
        }
    });

    window.editForecast = async (id) => {
        try {
            const response = await fetch(`/forecasts/${id}`);
            if (!response.ok) throw new Error('Failed to fetch forecast');
            const forecast = await response.json();
            const newData = prompt('Введіть нові дані (JSON)', JSON.stringify({
                locationId: forecast.locationId,
                date: forecast.date,
                temperature: forecast.temperature,
                description: forecast.description,
            }));
            if (newData) {
                const response = await fetch(`/forecasts/${id}`, {
                    method: 'PATCH',
                    headers: { 'Content-Type': 'application/json' },
                    body: newData,
                });
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error);
                }
                await loadForecasts();
            }
        } catch (error) {
            console.error('Error updating forecast:', error);
            alert(`Помилка редагування прогнозу: ${error.message}`);
        }
    };

    window.deleteForecast = async (id) => {
        if (confirm('Видалити прогноз?')) {
            try {
                const response = await fetch(`/forecasts/${id}`, {
                    method: 'DELETE',
                });
                if (!response.ok) {
                    const { error } = await response.json();
                    throw new Error(error);
                }
                await loadForecasts();
            } catch (error) {
                console.error('Error deleting forecast:', error);
                alert(`Помилка видалення прогнозу: ${error.message}`);
            }
        }
    };

    await loadLocations();
    await loadForecasts();
});