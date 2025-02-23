import { create } from 'zustand'
import axios from '../lib/axios'
import { toast } from 'react-hot-toast'

export const useProductStore = create((set, get) => ({
    products: [],
    loading: false,

    setProducts: (products) => set({ products }),

    createProduct: async (productData) => {
        set({ loading: true })

        try {
            const res = await axios.post("/products", productData)
            set((prevState) => ({
                products: [...prevState.products, res.data],
                loading: false
            }))
            toast.success("Product created successfully")
        } catch (error) {
            toast.error(error.response.data.error)
            set({ loading: false })
        }
    },

    fetchAllProducts: async () => {
        set({ loading: true })

        try {
            const res = await axios.get("/products")
            set({ products: res.data.products, loading: false })
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false })
            toast.error(error.response.data.error || "Failed to fetch products")
        }
    },

    fetchProductsByCategory: async (category) => {
        set({ loading: true })

        try {
            const res = await axios.get(`/products/category/${category}`)
            set({ products: res.data.products, loading: false })
        } catch (error) {
            set({ error: "Failed to fetch products", loading: false })
            toast.error(error.response.data.error || "Failed to fetch products")
        }
    },

    deleteProduct: async (productId) => {
        set({ loading: true })

        try {
            await axios.delete(`/products/${productId}`)
            set((prevState) => ({
                products: prevState.products.filter(product => product._id !== productId),
                loading: false
            }))
            toast.success("Product deleted successfully")
        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.error || "Failed to delete product")
        }
    },

    toggleFeaturedProduct: async (productId) => {
        set({ loading: true })

        try {
            const res = await axios.patch(`/products/${productId}`)
            set((prevState) => ({
                products: prevState.products.map((product) => product._id === productId ? { ...product, isFeatured: res.data.isFeatured } : product),
                loading: false
            }))
        } catch (error) {
            set({ loading: false })
            toast.error(error.response.data.error || "Failed to update product")
        }
    },

    fetchFeaturedProducts: async (params) => {
        set({ loading: true })

        try {
            const res = await axios.get("/products/featured")
            set({ products: res.data })
        } catch (error) {
            set({ error: "Failed to fetch products" })
            console.log(`Error in fetching products: ${error}`)
        } finally {
            set({ loading: false })
        }
    }
}))