<script setup lang="ts">
import ProductList from './views/ProductList.vue'
import ProductCreate from './views/ProductCreate.vue'
import ProductEdit from './views/ProductEdit.vue'
import { ref } from 'vue'

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

const selectedProduct = ref<Product | null>(null)
const showCreate = ref(false)

function handleEdit(product: Product) {
    selectedProduct.value = product
}

function closeEdit() {
    selectedProduct.value = null
}
</script>

<template>
    <div class="min-h-screen bg-white text-gray-900">
        <header class="border-b border-gray-200">
            <div class="mx-auto flex max-w-6xl items-center justify-between px-6 py-4">
                <h1 class="text-base font-semibold tracking-tight">
                    Inventory Management
                </h1>
                <button
                    type="button"
                    class="rounded-lg bg-gray-900 px-4 py-2 text-sm font-medium text-white hover:bg-gray-700"
                    @click="showCreate = true"
                >
                    + Add Product
                </button>
            </div>
        </header>

        <main class="mx-auto max-w-6xl px-6 py-8">
            <ProductList @edit="handleEdit" />
        </main>

        <ProductCreate v-if="showCreate" @close="showCreate = false" />
        <ProductEdit v-if="selectedProduct" :product="selectedProduct" @close="closeEdit" />
    </div>
</template>

<style scoped></style>
