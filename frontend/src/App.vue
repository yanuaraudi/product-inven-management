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

function handleEdit(product: Product) {
  selectedProduct.value = product
}

</script>

<template>
  <ProductList @edit="handleEdit" />
  <ProductCreate />
  <ProductEdit v-if="selectedProduct" :product="selectedProduct" />
</template>

<style scoped></style>
