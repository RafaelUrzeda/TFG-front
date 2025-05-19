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

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="seatMap">
            <h4>Resultado del Mapa de Asientos</h4>

            <div
                v-for="(cabin, cIndex) in seatMap.cabins"
                :key="cIndex"
                class="mb-4"
            >
                <h5>Cabina: {{ cabin.cabinType }}</h5>
                <table class="table table-bordered text-center">
                    <tbody>
                        <tr v-for="(row, rIndex) in cabin.rows" :key="rIndex">
                            <td>
                                <strong>{{ row.number }}</strong>
                            </td>
                            <td
                                v-for="(seat, sIndex) in row.seats"
                                :key="sIndex"
                                :class="{
                                    'bg-success text-white':
                                        seat.available &&
                                        seat.seatType === 'SEAT',
                                    'bg-danger text-white':
                                        !seat.available &&
                                        seat.seatType === 'SEAT',
                                    'bg-secondary': seat.seatType === 'GAP',
                                }"
                            >
                                {{ seat.column }}
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const authToken = ref("");
const seatMap = ref(null);
const error = ref(null);

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
    }
};
</script>
