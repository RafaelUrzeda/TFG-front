<template>
    <div class="container mt-4">
        <h2>Actualizar Reserva</h2>

        <form @submit.prevent="submitUpdate" class="mb-4">
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
                <label for="localizador" class="form-label">Localizador</label>
                <input
                    type="text"
                    class="form-control"
                    id="localizador"
                    v-model="localizador"
                    required
                />
            </div>

            <div class="mb-3">
                <label for="authToken" class="form-label">Token de Autorización</label>
                <input
                    type="text"
                    class="form-control"
                    id="authToken"
                    v-model="authToken"
                    required
                />
            </div>

            <button type="submit" class="btn btn-primary">Actualizar</button>
        </form>

        <div v-if="error" class="alert alert-danger">{{ error }}</div>

        <div v-if="response" class="card">
            <div class="card-body">
                <h5 class="card-title">Respuesta de la Actualización</h5>
                <pre class="jsonview" v-html="formattedResponse"></pre>
            </div>
        </div>
    </div>
</template>

<script setup>
import { computed, ref } from "vue";

const idReserva = ref(null);
const localizador = ref("");
const authToken = ref("");
const response = ref(null);
const error = ref(null);

// Función que aplica resaltado de sintaxis al JSON
function highlightJson(json) {
    if (!json) return '';
    json = JSON.stringify(json, null, 2);
    json = json.replace(/&/g, '&amp;').replace(/</g, '&lt;').replace(/>/g, '&gt;');

    return json.replace(
        /("(\\u[a-zA-Z0-9]{4}|\\[^u]|[^\\"])*"(\s*:)?|\b(true|false|null)\b|-?\d+(?:\.\d*)?(?:[eE][+\-]?\d+)?)/g,
        function (match) {
            let cls = 'number';
            if (/^"/.test(match)) {
                if (/:$/.test(match)) {
                    cls = 'key';
                } else {
                    cls = 'string';
                }
            } else if (/true|false/.test(match)) {
                cls = 'boolean';
            } else if (/null/.test(match)) {
                cls = 'null';
            }
            return '<span class="' + cls + '">' + match + '</span>';
        }
    );
}

const formattedResponse = computed(() => highlightJson(response.value));

const submitUpdate = async () => {
    error.value = null;
    response.value = null;

    try {
        const res = await fetch("http://localhost:3000/itlUpdateBooking", {
            method: "POST",
            headers: {
                "Content-Type": "application/json",
                Authorization: authToken.value,
            },
            body: JSON.stringify({
                idReserva: Number(idReserva.value),
                localizador: localizador.value,
            }),
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

<style>
.jsonview {
    border-radius: 3px;
    padding: 10px;
    font-size: 14px;
    border: 1px solid #ccc;
    max-height: 600px;
    overflow-y: auto;
    background-color: #f8f8f8;
    white-space: pre-wrap;
}

.jsonview .string {
    color: green;
}

.jsonview .number {
    color: darkorange;
}

.jsonview .boolean {
    color: blue;
}

.jsonview .null {
    color: magenta;
}

.jsonview .key {
    color: red;
}
</style>
