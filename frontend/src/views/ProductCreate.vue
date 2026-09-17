<script setup lang="ts">
import { ref } from 'vue'

const name = ref('')
const description = ref('')
const price = ref(0)
const stock = ref(0)
const category = ref('')
const image = ref<File | null>(null)

function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement
    image.value = target.files?.[0] ?? null
}

async function createProduct() {
    const product = {
        name: name.value,
        description: description.value,
        price: price.value,
        stock: stock.value,
        category: category.value,
    }

    try {
        const response = await fetch('http://localhost:3000/api/products', {
        method: 'POST',
        headers: {
            'Content-Type': 'application/json'
        },
        body: JSON.stringify(product)
    })

    if (!response.ok) {
        console.log("Status:", response.status)
        console.log("Response:", await response.json())
        return
    }

    const data = await response.json()
    
    if (image.value) {
        const formData = new FormData()
        formData.append('image', image.value)
        const imageResponse = await fetch(`http://localhost:3000/api/products/${data.id}/image`, {
        method: 'POST',
        body: formData
    })
    if (!imageResponse.ok) {
        console.log("Status:", imageResponse.status)
        console.log("Response:", await imageResponse.json())
        return
    }

    }
    location.reload()
    } catch (error) {
        console.log("Error:", error)
    }
}
</script>

<template>
    <h1>Create Product</h1>

    <form @submit.prevent="createProduct">
        <label for="name">Name</label>
        <input v-model="name" type="text" id="name">
        
        <label for="description">Description</label>
        <textarea v-model="description" id="description"></textarea>

        <label for="price">Price</label>
        <input v-model.number="price" type="number" id="price">

        <label for="stock">Stock</label>
        <input v-model.number="stock" type="number" id="stock">

        <label for="category">Category</label>
        <input v-model="category" type="text" id="category">

        <label for="image">Image</label>
        <input @change="handleImageChange" type="file" id="image">

        <button type="submit">Create</button>
    </form>
</template>

<style scoped>

</style>