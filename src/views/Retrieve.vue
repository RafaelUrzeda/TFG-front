<template>
    <div class="container mt-4">
        <h2>Recuperar Reserva</h2>

        <form @submit.prevent="submitGetPnr" class="mb-4">
            <div class="mb-3">
                <label for="locata" class="form-label"
                    >Localizador (locata)</label
                >
                <input
                    type="number"
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

            <button type="submit" class="btn btn-primary">Buscar</button>
        </form>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="response" class="card">
            <div class="card-body">
                <h5 class="card-title">Resultado</h5>
                <pre style="white-space: pre-wrap">{{ formattedResponse }}</pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const locata = ref(null);
const authToken = ref("");
const response = ref(null);
const error = ref(null);

const formattedResponse = computed(() =>
    JSON.stringify(response.value, null, 2)
);

const submitGetPnr = async () => {
    error.value = null;
    response.value = null;

    try {
        const res = await fetch("http://localhost:3000/itlGetPnr", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken.value,
            },
            body: JSON.stringify({ locata: Number(locata.value) }),
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
