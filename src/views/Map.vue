<template>
    <div class="container mt-4">
        <h2>Mapa de Asientos</h2>

        <form @submit.prevent="submitForm" class="mb-4">
            <div class="row">
                <div class="col-md-6 mb-3">
                    <label class="form-label">Origen</label>
                    <input
                        v-model="form.departure"
                        class="form-control"
                        required
                    />
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Destino</label>
                    <input
                        v-model="form.arrival"
                        class="form-control"
                        required
                    />
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Número de vuelo</label>
                    <input
                        v-model.number="form.flightNumber"
                        class="form-control"
                        type="number"
                        required
                    />
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Fecha de salida</label>
                    <input
                        v-model="form.departureDate"
                        type="date"
                        class="form-control"
                        required
                    />
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">Clase</label>
                    <input v-model="form.cabinClass" class="form-control" />
                </div>

                <div class="col-md-6 mb-3">
                    <label class="form-label">ID Reserva</label>
                    <input
                        v-model="form.idReserva"
                        class="form-control"
                        required
                    />
                </div>

                <div class="col-md-12 mb-3">
                    <label class="form-label">Token de Autorización</label>
                    <input v-model="authToken" class="form-control" required />
                </div>

                <div class="col-md-12 mb-3 form-check">
                    <input
                        type="checkbox"
                        class="form-check-input"
                        v-model="form.selectSeat"
                        id="selectSeat"
                    />
                    <label class="form-check-label" for="selectSeat"
                        >Seleccionar asiento</label
                    >
                </div>

                <div v-if="form.selectSeat" class="row">
                    <div class="col-md-3 mb-3">
                        <label class="form-label">Fila Inicial</label>
                        <input
                            v-model.number="form.selectSeatParams.initialRow"
                            type="number"
                            class="form-control"
                        />
                    </div>
                    <div class="col-md-3 mb-3 form-check">
                        <input
                            v-model="form.selectSeatParams.XLSeat"
                            type="checkbox"
                            class="form-check-input"
                            id="XLSeat"
                        />
                        <label class="form-check-label" for="XLSeat"
                            >Asiento XL</label
                        >
                    </div>
                    <div class="col-md-3 mb-3 form-check">
                        <input
                            v-model="form.selectSeatParams.emergency"
                            type="checkbox"
                            class="form-check-input"
                            id="emergency"
                        />
                        <label class="form-check-label" for="emergency"
                            >Emergencia</label
                        >
                    </div>
                    <div class="col-md-3 mb-3 form-check">
                        <input
                            v-model="form.selectSeatParams.businessClass"
                            type="checkbox"
                            class="form-check-input"
                            id="business"
                        />
                        <label class="form-check-label" for="business"
                            >Business</label
                        >
                    </div>
                </div>
            </div>

            <button class="btn btn-primary">Buscar Mapa</button>
        </form>

        <div v-if="loading" class="alert alert-info">
            Cargando mapa de asientos...
        </div>
        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="seatMap && seatMap.cabins && seatMap.cabins.length > 0">
            <h4>Resultado del Mapa de Asientos</h4>
            <div
                v-for="(cabin, cIndex) in seatMap.cabins"
                :key="cIndex"
                class="cabin-section mb-5 p-3 rounded shadow-sm"
            >
                <h5 class="cabin-title mb-3">Cabina: {{ cabin.cabinType }}</h5>
                <div class="seat-map-grid">
                    <div
                        v-for="(row, rIndex) in cabin.rows"
                        :key="rIndex"
                        class="seat-row"
                    >
                        <div class="row-label">{{ row.number }}</div>
                        <div
                            v-for="(seat, sIndex) in row.seats"
                            :key="sIndex"
                            class="seat"
                            :class="{
                                available:
                                    seat.available && seat.seatType === 'SEAT',
                                unavailable:
                                    !seat.available && seat.seatType === 'SEAT',
                                gap: seat.seatType === 'GAP',
                                xl:
                                    seat.features &&
                                    seat.features.includes('XL'),
                                emergency:
                                    seat.features &&
                                    seat.features.includes('Emergency'),
                                business:
                                    seat.features &&
                                    seat.features.includes('Business'),
                            }"
                            :title="seatInfo(seat)"
                            @click="selectSeatHandler(seat)"
                        >
                            <span class="seat-label">{{ seat.column }}</span>
                            <span
                                v-if="seat.features && seat.features.length > 0"
                                class="seat-icons"
                            >
                                <template
                                    v-for="feature in seat.features"
                                    :key="feature"
                                >
                                    <i
                                        v-if="feature === 'XL'"
                                        class="bi bi-arrows-expand"
                                        title="Asiento XL"
                                    ></i>
                                    <i
                                        v-if="feature === 'Emergency'"
                                        class="bi bi-exclamation-triangle-fill text-warning"
                                        title="Salida de emergencia"
                                    ></i>
                                    <i
                                        v-if="feature === 'Business'"
                                        class="bi bi-briefcase-fill"
                                        title="Clase Business"
                                    ></i>
                                </template>
                            </span>
                        </div>
                    </div>
                </div>
            </div>
        </div>

        <div
            v-else-if="
                seatMap && (!seatMap.cabins || seatMap.cabins.length === 0)
            "
            class="alert alert-warning"
        >
            No se encontraron datos del mapa de asientos.
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const authToken = ref("");
const seatMap = ref(null);
const error = ref(null);
const loading = ref(false);

const form = ref({
    departure: "",
    arrival: "",
    flightNumber: null,
    departureDate: "",
    cabinClass: "",
    idReserva: "",
    selectSeat: false,
    selectSeatParams: {
        initialRow: 1,
        XLSeat: false,
        emergency: false,
        businessClass: false,
    },
});

const submitForm = async () => {
    error.value = null;
    seatMap.value = null;
    loading.value = true;

    try {
        const res = await fetch("http://localhost:3000/itlSeatMap", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken.value,
            },
            body: JSON.stringify(form.value),
        });

        if (!res.ok) throw new Error(`Error del servidor: ${res.status}`);

        const data = await res.json();
        seatMap.value = data;
    } catch (err) {
        error.value = err.message;
    } finally {
        loading.value = false;
    }
};

const seatInfo = (seat) => {
    if (seat.seatType === "GAP") {
        return "Pasillo";
    }
    let info = `Asiento ${seat.column}`;
    if (seat.features && seat.features.length > 0) {
        info += ` (${seat.features.join(", ")})`;
    }
    return info;
};

// Opción para seleccionar un asiento (simple toggle para demo)
const selectedSeat = ref(null);
const selectSeatHandler = (seat) => {
    if (!seat.available || seat.seatType === "GAP") return; // no seleccionar si no está disponible o es gap
    if (selectedSeat.value === seat) {
        selectedSeat.value = null;
    } else {
        selectedSeat.value = seat;
    }
};
</script>

<style scoped>
.cabin-section {
    border: 2px solid #007bff;
    background: #f0f8ff;
}

.cabin-title {
    color: #0056b3;
    border-bottom: 2px solid #007bff;
    padding-bottom: 4px;
}

.seat-map-grid {
    display: flex;
    flex-direction: column;
    gap: 8px;
}

.seat-row {
    display: flex;
    align-items: center;
    gap: 8px;
}

.row-label {
    min-width: 30px;
    font-weight: 700;
    text-align: right;
    color: #333;
}

.seat {
    position: relative;
    min-width: 34px;
    height: 34px;
    border-radius: 6px;
    border: 1.5px solid #555;
    font-size: 0.9rem;
    font-weight: 600;
    display: flex;
    justify-content: center;
    align-items: center;
    cursor: pointer;
    user-select: none;
    transition: background-color 0.3s ease, transform 0.2s ease,
        box-shadow 0.2s ease;
}

.seat.available {
    background-color: #28a745;
    color: #fff;
}

.seat.unavailable {
    background-color: #dc3545;
    color: #fff;
    cursor: not-allowed;
}

.seat.gap {
    background-color: transparent;
    border: none;
    pointer-events: none;
    cursor: default;
}

.seat:hover:not(.unavailable):not(.gap) {
    background-color: #218838;
    transform: scale(1.1);
    z-index: 10;
    box-shadow: 0 0 8px rgba(33, 136, 56, 0.7);
}

.seat-label {
    pointer-events: none;
}

.seat-icons {
    position: absolute;
    bottom: 2px;
    right: 2px;
    display: flex;
    gap: 2px;
    font-size: 0.8rem;
}

/* Diferentes bordes para asientos especiales */
.seat.xl {
    border-color: #ff9800;
}

.seat.emergency {
    border-color: #ffc107;
}

.seat.business {
    border-color: #6f42c1;
}

/* Asiento seleccionado destacado */
.seat.selected {
    box-shadow: 0 0 12px 3px #0056b3;
    border-color: #003d80;
    transform: scale(1.15);
    z-index: 20;
}

/* Bootstrap Icons (recuerda importar en tu index.html o main.js):
<link
  rel="stylesheet"
  href="https://cdn.jsdelivr.net/npm/bootstrap-icons@1.10.5/font/bootstrap-icons.css"
/>
*/
</style>
