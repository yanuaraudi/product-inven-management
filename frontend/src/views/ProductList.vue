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
const loading = ref(false)
const error = ref<string | null>(null)

const productToDelete = ref<Product | null>(null)

const emit = defineEmits<{
    edit: [product: Product]
}>()

async function fetchProducts() {
    loading.value = true
    error.value = null

    try {
        const response = await fetch('http://localhost:3000/api/products')

        if (!response.ok) {
            throw new Error('Failed to fetch products')
        }

        const data = await response.json()
        products.value = data
    } catch (err) {
        console.error(err)
        error.value = 'Failed to load products.'
    } finally {
        loading.value = false
    }
}

onMounted(() => {
    fetchProducts()
})

function editProduct(product: Product) {
    emit('edit', product)
}

function formatPrice(price: number) {
    return new Intl.NumberFormat('id-ID', {
        style: 'currency',
        currency: 'IDR',
        maximumFractionDigits: 0,
    }).format(price)
}

function confirmDelete(product: Product) {
    productToDelete.value = product
}

function cancelDelete() {
    productToDelete.value = null
}

async function executeDelete() {
    if (!productToDelete.value) {
        return
    }

    const product = productToDelete.value
    productToDelete.value = null

    try {
        const response = await fetch(`http://localhost:3000/api/products/${product.id}`, {
            method: 'DELETE',
        })

        if (!response.ok) {
            throw new Error('Failed to delete product')
        }

        await fetchProducts()
    } catch (err) {
        console.error(err)
        error.value = 'Failed to delete product.'
    }
}
</script>

<template>
    <section>
        <div class="mb-6">
            <h2 class="text-xl font-semibold">Products</h2>
        </div>

        <div
            v-if="error"
            class="mb-4 rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
        >
            {{ error }}
        </div>

        <div v-if="loading" class="py-8 text-center text-sm text-gray-500">
            Loading...
        </div>

        <div v-else class="overflow-hidden rounded-lg border border-gray-200">
            <table class="w-full text-left text-sm">
                <thead class="bg-gray-50">
                    <tr class="border-b border-gray-200">
                        <th class="w-20 px-4 py-3 font-medium text-gray-600">Image</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Name</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Category</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Stock</th>
                        <th class="px-4 py-3 font-medium text-gray-600">Price</th>
                        <th class="w-36 px-4 py-3 font-medium text-gray-600">Actions</th>
                    </tr>
                </thead>

                <tbody>
                    <tr
                        v-for="product in products"
                        :key="product.id"
                        class="border-b border-gray-200 last:border-b-0"
                    >
                        <td class="px-4 py-3">
                            <img
                                v-if="product.imageUrl"
                                :src="`http://localhost:3000${product.imageUrl}`"
                                :alt="product.name"
                                class="h-12 w-12 rounded object-cover"
                            />
                            <div
                                v-else
                                class="flex h-12 w-12 items-center justify-center rounded border border-gray-200 text-xs text-gray-400"
                            >
                                No img
                            </div>
                        </td>
                        <td class="px-4 py-3 font-medium text-gray-900">{{ product.name }}</td>
                        <td class="px-4 py-3 text-gray-600">{{ product.category || '—' }}</td>
                        <td class="px-4 py-3">{{ product.stock }}</td>
                        <td class="px-4 py-3 text-gray-700">{{ formatPrice(product.price) }}</td>
                        <td class="px-4 py-3">
                            <div class="flex gap-2">
                                <button
                                    type="button"
                                    class="rounded-lg border border-blue-200 bg-blue-50 px-3 py-1 text-xs font-medium text-blue-600 hover:bg-blue-100"
                                    @click="editProduct(product)"
                                >
                                    Edit
                                </button>
                                <button
                                    type="button"
                                    class="rounded-lg border border-red-200 bg-red-50 px-3 py-1 text-xs font-medium text-red-600 hover:bg-red-100"
                                    @click="confirmDelete(product)"
                                >
                                    Delete
                                </button>
                            </div>
                        </td>
                    </tr>

                    <tr v-if="products.length === 0">
                        <td colspan="6" class="px-4 py-10 text-center text-sm text-gray-500">
                            No products found.
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </section>

    <!-- Delete confirmation modal -->
    <div
        v-if="productToDelete"
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="cancelDelete"
    >
        <div class="w-full max-w-sm rounded-xl border border-gray-200 bg-white shadow-sm">
            <div class="px-6 py-5">
                <h3 class="text-base font-semibold text-gray-900">Delete Product</h3>
                <p class="mt-2 text-sm text-gray-600">
                    Are you sure you want to delete
                    <span class="font-medium text-gray-900">{{ productToDelete.name }}</span>?
                    This action cannot be undone.
                </p>
            </div>

            <div class="flex justify-end gap-2 border-t border-gray-200 px-6 py-4">
                <button
                    type="button"
                    class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                    @click="cancelDelete"
                >
                    Cancel
                </button>
                <button
                    type="button"
                    class="rounded-lg bg-red-600 px-4 py-2 text-sm text-white hover:bg-red-700"
                    @click="executeDelete"
                >
                    Delete
                </button>
            </div>
        </div>
    </div>
</template>

<style scoped></style>