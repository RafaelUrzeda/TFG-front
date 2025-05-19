<template>
    <div class="container mt-4">
        <h2>Eliminar Reserva</h2>

        <form @submit.prevent="submitDelete" class="mb-4">
            <div class="mb-3">
                <label for="locata" class="form-label"
                    >Localizador (locata)</label
                >
                <input
                    type="text"
                    class="form-control"
                    id="locata"
                    v-model="locata"
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

            <button type="submit" class="btn btn-danger">Eliminar</button>
        </form>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>
        <div v-if="result" class="alert alert-success">
            Resultado: {{ result }}
        </div>
    </div>
</template>

<script setup>
import { ref } from "vue";

const locata = ref("");
const authToken = ref("");
const result = ref(null);
const error = ref(null);

const submitDelete = async () => {
    error.value = null;
    result.value = null;

    try {
        const res = await fetch("http://localhost:3000/itlDeleteBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken.value,
            },
            body: JSON.stringify({ locata: locata.value }),
        });

        if (!res.ok) {
            throw new Error(`Error del servidor: ${res.status}`);
        }

        const data = await res.text(); // respuesta es string puro
        result.value = data;
    } catch (err) {
        error.value = err.message;
    }
};
</script>
