// URL для API для получения курсов
const apiUrl = 'https://api.exchangerate-api.com/v4/latest/USD';

// Функция для получения актуальных курсов
async function fetchRates() {
    try {
        const response = await fetch(apiUrl);
        const data = await response.json();
        
        // Предполагаем, что API возвращает курсы по USD
        return {
            usdToRubRate: data.rates.RUB,  // Курс USD -> RUB
            usdToThbRate: data.rates.THB // Курс USD -> THB
        };
    } catch (error) {
        console.error('Ошибка при получении курсов:', error);
        return {
            usdToRubRate: 75,  // Значения по умолчанию
            usdToThbRate: 36.5
        };
    }
}

// Функция для получения процентной накрутки на основе суммы
function getMarkup(amount) {
    if (amount >= 1000 && amount < 10000) {
        return 0.05;  // 5% накрутка
    } else if (amount >= 10000 && amount < 20000) {
        return 0.04;
    } else if (amount >= 20000 && amount < 30000) {
        return 0.035;
    } else if (amount >= 30000 && amount < 40000) {
        return 0.032;
    } else if (amount >= 40000 && amount < 50000) {
        return 0.03;
    } else if (amount >= 50000 && amount < 60000) {
        return 0.028;
    } else if (amount >= 60000 && amount < 70000) {
        return 0.026;
    } else if (amount >= 70000 && amount < 80000) {
        return 0.024;
    } else if (amount >= 80000 && amount < 90000) {
        return 0.022;
    } else if (amount >= 90000 && amount < 100000) {
        return 0.02;
    } else {
        return 0;
    }
}

// Основная функция для расчета суммы
async function calculateTHB() {
    const currency = document.getElementById('currencySelect').value;
    const amount = parseFloat(document.getElementById('inputAmount').value) || 0;
    const { usdToRubRate, usdToThbRate } = await fetchRates();  // Получаем актуальные курсы
    const markup = getMarkup(amount);  // Получаем процентную накрутку

    let result = 0;
    let finalRate = 0;

    // Рассчитываем сумму и итоговый курс с учетом накрутки
    if (currency === 'RUB') {
        const rubToThbRate = usdToThbRate / usdToRubRate;  // Переводим курс RUB -> THB
        finalRate = rubToThbRate * (1 - markup);  // Уменьшаем курс, улучшая его для клиента
        result = amount / finalRate;  // Рассчитываем сумму в THB
        document.getElementById('thbRate').innerText = `Текущий курс: 1 THB = ${finalRate.toFixed(2)} RUB`;
    } else if (currency === 'USDT') {
        finalRate = usdToThbRate * (1 - markup);  // Уменьшаем курс для USDT
        result = amount * finalRate;  // Рассчитываем сумму в THB
        document.getElementById('thbRate').innerText = `Текущий курс: 1 THB = ${finalRate.toFixed(2)} USDT`;
    }

    // Отображаем итоговую сумму
    document.getElementById('outputAmount').value = result.toFixed(2);
}