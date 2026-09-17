<script setup lang="ts">
import { onMounted, ref } from 'vue'

type Product = {
    id: string
    name: string
    description: string | null
    price: number
    stock: number
    category: string | null
    imageUrl: string | null
    createdAt: string
    updatedAt: string
}

const products = ref<Product[]>([])

async function fetchProducts() {
    const response = await fetch('http://localhost:3000/api/products')
    const data = await response.json()
    products.value = data
}

onMounted(() => {
    fetchProducts()
})

const loading = ref(false)
const error = ref<string | null>(null)

function editProduct(product: Product) {
    emit('edit', product)
}

async function deleteProduct(product: Product) {
    console.log("Delete Product:", product.name)
    await fetch(`http://localhost:3000/api/products/${product.id}`, {
        method: 'DELETE'
    })
    await fetchProducts()
}

const emit = defineEmits<{
  edit: [product: Product]
}>()

</script>

<template>
    <div>
        <h1>Product List</h1>
        <button>Create Product</button>
        <table>
            <thead>
                <tr>
                    <th>Image</th>
                    <th>Name</th>
                    <th>Stock</th>
                    <th>Price</th>
                    <th>Actions</th>
                </tr>
            </thead>
            <tbody>
                <tr v-for="product in products" :key="product.id">
                    <td><img v-if="product.imageUrl" :src="product.imageUrl" alt="...">
                        <img v-else src="..." alt="...">
                    </td>
                    <td>{{ product.name }}</td>
                    <td>{{ product.stock }}</td>
                    <td>{{ product.price }}</td>
                    <td>
                        <button @click="editProduct(product)">Edit</button>
                        <button @click="deleteProduct(product)">Delete</button>
                    </td>
                </tr>
            </tbody>
        </table>
    </div>
</template>

<style scoped>

</style>