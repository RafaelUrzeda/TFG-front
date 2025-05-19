<template>
    <div class="container mt-4">
        <h2>Nueva Reserva</h2>

        <form @submit.prevent="submitBooking" class="mb-4">
            <div class="mb-3">
                <label for="idReserva" class="form-label">ID Reserva</label>
                <input
                    type="number"
                    class="form-control"
                    id="idReserva"
                    v-model="idReserva"
                    required
                />
            </div>

            <div class="mb-3">
                <label for="authToken" class="form-label"
                    >Token de Autorización</label
                >
                <input
                    type="text"
                    class="form-control"
                    id="authToken"
                    v-model="authToken"
                    required
                />
            </div>

            <button type="submit" class="btn btn-primary">Enviar</button>
        </form>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="response" class="card">
            <div class="card-body">
                <h5 class="card-title">Respuesta de la Reserva</h5>
                <pre style="white-space: pre-wrap">{{ formattedResponse }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue"; // Asegúrate de importar computed

const idReserva = ref(null);
const authToken = ref("");
const response = ref(null);
const error = ref(null);

const formattedResponse = computed(() =>
    JSON.stringify(response.value, null, 2)
);

const submitBooking = async () => {
    error.value = null;
    response.value = null;

    try {
        const res = await fetch("http://localhost:3000/itlBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken.value,
            },
            body: JSON.stringify({ idReserva: Number(idReserva.value) }),
        });

        if (!res.ok) {
            throw new Error(`Error del servidor: ${res.status}`);
        }

        const data = await res.json();
        response.value = data;
    } catch (err) {
        error.value = err.message;
    }
};
</script>
