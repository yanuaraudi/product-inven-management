<script setup lang="ts">
import { ref, watch } from 'vue'

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

const props = defineProps<{
    product: Product | null
}>()

const emit = defineEmits<{
    close: []
}>()

const name = ref('')
const description = ref('')
const price = ref(0)
const stock = ref(0)
const category = ref('')
const image = ref<File | null>(null)

const loading = ref(false)
const error = ref<string | null>(null)
const imagePreview = ref<string | null>(null)

const fileInputRef = ref<HTMLInputElement | null>(null)

function handleImageChange(event: Event) {
    const target = event.target as HTMLInputElement
    const file = target.files?.[0] ?? null

    image.value = file

    if (imagePreview.value && imagePreview.value.startsWith('blob:')) {
        URL.revokeObjectURL(imagePreview.value)
    }

    imagePreview.value = file ? URL.createObjectURL(file) : null
}

function triggerFilePicker() {
    fileInputRef.value?.click()
}

async function updateProduct() {
    error.value = null

    if (!props.product) {
        return
    }

    if (!name.value.trim()) {
        error.value = 'Name is required.'
        return
    }

    if (price.value < 0) {
        error.value = 'Price must be greater than or equal to 0.'
        return
    }

    if (stock.value < 0) {
        error.value = 'Stock must be greater than or equal to 0.'
        return
    }

    loading.value = true

    const product = {
        name: name.value,
        description: description.value,
        price: price.value,
        stock: stock.value,
        category: category.value,
    }

    try {
        const response = await fetch(
            `http://localhost:3000/api/products/${props.product?.id}`,
            {
                method: 'PATCH',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(product),
            }
        )

        if (!response.ok) {
            const data = await response.json()
            error.value = data.message || 'Failed to update product.'
            return
        }

        const data = await response.json()

        if (image.value) {
            const formData = new FormData()
            formData.append('image', image.value)

            const imageResponse = await fetch(
                `http://localhost:3000/api/products/${data.id}/image`,
                {
                    method: 'POST',
                    body: formData,
                }
            )

            if (!imageResponse.ok) {
                const imageData = await imageResponse.json()
                error.value = imageData.message || 'Product updated, but image upload failed.'
                return
            }
        }

        location.reload()
    } catch (err) {
        console.error(err)
        error.value = 'Something went wrong.'
    } finally {
        loading.value = false
    }
}

watch(
    () => props.product,
    (product) => {
        if (!product) {
            return
        }

        name.value = product.name
        description.value = product.description ?? ''
        price.value = product.price
        stock.value = product.stock
        category.value = product.category ?? ''

        image.value = null

        imagePreview.value = product.imageUrl
            ? `http://localhost:3000${product.imageUrl}`
            : null
    },
    { immediate: true }
)
</script>

<template>
    <div
        class="fixed inset-0 z-50 flex items-center justify-center bg-black/40 px-4"
        @click.self="emit('close')"
    >
        <div class="w-full max-w-lg rounded-xl border border-gray-200 bg-white shadow-sm">
            <!-- Header -->
            <div class="flex items-center justify-between border-b border-gray-200 px-6 py-4">
                <h2 class="text-base font-semibold">Edit Product</h2>

                <button
                    type="button"
                    class="rounded text-xl leading-none text-gray-400 hover:text-gray-700"
                    @click="emit('close')"
                >
                    &times;
                </button>
            </div>

            <!-- Form -->
            <form class="space-y-4 px-6 py-5" @submit.prevent="updateProduct">
                <!-- Error -->
                <div
                    v-if="error"
                    class="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700"
                >
                    {{ error }}
                </div>

                <!-- Name -->
                <div>
                    <label for="edit-name" class="mb-1 block text-sm font-medium text-gray-700">
                        Name
                    </label>
                    <input
                        id="edit-name"
                        v-model="name"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                    />
                </div>

                <!-- Description -->
                <div>
                    <label for="edit-description" class="mb-1 block text-sm font-medium text-gray-700">
                        Description
                    </label>
                    <textarea
                        id="edit-description"
                        v-model="description"
                        rows="3"
                        class="w-full resize-none rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                    ></textarea>
                </div>

                <!-- Price + Stock -->
                <div class="grid grid-cols-2 gap-4">
                    <div>
                        <label for="edit-price" class="mb-1 block text-sm font-medium text-gray-700">
                            Price
                        </label>
                        <input
                            id="edit-price"
                            v-model.number="price"
                            type="number"
                            min="0"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                        />
                    </div>

                    <div>
                        <label for="edit-stock" class="mb-1 block text-sm font-medium text-gray-700">
                            Stock
                        </label>
                        <input
                            id="edit-stock"
                            v-model.number="stock"
                            type="number"
                            min="0"
                            class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                        />
                    </div>
                </div>

                <!-- Category -->
                <div>
                    <label for="edit-category" class="mb-1 block text-sm font-medium text-gray-700">
                        Category
                    </label>
                    <input
                        id="edit-category"
                        v-model="category"
                        type="text"
                        class="w-full rounded-lg border border-gray-300 px-3 py-2 text-sm outline-none focus:border-gray-500 focus:ring-1 focus:ring-gray-300"
                    />
                </div>

                <!-- Image -->
                <div>
                    <label class="mb-1 block text-sm font-medium text-gray-700">Image</label>

                    <input
                        ref="fileInputRef"
                        type="file"
                        accept="image/jpeg,image/png,image/webp"
                        class="hidden"
                        @change="handleImageChange"
                    />

                    <div class="flex items-center gap-3">
                        <img
                            v-if="imagePreview"
                            :src="imagePreview"
                            alt="Product image"
                            class="h-16 w-16 rounded-lg border border-gray-200 object-cover"
                        />
                        <div
                            v-else
                            class="flex h-16 w-16 items-center justify-center rounded-lg border border-dashed border-gray-300 text-xs text-gray-400"
                        >
                            No image
                        </div>

                        <button
                            type="button"
                            class="rounded-lg border border-gray-300 px-3 py-2 text-sm text-gray-700 hover:bg-gray-50"
                            @click="triggerFilePicker"
                        >
                            {{ imagePreview ? 'Replace Image' : 'Choose Image' }}
                        </button>
                    </div>
                </div>

                <!-- Actions -->
                <div class="flex justify-end gap-3 border-t border-gray-200 pt-4">
                    <button
                        type="button"
                        class="rounded-lg border border-gray-300 px-4 py-2 text-sm text-gray-700 hover:bg-gray-50"
                        :disabled="loading"
                        @click="emit('close')"
                    >
                        Cancel
                    </button>

                    <button
                        type="submit"
                        class="rounded-lg bg-gray-900 px-4 py-2 text-sm text-white hover:bg-gray-700 disabled:cursor-not-allowed disabled:opacity-50"
                        :disabled="loading"
                    >
                        {{ loading ? 'Saving...' : 'Save Changes' }}
                    </button>
                </div>
            </form>
        </div>
    </div>
</template>

<style scoped></style>